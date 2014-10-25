(function() {
'use strict';

/// ## <a name="validator"></a> *store.validator*
/// Set to the URL of the purchase validation service,
/// or to your own custom validation callback.
///
/// #### example usage
///
/// ```js
/// store.validator = "http://store.fovea.cc:1980/check-purchase"
/// ```
/// 
/// ```js
/// store.validator = function(product, callback) {
///     callback(true);
///     // Here, you will typically want to contact your own webservice
///     // where you check transaction receipts with either Apple or
///     // Google servers.
/// });
/// ```
store.validator = null;

store.verify = function(product, callback, isPrepared) {
    if (!store.validator)
        callback(true);

    if (store._prepareForValidation && isPrepared !== true) {
        store._prepareForValidation(product, function() {
            store.verify(product, callback, true);
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


}).call(this);
