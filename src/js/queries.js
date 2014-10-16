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
    uniqueQuery: function(string) {
        if (!string)
            return '';
        var query = '';
        var tokens = string.split(' ');
        for (var i = 0; i < tokens.length; ++i) {
            var token = tokens[i];
            if (token !== 'order' &&   ///  - `order`
                token !== 'product') { ///  - `product`
                if (query !== '')
                    query += ' ';
                query += token;
            }
            ///
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
            store.log.debug("store.queries ++ '" + fullQuery + "'");
        },

        unregister: function(cb) {
            var keep = function(o) {
                return o.cb !== cb;
            };
            for (var i in this.byQuery)
                this.byQuery[i] = this.byQuery[i].filter(keep);
        }
    },

    /// ### *store._queries.triggerAction(action, args)*
    /// Trigger the callbacks registered when a given `action` (string)
    /// happens, unrelated to a product.
    ///
    /// `args` are passed as arguments to the registered callbacks.
    ///
    triggerAction: function(action, args) {

        var cbs = store._queries.callbacks.byQuery[action];
        store.log.debug("store.queries !! '" + action + "'");
        if (cbs) {
            ///  - Call the callbacks
            for (var j = 0; j < cbs.length; ++j) {
                cbs[j].cb.apply(store, args);
            }
            ///  - Remove callbacks that needed to be called only once
            store._queries.callbacks.byQuery[action] = cbs.filter(isNotOnce);
        }
        ///
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
        if (product && product.alias && product.alias != product.id)
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
    
        ///
        /// Then, for each query:
        ///
        var i;
        for (i = 0; i < queries.length; ++i) {
            var q = queries[i];
            store.log.debug("store.queries !! '" + q + "'");
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
        
        ///
        /// **Note**: All events also trigger the `updated` event
        if (action !== "updated")
            this.triggerWhenProduct(product, "updated", args);
    }
    ///
  
};

// isNotOnce return true iff a callback should be called more than once.
function isNotOnce(cb) {
    return !cb.once;
}

}).call(this);
