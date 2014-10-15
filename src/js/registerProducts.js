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

        // Check if id or alias contain filtered-out keywords
        if (p.id !== store._queries.uniqueQuery(p.id))
            continue;
        if (p.alias !== store._queries.uniqueQuery(p.alias))
            continue;

        this.products.push(p);
    }
};
