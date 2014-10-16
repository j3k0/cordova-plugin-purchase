(function() {
'use strict';

/// ## <a name="product"></a>*store.Product* object ##
/// 
/// Some methods, like the [`ask` method](#ask), give you access to a `product`
/// object.

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

    this.loaded = options.loaded;
    this.valid  = options.valid;
    this.canPurchase = options.canPurchase;

    ///  - `product.state` - Current state the product is in (see [life-cycle](#life-cycle) below)
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
    if (this.state !== store.FINISHED) {
        this.set('state', store.FINISHED);
        setTimeout(function() {
            if (this.type === store.CONSUMABLE)
                this.set('state', store.VALID);
            else
                this.set('state', store.OWNED);
        }, 0);
    }
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
///                     |      +--> APPROVED +--> FINISHED +--> OWNED
///                     |                                  |         
///                     +----------------------------------+         
///
/// #### states definitions
///
///  - `REGISTERED`: right after being declared to the store using [`store.registerProducts()`](#registerProducts)
///  - `INVALID`: the server didn't recognize this product, it cannot be used.
///  - `VALID`: the server sent extra information about the product (`title`, `price` and such).
///  - `REQUESTED`: order (purchase) has been requested by the user
///  - `INITIATED`: order has been transmitted to the server
///  - `APPROVED`: purchase has been approved by server
///  - `FINISHED`: purchase has been delivered by the app.
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
