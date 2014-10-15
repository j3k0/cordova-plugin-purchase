(function() {
"use strict";

var isReady = false;

var callbacks = [];

/// ## <a name="ready"></a>*store.ready(callback)*
/// Register the `callback` to be called when the store is ready to be used.
///
/// If the store is already ready, `callback` is called immediatly.
store.ready = function (cb) {
    /// ### alternate usage (internal)
    /// `store.ready(true)` will set the `ready` status to true,
    /// and call the registered callbacks
    if (cb === true) {
        if (isReady) return this;
        isReady = true;
        for (var i = 0; i < callbacks.length; ++i)
            callbacks[i].call(this);
        callbacks = [];
    }
    else if (cb) {
        if (isReady) {
            cb();
            return this;
        }
        else {
            callbacks.push(cb);
        }
    }
    else {
        ///
        /// `store.ready()` without arguments will return the `ready` status.
        return isReady;
    }
    return this;
};

// Remove any callbacks registered with `ready`
store.ready.unregister = function(cb) {
    callbacks = callbacks.filter(function(o) {
        return o !== cb;
    });
};

}).call(this);
