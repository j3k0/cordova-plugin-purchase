//! # iOS Implementation
//!
//! The implementation of the unified API is a small layer
//! built on top of the legacy "PhoneGap-InAppPurchase-iOS" plugin.
//!
//! This was first decided as a temporary "get-things-done" solution.
//! However, I found this ended-up providing a nice separation of concerns:
//!
//!  - the `platforms/ios-bridge.js` file exposes an API called `storekit` that matches the
//!    iOS way of dealing with in-app purchases.
//!    - It is where the dialog with the Obj-C part happens.
//!    - It turns that into a javascript friendly API, close to the StoreKit API.
//!    - There are some specifities to it, so if eventually some users want
//!      to go for a platform specific implementation on iOS, they can!
//!  - the `platforms/ios-adapter.js` connects the iOS `storekit` API with the
//!    unified `store` API.
//!    - It makes sure products are loaded from apple servers
//!    - It reacts to product's changes of state, so that a product get's purchased
//!      when `REQUESTED`, or finished when `FINISHED` for instance.
//!

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
/**
 * A plugin to enable iOS In-App Purchases.
 *
 * Copyright (c) Matt Kane 2011
 * Copyright (c) Guillaume Charhon 2012
 * Copyright (c) Jean-Christophe Hoelt 2013
 */

/*eslint camelcase:0 */
/*global cordova, window */
(function(){
"use strict";

var exec = function (methodName, options, success, error) {
    cordova.exec(success, error, "InAppPurchase", methodName, options);
};

var protectCall = function (callback, context) {
    if (!callback) {
        return;
    }
    try {
        var args = Array.prototype.slice.call(arguments, 2);
        callback.apply(this, args);
    }
    catch (err) {
        log('exception in ' + context + ': "' + err + '"');
    }
};

var InAppPurchase = function () {
    this.options = {};

    this.receiptForTransaction = {};
    this.receiptForProduct = {};
    this.transactionForProduct = {};
    if (window.localStorage && window.localStorage.sk_receiptForTransaction)
        this.receiptForTransaction = JSON.parse(window.localStorage.sk_receiptForTransaction);
    if (window.localStorage && window.localStorage.sk_receiptForProduct)
        this.receiptForProduct = JSON.parse(window.localStorage.sk_receiptForProduct);
    if (window.localStorage && window.localStorage.sk_transactionForProduct)
        this.transactionForProduct = JSON.parse(window.localStorage.sk_transactionForProduct);
};

var noop = function () {};

var log = noop;

// Error codes
// (keep synchronized with InAppPurchase.m)
var ERROR_CODES_BASE = 6777000;
InAppPurchase.prototype.ERR_SETUP               = ERROR_CODES_BASE + 1;
InAppPurchase.prototype.ERR_LOAD                = ERROR_CODES_BASE + 2;
InAppPurchase.prototype.ERR_PURCHASE            = ERROR_CODES_BASE + 3;
InAppPurchase.prototype.ERR_LOAD_RECEIPTS       = ERROR_CODES_BASE + 4;
InAppPurchase.prototype.ERR_CLIENT_INVALID      = ERROR_CODES_BASE + 5;
InAppPurchase.prototype.ERR_PAYMENT_CANCELLED   = ERROR_CODES_BASE + 6; // now ERR_CANCELLED
InAppPurchase.prototype.ERR_PAYMENT_INVALID     = ERROR_CODES_BASE + 7;
InAppPurchase.prototype.ERR_PAYMENT_NOT_ALLOWED = ERROR_CODES_BASE + 8;
InAppPurchase.prototype.ERR_UNKNOWN             = ERROR_CODES_BASE + 10;
InAppPurchase.prototype.ERR_REFRESH_RECEIPTS    = ERROR_CODES_BASE + 11;
InAppPurchase.prototype.ERR_PAUSE_DOWNLOADS     = ERROR_CODES_BASE + 12;
InAppPurchase.prototype.ERR_RESUME_DOWNLOADS    = ERROR_CODES_BASE + 13;
InAppPurchase.prototype.ERR_CANCEL_DOWNLOADS    = ERROR_CODES_BASE + 14;

var initialized = false;

InAppPurchase.prototype.init = function (options, success, error) {
    this.options = {
        error:    options.error    || noop,
        ready:    options.ready    || noop,
        purchase: options.purchase || noop,
        purchaseEnqueued: options.purchaseEnqueued || noop,
        purchasing: options.purchasing || noop,
        finish:   options.finish   || noop,
        restore:  options.restore  || noop,
        receiptsRefreshed: options.receiptsRefreshed || noop,
        restoreFailed:     options.restoreFailed    || noop,
        restoreCompleted:  options.restoreCompleted || noop,
        downloadActive:  options.downloadActive || noop,
        downloadCancelled:  options.downloadCancelled || noop,
        downloadFailed:  options.downloadFailed || noop,
        downloadFinished:  options.downloadFinished || noop,
        downloadPaused:  options.downloadPaused || noop,
        downloadWaiting:  options.downloadWaiting || noop
    };

    if (options.debug) {
        exec('debug', [], noop, noop);
        log = function (msg) {
            console.log("InAppPurchase[js]: " + msg);
        };
    }

    if (options.noAutoFinish) {
        exec('noAutoFinish', [], noop, noop);
    }

    var that = this;
    var setupOk = function () {
        log('setup ok');
        protectCall(that.options.ready, 'options.ready');
        protectCall(success, 'init.success');
        initialized = true;
        that.processPendingUpdates();

        // Is there a reason why we wouldn't like to do this automatically?
        // YES! it does ask the user for his password.
        // that.restore();
    };
    var setupFailed = function () {
        log('setup failed');
        protectCall(options.error, 'options.error', InAppPurchase.prototype.ERR_SETUP, 'Setup failed');
        protectCall(error, 'init.error');
    };

    this.loadAppStoreReceipt();
    exec('setup', [], setupOk, setupFailed);
};

/**
 * Makes an in-app purchase.
 *
 * @param {String} productId The product identifier. e.g. "com.example.MyApp.myproduct"
 * @param {int} quantity
 */
InAppPurchase.prototype.purchase = function (productId, quantity) {
	quantity = (quantity | 0) || 1;
    var options = this.options;

    // Many people forget to load information about their products from apple's servers before allowing
    // users to purchase them... leading them to spam us with useless issues and comments.
    // Let's chase them down!
    if ((!InAppPurchase._productIds) || (InAppPurchase._productIds.indexOf(productId) < 0)) {
        var msg = 'Purchasing ' + productId + ' failed.  Ensure the product was loaded first with storekit.load(...)!';
        log(msg);
        if (typeof options.error === 'function') {
            protectCall(options.error, 'options.error', InAppPurchase.prototype.ERR_PURCHASE, 'Trying to purchase a unknown product.', productId, quantity);
        }
        return;
    }

    var purchaseOk = function () {
        log('Purchased ' + productId);
        if (typeof options.purchaseEnqueued === 'function') {
            protectCall(options.purchaseEnqueued, 'options.purchaseEnqueued', productId, quantity);
        }
    };
    var purchaseFailed = function () {
        var errmsg = 'Purchasing ' + productId + ' failed';
        log(errmsg);
        if (typeof options.error === 'function') {
            protectCall(options.error, 'options.error', InAppPurchase.prototype.ERR_PURCHASE, errmsg, productId, quantity);
        }
    };
    exec('purchase', [productId, quantity], purchaseOk, purchaseFailed);
};

/**
 * Checks if device/user is allowed to make in-app purchases
 */
InAppPurchase.prototype.canMakePayments = function(success, error){
    return exec("canMakePayments", [], success, error);
};

/**
 * Asks the payment queue to restore previously completed purchases.
 * The restored transactions are passed to the onRestored callback, so make sure you define a handler for that first.
 *
 */
InAppPurchase.prototype.restore = function() {
    this.needRestoreNotification = true;
    exec('restoreCompletedTransactions', []);
};

/*
 * Requests all active downloads be paused
 */
InAppPurchase.prototype.pause = function() {
    var ok = function() {
        log("Paused active downloads");
        if (typeof this.options.paused === "function") {
            protectCall(this.options.paused, "options.paused");
        }
    };
    var failed = function() {
        var errmsg = "Pausing active downloads failed";
        log(errmsg);
        if (typeof this.options.error === "function") {
            protectCall(this.options.error, "options.error", InAppPurchase.prototype.ERR_PAUSE_DOWNLOADS, errmsg);
        }
    };
    return exec('pause', [], ok, failed);
};

/*
 * Requests all paused active downloads be resumed
 */
InAppPurchase.prototype.resume = function() {
    var ok = function() {
        log("Resumed active downloads");
        if (typeof this.options.resumed === "function") {
            protectCall(this.options.resumed, "options.resumed");
        }
    };
    var failed = function() {
        var errmsg = "Resuming active downloads failed";
        log(errmsg);
        if (typeof this.options.error === "function") {
            protectCall(this.options.error, "options.error", InAppPurchase.prototype.ERR_RESUME_DOWNLOADS, errmsg);
        }
    };
    return exec('resume', [], ok, failed);
};

/*
 * Requests all active downloads be cancelled
 */
InAppPurchase.prototype.cancel = function() {
    var ok = function() {
        log("Cancelled active downloads");
        if (typeof this.options.cancelled === "function") {
            protectCall(this.options.cancelled, "options.cancelled");
        }
    };
    var failed = function() {
        var errmsg = "Cancelling active downloads failed";
        log(errmsg);
        if (typeof this.options.error === "function") {
            protectCall(this.options.error, "options.error", InAppPurchase.prototype.ERR_CANCEL_DOWNLOADS, errmsg);
        }
    };
    return exec('cancel', [], ok, failed);
};

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
InAppPurchase.prototype.load = function (productIds, success, error) {
    var options = this.options;
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
            var msg = 'invalid productIds given to store.load: ' + JSON.stringify(productIds);
            log(msg);
            protectCall(options.error, 'options.error', InAppPurchase.prototype.ERR_LOAD, msg);
            protectCall(error, 'load.error', InAppPurchase.prototype.ERR_LOAD, msg);
            return;
        }
        log('load ' + JSON.stringify(productIds));

        var loadOk = function (array) {
            var valid = array[0];
            var invalid = array[1];
            log('load ok: { valid:' + JSON.stringify(valid) + ' invalid:' + JSON.stringify(invalid) + ' }');
            protectCall(success, 'load.success', valid, invalid);
        };
        var loadFailed = function (errMessage) {
            log('load failed');
            log(errMessage);
            var message = 'Load failed: ' + errMessage;
            protectCall(options.error, 'options.error', InAppPurchase.prototype.ERR_LOAD, message);
            protectCall(error, 'load.error', InAppPurchase.prototype.ERR_LOAD, message);
        };

        InAppPurchase._productIds = productIds;
        exec('load', [productIds], loadOk, loadFailed);
    }
};

/**
 * Finish an unfinished transaction.
 *
 * @param {String} transactionId
 *    Identifier of the transaction to finish.
 *
 * You have to call this method manually when using the noAutoFinish option.
 */
InAppPurchase.prototype.finish = function (transactionId) {
    exec('finishTransaction', [transactionId], noop, noop);
};

var pendingUpdates = [], pendingDownloadUpdates = [];
InAppPurchase.prototype.processPendingUpdates = function() {
    for (var i = 0; i < pendingUpdates.length; ++i) {
        this.updatedTransactionCallback.apply(this, pendingUpdates[i]);
    }
    pendingUpdates = [];

    for (var j = 0; j < pendingDownloadUpdates.length; ++j) {
        this.updatedDownloadCallback.apply(this, pendingDownloadUpdates[j]);
    }
    pendingDownloadUpdates = [];
};

// This is called from native.
//
// Note that it may eventually be called before initialization... unfortunately.
// In this case, we'll just keep pending updates in a list for later processing.
InAppPurchase.prototype.updatedTransactionCallback = function (state, errorCode, errorText, transactionIdentifier, productId, transactionReceipt) {

    if (!initialized) {
        var args = Array.prototype.slice.call(arguments);
        pendingUpdates.push(args);
        return;
    }

    if (productId && transactionIdentifier) {
        log("product " + productId + " has a transaction in progress: " + transactionIdentifier);
        this.transactionForProduct[productId] = transactionIdentifier;
    }

    if (transactionReceipt) {
        this.receiptForProduct[productId] = transactionReceipt;
        this.receiptForTransaction[transactionIdentifier] = transactionReceipt;
        if (window.localStorage) {
            window.localStorage.sk_receiptForProduct = JSON.stringify(this.receiptForProduct);
            window.localStorage.sk_receiptForTransaction = JSON.stringify(this.receiptForTransaction);
        }
    }
	switch(state) {
        case "PaymentTransactionStatePurchasing":
            protectCall(this.options.purchasing, 'options.purchasing', productId);
            return;
		case "PaymentTransactionStatePurchased":
            protectCall(this.options.purchase, 'options.purchase', transactionIdentifier, productId);
			return;
		case "PaymentTransactionStateFailed":
            protectCall(this.options.error, 'options.error', errorCode, errorText, {
                productId: productId
            });
			return;
		case "PaymentTransactionStateRestored":
            protectCall(this.options.restore, 'options.restore', transactionIdentifier, productId);
			return;
		case "PaymentTransactionStateFinished":
            protectCall(this.options.finish, 'options.finish', transactionIdentifier, productId);
			return;
	}
};

InAppPurchase.prototype.updatedDownloadCallback = function(state, errorCode, errorText, transactionIdentifier, productId, transactionReceipt, progress, timeRemaining) {
    if (!initialized) {
        var args = Array.prototype.slice.call(arguments);
        pendingDownloadUpdates.push(args);
        return;
    }
    switch (state) {
        case "DownloadStateActive":
            protectCall(this.options.downloadActive, "options.downloadActive", transactionIdentifier, productId, progress, timeRemaining);
            return;

        case "DownloadStateCancelled":
            protectCall(this.options.downloadCancelled, "options.downloadCancelled", transactionIdentifier, productId);
            return;

        case "DownloadStateFailed":
            protectCall(this.options.downloadFailed, "options.downloadFailed", transactionIdentifier, productId, errorCode, errorText);
            return;

        case "DownloadStateFinished":
            protectCall(this.options.downloadFinished, "options.downloadFinished", transactionIdentifier, productId);
            return;

        case "DownloadStatePaused":
            protectCall(this.options.downloadPaused, "options.downloadPaused", transactionIdentifier, productId);
            return;

        case "DownloadStateWaiting":
            protectCall(this.options.downloadWaiting, "options.downloadWaiting", transactionIdentifier, productId);
            return;
    }
};

InAppPurchase.prototype.restoreCompletedTransactionsFinished = function () {
    if (this.needRestoreNotification)
        delete this.needRestoreNotification;
    else
        return;
    protectCall(this.options.restoreCompleted, 'options.restoreCompleted');
};

InAppPurchase.prototype.restoreCompletedTransactionsFailed = function (errorCode) {
    if (this.needRestoreNotification)
        delete this.needRestoreNotification;
    else
        return;
    protectCall(this.options.restoreFailed, 'options.restoreFailed', errorCode);
};

InAppPurchase.prototype.refreshReceipts = function(successCb, errorCb) {
    var that = this;

    var loaded = function (args) {
        var base64 = args[0];
        var bundleIdentifier = args[1];
        var bundleShortVersion = args[2];
        var bundleNumericVersion = args[3];
        var bundleSignature = args[4];
        log('infoPlist: ' + bundleIdentifier + "," + bundleShortVersion + "," + bundleNumericVersion  + "," + bundleSignature);
        that.setAppStoreReceipt(base64);
        var data = {
            appStoreReceipt: base64,
            bundleIdentifier: bundleIdentifier,
            bundleShortVersion: bundleShortVersion,
            bundleNumericVersion: bundleNumericVersion,
            bundleSignature: bundleSignature
        };
        protectCall(that.options.receiptsRefreshed, 'options.receiptsRefreshed', data);
        protectCall(successCb, "refreshReceipts.success", data);
    };

    var error = function(errMessage) {
        log('refresh receipt failed: ' + errMessage);
        protectCall(that.options.error, 'options.error', InAppPurchase.prototype.ERR_REFRESH_RECEIPTS, 'Failed to refresh receipt: ' + errMessage);
        protectCall(errorCb, "refreshReceipts.error", InAppPurchase.prototype.ERR_REFRESH_RECEIPTS, 'Failed to refresh receipt: ' + errMessage);
    };

    log('refreshing appStoreReceipt');
    exec('appStoreRefreshReceipt', [], loaded, error);
};

InAppPurchase.prototype.loadReceipts = function (callback) {

    var that = this;
    // that.appStoreReceipt = null;

    var loaded = function (base64) {
        // that.appStoreReceipt = base64;
        that.setAppStoreReceipt(base64);
        callCallback();
    };

    var error = function (errMessage) {
        log('load failed: ' + errMessage);
        protectCall(that.options.error, 'options.error', InAppPurchase.prototype.ERR_LOAD_RECEIPTS, 'Failed to load receipt: ' + errMessage);
    };

    function callCallback() {
        protectCall(callback, 'loadReceipts.callback', {
            appStoreReceipt: that.appStoreReceipt,
            forTransaction: function (transactionId) {
                return that.receiptForTransaction[transactionId] || null;
            },
            forProduct:     function (productId) {
                return that.receiptForProduct[productId] || null;
            }
        });
    }

    if (that.appStoreReceipt) {
        log('appStoreReceipt already loaded:');
        log(that.appStoreReceipt);
        callCallback();
    }
    else {
        log('loading appStoreReceipt');
        exec('appStoreReceipt', [], loaded, error);
    }
};

InAppPurchase.prototype.setAppStoreReceipt = function(base64) {
    this.appStoreReceipt = base64;
    if (window.localStorage && base64) {
        window.localStorage.sk_appStoreReceipt = base64;
    }
};
InAppPurchase.prototype.loadAppStoreReceipt = function() {
    if (window.localStorage && window.localStorage.sk_appStoreReceipt) {
        this.appStoreReceipt = window.localStorage.sk_appStoreReceipt;
    }
    if (this.appStoreReceipt === 'null')
        this.appStoreReceipt = null;
};

/*
 * This queue stuff is here because we may be sent events before listeners have been registered. This is because if we have
 * incomplete transactions when we quit, the app will try to run these when we resume. If we don't register to receive these
 * right away then they may be missed. As soon as a callback has been registered then it will be sent any events waiting
 * in the queue.
 */
InAppPurchase.prototype.runQueue = function () {
	if(!this.eventQueue.length || (!this.onPurchased && !this.onFailed && !this.onRestored)) {
		return;
	}
	var args;
	/* We can't work directly on the queue, because we're pushing new elements onto it */
	var queue = this.eventQueue.slice();
	this.eventQueue = [];
    args = queue.shift();
	while (args) {
		this.updatedTransactionCallback.apply(this, args);
        args = queue.shift();
	}
	if (!this.eventQueue.length) {
		this.unWatchQueue();
	}
};

InAppPurchase.prototype.watchQueue = function () {
	if (this.timer) {
		return;
	}
	this.timer = window.setInterval(function () {
        window.storekit.runQueue();
    }, 10000);
};

InAppPurchase.prototype.unWatchQueue = function () {
	if (this.timer) {
		window.clearInterval(this.timer);
		this.timer = null;
	}
};

InAppPurchase.prototype.eventQueue = [];
InAppPurchase.prototype.timer = null;

window.storekit = new InAppPurchase();
})();
/*global storekit */
(function() {
"use strict";

//! ## Reacting to product state changes
//!
//! The iOS implementation monitors products changes of state to trigger
//! `storekit` operations.
//!
//! Please refer to the [product life-cycle section](api.md#life-cycle) of the documentation
//! for better understanding of the job of this event handlers.

//! #### initialize storekit
//! At first refresh, initialize the storekit API. See [`storekitInit()`](#storekitInit) for details.
//!
store.when("refreshed", function() {
    storekitInit(); // try to init if needed
    storekitLoad(); // try to load if needed
});

//! #### initiate a purchase
//!
//! When a product enters the store.REQUESTED state, initiate a purchase with `storekit`.
//!
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
        storekit.purchase(product.id, 1);
    });
});


//! #### finish a purchase
//! When a product enters the store.FINISHED state, `finish()` the storekit transaction.
//!
store.when("finished", function(product) {
    store.log.debug("ios -> finishing " + product.id + " (a " + product.type + ")");
    storekitFinish(product);
    if (product.type === store.CONSUMABLE || product.type === store.NON_RENEWING_SUBSCRIPTION) {
        product.set("state", store.VALID);
        setOwned(product.id, false);
    }
    else {
        product.set("state", store.OWNED);
    }
});

function storekitFinish(product) {
    if (product.type === store.CONSUMABLE || product.type === store.NON_RENEWING_SUBSCRIPTION) {
        if (product.transaction && product.transaction.id) {
            storekit.finish(product.transaction.id);
        }
        else if (storekit.transactionForProduct[product.id]) {
            storekit.finish(storekit.transactionForProduct[product.id]);
        }
        else {
            store.log.debug("ios -> error: unable to find transaction for " + product.id);
        }
    }
    else if (product.transactions) {
        store.log.debug("ios -> finishing all " + product.transactions.length + " transactions for " + product.id);
        for (var i = 0; i < product.transactions.length; ++i) {
            store.log.debug("ios -> finishing " + product.transactions[i]);
            storekit.finish(product.transactions[i]);
        }
        product.transactions = [];
    }
}

//! #### persist ownership
//!
//! `storekit` doesn't provide a way to know which products have been purchases.
//! That is why we have to handle that ourselves, by storing the `OWNED` status of a product.
//!
//! Note that, until Apple provides a mean to get notified to refunds, there's no way back.
//! A non-consumable product, once `OWNED` always will be.
//!
//! http://stackoverflow.com/questions/6429186/can-we-check-if-a-users-in-app-purchase-has-been-refunded-by-apple
//!
store.when("owned", function(product) {
    if (!isOwned(product.id))
        setOwned(product.id, true);
});


//! #### persist downloaded status
//!
//! `storekit` doesn't provide a way to know which products have been downloaded.
//! That is why we have to handle that ourselves, by storing the `DOWNLOADED` status of a product.
//!
//! A non-consumable product, once `OWNED` can always be re-downloaded for free.
//!
store.when("downloaded", function(product) {
    if (!isDownloaded(product.id))
        setDownloaded(product.id, true);
});

store.when("registered", function(product) {
    var owned = isOwned(product.id);
    product.owned = product.owned || owned;

    var downloaded = isDownloaded(product.id);
    product.downloaded = product.downloaded || downloaded;

    store.log.debug("ios -> product " + product.id + " registered" + (owned ? " and owned" : "") + (downloaded ? " and downloaded" : ""));
});

store.when("expired", function(product) {
    store.log.debug("ios -> product " + product.id + " expired");
    product.owned = false;
    setOwned(product.id, false);
    setDownloaded(product.id, false);
    storekitFinish(product);
    if (product.state === store.OWNED || product.state === store.APPROVED)
        product.set("state", store.VALID);
});

//!
//! ## Initialization
//!

//! ### <a name="storekitInit"></a> *storekitInit()*
//!
//! This funciton will initialize the storekit API.
//!
//! This initiates a chain reaction including [`storekitReady()`](#storekitReady) and [`storekitLoaded()`](#storekitLoaded)
//! that will make sure products are loaded from server, set as `VALID` or `INVALID`, and eventually restored
//! to their proper `OWNED` status.
//!
//! It also registers the `storekit` callbacks to get notified of events from the StoreKit API:
//!
//!  - [`storekitPurchasing()`](#storekitPurchasing)
//!  - [`storekitPurchased()`](#storekitPurchased)
//!  - [`storekitError()`](#storekitError)
//!
var initialized = false;
var initializing = false;
function storekitInit() {
    if (initialized || initializing) return;
    initializing = true;
    store.log.debug("ios -> initializing storekit");
    storekit.init({
        debug:    store.verbosity >= store.DEBUG ? true : false,
        noAutoFinish: true,
        error:    storekitError,
        purchase: storekitPurchased,
        purchasing: storekitPurchasing,
        restore:    storekitRestored,
        restoreCompleted: storekitRestoreCompleted,
        restoreFailed:    storekitRestoreFailed,
        downloadActive:  storekitDownloadActive,
        downloadFailed:  storekitDownloadFailed,
        downloadFinished:  storekitDownloadFinished
    }, storekitReady, storekitInitFailed);
}

//!
//! ## *storekit* events handlers
//!

//! ### <a name="storekitReady"></a> *storekitReady()*
//!
//! Called when `storekit` has been initialized successfully.
//!
//! Loads all registered products, triggers `storekitLoaded()` when done.
//!
function storekitReady() {
    store.log.info("ios -> storekit ready");
    initializing = false;
    initialized = true;
    storekitLoad();
}

function storekitInitFailed() {
    store.log.warn("ios -> storekit init failed");
    initializing = false;
    retry(storekitInit);
}

var loaded = false;
var loading = false;
function storekitLoad() {
    if (!initialized) return;
    if (loaded || loading) return;
    loading = true;
    var products = [];
    for (var i = 0; i < store.products.length; ++i)
        products.push(store.products[i].id);
    store.log.debug("ios -> loading products");
    storekit.load(products, storekitLoaded, storekitLoadFailed);
}

//! ### <a name="storekitLoaded"></a> *storekitLoaded()*
//!
//! Update the `store`'s product definitions when they have been loaded.
//!
//!  1. Set the products state to `VALID` or `INVALID`
//!  2. Trigger the "loaded" event
//!  3. Set the products state to `OWNED` (if it is so)
//!  4. Set the store status to "ready".
//!
function storekitLoaded(validProducts, invalidProductIds) {
    store.log.debug("ios -> products loaded");
    var p;
    for (var i = 0; i < validProducts.length; ++i) {
        p = store.products.byId[validProducts[i].id];
        store.log.debug("ios -> product " + p.id + " is valid (" + p.alias + ")");
        store.log.debug("ios -> owned? " + p.owned);
        p.set({
            title: validProducts[i].title,
            price: validProducts[i].price,
            description: validProducts[i].description,
            currency: validProducts[i].currency,
            state: store.VALID
        });
        p.trigger("loaded");
        if (isOwned(p.id)) {
            if (p.type === store.NON_CONSUMABLE)
                p.set("state", store.OWNED);
            else // recheck subscriptions at each application start
                p.set("state", store.APPROVED);
        }
    }
    for (var j = 0; j < invalidProductIds.length; ++j) {
        p = store.products.byId[invalidProductIds[j]];
        p.set("state", store.INVALID);
        store.log.warn("ios -> product " + p.id + " is NOT valid (" + p.alias + ")");
        p.trigger("loaded");
    }

    //! Note: the execution of "ready" is deferred to make sure state
    //! changes have been processed.
    setTimeout(function() {
        loading = false;
        loaded = true;
        store.ready(true);
    }, 1);
}

function storekitLoadFailed() {
    store.log.warn("ios -> loading products failed");
    loading = false;
    retry(storekitLoad);
}

var refreshCallbacks = [];
var refreshing = false;
function storekitRefreshReceipts(callback) {
    if (callback)
        refreshCallbacks.push(callback);
    if (refreshing)
        return;
    refreshing = true;

    function callCallbacks() {
        var callbacks = refreshCallbacks;
        refreshCallbacks = [];
        for (var i = 0; i < callbacks.length; ++i)
            callbacks[i]();
    }

    storekit.refreshReceipts(function() {
        // success
        refreshing = false;
        callCallbacks();
    },
    function() {
        // error
        refreshing = false;
        callCallbacks();
    });
}

store.when("expired", function() {
    storekitRefreshReceipts();
});

//! ### <a name="storekitPurchasing"></a> *storekitPurchasing()*
//!
//! Called by `storekit` when a purchase is in progress.
//!
//! It will set the product state to `INITIATED`.
//!
function storekitPurchasing(productId) {
    store.log.debug("ios -> is purchasing " + productId);
    store.ready(function() {
        var product = store.get(productId);
        if (!product) {
            store.log.warn("ios -> Product '" + productId + "' is being purchased. But isn't registered anymore! How come?");
            return;
        }
        if (product.state !== store.INITIATED)
            product.set("state", store.INITIATED);
    });
}

//! ### <a name="storekitPurchased"></a> *storekitPurchased()*
//!
//! Called by `storekit` when a purchase have been approved.
//!
//! It will set the product state to `APPROVED` and associates the product
//! with the order's transaction identifier.
//!
function storekitPurchased(transactionId, productId) {
    store.ready(function() {
        var product = store.get(productId);
        if (!product) {
            store.error({
                code: store.ERR_PURCHASE,
                message: "The purchase queue contains unknown product " + productId
            });
            return;
        }

        // Check if processing of this transaction isn't already in progress
        // Exit if so.
        if (product.transactions) {
            for (var i = 0; i < product.transactions.length; ++i) {
                if (transactionId === product.transactions[i])
                    return;
            }
        }

        product.transaction = {
            type: 'ios-appstore',
            id:   transactionId
        };
        if (!product.transactions)
            product.transactions = [];
        product.transactions.push(transactionId);
        store.log.info("ios -> transaction " + transactionId + " purchased (" + product.transactions.length + " in the queue for " + productId + ")");
        product.set("state", store.APPROVED);
    });
}

//! ### <a name="storekitError"></a> *storekitError()*
//!
//! Called by `storekit` when an error happens in the storekit API.
//!
//! Will convert storekit errors to a [`store.Error`](api.md/#errors).
//!
function storekitError(errorCode, errorText, options) {

    var i, p;

    if (!options)
        options = {};

    store.log.error('ios -> ERROR ' + errorCode + ': ' + errorText + ' - ' + JSON.stringify(options));

    // when loading failed, trigger "error" for each of
    // the registered products.
    if (errorCode === storekit.ERR_LOAD) {
        for (i = 0; i < store.products.length; ++i) {
            p = store.products[i];
            p.trigger("error", [new store.Error({
                code: store.ERR_LOAD,
                message: errorText
            }), p]);
        }
    }

    // a purchase was cancelled by the user:
    // - trigger the "cancelled" event
    // - set the product back to the VALID state
    if (errorCode === storekit.ERR_PAYMENT_CANCELLED) {
        p = store.get(options.productId);
        if (p) {
            p.trigger("cancelled");
            p.set({
                transaction: null,
                state: store.VALID
            });
        }
        // but a cancelled order isn't an error.
        return;
    }

    store.error({
        code:    errorCode,
        message: errorText
    });
}

// Restore purchases.
// store.restore = function() {
// };
store.when("re-refreshed", function() {
    storekit.restore();
    storekit.refreshReceipts(function(data) {
        // What the point of this?
        // Why create a product whose ID equals the application bundle ID (?)
        // Is it just to trigger force a validation of the appStoreReceipt?
        if (data) {
            var p = data.bundleIdentifier ? store.get(data.bundleIdentifier) : null;
            if (!p) {
                p = new store.Product({
                    id:    data.bundleIdentifier || "application data",
                    alias: "application data",
                    type:  store.NON_CONSUMABLE
                });
                store.register(p);
            }
            p.version = data.bundleShortVersion;
            p.transaction = {
                type: 'ios-appstore',
                appStoreReceipt: data.appStoreReceipt,
                signature: data.signature
            };
            p.trigger("loaded");
            p.set('state', store.APPROVED);
        }
    });
});

function storekitRestored(originalTransactionId, productId) {
    store.log.info("ios -> restored purchase " + productId);
    storekitPurchased(originalTransactionId, productId);
}

function storekitRestoreCompleted() {
    store.log.info("ios -> restore completed");
    store.trigger('refresh-completed');
}

function storekitRestoreFailed(/*errorCode*/) {
    store.log.warn("ios -> restore failed");
    store.error({
        code: store.ERR_REFRESH,
        message: "Failed to restore purchases during refresh"
    });
    store.trigger('refresh-failed');
}

function storekitDownloadActive(transactionIdentifier, productId, progress, timeRemaining) {
    store.log.info("ios -> is downloading " + productId + "; progress=" + progress + "%; timeRemaining=" + timeRemaining + "s");
    var p = store.get(productId);
    p.set({
        progress: progress,
        timeRemaining: timeRemaining,
        state: store.DOWNLOADING
    });
}
function storekitDownloadFailed(transactionIdentifier, productId, errorCode, errorText) {
    store.log.error("ios -> download failed: " + productId + "; errorCode=" + errorCode + "; errorText=" + errorText);
    var p = store.get(productId);
    p.trigger("error", [ new store.Error({
        code: store.ERR_DOWNLOAD,
        message: errorText
    }), p ]);

    store.error({
        code: errorCode,
        message: errorText
    });
}
function storekitDownloadFinished(transactionIdentifier, productId) {
    store.log.info("ios -> download completed: " + productId);
    var p = store.get(productId);
    p.set("state", store.DOWNLOADED);
}

store._refreshForValidation = function(callback) {
    storekitRefreshReceipts(callback);
};

// Load receipts required by server-side validation of purchases.
store._prepareForValidation = function(product, callback) {
    var nRetry = 0;
    function loadReceipts() {
        storekit.loadReceipts(function(r) {
            if (!product.transaction) {
                product.transaction = {
                    type: 'ios-appstore'
                };
            }
            product.transaction.appStoreReceipt = r.appStoreReceipt;
            if (product.transaction.id)
                product.transaction.transactionReceipt = r.forTransaction(product.transaction.id);
            if (!product.transaction.appStoreReceipt && !product.transaction.transactionReceipt) {
                nRetry ++;
                if (nRetry < 2) {
                    setTimeout(loadReceipts, 500);
                    return;
                }
                else if (nRetry === 2) {
                    storekit.refreshReceipts(loadReceipts);
                    return;
                }
            }
            callback();
        });
    }
    loadReceipts();
};

//!
//! ## Persistance of the *OWNED* status
//!

//! #### *isOwned(productId)*
//! return true iff the product with given ID has been purchased and finished
//! during this or a previous execution of the application.
function isOwned(productId) {
    return localStorage["__cc_fovea_store_ios_owned_ " + productId] === '1';
}

//! #### *setOwned(productId, value)*
//! store the boolean OWNED status of a given product.
function setOwned(productId, value) {
    store.log.debug("ios -> product " + productId + " owned=" + (value ? "true" : "false"));
    localStorage["__cc_fovea_store_ios_owned_ " + productId] = value ? '1' : '0';
}


//!
//! ## Persistance of the *DOWNLOADED* status
//!

//! #### *isDownloaded(productId)*
//! return true if the product with given ID has been purchased and finished downloading
//! during this or a previous execution of the application.
    function isDownloaded(productId) {
        return localStorage["__cc_fovea_store_ios_downloaded_ " + productId] === '1';
    }

//! #### *setDownloaded(productId, value)*
//! store the boolean DOWNLOADED status of a given product.
    function setDownloaded(productId, value) {
        localStorage["__cc_fovea_store_ios_downloaded_ " + productId] = value ? '1' : '0';
    }

//!
//! ## Retry failed requests
//! When setup and/or load failed, the plugin will retry over and over till it can connect
//! to the store.
//!
//! However, to be nice with the battery, it'll double the retry timeout each time.
//!
//! Special case, when the device goes online, it'll trigger all retry callback in the queue.
var retryTimeout = 5000;
var retries = [];
function retry(fn) {

    var tid = setTimeout(function() {
        retries = retries.filter(function(o) {
            return tid !== o.tid;
        });
        fn();
    }, retryTimeout);

    retries.push({ tid: tid, fn: fn });

    retryTimeout *= 2;
    // Max out the waiting time to 2 minutes.
    if (retryTimeout > 120000)
        retryTimeout = 120000;
}

document.addEventListener("online", function() {
    var a = retries;
    retries = [];
    retryTimeout = 5000;
    for (var i = 0; i < a.length; ++i) {
        clearTimeout(a[i].tid);
        a[i].fn.call(this);
    }
}, false);

})();

module.exports = store;

