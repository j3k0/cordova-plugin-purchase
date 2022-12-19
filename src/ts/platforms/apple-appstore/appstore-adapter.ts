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


        /**
         * Determine which discount the user is eligible to.
         *
         * @param applicationReceipt An apple appstore receipt
         * @param requests List of discount offers to evaluate eligibility for
         * @param callback Get the response, a boolean for each request (matched by index).
         */
        export type DiscountEligibilityDeterminer = (applicationReceipt: ApplicationReceipt, requests: DiscountEligibilityRequest[], callback: (response: boolean[]) => void) => void;

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

            /** List of products loaded from AppStore */
            _products: SKProduct[] = [];
            get products(): Product[] { return this._products; }

            /** Find a given product from ID */
            getProduct(id: string): SKProduct | undefined { return this._products.find(p => p.id === id); }

            /** The application receipt, contains all transactions */
            _receipt?: SKApplicationReceipt;
            get receipts(): Receipt[] { return this._receipt ? [this._receipt] : []; }

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

            bridge: Bridge.Bridge;
            context: CdvPurchase.Internal.AdapterContext;
            log: Logger;

            /** Component that determine eligibility to a given discount offer */
            discountEligibilityDeterminer?: DiscountEligibilityDeterminer;

            /** True when we need to validate the application receipt */
            needAppReceipt: boolean;

            constructor(context: CdvPurchase.Internal.AdapterContext, options: AdapterOptions) {
                this.context = context;
                this.bridge = new Bridge.Bridge();
                this.log = context.log.child('AppleAppStore');
                this.discountEligibilityDeterminer = options.discountEligibilityDeterminer;
                this.needAppReceipt = options.needAppReceipt ?? true;
            }

            /** Returns true on Android, the only platform supported by this adapter */
            get isSupported(): boolean {
                return window.cordova.platformId === 'ios';
            }

            private upsertTransactionInProgress(productId: string, state: TransactionState): Promise<SKTransaction> {
                return this.upsertTransaction(productId, virtualTransactionId(productId), state);
            }

            private removeTransactionInProgress(productId: string) {
                this.removeTransaction(virtualTransactionId(productId));
            }

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

            private receiptUpdated() {
                if (this._receipt) {
                    this.context.listener.receiptsUpdated(Platform.APPLE_APPSTORE, [this._receipt]);
                }
            }

            initialize(): Promise<IError | undefined> {
                return new Promise(resolve => {
                    this.log.info('bridge.init');
                    const bridgeLogger = this.log.child('Bridge');
                    this.bridge.init({
                        autoFinish: false,
                        debug: this.context.verbosity === LogLevel.DEBUG,
                        log: msg => bridgeLogger.debug(msg),

                        error: (code: ErrorCode, message: String, options?: { productId: string, quantity?: number }) => {
                            this.log.error('ERROR: ' + code + ' - ' + message);
                            CdvPurchase.store.triggerError(CdvPurchase.storeError(code, message));
                        },

                        ready: () => {
                            this.log.info('ready');
                        },

                        purchased: async (transactionIdentifier: string, productId: string, originalTransactionIdentifier?: string, transactionDate?: string, discountId?: string) => {
                            this.log.info('purchase: id:' + transactionIdentifier + ' product:' + productId + ' originalTransaction:' + originalTransactionIdentifier + ' - date:' + transactionDate + ' - discount:' + discountId);
                            // we can add the transaction to the receipt here
                            const transaction = await this.upsertTransaction(productId, transactionIdentifier, TransactionState.APPROVED);
                            transaction.refresh(productId, originalTransactionIdentifier, transactionDate, discountId);
                            this.removeTransactionInProgress(productId);
                            this.receiptUpdated();
                        },

                        purchaseEnqueued: async (productId: string, quantity: number) => {
                            this.log.info('purchaseEnqueued: ' + productId + ' - ' + quantity);
                            // let create a temporary transaction
                            await this.upsertTransactionInProgress(productId, TransactionState.INITIATED);
                            this.receiptUpdated();
                        },

                        purchaseFailed: (productId: string, code: ErrorCode, message: string) => {
                            this.log.info('purchaseFailed: ' + productId + ' - ' + code + ' - ' + message);
                            this.removeTransactionInProgress(productId);
                            this.receiptUpdated();
                        },

                        purchasing: async (productId: string) => {
                            // purchase has been requested, but there's no transactionIdentifier yet.
                            // we can create a dummy transaction
                            this.log.info('purchasing: ' + productId);
                            await this.upsertTransactionInProgress(productId, TransactionState.INITIATED);
                            this.receiptUpdated();
                        },

                        deferred: async (productId: string) => {
                            this.log.info('deferred: ' + productId);
                            await this.upsertTransactionInProgress(productId, TransactionState.PENDING);
                            this.receiptUpdated();
                        },

                        finished: async (transactionIdentifier: string, productId: string) => {
                            this.log.info('finish: ' + transactionIdentifier + ' - ' + productId);
                            this.removeTransactionInProgress(productId);
                            await this.upsertTransaction(productId, transactionIdentifier, TransactionState.FINISHED);
                            this.receiptUpdated();
                        },

                        restored: async (transactionIdentifier: string, productId: string) => {
                            this.log.info('restore: ' + transactionIdentifier + ' - ' + productId);
                            await this.upsertTransaction(productId, transactionIdentifier, TransactionState.APPROVED);
                            this.receiptUpdated();
                        },

                        receiptsRefreshed: (receipt: ApplicationReceipt) => {
                            this.log.info('receiptsRefreshed');
                            if (this._receipt) this._receipt.refresh(receipt, this.needAppReceipt, this.context.apiDecorators);
                        },

                        restoreFailed: (errorCode: ErrorCode) => {
                            this.log.info('restoreFailed: ' + errorCode);
                        },

                        restoreCompleted: () => {
                            this.log.info('restoreCompleted');
                        },
                    }, () => {
                        this.log.info('bridge.init done');
                        setTimeout(() => this.initializeAppReceipt(() => this.receiptUpdated()), 300);
                        resolve(undefined);
                    }, (code: ErrorCode, message: string) => {
                        this.log.info('bridge.init failed: ' + code + ' - ' + message);
                        resolve(storeError(code, message));
                    });
                });
            }

            /**
             * Create the application receipt
             */
            private async initializeAppReceipt(callback: Callback<IError | undefined>) {
                if (this._receipt) return callback(undefined); // already loaded
                this.log.debug('emitAppReceipt()');
                const nativeData = await this.loadAppStoreReceipt();
                if (!nativeData?.appStoreReceipt) {
                    this.log.warn('no appStoreReceipt');
                }
                this._receipt = new SKApplicationReceipt(nativeData, this.needAppReceipt, this.context.apiDecorators);
                callback(undefined);
            }

            /** Promisified loading of the AppStore receipt */
            private async loadAppStoreReceipt(): Promise<ApplicationReceipt> {
                return new Promise(resolve => {
                    this.log.debug('using cached appstore receipt');
                    if (this.bridge.appStoreReceipt) return resolve(this.bridge.appStoreReceipt);
                    this.log.debug('loading appstore receipt...');
                    this.bridge.loadReceipts(receipt => {
                        this.log.debug('appstore receipt loaded');
                        resolve(receipt);
                    }, (code, message) => {
                        this.log.warn('Failed to load appStoreReceipt: ' + code + ' - ' + message);
                        // this should not happen: native side never triggers an error
                        // resolve(null);
                    });
                });
            }

            private async loadEligibility(validProducts: Bridge.ValidProduct[]): Promise<Internal.DiscountEligibilities> {
                if (!this.discountEligibilityDeterminer) {
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

            load(products: IRegisterProduct[]): Promise<(Product | IError)[]> {
                return new Promise(resolve => {
                    this.log.info('bridge.load');
                    this.bridge.load(
                        products.map(p => p.id),
                        async (validProducts, invalidProducts) => {
                            this.log.info('bridge.loaded: ' + JSON.stringify({ validProducts, invalidProducts }));
                            this.addValidProducts(products, validProducts);
                            const eligibilities = await this.loadEligibility(validProducts);
                            this.log.info('eligibilities ready.');
                            // for any valid product that includes a discount, check the eligibility.
                            const ret = products.map(p => {
                                if (invalidProducts.indexOf(p.id) >= 0) {
                                    this.log.debug(`${p.id} is invalid`);
                                    return storeError(ErrorCode.INVALID_PRODUCT_ID, 'Product not found in AppStore. #400');
                                }
                                else {
                                    const valid = validProducts.find(v => v.id === p.id);
                                    this.log.debug(`${p.id} is valid: ${JSON.stringify(valid)}`);
                                    if (!valid)
                                        return storeError(ErrorCode.INVALID_PRODUCT_ID, 'Product not found in AppStore. #404');
                                    let product = this.getProduct(p.id);
                                    if (product) {
                                        this.log.debug('refreshing existing product');
                                        product?.refresh(valid, this.context.apiDecorators, eligibilities);
                                    }
                                    else {
                                        this.log.debug('registering existing product');
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
                            return products.map(p => storeError(code, message));
                        });
                });
            }

            async order(offer: Offer): Promise<undefined | IError> {
                return new Promise(resolve => {
                    this.log.info('order');
                    const discountId = offer.id !== DEFAULT_OFFER_ID ? offer.id : undefined;
                    const success = () => {
                        this.log.info('order.success');
                        resolve(undefined);
                    }
                    const error = () => {
                        this.log.info('order.error');
                        resolve(storeError(ErrorCode.PURCHASE, 'Failed to place order'));
                    }
                    this.bridge.purchase(offer.productId, 1, this.context.getApplicationUsername(), discountId, success, error);
                });
            }

            finish(transaction: Transaction): Promise<undefined | IError> {
                return new Promise(resolve => {
                    this.log.info('finish(' + transaction.transactionId + ')');
                    if (transaction.transactionId === APPLICATION_VIRTUAL_TRANSACTION_ID || transaction.transactionId === virtualTransactionId(transaction.products[0].id)) {
                        // this is a virtual transaction, nothing to do.
                        transaction.state = TransactionState.FINISHED;
                        this.context.listener.receiptsUpdated(Platform.APPLE_APPSTORE, [transaction.parentReceipt]);
                        return resolve(undefined);
                    }

                    const success = () => {
                        transaction.state = TransactionState.FINISHED;
                        this.context.listener.receiptsUpdated(Platform.APPLE_APPSTORE, [transaction.parentReceipt]);
                        resolve(undefined);
                    }
                    const error = () => {
                        resolve(storeError(ErrorCode.FINISH, 'Failed to finish transaction'));
                    }
                    this.bridge.finish(transaction.transactionId, success, error);
                });
            }

            receiptValidationBody(receipt: Receipt): Validator.Request.Body | undefined {
                if (receipt.platform !== Platform.APPLE_APPSTORE) return;
                const skReceipt = receipt as SKApplicationReceipt;
                const transaction = skReceipt.transactions.slice(-1)[0] as (SKTransaction | undefined);
                return {
                    id: skReceipt.nativeData.bundleIdentifier,
                    type: ProductType.APPLICATION,
                    // send all products and offers so validator get pricing information
                    products: Object.values(this.validProducts).map(vp => new SKProduct(vp, vp, this.context.apiDecorators, { isEligible: () => true })),
                    transaction: {
                        type: 'ios-appstore',
                        id: transaction?.transactionId,
                        appStoreReceipt: skReceipt.nativeData.appStoreReceipt,
                    }
                }
            }

            async handleReceiptValidationResponse(_receipt: Receipt, response: Validator.Response.Payload): Promise<void> {
                // we can add the purchaseDate to the application transaction
                let localReceiptUpdated = false;
                if (response.ok) {
                    const vTransaction = response.data.transaction;
                    if (vTransaction.type === 'ios-appstore' && 'original_application_version' in vTransaction) {
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
                return storeError(ErrorCode.UNKNOWN, 'requestPayment not supported');
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
                const supported: PlatformFunctionality[] = [
                    'order', 'manageBilling', 'manageSubscriptions'
                ];
                return supported.indexOf(functionality) >= 0;
            }

            restorePurchases(): Promise<void> {
                return new Promise(resolve => {
                    this.bridge.restore();
                    this.bridge.refreshReceipts(obj => {
                        resolve();
                    }, (code, message) => {
                        resolve();
                    });
                });
            }

            presentCodeRedemptionSheet(): Promise<void> {
                return new Promise(resolve => {
                    this.bridge.presentCodeRedemptionSheet(resolve);
                });
            }
        }
    }
}
