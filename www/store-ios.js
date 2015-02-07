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
    store.ERR_PAYMENT_EXPIRED = ERROR_CODES_BASE + 20;
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
    store.INVALID_PAYLOAD = 6778001;
    store.CONNECTION_FAILED = 6778002;
    store.PURCHASE_EXPIRED = 6778003;
})();

(function() {
    "use strict";
    function defer(thisArg, cb, delay) {
        setTimeout(function() {
            cb.call(thisArg);
        }, delay || 1);
    }
    var delay = defer;
    store.Product = function(options) {
        if (!options) options = {};
        this.id = options.id || null;
        this.alias = options.alias || options.id || null;
        var type = this.type = options.type || null;
        if (type !== store.CONSUMABLE && type !== store.NON_CONSUMABLE && type !== store.PAID_SUBSCRIPTION && type !== store.FREE_SUBSCRIPTION) throw new TypeError("Invalid product type");
        this.state = options.state || "";
        this.title = options.title || options.localizedTitle || null;
        this.description = options.description || options.localizedDescription || null;
        this.price = options.price || null;
        this.currency = options.currency || null;
        this.loaded = options.loaded;
        this.valid = options.valid;
        this.canPurchase = options.canPurchase;
        this.owned = options.owned;
        this.transaction = null;
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
    store.Product.prototype.verify = function() {
        var that = this;
        var nRetry = 0;
        var noop = function() {};
        var doneCb = noop;
        var successCb = noop;
        var expiredCb = noop;
        var errorCb = noop;
        var tryValidation = function() {
            if (that.state !== store.APPROVED) return;
            store._validator(that, function(success, data) {
                store.log.debug("verify -> " + JSON.stringify(success));
                if (success) {
                    store.log.debug("verify -> success: " + JSON.stringify(data));
                    store.utils.callExternal("verify.success", successCb, that, data);
                    store.utils.callExternal("verify.done", doneCb, that);
                    that.trigger("verified");
                } else {
                    store.log.debug("verify -> error: " + JSON.stringify(data));
                    var msg = data && data.error && data.error.message ? data.error.message : "";
                    var err = new store.Error({
                        code: store.ERR_VERIFICATION_FAILED,
                        message: "Transaction verification failed: " + msg
                    });
                    if (data.code === store.PURCHASE_EXPIRED) {
                        err = new store.Error({
                            code: store.ERR_PAYMENT_EXPIRED,
                            message: "Transaction expired: " + msg
                        });
                    }
                    if (data.code === store.PURCHASE_EXPIRED) {
                        if (nRetry < 2 && store._refreshForValidation) {
                            nRetry += 1;
                            store._refreshForValidation(function() {
                                delay(that, tryValidation, 300);
                            });
                        } else {
                            store.error(err);
                            store.utils.callExternal("verify.error", errorCb, err);
                            store.utils.callExternal("verify.done", doneCb, that);
                            that.trigger("expired");
                            that.set("state", store.VALID);
                            store.utils.callExternal("verify.expired", expiredCb, that);
                        }
                    } else if (nRetry < 4) {
                        nRetry += 1;
                        delay(this, tryValidation, 1e3 * nRetry * nRetry);
                    } else {
                        store.log.debug("validation failed 5 times, stop retrying, trigger an error");
                        store.error(err);
                        store.utils.callExternal("verify.error", errorCb, err);
                        store.utils.callExternal("verify.done", doneCb, that);
                        that.trigger("unverified");
                    }
                }
            });
        };
        defer(this, function() {
            if (that.state !== store.APPROVED) {
                var err = new store.Error({
                    code: store.ERR_VERIFICATION_FAILED,
                    message: "Product isn't in the APPROVED state"
                });
                store.error(err);
                store.utils.callExternal("verify.error", errorCb, err);
                store.utils.callExternal("verify.done", doneCb, that);
                return;
            }
        });
        delay(this, tryValidation, 1e3);
        var ret = {
            done: function(cb) {
                doneCb = cb;
                return this;
            },
            expired: function(cb) {
                expiredCb = cb;
                return this;
            },
            success: function(cb) {
                successCb = cb;
                return this;
            },
            error: function(cb) {
                errorCb = cb;
                return this;
            }
        };
        return ret;
    };
})();

(function() {
    "use strict";
    store.Error = function(options) {
        if (!options) options = {};
        this.code = options.code || store.ERR_UNKNOWN;
        this.message = options.message || "unknown error";
    };
    store.error = function(cb, altCb) {
        var ret = cb;
        if (cb instanceof store.Error) store.error.callbacks.trigger(cb); else if (cb.code && cb.message) store.error.callbacks.trigger(new store.Error(cb)); else if (typeof cb === "function") store.error.callbacks.push(cb); else if (typeof altCb === "function") {
            ret = function(err) {
                if (err.code === cb) altCb();
            };
            store.error(ret);
        }
        return ret;
    };
    store.error.unregister = function(cb) {
        store.error.callbacks.unregister(cb);
    };
})();

(function() {
    "use strict";
    store.register = function(product) {
        if (!product) return;
        if (!product.length) store.register([ product ]); else registerProducts(product);
    };
    function registerProducts(products) {
        for (var i = 0; i < products.length; ++i) {
            products[i].state = store.REGISTERED;
            var p = new store.Product(products[i]);
            if (!p.alias) p.alias = p.id;
            if (p.id !== store._queries.uniqueQuery(p.id)) continue;
            if (p.alias !== store._queries.uniqueQuery(p.alias)) continue;
            if (hasKeyword(p.id) || hasKeyword(p.alias)) continue;
            store.products.push(p);
        }
    }
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
})();

(function() {
    "use strict";
    store.get = function(id) {
        var product = store.products.byId[id] || store.products.byAlias[id];
        return product;
    };
})();

(function() {
    "use strict";
    store.when = function(query, once, callback) {
        if (typeof query === "undefined") query = "";
        if (typeof query === "object" && query instanceof store.Product) query = query.id;
        if (typeof once === "function") {
            return store.when("", query, once);
        } else if (typeof once !== "string") {
            var ret = {};
            var addPromise = function(name) {
                ret[name] = function(cb) {
                    store._queries.callbacks.add(query, name, cb, once);
                    return this;
                };
            };
            addPromise("loaded");
            addPromise("updated");
            addPromise("error");
            addPromise("approved");
            addPromise("owned");
            addPromise("cancelled");
            addPromise("refunded");
            addPromise("registered");
            addPromise("valid");
            addPromise("invalid");
            addPromise("requested");
            addPromise("initiated");
            addPromise("finished");
            addPromise("verified");
            addPromise("unverified");
            addPromise("expired");
            return ret;
        } else {
            var action = once;
            store._queries.callbacks.add(query, action, callback);
        }
    };
    store.when.unregister = function(cb) {
        store._queries.callbacks.unregister(cb);
    };
})();

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
})();

(function() {
    "use strict";
    var callbacks = {};
    var callbackId = 0;
    store.order = function(pid) {
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
            delete localCallback.then;
            delete localCallback.error;
            delete callbacks[localCallbackId];
        }
        store.ready(function() {
            p.set("state", store.REQUESTED);
        });
        return {
            then: function(cb) {
                localCallback.then = cb;
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
                    cb(err);
                });
                return this;
            }
        };
    };
    store.order.unregister = function(cb) {
        for (var i in callbacks) {
            if (callbacks[i].then === cb) delete callbacks[i].then;
            if (callbacks[i].error === cb) delete callbacks[i].error;
        }
    };
})();

(function() {
    "use strict";
    var isReady = false;
    var callbacks = [];
    store.ready = function(cb) {
        if (cb === true) {
            if (isReady) return this;
            isReady = true;
            for (var i = 0; i < callbacks.length; ++i) store.utils.callExternal("ready.callback", callbacks[i]);
            callbacks = [];
        } else if (cb) {
            if (isReady) {
                setTimeout(function() {
                    store.utils.callExternal("ready.callback", cb);
                }, 1);
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
    store.ready.reset = function() {
        isReady = false;
        callbacks = [];
    };
})();

(function() {
    "use strict";
    store.off = function(callback) {
        store.ready.unregister(callback);
        store.when.unregister(callback);
        store.order.unregister(callback);
        store.error.unregister(callback);
    };
})();

(function() {
    "use strict";
    store.validator = null;
    store._validator = function(product, callback, isPrepared) {
        if (!store.validator) callback(true, product);
        if (store._prepareForValidation && isPrepared !== true) {
            store._prepareForValidation(product, function() {
                store._validator(product, callback, true);
            });
            return;
        }
        if (typeof store.validator === "string") {
            store.utils.ajax({
                url: store.validator,
                method: "POST",
                data: product,
                success: function(data) {
                    callback(data && data.ok, data.data);
                },
                error: function(status, message) {
                    callback(false, "Error " + status + ": " + message);
                }
            });
        } else {
            store.validator(product, callback);
        }
    };
})();

(function() {
    "use strict";
    var initialRefresh = true;
    store.refresh = function() {
        store.trigger("refreshed");
        if (initialRefresh) {
            initialRefresh = false;
            return;
        }
        store.log.debug("refresh -> checking products state (" + store.products.length + " products)");
        for (var i = 0; i < store.products.length; ++i) {
            var p = store.products[i];
            store.log.debug("refresh -> product id " + p.id + " (" + p.alias + ")");
            store.log.debug("           in state '" + p.state + "'");
            if (p.state === store.APPROVED) p.trigger(store.APPROVED); else if (p.state === store.OWNED && (p.type === store.FREE_SUBSCRIPTION || p.type === store.PAID_SUBSCRIPTION)) p.set("state", store.APPROVED);
        }
        store.trigger("re-refreshed");
    };
})();

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
})();

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
    store.products.reset = function() {
        while (this.length > 0) this.shift();
        this.byAlias = {};
        this.byId = {};
    };
})();

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
        this.owned = this.owned || this.state === store.OWNED;
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
})();

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
                        store.utils.logError(action, err);
                    }
                }
                store._queries.callbacks.byQuery[action] = cbs.filter(isNotOnce);
            }
        },
        triggerWhenProduct: function(product, action, args) {
            var queries = [];
            if (product && product.id) queries.push(product.id + " " + action);
            if (product && product.alias && product.alias !== product.id) queries.push(product.alias + " " + action);
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
                            store.utils.logError(q, err);
                            deferThrow(err);
                        }
                    }
                    store._queries.callbacks.byQuery[q] = cbs.filter(isNotOnce);
                }
            }
            if (action !== "updated" && action !== "error") this.triggerWhenProduct(product, "updated", [ product ]);
        }
    };
    function isNotOnce(cb) {
        return !cb.once;
    }
    function deferThrow(err) {
        setTimeout(function() {
            throw err;
        }, 1);
    }
})();

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
})();

(function() {
    "use strict";
    store.error.callbacks = [];
    store.error.callbacks.trigger = function(error) {
        for (var i = 0; i < this.length; ++i) {
            try {
                this[i].call(store, error);
            } catch (err) {
                store.utils.logError("error", err);
                deferThrow(err);
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
    function deferThrow(err) {
        setTimeout(function() {
            throw err;
        }, 1);
    }
})();

(function() {
    "use strict";
    store.utils = {
        logError: function(context, err) {
            store.log.warn("A callback in '" + context + "' failed with an exception.");
            if (typeof err === "string") store.log.warn("           " + err); else if (err) {
                if (err.fileName) store.log.warn("           " + err.fileName + ":" + err.lineNumber);
                if (err.message) store.log.warn("           " + err.message);
                if (err.stack) store.log.warn("           " + err.stack);
            }
        },
        callExternal: function(name, callback) {
            try {
                var args = Array.prototype.slice.call(arguments, 2);
                if (callback) callback.apply(this, args);
            } catch (e) {
                store.utils.logError(name, e);
            }
        },
        ajax: function(options) {
            var doneCb = function() {};
            var xhr = new XMLHttpRequest();
            xhr.open(options.method || "POST", options.url, true);
            xhr.onreadystatechange = function() {
                try {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            store.utils.callExternal("ajax.success", options.success, JSON.parse(xhr.responseText));
                        } else {
                            store.log.warn("ajax -> request to " + options.url + " failed with status " + xhr.status + " (" + xhr.statusText + ")");
                            store.utils.callExternal("ajax.error", options.error, xhr.status, xhr.statusText);
                        }
                    }
                } catch (e) {
                    store.log.warn("ajax -> request to " + options.url + " failed with an exception: " + e.message);
                    if (options.error) options.error(417, e.message);
                }
                if (xhr.readyState === 4) store.utils.callExternal("ajax.done", doneCb);
            };
            store.log.debug("ajax -> send request to " + options.url);
            if (options.data) {
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr.send(JSON.stringify(options.data));
            } else {
                xhr.send();
            }
            return {
                done: function(cb) {
                    doneCb = cb;
                    return this;
                }
            };
        }
    };
})();

(function() {
    "use strict";
    var exec = function(methodName, options, success, error) {
        cordova.exec(success, error, "InAppPurchase", methodName, options);
    };
    var protectCall = function(callback, context) {
        if (!callback) {
            return;
        }
        try {
            var args = Array.prototype.slice.call(arguments, 2);
            callback.apply(this, args);
        } catch (err) {
            log("exception in " + context + ': "' + err + '"');
        }
    };
    var InAppPurchase = function() {
        this.options = {};
        this.receiptForTransaction = {};
        this.receiptForProduct = {};
        if (window.localStorage && window.localStorage.sk_receiptForTransaction) this.receiptForTransaction = JSON.parse(window.localStorage.sk_receiptForTransaction);
        if (window.localStorage && window.localStorage.sk_receiptForProduct) this.receiptForProduct = JSON.parse(window.localStorage.sk_receiptForProduct);
    };
    var noop = function() {};
    var log = noop;
    var ERROR_CODES_BASE = 6777e3;
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
    var initialized = false;
    InAppPurchase.prototype.init = function(options, success, error) {
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
            protectCall(success, "init.success");
            initialized = true;
            that.processPendingUpdates();
        };
        var setupFailed = function() {
            log("setup failed");
            protectCall(options.error, "options.error", InAppPurchase.prototype.ERR_SETUP, "Setup failed");
            protectCall(error, "init.error");
        };
        this.loadAppStoreReceipt();
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
            var errmsg = "Purchasing " + productId + " failed";
            log(errmsg);
            if (typeof options.error === "function") {
                protectCall(options.error, "options.error", InAppPurchase.prototype.ERR_PURCHASE, errmsg, productId, quantity);
            }
        };
        exec("purchase", [ productId, quantity ], purchaseOk, purchaseFailed);
    };
    InAppPurchase.prototype.canMakePayments = function(success, error) {
        return exec("canMakePayments", [], success, error);
    };
    InAppPurchase.prototype.restore = function() {
        this.needRestoreNotification = true;
        exec("restoreCompletedTransactions", []);
    };
    InAppPurchase.prototype.load = function(productIds, success, error) {
        var options = this.options;
        if (typeof productIds === "string") {
            productIds = [ productIds ];
        }
        if (!productIds) {
            protectCall(success, "load.success", [], []);
        } else if (!productIds.length) {
            protectCall(success, "load.success", [], []);
        } else {
            if (typeof productIds[0] !== "string") {
                var msg = "invalid productIds given to store.load: " + JSON.stringify(productIds);
                log(msg);
                protectCall(options.error, "options.error", InAppPurchase.prototype.ERR_LOAD, msg);
                protectCall(error, "load.error", InAppPurchase.prototype.ERR_LOAD, msg);
                return;
            }
            log("load " + JSON.stringify(productIds));
            var loadOk = function(array) {
                var valid = array[0];
                var invalid = array[1];
                log("load ok: { valid:" + JSON.stringify(valid) + " invalid:" + JSON.stringify(invalid) + " }");
                protectCall(success, "load.success", valid, invalid);
            };
            var loadFailed = function(errMessage) {
                log("load failed");
                log(errMessage);
                var message = "Load failed: " + errMessage;
                protectCall(options.error, "options.error", InAppPurchase.prototype.ERR_LOAD, message);
                protectCall(error, "load.error", InAppPurchase.prototype.ERR_LOAD, message);
            };
            InAppPurchase._productIds = productIds;
            exec("load", [ productIds ], loadOk, loadFailed);
        }
    };
    InAppPurchase.prototype.finish = function(transactionId) {
        exec("finishTransaction", [ transactionId ], noop, noop);
    };
    var pendingUpdates = [];
    InAppPurchase.prototype.processPendingUpdates = function() {
        for (var i = 0; i < pendingUpdates.length; ++i) {
            this.updatedTransactionCallback.apply(this, pendingUpdates[i]);
        }
        pendingUpdates = [];
    };
    InAppPurchase.prototype.updatedTransactionCallback = function(state, errorCode, errorText, transactionIdentifier, productId, transactionReceipt) {
        if (!initialized) {
            var args = Array.prototype.slice.call(arguments);
            pendingUpdates.push(args);
            return;
        }
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
    InAppPurchase.prototype.refreshReceipts = function(successCb, errorCb) {
        var that = this;
        var loaded = function(args) {
            var base64 = args[0];
            var bundleIdentifier = args[1];
            var bundleShortVersion = args[2];
            var bundleNumericVersion = args[3];
            var bundleSignature = args[4];
            log("infoPlist: " + bundleIdentifier + "," + bundleShortVersion + "," + bundleNumericVersion + "," + bundleSignature);
            that.setAppStoreReceipt(base64);
            protectCall(that.options.receiptsRefreshed, "options.receiptsRefreshed", {
                appStoreReceipt: base64,
                bundleIdentifier: bundleIdentifier,
                bundleShortVersion: bundleShortVersion,
                bundleNumericVersion: bundleNumericVersion,
                bundleSignature: bundleSignature
            });
            protectCall(successCb, "refreshReceipts.success", base64);
        };
        var error = function(errMessage) {
            log("refresh receipt failed: " + errMessage);
            protectCall(that.options.error, "options.error", InAppPurchase.prototype.ERR_REFRESH_RECEIPTS, "Failed to refresh receipt: " + errMessage);
            protectCall(errorCb, "refreshReceipts.error", InAppPurchase.prototype.ERR_REFRESH_RECEIPTS, "Failed to refresh receipt: " + errMessage);
        };
        log("refreshing appStoreReceipt");
        exec("appStoreRefreshReceipt", [], loaded, error);
    };
    InAppPurchase.prototype.loadReceipts = function(callback) {
        var that = this;
        var loaded = function(base64) {
            that.setAppStoreReceipt(base64);
            callCallback();
        };
        var error = function(errMessage) {
            log("load failed: " + errMessage);
            protectCall(that.options.error, "options.error", InAppPurchase.prototype.ERR_LOAD_RECEIPTS, "Failed to load receipt: " + errMessage);
        };
        function callCallback() {
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
        if (that.appStoreReceipt) {
            log("appStoreReceipt already loaded:");
            log(that.appStoreReceipt);
            callCallback();
        } else {
            log("loading appStoreReceipt");
            exec("appStoreReceipt", [], loaded, error);
        }
    };
    InAppPurchase.prototype.setAppStoreReceipt = function(base64) {
        this.appStoreReceipt = base64;
        if (window.localStorage && base64) {
            window.localStorage.sk_appStoreReceipt = base64;
        }
    };
    InAppPurchase.prototype.loadAppStoreReceipt = function() {
        if (window.localStorage && window.localStorage.sk_appStoreReceipt) {
            this.appStoreReceipt = window.localStorage.sk_appStoreReceipt;
        }
        if (this.appStoreReceipt === "null") this.appStoreReceipt = null;
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
})();

(function() {
    "use strict";
    store.when("refreshed", function() {
        storekitInit();
        storekitLoad();
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
        store.log.debug("ios -> finishing " + product.id);
        storekitFinish(product);
        if (product.type === store.CONSUMABLE) product.set("state", store.VALID); else product.set("state", store.OWNED);
    });
    function storekitFinish(product) {
        if (product.type === store.CONSUMABLE) {
            if (product.transaction.id) storekit.finish(product.transaction.id);
        } else if (product.transactions) {
            store.log.debug("ios -> finishing all " + product.transactions.length + " transactions for " + product.id);
            for (var i = 0; i < product.transactions.length; ++i) {
                store.log.debug("ios -> finishing " + product.transactions[i]);
                storekit.finish(product.transactions[i]);
            }
            product.transactions = [];
        }
    }
    store.when("owned", function(product) {
        if (!isOwned(product.id)) setOwned(product.id, true);
    });
    store.when("registered", function(product) {
        var owned = isOwned(product.id);
        product.owned = product.owned || owned;
        store.log.debug("ios -> product " + product.id + " registered" + (owned ? " and owned" : ""));
    });
    store.when("expired", function(product) {
        store.log.debug("ios -> product " + product.id + " expired");
        product.owned = false;
        setOwned(product.id, false);
        storekitFinish(product);
        if (product.state === store.OWNED || product.state === store.APPROVED) product.set("state", store.VALID);
    });
    var initialized = false;
    var initializing = false;
    function storekitInit() {
        if (initialized || initializing) return;
        initializing = true;
        store.log.debug("ios -> initializing storekit");
        storekit.init({
            debug: store.verbosity >= store.DEBUG ? true : false,
            noAutoFinish: true,
            error: storekitError,
            purchase: storekitPurchased,
            purchasing: storekitPurchasing,
            restore: storekitRestored,
            restoreCompleted: storekitRestoreCompleted,
            restoreFailed: storekitRestoreFailed
        }, storekitReady, storekitInitFailed);
    }
    function storekitReady() {
        store.log.info("ios -> storekit ready");
        initializing = false;
        initialized = true;
        storekitLoad();
    }
    function storekitInitFailed() {
        store.log.warn("ios -> storekit init failed");
        initializing = false;
        retry(storekitInit);
    }
    var loaded = false;
    var loading = false;
    function storekitLoad() {
        if (!initialized) return;
        if (loaded || loading) return;
        loading = true;
        var products = [];
        for (var i = 0; i < store.products.length; ++i) products.push(store.products[i].id);
        store.log.debug("ios -> loading products");
        storekit.load(products, storekitLoaded, storekitLoadFailed);
    }
    function storekitLoaded(validProducts, invalidProductIds) {
        store.log.debug("ios -> products loaded");
        var p;
        for (var i = 0; i < validProducts.length; ++i) {
            p = store.products.byId[validProducts[i].id];
            store.log.debug("ios -> product " + p.id + " is valid (" + p.alias + ")");
            store.log.debug("ios -> owned? " + p.owned);
            p.set({
                title: validProducts[i].title,
                price: validProducts[i].price,
                description: validProducts[i].description,
                state: store.VALID
            });
            p.trigger("loaded");
            if (isOwned(p.id)) {
                if (p.type === store.NON_CONSUMABLE) p.set("state", store.OWNED); else p.set("state", store.APPROVED);
            }
        }
        for (var j = 0; j < invalidProductIds.length; ++j) {
            p = store.products.byId[invalidProductIds[j]];
            p.set("state", store.INVALID);
            store.log.warn("ios -> product " + p.id + " is NOT valid (" + p.alias + ")");
            p.trigger("loaded");
        }
        setTimeout(function() {
            loading = false;
            loaded = true;
            store.ready(true);
        }, 1);
    }
    function storekitLoadFailed() {
        store.log.warn("ios -> loading products failed");
        loading = false;
        retry(storekitLoad);
    }
    var refreshCallbacks = [];
    var refreshing = false;
    function storekitRefreshReceipts(callback) {
        if (callback) refreshCallbacks.push(callback);
        if (refreshing) return;
        refreshing = true;
        function callCallbacks() {
            var callbacks = refreshCallbacks;
            refreshCallbacks = [];
            for (var i = 0; i < callbacks.length; ++i) callbacks[i]();
        }
        storekit.refreshReceipts(function() {
            refreshing = false;
            callCallbacks();
        }, function() {
            refreshing = false;
            callCallbacks();
        });
    }
    store.when("expired", function() {
        storekitRefreshReceipts();
    });
    function storekitPurchasing(productId) {
        store.log.debug("ios -> is purchasing " + productId);
        store.ready(function() {
            var product = store.get(productId);
            if (!product) {
                store.log.warn("ios -> Product '" + productId + "' is being purchased. But isn't registered anymore! How come?");
                return;
            }
            if (product.state !== store.INITIATED) product.set("state", store.INITIATED);
        });
    }
    function storekitPurchased(transactionId, productId) {
        store.ready(function() {
            var product = store.get(productId);
            if (!product) {
                store.error({
                    code: store.ERR_PURCHASE,
                    message: "Unknown product purchased"
                });
                return;
            }
            if (product.transactions) {
                for (var i = 0; i < product.transactions.length; ++i) {
                    if (transactionId === product.transactions[i]) return;
                }
            }
            product.transaction = {
                type: "ios-appstore",
                id: transactionId
            };
            if (!product.transactions) product.transactions = [];
            product.transactions.push(transactionId);
            store.log.info("ios -> transaction " + transactionId + " purchased (" + product.transactions.length + " in the queue for " + productId + ")");
            product.set("state", store.APPROVED);
        });
    }
    function storekitError(errorCode, errorText, options) {
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
    }
    store.when("re-refreshed", function() {
        storekit.restore();
        storekit.refreshReceipts(function(data) {
            if (data) {
                var p = data.bundleIdentifier ? store.get(data.bundleIdentifier) : null;
                if (!p) {
                    p = new store.Product({
                        id: data.bundleIdentifier || "application data",
                        alias: "application data",
                        type: store.NON_CONSUMABLE
                    });
                    store.register(p);
                }
                p.version = data.bundleShortVersion;
                p.transaction = {
                    type: "ios-appstore",
                    appStoreReceipt: data.appStoreReceipt,
                    signature: data.signature
                };
                p.trigger("loaded");
                p.set("state", store.APPROVED);
            }
        });
    });
    function storekitRestored(originalTransactionId, productId) {
        store.log.info("ios -> restored purchase " + productId);
        storekitPurchased(originalTransactionId, productId);
    }
    function storekitRestoreCompleted() {
        store.log.info("ios -> restore completed");
        store.trigger("refresh-completed");
    }
    function storekitRestoreFailed() {
        store.log.warn("ios -> restore failed");
        store.error({
            code: store.ERR_REFRESH,
            message: "Failed to restore purchases during refresh"
        });
        store.trigger("refresh-failed");
    }
    store._refreshForValidation = function(callback) {
        storekitRefreshReceipts(callback);
    };
    store._prepareForValidation = function(product, callback) {
        var nRetry = 0;
        function loadReceipts() {
            storekit.loadReceipts(function(r) {
                if (!product.transaction) {
                    product.transaction = {
                        type: "ios-appstore"
                    };
                }
                product.transaction.appStoreReceipt = r.appStoreReceipt;
                if (product.transaction.id) product.transaction.transactionReceipt = r.forTransaction(product.transaction.id);
                if (!product.transaction.appStoreReceipt && !product.transaction.transactionReceipt) {
                    nRetry++;
                    if (nRetry < 2) {
                        setTimeout(loadReceipts, 500);
                        return;
                    } else if (nRetry === 2) {
                        storekit.refreshReceipts(loadReceipts);
                        return;
                    }
                }
                callback();
            });
        }
        loadReceipts();
    };
    function isOwned(productId) {
        return localStorage["__cc_fovea_store_ios_owned_ " + productId] === "1";
    }
    function setOwned(productId, value) {
        localStorage["__cc_fovea_store_ios_owned_ " + productId] = value ? "1" : "0";
    }
    var retryTimeout = 5e3;
    var retries = [];
    function retry(fn) {
        var tid = setTimeout(function() {
            retries = retries.filter(function(o) {
                return tid !== o.tid;
            });
            fn();
        }, retryTimeout);
        retries.push({
            tid: tid,
            fn: fn
        });
        retryTimeout *= 2;
        if (retryTimeout > 12e4) retryTimeout = 12e4;
    }
    document.addEventListener("online", function() {
        var a = retries;
        retries = [];
        retryTimeout = 5e3;
        for (var i = 0; i < a.length; ++i) {
            clearTimeout(a[i].tid);
            a[i].fn.call(this);
        }
    }, false);
})();

module.exports = store;