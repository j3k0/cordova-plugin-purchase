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
/*///*/     store.ERR_SUBSCRIPTION_UPDATE_NOT_AVAILABLE = ERROR_CODES_BASE + 22;
/*///*/     store.ERR_PRODUCT_NOT_AVAILABLE = ERROR_CODES_BASE + 23; // Error code indicating that the requested product is not available in the store.
/*///*/     store.ERR_CLOUD_SERVICE_PERMISSION_DENIED = ERROR_CODES_BASE + 24; // Error code indicating that the user has not allowed access to Cloud service information.
/*///*/     store.ERR_CLOUD_SERVICE_NETWORK_CONNECTION_FAILED = ERROR_CODES_BASE + 25; // Error code indicating that the device could not connect to the network.
/*///*/     store.ERR_CLOUD_SERVICE_REVOKED = ERROR_CODES_BASE + 26; // Error code indicating that the user has revoked permission to use this cloud service.
/*///*/     store.ERR_PRIVACY_ACKNOWLEDGEMENT_REQUIRED = ERROR_CODES_BASE + 27; // Error code indicating that the user has not yet acknowledged Apple’s privacy policy for Apple Music.
/*///*/     store.ERR_UNAUTHORIZED_REQUEST_DATA = ERROR_CODES_BASE + 28; // Error code indicating that the app is attempting to use a property for which it does not have the required entitlement.
/*///*/     store.ERR_INVALID_OFFER_IDENTIFIER = ERROR_CODES_BASE + 29; // Error code indicating that the offer identifier is invalid.
/*///*/     store.ERR_INVALID_OFFER_PRICE = ERROR_CODES_BASE + 30; // Error code indicating that the price you specified in App Store Connect is no longer valid.
/*///*/     store.ERR_INVALID_SIGNATURE = ERROR_CODES_BASE + 31; // Error code indicating that the signature in a payment discount is not valid.
/*///*/     store.ERR_MISSING_OFFER_PARAMS = ERROR_CODES_BASE + 32; // Error code indicating that parameters are missing in a payment discount.

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
/*///*/     store.PURCHASE_CONSUMED = 6778004;
/*///*/     store.INTERNAL_ERROR    = 6778005;
/*///*/     store.NEED_MORE_DATA    = 6778006;

///
/// ### special purpose
///
/*///*/     store.APPLICATION = "application";

})();
(function() {


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
    if (type !== store.CONSUMABLE && type !== store.NON_CONSUMABLE && type !== store.PAID_SUBSCRIPTION && type !== store.FREE_SUBSCRIPTION && type !== store.NON_RENEWING_SUBSCRIPTION && type !== store.APPLICATION)
        throw new TypeError("Invalid product type");

    ///  - `product.group` - Name of the group your subscription product is a member of (default to `"default"`). If you don't set anything, all subscription will be members of the same group.
    var defaultGroup = this.type === store.PAID_SUBSCRIPTION ? "default" : "";
    this.group = options.group || defaultGroup;

    ///  - `product.state` - Current state the product is in (see [life-cycle](#life-cycle) below). Should be one of the defined [product states](#product-states)
    this.state = options.state || "";

    ///  - `product.title` - Localized name or short description
    this.title = options.title || options.localizedTitle || null;

    ///  - `product.description` - Localized longer description
    this.description = options.description || options.localizedDescription || null;

    ///  - `product.priceMicros` - Price in micro-units (divide by 1000000 to get numeric price)
    this.priceMicros = options.priceMicros || null;

    ///  - `product.price` - Localized price, with currency symbol
    this.price = options.price || null;

    ///  - `product.currency` - Currency code (optionaly)
    this.currency = options.currency || null;

    ///  - `product.countryCode` - Country code. Available only on iOS
    this.countryCode = options.countryCode || null;

    //  - `product.localizedTitle` - Localized name or short description ready for display
    // this.localizedTitle = options.localizedTitle || options.title || null;

    //  - `product.localizedDescription` - Localized longer description ready for display
    // this.localizedDescription = options.localizedDescription || options.description || null;

    //  - `product.localizedPrice` - Localized price (with currency) ready for display
    // this.localizedPrice = options.localizedPrice || null;

    ///  - `product.loaded` - Product has been loaded from server, however it can still be either `valid` or not
    this.loaded = options.loaded;

    ///  - `product.valid` - Product has been loaded and is a valid product
    ///    - when product definitions can't be loaded from the store, you should display instead a warning like: "You cannot make purchases at this stage. Try again in a moment. Make sure you didn't enable In-App-Purchases restrictions on your phone."
    this.valid  = options.valid;

    ///  - `product.canPurchase` - Product is in a state where it can be purchased
    this.canPurchase = options.canPurchase;

    ///  - `product.owned` - Product is owned
    this.owned = options.owned;

    ///  - `product.deferred` - Purchase has been initiated but is waiting for external action (for example, Ask to Buy on iOS)
    this.deferred = options.deferred;

    ///  - `product.introPrice` - Localized introductory price, with currency symbol
    this.introPrice = options.introPrice || null;

    ///  - `product.introPriceMicros` - Introductory price in micro-units (divide by 1000000 to get numeric price)
    this.introPriceMicros = options.introPriceMicros || null;

    ///  - `product.introPricePeriod` - Duration the introductory price is available (in period-unit)
    this.introPricePeriod = options.introPricePeriod || null;
    this.introPriceNumberOfPeriods = options.introPriceNumberOfPeriods || null; // legacy

    ///  - `product.introPricePeriodUnit` - Period for the introductory price ("Day", "Week", "Month" or "Year")
    this.introPricePeriodUnit = options.introPricePeriodUnit || null;
    this.introPriceSubscriptionPeriod = options.introPriceSubscriptionPeriod || null; // legacy

    ///  - `product.introPricePaymentMode` - Payment mode for the introductory price ("PayAsYouGo", "UpFront", or "FreeTrial")
    this.introPricePaymentMode = options.introPricePaymentMode || null;

    ///  - `product.ineligibleForIntroPrice` - True when a trial or introductory price has been applied to a subscription. Only available after [receipt validation](#validator). Available only on iOS
    this.ineligibleForIntroPrice = options.ineligibleForIntroPrice || null;

    /// - `product.discounts` - Array of discounts available for the product. Each discount exposes the following fields:
    ///    - `id` - The discount identifier
    ///    - `price` - Localized price, with currency symbol
    ///    - `priceMicros` - Price in micro-units (divide by 1000000 to get numeric price)
    ///    - `period` - Number of subscription periods
    ///    - `periodUnit` - Unit of the subcription period ("Day", "Week", "Month" or "Year")
    ///    - `paymentMode` - "PayAsYouGo", "UpFront", or "FreeTrial"
    ///    - `eligible` - True if the user is deemed eligible for this discount by the platform
    this.discounts = [];

    ///  - `product.downloading` - Product is downloading non-consumable content
    this.downloading = options.downloading;

    ///  - `product.downloaded` - Non-consumable content has been successfully downloaded for this product
    this.downloaded = options.downloaded;

    ///  - `product.additionalData` - additional data possibly required for product purchase
    this.additionalData = options.additionalData || null;

    ///  - `product.transaction` - Latest transaction data for this product (see [transactions](#transactions)).
    this.transaction = null;

    ///  - `product.expiryDate` - Latest known expiry date for a subscription (a javascript Date)
    ///  - `product.lastRenewalDate` - Latest date a subscription was renewed (a javascript Date)
    ///  - `product.billingPeriod` - Duration of the billing period for a subscription, in the units specified by the `billingPeriodUnit` property. (_not available on iOS < 11.2_)
    ///  - `product.billingPeriodUnit` - Units of the billing period for a subscription. Possible values: Minute, Hour, Day, Week, Month, Year. (_not available on iOS < 11.2_)
    ///  - `product.trialPeriod` - Duration of the trial period for the subscription, in the units specified by the `trialPeriodUnit` property (windows only)
    ///  - `product.trialPeriodUnit` - Units of the trial period for a subscription (windows only)

	// Some more fields set by [Fovea.Billing](https://billing.fovea.cc) receipt validator.
	//  - `product.isBillingRetryPeriod` -
	//  - `product.isTrialPeriod` -
	//  - `product.isIntroPeriod` -
	//  - `product.discountId` -
	//  - `product.priceConsentStatus` -
	//  - `product.renewalIntent` -
	//  - `product.renewalIntentChangeDate` -
	//  - `product.purchaseDate` -
	//  - `product.cancelationReason` -

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

        function getData(data, key) {
            if (!data)
                return null;
            return data.data && data.data[key] || data[key];
        }

        // No need to verify a which status isn't approved
        // It means it already has been
        if (that.state !== store.APPROVED)
            return;

        store._validator(that, function(success, data) {
            if (!data) data = {};
            store.log.debug("verify -> " + JSON.stringify({
                success: success,
                data: data
            }));
            var dataTransaction = getData(data, 'transaction');
            if (dataTransaction) {
                that.transaction = Object.assign({}, that.transaction || {}, dataTransaction);
                store._extractTransactionFields(that);
                that.trigger("updated");
            }
            if (success) {
                store.log.debug("verify -> success: " + JSON.stringify(data));

                // Process the list of products that are ineligible
                // for introductory prices.
                if (data && data.ineligible_for_intro_price &&
                         data.ineligible_for_intro_price.forEach) {
                    var ineligibleGroups = {};
                    data.ineligible_for_intro_price.forEach(function(pid) {
                        var p = store.get(pid);
                        if (p && p.group)
                            ineligibleGroups[p.group] = true;
                    });
                    store.products.forEach(function(p) {
                        if (data.ineligible_for_intro_price.indexOf(p.id) >= 0) {
                            store.log.debug('verify -> ' + p.id + ' ineligibleForIntroPrice:true');
                            p.set('ineligibleForIntroPrice', true);
                        }
                        else {
                            if (p.group && ineligibleGroups[p.group]) {
                                store.log.debug('verify -> ' + p.id + ' ineligibleForIntroPrice:true');
                                p.set('ineligibleForIntroPrice', true);
                            }
                            else {
                                store.log.debug('verify -> ' + p.id + ' ineligibleForIntroPrice:false');
                                p.set('ineligibleForIntroPrice', false);
                            }
                        }
                    });
                }
                if (data && data.collection && data.collection.forEach) {
                    // new behavior: the validator sets products state in the collection
                    // (including expiry status)
                    data.collection.forEach(function(purchase) {
                        var p = store.get(purchase.id);
                        if (p) {
                            p.set(purchase);
                        }
                    });

                }
                else if (that.expired) {
                    // old behavior: a valid receipt means the subscription isn't expired.
                    that.set("expired", false);
                }

                store.utils.callExternal('verify.success', successCb, that, data);
                store.utils.callExternal('verify.done', doneCb, that);
                that.trigger("verified");
            }
            else {
                store.log.debug("verify -> error: " + JSON.stringify(data));
                var msg = data && data.error && data.error.message ? data.error.message : '';
                var err = new store.Error({
                    code: store.ERR_VERIFICATION_FAILED,
                    message: "Transaction verification failed: " + msg
                });
                if (data.code === store.PURCHASE_EXPIRED) {
                    err = new store.Error({
                        code: store.ERR_PAYMENT_EXPIRED,
                        message: "Transaction expired: " + msg
                    });
                    that.set("expired", true);
                    store.error(err);
                    store.utils.callExternal('verify.error', errorCb, err);
                    store.utils.callExternal('verify.done', doneCb, that);
                    that.trigger("expired");
                    that.set("state", store.VALID);
                    store.utils.callExternal('verify.expired', expiredCb, that);
                }
                else if (nRetry < 4) {
                    // It failed... let's try one more time. Maybe the appStoreReceipt wasn't updated yet.
                    nRetry += 1;
                    delay(this, tryValidation, (1500 + nRetry * 1000) * nRetry * nRetry);
                }
                else {
                    store.log.debug("validation failed, no retrying, trigger an error");
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
            if (that.type !== store.APPLICATION) {
                var err = new store.Error({
                    code: store.ERR_VERIFICATION_FAILED,
                    message: "Product isn't in the APPROVED state"
                });
                store.error(err);
                store.utils.callExternal('verify.error', errorCb, err);
            }
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

store._extractTransactionFields = function(that, t) {
    t = t || that.transaction;
    store.log.debug('transaction fields for ' + that.id);
    // using legacy transactions (platform specific)
    if (t.type === 'ios-appstore' && t.expires_date_ms) {
        that.lastRenewalDate = new Date(parseInt(t.purchase_date_ms));
        that.expiryDate = new Date(parseInt(t.expires_date_ms));
        store.log.debug('expiryDate: ' + that.expiryDate.toISOString());
    }
    else if (t.type === 'android-playstore' && t.expiryTimeMillis > 0) {
        that.lastRenewalDate = new Date(parseInt(t.startTimeMillis));
        that.expiryDate = new Date(parseInt(t.expiryTimeMillis));
        store.log.debug('expiryDate: ' + that.expiryDate.toISOString());
    }
    // using unified transaction fields
    if (t.expiryDate)
        that.expiryDate = new Date(t.expiryDate);
    if (t.lastRenewalDate)
        that.lastRenewalDate = new Date(t.lastRenewalDate);
    if (t.renewalIntent)
        that.renewalIntent = t.renewalIntent;
    // owned?
    if (that.type === store.PAID_SUBSCRIPTION && +that.expiryDate) {
        var now = +new Date();
        if (now > that.expiryDate.getTime() + 60000) {
            window.setTimeout(function() {
                if (that.state === store.OWNED) {
                    that.set('state', store.APPROVED);
                    that.verify();
                }
            }, 30000);
        }
    }
    return t;
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
    if (typeof product.length === 'number')
        registerProducts(product);
    else
        store.register([product]);
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
///  - `"owned"` - all products in the OWNED state.
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


// Store all pending callbacks, prevents promises to be called multiple times.
var callbacks = {};

// Next call to `order` will store its callbacks using this ID, then increment the ID.
var callbackId = 0;

///
/// ## <a name="order"></a>*store.order(product, additionalData)*
///
/// Initiate the purchase of a product.
///
/// The `product` argument can be either:
///
///  - the `store.Product` object
///  - the product `id`
///  - the product `alias`
///
/// The `additionalData` argument can be either:
///  - null
///  - object with attributes:
///    - `oldSku`, a string with the old subscription to upgrade/downgrade on Android.
///      **Note**: if another subscription product is already owned that is member of
///      the same group, `oldSku` will be set automatically for you (see `product.group`).
///    - `prorationMode`, a string that describe the proration mode to apply when upgrading/downgrading a subscription (with `oldSku`) on Android. See https://developer.android.com/google/play/billing/subs#change
///      **Possible values:**
///       - `DEFERRED` - Replacement takes effect when the old plan expires, and the new price will be charged at the same time.
///       - `IMMEDIATE_AND_CHARGE_PRORATED_PRICE` - Replacement takes effect immediately, and the billing cycle remains the same.
///       - `IMMEDIATE_WITHOUT_PRORATION` - Replacement takes effect immediately, and the new price will be charged on next recurrence time.
///       - `IMMEDIATE_WITH_TIME_PRORATION` - Replacement takes effect immediately, and the remaining time will be prorated and credited to the user.
///    - `discount`, a object that describes the discount to apply with the purchase (iOS only):
///       - `id`, discount identifier
///       - `key`, key identifier
///       - `nonce`, uuid value for the nonce
///       - `timestamp`, time at which the signature was generated (in milliseconds since epoch)
///       - `signature`, cryptographic signature that unlock the discount
///
/// See the ["Purchasing section"](#purchasing) to learn more about
/// the purchase process.
///
/// See ["Subscriptions Offer Best Practices"](https://developer.apple.com/videos/play/wwdc2019/305/)
/// for more details on subscription offers.
///
store.order = function(pid, additionalData) {

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

    var a; // short name for additionalData
    if (additionalData && typeof additionalData === 'object') {
        a = p.additionalData = Object.assign({}, additionalData);
    }
    else {
        a = p.additionalData = {};
    }

    // Associate the active user with the purchase
    if (!a.applicationUsername) {
        a.applicationUsername = store.getApplicationUsername(p);
    }

    // Let the platform extend additional data
    if (store.extendAdditionalData) {
        store.extendAdditionalData(p);
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
        p.push({
            state: store.REQUESTED
        });
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

//
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


/// ## <a name="validator"></a> *store.validator*
/// Set this attribute to either:
///
///  - the URL of your purchase validation service ([example](#validation-url-example))
///     - [Fovea's receipt validator](https://billing.fovea.cc) or your own service.
///  - a custom validation callback method ([example](#validation-callback-example))
///
/// #### validation URL example
///
/// ```js
/// store.validator = "https://validator.fovea.cc"; // if you want to use Fovea **
/// ```
///
/// * **URL**
///
///   `/your-check-purchase-path`
///
/// * **Method:**
///
///   `POST`
///
/// * **Data Params**
///
///   The **product** object will be added as a json string.
///
///   Example body:
///
///   ```js
///   {
///     additionalData : null
///     alias : "monthly1"
///     currency : "USD"
///     description : "Monthly subscription"
///     id : "subscription.monthly"
///     loaded : true
///     price : "$12.99"
///     priceMicros : 12990000
///     state : "approved"
///     title : "The Monthly Subscription Title"
///     transaction : { // Additional fields based on store type (see "transactions" below)  }
///     type : "paid subscription"
///     valid : true
///   }
///   ```
///
///   The `transaction` parameter is an object, see [transactions](#transactions).
///
/// * **Success Response:**
///   * **Code:** 200 <br />
///     **Content:**
///     ```
///     {
///         ok : true,
///         data : {
///             transaction : { // Additional fields based on store type (see "transactions" below) }
///         }
///     }
///     ```
///     The `transaction` parameter is an object, see [transactions](#transactions).  Optional.  Will replace the product's transaction field with this.
///
/// * **Error Response:**
///   * **Code:** 200 (for [validation error codes](#validation-error-codes))<br />
///     **Content:**
///     ```
///     {
///         ok : false,
///         data : {
///             code : 6778003 // Int. Corresponds to a validation error code, click above for options.
///         }
///         error : { // (optional)
///             message : "The subscription is expired."
///         }
///     }
///     ```
///   OR
///   * **Code:** non-200 <br />
///   The response's *status* and *statusText* will be displayed in an formatted error string.
///
///
/// ** Fovea's receipt validator is [available here](https://billing.fovea.cc).
///
/// #### validation callback example
///
/// ```js
/// store.validator = function(product, callback) {
///
///     // Here, you will typically want to contact your own webservice
///     // where you check transaction receipts with either Apple or
///     // Google servers.
///     callback(true, { ... transaction details ... }); // success!
///     callback(true, { transaction: "your custom details" }); // success!
///         // your custom details will be merged into the product's transaction field
///
///     // OR
///     callback(false, {
///         code: store.PURCHASE_EXPIRED, // **Validation error code
///         error: {
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
///
/// ** Validation error codes are [documented here](#validation-error-codes).
///
store.validator = null;

var validationRequests = [];
var timeout = null;

function runValidation() {
  store.log.debug('runValidation()');

  timeout = null;
  var requests = validationRequests;
  validationRequests = [];

  // Merge validation requests by products.
  var byProduct = {};
  requests.forEach(function(request) {
    var productId = request.product.id;
    if (byProduct[productId]) {
      byProduct[productId].callbacks.push(request.callback);
      // assume the most up to date value for product will come last
      byProduct[productId].product = request.product;
    }
    else {
      byProduct[productId] = {
        product: request.product,
        callbacks: [request.callback]
      };
    }
  });

  // Run one validation request for each product.
  Object.keys(byProduct).forEach(function(productId) {
      var request = byProduct[productId];
      var product = request.product;

      // Ensure applicationUsername is sent with validation requests
      if (!product.additionalData) {
          product.additionalData = {};
      }
      if (!product.additionalData.applicationUsername) {
          product.additionalData.applicationUsername =
              store.getApplicationUsername(product);
      }
      if (!product.additionalData.applicationUsername) {
          delete product.additionalData.applicationUsername;
      }

      var data = JSON.parse(JSON.stringify(product));
      data.device = Object.assign(data.device || {}, getDeviceInfo());

      // Post
      store.utils.ajax({
          url: (typeof store.validator === 'string') ? store.validator : store.validator.url,
          method: 'POST',
          customHeaders: (typeof store.validator === 'string') ? null : store.validator.headers,
          data: data,
          success: function(data) {
              store.log.debug("validator success, response: " + JSON.stringify(data));
              request.callbacks.forEach(function(callback) {
                  callback(data && data.ok, data.data);
              });
          },
          error: function(status, message, data) {
              var fullMessage = "Error " + status + ": " + message;
              store.log.debug("validator failed, response: " + JSON.stringify(fullMessage));
              store.log.debug("body => " + JSON.stringify(data));
              request.callbacks.forEach(function(callback) {
                  callback(false, fullMessage);
              });
          }
      });
  });

  function isArray(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  }
  function isObject(arg) {
    return Object.prototype.toString.call(arg) === '[object Object]';
  }

  // List of functions allowed by store.validator_privacy_policy
  function getPrivacyPolicy () {
    if (typeof store.validator_privacy_policy === 'string')
      return store.validator_privacy_policy.split(',');
    else if (isArray(store.validator_privacy_policy))
      return store.validator_privacy_policy;
    else // default: no tracking
      return ['analytics','support','fraud'];
  }

  function getDeviceInfo () {

    var privacy_policy = getPrivacyPolicy(); // string[]
    function allowed(policy) {
      return privacy_policy.indexOf(policy) >= 0;
    }

    // Different versions of the plugin use different response fields.
    // Sending this information allows the validator to reply with only expected information.
    var ret = {
      plugin: 'cordova-plugin-purchase/' + store.version,
    };

    // the cordova-plugin-device global object
    var device = {};
    if (isObject(this.device))
      device = this.device;

    // Send the receipt validator information about the device.
    // This will allow to make vendor or device specific fixes and detect class
    // of devices with issues.
    // Knowing running version of OS and libraries also required for handling
    // support requests.
    if (allowed('analytics') || allowed('support')) {
      // Version of ionic (if applicable)
      var ionic = this.Ionic || this.ionic;
      if (ionic && ionic.version)
        ret.ionic = ionic.version;
      // Information from the cordova-plugin-device (if installed)
      if (device.cordova)
        ret.cordova = device.cordova; // Version of cordova
      if (device.model)
        ret.model = device.model; // Device model
      if (device.platform)
        ret.platform = device.platform; // OS
      if (device.version)
        ret.version = device.version; // OS version
      if (device.manufacturer)
        ret.manufacturer = device.manufacturer; // Device manufacturer
    }

    // Device identifiers are used for tracking users across services
    // It is sometimes required for support requests too, but I choose to
    // keep this out.
    if (allowed('tracking')) {
      if (device.serial)
        ret.serial = device.serial; // Hardware serial number
      if (device.uuid)
        ret.uuid = device.uuid; // Device UUID
    }

    // Running from a simulator is an error condition for in-app purchases.
    // Since only developers run in a simulator, let's always report that.
    if (device.isVirtual)
      ret.isVirtual = device.isVirtual; // Simulator

    // Probably nobody wants to disable fraud discovery.
    // A fingerprint of the device identifiers is used for fraud discovery.
    // An alert should be triggered by the validator when a lot of devices
    // share a single receipt.
    if (allowed('fraud')) {
      // For fraud discovery, we only need a fingerprint of the device.
      var fingerprint = '';
      if (device.serial)
        fingerprint = 'serial:' + device.serial; // Hardware serial number
      else if (device.uuid)
        fingerprint = 'uuid:' + device.uuid; // Device UUID
      else {
        // Using only model and manufacturer, we might end-up with many
        // users sharing the same fingerprint, which is fine for fraud discovery.
        if (device.model)
          fingerprint += '/' + device.model;
        if (device.manufacturer)
          fingerprint = '/' + device.manufacturer;
      }
      // Fingerprint is hashed to keep required level of privacy.
      if (fingerprint)
        ret.fingerprint = store.utils.md5(fingerprint);
    }

    return ret;
  }
}

function scheduleValidation() {
  store.log.debug('scheduleValidation()');
  if (timeout)
    clearTimeout(timeout);
  timeout = setTimeout(runValidation, 1500);
}

//
// ## store._validator
//
// Execute the internal validation call, either to a webservice
// or to the provided callback.
//
// Also makes sure to refresh the receipts.
//
store._validator = function(product, callback, isPrepared) {
    if (!store.validator) {
        callback(true, product);
        return;
    }

    if (store._prepareForValidation && isPrepared !== true) {
        store._prepareForValidation(product, function() {
            store._validator(product, callback, true);
        });
        return;
    }

    if (typeof store.validator === 'string' || typeof store.validator === 'object') {
        validationRequests.push({
            product: product,
            callback: callback
        });
        scheduleValidation();
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
/// in the `product.transaction` data. This field is an object with a
/// different format depending on the store type.
///
/// The `product.transaction` field has the following format:
///
/// - `type`: "ios-appstore" or "android-playstore"
/// - store specific data
///
/// #### store specific data - iOS
///
/// Refer to [this documentation for iOS](https://developer.apple.com/library/ios/releasenotes/General/ValidateAppStoreReceipt/Chapters/ReceiptFields.html#//apple_ref/doc/uid/TP40010573-CH106-SW1).
///
/// **Transaction Fields (Subscription)**
///
/// ```
///     appStoreReceipt:"appStoreReceiptString"
///     id : "idString"
///     original_transaction_id:"transactionIdString",
///     "type": "ios-appstore"
/// ```
///
/// #### store specific data - Android
///
/// Start [here for Android](https://developer.android.com/google/play/billing/billing_integrate.html#billing-security).
///
/// ```
/// developerPayload : undefined
/// id : "idString"
/// purchaseToken : "purchaseTokenString"
/// receipt : '{ // NOTE: receipt's value is string and will need to be parsed
///     "autoRenewing":true,
///     "orderId":"orderIdString",
///     "packageName":"com.mycompany",
///     "purchaseTime":1555217574101,
///     "purchaseState":0,
///     "purchaseToken":"purchaseTokenString"
/// }'
/// signature : "signatureString",
/// "type": "android-playstore"
/// ```
///
/// #### Fovea
///
/// Another option is to use [Fovea's validation service](http://billing.fovea.cc/) that implements
/// all the best practices to enhance your subscriptions and secure your transactions.
///

///
/// ## <a name="update"></a> *store.update()*
///
/// Refresh the historical state of purchases and price of items.
/// This is required to know if a user is eligible for promotions like introductory
/// offers or subscription discount.
///
/// It is recommended to call this method right before entering your in-app
/// purchases or subscriptions page.
///
/// You can of `update()` as a light version of `refresh()` that won't ask for the
/// user password. Note that this method is called automatically for you on a few
/// useful occasions, like when a subscription expires.
///
store.update = function() {};

})();
(function() {


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
/// _NOTE:_ It is a required by the Apple AppStore that a "Refresh Purchases"
///         button be visible in the UI.
///
/// ##### return value
///
/// This method returns a promise-like object with the following functions:
///
/// - `.cancelled(fn)` - Calls `fn` when the user cancelled the refresh request.
/// - `.failed(fn)` - Calls `fn` when restoring purchases failed.
/// - `.completed(fn)` - Calls `fn` when the queue of previous purchases have been processed.
///   At this point, all previously owned products should be in the approved state.
/// - `.finished(fn)` - Calls `fn` when the restore is finished, i.e. it has failed, been cancelled,
///   or all purchased in the approved state have been finished or expired.
///
/// In the case of the restore purchases call, you will want to hide any progress bar when the
/// `finished` callback is called.
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
/// ```html
/// <button onclick="restorePurchases()">Restore Purchases</button>
/// ```
///
/// ```js
/// function restorePurchases() {
///    showProgress();
///    store.refresh().finished(hideProgress);
/// }
/// ```
///
/// To make the restore purchases work as expected, please make sure that
/// the "approved" event listener had be registered properly
/// and, in the callback, `product.finish()` is called after handling.
///

var initialRefresh = true;

function createPromise() {
    var events = {};

    // User callbacks for each type of events
    var callbacks = {
        "refresh-failed": [],
        "refresh-cancelled": [],
        "refresh-completed": [],
        "refresh-finished": [],
    };

    // Setup our own event handlers
    store.once("", "refresh-failed", failed);
    store.once("", "refresh-cancelled", cancelled);
    store.once("", "refresh-completed", completed);
    store.once("", "refresh-finished", finished);
    store.error(error);

    // Return the promise object
    return {
        cancelled: genPromise("refresh-cancelled"),
        failed: genPromise("refresh-failed"),
        completed: genPromise("refresh-completed"),
        finished: genPromise("refresh-finished"),
    };

    // A promise function calls the callback or registers it
    function genPromise(eventName) {
        return function(cb) {
            if (events[eventName])
                cb();
            else
                callbacks[eventName].push(cb);
            return this;
        };
    }

    // Call all user callbacks for a given event
    function callback(eventName) {
        callbacks[eventName].forEach(function(cb) { cb(); });
        callbacks[eventName] = [];
    }

    // Delete user callbacks for a given event
    // Trigger the refresh-finished event when no more products are in the
    // approved state.
    function checkFinished() {
        if (events["refresh-finished"]) return;
        function isApproved(p) { return p.state === store.APPROVED; }
        if (store.products.filter(isApproved).length === 0) {
            // done processing
            store.off(checkFinished);
            finish();
        }
    }

    // Remove base events handlers
    function off() {
        store.off(cancelled);
        store.off(completed);
        store.off(failed);
        store.off(checkFinished);
        store.off(error);
    }

    // Fire a base event
    function fire(eventName) {
        if (events[eventName]) return false;
        events[eventName] = true;
        callback(eventName);
        return true;
    }

    // Fire the refresh-finished event
    function finish() {
        off();
        if (events["refresh-finished"]) return;
        events["refresh-finished"] = true;
        // setTimeout guarantees calling order
        setTimeout(function() {
            store.trigger("refresh-finished");
        }, 100);
    }

    // refresh-cancelled called when the user cancelled the password popup
    function cancelled() {
        fire("refresh-cancelled");
        finish();
    }

    // refresh-cancelled called when restore purchases couldn't complete
    // (can't connect to store or user not allowed to make purchases)
    function failed() {
        fire("refresh-failed");
        finish();
    }

    function error() {
        fire("refresh-failed");
        finish();
    }

    // refresh-completed is called when all owned products have been
    // sent to the approved state.
    function completed() {
        if (fire("refresh-completed")) {
            store.when().updated(checkFinished);
            checkFinished(); // make sure this is called at least once
        }
    }

    function finished() {
        callback("refresh-finished");
    }

}

store.refresh = function() {

    var promise = createPromise();

    store.trigger("refreshed");
    if (initialRefresh) {
        initialRefresh = false;
        return promise;
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
    return promise;
};

})();

///
/// ## <a name="manageSubscriptions"></a>*store.manageSubscriptions()*
///
/// Opens the Manage Subscription page (AppStore, Play, Microsoft, ...),
/// where the user can change his/her subscription settings or unsubscribe.
///
/// ##### example usage
///
/// ```js
///    store.manageSubscriptions();
/// ```
///

///
/// ## <a name="manageBilling"></a>*store.manageBilling()*
///
/// Opens the Manage Billing page (AppStore, Play, Microsoft, ...),
/// where the user can update his/her payment methods.
///
/// ##### example usage
///
/// ```js
///    store.manageBilling();
/// ```
///

///
/// ## <a name="redeem"></a>*store.redeem()*
///
/// Redeems a promotional offer from within the app.
///
/// * On iOS, calling `store.redeem()` will open the Code Redemption Sheet.
///   * See the [offer codes documentation](https://developer.apple.com/app-store/subscriptions/#offer-codes) for details.
/// * This call does nothing on Android and Microsoft UWP.
///
/// ##### example usage
///
/// ```js
///    store.redeem();
/// ```

(function(){


var logLevel = {};
logLevel[store.ERROR] = "ERROR";
logLevel[store.WARNING] = "WARNING";
logLevel[store.INFO] = "INFO";
logLevel[store.DEBUG] = "DEBUG";

function log(level, o) {
    var maxLevel = store.verbosity === true ? 1 : store.verbosity;
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
(function() {

///
/// ## `store.developerPayload`
///
/// An optional developer-specified string to attach to new orders, to
/// provide supplemental information if required.
///
/// When it's a string, it contains the direct value to use. Example:
/// ```js
/// store.developerPayload = "some-value";
/// ```
///
/// When it's a function, the payload will be the returned value. The
/// function takes a product as argument and returns a string.
///
/// Example:
/// ```js
/// store.developerPayload = function(product) {
///   return getInternalId(product.id);
/// };
/// ```

store.developerPayload = "";

///
/// ## `store.applicationUsername`
///
/// An optional string that is uniquely associated with the
/// user's account in your app.
///
/// This value can be used for payment risk evaluation, or to link
/// a purchase with a user on a backend server.
///
/// When it's a string, it contains the direct value to use. Example:
/// ```js
/// store.applicationUsername = "user_id_1234567";
/// ```
///
/// When it's a function, the `applicationUsername` will be the returned value.
///
/// Example:
/// ```js
/// store.applicationUsername = function() {
///   return state.get(["session", "user_id"]);
/// };
/// ```
///
store.applicationUsername = "";

///
/// ## `store.getApplicationUsername()`
///
/// Evaluate and return the value from `store.applicationUsername`.
///
/// When its a string, the value is returned right away.
///
/// When its a function, the return value of the function is returned.
///
/// Example:
/// ```js
/// store.getApplicationUsername()
/// ```
///
store.getApplicationUsername = stringOrFunction('applicationUsername');

///
/// ## `store.developerName`
///
/// An optional string of developer profile name. This value can be
/// used for payment risk evaluation.
///
/// _Do not use the user account ID for this field._
///
/// Example:
/// ```js
/// store.developerName = "billing.fovea.cc";
/// ```
///
store.developerName = "";

// For internal use.
store._evaluateDeveloperPayload = stringOrFunction('developerPayload');

function stringOrFunction(key) {
    return function (product) {
        if (typeof store[key] === 'function')
            return store[key](product);
        return store[key] || "";
    };
}

})();

///
/// #### <a name="getGroup"></a>`store.getGroup(groupId)` ##
///
/// Return all products member of a given subscription group.
///
store.getGroup = function(groupId) {
    if (!groupId) return [];
    return store.products.filter(function(product) {
        return product.group === groupId;
    });
};

/// # Random Tips
///
/// - Sometimes during development, the queue of pending transactions fills up on your devices. Before doing anything else you can set `store.autoFinishTransactions` to `true` to clean up the queue. Beware: **this is not meant for production**.
/// - The plugin will auto refresh the status of user's purchases every 24h. You can change this interval by setting `store.autoRefreshIntervalMillis` to another interval (before calling `store.init()`). (this isn't implemented on iOS since [it isn't necessary](https://github.com/j3k0/cordova-plugin-purchase/issues/777#issuecomment-481633968)). Set to `0` to disable auto-refreshing.
///
/// # internal APIs
/// USE AT YOUR OWN RISKS

(function() {


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

var dateFields = ['expiryDate', 'purchaseDate', 'lastRenewalDate', 'renewalIntentChangeDate'];

store.Product.prototype.set = function(key, value) {
    if (typeof key === 'string') {
        if (dateFields.indexOf(key) >= 0 && !(value instanceof Date)) {
            value = new Date(value);
        }
        if (key === 'isExpired' && value === true && this.owned) {
            this.set('owned', false);
            this.set('state', store.VALID);
            this.set('expired', true);
            this.trigger('expired');
        }
        if (key === 'isExpired' && value === false && !this.owned) {
            this.set('expired', false);
            if (this.state !== store.APPROVED) {
                // user have to "finish()" to own an approved transaction
                // in other cases, we can safely set the OWNED state.
                this.set('state', store.OWNED);
            }
        }
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

var attributesStack = {};

store.Product.prototype.push = function(key, value) {
    // save attributes
    var stack = attributesStack[this.id];
    if (!stack) {
        stack = attributesStack[this.id] = [];
    }
    stack.push(JSON.stringify(this));
    // update attributes
    this.set(key, value);
};

store.Product.prototype.pop = function() {
    // restore attributes
    var stack = attributesStack[this.id];
    if (!stack) {
        return;
    }
    var json = stack.pop();
    if (!json) {
        return;
    }
    var attributes = JSON.parse(json);
    for (var key in attributes) {
        this.set(key, attributes[key]);
    }
};

store.Product.prototype.stateChanged = function() {

    // update some properties useful to the user
    // to make sense of the product state without writing
    // complex conditions.

    this.canPurchase = this.state === store.VALID;
    store.getGroup(this.group).forEach(function(otherProduct) {
        if (otherProduct.state === store.INITIATED)
            this.canPurchase = false;
    }.bind(this));
    this.loaded      = this.state && this.state !== store.REGISTERED;
    this.owned       = this.owned || this.state === store.OWNED;
    this.downloading = this.downloading || this.state === store.DOWNLOADING;
    this.downloaded  = this.downloaded || this.state === store.DOWNLOADED;
    this.deferred    = this.deferred && this.state === store.INITIATED;

    // update validity
    this.valid       = this.state !== store.INVALID;
    if (!this.state || this.state === store.REGISTERED)
        delete this.valid;

    store.log.debug("state: " + this.id + " -> " + this.state);

    if (this.state)
        this.trigger(this.state);
};

/// ### aliases to `store` methods, added for convenience.
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
            // store.log.debug("queries ++ '" + fullQuery + "'");
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
        // store.log.debug("queries !! '" + action + "'");
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
            // store.log.debug("store.queries !! '" + q + "'");
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
        if (options.customHeaders) {
            Object.keys(options.customHeaders).forEach(function (header) {
                store.log.debug('ajax -> adding custom header: ' + header );
                xhr.setRequestHeader( header, options.customHeaders[header]);
            });
        }
        xhr.setRequestHeader("Accept", "application/json");
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
    },

    ///
    /// ### store.utils.uuidv4()
    /// Returns an UUID v4. Uses `window.crypto` internally to generate random values.
    ///
    uuidv4: function () {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, function (c) {
            return (c ^ (window.crypto || window.msCrypto).getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
        });
    },

    ///
    /// ### store.utils.md5(str)
    /// Returns the MD5 hash-value of the passed string.
    ///
    /* eslint-disable */ /* jshint ignore:start */
    // Based on the work of Jeff Mott, who did a pure JS implementation of the MD5 algorithm that was published by Ronald L. Rivest in 1991.
    // Code was imported from https://github.com/pvorb/node-md5
    md5: function md5(r) {
        function n(o){if(t[o])return t[o].exports;var e=t[o]={i:o,l:!1,exports:{}};return r[o].call(e.exports,e,e.exports,n),e.l=!0,e.exports}var t={};return n.m=r,n.c=t,n.i=function(r){return r},n.d=function(r,t,o){n.o(r,t)||Object.defineProperty(r,t,{configurable:!1,enumerable:!0,get:o})},n.n=function(r){var t=r&&r.__esModule?function(){return r.default}:function(){return r};return n.d(t,"a",t),t},n.o=function(r,n){return Object.prototype.hasOwnProperty.call(r,n)},n.p="",n(n.s=4)
    }([function(r,n){var t={utf8:{stringToBytes:function(r){return t.bin.stringToBytes(unescape(encodeURIComponent(r)))},bytesToString:function(r){return decodeURIComponent(escape(t.bin.bytesToString(r)))}},bin:{stringToBytes:function(r){for(var n=[],t=0;t<r.length;t++)n.push(255&r.charCodeAt(t));return n},bytesToString:function(r){for(var n=[],t=0;t<r.length;t++)n.push(String.fromCharCode(r[t]));return n.join("")}}};r.exports=t},function(r,n,t){!function(){var n=t(2),o=t(0).utf8,e=t(3),u=t(0).bin,i=function(r,t){r.constructor==String?r=t&&"binary"===t.encoding?u.stringToBytes(r):o.stringToBytes(r):e(r)?r=Array.prototype.slice.call(r,0):Array.isArray(r)||(r=r.toString());for(var f=n.bytesToWords(r),s=8*r.length,c=1732584193,a=-271733879,l=-1732584194,g=271733878,h=0;h<f.length;h++)f[h]=16711935&(f[h]<<8|f[h]>>>24)|4278255360&(f[h]<<24|f[h]>>>8);f[s>>>5]|=128<<s%32,f[14+(s+64>>>9<<4)]=s;for(var p=i._ff,y=i._gg,v=i._hh,d=i._ii,h=0;h<f.length;h+=16){var b=c,T=a,x=l,B=g;c=p(c,a,l,g,f[h+0],7,-680876936),g=p(g,c,a,l,f[h+1],12,-389564586),l=p(l,g,c,a,f[h+2],17,606105819),a=p(a,l,g,c,f[h+3],22,-1044525330),c=p(c,a,l,g,f[h+4],7,-176418897),g=p(g,c,a,l,f[h+5],12,1200080426),l=p(l,g,c,a,f[h+6],17,-1473231341),a=p(a,l,g,c,f[h+7],22,-45705983),c=p(c,a,l,g,f[h+8],7,1770035416),g=p(g,c,a,l,f[h+9],12,-1958414417),l=p(l,g,c,a,f[h+10],17,-42063),a=p(a,l,g,c,f[h+11],22,-1990404162),c=p(c,a,l,g,f[h+12],7,1804603682),g=p(g,c,a,l,f[h+13],12,-40341101),l=p(l,g,c,a,f[h+14],17,-1502002290),a=p(a,l,g,c,f[h+15],22,1236535329),c=y(c,a,l,g,f[h+1],5,-165796510),g=y(g,c,a,l,f[h+6],9,-1069501632),l=y(l,g,c,a,f[h+11],14,643717713),a=y(a,l,g,c,f[h+0],20,-373897302),c=y(c,a,l,g,f[h+5],5,-701558691),g=y(g,c,a,l,f[h+10],9,38016083),l=y(l,g,c,a,f[h+15],14,-660478335),a=y(a,l,g,c,f[h+4],20,-405537848),c=y(c,a,l,g,f[h+9],5,568446438),g=y(g,c,a,l,f[h+14],9,-1019803690),l=y(l,g,c,a,f[h+3],14,-187363961),a=y(a,l,g,c,f[h+8],20,1163531501),c=y(c,a,l,g,f[h+13],5,-1444681467),g=y(g,c,a,l,f[h+2],9,-51403784),l=y(l,g,c,a,f[h+7],14,1735328473),a=y(a,l,g,c,f[h+12],20,-1926607734),c=v(c,a,l,g,f[h+5],4,-378558),g=v(g,c,a,l,f[h+8],11,-2022574463),l=v(l,g,c,a,f[h+11],16,1839030562),a=v(a,l,g,c,f[h+14],23,-35309556),c=v(c,a,l,g,f[h+1],4,-1530992060),g=v(g,c,a,l,f[h+4],11,1272893353),l=v(l,g,c,a,f[h+7],16,-155497632),a=v(a,l,g,c,f[h+10],23,-1094730640),c=v(c,a,l,g,f[h+13],4,681279174),g=v(g,c,a,l,f[h+0],11,-358537222),l=v(l,g,c,a,f[h+3],16,-722521979),a=v(a,l,g,c,f[h+6],23,76029189),c=v(c,a,l,g,f[h+9],4,-640364487),g=v(g,c,a,l,f[h+12],11,-421815835),l=v(l,g,c,a,f[h+15],16,530742520),a=v(a,l,g,c,f[h+2],23,-995338651),c=d(c,a,l,g,f[h+0],6,-198630844),g=d(g,c,a,l,f[h+7],10,1126891415),l=d(l,g,c,a,f[h+14],15,-1416354905),a=d(a,l,g,c,f[h+5],21,-57434055),c=d(c,a,l,g,f[h+12],6,1700485571),g=d(g,c,a,l,f[h+3],10,-1894986606),l=d(l,g,c,a,f[h+10],15,-1051523),a=d(a,l,g,c,f[h+1],21,-2054922799),c=d(c,a,l,g,f[h+8],6,1873313359),g=d(g,c,a,l,f[h+15],10,-30611744),l=d(l,g,c,a,f[h+6],15,-1560198380),a=d(a,l,g,c,f[h+13],21,1309151649),c=d(c,a,l,g,f[h+4],6,-145523070),g=d(g,c,a,l,f[h+11],10,-1120210379),l=d(l,g,c,a,f[h+2],15,718787259),a=d(a,l,g,c,f[h+9],21,-343485551),c=c+b>>>0,a=a+T>>>0,l=l+x>>>0,g=g+B>>>0}return n.endian([c,a,l,g])};i._ff=function(r,n,t,o,e,u,i){var f=r+(n&t|~n&o)+(e>>>0)+i;return(f<<u|f>>>32-u)+n},i._gg=function(r,n,t,o,e,u,i){var f=r+(n&o|t&~o)+(e>>>0)+i;return(f<<u|f>>>32-u)+n},i._hh=function(r,n,t,o,e,u,i){var f=r+(n^t^o)+(e>>>0)+i;return(f<<u|f>>>32-u)+n},i._ii=function(r,n,t,o,e,u,i){var f=r+(t^(n|~o))+(e>>>0)+i;return(f<<u|f>>>32-u)+n},i._blocksize=16,i._digestsize=16,r.exports=function(r,t){if(void 0===r||null===r)throw new Error("Illegal argument "+r);var o=n.wordsToBytes(i(r,t));return t&&t.asBytes?o:t&&t.asString?u.bytesToString(o):n.bytesToHex(o)}}()},function(r,n){!function(){var n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",t={rotl:function(r,n){return r<<n|r>>>32-n},rotr:function(r,n){return r<<32-n|r>>>n},endian:function(r){if(r.constructor==Number)return 16711935&t.rotl(r,8)|4278255360&t.rotl(r,24);for(var n=0;n<r.length;n++)r[n]=t.endian(r[n]);return r},randomBytes:function(r){for(var n=[];r>0;r--)n.push(Math.floor(256*Math.random()));return n},bytesToWords:function(r){for(var n=[],t=0,o=0;t<r.length;t++,o+=8)n[o>>>5]|=r[t]<<24-o%32;return n},wordsToBytes:function(r){for(var n=[],t=0;t<32*r.length;t+=8)n.push(r[t>>>5]>>>24-t%32&255);return n},bytesToHex:function(r){for(var n=[],t=0;t<r.length;t++)n.push((r[t]>>>4).toString(16)),n.push((15&r[t]).toString(16));return n.join("")},hexToBytes:function(r){for(var n=[],t=0;t<r.length;t+=2)n.push(parseInt(r.substr(t,2),16));return n},bytesToBase64:function(r){for(var t=[],o=0;o<r.length;o+=3)for(var e=r[o]<<16|r[o+1]<<8|r[o+2],u=0;u<4;u++)8*o+6*u<=8*r.length?t.push(n.charAt(e>>>6*(3-u)&63)):t.push("=");return t.join("")},base64ToBytes:function(r){r=r.replace(/[^A-Z0-9+\/]/gi,"");for(var t=[],o=0,e=0;o<r.length;e=++o%4)0!=e&&t.push((n.indexOf(r.charAt(o-1))&Math.pow(2,-2*e+8)-1)<<2*e|n.indexOf(r.charAt(o))>>>6-2*e);return t}};r.exports=t}()},function(r,n){function t(r){return!!r.constructor&&"function"==typeof r.constructor.isBuffer&&r.constructor.isBuffer(r)}function o(r){return"function"==typeof r.readFloatLE&&"function"==typeof r.slice&&t(r.slice(0,0))}r.exports=function(r){return null!=r&&(t(r)||o(r)||!!r._isBuffer)}},function(r,n,t){r.exports=t(1)}]),
    /* eslint-enable */ /* jshint ignore:end */

    // from underscore.js
    delay: restArguments(function(func, wait, args) {
        return window.setTimeout(function() {
            return func.apply(null, args);
        }, wait);
    }),
    // from underscore.js
    debounce: function(func, wait, immediate) {
        var timeout, result;
        var later = function(context, args) {
            timeout = null;
            if (args) result = func.apply(context, args);
        };
        var debounced = restArguments(function(args) {
            if (timeout) window.clearTimeout(timeout);
            timeout = store.utils.delay(later, wait, this, args);
            return result;
        });
        return debounced;
    },
};

// from underscore.js (License MIT)
// https://github.com/jashkenas/underscore
function restArguments(func, startIndex) {
    startIndex = startIndex == null ? func.length - 1 : +startIndex;
    return function() {
        var length = Math.max(arguments.length - startIndex, 0),
        rest = Array(length),
        index = 0;
        for (; index < length; index++) {
            rest[index] = arguments[index + startIndex];
        }
        switch (startIndex) {
            case 0: return func.call(this, rest);
            case 1: return func.call(this, arguments[0], rest);
            case 2: return func.call(this, arguments[0], arguments[1], rest);
        }
        var args = Array(startIndex + 1);
        for (index = 0; index < startIndex; index++) {
            args[index] = arguments[index];
        }
        args[startIndex] = rest;
        return func.apply(this, args);
    };
}

})();
// Add a polyfill for Object.assign in case it isn't supported (which is the case
// on Android < 4.4), see https://github.com/auth0/auth0-cordova/issues/46 for reference
if (typeof Object.assign != 'function') {
    Object.assign = function (target, varArgs) {
        'use strict';
        if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }
        var to = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];

            if (nextSource != null) {
                for (var nextKey in nextSource) {
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
        }
        return to;
    };
}

store.version = '10.5.4';
/*
 * Copyright (C) 2012-2013 by Guillaume Charhon
 * Modifications 10/16/2013 by Brian Thurlow
 */
/*global cordova */

(function() {


var log = function (msg) {
    console.log("InAppBilling[js]: " + msg);
};

var InAppBilling = function () {
    this.options = {};
};

InAppBilling.prototype.init = function (success, fail, options, skus, inAppSkus, subsSkus) {
	if (!options)
        options = {};

	this.options = {
		showLog: options.showLog !== false,
        onPurchaseConsumed: options.onPurchaseConsumed,
        onPurchasesUpdated: options.onPurchasesUpdated,
        onSetPurchases: options.onSetPurchases,
	};

	if (this.options.showLog) {
		log('setup ok');
	}

	var hasSKUs = false;
	// Optional Load SKUs to Inventory.
	if (typeof skus !== "undefined"){
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

    // Set a listener (see "listener()" function above)
    var listener = this.listener.bind(this);
    cordova.exec(listener, function(err) {}, "InAppBillingPlugin", "setListener", []);

	if (hasSKUs) {
		cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "init", [skus, inAppSkus, subsSkus]);
    }
	else {
        //No SKUs
		cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "init", []);
    }
};
InAppBilling.prototype.listener = function (msg) {
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
};
InAppBilling.prototype.getPurchases = function (success, fail) {
	if (this.options.showLog) {
		log('getPurchases()');
	}
	return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "getPurchases", ["null"]);
};
function ensureObject(obj) {
    return !!obj && obj.constructor === Object ? obj : {};
}
function extendAdditionalData(ad) {
    var additionalData = ensureObject(ad);
    if (!additionalData.accountId && additionalData.applicationUsername) {
        additionalData.accountId = store.utils.md5(additionalData.applicationUsername);
    }
    return additionalData;
}
InAppBilling.prototype.buy = function (success, fail, productId, additionalData) {
	if (this.options.showLog) {
		log('buy()');
	}
	return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "buy", [
        productId, extendAdditionalData(additionalData) ]);
};
InAppBilling.prototype.subscribe = function (success, fail, productId, additionalData) {
	if (this.options.showLog) {
		log('subscribe()');
	}
	if (additionalData.oldPurchasedSkus && this.options.showLog) {
        log('subscribe() -> upgrading of old SKUs!');
    }
	return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "subscribe", [
        productId, extendAdditionalData(additionalData) ]);
};
InAppBilling.prototype.consumePurchase = function (success, fail, productId, transactionId, developerPayload) {
	if (this.options.showLog) {
		log('consumePurchase()');
	}
	return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "consumePurchase", [productId, transactionId, developerPayload]);
};
InAppBilling.prototype.acknowledgePurchase = function (success, fail, productId, transactionId, developerPayload) {
	if (this.options.showLog) {
		log('acknowledgePurchase()');
	}
	return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "acknowledgePurchase", [productId, transactionId, developerPayload]);
};
InAppBilling.prototype.getAvailableProducts = function (success, fail) {
	if (this.options.showLog) {
		log('getAvailableProducts()');
	}
	return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "getAvailableProducts", ["null"]);
};
InAppBilling.prototype.manageSubscriptions = function () {
  return cordova.exec(function(){}, function(){}, "InAppBillingPlugin", "manageSubscriptions", []);
};
InAppBilling.prototype.manageBilling = function () {
  return cordova.exec(function(){}, function(){}, "InAppBillingPlugin", "manageBilling", []);
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
catch (e) {
    log(e);
}

})();
(function() {


var initialized = false;
var skus = [];
var inAppSkus = [];
var subsSkus = [];

store.when("refreshed", function() {
    if (!initialized) init();
});

store.when("re-refreshed", function() {
    store.iabGetPurchases(function() {
        store.trigger('refresh-completed');
    });
});

store.update = function(successCb, errorCb) {
    store.iabGetPurchases(function() {
        if (successCb)
            successCb();
    });
};

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

    for (var i = 0; i < store.products.length; ++i) {
      skus.push(store.products[i].id);
      if (store.products[i].type === store.PAID_SUBSCRIPTION)
        subsSkus.push(store.products[i].id);
      else
        inAppSkus.push(store.products[i].id);
    }

    store.inappbilling.init(iabReady,
        function(err) {
            initialized = false;
            store.error({
                code: store.ERR_SETUP,
                message: 'Init failed - ' + err
            });
            retry(init);
        },
        {
            onSetPurchases: iabSetPurchases,
            onPurchasesUpdated: iabPurchasesUpdated,
            onPurchaseConsumed: iabPurchaseConsumed,
            showLog: store.verbosity >= store.DEBUG ? true : false
        },
        skus, inAppSkus, subsSkus);
}

function iabReady() {
    store.log.debug("plugin -> ready");
    store.inappbilling.getAvailableProducts(iabLoaded, function(err) {
        retry(iabReady);
        store.error({
            code: store.ERR_LOAD,
            message: 'Loading product info failed - ' + err
        });
    });
}

function iabPurchaseConsumed(purchase) {
  store.log.debug("iabPurchaseConsumed: " + JSON.stringify(purchase));
  store.ready(function() {
    if (purchase && purchase.productId) {
      var product = store.get(purchase.productId);
      if (product) {
        store.setProductData(product, purchase);
        product.set({
          state: store.VALID,
          transaction: null,
        });
      }
    }
  });
}

function iabPurchasesUpdated(purchases) {
  store.log.debug("iabPurchasesUpdated: " + JSON.stringify(purchases));
  store.ready(function() {
    if (store.iabUpdatePurchases) {
      store.iabUpdatePurchases(purchases);
    }
  });
}

function iabSetPurchases(purchases) {
  store.log.debug("iabSetPurchases: " + JSON.stringify(purchases));
  store.ready(function() {
    if (store.iabSetPurchases) {
      store.iabSetPurchases(purchases);
    }
  });
}

function iabLoaded(validProducts) {
    store.log.debug("plugin -> loaded - " + JSON.stringify(validProducts));
    var p, i, vp;
    for (i = 0; i < validProducts.length; ++i) {
        vp = validProducts[i];

        if (vp.productId)
            p = store.products.byId[vp.productId];
        else
            p = null;

        if (p) {
            // See https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
            // assuming simple periods (P1M, P6W, ...)
            var normalizeISOPeriodUnit = function (period) {
                switch (period.slice(-1)) {
                    case 'D': return 'Day';
                    case 'W': return 'Week';
                    case 'M': return 'Month';
                    case 'Y': return 'Year';
                    default:  return period;
                }
            };
            var normalizeISOPeriodCount = function (period) {
              return parseInt(period.replace(/[A-Z]+/g, ''));
            };

            var trimTitle = function (title) {
              return title.split('(').slice(0, -1).join('(').replace(/ $/, '');
            };

            var subscriptionPeriod = vp.subscriptionPeriod ? vp.subscriptionPeriod : "";
            var introPriceSubscriptionPeriod = vp.introductoryPricePeriod ? vp.introductoryPricePeriod : "";
            var introPriceNumberOfPeriods = vp.introductoryPriceCycles ? vp.introductoryPriceCycles : 0;
            var introPricePeriodUnit = normalizeISOPeriodUnit(introPriceSubscriptionPeriod);
            var introPricePeriodCount = normalizeISOPeriodCount(introPriceSubscriptionPeriod);
            var introPricePeriod = (introPriceNumberOfPeriods || 1) * (introPricePeriodCount || 1);

            var introPricePaymentMode = null;
            if (vp.freeTrialPeriod) {
                introPricePaymentMode = 'FreeTrial';
            }
            else if (vp.introductoryPrice) {
                if (vp.introductoryPrice < vp.price && subscriptionPeriod === introPriceSubscriptionPeriod) {
                    introPricePaymentMode = 'PayAsYouGo';
                }
                else if (introPriceNumberOfPeriods === 1) {
                    introPricePaymentMode = 'UpFront';
                }
            }

            if (!introPricePaymentMode) {
                introPricePeriod= null;
                introPricePeriodUnit = null;
            }

            var parsedSubscriptionPeriod = {};
            if (subscriptionPeriod) {
              parsedSubscriptionPeriod.unit = normalizeISOPeriodUnit(subscriptionPeriod);
              parsedSubscriptionPeriod.count = normalizeISOPeriodCount(subscriptionPeriod);
            }

            p.set({
                title: trimTitle(vp.title || vp.name),
                price: vp.price || vp.formattedPrice,
                priceMicros: vp.price_amount_micros,
                trialPeriod: vp.trial_period || null,
                trialPeriodUnit: vp.trial_period_unit || null,
                billingPeriod: parsedSubscriptionPeriod.count || vp.billing_period || null,
                billingPeriodUnit: parsedSubscriptionPeriod.unit || vp.billing_period_unit || null,
                description: vp.description,
                currency: vp.price_currency_code || "",
                introPrice: vp.introductoryPrice ? vp.introductoryPrice : "",
                introPriceMicros: vp.introductoryPriceAmountMicros ? vp.introductoryPriceAmountMicros : "",
                introPricePeriod: introPricePeriod,
                introPricePeriodUnit: introPricePeriodUnit,
                introPriceNumberOfPeriods: introPricePeriod, // legacy props (deprecated)
                introPriceSubscriptionPeriod: introPricePeriodUnit, // legacy props (deprecrated)
                introPricePaymentMode: introPricePaymentMode,
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

    store.iabGetPurchases(function() {
        store.trigger('refresh-completed');
    });

    if (store.autoRefreshIntervalMillis !== 0) {
        // Auto-refresh every 24 hours (or autoRefreshIntervalMillis)
        var interval = store.autoRefreshIntervalMillis || (1000 * 3600 * 24);
        window.setInterval(store.refresh, interval);
    }
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
        }, product.id, product.additionalData);
    });
});

/// #### finish a purchase
/// When a consumable product enters the store.FINISHED state,
/// `consume()` the product.
store.when("product", "finished", function(product) {
    var transaction = product.transaction;
    var id = transaction && transaction.id || "";
    store.log.debug("plugin -> consumable finished");
    if (product.type === store.CONSUMABLE || product.type === store.NON_RENEWING_SUBSCRIPTION) {
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
            id,
            getDeveloperPayload(product)
        );
    }
    else if (store.requireAcknowledgment && !product.acknowledged) {
        store.inappbilling.acknowledgePurchase(
            function() { // success
                store.log.debug("plugin -> purchase acknowledged");
                product.set({
                  acknowledged: true,
                  state: store.OWNED,
                });
            },
            function(err, code) { // error
                // can't finish.
                store.error({
                    code: code || store.ERR_UNKNOWN,
                    message: err
                });
            },
            product.id,
            id,
            getDeveloperPayload(product)
        );
    }
    else {
        product.set('state', store.OWNED);
    }
});

//
// ## Retry failed requests
//
// When setup and/or load failed, the plugin will retry over and over till it can connect
// to the store.
//
// However, to be nice with the battery, it'll double the retry timeout each time.
//
// Special case, when the device goes online, it'll trigger all retry callback in the queue.
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


store.extendAdditionalData = function(product) {
    var a = product.additionalData;

    //  - `accountId` : **string**
    //    - _Default_: `md5(applicationUsername)`
    //    - An optional obfuscated string that is uniquely associated
    //      with the user's account in your app.
    //      If you pass this value, it can be used to detect irregular
    //      activity, such as many devices making purchases on the same
    //      account in a short period of time.
    //    - _Do not use the developer ID for this field._
    //    - In addition, this field should not contain the user's ID in
    //      cleartext. We recommend that you use a one-way hash to
    //      generate a string from the user's ID and store the hashed
    //      string in this field.
    if (!a.accountId && a.applicationUsername) {
        a.accountId = store.utils.md5(a.applicationUsername);
    }

    //  - `developerId` : **string**
    //     - An optional obfuscated string of developer profile name.
    //       This value can be used for payment risk evaluation.
    //     - _Do not use the user account ID for this field._
    if (!a.developerId && store.developerName) {
        a.developerId = store.utils.md5(store.developerName);
    }

    // If we're ordering a subscription, check if another one in the
    // same group is already purchased, set `oldSku` in that case (so
    // it's replaced).
    if (product.group) {
        if (!a.oldPurchaseToken && !a.oldSku) {
            // If neither of the oldPurchaseToken and oldSku are specified,
            // look in the product group for an owned product.
            // Automatically set oldSku and oldPurchaseToken if one is found.
            store.getGroup(product.group).forEach(function(otherProduct) {
                if (isPurchased(otherProduct)) {
                    a.oldSku = otherProduct.id;
                    a.oldPurchaseToken =
                        otherProduct.transaction ?
                        otherProduct.transaction.purchaseToken :
                        null;
                }
            });
        }
        else if (a.oldSku && !a.oldPurchaseToken) {
            // If only oldSku is set, automatically set oldPurchaseToken.
            var otherProduct = store.get(a.oldSku);
            if (otherProduct && otherProduct.transaction) {
                a.oldPurchaseToken = otherProduct.transaction.purchaseToken;
            }
        }
        else if (a.oldPurchaseToken && !a.oldSku) {
            // If only oldPurchaseToken is set, automatically set oldSku.
            store.products.forEach(function(otherProduct) {
                var otherPurchaseToken =
                    otherProduct.transaction ?
                    otherProduct.transaction.purchaseToken :
                    null;
                if (otherPurchaseToken == a.oldPurchaseToken) {
                    a.oldSku = otherProduct.id;
                }
            });
        }
    }
};

function isPurchased(product) {
    return [
        store.APPROVED,
        store.FINISHED,
        store.INITIATED,
        store.OWNED,
    ].indexOf(product.state) >= 0;
}

function getDeveloperPayload(product) {
    var ret = store._evaluateDeveloperPayload(product);
    if (ret) {
        return ret;
    }
    // There is no developer payload but an applicationUsername, let's
    // save it in there: it can be used to compare the purchasing user
    // with the current user.
    var applicationUsername = store.getApplicationUsername(product);
    if (!applicationUsername) {
        return "";
    }
    return JSON.stringify({
        applicationUsernameMD5: store.utils.md5(applicationUsername),
    });
}

})();
/* global Windows */
/* global crypto */

(function () {

	/*
     *  Product Listing
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
                isActive: license.isActive,
                storeId: license.storeId
            };
            if (license.expirationDate > 0) {
                product.expiryDate = new Date(+license.expirationDate);
            }
        }
        else {
            license = {};
        }

        if (transaction) {
            product.transaction = Object.assign(product.transaction || {}, {
                type: 'windows-store-transaction',
                id: transaction.transactionId,
                offerId: transaction.offerId,
                receipt: transaction.receiptXml,
                storeId: transaction.storeId,
                skuId: transaction.skuId
            });
            if (license && license.expirationDate > 0) {
                product.transaction.expirationDate = license.expirationDate;
            }
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
                // product.set("state", store.OWNED);
                product.set("state", store.APPROVED);
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

    store.iabGetPurchases = function(callback) {
        store.inappbilling.getPurchases(function(purchases) {
            store.log.debug("getPurchases -> " + JSON.stringify(purchases));
            if (purchases && purchases.length) {
                for (var i = 0; i < purchases.length; ++i) {
                    var purchase = purchases[i];
                    var p = store.get(purchase.license.productId);
                    if (!p) {
                        store.log.warn("plugin -> user owns a non-registered product: " + purchase.license.productId);
                        continue;
                    }
                    store.setProductData(p, purchase);
                }
            }
            store.ready(true);
            if (callback) callback();
        }, function() { // error
            // TODO
            if (callback) callback();
        });
    };

    var ONE_DAY_MILLS = 24 * 3600 * 1000;
    var NINETY_DAYS_MILLIS = ONE_DAY_MILLS * 90;
    function loadStoreIdKey(type) {
        var value = window.localStorage['cordova_storeidkey_' + type];
        var created = window.localStorage['cordova_storeidkey_' + type + '_date'];
        var expires = (+new Date(created)) + NINETY_DAYS_MILLIS - ONE_DAY_MILLS;
        if (value && expires > +new Date())
            return value;
    }
    function saveStoreIdKey(type, value) {
        window.localStorage['cordova_storeidkey_' + type] = value;
        window.localStorage['cordova_storeidkey_' + type + '_date'] = (new Date()).toISOString();
    }
    store.when().updated(function(p) {
        if (!p.transaction)
            p.transaction = {};
        if (!p.license)
            p.license = {};
        if (!p.license.storeIdKey_purchase)
            p.license.storeIdKey_purchase = loadStoreIdKey('purchase');
        if (!p.license.storeIdKey_collections)
            p.license.storeIdKey_collections = loadStoreIdKey('collections');
        if (p.transaction.serviceTicket && p.transaction.serviceTicketType) {
            var storeIdKey = loadStoreIdKey(p.transaction.serviceTicketType);
            var cachedApplicationUsername = window.localStorage._cordova_application_username;
            p.licence = Object.assign(p.license || {}, {applicationUsername: cachedApplicationUsername});
            var publisherUserId = p.additionalData && p.additionalData.applicationUsername || cachedApplicationUsername || store.utils.uuidv4();
            if (!cachedApplicationUsername) {
                window.localStorage._cordova_application_username = publisherUserId;
            }
            var storeContext;
            if (storeIdKey) {
                p.license['storeIdKey_' + p.transaction.serviceTicketType] = storeIdKey;
            }
            else if (p.transaction.serviceTicketType === 'purchase') {
                storeContext = Windows.Services.Store.StoreContext.getDefault();
				storeContext.getCustomerPurchaseIdAsync(p.transaction.serviceTicket, publisherUserId)
                .done(function (result) {
                    if (result) {
                        store.log.info('getCustomerPurchaseIdAsync -> ' + result);
                        p.license['storeIdKey_' + p.transaction.serviceTicketType] = result;
                        delete p.transaction.serviceTicket;
                        delete p.transaction.serviceTicketType;
                        saveStoreIdKey('purchase', result);
                    }
                    else {
                        store.log.error('getCustomerPurchaseIdAsync failed');
                    }
                });
            }
            else if (p.transaction.serviceTicketType === 'collections') {
                storeContext = Windows.Services.Store.StoreContext.getDefault();
				storeContext.getCustomerCollectionsIdAsync(p.transaction.serviceTicket, publisherUserId)
                .done(function (result) {
                    if (result) {
                        store.log.info('getCustomerCollectionsIdAsync -> ' + result);
                        p.license['storeIdKey_' + p.transaction.serviceTicketType] = result;
                        delete p.transaction.serviceTicket;
                        delete p.transaction.serviceTicketType;
                        saveStoreIdKey('collections', result);
                    }
                    else {
                        store.log.error('getCustomerCollectionsIdAsync failed');
                    }
                });
            }
        }
    });

    store.manageSubscriptions = function() {};
    store.manageBilling = function() {};
    store.redeem = function() {};
})();

if (window) {
    window.store = store;
}

store.platform = 'windows';
module.exports = store;

