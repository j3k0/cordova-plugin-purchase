var store = {};

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
}).call(this);

(function() {
    "use strict";
    store.Product = function(options) {
        if (!options) options = {};
        this.id = options.id || null;
        this.alias = options.alias || options.id || null;
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
        if (this.state) store.trigger(this, this.state);
    };
    store.Product.prototype.on = function(event, cb) {
        store.when(this, event, cb);
    };
    store.Product.prototype.once = function(event, cb) {
        store.once(this, event, cb);
    };
    store.Product.prototype.off = function(cb) {
        store.when.unregister(cb);
    };
}).call(this);

(function() {
    "use strict";
    store.Error = function(options) {
        if (!options) options = {};
        this.code = options.code || store.ERR_UNKNOWN;
        this.message = options.message || "unknown error";
    };
    store.error = function(cb) {
        store.error.callbacks.push(cb);
    };
    store.error.unregister = function(cb) {
        store.error.callbacks.unregister(cb);
    };
}).call(this);

(function() {
    "use strict";
    store.registerProducts = function(products) {
        for (var i = 0; i < products.length; ++i) {
            var p = new store.Product(products[i]);
            if (!p.alias) p.alias = p.id;
            if (p.id !== store._queries.uniqueQuery(p.id)) continue;
            if (p.alias !== store._queries.uniqueQuery(p.alias)) continue;
            this.products.push(p);
        }
    };
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
        if (typeof once !== "string") {
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
                    that.once(pid).loaded(function(p) {
                        if (localCallback.skip) return;
                        if (p.valid) {
                            if (localCallback.then) {
                                done();
                                cb(p);
                            } else {
                                done();
                            }
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
                    that.once(pid).loaded(function(p) {
                        if (localCallback.skip) return;
                        if (!p.valid) {
                            if (localCallback.error) {
                                done();
                                cb(new store.Error({
                                    code: store.ERR_INVALID_PRODUCT_ID,
                                    message: "Invalid product"
                                }), p);
                            } else {
                                done();
                            }
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

store.refresh = function() {};

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
    store._queries = {
        uniqueQuery: function(string) {
            if (!string) return "";
            var query = "";
            var tokens = string.split(" ");
            for (var i = 0; i < tokens.length; ++i) {
                var token = tokens[i];
                if (token !== "order" && token !== "product") {
                    if (query !== "") query += " ";
                    query += tokens[i];
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
            },
            unregister: function(cb) {
                var keep = function(o) {
                    return o.cb !== cb;
                };
                for (var i in this.byQuery) this.byQuery[i] = this.byQuery[i].filter(keep);
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
            var isNotOnce = function(cb) {
                return !cb.once;
            };
            var i;
            for (i = 0; i < queries.length; ++i) {
                var q = queries[i];
                var cbs = store._queries.callbacks.byQuery[q];
                if (cbs) {
                    for (var j = 0; j < cbs.length; ++j) {
                        cbs[j].cb.apply(store, args);
                    }
                    store._queries.callbacks.byQuery[q] = cbs.filter(isNotOnce);
                }
            }
            if (action !== "updated") this.triggerWhenProduct(product, "updated", args);
        }
    };
}).call(this);

(function() {
    "use strict";
    store.trigger = function(product, action, args) {
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

var exec = function(methodName, options, success, error) {
    cordova.exec(success, error, "InAppPurchase", methodName, options);
};

var protectCall = function(callback, context) {
    try {
        var args = Array.prototype.slice.call(arguments, 2);
        callback.apply(this, args);
    } catch (err) {
        log("exception in " + context + ': "' + err + '"');
    }
};

var InAppPurchase = function() {
    this.options = {};
};

var noop = function() {};

var log = noop;

var ERROR_CODES_BASE = 4983497;

InAppPurchase.prototype.ERR_SETUP = ERROR_CODES_BASE + 1;

InAppPurchase.prototype.ERR_LOAD = ERROR_CODES_BASE + 2;

InAppPurchase.prototype.ERR_PURCHASE = ERROR_CODES_BASE + 3;

InAppPurchase.prototype.ERR_LOAD_RECEIPTS = ERROR_CODES_BASE + 4;

InAppPurchase.prototype.ERR_CLIENT_INVALID = ERROR_CODES_BASE + 5;

InAppPurchase.prototype.ERR_PAYMENT_CANCELLED = ERROR_CODES_BASE + 6;

InAppPurchase.prototype.ERR_PAYMENT_INVALID = ERROR_CODES_BASE + 7;

InAppPurchase.prototype.ERR_PAYMENT_NOT_ALLOWED = ERROR_CODES_BASE + 8;

InAppPurchase.prototype.ERR_UNKNOWN = ERROR_CODES_BASE + 10;

InAppPurchase.prototype.ERR_REFRESH_RECEIPTS = ERROR_CODES_BASE + 11;

InAppPurchase.prototype.init = function(options) {
    this.options = {
        error: options.error || noop,
        ready: options.ready || noop,
        purchase: options.purchase || noop,
        purchaseEnqueued: options.purchaseEnqueued || noop,
        finish: options.finish || noop,
        restore: options.restore || noop,
        receiptsRefreshed: options.receiptsRefreshed || noop,
        restoreFailed: options.restoreFailed || noop,
        restoreCompleted: options.restoreCompleted || noop
    };
    this.receiptForTransaction = {};
    this.receiptForProduct = {};
    if (window.localStorage && window.localStorage.sk_receiptForTransaction) this.receiptForTransaction = JSON.parse(window.localStorage.sk_receiptForTransaction);
    if (window.localStorage && window.localStorage.sk_receiptForProduct) this.receiptForProduct = JSON.parse(window.localStorage.sk_receiptForProduct);
    if (options.debug) {
        exec("debug", [], noop, noop);
        log = function(msg) {
            console.log("InAppPurchase[js]: " + msg);
        };
    }
    if (options.noAutoFinish) {
        exec("noAutoFinish", [], noop, noop);
    }
    var that = this;
    var setupOk = function() {
        log("setup ok");
        protectCall(that.options.ready, "options.ready");
    };
    var setupFailed = function() {
        log("setup failed");
        protectCall(options.error, "options.error", InAppPurchase.prototype.ERR_SETUP, "Setup failed");
    };
    exec("setup", [], setupOk, setupFailed);
};

InAppPurchase.prototype.purchase = function(productId, quantity) {
    quantity = quantity | 0 || 1;
    var options = this.options;
    if (!InAppPurchase._productIds || InAppPurchase._productIds.indexOf(productId) < 0) {
        var msg = "Purchasing " + productId + " failed.  Ensure the product was loaded first with storekit.load(...)!";
        log(msg);
        if (typeof options.error === "function") {
            protectCall(options.error, "options.error", InAppPurchase.prototype.ERR_PURCHASE, "Trying to purchase a unknown product.", productId, quantity);
        }
        return;
    }
    var purchaseOk = function() {
        log("Purchased " + productId);
        if (typeof options.purchaseEnqueued === "function") {
            protectCall(options.purchaseEnqueued, "options.purchaseEnqueued", productId, quantity);
        }
    };
    var purchaseFailed = function() {
        var msg = "Purchasing " + productId + " failed";
        log(msg);
        if (typeof options.error === "function") {
            protectCall(options.error, "options.error", InAppPurchase.prototype.ERR_PURCHASE, msg, productId, quantity);
        }
    };
    return exec("purchase", [ productId, quantity ], purchaseOk, purchaseFailed);
};

InAppPurchase.prototype.restore = function() {
    this.needRestoreNotification = true;
    return exec("restoreCompletedTransactions", []);
};

InAppPurchase.prototype.load = function(productIds, callback) {
    var options = this.options;
    if (typeof productIds === "string") {
        productIds = [ productIds ];
    }
    if (!productIds) {
        protectCall(callback, "load.callback", [], []);
    } else if (!productIds.length) {
        protectCall(callback, "load.callback", [], []);
    } else {
        if (typeof productIds[0] !== "string") {
            var msg = "invalid productIds given to store.load: " + JSON.stringify(productIds);
            log(msg);
            protectCall(options.error, "options.error", InAppPurchase.prototype.ERR_LOAD, msg);
            return;
        }
        log("load " + JSON.stringify(productIds));
        var loadOk = function(array) {
            var valid = array[0];
            var invalid = array[1];
            log("load ok: { valid:" + JSON.stringify(valid) + " invalid:" + JSON.stringify(invalid) + " }");
            protectCall(callback, "load.callback", valid, invalid);
        };
        var loadFailed = function(errMessage) {
            log("load failed: " + errMessage);
            protectCall(options.error, "options.error", InAppPurchase.prototype.ERR_LOAD, "Failed to load product data: " + errMessage);
        };
        InAppPurchase._productIds = productIds;
        exec("load", [ productIds ], loadOk, loadFailed);
    }
};

InAppPurchase.prototype.finish = function(transactionId) {
    exec("finishTransaction", [ transactionId ], noop, noop);
};

InAppPurchase.prototype.updatedTransactionCallback = function(state, errorCode, errorText, transactionIdentifier, productId, transactionReceipt) {
    if (transactionReceipt) {
        this.receiptForProduct[productId] = transactionReceipt;
        this.receiptForTransaction[transactionIdentifier] = transactionReceipt;
        if (window.localStorage) {
            window.localStorage.sk_receiptForProduct = JSON.stringify(this.receiptForProduct);
            window.localStorage.sk_receiptForTransaction = JSON.stringify(this.receiptForTransaction);
        }
    }
    switch (state) {
      case "PaymentTransactionStatePurchased":
        protectCall(this.options.purchase, "options.purchase", transactionIdentifier, productId);
        return;

      case "PaymentTransactionStateFailed":
        protectCall(this.options.error, "options.error", errorCode, errorText);
        return;

      case "PaymentTransactionStateRestored":
        protectCall(this.options.restore, "options.restore", transactionIdentifier, productId);
        return;

      case "PaymentTransactionStateFinished":
        protectCall(this.options.finish, "options.finish", transactionIdentifier, productId);
        return;
    }
};

InAppPurchase.prototype.restoreCompletedTransactionsFinished = function() {
    if (this.needRestoreNotification) delete this.needRestoreNotification; else return;
    protectCall(this.options.restoreCompleted, "options.restoreCompleted");
};

InAppPurchase.prototype.restoreCompletedTransactionsFailed = function(errorCode) {
    if (this.needRestoreNotification) delete this.needRestoreNotification; else return;
    protectCall(this.options.restoreFailed, "options.restoreFailed", errorCode);
};

InAppPurchase.prototype.refreshReceipts = function() {
    var that = this;
    that.appStoreReceipt = null;
    var loaded = function(base64) {
        that.appStoreReceipt = base64;
        protectCall(that.options.receiptsRefreshed, "options.receiptsRefreshed", base64);
    };
    var error = function(errMessage) {
        log("refresh receipt failed: " + errMessage);
        protectcall(options.error, "options.error", InAppPurchase.prototype.ERR_REFRESH_RECEIPTS, "Failed to refresh receipt: " + errMessage);
    };
    exec("appStoreRefreshReceipt", [], loaded, error);
};

InAppPurchase.prototype.loadReceipts = function(callback) {
    var that = this;
    that.appStoreReceipt = null;
    var loaded = function(base64) {
        that.appStoreReceipt = base64;
        callCallback();
    };
    var error = function(errMessage) {
        log("load failed: " + errMessage);
        protectCall(options.error, "options.error", InAppPurchase.prototype.ERR_LOAD_RECEIPTS, "Failed to load receipt: " + errMessage);
    };
    var callCallback = function() {
        if (callback) {
            protectCall(callback, "loadReceipts.callback", {
                appStoreReceipt: that.appStoreReceipt,
                forTransaction: function(transactionId) {
                    return that.receiptForTransaction[transactionId] || null;
                },
                forProduct: function(productId) {
                    return that.receiptForProduct[productId] || null;
                }
            });
        }
    };
    exec("appStoreReceipt", [], loaded, error);
};

InAppPurchase.prototype.runQueue = function() {
    if (!this.eventQueue.length || !this.onPurchased && !this.onFailed && !this.onRestored) {
        return;
    }
    var args;
    var queue = this.eventQueue.slice();
    this.eventQueue = [];
    args = queue.shift();
    while (args) {
        this.updatedTransactionCallback.apply(this, args);
        args = queue.shift();
    }
    if (!this.eventQueue.length) {
        this.unWatchQueue();
    }
};

InAppPurchase.prototype.watchQueue = function() {
    if (this.timer) {
        return;
    }
    this.timer = window.setInterval(function() {
        window.storekit.runQueue();
    }, 1e4);
};

InAppPurchase.prototype.unWatchQueue = function() {
    if (this.timer) {
        window.clearInterval(this.timer);
        this.timer = null;
    }
};

InAppPurchase.prototype.eventQueue = [];

InAppPurchase.prototype.timer = null;

window.storekit = new InAppPurchase();

var initialized = false;

var init = function() {
    if (initialized) return;
    initialized = true;
    storekit.init({
        debug: store.debug ? true : false,
        noAutoFinish: true,
        ready: storekitReady,
        error: storekitError,
        purchase: storekitPurchase,
        restore: function(originalTransactionId, productId) {},
        restoreCompleted: function() {},
        restoreFailed: function(errorCode) {}
    });
};

var storekitReady = function() {
    var products = [];
    for (var i = 0; i < store.products.length; ++i) products.push(store.products[i].id);
    storekit.load(products, storekitLoaded);
};

var storekitError = function(errorCode, errorText) {
    console.log("error " + errorCode + ": " + errorText);
    if (errorCode === storekit.ERR_LOAD) {
        for (var i = 0; i < store.products.length; ++i) {
            var p = store.products[i];
            store._queries.triggerWhenProduct(p, "error", [ new store.Error({
                code: store.ERR_LOAD,
                message: errorText
            }), p ]);
        }
    }
    store.error.callbacks.trigger(new store.Error({
        code: errorCode,
        message: errorText
    }));
};

var storekitLoaded = function(validProducts, invalidProductIds) {
    var p;
    for (var i = 0; i < validProducts.length; ++i) {
        p = store.products.byId[validProducts[i].id];
        p.loaded = true;
        p.valid = true;
        p.title = validProducts[i].title;
        p.price = validProducts[i].price;
        p.description = validProducts[i].description;
        store._queries.triggerWhenProduct(p, "loaded", [ p ]);
    }
    for (var j = 0; j < invalidProductIds.length; ++j) {
        p = store.products.byId[invalidProductIds[j]];
        p.loaded = true;
        p.valid = false;
        store._queries.triggerWhenProduct(p, "loaded", [ p ]);
    }
    store.ready(true);
};

var storekitPurchase = function(transactionId, productId) {
    store.ready(function() {
        var product = store.products.byId[productId];
        if (!product) {
            store.error.callbacks.trigger(new store.Error({
                code: store.ERR_PURCHASE,
                message: "Unknown product purchased"
            }));
            return;
        }
        var order = {
            id: product,
            transaction: {
                id: transactionId
            },
            finish: function() {
                storekit.finish(order.transaction.id);
            }
        };
        store._queries.triggerWhenProduct(product, "approved", [ order ]);
    });
};

store.restore = function() {};

store.when("order", "requested", function(product) {
    store.ready(function() {
        if (!product) {
            store.error.callbacks.trigger(new store.Error({
                code: store.ERR_INVALID_PRODUCT_ID,
                message: "Trying to order an unknown product"
            }));
            return;
        }
        if (!initialized) {
            store.trigger(product, "error", [ new store.Error({
                code: store.ERR_PURCHASE,
                message: "`purchase()` called before initialization"
            }), product ]);
            return;
        }
        if (!product.loaded) {
            store.trigger(product, "error", [ new store.Error({
                code: store.ERR_PURCHASE,
                message: "`purchase()` called before doing initial `refresh()`"
            }), product ]);
            return;
        }
        if (!product.valid) {
            store.trigger(product, "error", [ new store.Error({
                code: store.ERR_PURCHASE,
                message: "`purchase()` called with an invalid product ID"
            }), product ]);
            return;
        }
        store.trigger(product, "initiated", product);
        storekit.purchase(product.id, quantity || 1);
    });
});

var refresh = store.refresh;

store.refresh = function() {
    refresh.apply(this, arguments);
    if (!initialized) init();
};

module.exports = store;