namespace CdvPurchase {
    export namespace AppleAppStore {
        export namespace CapacitorBridge {

            let log = function log(msg: string) {
                console.log("StoreKit[capacitor]: " + msg);
            }

            /**
             * Capacitor implementation of the Apple AppStore bridge.
             * Uses Capacitor.Plugins.PurchasePlugin with StoreKit 2 (iOS 15+).
             * Follows the same pattern as SK2NativeBridge but communicates
             * via Capacitor's plugin API instead of cordova.exec().
             */
            const noop = (..._args: any[]) => {};

            /** Extended callbacks with SK2 fields (same as SK2BridgeCallbacks) */
            export interface CapacitorBridgeCallbacks extends Bridge.BridgeCallbacks {
                purchased: (transactionIdentifier: string, productId: string,
                    originalTransactionIdentifier?: string, transactionDate?: string,
                    discountId?: string, expirationDate?: string,
                    jwsRepresentation?: string) => void;
                restored: (transactionIdentifier: string, productId: string,
                    originalTransactionIdentifier?: string, transactionDate?: string,
                    discountId?: string, expirationDate?: string,
                    jwsRepresentation?: string) => void;
            }

            export class CapacitorNativeBridge implements Bridge.BridgeInterface {

                appStoreReceipt: ApplicationReceipt | null = null;
                transactionsForProduct: { [productId: string]: string[] } = {};
                readonly isSK2 = true;

                private options: CapacitorBridgeCallbacks;
                private pendingTransactionUpdates: {
                    state: string;
                    errorCode: number | undefined;
                    errorText: string | undefined;
                    transactionIdentifier: string;
                    productId: string;
                    transactionReceipt: string | undefined;
                    originalTransactionIdentifier: string | undefined;
                    transactionDate: string | undefined;
                    discountId: string | undefined;
                    expirationDate: string | undefined;
                    jwsRepresentation: string | undefined;
                }[] = [];
                private initialized = false;
                private needRestoreNotification = false;

                constructor() {
                    // Initialize all callbacks to noop (matching SK2NativeBridge pattern)
                    this.options = {
                        error: noop, ready: noop,
                        purchased: noop, purchaseEnqueued: noop,
                        purchasing: noop, purchaseFailed: noop,
                        deferred: noop, finished: noop,
                        restored: noop, receiptsRefreshed: noop,
                        restoreCompleted: noop, restoreFailed: noop,
                    } as CapacitorBridgeCallbacks;
                }

                /** Check if the Capacitor purchase plugin is available */
                static isAvailable(): boolean {
                    const marker = window.CdvPurchaseCapacitor;
                    return !!(marker && marker.installed);
                }

                private get plugin(): any {
                    return window.Capacitor?.Plugins?.PurchasePlugin;
                }

                init(options: Partial<Bridge.BridgeOptions>,
                     success: () => void,
                     error: (code: ErrorCode, message: string) => void): void {

                    if (options.log) log = options.log;
                    // Merge provided options over defaults (noop callbacks)
                    this.options = { ...this.options, ...options } as CapacitorBridgeCallbacks;

                    const plugin = this.plugin;
                    if (!plugin) {
                        error(ErrorCode.SETUP, 'Capacitor PurchasePlugin not available');
                        return;
                    }

                    // Listen for transaction updates from native
                    plugin.addListener('transactionUpdated', (data: any) => {
                        this.transactionUpdated(
                            data.state,
                            data.errorCode,
                            data.errorText,
                            data.transactionIdentifier,
                            data.productId,
                            data.transactionReceipt,
                            data.originalTransactionIdentifier,
                            data.transactionDate,
                            data.discountId,
                            data.expirationDate,
                            data.jwsRepresentation,
                        );
                    });

                    plugin.addListener('restoreCompleted', () => {
                        this.restoreCompletedTransactionsFinished();
                    });

                    plugin.addListener('restoreFailed', (data: any) => {
                        this.restoreCompletedTransactionsFailed(data.errorCode);
                    });

                    // Initialize the native plugin
                    const initOpts: Record<string, unknown> = {};
                    if (options.autoFinish !== undefined) initOpts.autoFinish = options.autoFinish;
                    if (options.debug !== undefined) initOpts.debug = options.debug;

                    plugin.init(initOpts)
                        .then(() => {
                            this.initialized = true;
                            // Flush pending transaction updates
                            const pending = this.pendingTransactionUpdates;
                            this.pendingTransactionUpdates = [];
                            for (const args of pending) {
                                this.transactionUpdated(
                                    args.state, args.errorCode, args.errorText,
                                    args.transactionIdentifier, args.productId,
                                    args.transactionReceipt, args.originalTransactionIdentifier,
                                    args.transactionDate, args.discountId,
                                    args.expirationDate, args.jwsRepresentation);
                            }
                            if (this.options.ready) this.options.ready();
                            success();
                        })
                        .catch((err: any) => {
                            error(ErrorCode.SETUP, err?.message || 'init failed');
                        });
                }

                load(productIds: string[],
                     success: (validProducts: Bridge.ValidProduct[], invalidProductIds: string[]) => void,
                     error: (code: ErrorCode, message: string) => void): void {
                    this.plugin.load({ productIds })
                        .then((result: any) => success(result.validProducts, result.invalidProductIds))
                        .catch((err: any) => error(ErrorCode.LOAD, err?.message || 'load failed'));
                }

                purchase(productId: string, quantity: number,
                         applicationUsername: string | undefined,
                         discount: PaymentDiscount | undefined,
                         success: () => void, error: () => void): void {
                    this.plugin.purchase({ productId, quantity, applicationUsername, discount })
                        .then(() => success())
                        .catch(() => error());
                }

                finish(transactionId: string,
                       success: () => void,
                       error: (msg: string) => void): void {
                    this.plugin.finish({ transactionId })
                        .then(() => success())
                        .catch((err: any) => error(err?.message || 'finish failed'));
                }

                canMakePayments(success: () => void,
                                error: (message: string) => void): void {
                    this.plugin.canMakePayments()
                        .then((result: any) => {
                            if (result.canMakePayments) success();
                            else error('cannot make payments');
                        })
                        .catch((err: any) => error(err?.message || 'canMakePayments failed'));
                }

                restore(callback?: Callback<any>): void {
                    this.needRestoreNotification = true;
                    this.plugin.restore()
                        .then(() => { if (callback) callback(true); })
                        .catch(() => { if (callback) callback(false); });
                }

                manageSubscriptions(callback?: Callback<any>): void {
                    this.plugin.manageSubscriptions()
                        .then(() => { if (callback) callback(true); })
                        .catch(() => { if (callback) callback(false); });
                }

                manageBilling(callback?: Callback<any>): void {
                    this.plugin.manageBilling()
                        .then(() => { if (callback) callback(true); })
                        .catch(() => { if (callback) callback(false); });
                }

                presentCodeRedemptionSheet(callback?: Callback<any>): void {
                    this.plugin.presentCodeRedemptionSheet()
                        .then(() => { if (callback) callback(true); })
                        .catch(() => { if (callback) callback(false); });
                }

                refreshReceipts(successCb: (receipt: ApplicationReceipt) => void,
                                errorCb: (code: ErrorCode, message: string) => void): void {
                    this.plugin.refreshReceipts()
                        .then((result: any) => {
                            this.appStoreReceipt = result.receipt;
                            if (this.options.receiptsRefreshed) {
                                this.options.receiptsRefreshed(result.receipt);
                            }
                            successCb(result.receipt);
                        })
                        .catch((err: any) => errorCb(ErrorCode.REFRESH_RECEIPTS, err?.message || 'refreshReceipts failed'));
                }

                loadReceipts(callback: (receipt: ApplicationReceipt) => void,
                             errorCb: (code: ErrorCode, message: string) => void): void {
                    this.plugin.loadReceipts()
                        .then((result: any) => {
                            this.appStoreReceipt = result.receipt;
                            callback(result.receipt);
                        })
                        .catch((err: any) => errorCb(ErrorCode.LOAD, err?.message || 'loadReceipts failed'));
                }

                // Called when the native side sends a transaction update
                private transactionUpdated(
                    state: string,
                    errorCode: number | undefined,
                    errorText: string | undefined,
                    transactionIdentifier: string,
                    productId: string,
                    transactionReceipt: string | undefined,
                    originalTransactionIdentifier: string | undefined,
                    transactionDate: string | undefined,
                    discountId: string | undefined,
                    expirationDate?: string,
                    jwsRepresentation?: string,
                ): void {
                    if (!this.initialized) {
                        this.pendingTransactionUpdates.push({
                            state, errorCode, errorText, transactionIdentifier,
                            productId, transactionReceipt, originalTransactionIdentifier,
                            transactionDate, discountId, expirationDate, jwsRepresentation,
                        });
                        return;
                    }

                    // Track transaction for product
                    if (!this.transactionsForProduct[productId]) {
                        this.transactionsForProduct[productId] = [];
                    }
                    if (transactionIdentifier &&
                        this.transactionsForProduct[productId].indexOf(transactionIdentifier) < 0) {
                        this.transactionsForProduct[productId].push(transactionIdentifier);
                    }

                    switch (state) {
                        case 'PaymentTransactionStatePurchasing':
                            if (this.options.purchasing) {
                                this.options.purchasing(productId);
                            }
                            break;
                        case 'PaymentTransactionStatePurchased':
                            if (this.options.purchased) {
                                this.options.purchased(
                                    transactionIdentifier, productId,
                                    originalTransactionIdentifier,
                                    transactionDate, discountId,
                                    expirationDate, jwsRepresentation);
                            }
                            break;
                        case 'PaymentTransactionStateFailed':
                            if (this.options.purchaseFailed) {
                                this.options.purchaseFailed(
                                    productId, errorCode || 0, errorText || 'Unknown error');
                            }
                            if (this.options.error) {
                                this.options.error(errorCode || 0,
                                    errorText || 'Unknown error', { productId });
                            }
                            break;
                        case 'PaymentTransactionStateRestored':
                            if (this.options.restored) {
                                this.options.restored(
                                    transactionIdentifier, productId,
                                    originalTransactionIdentifier,
                                    transactionDate, discountId,
                                    expirationDate, jwsRepresentation);
                            }
                            break;
                        case 'PaymentTransactionStateDeferred':
                            if (this.options.deferred) {
                                this.options.deferred(productId);
                            }
                            break;
                        case 'PaymentTransactionStateFinished':
                            if (this.options.finished) {
                                this.options.finished(transactionIdentifier, productId);
                            }
                            break;
                    }
                }

                private restoreCompletedTransactionsFinished(): void {
                    if (!this.needRestoreNotification) return;
                    this.needRestoreNotification = false;
                    if (this.options.restoreCompleted) {
                        this.options.restoreCompleted();
                    }
                }

                private restoreCompletedTransactionsFailed(errorCode: number): void {
                    if (this.options.restoreFailed) {
                        this.options.restoreFailed(errorCode);
                    }
                }

                /** Retrieve the storefront country code from StoreKit */
                getStorefront(): Promise<string | undefined> {
                    return new Promise((resolve) => {
                        const plugin = this.plugin;
                        if (!plugin) {
                            log('getStorefront failed: plugin not available');
                            resolve(undefined);
                            return;
                        }
                        plugin.getStorefront()
                            .then((result: { countryCode: string }) => resolve(result.countryCode || undefined))
                            .catch((err: any) => {
                                log('getStorefront failed: ' + (err?.message || err));
                                resolve(undefined);
                            });
                    });
                }
            }
        }
    }
}
