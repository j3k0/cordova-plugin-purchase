/// 
/// ## <a name="ask"></a>`store.ask(productId)` ##
/// 
/// Retrieve informations about a given [product](#products).
/// 
/// If the given product is already loaded, promise callbacks
/// will be called immediately. If not, it will happen as soon
/// as the product is known as valid or invalid.

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

    /// 
    /// ### return value
    /// 
    /// Return promise with the following methods:
    return {
 
        /// 
        /// #### then(function (product) {})
        /// 
        /// Called when the product information has been loaded from the store's
        /// servers and known to be valid.
        /// 
        /// `product` contains the fields documented in the [products](#products) section.
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

        /// 
        /// #### error(function (err) {})
        /// 
        /// Called if product information cannot be loaded from the store or
        /// when it is know to be invalid.
        /// 
        /// `err` features the standard [error](#errors) format (`code` and `message`).
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
/// 
/// ### example use
/// 
/// ```
/// store.ask("full version").
///     then(function(product) {
///         console.log("product " + product.id + " loaded");
///         console.log("title: " + product.title);
///         console.log("description: " + product.description);
///         console.log("price: " + product.price);
///     }).
///     error(function(error) {
///         console.log("failed to load product");
///         console.log("ERROR " + error.code + ": " + error.message);
///     });
/// ```
