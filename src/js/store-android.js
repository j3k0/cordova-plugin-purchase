// #include "copyright.js"
// #include "store.js"
// #include "android.js"

(function() {
"use strict";

var initialized = false;
var skus = [];

var init = function () {
    if (initialized) return;
    initialized = true;

    for (var i = 0; i < store.products.length; ++i)
        skus.push(store.products[i].id);

    store.android.init(iabReady,
        function(err) {
            store.error({
                code: store.ERR_SETUP,
                message: 'Init failed - ' + err
            });
        },
        {
            showLog: store.verbosity >= store.INFO ? true : false
        },
        skus);
};

function iabReady() {
    store.log.debug("android -> ready");
    store.android.getAvailableProducts(iabLoaded, function(err) {
        store.error({
            code: store.ERR_LOAD,
            message: 'Loading product info failed - ' + err
        });
    });
}

function iabLoaded(validProducts) {
    store.log.debug("android -> loaded - " + JSON.stringify(validProducts));
    var p, i;
    for (i = 0; i < validProducts.length; ++i) {
        p = store.products.byId[validProducts[i].productId];
        p.set({
            title: validProducts[i].title,
            price: validProducts[i].price,
            description: validProducts[i].description,
            currency: validProducts[i].price_currency_code,
            state: store.VALID
        });
        p.trigger("loaded");
    }
    for (i = 0; i < skus.length; ++i) {
        p = store.products.byId[skus[i]];
        if (!p.valid) {
            p.set("state", store.INVALID);
            p.trigger("loaded");
        }
    }
    store.ready(true);
}

store.when("refreshed", function() {
    if (!initialized) init();
});

}).call(this);

// For some reasons, module exports failed on android...
if (window) {
    window.store = store;
}

module.exports = store;
