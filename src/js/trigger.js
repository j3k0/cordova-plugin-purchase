(function() {
"use strict";

/// ## <a name="trigger"></a>*store.trigger(product, action, args)*
///
/// For internal use, trigger an event so listeners are notified.
store.trigger = function(product, action, args) {
    if (typeof product === "string") {
        product = store.products.byId[product] || store.products.byAlias[product];
        if (!product)
            return;
    }

    // If a non-array args argument was given, make it an array.
    if (typeof args !== 'undefined' && (typeof args !== 'object' || typeof args.length !== 'number')) {
        args = [ args ];
    }
    store._queries.triggerWhenProduct(product, action, args);
};

}).call(this);
