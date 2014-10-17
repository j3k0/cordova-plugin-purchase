/// # iOS Implementation
/// 
/// The implementation of the unified API is a small layer
/// built on top of the legacy "PhoneGap-InAppPurchase-iOS" plugin.
///
/// This was first decided as a temporary "get-things"done" solution.
/// However, I found this ended-up providing a nice separation of concerns:
///
///  - the `ios.js` file exposes an API called `storekit` that matches the
///    iOS way of dealing with in-app purchases.
///    - It is where the dialog with the Obj-C part happens.
///    - It turns that into a javascript friendly API, close to the StoreKit API.
///    - There are some specifities to it, so if eventually some users want
///      to go for a platform specific implementation on iOS, they can!
///  - the `store-ios.js` connects the iOS `storekit` API with the
///    unified `store` API.
///    - It makes sure products are loaded from apple servers
///    - It reacts to product's changes of state, so that a product get's purchased
///      when `REQUESTED`, or finished when `FINISHED` for instance.
///

// #include "copyright.js"
// #include "store.js"
// #include "ios.js"

/// ## Reacting to product state changes
///
/// The iOS implementation monitors products changes of state to trigger
/// `storekit` operations.
///
/// Please refer to the [product life-cycle section](api.md#life-cycle) of the documentation
/// for better understanding of the job of this event handlers.

/// #### initialization
/// At first refresh, initialize the storekit API. See [`storekitInit()`](#storekitInit) for details.
///
/*///*/     store.once("refreshed", function() {
/*///*/         storekitInit();
/*///*/     });
///

/// #### finishing a purchase
/// When a product order is finished, `finish()` the storekit transaction.
///
/*///*/     store.when("finished", function(product) {
/*///*/         storekit.finish(product.transaction.id);
/*///*/     });
///

/// #### persist ownership
/// A non-consumable product, once owned always will be.
/// Until Apple provides a mean to get notified to refunds... there's no way back.
///
/*///*/     store.when("owned", function(product) {
/*///*/         setOwned(product.id, true);
/*///*/     });
///

/// ## Functions

/// ### <a name="storekitInit"></a> *storekitInit()*
///
/// This funciton will initialize the storekit API.
///
/// This initiates a chain reaction with `storekitReady()` and `storekitLoaded()`
/// that will make sure product are loaded from server and restored
/// to their proper *OWNED* status.
var initialized = false;
var storekitInit = function () {
    if (initialized) return;
    initialized = true;
    storekit.init({
        debug:    store.verbosity >= store.INFO ? true : false,
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

/// ### <a name="storekitReady"></a> *storekitReady()*
///
/// Loads all registered products immediately when storekit is ready.
///
/// Triggers `storekitLoaded()` when done.
var storekitReady = function () {
    var products = [];
    for (var i = 0; i < store.products.length; ++i)
        products.push(store.products[i].id);
    storekit.load(products, storekitLoaded);
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
        if (isOwned(p.id))
            p.set("state", store.OWNED);
    }
    for (var j = 0; j < invalidProductIds.length; ++j) {
        p = store.products.byId[invalidProductIds[j]];
        p.set("state", store.INVALID);
        p.trigger("loaded");
    }

    // Defer execution of "ready" to make sure state changes have been processed.
    setTimeout(function() {
        store.ready(true);
    }, 1);
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
        product.transaction = {
            type: 'ios-appstore',
            id:   transactionId
        };
        product.set("state", store.APPROVED);
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

/// ### <a name="storekitError"></a> *storekitError()*
///
/// Called when an error happens in the storekit API.
///
/// Will convert storekit errors to a [`store.Error`](api.md/#errors).
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

// Restore purchases.
store.restore = function() {
};

store.when("requested", function(product) {
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

// 
// ### Persistance of the "OWNED" status
//

// #### *isOwned(productId)*
// return true iff the product with given ID has been purchased and finished
// during this or a previous execution of the application.
function isOwned(productId) {
    return localStorage["__cc_fovea_store_ios_owned_ " + productId] === '1';
}

// #### *setOwned(productId, value)*
// store the boolean OWNED status of a given product.
function setOwned(productId, value) {
    localStorage["__cc_fovea_store_ios_owned_ " + productId] = value ? '1' : '0';
}

module.exports = store;
