// #include "copyright.js"
// #include "store.js"
// #include "ios.js"

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

module.exports = store;
