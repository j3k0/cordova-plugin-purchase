(function(){
'use strict';

/// ## <a name="when"></a>*store.when(query)*
/// 
store.when = function(query, once, callback) {

    // In case the first arguemnt is a product, convert to its id
    if (typeof query === 'object' && query instanceof store.Product)
        query = query.id;

    if (typeof once === 'function') {
        return store.when("", query, once);
    }
    else if (typeof once !== 'string') {

        /// 
        /// ### return value
        /// 
        /// Return promise with the following methods:
        ///
        return {
            ///  - `.loaded(function (product) {})`
            ///    - Called when [product](#product) data is loaded from the store.
            loaded: function(cb) {
                store._queries.callbacks.add(query, "loaded", cb, once);
                return this;
            },

            ///  - `.approved(function (order) {})`
            ///    - Called when an [order](#order) is approved.
            approved: function(cb) {
                store._queries.callbacks.add(query, "approved", cb, once);
                return this;
            },

            ///  - `.rejected(function (order) {})`
            ///    - Called when an [order](#order) is rejected.
            rejected: function(cb) {
                store._queries.callbacks.add(query, "rejected", cb, once);
                return this;
            },

            ///  - `.owned(function (product) {})`
            ///    - Called when a non-consumable product or subscription is owned.
            owned: function(cb) {
                store._queries.callbacks.add(query, "owned", cb, once);
                return this;
            },

            ///  - `.updated(function (product) {})`
            ///    - Called when any change occured to a product.
            updated: function(cb) {
                store._queries.callbacks.add(query, "updated", cb, once);
                return this;
            },

            ///  - `.cancelled(function (product) {})`
            ///    - Called when an [order](#order) is cancelled by the user.
            cancelled: function(cb) {
                store._queries.callbacks.add(query, "cancelled", cb, once);
                return this;
            },

            ///  - `.error(function (err) {})`
            ///    - Called when an [order](#order) failed.
            ///    - The `err` parameter is an [error object](#errors)
            error: function(cb) {
                store._queries.callbacks.add(query, "error", cb, once);
                return this;
            }
        };
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
