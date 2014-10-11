//api: 
//api: ## store.ask(productId)
//api: 
//api: Retrieve informations about a given product.
//api: 
//api: If the given product is already loaded, promise callbacks
//api: will be called immediately. If not, it will happen as soon
//api: as the product is known as valid or invalid.
//api: 
//api: ### return value
//api: 
//api: Return promise with the following methods:
//api:     - then
//api:     - error
//api: 
//api: #### then(function (product) {})
//api: 
//api: 
//api: #### error(function (err) {})
//api: 
//api: 
//api: ### example use
//api: 
//api: ```
//api: store.ask("full version").
//api:     then(function(product) {
//api:         console.log("product " + product.id + " loaded");
//api:         console.log("title: " + product.title);
//api:         console.log("description: " + product.description);
//api:         console.log("price: " + product.price);
//api:     }).
//api:     error(function(error) {
//api:         console.log("failed to load product");
//api:         console.log("ERROR " + error.code + ": " + error.message);
//api:     });
//api: ```

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
