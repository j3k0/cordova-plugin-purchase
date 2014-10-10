// 
// List of user registered error callbacks, with methods to:
// - trigger an error (`triggerError`)
// - register a callback (`store.error`)
//

// List of callbacks
var errorCallbacks = [];

// Call all error callbacks with the given error
var triggerError = function(error) {
    for (var i = 0; i < errorCallbacks.length; ++i)
        errorCallbacks[i].call(store, error);
};

// Register an error handler
store.error = function(cb) {
    errorCallbacks.push(cb);
};
