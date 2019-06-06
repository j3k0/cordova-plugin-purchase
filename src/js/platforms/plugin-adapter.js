(function() {


var initialized = false;
var skus = [];

store.when("refreshed", function() {
    if (!initialized) init();
});

store.when("re-refreshed", function() {
    store.iabGetPurchases(function() {
        store.trigger('refresh-completed');
    });
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
            retry(init);
        },
        {
            showLog: store.verbosity >= store.DEBUG ? true : false
        },
        skus);
}

function iabReady() {
    store.log.debug("plugin -> ready");
    store.inappbilling.getAvailableProducts(iabLoaded, function(err) {
        retry(iabReady);
        store.error({
            code: store.ERR_LOAD,
            message: 'Loading product info failed - ' + err
        });
    });
}

function iabLoaded(validProducts) {
    store.log.debug("plugin -> loaded - " + JSON.stringify(validProducts));
    var p, i, vp;
    for (i = 0; i < validProducts.length; ++i) {
        vp = validProducts[i];

        if (vp.productId)
            p = store.products.byId[vp.productId];
        else
            p = null;

        if (p) {
            var subscriptionPeriod = vp.subscriptionPeriod ? vp.subscriptionPeriod : "";
            var introPriceSubscriptionPeriod = vp.introductoryPricePeriod ? vp.introductoryPricePeriod : "";
            var introPriceNumberOfPeriods = vp.introductoryPriceCycles ? vp.introductoryPriceCycles : 0;

            var introPricePaymentMode = null;
            if (vp.freeTrialPeriod) {
                introPricePaymentMode = 'FreeTrial';
            }
            else if (vp.introductoryPrice) {
                if (vp.introductoryPrice < vp.price && subscriptionPeriod === introPriceSubscriptionPeriod) {
                    introPricePaymentMode = 'PayAsYouGo';
                }
                else if (introPriceNumberOfPeriods === 1) {
                    introPricePaymentMode = 'UpFront';
                }
            }

            var normalizeIntroPricePeriod = function (period) {
                switch (period.slice(-1)) { // See https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
                    case 'D': return 'Day';
                    case 'W': return 'Week';
                    case 'M': return 'Month';
                    case 'Y': return 'Year';
                    default:  return period;
                }
            };
            introPriceSubscriptionPeriod = normalizeIntroPricePeriod(introPriceSubscriptionPeriod);

            p.set({
                title: vp.title || vp.name,
                price: vp.price || vp.formattedPrice,
                priceMicros: vp.price_amount_micros,
                trialPeriod: vp.trial_period || null,
                trialPeriodUnit: vp.trial_period_unit || null,
                billingPeriod: vp.billing_period || null,
                billingPeriodUnit: vp.billing_period_unit || null,
                description: vp.description,
                currency: vp.price_currency_code || "",
                introPrice: vp.introductoryPrice ? vp.introductoryPrice : "",
                introPriceMicros: vp.introductoryPriceAmountMicros ? vp.introductoryPriceAmountMicros : "",
                introPriceNumberOfPeriods: introPriceNumberOfPeriods,
                introPriceSubscriptionPeriod: introPriceSubscriptionPeriod,
                introPricePaymentMode: introPricePaymentMode,
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

    store.iabGetPurchases(function() {
        store.trigger('refresh-completed');
    });

    if (store.autoRefreshIntervalMillis !== 0) {
        // Auto-refresh every 24 hours (or autoRefreshIntervalMillis)
        var interval = store.autoRefreshIntervalMillis || (1000 * 3600 * 24);
        window.setInterval(store.refresh, interval);
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

        var method = 'buy';
        if (product.type === store.FREE_SUBSCRIPTION || product.type === store.PAID_SUBSCRIPTION) {
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
        }, product.id, product.additionalData);
    });
});

/// #### finish a purchase
/// When a consumable product enters the store.FINISHED state,
/// `consume()` the product.
store.when("product", "finished", function(product) {
    store.log.debug("plugin -> consumable finished");
    if (product.type === store.CONSUMABLE || product.type === store.NON_RENEWING_SUBSCRIPTION) {
        var transaction = product.transaction;
        product.transaction = null;
        var id;
        if(transaction === null)
            id = "";
        else
            id = transaction.id;
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
            product.id,
            id
        );
    }
    else {
        product.set('state', store.OWNED);
    }
});

//
// ## Retry failed requests
//
// When setup and/or load failed, the plugin will retry over and over till it can connect
// to the store.
//
// However, to be nice with the battery, it'll double the retry timeout each time.
//
// Special case, when the device goes online, it'll trigger all retry callback in the queue.
var retryTimeout = 5000;
var retries = [];
function retry(fn) {

    var tid = setTimeout(function() {
        retries = retries.filter(function(o) {
            return tid !== o.tid;
        });
        fn();
    }, retryTimeout);

    retries.push({ tid: tid, fn: fn });

    retryTimeout *= 2;
    // Max out the waiting time to 2 minutes.
    if (retryTimeout > 120000)
        retryTimeout = 120000;
}

document.addEventListener("online", function() {
    var a = retries;
    retries = [];
    retryTimeout = 5000;
    for (var i = 0; i < a.length; ++i) {
        clearTimeout(a[i].tid);
        a[i].fn.call(this);
    }
}, false);

})();
