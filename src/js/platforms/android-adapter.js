(function() {
"use strict";

var initialized = false;
var skus = [];

store.when("refreshed", function() {
    if (!initialized) init();
});

store.when("re-refreshed", function() {
    iabGetPurchases();
});

function init() {
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
            showLog: store.verbosity >= store.DEBUG ? true : false
        },
        skus);
}

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

        if (validProducts[i].productId)
            p = store.products.byId[validProducts[i].productId];
        else
            p = null;

        if (p) {
            p.set({
                title: validProducts[i].title,
                price: validProducts[i].price,
                description: validProducts[i].description,
                currency: validProducts[i].price_currency_code,
                state: store.VALID
            });
            p.trigger("loaded");
        }
    }
    for (i = 0; i < skus.length; ++i) {
        p = store.products.byId[skus[i]];
        if (p && !p.valid) {
            p.set("state", store.INVALID);
            p.trigger("loaded");
        }
    }

    iabGetPurchases();
}

function iabGetPurchases() {
    store.android.getPurchases(
        function(purchases) { // success
            // example purchases data:
            //
            // [
            //   {
            //     "purchaseToken":"tokenabc",
            //     "developerPayload":"mypayload1",
            //     "packageName":"com.example.MyPackage",
            //     "purchaseState":0,
            //     "orderId":"12345.6789",
            //     "purchaseTime":1382517909216,
            //     "productId":"example_subscription"
            //   },
            //   { ... }
            // ]
            if (purchases && purchases.length) {
                for (var i = 0; i < purchases.length; ++i) {
                    var purchase = purchases[i];
                    var p = store.get(purchase.productId);
                    if (!p) {
                        store.log.warn("android -> user owns a non-registered product");
                        continue;
                    }
                    setProductData(p, purchase);
                }
            }
            store.ready(true);
        },
        function() { // error
            // TODO
        }
    );
}

//   {
//     "purchaseToken":"tokenabc",
//     "developerPayload":"mypayload1",
//     "packageName":"com.example.MyPackage",
//     "purchaseState":0, [0=purchased, 1=canceled, 2=refunded]
//     "orderId":"12345.6789",
//     "purchaseTime":1382517909216,
//     "productId":"example_subscription"
//   }
function setProductData(product, data) {

    store.log.debug("android -> product data for " + product.id);
    store.log.debug(data);

    product.transaction = {
        type: 'android-playstore',
        id: data.orderId,
        purchaseToken: data.purchaseToken,
        developerPayload: data.developerPayload,
        receipt: data.receipt,
        signature: data.signature
    };

    // When the product is owned, adjust the state if necessary
    if (product.state !== store.OWNED && product.state !== store.FINISHED &&
        product.state !== store.APPROVED) {

        if (data.purchaseState === 0) {
            product.set("state", store.APPROVED);
        }
    }

    // When the product is cancelled or refunded, adjust the state if necessary
    if (product.state === store.OWNED || product.state === store.FINISHED ||
        product.state === store.APPROVED) {

        if (data.purchaseState === 1) {
            product.trigger("cancelled");
            product.set("state", store.VALID);
        }
        else if (data.purchaseState === 2) {
            product.trigger("refunded");
            product.set("state", store.VALID);
        }
    }
}

store.when("requested", function(product) {
    store.ready(function() {
        if (!product) {
            store.error({
                code: store.ERR_INVALID_PRODUCT_ID,
                message: "Trying to order an unknown product"
            });
            return;
        }
        if (!product.valid) {
            product.trigger("error", [new store.Error({
                code: store.ERR_PURCHASE,
                message: "`purchase()` called with an invalid product"
            }), product]);
            return;
        }

        // Initiate the purchase
        product.set("state", store.INITIATED);

        var method = 'subscribe';
        if (product.type === store.NON_CONSUMABLE || product.type === store.CONSUMABLE) {
            method = 'buy';
        }

        store.android[method](function(data) {
            // Success callabck.
            //
            // example data:
            // {
            //     "orderId":        "12999763169054705758.1385463868367493",
            //     "packageName":    "com.example.myPackage",
            //     "productId":      "example_subscription",
            //     "purchaseTime":   1397590291362,
            //     "purchaseState":  0,
            //     "purchaseToken":  "ndgl...X5KQ",
            //     "receipt":        "{...}",
            //     "signature":      "qs54SGHgjGSJHSKJHIU"
            // }
            setProductData(product, data);
        },
        function(err, code) {
            store.log.info("android -> " + method + " error " + code);
            if (code === store.ERR_PAYMENT_CANCELLED) {
                // This isn't an error,
                // just trigger the cancelled event.
                product.transaction = null;
                product.trigger("cancelled");
            }
            else {
                store.error({
                    code: code || store.ERR_PURCHASE,
                    message: "Purchase failed: " + err
                });
            }
            product.set("state", store.VALID);
        }, product.id);
    });
});

/// #### finish a purchase
/// When a consumable product enters the store.FINISHED state,
/// `consume()` the product.
store.when("product", "finished", function(product) {
    store.log.debug("android -> consumable finished");
    if (product.type === store.CONSUMABLE) {
        product.transaction = null;
        store.android.consumePurchase(
            function() { // success
                store.log.debug("android -> consumable consumed");
                product.set('state', store.VALID);
            },
            function(err, code) { // error
                // can't finish.
                store.error({
                    code: code || store.ERR_UNKNOWN,
                    message: err
                });
            },
            product.id);
    }
    else {
        product.set('state', store.OWNED);
    }
});

})();
