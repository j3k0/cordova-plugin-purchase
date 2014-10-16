var store = {};

store.debug = 0;

(function() {
    "use strict";
    store.FREE_SUBSCRIPTION = "free subscription";
    store.PAID_SUBSCRIPTION = "paid subscription";
    store.CONSUMABLE = "consumable";
    store.NON_CONSUMABLE = "non consumable";
    var ERROR_CODES_BASE = 4983497;
    store.ERR_SETUP = ERROR_CODES_BASE + 1;
    store.ERR_LOAD = ERROR_CODES_BASE + 2;
    store.ERR_PURCHASE = ERROR_CODES_BASE + 3;
    store.ERR_LOAD_RECEIPTS = ERROR_CODES_BASE + 4;
    store.ERR_CLIENT_INVALID = ERROR_CODES_BASE + 5;
    store.ERR_PAYMENT_CANCELLED = ERROR_CODES_BASE + 6;
    store.ERR_PAYMENT_INVALID = ERROR_CODES_BASE + 7;
    store.ERR_PAYMENT_NOT_ALLOWED = ERROR_CODES_BASE + 8;
    store.ERR_UNKNOWN = ERROR_CODES_BASE + 10;
    store.ERR_REFRESH_RECEIPTS = ERROR_CODES_BASE + 11;
    store.ERR_INVALID_PRODUCT_ID = ERROR_CODES_BASE + 12;
    store.REGISTERED = "registered";
    store.INVALID = "invalid";
    store.VALID = "valid";
    store.REQUESTED = "requested";
    store.INITIATED = "initiated";
    store.APPROVED = "approved";
    store.FINISHED = "finished";
    store.OWNED = "owned";
    store.ERROR = 1;
    store.WARNING = 2;
    store.INFO = 3;
    store.DEBUG = 4;
}).call(this);

(function() {
    "use strict";
    store.Product = function(options) {
        if (!options) options = {};
        this.id = options.id || null;
        this.alias = options.alias || options.id || null;
        this.type = options.type || null;
        this.price = options.price || null;
        this.currency = options.currency || null;
        this.title = options.title || options.localizedTitle || null;
        this.description = options.description || options.localizedDescription || null;
        this.localizedTitle = options.localizedTitle || options.title || null;
        this.localizedDescription = options.localizedDescription || options.description || null;
        this.localizedPrice = options.localizedPrice || null;
        this.loaded = options.loaded;
        this.valid = options.valid;
        this.canPurchase = options.canPurchase;
        this.state = options.state || "";
        this.stateChanged();
    };
    store.Product.prototype.finish = function() {
        store.log.debug("product -> defer finishing " + this.id);
        defer(this, function() {
            store.log.debug("product -> finishing " + this.id);
            if (this.state !== store.FINISHED) {
                this.set("state", store.FINISHED);
                defer(this, function() {
                    store.log.debug("product -> " + this.id + " is a " + this.type);
                    if (this.type === store.CONSUMABLE) this.set("state", store.VALID); else this.set("state", store.OWNED);
                });
            }
        });
    };
    function defer(thisArg, cb) {
        window.setTimeout(function() {
            cb.call(thisArg);
        }, 1);
    }
}).call(this);

(function() {
    "use strict";
    store.Error = function(options) {
        if (!options) options = {};
        this.code = options.code || store.ERR_UNKNOWN;
        this.message = options.message || "unknown error";
    };
    store.error = function(cb) {
        if (cb instanceof store.Error) store.error.callbacks.trigger(cb); else if (cb.code && cb.message) store.error.callbacks.trigger(new store.Error(cb)); else store.error.callbacks.push(cb);
    };
    store.error.unregister = function(cb) {
        store.error.callbacks.unregister(cb);
    };
}).call(this);

(function() {
    "use strict";
    store.registerProducts = function(products) {
        for (var i = 0; i < products.length; ++i) {
            products[i].state = store.REGISTERED;
            var p = new store.Product(products[i]);
            if (!p.alias) p.alias = p.id;
            if (p.id !== store._queries.uniqueQuery(p.id)) continue;
            if (p.alias !== store._queries.uniqueQuery(p.alias)) continue;
            if (hasKeyword(p.id) || hasKeyword(p.alias)) continue;
            this.products.push(p);
        }
    };
    var keywords = [ "product", "order", store.REGISTERED, store.VALID, store.INVALID, store.REQUESTED, store.INITIATED, store.APPROVED, store.OWNED, store.FINISHED, "refreshed" ];
    function hasKeyword(string) {
        if (!string) return false;
        var tokens = string.split(" ");
        for (var i = 0; i < tokens.length; ++i) {
            var token = tokens[i];
            for (var j = 0; j < keywords.length; ++j) {
                if (token === keywords[j]) return true;
            }
        }
        return false;
    }
}).call(this);

(function() {
    "use strict";
    store.get = function(id) {
        var product = store.products.byId[id] || store.products.byAlias[id];
        return product;
    };
}).call(this);

(function() {
    "use strict";
    store.when = function(query, once, callback) {
        if (typeof query === "object" && query instanceof store.Product) query = query.id;
        if (typeof once === "function") {
            return store.when("", query, once);
        } else if (typeof once !== "string") {
            return {
                loaded: function(cb) {
                    store._queries.callbacks.add(query, "loaded", cb, once);
                    return this;
                },
                approved: function(cb) {
                    store._queries.callbacks.add(query, "approved", cb, once);
                    return this;
                },
                rejected: function(cb) {
                    store._queries.callbacks.add(query, "rejected", cb, once);
                    return this;
                },
                updated: function(cb) {
                    store._queries.callbacks.add(query, "updated", cb, once);
                    return this;
                },
                cancelled: function(cb) {
                    store._queries.callbacks.add(query, "cancelled", cb, once);
                    return this;
                },
                error: function(cb) {
                    store._queries.callbacks.add(query, "error", cb, once);
                    return this;
                }
            };
        } else {
            var action = once;
            store._queries.callbacks.add(query, action, callback);
        }
    };
    store.once = function(query, action, callback) {
        if (typeof action !== "string") {
            return store.when(query, true);
        } else {
            store._queries.callbacks.add(query, action, callback, true);
        }
    };
    store.when.unregister = store.once.unregister = function(cb) {
        store._queries.callbacks.unregister(cb);
    };
}).call(this);

(function() {
    "use strict";
    var callbacks = {};
    var callbackId = 0;
    store.order = function(pid) {
        var that = this;
        var p = pid;
        if (typeof pid === "string") {
            p = store.products.byId[pid] || store.products.byAlias[pid];
            if (!p) {
                p = new store.Product({
                    id: pid,
                    loaded: true,
                    valid: false
                });
            }
        }
        var localCallbackId = callbackId++;
        var localCallback = callbacks[localCallbackId] = {};
        function done() {
            delete localCallback.initiated;
            delete localCallback.error;
            delete callbacks[localCallbackId];
        }
        store.ready(function() {
            p.set("state", store.REQUESTED);
        });
        return {
            initiated: function(cb) {
                localCallback.initiated = cb;
                store.once(p.id, "initiated", function() {
                    if (!localCallback.then) return;
                    done();
                    cb(p);
                });
                return this;
            },
            error: function(cb) {
                localCallback.error = cb;
                store.once(p.id, "error", function(err) {
                    if (!localCallback.error) return;
                    done();
                    cb(p);
                });
                return this;
            }
        };
    };
    store.order.unregister = function(cb) {
        for (var i in callbacks) {
            if (callbacks[i].initiated === cb) delete callbacks[i].initiated;
            if (callbacks[i].error === cb) delete callbacks[i].error;
        }
    };
}).call(this);

(function() {
    "use strict";
    var callbacks = {};
    var callbackId = 0;
    store.ask = function(pid) {
        var that = this;
        var p = store.products.byId[pid] || store.products.byAlias[pid];
        if (!p) {
            p = new store.Product({
                id: pid,
                state: store.INVALID,
                loaded: true,
                valid: false
            });
        }
        var localCallbackId = callbackId++;
        var localCallback = callbacks[localCallbackId] = {
            skip: false
        };
        function done() {
            localCallback.skip = true;
            delete localCallback.then;
            delete localCallback.error;
            delete callbacks[localCallbackId];
        }
        return {
            then: function(cb) {
                if (p.loaded && p.valid) {
                    done();
                    cb(p);
                } else {
                    localCallback.then = cb;
                    p.once(store.VALID, function(p) {
                        if (localCallback.skip) return;
                        if (localCallback.then) {
                            done();
                            cb(p);
                        } else {
                            done();
                        }
                    });
                }
                return this;
            },
            error: function(cb) {
                if (p.state === store.INVALID) {
                    done();
                    cb(new store.Error({
                        code: store.ERR_INVALID_PRODUCT_ID,
                        message: "Invalid product"
                    }), p);
                } else {
                    localCallback.error = cb;
                    that.once(pid).error(function(err, p) {
                        if (localCallback.skip) return;
                        if (err.code === store.ERR_LOAD) {
                            if (localCallback.error) {
                                done();
                                cb(err, p);
                            } else {
                                done();
                            }
                        }
                    });
                    that.once(pid, store.INVALID, function(p) {
                        if (localCallback.skip) return;
                        if (localCallback.error) {
                            done();
                            cb(new store.Error({
                                code: store.ERR_INVALID_PRODUCT_ID,
                                message: "Invalid product"
                            }), p);
                        } else {
                            done();
                        }
                    });
                }
                return this;
            }
        };
    };
    store.ask.unregister = function(cb) {
        for (var i in callbacks) {
            if (callbacks[i].then === cb) delete callbacks[i].then;
            if (callbacks[i].error === cb) delete callbacks[i].error;
        }
    };
}).call(this);

(function() {
    "use strict";
    var isReady = false;
    var callbacks = [];
    store.ready = function(cb) {
        if (cb === true) {
            if (isReady) return this;
            isReady = true;
            for (var i = 0; i < callbacks.length; ++i) callbacks[i].call(this);
            callbacks = [];
        } else if (cb) {
            if (isReady) {
                setTimeout(cb, 0);
                return this;
            } else {
                callbacks.push(cb);
            }
        } else {
            return isReady;
        }
        return this;
    };
    store.ready.unregister = function(cb) {
        callbacks = callbacks.filter(function(o) {
            return o !== cb;
        });
    };
}).call(this);

(function() {
    "use strict";
    store.off = function(callback) {
        store.ready.unregister(callback);
        store.ask.unregister(callback);
        store.when.unregister(callback);
        store.order.unregister(callback);
        store.error.unregister(callback);
    };
}).call(this);

store.refresh = function() {
    store.trigger("refreshed");
};

store.restore = null;

(function() {
    "use strict";
    function log(level, o) {
        var maxLevel = store.debug === true ? 1 : store.debug;
        if (level > maxLevel) return;
        if (typeof o !== "string") o = JSON.stringify(o);
        console.log("[store.js] " + o);
    }
    store.log = {
        error: function(o) {
            log(store.ERROR, o);
        },
        warn: function(o) {
            log(store.WARNING, o);
        },
        info: function(o) {
            log(store.INFO, o);
        },
        debug: function(o) {
            log(store.DEBUG, o);
        }
    };
}).call(this);

(function() {
    "use strict";
    store.products = [];
    store.products.push = function(p) {
        Array.prototype.push.call(this, p);
        this.byId[p.id] = p;
        this.byAlias[p.alias] = p;
    };
    store.products.byId = {};
    store.products.byAlias = {};
}).call(this);

(function() {
    "use strict";
    store.Product.prototype.set = function(key, value) {
        if (typeof key === "string") {
            this[key] = value;
            if (key === "state") this.stateChanged();
        } else {
            var options = key;
            for (key in options) {
                value = options[key];
                this.set(key, value);
            }
        }
    };
    store.Product.prototype.stateChanged = function() {
        this.canPurchase = this.state === store.VALID;
        this.loaded = this.state && this.state !== store.REGISTERED;
        this.valid = this.state !== store.INVALID;
        if (!this.state || this.state === store.REGISTERED) delete this.valid;
        if (this.state) this.trigger(this.state);
    };
    store.Product.prototype.on = function(event, cb) {
        store.when(this.id, event, cb);
    };
    store.Product.prototype.once = function(event, cb) {
        store.once(this.id, event, cb);
    };
    store.Product.prototype.off = function(cb) {
        store.when.unregister(cb);
    };
    store.Product.prototype.trigger = function(action, args) {
        store.trigger(this, action, args);
    };
}).call(this);

(function() {
    "use strict";
    store._queries = {
        uniqueQuery: function(string) {
            if (!string) return "";
            var query = "";
            var tokens = string.split(" ");
            for (var i = 0; i < tokens.length; ++i) {
                var token = tokens[i];
                if (token !== "order" && token !== "product") {
                    if (query !== "") query += " ";
                    query += token;
                }
            }
            return query;
        },
        callbacks: {
            byQuery: {},
            add: function(query, action, cb, once) {
                var fullQuery = store._queries.uniqueQuery(query ? query + " " + action : action);
                if (this.byQuery[fullQuery]) this.byQuery[fullQuery].push({
                    cb: cb,
                    once: once
                }); else this.byQuery[fullQuery] = [ {
                    cb: cb,
                    once: once
                } ];
                store.log.debug("queries ++ '" + fullQuery + "'");
            },
            unregister: function(cb) {
                var keep = function(o) {
                    return o.cb !== cb;
                };
                for (var i in this.byQuery) this.byQuery[i] = this.byQuery[i].filter(keep);
            }
        },
        triggerAction: function(action, args) {
            var cbs = store._queries.callbacks.byQuery[action];
            store.log.debug("queries !! '" + action + "'");
            if (cbs) {
                for (var j = 0; j < cbs.length; ++j) {
                    try {
                        cbs[j].cb.apply(store, args);
                    } catch (err) {
                        handleCallbackError(action, err);
                    }
                }
                store._queries.callbacks.byQuery[action] = cbs.filter(isNotOnce);
            }
        },
        triggerWhenProduct: function(product, action, args) {
            var queries = [];
            if (product && product.id) queries.push(product.id + " " + action);
            if (product && product.alias && product.alias != product.id) queries.push(product.alias + " " + action);
            if (product && product.type) queries.push(product.type + " " + action);
            if (product && product.type && (product.type === store.FREE_SUBSCRIPTION || product.type === store.PAID_SUBSCRIPTION)) queries.push("subscription " + action);
            if (product && product.valid === true) queries.push("valid " + action);
            if (product && product.valid === false) queries.push("invalid " + action);
            queries.push(action);
            var i;
            for (i = 0; i < queries.length; ++i) {
                var q = queries[i];
                store.log.debug("store.queries !! '" + q + "'");
                var cbs = store._queries.callbacks.byQuery[q];
                if (cbs) {
                    for (var j = 0; j < cbs.length; ++j) {
                        try {
                            cbs[j].cb.apply(store, args);
                        } catch (err) {
                            handleCallbackError(q, err);
                        }
                    }
                    store._queries.callbacks.byQuery[q] = cbs.filter(isNotOnce);
                }
            }
            if (action !== "updated") this.triggerWhenProduct(product, "updated", args);
        }
    };
    function isNotOnce(cb) {
        return !cb.once;
    }
    function handleCallbackError(query, err) {
        store.log.warn("queries -> a callback for '" + query + "' failed with an exception.");
        if (typeof err === "string") store.log.warn("           " + err); else if (err) {
            if (err.fileName) store.log.warn("           " + err.fileName + ":" + err.lineNumber);
            if (err.message) store.log.warn("           " + err.message);
            if (err.stack) store.log.warn("           " + err.stack);
        }
    }
}).call(this);

(function() {
    "use strict";
    store.trigger = function(product, action, args) {
        if (!action && !args && typeof product === "string") {
            store.log.debug("store.trigger -> triggering action " + product);
            store._queries.triggerAction(product);
            return;
        }
        if (typeof product === "string") {
            product = store.get(product);
            if (!product) return;
        }
        if (typeof args !== "undefined" && (typeof args !== "object" || typeof args.length !== "number")) {
            args = [ args ];
        }
        if (typeof args === "undefined") {
            args = [ product ];
        }
        store._queries.triggerWhenProduct(product, action, args);
    };
}).call(this);

(function() {
    "use strict";
    store.error.callbacks = [];
    store.error.callbacks.trigger = function(error) {
        for (var i = 0; i < this.length; ++i) this[i].call(store, error);
    };
    store.error.callbacks.reset = function() {
        while (this.length > 0) this.shift();
    };
    store.error.callbacks.unregister = function(cb) {
        var newArray = this.filter(function(o) {
            return o !== cb;
        });
        if (newArray.length < this.length) {
            this.reset();
            for (var i = 0; i < newArray.length; ++i) this.push(newArray[i]);
        }
    };
}).call(this);

(function() {
    "use strict";
    var noop = function() {};
    var InAppBilling = function() {
        this.options = {};
    };
    var ERROR_CODES_BASE = 4983497;
    InAppBilling.prototype.ERR_NO_ERROR = ERROR_CODES_BASE;
    InAppBilling.prototype.ERR_SETUP = ERROR_CODES_BASE + 1;
    InAppBilling.prototype.ERR_LOAD = ERROR_CODES_BASE + 2;
    InAppBilling.prototype.ERR_PURCHASE = ERROR_CODES_BASE + 3;
    InAppBilling.prototype.ERR_LOAD_RECEIPTS = ERROR_CODES_BASE + 4;
    InAppBilling.prototype.ERR_CLIENT_INVALID = ERROR_CODES_BASE + 5;
    InAppBilling.prototype.ERR_PAYMENT_CANCELLED = ERROR_CODES_BASE + 6;
    InAppBilling.prototype.ERR_PAYMENT_INVALID = ERROR_CODES_BASE + 7;
    InAppBilling.prototype.ERR_PAYMENT_NOT_ALLOWED = ERROR_CODES_BASE + 8;
    InAppBilling.prototype.ERR_UNKNOWN = ERROR_CODES_BASE + 10;
    InAppBilling.prototype.ERR_LOAD_INVENTORY = ERROR_CODES_BASE + 11;
    InAppBilling.prototype.ERR_HELPER_DISPOSED = ERROR_CODES_BASE + 12;
    InAppBilling.prototype.ERR_NOT_INITIALIZED = ERROR_CODES_BASE + 13;
    InAppBilling.prototype.ERR_INVENTORY_NOT_LOADED = ERROR_CODES_BASE + 14;
    InAppBilling.prototype.ERR_PURCHASE_FAILED = ERROR_CODES_BASE + 15;
    InAppBilling.prototype.ERR_JSON_CONVERSION_FAILED = ERROR_CODES_BASE + 16;
    InAppBilling.prototype.ERR_INVALID_PURCHASE_PAYLOAD = ERROR_CODES_BASE + 17;
    InAppBilling.prototype.ERR_SUBSCRIPTION_NOT_SUPPORTED = ERROR_CODES_BASE + 18;
    InAppBilling.prototype.ERR_CONSUME_NOT_OWNED_ITEM = ERROR_CODES_BASE + 19;
    InAppBilling.prototype.ERR_CONSUMPTION_FAILED = ERROR_CODES_BASE + 20;
    InAppBilling.prototype.ERR_PRODUCT_NOT_LOADED = ERROR_CODES_BASE + 21;
    InAppBilling.prototype.ERR_INVALID_PRODUCT_ID = ERROR_CODES_BASE + 22;
    InAppBilling.prototype.ERR_INVALID_PURCHASE_ID = ERROR_CODES_BASE + 23;
    InAppBilling.prototype.ERR_PURCHASE_OWNED_ITEM = ERROR_CODES_BASE + 24;
    InAppBilling.prototype.log = function(msg) {
        console.log("InAppBilling[js]: " + msg);
    };
    InAppBilling.prototype.init = function(success, fail, options, productIds) {
        if (!options) options = {};
        this.options = {
            showLog: options.showLog || false
        };
        if (this.options.showLog === true) {
            this.log = InAppBilling.prototype.log;
        } else {
            this.log = noop;
        }
        this.log("init called!");
        var hasProductIds = false;
        if (typeof productIds !== "undefined") {
            if (typeof productIds === "string") {
                productIds = [ productIds ];
            }
            if (productIds.length > 0) {
                if (typeof productIds[0] !== "string") {
                    var msg = "invalid productIds: " + JSON.stringify(productIds);
                    this.log(msg);
                    fail({
                        errorCode: this.ERR_INVALID_PRODUCT_ID,
                        msg: msg,
                        nativeEvent: {}
                    });
                    return;
                }
                this.log("load " + JSON.stringify(productIds));
                hasProductIds = true;
            }
        }
        if (hasProductIds) {
            return cordova.exec(success, fail, "InAppBillingPlugin", "init", [ productIds, this.options.showLog ]);
        } else {
            return cordova.exec(success, fail, "InAppBillingPlugin", "init", [ [], this.options.showLog ]);
        }
    };
    InAppBilling.prototype.getPurchases = function(success, fail) {
        this.log("getPurchases called!");
        return cordova.exec(success, fail, "InAppBillingPlugin", "getPurchases", [ "null" ]);
    };
    InAppBilling.prototype.buy = function(success, fail, productId) {
        this.log("buy called!");
        return cordova.exec(success, fail, "InAppBillingPlugin", "buy", [ productId ]);
    };
    InAppBilling.prototype.restore = function(success, fail) {
        this.log("restore called!");
        cordova.exec(success, fail, "InAppBillingPlugin", "restoreCompletedTransactions", []);
    };
    InAppBilling.prototype.consumeProduct = function(success, fail, productId) {
        this.log("consumeProduct called!");
        return cordova.exec(success, fail, "InAppBillingPlugin", "consumeProduct", [ productId ]);
    };
    InAppBilling.prototype.loadProductDetails = function(success, fail, productIds) {
        this.log("loadProductDetails called!");
        if (typeof productIds === "string") {
            productIds = [ productIds ];
        }
        if (!productIds.length) {
            return;
        } else {
            if (typeof productIds[0] !== "string") {
                var msg = "invalid productIds: " + JSON.stringify(productIds);
                this.log(msg);
                fail({
                    errorCode: this.ERR_INVALID_PRODUCT_ID,
                    msg: msg,
                    nativeEvent: {}
                });
                return;
            }
            this.log("load " + JSON.stringify(productIds));
            return cordova.exec(success, fail, "InAppBillingPlugin", "loadProductDetails", [ productIds ]);
        }
    };
    InAppBilling.prototype.getPurchaseDetails = function(success, fail, purchaseId) {
        this.log("loadProductDetails called!");
        return cordova.exec(success, fail, "InAppBillingPlugin", "getPurchaseDetails", [ purchaseId ]);
    };
    window.inappbilling = store.android = new InAppBilling();
}).call(this);

(function() {
    "use strict";
    var initialized = false;
    var init = function() {
        if (initialized) return;
        initialized = true;
        var products = [];
        for (var i = 0; i < store.products.length; ++i) products.push(store.products[i].id);
        store.android.init(iabReady, iabError, {
            showLog: store.debug ? true : false
        }, products);
    };
    var iabReady = function() {
        console.log("ready");
        store.android.loadProductDetails(iabLoaded, iabError, products);
        function iabLoaded(validProducts) {
            console.log("loaded");
            var p, i;
            for (i = 0; i < validProducts.length; ++i) {
                p = store.products.byId[validProducts[i].id];
                p.loaded = true;
                p.valid = true;
                p.title = validProducts[i].title;
                p.price = validProducts[i].price;
                p.currency = validProducts[i].currencyCode;
                p.description = validProducts[i].description;
                store._queries.triggerWhenProduct(p, "loaded", [ p ]);
            }
            for (i = 0; i < products.length; ++i) {
                p = store.products.byId[products[i]];
                if (!p.valid) {
                    p.loaded = true;
                    p.valid = false;
                    store._queries.triggerWhenProduct(p, "loaded", [ p ]);
                }
            }
            store.ready(true);
        }
    };
    var iabError = function(err) {
        store.log.error(JSON.stringify(err));
    };
    store.when("refreshed", function() {
        if (!initialized) init();
    });
}).call(this);

if (window) {
    window.store = store;
}

module.exports = store;