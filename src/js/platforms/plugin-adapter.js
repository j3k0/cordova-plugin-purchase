(function() {


var initialized = false;
var skus = [];
var inAppSkus = [];
var subsSkus = [];

store.when("refreshed", function() {
    if (!initialized) init();
});

store.when("re-refreshed", function() {
    store.iabGetPurchases(function() {
        store.trigger('refresh-completed');
    });
});

store.update = function(successCb, errorCb) {
    store.iabGetPurchases(function() {
        if (successCb)
            successCb();
    });
};

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

    for (var i = 0; i < store.products.length; ++i) {
      skus.push(store.products[i].id);
      if (store.products[i].type === store.PAID_SUBSCRIPTION)
        subsSkus.push(store.products[i].id);
      else
        inAppSkus.push(store.products[i].id);
    }

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
            onSetPurchases: iabSetPurchases,
            onPurchasesUpdated: iabPurchasesUpdated,
            onPurchaseConsumed: iabPurchaseConsumed,
            showLog: store.verbosity >= store.DEBUG ? true : false
        },
        skus, inAppSkus, subsSkus);
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

function iabPurchaseConsumed(purchase) {
  store.log.debug("iabPurchaseConsumed: " + JSON.stringify(purchase));
  store.ready(function() {
    if (purchase && purchase.productId) {
      var product = store.get(purchase.productId);
      if (product) {
        store.setProductData(product, purchase);
        product.set({
          state: store.VALID,
          transaction: null,
        });
      }
    }
  });
}

function iabPurchasesUpdated(purchases) {
  store.log.debug("iabPurchasesUpdated: " + JSON.stringify(purchases));
  store.ready(function() {
    if (store.iabUpdatePurchases) {
      store.iabUpdatePurchases(purchases);
    }
  });
}

function iabSetPurchases(purchases) {
  store.log.debug("iabSetPurchases: " + JSON.stringify(purchases));
  store.ready(function() {
    if (store.iabSetPurchases) {
      store.iabSetPurchases(purchases);
    }
  });
}

/** type ValidProductV11 = {
 * productId: string;
 * title: string;
 * name: string;
 * billing_period: string;
 * billing_period_unit: string;
 * description: string;
 * price: string;
 * price_amount_micros: string;
 * price_currency_code: string;
 * trial_period: string;
 * trial_period_unit: string;
 * formatted_price: string;
 * freeTrialPeriod: string;
 * introductoryPrice: string;
 * introductoryPriceAmountMicros: string;
 * introductoryPriceCycles: string;
 * introductoryPricePeriod: string;
 * subscriptionPeriod: string;
 * }
 */

/** type ValidProductV12 = {
 * product_format: "v12.0";
 * productId: string;
 * name: string;
 * title: string;
 * product_type: "inapp" | "subs";
 * description: string;
 * offers: {
 *   token: string;
 *   tags: string[];
 *   pricing_phases: {
 *     recurrence_mode: "FINITE_RECURRING" | "INFINITE_RECURRING" | "NON_RECURRING"
 *     billing_period: string;
 *     billing_cycle_count: string;
 *     formatted_price: string;
 *     price_amount_micros: string;
 *     price_currency_code: string;
 *   }[];
 * }[]
 * }
 */

function iabSubsOfferV12Loaded(vp, productOffer) {
    var offerAttributes = {
        id: vp.productId + '@' + productOffer.token,
        parentId: vp.productId,
        group: vp.productId,
        type: store.get(vp.productId).type,
        state: store.VALID,
        title: vp.name,
        description: vp.description,
        tags: productOffer.tags,
        pricingPhases: productOffer.pricing_phases.map(iabPricingPhaseToAttribute)
    };
    // Backward compatibility (might be incomplete if user have complex pricing models, but might as well be complete...)
    if (productOffer.pricing_phases.length > 0) {
        iabSubsAddV12Attributes(offerAttributes, productOffer);
    }
    var offerP = store.get(offerAttributes.id);
    if (!offerP) {
        store.register(offerAttributes);
        offerP = store.get(offerAttributes.id);
    }
    offerP.set(offerAttributes);
    offerP.trigger("loaded");
}

function iabPaymentMode (phase) {
    return phase.price_amount_micros === 0 ? 'FreeTrial' : phase.recurrenceMode === store.NON_RECURRING ? 'UpFront' : 'PayAsYouGo';
}

function iabPricingPhaseToAttribute(phase) {
    return {
        price: phase.formatted_price,
        priceMicros: phase.price_amount_micros,
        currency: phase.price_currency_code,
        billingPeriod: phase.billing_period,
        billingCycles: phase.billing_cycle_count,
        recurrenceMode: phase.recurrence_mode,
        paymentMode: iabPaymentMode(phase),
    };
}

function iabSubsAddV12Attributes(attributes, offer) {
    if (offer && offer.pricing_phases.length > 0) {
        var firstPhase = offer.pricing_phases[0];
        var lastPhase = offer.pricing_phases[offer.pricing_phases.length - 1];
        attributes.price = lastPhase.formatted_price;
        attributes.priceMicros = lastPhase.price_amount_micros;
        attributes.currency = lastPhase.price_currency_code;
        attributes.billingPeriodISO = lastPhase.billing_period;
        attributes.billingCycles = lastPhase.billing_cycle_count;
        attributes.paymentMode = iabPaymentMode(lastPhase);
        attributes.recurrenceMode = lastPhase.recurrenceMode;
        attributes.billingPeriodUnit = normalizeISOPeriodUnit(lastPhase.billing_period);
        attributes.billingPeriod = normalizeISOPeriodCount(lastPhase.billing_period);

        if (offer.pricing_phases == 2) {
            attributes.introPrice = firstPhase.formatted_price;
            attributes.introPriceMicros = firstPhase.price_amount_micros;
            attributes.introPeriodISO = firstPhase.billing_period;
            attributes.introCycles = firstPhase.billing_cycle_count;
            attributes.introPaymentMode = iabPaymentMode(firstPhase);
            attributes.introRecurrenceMode = firstPhase.recurrenceMode;
            attributes.introPricePeriod = normalizeISOPeriodCount(firstPhase.billing_period);
            attributes.introPricePeriodUnit = normalizeISOPeriodUnit(firstPhase.billing_period);
        }
    }
}

function iabSubsV12Loaded(vp) {
    // console.log('iabSubsV12Loaded: ' + JSON.stringify(vp));
    vp.offers.forEach(function (productOffer) {
        iabSubsOfferV12Loaded(vp, productOffer);
    });
    var firstOffer = vp.offers[0];
    if (firstOffer && firstOffer.pricing_phases.length > 0) {
        var attributes = {
            state: store.VALID,
            title: vp.name,
            description: vp.description,
            offers: vp.offers.map(function(offer) {
                return vp.productId + '@' + offer.token;
            }),
        };
        iabSubsAddV12Attributes(attributes, firstOffer);
        var p = store.products.byId[vp.productId];
        p.set(attributes);
        p.trigger("loaded");
    }
}

function iabSubsV11Loaded(vp) {
    // console.log('iabSubsV11Loaded: ' + JSON.stringify(vp));
    var p = store.products.byId[vp.productId];
    var attributes = {
        state: store.VALID,
        title: vp.name || trimTitle(vp.title),
        description: vp.description,
    };
    var currency = vp.price_currency_code || "";
    var price = vp.formatted_price || vp.price;
    var priceMicros = vp.price_amount_micros;
    var subscriptionPeriod = vp.subscriptionPeriod ? vp.subscriptionPeriod : "";
    var introPriceSubscriptionPeriod = vp.introductoryPricePeriod ? vp.introductoryPricePeriod : "";
    var introPriceNumberOfPeriods = vp.introductoryPriceCycles ? vp.introductoryPriceCycles : 0;
    var introPricePeriodUnit = normalizeISOPeriodUnit(introPriceSubscriptionPeriod);
    var introPricePeriodCount = normalizeISOPeriodCount(introPriceSubscriptionPeriod);
    var introPricePeriod = (introPriceNumberOfPeriods || 1) * (introPricePeriodCount || 1);
    var introPriceMicros = vp.introductoryPriceAmountMicros ? vp.introductoryPriceAmountMicros : "";
    var introPrice = vp.introductoryPrice ? vp.introductoryPrice : "";
    var introPricePaymentMode;

    if (vp.freeTrialPeriod) {
        introPricePaymentMode = 'FreeTrial';
        try {
            introPricePeriodUnit = normalizeISOPeriodUnit(vp.freeTrialPeriod);
            introPricePeriodCount = normalizeISOPeriodCount(vp.freeTrialPeriod);
            introPricePeriod = introPricePeriodCount;
        }
        catch (e) {
            store.log.warn('Failed to parse free trial period: ' + vp.freeTrialPeriod);
        }
    }
    else if (vp.introductoryPrice) {
        if (vp.introductoryPrice < vp.price && subscriptionPeriod === introPriceSubscriptionPeriod) {
            introPricePaymentMode = 'PayAsYouGo';
        }
        else if (introPriceNumberOfPeriods === 1) {
            introPricePaymentMode = 'UpFront';
        }
    }

    if (!introPricePaymentMode) {
        introPricePeriod = null;
        introPricePeriodUnit = null;
    }

    var parsedSubscriptionPeriod = {};
    if (subscriptionPeriod) {
        parsedSubscriptionPeriod.unit = normalizeISOPeriodUnit(subscriptionPeriod);
        parsedSubscriptionPeriod.count = normalizeISOPeriodCount(subscriptionPeriod);
    }

    var trialPeriod = vp.trial_period || null;
    var trialPeriodUnit = vp.trial_period_unit || null;
    var billingPeriod = parsedSubscriptionPeriod.count || vp.billing_period || null;
    var billingPeriodUnit = parsedSubscriptionPeriod.unit || vp.billing_period_unit || null;

    var pricingPhases = [];
    if (trialPeriod) {
        pricingPhases.push({
            paymentMode: 'FreeTrial',
            recurrenceMode: store.FINITE_RECURRING,
            period: vp.freeTrialPeriod || toISO8601Duration(trialPeriodUnit, trialPeriod),
            cycles: 1,
            price: null,
            priceMicros: 0,
            currency: currency,
        });
    }
    else if (introPricePeriod) {
        pricingPhases.push({
            paymentMode: 'PayAsYouGo',
            recurrenceMode: store.FINITE_RECURRING,
            period: vp.introPriceSubscriptionPeriod || toISO8601Duration(introPricePeriodUnit, introPricePeriodCount),
            cycles: vp.introductoryPriceCycles || 1,
            price: null, // formatted price not available
            priceMicros: introPriceMicros,
            currency: currency,
        });
    }

    pricingPhases.push({
        paymentMode: 'PayAsYouGo',
        recurrenceMode: store.INFINITE_RECURRING,
        period: vp.subscriptionPeriod || toISO8601Duration(billingPeriodUnit, billingPeriod), // ISO8601 duration
        cycles: 0,
        price: price,
        priceMicros: priceMicros,
        currency: currency,
    });
    attributes.pricingPhases = pricingPhases;

    if (store.compatibility > 0 && store.compatibility < 10.999) {
        Object.assign(attributes, {
            price: price,
            priceMicros: priceMicros,
            currency: currency,
            trialPeriod: trialPeriod,
            trialPeriodUnit: trialPeriodUnit,
            billingPeriod: billingPeriod,
            billingPeriodUnit: billingPeriodUnit,
            introPrice: introPrice,
            introPriceMicros: introPriceMicros,
            introPricePeriod: introPricePeriod,
            introPricePeriodUnit: introPricePeriodUnit,
            introPricePaymentMode: introPricePaymentMode,
        });
    }

    if (store.compatibility > 0 && store.compatibility < 9.999) {
        Object.assign(attributes, {
            introPriceNumberOfPeriods: introPricePeriod,
            introPriceSubscriptionPeriod: introPricePeriodUnit,
        });
    }

    p.set(attributes);
    p.trigger("loaded");
}

function iabInAppLoaded(vp) {
    // console.log('iabInAppLoaded: ' + JSON.stringify(vp));
    var p = store.products.byId[vp.productId];
    p.set({
        state: store.VALID,
        title: vp.name || trimTitle(vp.title),
        description: vp.description,
        currency: vp.price_currency_code || "",
        price: vp.formatted_price || vp.price,
        priceMicros: vp.price_amount_micros,
    });
    p.trigger("loaded");
}

function iabValidProductLoaded(vp) {
    if (!vp.productId) return;
    var p = store.products.byId[vp.productId];
    if (!p) return;
    if (vp.product_format === "v12.0") {
        if (vp.product_type === "subs")
            iabSubsV12Loaded(vp);
        else
            iabInAppLoaded(vp);
    }
    else if (p.type === store.PAID_SUBSCRIPTION) {
        iabSubsV11Loaded(vp);
    }
    else {
        iabInAppLoaded(vp);
    }
}

// validProducts: Array<ValidProductV11 | ValidProductV12>
function iabLoaded(validProducts) {
    store.log.debug("plugin -> loaded - " + JSON.stringify(validProducts));
    var p, i, vp;
    for (i = 0; i < validProducts.length; ++i) {
        vp = validProducts[i];
        if (vp.productId) iabValidProductLoaded(vp);
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
    var transaction = product.transaction;
    var id = transaction && transaction.id || "";
    store.log.debug("plugin -> consumable finished");
    if (product.type === store.CONSUMABLE || product.type === store.NON_RENEWING_SUBSCRIPTION) {
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
            product.id,
            id,
            getDeveloperPayload(product)
        );
    }
    else if (store.requireAcknowledgment && !product.acknowledged) {
        store.inappbilling.acknowledgePurchase(
            function() { // success
                store.log.debug("plugin -> purchase acknowledged");
                product.set({
                  acknowledged: true,
                  state: store.OWNED,
                });
            },
            function(err, code) { // error
                // can't finish.
                store.error({
                    code: code || store.ERR_UNKNOWN,
                    message: err
                });
            },
            product.id,
            id,
            getDeveloperPayload(product)
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


store.extendAdditionalData = function(product) {
    var a = product.additionalData || {};

    //  - `accountId` : **string**
    //    - _Default_: `md5(applicationUsername)`
    //    - An optional obfuscated string that is uniquely associated
    //      with the user's account in your app.
    //      If you pass this value, it can be used to detect irregular
    //      activity, such as many devices making purchases on the same
    //      account in a short period of time.
    //    - _Do not use the developer ID for this field._
    //    - In addition, this field should not contain the user's ID in
    //      cleartext. We recommend that you use a one-way hash to
    //      generate a string from the user's ID and store the hashed
    //      string in this field.
    if (!a.accountId && a.applicationUsername) {
        a.accountId = store.utils.md5(a.applicationUsername);
    }

    //  - `developerId` : **string**
    //     - An optional obfuscated string of developer profile name.
    //       This value can be used for payment risk evaluation.
    //     - _Do not use the user account ID for this field._
    if (!a.developerId && store.developerName) {
        a.developerId = store.utils.md5(store.developerName);
    }

    // If we're ordering a subscription, check if another one in the
    // same group is already purchased, set `oldSku` in that case (so
    // it's replaced).
    if (product.group) {
        if (!a.oldPurchaseToken && !a.oldSku) {
            // If neither of the oldPurchaseToken and oldSku are specified,
            // look in the product group for an owned product.
            // Automatically set oldSku and oldPurchaseToken if one is found.
            store.getGroup(product.group).forEach(function(otherProduct) {
                if (isPurchased(otherProduct)) {
                    a.oldSku = otherProduct.id;
                    a.oldPurchaseToken =
                        otherProduct.transaction ?
                        otherProduct.transaction.purchaseToken :
                        null;
                }
            });
        }
        else if (a.oldSku && !a.oldPurchaseToken) {
            // If only oldSku is set, automatically set oldPurchaseToken.
            var otherProduct = store.get(a.oldSku);
            if (otherProduct && otherProduct.transaction) {
                a.oldPurchaseToken = otherProduct.transaction.purchaseToken;
            }
        }
        else if (a.oldPurchaseToken && !a.oldSku) {
            // If only oldPurchaseToken is set, automatically set oldSku.
            store.products.forEach(function(otherProduct) {
                var otherPurchaseToken =
                    otherProduct.transaction ?
                    otherProduct.transaction.purchaseToken :
                    null;
                if (otherPurchaseToken == a.oldPurchaseToken) {
                    a.oldSku = otherProduct.id;
                }
            });
        }
    }
};

function isPurchased(product) {
    return [
        store.APPROVED,
        store.FINISHED,
        store.INITIATED,
        store.OWNED,
    ].indexOf(product.state) >= 0;
}

function getDeveloperPayload(product) {
    var ret = store._evaluateDeveloperPayload(product);
    if (ret) {
        return ret;
    }
    // There is no developer payload but an applicationUsername, let's
    // save it in there: it can be used to compare the purchasing user
    // with the current user.
    var applicationUsername = store.getApplicationUsername(product);
    if (!applicationUsername) {
        return "";
    }
    return JSON.stringify({
        applicationUsernameMD5: store.utils.md5(applicationUsername),
    });
}

// callback: function(status: "UserCanceled" | "OK" | "UnknownProduct")
store.launchPriceChangeConfirmationFlow = function(productId, callback) {
    store.inappbilling.onPriceChangeConfirmationResult = callback;
    store.inappbilling.launchPriceChangeConfirmationFlow(productId);
};

// See https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
// assuming simple periods (P1M, P6W, ...)
function normalizeISOPeriodUnit(period) {
    switch (period.slice(-1)) {
        case 'D': return 'Day';
        case 'W': return 'Week';
        case 'M': return 'Month';
        case 'Y': return 'Year';
        default:  return period;
    }
}

function normalizeISOPeriodCount(period) {
    return parseInt(period.replace(/[A-Z]+/g, ''));
}

function trimTitle(title) {
    if (!title) return 'Invalid product';
    return title.split('(').slice(0, -1).join('(').replace(/ $/, '');
}

function toISO8601Duration(unit, count) {
    var PERIOD_UNIT = {
        'Day': 'D',
        'Week': 'W',
        'Month': 'M',
        'Year': 'Y'
    };
    if (PERIOD_UNIT[unit]) return 'P' + count + PERIOD_UNIT[unit];
    var TIME_UNIT = {
        'Minute': 'M',
        'Hour': 'H'
    };
    if (TIME_UNIT[unit]) return 'T' + count + TIME_UNIT[unit];
    return null;
}

})();
