(function(){
'use strict';

/// ## <a name="when"></a>*store.when(query)*
/// 
store.when = function(query, once) {

    /// 
    /// ### return value
    /// 
    /// Return promise with the following methods:
    ///
    return {
        ///  - `.*loaded(function (product) {})*`
        ///    - Called when [product](#product) data is loaded from the store.
        loaded: function(cb) {
            store._queries.callbacks.add(query, "loaded", cb, once);
            return this;
        },

        ///  - `.*approved(function (order) {})*`
        ///    - Called when an [order](#order) is approved.
        approved: function(cb) {
            store._queries.callbacks.add(query, "approved", cb, once);
            return this;
        },

        ///  - `.*rejected(function (order) {})*`
        ///    - Called when an [order](#order) is rejected.
        rejected: function(cb) {
            store._queries.callbacks.add(query, "rejected", cb, once);
            return this;
        },

        // Undocumented (NOT USED YET)
        //  - `.*updated(function (product) {})*`
        //    - Called when an [order](#order) is rejected.
        updated: function(cb) {
            store._queries.callbacks.add(query, "updated", cb, once);
            return this;
        },

        ///  - `.*cancelled(function (product) {})*`
        ///    - Called when an [order](#order) is cancelled by the user.
        cancelled: function(cb) {
            store._queries.callbacks.add(query, "cancelled", cb, once);
            return this;
        },

        ///  - `.*error(function (err) {})*`
        ///    - Called when an [order](#order) failed.
        ///    - The `err` parameter is an [error object](#errors)
        error: function(cb) {
            store._queries.callbacks.add(query, "error", cb, once);
            return this;
        }
        ///
    };
};

/// ## <a name="once"></a>*store.once(query)*
/// 
/// Identical to [`store.when`](#when), but the callback will be called only once.
/// After being called, the callback will be unregistered.
store.once = function(query) {
    return store.when(query, true);
};

// Remove any callbacks registered with `ready`
store.when.unregister = store.once.unregister = function(cb) {
    store._queries.callbacks.unregister(cb);
};

}).call(this);
