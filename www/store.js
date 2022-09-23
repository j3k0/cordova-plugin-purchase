"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CDVPurchase2;
(function (CDVPurchase2) {
    let Internal;
    (function (Internal) {
        class Adapters {
            constructor() {
                this.list = [];
            }
            add(adapters, context) {
                adapters.forEach(platform => {
                    if (this.find(platform))
                        return;
                    switch (platform) {
                        case CDVPurchase2.Platform.APPLE_APPSTORE:
                            this.list.push(new CDVPurchase2.AppleStore.Adapter(context));
                        case CDVPurchase2.Platform.GOOGLE_PLAY:
                            this.list.push(new CDVPurchase2.GooglePlay.Adapter(context));
                        case CDVPurchase2.Platform.BRAINTREE:
                            this.list.push(new CDVPurchase2.Braintree.Adapter());
                        case CDVPurchase2.Platform.TEST:
                        default:
                            this.list.push(new CDVPurchase2.Test.Adapter());
                    }
                });
            }
            initialize(platforms = [CDVPurchase2.Store.defaultPlatform()], context) {
                return __awaiter(this, void 0, void 0, function* () {
                    const newPlatforms = platforms.filter(p => !this.find(p));
                    this.add(newPlatforms, context);
                    const products = context.registeredProducts.byPlatform();
                    const result = yield Promise.all(newPlatforms.map((platform) => __awaiter(this, void 0, void 0, function* () {
                        var _a, _b, _c;
                        const platformProducts = (_c = (_b = (_a = products.filter(p => p.platform === platform)) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.products) !== null && _c !== void 0 ? _c : [];
                        const adapter = this.find(platform);
                        if (!adapter)
                            return;
                        const initResult = yield adapter.initialize();
                        context.log.info(`Adapter ${platform}. Initialized: ${JSON.stringify(initResult)}`);
                        if (initResult === null || initResult === void 0 ? void 0 : initResult.code)
                            return initResult;
                        context.log.info(`Adapter ${platform}. Products: ${JSON.stringify(platformProducts)}`);
                        if (platformProducts.length === 0)
                            return;
                        const loadResult = yield adapter.load(platformProducts);
                        context.log.info(`Adapter ${platform}. Products loaded: ${JSON.stringify(loadResult)}`);
                        const loadedProducts = loadResult.filter(p => p instanceof CDVPurchase2.Product);
                        context.listener.productsUpdated(platform, loadedProducts);
                        return loadResult.filter(lr => 'code' in lr && 'message' in lr)[0];
                    })));
                    return result.filter(err => err);
                });
            }
            find(platform) {
                return this.list.filter(a => a.id === platform)[0];
            }
        }
        Internal.Adapters = Adapters;
    })(Internal = CDVPurchase2.Internal || (CDVPurchase2.Internal = {}));
})(CDVPurchase2 || (CDVPurchase2 = {}));
var CDVPurchase2;
(function (CDVPurchase2) {
    /** Manage a list of callbacks */
    class Callbacks {
        constructor() {
            this.callbacks = [];
        }
        push(callback) {
            this.callbacks.push(callback);
        }
        trigger(value) {
            this.callbacks.forEach(cb => setTimeout(cb, 0, value));
        }
    }
    CDVPurchase2.Callbacks = Callbacks;
})(CDVPurchase2 || (CDVPurchase2 = {}));
//!
//! ## Generating the documentation
//!
//! The documentation is generated by running `make doc`. This command will update doc/api.md and doc/contributor-guide.md
//!
//! The content of those files is retrieve from the typescript source code.
//!
//! Lines starting with "//!" will be included in the contributor documentation.
//! Lines starting with "//:" will be included in the user documentation.
//!
var CDVPurchase2;
(function (CDVPurchase2) {
    const ERROR_CODES_BASE = 6777000;
    let ErrorCode;
    (function (ErrorCode) {
        /** Error: Failed to intialize the in-app purchase library */
        ErrorCode[ErrorCode["SETUP"] = ERROR_CODES_BASE + 1] = "SETUP";
        /** Error: Failed to load in-app products metadata */
        ErrorCode[ErrorCode["LOAD"] = ERROR_CODES_BASE + 2] = "LOAD";
        /** Error: Failed to make a purchase */
        ErrorCode[ErrorCode["PURCHASE"] = ERROR_CODES_BASE + 3] = "PURCHASE";
        /** Error: Failed to load the purchase receipt */
        ErrorCode[ErrorCode["LOAD_RECEIPTS"] = ERROR_CODES_BASE + 4] = "LOAD_RECEIPTS";
        /** Error: Client is not allowed to issue the request */
        ErrorCode[ErrorCode["CLIENT_INVALID"] = ERROR_CODES_BASE + 5] = "CLIENT_INVALID";
        /** Error: Purchase flow has been cancelled by user */
        ErrorCode[ErrorCode["PAYMENT_CANCELLED"] = ERROR_CODES_BASE + 6] = "PAYMENT_CANCELLED";
        /** Error: Something is suspicious about a purchase */
        ErrorCode[ErrorCode["PAYMENT_INVALID"] = ERROR_CODES_BASE + 7] = "PAYMENT_INVALID";
        /** Error: The user is not allowed to make a payment */
        ErrorCode[ErrorCode["PAYMENT_NOT_ALLOWED"] = ERROR_CODES_BASE + 8] = "PAYMENT_NOT_ALLOWED";
        /** Error: Unknown error */
        ErrorCode[ErrorCode["UNKNOWN"] = ERROR_CODES_BASE + 10] = "UNKNOWN";
        /** Error: Failed to refresh the purchase receipt */
        ErrorCode[ErrorCode["REFRESH_RECEIPTS"] = ERROR_CODES_BASE + 11] = "REFRESH_RECEIPTS";
        /** Error: The product identifier is invalid */
        ErrorCode[ErrorCode["INVALID_PRODUCT_ID"] = ERROR_CODES_BASE + 12] = "INVALID_PRODUCT_ID";
        /** Error: Cannot finalize a transaction or acknowledge a purchase */
        ErrorCode[ErrorCode["FINISH"] = ERROR_CODES_BASE + 13] = "FINISH";
        /** Error: Failed to communicate with the server */
        ErrorCode[ErrorCode["COMMUNICATION"] = ERROR_CODES_BASE + 14] = "COMMUNICATION";
        /** Error: Subscriptions are not available */
        ErrorCode[ErrorCode["SUBSCRIPTIONS_NOT_AVAILABLE"] = ERROR_CODES_BASE + 15] = "SUBSCRIPTIONS_NOT_AVAILABLE";
        /** Error: Purchase information is missing token */
        ErrorCode[ErrorCode["MISSING_TOKEN"] = ERROR_CODES_BASE + 16] = "MISSING_TOKEN";
        /** Error: Verification of store data failed */
        ErrorCode[ErrorCode["VERIFICATION_FAILED"] = ERROR_CODES_BASE + 17] = "VERIFICATION_FAILED";
        /** Error: Bad response from the server */
        ErrorCode[ErrorCode["BAD_RESPONSE"] = ERROR_CODES_BASE + 18] = "BAD_RESPONSE";
        /** Error: Failed to refresh the store */
        ErrorCode[ErrorCode["REFRESH"] = ERROR_CODES_BASE + 19] = "REFRESH";
        /** Error: Payment has expired */
        ErrorCode[ErrorCode["PAYMENT_EXPIRED"] = ERROR_CODES_BASE + 20] = "PAYMENT_EXPIRED";
        /** Error: Failed to download the content */
        ErrorCode[ErrorCode["DOWNLOAD"] = ERROR_CODES_BASE + 21] = "DOWNLOAD";
        /** Error: Failed to update a subscription */
        ErrorCode[ErrorCode["SUBSCRIPTION_UPDATE_NOT_AVAILABLE"] = ERROR_CODES_BASE + 22] = "SUBSCRIPTION_UPDATE_NOT_AVAILABLE";
        /** Error: The requested product is not available in the store. */
        ErrorCode[ErrorCode["PRODUCT_NOT_AVAILABLE"] = ERROR_CODES_BASE + 23] = "PRODUCT_NOT_AVAILABLE";
        /** Error: The user has not allowed access to Cloud service information */
        ErrorCode[ErrorCode["CLOUD_SERVICE_PERMISSION_DENIED"] = ERROR_CODES_BASE + 24] = "CLOUD_SERVICE_PERMISSION_DENIED";
        /** Error: The device could not connect to the network. */
        ErrorCode[ErrorCode["CLOUD_SERVICE_NETWORK_CONNECTION_FAILED"] = ERROR_CODES_BASE + 25] = "CLOUD_SERVICE_NETWORK_CONNECTION_FAILED";
        /** Error: The user has revoked permission to use this cloud service. */
        ErrorCode[ErrorCode["CLOUD_SERVICE_REVOKED"] = ERROR_CODES_BASE + 26] = "CLOUD_SERVICE_REVOKED";
        /** Error: The user has not yet acknowledged Apple’s privacy policy */
        ErrorCode[ErrorCode["PRIVACY_ACKNOWLEDGEMENT_REQUIRED"] = ERROR_CODES_BASE + 27] = "PRIVACY_ACKNOWLEDGEMENT_REQUIRED";
        /** Error: The app is attempting to use a property for which it does not have the required entitlement. */
        ErrorCode[ErrorCode["UNAUTHORIZED_REQUEST_DATA"] = ERROR_CODES_BASE + 28] = "UNAUTHORIZED_REQUEST_DATA";
        /** Error: The offer identifier is invalid. */
        ErrorCode[ErrorCode["INVALID_OFFER_IDENTIFIER"] = ERROR_CODES_BASE + 29] = "INVALID_OFFER_IDENTIFIER";
        /** Error: The price you specified in App Store Connect is no longer valid. */
        ErrorCode[ErrorCode["INVALID_OFFER_PRICE"] = ERROR_CODES_BASE + 30] = "INVALID_OFFER_PRICE";
        /** Error: The signature in a payment discount is not valid. */
        ErrorCode[ErrorCode["INVALID_SIGNATURE"] = ERROR_CODES_BASE + 31] = "INVALID_SIGNATURE";
        /** Error: Parameters are missing in a payment discount. */
        ErrorCode[ErrorCode["MISSING_OFFER_PARAMS"] = ERROR_CODES_BASE + 32] = "MISSING_OFFER_PARAMS";
    })(ErrorCode = CDVPurchase2.ErrorCode || (CDVPurchase2.ErrorCode = {}));
})(CDVPurchase2 || (CDVPurchase2 = {}));
var CDVPurchase2;
(function (CDVPurchase2) {
    let LogLevel;
    (function (LogLevel) {
        LogLevel[LogLevel["QUIET"] = 0] = "QUIET";
        LogLevel[LogLevel["ERROR"] = 1] = "ERROR";
        LogLevel[LogLevel["WARNING"] = 2] = "WARNING";
        LogLevel[LogLevel["INFO"] = 3] = "INFO";
        LogLevel[LogLevel["DEBUG"] = 4] = "DEBUG";
    })(LogLevel = CDVPurchase2.LogLevel || (CDVPurchase2.LogLevel = {}));
    ;
    let Internal;
    (function (Internal) {
        class Log {
            constructor(store, prefix = '') {
                this.prefix = '';
                this.store = store;
                this.prefix = prefix || 'CordovaPurchase';
            }
            child(prefix) {
                return new Log(this.store, this.prefix + '.' + prefix);
            }
            /// ### `store.log.error(message)`
            /// Logs an error message, only if `store.verbosity` >= store.ERROR
            error(o) { log(this.store.verbosity, LogLevel.ERROR, this.prefix, o); }
            /// ### `store.log.warn(message)`
            /// Logs a warning message, only if `store.verbosity` >= store.WARNING
            warn(o) { log(this.store.verbosity, LogLevel.WARNING, this.prefix, o); }
            /// ### `store.log.info(message)`
            /// Logs an info message, only if `store.verbosity` >= store.INFO
            info(o) { log(this.store.verbosity, LogLevel.INFO, this.prefix, o); }
            /// ### `store.log.debug(message)`
            /// Logs a debug message, only if `store.verbosity` >= store.DEBUG
            debug(o) { log(this.store.verbosity, LogLevel.DEBUG, this.prefix, o); }
            /**
             * Add warning logs on a console describing an exceptions.
             *
             * This method is mostly used when executing user registered callbacks.
             *
             * @param context - a string describing why the method was called
             * @param error - a javascript Error object thrown by a exception
             */
            logCallbackException(context, err) {
                this.warn("A callback in \'" + context + "\' failed with an exception.");
                if (typeof err === 'string')
                    this.warn("           " + err);
                else if (err) {
                    const errAny = err;
                    if (errAny.fileName)
                        this.warn("           " + errAny.fileName + ":" + errAny.lineNumber);
                    if (err.message)
                        this.warn("           " + err.message);
                    if (err.stack)
                        this.warn("           " + err.stack);
                }
            }
        }
        Internal.Log = Log;
        const LOG_LEVEL_STRING = ["QUIET", "ERROR", "WARNING", "INFO", "DEBUG"];
        function log(verbosity, level, prefix, o) {
            var maxLevel = verbosity === true ? 1 : verbosity;
            if (level > maxLevel)
                return;
            if (typeof o !== 'string')
                o = JSON.stringify(o);
            const fullPrefix = prefix ? `[${prefix}] ` : '';
            if (LOG_LEVEL_STRING[level])
                console.log(`${fullPrefix}${LOG_LEVEL_STRING[level]}: ${o}`);
            else
                console.log(`${fullPrefix}${o}`);
        }
    })(Internal = CDVPurchase2.Internal || (CDVPurchase2.Internal = {}));
})(CDVPurchase2 || (CDVPurchase2 = {}));
var CDVPurchase2;
(function (CDVPurchase2) {
    let Internal;
    (function (Internal) {
        /// ## store.utils
        class Utils {
            /**
             * Calls an user-registered callback.
             *
             * Won't throw exceptions, only logs errors.
             *
             * @param name a short string describing the callback
             * @param callback the callback to call (won't fail if undefined)
             *
             * @example
             * ```js
             * store.utils.callExternal(store, "ajax.error", options.error, 404, "Not found");
             * ```
             */
            static callExternal(context, name, callback, ...args) {
                try {
                    const args = Array.prototype.slice.call(arguments, 3);
                    // store.log.debug("calling " + name + "(" + JSON.stringify(args2) + ")");
                    if (callback)
                        callback.apply(context, args);
                }
                catch (e) {
                    context.log.logCallbackException(name, e);
                }
            }
            ///
            /// ### store.utils.ajax(options)
            /// Simplified version of jQuery's ajax method based on XMLHttpRequest.
            /// Only supports JSON requests.
            ///
            /// Options:
            ///
            /// * `url`:
            /// * `method`: HTTP method to use (GET, POST, ...)
            /// * `success`: callback(data)
            /// * `error`: callback(statusCode, statusText)
            /// * `data`: body of your request
            ///
            static ajax(context, options) {
                const log = context.log;
                if (typeof window !== 'undefined' && window.cordova && window.cordova.plugin && window.cordova.plugin.http) {
                    return this.ajaxWithHttpPlugin(context, options);
                }
                var doneCb = function () { };
                var xhr = new XMLHttpRequest();
                xhr.open(options.method || 'POST', options.url, true);
                xhr.onreadystatechange = function ( /*event*/) {
                    try {
                        if (xhr.readyState === 4) {
                            if (xhr.status === 200) {
                                context.callExternal('ajax.success', options.success, JSON.parse(xhr.responseText));
                            }
                            else {
                                log.warn("ajax -> request to " + options.url + " failed with status " + xhr.status + " (" + xhr.statusText + ")");
                                context.callExternal('ajax.error', options.error, xhr.status, xhr.statusText);
                            }
                        }
                    }
                    catch (e) {
                        log.warn("ajax -> request to " + options.url + " failed with an exception: " + e.message);
                        if (options.error)
                            options.error(417, e.message, null);
                    }
                    if (xhr.readyState === 4)
                        context.callExternal('ajax.done', doneCb);
                };
                const customHeaders = options.customHeaders;
                if (customHeaders) {
                    Object.keys(customHeaders).forEach(function (header) {
                        log.debug('ajax -> adding custom header: ' + header);
                        xhr.setRequestHeader(header, customHeaders[header]);
                    });
                }
                xhr.setRequestHeader("Accept", "application/json");
                log.debug('ajax -> send request to ' + options.url);
                if (options.data) {
                    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    xhr.send(JSON.stringify(options.data));
                }
                else {
                    xhr.send();
                }
                return {
                    done: function (cb) { doneCb = cb; return this; }
                };
            }
            /** Simplified version of jQuery's ajax method based on XMLHttpRequest.
             *
             * Uses the http plugin. */
            static ajaxWithHttpPlugin(context, options) {
                let doneCb = function () { };
                const ajaxOptions = {
                    method: (options.method || 'get').toLowerCase(),
                    data: options.data,
                    serializer: 'json',
                    // responseType: 'json',
                };
                if (options.customHeaders) {
                    context.log.debug('ajax[http] -> adding custom headers: ' + JSON.stringify(options.customHeaders));
                    ajaxOptions.headers = options.customHeaders;
                }
                context.log.debug('ajax[http] -> send request to ' + options.url);
                const ajaxDone = (response) => {
                    try {
                        if (response.status == 200) {
                            context.callExternal('ajax.success', options.success, JSON.parse(response.data));
                        }
                        else {
                            context.log.warn("ajax[http] -> request to " + options.url + " failed with status " + response.status + " (" + response.error + ")");
                            context.callExternal('ajax.error', options.error, response.status, response.error);
                        }
                    }
                    catch (e) {
                        context.log.warn("ajax[http] -> request to " + options.url + " failed with an exception: " + e.message);
                        if (options.error)
                            context.callExternal('ajax.error', options.error, 417, e.message);
                    }
                    context.callExternal('ajax.done', doneCb);
                };
                cordova.plugin.http.sendRequest(options.url, ajaxOptions, ajaxDone, ajaxDone);
                return {
                    done: function (cb) { doneCb = cb; return this; }
                };
            }
            ///
            /// ### store.utils.uuidv4()
            /// Returns an UUID v4. Uses `window.crypto` internally to generate random values.
            ///
            /** Returns an UUID v4. Uses `window.crypto` internally to generate random values. */
            static uuidv4() {
                // @ts-ignore
                return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
                    return (c ^ (window.crypto || window.msCrypto).getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
                });
            }
            ///
            /// ### store.utils.md5(str)
            /// Returns the MD5 hash-value of the passed string.
            ///
            static md5(r) { return md5(r); }
            static delay(fn, wait) {
                return setTimeout(fn, wait);
            }
            static debounce(fn, wait) {
                let timeout = null;
                const later = function (context, args) {
                    timeout = null;
                    fn();
                };
                const debounced = function () {
                    if (timeout)
                        window.clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                };
                return debounced;
            }
        }
        Utils.nonEnumerable = (target, name, desc) => {
            if (desc) {
                desc.enumerable = false;
                return desc;
            }
            Object.defineProperty(target, name, {
                set(value) {
                    Object.defineProperty(this, name, {
                        value, writable: true, configurable: true,
                    });
                },
                configurable: true,
            });
        };
        Internal.Utils = Utils;
        ;
        /* eslint-disable */ /* jshint ignore:start */
        // Based on the work of Jeff Mott, who did a pure JS implementation of the MD5 algorithm that was published by Ronald L. Rivest in 1991.
        // Code was imported from https://github.com/pvorb/node-md5
        function md5(r) {
            // @ts-ignore
            function n(o) { if (t[o])
                return t[o].exports; var e = t[o] = { i: o, l: !1, exports: {} }; return r[o].call(e.exports, e, e.exports, n), e.l = !0, e.exports; }
            var t = {};
            return n.m = r, n.c = t, n.i = function (r) { return r; }, n.d = function (r, t, o) { n.o(r, t) || Object.defineProperty(r, t, { configurable: !1, enumerable: !0, get: o }); }, n.n = function (r) { var t = r && r.__esModule ? function () { return r.default; } : function () { return r; }; return n.d(t, "a", t), t; }, n.o = function (r, n) { return Object.prototype.hasOwnProperty.call(r, n); }, n.p = "", n(n.s = 4);
            // @ts-ignore
        }
        ([function (r, n) { var t = { utf8: { stringToBytes: function (r) { return t.bin.stringToBytes(unescape(encodeURIComponent(r))); }, bytesToString: function (r) { return decodeURIComponent(escape(t.bin.bytesToString(r))); } }, bin: { stringToBytes: function (r) { for (var n = [], t = 0; t < r.length; t++)
                        n.push(255 & r.charCodeAt(t)); return n; }, bytesToString: function (r) { for (var n = [], t = 0; t < r.length; t++)
                        n.push(String.fromCharCode(r[t])); return n.join(""); } } }; r.exports = t; }, function (r, n, t) { !function () { var n = t(2), o = t(0).utf8, e = t(3), u = t(0).bin, i = function (r, t) { r.constructor == String ? r = t && "binary" === t.encoding ? u.stringToBytes(r) : o.stringToBytes(r) : e(r) ? r = Array.prototype.slice.call(r, 0) : Array.isArray(r) || (r = r.toString()); for (var f = n.bytesToWords(r), s = 8 * r.length, c = 1732584193, a = -271733879, l = -1732584194, g = 271733878, h = 0; h < f.length; h++)
                f[h] = 16711935 & (f[h] << 8 | f[h] >>> 24) | 4278255360 & (f[h] << 24 | f[h] >>> 8); f[s >>> 5] |= 128 << s % 32, f[14 + (s + 64 >>> 9 << 4)] = s; for (var p = i._ff, y = i._gg, v = i._hh, d = i._ii, h = 0; h < f.length; h += 16) {
                var b = c, T = a, x = l, B = g;
                c = p(c, a, l, g, f[h + 0], 7, -680876936), g = p(g, c, a, l, f[h + 1], 12, -389564586), l = p(l, g, c, a, f[h + 2], 17, 606105819), a = p(a, l, g, c, f[h + 3], 22, -1044525330), c = p(c, a, l, g, f[h + 4], 7, -176418897), g = p(g, c, a, l, f[h + 5], 12, 1200080426), l = p(l, g, c, a, f[h + 6], 17, -1473231341), a = p(a, l, g, c, f[h + 7], 22, -45705983), c = p(c, a, l, g, f[h + 8], 7, 1770035416), g = p(g, c, a, l, f[h + 9], 12, -1958414417), l = p(l, g, c, a, f[h + 10], 17, -42063), a = p(a, l, g, c, f[h + 11], 22, -1990404162), c = p(c, a, l, g, f[h + 12], 7, 1804603682), g = p(g, c, a, l, f[h + 13], 12, -40341101), l = p(l, g, c, a, f[h + 14], 17, -1502002290), a = p(a, l, g, c, f[h + 15], 22, 1236535329), c = y(c, a, l, g, f[h + 1], 5, -165796510), g = y(g, c, a, l, f[h + 6], 9, -1069501632), l = y(l, g, c, a, f[h + 11], 14, 643717713), a = y(a, l, g, c, f[h + 0], 20, -373897302), c = y(c, a, l, g, f[h + 5], 5, -701558691), g = y(g, c, a, l, f[h + 10], 9, 38016083), l = y(l, g, c, a, f[h + 15], 14, -660478335), a = y(a, l, g, c, f[h + 4], 20, -405537848), c = y(c, a, l, g, f[h + 9], 5, 568446438), g = y(g, c, a, l, f[h + 14], 9, -1019803690), l = y(l, g, c, a, f[h + 3], 14, -187363961), a = y(a, l, g, c, f[h + 8], 20, 1163531501), c = y(c, a, l, g, f[h + 13], 5, -1444681467), g = y(g, c, a, l, f[h + 2], 9, -51403784), l = y(l, g, c, a, f[h + 7], 14, 1735328473), a = y(a, l, g, c, f[h + 12], 20, -1926607734), c = v(c, a, l, g, f[h + 5], 4, -378558), g = v(g, c, a, l, f[h + 8], 11, -2022574463), l = v(l, g, c, a, f[h + 11], 16, 1839030562), a = v(a, l, g, c, f[h + 14], 23, -35309556), c = v(c, a, l, g, f[h + 1], 4, -1530992060), g = v(g, c, a, l, f[h + 4], 11, 1272893353), l = v(l, g, c, a, f[h + 7], 16, -155497632), a = v(a, l, g, c, f[h + 10], 23, -1094730640), c = v(c, a, l, g, f[h + 13], 4, 681279174), g = v(g, c, a, l, f[h + 0], 11, -358537222), l = v(l, g, c, a, f[h + 3], 16, -722521979), a = v(a, l, g, c, f[h + 6], 23, 76029189), c = v(c, a, l, g, f[h + 9], 4, -640364487), g = v(g, c, a, l, f[h + 12], 11, -421815835), l = v(l, g, c, a, f[h + 15], 16, 530742520), a = v(a, l, g, c, f[h + 2], 23, -995338651), c = d(c, a, l, g, f[h + 0], 6, -198630844), g = d(g, c, a, l, f[h + 7], 10, 1126891415), l = d(l, g, c, a, f[h + 14], 15, -1416354905), a = d(a, l, g, c, f[h + 5], 21, -57434055), c = d(c, a, l, g, f[h + 12], 6, 1700485571), g = d(g, c, a, l, f[h + 3], 10, -1894986606), l = d(l, g, c, a, f[h + 10], 15, -1051523), a = d(a, l, g, c, f[h + 1], 21, -2054922799), c = d(c, a, l, g, f[h + 8], 6, 1873313359), g = d(g, c, a, l, f[h + 15], 10, -30611744), l = d(l, g, c, a, f[h + 6], 15, -1560198380), a = d(a, l, g, c, f[h + 13], 21, 1309151649), c = d(c, a, l, g, f[h + 4], 6, -145523070), g = d(g, c, a, l, f[h + 11], 10, -1120210379), l = d(l, g, c, a, f[h + 2], 15, 718787259), a = d(a, l, g, c, f[h + 9], 21, -343485551), c = c + b >>> 0, a = a + T >>> 0, l = l + x >>> 0, g = g + B >>> 0;
            } return n.endian([c, a, l, g]); }; i._ff = function (r, n, t, o, e, u, i) { var f = r + (n & t | ~n & o) + (e >>> 0) + i; return (f << u | f >>> 32 - u) + n; }, i._gg = function (r, n, t, o, e, u, i) { var f = r + (n & o | t & ~o) + (e >>> 0) + i; return (f << u | f >>> 32 - u) + n; }, i._hh = function (r, n, t, o, e, u, i) { var f = r + (n ^ t ^ o) + (e >>> 0) + i; return (f << u | f >>> 32 - u) + n; }, i._ii = function (r, n, t, o, e, u, i) { var f = r + (t ^ (n | ~o)) + (e >>> 0) + i; return (f << u | f >>> 32 - u) + n; }, i._blocksize = 16, i._digestsize = 16, r.exports = function (r, t) { if (void 0 === r || null === r)
                throw new Error("Illegal argument " + r); var o = n.wordsToBytes(i(r, t)); return t && t.asBytes ? o : t && t.asString ? u.bytesToString(o) : n.bytesToHex(o); }; }(); }, function (r, n) { !function () { var n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", t = { rotl: function (r, n) { return r << n | r >>> 32 - n; }, rotr: function (r, n) { return r << 32 - n | r >>> n; }, endian: function (r) { if (r.constructor == Number)
                    return 16711935 & t.rotl(r, 8) | 4278255360 & t.rotl(r, 24); for (var n = 0; n < r.length; n++)
                    r[n] = t.endian(r[n]); return r; }, randomBytes: function (r) { for (var n = []; r > 0; r--)
                    n.push(Math.floor(256 * Math.random())); return n; }, bytesToWords: function (r) { for (var n = [], t = 0, o = 0; t < r.length; t++, o += 8)
                    n[o >>> 5] |= r[t] << 24 - o % 32; return n; }, wordsToBytes: function (r) { for (var n = [], t = 0; t < 32 * r.length; t += 8)
                    n.push(r[t >>> 5] >>> 24 - t % 32 & 255); return n; }, bytesToHex: function (r) { for (var n = [], t = 0; t < r.length; t++)
                    n.push((r[t] >>> 4).toString(16)), n.push((15 & r[t]).toString(16)); return n.join(""); }, hexToBytes: function (r) { for (var n = [], t = 0; t < r.length; t += 2)
                    n.push(parseInt(r.substr(t, 2), 16)); return n; }, bytesToBase64: function (r) { for (var t = [], o = 0; o < r.length; o += 3)
                    for (var e = r[o] << 16 | r[o + 1] << 8 | r[o + 2], u = 0; u < 4; u++)
                        8 * o + 6 * u <= 8 * r.length ? t.push(n.charAt(e >>> 6 * (3 - u) & 63)) : t.push("="); return t.join(""); }, base64ToBytes: function (r) { r = r.replace(/[^A-Z0-9+\/]/gi, ""); for (var t = [], o = 0, e = 0; o < r.length; e = ++o % 4)
                    0 != e && t.push((n.indexOf(r.charAt(o - 1)) & Math.pow(2, -2 * e + 8) - 1) << 2 * e | n.indexOf(r.charAt(o)) >>> 6 - 2 * e); return t; } }; r.exports = t; }(); }, function (r, n) { function t(r) { return !!r.constructor && "function" == typeof r.constructor.isBuffer && r.constructor.isBuffer(r); } function o(r) { return "function" == typeof r.readFloatLE && "function" == typeof r.slice && t(r.slice(0, 0)); } r.exports = function (r) { return null != r && (t(r) || o(r) || !!r._isBuffer); }; }, function (r, n, t) { r.exports = t(1); }]);
        /* eslint-enable */ /* jshint ignore:end */
    })(Internal = CDVPurchase2.Internal || (CDVPurchase2.Internal = {}));
})(CDVPurchase2 || (CDVPurchase2 = {}));
/// <reference path="utils.ts" />
var CDVPurchase2;
(function (CDVPurchase2) {
    class Offer {
        constructor(options) {
            this.id = options.id;
            this.product = options.product;
            this.pricingPhases = options.pricingPhases;
            Object.defineProperty(this, 'productId', { enumerable: true, get: () => this.product.id });
            Object.defineProperty(this, 'platform', { enumerable: true, get: () => this.product.platform });
        }
    }
    __decorate([
        CDVPurchase2.Internal.Utils.nonEnumerable
    ], Offer.prototype, "product", void 0);
    CDVPurchase2.Offer = Offer;
})(CDVPurchase2 || (CDVPurchase2 = {}));
var CDVPurchase2;
(function (CDVPurchase2) {
    /** Ready callbacks */
    class ReadyCallbacks {
        constructor() {
            /** True when the plugin is ready */
            this.isReady = false;
            /** Callbacks when the store is ready */
            this.readyCallbacks = [];
        }
        /** Register a callback to be called when the plugin is ready. */
        add(cb) {
            if (this.isReady)
                return setTimeout(cb, 0);
            this.readyCallbacks.push(cb);
        }
        /** Calls the ready callbacks */
        trigger() {
            this.isReady = true;
            this.readyCallbacks.forEach(cb => setTimeout(cb, 0));
            this.readyCallbacks = [];
        }
    }
    CDVPurchase2.ReadyCallbacks = ReadyCallbacks;
})(CDVPurchase2 || (CDVPurchase2 = {}));
var CDVPurchase2;
(function (CDVPurchase2) {
    class Receipt {
        constructor(options) {
            this.platform = options.platform;
            this.transactions = options.transactions;
        }
        // async verify(): Promise<IError | undefined> {
        //     return {
        //         code: ErrorCode.VERIFICATION_FAILED,
        //         message: 'TODO: Not implemented yet',
        //     };
        // }
        hasTransaction(value) {
            return !!this.transactions.find(t => t === value);
        }
    }
    CDVPurchase2.Receipt = Receipt;
})(CDVPurchase2 || (CDVPurchase2 = {}));
var CDVPurchase2;
(function (CDVPurchase2) {
    let Internal;
    (function (Internal) {
        class RegisteredProducts {
            constructor() {
                this.list = [];
            }
            find(platform, id) {
                return this.list.find(rp => rp.platform === platform && rp.id === id);
            }
            add(product) {
                const products = Array.isArray(product) ? product : [product];
                const newProducts = products.filter(p => !this.find(p.platform, p.id));
                for (const p of newProducts)
                    this.list.push(p);
            }
            byPlatform() {
                const byPlatform = {};
                this.list.forEach(p => {
                    byPlatform[p.platform] = (byPlatform[p.platform] || []).concat(p);
                });
                return Object.keys(byPlatform).map(platform => ({
                    platform: platform,
                    products: byPlatform[platform]
                }));
            }
        }
        Internal.RegisteredProducts = RegisteredProducts;
    })(Internal = CDVPurchase2.Internal || (CDVPurchase2.Internal = {}));
})(CDVPurchase2 || (CDVPurchase2 = {}));
var CDVPurchase2;
(function (CDVPurchase2) {
    /** Retry failed requests
     *
     * When setup and/or load failed, the plugin will retry over and over till it can connect
     * to the store.
     *
     * However, to be nice with the battery, it'll double the retry timeout each time.
     *
     * Special case, when the device goes online, it'll trigger all retry callback in the queue.
     */
    class Retry {
        constructor(minTimeout = 5000, maxTimeout = 120000) {
            this.maxTimeout = 120000;
            this.minTimeout = 5000;
            this.retryTimeout = 5000;
            this.retries = [];
            this.minTimeout = minTimeout;
            this.maxTimeout = maxTimeout;
            this.retryTimeout = minTimeout;
            document.addEventListener("online", () => {
                const a = this.retries;
                this.retries = [];
                this.retryTimeout = this.minTimeout;
                for (var i = 0; i < a.length; ++i) {
                    clearTimeout(a[i].tid);
                    a[i].fn.call(this);
                }
            }, false);
        }
        retry(fn) {
            var tid = setTimeout(() => {
                this.retries = this.retries.filter(function (o) {
                    return tid !== o.tid;
                });
                fn();
            }, this.retryTimeout);
            this.retries.push({ tid: tid, fn: fn });
            this.retryTimeout *= 2;
            // Max out the waiting time to 2 minutes.
            if (this.retryTimeout > this.maxTimeout)
                this.retryTimeout = this.maxTimeout;
        }
    }
    CDVPurchase2.Retry = Retry;
})(CDVPurchase2 || (CDVPurchase2 = {}));
var CDVPurchase2;
(function (CDVPurchase2) {
    CDVPurchase2.PLUGIN_VERSION = '13.0.0';
    class StoreAdapterListener {
        constructor(delegate) { this.delegate = delegate; }
        productsUpdated(platform, products) {
            products.forEach(product => this.delegate.updatedCallbacks.trigger(product));
        }
    }
    class Store {
        constructor() {
            /** Payment platform adapters */
            this.adapters = new CDVPurchase2.Internal.Adapters();
            /** List of registered products */
            this.registeredProducts = new CDVPurchase2.Internal.RegisteredProducts();
            /** Logger */
            this.log = new CDVPurchase2.Internal.Log(this);
            /** Verbosity level for log */
            this.verbosity = CDVPurchase2.LogLevel.ERROR;
            this._validator = new CDVPurchase2.Internal.Validator(this);
            /** List of callbacks for the "ready" events */
            this._readyCallbacks = new CDVPurchase2.ReadyCallbacks();
            /** Callbacks when a product definition was updated */
            this.updatedCallbacks = new CDVPurchase2.Callbacks();
            /** Callbacks when a product is owned */
            this.ownedCallbacks = new CDVPurchase2.Callbacks();
            /** Callbacks when a transaction has been approved */
            this.approvedCallbacks = new CDVPurchase2.Callbacks();
            /** Callbacks when a transaction has been finished */
            this.finishedCallbacks = new CDVPurchase2.Callbacks();
            /** Callbacks when a receipt has been validated */
            this.verifiedCallbacks = new CDVPurchase2.Callbacks();
            this.errorCallbacks = new CDVPurchase2.Callbacks;
            this.version = CDVPurchase2.PLUGIN_VERSION;
            this.listener = new StoreAdapterListener({
                updatedCallbacks: this.updatedCallbacks,
            });
        }
        /** Get the application username as a string by either calling or returning Store.applicationUsername */
        getApplicationUsername() {
            if (this.applicationUsername instanceof Function)
                return this.applicationUsername();
            return this.applicationUsername;
        }
        /** Register a product */
        register(product) {
            this.registeredProducts.add(product);
        }
        /**
         * Call to initialize the in-app purchase plugin.
         *
         * @param platforms - List of payment platforms to initialize, default to Store.defaultPlatform().
         */
        initialize(platforms = [Store.defaultPlatform()]) {
            return __awaiter(this, void 0, void 0, function* () {
                const ret = this.adapters.initialize(platforms, this);
                ret.then(() => this._readyCallbacks.trigger());
                return ret;
            });
        }
        /**
         * @deprecated - use store.initialize(), store.update() or store.restorePurchases()
         */
        refresh() {
            throw new Error("use store.initialize() or store.update()");
        }
        /**
         * Call to refresh the price of products and status of purchases.
         */
        update() {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                // Load products metadata
                for (const registration of this.registeredProducts.byPlatform()) {
                    const products = yield ((_a = this.adapters.find(registration.platform)) === null || _a === void 0 ? void 0 : _a.load(registration.products));
                    products === null || products === void 0 ? void 0 : products.forEach(p => {
                        if (p instanceof CDVPurchase2.Product)
                            this.updatedCallbacks.trigger(p);
                    });
                }
            });
        }
        /** Register a callback to be called when the plugin is ready. */
        ready(cb) { this._readyCallbacks.add(cb); }
        when() {
            const ret = {
                updated: (cb) => (this.updatedCallbacks.push(cb), ret),
                owned: (cb) => (this.ownedCallbacks.push(cb), ret),
                approved: (cb) => (this.approvedCallbacks.push(cb), ret),
                finished: (cb) => (this.finishedCallbacks.push(cb), ret),
                verified: (cb) => (this.verifiedCallbacks.push(cb), ret),
            };
            return ret;
        }
        /** List of all active products */
        get products() {
            // concatenate products all all active platforms
            return [].concat(...this.adapters.list.map(a => a.products));
        }
        /** Find a product from its id and platform */
        get(productId, platform = Store.defaultPlatform()) {
            var _a;
            return (_a = this.adapters.find(platform)) === null || _a === void 0 ? void 0 : _a.products.find(p => p.id === productId);
        }
        /** List of all receipts */
        get receipts() {
            // concatenate products all all active platforms
            return [].concat(...this.adapters.list.map(a => a.receipts));
        }
        order(offer, additionalData) {
            return __awaiter(this, void 0, void 0, function* () {
                const adapter = this.adapters.find(offer.product.platform);
                if (!adapter)
                    return {
                        code: CDVPurchase2.ErrorCode.PAYMENT_NOT_ALLOWED,
                        message: 'Adapter not found for this platform (' + offer.product.platform + ')',
                    };
                return adapter.order(offer, additionalData);
            });
        }
        verify(receiptOrTransaction) {
            return __awaiter(this, void 0, void 0, function* () {
                this._validator.add(receiptOrTransaction);
                // Run validation after 50ms, so if the same receipt is to be validated multiple times it will just create one call.
                setTimeout(() => this._validator.run((receipt) => {
                    this.verifiedCallbacks.trigger(receipt);
                }), 50);
            });
        }
        finish(value) {
            return __awaiter(this, void 0, void 0, function* () {
            });
        }
        restorePurchases() {
            return __awaiter(this, void 0, void 0, function* () {
            });
        }
        /**
         * The default payment platform to use depending on the OS.
         *
         * - on iOS: `APPLE_APPSTORE`
         * - on Android: `GOOGLE_PLAY`
         */
        static defaultPlatform() {
            switch (cordova.platformId) {
                case 'android': return CDVPurchase2.Platform.GOOGLE_PLAY;
                case 'ios': return CDVPurchase2.Platform.APPLE_APPSTORE;
                default: return CDVPurchase2.Platform.TEST;
            }
        }
        error(error) {
            if (error instanceof Function)
                this.errorCallbacks.push(error);
            else
                this.errorCallbacks.trigger(error);
        }
    }
    CDVPurchase2.Store = Store;
    let WindowsStore;
    (function (WindowsStore) {
        class Adapter {
            constructor() {
                this.id = CDVPurchase2.Platform.WINDOWS_STORE;
                this.products = [];
                this.receipts = [];
            }
            initialize() {
                return __awaiter(this, void 0, void 0, function* () { return; });
            }
            load(products) {
                return __awaiter(this, void 0, void 0, function* () { return products.map(p => ({ code: CDVPurchase2.ErrorCode.PRODUCT_NOT_AVAILABLE, message: 'TODO' })); });
            }
        }
        WindowsStore.Adapter = Adapter;
    })(WindowsStore = CDVPurchase2.WindowsStore || (CDVPurchase2.WindowsStore = {}));
    let Braintree;
    (function (Braintree) {
        class Adapter {
            constructor() {
                this.id = CDVPurchase2.Platform.BRAINTREE;
                this.products = [];
                this.receipts = [];
            }
            initialize() {
                return __awaiter(this, void 0, void 0, function* () { return; });
            }
            load(products) {
                return __awaiter(this, void 0, void 0, function* () { return products.map(p => ({ code: CDVPurchase2.ErrorCode.PRODUCT_NOT_AVAILABLE, message: 'TODO' })); });
            }
            order(offer) {
                return __awaiter(this, void 0, void 0, function* () {
                    return {
                        code: CDVPurchase2.ErrorCode.UNKNOWN,
                        message: 'TODO: Not implemented'
                    };
                });
            }
        }
        Braintree.Adapter = Adapter;
    })(Braintree = CDVPurchase2.Braintree || (CDVPurchase2.Braintree = {}));
    let Test;
    (function (Test) {
        class Adapter {
            constructor() {
                this.id = CDVPurchase2.Platform.TEST;
                this.products = [];
                this.receipts = [];
            }
            initialize() {
                return __awaiter(this, void 0, void 0, function* () { return; });
            }
            load(products) {
                return __awaiter(this, void 0, void 0, function* () { return products.map(p => ({ code: CDVPurchase2.ErrorCode.PRODUCT_NOT_AVAILABLE, message: 'TODO' })); });
            }
            order(offer) {
                return __awaiter(this, void 0, void 0, function* () {
                    return {
                        code: CDVPurchase2.ErrorCode.UNKNOWN,
                        message: 'TODO: Not implemented'
                    };
                });
            }
        }
        Test.Adapter = Adapter;
    })(Test = CDVPurchase2.Test || (CDVPurchase2.Test = {}));
})(CDVPurchase2 || (CDVPurchase2 = {}));
window.Iaptic = CDVPurchase2;
setTimeout(() => {
    window.CDVPurchase2 = window.Iaptic;
    window.store = new CDVPurchase2.Store();
    Object.assign(window.store, CDVPurchase2.LogLevel, CDVPurchase2.ProductType, CDVPurchase2.ErrorCode);
}, 0);
/** window.store - the global store object */
// declare var store: CDVPurchase2.Store;
// window.store = new CDVPurchase2.Store();
var CDVPurchase2;
(function (CDVPurchase2) {
    class Transaction {
        constructor() {
            this.state = CDVPurchase2.TransactionState.REQUESTED;
            /** Product identifier */
            this.productId = '';
            /** Offer identifier */
            this.offerId = '';
            /** Transaction identifier */
            this.transactionId = '';
        }
    }
    CDVPurchase2.Transaction = Transaction;
})(CDVPurchase2 || (CDVPurchase2 = {}));
var CDVPurchase2;
(function (CDVPurchase2) {
    /** Types of In-App-Products */
    let ProductType;
    (function (ProductType) {
        /** Type: An consumable product, that can be purchased multiple time */
        ProductType["CONSUMABLE"] = "consumable";
        /** Type: A non-consumable product, that can purchased only once and the user keeps forever */
        ProductType["NON_CONSUMABLE"] = "non consumable";
        /** @deprecated use PAID_SUBSCRIPTION */
        ProductType["FREE_SUBSCRIPTION"] = "free subscription";
        /** Type: An auto-renewable subscription */
        ProductType["PAID_SUBSCRIPTION"] = "paid subscription";
        /** Type: An non-renewing subscription */
        ProductType["NON_RENEWING_SUBSCRIPTION"] = "non renewing subscription";
        /** Type: The application bundle */
        ProductType["APPLICATION"] = "application";
    })(ProductType = CDVPurchase2.ProductType || (CDVPurchase2.ProductType = {}));
    class Product {
        constructor(p) {
            /**
             * Product title from the store.
             */
            this.title = '';
            /**
             * Product full description from the store.
             */
            this.description = '';
            this.platform = p.platform;
            this.type = p.type;
            this.id = p.id;
            this.offers = [];
            Object.defineProperty(this, 'pricing', { enumerable: false });
        }
        get pricing() { var _a; return (_a = this.offers[0]) === null || _a === void 0 ? void 0 : _a.pricingPhases[0]; }
        /**
         * Find and return an offer for this product from its id
         *
         * If id isn't specified, returns the first offer.
         *
         * @param id - Identifier of the offer to return
         * @return An Offer or undefined if no match is found
         */
        getOffer(id = '') {
            if (!id)
                return this.offers[0];
            return this.offers.find(o => o.id === id);
        }
        /**
         * Find and return an offer for this product from its id
         *
         * If id isn't specified, returns the first offer.
         *
         * @param id - Identifier of the offer to return
         */
        addOffer(offer) {
            if (this.getOffer(offer.id))
                return;
            this.offers.push(offer);
        }
    }
    CDVPurchase2.Product = Product;
    /**
     * Type of recurring payment
     *
     * - FINITE_RECURRING: Payment recurs for a fixed number of billing period set in `paymentPhase.cycles`.
     * - INFINITE_RECURRING: Payment recurs for infinite billing periods unless cancelled.
     * - NON_RECURRING: A one time charge that does not repeat.
     */
    let RecurrenceMode;
    (function (RecurrenceMode) {
        RecurrenceMode["NON_RECURRING"] = "NON_RECURRING";
        RecurrenceMode["FINITE_RECURRING"] = "FINITE_RECURRING";
        RecurrenceMode["INFINITE_RECURRING"] = "INFINITE_RECURRING";
    })(RecurrenceMode = CDVPurchase2.RecurrenceMode || (CDVPurchase2.RecurrenceMode = {}));
    let PaymentMode;
    (function (PaymentMode) {
        PaymentMode["PAY_AS_YOU_GO"] = "PayAsYouGo";
        PaymentMode["UP_FRONT"] = "UpFront";
        PaymentMode["FREE_TRIAL"] = "FreeTrial";
    })(PaymentMode = CDVPurchase2.PaymentMode || (CDVPurchase2.PaymentMode = {}));
    let Platform;
    (function (Platform) {
        /** Apple AppStore */
        Platform["APPLE_APPSTORE"] = "ios-appstore";
        /** Google Play */
        Platform["GOOGLE_PLAY"] = "android-playstore";
        /** Windows Store */
        Platform["WINDOWS_STORE"] = "windows-store-transaction";
        /** Braintree */
        Platform["BRAINTREE"] = "braintree";
        // /** Stripe */
        // STRIPE = 'stripe',
        /** Test platform */
        Platform["TEST"] = "dummy-store";
    })(Platform = CDVPurchase2.Platform || (CDVPurchase2.Platform = {}));
    /** Possible states of a product */
    let TransactionState;
    (function (TransactionState) {
        TransactionState["REQUESTED"] = "requested";
        TransactionState["INITIATED"] = "initiated";
        TransactionState["APPROVED"] = "approved";
        TransactionState["CANCELLED"] = "cancelled";
        TransactionState["FINISHED"] = "finished";
        TransactionState["OWNED"] = "owned";
        TransactionState["EXPIRED"] = "expired";
    })(TransactionState = CDVPurchase2.TransactionState || (CDVPurchase2.TransactionState = {}));
})(CDVPurchase2 || (CDVPurchase2 = {}));
var CDVPurchase2;
(function (CDVPurchase2) {
    let Internal;
    (function (Internal) {
        class ReceiptsToValidate {
            constructor() {
                this.array = [];
            }
            get() {
                return this.array.concat();
            }
            add(receipt) {
                if (!this.has(receipt))
                    this.array.push(receipt);
            }
            clear() {
                while (this.array.length !== 0)
                    this.array.pop();
            }
            has(receipt) {
                return !!this.array.find(el => el === receipt);
            }
        }
        Internal.ReceiptsToValidate = ReceiptsToValidate;
        class Validator {
            constructor(controller) {
                this.receipts = new ReceiptsToValidate();
                this.controller = controller;
            }
            add(receiptOrTransaction) {
                const receipt = (receiptOrTransaction instanceof CDVPurchase2.Transaction)
                    ? this.controller.receipts.filter(r => r.hasTransaction(receiptOrTransaction))[0]
                    : receiptOrTransaction;
                if (receipt) {
                    this.receipts.add(receipt);
                }
            }
            run(onVerified) {
                // pseudo implementation
                const receipts = this.receipts.get();
                this.receipts.clear();
                receipts.forEach(receipt => {
                    setTimeout(() => onVerified(receipt), 0);
                });
            }
        }
        Internal.Validator = Validator;
    })(Internal = CDVPurchase2.Internal || (CDVPurchase2.Internal = {}));
})(CDVPurchase2 || (CDVPurchase2 = {}));
/// <reference path="../types.ts" />
/// <reference path="../receipt.ts" />
/// <reference path="../offer.ts" />
/// <reference path="../transaction.ts" />
var CDVPurchase2;
(function (CDVPurchase2) {
    // Apple
    let AppleStore;
    (function (AppleStore) {
        class SKReceipt extends CDVPurchase2.Receipt {
        }
        AppleStore.SKReceipt = SKReceipt;
        class SKProduct extends CDVPurchase2.Product {
        }
        AppleStore.SKProduct = SKProduct;
        class SKOffer extends CDVPurchase2.Offer {
        }
        AppleStore.SKOffer = SKOffer;
        class SKTransaction extends CDVPurchase2.Transaction {
        }
        AppleStore.SKTransaction = SKTransaction;
        class Adapter {
            constructor(context) {
                this.id = CDVPurchase2.Platform.APPLE_APPSTORE;
                this.products = [];
                this.receipts = [];
            }
            initialize() {
                return __awaiter(this, void 0, void 0, function* () { return; });
            }
            load(products) {
                return __awaiter(this, void 0, void 0, function* () {
                    return products.map(p => ({ code: CDVPurchase2.ErrorCode.LOAD, message: 'Not implemented' }));
                });
            }
            order(offer) {
                return __awaiter(this, void 0, void 0, function* () {
                    return {
                        code: CDVPurchase2.ErrorCode.UNKNOWN,
                        message: 'TODO: Not implemented'
                    };
                });
            }
        }
        AppleStore.Adapter = Adapter;
    })(AppleStore = CDVPurchase2.AppleStore || (CDVPurchase2.AppleStore = {}));
})(CDVPurchase2 || (CDVPurchase2 = {}));
var CDVPurchase2;
(function (CDVPurchase2) {
    let GooglePlay;
    (function (GooglePlay) {
        class Adapter {
            constructor(context, autoRefreshIntervalMillis = 1000 * 3600 * 24) {
                /** Adapter identifier */
                this.id = CDVPurchase2.Platform.GOOGLE_PLAY;
                this._products = new GooglePlay.Products();
                this._receipts = [];
                /** The GooglePlay bridge */
                this.bridge = new GooglePlay.Bridge();
                /** Prevent double initialization */
                this.initialized = false;
                /** Used to retry failed commands */
                this.retry = new CDVPurchase2.Retry();
                this.autoRefreshIntervalMillis = 0;
                if (Adapter._instance)
                    throw new Error('GooglePlay adapter already initialized');
                this.autoRefreshIntervalMillis = autoRefreshIntervalMillis;
                this.context = context;
                this.log = context.log.child('GooglePlay');
                Adapter._instance = this;
            }
            /** List of products managed by the GooglePlay adapter */
            get products() { return this._products.products; }
            get receipts() { return this._receipts; }
            initialize() {
                return __awaiter(this, void 0, void 0, function* () {
                    this.log.info("Initialize");
                    if (this.initializationPromise)
                        return this.initializationPromise;
                    return this.initializationPromise = new Promise((resolve) => {
                        const bridgeLogger = this.log.child('Bridge');
                        const iabOptions = {
                            onSetPurchases: this.onSetPurchases.bind(this),
                            onPurchasesUpdated: this.onPurchasesUpdated.bind(this),
                            onPurchaseConsumed: this.onPurchaseConsumed.bind(this),
                            showLog: this.context.verbosity >= CDVPurchase2.LogLevel.DEBUG ? true : false,
                            log: (msg) => bridgeLogger.info(msg),
                        };
                        const iabReady = () => {
                            this.log.debug("Ready");
                            // Auto-refresh every 24 hours (or autoRefreshIntervalMillis)
                            if (this.autoRefreshIntervalMillis > 0) {
                                window.setInterval(() => this.getPurchases(), this.autoRefreshIntervalMillis);
                            }
                            resolve(undefined);
                        };
                        const iabError = (err) => {
                            this.initialized = false;
                            this.context.error({
                                code: CDVPurchase2.ErrorCode.SETUP,
                                message: "Init failed - " + err
                            });
                            this.retry.retry(() => this.initialize());
                        };
                        this.bridge.init(iabReady, iabError, iabOptions);
                    });
                });
            }
            /** Prepare the list of SKUs sorted by type */
            getSkusOf(products) {
                const inAppSkus = [];
                const subsSkus = [];
                for (const product of products) {
                    if (product.type === CDVPurchase2.ProductType.PAID_SUBSCRIPTION)
                        subsSkus.push(product.id);
                    else
                        inAppSkus.push(product.id);
                }
                return { inAppSkus, subsSkus };
            }
            /** Loads product metadata from the store */
            load(products) {
                return new Promise((resolve) => {
                    this.log.debug("Load: " + JSON.stringify(products));
                    /** Called when a list of product definitions have been loaded */
                    const iabLoaded = (validProducts) => {
                        this.log.debug("Loaded: " + JSON.stringify(validProducts));
                        const ret = products.map(registeredProduct => {
                            const validProduct = validProducts.find(vp => vp.productId === registeredProduct.id);
                            if (validProduct && validProduct.productId) {
                                return this._products.addProduct(registeredProduct, validProduct);
                            }
                            else {
                                return {
                                    code: CDVPurchase2.ErrorCode.INVALID_PRODUCT_ID,
                                    message: `Product with id ${registeredProduct.id} not found.`,
                                };
                            }
                        });
                        resolve(ret);
                    };
                    /** Start loading products */
                    const go = () => {
                        const { inAppSkus, subsSkus } = this.getSkusOf(products);
                        this.log.debug("getAvailableProducts: " + JSON.stringify(inAppSkus) + " | " + JSON.stringify(subsSkus));
                        this.bridge.getAvailableProducts(inAppSkus, subsSkus, iabLoaded, (err) => {
                            // failed to load products, retry later.
                            this.retry.retry(go);
                            this.context.error({
                                code: CDVPurchase2.ErrorCode.LOAD,
                                message: 'Loading product info failed - ' + err + ' - retrying later...'
                            });
                        });
                    };
                    go();
                });
            }
            onPurchaseConsumed(purchase) {
            }
            onPurchasesUpdated(purchases) {
            }
            onSetPurchases(purchases) {
            }
            onPriceChangeConfirmationResult(result) {
            }
            getPurchases(callback) {
                if (callback) {
                    setTimeout(callback, 0);
                }
            }
            order(offer, additionalData) {
                return __awaiter(this, void 0, void 0, function* () {
                    return new Promise(resolve => {
                        this.log.info("Order - " + JSON.stringify(offer));
                        const transaction = new CDVPurchase2.Transaction();
                        transaction.productId = offer.product.id;
                        transaction.offerId = offer.id;
                        transaction.state = CDVPurchase2.TransactionState.REQUESTED;
                        const buySuccess = () => {
                            resolve(transaction);
                        };
                        const buyFailed = (message, code) => {
                            this.log.warn('Order failed: ' + JSON.stringify({ message, code }));
                            resolve({ code: code !== null && code !== void 0 ? code : CDVPurchase2.ErrorCode.UNKNOWN, message });
                        };
                        this.bridge.buy(buySuccess, buyFailed, offer.product.id + '@' + offer.id, additionalData);
                    });
                });
            }
        }
        GooglePlay.Adapter = Adapter;
    })(GooglePlay = CDVPurchase2.GooglePlay || (CDVPurchase2.GooglePlay = {}));
})(CDVPurchase2 || (CDVPurchase2 = {}));
/*
 * Copyright (C) 2012-2013 by Guillaume Charhon
 * Modifications 10/16/2013 by Brian Thurlow
 */
/*global cordova */
var CDVPurchase2;
(function (CDVPurchase2) {
    let GooglePlay;
    (function (GooglePlay) {
        let log = function log(msg) {
            console.log("InAppBilling[js]: " + msg);
        };
        class Bridge {
            constructor() {
                this.options = {};
            }
            init(success, fail, options) {
                if (!options)
                    options = {};
                if (options.log)
                    log = options.log;
                this.options = {
                    showLog: options.showLog !== false,
                    onPurchaseConsumed: options.onPurchaseConsumed,
                    onPurchasesUpdated: options.onPurchasesUpdated,
                    onSetPurchases: options.onSetPurchases,
                };
                if (this.options.showLog) {
                    log('setup ok');
                }
                // Set a listener (see "listener()" function above)
                const listener = this.listener.bind(this);
                cordova.exec(listener, function (err) { }, "InAppBillingPlugin", "setListener", []);
                cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "init", []);
            }
            load(success, fail, skus, inAppSkus, subsSkus) {
                var hasSKUs = false;
                // Optional Load SKUs to Inventory.
                if (typeof skus !== "undefined") {
                    if (typeof skus === "string") {
                        skus = [skus];
                    }
                    if (skus.length > 0) {
                        if (typeof skus[0] !== 'string') {
                            var msg = 'invalid productIds: ' + JSON.stringify(skus);
                            if (this.options.showLog) {
                                log(msg);
                            }
                            fail(msg, CDVPurchase2.ErrorCode.INVALID_PRODUCT_ID);
                            return;
                        }
                        if (this.options.showLog) {
                            log('load ' + JSON.stringify(skus));
                        }
                        hasSKUs = true;
                    }
                }
                cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "load", [skus, inAppSkus, subsSkus]);
            }
            listener(msg) {
                // Handle changes to purchase that are being notified
                // through the PurchasesUpdatedListener on the native side (android)
                if (this.options.showLog) {
                    log('listener: ' + JSON.stringify(msg));
                }
                if (!msg || !msg.type) {
                    return;
                }
                if (msg.type === "setPurchases" && this.options.onSetPurchases) {
                    this.options.onSetPurchases(msg.data.purchases);
                }
                if (msg.type === "purchasesUpdated" && this.options.onPurchasesUpdated) {
                    this.options.onPurchasesUpdated(msg.data.purchases);
                }
                if (msg.type === "purchaseConsumed" && this.options.onPurchaseConsumed) {
                    this.options.onPurchaseConsumed(msg.data.purchase);
                }
                if (msg.type === "onPriceChangeConfirmationResultOK" && this.options.onPriceChangeConfirmationResult) {
                    this.options.onPriceChangeConfirmationResult("OK");
                }
                if (msg.type === "onPriceChangeConfirmationResultUserCanceled" && this.options.onPriceChangeConfirmationResult) {
                    this.options.onPriceChangeConfirmationResult("UserCanceled");
                }
                if (msg.type === "onPriceChangeConfirmationResultUnknownSku" && this.options.onPriceChangeConfirmationResult) {
                    this.options.onPriceChangeConfirmationResult("UnknownProduct");
                }
            }
            getPurchases(success, fail) {
                if (this.options.showLog) {
                    log('getPurchases()');
                }
                return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "getPurchases", ["null"]);
            }
            buy(success, fail, productId, additionalData) {
                if (this.options.showLog) {
                    log('buy()');
                }
                return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "buy", [
                    productId, extendAdditionalData(additionalData)
                ]);
            }
            subscribe(success, fail, productId, additionalData) {
                var _a;
                if (this.options.showLog) {
                    log('subscribe()');
                }
                if (((_a = additionalData.googlePlay) === null || _a === void 0 ? void 0 : _a.oldPurchasedSkus) && this.options.showLog) {
                    log('subscribe() -> upgrading of old SKUs!');
                }
                return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "subscribe", [
                    productId, extendAdditionalData(additionalData)
                ]);
            }
            consumePurchase(success, fail, productId, transactionId, developerPayload) {
                if (this.options.showLog) {
                    log('consumePurchase()');
                }
                return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "consumePurchase", [productId, transactionId, developerPayload]);
            }
            acknowledgePurchase(success, fail, productId, transactionId, developerPayload) {
                if (this.options.showLog) {
                    log('acknowledgePurchase()');
                }
                return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "acknowledgePurchase", [productId, transactionId, developerPayload]);
            }
            getAvailableProducts(inAppSkus, subsSkus, success, fail) {
                if (this.options.showLog) {
                    log('getAvailableProducts()');
                }
                return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "getAvailableProducts", [inAppSkus, subsSkus]);
            }
            manageSubscriptions() {
                return cordova.exec(function () { }, function () { }, "InAppBillingPlugin", "manageSubscriptions", []);
            }
            manageBilling() {
                return cordova.exec(function () { }, function () { }, "InAppBillingPlugin", "manageBilling", []);
            }
            launchPriceChangeConfirmationFlow(productId) {
                return cordova.exec(function () { }, function () { }, "InAppBillingPlugin", "launchPriceChangeConfirmationFlow", [productId]);
            }
        }
        GooglePlay.Bridge = Bridge;
        // Generates a `fail` function that accepts an optional error code
        // in the first part of the error string.
        //
        // format: `code|message`
        //
        // `fail` function will be called with `message` as a first argument
        // and `code` as a second argument (or undefined). This ensures
        // backward compatibility with legacy code
        function errorCb(fail) {
            return function (error) {
                if (!fail)
                    return;
                const tokens = typeof error === 'string' ? error.split('|') : [];
                if (tokens.length > 1 && /^[-+]?(\d+)$/.test(tokens[0])) {
                    var code = tokens[0];
                    var message = tokens[1];
                    fail(message, +code);
                }
                else {
                    fail(error);
                }
            };
        }
        function ensureObject(obj) {
            return !!obj && obj.constructor === Object ? obj : {};
        }
        function extendAdditionalData(ad) {
            const additionalData = ensureObject(ad === null || ad === void 0 ? void 0 : ad.googlePlay);
            if (!additionalData.accountId && (ad === null || ad === void 0 ? void 0 : ad.applicationUsername)) {
                additionalData.accountId = CDVPurchase2.Internal.Utils.md5(ad.applicationUsername);
            }
            return additionalData;
        }
        // window.inappbilling = new Bridge();
        // That's for compatibility with the unified IAP plugin.
        // try {
        //     store.internals.inappbilling = window.inappbilling;
        // }
        // catch (e) {
        //     log(e);
        // }
    })(GooglePlay = CDVPurchase2.GooglePlay || (CDVPurchase2.GooglePlay = {}));
})(CDVPurchase2 || (CDVPurchase2 = {}));
/// <reference path="../../offer.ts" />
var CDVPurchase2;
(function (CDVPurchase2) {
    let GooglePlay;
    (function (GooglePlay) {
        class GooglePlayProduct extends CDVPurchase2.Product {
        }
        GooglePlay.GooglePlayProduct = GooglePlayProduct;
        class GooglePlayInAppOffer extends CDVPurchase2.Offer {
            constructor() {
                super(...arguments);
                this.type = 'inapp';
            }
        }
        GooglePlay.GooglePlayInAppOffer = GooglePlayInAppOffer;
        class GooglePlaySubscriptionOffer extends CDVPurchase2.Offer {
            constructor(options) {
                super(options);
                this.type = 'subs';
                this.tags = options.tags;
                this.token = options.token;
            }
        }
        GooglePlay.GooglePlaySubscriptionOffer = GooglePlaySubscriptionOffer;
        class Products {
            constructor() {
                /** List of products managed by the GooglePlay adapter */
                this.products = [];
                /** List of offers managed by the GooglePlay adapter */
                this.offers = [];
            }
            getProduct(id) {
                return this.products.find(p => p.id === id);
            }
            getOffer(id) {
                return this.offers.find(p => p.id === id);
            }
            /**  */
            addProduct(registeredProduct, vp) {
                const existingProduct = this.getProduct(registeredProduct.id);
                const p = existingProduct !== null && existingProduct !== void 0 ? existingProduct : new CDVPurchase2.Product(registeredProduct);
                p.title = vp.title || vp.name || p.title;
                p.description = vp.description || p.description;
                // Process the product depending on the format
                if ('product_format' in vp && vp.product_format === "v12.0") {
                    if (vp.product_type === "subs")
                        this.onSubsV12Loaded(p, vp);
                    else
                        this.onInAppLoaded(p, vp);
                }
                // else if ('billing_period_unit' in vp) {
                //     return this.iabSubsV11Loaded(p, vp);
                // }
                else {
                    this.onInAppLoaded(p, vp);
                }
                if (!existingProduct) {
                    this.products.push(p);
                }
                return p;
            }
            onSubsV12Loaded(product, vp) {
                // console.log('iabSubsV12Loaded: ' + JSON.stringify(vp));
                vp.offers.forEach((productOffer) => {
                    const offer = this.iabSubsOfferV12Loaded(product, vp, productOffer);
                    product.addOffer(offer);
                });
                /*
                var firstOffer = vp.offers[0];
                if (firstOffer && firstOffer.pricing_phases.length > 0) {
                    const attributes = {
                        state: store.VALID,
                        title: vp.name,
                        description: vp.description,
                        offers: vp.offers.map(function (offer) {
                            return vp.productId + '@' + offer.token;
                        }),
                    };
                    this.iabSubsAddV12Attributes(attributes, firstOffer);
                    const p = this.getProduct(vp.productId);
                    p.set(attributes);
                    p.trigger("loaded");
                }
                */
                return product;
            }
            iabSubsOfferV12Loaded(product, vp, productOffer) {
                const id = vp.productId + '@' + productOffer.token;
                const existingOffer = this.getOffer(id);
                const pricingPhases = productOffer.pricing_phases.map(p => this.toPricingPhase(p));
                if (existingOffer) {
                    existingOffer.pricingPhases = pricingPhases;
                    return existingOffer;
                }
                else {
                    const offer = new GooglePlaySubscriptionOffer({ id, product, pricingPhases, token: productOffer.token, tags: productOffer.tags });
                    this.offers.push(offer);
                    return offer;
                }
                /*
                // Backward compatibility (might be incomplete if user have complex pricing models, but might as well be complete...)
                if (productOffer.pricing_phases.length > 0) {
                    iabSubsAddV12Attributes(offerAttributes, productOffer);
                }
                var offerP = store.get(offerAttributes.id);
                if (!offerP) {
                    store.register(offerAttributes);
                    offerP = store.get(offerAttributes.id);
                }
                offerP.set(offerAttributes);
                offerP.trigger("loaded");
                */
            }
            /*
            private iabSubsV11Loaded(p: Product, vp: SubscriptionV11): Product {
                // console.log('iabSubsV11Loaded: ' + JSON.stringify(vp));
                var p = store.products.byId[vp.productId];
                var attributes = {
                    state: store.VALID,
                    title: vp.name || trimTitle(vp.title),
                    description: vp.description,
                };
                var currency = vp.price_currency_code || "";
                var price = vp.formatted_price || vp.price;
                var priceMicros = vp.price_amount_micros;
                var subscriptionPeriod = vp.subscriptionPeriod ? vp.subscriptionPeriod : "";
                var introPriceSubscriptionPeriod = vp.introductoryPricePeriod ? vp.introductoryPricePeriod : "";
                var introPriceNumberOfPeriods = vp.introductoryPriceCycles ? vp.introductoryPriceCycles : 0;
                var introPricePeriodUnit = normalizeISOPeriodUnit(introPriceSubscriptionPeriod);
                var introPricePeriodCount = normalizeISOPeriodCount(introPriceSubscriptionPeriod);
                var introPricePeriod = (introPriceNumberOfPeriods || 1) * (introPricePeriodCount || 1);
                var introPriceMicros = vp.introductoryPriceAmountMicros ? vp.introductoryPriceAmountMicros : "";
                var introPrice = vp.introductoryPrice ? vp.introductoryPrice : "";
                var introPricePaymentMode;

                if (vp.freeTrialPeriod) {
                    introPricePaymentMode = 'FreeTrial';
                    try {
                        introPricePeriodUnit = normalizeISOPeriodUnit(vp.freeTrialPeriod);
                        introPricePeriodCount = normalizeISOPeriodCount(vp.freeTrialPeriod);
                        introPricePeriod = introPricePeriodCount;
                    }
                    catch (e) {
                        store.log.warn('Failed to parse free trial period: ' + vp.freeTrialPeriod);
                    }
                }
                else if (vp.introductoryPrice) {
                    if (vp.introductoryPrice < vp.price && subscriptionPeriod === introPriceSubscriptionPeriod) {
                        introPricePaymentMode = 'PayAsYouGo';
                    }
                    else if (introPriceNumberOfPeriods === 1) {
                        introPricePaymentMode = 'UpFront';
                    }
                }

                if (!introPricePaymentMode) {
                    introPricePeriod = null;
                    introPricePeriodUnit = null;
                }

                var parsedSubscriptionPeriod = {};
                if (subscriptionPeriod) {
                    parsedSubscriptionPeriod.unit = normalizeISOPeriodUnit(subscriptionPeriod);
                    parsedSubscriptionPeriod.count = normalizeISOPeriodCount(subscriptionPeriod);
                }

                var trialPeriod = vp.trial_period || null;
                var trialPeriodUnit = vp.trial_period_unit || null;
                var billingPeriod = parsedSubscriptionPeriod.count || vp.billing_period || null;
                var billingPeriodUnit = parsedSubscriptionPeriod.unit || vp.billing_period_unit || null;

                var pricingPhases = [];
                if (trialPeriod) {
                    pricingPhases.push({
                        paymentMode: 'FreeTrial',
                        recurrenceMode: store.FINITE_RECURRING,
                        period: vp.freeTrialPeriod || toISO8601Duration(trialPeriodUnit, trialPeriod),
                        cycles: 1,
                        price: null,
                        priceMicros: 0,
                        currency: currency,
                    });
                }
                else if (introPricePeriod) {
                    pricingPhases.push({
                        paymentMode: 'PayAsYouGo',
                        recurrenceMode: store.FINITE_RECURRING,
                        period: vp.introPriceSubscriptionPeriod || toISO8601Duration(introPricePeriodUnit, introPricePeriodCount),
                        cycles: vp.introductoryPriceCycles || 1,
                        price: null, // formatted price not available
                        priceMicros: introPriceMicros,
                        currency: currency,
                    });
                }

                pricingPhases.push({
                    paymentMode: 'PayAsYouGo',
                    recurrenceMode: store.INFINITE_RECURRING,
                    period: vp.subscriptionPeriod || toISO8601Duration(billingPeriodUnit, billingPeriod), // ISO8601 duration
                    cycles: 0,
                    price: price,
                    priceMicros: priceMicros,
                    currency: currency,
                });
                attributes.pricingPhases = pricingPhases;

                if (store.compatibility > 0 && store.compatibility < 11.999) {
                    Object.assign(attributes, {
                        price: price,
                        priceMicros: priceMicros,
                        currency: currency,
                        trialPeriod: trialPeriod,
                        trialPeriodUnit: trialPeriodUnit,
                        billingPeriod: billingPeriod,
                        billingPeriodUnit: billingPeriodUnit,
                        introPrice: introPrice,
                        introPriceMicros: introPriceMicros,
                        introPricePeriod: introPricePeriod,
                        introPricePeriodUnit: introPricePeriodUnit,
                        introPricePaymentMode: introPricePaymentMode,
                    });
                }

                if (store.compatibility > 0 && store.compatibility < 9.999) {
                    Object.assign(attributes, {
                        introPriceNumberOfPeriods: introPricePeriod,
                        introPriceSubscriptionPeriod: introPricePeriodUnit,
                    });
                }

                p.set(attributes);
                p.trigger("loaded");
            }
            */
            onInAppLoaded(p, vp) {
                var _a, _b, _c, _d;
                // console.log('iabInAppLoaded: ' + JSON.stringify(vp));
                const existingOffer = this.getOffer(vp.productId);
                const pricingPhases = [{
                        price: (_b = (_a = vp.formatted_price) !== null && _a !== void 0 ? _a : vp.price) !== null && _b !== void 0 ? _b : `${((_c = vp.price_amount_micros) !== null && _c !== void 0 ? _c : 0) / 1000000} ${vp.price_currency_code}`,
                        priceMicros: (_d = vp.price_amount_micros) !== null && _d !== void 0 ? _d : 0,
                        currency: vp.price_currency_code,
                        recurrenceMode: CDVPurchase2.RecurrenceMode.NON_RECURRING,
                    }];
                if (existingOffer) {
                    // state: store.VALID,
                    // title: vp.name || trimTitle(vp.title),
                    // description: vp.description,
                    // currency: vp.price_currency_code || "",
                    // price: vp.formatted_price || vp.price,
                    // priceMicros: vp.price_amount_micros,
                    existingOffer.pricingPhases = pricingPhases;
                    p.offers = [existingOffer];
                }
                else {
                    const newOffer = new GooglePlayInAppOffer({ id: vp.productId, product: p, pricingPhases });
                    this.offers.push(newOffer);
                    p.offers = [newOffer];
                }
                // p.set({
                //     state: store.VALID,
                //     title: vp.name || trimTitle(vp.title),
                //     description: vp.description,
                //     currency: vp.price_currency_code || "",
                //     price: vp.formatted_price || vp.price,
                //     priceMicros: vp.price_amount_micros,
                // });
                // p.trigger("loaded");
                return p;
            }
            toPaymentMode(phase) {
                return phase.price_amount_micros === 0
                    ? CDVPurchase2.PaymentMode.FREE_TRIAL
                    : phase.recurrence_mode === GooglePlay.BridgeRecurrenceModeV12.NON_RECURRING
                        ? CDVPurchase2.PaymentMode.UP_FRONT
                        : CDVPurchase2.PaymentMode.PAY_AS_YOU_GO;
            }
            toRecurrenceMode(mode) {
                switch (mode) {
                    case GooglePlay.BridgeRecurrenceModeV12.FINITE_RECURRING: return CDVPurchase2.RecurrenceMode.FINITE_RECURRING;
                    case GooglePlay.BridgeRecurrenceModeV12.INFINITE_RECURRING: return CDVPurchase2.RecurrenceMode.INFINITE_RECURRING;
                    case GooglePlay.BridgeRecurrenceModeV12.NON_RECURRING: return CDVPurchase2.RecurrenceMode.NON_RECURRING;
                }
            }
            toPricingPhase(phase) {
                return {
                    price: phase.formatted_price,
                    priceMicros: phase.price_amount_micros,
                    currency: phase.price_currency_code,
                    billingPeriod: phase.billing_period,
                    billingCycles: phase.billing_cycle_count,
                    recurrenceMode: this.toRecurrenceMode(phase.recurrence_mode),
                    paymentMode: this.toPaymentMode(phase),
                };
            }
        }
        GooglePlay.Products = Products;
    })(GooglePlay = CDVPurchase2.GooglePlay || (CDVPurchase2.GooglePlay = {}));
})(CDVPurchase2 || (CDVPurchase2 = {}));
var CDVPurchase2;
(function (CDVPurchase2) {
    let GooglePlay;
    (function (GooglePlay) {
        let BridgeRecurrenceModeV12;
        (function (BridgeRecurrenceModeV12) {
            BridgeRecurrenceModeV12["FINITE_RECURRING"] = "FINITE_RECURRING";
            BridgeRecurrenceModeV12["INFINITE_RECURRING"] = "INFINITE_RECURRING";
            BridgeRecurrenceModeV12["NON_RECURRING"] = "NON_RECURRING";
        })(BridgeRecurrenceModeV12 = GooglePlay.BridgeRecurrenceModeV12 || (GooglePlay.BridgeRecurrenceModeV12 = {}));
    })(GooglePlay = CDVPurchase2.GooglePlay || (CDVPurchase2.GooglePlay = {}));
})(CDVPurchase2 || (CDVPurchase2 = {}));
