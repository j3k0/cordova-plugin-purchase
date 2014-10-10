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
