(function(){
    "use strict";

    var timeFactor = 1;
    var pSetTimeout = global.setTimeout;
    global.setTimeout = function(fn, delay) {
        pSetTimeout(fn, delay / timeFactor);
    };

    exports.resetTest = function() {
        var store = require("../tmp/store-test");
        store._queries.callbacks.byQuery = {};
        store.ready.reset();
        store.products.reset();
        store.error.callbacks.reset();
        timeFactor = 1;
    };

    exports.setTimeoutFactor = function(value) {
        timeFactor = value;
    };
})();
