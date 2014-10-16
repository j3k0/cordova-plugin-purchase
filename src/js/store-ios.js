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
        purchasing: storekitPurchasing,
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
var storekitError = function(errorCode, errorText, options) {

    var i,p;

    if (!options)
        options = {};

    store.log.error('ios -> ERROR ' + errorCode + ': ' + errorText + ' - ' + JSON.stringify(options));

    // when loading failed, trigger "error" for each of
    // the registered products.
    if (errorCode === storekit.ERR_LOAD) {
        for (i = 0; i < store.products.length; ++i) {
            p = store.products[i];
            p.trigger("error", [new store.Error({
                code: store.ERR_LOAD,
                message: errorText
            }), p]);
        }
    }

    // a purchase was cancelled by the user:
    // - trigger the "cancelled" event
    // - set the product back to the VALID state
    if (errorCode === storekit.ERR_PAYMENT_CANCELLED) {
        p = store.get(options.productId);
        if (p) {
            p.trigger("cancelled");
            p.set({
                transaction: null,
                state: store.VALID
            });
        }
        // but a cancelled order isn't an error.
        return;
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
        var product = store.get(productId);
        if (!product) {
            store.error({
                code: store.ERR_PURCHASE,
                message: "Unknown product purchased"
            });
            return;
        }
        /* var order = {
            id: productId,
            product: product,
            transaction: {
                id: transactionId,
                productId: productId
            },
            finish:  function () {
                storekit.finish(order.transaction.id);
            }
        }; */
        product.set("state", store.APPROVED);
        // store._queries.triggerWhenProduct(product, "approved", [ order ]);
    });
};

// Purchase in progress
var storekitPurchasing = function (productId) {
    store.log.debug("ios -> is purchasing " + productId);
    store.ready(function() {
        var product = store.get(productId);
        if (!product) {
            store.log.warn("ios -> Product '" + productId + "' is being purchased. But isn't registered anymore! How come?");
            return;
        }
        if (product.state !== store.INITIATED)
            product.set("state", store.INITIATED);
    });
};

// Restore purchases.
store.restore = function() {
};

store.when("order", "requested", function(product) {
    store.ready(function() {
        if (!product) {
            store.error({
                code: store.ERR_INVALID_PRODUCT_ID,
                message: "Trying to order an unknown product"
            });
            return;
        }
        if (!initialized) {
            product.trigger("error", [new store.Error({
                code: store.ERR_PURCHASE,
                message: "`purchase()` called before initialization"
            }), product]);
            return;
        }
        if (!product.loaded) {
            product.trigger("error", [new store.Error({
                code: store.ERR_PURCHASE,
                message: "`purchase()` called before doing initial `refresh()`"
            }), product]);
            return;
        }
        if (!product.valid) {
            product.trigger("error", [new store.Error({
                code: store.ERR_PURCHASE,
                message: "`purchase()` called with an invalid product ID"
            }), product]);
            return;
        }
        storekit.purchase(product.id, 1);
    });
});

store.when("refreshed", function() {
    store.log.debug("ios -> refreshed");
    if (!initialized) init();
});

module.exports = store;
