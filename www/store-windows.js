//
// Cordova Purchase Plugin
//
// Author: Jean-Christophe Hoelt
// Copyright (c)2014
//
// License: MIT
//

//
// !!! WARNING !!!
// This file is auto-generated from files located in `src/js`
//
// DO NOT EDIT DIRECTLY OR YOUR CHANGES WILL BE LOST
//
/// ### Philosophy
///
/// The `store` API is mostly events based. As a user of this plugin,
/// you will have to register listeners to changes happening to the products
/// you register.
///
/// The core of the listening mechanism is the [`when()`](#when) method. It allows you to
/// be notified of changes to one or a set of products using a [`query`](#queries) mechanism:
/// ```js
///     store.when("product").updated(refreshScreen);
///     store.when("full version").owned(unlockApp);
///     store.when("subscription").approved(serverCheck);
///     store.when("downloadable content").downloaded(showContent);
///     etc.
/// ```
///
/// The `updated` event is fired whenever one of the fields of a product is
/// changed (its `owned` status for instance).
///
/// This event provides a generic way to track the statuses of your purchases,
/// to unlock features when needed and to refresh your views accordingly.
///
/// ### Registering products
///
/// The store needs to know the type and identifiers of your products before you
/// can use them in your code.
///
/// Use [`store.register()`](#register) before your first call to
/// [`store.refresh()`](#refresh).
///
/// Once registered, you can use [`store.get()`](#get) to retrieve
/// the [`product object`](#product) from the store.
///
/// ```js
///     store.register({
///       id: "cc.fovea.purchase.consumable1",
///       alias: "100 coins",
///       type: store.CONSUMABLE
///     });
///     ...
///     var p = store.get("100 coins");
///     // or
///     var p = store.get("cc.fovea.purchase.consumable1");
/// ```
///
/// The product `id` and `type` have to match products defined in your
/// Apple and Google developer consoles.
///
/// Learn how to do that in [HOWTO: Create New Products](https://github.com/j3k0/cordova-plugin-purchase/wiki/HOWTO#create-new-products).
///
/// ### Displaying products
///
/// Right after you registered your products, nothing much is known about them
/// except their `id`, `type` and an optional `alias`.
///
/// When you perform the initial [`refresh()`](#refresh) call, the store's server will
/// be contacted to load informations about the registered products: human
/// readable `title` and `description`, `price`, etc.
///
/// This isn't an optional step as some despotic store owners (like Apple) require you
/// to display information about a product as retrieved from their server: no
/// hard-coding of price and title allowed! This is also convenient for you
/// as you can change the price of your items knowing that it'll be reflected instantly
/// on your clients' devices.
///
/// However, the information may not be available when the first view that needs
/// them appears on screen. For you, the best option is to have your view monitor
/// changes made to the product.
///
/// #### monitor changes
///
/// Let's demonstrate this with an example:
///
/// ```js
///     // method called when the screen showing your purchase is made visible
///     function show() {
///         render();
///         store.when("cc.fovea.test1").updated(render);
///     }
///
///     function render() {
///
///         // Get the product from the pool.
///         var product = store.get("cc.fovea.test1");
///
///         if (!product) {
///             $el.html("");
///         }
///         else if (product.state === store.REGISTERED) {
///             $el.html("<div class=\"loading\" />");
///         }
///         else if (product.state === store.INVALID) {
///             $el.html("");
///         }
///         else {
///             // Good! Product loaded and valid.
///             $el.html(
///                   "<div class=\"title\">"       + product.title       + "</div>"
///                 + "<div class=\"description\">" + product.description + "</div>"
///                 + "<div class=\"price\">"       + product.price       + "</div>"
///             );
///
///             // Is this product owned? Give him a special class.
///             if (product.owned)
///                 $el.addClass("owned");
///             else
///                 $el.removeClass("owned");
///
///             // Is an order for this product in progress? Can't be ordered right now?
///             if (product.canPurchase)
///                 $el.addClass("can-purchase");
///             else
///                 $el.removeClass("can-purchase");
///         }
///     }
///
///     // method called when the view is hidden
///     function hide() {
///         // stop monitoring the product
///         store.off(render);
///     }
/// ```
///
/// In this example, `render` redraw the purchase element whatever
/// happens to the product. When the view is hidden, we stop listening to changes
/// (`store.off(render)`).
///

/// ### <a name="purchasing"></a> Purchasing
///
/// #### initiate a purchase
///
/// Purchases are initiated using the [`store.order()`](#order) method.
///
/// The store will manage the internal purchase flow that'll end:
///
///  - with an `approved` [event](#events). The product enters the `APPROVED` state.
///  - with a `cancelled` [event](#events). The product gets back to the `VALID` state.
///  - with an `error` [event](#events). The product gets back to the `VALID` state.
///
/// See [product life-cycle](#life-cycle) for details about product states.
///
/// #### finish a purchase
///
/// Once the transaction is approved, the product still isn't owned: the store needs
/// confirmation that the purchase was delivered before closing the transaction.
///
/// To confirm delivery, you'll use the [`product.finish()`](#finish) method.
///
/// #### example usage
///
/// During initialization:
/// ```js
/// store.when("extra chapter").approved(function(product) {
///     // download the feature
///     app.downloadExtraChapter().then(function() {
///         product.finish();
///     });
/// });
/// ```
///
/// When the purchase button is clicked:
/// ```js
/// store.order("full version");
/// ```
///
/// #### un-finished purchases
///
/// If your app wasn't able to deliver the content, `product.finish()` won't be called.
///
/// Don't worry: the `approved` event will be re-triggered the next time you
/// call [`store.refresh()`](#refresh), which can very well be the next time
/// the application starts. Pending transactions are persistant.
///
/// #### simple case
///
/// In the most simple case, where:
///
///  - delivery of purchases is only local ;
///  - you don't want to implement receipt validation ;
///
/// you may just want to finish all purchases automatically. You can do it this way:
/// ```js
/// store.when("product").approved(function(p) {
///     p.finish();
/// });
/// ```
///
/// NOTE: the "product" query will match any purchases (see [here](#queries) to learn more details about queries).
///
/// ### Receipt validation
///
/// Some unthoughtful users will try to use fake "purchases" to access features
/// they should normally pay for. If that's a concern, you should implement
/// receipt validation, ideally server side validation.
///
/// When a purchase has been approved by the store, it's enriched with
/// [transaction](#transactions) information (`product.transaction` attribute).
///
/// To verfify a purchase you'll have to do three things:
///
///  - configure the [validator](#validator).
///  - call [`product.verify()`](#verify) from the `approved` event,
///    before finishing the transaction.
///  - finish the transaction when transaction is `verified`.
///
/// #### example using a validation URL
///
/// ```js
/// store.validator = "http://192.168.0.7:1980/check-purchase";
///
/// store.when("my stuff").approved(function(product) {
///     product.verify();
/// });
///
/// store.when("my stuff").verified(function(product) {
///     product.finish();
/// });
/// ```
///
/// For an example using a validation callback instead, see the documentation of [the validator method](#validator).
///
/// ### Subscriptions
///
/// For subscription, you MUST implement remote [receipt validation](#receipt-validation).
///
/// If the validator returns a `store.PURCHASE_EXPIRED` error code, the subscription will
/// automatically loose its `owned` status.
///
/// Typically, you'll enable and disable access to your content this way.
/// ```js
/// store.when("cc.fovea.subcription").updated(function(product) {
///     if (product.owned)
///         app.subscriberMode();
///     else
///         app.guestMode();
/// });
/// ```

// ### Security
//
// You will initiate a purchase with `store.order("product.id")`.
//
// 99% of the times, the purchase will be approved immediately by billing system.
//
// However, connection can be lost between you sending a purchase request
// and the server answering to you. In that case, the purchase shouldn't
// be lost (because the user paid for it), that's why the store will notify
// you of an approved purchase during the next application startup.
//
// The same can also happen if the user bought a product from another device, using his
// same account.
//
// For that reason, you should register all your features-unlocking listeners at
// startup, before the first call to `store.refresh()`
//

///
/// # <a name="store"></a>*store* object ##
///
/// `store` is the global object exported by the purchase plugin.
///
/// As with any other plugin, this object shouldn't be used before
/// the "deviceready" event is fired. Check cordova's documentation
/// for more details if needed.
///
/// Find below all public attributes and methods you can use.
///
var store = {};

/// ## <a name="verbosity"></a>*store.verbosity*
///
/// The `verbosity` property defines how much you want `store.js` to write on the console. Set to:
///
///  - `store.QUIET` or `0` to disable all logging (default)
///  - `store.ERROR` or `1` to show only error messages
///  - `store.WARNING` or `2` to show warnings and errors
///  - `store.INFO` or `3` to also show information messages
///  - `store.DEBUG` or `4` to enable internal debugging messages.
///
/// See the [logging levels](#logging-levels) constants.
store.verbosity = 0;

/// ## <a name="sandbox"></a>*store.sandbox*
///
/// The `sandbox` property defines if you want to invoke the platform purchase sandbox
///
/// - Windows will use the IAP simulator if true (see Windows docs)
/// - Android: NOT IN USE
/// - iOS: NOT IN USE
store.sandbox = false;

(function(){
'use strict';

///
/// ## Constants
///

///
/// ### product types
///
/*///*/     store.FREE_SUBSCRIPTION         = "free subscription";
/*///*/     store.PAID_SUBSCRIPTION         = "paid subscription";
/*///*/     store.NON_RENEWING_SUBSCRIPTION = "non renewing subscription";
/*///*/     store.CONSUMABLE                = "consumable";
/*///*/     store.NON_CONSUMABLE            = "non consumable";

///
/// ### error codes
///

// KEEP SYNCHRONIZED with git_modules/android_iap/v3/src/android/com/smartmobilesoftware/util/IabHelper.java
// KEEP SYNCHRONIZED with src/ios/InAppPurchase.m

var ERROR_CODES_BASE = 6777000;
/*///*/     store.ERR_SETUP               = ERROR_CODES_BASE + 1; //
/*///*/     store.ERR_LOAD                = ERROR_CODES_BASE + 2; //
/*///*/     store.ERR_PURCHASE            = ERROR_CODES_BASE + 3; //
/*///*/     store.ERR_LOAD_RECEIPTS       = ERROR_CODES_BASE + 4;
/*///*/     store.ERR_CLIENT_INVALID      = ERROR_CODES_BASE + 5;
/*///*/     store.ERR_PAYMENT_CANCELLED   = ERROR_CODES_BASE + 6; // Purchase has been cancelled by user.
/*///*/     store.ERR_PAYMENT_INVALID     = ERROR_CODES_BASE + 7; // Something suspicious about a purchase.
/*///*/     store.ERR_PAYMENT_NOT_ALLOWED = ERROR_CODES_BASE + 8;
/*///*/     store.ERR_UNKNOWN             = ERROR_CODES_BASE + 10; //
/*///*/     store.ERR_REFRESH_RECEIPTS    = ERROR_CODES_BASE + 11;
/*///*/     store.ERR_INVALID_PRODUCT_ID  = ERROR_CODES_BASE + 12; //
/*///*/     store.ERR_FINISH              = ERROR_CODES_BASE + 13;
/*///*/     store.ERR_COMMUNICATION       = ERROR_CODES_BASE + 14; // Error while communicating with the server.
/*///*/     store.ERR_SUBSCRIPTIONS_NOT_AVAILABLE = ERROR_CODES_BASE + 15; // Subscriptions are not available.
/*///*/     store.ERR_MISSING_TOKEN       = ERROR_CODES_BASE + 16; // Purchase information is missing token.
/*///*/     store.ERR_VERIFICATION_FAILED = ERROR_CODES_BASE + 17; // Verification of store data failed.
/*///*/     store.ERR_BAD_RESPONSE        = ERROR_CODES_BASE + 18; // Verification of store data failed.
/*///*/     store.ERR_REFRESH             = ERROR_CODES_BASE + 19; // Failed to refresh the store.
/*///*/     store.ERR_PAYMENT_EXPIRED     = ERROR_CODES_BASE + 20;
/*///*/     store.ERR_DOWNLOAD            = ERROR_CODES_BASE + 21;

///
/// ### product states
///
/*///*/     store.REGISTERED = 'registered';
/*///*/     store.INVALID    = 'invalid';
/*///*/     store.VALID      = 'valid';
/*///*/     store.REQUESTED  = 'requested';
/*///*/     store.INITIATED  = 'initiated';
/*///*/     store.APPROVED   = 'approved';
/*///*/     store.FINISHED   = 'finished';
/*///*/     store.OWNED      = 'owned';
/*///*/     store.DOWNLOADING = 'downloading';
/*///*/     store.DOWNLOADED = 'downloaded';

///
/// ### logging levels
///
/*///*/     store.QUIET   = 0;
/*///*/     store.ERROR   = 1;
/*///*/     store.WARNING = 2;
/*///*/     store.INFO    = 3;
/*///*/     store.DEBUG   = 4;

///
/// ### validation error codes
///
/*///*/     store.INVALID_PAYLOAD   = 6778001;
/*///*/     store.CONNECTION_FAILED = 6778002;
/*///*/     store.PURCHASE_EXPIRED  = 6778003;

})();
(function() {
'use strict';

function defer(thisArg, cb, delay) {
    setTimeout(function() {
        cb.call(thisArg);
    }, delay || 1);
}
var delay = defer;

/// ## <a name="product"></a>*store.Product* object ##
///
/// Most events methods give you access to a `product` object.

store.Product = function(options) {

    if (!options)
        options = {};

    ///
    /// Products object have the following fields and methods.
    ///
    /// ### *store.Product* public attributes
    ///

    ///  - `product.id` - Identifier of the product on the store
    this.id = options.id || null;

    ///  - `product.alias` - Alias that can be used for more explicit [queries](#queries)
    this.alias = options.alias || options.id || null;

    ///  - `product.type` - Family of product, should be one of the defined [product types](#product-types).
    var type = this.type = options.type || null;
    if (type !== store.CONSUMABLE && type !== store.NON_CONSUMABLE && type !== store.PAID_SUBSCRIPTION && type !== store.FREE_SUBSCRIPTION && type !== store.NON_RENEWING_SUBSCRIPTION)
        throw new TypeError("Invalid product type");

    ///  - `product.state` - Current state the product is in (see [life-cycle](#life-cycle) below). Should be one of the defined [product states](#product-states)
    this.state = options.state || "";

    ///  - `product.title` - Localized name or short description
    this.title = options.title || options.localizedTitle || null;

    ///  - `product.description` - Localized longer description
    this.description = options.description || options.localizedDescription || null;

    ///  - `product.price` - Localized price, with currency symbol
    this.price = options.price || null;

    ///  - `product.currency` - Currency code (optionaly)
    this.currency = options.currency || null;

    //  - `product.localizedTitle` - Localized name or short description ready for display
    // this.localizedTitle = options.localizedTitle || options.title || null;

    //  - `product.localizedDescription` - Localized longer description ready for display
    // this.localizedDescription = options.localizedDescription || options.description || null;

    //  - `product.localizedPrice` - Localized price (with currency) ready for display
    // this.localizedPrice = options.localizedPrice || null;

    ///  - `product.loaded` - Product has been loaded from server, however it can still be either `valid` or not
    this.loaded = options.loaded;

    ///  - `product.valid` - Product has been loaded and is a valid product
    this.valid  = options.valid;

    ///  - `product.canPurchase` - Product is in a state where it can be purchased
    this.canPurchase = options.canPurchase;

    ///  - `product.owned` - Product is owned
    this.owned = options.owned;

    ///  - `product.downloading` - Product is downloading non-consumable content
    this.downloading = options.downloading;

    ///  - `product.downloaded` - Non-consumable content has been successfully downloaded for this product
    this.downloaded = options.downloaded;

    ///  - `product.transaction` - Latest transaction data for this product (see [transactions](#transactions)).
    this.transaction = null;

    this.stateChanged();
};

///
/// ### *store.Product* public methods
///

/// #### <a name="finish"></a>`product.finish()` ##
///
/// Call `product.finish()` to confirm to the store that an approved order has been delivered.
/// This will change the product state from `APPROVED` to `FINISHED` (see [life-cycle](#life-cycle)).
///
/// As long as you keep the product in state `APPROVED`:
///
///  - the money may not be in your account (i.e. user isn't charged)
///  - you will receive the `approved` event each time the application starts,
///    where you should try again to finish the pending transaction.
///
/// ##### example use
/// ```js
/// store.when("product.id").approved(function(product){
///     // synchronous
///     app.unlockFeature();
///     product.finish();
/// });
/// ```
///
/// ```js
/// store.when("product.id").approved(function(product){
///     // asynchronous
///     app.downloadFeature(function() {
///         product.finish();
///     });
/// });
/// ```
store.Product.prototype.finish = function() {
    store.log.debug("product -> defer finishing " + this.id);
    defer(this, function() {
        store.log.debug("product -> finishing " + this.id);
        if (this.state !== store.FINISHED) {
            this.set('state', store.FINISHED);
            // The platform store should now handle the FINISHED event
            // and change the product status to VALID or OWNED.
        }
    });
};

/// #### <a name="verify"></a>`product.verify()` ##
///
/// Initiate purchase validation as defined by the [`store.validator`](#validator).
///
store.Product.prototype.verify = function() {
    var that = this;

    var nRetry = 0;

    // Callbacks set by the Promise
    var noop      = function() {};
    var doneCb    = noop;
    var successCb = noop;
    var expiredCb = noop;
    var errorCb   = noop;

    var tryValidation = function() {

        // No need to verify a which status isn't approved
        // It means it already has been
        if (that.state !== store.APPROVED)
            return;

        store._validator(that, function(success, data) {
            store.log.debug("verify -> " + JSON.stringify(success));
            if (success) {
                store.log.debug("verify -> success: " + JSON.stringify(data));
                store.utils.callExternal('verify.success', successCb, that, data);
                store.utils.callExternal('verify.done', doneCb, that);
                that.trigger("verified");
            }
            else {
                store.log.debug("verify -> error: " + JSON.stringify(data));
                var msg = (data && data.error && data.error.message ? data.error.message : '');
                var err = new store.Error({
                    code: store.ERR_VERIFICATION_FAILED,
                    message: "Transaction verification failed: " + msg
                });
                if (data.code === store.PURCHASE_EXPIRED) {
                    err = new store.Error({
                        code: store.ERR_PAYMENT_EXPIRED,
                        message: "Transaction expired: " + msg
                    });
                }
                if (data.code === store.PURCHASE_EXPIRED) {
                    if (nRetry < 2 && store._refreshForValidation) {
                        nRetry += 1;
                        store._refreshForValidation(function() {
                            delay(that, tryValidation, 300);
                        });
                    }
                    else {
                        store.error(err);
                        store.utils.callExternal('verify.error', errorCb, err);
                        store.utils.callExternal('verify.done', doneCb, that);
                        that.trigger("expired");
                        that.set("state", store.VALID);
                        store.utils.callExternal('verify.expired', expiredCb, that);
                    }
                }
                else if (nRetry < 4) {
                    // It failed... let's try one more time. Maybe the appStoreReceipt wasn't updated yet.
                    nRetry += 1;
                    delay(this, tryValidation, 1000 * nRetry * nRetry);
                }
                else {
                    store.log.debug("validation failed 5 times, stop retrying, trigger an error");
                    store.error(err);
                    store.utils.callExternal('verify.error', errorCb, err);
                    store.utils.callExternal('verify.done', doneCb, that);
                    that.trigger("unverified");
                }
            }
        });
    };

    defer(this, function() {
        if (that.state !== store.APPROVED) {
            var err = new store.Error({
                code: store.ERR_VERIFICATION_FAILED,
                message: "Product isn't in the APPROVED state"
            });
            store.error(err);
            store.utils.callExternal('verify.error', errorCb, err);
            store.utils.callExternal('verify.done', doneCb, that);
            return;
        }
    });

    // For some reason, the appStoreReceipt isn't always immediately available.
    delay(this, tryValidation, 1000);

    /// ##### return value
    /// A Promise with the following methods:
    ///
    var ret = {
        ///  - `done(function(product){})`
        ///    - called whether verification failed or succeeded.
        done:    function(cb) { doneCb = cb;    return this; },
        ///  - `expired(function(product){})`
        ///    - called if the purchase expired.
        expired: function(cb) { expiredCb = cb; return this; },
        ///  - `success(function(product, purchaseData){})`
        ///    - called if the purchase is valid and verified.
        ///    - `purchaseData` is the device dependent transaction details
        ///      returned by the validator, which you can most probably ignore.
        success: function(cb) { successCb = cb; return this; },
        ///  - `error(function(err){})`
        ///    - validation failed, either because of expiry or communication
        ///      failure.
        ///    - `err` is a [store.Error object](#errors), with a code expected to be
        ///      `store.ERR_PAYMENT_EXPIRED` or `store.ERR_VERIFICATION_FAILED`.
        error:   function(cb) { errorCb = cb;   return this; }
    };
    ///

    return ret;
};

///
/// ### life-cycle
///
/// A product will change state during the application execution.
///
/// Find below a diagram of the different states a product can pass by.
///
///     REGISTERED +--> INVALID
///                |
///                +--> VALID +--> REQUESTED +--> INITIATED +-+
///                                                           |
///                     ^      +------------------------------+
///                     |      |
///                     |      |             +--> DOWNLOADING +--> DOWNLOADED +
///                     |      |             |                                |
///                     |      +--> APPROVED +--------------------------------+--> FINISHED +--> OWNED
///                     |                                                             |
///                     +-------------------------------------------------------------+
///
/// #### states definitions
///
///  - `REGISTERED`: right after being declared to the store using [`store.register()`](#register)
///  - `INVALID`: the server didn't recognize this product, it cannot be used.
///  - `VALID`: the server sent extra information about the product (`title`, `price` and such).
///  - `REQUESTED`: order (purchase) requested by the user
///  - `INITIATED`: order transmitted to the server
///  - `APPROVED`: purchase approved by server
///  - `FINISHED`: purchase delivered by the app (see [Finish a Purchase](#finish-a-purchase))
///  - `OWNED`: purchase is owned (only for non-consumable and subscriptions)
///  - `DOWNLOADING` purchased content is downloading (only for non-consumable)
///  - `DOWNLOADED` purchased content is downloaded (only for non-consumable)
///
/// #### Notes
///
///  - When finished, a consumable product will get back to the `VALID` state, while other will enter the `OWNED` state.
///  - Any error in the purchase process will bring a product back to the `VALID` state.
///  - During application startup, products may go instantly from `REGISTERED` to `APPROVED` or `OWNED`, for example if they are purchased non-consumables or non-expired subscriptions.
///  - Non-Renewing Subscriptions are iOS products only. Please see the [iOS Non Renewing Subscriptions documentation](https://github.com/j3k0/cordova-plugin-purchase/blob/master/doc/ios.md#non-renewing) for a detailed explanation.
///
/// #### state changes
///
/// Each time the product changes state, appropriate events is triggered.
///
/// Learn more about events [here](#events) and about listening to events [here](#when).
///

})();
(function(){
'use strict';

///
/// ## <a name="errors"></a>*store.Error* object
///
/// All error callbacks takes an `error` object as parameter.

store.Error = function(options) {

    if (!options)
        options = {};

    ///
    /// Errors have the following fields:
    ///

    ///  - `error.code` - An integer [error code](#error-codes). See the [error codes](#error-codes) section for more details.
    this.code = options.code || store.ERR_UNKNOWN;

    ///  - `error.message` - Human readable message string, useful for debugging.
    this.message = options.message || "unknown error";
    ///
};

/// ## <a name="error"></a>*store.error(callback)*
///
/// Register an error handler.
///
/// `callback` is a function taking an [error](#errors) as argument.
///
/// ### example use:
///
///     store.error(function(e){
///         console.log("ERROR " + e.code + ": " + e.message);
///     });
///
store.error = function(cb, altCb) {

    var ret = cb;

    if (cb instanceof store.Error) {
        store.error.callbacks.trigger(cb);
    }
    else if (typeof cb === "function") {
        store.error.callbacks.push(cb);
    }

    /// ### alternative usage
    ///
    ///  - `store.error(code, callback)`
    ///    - only call the callback for errors with the given error code.
    ///    - **example**: `store.error(store.ERR_SETUP, function() { ... });`
    else if (typeof altCb === "function") {
        ret = function(err) {
            if (err.code === cb)
                altCb();
        };
        store.error(ret);
    }
    else if (cb.code && cb.message) {
        store.error.callbacks.trigger(new store.Error(cb));
    }
    else if (cb.code) {
        // error message is null(unknown error)
        store.error.callbacks.trigger(new store.Error(cb));
    }
    ///

   return ret;
};

/// ### unregister the error callback
/// To unregister the callback, you will use [`store.off()`](#off):
/// ```js
/// var handler = store.error(function() { ... } );
/// ...
/// store.off(handler);
/// ```
///

// Unregister a callback registered with `store.error`
// this method is called by `store.off`.
store.error.unregister = function(cb) {
    store.error.callbacks.unregister(cb);
};

})();

(function() {
"use strict";

/// ## <a name="register"></a>*store.register(product)*
/// Add (or register) a product into the store.
///
/// A product can't be used unless registered first!
///
/// Product is an object with fields :
///
///  - `id`
///  - `type`
///  - `alias` (optional)
///
/// See documentation for the [product](#product) object for more information.
///
store.register = function(product) {
    if (!product)
        return;
    if (!product.length)
        store.register([product]);
    else
        registerProducts(product);
};

/// ##### example usage
///
/// ```js
/// store.register({
///     id: "cc.fovea.inapp1",
///     alias: "full version",
///     type: store.NON_CONSUMABLE
/// });
/// ```
///

// ## <a name="registerProducts"></a>*registerProducts(products)*
// Adds (or register) products into the store. Products can't be used
// unless registered first!
//
// Products is an array of object with fields :
//
//  - `id`
//  - `type`
//  - `alias` (optional)
//
// See documentation for the [product](#product) object for more information.
function registerProducts(products) {
    for (var i = 0; i < products.length; ++i) {
        products[i].state = store.REGISTERED;
        var p = new store.Product(products[i]);
        if (!p.alias)
            p.alias = p.id;

        // Check if id or alias contain filtered-out keywords
        if (p.id !== store._queries.uniqueQuery(p.id))
            continue;
        if (p.alias !== store._queries.uniqueQuery(p.alias))
            continue;

        if (hasKeyword(p.id) || hasKeyword(p.alias))
            continue;

        store.products.push(p);
    }
}

///
/// ### Reserved keywords
/// Some reserved keywords can't be used in the product `id` and `alias`:
var keywords = [      ///
    'product',        ///  - `product`
    'order',          ///  - `order`
    store.REGISTERED, ///  - `registered`
    store.VALID,      ///  - `valid`
    store.INVALID,    ///  - `invalid`
    store.REQUESTED,  ///  - `requested`
    store.INITIATED,  ///  - `initiated`
    store.APPROVED,   ///  - `approved`
    store.OWNED,      ///  - `owned`
    store.FINISHED,   ///  - `finished`
    store.DOWNLOADING,///  - `downloading`
    store.DOWNLOADED, ///  - `downloaded`
    'refreshed'       ///  - `refreshed`
];                    ///

function hasKeyword(string) {
    if (!string)
        return false;
    var tokens = string.split(' ');
    for (var i = 0; i < tokens.length; ++i) {
        var token = tokens[i];
        for (var j = 0; j < keywords.length; ++j) {
            if (token === keywords[j])
                return true;
        }
    }
    return false;
}

})();
(function() {
"use strict";

/// ## <a name="get"></a>*store.get(id)*
/// Retrieve a [product](#product) from its `id` or `alias`.
///
/// ##### example usage
//
/// ```js
///     var product = store.get("cc.fovea.product1");
/// ```
///
store.get = function(id) {
    var product = store.products.byId[id] || store.products.byAlias[id];
    return product;
};

})();
(function(){
'use strict';

/// ## <a name="when"></a>*store.when(query)*
///
/// Register a callback for a product-related event.
///
store.when = function(query, once, callback) {

    // No arguments, will match all products.
    if (typeof query === 'undefined')
        query = '';

    // In case the first arguemnt is a product, convert to its id
    if (typeof query === 'object' && query instanceof store.Product)
        query = query.id;

    if (typeof once === 'function') {
        return store.when("", query, once);
    }
    else if (typeof once !== 'string') {

        var ret = {};
        var addPromise = function(name) {
            ret[name] = function(cb) {
                store._queries.callbacks.add(query, name, cb, once);
                return this;
            };
        };

        ///
        /// ### return value
        ///
        /// Return a Promise with methods to register callbacks for
        /// product events defined below.
        ///
        /// #### events
        ///

        ///  - `loaded(product)`
        ///    - Called when [product](#product) data is loaded from the store.
        addPromise('loaded');

        ///  - `updated(product)`
        ///    - Called when any change occured to a product.
        addPromise('updated');

        ///  - `error(err)`
        ///    - Called when an [order](#order) failed.
        ///    - The `err` parameter is an [error object](#errors)
        addPromise('error');

        ///  - `approved(product)`
        ///    - Called when a product [order](#order) is approved.
        addPromise('approved');

        ///  - `owned(product)`
        ///    - Called when a non-consumable product or subscription is owned.
        addPromise('owned');

        ///  - `cancelled(product)`
        ///    - Called when a product [order](#order) is cancelled by the user.
        addPromise('cancelled');

        ///  - `refunded(product)`
        ///    - Called when an order is refunded by the user.
        addPromise('refunded');

        ///  - Actually, all other product states have their promise
        ///    - `registered`, `valid`, `invalid`, `requested`,
        ///      `initiated` and `finished`
        addPromise('registered');
        addPromise('valid');
        addPromise('invalid');
        addPromise('requested');
        addPromise('initiated');
        addPromise('finished');

        ///  - `verified(product)`
        ///    - Called when receipt validation successful
        addPromise('verified');

        ///  - `unverified(product)`
        ///    - Called when receipt verification failed
        addPromise('unverified');

        ///  - `expired(product)`
        ///    - Called when validation find a subscription to be expired
        addPromise('expired');

        ///  - `downloading(product, progress, time_remaining)`
        ///    - Called when content download is started
        addPromise("downloading");

        ///  - `downloaded(product)`
        ///    - Called when content download has successfully completed
        addPromise("downloaded");

        return ret;
    }
    else {
        ///
        /// ### alternative usage
        ///
        ///  - `store.when(query, action, callback)`
        ///    - Register a callback using its action name. Beware that this is more
        ///      error prone, as there are not gonna be any error in case of typos.
        ///
        /// ```js
        /// store.when("cc.fovea.inapp1", "approved", function(product) { ... });
        /// ```
        ///
        var action = once;
        store._queries.callbacks.add(query, action, callback);
    }
};

/// ### unregister a callback
///
/// To unregister a callback, use [`store.off()`](#off).
///

// Remove any callbacks registered with `when`
store.when.unregister = function(cb) {
    store._queries.callbacks.unregister(cb);
};

///
/// ## queries
///
/// The [`when`](#when) and [`once`](#once) methods take a `query` parameter.
/// Those queries allow to select part of the products (or orders) registered
/// into the store and get notified of events related to those products.
///
/// No filters:
///
///  - `"product"` or `"order"` - for all products.
///
/// Filter by product types:
///
///  - `"consumable"` - all consumable products.
///  - `"non consumable"` - all non consumable products.
///  - `"subscription"` - all subscriptions.
///  - `"free subscription"` - all free subscriptions.
///  - `"paid subscription"` - all paid subscriptions.
///
/// Filter by product state:
///
///  - `"valid"` - all products in the VALID state.
///  - `"invalid"` - all products in the INVALID state.
///  - `"owned"` - all products in the INVALID state.
///  - etc. (see [here](#product-states) for all product states).
///
/// Filter individual products:
///
///  - `"PRODUCT_ID"` - product with the given product id (replace by your own product id)
///  - `"ALIAS"` - product with the given alias
///
/// Notice that you can add the "product" and "order" keywords anywhere in your query,
/// it won't change anything but may seem nicer to read.
///
/// #### example
///
///  - `"consumable order"` - all consumable products
///  - `"full version"` - the `alias` of a registered [`product`](#product)
///  - `"order cc.fovea.inapp1"` - the `id` of a registered [`product`](#product)
///    - equivalent to just `"cc.fovea.inapp1"`
///  - `"invalid product"` - an invalid product
///    - equivalent to just `"invalid"`
///

})();
(function(){
"use strict";

/// ## <a name="once"></a>*store.once(query)*
///
/// Identical to [`store.when`](#when), but the callback will be called only once.
/// After being called, the callback will be unregistered.
store.once = function(query, action, callback) {
    if (typeof action === 'function') {
        return store.when(query, action, true);
    }
    else if (typeof action === 'undefined') {
        return store.when(query, true);
    }
    else {
        ///
        /// ### alternative usage
        ///
        ///  - `store.once(query, action, callback)`
        ///    - Same remarks as `store.when(query, action, callback)`
        ///
        store._queries.callbacks.add(query, action, callback, true);
    }
};

store.once.unregister = store.when.unregister;

})();
(function() {
"use strict";

// Store all pending callbacks, prevents promises to be called multiple times.
var callbacks = {};

// Next call to `order` will store its callbacks using this ID, then increment the ID.
var callbackId = 0;

///
/// ## <a name="order"></a>*store.order(product)*
///
/// Initiate the purchase of a product.
///
/// The `product` argument can be either:
///
///  - the `store.Product` object
///  - the product `id`
///  - the product `alias`
///
/// See the ["Purchasing section"](#purchasing) to learn more about
/// the purchase process.
///
store.order = function(pid) {

    var p = pid;

    if (typeof pid === "string") {
        p = store.products.byId[pid] || store.products.byAlias[pid];
        if (!p) {
            p = new store.Product({
                id: pid,
                loaded: true,
                valid: false
            });
        }
    }

    var localCallbackId = callbackId++;
    var localCallback = callbacks[localCallbackId] = {};

    function done() {
        delete localCallback.then;
        delete localCallback.error;
        delete callbacks[localCallbackId];
    }

    // Request the purchase.
    store.ready(function() {
        p.set("state", store.REQUESTED);
    });

    /// ### return value
    ///
    /// `store.order()` returns a Promise with the following methods:
    ///
    return {
        ///  - `then` - called when the order was successfully initiated
        then: function(cb) {
            localCallback.then = cb;
            store.once(p.id, "initiated", function() {
                if (!localCallback.then)
                    return;
                done();
                cb(p);
            });
            return this;
        },

        ///  - `error` - called if the order couldn't be initiated
        error: function(cb) {
            localCallback.error = cb;
            store.once(p.id, "error", function(err) {
                if (!localCallback.error)
                    return;
                done();
                cb(err);
            });
            return this;
        }
    };
    ///
};

///
/// As usual, you can unregister the callbacks by using [`store.off()`](#off).
///

// Remove pending callbacks registered with `order`
store.order.unregister = function(cb) {
    for (var i in callbacks) {
        if (callbacks[i].then === cb)
            delete callbacks[i].then;
        if (callbacks[i].error === cb)
            delete callbacks[i].error;
    }
};

})();
(function() {
"use strict";

var isReady = false;

var callbacks = [];

/// ## <a name="ready"></a>*store.ready(callback)*
/// Register the `callback` to be called when the store is ready to be used.
///
/// If the store is already ready, `callback` is executed immediately.
///
/// `store.ready()` without arguments will return the `ready` status.
///
store.ready = function (cb) {

    /// ### alternate usage (internal)
    ///
    /// `store.ready(true)` will set the `ready` status to true,
    /// and call the registered callbacks.
    if (cb === true) {
        if (isReady) return this;
        isReady = true;
        for (var i = 0; i < callbacks.length; ++i)
            store.utils.callExternal('ready.callback', callbacks[i]);
        callbacks = [];
    }
    else if (cb) {
        if (isReady) {
            // defer execution to prevent falsy belief that code works
            // whereas it only works synchronously.
            setTimeout(function() {
                store.utils.callExternal('ready.callback', cb);
            }, 1);
            return this;
        }
        else {
            callbacks.push(cb);
        }
    }
    else {
        return isReady;
    }
    return this;
};

// Remove any callbacks registered with `ready`
store.ready.unregister = function(cb) {
    callbacks = callbacks.filter(function(o) {
        return o !== cb;
    });
};

store.ready.reset = function() {
    isReady = false;
    callbacks = [];
};

})();
(function() {
"use strict";

/// ## <a name="off"></a>*store.off(callback)*
/// Unregister a callback. Works for callbacks registered with `ready`, `when`, `once` and `error`.
///
/// Example use:
///
/// ```js
///     var fun = function(product) {
///         // Product loaded while the store screen is visible.
///         // Refresh some stuff.
///     };
///
///     store.when("product").loaded(fun);
///     ...
///     [later]
///     ...
///     store.off(fun);
/// ```
///
store.off = function(callback) {

    // Unregister from `ready`
    store.ready.unregister(callback);

    // Unregister from `when` and `once`
    store.when.unregister(callback);

    // Unregister from `order`
    store.order.unregister(callback);

    // Unregister from `error`
    store.error.unregister(callback);
};

})();
(function() {
'use strict';

/// ## <a name="validator"></a> *store.validator*
/// Set this attribute to either:
///
///  - the URL of your purchase validation service
///     - Fovea's [reeceipt](http://reeceipt.fovea.cc) or your own service.
///  - a custom validation callback method
///
/// #### example usage
///
/// ```js
/// store.validator = "http://store.fovea.cc:1980/check-purchase";
/// ```
///
/// ```js
/// store.validator = function(product, callback) {
///
///     callback(true, { ... transaction details ... }); // success!
///
///     // OR
///     callback(false, {
///         error: {
///             code: store.PURCHASE_EXPIRED,
///             message: "XYZ"
///         }
///     });
///
///     // OR
///     callback(false, "Impossible to proceed with validation");
///
///     // Here, you will typically want to contact your own webservice
///     // where you check transaction receipts with either Apple or
///     // Google servers.
/// });
/// ```
/// Validation error codes are [documented here](#validation-error-codes).
store.validator = null;

//
// ## store._validator
//
// Execute the internal validation call, either to a webservice
// or to the provided callback.
//
// Also makes sure to refresh the receipts.
//
store._validator = function(product, callback, isPrepared) {
    if (!store.validator)
        callback(true, product);

    if (store._prepareForValidation && isPrepared !== true) {
        store._prepareForValidation(product, function() {
            store._validator(product, callback, true);
        });
        return;
    }

    if (typeof store.validator === 'string') {
        store.utils.ajax({
            url: store.validator,
            method: 'POST',
            data: product,
            success: function(data) {
                callback(data && data.ok, data.data);
            },
            error: function(status, message) {
                callback(false, "Error " + status + ": " + message);
            }
        });
    }
    else {
        store.validator(product, callback);
    }
};

///
/// ## transactions
///
/// A purchased product will contain transaction information that can be
/// sent to a remote server for validation. This information is stored
/// in the `product.transaction` field. It has the following format:
///
/// - `type`: "ios-appstore" or "android-playstore"
/// - store specific data
///
/// Refer to [this documentation for iOS](https://developer.apple.com/library/ios/releasenotes/General/ValidateAppStoreReceipt/Chapters/ReceiptFields.html#//apple_ref/doc/uid/TP40010573-CH106-SW1).
///
/// Start [here for Android](https://developer.android.com/google/play/billing/billing_integrate.html#billing-security).
///
/// Another option is to use [Fovea's reeceipt validation service](http://reeceipt.fovea.cc/) that implements all the best practices to secure your transactions.
///

})();
(function() {
'use strict';

/// ## <a name="refresh"></a>*store.refresh()*
///
/// After you're done registering your store's product and events handlers,
/// time to call `store.refresh()`.
///
/// This will initiate all the complex behind-the-scene work, to load product
/// data from the servers and restore whatever already have been
/// purchased by the user.
///
/// Note that you can call this method again later during the application
/// execution to re-trigger all that hard-work. It's kind of expensive in term of
/// processing, so you'd better consider it twice.
///
/// One good way of doing it is to add a "Refresh Purchases" button in your
/// applications settings. This way, if delivery of a purchase failed or
/// if a user wants to restore purchases he made from another device, he'll
/// have a way to do just that.
///
/// ##### example usage
///
/// ```js
///    // ...
///    // register products and events handlers here
///    // ...
///    //
///    // then and only then, call refresh.
///    store.refresh();
/// ```
///
/// ##### restore purchases example usage
///
/// Add a "Refresh Purchases" button to call the `store.refresh()` method, like:
///
/// `<button onclick="store.refresh()">Restore Purchases</button>`
///
/// To make the restore purchases work as expected, please make sure that
/// the "approved" event listener had be registered properly,
/// and in the callback `product.finish()` should be called.
///

var initialRefresh = true;

store.refresh = function() {

    store.trigger("refreshed");
    if (initialRefresh) {
        initialRefresh = false;
        return;
    }

    store.log.debug("refresh -> checking products state (" + store.products.length + " products)");
    for (var i = 0; i < store.products.length; ++i) {
        var p = store.products[i];
        store.log.debug("refresh -> product id " + p.id + " (" + p.alias + ")");
        store.log.debug("           in state '" + p.state + "'");

        // resend the "approved" event to all approved purchases.
        // give user a chance to try delivering the content again and
        // finish the purchase.
        if (p.state === store.APPROVED)
            p.trigger(store.APPROVED);

        // also send back subscription to approved so their expiry date gets validated again
        // BEWARE. If user is offline, he won't be able to access the content
        // because validation will fail with a connection timeout.
        else if (p.state === store.OWNED && (p.type === store.FREE_SUBSCRIPTION || p.type === store.PAID_SUBSCRIPTION))
            p.set("state", store.APPROVED);
    }

    store.trigger("re-refreshed");
};


})();

(function(){
"use strict";

var logLevel = {};
logLevel[store.ERROR] = "ERROR";
logLevel[store.WARNING] = "WARNING";
logLevel[store.INFO] = "INFO";
logLevel[store.DEBUG] = "DEBUG";

function log(level, o) {
    var maxLevel = (store.verbosity === true ? 1 : store.verbosity);
    if (level > maxLevel)
        return;

    if (typeof o !== 'string')
        o = JSON.stringify(o);

    if (logLevel[level])
        console.log("[store.js] " + logLevel[level] + ": " + o);
    else
        console.log("[store.js] " + o);
}

/// ## *store.log* object
store.log = {

    /// ### `store.log.error(message)`
    /// Logs an error message, only if `store.verbosity` >= store.ERROR
    error: function(o) { log(store.ERROR, o); },

    /// ### `store.log.warn(message)`
    /// Logs a warning message, only if `store.verbosity` >= store.WARNING
    warn: function(o) { log(store.WARNING, o); },

    /// ### `store.log.info(message)`
    /// Logs an info message, only if `store.verbosity` >= store.INFO
    info: function(o) { log(store.INFO, o); },

    /// ### `store.log.debug(message)`
    /// Logs a debug message, only if `store.verbosity` >= store.DEBUG
    debug: function(o) { log(store.DEBUG, o); }
};

})();

///
/// # internal APIs
/// USE AT YOUR OWN RISKS

(function() {
"use strict";

/// ## *store.products* array ##
/// Array of all registered products
///
/// #### example
///
///     store.products[0]
store.products = [];

/// ### *store.products.push(product)*
/// Acts like the Array `push` method, but also adds
/// the product to the [byId](#byId) and [byAlias](#byAlias) objects.
store.products.push = function(p) {
    Array.prototype.push.call(this, p);
    this.byId[p.id] = p;
    this.byAlias[p.alias] = p;
};

/// ### <a name="byId"></a>*store.products.byId* dictionary
/// Registered products indexed by their ID
///
/// #### example
///
///     store.products.byId["cc.fovea.inapp1"]
store.products.byId = {};

/// ### <a name="byAlias"></a>*store.products.byAlias* dictionary
/// Registered products indexed by their alias
///
/// #### example
///
///     store.products.byAlias["full version"]```
store.products.byAlias = {};

//
// ### *store.products.reset()*
//
// Remove all products (for testing only).
store.products.reset = function() {
    while (this.length > 0)
        this.shift();
    this.byAlias = {};
    this.byId = {};
};

})();
(function() {
"use strict";

store.Product.prototype.set = function(key, value) {
    if (typeof key === 'string') {
        this[key] = value;
        if (key === 'state')
            this.stateChanged();
    }
    else {
        var options = key;
        for (key in options) {
            value = options[key];
            this.set(key, value);
        }
    }
};

store.Product.prototype.stateChanged = function() {

    // update some properties useful to the user
    // to make sense of the product state without writing
    // complex conditions.

    this.canPurchase = this.state === store.VALID;
    this.loaded      = this.state && this.state !== store.REGISTERED;
    this.owned       = this.owned || this.state === store.OWNED;
    this.downloading = this.downloading || this.state === store.DOWNLOADING;
    this.downloaded  = this.downloaded || this.state === store.DOWNLOADED;

    // update validity
    this.valid       = this.state !== store.INVALID;
    if (!this.state || this.state === store.REGISTERED)
        delete this.valid;

    if (this.state)
        this.trigger(this.state);
};

/// ### aliases to `store` methods, added for conveniance.
store.Product.prototype.on = function(event, cb) {
    store.when(this.id, event, cb);
};
store.Product.prototype.once = function(event, cb) {
    store.once(this.id, event, cb);
};
store.Product.prototype.off = function(cb) {
    store.when.unregister(cb);
};
store.Product.prototype.trigger = function(action, args) {
    store.trigger(this, action, args);
};

})();
(function(){
'use strict';

///
/// ## *store._queries* object
/// The `queries` object handles the callbacks registered for any given couple
/// of [query](#queries) and action.
///
/// Internally, the magic is found within the [`triggerWhenProduct`](#triggerWhenProduct)
/// method, which generates for a given product the list of all possible
/// queries that describe the product.
///
/// Queries are generated using the id, alias, type or validity of the product.
///
store._queries = {

    /// ### *store._queries.uniqueQuery(string)*
    /// Transform a human readable query string
    /// into a unique string by filtering out reserved keywords:
    ///
    uniqueQuery: function(string) {
        if (!string)
            return '';
        var query = '';
        var tokens = string.split(' ');
        for (var i = 0; i < tokens.length; ++i) {
            var token = tokens[i];
            if (token !== 'order' &&   ///  - `order`
                token !== 'product') { ///  - `product`
                if (query !== '')
                    query += ' ';
                query += token;
            }
            ///
        }
        return query;
    },

    /// ### *store._queries.callbacks* object
    /// Callbacks registered organized by query strings

    callbacks: {
        /// #### *store._queries.callbacks.byQuery* dictionary
        /// Dictionary of:
        ///
        ///  - *key*: a string equals to `query + " " + action`
        ///  - *value*: array of callbacks
        ///
        /// Each callback have the following attributes:
        ///
        ///  - `cb`: callback *function*
        ///  - `once`: *true* iff the callback should be called only once, then removed from the dictionary.
        ///
        byQuery: {},

        /// #### *store._queries.callbacks.add(query, action, callback, once)*
        /// Simplify the query with `uniqueQuery()`, then add it to the dictionary.
        ///
        /// `action` is concatenated to the `query` string to create the key.
        add: function(query, action, cb, once) {
            var fullQuery = store._queries.uniqueQuery(query ? query + " " + action : action);
            if (this.byQuery[fullQuery])
                this.byQuery[fullQuery].push({cb:cb, once:once});
            else
                this.byQuery[fullQuery] = [{cb:cb, once:once}];
            store.log.debug("queries ++ '" + fullQuery + "'");
        },

        unregister: function(cb) {
            var keep = function(o) {
                return o.cb !== cb;
            };
            for (var i in this.byQuery)
                this.byQuery[i] = this.byQuery[i].filter(keep);
        }
    },

    /// ### *store._queries.triggerAction(action, args)*
    /// Trigger the callbacks registered when a given `action` (string)
    /// happens, unrelated to a product.
    ///
    /// `args` are passed as arguments to the registered callbacks.
    ///
    triggerAction: function(action, args) {

        var cbs = store._queries.callbacks.byQuery[action];
        store.log.debug("queries !! '" + action + "'");
        if (cbs) {
            ///  - Call the callbacks
            for (var j = 0; j < cbs.length; ++j) {
                try {
                    cbs[j].cb.apply(store, args);
                }
                catch (err) {
                    store.utils.logError(action, err);
                }
            }
            ///  - Remove callbacks that needed to be called only once
            store._queries.callbacks.byQuery[action] = cbs.filter(isNotOnce);
        }
        ///
    },

    /// ### *store._queries.triggerWhenProduct(product, action, args)*
    /// Trigger the callbacks registered when a given `action` (string)
    /// happens to a given [`product`](#product).
    ///
    /// `args` are passed as arguments to the registered callbacks.
    ///
    triggerWhenProduct: function(product, action, args) {

        /// The method generates all possible queries for the given `product` and `action`.
        var queries = [];

        ///
        ///  - product.id + " " + action
        if (product && product.id)
            queries.push(product.id + " " + action);
        ///  - product.alias + " " + action
        if (product && product.alias && product.alias !== product.id)
            queries.push(product.alias + " " + action);
        ///  - product.type + " " + action
        if (product && product.type)
            queries.push(product.type + " " + action);
        ///  - "subscription " + action (if type is a subscription)
        if (product && product.type && (product.type === store.FREE_SUBSCRIPTION || product.type === store.PAID_SUBSCRIPTION))
            queries.push("subscription " + action);
        ///  - "valid " + action (if product is valid)
        if (product && product.valid === true)
            queries.push("valid " + action);
        ///  - "invalid " + action (if product is invalid)
        if (product && product.valid === false)
            queries.push("invalid " + action);
        ///  - action
        queries.push(action);

        ///
        /// Then, for each query:
        ///
        var i;
        for (i = 0; i < queries.length; ++i) {
            var q = queries[i];
            store.log.debug("store.queries !! '" + q + "'");
            var cbs = store._queries.callbacks.byQuery[q];
            if (cbs) {
                ///  - Call the callbacks
                for (var j = 0; j < cbs.length; ++j) {
                    try {
                        cbs[j].cb.apply(store, args);
                    }
                    catch (err) {

                        // Generate a store error.
                        store.utils.logError(q, err);

                        // We will throw the exception, but later,
                        // first let all callbacks do their job.
                        deferThrow(err);
                    }
                }
                ///  - Remove callbacks that needed to be called only once
                store._queries.callbacks.byQuery[q] = cbs.filter(isNotOnce);
            }
        }

        ///
        /// **Note**: All events also trigger the `updated` event
        if (action !== "updated" && action !== 'error')
            this.triggerWhenProduct(product, "updated", [ product ]);
    }
    ///

};

// isNotOnce return true iff a callback should be called more than once.
function isNotOnce(cb) {
    return !cb.once;
}

function deferThrow(err) {
    setTimeout(function() { throw err; }, 1);
}

})();
(function() {
"use strict";

/// ## <a name="trigger"></a>*store.trigger(product, action, args)*
///
/// For internal use, trigger an event so listeners are notified.
///
/// It's a conveniance method, that adds flexibility to [`_queries.triggerWhenProduct`](#triggerWhenProduct) by:
///
store.trigger = function(product, action, args) {

    ///  - allowing to trigger events unrelated to products
    ///    - by doing `store.trigger("refreshed")` for example.
    if (!action && !args && typeof product === 'string') {
        store.log.debug("store.trigger -> triggering action " + product);
        store._queries.triggerAction(product);
        return;
    }

    ///  - allowing the `product` argument to be either:
    ///    - a [product](#product)
    ///    - a product `id`
    ///    - a product `alias`
    if (typeof product === "string") {
        product = store.get(product);
        if (!product)
            return;
    }

    ///  - converting the `args` argument to an array if it's not one
    if (typeof args !== 'undefined' && (typeof args !== 'object' || typeof args.length !== 'number')) {
        args = [ args ];
    }

    ///  - adding the product itself as an argument to the event if none were passed
    if (typeof args === 'undefined') {
        args = [ product ];
    }

    ///
    store._queries.triggerWhenProduct(product, action, args);
};

})();
(function(){
'use strict';

///
/// ## *store.error.callbacks* array
///
/// Array of user registered error callbacks.
store.error.callbacks = [];

///
/// ### *store.error.callbacks.trigger(error)*
///
/// Execute all error callbacks with the given `error` argument.
store.error.callbacks.trigger = function(error) {
    for (var i = 0; i < this.length; ++i) {
        try {
            this[i].call(store, error);
        }
        catch (err) {
            store.utils.logError("error", err);
            deferThrow(err);
        }
    }
};

///
/// ### *store.error.callbacks.reset()*
///
/// Remove all error callbacks.
store.error.callbacks.reset = function() {
    while (this.length > 0)
        this.shift();
};

store.error.callbacks.unregister = function(cb) {
    var newArray = this.filter(function(o) {
        return o !== cb;
    });
    if (newArray.length < this.length) {
        this.reset();
        for (var i = 0; i < newArray.length; ++i)
            this.push(newArray[i]);
    }
};

function deferThrow(err) {
    setTimeout(function() { throw err; }, 1);
}

})();
(function(){
"use strict";

/// ## store.utils
store.utils = {

    ///
    /// ### store.utils.logError(context, error)
    /// Add warning logs on a console describing an exceptions.
    ///
    /// This method is mostly used when execting user registered callbacks.
    ///
    /// * `context` is a string describing why the method was called
    /// * `error` is a javascript Error object thrown by a exception
    ///
    logError: function(context, err) {
        store.log.warn("A callback in \'" + context + "\' failed with an exception.");
        if (typeof err === 'string')
            store.log.warn("           " + err);
        else if (err) {
            if (err.fileName)
                store.log.warn("           " + err.fileName + ":" + err.lineNumber);
            if (err.message)
                store.log.warn("           " + err.message);
            if (err.stack)
                store.log.warn("           " + err.stack);
        }
    },

    /// ### store.utils.callExternal(context, callback, ...)
    /// Calls an user-registered callback.
    /// Won't throw exceptions, only logs errors.
    ///
    /// * `name` is a short string describing the callback
    /// * `callback` is the callback to call (won't fail if undefined)
    ///
    /// #### example usage
    /// ```js
    /// store.utils.callExternal("ajax.error", options.error, 404, "Not found");
    /// ```
    callExternal: function(name, callback) {
        try {
            var args = Array.prototype.slice.call(arguments, 2);
            // store.log.debug("calling " + name + "(" + JSON.stringify(args2) + ")");
            if (callback) callback.apply(this, args);
        }
        catch (e) {
            store.utils.logError(name, e);
        }
    },

    ///
    /// ### store.utils.ajax(options)
    /// Simplified version of jQuery's ajax method based on XMLHttpRequest.
    /// Only supports JSON requests.
    ///
    /// Options:
    ///
    /// * `url`:
    /// * `method`: HTTP method to use (GET, POST, ...)
    /// * `success`: callback(data)
    /// * `error`: callback(statusCode, statusText)
    /// * `data`: body of your request
    ///
    ajax: function(options) {
        var doneCb = function(){};
        var xhr = new XMLHttpRequest();
        xhr.open(options.method || 'POST', options.url, true);
        xhr.onreadystatechange = function(/*event*/) {
            try {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        store.utils.callExternal('ajax.success', options.success, JSON.parse(xhr.responseText));
                    }
                    else {
                        store.log.warn("ajax -> request to " + options.url + " failed with status " + xhr.status + " (" + xhr.statusText + ")");
                        store.utils.callExternal('ajax.error', options.error, xhr.status, xhr.statusText);
                    }
                }
            }
            catch (e) {
                store.log.warn("ajax -> request to " + options.url + " failed with an exception: " + e.message);
                if (options.error) options.error(417, e.message);
            }
            if (xhr.readyState === 4)
                store.utils.callExternal('ajax.done', doneCb);
        };
        store.log.debug('ajax -> send request to ' + options.url);
        if (options.data) {
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.send(JSON.stringify(options.data));
        }
        else {
            xhr.send();
        }
        return {
            done: function(cb) { doneCb = cb; return this; }
        };
    }
};

})();
/*
 * Copyright (C) 2012-2013 by Guillaume Charhon
 * Modifications 10/16/2013 by Brian Thurlow
 */
/*global cordova */

(function() {
"use strict";

var log = function (msg) {
    console.log("InAppBilling[js]: " + msg);
};

var InAppBilling = function () {
    this.options = {};
};

InAppBilling.prototype.init = function (success, fail, options, skus) {
	if (!options)
        options = {};

	this.options = {
		showLog: options.showLog !== false
	};

	if (this.options.showLog) {
		log('setup ok');
	}

	var hasSKUs = false;
	//Optional Load SKUs to Inventory.
	if(typeof skus !== "undefined"){
		if (typeof skus === "string") {
			skus = [skus];
		}
		if (skus.length > 0) {
			if (typeof skus[0] !== 'string') {
				var msg = 'invalid productIds: ' + JSON.stringify(skus);
				if (this.options.showLog) {
					log(msg);
				}
				fail(msg, store.ERR_INVALID_PRODUCT_ID);
				return;
			}
			if (this.options.showLog) {
				log('load ' + JSON.stringify(skus));
			}
			hasSKUs = true;
		}
	}

	if (hasSKUs) {
		cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "init", [skus]);
    }
	else {
        //No SKUs
		cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "init", []);
    }
};
InAppBilling.prototype.getPurchases = function (success, fail) {
	if (this.options.showLog) {
		log('getPurchases called!');
	}
	return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "getPurchases", ["null"]);
};
InAppBilling.prototype.buy = function (success, fail, productId) {
	if (this.options.showLog) {
		log('buy called!');
	}
	return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "buy", [productId]);
};
InAppBilling.prototype.subscribe = function (success, fail, productId) {
	if (this.options.showLog) {
		log('subscribe called!');
	}
	return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "subscribe", [productId]);
};
InAppBilling.prototype.consumePurchase = function (success, fail, productId, transactionId) {
	if (this.options.showLog) {
		log('consumePurchase called!');
	}
	return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "consumePurchase", [productId, transactionId]);
};
InAppBilling.prototype.getAvailableProducts = function (success, fail) {
	if (this.options.showLog) {
		log('getAvailableProducts called!');
	}
	return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "getAvailableProducts", ["null"]);
};
InAppBilling.prototype.getProductDetails = function (success, fail, skus) {
	if (this.options.showLog) {
		log('getProductDetails called!');
	}

	if (typeof skus === "string") {
        skus = [skus];
    }
    if (!skus.length) {
        // Empty array, nothing to do.
        return;
    }else {
        if (typeof skus[0] !== 'string') {
            var msg = 'invalid productIds: ' + JSON.stringify(skus);
            log(msg);
			fail(msg, store.ERR_INVALID_PRODUCT_ID);
            return;
        }
        if (this.options.showLog) {
			log('load ' + JSON.stringify(skus));
        }
		cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "getProductDetails", [skus]);
    }
};
InAppBilling.prototype.setTestMode = function (success, fail) {
	if (this.options.showLog) {
		log('setTestMode called!');
	}
	return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "setTestMode", [""]);
};

// Generates a `fail` function that accepts an optional error code
// in the first part of the error string.
//
// format: `code|message`
//
// `fail` function will be called with `message` as a first argument
// and `code` as a second argument (or undefined). This ensures
// backward compatibility with legacy code.
function errorCb(fail) {
    return function(error) {
        if (!fail)
            return;
        var tokens = typeof error === 'string' ? error.split('|') : [ error ];
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

window.inappbilling = new InAppBilling();

// That's for compatibility with the unified IAP plugin.
try {
    store.inappbilling = window.inappbilling;
}
catch (e) {}

})();
(function() {
"use strict";

var initialized = false;
var skus = [];

store.when("refreshed", function() {
    if (!initialized) init();
});

store.when("re-refreshed", function() {
    store.iabGetPurchases();
});

// The following table lists all of the server response codes
// that are sent from Google Play to your application.
//
// Google Play sends the response code synchronously as an integer
// mapped to the RESPONSE_CODE key in the response Bundle.
// Your application must handle all of these response codes.
var BILLING_RESPONSE_RESULT = {
    OK: 0, //   Success
    USER_CANCELED: 1, // User pressed back or canceled a dialog
    SERVICE_UNAVAILABLE: 2, // Network connection is down
    BILLING_UNAVAILABLE: 3, // Billing API version is not supported for the type requested
    ITEM_UNAVAILABLE: 4, // Requested product is not available for purchase
    DEVELOPER_ERROR: 5, // Invalid arguments provided to the API. This error can also indicate that the application was not correctly signed or properly set up for In-app Billing in Google Play, or does not have the necessary permissions in its manifest
    ERROR: 6, // Fatal error during the API action
    ITEM_ALREADY_OWNED: 7, // Failure to purchase since item is already owned
    ITEM_NOT_OWNED: 8 // Failure to consume since item is not owned
};

function init() {
    if (initialized) return;
    initialized = true;

    for (var i = 0; i < store.products.length; ++i)
        skus.push(store.products[i].id);

    store.inappbilling.init(iabReady,
        function(err) {
            initialized = false;
            store.error({
                code: store.ERR_SETUP,
                message: 'Init failed - ' + err
            });
        },
        {
            showLog: store.verbosity >= store.DEBUG ? true : false
        },
        skus);
}

function iabReady() {
    store.log.debug("plugin -> ready");
    store.inappbilling.getAvailableProducts(iabLoaded, function(err) {
        store.error({
            code: store.ERR_LOAD,
            message: 'Loading product info failed - ' + err
        });
    });
}

function iabLoaded(validProducts) {
    store.log.debug("plugin -> loaded - " + JSON.stringify(validProducts));
    var p, i;
    for (i = 0; i < validProducts.length; ++i) {

        if (validProducts[i].productId)
            p = store.products.byId[validProducts[i].productId];
        else
            p = null;

        if (p) {
            p.set({
                title: validProducts[i].title || validProducts[i].name,
                price: validProducts[i].price || validProducts[i].formattedPrice,
                description: validProducts[i].description,
                currency: validProducts[i].price_currency_code ? validProducts[i].price_currency_code : "",
                state: store.VALID
            });
            p.trigger("loaded");
        }
    }
    for (i = 0; i < skus.length; ++i) {
        p = store.products.byId[skus[i]];
        if (p && !p.valid) {
            p.set("state", store.INVALID);
            p.trigger("loaded");
        }
    }

    store.iabGetPurchases();
}

store.when("requested", function(product) {
    store.ready(function() {
        if (!product) {
            store.error({
                code: store.ERR_INVALID_PRODUCT_ID,
                message: "Trying to order an unknown product"
            });
            return;
        }
        if (!product.valid) {
            product.trigger("error", [new store.Error({
                code: store.ERR_PURCHASE,
                message: "`purchase()` called with an invalid product"
            }), product]);
            return;
        }

        // Initiate the purchase
        product.set("state", store.INITIATED);

        var method = 'buy';
        if (product.type === store.FREE_SUBSCRIPTION || product.type === store.PAID_SUBSCRIPTION) {
            method = 'subscribe';
        }
        store.inappbilling[method](function(data) {
            // Success callabck.
            //
            // example data:
            // {
            //     "orderId":        "12999763169054705758.1385463868367493",
            //     "packageName":    "com.example.myPackage",
            //     "productId":      "example_subscription",
            //     "purchaseTime":   1397590291362,
            //     "purchaseState":  0,
            //     "purchaseToken":  "ndgl...X5KQ",
            //     "receipt":        "{...}",
            //     "signature":      "qs54SGHgjGSJHSKJHIU"
            // }
            store.setProductData(product, data);
        },
        function(err, code) {
            store.log.info("plugin -> " + method + " error " + code);
            if (code === store.ERR_PAYMENT_CANCELLED) {
                // This isn't an error,
                // just trigger the cancelled event.
                product.transaction = null;
                product.trigger("cancelled");
            }
            else {
                store.error({
                    code: code || store.ERR_PURCHASE,
                    message: "Purchase failed: " + err
                });
            }
            if (code === BILLING_RESPONSE_RESULT.ITEM_ALREADY_OWNED) {
                product.set("state", store.APPROVED);
            }
            else {
                product.set("state", store.VALID);
            }
        }, product.id);
    });
});

/// #### finish a purchase
/// When a consumable product enters the store.FINISHED state,
/// `consume()` the product.
store.when("product", "finished", function(product) {
    store.log.debug("plugin -> consumable finished");
    if (product.type === store.CONSUMABLE || product.type === store.NON_RENEWING_SUBSCRIPTION) {
        var transaction = product.transaction;
        product.transaction = null;
        store.inappbilling.consumePurchase(
            function() { // success
                store.log.debug("plugin -> consumable consumed");
                product.set('state', store.VALID);
            },
            function(err, code) { // error
                // can't finish.
                store.error({
                    code: code || store.ERR_UNKNOWN,
                    message: err
                });
            },
            product.id,
            transaction.id
        );
    }
    else {
        product.set('state', store.OWNED);
    }
});

})();
(function () {
    "use strict";

	/*
     *  Pruduct Listing
     *
        Description     Read-only	Windows Phone only. Gets the description for the in-app product.
        FormattedPrice  Read-only	Gets the in-app product purchase price with the appropriate formatting for the current market.
        ImageUri        Read-only	Gets the URI of the image associated with the in-app product.
        Keywords        Read-only	Gets the list of keywords associated with the in-app product. These keywords are useful for filtering product lists by keyword, for example, when calling LoadListingInformationByKeywordsAsync.
        Name            Read-only	Gets the descriptive name of the in-app product that is displayed customers in the current market.
        ProductId       Read-only	Gets the in-app product ID.
        ProductType     Read-only	Gets the type of this in-app product. Possible values are defined by ProductType.
        Tag             Read-only	Gets the tag string that contains custom information about an in-app product.
     */

    /*
     *  Product Result
     *
        OfferId         Read-only	A unique ID used to identify a specific in-app product within a large catalog.
        ReceiptXml      Read-only	A full receipt that provides a transaction history for the purchase of an in-app product
        Status          Read-only	The current state of the purchase transaction for an in-app product.
        TransactionId   Read-only	A unique transaction ID associated with the purchase of a consumable in-app
     */

    /*
     * Product License
     *
        ExpirationDate  Read-only	Gets the current expiration date and time of the in-app product license.
        IsActive        Read-only	Indicates if the in-app product license is currently active.
        IsConsumable    Read-only	Indicates if the in-app product is consumable. A consumable product is a product that can be purchased, used, and purchased again.
        ProductId       Read-only	Gets the ID of an in-app product. This ID is used by the app to get info about the product or feature that is enabled when the customer buys it through an in-app purchase.
     */

	store.setProductData = function(product, data) {
		var transaction = data.transaction;
		var license = data.license;

		store.log.debug("windows -> product data for " + product.id);
        store.log.debug(transaction);
        store.log.debug(license);

        if (license) {
            product.license = {
                type: 'windows-store-license',
                expirationDate: license.expirationDate,
                isActive: license.isActive
            };
        }
        else {
            license = {};
        }

        if (transaction) {
            product.transaction = {
                type: 'windows-store-transaction',
                id: transaction.transactionId,
                offerId: transaction.offerId,
                receipt: transaction.receiptXml
            };
        }
        else {
            transaction = {};
        }

        // When the product is owned, adjust the state if necessary
        if (product.state !== store.OWNED && product.state !== store.FINISHED &&
            product.state !== store.APPROVED) {
            //  Succeeded           || AlreadyPurchased
            if (transaction.status === 0) {
                product.set("state", store.APPROVED);
            }
            //AlreadyPurchased
            if (transaction.status === 1 || license.isActive) {
                product.set("state", store.OWNED);
            }
        }

        if (product.state === store.INITIATED) {
            if (transaction.status === 3) {
                product.trigger("cancelled");
                product.set("state", store.VALID);
            }
        }

        // When the product is cancelled or refunded, adjust the state if necessary
        if (product.state === store.OWNED || product.state === store.FINISHED ||
            product.state === store.APPROVED) {

            //NotPurchased
            if (transaction.status === 3) {
                product.trigger("cancelled");
                product.set("state", store.VALID);
            }
            //not fullfilled
            else if (transaction.status === 2) {
                product.trigger("refunded");
                product.set("state", store.VALID);
            }
        }
    };

    store.iabGetPurchases = function() {
        store.inappbilling.getPurchases(function(purchases) {
            if (purchases && purchases.length) {
                for (var i = 0; i < purchases.length; ++i) {
                    var purchase = purchases[i];
                    var p = store.get(purchase.license.productId);
                    if (!p) {
                        store.log.warn("plugin -> user owns a non-registered product");
                        continue;
                    }
                    store.setProductData(p, purchase);
                }
            }
            store.ready(true);
        }, function() {});
    };

})();

if (window) {
    window.store = store;
}

module.exports = store;

