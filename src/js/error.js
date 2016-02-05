(function(){
'use strict';

///
/// ## <a name="errors"></a>*store.Error* object
///
/// All error callbacks takes an `error` object as parameter.

store.Error = function(options) {

    if (!options)
        options = {};

    ///
    /// Errors have the following fields:
    ///

    ///  - `error.code` - An integer [error code](#error-codes). See the [error codes](#error-codes) section for more details.
    this.code = options.code || store.ERR_UNKNOWN;

    ///  - `error.message` - Human readable message string, useful for debugging.
    this.message = options.message || "unknown error";
    ///
};

/// ## <a name="error"></a>*store.error(callback)*
///
/// Register an error handler.
///
/// `callback` is a function taking an [error](#errors) as argument.
///
/// ### example use:
///
///     store.error(function(e){
///         console.log("ERROR " + e.code + ": " + e.message);
///     });
///
store.error = function(cb, altCb) {

    var ret = cb;

    if (cb instanceof store.Error) {
        store.error.callbacks.trigger(cb);
    }
    else if (typeof cb === "function") {
        store.error.callbacks.push(cb);
    }

    /// ### alternative usage
    ///
    ///  - `store.error(code, callback)`
    ///    - only call the callback for errors with the given error code.
    ///    - **example**: `store.error(store.ERR_SETUP, function() { ... });`
    else if (typeof altCb === "function") {
        ret = function(err) {
            if (err.code === cb)
                altCb();
        };
        store.error(ret);
    }
    else if (cb.code && cb.message) {
        store.error.callbacks.trigger(new store.Error(cb));
    }
    else if (cb.code) {
        // error message is null(unknown error)
        store.error.callbacks.trigger(new store.Error(cb));
    }
    ///

   return ret;
};

/// ### unregister the error callback
/// To unregister the callback, you will use [`store.off()`](#off):
/// ```js
/// var handler = store.error(function() { ... } );
/// ...
/// store.off(handler);
/// ```
///

// Unregister a callback registered with `store.error`
// this method is called by `store.off`.
store.error.unregister = function(cb) {
    store.error.callbacks.unregister(cb);
};

})();
