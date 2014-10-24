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
    this.type = options.type || null;

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

/// #### <a name="finishOrder"></a>`finish()` ##
///
/// Call to confirm to the store that an approved order has been delivered.
/// This will change the product state from `APPROVED` to `FINISHED` (see [life-cycle](#life-cycle)).
///
/// As long as you keep the product in its APPROVED:
///
///  - the money will not be in your account (i.e. user isn't charged)
///  - you will receive the `approved` event each time the application starts,
///    to try finishing the pending transaction
///  - on iOS, the user will be prompted for its password at starts
///
/// ##### example use
/// ```js
/// store.when("product.id").approved(function(order){
///     app.unlockFeature();
///     order.finish();
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
            // defer(this, function() {
            //     store.log.debug("product -> " + this.id + " is a " + this.type);
            //     if (this.type !== store.CONSUMABLE)
            //         this.set('state', store.OWNED);
            // });
        }
    });
};

store.Product.prototype.verify = function() {
    var that = this;
    var done    = function() {};
    var success = function() {};
    var error   = function() {};

    defer(this, function() {
        store.verify(this, function(success, data) {
            if (success) {
                success(that, data);
                done();
                that.trigger("verified");
            }
            else {
                var msg = (data && data.error && data.error.message ? data.error.message : '');
                var err = new Error({
                    code: store.ERR_VERIFICATION_FAILED,
                    message: "Transaction verification failed: " + msg
                });
                store.error(err);
                error(err);
                done();
                that.trigger("unverified");
            }
        });
    });

    var ret = {
        done:    function(cb) { done = cb;    return this; },
        success: function(cb) { success = cb; return this; },
        error:   function(cb) { error = cb;   return this; }
    };

    return ret;
};

function defer(thisArg, cb) {
    window.setTimeout(function() {
        cb.call(thisArg);
    }, 1);
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
