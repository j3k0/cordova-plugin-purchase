namespace CdvPurchase {
    export namespace AppleAppStore {

        /**
         * Application receipt with information about the app bundle.
         */
        export interface ApplicationReceipt {
            /** Application receipt in base64 */
            appStoreReceipt: string;
            /** String containing the apps bundle identifier */
            bundleIdentifier: string;
            /** Application version in string format */
            bundleShortVersion: string;
            /** Application version in numeric format */
            bundleNumericVersion: number;
            /** Bundle signature */
            bundleSignature: string;
        }

        /**
         * The signed discount applied to a payment
         *
         * @see {@link https://developer.apple.com/documentation/storekit/skpaymentdiscount?language=objc}
         */
        export interface PaymentDiscount {
            /** A string used to uniquely identify a discount offer for a product. */
            id: string;
            /** A string that identifies the key used to generate the signature. */
            key: string;
            /** A universally unique ID (UUID) value that you define. */
            nonce: string;
            /** A string representing the properties of a specific promotional offer, cryptographically signed. */
            signature: string;
            /** The date and time of the signature's creation in milliseconds, formatted in Unix epoch time. */
            timestamp: string;
        }

        export namespace Bridge {

            /**
             * Product as loaded from AppStore
             */
            export interface ValidProduct {

                /** product id */
                id: string;

                /** localized title */
                title: string;

                /** localized description */
                description: string;

                /** localized price */
                price: string;

                /** Price in micro units */
                priceMicros: number;

                /** Currency used by this product */
                currency: string;

                /** AppStore country this product has been fetched for */
                countryCode: string;

                /** Number of period units in each billing cycle */
                billingPeriod?: number;

                /** Unit for the billing cycle */
                billingPeriodUnit?: IPeriodUnit;

                /** Localized price for introductory period */
                introPrice?: string;

                /** Introductory price in micro units */
                introPriceMicros?: number;

                /** Number of introductory price periods */
                introPricePeriod?: number;

                /** Duration of an introductory price period */
                introPricePeriodUnit?: IPeriodUnit;

                /** Payment mode for introductory price */
                introPricePaymentMode?: PaymentMode;

                /** Available discount offers */
                discounts?: Discount[];

                /** Group this product is member of */
                group?: string;
            }

            export type DiscountType = "Introductory" | "Subscription";

            /** Subscription discount offer */
            export interface Discount {

                /** Discount identifier */
                id: string;

                /** Discount type */
                type: DiscountType;

                /** Localized price */
                price: string;

                /** Price in micro units */
                priceMicros: number;

                /** Number of periods */
                period: number;

                /** Subscription period unit */
                periodUnit: IPeriodUnit;

                /** Payment mode */
                paymentMode: PaymentMode;
            }

            /**
             * State of a transaction
             */
            export type TransactionState =
                | "PaymentTransactionStatePurchasing"
                | "PaymentTransactionStatePurchased"
                | "PaymentTransactionStateDeferred"
                | "PaymentTransactionStateFailed"
                | "PaymentTransactionStateRestored"
                | "PaymentTransactionStateFinished"
                ;

            /**
             * A receipt returned by the native side.
             */
            type RawReceiptArgs = [
                base64: string,
                bundleIdentifier: string,
                bundleShortVersion: string,
                bundleNumericVersion: number,
                bundleSignature: string
            ]


            /** No-operation function, used as a default for callbacks */
            const noop = (args?: any) => {};

            /** Logger */
            let log: (message: string) => void = noop;

            /** Execute a native method */
            function exec(methodName: string, options: any[], success?: (msg?: any) => void, error?: (err: string) => void) {
                window.cordova.exec(success, error, "InAppPurchase", methodName, options);
            };

            /** Execute a javascript-side method in a try-catch block */
            function protectCall<T extends (...args: any) => any> (this: any, callback: T, context: string, ...args: Parameters<T>) {
                if (!callback) {
                    return;
                }
                try {
                    // const args = Array.prototype.slice.call(arguments, 2);
                    callback.apply(this, args);
                }
                catch (err) {
                    log('exception in ' + context + ': "' + err + '"');
                }
            };

            export interface BridgeCallbacks {

                error: (code: ErrorCode, message: string, options?: { productId: string, quantity?: number }) => void;

                /** Called when the bridge is ready (after setup) */
                ready: () => void;

                /** Called when a transaction is in "Purchased" state */
                purchased: (transactionIdentifier: string, productId: string, originalTransactionIdentifier?: string, transactionDate?: string, discountId?: string) => void;

                /** Called when a transaction has been enqueued */
                purchaseEnqueued: (productId: string, quantity: number) => void;

                /**
                 * Called when a transaction failed.
                 *
                 * Watch out for ErrorCode.PAYMENT_CANCELLED (means user closed the dialog)
                 */
                purchaseFailed: (productId: string, code: ErrorCode, message: string) => void;

                /**
                 * Called when a transaction is in "purchasing" state
                 */
                purchasing: (productId: string) => void;

                /** Called when a transaction is deferred (waiting for approval) */
                deferred: (productId: string) => void;

                /** Called when a transaction is in "finished" state */
                finished: (transactionIdentifier: string, productId: string) => void;

                /** Called when a transaction is in "restored" state */
                restored: (transactionIdentifier: string, productId: string) => void;

                /** Called when the application receipt is refreshed */
                receiptsRefreshed: (receipt: ApplicationReceipt) => void;

                /** Called when a call to "restore" failed */
                restoreFailed: (errorCode: ErrorCode) => void;

                /** Called when a call to "restore" is complete */
                restoreCompleted: () => void;
            }

            export interface BridgeOptions extends BridgeCallbacks {

                /** Custom logger for the bridge */
                log: (message: string) => void;

                /** True to enable lot of logs on the console */
                debug: boolean;

                /** Auto-finish transaction */
                autoFinish: boolean;
            }

            export class Bridge {

                /** Callbacks set by the adapter */
                options: BridgeCallbacks;

                /** Transactions for a given product */
                transactionsForProduct: { [productId: string]: string[] } = {};

                /** True when the SDK has been initialized */
                private initialized = false;

                /** The application receipt from AppStore, cached in javascript */
                appStoreReceipt?: ApplicationReceipt | null;

                /** List of registered product identifiers */
                private registeredProducts: string[] = [];

                /** True if "restoreCompleted" or "restoreFailed" should be called when restore is done */
                private needRestoreNotification = false;

                /*
                private eventQueue: {
                    state: TransactionState;
                    errorCode: ErrorCode | undefined;
                    errorText: string | undefined;
                    transactionIdentifier: string;
                    productId: string;
                    /** @deprecated *
                    transactionReceipt: never;
                    originalTransactionIdentifier: string | undefined;
                    transactionDate: string;
                    discountId: string;
                }[] = [];

                private timer: number | null = null;
                */

                /** List of transaction updates to process */
                private pendingUpdates: {
                    state: TransactionState;
                    errorCode: ErrorCode | undefined;
                    errorText: string | undefined;
                    transactionIdentifier: string;
                    productId: string;
                    /** @deprecated */
                    transactionReceipt: never;
                    originalTransactionIdentifier: string | undefined;
                    transactionDate: string | undefined;
                    discountId: string | undefined;
                }[] = [];

                constructor() {

                    (window as any).storekit = this; // used by native to communicate with this bridge

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
                    }

                    // if (window.localStorage && window.localStorage.sk_transactionForProduct)
                    // this.transactionsForProduct = JSON.parse(window.localStorage.sk_transactionForProduct);
                    // Remove support for receipt.forTransaction(...)
                    // `appStoreReceipt` is now the only supported receipt format on iOS (drops support for iOS <= 6)
                    // if (window.localStorage.sk_receiptForTransaction)
                    // delete window.localStorage.sk_receiptForTransaction;
                }

                /**
                 * Initialize the AppStore bridge.
                 *
                 * This calls the native "setup" method from the "InAppPurchase" Objective-C class.
                 *
                 * @param options Options for the bridge
                 * @param success Called when the bridge is ready
                 * @param error Called when the bridge failed to initialize
                 */
                init(options: Partial<BridgeOptions>, success: () => void, error: (code: ErrorCode, message: string) => void) {
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
                        log = options.log || function (msg) {
                            console.log("[CdvPurchase.AppAppStore.Bridge] " + msg);
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
                        // protectCall(this.options.error, 'options.error', ErrorCode.SETUP, 'Setup failed');
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

                /**
                 * Makes an in-app purchase.
                 *
                 * @param {String} productId The product identifier. e.g. "com.example.MyApp.myproduct"
                 * @param {int} quantity Quantity of product to purchase
                 */
                purchase(productId: string, quantity: number, applicationUsername: string | undefined, discount: PaymentDiscount | undefined, success: () => void, error: () => void) {
                    quantity = (quantity | 0) || 1;
                    const options = this.options;

                    // Many people forget to load information about their products from apple's servers before allowing
                    // users to purchase them... leading them to spam us with useless issues and comments.
                    // Let's chase them down!
                    if (this.registeredProducts.indexOf(productId) < 0) {
                        const msg = 'Purchasing ' + productId + ' failed.  Ensure the product was loaded first with Bridge.load(...)!';
                        log(msg);
                        if (typeof options.error === 'function') {
                            protectCall(options.error, 'options.error', ErrorCode.PURCHASE, 'Trying to purchase a unknown product.', {productId, quantity});
                        }
                        return;
                    }

                    const purchaseOk = () => {
                        log('Purchase enqueued ' + productId);
                        if (typeof options.purchaseEnqueued === 'function') {
                            protectCall(options.purchaseEnqueued, 'options.purchaseEnqueued', productId, quantity);
                        }
                        protectCall(success, 'purchase.success');
                    };
                    const purchaseFailed = () => {
                        const errMsg = 'Purchase failed: ' + productId;
                        log(errMsg);
                        if (typeof options.error === 'function') {
                            protectCall(options.error, 'options.error', ErrorCode.PURCHASE, errMsg, {productId, quantity});
                        }
                        protectCall(error, 'purchase.error');
                    };
                    exec('purchase', [productId, quantity, applicationUsername, discount || {}], purchaseOk, purchaseFailed);
                }

                /**
                 * Checks if device/user is allowed to make in-app purchases
                 */
                canMakePayments(success: () => void, error: (message: string) => void) {
                    return exec("canMakePayments", [], success, error);
                }

                /**
                 * Asks the payment queue to restore previously completed purchases.
                 *
                 * The restored transactions are passed to the onRestored callback, so make sure you define a handler for that first.
                 */
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

                /**
                 * Retrieves localized product data, including price (as localized
                 * string), name, description of multiple products.
                 *
                 * @param {Array} productIds
                 *   An array of product identifier strings.
                 *
                 * @param {Function} callback
                 *   Called once with the result of the products request. Signature:
                 *
                 *     function(validProducts, invalidProductIds)
                 *
                 *   where validProducts receives an array of objects of the form:
                 *
                 *     {
                 *       id: "<productId>",
                 *       title: "<localised title>",
                 *       description: "<localised escription>",
                 *       price: "<localised price>"
                 *     }
                 *
                 *  and invalidProductIds receives an array of product identifier
                 *  strings which were rejected by the app store.
                 */
                load(productIds: string[], success: (validProducts: ValidProduct[], invalidProductIds: string[]) => void, error: (code: ErrorCode, message: string) => void) {
                    const options = this.options;
                    if (typeof productIds === "string") {
                        productIds = [productIds];
                    }
                    if (!productIds) {
                        // Empty array, nothing to do.
                        protectCall(success, 'load.success', [], []);
                    }
                    else if (!productIds.length) {
                        // Empty array, nothing to do.
                        protectCall(success, 'load.success', [], []);
                    }
                    else {
                        if (typeof productIds[0] !== 'string') {
                            const msg = 'invalid productIds given to store.load: ' + JSON.stringify(productIds);
                            log(msg);
                            protectCall(options.error, 'options.error', ErrorCode.LOAD, msg);
                            protectCall(error, 'load.error', ErrorCode.LOAD, msg);
                            return;
                        }
                        log('load ' + JSON.stringify(productIds));

                        const loadOk = (array: [ValidProduct[], string[]]) => {
                            const valid = array[0];
                            const invalid = array[1];
                            log('load ok: { valid:' + JSON.stringify(valid) + ' invalid:' + JSON.stringify(invalid) + ' }');
                            protectCall(success, 'load.success', valid, invalid);
                        };
                        const loadFailed = (errMessage: string) => {
                            log('load failed');
                            log(errMessage);
                            const message = 'Load failed: ' + errMessage;
                            protectCall(options.error, 'options.error', ErrorCode.LOAD, message);
                            protectCall(error, 'load.error', ErrorCode.LOAD, message);
                        };

                        this.registeredProducts = this.registeredProducts.concat(productIds);
                        exec('load', [productIds], loadOk, loadFailed);
                    }
                }

                /*
                 * Finish an unfinished transaction.
                 *
                 * @param {String} transactionId
                 *    Identifier of the transaction to finish.
                 *
                 * You have to call this method manually except when using the autoFinish option.
                 */
                finish(transactionId: string, success: () => void, error: (msg: string) => void) {
                    exec('finishTransaction', [transactionId], success, error);
                }

                finalizeTransactionUpdates() {
                    for (let i = 0; i < this.pendingUpdates.length; ++i) {
                        const args = this.pendingUpdates[i];
                        this.transactionUpdated(args.state, args.errorCode, args.errorText, args.transactionIdentifier, args.productId, args.transactionReceipt, args.originalTransactionIdentifier, args.transactionDate, args.discountId);
                    }
                    this.pendingUpdates = [];
                }

                lastTransactionUpdated() {
                    // no more pending transactions
                }

                // This is called from native.
                //
                // Note that it may eventually be called before initialization... unfortunately.
                // In this case, we'll just keep pending updates in a list for later processing.
                transactionUpdated(state: TransactionState, errorCode: ErrorCode | undefined, errorText: string | undefined, transactionIdentifier: string, productId: string, transactionReceipt: never, originalTransactionIdentifier: string | undefined, transactionDate: string | undefined, discountId: string | undefined) {

                    if (!this.initialized) {
                        this.pendingUpdates.push({ state, errorCode, errorText, transactionIdentifier, productId, transactionReceipt, originalTransactionIdentifier, transactionDate, discountId });
                        return;
                    }
                    log("transaction updated:" + transactionIdentifier + " state:" + state + " product:" + productId);

                    if (productId && transactionIdentifier) {
                        if (this.transactionsForProduct[productId]) {
                            this.transactionsForProduct[productId].push(transactionIdentifier);
                        }
                        else {
                            this.transactionsForProduct[productId] = [transactionIdentifier];
                        }
                    }

                    switch (state) {
                        case "PaymentTransactionStatePurchasing":
                            protectCall(this.options.purchasing, 'options.purchasing', productId);
                            return;
                        case "PaymentTransactionStatePurchased":
                            protectCall(this.options.purchased, 'options.purchase', transactionIdentifier, productId, originalTransactionIdentifier, transactionDate, discountId);
                            return;
                        case "PaymentTransactionStateDeferred":
                            protectCall(this.options.deferred, 'options.deferred', productId);
                            return;
                        case "PaymentTransactionStateFailed":
                            protectCall(this.options.purchaseFailed, 'options.purchaseFailed', productId, errorCode || ErrorCode.UNKNOWN, errorText || 'ERROR');
                            protectCall(this.options.error, 'options.error', errorCode || ErrorCode.UNKNOWN, errorText || 'ERROR', {productId});
                            return;
                        case "PaymentTransactionStateRestored":
                            protectCall(this.options.restored, 'options.restore', transactionIdentifier, productId);
                            return;
                        case "PaymentTransactionStateFinished":
                            protectCall(this.options.finished, 'options.finish', transactionIdentifier, productId);
                            return;
                    }
                }

                restoreCompletedTransactionsFinished() {
                    if (!this.needRestoreNotification)
                        return;
                    this.needRestoreNotification = false;
                    protectCall(this.options.restoreCompleted, 'options.restoreCompleted');
                }

                restoreCompletedTransactionsFailed(errorCode: ErrorCode) {
                    if (!this.needRestoreNotification)
                        return;
                    this.needRestoreNotification = false;
                    protectCall(this.options.restoreFailed, 'options.restoreFailed', errorCode);
                }

                parseReceiptArgs(args: RawReceiptArgs): ApplicationReceipt {
                    const base64 = args[0];
                    const bundleIdentifier = args[1];
                    const bundleShortVersion = args[2];
                    const bundleNumericVersion = args[3];
                    const bundleSignature = args[4];
                    log('infoPlist: ' + bundleIdentifier + "," + bundleShortVersion + "," + bundleNumericVersion + "," + bundleSignature);
                    return {
                        appStoreReceipt: base64,
                        bundleIdentifier: bundleIdentifier,
                        bundleShortVersion: bundleShortVersion,
                        bundleNumericVersion: bundleNumericVersion,
                        bundleSignature: bundleSignature
                    };
                }

                refreshReceipts(successCb: (receipt: ApplicationReceipt) => void, errorCb: (code: ErrorCode, message: string) => void) {

                    const loaded = (args: RawReceiptArgs) => {
                        const data = this.parseReceiptArgs(args);
                        this.appStoreReceipt = data;
                        protectCall(this.options.receiptsRefreshed, 'options.receiptsRefreshed', data);
                        protectCall(successCb, "refreshReceipts.success", data);
                    };

                    const error = (errMessage: string) => {
                        log('refresh receipt failed: ' + errMessage);
                        if (errMessage.includes("(@AMSErrorDomain:100)")) {
                            log('authentication failed, indicated by the string "(@AMSErrorDomain:100)"');
                        }
                        protectCall(this.options.error, 'options.error', ErrorCode.REFRESH_RECEIPTS, 'Failed to refresh receipt: ' + errMessage);
                        protectCall(errorCb, "refreshReceipts.error", ErrorCode.REFRESH_RECEIPTS, 'Failed to refresh receipt: ' + errMessage);
                    };

                    this.appStoreReceipt = null;
                    log('refreshing appStoreReceipt');
                    exec('appStoreRefreshReceipt', [], loaded, error);
                }

                loadReceipts(callback: (receipt: ApplicationReceipt) => void, errorCb: (code: ErrorCode, message: string) => void) {

                    const loaded = (args: RawReceiptArgs) => {
                        const data = this.parseReceiptArgs(args);
                        this.appStoreReceipt = data;
                        protectCall(callback, 'loadReceipts.callback', data);
                    };

                    const error = (errMessage: string) => {
                        // should not happen (native side never triggers an error)
                        // log('load failed: ' + errMessage);
                        // protectCall(this.options.error, 'options.error', ErrorCode.LOAD_RECEIPTS, 'Failed to load receipt: ' + errMessage);
                        // protectCall(errorCb, 'loadReceipts.error', ErrorCode.LOAD_RECEIPTS, 'Failed to load receipt: ' + errMessage);
                    };

                    log('loading appStoreReceipt');
                    exec('appStoreReceipt', [], loaded, error);
                }

                /** @deprecated */
                onPurchased = false;
                /** @deprecated */
                onFailed = false;
                /** @deprecated */
                onRestored = false;

                /*
                 * This queue stuff is here because we may be sent events before listeners have been registered.
                 * This is because if we have incomplete transactions when we quit, the app will try to run these
                 * when we resume. If we don't register to receive these right away then they may be missed.
                 *
                 * As soon as a callback has been registered then it will be sent any events waiting in the queue.
                 *
                runQueue() {
                    if (!this.eventQueue.length || !this.onPurchased && !this.onFailed && !this.onRestored) {
                        return;
                    }
                    // We can't work directly on the queue, because we're pushing new elements onto it
                    const queue = this.eventQueue.slice();
                    this.eventQueue = [];
                    let args = queue.shift();
                    while (args = queue.shift()) {
                        this.updatedTransactionCallback(args.state, args.errorCode, args.errorText, args.transactionIdentifier, args.productId, args.transactionReceipt, args.originalTransactionIdentifier, args.transactionDate, args.discountId);
                        args = queue.shift();
                    }
                    if (!this.eventQueue.length) {
                        this.unWatchQueue();
                    }
                }

                watchQueue() {
                    if (this.timer !== null) {
                        return; // already watching
                    }
                    this.timer = window.setInterval(() => {
                        this.runQueue();
                    }, 1000);
                }

                unWatchQueue() {
                    if (this.timer !== null) {
                        window.clearInterval(this.timer);
                        this.timer = null;
                    }
                }
                */
            }
        }
    }
}
