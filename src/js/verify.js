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
        ajax({
            url: store.validator,
            data: product,
            success: function(data) {
                callback(data && data.ok, data.data);
            },
            error: function(status) {
                callback(false);
            }
        });
    }
    else {
        store.validator(product, callback);
    }
};

function ajax(options) { // url, data, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', options.url, true);
    xhr.onreadystatechange = function(event) {
        try {
            store.log.debug("verify -> ajax state " + xhr.readyState);
            if (+xhr.readyState === 4) {
                store.log.debug("verify -> 4");
                if (+xhr.status === 200) {
                    store.log.debug("verify -> status == 200");
                    store.log.debug("verify -> " + xhr.responseText);
                    if (options.success) options.success(xhr.response);
                }
                else {
                    store.log.debug("verify -> status != 200");
                    store.log.warn("verify -> request to " + options.url + " failed with status " + status + " (" + xhr.statusText + ")");
                    if (options.error) options.error(xhr.status, xhr.statusText);
                }
            }
        }
        catch (e) {
            if (options.error) options.error(417, e.message);
        }
    };
    store.log.debug('verify -> send request to ' + options.url);
    if (options.data) {
        xhr.responseType = options.dataType || 'json';
        xhr.setRequestHeader("Content-Type", options.contentType || "application/json;charset=UTF-8");
        // xhr.setRequestHeader("Content-Type", options.contentType || 'application/x-www-form-urlencoded; charset=UTF-8');
        xhr.send(JSON.stringify(options.data));
    }
    else {
        xhr.send();
    }
}

}).call(this);
