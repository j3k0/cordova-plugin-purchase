var store = {};

store.verbosity = 0;

(function() {
    "use strict";
    store.FREE_SUBSCRIPTION = "free subscription";
    store.PAID_SUBSCRIPTION = "paid subscription";
    store.CONSUMABLE = "consumable";
    store.NON_CONSUMABLE = "non consumable";
    var ERROR_CODES_BASE = 6777e3;
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
    store.ERR_FINISH = ERROR_CODES_BASE + 13;
    store.ERR_COMMUNICATION = ERROR_CODES_BASE + 14;
    store.ERR_SUBSCRIPTIONS_NOT_AVAILABLE = ERROR_CODES_BASE + 15;
    store.ERR_MISSING_TOKEN = ERROR_CODES_BASE + 16;
    store.ERR_VERIFICATION_FAILED = ERROR_CODES_BASE + 17;
    store.ERR_BAD_RESPONSE = ERROR_CODES_BASE + 18;
    store.ERR_REFRESH = ERROR_CODES_BASE + 19;
    store.REGISTERED = "registered";
    store.INVALID = "invalid";
    store.VALID = "valid";
    store.REQUESTED = "requested";
    store.INITIATED = "initiated";
    store.APPROVED = "approved";
    store.FINISHED = "finished";
    store.OWNED = "owned";
    store.QUIET = 0;
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
        this.owned = options.owned;
        this.state = options.state || "";
        this.stateChanged();
    };
    store.Product.prototype.finish = function() {
        store.log.debug("product -> defer finishing " + this.id);
        defer(this, function() {
            store.log.debug("product -> finishing " + this.id);
            if (this.state !== store.FINISHED) {
                this.set("state", store.FINISHED);
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
                owned: function(cb) {
                    store._queries.callbacks.add(query, "owned", cb, once);
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
    store.when.unregister = function(cb) {
        store._queries.callbacks.unregister(cb);
    };
}).call(this);

(function() {
    "use strict";
    store.once = function(query, action, callback) {
        if (typeof action === "function") {
            return store.when(query, action, true);
        } else if (typeof action === "undefined") {
            return store.when(query, true);
        } else {
            store._queries.callbacks.add(query, action, callback, true);
        }
    };
    store.once.unregister = store.when.unregister;
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
    var logLevel = {};
    logLevel[store.ERROR] = "ERROR";
    logLevel[store.WARNING] = "WARNING";
    logLevel[store.INFO] = "INFO";
    logLevel[store.DEBUG] = "DEBUG";
    function log(level, o) {
        var maxLevel = store.verbosity === true ? 1 : store.verbosity;
        if (level > maxLevel) return;
        if (typeof o !== "string") o = JSON.stringify(o);
        if (logLevel[level]) console.log("[store.js] " + logLevel[level] + ": " + o); else console.log("[store.js] " + o);
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
        this.owned = this.state === store.OWNED;
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
                        store.helpers.handleCallbackError(action, err);
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
                            store.helpers.handleCallbackError(q, err);
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
        for (var i = 0; i < this.length; ++i) {
            try {
                this[i].call(store, error);
            } catch (err) {
                store.helpers.handleCallbackError("error", err);
            }
        }
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
    store.helpers = {
        handleCallbackError: function(query, err) {
            store.log.warn("queries -> a callback for '" + query + "' failed with an exception.");
            if (typeof err === "string") store.log.warn("           " + err); else if (err) {
                if (err.fileName) store.log.warn("           " + err.fileName + ":" + err.lineNumber);
                if (err.message) store.log.warn("           " + err.message);
                if (err.stack) store.log.warn("           " + err.stack);
            }
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
        purchasing: options.purchasing || noop,
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
      case "PaymentTransactionStatePurchasing":
        protectCall(this.options.purchasing, "options.purchasing", productId);
        return;

      case "PaymentTransactionStatePurchased":
        protectCall(this.options.purchase, "options.purchase", transactionIdentifier, productId);
        return;

      case "PaymentTransactionStateFailed":
        protectCall(this.options.error, "options.error", errorCode, errorText, {
            productId: productId
        });
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

store.when("refreshed", function() {
    storekitInit();
});

store.when("requested", function(product) {
    store.ready(function() {
        if (!product) {
            store.error({
                code: store.ERR_INVALID_PRODUCT_ID,
                message: "Trying to order an unknown product"
            });
            return;
        }
        if (!product.valid) {
            product.trigger("error", [ new store.Error({
                code: store.ERR_PURCHASE,
                message: "`purchase()` called with an invalid product"
            }), product ]);
            return;
        }
        storekit.purchase(product.id, 1);
    });
});

store.when("finished", function(product) {
    storekit.finish(product.transaction.id);
    product.set("state", product.type === store.CONSUMABLE ? store.VALID : store.OWNED);
});

store.when("owned", function(product) {
    setOwned(product.id, true);
});

var initialized = false;

var storekitInit = function() {
    if (initialized) return;
    initialized = true;
    store.log.debug("ios -> initializing storekit");
    storekit.init({
        debug: store.verbosity >= store.DEBUG ? true : false,
        noAutoFinish: true,
        ready: storekitReady,
        error: storekitError,
        purchase: storekitPurchased,
        purchasing: storekitPurchasing,
        restore: function(originalTransactionId, productId) {},
        restoreCompleted: function() {},
        restoreFailed: function(errorCode) {}
    });
};

var storekitReady = function() {
    store.log.debug("ios -> storekit ready");
    var products = [];
    for (var i = 0; i < store.products.length; ++i) products.push(store.products[i].id);
    store.log.debug("ios -> loading products");
    storekit.load(products, storekitLoaded);
};

var storekitLoaded = function(validProducts, invalidProductIds) {
    store.log.debug("ios -> products loaded");
    var p;
    for (var i = 0; i < validProducts.length; ++i) {
        p = store.products.byId[validProducts[i].id];
        store.log.debug("ios -> product " + p.id + " is valid (" + p.alias + ")");
        p.set({
            title: validProducts[i].title,
            price: validProducts[i].price,
            description: validProducts[i].description,
            state: store.VALID
        });
        p.trigger("loaded");
        if (isOwned(p.id)) p.set("state", store.OWNED);
    }
    for (var j = 0; j < invalidProductIds.length; ++j) {
        p = store.products.byId[invalidProductIds[j]];
        p.set("state", store.INVALID);
        store.log.warn("ios -> product " + p.id + " is NOT valid (" + p.alias + ")");
        p.trigger("loaded");
    }
    setTimeout(function() {
        store.ready(true);
    }, 1);
};

var storekitPurchasing = function(productId) {
    store.log.debug("ios -> is purchasing " + productId);
    store.ready(function() {
        var product = store.get(productId);
        if (!product) {
            store.log.warn("ios -> Product '" + productId + "' is being purchased. But isn't registered anymore! How come?");
            return;
        }
        if (product.state !== store.INITIATED) product.set("state", store.INITIATED);
    });
};

var storekitPurchased = function(transactionId, productId) {
    store.ready(function() {
        var product = store.get(productId);
        if (!product) {
            store.error({
                code: store.ERR_PURCHASE,
                message: "Unknown product purchased"
            });
            return;
        }
        product.transaction = {
            type: "ios-appstore",
            id: transactionId
        };
        product.set("state", store.APPROVED);
    });
};

var storekitError = function(errorCode, errorText, options) {
    var i, p;
    if (!options) options = {};
    store.log.error("ios -> ERROR " + errorCode + ": " + errorText + " - " + JSON.stringify(options));
    if (errorCode === storekit.ERR_LOAD) {
        for (i = 0; i < store.products.length; ++i) {
            p = store.products[i];
            p.trigger("error", [ new store.Error({
                code: store.ERR_LOAD,
                message: errorText
            }), p ]);
        }
    }
    if (errorCode === storekit.ERR_PAYMENT_CANCELLED) {
        p = store.get(options.productId);
        if (p) {
            p.trigger("cancelled");
            p.set({
                transaction: null,
                state: store.VALID
            });
        }
        return;
    }
    store.error({
        code: errorCode,
        message: errorText
    });
};

store.restore = function() {};

function isOwned(productId) {
    return localStorage["__cc_fovea_store_ios_owned_ " + productId] === "1";
}

function setOwned(productId, value) {
    localStorage["__cc_fovea_store_ios_owned_ " + productId] = value ? "1" : "0";
}

module.exports = store;