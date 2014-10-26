(function(){
'use strict';

/// ## <a name="when"></a>*store.when(query)*
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
        /// Return a Promise with methods to register a callback for
        /// know product events.
        ///
        /// #### events
        ///

        ///  - `loaded(product)`
        ///    - Called when [product](#product) data is loaded from the store.
        addPromise('loaded');

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

        ///  - `updated(product)`
        ///    - Called when any change occured to a product.
        addPromise('updated');

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
        ///    - Receipt validation successful
        addPromise('verified');

        ///  - `unverified(product)`
        ///    - Receipt verification failed
        addPromise('unverified');

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
        var action = once;
        store._queries.callbacks.add(query, action, callback);
    }
};

// Remove any callbacks registered with `ready`
store.when.unregister = function(cb) {
    store._queries.callbacks.unregister(cb);
};

}).call(this);
