(function() {


// Store all pending callbacks, prevents promises to be called multiple times.
var callbacks = {};

// Next call to `order` will store its callbacks using this ID, then increment the ID.
var callbackId = 0;

///
/// ## <a name="order"></a>*store.order(product, additionalData)*
///
/// Initiate the purchase of a product.
///
/// The `product` argument can be either:
///
///  - the `store.Product` object
///  - the product `id`
///  - the product `alias`
///
/// The `additionalData` argument can be either:
///  - null
///  - object with attributes:
///    - `oldSku`, a string with the old subscription to upgrade/downgrade on Android.
///      **Note**: if another subscription product is already owned that is member of
///      the same group, `oldSku` will be set automatically for you (see `product.group`).
///
/// See the ["Purchasing section"](#purchasing) to learn more about
/// the purchase process.
///
store.order = function(pid, additionalData) {

    var p = pid;

    if (typeof pid === "string") {
        p = store.products.byId[pid] || store.products.byAlias[pid];
        if (!p) {
            p = new store.Product({
                id: pid,
                loaded: true,
                valid: false
            });
        }
    }

    var a; // short name for additionalData
    if (additionalData) {
        a = p.additionalData = Object.assign({}, additionalData);
    }
    else {
        a = p.additionalData = {};
    }

    // Associate the active user with the purchase
    if (!a.applicationUsername) {
        a.applicationUsername = store._evaluateApplicationUsername(p);
    }

    // Let the platform extend additional data
    if (store.extendAdditionalData) {
        store.extendAdditionalData(p);
    }

    var localCallbackId = callbackId++;
    var localCallback = callbacks[localCallbackId] = {};

    function done() {
        delete localCallback.then;
        delete localCallback.error;
        delete callbacks[localCallbackId];
    }

    // Request the purchase.
    store.ready(function() {
        p.set("state", store.REQUESTED);
    });

    /// ### return value
    ///
    /// `store.order()` returns a Promise with the following methods:
    ///
    return {
        ///  - `then` - called when the order was successfully initiated
        then: function(cb) {
            localCallback.then = cb;
            store.once(p.id, "initiated", function() {
                if (!localCallback.then)
                    return;
                done();
                cb(p);
            });
            return this;
        },

        ///  - `error` - called if the order couldn't be initiated
        error: function(cb) {
            localCallback.error = cb;
            store.once(p.id, "error", function(err) {
                if (!localCallback.error)
                    return;
                done();
                cb(err);
            });
            return this;
        }
    };
    ///
};

//
// Remove pending callbacks registered with `order`
store.order.unregister = function(cb) {
    for (var i in callbacks) {
        if (callbacks[i].then === cb)
            delete callbacks[i].then;
        if (callbacks[i].error === cb)
            delete callbacks[i].error;
    }
};

})();
