// Store is the singleton object, exported by the plugin.
var store = {};

/// 
/// ## <a name="store"></a>`store` object ##
/// 
/// `store` is the global object exported by the purchase plugin.
///
/// As with any other plugin,
/// this object shouldn't be used before the "deviceready" event is fired.
///
/// Check cordova's documentation for more details if needed.
/// 
/// ## products ##
/// 
/// Some methods, like the [`ask` method](#ask), give you access to a `product`
/// object. Products object provide a set of fields and methods:
///
/// TODO: Document this
///
/// ## errors ##
/// 

// #include "constants.js"
// #include "registerProducts.js"
// #include "queries.js"
// #include "when.js"
// #include "ask.js"
// #include "ready.js"
// #include "error-handler.js"

store.order = function(product) {
};

store.refresh = function(query) {
};
