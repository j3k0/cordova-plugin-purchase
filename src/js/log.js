(function(){
"use strict";

var logLevel = {};
logLevel[store.ERROR] = "ERROR";
logLevel[store.WARNING] = "WARNING";
logLevel[store.INFO] = "INFO";
logLevel[store.DEBUG] = "DEBUG";

function log(level, o) {
    var maxLevel = (store.verbosity === true ? 1 : store.verbosity);
    if (level > maxLevel)
        return;

    if (typeof o !== 'string')
        o = JSON.stringify(o);

    if (logLevel[level])
        console.log("[store.js] " + logLevel[level] + ": " + o);
    else
        console.log("[store.js] " + o);
}

/// ## *store.log* object
store.log = {

    /// ### `store.log.error(message)`
    /// Logs an error message, only if `store.debug` >= store.ERROR
    error: function(o) { log(store.ERROR, o); },

    /// ### `store.log.warn(message)`
    /// Logs a warning message, only if `store.debug` >= store.WARNING
    warn: function(o) { log(store.WARNING, o); },

    /// ### `store.log.info(message)`
    /// Logs an info message, only if `store.debug` >= store.INFO
    info: function(o) { log(store.INFO, o); },

    /// ### `store.log.debug(message)`
    /// Logs a debug message, only if `store.debug` >= store.DEBUG
    debug: function(o) { log(store.DEBUG, o); }
};

})();
