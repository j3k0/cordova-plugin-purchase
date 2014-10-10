//
// File: store-common.js
// Author: Jean-Christophe Hoelt
// Copyright (c)2014
//
// License: MIT

// Store is the singleton object, exported by the plugin.
var store = {};

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

var process = store.process = function(query) {
};

// Retrieve informations about a given product.
// If the given product is already loaded, promise callbacks
// will be called immediately. If not, it will happen as soon
// as the product is known as valid or invalid.
var ask = store.ask = function(product) {
    var that = this;
    var p = this.productsById[product] || this.productsByAlias[product];
    var skip = false;

    return {

        // then: register a callback that'll be called when the product
        // is loaded and known to be valid.
        then: function(cb) {
            if (p.loaded && p.valid)
                cb(p);
            else
                that.once(product, "loaded", function(p) {
                    if (skip) return;
                    skip = true;
                    if (p.valid)
                        cb(p);
                });
            return this;
        },

        // then: register a callback that'll be called when the product
        // is loaded and known to be invalid. Or when loading of the
        // product information was impossible.
        error: function(cb) {
            if (p.loaded && !p.valid)
                cb(p);
            else {
                that.once(product, store.ERR_PRODUCT_NOT_LOADED, function(err) {
                    if (skip) return;
                    skip = true;
                    cb(err);
                });
                that.once(product, "loaded", function(p) {
                    if (skip) return;
                    skip = true;
                    if (!p.valid)
                        cb({
                            code: store.ERR_INVALID_PRODUCT_ID,
                            message: "Invalid product ID"
                        });
                });
            }
            return this;
        }
    };
};

var order = store.order = function(product) {
};

var when = store.when = function(query, once) {
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
        }
    };
};

var once = store.once = function(query) {
    return store.when(query, true);
};

module.exports = store;

var initialized = false;

var init = function () {
    storekit.init({
        debug: store.debug ? true : false,
        ready: storekitReady,
        error:    function (errorCode, errorText) {},
        purchase: function (transactionId, productId) {},
        restore:  function (originalTransactionId, productId) {},
        restoreCompleted: function () {},
        restoreFailed:    function (errorCode) {}
    });
};

// loads products immediately when storekit is ready.
var storekitReady = function () {
    var products = [];
    for (var i = 0; i < store.products.length; ++i)
        products.push(store.products[i].id);
    storekit.load(products, productsLoaded);
};

// update store's product definitions when they have been loaded.
var productsLoaded = function (validProducts, invalidProductIds) {
    var p;
    for (var i = 0; i < validProducts.length; ++i) {
        p = store.productsById[validProducts[i].id];
        p.loaded = true;
        p.valid = true;
        p.title = validProducts[i].title;
        p.price = validProducts[i].price;
        p.description = validProducts[i].description;
        triggerWhenProduct(p, "loaded", [p]);
    }
    for (var j = 0; j < invalidProductIds.length; ++j) {
        p = store.productsById[invalidProductIds[j]];
        p.loaded = true;
        p.valid = false;
        triggerWhenProduct(p, "loaded", [p]);
    }
};

var restore = store.restore = function() {
    // Restore purchases.
};

store.process = function(query) {
    process.apply(this, arguments);
    if (!initialized) {
        init();
    }
};

