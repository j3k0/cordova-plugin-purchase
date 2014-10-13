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

/// ### <a name="error"></a>*store.error(callback)*
///
/// Register an error handler.
///
/// `callback` is a function taking an [error](#errors) as argument.
///
/// example use:
/// ```
///     store.error(function(e){
///         console.log("ERROR " + e.code + ": " + e.message);
///     });
/// ```
store.error = function(cb) {
    store.error.callbacks.push(cb);
};


}).call(this);
