(function(){
'use strict';

/// 
/// ## *store.error.callbacks* array
///
/// Array of user registered error callbacks.
store.error.callbacks = [];

///
/// ### *store.error.callbacks.trigger(error)*
///
/// Execute all error callbacks with the given `error` argument.
store.error.callbacks.trigger = function(error) {
    for (var i = 0; i < this.length; ++i) {
        try {
            this[i].call(store, error);
        }
        catch (err) {
            store.helpers.handleCallbackError("error", err);
        }
    }
};

///
/// ### *store.error.callbacks.reset()*
///
/// Remove all error callbacks.
store.error.callbacks.reset = function() {
    while (this.length > 0)
        this.shift();
};

store.error.callbacks.unregister = function(cb) {
    var newArray = this.filter(function(o) {
        return o !== cb;
    });
    if (newArray.length < this.length) {
        this.reset();
        for (var i = 0; i < newArray.length; ++i)
            this.push(newArray[i]);
    }
};

}).call(this);
