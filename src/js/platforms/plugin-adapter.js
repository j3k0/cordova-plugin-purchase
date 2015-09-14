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

// The following table lists all of the server response codes
// that are sent from Google Play to your application.
//
// Google Play sends the response code synchronously as an integer
// mapped to the RESPONSE_CODE key in the response Bundle.
// Your application must handle all of these response codes.
var BILLING_RESPONSE_RESULT = {
    OK: 0, //   Success
    USER_CANCELED: 1, // User pressed back or canceled a dialog
    SERVICE_UNAVAILABLE: 2, // Network connection is down
    BILLING_UNAVAILABLE: 3, // Billing API version is not supported for the type requested
    ITEM_UNAVAILABLE: 4, // Requested product is not available for purchase
    DEVELOPER_ERROR: 5, // Invalid arguments provided to the API. This error can also indicate that the application was not correctly signed or properly set up for In-app Billing in Google Play, or does not have the necessary permissions in its manifest
    ERROR: 6, // Fatal error during the API action
    ITEM_ALREADY_OWNED: 7, // Failure to purchase since item is already owned
    ITEM_NOT_OWNED: 8 // Failure to consume since item is not owned
};

function init() {
    if (initialized) return;
    initialized = true;

    for (var i = 0; i < store.products.length; ++i)
        skus.push(store.products[i].id);

    store.inappbilling.init(iabReady,
        function(err) {
            initialized = false;
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
    store.log.debug("plugin -> ready");
    store.inappbilling.getAvailableProducts(iabLoaded, function(err) {
        store.error({
            code: store.ERR_LOAD,
            message: 'Loading product info failed - ' + err
        });
    });
}

function iabLoaded(validProducts) {
    store.log.debug("plugin -> loaded - " + JSON.stringify(validProducts));
    var p, i;
    for (i = 0; i < validProducts.length; ++i) {

        if (validProducts[i].productId)
            p = store.products.byId[validProducts[i].productId];
        else
            p = null;

        if (p) {
            p.set({
                title: validProducts[i].title || validProducts[i].name,
                price: validProducts[i].price || validProducts[i].formattedPrice,
                description: validProducts[i].description,
                currency: validProducts[i].price_currency_code ? validProducts[i].price_currency_code : "",
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
    store.inappbilling.getPurchases(
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
                        store.log.warn("plugin -> user owns a non-registered product");
                        continue;
                    }
                    store.setProductData(p, purchase);
                }
            }
            store.ready(true);
        },
        function() { // error
            // TODO
        }
    );
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

        var method = 'buy';
        if (product.type !== store.NON_CONSUMABLE && product.type !== store.CONSUMABLE) {
            method = 'subscribe';
        }

        store.inappbilling[method](function(data) {
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
            store.setProductData(product, data);
        },
        function(err, code) {
            store.log.info("plugin -> " + method + " error " + code);
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
            if (code === BILLING_RESPONSE_RESULT.ITEM_ALREADY_OWNED) {
                product.set("state", store.APPROVED);
            }
            else {
                product.set("state", store.VALID);
            }
        }, product.id);
    });
});

/// #### finish a purchase
/// When a consumable product enters the store.FINISHED state,
/// `consume()` the product.
store.when("product", "finished", function(product) {
    store.log.debug("plugin -> consumable finished");
    if (product.type === store.CONSUMABLE) {
        product.transaction = null;
        store.inappbilling.consumePurchase(
            function() { // success
                store.log.debug("plugin -> consumable consumed");
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
