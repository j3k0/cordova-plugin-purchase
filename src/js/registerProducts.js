(function() {
"use strict";

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
store.registerProducts = function(products) {
    for (var i = 0; i < products.length; ++i) {
        products[i].state = store.REGISTERED;
        var p = new store.Product(products[i]);
        if (!p.alias)
            p.alias = p.id;

        // Check if id or alias contain filtered-out keywords
        if (p.id !== store._queries.uniqueQuery(p.id))
            continue;
        if (p.alias !== store._queries.uniqueQuery(p.alias))
            continue;

        if (hasKeyword(p.id) || hasKeyword(p.alias))
            continue;

        this.products.push(p);
    }
};

///
/// ### Reserved keywords
/// Some reserved keywords can't be used in the product `id` and `alias`:
var keywords = [      ///
    'product',        ///  - `product`
    'order',          ///  - `order`
    store.REGISTERED, ///  - `registered`
    store.VALID,      ///  - `valid`
    store.INVALID,    ///  - `invalid`
    store.REQUESTED,  ///  - `requested`
    store.INITIATED,  ///  - `initiated`
    store.APPROVED,   ///  - `approved`
    store.OWNED,      ///  - `owned`
    store.FINISHED,   ///  - `finished`
    'refreshed'       ///  - `refreshed`
];                    ///

function hasKeyword(string) {
    if (!string)
        return false;
    var tokens = string.split(' ');
    for (var i = 0; i < tokens.length; ++i) {
        var token = tokens[i];
        for (var j = 0; j < keywords.length; ++j) {
            if (token === keywords[j])
                return true;
        }
    }
    return false;
}

}).call(this);
