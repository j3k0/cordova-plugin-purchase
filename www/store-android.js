/**
 * In App Billing Plugin
 * @module InAppBilling
 * 
 * @overview This file implements a JavaScript interface for both Android and iOS
 * to the native code.
 * 
 * Details and more information on {@link module:InAppBilling}
 * 
 * @author Mohammad Naghavi - {@link mohamnag.com}
 * @license MIT
 */

/**
 * All the failure callbacks have the same signature as this.
 * 
 * @callback errorCallback
 * @param {Object}  error   the information about the error
 * @param {int}     error.errorCode one of the error codes defined with ERR_*
 * @param {string}  error.msg   a textual message intended for developer in order to make debuging easier
 */

var noop = function() {
};

/**
 * @constructor
 * @alias module:InAppBilling
 */
var InAppBilling = function() {
    this.options = {};
};

/***
 * Error codes base.
 * 
 * all the codes bellow should be kept synchronized between: 
 *  * InAppPurchase.m
 *  * InAppBillingPlugin.java 
 *  * android_iab.js 
 *  * ios_iab.js
 * 
 * Be carefull assiging new codes, these are meant to express the REASON of 
 * the error as exact as possible!
 * 
 * @private
 */
ERROR_CODES_BASE = 4983497;
InAppBilling.prototype.ERR_NO_ERROR = ERROR_CODES_BASE;
InAppBilling.prototype.ERR_SETUP = ERROR_CODES_BASE + 1;
InAppBilling.prototype.ERR_LOAD = ERROR_CODES_BASE + 2;
InAppBilling.prototype.ERR_PURCHASE = ERROR_CODES_BASE + 3;
InAppBilling.prototype.ERR_LOAD_RECEIPTS = ERROR_CODES_BASE + 4;
InAppBilling.prototype.ERR_CLIENT_INVALID = ERROR_CODES_BASE + 5;
InAppBilling.prototype.ERR_PAYMENT_CANCELLED = ERROR_CODES_BASE + 6;
InAppBilling.prototype.ERR_PAYMENT_INVALID = ERROR_CODES_BASE + 7;
InAppBilling.prototype.ERR_PAYMENT_NOT_ALLOWED = ERROR_CODES_BASE + 8;
InAppBilling.prototype.ERR_UNKNOWN = ERROR_CODES_BASE + 10;
InAppBilling.prototype.ERR_LOAD_INVENTORY = ERROR_CODES_BASE + 11;
InAppBilling.prototype.ERR_HELPER_DISPOSED = ERROR_CODES_BASE + 12;
InAppBilling.prototype.ERR_NOT_INITIALIZED = ERROR_CODES_BASE + 13;
InAppBilling.prototype.ERR_INVENTORY_NOT_LOADED = ERROR_CODES_BASE + 14;
InAppBilling.prototype.ERR_PURCHASE_FAILED = ERROR_CODES_BASE + 15;
InAppBilling.prototype.ERR_JSON_CONVERSION_FAILED = ERROR_CODES_BASE + 16;
InAppBilling.prototype.ERR_INVALID_PURCHASE_PAYLOAD = ERROR_CODES_BASE + 17;
InAppBilling.prototype.ERR_SUBSCRIPTION_NOT_SUPPORTED = ERROR_CODES_BASE + 18;
InAppBilling.prototype.ERR_CONSUME_NOT_OWNED_ITEM = ERROR_CODES_BASE + 19;
InAppBilling.prototype.ERR_CONSUMPTION_FAILED = ERROR_CODES_BASE + 20;
/**
 * the prduct to be bought is not loaded
 * 
 * @type @exp;ERROR_CODES_BASE|Number
 */
InAppBilling.prototype.ERR_PRODUCT_NOT_LOADED = ERROR_CODES_BASE + 21;
/**
 * invalid product id passed
 * 
 * @type @exp;ERROR_CODES_BASE|Number
 */
InAppBilling.prototype.ERR_INVALID_PRODUCT_ID = ERROR_CODES_BASE + 22;
/**
 * invalid purchase id passed
 * 
 * @type @exp;ERROR_CODES_BASE|Number
 */
InAppBilling.prototype.ERR_INVALID_PURCHASE_ID = ERROR_CODES_BASE + 23;

/**
 * Item requested to be bought is already owned
 * 
 * @type @exp;ERROR_CODES_BASE|Number
 */
InAppBilling.prototype.ERR_PURCHASE_OWNED_ITEM = ERROR_CODES_BASE + 24;

/***
 * This function accepts and outputs all the logs, both from native and from JS
 * this is intended to make the debuging easier, you only need to have access to 
 * JS console output.
 * 
 * @param {String} msg
 * @private
 */
InAppBilling.prototype.log = function(msg) {
    console.log("InAppBilling[js]: " + msg);
};

/**
 * The success callback for [init]{@link module:InAppBilling#init}.
 * 
 * @callback initSuccessCallback
 * @param {Array.<ProductDetails>} products
 */

/**
 * This initiates the plugin, you can optionally pass in one or multiple 
 * product IDs for their details to be loaded during initialization.
 *  
 * @param {initSuccessCallback} success  the success callback
 * @param {errorCallback} fail  the failure callback
 * @param {Object} options  options for configuring the plugin
 * @param {Boolean=} options.showLog    [true] wether to show logs or not, this is strongly recommended to be set to false for production
 * @param {{(String|Array.<String>)}} productIds   an optional list of product IDs to load after initialization was successful
 */
InAppBilling.prototype.init = function(success, fail, options, productIds) {
    if (!options)
        options = {};

    this.options = {
        showLog: options.showLog || false
    };

    // show log or mute the log
    //TODO: this shall mute logs on native too
    if (this.options.showLog === true) {
        this.log = InAppBilling.prototype.log;
    }
    else {
        this.log = noop;
    }

    // call to log, only after the situation with log is clear
    this.log('init called!');

    var hasProductIds = false;
    //Optional Load productIds to Inventory.
    if (typeof productIds !== "undefined") {
        if (typeof productIds === "string") {
            productIds = [productIds];
        }
        if (productIds.length > 0) {
            if (typeof productIds[0] !== 'string') {
                var msg = 'invalid productIds: ' + JSON.stringify(productIds);
                this.log(msg);
                fail({
                    errorCode: this.ERR_INVALID_PRODUCT_ID,
                    msg: msg,
                    nativeEvent: {}
                });
                return;
            }
            this.log('load ' + JSON.stringify(productIds));
            hasProductIds = true;
        }
    }

    // TODO: the arguments to init should be checked on iOS again to accept show log
    if (hasProductIds) {
        return cordova.exec(success, fail, "InAppBillingPlugin", "init", [productIds, this.options.showLog]);
    } else {
        //No SKUs
        return cordova.exec(success, fail, "InAppBillingPlugin", "init", [[], this.options.showLog]);
    }
};

//TODO: check this structure in iOS native code
/**
 * @typedef Purchase
 * @property {string} id populated with orderId (when on PlayStore) or transactionIdentifier (when on iTunes)
 * @property {string} originalId populated with `originalTransaction.transactionIdentifier` available only on iOS and only for restored transactions
 * @property {string} productId the id of the bought product
 * @property {date} expirationDate the date of expiration for this purchase, only if the product is of subscription type and only as long as this is not past.
 * @property {string} verificationPayload this is populated with `purchaseToken` when on PlayStore and with application's `receipt` when on iTunes. **Only set when this data is returned to buy or subscribe success callback.**
 */

/**
 * The success callback for [getPurchases]{@link module:InAppBilling#getPurchases}
 * 
 * @callback getPurchasesSuccessCallback
 * @param {Array.<Purchase>} purchaseList
 */

//TODO: check the order of purchases retuned in iOS and android native!
/**
 * This will return bought products in a chronological order (oldest first)
 * that are not cunsumed or the subscriptions that are not expired. Following 
 * items will **not** appear on this list:
 * - consumable products which has been consumed
 * - products which have been cancelled (as possible in iOS)
 * - subscriptions that are expired
 * 
 * Because of the differences between purchase verification on iOS and android,
 * the verification payload may not be set here. If you need that piece of data
 * reliably on both iOS and andoird, you may ask [getPurchaseDetails]{@link module:InAppBilling#getPurchaseDetails}
 * for full data.
 * 
 * This is best practice to always look at this list on startup to activate 
 * products in your application.
 * 
 * @param {getPurchasesSuccessCallback} success
 * @param {errorCallback} fail
 */
InAppBilling.prototype.getPurchases = function(success, fail) {
    this.log('getPurchases called!');
    return cordova.exec(success, fail, "InAppBillingPlugin", "getPurchases", ["null"]);
};

/**
 * The success callback for [buy]{@link module:InAppBilling#buy} and 
 * [subscribe]{@link module:InAppBilling#subscribe}
 * 
 * @callback buySuccessCallback
 * @param {Purchase} purchase the data of purchase
 */

/**
 * Buy or subscribe to an item. The product should be loaded before this call. 
 * You can either load items at [init]{@link module:InAppBilling#init} or by 
 * calling [loadProductDetails]{@link module:InAppBilling#loadProductDetails}.
 * 
 * @param {buySuccessCallback} success  the callback for successful purchse
 * @param {errorCallback} fail  the callback for failed purchase
 * @param {string} productId    the product's ID to be bought
 */
InAppBilling.prototype.buy = function(success, fail, productId) {
    this.log('buy called!');

    // TODO: verify the return values to success in iOS native
    return cordova.exec(success, fail, "InAppBillingPlugin", "buy", [productId]);
};

/**
 * The success callback for [restore]{@link module:InAppBilling#restore}.
 * This is only available on iOS.
 * 
 * @callback restoreSuccessCallback
 * @param {Array.<Purchase>} purchases the data of purchase
 */

/**
 * on iOS:
 * Asks store to re-queue previously processed transactions. Use this with caution 
 * and don't call it again until you get the callback either on success or on
 * failure.
 * 
 * on Android:
 * This will do the same as [getPurchases]{@link module:InAppBilling#getPurchases}
 * 
 * @param  {restoreSuccessCallback} success
 * @param  {errorCallback} fail
 */
InAppBilling.prototype.restore = function(success, fail) {
    this.log('restore called!');

    // TODO: replace this on iOS with getPurchases and then remove this
    cordova.exec(success, fail, "InAppBillingPlugin", 'restoreCompletedTransactions', []);
};

/**
 * This is the callback for [consumeProduct]{@link module:InAppBilling#consumeProduct}
 * 
 * @callback consumeProductSuccessCallback
 * @param {Purchase} purchase
 */

/**
 * Consume an item. The product should be of consumable type.
 * 
 * @param {consumeProductSuccessCallback} success callback for successful consumption
 * @param {type} fail   callback for failed consumption
 * @param {type} productId  id of the already bought product (not the purchase itself)
 */
InAppBilling.prototype.consumeProduct = function(success, fail, productId) {
    this.log('consumeProduct called!');

    //TODO: implement it for iOS!
    return cordova.exec(success, fail, "InAppBillingPlugin", "consumeProduct", [productId]);
};

/* 
 TODO: sync this with final struc
 
 on iOS:
 {
 id: "<productId>",
 title: "<localised title>",
 description: "<localised escription>",
 price: "<localised price>"
 }
 */
/**
 * @typedef ProductDetails
 * @property {string} id the product id
 * @property {string} type type of product, possible values: inapp, subscription
 * @property {string} price the formatted localized price
 * @property {int} priceMicros the price in micro amount (2$ ~> 2000000)
 * @property {string} currencyCode the currency code used for localized price
 * @property {string} title humanreadable title of product
 * @property {string} description description of product
 */

/**
 * This is the success callback for [loadProductDetails]{@link module:InAppBilling#loadProductDetails}.
 * This will be called when process is successfully finished and will receive a list of valid and 
 * loaded products.
 *
 * Invalid products will not be on this list.
 * 
 * @callback loadProductDetailsSuccessCallback
 * @param {Array.<ProductDetails>} products
 */

/**
 * Get details for a list of product ids. This will also load the products' 
 * details if they are not already loaded. Will only return the product details
 * for the valid product ids. Will also return the items which have been loaded 
 * 
 * @param {loadProductDetailsSuccessCallback} success    callback for successful query
 * @param {errorCallback} fail  callback for failed query
 * @param {(String|Array.<String>)} productIds
 */
InAppBilling.prototype.loadProductDetails = function(success, fail, productIds) {
    this.log('loadProductDetails called!');

    if (typeof productIds === "string") {
        productIds = [productIds];
    }
    if (!productIds.length) {
        // Empty array, nothing to do.
        return;
    }
    else {
        if (typeof productIds[0] !== 'string') {
            var msg = 'invalid productIds: ' + JSON.stringify(productIds);
            this.log(msg);
            fail({
                errorCode: this.ERR_INVALID_PRODUCT_ID,
                msg: msg,
                nativeEvent: {}
            });
            return;
        }
        this.log('load ' + JSON.stringify(productIds));

        return cordova.exec(success, fail, "InAppBillingPlugin", "loadProductDetails", [productIds]);
    }
};

/**
 * This is the success callback for [getPurchaseDetails]{@link module:InAppBilling#getPurchaseDetails}.
 * This will return the purchase data containing the verification payload.
 *
 * @callback getPurchaseDetailsSuccessCallback
 * @param {Purchase} purchase
 */

/**
 * This will return full data of a purchase including its verification payload. 
 * Depending on the platform verification payload means either the `purchaseToken` 
 * of one single purchase (on PlayStore) or the application `receipt` (on iTunes).
 * 
 * The puchase data should have been loaded before this call using [getPurchases]{@link module:InAppBilling#getPurchases}.
 * 
 * @param {getPurchaseDetailsSuccessCallback} success
 * @param {errorCallback} fail
 * @param {string} purchaseId
 */
InAppBilling.prototype.getPurchaseDetails = function(success, fail, purchaseId) {
    this.log('loadProductDetails called!');

    // TODO: to be implemented in iOS!
    return cordova.exec(success, fail, "InAppBillingPlugin", "getPurchaseDetails", [purchaseId]);
};

module.exports = new InAppBilling();
