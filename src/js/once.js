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
