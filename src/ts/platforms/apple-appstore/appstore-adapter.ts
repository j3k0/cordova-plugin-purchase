/// <reference path="../../types.ts" />
/// <reference path="../../product.ts" />
/// <reference path="../../receipt.ts" />
/// <reference path="../../offer.ts" />
/// <reference path="../../transaction.ts" />

namespace CdvPurchase {

    /**
     * Apple AppStore adapter using StoreKit version 1
     */
    export namespace AppleAppStore {

        export type PaymentMonitorStatus = 'cancelled' | 'failed' | 'purchased' | 'deferred';
        export type PaymentMonitor = (status: PaymentMonitorStatus) => void;

        /** Additional data passed with an order on AppStore */
        export interface AdditionalData {

            /** Information about the payment discount */
            discount?: PaymentDiscount;

            /**
             * Quantity of consumable products to purchase.
             *
             * Must be between 1 and 10 (Apple's limit). Defaults to 1.
             * Only meaningful for consumable products.
             */
            quantity?: number;
        }

        /**
         * Determine which discount the user is eligible to.
         *
         * @param applicationReceipt An apple appstore receipt
         * @param requests List of discount offers to evaluate eligibility for
         * @param callback Get the response, a boolean for each request (matched by index).
         */
        export type DiscountEligibilityDeterminer = ((applicationReceipt: ApplicationReceipt, requests: DiscountEligibilityRequest[], callback: (response: boolean[]) => void) => void) & {
            cacheReceipt?: (receipt: VerifiedReceipt) => void;
        };

        /**
         * Optional options for the AppleAppStore adapter
         */
        export interface AdapterOptions {
            /**
             * Determine which discount the user is eligible to.
             *
             * @param applicationReceipt An apple appstore receipt
             * @param requests List of discount offers to evaluate eligibility for
             * @param callback Get the response, a boolean for each request (matched by index).
             */
            discountEligibilityDeterminer?: DiscountEligibilityDeterminer;

            /**
             * Set to false if you don't need to verify the application receipt
             *
             * Verifying the application receipt at startup is useful in different cases:
             *
             *  - Retrieve information about the user's first app download.
             *  - Make it harder to side-load your application.
             *  - Determine eligibility to introductory prices.
             *
             * The default is "true", use "false" is an optimization.
             */
            needAppReceipt?: boolean;

            /**
             * Auto-finish pending transaction
             *
             * Use this if the transaction queue is filled with unwanted transactions (in development).
             * It's safe to keep this option to "true" when using a receipt validation server and you only
             * sell subscriptions.
             */
            autoFinish?: boolean;
        }

        /**
         * In the first stages of a purchase, the transaction doesn't have an identifier.
         *
         * In the meantime, we generate a virtual transaction identifier.
         */
        function virtualTransactionId(productId: string) {
            return `virtual.${productId}`;
        }

        /**
         * Adapter for Apple AppStore using StoreKit version 1
         */
        export class Adapter implements CdvPurchase.Adapter {

            id = Platform.APPLE_APPSTORE;
            name = 'AppStore';
            ready = false;
            _canMakePayments = false;

            /**
             * Set to true to force a full refresh of the receipt when preparing a receipt validation call.
             *
             * This is typically done when placing an order and restoring purchases.
             */
            forceReceiptReload = false;

            /** List of products loaded from AppStore */
            _products: SKProduct[] = [];
            get products(): Product[] { return this._products; }

            /** Find a given product from ID */
            getProduct(id: string): SKProduct | undefined { return this._products.find(p => p.id === id); }

            /** The application receipt, contains all transactions */
            _receipt?: SKApplicationReceipt;

            /** The pseudo receipt stores purchases in progress */
            pseudoReceipt: Receipt;

            get receipts(): Receipt[] {
                if (!this.isSupported) return [];
                return ((this._receipt ? [this._receipt] : []) as Receipt[])
                    .concat(this.pseudoReceipt ? this.pseudoReceipt : []);
            }

            private validProducts: { [id: string]: Bridge.ValidProduct & IRegisterProduct; } = {};
            addValidProducts(registerProducts: IRegisterProduct[], validProducts: Bridge.ValidProduct[]) {
                validProducts.forEach(vp => {
                    const rp = registerProducts.find(p => p.id === vp.id);
                    if (!rp) return;
                    this.validProducts[vp.id] = {
                        ...vp,
                        ...rp,
                    }
                });
            }

            bridge: Bridge.BridgeInterface;

            /** True when the StoreKit 2 extension is active */
            readonly useSK2: boolean;
            context: CdvPurchase.Internal.AdapterContext;
            log: Logger;

            /** Component that determine eligibility to a given discount offer */
            discountEligibilityDeterminer?: DiscountEligibilityDeterminer;

            /** True when we need to validate the application receipt */
            needAppReceipt: boolean;

            /** True to auto-finish all transactions */
            autoFinish: boolean;

            /** Callback called when the restore process is completed */
            onRestoreCompleted?: (code: IError | undefined) => void;

            /** Debounced version of _receiptUpdated */
            receiptsUpdated: Utils.Debouncer;

            constructor(context: CdvPurchase.Internal.AdapterContext, options: AdapterOptions) {
                this.context = context;
                this.log = context.log.child('AppleAppStore');

                const useCapacitor = CapacitorBridge.CapacitorNativeBridge.isAvailable();
                this.useSK2 = useCapacitor || SK2Bridge.SK2NativeBridge.isAvailable();
                if (useCapacitor) {
                    this.log.info('Capacitor plugin detected, using Capacitor SK2 bridge');
                    this.bridge = new CapacitorBridge.CapacitorNativeBridge();
                } else if (SK2Bridge.SK2NativeBridge.isAvailable()) {
                    this.log.info('StoreKit 2 extension detected, using SK2 bridge');
                    this.bridge = new SK2Bridge.SK2NativeBridge();
                } else {
                    this.bridge = new Bridge.Bridge();
                }

                this.discountEligibilityDeterminer = options.discountEligibilityDeterminer;
                this.needAppReceipt = this.useSK2 ? false : (options.needAppReceipt ?? true);
                this.autoFinish = options.autoFinish ?? false;
                this.pseudoReceipt = new Receipt(Platform.APPLE_APPSTORE, this.context.apiDecorators);
                this.receiptsUpdated = Utils.createDebouncer(() => {
                    this._receiptsUpdated();
                }, 300);
            }

            /** Returns true on iOS, the only platform supported by this adapter */
            get isSupported(): boolean {
                return Utils.platformId() === 'ios';
            }

            private upsertTransactionInProgress(productId: string, state: TransactionState): Promise<SKTransaction> {
                const transactionId = virtualTransactionId(productId);
                return new Promise(resolve => {
                    const existing = this.pseudoReceipt.transactions.find(t => t.transactionId === transactionId) as SKTransaction | undefined;
                    if (existing) {
                        existing.state = state;
                        existing.refresh(productId);
                        resolve(existing);
                    }
                    else {
                        const tr = new SKTransaction(Platform.APPLE_APPSTORE, this.pseudoReceipt, this.context.apiDecorators);
                        tr.state = state;
                        tr.transactionId = transactionId;
                        tr.refresh(productId);
                        this.pseudoReceipt.transactions.push(tr);
                        resolve(tr);
                    }
                });
            }

            /** Remove a transaction from the pseudo receipt */
            private removeTransactionInProgress(productId: string) {
                const transactionId = virtualTransactionId(productId);
                this.pseudoReceipt.transactions = this.pseudoReceipt.transactions.filter(t => t.transactionId !== transactionId);
            }

            /** Insert or update a transaction in the pseudo receipt, based on data collected from the native side */
            private async upsertTransaction(productId: string, transactionId: string, state: TransactionState): Promise<SKTransaction> {
                return new Promise(resolve => {
                    this.initializeAppReceipt(() => {
                        if (!this._receipt) {
                            // this should not happen
                            this.log.warn('Failed to load the application receipt, cannot proceed with handling the purchase');
                            return;
                        }
                        const existing = this._receipt?.transactions.find(t => t.transactionId === transactionId) as SKTransaction | undefined;
                        if (existing) {
                            existing.state = state;
                            existing.refresh(productId);
                            resolve(existing);
                        }
                        else {
                            const tr = new SKTransaction(Platform.APPLE_APPSTORE, this._receipt, this.context.apiDecorators);
                            tr.state = state;
                            tr.transactionId = transactionId;
                            tr.refresh(productId);
                            this._receipt.transactions.push(tr);
                            resolve(tr);
                        }
                    });
                });
            }

            private removeTransaction(transactionId: string) {
                if (this._receipt) {
                    this._receipt.transactions = this._receipt.transactions.filter(t => t.transactionId !== transactionId);
                }
            }

            /** Notify the store that the receipts have been updated */
            private _receiptsUpdated() {
                if (this._receipt) {
                    this.log.debug("receipt updated and ready.");
                    this.context.listener.receiptsUpdated(Platform.APPLE_APPSTORE, [this._receipt, this.pseudoReceipt]);
                    this.context.listener.receiptsReady(Platform.APPLE_APPSTORE);
                }
                else {
                    this.log.debug("receipt updated.");
                    this.context.listener.receiptsUpdated(Platform.APPLE_APPSTORE, [this.pseudoReceipt]);
                }
            }

            private _paymentMonitor: PaymentMonitor = () => {};
            private setPaymentMonitor(fn: PaymentMonitor) {
                this._paymentMonitor = fn;
            }
            private callPaymentMonitor(status: PaymentMonitorStatus, code?: ErrorCode, message?: string) {
                this._paymentMonitor(status);
            }

            initialize(): Promise<IError | undefined> {
                return new Promise(resolve => {
                    this.log.info('bridge.init');
                    const bridgeLogger = this.log.child('Bridge');
                    this.bridge.init({
                        autoFinish: this.autoFinish,
                        debug: this.context.verbosity === LogLevel.DEBUG,
                        log: msg => bridgeLogger.debug(msg),

                        error: (code: ErrorCode, message: string, options?: { productId: string, quantity?: number }) => {
                            this.log.error('ERROR: ' + code + ' - ' + message);
                            if (code === ErrorCode.PAYMENT_CANCELLED) {
                                // When the user closes the payment sheet, this generates a
                                // PAYMENT_CANCELLED error that isn't an error anymore since version 13
                                // of the plugin.
                                this.callPaymentMonitor('cancelled', ErrorCode.PAYMENT_CANCELLED, message);
                                return;
                            }
                            else {
                                this.context.error(appStoreError(code, message,options?.productId || null));
                            }
                        },

                        ready: () => {
                            this.log.info('ready');
                        },

                        purchased: async (transactionIdentifier: string, productId: string,
                            originalTransactionIdentifier?: string, transactionDate?: string,
                            discountId?: string, expirationDate?: string, jwsRepresentation?: string,
                            quantity?: number) => {
                            this.log.info('purchase: id:' + transactionIdentifier + ' product:' + productId +
                                ' originalTransaction:' + originalTransactionIdentifier +
                                ' - date:' + transactionDate + ' - discount:' + discountId +
                                (jwsRepresentation ? ' - jws:present' : '') +
                                (quantity && quantity > 1 ? ' - quantity:' + quantity : ''));
                            // we can add the transaction to the receipt here
                            const transaction = await this.upsertTransaction(productId, transactionIdentifier, TransactionState.APPROVED);
                            transaction.refresh(productId, originalTransactionIdentifier, transactionDate,
                                discountId, expirationDate, jwsRepresentation, quantity);
                            this.removeTransactionInProgress(productId);
                            this.receiptsUpdated.call();
                            this.callPaymentMonitor('purchased');
                        },

                        purchaseEnqueued: async (productId: string, quantity: number) => {
                            this.log.info('purchaseEnqueued: ' + productId + ' - ' + quantity);
                            // let create a temporary transaction
                            await this.upsertTransactionInProgress(productId, TransactionState.INITIATED);
                            this.context.listener.receiptsUpdated(Platform.APPLE_APPSTORE, [this.pseudoReceipt]);
                        },

                        purchaseFailed: (productId: string, code: ErrorCode, message: string) => {
                            this.log.info('purchaseFailed: ' + productId + ' - ' + code + ' - ' + message);
                            this.removeTransactionInProgress(productId);
                            this.context.listener.receiptsUpdated(Platform.APPLE_APPSTORE, [this.pseudoReceipt]);
                            this.callPaymentMonitor('failed', code, message);
                        },

                        purchasing: async (productId: string) => {
                            // purchase has been requested, but there's no transactionIdentifier yet.
                            // we can create a dummy transaction
                            this.log.info('purchasing: ' + productId);
                            await this.upsertTransactionInProgress(productId, TransactionState.INITIATED);
                            // In order to prevent a receipt validation attempt here
                            // (which might happen if it hasn't been possible earlier)
                            // We should add "purchasing" transactions into a second, pseudo receipt.
                            this.context.listener.receiptsUpdated(Platform.APPLE_APPSTORE, [this.pseudoReceipt]);
                        },

                        deferred: async (productId: string) => {
                            this.log.info('deferred: ' + productId);
                            await this.upsertTransactionInProgress(productId, TransactionState.PENDING);
                            this.context.listener.receiptsUpdated(Platform.APPLE_APPSTORE, [this.pseudoReceipt]);
                            this.callPaymentMonitor('deferred');
                        },

                        finished: async (transactionIdentifier: string, productId: string) => {
                            // An issue occurs here if finished is triggered the "debounced" receiptUpdated call has
                            // been performed for the APPROVED event. Because the transaction will go straight to
                            // FINISHED, skipping validation.
                            //
                            // This was observed specifically when "autoFinish" is set.
                            //
                            // In order to get rid of that bug, we want to wait for processing of the previous
                            // receiptUpdated call.
                            //
                            // A side effect will be that when there are many "finished" transactions, how could we process
                            // them all in batch?
                            await this.receiptsUpdated.wait();
                            this.log.info('finish: ' + transactionIdentifier + ' - ' + productId);
                            this.removeTransactionInProgress(productId);
                            await this.upsertTransaction(productId, transactionIdentifier, TransactionState.FINISHED);
                            this.receiptsUpdated.call();
                        },

                        restored: async (transactionIdentifier: string, productId: string,
                            originalTransactionIdentifier?: string, transactionDate?: string,
                            discountId?: string, expirationDate?: string, jwsRepresentation?: string,
                            quantity?: number) => {
                            this.log.info('restore: ' + transactionIdentifier + ' - ' + productId);
                            const transaction = await this.upsertTransaction(productId, transactionIdentifier, TransactionState.APPROVED);
                            transaction.refresh(productId, originalTransactionIdentifier, transactionDate,
                                discountId, expirationDate, jwsRepresentation, quantity);
                            this.receiptsUpdated.call();
                        },

                        receiptsRefreshed: (receipt: ApplicationReceipt) => {
                            this.log.info('receiptsRefreshed');
                            if (this._receipt) this._receipt.refresh(receipt, this.needAppReceipt, this.context.apiDecorators);
                        },

                        restoreFailed: (errorCode: ErrorCode) => {
                            this.log.info('restoreFailed: ' + errorCode);
                            if (this.onRestoreCompleted) {
                                this.onRestoreCompleted(appStoreError(errorCode, 'Restore purchases failed', null));
                                this.onRestoreCompleted = undefined;
                            }
                        },

                        restoreCompleted: () => {
                            this.log.info('restoreCompleted');
                            if (this.onRestoreCompleted) {
                                this.onRestoreCompleted(undefined);
                                this.onRestoreCompleted = undefined;
                            }
                        },
                    }, async () => {
                        this.log.info('bridge.init done');
                        await this.canMakePayments();
                        resolve(undefined);
                    }, (code: ErrorCode, message: string) => {
                        this.log.info('bridge.init failed: ' + code + ' - ' + message);
                        resolve(appStoreError(code, message, null));
                    });
                });
            }

            supportsParallelLoading = true;

            loadReceipts(): Promise<Receipt[]> {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        this.initializeAppReceipt(() => {
                            this.receiptsUpdated.call();
                            if (this._receipt) {
                                resolve([this._receipt, this.pseudoReceipt]);
                            }
                            else {
                                resolve([this.pseudoReceipt]);
                            }
                        });
                    }, 300);
                });
            }

            private async canMakePayments(): Promise<boolean> {
                return new Promise(resolve => {
                    this.bridge.canMakePayments(() => {
                        this._canMakePayments = true;
                        resolve(true);
                    }, (message) => {
                        this.log.warn(`canMakePayments: ${message}`);
                        this._canMakePayments = false;
                        resolve(false);
                    });
                });
            }

            /** True iff the appStoreReceipt is already being initialized */
            private _appStoreReceiptLoading = false;

            /** List of functions waiting for the appStoreReceipt to be initialized */
            private _appStoreReceiptCallbacks: Callback<IError | undefined>[] = [];

            /**
             * Create the application receipt
             */
            private async initializeAppReceipt(callback: Callback<IError | undefined>) {
                if (this._receipt) {
                    this.log.debug('initializeAppReceipt() => already initialized.');
                    return callback(undefined);
                }
                this._appStoreReceiptCallbacks.push(callback);
                if (this._appStoreReceiptLoading) {
                    this.log.debug('initializeAppReceipt() => already loading.');
                    return;
                }
                this._appStoreReceiptLoading = true;
                const nativeData = await this.loadAppStoreReceipt();
                const callCallbacks = (arg: IError | undefined) => {
                    const callbacks = this._appStoreReceiptCallbacks;
                    this._appStoreReceiptCallbacks = [];
                    callbacks.forEach(cb => {
                        cb(arg);
                    });
                }
                if (!nativeData?.appStoreReceipt) {
                    if (this.useSK2) {
                        // SK2 doesn't use monolithic receipts — create receipt with empty data
                        this.log.info('SK2 mode: no appStoreReceipt (expected), creating empty receipt');
                        this._receipt = new SKApplicationReceipt(
                            nativeData || { appStoreReceipt: '', bundleIdentifier: '',
                                bundleShortVersion: '', bundleNumericVersion: 0, bundleSignature: '' },
                            this.needAppReceipt, this.context.apiDecorators);
                        this._appStoreReceiptLoading = false;
                        callCallbacks(undefined);
                        return;
                    }
                    this.log.warn('no appStoreReceipt');
                    this._appStoreReceiptLoading = false;
                    callCallbacks(appStoreError(ErrorCode.REFRESH, 'No appStoreReceipt', null));
                    return;
                }
                this._receipt = new SKApplicationReceipt(nativeData, this.needAppReceipt, this.context.apiDecorators);
                callCallbacks(undefined);
            }

            private prepareReceipt(nativeData: ApplicationReceipt | undefined) {
                if (nativeData?.appStoreReceipt) {
                    if (!this._receipt) {
                        this._receipt = new SKApplicationReceipt(nativeData, this.needAppReceipt, this.context.apiDecorators);
                    }
                    else {
                        this._receipt.refresh(nativeData, this.needAppReceipt, this.context.apiDecorators);
                    }
                }
            }

            /** Promisified loading of the AppStore receipt */
            private async loadAppStoreReceipt(): Promise<undefined | ApplicationReceipt> {
                let resolved = false;
                return new Promise<undefined | ApplicationReceipt>(resolve => {
                    if (this.bridge.appStoreReceipt?.appStoreReceipt && !this.forceReceiptReload) {
                        this.log.debug('using cached appstore receipt');
                        return resolve(this.bridge.appStoreReceipt);
                    }
                    this.log.debug('loading appstore receipt...');
                    this.forceReceiptReload = false;
                    this.bridge.loadReceipts(receipt => {
                        this.log.debug('appstore receipt loaded');
                        if (!resolved) resolve(receipt);
                        resolved = true;
                    }, (code, message) => {
                        // this should not happen: native side never triggers an error
                        this.log.warn('Failed to load appStoreReceipt: ' + code + ' - ' + message);
                        if (!resolved) resolve(undefined);
                        resolved = true;
                    });
                    // If the receipt cannot be loaded, timeout after 5 seconds
                    setTimeout(function() {
                        if (!resolved) resolve(undefined);
                        resolved = true;
                    }, 5000);
                }).then(result => {
                    this.context.listener.receiptsReady(Platform.APPLE_APPSTORE);
                    return result;
                }).catch(reason => {
                    this.context.listener.receiptsReady(Platform.APPLE_APPSTORE);
                    return reason;
                });
            }

            private async loadEligibility(validProducts: Bridge.ValidProduct[]): Promise<Internal.DiscountEligibilities> {
                this.log.debug('load eligibility: ' + JSON.stringify(validProducts));
                if (!this.discountEligibilityDeterminer) {
                    this.log.debug('No discount eligibility determiner, skipping...');
                    return new Internal.DiscountEligibilities([], []);
                }

                const eligibilityRequests: DiscountEligibilityRequest[] = [];
                validProducts.forEach(valid => {
                    valid.discounts?.forEach(discount => {
                        eligibilityRequests.push({
                            productId: valid.id,
                            discountId: discount.id,
                            discountType: discount.type,
                        });
                    });
                    if ((valid.discounts?.length ?? 0) === 0 && valid.introPrice) {
                        // sometime apple returns the discounts in the deprecated "introductory" info
                        // we create a special "discount" with the id "intro" to check for eligibility.
                        eligibilityRequests.push({
                            productId: valid.id,
                            discountId: 'intro',
                            discountType: 'Introductory',
                        });
                    }
                });

                if (eligibilityRequests.length > 0) {
                    const applicationReceipt = await this.loadAppStoreReceipt();
                    if (!applicationReceipt || !applicationReceipt.appStoreReceipt) {
                        this.log.debug('no receipt, assuming introductory price are available.');
                        return new Internal.DiscountEligibilities(eligibilityRequests, eligibilityRequests.map(r => r.discountType === "Introductory"));
                    }
                    else {
                        this.log.debug('calling discount eligibility determiner.');
                        const response = await this.callDiscountEligibilityDeterminer(applicationReceipt, eligibilityRequests);
                        this.log.debug('response: ' + JSON.stringify(response));
                        return new Internal.DiscountEligibilities(eligibilityRequests, response);
                    }
                }
                else {
                    return new Internal.DiscountEligibilities([], []);
                }
            }

            private callDiscountEligibilityDeterminer(applicationReceipt: ApplicationReceipt, eligibilityRequests: DiscountEligibilityRequest[]): Promise<boolean[]> {
                return new Promise(resolve => {
                    if (!this.discountEligibilityDeterminer) return resolve([]);
                    this.discountEligibilityDeterminer(applicationReceipt, eligibilityRequests, resolve);
                });
            }

            loadProducts(products: IRegisterProduct[]): Promise<(Product | IError)[]> {
                return new Promise(resolve => {
                    this.log.info('bridge.load');
                    this.bridge.load(
                        products.map(p => p.id),
                        async (validProducts, invalidProducts) => {
                            this.log.info('bridge.loaded: ' + JSON.stringify({ validProducts, invalidProducts }));
                            this.addValidProducts(products, validProducts);
                            const eligibilities = await this.loadEligibility(validProducts);
                            this.log.info('eligibilities ready: ' + JSON.stringify(eligibilities));
                            // for any valid product that includes a discount, check the eligibility.
                            const ret = products.map(p => {
                                if (invalidProducts.indexOf(p.id) >= 0) {
                                    this.log.debug(`${p.id} is invalid`);
                                    return appStoreError(ErrorCode.INVALID_PRODUCT_ID, 'Product not found in AppStore. #400', p.id);
                                }
                                else {
                                    const valid = validProducts.find(v => v.id === p.id);
                                    this.log.debug(`${p.id} is valid: ${JSON.stringify(valid)}`);
                                    if (!valid)
                                        return appStoreError(ErrorCode.INVALID_PRODUCT_ID, 'Product not found in AppStore. #404', p.id);
                                    let product = this.getProduct(p.id);
                                    if (product) {
                                        this.log.debug('refreshing existing product');
                                        product?.refresh(valid, this.context.apiDecorators, eligibilities);
                                    }
                                    else {
                                        this.log.debug('registering new product');
                                        product = new SKProduct(valid, p, this.context.apiDecorators, eligibilities);
                                        this._products.push(product);
                                    }
                                    return product;
                                }
                            });
                            this.log.debug(`Products loaded: ${JSON.stringify(ret)}`);
                            resolve(ret);
                        },
                        (code: ErrorCode, message: string) => {
                            return products.map(p => appStoreError(code, message, null));
                        });
                });
            }

            async order(offer: Offer, additionalData: CdvPurchase.AdditionalData): Promise<undefined | IError> {
                let resolved = false;
                return new Promise(resolve => {
                    const callResolve = (result: undefined | IError) => {
                        if (resolved) return;
                        this.setPaymentMonitor(() => { });
                        resolved = true;
                        resolve(result);
                    }
                    this.log.info('order');
                    const quantity = additionalData?.appStore?.quantity ?? 1;
                    if (quantity < 1 || quantity > 10 || !Number.isInteger(quantity)) {
                        return callResolve(appStoreError(ErrorCode.PURCHASE, 'Invalid quantity: must be an integer between 1 and 10', offer.productId));
                    }
                    const discountId = offer.id !== DEFAULT_OFFER_ID ? offer.id : undefined;
                    const discount = additionalData?.appStore?.discount;
                    if (discountId && !discount) {
                        return callResolve(appStoreError(ErrorCode.MISSING_OFFER_PARAMS, 'Missing additionalData.appStore.discount when ordering a discount offer', offer.productId));
                    }
                    if (discountId && (discount?.id !== discountId)) {
                        return callResolve(appStoreError(ErrorCode.INVALID_OFFER_IDENTIFIER, 'Offer identifier does not match additionalData.appStore.discount.id', offer.productId));
                    }
                    this.setPaymentMonitor((status: PaymentMonitorStatus, code?: ErrorCode, message?: string) => {
                        this.log.info('order.paymentMonitor => ' + status + ' ' + (code ?? '') + ' ' + (message ?? ''));
                        if (resolved) return;
                        switch (status) {
                            case 'cancelled':
                                callResolve(appStoreError(code ?? ErrorCode.PAYMENT_CANCELLED, message ?? 'The user cancelled the order.', offer.productId));
                                break;
                            case 'failed':
                                // note, "failed" might be triggered before "cancelled",
                                // so we'll give some time to catch the "cancelled" event.
                                setTimeout(() => {
                                    callResolve(appStoreError(code ?? ErrorCode.PURCHASE, message ?? 'Purchase failed', offer.productId));
                                }, 500);
                                break;
                            case 'purchased':
                            case 'deferred':
                                callResolve(undefined);
                                break;
                        }
                    });
                    const success = () => {
                        this.log.info('order.success');
                        // We'll monitor the payment before resolving.
                    }
                    const error = () => {
                        this.log.info('order.error');
                        callResolve(appStoreError(ErrorCode.PURCHASE, 'Failed to place order', offer.productId));
                    }
                    // When we switch AppStore user, the cached receipt isn't from the new user.
                    // so after a purchase, we want to make sure we're using the receipt from the logged in user.
                    this.forceReceiptReload = true;
                    this.bridge.purchase(offer.productId, quantity, this.context.getApplicationUsername(), discount, success, error);
                });
            }

            finish(transaction: Transaction): Promise<undefined | IError> {
                return new Promise(resolve => {
                    this.log.info('finish(' + transaction.transactionId + ')');
                    if (transaction.transactionId === APPLICATION_VIRTUAL_TRANSACTION_ID || transaction.transactionId === virtualTransactionId(transaction.products[0].id)) {
                        // this is a virtual transaction, nothing to do.
                        transaction.state = TransactionState.FINISHED;
                        this.receiptsUpdated.call();
                        return resolve(undefined);
                    }

                    const success = () => {
                        transaction.state = TransactionState.FINISHED;
                        this.receiptsUpdated.call();
                        resolve(undefined);
                    }
                    const error = (msg: string) => {
                        if (msg?.includes('[#CdvPurchase:100]')) {
                            // already finished
                            success();
                        }
                        else {
                            resolve(appStoreError(ErrorCode.FINISH, 'Failed to finish transaction', transaction.products[0]?.id ?? null));
                        }
                    }
                    this.bridge.finish(transaction.transactionId, success, error);
                });
            }

            refreshReceipt(): Promise<undefined | IError | ApplicationReceipt> {
                return new Promise(resolve => {
                    const success = (receipt: ApplicationReceipt): void => {
                        // at that point, the receipt should have been refreshed.
                        resolve(receipt);
                    }
                    const error = (code: ErrorCode, message: string): void => {
                        resolve(appStoreError(code, message, null));
                    }
                    this.bridge.refreshReceipts(success, error);
                });
            }

            async receiptValidationBody(receipt: Receipt): Promise<Validator.Request.Body | undefined> {
                if (receipt.platform !== Platform.APPLE_APPSTORE) return;
                if (receipt !== this._receipt) return; // do not validate the pseudo receipt
                const skReceipt = receipt as SKApplicationReceipt;
                let applicationReceipt = skReceipt.nativeData;
                if (this.forceReceiptReload) {
                    const nativeData = await this.loadAppStoreReceipt();
                    this.forceReceiptReload = false;
                    if (nativeData) {
                        applicationReceipt = nativeData;
                        this.prepareReceipt(nativeData);
                    }
                }
                // SK2 doesn't use monolithic receipts — skip the appStoreReceipt check
                if (!this.useSK2 && !skReceipt.nativeData.appStoreReceipt) {
                    this.log.info('Cannot prepare the receipt validation body, because appStoreReceipt is missing. Refreshing...');
                    const result = await this.refreshReceipt();
                    if (!result || 'isError' in result) {
                        this.log.warn('Failed to refresh receipt, cannot run receipt validation.');
                        if (result) this.log.error(result);
                        return;
                    }
                    this.log.info('Receipt refreshed.');
                    applicationReceipt = result;
                }
                const transaction = skReceipt.transactions.slice(-1)[0] as (SKTransaction | undefined);
                const products = Utils.objectValues(this.validProducts).map(vp =>
                    new SKProduct(vp, vp, this.context.apiDecorators, { isEligible: () => true }));

                // SK2 uses a completely different transaction type ('apple-sk2') with JWS
                // SK1 uses 'ios-appstore' with the monolithic appStoreReceipt
                if (this.useSK2) {
                    if (!transaction?.jwsRepresentation) {
                        this.log.warn('SK2 mode but no JWS on transaction, skipping validation');
                        return undefined;
                    }
                    return {
                        id: applicationReceipt.bundleIdentifier,
                        type: ProductType.APPLICATION,
                        products,
                        transaction: {
                            type: 'apple-sk2' as const,
                            id: transaction?.products?.[0]?.id,
                            jwsRepresentation: transaction.jwsRepresentation,
                        },
                    };
                }

                const txBody = {
                    type: 'ios-appstore' as const,
                    id: transaction?.transactionId,
                    appStoreReceipt: applicationReceipt.appStoreReceipt,
                };

                return {
                    id: applicationReceipt.bundleIdentifier,
                    type: ProductType.APPLICATION,
                    products,
                    transaction: txBody,
                }
            }

            async handleReceiptValidationResponse(_receipt: Receipt, response: Validator.Response.Payload): Promise<void> {
                // we can add the purchaseDate to the application transaction
                let localReceiptUpdated = false;
                if (response.ok) {
                    const vTransaction = response.data?.transaction;
                    const isApple = vTransaction?.type === 'ios-appstore' || vTransaction?.type === 'apple-sk2';
                    if (isApple && vTransaction && 'original_application_version' in vTransaction) {
                        this._receipt?.transactions.forEach(t => {
                            if (t.transactionId === APPLICATION_VIRTUAL_TRANSACTION_ID) {
                                if (vTransaction.original_purchase_date_ms) {
                                    t.purchaseDate = new Date(parseInt(vTransaction.original_purchase_date_ms));
                                    localReceiptUpdated = true;
                                }
                            }
                        });
                    }
                }
                if (localReceiptUpdated) this.context.listener.receiptsUpdated(Platform.APPLE_APPSTORE, [_receipt]);
            }

            async requestPayment(payment: PaymentRequest, additionalData?: CdvPurchase.AdditionalData): Promise<IError | Transaction | undefined> {
                return appStoreError(ErrorCode.UNKNOWN, 'requestPayment not supported', null);
            }

            async manageSubscriptions(): Promise<IError | undefined> {
                this.bridge.manageSubscriptions();
                return;
            }

            async manageBilling(): Promise<IError | undefined> {
                this.bridge.manageBilling();
                return;
            }

            checkSupport(functionality: PlatformFunctionality): boolean {
                if (functionality === 'order') return this._canMakePayments;
                const supported: PlatformFunctionality[] = [
                    'order', 'manageBilling', 'manageSubscriptions', 'getStorefront'
                ];
                return supported.indexOf(functionality) >= 0;
            }

            restorePurchases(): Promise<IError | undefined> {
                return new Promise<IError | undefined>(resolve => {
                    this.onRestoreCompleted = (error) => {
                        this.onRestoreCompleted = undefined;
                        this.bridge.refreshReceipts(obj => {
                            resolve(error)
                        }, (code, message) => {
                            resolve(error || appStoreError(code, message, null));
                        });
                    }
                    this.forceReceiptReload = true;
                    this.bridge.restore();
                });
            }

            presentCodeRedemptionSheet(): Promise<void> {
                return new Promise(resolve => {
                    this.bridge.presentCodeRedemptionSheet(resolve);
                });
            }

            async getStorefront(): Promise<string | undefined> {
                if (!this.bridge.getStorefront) return undefined;
                const countryCode = await this.bridge.getStorefront();
                if (!countryCode) return undefined;
                // SKStorefront.countryCode typically returns ISO 3166-1 alpha-3 (e.g., "USA").
                // The fallback `|| countryCode` handles cases where Apple returns alpha-2 directly
                // or uses a non-standard code (e.g., territories not in ISO 3166-1).
                return isoAlpha3ToAlpha2(countryCode) || countryCode;
            }
        }

        /**
         * Convert ISO 3166-1 alpha-3 country code to alpha-2.
         *
         * Apple's SKStorefront.countryCode returns alpha-3 codes (e.g., "USA").
         * This function converts them to the more common alpha-2 format (e.g., "US")
         * for consistency with Google Play which already returns alpha-2.
         */
        const ISO_ALPHA3_TO_ALPHA2: { [key: string]: string } = {
            AFG: 'AF', ALB: 'AL', DZA: 'DZ', ASM: 'AS', AND: 'AD',
            AGO: 'AO', AIA: 'AI', ATA: 'AQ', ATG: 'AG', ARG: 'AR',
            ARM: 'AM', ABW: 'AW', AUS: 'AU', AUT: 'AT', AZE: 'AZ',
            BHS: 'BS', BHR: 'BH', BGD: 'BD', BRB: 'BB', BLR: 'BY',
            BEL: 'BE', BLZ: 'BZ', BEN: 'BJ', BMU: 'BM', BTN: 'BT',
            BOL: 'BO', BES: 'BQ', BIH: 'BA', BWA: 'BW', BVT: 'BV',
            BRA: 'BR', IOT: 'IO', BRN: 'BN', BGR: 'BG', BFA: 'BF',
            BDI: 'BI', CPV: 'CV', KHM: 'KH', CMR: 'CM', CAN: 'CA',
            CYM: 'KY', CAF: 'CF', TCD: 'TD', CHL: 'CL', CHN: 'CN',
            CXR: 'CX', CCK: 'CC', COL: 'CO', COM: 'KM', COG: 'CG',
            COD: 'CD', COK: 'CK', CRI: 'CR', CIV: 'CI', HRV: 'HR',
            CUB: 'CU', CUW: 'CW', CYP: 'CY', CZE: 'CZ', DNK: 'DK',
            DJI: 'DJ', DMA: 'DM', DOM: 'DO', ECU: 'EC', EGY: 'EG',
            SLV: 'SV', GNQ: 'GQ', ERI: 'ER', EST: 'EE', SWZ: 'SZ',
            ETH: 'ET', FLK: 'FK', FRO: 'FO', FJI: 'FJ', FIN: 'FI',
            FRA: 'FR', GUF: 'GF', PYF: 'PF', ATF: 'TF', GAB: 'GA',
            GMB: 'GM', GEO: 'GE', DEU: 'DE', GHA: 'GH', GIB: 'GI',
            GRC: 'GR', GRL: 'GL', GRD: 'GD', GLP: 'GP', GUM: 'GU',
            GTM: 'GT', GGY: 'GG', GIN: 'GN', GNB: 'GW', GUY: 'GY',
            HTI: 'HT', HMD: 'HM', VAT: 'VA', HND: 'HN', HKG: 'HK',
            HUN: 'HU', ISL: 'IS', IND: 'IN', IDN: 'ID', IRN: 'IR',
            IRQ: 'IQ', IRL: 'IE', IMN: 'IM', ISR: 'IL', ITA: 'IT',
            JAM: 'JM', JPN: 'JP', JEY: 'JE', JOR: 'JO', KAZ: 'KZ',
            KEN: 'KE', KIR: 'KI', PRK: 'KP', KOR: 'KR', KWT: 'KW',
            KGZ: 'KG', LAO: 'LA', LVA: 'LV', LBN: 'LB', LSO: 'LS',
            LBR: 'LR', LBY: 'LY', LIE: 'LI', LTU: 'LT', LUX: 'LU',
            MAC: 'MO', MDG: 'MG', MWI: 'MW', MYS: 'MY', MDV: 'MV',
            MLI: 'ML', MLT: 'MT', MHL: 'MH', MTQ: 'MQ', MRT: 'MR',
            MUS: 'MU', MYT: 'YT', MEX: 'MX', FSM: 'FM', MDA: 'MD',
            MCO: 'MC', MNG: 'MN', MNE: 'ME', MSR: 'MS', MAR: 'MA',
            MOZ: 'MZ', MMR: 'MM', NAM: 'NA', NRU: 'NR', NPL: 'NP',
            NLD: 'NL', NCL: 'NC', NZL: 'NZ', NIC: 'NI', NER: 'NE',
            NGA: 'NG', NIU: 'NU', NFK: 'NF', MKD: 'MK', MNP: 'MP',
            NOR: 'NO', OMN: 'OM', PAK: 'PK', PLW: 'PW', PSE: 'PS',
            PAN: 'PA', PNG: 'PG', PRY: 'PY', PER: 'PE', PHL: 'PH',
            PCN: 'PN', POL: 'PL', PRT: 'PT', PRI: 'PR', QAT: 'QA',
            REU: 'RE', ROU: 'RO', RUS: 'RU', RWA: 'RW', BLM: 'BL',
            SHN: 'SH', KNA: 'KN', LCA: 'LC', MAF: 'MF', SPM: 'PM',
            VCT: 'VC', WSM: 'WS', SMR: 'SM', STP: 'ST', SAU: 'SA',
            SEN: 'SN', SRB: 'RS', SYC: 'SC', SLE: 'SL', SGP: 'SG',
            SXM: 'SX', SVK: 'SK', SVN: 'SI', SLB: 'SB', SOM: 'SO',
            ZAF: 'ZA', SGS: 'GS', SSD: 'SS', ESP: 'ES', LKA: 'LK',
            SDN: 'SD', SUR: 'SR', SJM: 'SJ', SWE: 'SE', CHE: 'CH',
            SYR: 'SY', TWN: 'TW', TJK: 'TJ', TZA: 'TZ', THA: 'TH',
            TLS: 'TL', TGO: 'TG', TKL: 'TK', TON: 'TO', TTO: 'TT',
            TUN: 'TN', TUR: 'TR', TKM: 'TM', TCA: 'TC', TUV: 'TV',
            UGA: 'UG', UKR: 'UA', ARE: 'AE', GBR: 'GB', USA: 'US',
            UMI: 'UM', URY: 'UY', UZB: 'UZ', VUT: 'VU', VEN: 'VE',
            VNM: 'VN', VGB: 'VG', VIR: 'VI', WLF: 'WF', ESH: 'EH',
            YEM: 'YE', ZMB: 'ZM', ZWE: 'ZW',
        };

        function isoAlpha3ToAlpha2(alpha3: string): string | undefined {
            return ISO_ALPHA3_TO_ALPHA2[alpha3.toUpperCase()];
        }

        function appStoreError(code: ErrorCode, message: string, productId: string | null) {
            return storeError(code, message, Platform.APPLE_APPSTORE, productId);
        }
    }
}
