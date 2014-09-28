//
// File: store-common.js
// Author: Jean-Christophe Hoelt
// Copyright (c)2014
//
// License: MIT

// Store is the singleton object, exported by the plugin.
var store = {
    productsById: {},
    productsByAlias: {},
    products: []
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

var callbacks = {
    byQuery: {},
    add: function(query, action, cb) {
        var fullQuery = uniqueQuery(query ? query + " " + action : action);
        if (this.byQuery[fullQuery])
            this.byQuery[fullQuery].push(cb);
        else
            this.byQuery[fullQuery] = [cb];
    }
};

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
    for (var i = 0; i < queries.length; ++i) {
        var q = queries[i];
        var cbs = callbacks.byQuery[q];
        if (cbs) {
            for (var j = 0; j < cbs.length; ++j)
                cbs[i].apply(store, args);
        }
    }
};

var registerProducts = store.registerProducts = function(products) {
    this.products = products;
    for (var i = 0; i < products.length; ++i) {
        var p = products[i];
        if (!p.alias)
            p.alias = p.id;
        this.productsByAlias[p.alias] = p;
        this.productsById[p.id] = p;
    }
};

var process = store.process = function(query) {
};

var ask = store.ask = function(product) {
};

var order = store.order = function(product) {
};

var when = store.when = function(query) {
    return {
        approved: function(cb) {
            callbacks.add(query, "approved", cb);
        },
        rejected: function(cb) {
            callbacks.add(query, "cancelled". cb);
        },
        updated: function(cb) {
            callbacks.add(query, "updated", cb);
        },
        cancelled: function(cb) {
            callbacks.add(query, "cancelled", cb);
        }
    };
};

// Store iOS

if (iOS) {

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
        for (var i = 0; i < validProducts.length; ++i) {
            var p = store.productsById[validProducts[i].id];
            p.valid = true;
            p.title = validProducts[i].title;
            p.price = validProducts[i].price;
            p.description = validProducts[i].description;
            triggerWhenProduct(p, "loaded", [p]);
        }
        for (var j = 0; j < invalidProductIds.length; ++j) {
            store.productsById[invalidProductIds[j]].valid = false;
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
}

// Store Android

if (android) {
}

module.exports = store;
