
/// 
/// ## <a name="store"></a>*store* object ##
/// 
/// `store` is the global object exported by the purchase plugin.
///
/// As with any other plugin,
/// this object shouldn't be used before the "deviceready" event is fired.
///
/// Check cordova's documentation for more details if needed.
/// 
var store = {};

(function(){
'use strict';

///
/// ## constants
///
/// ### product types
///
/*///*/     store.FREE_SUBSCRIPTION = "free subscription";
/*///*/     store.PAID_SUBSCRIPTION = "paid subscription";
/*///*/     store.CONSUMABLE        = "consumable";
/*///*/     store.NON_CONSUMABLE    = "non consumable";
///
/// ### error codes
///
var ERROR_CODES_BASE = 4983497;
/*///*/     store.ERR_SETUP               = ERROR_CODES_BASE + 1;
/*///*/     store.ERR_LOAD                = ERROR_CODES_BASE + 2;
/*///*/     store.ERR_PURCHASE            = ERROR_CODES_BASE + 3;
/*///*/     store.ERR_LOAD_RECEIPTS       = ERROR_CODES_BASE + 4;
/*///*/     store.ERR_CLIENT_INVALID      = ERROR_CODES_BASE + 5;
/*///*/     store.ERR_PAYMENT_CANCELLED   = ERROR_CODES_BASE + 6;
/*///*/     store.ERR_PAYMENT_INVALID     = ERROR_CODES_BASE + 7;
/*///*/     store.ERR_PAYMENT_NOT_ALLOWED = ERROR_CODES_BASE + 8;
/*///*/     store.ERR_UNKNOWN             = ERROR_CODES_BASE + 10;
/*///*/     store.ERR_REFRESH_RECEIPTS    = ERROR_CODES_BASE + 11;
/*///*/     store.ERR_INVALID_PRODUCT_ID  = ERROR_CODES_BASE + 12;

}).call(this);
(function() {
'use strict';

/// ## <a name="product"></a>*store.Product* object ##
/// 
/// Some methods, like the [`ask` method](#ask), give you access to a `product`
/// object.

store.Product = function(options) {

    if (!options)
        options = {};

    ///
    /// Products object have the following fields and methods:
    ///

    ///  - `product.id` - Identifier of the product on the store
    this.id = options.id || null;

    ///  - `product.alias` - Alias that can be used for more explicit [queries](#queries)
    this.alias = options.alias || options.id || null;

    ///  - `product.price` - Non-localized price, without the currency
    this.price = options.price || null;

    ///  - `product.currency` - Currency code
    this.currency = options.currency || null;

    ///  - `product.title` - Non-localized name or short description
    this.title = options.title || options.localizedTitle || null;

    ///  - `product.description` - Non-localized longer description
    this.description = options.description || options.localizedDescription || null;

    ///  - `product.localizedTitle` - Localized name or short description ready for display
    this.localizedTitle = options.localizedTitle || options.title || null;

    ///  - `product.localizedDescription` - Localized longer description ready for display
    this.localizedDescription = options.localizedDescription || options.description || null;

    ///  - `product.localizedPrice` - Localized price (with currency) ready for display
    this.localizedPrice = options.localizedPrice || null;

    this.loaded = options.loaded;
    this.valid  = options.valid;
};
///
}).call(this);
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

/// ## <a name="registerProducts"></a>*store.registerProducts(products)*
/// Adds (or register) products into the store. Products can't be used
/// unless registered first!
///
/// Products is an array of object with fields :
///
///  - `id`
///  - `type`
///  - `alias` (optional)
///
/// See documentation for the [product](#product) object for more information.
///
store.registerProducts = function(products) {
    for (var i = 0; i < products.length; ++i) {
        var p = new store.Product(products[i]);
        if (!p.alias)
            p.alias = p.id;
        this.products.push(p);
    }
};
(function(){
'use strict';

/// ## <a name="when"></a>*store.when(query)*
/// 
store.when = function(query, once) {

    /// 
    /// ### return value
    /// 
    /// Return promise with the following methods:
    return {
        ///
        /// #### .*loaded(function (product) {})*
        ///
        /// Called when [product](#product) data is loaded from the store.
        ///
        loaded: function(cb) {
            store._queries.callbacks.add(query, "loaded", cb, once);
            return this;
        },

        ///
        /// #### .*approved(function (order) {})*
        ///
        /// Called when an [order](#order) is approved.
        ///
        approved: function(cb) {
            store._queries.callbacks.add(query, "approved", cb, once);
            return this;
        },

        ///
        /// #### .*rejected(function (order) {})*
        ///
        /// Called when an [order](#order) is rejected.
        ///
        rejected: function(cb) {
            store._queries.callbacks.add(query, "rejected", cb, once);
            return this;
        },

        // Undocumented (NOT USED YET)
        //
        // #### .*updated(function (product) {})*
        //
        // Called when an [order](#order) is rejected.
        //
        updated: function(cb) {
            store._queries.callbacks.add(query, "updated", cb, once);
            return this;
        },

        ///
        /// #### .*cancelled(function (product) {})*
        ///
        /// Called when an [order](#order) is cancelled by the user.
        ///
        cancelled: function(cb) {
            store._queries.callbacks.add(query, "cancelled", cb, once);
            return this;
        },

        ///
        /// #### .*error(function (err) {})*
        ///
        /// Called when an [order](#order) failed.
        ///
        /// The `err` parameter is an [error object](#errors)
        ///
        error: function(cb) {
            store._queries.callbacks.add(query, "error", cb, once);
            return this;
        }
    };
};

/// ## <a name="once"></a>*store.once(query)*
/// 
/// Identical to [`store.when`](#when), but the callback will be called only once.
/// After being called, the callback will be unregistered.
store.once = function(query) {
    return store.when(query, true);
};

}).call(this);
(function(){
'use strict';

/// 
/// ## <a name="ask"></a>*store.ask(productId)* ##
/// 
/// Retrieve informations about a given [product](#products).
/// 
/// If the given product is already loaded, promise callbacks
/// will be called immediately. If not, it will happen as soon
/// as the product is known as valid or invalid.

store.ask = function(pid) {
    var that = this;
    var p = store.products.byId[pid] || store.products.byAlias[pid];
    if (!p) {
        p = new store.Product({
            id: pid,
            loaded: true,
            valid: false
        });
    }
    var skip = false;

    /// 
    /// ### return value
    /// 
    /// Return promise with the following methods:
    return {
 
        /// 
        /// #### .*then(function (product) {})*
        /// 
        /// Called when the product information has been loaded from the store's
        /// servers and known to be valid.
        /// 
        /// `product` contains the fields documented in the [products](#products) section.
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

        /// 
        /// #### .*error(function (err) {})*
        /// 
        /// Called if product information cannot be loaded from the store or
        /// when it is know to be invalid.
        /// 
        /// `err` features the standard [error](#errors) format (`code` and `message`).
        error: function(cb) {
            if (p.loaded && !p.valid) {
                skip = true;
                cb(new store.Error({
                    code: store.ERR_INVALID_PRODUCT_ID,
                    message: "Invalid product"
                }), p);
            }
            else {
                that.once(pid).error(function(err, p) {
                    if (skip) return;
                    if (err.code === store.ERR_LOAD) {
                        skip = true;
                        cb(err, p);
                    }
                });
                that.once(pid).loaded(function(p) {
                    if (skip) return;
                    if (!p.valid) {
                        skip = true;
                        cb(new store.Error({
                            code: store.ERR_INVALID_PRODUCT_ID,
                            message: "Invalid product"
                        }), p);
                    }
                });
            }
            return this;
        }
    };
};
/// 
/// ### example use
/// 
/// ```
/// store.ask("full version").
///     then(function(product) {
///         console.log("product " + product.id + " loaded");
///         console.log("title: " + product.title);
///         console.log("description: " + product.description);
///         console.log("price: " + product.price);
///     }).
///     error(function(error) {
///         console.log("failed to load product");
///         console.log("ERROR " + error.code + ": " + error.message);
///     });
/// ```
}).call(this);
(function() {

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

})();

///
/// # internal APIs
/// USE AT YOUR OWN RISKS

/// ## *store.products* array ##
/// Array of all registered products
///
/// #### example
///
///     store.products[0]
store.products = [];

/// ### *store.products.push(product)*
/// Acts like the Array `push` method, but also adds
/// the product to the [byId](#byId) and [byAlias](#byAlias) objects.
store.products.push = function(p) {
    Array.prototype.push.call(this, p);
    this.byId[p.id] = p;
    this.byAlias[p.alias] = p;
};

/// ### <a name="byId"></a>*store.products.byId* dictionary
/// Registered products indexed by their ID
///
/// #### example
///
///     store.products.byId["cc.fovea.inapp1"]
store.products.byId = {};

/// ### <a name="byAlias"></a>*store.products.byAlias* dictionary
/// Registered products indexed by their alias
///
/// #### example
///
///     store.products.byAlias["full version"]```
store.products.byAlias = {};

(function(){
'use strict';

///
/// ## queries
///
/// The [`when`](#when) and [`once`](#once) methods take a `query` parameter.
/// Those queries allow to select part of the products (or orders) registered
/// into the store and get notified of events related to those products.
///
/// #### example
///
///  - `"consumable order"` - all consumable products
///  - `"full version"` - the `alias` of a registered [`product`](#product)
///  - `"order cc.fovea.inapp1"` - the `id` of a registered [`product`](#product)
///  - `"invalid product"` - an invalid product
/// 
/// ## *store._queries* object
/// The `queries` object handles the callbacks registered for any given couple
/// of [query](#queries) and action.
///
/// Internally, the magic is found within the [`triggerWhenProduct`](#triggerWhenProduct)
/// method, which generates for a given product the list of all possible
/// queries that describe the product.
///
/// Queries are generated using the id, alias, type or validity of the product.
///
store._queries = {

    /// ### *store._queries.uniqueQuery(string)*
    /// Transform a human readable query string
    /// into a unique string by filtering out reserved keywords:
    ///
    ///  - `order`
    ///  - `product`
    ///
    uniqueQuery: function(string) {
        if (!string)
            return '';
        var query = '';
        var tokens = string.split(' ');
        for (var i = 0; i < tokens.length; ++i) {
            var token = tokens[i];
            if (token !== 'order' && token !== 'product') {
                if (query !== '')
                    query += ' ';
                query += tokens[i];
            }
        }
        return query;
    },

    /// ### *store._queries.callbacks* object
    /// Callbacks registered organized by query strings

    callbacks: {
        /// #### *store._queries.callbacks.byQuery* dictionary
        /// Dictionary of:
        /// 
        ///  - *key*: a string equals to `query + " " + action`
        ///  - *value*: array of callbacks
        ///
        /// Each callback have the following attributes:
        ///
        ///  - `cb`: callback *function*
        ///  - `once`: *true* iff the callback should be called only once, then removed from the dictionary.
        ///
        byQuery: {},

        /// #### *store._queries.callbacks.add(query, action, callback, once)*
        /// Simplify the query with `uniqueQuery()`, then add it to the dictionary.
        /// 
        /// `action` is concatenated to the `query` string to create the key.
        add: function(query, action, cb, once) {
            var fullQuery = store._queries.uniqueQuery(query ? query + " " + action : action);
            if (this.byQuery[fullQuery])
                this.byQuery[fullQuery].push({cb:cb, once:once});
            else
                this.byQuery[fullQuery] = [{cb:cb, once:once}];
        }
    },

    /// ### *store._queries.triggerWhenProduct(product, action, args)*
    /// Trigger the callbacks registered when a given `action` (string)
    /// happens to a given [`product`](#product).
    ///
    /// `args` are passed as arguments to the registered callbacks.
    ///
    triggerWhenProduct: function(product, action, args) {

        /// The method generates all possible queries for the given `product` and `action`.
        var queries = [];

        /// 
        ///  - product.id + " " + action
        if (product && product.id)
            queries.push(product.id + " " + action);
        ///  - product.alias + " " + action
        if (product && product.alias)
            queries.push(product.alias + " " + action);
        ///  - product.type + " " + action
        if (product && product.type)
            queries.push(product.type + " " + action);
        ///  - "subscription " + action (if type is a subscription)
        if (product && product.type && (product.type === store.FREE_SUBSCRIPTION || product.type === store.PAID_SUBSCRIPTION))
            queries.push("subscription " + action);
        ///  - "valid " + action (if product is valid)
        if (product && product.valid === true)
            queries.push("valid " + action);
        ///  - "invalid " + action (if product is invalid)
        if (product && product.valid === false)
            queries.push("invalid " + action);
        ///  - action
        queries.push(action);
    
        // Return true if a callback should be called more than once.
        var isNotOnce = function(cb) {
            return !cb.once;
        };

        ///
        /// Then, for each query:
        ///
        var i;
        for (i = 0; i < queries.length; ++i) {
            var q = queries[i];
            var cbs = store._queries.callbacks.byQuery[q];
            if (cbs) {
                ///  - Call the callbacks
                for (var j = 0; j < cbs.length; ++j) {
                    cbs[j].cb.apply(store, args);
                }
                ///  - Remove callbacks that needed to be called only once
                store._queries.callbacks.byQuery[q] = cbs.filter(isNotOnce);
            }
        }
    }
    ///
};

}).call(this);
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
    for (var i = 0; i < this.length; ++i)
        this[i].call(store, error);
};

///
/// ### *store.error.callbacks.reset()*
///
/// Remove all error callbacks.
store.error.callbacks.reset = function() {
    while (this.length > 0)
        this.shift();
};

}).call(this);

store.order = function(product) {
};

store.refresh = function(query) {
};

module.exports = store;

