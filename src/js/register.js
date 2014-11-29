(function() {
"use strict";

/// ## <a name="register"></a>*store.register(product)*
/// Add (or register) a product into the store.
///
/// A product can't be used unless registered first!
///
/// Product is an object with fields :
///
///  - `id`
///  - `type`
///  - `alias` (optional)
///
/// See documentation for the [product](#product) object for more information.
///
store.register = function(product) {
    if (!product)
        return;
    if (!product.length)
        store.register([product]);
    else
        registerProducts(product);
};

/// ##### example usage
///
/// ```js
/// store.register({
///     id: "cc.fovea.inapp1",
///     alias: "full version",
///     type: store.NON_CONSUMABLE
/// });
/// ```
///

// ## <a name="registerProducts"></a>*registerProducts(products)*
// Adds (or register) products into the store. Products can't be used
// unless registered first!
//
// Products is an array of object with fields :
//
//  - `id`
//  - `type`
//  - `alias` (optional)
//
// See documentation for the [product](#product) object for more information.
function registerProducts(products) {
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

        store.products.push(p);
    }
}

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

})();
