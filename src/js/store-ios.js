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
            store._queries.triggerWhenProduct(p, "error", [new store.Error({
                code: store.ERR_LOAD,
                message: errorText
            }), p]);
        }
    }

    store.error.callbacks.trigger(new store.Error({
        code:    errorCode,
        message: errorText
    }));
};

// update store's product definitions when they have been loaded.
var storekitLoaded = function (validProducts, invalidProductIds) {
    var p;
    for (var i = 0; i < validProducts.length; ++i) {
        p = store.products.byId[validProducts[i].id];
        p.loaded = true;
        p.valid = true;
        p.title = validProducts[i].title;
        p.price = validProducts[i].price;
        p.description = validProducts[i].description;
        store._queries.triggerWhenProduct(p, "loaded", [p]);
    }
    for (var j = 0; j < invalidProductIds.length; ++j) {
        p = store.products.byId[invalidProductIds[j]];
        p.loaded = true;
        p.valid = false;
        store._queries.triggerWhenProduct(p, "loaded", [p]);
    }
    store.ready(true);
};

// Purchase approved
var storekitPurchase = function (transactionId, productId) {
    store.ready(function() {
        var product = store.products.byId[productId];
        if (!product) {
            store.error.callbacks.trigger(new store.Error({
                code: store.ERR_PURCHASE,
                message: "Unknown product purchased"
            }));
            return;
        }
        var order = {
            product: product,
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

// Initiate a purchase
store.order = function(productId, quantity) {
    store.ready(function() {
        var product = store.products.byId[productId] || store.products.byAlias[productId];
        if (!product) {
            store.error.callbacks.trigger(new store.Error({
                code: store.ERR_INVALID_PRODUCT_ID,
                message: "Trying to order an unknown product"
            }));
            return;
        }
        if (!initialized) {
            store._queries.triggerWhenProduct(product, "error", [new store.Error({
                code: store.ERR_PURCHASE,
                message: "`purchase()` called before initialization"
            }), product]);
            return;
        }
        if (!product.loaded) {
            store._queries.triggerWhenProduct(product, "error", [new store.Error({
                code: store.ERR_PURCHASE,
                message: "`purchase()` called before doing initial `refresh()`"
            }), product]);
            return;
        }
        if (!product.valid) {
            store._queries.triggerWhenProduct(product, "error", [new store.Error({
                code: store.ERR_PURCHASE,
                message: "`purchase()` called with an invalid product ID"
            }), product]);
            return;
        }
        storekit.purchase(product.id, quantity || 1);
    });
};

// Refresh the store
var refresh = store.refresh;
store.refresh = function() {
    refresh.apply(this, arguments);
    if (!initialized) init();
};

module.exports = store;
