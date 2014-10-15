
/// 
/// ## <a name="store"></a>*store* object ##
/// 
/// `store` is the global object exported by the purchase plugin.
///
/// As with any other plugin,
/// this object shouldn't be used before the "deviceready" event is fired.
///
/// Check cordova's documentation for more details if needed.
/// 
var store = {};

// #include "constants.js"
// #include "product.js"
// #include "error.js"

// #include "registerProducts.js"
// #include "when.js"
// #include "ask.js"
// #include "ready.js"
// #include "off.js"

/// ## <a name="when"></a>*store.order(product)*
store.order = function(productId) {
};

/// ## <a name="refresh"></a>*store.refresh()*
store.refresh = function() {
};

///
/// # internal APIs
/// USE AT YOUR OWN RISKS

// #include "products.js"
// #include "queries.js"
// #include "trigger.js"
// #include "error-callbacks.js"

