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
