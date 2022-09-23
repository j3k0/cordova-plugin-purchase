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
            onPurchasesUpdated?: (purchases: BridgePurchase[]) => void;
            onSetPurchases?: (purchases: BridgePurchase[]) => void;
            onPriceChangeConfirmationResult?: (result: "OK" | "UserCanceled" | "UnknownProduct") => void;
        }

        export type BridgeErrorCallback = (message: string, code?: ErrorCode) => void;

        export interface BridgePurchase {

            /** Unique order identifier for the transaction.  (like GPA.XXXX-XXXX-XXXX-XXXXX) */
            orderId?: string;

            /** Application package from which the purchase originated. */
            packageName: string;

            /** Identifier of the purchased product.
             *
             * @deprecated - use productIds (since Billing v5 a single purchase can contain multiple products) */
            productId: string;

            /** Identifier of the purchased products */
            productIds: string[];

            /** Time the product was purchased, in milliseconds since the epoch (Jan 1, 1970). */
            purchaseTime: number;

            /** Payload specified when the purchase was acknowledged or consumed.
             *
             * @deprecated - This was removed from Billing v5 */
            developerPayload: string;

            /** Purchase state in the original JSON
             *
             * @deprecated - use getPurchaseState */
            purchaseState: number;

            /** Token that uniquely identifies a purchase for a given item and user pair. */
            purchaseToken: string;

            /** quantity of the purchased product */
            quantity: number;

            /** Whether the purchase has been acknowledged. */
            acknowledged: boolean;

            /** One of BridgePurchaseState indicating the state of the purchase. */
            getPurchaseState: BridgePurchaseState;

            /** Whether the subscription renews automatically. */
            autoRenewing: false;

            /** String containing the signature of the purchase data that was signed with the private key of the developer. */
            signature: string;

            /** String in JSON format that contains details about the purchase order. */
            receipt: string;

            /** Obfuscated account id specified at purchase - by default md5(applicationUsername) */
            accountId: string;

            /** Obfuscated profile id specified at purchase - used when a single user can have multiple profiles */
            profileId: string;
        }

        export enum BridgePurchaseState {
            UNSPECIFIED_STATE = 0,
            PURCHASED = 1,
            PENDING = 2,
        }

        /** Replace SKU ProrationMode.
         *
         * See https://developer.android.com/reference/com/android/billingclient/api/BillingFlowParams.ProrationMode */
        export enum ProrationMode {
            /** Replacement takes effect immediately, and the remaining time will be prorated and credited to the user. */
            IMMEDIATE_WITH_TIME_PRORATION = 'IMMEDIATE_WITH_TIME_PRORATION',
            /** Replacement takes effect immediately, and the billing cycle remains the same. */
            IMMEDIATE_AND_CHARGE_PRORATED_PRICE = 'IMMEDIATE_AND_CHARGE_PRORATED_PRICE',
            /** Replacement takes effect immediately, and the new price will be charged on next recurrence time. */
            IMMEDIATE_WITHOUT_PRORATION = 'IMMEDIATE_WITHOUT_PRORATION',
            /** Replacement takes effect when the old plan expires, and the new price will be charged at the same time. */
            DEFERRED = 'DEFERRED',
            /** Replacement takes effect immediately, and the user is charged full price of new plan and is given a full billing cycle of subscription, plus remaining prorated time from the old plan. */
            IMMEDIATE_AND_CHARGE_FULL_PRICE = 'IMMEDIATE_AND_CHARGE_FULL_PRICE',
        }

        export interface AdditionalData {

            /** The GooglePlay offer token */
            offerToken?: string;

            /** Replace another purchase with the new one
             *
             * Your can find the old token in the receipts. */
            oldPurchaseToken?: string;

            /**
             * Obfuscated user account identifier
             *
             * Default to md5(store.applicationUsername)
             */
            accountId?: string;

            /**
             * Some applications allow users to have multiple profiles within a single account.
             *
             * Use this method to send the user's profile identifier to Google.
             */
            profileId?: string;

            /** See https://github.com/j3k0/cordova-plugin-purchase/blob/master/doc/api.md#storeorderproduct-additionaldata for details */
            prorationMode?: ProrationMode;
        }

        export type BridgeMessage = {
            type: "setPurchases";
            data: { purchases: BridgePurchase[]; };
        } | {
            type: "purchasesUpdated";
            data: { purchases: BridgePurchase[]; }
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
                if (additionalData.googlePlay?.oldPurchaseToken && this.options.showLog) {
                    log('subscribe() -> upgrading from an old purchase');
                }
                return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "subscribe", [
                    productId, extendAdditionalData(additionalData)]);
            }

            consumePurchase(success: () => void, fail: BridgeErrorCallback, purchaseToken: string) {
                if (this.options.showLog) {
                    log('consumePurchase()');
                }
                return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "consumePurchase", [purchaseToken]);
            }

            acknowledgePurchase(success: () => void, fail: BridgeErrorCallback, purchaseToken: string) {
                if (this.options.showLog) {
                    log('acknowledgePurchase()');
                }
                return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "acknowledgePurchase", [purchaseToken]);
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
