namespace CdvPurchase {
    export namespace AppleAppStore {

        export namespace SK2Bridge {

            const noop = (args?: any) => {};
            let log: (message: string) => void = noop;

            function exec(methodName: string, options: any[],
                          success?: (msg?: any) => void,
                          error?: (err: string) => void) {
                window.cordova.exec(success, error, "StoreKit2Plugin", methodName, options);
            }

            function protectCall<T extends (...args: any) => any>(
                this: any, callback: T, context: string, ...args: Parameters<T>) {
                if (!callback) return;
                try {
                    callback.apply(this, args);
                } catch (err) {
                    log('exception in ' + context + ': "' + err + '"');
                }
            }

            /** Extended callbacks with SK2 fields */
            export interface SK2BridgeCallbacks extends Bridge.BridgeCallbacks {
                purchased: (transactionIdentifier: string, productId: string,
                    originalTransactionIdentifier?: string, transactionDate?: string,
                    discountId?: string, expirationDate?: string,
                    jwsRepresentation?: string, quantity?: number) => void;
                restored: (transactionIdentifier: string, productId: string,
                    originalTransactionIdentifier?: string, transactionDate?: string,
                    discountId?: string, expirationDate?: string,
                    jwsRepresentation?: string, quantity?: number) => void;
            }

            export class SK2NativeBridge implements Bridge.BridgeInterface {

                options: SK2BridgeCallbacks;
                transactionsForProduct: { [productId: string]: string[] } = {};
                private initialized = false;
                appStoreReceipt?: AppleAppStore.ApplicationReceipt | null;
                private registeredProducts: string[] = [];
                private needRestoreNotification = false;
                private pendingUpdates: {
                    state: Bridge.TransactionState;
                    errorCode: ErrorCode | undefined;
                    errorText: string | undefined;
                    transactionIdentifier: string;
                    productId: string;
                    transactionReceipt: never;
                    originalTransactionIdentifier: string | undefined;
                    transactionDate: string | undefined;
                    discountId: string | undefined;
                    expirationDate: string | undefined;
                    jwsRepresentation: string | undefined;
                    quantity: number | undefined;
                }[] = [];

                /** True when this bridge is active (SK2 extension installed + iOS 15+) */
                readonly isSK2 = true;

                constructor() {
                    (window as any).storekit2 = this;

                    this.options = {
                        error: noop,
                        ready: noop,
                        purchased: noop,
                        purchaseEnqueued: noop,
                        purchasing: noop,
                        purchaseFailed: noop,
                        deferred: noop,
                        finished: noop,
                        restored: noop,
                        receiptsRefreshed: noop,
                        restoreFailed: noop,
                        restoreCompleted: noop,
                    };
                }

                /** Check if the SK2 extension plugin is installed */
                static isAvailable(): boolean {
                    // Check marker from the extension plugin
                    const marker = (window as any).CdvPurchaseStoreKit2;
                    return !!(marker && marker.installed);
                }

                init(options: Partial<Bridge.BridgeOptions>,
                     success: () => void,
                     error: (code: ErrorCode, message: string) => void) {
                    this.options = {
                        error: options.error || noop,
                        ready: options.ready || noop,
                        purchased: options.purchased || noop,
                        purchaseEnqueued: options.purchaseEnqueued || noop,
                        purchasing: options.purchasing || noop,
                        purchaseFailed: options.purchaseFailed || noop,
                        deferred: options.deferred || noop,
                        finished: options.finished || noop,
                        restored: options.restored || noop,
                        receiptsRefreshed: options.receiptsRefreshed || noop,
                        restoreFailed: options.restoreFailed || noop,
                        restoreCompleted: options.restoreCompleted || noop,
                    };

                    if (options.debug) {
                        exec('debug', [], noop, noop);
                        log = options.log || function(msg) {
                            console.log("[CdvPurchase.AppleAppStore.SK2Bridge] " + msg);
                        };
                    }

                    if (options.autoFinish) {
                        exec('autoFinish', [], noop, noop);
                    }

                    const setupOk = () => {
                        log('setup ok');
                        protectCall(this.options.ready, 'options.ready');
                        protectCall(success, 'init.success');
                        this.initialized = true;
                        setTimeout(() => this.processPendingTransactions(), 50);
                    };

                    const setupFailed = (err: string) => {
                        log('setup failed');
                        protectCall(error, 'init.error', ErrorCode.SETUP, 'Setup failed: ' + err);
                    };

                    exec('setup', [], setupOk, setupFailed);
                }

                processPendingTransactions() {
                    log('processing pending transactions');
                    exec('processPendingTransactions', [], () => {
                        this.finalizeTransactionUpdates();
                    }, undefined);
                }

                purchase(productId: string, quantity: number,
                         applicationUsername: string | undefined,
                         discount: PaymentDiscount | undefined,
                         success: () => void, error: () => void) {
                    quantity = (quantity | 0) || 1;
                    const options = this.options;

                    if (this.registeredProducts.indexOf(productId) < 0) {
                        const msg = 'Purchasing ' + productId + ' failed. Ensure the product was loaded first with load()!';
                        log(msg);
                        if (typeof options.error === 'function') {
                            protectCall(options.error, 'options.error', ErrorCode.PURCHASE,
                                'Trying to purchase an unknown product.', { productId, quantity });
                        }
                        return;
                    }

                    const purchaseOk = () => {
                        log('Purchase enqueued ' + productId);
                        if (typeof options.purchaseEnqueued === 'function') {
                            protectCall(options.purchaseEnqueued, 'options.purchaseEnqueued',
                                productId, quantity);
                        }
                        protectCall(success, 'purchase.success');
                    };
                    const purchaseFailed = () => {
                        const errMsg = 'Purchase failed: ' + productId;
                        log(errMsg);
                        if (typeof options.error === 'function') {
                            protectCall(options.error, 'options.error', ErrorCode.PURCHASE,
                                errMsg, { productId, quantity });
                        }
                        protectCall(error, 'purchase.error');
                    };
                    exec('purchase', [productId, quantity, applicationUsername, discount || {}],
                        purchaseOk, purchaseFailed);
                }

                canMakePayments(success: () => void, error: (message: string) => void) {
                    return exec("canMakePayments", [], success, error);
                }

                restore(callback?: Callback<any>) {
                    this.needRestoreNotification = true;
                    exec('restoreCompletedTransactions', [], callback, callback);
                }

                manageSubscriptions(callback?: Callback<any>) {
                    exec('manageSubscriptions', [], callback, callback);
                }

                manageBilling(callback?: Callback<any>) {
                    exec('manageBilling', [], callback, callback);
                }

                presentCodeRedemptionSheet(callback?: Callback<any>) {
                    exec('presentCodeRedemptionSheet', [], callback, callback);
                }

                load(productIds: string[],
                     success: (validProducts: Bridge.ValidProduct[],
                               invalidProductIds: string[]) => void,
                     error: (code: ErrorCode, message: string) => void) {
                    const options = this.options;
                    if (!productIds || !productIds.length) {
                        protectCall(success, 'load.success', [], []);
                        return;
                    }

                    log('load ' + JSON.stringify(productIds));

                    const loadOk = (array: [Bridge.ValidProduct[], string[]]) => {
                        const valid = array[0];
                        const invalid = array[1];
                        log('load ok: { valid:' + JSON.stringify(valid) + ' invalid:' + JSON.stringify(invalid) + ' }');
                        protectCall(success, 'load.success', valid, invalid);
                    };
                    const loadFailed = (errMessage: string) => {
                        log('load failed: ' + errMessage);
                        protectCall(options.error, 'options.error', ErrorCode.LOAD, 'Load failed: ' + errMessage);
                        protectCall(error, 'load.error', ErrorCode.LOAD, 'Load failed: ' + errMessage);
                    };

                    this.registeredProducts = this.registeredProducts.concat(productIds);
                    exec('load', [productIds], loadOk, loadFailed);
                }

                finish(transactionId: string, success: () => void, error: (msg: string) => void) {
                    exec('finishTransaction', [transactionId], success, error);
                }

                finalizeTransactionUpdates() {
                    for (let i = 0; i < this.pendingUpdates.length; ++i) {
                        const args = this.pendingUpdates[i];
                        this.transactionUpdated(args.state, args.errorCode, args.errorText,
                            args.transactionIdentifier, args.productId, args.transactionReceipt,
                            args.originalTransactionIdentifier, args.transactionDate,
                            args.discountId, args.expirationDate, args.jwsRepresentation,
                            args.quantity);
                    }
                    this.pendingUpdates = [];
                }

                lastTransactionUpdated() {
                    // no more pending transactions
                }

                /** Called from native. Same as SK1 but with extra SK2 fields. */
                transactionUpdated(
                    state: Bridge.TransactionState,
                    errorCode: ErrorCode | undefined,
                    errorText: string | undefined,
                    transactionIdentifier: string,
                    productId: string,
                    transactionReceipt: never,
                    originalTransactionIdentifier: string | undefined,
                    transactionDate: string | undefined,
                    discountId: string | undefined,
                    expirationDate?: string | undefined,
                    jwsRepresentation?: string | undefined,
                    quantity?: number | undefined
                ) {
                    if (!this.initialized) {
                        this.pendingUpdates.push({
                            state, errorCode, errorText, transactionIdentifier,
                            productId, transactionReceipt, originalTransactionIdentifier,
                            transactionDate, discountId, expirationDate, jwsRepresentation,
                            quantity
                        });
                        return;
                    }
                    log("transaction updated:" + transactionIdentifier +
                        " state:" + state + " product:" + productId);

                    if (productId && transactionIdentifier) {
                        if (this.transactionsForProduct[productId]) {
                            this.transactionsForProduct[productId].push(transactionIdentifier);
                        } else {
                            this.transactionsForProduct[productId] = [transactionIdentifier];
                        }
                    }

                    switch (state) {
                        case "PaymentTransactionStatePurchasing":
                            protectCall(this.options.purchasing, 'options.purchasing', productId);
                            return;
                        case "PaymentTransactionStatePurchased":
                            protectCall(this.options.purchased, 'options.purchased',
                                transactionIdentifier, productId,
                                originalTransactionIdentifier, transactionDate,
                                discountId, expirationDate, jwsRepresentation, quantity);
                            return;
                        case "PaymentTransactionStateDeferred":
                            protectCall(this.options.deferred, 'options.deferred', productId);
                            return;
                        case "PaymentTransactionStateFailed":
                            protectCall(this.options.purchaseFailed, 'options.purchaseFailed',
                                productId, errorCode || ErrorCode.UNKNOWN, errorText || 'ERROR');
                            protectCall(this.options.error, 'options.error',
                                errorCode || ErrorCode.UNKNOWN, errorText || 'ERROR', { productId });
                            return;
                        case "PaymentTransactionStateRestored":
                            // Note: quantity is always irrelevant for restored transactions on iOS —
                            // consumable products cannot be restored. Passed through to maintain
                            // positional argument consistency with the purchased callback.
                            protectCall(this.options.restored, 'options.restored',
                                transactionIdentifier, productId,
                                originalTransactionIdentifier, transactionDate,
                                discountId, expirationDate, jwsRepresentation, quantity);
                            return;
                        case "PaymentTransactionStateFinished":
                            protectCall(this.options.finished, 'options.finished',
                                transactionIdentifier, productId);
                            return;
                    }
                }

                restoreCompletedTransactionsFinished() {
                    if (!this.needRestoreNotification) return;
                    this.needRestoreNotification = false;
                    protectCall(this.options.restoreCompleted, 'options.restoreCompleted');
                }

                restoreCompletedTransactionsFailed(errorCode: ErrorCode) {
                    if (!this.needRestoreNotification) return;
                    this.needRestoreNotification = false;
                    protectCall(this.options.restoreFailed, 'options.restoreFailed', errorCode);
                }

                parseReceiptArgs(args: [string, string, string, number, string]):
                    ApplicationReceipt {
                    return {
                        appStoreReceipt: args[0],
                        bundleIdentifier: args[1],
                        bundleShortVersion: args[2],
                        bundleNumericVersion: args[3],
                        bundleSignature: args[4],
                    };
                }

                refreshReceipts(successCb: (receipt: ApplicationReceipt) => void,
                                errorCb: (code: ErrorCode, message: string) => void) {
                    const loaded = (args: [string, string, string, number, string]) => {
                        const data = this.parseReceiptArgs(args);
                        this.appStoreReceipt = data;
                        protectCall(this.options.receiptsRefreshed, 'options.receiptsRefreshed', data);
                        protectCall(successCb, "refreshReceipts.success", data);
                    };
                    const error = (errMessage: string) => {
                        log('refresh receipt failed: ' + errMessage);
                        protectCall(errorCb, "refreshReceipts.error",
                            ErrorCode.REFRESH_RECEIPTS, 'Failed to refresh receipt: ' + errMessage);
                    };
                    this.appStoreReceipt = null;
                    exec('appStoreRefreshReceipt', [], loaded, error);
                }

                /** Retrieve the storefront country code from StoreKit */
                getStorefront(): Promise<string | undefined> {
                    return new Promise((resolve) => {
                        // SK2 uses the same native getStorefront action via InAppPurchase plugin
                        window.cordova.exec((countryCode: string) => {
                            resolve(countryCode || undefined);
                        }, (err: string) => {
                            log('getStorefront failed: ' + err);
                            resolve(undefined);
                        }, "InAppPurchase", "getStorefront", []);
                    });
                }

                loadReceipts(callback: (receipt: ApplicationReceipt) => void,
                             errorCb: (code: ErrorCode, message: string) => void) {
                    const loaded = (args: [string, string, string, number, string]) => {
                        const data = this.parseReceiptArgs(args);
                        this.appStoreReceipt = data;
                        protectCall(callback, 'loadReceipts.callback', data);
                    };
                    log('loading appStoreReceipt (SK2)');
                    exec('appStoreReceipt', [], loaded, undefined);
                }
            }
        }
    }
}
