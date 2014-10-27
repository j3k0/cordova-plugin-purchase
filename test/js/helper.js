var store = require("../tmp/store-test");

exports.resetTest = function() {
    store._queries.callbacks.byQuery = {};
    store.ready.reset();
    store.products.reset();
    store.error.callbacks.reset();
};
