(function() {


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

var validationRequests = [];
var timeout = null;

function runValidation() {
  store.log.debug('runValidation()');

  timeout = null;
  var requests = validationRequests;
  validationRequests = [];

  // Merge validation requests by products.
  var byProduct = {};
  requests.forEach(function(request) {
    var productId = request.product.id;
    if (byProduct[productId]) {
      byProduct[productId].callbacks.push(request.callback);
      // assume the most up to date value for product will come last
      byProduct[productId].product = request.product;
    }
    else {
      byProduct[productId] = {
        product: request.product,
        callbacks: [request.callback]
      };
    }
  });

  // Run one validation request for each product.
  Object.keys(byProduct).forEach(function(productId) {
      var request = byProduct[productId];
      store.utils.ajax({
          url: store.validator,
          method: 'POST',
          data: request.product,
          success: function(data) {
              store.log.debug("validator success, response: " + JSON.stringify(data));
              request.callbacks.forEach(function(callback) {
                  callback(data && data.ok, data.data);
              });
          },
          error: function(status, message, data) {
              var fullMessage = "Error " + status + ": " + message;
              store.log.debug("validator failed, response: " + JSON.stringify(fullMessage));
              store.log.debug("body => " + JSON.stringify(data));
              request.callbacks.forEach(function(callback) {
                  callback(false, fullMessage);
              });
          }
      });
  });
}

function scheduleValidation() {
  store.log.debug('scheduleValidation()');
  if (timeout)
    clearTimeout(timeout);
  timeout = setTimeout(runValidation, 500);
}

//
// ## store._validator
//
// Execute the internal validation call, either to a webservice
// or to the provided callback.
//
// Also makes sure to refresh the receipts.
//
store._validator = function(product, callback, isPrepared) {
    if (!store.validator) {
        callback(true, product);
        return;
    }

    if (store._prepareForValidation && isPrepared !== true) {
        store._prepareForValidation(product, function() {
            store._validator(product, callback, true);
        });
        return;
    }

    if (typeof store.validator === 'string') {
        validationRequests.push({
            product: product,
            callback: callback
        });
        scheduleValidation();
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
