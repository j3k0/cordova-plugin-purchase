(function() {
"use strict";

/// ## <a name="trigger"></a>*store.trigger(product, action, args)*
///
/// For internal use, trigger an event so listeners are notified.
///
/// It's a conveniance method, that adds flexibility to [`_queries.triggerWhenProduct`](#triggerWhenProduct) by:
///
store.trigger = function(product, action, args) {

    ///  - allowing to trigger events unrelated to products
    ///    - by doing `store.trigger("refreshed")` for example.
    if (!action && !args && typeof product === 'string') {
        store.log.debug("store.trigger -> triggering action " + product);
        store._queries.triggerAction(product);
        return;
    }

    ///  - allowing the `product` argument to be either:
    ///    - a [product](#product)
    ///    - a product `id`
    ///    - a product `alias`
    if (typeof product === "string") {
        product = store.get(product);
        if (!product)
            return;
    }

    ///  - converting the `args` argument to an array if it's not one
    if (typeof args !== 'undefined' && (typeof args !== 'object' || typeof args.length !== 'number')) {
        args = [ args ];
    }

    ///  - adding the product itself as an argument to the event if none were passed
    if (typeof args === 'undefined') {
        args = [ product ];
    }

    ///
    store._queries.triggerWhenProduct(product, action, args);
};

})();
