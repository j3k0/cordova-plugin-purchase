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
///         error: {
///             code: store.PURCHASE_EXPIRED,
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

//
// ## store._validator
//
// Execute the internal validation call, either to a webservice
// or to the provided callback.
//
// Also makes sure to refresh the receipts.
//
store._validator = function(product, callback, isPrepared) {
    if (!store.validator)
        callback(true, product);

    if (store._prepareForValidation && isPrepared !== true) {
        store._prepareForValidation(product, function() {
            store._validator(product, callback, true);
        });
        return;
    }

    if (typeof store.validator === 'string') {
        store.utils.ajax({
            url: store.validator,
            method: 'POST',
            data: product,
            success: function(data) {
                callback(data && data.ok, data.data);
            },
            error: function(status, message) {
                callback(false, "Error " + status + ": " + message);
            }
        });
    }
    else {
        store.validator(product, callback);
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
