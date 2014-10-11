//
// Cordova Purchase Plugin
//
// Author: Jean-Christophe Hoelt
// Copyright (c)2014
//
// License: MIT
//

//
// !!! WARNING !!!
// This file is auto-generated from files located in `src/js`
//
// DO NOT EDIT DIRECTLY OR YOUR CHANGES WILL BE LOST
//
// Store is the singleton object, exported by the plugin.
var store = {};

/// 
/// ## <a name="store"></a>`store` object ##
/// 
/// `store` is the global object exported by the purchase plugin.
///
/// As with any other plugin,
/// this object shouldn't be used before the "deviceready" event is fired.
///
/// Check cordova's documentation for more details if needed.
/// 
/// ## products ##
/// 
/// Some methods, like the [`ask` method](#ask), give you access to a `product`
/// object. Products object provide a set of fields and methods:
///
/// TODO: Document this
///
/// ## errors ##
/// 

///
/// ## constants
///
/// ### product types
///
/*///*/     store.FREE_SUBSCRIPTION = "free subscription";
/*///*/     store.PAID_SUBSCRIPTION = "paid subscription";
/*///*/     store.CONSUMABLE        = "consumable";
/*///*/     store.NON_CONSUMABLE    = "non consumable";
///
/// ### error codes
///
var ERROR_CODES_BASE = 4983497;
/*///*/     store.ERR_SETUP               = ERROR_CODES_BASE + 1;
/*///*/     store.ERR_LOAD                = ERROR_CODES_BASE + 2;
/*///*/     store.ERR_PURCHASE            = ERROR_CODES_BASE + 3;
/*///*/     store.ERR_LOAD_RECEIPTS       = ERROR_CODES_BASE + 4;
/*///*/     store.ERR_CLIENT_INVALID      = ERROR_CODES_BASE + 5;
/*///*/     store.ERR_PAYMENT_CANCELLED   = ERROR_CODES_BASE + 6;
/*///*/     store.ERR_PAYMENT_INVALID     = ERROR_CODES_BASE + 7;
/*///*/     store.ERR_PAYMENT_NOT_ALLOWED = ERROR_CODES_BASE + 8;
/*///*/     store.ERR_UNKNOWN             = ERROR_CODES_BASE + 10;
/*///*/     store.ERR_REFRESH_RECEIPTS    = ERROR_CODES_BASE + 11;
/*///*/     store.ERR_INVALID_PRODUCT_ID  = ERROR_CODES_BASE + 12;
store.productsById = {};
store.productsByAlias = {};
store.products = [];

store.registerProducts = function(products) {
    this.products = products;
    for (var i = 0; i < products.length; ++i) {
        var p = products[i];
        if (!p.alias)
            p.alias = p.id;
        this.productsByAlias[p.alias] = p;
        this.productsById[p.id] = p;
    }
};
// Transform a human readable query string
// to a unique string by filter out reserved words.
var uniqueQuery = function(string) {
    if (!string)
        return '';
    var query = '';
    var tokens = string.split(' ');
    for (var i = 0; i < tokens.length; ++i) {
        var token = tokens[i];
        if (token !== 'order') {
            if (query !== '')
                query += ' ';
            query += tokens[i];
        }
    }
    return query;
};

// Manage the list of callbacks registered for given queries
var callbacks = {
    byQuery: {},
    add: function(query, action, cb, once) {
        var fullQuery = uniqueQuery(query ? query + " " + action : action);
        if (this.byQuery[fullQuery])
            this.byQuery[fullQuery].push({cb:cb, once:once});
        else
            this.byQuery[fullQuery] = [{cb:cb, once:once}];
    }
};

// Return true if a callback should be called more than once.
var isNotOnce = function(cb) {
    return !cb.once;
};

// Trigger the callbacks registered when a given action happens to
// given product.
//
// args are passed as arguments to the callbacks.
var triggerWhenProduct = function(product, action, args) {
    var queries = [];
    if (product && product.id)
        queries.push(product.id + " " + action);
    if (product && product.alias)
        queries.push(product.alias + " " + action);
    if (product && product.type)
        queries.push(product.type + " " + action);
    if (product && product.type && (product.type === store.FREE_SUBSCRIPTION || product.type === store.PAID_SUBSCRIPTION))
        queries.push("subscription " + action);
    queries.push(action);
    var i;
    for (i = 0; i < queries.length; ++i) {
        var q = queries[i];
        var cbs = callbacks.byQuery[q];
        if (cbs) {
            // Call callbacks
            for (var j = 0; j < cbs.length; ++j) {
                cbs[j].cb.apply(store, args);
            }
            // Remove callbacks that needed to be called only once
            callbacks.byQuery[q] = cbs.filter(isNotOnce);
        }
    }
};
// 
store.when = function(query, once) {
    return {
        loaded: function(cb) {
            callbacks.add(query, "loaded", cb, once);
            return this;
        },
        approved: function(cb) {
            callbacks.add(query, "approved", cb, once);
            return this;
        },
        rejected: function(cb) {
            callbacks.add(query, "rejected", cb, once);
            return this;
        },
        updated: function(cb) {
            callbacks.add(query, "updated", cb, once);
            return this;
        },
        cancelled: function(cb) {
            callbacks.add(query, "cancelled", cb, once);
            return this;
        },
        error: function(cb) {
            callbacks.add(query, "error", cb, once);
            return this;
        }
    };
};

store.once = function(query) {
    return store.when(query, true);
};
/// 
/// ## <a name="ask"></a>`store.ask(productId)` ##
/// 
/// Retrieve informations about a given [product](#products).
/// 
/// If the given product is already loaded, promise callbacks
/// will be called immediately. If not, it will happen as soon
/// as the product is known as valid or invalid.

var ask = store.ask = function(pid) {
    var that = this;
    var p = this.productsById[pid] || this.productsByAlias[pid];
    if (!p) {
        p = {
            id: pid,
            loaded: true,
            valid: false
        };
    }
    var skip = false;

    /// 
    /// ### return value
    /// 
    /// Return promise with the following methods:
    return {
 
        /// 
        /// #### then(function (product) {})
        /// 
        /// Called when the product information has been loaded from the store's
        /// servers and known to be valid.
        /// 
        /// `product` contains the fields documented in the [products](#products) section.
        then: function(cb) {
            if (p.loaded && p.valid) {
                skip = true;
                cb(p);
            }
            else
                that.once(pid).loaded(function(p) {
                    if (skip) return;
                    if (p.valid) {
                        skip = true;
                        cb(p);
                    }
                });
            return this;
        },

        /// 
        /// #### error(function (err) {})
        /// 
        /// Called if product information cannot be loaded from the store or
        /// when it is know to be invalid.
        /// 
        /// `err` features the standard [error](#errors) format (`code` and `message`).
        error: function(cb) {
            if (p.loaded && !p.valid) {
                skip = true;
                cb({
                    code: store.ERR_INVALID_PRODUCT_ID,
                    message: "Invalid product"
                }, p);
            }
            else {
                that.once(pid).error(function(err, p) {
                    if (skip) return;
                    if (err.code === store.ERR_LOAD) {
                        skip = true;
                        cb(err, p);
                    }
                });
                that.once(pid).loaded(function(p) {
                    if (skip) return;
                    if (!p.valid) {
                        skip = true;
                        cb({
                            code: store.ERR_INVALID_PRODUCT_ID,
                            message: "Invalid product"
                        }, p);
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
/// ```
/// store.ask("full version").
///     then(function(product) {
///         console.log("product " + product.id + " loaded");
///         console.log("title: " + product.title);
///         console.log("description: " + product.description);
///         console.log("price: " + product.price);
///     }).
///     error(function(error) {
///         console.log("failed to load product");
///         console.log("ERROR " + error.code + ": " + error.message);
///     });
/// ```
(function() {

var isReady = false;

var callbacks = [];

store.ready = function (cb) {
    if (cb === true) {
        if (isReady) return this;
        isReady = true;
        for (var i = 0; i < callbacks.length; ++i)
            callbacks[i].call(this);
        callbacks = [];
    }
    else if (cb) {
        if (isReady) {
            cb();
            return this;
        }
        else {
            callbacks.push(cb);
        }
    }
    else {
        return isReady;
    }
    return this;
};

})();
// 
// List of user registered error callbacks, with methods to:
// - trigger an error (`triggerError`)
// - register a callback (`store.error`)
//

// List of callbacks
var errorCallbacks = [];

// Call all error callbacks with the given error
var triggerError = function(error) {
    for (var i = 0; i < errorCallbacks.length; ++i)
        errorCallbacks[i].call(store, error);
};

// Register an error handler
store.error = function(cb) {
    errorCallbacks.push(cb);
};

store.order = function(product) {
};

store.refresh = function(query) {
};

module.exports = store;

