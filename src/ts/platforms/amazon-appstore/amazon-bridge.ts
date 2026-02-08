namespace CdvPurchase {

    export namespace AmazonAppStore {

        export namespace Bridge {

            let log = function log(msg: string) {
                console.log("AmazonIAP[js]: " + msg);
            }

            export class Bridge {

                options: Options = {};

                init(success: () => void, fail: ErrorCallback, options: Options) {
                    if (!options)
                        options = {};

                    if (options.log) log = options.log;

                    this.options = {
                        showLog: options.showLog !== false,
                        onPurchasesUpdated: options.onPurchasesUpdated,
                        onSetPurchases: options.onSetPurchases,
                        onPurchaseFulfilled: options.onPurchaseFulfilled,
                    };

                    if (this.options.showLog) {
                        log('setup ok');
                    }

                    const listener = this.listener.bind(this);
                    window.cordova.exec(listener, function () { }, "AmazonInAppPurchasePlugin", "setListener", []);
                    window.cordova.exec(success, errorCb(fail), "AmazonInAppPurchasePlugin", "init", []);
                }

                listener(msg: Message) {
                    if (this.options.showLog) {
                        log('listener: ' + JSON.stringify(msg));
                    }
                    if (!msg || !msg.type) {
                        return;
                    }
                    if (msg.type === "setPurchases" && this.options.onSetPurchases) {
                        this.options.onSetPurchases(msg.data.purchases);
                    }
                    if (msg.type === "purchasesUpdated" && this.options.onPurchasesUpdated) {
                        this.options.onPurchasesUpdated(msg.data.purchases);
                    }
                    if (msg.type === "purchaseFulfilled" && this.options.onPurchaseFulfilled) {
                        this.options.onPurchaseFulfilled(msg.data.purchase);
                    }
                }

                getProductData(skus: string[], success: (products: ProductDataResponse) => void, fail: ErrorCallback) {
                    if (this.options.showLog) {
                        log('getProductData()');
                    }
                    return window.cordova.exec(success, errorCb(fail), "AmazonInAppPurchasePlugin", "getProductData", [skus]);
                }

                purchase(productId: string, success: () => void, fail: ErrorCallback) {
                    if (this.options.showLog) {
                        log('purchase()');
                    }
                    return window.cordova.exec(success, errorCb(fail), "AmazonInAppPurchasePlugin", "purchase", [productId]);
                }

                notifyFulfillment(receiptId: string, success: () => void, fail: ErrorCallback) {
                    if (this.options.showLog) {
                        log('notifyFulfillment()');
                    }
                    return window.cordova.exec(success, errorCb(fail), "AmazonInAppPurchasePlugin", "notifyFulfillment", [receiptId]);
                }

                getPurchaseUpdates(success: () => void, fail: ErrorCallback) {
                    if (this.options.showLog) {
                        log('getPurchaseUpdates()');
                    }
                    return window.cordova.exec(success, errorCb(fail), "AmazonInAppPurchasePlugin", "getPurchaseUpdates", ["null"]);
                }
            }

            function errorCb(fail: (message: string, code?: number) => void) {
                return function (error: string) {
                    if (!fail)
                        return;
                    const tokens = typeof error === 'string' ? error.split('|') : [];
                    if (tokens.length > 1 && /^[-+]?(\d+)$/.test(tokens[0])) {
                        var code = tokens[0];
                        var message = tokens[1];
                        fail(message, +code);
                    }
                    else {
                        fail(error);
                    }
                };
            }
        }
    }
}
