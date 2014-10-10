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
