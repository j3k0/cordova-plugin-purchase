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
