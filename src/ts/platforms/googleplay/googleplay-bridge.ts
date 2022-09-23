/*
 * Copyright (C) 2012-2013 by Guillaume Charhon
 * Modifications 10/16/2013 by Brian Thurlow
 */
/*global cordova */

namespace CDVPurchase2 {

    export namespace GooglePlay {

        let log = function log(msg: string) {
            console.log("InAppBilling[js]: " + msg);
        }

        export interface BridgeOptions {
            log?: (msg: string) => void;
            showLog?: boolean;
            onPurchaseConsumed?: (purchase: BridgePurchase) => void;
            onPurchasesUpdated?: (purchases: BridgePurchases) => void;
            onSetPurchases?: (purchases: BridgePurchases) => void;
            onPriceChangeConfirmationResult?: (result: "OK" | "UserCanceled" | "UnknownProduct") => void;
        }

        export type BridgeErrorCallback = (message: string, code?: number) => void;

        export interface BridgePurchases {
        }

        export interface BridgePurchase {
        }

        /** See https://github.com/j3k0/cordova-plugin-purchase/blob/master/doc/api.md#storeorderproduct-additionaldata for details */
        export type ProrationMode =
            'IMMEDIATE_WITH_TIME_PRORATION'
            | 'IMMEDIATE_AND_CHARGE_PRORATED_PRICE'
            | 'IMMEDIATE_WITHOUT_PRORATION'
            | 'DEFERRED'
            | 'IMMEDIATE_AND_CHARGE_FULL_PRICE';

        export interface AdditionalData {

            /** The GooglePlay offer token */
            offerToken?: string;

            oldPurchasedSkus?: string[];

            accountId?: string;

            /**
             * Some applications allow users to have multiple profiles within a single account.
             * Use this method to send the user's profile identifier to Google.
             */
            profileId?: string;

            prorationMode?: ProrationMode;
        }

        export type BridgeMessage = {
            type: "setPurchases";
            data: { purchases: BridgePurchases; };
        } | {
            type: "purchasesUpdated";
            data: { purchases: BridgePurchases; }
        } | {
            type: "purchaseConsumed";
            data: { purchase: BridgePurchase; }
        } | {
            type: "onPriceChangeConfirmationResultOK" | "onPriceChangeConfirmationResultUserCanceled" | "onPriceChangeConfirmationResultUnknownSku";
            data: { purchase: BridgePurchase; }
        };

        export class Bridge {

            options: BridgeOptions = {};

            init(success: () => void, fail: BridgeErrorCallback, options: BridgeOptions) {
                if (!options)
                    options = {};

                if (options.log) log = options.log;

                this.options = {
                    showLog: options.showLog !== false,
                    onPurchaseConsumed: options.onPurchaseConsumed,
                    onPurchasesUpdated: options.onPurchasesUpdated,
                    onSetPurchases: options.onSetPurchases,
                };

                if (this.options.showLog) {
                    log('setup ok');
                }

                // Set a listener (see "listener()" function above)
                const listener = this.listener.bind(this);
                cordova.exec(listener, function (err) { }, "InAppBillingPlugin", "setListener", []);
                cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "init", []);
            }

            load(success: () => void, fail: BridgeErrorCallback, skus: string[], inAppSkus: string[], subsSkus: string[]) {
                var hasSKUs = false;
                // Optional Load SKUs to Inventory.
                if (typeof skus !== "undefined") {
                    if (typeof skus === "string") {
                        skus = [skus];
                    }
                    if (skus.length > 0) {
                        if (typeof skus[0] !== 'string') {
                            var msg = 'invalid productIds: ' + JSON.stringify(skus);
                            if (this.options.showLog) {
                                log(msg);
                            }
                            fail(msg, ErrorCode.INVALID_PRODUCT_ID);
                            return;
                        }
                        if (this.options.showLog) {
                            log('load ' + JSON.stringify(skus));
                        }
                        hasSKUs = true;
                    }
                }
                cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "load", [skus, inAppSkus, subsSkus]);
            }

            listener(msg: BridgeMessage) {
                // Handle changes to purchase that are being notified
                // through the PurchasesUpdatedListener on the native side (android)
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
                if (msg.type === "purchaseConsumed" && this.options.onPurchaseConsumed) {
                    this.options.onPurchaseConsumed(msg.data.purchase);
                }
                if (msg.type === "onPriceChangeConfirmationResultOK" && this.options.onPriceChangeConfirmationResult) {
                    this.options.onPriceChangeConfirmationResult("OK");
                }
                if (msg.type === "onPriceChangeConfirmationResultUserCanceled" && this.options.onPriceChangeConfirmationResult) {
                    this.options.onPriceChangeConfirmationResult("UserCanceled");
                }
                if (msg.type === "onPriceChangeConfirmationResultUnknownSku" && this.options.onPriceChangeConfirmationResult) {
                    this.options.onPriceChangeConfirmationResult("UnknownProduct");
                }
            }

            getPurchases(success: () => void, fail: BridgeErrorCallback) {
                if (this.options.showLog) {
                    log('getPurchases()');
                }
                return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "getPurchases", ["null"]);
            }

            buy(success: () => void, fail: BridgeErrorCallback, productId: string, additionalData: CDVPurchase2.AdditionalData) {
                if (this.options.showLog) {
                    log('buy()');
                }
                return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "buy", [
                    productId, extendAdditionalData(additionalData)]);
            }

            subscribe(success: () => void, fail: BridgeErrorCallback, productId: string, additionalData: CDVPurchase2.AdditionalData) {
                if (this.options.showLog) {
                    log('subscribe()');
                }
                if (additionalData.googlePlay?.oldPurchasedSkus && this.options.showLog) {
                    log('subscribe() -> upgrading of old SKUs!');
                }
                return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "subscribe", [
                    productId, extendAdditionalData(additionalData)]);
            }

            consumePurchase(success: () => void, fail: BridgeErrorCallback, productId: string, transactionId: string, developerPayload: string) {
                if (this.options.showLog) {
                    log('consumePurchase()');
                }
                return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "consumePurchase", [productId, transactionId, developerPayload]);
            }

            acknowledgePurchase(success: () => void, fail: BridgeErrorCallback, productId: string, transactionId: string, developerPayload: string) {
                if (this.options.showLog) {
                    log('acknowledgePurchase()');
                }
                return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "acknowledgePurchase", [productId, transactionId, developerPayload]);
            }

            getAvailableProducts(inAppSkus: string[], subsSkus: string[], success: (validProducts: (BridgeInAppProduct | BridgeSubscriptionV12)[]) => void, fail: BridgeErrorCallback) {
                if (this.options.showLog) {
                    log('getAvailableProducts()');
                }
                return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "getAvailableProducts", [inAppSkus, subsSkus]);
            }

            manageSubscriptions() {
                return cordova.exec(function () { }, function () { }, "InAppBillingPlugin", "manageSubscriptions", []);
            }

            manageBilling() {
                return cordova.exec(function () { }, function () { }, "InAppBillingPlugin", "manageBilling", []);
            }

            launchPriceChangeConfirmationFlow(productId: string) {
                return cordova.exec(function () { }, function () { }, "InAppBillingPlugin", "launchPriceChangeConfirmationFlow", [productId]);
            }
        }

        // Generates a `fail` function that accepts an optional error code
        // in the first part of the error string.
        //
        // format: `code|message`
        //
        // `fail` function will be called with `message` as a first argument
        // and `code` as a second argument (or undefined). This ensures
        // backward compatibility with legacy code
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

        function ensureObject<T extends Object>(obj: any): T {
            return !!obj && obj.constructor === Object ? obj : {};
        }

        function extendAdditionalData(ad?: CDVPurchase2.AdditionalData): AdditionalData {
            const additionalData: AdditionalData = ensureObject(ad?.googlePlay);
            if (!additionalData.accountId && ad?.applicationUsername) {
                additionalData.accountId = Internal.Utils.md5(ad.applicationUsername);
            }
            return additionalData;
        }

        // window.inappbilling = new Bridge();
        // That's for compatibility with the unified IAP plugin.
        // try {
        //     store.internals.inappbilling = window.inappbilling;
        // }
        // catch (e) {
        //     log(e);
        // }
    }
}
