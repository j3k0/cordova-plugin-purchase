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
        ajax(store.validator, product,
             function(data) {
                 callback(data && data.ok, data);
             },
             function(status) {
                 callback(false);
             });
    }
    else {
        store.validator(product, callback);
    }
};

function ajax(url, data, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.responseType = 'json';
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onload = function() {
        var status = xhr.status;
        store.log.debug('verify -> server response '  + status + ': ' + JSON.stringify(xhr.response));
        if (status == 200) {
            if (success) success(xhr.response);
        } else {
            store.log.warn("verify -> request to " + store.validator + " failed with status " + status);
            if (error) error(status);
        }
    };
    // xhr.send();
    store.log.debug('verify -> send request to ' + url);
    xhr.send(JSON.stringify(data));
}

}).call(this);
