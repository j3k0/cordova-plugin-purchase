(function() {
"use strict";

/// ## <a name="off"></a>*store.off(callback)*
/// Unregister a callback. Works for callbacks registered with `ready`, `ask`, `when`, `once` and `error`.
///
/// Example use:
///
///     var fun = function(product) {
///         // Product loaded while the store screen is visible.
///         // Refresh some stuff.
///     };
///
///     store.when("product").loaded(fun);
///     ...
///     [later]
///     ...
///     store.off(fun);
///
store.off = function(callback) {

    // Unregister from `ready`
    store.ready.unregister(callback);

    // Unregister from `ask`
    store.ask.unregister(callback);

    // Unregister from `when` and `once`
    store.when.unregister(callback);

    // Unregister from `error`
    store.error.unregister(callback);
};

}).call(this);

