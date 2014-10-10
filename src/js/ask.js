// Retrieve informations about a given product.
// If the given product is already loaded, promise callbacks
// will be called immediately. If not, it will happen as soon
// as the product is known as valid or invalid.
var ask = store.ask = function(product) {
    var that = this;
    var p = this.productsById[product] || this.productsByAlias[product];
    var skip = false;

    return {

        // then: register a callback that'll be called when the product
        // is loaded and known to be valid.
        then: function(cb) {
            if (p.loaded && p.valid)
                cb(p);
            else
                that.once(product, "loaded", function(p) {
                    if (skip) return;
                    skip = true;
                    if (p.valid)
                        cb(p);
                });
            return this;
        },

        // then: register a callback that'll be called when the product
        // is loaded and known to be invalid. Or when loading of the
        // product information was impossible.
        error: function(cb) {
            if (p.loaded && !p.valid)
                cb(p);
            else {
                that.once(product, store.ERR_PRODUCT_NOT_LOADED, function(err) {
                    if (skip) return;
                    skip = true;
                    cb(err);
                });
                that.once(product, "loaded", function(p) {
                    if (skip) return;
                    skip = true;
                    if (!p.valid)
                        cb({
                            code: store.ERR_INVALID_PRODUCT_ID,
                            message: "Invalid product ID"
                        });
                });
            }
            return this;
        }
    };
};
