// #include "copyright.js"
// #include "store.js"
// #include "android.js"

(function() {
"use strict";

var initialized = false;

var init = function () {
    if (initialized) return;
    initialized = true;

    var products = [];
    for (var i = 0; i < store.products.length; ++i)
        products.push(store.products[i].id);

    store.android.init(iabReady, iabError, {
        showLog:  store.debug ? true : false
    }, products);
};

var iabReady = function() {
    store.log.debug("android -> ready");
    store.android.loadProductDetails(iabLoaded, iabError, products);

    function iabLoaded(validProducts) {
        store.log.debug("android -> loaded");
        var p, i;
        for (i = 0; i < validProducts.length; ++i) {
            p = store.products.byId[validProducts[i].id];
            p.loaded = true;
            p.valid = true;
            p.title = validProducts[i].title;
            p.price = validProducts[i].price;
            p.currency = validProducts[i].currencyCode;
            p.description = validProducts[i].description;
            store._queries.triggerWhenProduct(p, "loaded", [p]);
        }
        for (i = 0; i < products.length; ++i) {
            p = store.products.byId[products[i]];
            if (!p.valid) {
                p.loaded = true;
                p.valid = false;
                store._queries.triggerWhenProduct(p, "loaded", [p]);
            }
        }
        store.ready(true);
    }
};

var iabError = function(err) {
    store.log.error("android -> error  " + JSON.stringify(err));
};

store.when("refreshed", function() {
    if (!initialized) init();
});

}).call(this);

// For some reasons, module exports failed on android...
if (window) {
    window.store = store;
}

module.exports = store;
