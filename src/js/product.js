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
        if (this.state !== store.FINISHED && this.id) {
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

        // no need to verify an actual application
        if (that.type === store.APPLICATION)
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
