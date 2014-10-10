// Transform a human readable query string
// to a unique string by filter out reserved words.
var uniqueQuery = function(string) {
    if (!string)
        return '';
    var query = '';
    var tokens = string.split(' ');
    for (var i = 0; i < tokens.length; ++i) {
        var token = tokens[i];
        if (token !== 'order') {
            if (query !== '')
                query += ' ';
            query += tokens[i];
        }
    }
    return query;
};

// Manage the list of callbacks registered for given queries
var callbacks = {
    byQuery: {},
    add: function(query, action, cb, once) {
        var fullQuery = uniqueQuery(query ? query + " " + action : action);
        if (this.byQuery[fullQuery])
            this.byQuery[fullQuery].push({cb:cb, once:once});
        else
            this.byQuery[fullQuery] = [{cb:cb, once:once}];
    }
};

// Return true if a callback should be called more than once.
var isNotOnce = function(cb) {
    return !cb.once;
};

// Trigger the callbacks registered when a given action happens to
// given product.
//
// args are passed as arguments to the callbacks.
var triggerWhenProduct = function(product, action, args) {
    var queries = [];
    if (product && product.id)
        queries.push(product.id + " " + action);
    if (product && product.alias)
        queries.push(product.alias + " " + action);
    if (product && product.type)
        queries.push(product.type + " " + action);
    if (product && product.type && (product.type === store.FREE_SUBSCRIPTION || product.type === store.PAID_SUBSCRIPTION))
        queries.push("subscription " + action);
    queries.push(action);
    var i;
    for (i = 0; i < queries.length; ++i) {
        var q = queries[i];
        var cbs = callbacks.byQuery[q];
        if (cbs) {
            // Call callbacks
            for (var j = 0; j < cbs.length; ++j) {
                cbs[j].cb.apply(store, args);
            }
            // Remove callbacks that needed to be called only once
            callbacks.byQuery[q] = cbs.filter(isNotOnce);
        }
    }
};
