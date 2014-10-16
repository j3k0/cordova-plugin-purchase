// #include "copyright.js"
// #include "store.js"
// #include "ios.js"

var initialized = false;

var init = function () {
    if (initialized) return;
    initialized = true;
    storekit.init({
        debug:    store.debug ? true : false,
        noAutoFinish: true,
        ready:    storekitReady,
        error:    storekitError,
        purchase: storekitPurchase,
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
    storekit.load(products, storekitLoaded);
};

// called when an error happens
var storekitError = function(errorCode, errorText) {

    console.log('error ' + errorCode + ': ' + errorText);

    // when loading failed, trigger "error" for each of
    // the registered products.
    if (errorCode === storekit.ERR_LOAD) {
        for (var i = 0; i < store.products.length; ++i) {
            var p = store.products[i];
            p.trigger("error", [new store.Error({
                code: store.ERR_LOAD,
                message: errorText
            }), p]);
        }
    }

    store.error({
        code:    errorCode,
        message: errorText
    });
};

// update store's product definitions when they have been loaded.
var storekitLoaded = function (validProducts, invalidProductIds) {
    var p;
    for (var i = 0; i < validProducts.length; ++i) {
        p = store.products.byId[validProducts[i].id];
        p.set({
            title: validProducts[i].title,
            price: validProducts[i].price,
            description: validProducts[i].description,
            state: store.VALID
        });
        p.trigger("loaded");
    }
    for (var j = 0; j < invalidProductIds.length; ++j) {
        p = store.products.byId[invalidProductIds[j]];
        p.set("state", store.INVALID);
        p.trigger("loaded");
    }
    store.ready(true);
};

// Purchase approved
var storekitPurchase = function (transactionId, productId) {
    store.ready(function() {
        var product = store.products.byId[productId];
        if (!product) {
            store.error({
                code: store.ERR_PURCHASE,
                message: "Unknown product purchased"
            });
            return;
        }
        var order = {
            id: product,
            transaction: {
                id: transactionId,
            },
            finish:  function () {
                storekit.finish(order.transaction.id);
            }
        };
        store._queries.triggerWhenProduct(product, "approved", [ order ]);
    });
};

// Restore purchases.
store.restore = function() {
};

store.when("order", "requested", function(product) {
    store.ready(function() {
        // var product = store.products.byId[pid] || store.products.byAlias[pid];
        if (!product) {
            store.error({
                code: store.ERR_INVALID_PRODUCT_ID,
                message: "Trying to order an unknown product"
            });
            return;
        }
        if (!initialized) {
            store.trigger(product, "error", [new store.Error({
                code: store.ERR_PURCHASE,
                message: "`purchase()` called before initialization"
            }), product]);
            return;
        }
        if (!product.loaded) {
            store.trigger(product, "error", [new store.Error({
                code: store.ERR_PURCHASE,
                message: "`purchase()` called before doing initial `refresh()`"
            }), product]);
            return;
        }
        if (!product.valid) {
            store.trigger(product, "error", [new store.Error({
                code: store.ERR_PURCHASE,
                message: "`purchase()` called with an invalid product ID"
            }), product]);
            return;
        }
        store.trigger(product, "initiated", product);
        storekit.purchase(product.id, quantity || 1);
    });
});

// Initiate a purchase
/*
var order = store.order;
store.order = function(pid, quantity) {
    var ret = order(pid);
    store.ready(function() {
        var product = store.products.byId[pid] || store.products.byAlias[pid];
        if (!product) {
            store.error.callbacks.trigger(new store.Error({
                code: store.ERR_INVALID_PRODUCT_ID,
                message: "Trying to order an unknown product"
            }));
            return;
        }
        if (!initialized) {
            store.trigger(product, "error", [new store.Error({
                code: store.ERR_PURCHASE,
                message: "`purchase()` called before initialization"
            }), product]);
            return;
        }
        if (!product.loaded) {
            store.trigger(product, "error", [new store.Error({
                code: store.ERR_PURCHASE,
                message: "`purchase()` called before doing initial `refresh()`"
            }), product]);
            return;
        }
        if (!product.valid) {
            store.trigger(product, "error", [new store.Error({
                code: store.ERR_PURCHASE,
                message: "`purchase()` called with an invalid product ID"
            }), product]);
            return;
        }
        store.trigger(product, "initiated", product);
        storekit.purchase(product.id, quantity || 1);
    });
    return ret;
};
*/

// Refresh the store
var refresh = store.refresh;
store.refresh = function() {
    refresh.apply(this, arguments);
    if (!initialized) init();
};

module.exports = store;
