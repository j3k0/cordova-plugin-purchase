(function(){
'use strict';

// Store all pending callbacks as well as a `skip` boolean that prevents promises
// to be called multiple times.
var callbacks = {};

// Next call to `ask` will store its callbacks using this ID, then increment the ID.
var callbackId = 0;

/// 
/// ## <a name="ask"></a>*store.ask(productId)* ##
/// 
/// Retrieve informations about a given [product](#products).
/// 
/// If the given product is already loaded, promise callbacks
/// will be called immediately. If not, it will happen as soon
/// as the product is known as valid or invalid.

store.ask = function(pid) {
    var that = this;
    var p = store.products.byId[pid] || store.products.byAlias[pid];
    if (!p) {
        p = new store.Product({
            id: pid,
            loaded: true,
            valid: false
        });
    }

    // var skip = false;
    var localCallbackId = callbackId++;
    var localCallback = callbacks[localCallbackId] = {
        skip: false
    };

    function askDone() {
        localCallback.skip = true;
        delete localCallback.then;
        delete localCallback.error;
        delete callbacks[localCallbackId];
    }

    /// 
    /// ### return value
    /// 
    /// Return promise with the following methods:
    return {
 
        /// 
        /// #### .*then(function (product) {})*
        /// 
        /// Called when the product information has been loaded from the store's
        /// servers and known to be valid.
        /// 
        /// `product` contains the fields documented in the [products](#products) section.
        then: function(cb) {
            if (p.loaded && p.valid) {
                askDone();
                cb(p);
            }
            else {
                localCallback.then = cb;
                that.once(pid).loaded(function(p) {
                    if (localCallback.skip) return;
                    if (p.valid) {
                        if (localCallback.then) { // if `then` callback wasn't unregistered
                            askDone();
                            cb(p);
                        }
                        else {
                            askDone();
                        }
                    }
                });
            }
            return this;
        },

        /// 
        /// #### .*error(function (err) {})*
        /// 
        /// Called if product information cannot be loaded from the store or
        /// when it is know to be invalid.
        /// 
        /// `err` features the standard [error](#errors) format (`code` and `message`).
        error: function(cb) {
            if (p.loaded && !p.valid) {
                askDone();
                cb(new store.Error({
                    code: store.ERR_INVALID_PRODUCT_ID,
                    message: "Invalid product"
                }), p);
            }
            else {
                localCallback.error = cb;
                that.once(pid).error(function(err, p) {
                    if (localCallback.skip) return;
                    if (err.code === store.ERR_LOAD) {
                        if (localCallback.error) { // if error callback wasn't unregistered
                            askDone();
                            cb(err, p);
                        }
                        else {
                            askDone();
                        }
                    }
                });
                that.once(pid).loaded(function(p) {
                    if (localCallback.skip) return;
                    if (!p.valid) {
                        if (localCallback.error) { // if error callback wasn't unregistered
                            askDone();
                            cb(new store.Error({
                                code: store.ERR_INVALID_PRODUCT_ID,
                                message: "Invalid product"
                            }), p);
                        }
                        else {
                            askDone();
                        }
                    }
                });
            }
            return this;
        }
    };
};
/// 
/// ### example use
/// 
///     store.ask("full version").
///         then(function(product) {
///             console.log("product " + product.id + " loaded");
///             console.log("title: " + product.title);
///             console.log("description: " + product.description);
///             console.log("price: " + product.price);
///         }).
///         error(function(error) {
///             console.log("failed to load product");
///             console.log("ERROR " + error.code + ": " + error.message);
///         });
///

// Remove pending callbacks registered with `ask`
store.ask.unregister = function(cb) {
    for (var i in callbacks) {
        if (callbacks[i].then === cb)
            delete callbacks[i].then;
        if (callbacks[i].error === cb)
            delete callbacks[i].error;
    }
};

}).call(this);
