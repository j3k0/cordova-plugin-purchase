(function() {
'use strict';

/// ## <a name="validator"></a> *store.validator*
/// Set this attribute to either:
///
///  - the URL of your purchase validation service
///     - Fovea's [reeceipt](http://reeceipt.fovea.cc) or your own service.
///  - a custom validation callback method
///
/// #### example usage
///
/// ```js
/// store.validator = "http://store.fovea.cc:1980/check-purchase";
/// ```
///
/// ```js
/// store.validator = function(product, callback) {
///
///     callback(true, { ... transaction details ... }); // success!
///
///     // OR
///     callback(false, {
///         code: store.PURCHASE_EXPIRED,
///         error: {
///             message: "XYZ"
///         }
///     });
///
///     // OR
///     callback(false, "Impossible to proceed with validation");
///
///     // Here, you will typically want to contact your own webservice
///     // where you check transaction receipts with either Apple or
///     // Google servers.
/// });
/// ```
/// Validation error codes are [documented here](#validation-error-codes).
store.validator = null;

// In order not to send big batch of identical requests, we'll
// add verification requests to this list, then process them a little
// moment later.
store._validatorPendingCallbacks = {};
store._validatorTimer = null;

//
// ## store._validator
//
// Execute the internal validation call, either to a webservice
// or to the provided callback.
//
// Also makes sure to refresh the receipts.
//
store._validator = function(product, callback, isPrepared) {

    // Add the callback to the list of pending ones for this product
    if (!store._validatorPendingCallbacks[product.id])
        store._validatorPendingCallbacks[product.id] = [];
    store._validatorPendingCallbacks[product.id].push(callback);
    // (Re)set a timeout to call the actual validation in 500ms
    // for all products at once
    if (store._validatorTimer) clearTimeout(store._validatorTimer);
    store._validatorTimer = setTimeout(go.bind(store, false, null), 500);

    // Start the validation process
    function go(isPrepared, pendingCallbacks) {

        // Clear the timer and retrieve the list ofpending callbacks
        if (!isPrepared) {
            store._validatorTimer = null;
            pendingCallbacks = store._validatorPendingCallbacks;
            store._validatorPendingCallbacks = {};
        }

        // Process all products in series (synchronously)
        var productId = Object.keys(pendingCallbacks)[0];
        if (productId) {
            if (store._prepareForValidation)
                store._prepareForValidation(store.get(productId), callValidate);
            else
                callValidate();
        }

        function callValidate() {
            var product = store.get(productId);
            validate(product, function(success, data) {
                // done validating, process the next product
                pendingCallbacks[productId].forEach(function(callback) {
                    callback(success, data);
                });
                delete pendingCallbacks[productId];
                go(true, pendingCallbacks);
            });
        }
    }

    function validate(product, callback) {
        if (!store.validator)
            callback(true, product);

        if (typeof store.validator === 'string') {
            store.utils.ajax({
                url: store.validator,
                method: 'POST',
                data: product,
                success: function(data) {
                    store.log.debug("validator success, response: " + JSON.stringify(data));
                    callback(data && data.ok, data.data);
                },
                error: function(status, message, data) {
                    var fullMessage = "Error " + status + ": " + message;
                    store.log.debug("validator failed, response: " + JSON.stringify(fullMessage));
                    store.log.debug("body => " + JSON.stringify(data));
                    callback(false, fullMessage);
                }
            });
        }
        else {
            store.validator(product, callback);
        }
    }
};

///
/// ## transactions
///
/// A purchased product will contain transaction information that can be
/// sent to a remote server for validation. This information is stored
/// in the `product.transaction` field. It has the following format:
///
/// - `type`: "ios-appstore" or "android-playstore"
/// - store specific data
///
/// Refer to [this documentation for iOS](https://developer.apple.com/library/ios/releasenotes/General/ValidateAppStoreReceipt/Chapters/ReceiptFields.html#//apple_ref/doc/uid/TP40010573-CH106-SW1).
///
/// Start [here for Android](https://developer.android.com/google/play/billing/billing_integrate.html#billing-security).
///
/// Another option is to use [Fovea's reeceipt validation service](http://reeceipt.fovea.cc/) that implements all the best practices to secure your transactions.
///

})();
