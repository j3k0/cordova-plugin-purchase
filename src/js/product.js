(function() {
'use strict';

/// ## <a name="product"></a>*store.Product* object ##
/// 
/// Most events methods give you access to a `product` object.

store.Product = function(options) {

    if (!options)
        options = {};

    ///
    /// Products object have the following fields and methods.
    ///
    /// ### public fields
    ///

    ///  - `product.id` - Identifier of the product on the store
    this.id = options.id || null;

    ///  - `product.alias` - Alias that can be used for more explicit [queries](#queries)
    this.alias = options.alias || options.id || null;

    ///  - `product.type` - Family of product, should be one of the defined [product types](#product-types).
    var type = this.type = options.type || null;
    if (type !== store.CONSUMABLE && type !== store.NON_CONSUMABLE && type !== store.PAID_SUBSCRIPTION && type !== store.FREE_SUBSCRIPTION)
        throw new TypeError("Invalid product type");

    ///  - `product.price` - Non-localized price, without the currency
    this.price = options.price || null;

    ///  - `product.currency` - Currency code
    this.currency = options.currency || null;

    ///  - `product.title` - Non-localized name or short description
    this.title = options.title || options.localizedTitle || null;

    ///  - `product.description` - Non-localized longer description
    this.description = options.description || options.localizedDescription || null;

    ///  - `product.localizedTitle` - Localized name or short description ready for display
    this.localizedTitle = options.localizedTitle || options.title || null;

    ///  - `product.localizedDescription` - Localized longer description ready for display
    this.localizedDescription = options.localizedDescription || options.description || null;

    ///  - `product.localizedPrice` - Localized price (with currency) ready for display
    this.localizedPrice = options.localizedPrice || null;

    ///  - `product.loaded` - Product has been loaded from server, however it can still be either `valid` or not
    this.loaded = options.loaded;

    ///  - `product.valid` - Product has been loaded and is a valid product
    this.valid  = options.valid;

    ///  - `product.canPurchase` - Product is in a state where it can be purchased
    this.canPurchase = options.canPurchase;

    ///  - `product.owned` - Product is owned
    this.owned = options.owned;

    ///  - `product.state` - Current state the product is in (see [life-cycle](#life-cycle) below). Should be one of the defined [product states](#product-states)
    this.state = options.state || "";

    this.stateChanged();
};

///
/// ### public methods
///

/// #### <a name="finish"></a>`finish()` ##
///
/// Call to confirm to the store that an approved order has been delivered.
/// This will change the product state from `APPROVED` to `FINISHED` (see [life-cycle](#life-cycle)).
///
/// As long as you keep the product in state `APPROVED`:
///
///  - the money may not be in your account (i.e. user isn't charged)
///  - you will receive the `approved` event each time the application starts,
///    to try finishing the pending transaction
///  - on iOS, the user will be prompted for its password at starts
///
/// ##### example use
/// ```js
/// store.when("product.id").approved(function(product){
///     app.unlockFeature();
///     product.finish();
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

/// #### <a name="verify"></a>`verify()` ##
///
/// Initiate purchase validation as defined by [`store.validator`](#validator).
///
store.Product.prototype.verify = function() {
    var that = this;

    var nRetryLeft = 2;

    // Callbacks set by the Promise
    var doneCb    = function() {};
    var successCb = function() {};
    var expiredCb = function() {};
    var errorCb   = function() {};

    var tryValidation = function() {
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
                var err = new Error({
                    code: store.ERR_VERIFICATION_FAILED,
                    message: "Transaction verification failed: " + msg
                });
                if (data.code === store.PURCHASE_EXPIRED) {
                    err = new Error({
                        code: store.ERR_PAYMENT_EXPIRED,
                        message: "Transaction expired: " + msg
                    });
                }
                store.error(err);
                store.utils.callExternal('verify.error', errorCb, err);
                store.utils.callExternal('verify.done', doneCb, that);
                if (data.code === store.PURCHASE_EXPIRED) {
                    that.trigger("expired");
                    that.set("state", store.VALID);
                    store.utils.callExternal('verify.expired', expiredCb, that);
                }
                else if (nRetryLeft > 0) {
                    // It failed... let's try one more time.
                    nRetryLeft -= 1;
                    defer(this, tryValidation, 1000);
                }
                else {
                    that.trigger("unverified");
                }
            }
        });
    };

    defer(this, tryValidation);

    /// #### return value
    /// A Promise with the following methods:
    ///
    var ret = {
        ///  - `done(function(product){})`
        done:    function(cb) { doneCb = cb;    return this; },
        ///  - `expiredCb(function(product){})`
        expired: function(cb) { expiredCb = cb; return this; },
        ///  - `success(function(product, purchaseData){})`
        ///    - where `purchaseData` is device dependent transaction details,
        ///      which you can most probably ignore.
        success: function(cb) { successCb = cb; return this; },
        ///  - `error(function(err){})`
        ///    - where `err` in an [store.Error object](#errors)
        error:   function(cb) { errorCb = cb;   return this; }
    };
    ///

    return ret;
};

function defer(thisArg, cb, delay) {
    window.setTimeout(function() {
        cb.call(thisArg);
    }, delay || 1);
}

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
///                     |      +--> APPROVED +--> FINISHED +--> OWNED
///                     |                                  |
///                     +----------------------------------+
///
/// #### states definitions
///
///  - `REGISTERED`: right after being declared to the store using [`store.registerProducts()`](#registerProducts)
///  - `INVALID`: the server didn't recognize this product, it cannot be used.
///  - `VALID`: the server sent extra information about the product (`title`, `price` and such).
///  - `REQUESTED`: order (purchase) requested by the user
///  - `INITIATED`: order transmitted to the server
///  - `APPROVED`: purchase approved by server
///  - `FINISHED`: purchase delivered by the app
///  - `OWNED`: purchase is owned (only for non-consumable and subscriptions)
///
/// #### Notes
///
///  - When finished, a consumable product will get back to the `VALID` state.
///  - Any error in the purchase process will bring the product back to the `VALID` state.
///  - During application startup, product will go instantly from `REGISTERED` to `OWNED` if it's a purchased non-consumable or non-expired subscription.
///
/// #### state changes
///
/// Each time the product changes state, an event is triggered.
///

}).call(this);
