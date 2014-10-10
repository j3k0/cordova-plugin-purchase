// Store is the singleton object, exported by the plugin.
var store = {};

store.FREE_SUBSCRIPTION = "free-subscription";
store.PAID_SUBSCRIPTION = "paid-subscription";

var ERROR_CODES_BASE = 4983497;
store.ERR_SETUP               = ERROR_CODES_BASE + 1;
store.ERR_LOAD                = ERROR_CODES_BASE + 2;
store.ERR_PURCHASE            = ERROR_CODES_BASE + 3;
store.ERR_LOAD_RECEIPTS       = ERROR_CODES_BASE + 4;
store.ERR_CLIENT_INVALID      = ERROR_CODES_BASE + 5;
store.ERR_PAYMENT_CANCELLED   = ERROR_CODES_BASE + 6;
store.ERR_PAYMENT_INVALID     = ERROR_CODES_BASE + 7;
store.ERR_PAYMENT_NOT_ALLOWED = ERROR_CODES_BASE + 8;
store.ERR_UNKNOWN             = ERROR_CODES_BASE + 10;
store.ERR_REFRESH_RECEIPTS    = ERROR_CODES_BASE + 11;
store.ERR_INVALID_PRODUCT_ID  = ERROR_CODES_BASE + 12;
store.productsById = {};
store.productsByAlias = {};
store.products = [];

store.registerProducts = function(products) {
    this.products = products;
    for (var i = 0; i < products.length; ++i) {
        var p = products[i];
        if (!p.alias)
            p.alias = p.id;
        this.productsByAlias[p.alias] = p;
        this.productsById[p.id] = p;
    }
};
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
// 
store.when = function(query, once) {
    return {
        loaded: function(cb) {
            callbacks.add(query, "loaded", cb, once);
            return this;
        },
        approved: function(cb) {
            callbacks.add(query, "approved", cb, once);
            return this;
        },
        rejected: function(cb) {
            callbacks.add(query, "rejected", cb, once);
            return this;
        },
        updated: function(cb) {
            callbacks.add(query, "updated", cb, once);
            return this;
        },
        cancelled: function(cb) {
            callbacks.add(query, "cancelled", cb, once);
            return this;
        }
    };
};

store.once = function(query) {
    return store.when(query, true);
};
// Retrieve informations about a given product.
// If the given product is already loaded, promise callbacks
// will be called immediately. If not, it will happen as soon
// as the product is known as valid or invalid.
var ask = store.ask = function(pid) {
    var that = this;
    var p = this.productsById[pid] || this.productsByAlias[pid];
    if (!p) {
        p = {
            id: pid,
            loaded: true,
            valid: false
        };
    }
    var skip = false;

    return {

        // then: register a callback that'll be called when the product
        // is loaded and known to be valid.
        then: function(cb) {
            if (p.loaded && p.valid) {
                skip = true;
                cb(p);
            }
            else
                that.once(pid).loaded(function(p) {
                    if (skip) return;
                    if (p.valid) {
                        skip = true;
                        cb(p);
                    }
                });
            return this;
        },

        // then: register a callback that'll be called when the product
        // is loaded and known to be invalid. Or when loading of the
        // product information was impossible.
        error: function(cb) {
            if (p.loaded && !p.valid) {
                skip = true;
                cb({
                    code: store.ERR_INVALID_PRODUCT_ID,
                    message: "Invalid product"
                }, p);
            }
            else {
                // TODO: Catch loading errors.
                that.once(pid).loaded(function(p) {
                    if (skip) return;
                    if (!p.valid) {
                        skip = true;
                        cb({
                            code: store.ERR_INVALID_PRODUCT_ID,
                            message: "Invalid product"
                        }, p);
                    }
                });
            }
            return this;
        }
    };
};

var process = store.process = function(query) {
};

var order = store.order = function(product) {
};


store._uniqueQuery = uniqueQuery;
store._callbacks = callbacks;
store._triggerWhenProduct = triggerWhenProduct;

module.exports = store;

