(function() {
"use strict";

/// ## <a name="get"></a>*store.get(id)*
/// Retrieve a [product](#product) from its `id` or `alias`.
///
/// ##### example usage
//
/// ```js
///     var product = store.get("cc.fovea.product1");
/// ```
///
store.get = function(id) {
    var product = store.products.byId[id] || store.products.byAlias[id];
    return product;
};

})();
