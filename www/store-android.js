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
    var log = function(msg) {
        console.log("InAppBilling[js]: " + msg);
    };
    var InAppBilling = function() {
        this.options = {};
    };
    InAppBilling.prototype.init = function(success, fail, options, skus) {
        if (!options) options = {};
        this.options = {
            showLog: options.showLog !== false
        };
        if (this.options.showLog) {
            log("setup ok");
        }
        var hasSKUs = false;
        if (typeof skus !== "undefined") {
            if (typeof skus === "string") {
                skus = [ skus ];
            }
            if (skus.length > 0) {
                if (typeof skus[0] !== "string") {
                    var msg = "invalid productIds: " + JSON.stringify(skus);
                    if (this.options.showLog) {
                        log(msg);
                    }
                    fail(msg, store.ERR_INVALID_PRODUCT_ID);
                    return;
                }
                if (this.options.showLog) {
                    log("load " + JSON.stringify(skus));
                }
                hasSKUs = true;
            }
        }
        if (hasSKUs) {
            cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "init", [ skus ]);
        } else {
            cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "init", []);
        }
    };
    InAppBilling.prototype.getPurchases = function(success, fail) {
        if (this.options.showLog) {
            log("getPurchases called!");
        }
        return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "getPurchases", [ "null" ]);
    };
    InAppBilling.prototype.buy = function(success, fail, productId) {
        if (this.options.showLog) {
            log("buy called!");
        }
        return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "buy", [ productId ]);
    };
    InAppBilling.prototype.subscribe = function(success, fail, productId) {
        if (this.options.showLog) {
            log("subscribe called!");
        }
        return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "subscribe", [ productId ]);
    };
    InAppBilling.prototype.consumePurchase = function(success, fail, productId) {
        if (this.options.showLog) {
            log("consumePurchase called!");
        }
        return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "consumePurchase", [ productId ]);
    };
    InAppBilling.prototype.getAvailableProducts = function(success, fail) {
        if (this.options.showLog) {
            log("getAvailableProducts called!");
        }
        return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "getAvailableProducts", [ "null" ]);
    };
    InAppBilling.prototype.getProductDetails = function(success, fail, skus) {
        if (this.options.showLog) {
            log("getProductDetails called!");
        }
        if (typeof skus === "string") {
            skus = [ skus ];
        }
        if (!skus.length) {
            return;
        } else {
            if (typeof skus[0] !== "string") {
                var msg = "invalid productIds: " + JSON.stringify(skus);
                log(msg);
                fail(msg, store.ERR_INVALID_PRODUCT_ID);
                return;
            }
            if (this.options.showLog) {
                log("load " + JSON.stringify(skus));
            }
            cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "getProductDetails", [ skus ]);
        }
    };
    function errorCb(fail) {
        return function(error) {
            if (!fail) return;
            var tokens = typeof error === "string" ? error.split("|") : [ error ];
            if (tokens.length > 1 && /^[-+]?(\d+)$/.test(tokens[0])) {
                var code = tokens[0];
                var message = tokens[1];
                fail(message, +code);
            } else {
                fail(error);
            }
        };
    }
    window.inappbilling = new InAppBilling();
    try {
        store.android = window.inappbilling;
    } catch (e) {}
})();

(function() {
    "use strict";
    var initialized = false;
    var skus = [];
    store.when("refreshed", function() {
        if (!initialized) init();
    });
    store.when("re-refreshed", function() {
        iabGetPurchases();
    });
    function init() {
        if (initialized) return;
        initialized = true;
        for (var i = 0; i < store.products.length; ++i) skus.push(store.products[i].id);
        store.android.init(iabReady, function(err) {
            store.error({
                code: store.ERR_SETUP,
                message: "Init failed - " + err
            });
        }, {
            showLog: store.verbosity >= store.DEBUG ? true : false
        }, skus);
    }
    function iabReady() {
        store.log.debug("android -> ready");
        store.android.getAvailableProducts(iabLoaded, function(err) {
            store.error({
                code: store.ERR_LOAD,
                message: "Loading product info failed - " + err
            });
        });
    }
    function iabLoaded(validProducts) {
        store.log.debug("android -> loaded - " + JSON.stringify(validProducts));
        var p, i;
        for (i = 0; i < validProducts.length; ++i) {
            if (validProducts[i].productId) p = store.products.byId[validProducts[i].productId]; else p = null;
            if (p) {
                p.set({
                    title: validProducts[i].title,
                    price: validProducts[i].price,
                    description: validProducts[i].description,
                    currency: validProducts[i].price_currency_code,
                    state: store.VALID
                });
                p.trigger("loaded");
            }
        }
        for (i = 0; i < skus.length; ++i) {
            p = store.products.byId[skus[i]];
            if (p && !p.valid) {
                p.set("state", store.INVALID);
                p.trigger("loaded");
            }
        }
        iabGetPurchases();
    }
    function iabGetPurchases() {
        store.android.getPurchases(function(purchases) {
            if (purchases && purchases.length) {
                for (var i = 0; i < purchases.length; ++i) {
                    var purchase = purchases[i];
                    var p = store.get(purchase.productId);
                    if (!p) {
                        store.log.warn("android -> user owns a non-registered product");
                        continue;
                    }
                    setProductData(p, purchase);
                }
            }
            store.ready(true);
        }, function() {});
    }
    function setProductData(product, data) {
        store.log.debug("android -> product data for " + product.id);
        store.log.debug(data);
        product.transaction = {
            type: "android-playstore",
            id: data.orderId,
            purchaseToken: data.purchaseToken,
            developerPayload: data.developerPayload,
            receipt: data.receipt,
            signature: data.signature
        };
        if (product.state !== store.OWNED && product.state !== store.FINISHED && product.state !== store.APPROVED) {
            if (data.purchaseState === 0) {
                product.set("state", store.APPROVED);
            }
        }
        if (product.state === store.OWNED || product.state === store.FINISHED || product.state === store.APPROVED) {
            if (data.purchaseState === 1) {
                product.trigger("cancelled");
                product.set("state", store.VALID);
            } else if (data.purchaseState === 2) {
                product.trigger("refunded");
                product.set("state", store.VALID);
            }
        }
    }
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
            product.set("state", store.INITIATED);
            var method = "subscribe";
            if (product.type === store.NON_CONSUMABLE || product.type === store.CONSUMABLE) {
                method = "buy";
            }
            store.android[method](function(data) {
                setProductData(product, data);
            }, function(err, code) {
                store.log.info("android -> " + method + " error " + code);
                if (code === store.ERR_PAYMENT_CANCELLED) {
                    product.transaction = null;
                    product.trigger("cancelled");
                } else {
                    store.error({
                        code: code || store.ERR_PURCHASE,
                        message: "Purchase failed: " + err
                    });
                }
                product.set("state", store.VALID);
            }, product.id);
        });
    });
    store.when("product", "finished", function(product) {
        store.log.debug("android -> consumable finished");
        if (product.type === store.CONSUMABLE) {
            product.transaction = null;
            store.android.consumePurchase(function() {
                store.log.debug("android -> consumable consumed");
                product.set("state", store.VALID);
            }, function(err, code) {
                store.error({
                    code: code || store.ERR_UNKNOWN,
                    message: err
                });
            }, product.id);
        } else {
            product.set("state", store.OWNED);
        }
    });
})();

if (window) {
    window.store = store;
}

module.exports = store;