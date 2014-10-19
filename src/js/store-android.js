// #include "copyright.js"
// #include "store.js"
// #include "android.js"

(function() {
"use strict";

store.when("refreshed", function() {
    if (!initialized) init();
});

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
                    setProductApproved(p, purchase);
                }
            }
            store.ready(true);
        },
        function() { // errro
        }
    );

    // TODO getPurchases
    // consumable in the list should enter the APPROVED state
    // non-consumable in the list should enter the OWNED state
}

function setProductApproved(product, data) {
    product.transaction = {
        type: 'android-playstore',
        id: data.orderId
    };
    product.set("state", store.APPROVED);
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

        store.android.buy(function(data) {
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
            setProductApproved(product, data);
        },
        function(err, code) {
            store.log.info("android -> buy error " + code);
            if (code === store.ERR_PAYMENT_CANCELLED) {
                // This isn't an error
                // just trigger the cancelled event.
                product.transaction = null;
                product.trigger("cancelled");
            }
            else if (code) {
                store.error({
                    code: code,
                    message: "Purchase failed: " + err
                });
            }
            else {
                store.error({
                    code: store.ERR_PURCHASE,
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
            function(err) { // error
                // can't finish.
            },
            product.id);
    }
    else {
        product.set('state', store.OWNED);
    }
});

}).call(this);

// For some reasons, module exports failed on android...
if (window) {
    window.store = store;
}

module.exports = store;
