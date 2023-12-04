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
var CdvPurchase;
(function (CdvPurchase) {
    const ERROR_CODES_BASE = 6777000;
    /**
     * Error codes
     */
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
        /**
         * Server code used when a subscription expired.
         *
         * @deprecated Validator should now return the transaction in the collection as expired.
         */
        ErrorCode[ErrorCode["VALIDATOR_SUBSCRIPTION_EXPIRED"] = 6778003] = "VALIDATOR_SUBSCRIPTION_EXPIRED";
    })(ErrorCode = CdvPurchase.ErrorCode || (CdvPurchase.ErrorCode = {}));
    /**
     * Create an {@link IError} instance
     *
     * @internal
     */
    function storeError(code, message, platform, productId) {
        return { isError: true, code, message, platform, productId };
    }
    CdvPurchase.storeError = storeError;
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    /**
     * Integrate with https://www.iaptic.com/
     *
     * @example
     * const iaptic = new CdvPurchase.Iaptic({
     *   url: 'https://validator.iaptic.com',
     *   appName: 'test',
     *   apiKey: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
     * });
     * store.validator = iaptic.validator;
     */
    class Iaptic {
        constructor(config, store) {
            this.config = config;
            if (!config.url) {
                config.url = 'https://validator.iaptic.com';
            }
            this.store = store !== null && store !== void 0 ? store : CdvPurchase.store;
            this.log = this.store.log.child('Iaptic');
        }
        /**
         * Provides a client token generated on iaptic's servers
         *
         * Can be passed to the Braintree Adapter at initialization.
         *
         * @example
         * store.initialize([
         *   {
         *     platform: Platform.BRAINTREE,
         *     options: {
         *       clientTokenProvider: iaptic.braintreeClientTokenProvider
         *     }
         *   }
         * ]);
         */
        get braintreeClientTokenProvider() {
            return callback => {
                this.log.info('Calling Braintree clientTokenProvider');
                CdvPurchase.Utils.ajax(this.log, {
                    url: `${this.config.url}/v3/braintree/client-token?appName=${this.config.appName}&apiKey=${this.config.apiKey}`,
                    method: 'POST',
                    data: {
                        applicationUsername: CdvPurchase.store.getApplicationUsername(),
                        customerId: CdvPurchase.Braintree.customerId,
                    },
                    success: body => {
                        this.log.info('clientTokenProvider success: ' + JSON.stringify(body));
                        callback(body.clientToken);
                    },
                    error: err => {
                        this.log.info('clientTokenProvider error: ' + JSON.stringify(err));
                        callback(CdvPurchase.storeError(err, 'ERROR ' + err, CdvPurchase.Platform.BRAINTREE, null));
                    },
                });
            };
        }
        /**
         * Determine the eligibility of discounts based on the content of the application receipt.
         *
         * The secret sauce used here is to wait for validation of the application receipt.
         * The receipt validator will return the necessary data to determine eligibility.
         *
         * Receipt validation is expected to happen after loading product information, so the implementation here is to
         * wait for a validation response.
         */
        get appStoreDiscountEligibilityDeterminer() {
            // the user needs the appStoreDiscountEligibilityDeterminer, let's start listening to receipt validation events.
            let latestReceipt;
            this.log.debug("AppStore eligibility determiner is listening...");
            this.store.when().verified(receipt => {
                if (receipt.platform === CdvPurchase.Platform.APPLE_APPSTORE) {
                    this.log.debug("Got a verified AppStore receipt.");
                    latestReceipt = receipt;
                }
            }, 'appStoreDiscountEligibilityDeterminer_listening');
            const determiner = (_appStoreReceipt, requests, callback) => {
                this.log.debug("AppStore eligibility determiner");
                if (latestReceipt) {
                    this.log.debug("Using cached receipt");
                    return callback(analyzeReceipt(latestReceipt, requests));
                }
                const onVerified = (receipt) => {
                    if (receipt.platform === CdvPurchase.Platform.APPLE_APPSTORE) {
                        this.log.debug("Receipt is verified, let's analyze the content and respond.");
                        this.store.off(onVerified);
                        callback(analyzeReceipt(receipt, requests));
                    }
                };
                this.log.debug("Waiting for receipt");
                this.store.when().verified(onVerified, 'appStoreDiscountEligibilityDeterminer_waiting');
            };
            determiner.cacheReceipt = function (receipt) {
                latestReceipt = receipt;
            };
            return determiner;
            function analyzeReceipt(receipt, requests) {
                const ineligibleIntro = receipt.raw.ineligible_for_intro_price;
                return requests.map(request => {
                    var _a;
                    if (request.discountType === 'Introductory' && ineligibleIntro && ineligibleIntro.find(id => request.productId === id)) {
                        // User is not eligible for this introductory offer
                        return false;
                    }
                    else if (request.discountType === 'Subscription') {
                        // Discount only available if user is or was a subscriber
                        const matchingPurchase = (_a = receipt.raw.collection) === null || _a === void 0 ? void 0 : _a.find(purchase => purchase.id === request.productId);
                        return matchingPurchase ? true : false;
                    }
                    else {
                        // In other cases, assume the user is eligible
                        return true;
                    }
                });
            }
        }
        /** Validator URL */
        get validator() {
            return `${this.config.url}/v1/validate?appName=${this.config.appName}&apiKey=${this.config.apiKey}`;
        }
    }
    CdvPurchase.Iaptic = Iaptic;
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    /**
     * Desired logging level for the {@link Logger}
     *
     * @see {@link Store.verbosity}
     */
    let LogLevel;
    (function (LogLevel) {
        /** Disable all logging (default) */
        LogLevel[LogLevel["QUIET"] = 0] = "QUIET";
        /** Show only error messages */
        LogLevel[LogLevel["ERROR"] = 1] = "ERROR";
        /** Show warnings and errors */
        LogLevel[LogLevel["WARNING"] = 2] = "WARNING";
        /** Also show information messages */
        LogLevel[LogLevel["INFO"] = 3] = "INFO";
        /** Enable internal debugging messages. */
        LogLevel[LogLevel["DEBUG"] = 4] = "DEBUG";
    })(LogLevel = CdvPurchase.LogLevel || (CdvPurchase.LogLevel = {}));
    ;
    class Logger {
        /** @internal */
        constructor(store, prefix = '') {
            /** All log lines are prefixed with this string */
            this.prefix = '';
            this.store = store;
            this.prefix = prefix || 'CdvPurchase';
        }
        /**
         * Create a child logger, whose prefix will be this one's + the given string.
         *
         * @example
         * const log = store.log.child('AppStore')
         */
        child(prefix) {
            return new Logger(this.store, this.prefix + '.' + prefix);
        }
        /**
         * Logs an error message, only if `store.verbosity` >= store.ERROR
         */
        error(o) {
            log(this.store.verbosity, LogLevel.ERROR, this.prefix, o);
            // show the stack trace
            try {
                throw new Error(toString(o));
            }
            catch (e) {
                log(this.store.verbosity, LogLevel.ERROR, this.prefix, e.stack);
            }
        }
        /**
         * Logs a warning message, only if `store.verbosity` >= store.WARNING
         */
        warn(o) { log(this.store.verbosity, LogLevel.WARNING, this.prefix, o); }
        /**
         * Logs an info message, only if `store.verbosity` >= store.INFO
         */
        info(o) { log(this.store.verbosity, LogLevel.INFO, this.prefix, o); }
        /**
         * Logs a debug message, only if `store.verbosity` >= store.DEBUG
         */
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
    /**
     * Console object used to display log lines.
     *
     * It can be replaced by your implementation if you want to, for example, send logs to a remote server.
     *
     * @example
     * Logger.console = {
     *   log: (message) => { remoteLog('LOG', message); }
     *   warn: (message) => { remoteLog('WARN', message); }
     *   error: (message) => { remoteLog('ERROR', message); }
     * }
     */
    Logger.console = window.console;
    CdvPurchase.Logger = Logger;
    const LOG_LEVEL_STRING = ["QUIET", "ERROR", "WARNING", "INFO", "DEBUG"];
    function toString(o) {
        if (typeof o !== 'string')
            o = JSON.stringify(o);
        return o;
    }
    function log(verbosity, level, prefix, o) {
        var maxLevel = verbosity === true ? 1 : verbosity;
        if (level > maxLevel)
            return;
        if (typeof o !== 'string')
            o = JSON.stringify(o);
        const fullPrefix = prefix ? `[${prefix}] ` : '';
        const logStr = (level === LogLevel.ERROR) ? ((str) => Logger.console.error(str))
            : (level === LogLevel.WARNING) ? ((str) => Logger.console.warn(str))
                : ((str) => Logger.console.log(str));
        if (LOG_LEVEL_STRING[level])
            logStr(`${fullPrefix}${LOG_LEVEL_STRING[level]}: ${o}`);
        else
            logStr(`${fullPrefix}${o}`);
    }
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    let Utils;
    (function (Utils) {
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
    })(Utils = CdvPurchase.Utils || (CdvPurchase.Utils = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    /** Product definition from a store */
    class Product {
        /** @internal */
        constructor(p, decorator) {
            /** @internal */
            this.className = 'Product';
            /** Product title from the store. */
            this.title = '';
            /** Product full description from the store. */
            this.description = '';
            this.platform = p.platform;
            this.type = p.type;
            this.id = p.id;
            this.group = p.group;
            this.offers = [];
            Object.defineProperty(this, 'pricing', { enumerable: false, get: () => { var _a; return (_a = this.offers[0]) === null || _a === void 0 ? void 0 : _a.pricingPhases[0]; } });
            Object.defineProperty(this, 'canPurchase', { enumerable: false, get: () => decorator.canPurchase(this) });
            Object.defineProperty(this, 'owned', { enumerable: false, get: () => decorator.owned(this) });
        }
        /**
         * Shortcut to offers[0].pricingPhases[0]
         *
         * Useful when you know products have a single offer and a single pricing phase.
         */
        get pricing() {
            var _a;
            // see Object.defineProperty in the constructor for the actual implementation.
            return (_a = this.offers[0]) === null || _a === void 0 ? void 0 : _a.pricingPhases[0];
        }
        /**
         * Returns true if the product can be purchased.
         */
        get canPurchase() {
            // Pseudo implementation to make typescript happy.
            // see Object.defineProperty in the constructor for the actual implementation.
            return false;
        }
        /**
         * Returns true if the product is owned.
         */
        get owned() {
            // Pseudo implementation to make typescript happy.
            // see Object.defineProperty in the constructor for the actual implementation.
            return false;
        }
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
         * Add an offer to this product.
         *
         * @internal
         */
        addOffer(offer) {
            if (this.getOffer(offer.id))
                return this;
            this.offers.push(offer);
            return this;
        }
    }
    CdvPurchase.Product = Product;
})(CdvPurchase || (CdvPurchase = {}));
// Functions defined here so we can generate code compatible with old version of JS
var CdvPurchase;
(function (CdvPurchase) {
    let Utils;
    (function (Utils) {
        /** Object.values() for ES6 */
        function objectValues(obj) {
            const ret = [];
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    ret.push(obj[key]);
                }
            }
            return ret;
        }
        Utils.objectValues = objectValues;
    })(Utils = CdvPurchase.Utils || (CdvPurchase.Utils = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    let Utils;
    (function (Utils) {
        /** Returns human format name for a given platform */
        function platformName(platform) {
            switch (platform) {
                case CdvPurchase.Platform.APPLE_APPSTORE:
                    return "App Store";
                case CdvPurchase.Platform.GOOGLE_PLAY:
                    return "Google Play";
                case CdvPurchase.Platform.WINDOWS_STORE:
                    return "Windows Store";
                case CdvPurchase.Platform.BRAINTREE:
                    return "Braintree";
                case CdvPurchase.Platform.TEST:
                    return "Test";
                default: return platform;
            }
        }
        Utils.platformName = platformName;
    })(Utils = CdvPurchase.Utils || (CdvPurchase.Utils = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    /**
     * @internal
     */
    let Internal;
    (function (Internal) {
        /** Queue of receipts to validate */
        class ReceiptsToValidate {
            constructor() {
                this.array = [];
            }
            get length() {
                return this.array.length;
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
        /** Handles communication with the remote receipt validation service */
        class Validator {
            constructor(controller, log) {
                /** List of receipts waiting for validation */
                this.receiptsToValidate = new ReceiptsToValidate();
                /** List of verified receipts */
                this.verifiedReceipts = [];
                this.numRequests = 0;
                this.numResponses = 0;
                /**
                 * For each md5-hashed values of the validator request's ".transaction" field,
                 * store the response from the server.
                 *
                 * This way, if a subsequent request is necessary (without a couple of minutes)
                 * we just reuse the same data.
                 */
                this.cache = {};
                this.controller = controller;
                this.log = log.child('Validator');
            }
            incrRequestsCounter() {
                this.numRequests = (this.numRequests + 1) | 0;
                this.log.debug(`Validation requests=${this.numRequests} responses=${this.numResponses}`);
            }
            incrResponsesCounter() {
                this.numResponses = (this.numResponses + 1) | 0;
                this.log.debug(`Validation requests=${this.numRequests} responses=${this.numResponses}`);
            }
            /** Add/update a verified receipt from the server response */
            addVerifiedReceipt(receipt, data) {
                for (const vr of this.verifiedReceipts) {
                    if (vr.platform === receipt.platform && vr.id === data.id) {
                        // update existing receipt
                        this.log.debug("Updating existing receipt.");
                        vr.set(receipt, data);
                        return vr;
                    }
                }
                this.log.debug("Register a new verified receipt.");
                const newVR = new CdvPurchase.VerifiedReceipt(receipt, data, this.controller);
                this.verifiedReceipts.push(newVR);
                return newVR;
            }
            /** Add a receipt to the validation queue. It'll get validated after a few milliseconds. */
            add(receiptOrTransaction) {
                this.log.debug("Schedule validation: " + JSON.stringify(receiptOrTransaction));
                const receipt = (receiptOrTransaction instanceof CdvPurchase.Transaction) ? receiptOrTransaction.parentReceipt : receiptOrTransaction;
                if (!this.receiptsToValidate.has(receipt)) {
                    this.incrRequestsCounter();
                    this.receiptsToValidate.add(receipt);
                }
            }
            /** Run validation for all receipts in the queue */
            run() {
                // pseudo implementation
                const receipts = this.receiptsToValidate.get();
                this.receiptsToValidate.clear();
                const onResponse = (r) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const { receipt, payload } = r;
                    this.incrResponsesCounter();
                    try {
                        const adapter = this.controller.adapters.find(receipt.platform);
                        yield (adapter === null || adapter === void 0 ? void 0 : adapter.handleReceiptValidationResponse(receipt, payload));
                        if (payload.ok) {
                            const vr = this.addVerifiedReceipt(receipt, payload.data);
                            this.controller.verifiedCallbacks.trigger(vr, 'payload_ok');
                            // this.verifiedCallbacks.trigger(data.receipt);
                        }
                        else if (payload.code === CdvPurchase.ErrorCode.VALIDATOR_SUBSCRIPTION_EXPIRED) {
                            // find the subscription in an existing verified receipt and mark as expired.
                            const transactionId = (_a = receipt.lastTransaction()) === null || _a === void 0 ? void 0 : _a.transactionId;
                            const vr = transactionId ? this.verifiedReceipts.find(r => { var _a; return ((_a = r.collection[0]) === null || _a === void 0 ? void 0 : _a.transactionId) === transactionId; }) : undefined;
                            if (vr) {
                                vr === null || vr === void 0 ? void 0 : vr.collection.forEach(col => {
                                    if (col.transactionId === transactionId)
                                        col.isExpired = true;
                                });
                                this.controller.verifiedCallbacks.trigger(vr, 'payload_expired');
                            }
                            else {
                                this.controller.unverifiedCallbacks.trigger({ receipt, payload }, 'no_verified_receipt');
                            }
                        }
                        else {
                            this.controller.unverifiedCallbacks.trigger({ receipt, payload }, 'validator_error');
                        }
                    }
                    catch (err) {
                        this.log.error('Exception probably caused by an invalid response from the validator.' + err.message);
                        this.controller.unverifiedCallbacks.trigger({ receipt, payload: {
                                ok: false,
                                code: CdvPurchase.ErrorCode.VERIFICATION_FAILED,
                                message: err.message,
                            } }, 'validator_exception');
                    }
                });
                receipts.forEach(receipt => this.runOnReceipt(receipt, onResponse));
            }
            runOnReceipt(receipt, callback) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (receipt.platform === CdvPurchase.Platform.TEST) {
                        this.log.debug('Using Test Adapter mock verify function.');
                        return CdvPurchase.Test.Adapter.verify(receipt, callback);
                    }
                    if (!this.controller.validator) {
                        this.incrResponsesCounter();
                        // for backward compatibility, we consider that the receipt is verified.
                        callback({
                            receipt,
                            payload: {
                                ok: true,
                                data: {
                                    id: receipt.transactions[0].transactionId,
                                    latest_receipt: true,
                                    transaction: { type: 'test' } // dummy data
                                }
                            }
                        });
                        return;
                    }
                    const body = yield this.buildRequestBody(receipt);
                    if (!body) {
                        this.incrResponsesCounter();
                        return;
                    }
                    if (typeof this.controller.validator === 'function')
                        return this.runValidatorFunction(this.controller.validator, receipt, body, callback);
                    const target = typeof this.controller.validator === 'string'
                        ? {
                            url: this.controller.validator,
                            timeout: 20000, // validation request will timeout after 20 seconds by default
                        }
                        : this.controller.validator;
                    return this.runValidatorRequest(target, receipt, body, callback);
                });
            }
            runValidatorFunction(validator, receipt, body, callback) {
                try {
                    validator(body, (payload) => callback({ receipt, payload }));
                }
                catch (error) {
                    this.log.warn("user provided validator function failed with error: " + (error === null || error === void 0 ? void 0 : error.stack));
                }
            }
            buildRequestBody(receipt) {
                var _a, _b, _c;
                return __awaiter(this, void 0, void 0, function* () {
                    // Let the adapter generate the initial content
                    const adapter = this.controller.adapters.find(receipt.platform);
                    const body = yield (adapter === null || adapter === void 0 ? void 0 : adapter.receiptValidationBody(receipt));
                    if (!body)
                        return;
                    // Add the applicationUsername
                    body.additionalData = Object.assign(Object.assign({}, (_a = body.additionalData) !== null && _a !== void 0 ? _a : {}), { applicationUsername: this.controller.getApplicationUsername() });
                    if (!body.additionalData.applicationUsername)
                        delete body.additionalData.applicationUsername;
                    // Add device information
                    body.device = Object.assign(Object.assign({}, (_b = body.device) !== null && _b !== void 0 ? _b : {}), CdvPurchase.Validator.Internal.getDeviceInfo(this.controller));
                    // Add legacy pricing information
                    if (((_c = body.offers) === null || _c === void 0 ? void 0 : _c.length) === 1) {
                        const offer = body.offers[0];
                        if (offer.pricingPhases.length === 1) {
                            const pricing = offer.pricingPhases[0];
                            body.currency = pricing.currency;
                            body.priceMicros = pricing.priceMicros;
                        }
                        else if (offer.pricingPhases.length === 2) {
                            const pricing = offer.pricingPhases[1];
                            body.currency = pricing.currency;
                            body.priceMicros = pricing.priceMicros;
                            const intro = offer.pricingPhases[0];
                            body.introPriceMicros = intro.priceMicros;
                        }
                    }
                    return body;
                });
            }
            removeExpiredCache() {
                const now = +new Date();
                const deleteList = [];
                for (const hash in this.cache) {
                    if (this.cache[hash].expires < now) {
                        deleteList.push(hash);
                    }
                }
                for (const hash of deleteList) {
                    delete this.cache[hash];
                }
            }
            runValidatorRequest(target, receipt, body, callback) {
                this.removeExpiredCache();
                const bodyTransactionHash = CdvPurchase.Utils.md5(JSON.stringify(body.transaction));
                const cached = this.cache[bodyTransactionHash];
                if (cached) {
                    return callback({ receipt, payload: cached.payload });
                }
                CdvPurchase.Utils.ajax(this.log.child("Ajax"), {
                    url: target.url,
                    method: 'POST',
                    customHeaders: target.headers,
                    timeout: target.timeout,
                    data: body,
                    success: (response) => {
                        var _a;
                        this.log.debug("validator success, response: " + JSON.stringify(response));
                        if (!isValidatorResponsePayload(response))
                            return callback({
                                receipt,
                                payload: {
                                    ok: false,
                                    code: CdvPurchase.ErrorCode.BAD_RESPONSE,
                                    message: 'Validator responded with invalid data',
                                    data: { latest_receipt: (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.latest_receipt },
                                }
                            });
                        this.cache[bodyTransactionHash] = {
                            payload: response,
                            expires: (+new Date()) + 120000, // expires in 2 minutes
                        };
                        callback({ receipt, payload: response });
                    },
                    error: (status, message, data) => {
                        var fullMessage = "Error " + status + ": " + message;
                        this.log.debug("validator failed, response: " + JSON.stringify(fullMessage));
                        this.log.debug("body => " + JSON.stringify(data));
                        callback({
                            receipt,
                            payload: {
                                ok: false,
                                message: fullMessage,
                                code: CdvPurchase.ErrorCode.COMMUNICATION,
                                status: status,
                                data: {},
                            }
                        });
                    }
                });
            }
        }
        Internal.Validator = Validator;
        /**
         * Check if a payload looks like a valid validator response.
         */
        function isValidatorResponsePayload(payload) {
            // TODO: could be made more robust.
            return (!!payload)
                && (typeof payload === 'object')
                && ('ok' in payload)
                && (typeof payload.ok === 'boolean');
        }
    })(Internal = CdvPurchase.Internal || (CdvPurchase.Internal = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    /** @internal */
    let Internal;
    (function (Internal) {
        /**
         * The list of active platform adapters
         */
        class Adapters {
            constructor() {
                /**
                 * List of instantiated adapters.
                 *
                 * They are added to this list by "initialize()".
                 */
                this.list = [];
            }
            add(log, adapters, context) {
                adapters.forEach(po => {
                    log.info("");
                    if (this.find(po.platform))
                        return;
                    switch (po.platform) {
                        case CdvPurchase.Platform.APPLE_APPSTORE:
                            return this.list.push(new CdvPurchase.AppleAppStore.Adapter(context, po.options || {}));
                        case CdvPurchase.Platform.GOOGLE_PLAY:
                            return this.list.push(new CdvPurchase.GooglePlay.Adapter(context));
                        case CdvPurchase.Platform.BRAINTREE:
                            if (!po.options) {
                                log.error('Options missing for Braintree initialization. Use {platform: Platform.BRAINTREE, options: {...}} in your call to store.initialize');
                            }
                            return this.list.push(new CdvPurchase.Braintree.Adapter(context, po.options));
                        case CdvPurchase.Platform.TEST:
                            return this.list.push(new CdvPurchase.Test.Adapter(context));
                        default:
                            return;
                    }
                });
            }
            /**
             * Initialize some platform adapters.
             */
            initialize(platforms, context) {
                return __awaiter(this, void 0, void 0, function* () {
                    const newPlatforms = platforms.map(p => typeof p === 'string' ? { platform: p } : p).filter(p => !this.find(p.platform));
                    const log = context.log.child('Adapters');
                    log.info("Adding platforms: " + JSON.stringify(newPlatforms));
                    this.add(log, newPlatforms, context);
                    const products = context.registeredProducts.byPlatform();
                    const result = yield Promise.all(newPlatforms.map((platformToInit) => __awaiter(this, void 0, void 0, function* () {
                        var _a, _b, _c;
                        const platformProducts = (_c = (_b = (_a = products.filter(p => p.platform === platformToInit.platform)) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.products) !== null && _c !== void 0 ? _c : [];
                        const adapter = this.find(platformToInit.platform);
                        if (!adapter)
                            return;
                        log.info(`${adapter.name} initializing...`);
                        if (!adapter.isSupported) {
                            log.info(`${adapter.name} is not supported.`);
                            return; // skip unsupported adapters
                        }
                        const initResult = yield adapter.initialize();
                        adapter.ready = true;
                        log.info(`${adapter.name} initialized. ${initResult ? JSON.stringify(initResult) : ''}`);
                        if (initResult === null || initResult === void 0 ? void 0 : initResult.code)
                            return initResult;
                        log.info(`${adapter.name} products: ${JSON.stringify(platformProducts)}`);
                        if (platformProducts.length === 0)
                            return;
                        let loadProductsResult = [];
                        let loadReceiptsResult = [];
                        if (adapter.supportsParallelLoading) {
                            [loadProductsResult, loadReceiptsResult] = yield Promise.all([
                                adapter.loadProducts(platformProducts),
                                adapter.loadReceipts()
                            ]);
                        }
                        else {
                            loadProductsResult = yield adapter.loadProducts(platformProducts);
                            loadReceiptsResult = yield adapter.loadReceipts();
                        }
                        // const loadProductsResult = await adapter.loadProducts(platformProducts);
                        log.info(`${adapter.name} products loaded: ${JSON.stringify(loadProductsResult)}`);
                        const loadedProducts = loadProductsResult.filter(p => p instanceof CdvPurchase.Product);
                        context.listener.productsUpdated(platformToInit.platform, loadedProducts);
                        // const loadReceiptsResult = await adapter.loadReceipts();
                        log.info(`${adapter.name} receipts loaded: ${JSON.stringify(loadReceiptsResult)}`);
                        return loadProductsResult.filter(lr => 'code' in lr && 'message' in lr)[0];
                    })));
                    return result.filter(err => err);
                });
            }
            /**
             * Retrieve a platform adapter.
             */
            find(platform) {
                return this.list.filter(a => a.id === platform)[0];
            }
            /**
             * Retrieve the first platform adapter in the ready state, if any.
             *
             * You can optionally force the platform adapter you are looking for.
             *
             * Useful for methods that accept an optional "platform" argument, so they either act
             * on the only active adapter or on the one selected by the user, if it's ready.
             */
            findReady(platform) {
                return this.list.filter(adapter => (!platform || adapter.id === platform) && adapter.ready)[0];
            }
        }
        Internal.Adapters = Adapters;
    })(Internal = CdvPurchase.Internal || (CdvPurchase.Internal = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    let Internal;
    (function (Internal) {
        /**
         * Monitor the updates for products and receipt.
         *
         * Call the callbacks when appropriate.
         */
        class StoreAdapterListener {
            constructor(delegate, log) {
                /** The list of supported platforms, needs to be set by "store.initialize" */
                this.supportedPlatforms = [];
                /** Those platforms have reported that their receipts are ready */
                this.platformWithReceiptsReady = [];
                this.lastTransactionState = {};
                /** Store the listener's latest calling time (in ms) for a given transaction at a given state */
                this.lastCallTimeForState = {};
                this.delegate = delegate;
                this.log = log.child('AdapterListener');
            }
            static makeTransactionToken(transaction) {
                return transaction.platform + '|' + transaction.transactionId;
            }
            /**
             * Set the list of supported platforms.
             *
             * Called by the store when it is initialized.
             */
            setSupportedPlatforms(platforms) {
                this.log.debug(`setSupportedPlatforms: ${platforms.join(',')} (${this.platformWithReceiptsReady.length} have their receipts ready)`);
                this.supportedPlatforms = platforms;
                if (this.supportedPlatforms.length === this.platformWithReceiptsReady.length) {
                    this.log.debug('triggering receiptsReady()');
                    this.delegate.receiptsReadyCallbacks.trigger(undefined, 'adapterListener_setSupportedPlatforms');
                }
            }
            /**
             * Trigger the "receiptsReady" event when all platforms have reported that their receipts are ready.
             *
             * This function is used by adapters to report that their receipts are ready.
             * Once all adapters have reported their receipts, the "receiptsReady" event is triggered.
             *
             * @param platform The platform that has its receipts ready.
             */
            receiptsReady(platform) {
                if (this.supportedPlatforms.length > 0 && this.platformWithReceiptsReady.length === this.supportedPlatforms.length) {
                    this.log.debug('receiptsReady: ' + platform + '(skipping)');
                    return;
                }
                if (this.platformWithReceiptsReady.indexOf(platform) < 0) {
                    this.platformWithReceiptsReady.push(platform);
                    this.log.debug(`receiptsReady: ${platform} (${this.platformWithReceiptsReady.length}/${this.supportedPlatforms.length})`);
                    if (this.platformWithReceiptsReady.length === this.supportedPlatforms.length) {
                        this.log.debug('triggering receiptsReady()');
                        this.delegate.receiptsReadyCallbacks.trigger(undefined, 'adapterListener_receiptsReady');
                    }
                }
            }
            /**
             * Trigger the "updated" event for each product.
             */
            productsUpdated(platform, products) {
                products.forEach(product => this.delegate.updatedCallbacks.trigger(product, 'adapterListener_productsUpdated'));
            }
            /**
             * Triggers the "approved", "pending" and "finished" events for transactions.
             *
             * - "approved" is triggered only if it hasn't been called for the same transaction in the last 5 seconds.
             * - "finished" and "pending" are triggered only if the transaction state has changed.
             *
             * @param platform The platform that has its receipts updated.
             * @param receipts The receipts that have been updated.
             */
            receiptsUpdated(platform, receipts) {
                const now = +new Date();
                this.log.debug("receiptsUpdated: " + JSON.stringify(receipts));
                receipts.forEach(receipt => {
                    this.delegate.updatedReceiptCallbacks.trigger(receipt, 'adapterListener_receiptsUpdated');
                    receipt.transactions.forEach(transaction => {
                        const transactionToken = StoreAdapterListener.makeTransactionToken(transaction);
                        const tokenWithState = transactionToken + '@' + transaction.state;
                        const lastState = this.lastTransactionState[transactionToken];
                        // Retrigger "approved", so validation is rerun on potential update.
                        if (transaction.state === CdvPurchase.TransactionState.APPROVED) {
                            // prevent calling approved twice in a very short period (60 seconds).
                            if ((this.lastCallTimeForState[tokenWithState] | 0) < now - 60000) {
                                this.delegate.approvedCallbacks.trigger(transaction, 'adapterListener_receiptsUpdated_approved');
                                this.lastCallTimeForState[tokenWithState] = now;
                            }
                        }
                        else if (lastState !== transaction.state) {
                            if (transaction.state === CdvPurchase.TransactionState.FINISHED) {
                                this.delegate.finishedCallbacks.trigger(transaction, 'adapterListener_receiptsUpdated_finished');
                                this.lastCallTimeForState[tokenWithState] = now;
                            }
                            else if (transaction.state === CdvPurchase.TransactionState.PENDING) {
                                this.delegate.pendingCallbacks.trigger(transaction, 'adapterListener_receiptsUpdated_pending');
                                this.lastCallTimeForState[tokenWithState] = now;
                            }
                        }
                        this.lastTransactionState[transactionToken] = transaction.state;
                    });
                });
            }
        }
        Internal.StoreAdapterListener = StoreAdapterListener;
    })(Internal = CdvPurchase.Internal || (CdvPurchase.Internal = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    let Internal;
    (function (Internal) {
        /**
         * Manage a list of callbacks
         */
        class Callbacks {
            /**
             * @param className - Type of callbacks (used to help with debugging)
             * @param finalStateMode - If true, newly registered callbacks will be called immediately when the event was already triggered.
             */
            constructor(logger, className, finalStateMode = false) {
                /** List of registered callbacks */
                this.callbacks = [];
                /** Number of times those callbacks have been triggered */
                this.numTriggers = 0;
                this.logger = logger;
                this.className = className;
                this.finalStateMode = finalStateMode;
            }
            /** Add a callback to the list */
            push(callback, callbackName) {
                if (this.finalStateMode && this.numTriggers > 0) {
                    callback(this.lastTriggerArgument);
                }
                else {
                    // Detecting double registration to help with debugging issues
                    for (const existing of this.callbacks) {
                        if (existing.callback === callback) {
                            throw new Error('REGISTERING THE SAME CALLBACK TWICE? This is indicative of a bug in your integration.');
                        }
                    }
                    this.callbacks.push({ callback, callbackName });
                }
            }
            /** Call all registered callbacks with the given value */
            trigger(value, reason) {
                this.lastTriggerArgument = value;
                this.numTriggers++;
                const callbacks = this.callbacks;
                if (this.finalStateMode) {
                    // in final state mode, callbacks are only triggered once
                    this.callbacks = [];
                }
                callbacks.forEach(callback => {
                    CdvPurchase.Utils.safeCall(this.logger, this.className, callback.callback, value, callback.callbackName, reason);
                });
            }
            /** Remove a callback from the list */
            remove(callback) {
                this.callbacks = this.callbacks.filter(el => el.callback !== callback);
            }
        }
        Internal.Callbacks = Callbacks;
    })(Internal = CdvPurchase.Internal || (CdvPurchase.Internal = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    /** @internal */
    let Internal;
    (function (Internal) {
        /**
         * Ready callbacks
         */
        class ReadyCallbacks {
            constructor(logger) {
                /** True when the plugin is ready */
                this.isReady = false;
                /** Callbacks when the store is ready */
                this.readyCallbacks = [];
                this.logger = logger;
            }
            /** Register a callback to be called when the plugin is ready. */
            add(cb) {
                if (this.isReady)
                    return setTimeout(cb, 0);
                this.readyCallbacks.push(cb);
            }
            /** Calls the ready callbacks */
            trigger(reason) {
                this.isReady = true;
                this.readyCallbacks.forEach(cb => CdvPurchase.Utils.safeCall(this.logger, 'ready()', cb, undefined, undefined, reason));
                this.readyCallbacks = [];
            }
            remove(cb) {
                this.readyCallbacks = this.readyCallbacks.filter(el => el !== cb);
            }
        }
        Internal.ReadyCallbacks = ReadyCallbacks;
    })(Internal = CdvPurchase.Internal || (CdvPurchase.Internal = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    let Internal;
    (function (Internal) {
        function isValidRegisteredProduct(product) {
            if (typeof product !== 'object')
                return false;
            return product.hasOwnProperty('platform')
                && product.hasOwnProperty('id')
                && product.hasOwnProperty('type');
        }
        class RegisteredProducts {
            constructor() {
                this.list = [];
            }
            find(platform, id) {
                return this.list.find(rp => rp.platform === platform && rp.id === id);
            }
            add(product) {
                const errors = [];
                const products = Array.isArray(product) ? product : [product];
                const newProducts = products.filter(p => !this.find(p.platform, p.id));
                for (const p of newProducts) {
                    if (isValidRegisteredProduct(p))
                        this.list.push(p);
                    else
                        errors.push(CdvPurchase.storeError(CdvPurchase.ErrorCode.LOAD, 'Invalid parameter to "register", expected "id", "type" and "platform". '
                            + 'Got: ' + JSON.stringify(p), null, null));
                }
                return errors;
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
    })(Internal = CdvPurchase.Internal || (CdvPurchase.Internal = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    /** @internal */
    let Internal;
    (function (Internal) {
        /**
         * Helper class to monitor changes in transaction states.
         *
         * @example
         * const monitor = monitors.start(transaction, (state) => {
         *   // ... transaction state has changed
         * });
         * monitor.stop();
         */
        class TransactionStateMonitors {
            constructor(when) {
                this.monitors = [];
                when
                    .approved(transaction => this.callOnChange(transaction), 'transactionStateMonitors_callOnChange')
                    .finished(transaction => this.callOnChange(transaction), 'transactionStateMonitors_callOnChange');
            }
            findMonitors(transaction) {
                return this.monitors.filter(monitor => monitor.transaction.platform === transaction.platform
                    && monitor.transaction.transactionId === transaction.transactionId);
            }
            callOnChange(transaction) {
                this.findMonitors(transaction).forEach(monitor => {
                    if (monitor.lastChange !== transaction.state) {
                        monitor.lastChange = transaction.state;
                        monitor.onChange(transaction.state);
                    }
                });
            }
            /**
             * Start monitoring the provided transaction for state changes.
             */
            start(transaction, onChange) {
                const monitorId = CdvPurchase.Utils.uuidv4();
                this.monitors.push({ monitorId, transaction, onChange, lastChange: transaction.state });
                setTimeout(onChange, 0, transaction.state);
                return {
                    transaction,
                    stop: () => this.stop(monitorId),
                };
            }
            stop(monitorId) {
                this.monitors = this.monitors.filter(m => m.monitorId !== monitorId);
            }
        }
        Internal.TransactionStateMonitors = TransactionStateMonitors;
    })(Internal = CdvPurchase.Internal || (CdvPurchase.Internal = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    let Internal;
    (function (Internal) {
        class ReceiptsMonitor {
            constructor(controller) {
                this.hasCalledReceiptsVerified = false;
                this.controller = controller;
                this.log = controller.log.child('ReceiptsMonitor');
            }
            callReceiptsVerified() {
                if (this.hasCalledReceiptsVerified)
                    return;
                this.hasCalledReceiptsVerified = true;
                this.log.info('receiptsVerified()');
                // ensure those 2 events are called in order.
                this.controller.when().receiptsReady(() => {
                    setTimeout(() => {
                        this.controller.receiptsVerified();
                    }, 0);
                }, 'receiptsMonitor_callReceiptsVerified');
            }
            launch() {
                const check = () => {
                    this.log.debug(`check(${this.controller.numValidationResponses()}/${this.controller.numValidationRequests()})`);
                    if (this.controller.numValidationRequests() === this.controller.numValidationResponses()) {
                        if (this.intervalChecker !== undefined) {
                            clearInterval(this.intervalChecker);
                            this.intervalChecker = undefined;
                        }
                        this.controller.off(check);
                        this.callReceiptsVerified();
                    }
                };
                this.controller.when()
                    .verified(check, 'receiptsMonitor_check')
                    .unverified(check, 'receiptsMonitor_check')
                    .receiptsReady(() => {
                    this.log.debug('receiptsReady...');
                    if (!this.controller.hasLocalReceipts() || !this.controller.hasValidator()) {
                        setTimeout(() => {
                            check();
                        }, 0);
                    }
                    // check every 10s, to handle cases where neither "verified" nor "unverified" have been triggered.
                    this.intervalChecker = setInterval(() => {
                        this.log.debug('keep checking every 10s...');
                        check();
                    }, 10000);
                }, 'receiptsMonitor_setup');
            }
        }
        Internal.ReceiptsMonitor = ReceiptsMonitor;
    })(Internal = CdvPurchase.Internal || (CdvPurchase.Internal = {}));
})(CdvPurchase || (CdvPurchase = {}));
/**
 * The platform doesn't send notifications when a subscription expires.
 *
 * However this is useful, so let's do just that.
 */
var CdvPurchase;
(function (CdvPurchase) {
    let Internal;
    (function (Internal) {
        class ExpiryMonitor {
            /** Track active local transactions */
            // activeTransactions: {
            //   [transactionId: string]: true;
            // } = {};
            /** Track notified local transactions */
            // notifiedTransactions: {
            //   [transactionId: string]: true;
            // } = {};
            constructor(controller) {
                /** Track active verified purchases */
                this.activePurchases = {};
                /** Track notified verified purchases */
                this.notifiedPurchases = {};
                this.controller = controller;
            }
            launch() {
                this.interval = setInterval(() => {
                    var _a, _b;
                    const now = +new Date();
                    // Check for verified purchases expiry
                    for (const receipt of this.controller.verifiedReceipts) {
                        const gracePeriod = (_a = ExpiryMonitor.GRACE_PERIOD_MS[receipt.platform]) !== null && _a !== void 0 ? _a : ExpiryMonitor.GRACE_PERIOD_MS.DEFAULT;
                        for (const purchase of receipt.collection) {
                            if (purchase.expiryDate) {
                                const expiryDate = purchase.expiryDate + gracePeriod;
                                const transactionId = (_b = purchase.transactionId) !== null && _b !== void 0 ? _b : `${expiryDate}`;
                                if (expiryDate > now) {
                                    this.activePurchases[transactionId] = true;
                                }
                                if (expiryDate < now && this.activePurchases[transactionId] && !this.notifiedPurchases[transactionId]) {
                                    this.notifiedPurchases[transactionId] = true;
                                    this.controller.onVerifiedPurchaseExpired(purchase, receipt);
                                }
                            }
                        }
                    }
                    // Check for local purchases expiry
                    // for (const receipt of this.controller.localReceipts) {
                    //   for (const transaction of receipt.transactions) {
                    //     if (transaction.expirationDate) {
                    //       const expirationDate = +transaction.expirationDate + ExpiryMonitor.GRACE_PERIOD_MS;
                    //       const transactionId = transaction.transactionId ?? `${expirationDate}`;
                    //       if (expirationDate > now) {
                    //         this.activeTransactions[transactionId] = true;
                    //       }
                    //       if (expirationDate < now && this.activeTransactions[transactionId] && !this.notifiedTransactions[transactionId]) {
                    //         this.notifiedTransactions[transactionId] = true;
                    //         this.controller.onTransactionExpired(transaction);
                    //       }
                    //     }
                    //   }
                    // }
                }, ExpiryMonitor.INTERVAL_MS);
            }
        }
        /** Time between checks for newly expired subscriptions */
        ExpiryMonitor.INTERVAL_MS = 10000;
        /**
         * Extra time until re-validating an expired subscription.
         *
         * The platform will take unspecified amount of time to report the renewal via their APIs.
         * Values below have been selected via trial-and-error, might require tweaking.
         */
        ExpiryMonitor.GRACE_PERIOD_MS = {
            DEFAULT: 60000,
            "ios-appstore": 60000,
            "android-playstore": 30000,
        };
        Internal.ExpiryMonitor = ExpiryMonitor;
    })(Internal = CdvPurchase.Internal || (CdvPurchase.Internal = {}));
})(CdvPurchase || (CdvPurchase = {}));
/// <reference path="types.ts" />
/// <reference path="utils/compatibility.ts" />
/// <reference path="utils/platform-name.ts" />
/// <reference path="validator/validator.ts" />
/// <reference path="log.ts" />
/// <reference path="internal/adapters.ts" />
/// <reference path="internal/adapter-listener.ts" />
/// <reference path="internal/callbacks.ts" />
/// <reference path="internal/ready.ts" />
/// <reference path="internal/register.ts" />
/// <reference path="internal/transaction-monitor.ts" />
/// <reference path="internal/receipts-monitor.ts" />
/// <reference path="internal/expiry-monitor.ts" />
/**
 * Namespace for the cordova-plugin-purchase plugin.
 *
 * All classes, enumerations and variables defined by the plugin are in this namespace.
 *
 * Throughout the documentation, in order to keep examples readable, we omit the `CdvPurchase` prefix.
 *
 * When you see, for example `ProductType.PAID_SUBSCRIPTION`, it refers to `CdvPurchase.ProductType.PAID_SUBSCRIPTION`.
 *
 * In the files that interact with the plugin, I recommend creating those shortcuts (and more if needed):
 *
 * ```ts
 * const {store, ProductType, Platform, LogLevel} = CdvPurchase;
 * ```
 */
var CdvPurchase;
(function (CdvPurchase) {
    /**
     * Current release number of the plugin.
     */
    CdvPurchase.PLUGIN_VERSION = '13.10.0';
    /**
     * Entry class of the plugin.
     */
    class Store {
        constructor() {
            /**
             * Payment platform adapters.
             */
            this.adapters = new CdvPurchase.Internal.Adapters();
            /**
             * List of registered products.
             *
             * Products are added to this list of products by {@link Store.register}, an internal job will defer loading to the platform adapters.
             */
            this.registeredProducts = new CdvPurchase.Internal.RegisteredProducts();
            /** Logger */
            this.log = new CdvPurchase.Logger(this);
            /**
             * Verbosity level used by the plugin logger
             *
             * Set to:
             *
             *  - LogLevel.QUIET or 0 to disable all logging (default)
             *  - LogLevel.ERROR or 1 to show only error messages
             *  - LogLevel.WARNING or 2 to show warnings and errors
             *  - LogLevel.INFO or 3 to also show information messages
             *  - LogLevel.DEBUG or 4 to enable internal debugging messages.
             *
             * @see {@link LogLevel}
             */
            this.verbosity = CdvPurchase.LogLevel.ERROR;
            /** List of callbacks for the "ready" events */
            this._readyCallbacks = new CdvPurchase.Internal.ReadyCallbacks(this.log);
            /** Callbacks when a product definition was updated */
            this.updatedCallbacks = new CdvPurchase.Internal.Callbacks(this.log, 'productUpdated()');
            /** Callback when a receipt was updated */
            this.updatedReceiptsCallbacks = new CdvPurchase.Internal.Callbacks(this.log, 'receiptUpdated()');
            /** Callbacks when a product is owned */
            // private ownedCallbacks = new Callbacks<Product>();
            /** Callbacks when a transaction has been approved */
            this.approvedCallbacks = new CdvPurchase.Internal.Callbacks(this.log, 'approved()');
            /** Callbacks when a transaction has been finished */
            this.finishedCallbacks = new CdvPurchase.Internal.Callbacks(this.log, 'finished()');
            /** Callbacks when a transaction is pending */
            this.pendingCallbacks = new CdvPurchase.Internal.Callbacks(this.log, 'pending()');
            /** Callbacks when a receipt has been validated */
            this.verifiedCallbacks = new CdvPurchase.Internal.Callbacks(this.log, 'verified()');
            /** Callbacks when a receipt has been validated */
            this.unverifiedCallbacks = new CdvPurchase.Internal.Callbacks(this.log, 'unverified()');
            /** Callbacks when all receipts have been loaded */
            this.receiptsReadyCallbacks = new CdvPurchase.Internal.Callbacks(this.log, 'receiptsReady()', true);
            /** Callbacks when all receipts have been verified */
            this.receiptsVerifiedCallbacks = new CdvPurchase.Internal.Callbacks(this.log, 'receiptsVerified()', true);
            /** Callbacks for errors */
            this.errorCallbacks = new CdvPurchase.Internal.Callbacks(this.log, 'error()');
            this.initializedHasBeenCalled = false;
            /** Stores the last time the store was updated (or initialized), to skip calls in quick succession. */
            this.lastUpdate = 0;
            /**
             * Avoid invoking store.update() if the most recent call occurred within this specific number of milliseconds.
             */
            this.minTimeBetweenUpdates = 600000;
            /**
             * Version of the plugin currently installed.
             */
            this.version = CdvPurchase.PLUGIN_VERSION;
            const store = this;
            this.listener = new CdvPurchase.Internal.StoreAdapterListener({
                updatedCallbacks: this.updatedCallbacks,
                updatedReceiptCallbacks: this.updatedReceiptsCallbacks,
                approvedCallbacks: this.approvedCallbacks,
                finishedCallbacks: this.finishedCallbacks,
                pendingCallbacks: this.pendingCallbacks,
                receiptsReadyCallbacks: this.receiptsReadyCallbacks,
            }, this.log);
            this.transactionStateMonitors = new CdvPurchase.Internal.TransactionStateMonitors(this.when());
            this._validator = new CdvPurchase.Internal.Validator({
                adapters: this.adapters,
                getApplicationUsername: this.getApplicationUsername.bind(this),
                get localReceipts() { return store.localReceipts; },
                get validator() { return store.validator; },
                get validator_privacy_policy() { return store.validator_privacy_policy; },
                verifiedCallbacks: this.verifiedCallbacks,
                unverifiedCallbacks: this.unverifiedCallbacks,
                finish: (receipt) => this.finish(receipt),
            }, this.log);
            new CdvPurchase.Internal.ReceiptsMonitor({
                hasLocalReceipts: () => this.localReceipts.length > 0,
                hasValidator: () => !!this.validator,
                numValidationRequests: () => this._validator.numRequests,
                numValidationResponses: () => this._validator.numResponses,
                off: this.off.bind(this),
                when: this.when.bind(this),
                receiptsVerified: () => { store.receiptsVerifiedCallbacks.trigger(undefined, 'receipts_monitor_controller'); },
                log: this.log,
            }).launch();
            this.expiryMonitor = new CdvPurchase.Internal.ExpiryMonitor({
                // get localReceipts() { return store.localReceipts; },
                get verifiedReceipts() { return store.verifiedReceipts; },
                // onTransactionExpired(transaction) {
                // store.approvedCallbacks.trigger(transaction);
                // },
                onVerifiedPurchaseExpired(verifiedPurchase, receipt) {
                    store.verify(receipt.sourceReceipt);
                },
            });
            this.expiryMonitor.launch();
        }
        /**
         * Retrieve a platform adapter.
         *
         * The platform adapter has to have been initialized before.
         *
         * @see {@link initialize}
         */
        getAdapter(platform) {
            return this.adapters.find(platform);
        }
        /**
         * Get the application username as a string by either calling or returning {@link Store.applicationUsername}
        */
        getApplicationUsername() {
            if (this.applicationUsername instanceof Function)
                return this.applicationUsername();
            return this.applicationUsername;
        }
        /**
         * Register a product.
         *
         * @example
         * store.register([{
         *       id: 'subscription1',
         *       type: ProductType.PAID_SUBSCRIPTION,
         *       platform: Platform.APPLE_APPSTORE,
         *   }, {
         *       id: 'subscription1',
         *       type: ProductType.PAID_SUBSCRIPTION,
         *       platform: Platform.GOOGLE_PLAY,
         *   }, {
         *       id: 'consumable1',
         *       type: ProductType.CONSUMABLE,
         *       platform: Platform.BRAINTREE,
         *   }]);
         */
        register(product) {
            const errors = this.registeredProducts.add(product);
            errors.forEach(error => {
                CdvPurchase.store.errorCallbacks.trigger(error, 'register_error');
                this.log.error(error);
            });
        }
        /**
         * Call to initialize the in-app purchase plugin.
         *
         * @param platforms - List of payment platforms to initialize, default to Store.defaultPlatform().
         */
        initialize(platforms = [this.defaultPlatform()]) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.initializedHasBeenCalled) {
                    this.log.warn('store.initialized() has been called already.');
                    return [];
                }
                this.log.info('initialize()');
                this.initializedHasBeenCalled = true;
                this.lastUpdate = +new Date();
                const store = this;
                const ret = this.adapters.initialize(platforms, {
                    error: this.triggerError.bind(this),
                    get verbosity() { return store.verbosity; },
                    getApplicationUsername() { return store.getApplicationUsername(); },
                    get listener() { return store.listener; },
                    get log() { return store.log; },
                    get registeredProducts() { return store.registeredProducts; },
                    apiDecorators: {
                        canPurchase: this.canPurchase.bind(this),
                        owned: this.owned.bind(this),
                        finish: this.finish.bind(this),
                        order: this.order.bind(this),
                        verify: this.verify.bind(this),
                    },
                });
                ret.then(() => {
                    this._readyCallbacks.trigger('initialize_promise_resolved');
                    this.listener.setSupportedPlatforms(this.adapters.list.filter(a => a.isSupported).map(a => a.id));
                });
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
                this.log.info('update()');
                if (!this._readyCallbacks.isReady) {
                    this.log.warn('Do not call store.update() at startup! It is meant to reload the price of products (if needed) long after initialization.');
                    return;
                }
                const now = +new Date();
                if (this.lastUpdate > now - this.minTimeBetweenUpdates) {
                    this.log.info('Skipping store.update() as the last call occurred less than store.minTimeBetweenUpdates millis ago.');
                    return;
                }
                this.lastUpdate = now;
                // Load products metadata
                for (const registration of this.registeredProducts.byPlatform()) {
                    const products = yield ((_a = this.adapters.findReady(registration.platform)) === null || _a === void 0 ? void 0 : _a.loadProducts(registration.products));
                    products === null || products === void 0 ? void 0 : products.forEach(p => {
                        if (p instanceof CdvPurchase.Product)
                            this.updatedCallbacks.trigger(p, 'update_has_loaded_products');
                    });
                }
            });
        }
        /**
         * Register a callback to be called when the plugin is ready.
         *
         * This happens when all the platforms are initialized and their products loaded.
         */
        ready(cb) { this._readyCallbacks.add(cb); }
        /** true if the plugin is initialized and ready */
        get isReady() { return this._readyCallbacks.isReady; }
        /**
         * Setup events listener.
         *
         * @example
         * store.when()
         *      .productUpdated(product => updateUI(product))
         *      .approved(transaction => transaction.verify())
         *      .verified(receipt => receipt.finish());
         */
        when() {
            const ret = {
                productUpdated: (cb, callbackName) => (this.updatedCallbacks.push(cb, callbackName), ret),
                receiptUpdated: (cb, callbackName) => (this.updatedReceiptsCallbacks.push(cb, callbackName), ret),
                updated: (cb, callbackName) => (this.updatedCallbacks.push(cb, callbackName), this.updatedReceiptsCallbacks.push(cb, callbackName), ret),
                // owned: (cb: Callback<Product>) => (this.ownedCallbacks.push(cb), ret),
                approved: (cb, callbackName) => (this.approvedCallbacks.push(cb, callbackName), ret),
                pending: (cb, callbackName) => (this.pendingCallbacks.push(cb, callbackName), ret),
                finished: (cb, callbackName) => (this.finishedCallbacks.push(cb, callbackName), ret),
                verified: (cb, callbackName) => (this.verifiedCallbacks.push(cb, callbackName), ret),
                unverified: (cb, callbackName) => (this.unverifiedCallbacks.push(cb, callbackName), ret),
                receiptsReady: (cb, callbackName) => (this.receiptsReadyCallbacks.push(cb, callbackName), ret),
                receiptsVerified: (cb, callbackName) => (this.receiptsVerifiedCallbacks.push(cb, callbackName), ret),
            };
            return ret;
        }
        /**
         * Remove a callback from any listener it might have been added to.
         */
        off(callback) {
            this.updatedCallbacks.remove(callback);
            this.updatedReceiptsCallbacks.remove(callback);
            this.approvedCallbacks.remove(callback);
            this.finishedCallbacks.remove(callback);
            this.pendingCallbacks.remove(callback);
            this.verifiedCallbacks.remove(callback);
            this.unverifiedCallbacks.remove(callback);
            this.receiptsReadyCallbacks.remove(callback);
            this.receiptsVerifiedCallbacks.remove(callback);
            this.errorCallbacks.remove(callback);
            this._readyCallbacks.remove(callback);
        }
        /**
         * Setup a function to be notified of changes to a transaction state.
         *
         * @param transaction The transaction to monitor.
         * @param onChange Function to be called when the transaction status changes.
         * @return A monitor which can be stopped with `monitor.stop()`
         *
         * @example
         * const monitor = store.monitor(transaction, state => {
         *   console.log('new state: ' + state);
         *   if (state === TransactionState.FINISHED)
         *     monitor.stop();
         * });
         */
        monitor(transaction, onChange, callbackName) {
            return this.transactionStateMonitors.start(transaction, CdvPurchase.Utils.safeCallback(this.log, 'monitor()', onChange, callbackName, 'transactionStateMonitors_stateChanged'));
        }
        /**
         * List of all active products.
         *
         * Products are active if their details have been successfully loaded from the store.
         */
        get products() {
            // concatenate products all all active platforms
            return [].concat(...this.adapters.list.map(a => a.products));
        }
        /**
         * Find a product from its id and platform
         *
         * @param productId Product identifier on the platform.
         * @param platform The product the product exists in. Can be omitted if you're only using a single payment platform.
         */
        get(productId, platform) {
            var _a;
            return (_a = this.adapters.findReady(platform)) === null || _a === void 0 ? void 0 : _a.products.find(p => p.id === productId);
        }
        /**
         * List of all receipts present on the device.
         */
        get localReceipts() {
            // concatenate products all all active platforms
            return [].concat(...this.adapters.list.map(a => a.receipts));
        }
        /** List of all transaction from the local receipts. */
        get localTransactions() {
            const ret = [];
            for (const receipt of this.localReceipts) {
                ret.push(...receipt.transactions);
            }
            return ret;
        }
        /**
         * List of receipts verified with the receipt validation service.
         *
         * Those receipt contains more information and are generally more up-to-date than the local ones.
         */
        get verifiedReceipts() {
            return this._validator.verifiedReceipts;
        }
        /**
         * List of all purchases from the verified receipts.
         */
        get verifiedPurchases() {
            return CdvPurchase.Internal.VerifiedReceipts.getVerifiedPurchases(this.verifiedReceipts);
        }
        /**
         * Find the last verified purchase for a given product, from those verified by the receipt validator.
         */
        findInVerifiedReceipts(product) {
            return CdvPurchase.Internal.VerifiedReceipts.find(this.verifiedReceipts, product);
        }
        /**
         * Find the latest transaction for a given product, from those reported by the device.
         */
        findInLocalReceipts(product) {
            return CdvPurchase.Internal.LocalReceipts.find(this.localReceipts, product);
        }
        /** Return true if a product or offer can be purchased */
        canPurchase(offer) {
            const product = (offer instanceof CdvPurchase.Offer) ? this.get(offer.productId, offer.platform) : offer;
            const adapter = this.adapters.findReady(offer.platform);
            if (!(adapter === null || adapter === void 0 ? void 0 : adapter.checkSupport('order')))
                return false;
            return CdvPurchase.Internal.LocalReceipts.canPurchase(this.localReceipts, product);
        }
        /**
         * Return true if a product is owned
         *
         * @param product - The product object or identifier of the product.
         */
        owned(product) {
            return CdvPurchase.Internal.owned({
                product: typeof product === 'string' ? { id: product } : product,
                verifiedReceipts: this.validator ? this.verifiedReceipts : undefined,
                localReceipts: this.localReceipts,
            });
        }
        /**
         * Place an order for a given offer.
         */
        order(offer, additionalData) {
            return __awaiter(this, void 0, void 0, function* () {
                this.log.info(`order(${offer.productId})`);
                const adapter = this.adapters.findReady(offer.platform);
                if (!adapter)
                    return CdvPurchase.storeError(CdvPurchase.ErrorCode.PAYMENT_NOT_ALLOWED, 'Adapter not found or not ready (' + offer.platform + ')', offer.platform, null);
                const ret = yield adapter.order(offer, additionalData || {});
                if (ret && 'isError' in ret)
                    CdvPurchase.store.triggerError(ret);
                return ret;
            });
        }
        /**
         * Request a payment.
         *
         * A payment is a custom amount to charge the user. Make sure the selected payment platform
         * supports Payment Requests.
         *
         * @param paymentRequest Parameters of the payment request
         * @param additionalData Additional parameters
         */
        requestPayment(paymentRequest, additionalData) {
            var _a, _b, _c, _d, _e;
            const adapter = this.adapters.findReady(paymentRequest.platform);
            if (!adapter)
                return CdvPurchase.PaymentRequestPromise.failed(CdvPurchase.ErrorCode.PAYMENT_NOT_ALLOWED, 'Adapter not found or not ready (' + paymentRequest.platform + ')', paymentRequest.platform, null);
            // fill-in missing total amount as the sum of all items.
            if (!paymentRequest.amountMicros) {
                paymentRequest.amountMicros = 0;
                for (const item of paymentRequest.items) {
                    paymentRequest.amountMicros += (_b = (_a = item === null || item === void 0 ? void 0 : item.pricing) === null || _a === void 0 ? void 0 : _a.priceMicros) !== null && _b !== void 0 ? _b : 0;
                }
            }
            // fill-in the missing if set in the items.
            if (!paymentRequest.currency) {
                for (const item of paymentRequest.items) {
                    if ((_c = item === null || item === void 0 ? void 0 : item.pricing) === null || _c === void 0 ? void 0 : _c.currency) {
                        paymentRequest.currency = item.pricing.currency;
                    }
                }
            }
            else {
                for (const item of paymentRequest.items) {
                    if ((_d = item === null || item === void 0 ? void 0 : item.pricing) === null || _d === void 0 ? void 0 : _d.currency) {
                        if (paymentRequest.currency !== item.pricing.currency) {
                            return CdvPurchase.PaymentRequestPromise.failed(CdvPurchase.ErrorCode.PAYMENT_INVALID, 'Currencies do not match', paymentRequest.platform, item.id);
                        }
                    }
                    else if (item === null || item === void 0 ? void 0 : item.pricing) {
                        item.pricing.currency = paymentRequest.currency;
                    }
                }
            }
            // fill-in item amount when there's just 1 item.
            if (paymentRequest.items.length === 1) {
                const item = paymentRequest.items[0];
                if (item && !item.pricing) {
                    item.pricing = {
                        priceMicros: (_e = paymentRequest.amountMicros) !== null && _e !== void 0 ? _e : 0,
                        currency: paymentRequest.currency,
                    };
                }
            }
            const promise = new CdvPurchase.PaymentRequestPromise();
            adapter.requestPayment(paymentRequest, additionalData).then(result => {
                promise.trigger(result);
                if (result instanceof CdvPurchase.Transaction) {
                    const onStateChange = (state) => {
                        promise.trigger(result);
                        if (result.state === CdvPurchase.TransactionState.FINISHED)
                            monitor.stop();
                    };
                    const monitor = this.monitor(result, onStateChange, 'requestPayment_onStateChange');
                }
            });
            return promise;
        }
        /**
         * Returns true if a platform supports the requested functionality.
         *
         * @example
         * store.checkSupport(Platform.APPLE_APPSTORE, 'requestPayment');
         * // => false
         */
        checkSupport(platform, functionality) {
            const adapter = this.adapters.find(platform);
            if (!adapter)
                return false; // the selected adapter hasn't been initialized
            return adapter.checkSupport(functionality);
        }
        /**
         * Verify a receipt or transacting with the receipt validation service.
         *
         * This will be called from the Receipt or Transaction objects using the API decorators.
         */
        verify(receiptOrTransaction) {
            return __awaiter(this, void 0, void 0, function* () {
                this.log.info(`verify(${receiptOrTransaction.className})`);
                this._validator.add(receiptOrTransaction);
                // Run validation after 200ms, so if the same receipt is to be validated multiple times it will just create one call.
                setTimeout(() => this._validator.run(), 200);
            });
        }
        /**
         * Finalize a transaction.
         *
         * This will be called from the Receipt, Transaction or VerifiedReceipt objects using the API decorators.
         */
        finish(receipt) {
            return __awaiter(this, void 0, void 0, function* () {
                this.log.info(`finish(${receipt.className})`);
                const transactions = receipt instanceof CdvPurchase.VerifiedReceipt
                    ? receipt.sourceReceipt.transactions
                    : receipt instanceof CdvPurchase.Receipt
                        ? receipt.transactions
                        : [receipt];
                transactions.forEach(transaction => {
                    var _a;
                    const adapter = (_a = this.adapters.findReady(transaction.platform)) === null || _a === void 0 ? void 0 : _a.finish(transaction);
                });
            });
        }
        /**
         * Replay the users transactions.
         *
         * This method exists to cover an Apple AppStore requirement.
         */
        restorePurchases() {
            return __awaiter(this, void 0, void 0, function* () {
                let error;
                for (const adapter of this.adapters.list) {
                    if (adapter.ready) {
                        error = error !== null && error !== void 0 ? error : yield adapter.restorePurchases();
                    }
                }
                return error;
            });
        }
        /**
         * Open the subscription management interface for the selected platform.
         *
         * If platform is not specified, the first available platform will be used.
         *
         * @example
         * const activeSubscription: Purchase = // ...
         * store.manageSubscriptions(activeSubscription.platform);
         */
        manageSubscriptions(platform) {
            return __awaiter(this, void 0, void 0, function* () {
                this.log.info('manageSubscriptions()');
                const adapter = this.adapters.findReady(platform);
                if (!adapter)
                    return CdvPurchase.storeError(CdvPurchase.ErrorCode.SETUP, "Found no adapter ready to handle 'manageSubscription'", platform !== null && platform !== void 0 ? platform : null, null);
                return adapter.manageSubscriptions();
            });
        }
        /**
         * Opens the billing methods page on AppStore, Play, Microsoft, ...
         *
         * From this page, the user can update their payment methods.
         *
         * If platform is not specified, the first available platform will be used.
         *
         * @example
         * if (purchase.isBillingRetryPeriod)
         *     store.manageBilling(purchase.platform);
         */
        manageBilling(platform) {
            return __awaiter(this, void 0, void 0, function* () {
                this.log.info('manageBilling()');
                const adapter = this.adapters.findReady(platform);
                if (!adapter)
                    return CdvPurchase.storeError(CdvPurchase.ErrorCode.SETUP, "Found no adapter ready to handle 'manageBilling'", platform !== null && platform !== void 0 ? platform : null, null);
                return adapter.manageBilling();
            });
        }
        /**
         * The default payment platform to use depending on the OS.
         *
         * - on iOS: `APPLE_APPSTORE`
         * - on Android: `GOOGLE_PLAY`
         */
        defaultPlatform() {
            switch (window.cordova.platformId) {
                case 'android': return CdvPurchase.Platform.GOOGLE_PLAY;
                case 'ios': return CdvPurchase.Platform.APPLE_APPSTORE;
                default: return CdvPurchase.Platform.TEST;
            }
        }
        /**
         * Register an error handler.
         *
         * @param error An error callback that takes the error as an argument
         *
         * @example
         * store.error(function(error) {
         *   console.error('CdvPurchase ERROR: ' + error.message);
         * });
         */
        error(error) {
            this.errorCallbacks.push(error);
        }
        /**
         * Trigger an error event.
         *
         * @internal
         */
        triggerError(error) {
            this.errorCallbacks.trigger(error, 'triggerError');
        }
    }
    CdvPurchase.Store = Store;
})(CdvPurchase || (CdvPurchase = {}));
// Create the CdvPurchase.store object at startup.
if (window.cordova) {
    setTimeout(initCDVPurchase, 0); // somehow with Cordova this needs to be delayed.
}
else {
    initCDVPurchase();
}
function initCDVPurchase() {
    var _a;
    console.log('Create CdvPurchase...');
    const oldStore = (_a = window.CdvPurchase) === null || _a === void 0 ? void 0 : _a.store;
    window.CdvPurchase = CdvPurchase;
    if (oldStore) {
        window.CdvPurchase.store = oldStore;
    }
    else {
        window.CdvPurchase.store = new CdvPurchase.Store();
    }
    // Let's maximize backward compatibility
    Object.assign(window.CdvPurchase.store, CdvPurchase.LogLevel, CdvPurchase.ProductType, CdvPurchase.ErrorCode, CdvPurchase.Platform);
}
// Ensure utility are included when compiling typescript.
/// <reference path="utils/format-billing-cycle.ts" />
/// <reference path="store.ts" />
var CdvPurchase;
(function (CdvPurchase) {
    /** Types of In-App Products */
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
    })(ProductType = CdvPurchase.ProductType || (CdvPurchase.ProductType = {}));
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
    })(RecurrenceMode = CdvPurchase.RecurrenceMode || (CdvPurchase.RecurrenceMode = {}));
    /** Mode of payment */
    let PaymentMode;
    (function (PaymentMode) {
        /** Used for subscriptions, pay at the beginning of each billing period */
        PaymentMode["PAY_AS_YOU_GO"] = "PayAsYouGo";
        /** Pay the whole amount up front */
        PaymentMode["UP_FRONT"] = "UpFront";
        /** Nothing to be paid */
        PaymentMode["FREE_TRIAL"] = "FreeTrial";
    })(PaymentMode = CdvPurchase.PaymentMode || (CdvPurchase.PaymentMode = {}));
    /**
     * Purchase platforms supported by the plugin
     */
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
        Platform["TEST"] = "test";
    })(Platform = CdvPurchase.Platform || (CdvPurchase.Platform = {}));
    /** Possible states of a product */
    let TransactionState;
    (function (TransactionState) {
        // REQUESTED = 'requested',
        TransactionState["INITIATED"] = "initiated";
        TransactionState["PENDING"] = "pending";
        TransactionState["APPROVED"] = "approved";
        TransactionState["CANCELLED"] = "cancelled";
        TransactionState["FINISHED"] = "finished";
        // OWNED = 'owned',
        // EXPIRED = 'expired',
        TransactionState["UNKNOWN_STATE"] = "";
    })(TransactionState = CdvPurchase.TransactionState || (CdvPurchase.TransactionState = {}));
    /** Whether or not the user intends to let the subscription auto-renew. */
    let RenewalIntent;
    (function (RenewalIntent) {
        /** The user intends to let the subscription expire without renewing. */
        RenewalIntent["LAPSE"] = "Lapse";
        /** The user intends to renew the subscription. */
        RenewalIntent["RENEW"] = "Renew";
    })(RenewalIntent = CdvPurchase.RenewalIntent || (CdvPurchase.RenewalIntent = {}));
    /** Whether or not the user was notified or agreed to a price change */
    let PriceConsentStatus;
    (function (PriceConsentStatus) {
        PriceConsentStatus["NOTIFIED"] = "Notified";
        PriceConsentStatus["AGREED"] = "Agreed";
    })(PriceConsentStatus = CdvPurchase.PriceConsentStatus || (CdvPurchase.PriceConsentStatus = {}));
    /** Reason why a subscription has been canceled */
    let CancelationReason;
    (function (CancelationReason) {
        /** Not canceled */
        CancelationReason["NOT_CANCELED"] = "";
        /** Subscription canceled by the developer. */
        CancelationReason["DEVELOPER"] = "Developer";
        /** Subscription canceled by the system for an unspecified reason. */
        CancelationReason["SYSTEM"] = "System";
        /** Subscription upgraded or downgraded to a new subscription. */
        CancelationReason["SYSTEM_REPLACED"] = "System.Replaced";
        /** Product not available for purchase at the time of renewal. */
        CancelationReason["SYSTEM_PRODUCT_UNAVAILABLE"] = "System.ProductUnavailable";
        /** Billing error; for example customer’s payment information is no longer valid. */
        CancelationReason["SYSTEM_BILLING_ERROR"] = "System.BillingError";
        /** Transaction is gone; It has been deleted. */
        CancelationReason["SYSTEM_DELETED"] = "System.Deleted";
        /** Subscription canceled by the user for an unspecified reason. */
        CancelationReason["CUSTOMER"] = "Customer";
        /** Customer canceled their transaction due to an actual or perceived issue within your app. */
        CancelationReason["CUSTOMER_TECHNICAL_ISSUES"] = "Customer.TechnicalIssues";
        /** Customer did not agree to a recent price increase. See also priceConsentStatus. */
        CancelationReason["CUSTOMER_PRICE_INCREASE"] = "Customer.PriceIncrease";
        /** Customer canceled for cost-related reasons. */
        CancelationReason["CUSTOMER_COST"] = "Customer.Cost";
        /** Customer claimed to have found a better app. */
        CancelationReason["CUSTOMER_FOUND_BETTER_APP"] = "Customer.FoundBetterApp";
        /** Customer did not feel he is using this service enough. */
        CancelationReason["CUSTOMER_NOT_USEFUL_ENOUGH"] = "Customer.NotUsefulEnough";
        /** Subscription canceled for another reason; for example, if the customer made the purchase accidentally. */
        CancelationReason["CUSTOMER_OTHER_REASON"] = "Customer.OtherReason";
        /** Subscription canceled for unknown reasons. */
        CancelationReason["UNKNOWN"] = "Unknown";
    })(CancelationReason = CdvPurchase.CancelationReason || (CdvPurchase.CancelationReason = {}));
})(CdvPurchase || (CdvPurchase = {}));
/// <reference path="utils/non-enumerable.ts" />
/// <reference path="product.ts" />
/// <reference path="types.ts" />
var CdvPurchase;
(function (CdvPurchase) {
    /**
     * One of the available offers to purchase a given product
     */
    class Offer {
        /** @internal */
        constructor(options, decorator) {
            /** className, used to make sure we're passing an actual instance of the "Offer" class. */
            this.className = 'Offer';
            this.id = options.id;
            this.pricingPhases = options.pricingPhases;
            // Object.defineProperty(this, 'product', { enumerable: false, get: () => options.product });
            Object.defineProperty(this, 'productId', { enumerable: true, get: () => options.product.id });
            Object.defineProperty(this, 'productType', { enumerable: true, get: () => options.product.type });
            Object.defineProperty(this, 'productGroup', { enumerable: true, get: () => options.product.group });
            Object.defineProperty(this, 'platform', { enumerable: true, get: () => options.product.platform });
            Object.defineProperty(this, 'order', { enumerable: false, get: () => (additionalData) => decorator.order(this, additionalData) });
            Object.defineProperty(this, 'canPurchase', { enumerable: false, get: () => decorator.canPurchase(this) });
        }
        /** Identifier of the product related to this offer */
        get productId() { return ''; }
        /** Type of the product related to this offer */
        get productType() { return CdvPurchase.ProductType.APPLICATION; }
        /** Group the product related to this offer is member of */
        get productGroup() { return undefined; }
        /** Platform this offer is available from */
        get platform() { return CdvPurchase.Platform.TEST; }
        /**
         * Initiate a purchase of this offer.
         *
         * @example
         * store.get("my-product").getOffer().order();
         */
        order(additionalData) {
            return __awaiter(this, void 0, void 0, function* () {
                // Pseudo implementation to make typescript happy.
                // see Object.defineProperty in the constructor for the actual implementation.
                return;
            });
        }
        /**
         * true if the offer can be purchased.
         */
        get canPurchase() {
            // Pseudo implementation to make typescript happy.
            // see Object.defineProperty in the constructor for the actual implementation.
            return false;
        }
    }
    CdvPurchase.Offer = Offer;
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    class PaymentRequestPromise {
        constructor() {
            this.failedCallbacks = new CdvPurchase.Internal.PromiseLike();
            this.initiatedCallbacks = new CdvPurchase.Internal.PromiseLike();
            this.approvedCallbacks = new CdvPurchase.Internal.PromiseLike();
            this.finishedCallbacks = new CdvPurchase.Internal.PromiseLike();
            this.cancelledCallback = new CdvPurchase.Internal.PromiseLike();
        }
        failed(callback) {
            this.failedCallbacks.push(callback);
            return this;
        }
        initiated(callback) {
            this.initiatedCallbacks.push(callback);
            return this;
        }
        approved(callback) {
            this.approvedCallbacks.push(callback);
            return this;
        }
        finished(callback) {
            this.finishedCallbacks.push(callback);
            return this;
        }
        cancelled(callback) {
            this.cancelledCallback.push(callback);
            return this;
        }
        /** @internal */
        trigger(argument) {
            if (!argument) {
                this.cancelledCallback.resolve();
            }
            else if ('isError' in argument) {
                this.failedCallbacks.resolve(argument);
            }
            else {
                switch (argument.state) {
                    case CdvPurchase.TransactionState.INITIATED:
                        this.initiatedCallbacks.resolve(argument);
                        break;
                    case CdvPurchase.TransactionState.APPROVED:
                        this.approvedCallbacks.resolve(argument);
                        break;
                    case CdvPurchase.TransactionState.FINISHED:
                        this.finishedCallbacks.resolve(argument);
                        break;
                }
            }
            return this;
        }
        /**
         * Return a failed promise.
         *
         * @internal
         */
        static failed(code, message, platform, productId) {
            return new PaymentRequestPromise().trigger(CdvPurchase.storeError(code, message, platform, productId));
        }
        /**
         * Return a failed promise.
         *
         * @internal
         */
        static cancelled() {
            return new PaymentRequestPromise().trigger();
        }
        /**
         * Return an initiated transaction.
         *
         * @internal
         */
        static initiated(transaction) {
            return new PaymentRequestPromise().trigger(transaction);
        }
    }
    CdvPurchase.PaymentRequestPromise = PaymentRequestPromise;
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    class Receipt {
        /** @internal */
        constructor(platform, decorator) {
            /** @internal */
            this.className = 'Receipt';
            /** List of transactions contained in the receipt, ordered by date ascending. */
            this.transactions = [];
            this.platform = platform;
            Object.defineProperty(this, 'verify', { 'enumerable': false, get() { return () => decorator.verify(this); } });
            Object.defineProperty(this, 'finish', { 'enumerable': false, get() { return () => decorator.finish(this); } });
        }
        /** Verify a receipt */
        verify() {
            return __awaiter(this, void 0, void 0, function* () { });
        }
        /** Finish all transactions in a receipt */
        finish() {
            return __awaiter(this, void 0, void 0, function* () { });
        }
        /** Return true if the receipt contains the given transaction */
        hasTransaction(value) {
            return !!this.transactions.find(t => t === value);
        }
        /** Return the last transaction in this receipt */
        lastTransaction() {
            return this.transactions[this.transactions.length - 1];
        }
    }
    CdvPurchase.Receipt = Receipt;
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    /**
     * Transaction as reported by the device
     *
     * @see {@link Receipt}
     * @see {@link store.localTransactions}
     */
    class Transaction {
        /** @internal */
        constructor(platform, parentReceipt, decorator) {
            /** @internal */
            this.className = 'Transaction';
            /** Transaction identifier. */
            this.transactionId = '';
            /** State this transaction is in */
            this.state = CdvPurchase.TransactionState.UNKNOWN_STATE;
            /** Purchased products */
            this.products = [];
            this.platform = platform;
            Object.defineProperty(this, 'finish', { 'enumerable': false, get() { return () => decorator.finish(this); } });
            Object.defineProperty(this, 'verify', { 'enumerable': false, get() { return () => decorator.verify(this); } });
            Object.defineProperty(this, 'parentReceipt', { 'enumerable': false, get() { return parentReceipt; } });
        }
        /**
         * Finish a transaction.
         *
         * When the application has delivered the product, it should finalizes the order.
         * Only after that, money will be transferred to your account.
         * This method ensures that no customers is charged for a product that couldn't be delivered.
         *
         * @example
         * store.when()
         *   .approved(transaction => transaction.verify())
         *   .verified(receipt => receipt.finish())
         */
        finish() {
            return __awaiter(this, void 0, void 0, function* () { });
        } // actual implementation in the constructor
        /**
         * Verify a transaction.
         *
         * This will trigger a call to the receipt validation service for the attached receipt.
         * Once the receipt has been verified, you can finish the transaction.
         *
         * @example
         * store.when()
         *   .approved(transaction => transaction.verify())
         *   .verified(receipt => receipt.finish())
         */
        verify() {
            return __awaiter(this, void 0, void 0, function* () { });
        } // actual implementation in the constructor
        /**
         * Return the receipt this transaction is part of.
         */
        get parentReceipt() { return {}; } // actual implementation in the constructor
    }
    CdvPurchase.Transaction = Transaction;
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    let Internal;
    (function (Internal) {
        /** Analyze the list of local receipts. */
        class LocalReceipts {
            /**
             * Find the latest transaction for a given product, from those reported by the device.
             */
            static find(localReceipts, product) {
                var _a, _b;
                if (!product)
                    return undefined;
                let found;
                for (const receipt of localReceipts) {
                    if (product.platform && receipt.platform !== product.platform)
                        continue;
                    for (const transaction of receipt.transactions) {
                        for (const trProducts of transaction.products) {
                            if (trProducts.id === product.id) {
                                // No matching transaction has been found or the tested one is newer than the already found one?
                                // Then we chose the tested one.
                                if (!found || ((_a = transaction.purchaseDate) !== null && _a !== void 0 ? _a : 0) < ((_b = found.purchaseDate) !== null && _b !== void 0 ? _b : 1))
                                    found = transaction;
                            }
                        }
                    }
                }
                return found;
            }
            /** Return true if a product is owned */
            static isOwned(localReceipts, product) {
                if (!product)
                    return false;
                const transaction = LocalReceipts.find(localReceipts, product);
                if (!transaction)
                    return false;
                if (transaction.isConsumed)
                    return false;
                if (transaction.isPending)
                    return false;
                if (transaction.expirationDate)
                    return transaction.expirationDate.getTime() > +new Date();
                return true;
            }
            static canPurchase(localReceipts, product) {
                if (!product)
                    return false;
                const transaction = LocalReceipts.find(localReceipts, product);
                if (!transaction)
                    return true;
                if (transaction.isConsumed)
                    return true;
                if (transaction.expirationDate)
                    return transaction.expirationDate.getTime() <= +new Date();
                return true;
            }
        }
        Internal.LocalReceipts = LocalReceipts;
    })(Internal = CdvPurchase.Internal || (CdvPurchase.Internal = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    let Internal;
    (function (Internal) {
        /**
         * Return true if a product is owned.
         *
         * Will use the list of verified receipts if provided.
         * Will only use the list of local receipts if verifiedReceipt is undefined.
         */
        function owned(options) {
            if (options.verifiedReceipts !== undefined) {
                return Internal.VerifiedReceipts.isOwned(options.verifiedReceipts, options.product);
            }
            else if (options.localReceipts !== undefined) {
                return Internal.LocalReceipts.isOwned(options.localReceipts, options.product);
            }
            else {
                return false;
            }
        }
        Internal.owned = owned;
    })(Internal = CdvPurchase.Internal || (CdvPurchase.Internal = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    let Internal;
    (function (Internal) {
        class PromiseLike {
            constructor() {
                this.resolved = false;
                /** List of registered callbacks */
                this.callbacks = [];
            }
            /** Add a callback to the list */
            push(callback) {
                if (this.resolved)
                    setTimeout(callback, 0, this.resolvedArgument);
                else
                    this.callbacks.push(callback);
            }
            /** Call all registered callbacks with the given value */
            resolve(value) {
                if (this.resolved)
                    return; // do not resolve twice
                this.resolved = true;
                this.resolvedArgument = value;
                this.callbacks.forEach(cb => setTimeout(cb, 0, value));
                this.callbacks = [];
            }
        }
        Internal.PromiseLike = PromiseLike;
    })(Internal = CdvPurchase.Internal || (CdvPurchase.Internal = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    let Internal;
    (function (Internal) {
        /**
         * Retry failed requests
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
        Internal.Retry = Retry;
    })(Internal = CdvPurchase.Internal || (CdvPurchase.Internal = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    let Internal;
    (function (Internal) {
        /** Analyze the list of local receipts. */
        class VerifiedReceipts {
            /**
             * Find the last verified purchase for a given product, from those verified by the receipt validator.
             */
            static find(verifiedReceipts, product) {
                var _a, _b;
                if (!product)
                    return undefined;
                let found;
                for (const receipt of verifiedReceipts) {
                    if (product.platform && receipt.platform !== product.platform)
                        continue;
                    for (const purchase of receipt.collection) {
                        if (purchase.id === product.id) {
                            if (((_a = found === null || found === void 0 ? void 0 : found.purchaseDate) !== null && _a !== void 0 ? _a : 0) < ((_b = purchase.purchaseDate) !== null && _b !== void 0 ? _b : 1))
                                found = purchase;
                        }
                    }
                }
                return found;
            }
            /** Return true if a product is owned, based on the content of the list of verified receipts  */
            static isOwned(verifiedReceipts, product) {
                if (!product)
                    return false;
                const purchase = VerifiedReceipts.find(verifiedReceipts, product);
                if (!purchase)
                    return false;
                if (purchase === null || purchase === void 0 ? void 0 : purchase.isExpired)
                    return false;
                if (purchase === null || purchase === void 0 ? void 0 : purchase.expiryDate) {
                    return (purchase.expiryDate > +new Date());
                }
                return true;
            }
            static getVerifiedPurchases(verifiedReceipts) {
                var _a, _b, _c, _d;
                const indexed = {};
                for (const receipt of verifiedReceipts) {
                    for (const purchase of receipt.collection) {
                        const key = receipt.platform + ':' + purchase.id;
                        const existing = indexed[key];
                        if (!existing || (existing && ((_b = (_a = existing.lastRenewalDate) !== null && _a !== void 0 ? _a : existing.purchaseDate) !== null && _b !== void 0 ? _b : 0) < ((_d = (_c = purchase.lastRenewalDate) !== null && _c !== void 0 ? _c : purchase.purchaseDate) !== null && _d !== void 0 ? _d : 0))) {
                            indexed[key] = Object.assign(Object.assign({}, purchase), { platform: receipt.platform });
                        }
                    }
                }
                return Object.keys(indexed).map(key => indexed[key]);
            }
        }
        Internal.VerifiedReceipts = VerifiedReceipts;
    })(Internal = CdvPurchase.Internal || (CdvPurchase.Internal = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    /**
     * Define types for ApplePay
     *
     * At the moment Apple Pay is only supported as an extension for Braintree.
     */
    let ApplePay;
    (function (ApplePay) {
        /** The fields that describe a contact. */
        let ContactField;
        (function (ContactField) {
            ContactField["Name"] = "name";
            ContactField["EmailAddress"] = "emailAddress";
            ContactField["PhoneNumber"] = "phoneNumber";
            ContactField["PostalAddress"] = "postalAddress";
            ContactField["PhoneticName"] = "phoneticName";
        })(ContactField = ApplePay.ContactField || (ApplePay.ContactField = {}));
        /** A type that represents a payment method. */
        let PaymentNetwork;
        (function (PaymentNetwork) {
            /** An American Express payment card. */
            PaymentNetwork["Amex"] = "Amex";
            /** A QR code used for payment. */
            PaymentNetwork["Barcode"] = "Barcode";
            /** A Cartes Bancaires payment card. */
            PaymentNetwork["CartesBancaires"] = "CartesBancaires";
            /** A China Union Pay payment card. */
            PaymentNetwork["ChinaUnionPay"] = "ChinaUnionPay";
            /** The Dankort payment card. */
            PaymentNetwork["Dankort"] = "Dankort";
            /** A Discover payment card. */
            PaymentNetwork["Discover"] = "Discover";
            /** The electronic funds transfer at point of sale (EFTPOS) payment method. */
            PaymentNetwork["Eftpos"] = "Eftpos";
            /** An Electron debit card. */
            PaymentNetwork["Electron"] = "Electron";
            /** The Elo payment card. */
            PaymentNetwork["Elo"] = "Elo";
            /** A Girocard payment method. */
            PaymentNetwork["Girocard"] = "Girocard";
            /** An iD payment card. */
            PaymentNetwork["IDCredit"] = "IDCredit";
            /** The Interac payment method. */
            PaymentNetwork["Interac"] = "Interac";
            /** A JCB payment card. */
            PaymentNetwork["JCB"] = "JCB";
            /** A mada payment card. */
            PaymentNetwork["Mada"] = "Mada";
            /** A Maestro payment card. */
            PaymentNetwork["Maestro"] = "Maestro";
            /** A MasterCard payment card. */
            PaymentNetwork["MasterCard"] = "MasterCard";
            /** A Mir payment card. */
            PaymentNetwork["Mir"] = "Mir";
            /** A Nanaco payment card. */
            PaymentNetwork["Nanaco"] = "Nanaco";
            /** Store credit and debit cards. */
            PaymentNetwork["PrivateLabel"] = "PrivateLabel";
            /** A QUICPay payment card. */
            PaymentNetwork["QuicPay"] = "QuicPay";
            /** A Suica payment card. */
            PaymentNetwork["Suica"] = "Suica";
            /** A Visa payment card. */
            PaymentNetwork["Visa"] = "Visa";
            /** A Visa V Pay payment card. */
            PaymentNetwork["VPay"] = "VPay";
            /** A WAON payment card. */
            PaymentNetwork["Waon"] = "Waon";
        })(PaymentNetwork = ApplePay.PaymentNetwork || (ApplePay.PaymentNetwork = {}));
        /** Capabilities for processing payment. */
        let MerchantCapability;
        (function (MerchantCapability) {
            /** Support for the 3-D Secure protocol. */
            MerchantCapability["ThreeDS"] = "3DS";
            /** Support for the EMV protocol. */
            MerchantCapability["EMV"] = "EMV";
            /** Support for credit cards. */
            MerchantCapability["Credit"] = "Credit";
            /** Support for debit cards. */
            MerchantCapability["Debit"] = "Debit";
        })(MerchantCapability = ApplePay.MerchantCapability || (ApplePay.MerchantCapability = {}));
    })(ApplePay = CdvPurchase.ApplePay || (CdvPurchase.ApplePay = {}));
})(CdvPurchase || (CdvPurchase = {}));
/// <reference path="../../types.ts" />
/// <reference path="../../product.ts" />
/// <reference path="../../receipt.ts" />
/// <reference path="../../offer.ts" />
/// <reference path="../../transaction.ts" />
var CdvPurchase;
(function (CdvPurchase) {
    /**
     * Apple AppStore adapter using StoreKit version 1
     */
    let AppleAppStore;
    (function (AppleAppStore) {
        /**
         * In the first stages of a purchase, the transaction doesn't have an identifier.
         *
         * In the meantime, we generate a virtual transaction identifier.
         */
        function virtualTransactionId(productId) {
            return `virtual.${productId}`;
        }
        /**
         * Adapter for Apple AppStore using StoreKit version 1
         */
        class Adapter {
            constructor(context, options) {
                var _a, _b;
                this.id = CdvPurchase.Platform.APPLE_APPSTORE;
                this.name = 'AppStore';
                this.ready = false;
                this._canMakePayments = false;
                /**
                 * Set to true to force a full refresh of the receipt when preparing a receipt validation call.
                 *
                 * This is typically done when placing an order and restoring purchases.
                 */
                this.forceReceiptReload = false;
                /** List of products loaded from AppStore */
                this._products = [];
                this.validProducts = {};
                this._paymentMonitor = () => { };
                this.supportsParallelLoading = true;
                /** True iff the appStoreReceipt is already being initialized */
                this._appStoreReceiptLoading = false;
                /** List of functions waiting for the appStoreReceipt to be initialized */
                this._appStoreReceiptCallbacks = [];
                this.context = context;
                this.bridge = new AppleAppStore.Bridge.Bridge();
                this.log = context.log.child('AppleAppStore');
                this.discountEligibilityDeterminer = options.discountEligibilityDeterminer;
                this.needAppReceipt = (_a = options.needAppReceipt) !== null && _a !== void 0 ? _a : true;
                this.autoFinish = (_b = options.autoFinish) !== null && _b !== void 0 ? _b : false;
                this.pseudoReceipt = new CdvPurchase.Receipt(CdvPurchase.Platform.APPLE_APPSTORE, this.context.apiDecorators);
                this.receiptsUpdated = CdvPurchase.Utils.debounce(() => {
                    this._receiptsUpdated();
                }, 300);
            }
            get products() { return this._products; }
            /** Find a given product from ID */
            getProduct(id) { return this._products.find(p => p.id === id); }
            get receipts() {
                if (!this.isSupported)
                    return [];
                return (this._receipt ? [this._receipt] : [])
                    .concat(this.pseudoReceipt ? this.pseudoReceipt : []);
            }
            addValidProducts(registerProducts, validProducts) {
                validProducts.forEach(vp => {
                    const rp = registerProducts.find(p => p.id === vp.id);
                    if (!rp)
                        return;
                    this.validProducts[vp.id] = Object.assign(Object.assign({}, vp), rp);
                });
            }
            /** Returns true on iOS, the only platform supported by this adapter */
            get isSupported() {
                return window.cordova.platformId === 'ios';
            }
            upsertTransactionInProgress(productId, state) {
                const transactionId = virtualTransactionId(productId);
                return new Promise(resolve => {
                    const existing = this.pseudoReceipt.transactions.find(t => t.transactionId === transactionId);
                    if (existing) {
                        existing.state = state;
                        existing.refresh(productId);
                        resolve(existing);
                    }
                    else {
                        const tr = new AppleAppStore.SKTransaction(CdvPurchase.Platform.APPLE_APPSTORE, this.pseudoReceipt, this.context.apiDecorators);
                        tr.state = state;
                        tr.transactionId = transactionId;
                        tr.refresh(productId);
                        this.pseudoReceipt.transactions.push(tr);
                        resolve(tr);
                    }
                });
            }
            /** Remove a transaction from the pseudo receipt */
            removeTransactionInProgress(productId) {
                const transactionId = virtualTransactionId(productId);
                this.pseudoReceipt.transactions = this.pseudoReceipt.transactions.filter(t => t.transactionId !== transactionId);
            }
            /** Insert or update a transaction in the pseudo receipt, based on data collected from the native side */
            upsertTransaction(productId, transactionId, state) {
                return __awaiter(this, void 0, void 0, function* () {
                    return new Promise(resolve => {
                        this.initializeAppReceipt(() => {
                            var _a;
                            if (!this._receipt) {
                                // this should not happen
                                this.log.warn('Failed to load the application receipt, cannot proceed with handling the purchase');
                                return;
                            }
                            const existing = (_a = this._receipt) === null || _a === void 0 ? void 0 : _a.transactions.find(t => t.transactionId === transactionId);
                            if (existing) {
                                existing.state = state;
                                existing.refresh(productId);
                                resolve(existing);
                            }
                            else {
                                const tr = new AppleAppStore.SKTransaction(CdvPurchase.Platform.APPLE_APPSTORE, this._receipt, this.context.apiDecorators);
                                tr.state = state;
                                tr.transactionId = transactionId;
                                tr.refresh(productId);
                                this._receipt.transactions.push(tr);
                                resolve(tr);
                            }
                        });
                    });
                });
            }
            removeTransaction(transactionId) {
                if (this._receipt) {
                    this._receipt.transactions = this._receipt.transactions.filter(t => t.transactionId !== transactionId);
                }
            }
            /** Notify the store that the receipts have been updated */
            _receiptsUpdated() {
                if (this._receipt) {
                    this.log.debug("receipt updated and ready.");
                    this.context.listener.receiptsUpdated(CdvPurchase.Platform.APPLE_APPSTORE, [this._receipt, this.pseudoReceipt]);
                    this.context.listener.receiptsReady(CdvPurchase.Platform.APPLE_APPSTORE);
                }
                else {
                    this.log.debug("receipt updated.");
                    this.context.listener.receiptsUpdated(CdvPurchase.Platform.APPLE_APPSTORE, [this.pseudoReceipt]);
                }
            }
            setPaymentMonitor(fn) {
                this._paymentMonitor = fn;
            }
            callPaymentMonitor(status, code, message) {
                this._paymentMonitor(status);
            }
            initialize() {
                return new Promise(resolve => {
                    this.log.info('bridge.init');
                    const bridgeLogger = this.log.child('Bridge');
                    this.bridge.init({
                        autoFinish: this.autoFinish,
                        debug: this.context.verbosity === CdvPurchase.LogLevel.DEBUG,
                        log: msg => bridgeLogger.debug(msg),
                        error: (code, message, options) => {
                            this.log.error('ERROR: ' + code + ' - ' + message);
                            if (code === CdvPurchase.ErrorCode.PAYMENT_CANCELLED) {
                                // When the user closes the payment sheet, this generates a
                                // PAYMENT_CANCELLED error that isn't an error anymore since version 13
                                // of the plugin.
                                this.callPaymentMonitor('cancelled', CdvPurchase.ErrorCode.PAYMENT_CANCELLED, message);
                                return;
                            }
                            else {
                                this.context.error(appStoreError(code, message, (options === null || options === void 0 ? void 0 : options.productId) || null));
                            }
                        },
                        ready: () => {
                            this.log.info('ready');
                        },
                        purchased: (transactionIdentifier, productId, originalTransactionIdentifier, transactionDate, discountId) => __awaiter(this, void 0, void 0, function* () {
                            this.log.info('purchase: id:' + transactionIdentifier + ' product:' + productId + ' originalTransaction:' + originalTransactionIdentifier + ' - date:' + transactionDate + ' - discount:' + discountId);
                            // we can add the transaction to the receipt here
                            const transaction = yield this.upsertTransaction(productId, transactionIdentifier, CdvPurchase.TransactionState.APPROVED);
                            transaction.refresh(productId, originalTransactionIdentifier, transactionDate, discountId);
                            this.removeTransactionInProgress(productId);
                            this.receiptsUpdated();
                            this.callPaymentMonitor('purchased');
                        }),
                        purchaseEnqueued: (productId, quantity) => __awaiter(this, void 0, void 0, function* () {
                            this.log.info('purchaseEnqueued: ' + productId + ' - ' + quantity);
                            // let create a temporary transaction
                            yield this.upsertTransactionInProgress(productId, CdvPurchase.TransactionState.INITIATED);
                            this.context.listener.receiptsUpdated(CdvPurchase.Platform.APPLE_APPSTORE, [this.pseudoReceipt]);
                        }),
                        purchaseFailed: (productId, code, message) => {
                            this.log.info('purchaseFailed: ' + productId + ' - ' + code + ' - ' + message);
                            this.removeTransactionInProgress(productId);
                            this.context.listener.receiptsUpdated(CdvPurchase.Platform.APPLE_APPSTORE, [this.pseudoReceipt]);
                            this.callPaymentMonitor('failed', code, message);
                        },
                        purchasing: (productId) => __awaiter(this, void 0, void 0, function* () {
                            // purchase has been requested, but there's no transactionIdentifier yet.
                            // we can create a dummy transaction
                            this.log.info('purchasing: ' + productId);
                            yield this.upsertTransactionInProgress(productId, CdvPurchase.TransactionState.INITIATED);
                            // In order to prevent a receipt validation attempt here
                            // (which might happen if it hasn't been possible earlier)
                            // We should add "purchasing" transactions into a second, pseudo receipt.
                            this.context.listener.receiptsUpdated(CdvPurchase.Platform.APPLE_APPSTORE, [this.pseudoReceipt]);
                        }),
                        deferred: (productId) => __awaiter(this, void 0, void 0, function* () {
                            this.log.info('deferred: ' + productId);
                            yield this.upsertTransactionInProgress(productId, CdvPurchase.TransactionState.PENDING);
                            this.context.listener.receiptsUpdated(CdvPurchase.Platform.APPLE_APPSTORE, [this.pseudoReceipt]);
                            this.callPaymentMonitor('deferred');
                        }),
                        finished: (transactionIdentifier, productId) => __awaiter(this, void 0, void 0, function* () {
                            this.log.info('finish: ' + transactionIdentifier + ' - ' + productId);
                            this.removeTransactionInProgress(productId);
                            yield this.upsertTransaction(productId, transactionIdentifier, CdvPurchase.TransactionState.FINISHED);
                            this.receiptsUpdated();
                        }),
                        restored: (transactionIdentifier, productId) => __awaiter(this, void 0, void 0, function* () {
                            this.log.info('restore: ' + transactionIdentifier + ' - ' + productId);
                            yield this.upsertTransaction(productId, transactionIdentifier, CdvPurchase.TransactionState.APPROVED);
                            this.receiptsUpdated();
                        }),
                        receiptsRefreshed: (receipt) => {
                            this.log.info('receiptsRefreshed');
                            if (this._receipt)
                                this._receipt.refresh(receipt, this.needAppReceipt, this.context.apiDecorators);
                        },
                        restoreFailed: (errorCode) => {
                            this.log.info('restoreFailed: ' + errorCode);
                            if (this.onRestoreCompleted) {
                                this.onRestoreCompleted(appStoreError(errorCode, 'Restore purchases failed', null));
                                this.onRestoreCompleted = undefined;
                            }
                        },
                        restoreCompleted: () => {
                            this.log.info('restoreCompleted');
                            if (this.onRestoreCompleted) {
                                this.onRestoreCompleted(undefined);
                                this.onRestoreCompleted = undefined;
                            }
                        },
                    }, () => __awaiter(this, void 0, void 0, function* () {
                        this.log.info('bridge.init done');
                        yield this.canMakePayments();
                        resolve(undefined);
                    }), (code, message) => {
                        this.log.info('bridge.init failed: ' + code + ' - ' + message);
                        resolve(appStoreError(code, message, null));
                    });
                });
            }
            loadReceipts() {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        this.initializeAppReceipt(() => {
                            this.receiptsUpdated();
                            if (this._receipt) {
                                resolve([this._receipt, this.pseudoReceipt]);
                            }
                            else {
                                resolve([this.pseudoReceipt]);
                            }
                        });
                    }, 300);
                });
            }
            canMakePayments() {
                return __awaiter(this, void 0, void 0, function* () {
                    return new Promise(resolve => {
                        this.bridge.canMakePayments(() => {
                            this._canMakePayments = true;
                            resolve(true);
                        }, (message) => {
                            this.log.warn(`canMakePayments: ${message}`);
                            this._canMakePayments = false;
                            resolve(false);
                        });
                    });
                });
            }
            /**
             * Create the application receipt
             */
            initializeAppReceipt(callback) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (this._receipt) {
                        this.log.debug('initializeAppReceipt() => already initialized.');
                        return callback(undefined);
                    }
                    this._appStoreReceiptCallbacks.push(callback);
                    if (this._appStoreReceiptLoading) {
                        this.log.debug('initializeAppReceipt() => already loading.');
                        return;
                    }
                    this._appStoreReceiptLoading = true;
                    const nativeData = yield this.loadAppStoreReceipt();
                    const callCallbacks = (arg) => {
                        const callbacks = this._appStoreReceiptCallbacks;
                        this._appStoreReceiptCallbacks = [];
                        callbacks.forEach(cb => {
                            cb(arg);
                        });
                    };
                    if (!(nativeData === null || nativeData === void 0 ? void 0 : nativeData.appStoreReceipt)) {
                        this.log.warn('no appStoreReceipt');
                        this._appStoreReceiptLoading = false;
                        callCallbacks(appStoreError(CdvPurchase.ErrorCode.REFRESH, 'No appStoreReceipt', null));
                        return;
                    }
                    this._receipt = new AppleAppStore.SKApplicationReceipt(nativeData, this.needAppReceipt, this.context.apiDecorators);
                    callCallbacks(undefined);
                });
            }
            prepareReceipt(nativeData) {
                if (nativeData === null || nativeData === void 0 ? void 0 : nativeData.appStoreReceipt) {
                    if (!this._receipt) {
                        this._receipt = new AppleAppStore.SKApplicationReceipt(nativeData, this.needAppReceipt, this.context.apiDecorators);
                    }
                    else {
                        this._receipt.refresh(nativeData, this.needAppReceipt, this.context.apiDecorators);
                    }
                }
            }
            /** Promisified loading of the AppStore receipt */
            loadAppStoreReceipt() {
                return __awaiter(this, void 0, void 0, function* () {
                    let resolved = false;
                    return new Promise(resolve => {
                        var _a;
                        if (((_a = this.bridge.appStoreReceipt) === null || _a === void 0 ? void 0 : _a.appStoreReceipt) && !this.forceReceiptReload) {
                            this.log.debug('using cached appstore receipt');
                            return resolve(this.bridge.appStoreReceipt);
                        }
                        this.log.debug('loading appstore receipt...');
                        this.forceReceiptReload = false;
                        this.bridge.loadReceipts(receipt => {
                            this.log.debug('appstore receipt loaded');
                            if (!resolved)
                                resolve(receipt);
                            resolved = true;
                        }, (code, message) => {
                            // this should not happen: native side never triggers an error
                            this.log.warn('Failed to load appStoreReceipt: ' + code + ' - ' + message);
                            if (!resolved)
                                resolve(undefined);
                            resolved = true;
                        });
                        // If the receipt cannot be loaded, timeout after 5 seconds
                        setTimeout(function () {
                            if (!resolved)
                                resolve(undefined);
                            resolved = true;
                        }, 5000);
                    }).then(result => {
                        this.context.listener.receiptsReady(CdvPurchase.Platform.APPLE_APPSTORE);
                        return result;
                    }).catch(reason => {
                        this.context.listener.receiptsReady(CdvPurchase.Platform.APPLE_APPSTORE);
                        return reason;
                    });
                });
            }
            loadEligibility(validProducts) {
                return __awaiter(this, void 0, void 0, function* () {
                    this.log.debug('load eligibility: ' + JSON.stringify(validProducts));
                    if (!this.discountEligibilityDeterminer) {
                        this.log.debug('No discount eligibility determiner, skipping...');
                        return new AppleAppStore.Internal.DiscountEligibilities([], []);
                    }
                    const eligibilityRequests = [];
                    validProducts.forEach(valid => {
                        var _a, _b, _c;
                        (_a = valid.discounts) === null || _a === void 0 ? void 0 : _a.forEach(discount => {
                            eligibilityRequests.push({
                                productId: valid.id,
                                discountId: discount.id,
                                discountType: discount.type,
                            });
                        });
                        if (((_c = (_b = valid.discounts) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0) === 0 && valid.introPrice) {
                            // sometime apple returns the discounts in the deprecated "introductory" info
                            // we create a special "discount" with the id "intro" to check for eligibility.
                            eligibilityRequests.push({
                                productId: valid.id,
                                discountId: 'intro',
                                discountType: 'Introductory',
                            });
                        }
                    });
                    if (eligibilityRequests.length > 0) {
                        const applicationReceipt = yield this.loadAppStoreReceipt();
                        if (!applicationReceipt || !applicationReceipt.appStoreReceipt) {
                            this.log.debug('no receipt, assuming introductory price are available.');
                            return new AppleAppStore.Internal.DiscountEligibilities(eligibilityRequests, eligibilityRequests.map(r => r.discountType === "Introductory"));
                        }
                        else {
                            this.log.debug('calling discount eligibility determiner.');
                            const response = yield this.callDiscountEligibilityDeterminer(applicationReceipt, eligibilityRequests);
                            this.log.debug('response: ' + JSON.stringify(response));
                            return new AppleAppStore.Internal.DiscountEligibilities(eligibilityRequests, response);
                        }
                    }
                    else {
                        return new AppleAppStore.Internal.DiscountEligibilities([], []);
                    }
                });
            }
            callDiscountEligibilityDeterminer(applicationReceipt, eligibilityRequests) {
                return new Promise(resolve => {
                    if (!this.discountEligibilityDeterminer)
                        return resolve([]);
                    this.discountEligibilityDeterminer(applicationReceipt, eligibilityRequests, resolve);
                });
            }
            loadProducts(products) {
                return new Promise(resolve => {
                    this.log.info('bridge.load');
                    this.bridge.load(products.map(p => p.id), (validProducts, invalidProducts) => __awaiter(this, void 0, void 0, function* () {
                        this.log.info('bridge.loaded: ' + JSON.stringify({ validProducts, invalidProducts }));
                        this.addValidProducts(products, validProducts);
                        const eligibilities = yield this.loadEligibility(validProducts);
                        this.log.info('eligibilities ready: ' + JSON.stringify(eligibilities));
                        // for any valid product that includes a discount, check the eligibility.
                        const ret = products.map(p => {
                            if (invalidProducts.indexOf(p.id) >= 0) {
                                this.log.debug(`${p.id} is invalid`);
                                return appStoreError(CdvPurchase.ErrorCode.INVALID_PRODUCT_ID, 'Product not found in AppStore. #400', p.id);
                            }
                            else {
                                const valid = validProducts.find(v => v.id === p.id);
                                this.log.debug(`${p.id} is valid: ${JSON.stringify(valid)}`);
                                if (!valid)
                                    return appStoreError(CdvPurchase.ErrorCode.INVALID_PRODUCT_ID, 'Product not found in AppStore. #404', p.id);
                                let product = this.getProduct(p.id);
                                if (product) {
                                    this.log.debug('refreshing existing product');
                                    product === null || product === void 0 ? void 0 : product.refresh(valid, this.context.apiDecorators, eligibilities);
                                }
                                else {
                                    this.log.debug('registering new product');
                                    product = new AppleAppStore.SKProduct(valid, p, this.context.apiDecorators, eligibilities);
                                    this._products.push(product);
                                }
                                return product;
                            }
                        });
                        this.log.debug(`Products loaded: ${JSON.stringify(ret)}`);
                        resolve(ret);
                    }), (code, message) => {
                        return products.map(p => appStoreError(code, message, null));
                    });
                });
            }
            order(offer, additionalData) {
                return __awaiter(this, void 0, void 0, function* () {
                    let resolved = false;
                    return new Promise(resolve => {
                        var _a;
                        const callResolve = (result) => {
                            if (resolved)
                                return;
                            this.setPaymentMonitor(() => { });
                            resolved = true;
                            resolve(result);
                        };
                        this.log.info('order');
                        const discountId = offer.id !== AppleAppStore.DEFAULT_OFFER_ID ? offer.id : undefined;
                        const discount = (_a = additionalData === null || additionalData === void 0 ? void 0 : additionalData.appStore) === null || _a === void 0 ? void 0 : _a.discount;
                        if (discountId && !discount) {
                            return callResolve(appStoreError(CdvPurchase.ErrorCode.MISSING_OFFER_PARAMS, 'Missing additionalData.appStore.discount when ordering a discount offer', offer.productId));
                        }
                        if (discountId && ((discount === null || discount === void 0 ? void 0 : discount.id) !== discountId)) {
                            return callResolve(appStoreError(CdvPurchase.ErrorCode.INVALID_OFFER_IDENTIFIER, 'Offer identifier does not match additionalData.appStore.discount.id', offer.productId));
                        }
                        this.setPaymentMonitor((status, code, message) => {
                            this.log.info('order.paymentMonitor => ' + status + ' ' + (code !== null && code !== void 0 ? code : '') + ' ' + (message !== null && message !== void 0 ? message : ''));
                            if (resolved)
                                return;
                            switch (status) {
                                case 'cancelled':
                                    callResolve(appStoreError(code !== null && code !== void 0 ? code : CdvPurchase.ErrorCode.PAYMENT_CANCELLED, message !== null && message !== void 0 ? message : 'The user cancelled the order.', offer.productId));
                                    break;
                                case 'failed':
                                    // note, "failed" might be triggered before "cancelled",
                                    // so we'll give some time to catch the "cancelled" event.
                                    setTimeout(() => {
                                        callResolve(appStoreError(code !== null && code !== void 0 ? code : CdvPurchase.ErrorCode.PURCHASE, message !== null && message !== void 0 ? message : 'Purchase failed', offer.productId));
                                    }, 500);
                                    break;
                                case 'purchased':
                                case 'deferred':
                                    callResolve(undefined);
                                    break;
                            }
                        });
                        const success = () => {
                            this.log.info('order.success');
                            // We'll monitor the payment before resolving.
                        };
                        const error = () => {
                            this.log.info('order.error');
                            callResolve(appStoreError(CdvPurchase.ErrorCode.PURCHASE, 'Failed to place order', offer.productId));
                        };
                        // When we switch AppStore user, the cached receipt isn't from the new user.
                        // so after a purchase, we want to make sure we're using the receipt from the logged in user.
                        this.forceReceiptReload = true;
                        this.bridge.purchase(offer.productId, 1, this.context.getApplicationUsername(), discount, success, error);
                    });
                });
            }
            finish(transaction) {
                return new Promise(resolve => {
                    this.log.info('finish(' + transaction.transactionId + ')');
                    if (transaction.transactionId === AppleAppStore.APPLICATION_VIRTUAL_TRANSACTION_ID || transaction.transactionId === virtualTransactionId(transaction.products[0].id)) {
                        // this is a virtual transaction, nothing to do.
                        transaction.state = CdvPurchase.TransactionState.FINISHED;
                        this.context.listener.receiptsUpdated(CdvPurchase.Platform.APPLE_APPSTORE, [transaction.parentReceipt]);
                        return resolve(undefined);
                    }
                    const success = () => {
                        transaction.state = CdvPurchase.TransactionState.FINISHED;
                        this.context.listener.receiptsUpdated(CdvPurchase.Platform.APPLE_APPSTORE, [transaction.parentReceipt]);
                        resolve(undefined);
                    };
                    const error = (msg) => {
                        var _a, _b;
                        if (msg === null || msg === void 0 ? void 0 : msg.includes('[#CdvPurchase:100]')) {
                            // already finished
                            success();
                        }
                        else {
                            resolve(appStoreError(CdvPurchase.ErrorCode.FINISH, 'Failed to finish transaction', (_b = (_a = transaction.products[0]) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null));
                        }
                    };
                    this.bridge.finish(transaction.transactionId, success, error);
                });
            }
            refreshReceipt() {
                return new Promise(resolve => {
                    const success = (receipt) => {
                        // at that point, the receipt should have been refreshed.
                        resolve(receipt);
                    };
                    const error = (code, message) => {
                        resolve(appStoreError(code, message, null));
                    };
                    this.bridge.refreshReceipts(success, error);
                });
            }
            receiptValidationBody(receipt) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (receipt.platform !== CdvPurchase.Platform.APPLE_APPSTORE)
                        return;
                    if (receipt !== this._receipt)
                        return; // do not validate the pseudo receipt
                    const skReceipt = receipt;
                    let applicationReceipt = skReceipt.nativeData;
                    if (this.forceReceiptReload) {
                        const nativeData = yield this.loadAppStoreReceipt();
                        this.forceReceiptReload = false;
                        if (nativeData) {
                            applicationReceipt = nativeData;
                            this.prepareReceipt(nativeData);
                        }
                    }
                    if (!skReceipt.nativeData.appStoreReceipt) {
                        this.log.info('Cannot prepare the receipt validation body, because appStoreReceipt is missing. Refreshing...');
                        const result = yield this.refreshReceipt();
                        if (!result || 'isError' in result) {
                            this.log.warn('Failed to refresh receipt, cannot run receipt validation.');
                            if (result)
                                this.log.error(result);
                            return;
                        }
                        this.log.info('Receipt refreshed.');
                        applicationReceipt = result;
                    }
                    const transaction = skReceipt.transactions.slice(-1)[0];
                    return {
                        id: applicationReceipt.bundleIdentifier,
                        type: CdvPurchase.ProductType.APPLICATION,
                        // send all products and offers so validator get pricing information
                        products: CdvPurchase.Utils.objectValues(this.validProducts).map(vp => new AppleAppStore.SKProduct(vp, vp, this.context.apiDecorators, { isEligible: () => true })),
                        transaction: {
                            type: 'ios-appstore',
                            id: transaction === null || transaction === void 0 ? void 0 : transaction.transactionId,
                            appStoreReceipt: applicationReceipt.appStoreReceipt,
                        }
                    };
                });
            }
            handleReceiptValidationResponse(_receipt, response) {
                var _a, _b;
                return __awaiter(this, void 0, void 0, function* () {
                    // we can add the purchaseDate to the application transaction
                    let localReceiptUpdated = false;
                    if (response.ok) {
                        const vTransaction = (_a = response.data) === null || _a === void 0 ? void 0 : _a.transaction;
                        if ((vTransaction === null || vTransaction === void 0 ? void 0 : vTransaction.type) === 'ios-appstore' && 'original_application_version' in vTransaction) {
                            (_b = this._receipt) === null || _b === void 0 ? void 0 : _b.transactions.forEach(t => {
                                if (t.transactionId === AppleAppStore.APPLICATION_VIRTUAL_TRANSACTION_ID) {
                                    if (vTransaction.original_purchase_date_ms) {
                                        t.purchaseDate = new Date(parseInt(vTransaction.original_purchase_date_ms));
                                        localReceiptUpdated = true;
                                    }
                                }
                            });
                        }
                    }
                    if (localReceiptUpdated)
                        this.context.listener.receiptsUpdated(CdvPurchase.Platform.APPLE_APPSTORE, [_receipt]);
                });
            }
            requestPayment(payment, additionalData) {
                return __awaiter(this, void 0, void 0, function* () {
                    return appStoreError(CdvPurchase.ErrorCode.UNKNOWN, 'requestPayment not supported', null);
                });
            }
            manageSubscriptions() {
                return __awaiter(this, void 0, void 0, function* () {
                    this.bridge.manageSubscriptions();
                    return;
                });
            }
            manageBilling() {
                return __awaiter(this, void 0, void 0, function* () {
                    this.bridge.manageBilling();
                    return;
                });
            }
            checkSupport(functionality) {
                if (functionality === 'order')
                    return this._canMakePayments;
                const supported = [
                    'order', 'manageBilling', 'manageSubscriptions'
                ];
                return supported.indexOf(functionality) >= 0;
            }
            restorePurchases() {
                return new Promise(resolve => {
                    this.onRestoreCompleted = (error) => {
                        this.onRestoreCompleted = undefined;
                        this.bridge.refreshReceipts(obj => {
                            resolve(error);
                        }, (code, message) => {
                            resolve(error || appStoreError(code, message, null));
                        });
                    };
                    this.forceReceiptReload = true;
                    this.bridge.restore();
                });
            }
            presentCodeRedemptionSheet() {
                return new Promise(resolve => {
                    this.bridge.presentCodeRedemptionSheet(resolve);
                });
            }
        }
        AppleAppStore.Adapter = Adapter;
        function appStoreError(code, message, productId) {
            return CdvPurchase.storeError(code, message, CdvPurchase.Platform.APPLE_APPSTORE, productId);
        }
    })(AppleAppStore = CdvPurchase.AppleAppStore || (CdvPurchase.AppleAppStore = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    let AppleAppStore;
    (function (AppleAppStore) {
        let Bridge;
        (function (Bridge_1) {
            /** No-operation function, used as a default for callbacks */
            const noop = (args) => { };
            /** Logger */
            let log = noop;
            /** Execute a native method */
            function exec(methodName, options, success, error) {
                window.cordova.exec(success, error, "InAppPurchase", methodName, options);
            }
            ;
            /** Execute a javascript-side method in a try-catch block */
            function protectCall(callback, context, ...args) {
                if (!callback) {
                    return;
                }
                try {
                    // const args = Array.prototype.slice.call(arguments, 2);
                    callback.apply(this, args);
                }
                catch (err) {
                    log('exception in ' + context + ': "' + err + '"');
                }
            }
            ;
            class Bridge {
                constructor() {
                    /** Transactions for a given product */
                    this.transactionsForProduct = {};
                    /** True when the SDK has been initialized */
                    this.initialized = false;
                    /** List of registered product identifiers */
                    this.registeredProducts = [];
                    /** True if "restoreCompleted" or "restoreFailed" should be called when restore is done */
                    this.needRestoreNotification = false;
                    /*
                    private eventQueue: {
                        state: TransactionState;
                        errorCode: ErrorCode | undefined;
                        errorText: string | undefined;
                        transactionIdentifier: string;
                        productId: string;
                        /** @deprecated *
                        transactionReceipt: never;
                        originalTransactionIdentifier: string | undefined;
                        transactionDate: string;
                        discountId: string;
                    }[] = [];
    
                    private timer: number | null = null;
                    */
                    /** List of transaction updates to process */
                    this.pendingUpdates = [];
                    /** @deprecated */
                    this.onPurchased = false;
                    /** @deprecated */
                    this.onFailed = false;
                    /** @deprecated */
                    this.onRestored = false;
                    window.storekit = this; // used by native to communicate with this bridge
                    this.options = {
                        error: noop,
                        ready: noop,
                        purchased: noop,
                        purchaseEnqueued: noop,
                        purchasing: noop,
                        purchaseFailed: noop,
                        deferred: noop,
                        finished: noop,
                        restored: noop,
                        receiptsRefreshed: noop,
                        restoreFailed: noop,
                        restoreCompleted: noop,
                    };
                    // if (window.localStorage && window.localStorage.sk_transactionForProduct)
                    // this.transactionsForProduct = JSON.parse(window.localStorage.sk_transactionForProduct);
                    // Remove support for receipt.forTransaction(...)
                    // `appStoreReceipt` is now the only supported receipt format on iOS (drops support for iOS <= 6)
                    // if (window.localStorage.sk_receiptForTransaction)
                    // delete window.localStorage.sk_receiptForTransaction;
                }
                /**
                 * Initialize the AppStore bridge.
                 *
                 * This calls the native "setup" method from the "InAppPurchase" Objective-C class.
                 *
                 * @param options Options for the bridge
                 * @param success Called when the bridge is ready
                 * @param error Called when the bridge failed to initialize
                 */
                init(options, success, error) {
                    this.options = {
                        error: options.error || noop,
                        ready: options.ready || noop,
                        purchased: options.purchased || noop,
                        purchaseEnqueued: options.purchaseEnqueued || noop,
                        purchasing: options.purchasing || noop,
                        purchaseFailed: options.purchaseFailed || noop,
                        deferred: options.deferred || noop,
                        finished: options.finished || noop,
                        restored: options.restored || noop,
                        receiptsRefreshed: options.receiptsRefreshed || noop,
                        restoreFailed: options.restoreFailed || noop,
                        restoreCompleted: options.restoreCompleted || noop,
                    };
                    if (options.debug) {
                        exec('debug', [], noop, noop);
                        log = options.log || function (msg) {
                            console.log("[CdvPurchase.AppAppStore.Bridge] " + msg);
                        };
                    }
                    if (options.autoFinish) {
                        exec('autoFinish', [], noop, noop);
                    }
                    const setupOk = () => {
                        log('setup ok');
                        protectCall(this.options.ready, 'options.ready');
                        protectCall(success, 'init.success');
                        this.initialized = true;
                        setTimeout(() => this.processPendingTransactions(), 50);
                    };
                    const setupFailed = (err) => {
                        log('setup failed');
                        // protectCall(this.options.error, 'options.error', ErrorCode.SETUP, 'Setup failed');
                        protectCall(error, 'init.error', CdvPurchase.ErrorCode.SETUP, 'Setup failed: ' + err);
                    };
                    exec('setup', [], setupOk, setupFailed);
                }
                processPendingTransactions() {
                    log('processing pending transactions');
                    exec('processPendingTransactions', [], () => {
                        this.finalizeTransactionUpdates();
                    }, undefined);
                }
                /**
                 * Makes an in-app purchase.
                 *
                 * @param {String} productId The product identifier. e.g. "com.example.MyApp.myproduct"
                 * @param {int} quantity Quantity of product to purchase
                 */
                purchase(productId, quantity, applicationUsername, discount, success, error) {
                    quantity = (quantity | 0) || 1;
                    const options = this.options;
                    // Many people forget to load information about their products from apple's servers before allowing
                    // users to purchase them... leading them to spam us with useless issues and comments.
                    // Let's chase them down!
                    if (this.registeredProducts.indexOf(productId) < 0) {
                        const msg = 'Purchasing ' + productId + ' failed.  Ensure the product was loaded first with Bridge.load(...)!';
                        log(msg);
                        if (typeof options.error === 'function') {
                            protectCall(options.error, 'options.error', CdvPurchase.ErrorCode.PURCHASE, 'Trying to purchase a unknown product.', { productId, quantity });
                        }
                        return;
                    }
                    const purchaseOk = () => {
                        log('Purchase enqueued ' + productId);
                        if (typeof options.purchaseEnqueued === 'function') {
                            protectCall(options.purchaseEnqueued, 'options.purchaseEnqueued', productId, quantity);
                        }
                        protectCall(success, 'purchase.success');
                    };
                    const purchaseFailed = () => {
                        const errMsg = 'Purchase failed: ' + productId;
                        log(errMsg);
                        if (typeof options.error === 'function') {
                            protectCall(options.error, 'options.error', CdvPurchase.ErrorCode.PURCHASE, errMsg, { productId, quantity });
                        }
                        protectCall(error, 'purchase.error');
                    };
                    exec('purchase', [productId, quantity, applicationUsername, discount || {}], purchaseOk, purchaseFailed);
                }
                /**
                 * Checks if device/user is allowed to make in-app purchases
                 */
                canMakePayments(success, error) {
                    return exec("canMakePayments", [], success, error);
                }
                /**
                 * Asks the payment queue to restore previously completed purchases.
                 *
                 * The restored transactions are passed to the onRestored callback, so make sure you define a handler for that first.
                 */
                restore(callback) {
                    this.needRestoreNotification = true;
                    exec('restoreCompletedTransactions', [], callback, callback);
                }
                manageSubscriptions(callback) {
                    exec('manageSubscriptions', [], callback, callback);
                }
                manageBilling(callback) {
                    exec('manageBilling', [], callback, callback);
                }
                presentCodeRedemptionSheet(callback) {
                    exec('presentCodeRedemptionSheet', [], callback, callback);
                }
                /**
                 * Retrieves localized product data, including price (as localized
                 * string), name, description of multiple products.
                 *
                 * @param {Array} productIds
                 *   An array of product identifier strings.
                 *
                 * @param {Function} callback
                 *   Called once with the result of the products request. Signature:
                 *
                 *     function(validProducts, invalidProductIds)
                 *
                 *   where validProducts receives an array of objects of the form:
                 *
                 *     {
                 *       id: "<productId>",
                 *       title: "<localised title>",
                 *       description: "<localised escription>",
                 *       price: "<localised price>"
                 *     }
                 *
                 *  and invalidProductIds receives an array of product identifier
                 *  strings which were rejected by the app store.
                 */
                load(productIds, success, error) {
                    const options = this.options;
                    if (typeof productIds === "string") {
                        productIds = [productIds];
                    }
                    if (!productIds) {
                        // Empty array, nothing to do.
                        protectCall(success, 'load.success', [], []);
                    }
                    else if (!productIds.length) {
                        // Empty array, nothing to do.
                        protectCall(success, 'load.success', [], []);
                    }
                    else {
                        if (typeof productIds[0] !== 'string') {
                            const msg = 'invalid productIds given to store.load: ' + JSON.stringify(productIds);
                            log(msg);
                            protectCall(options.error, 'options.error', CdvPurchase.ErrorCode.LOAD, msg);
                            protectCall(error, 'load.error', CdvPurchase.ErrorCode.LOAD, msg);
                            return;
                        }
                        log('load ' + JSON.stringify(productIds));
                        const loadOk = (array) => {
                            const valid = array[0];
                            const invalid = array[1];
                            log('load ok: { valid:' + JSON.stringify(valid) + ' invalid:' + JSON.stringify(invalid) + ' }');
                            protectCall(success, 'load.success', valid, invalid);
                        };
                        const loadFailed = (errMessage) => {
                            log('load failed');
                            log(errMessage);
                            const message = 'Load failed: ' + errMessage;
                            protectCall(options.error, 'options.error', CdvPurchase.ErrorCode.LOAD, message);
                            protectCall(error, 'load.error', CdvPurchase.ErrorCode.LOAD, message);
                        };
                        this.registeredProducts = this.registeredProducts.concat(productIds);
                        exec('load', [productIds], loadOk, loadFailed);
                    }
                }
                /*
                 * Finish an unfinished transaction.
                 *
                 * @param {String} transactionId
                 *    Identifier of the transaction to finish.
                 *
                 * You have to call this method manually except when using the autoFinish option.
                 */
                finish(transactionId, success, error) {
                    exec('finishTransaction', [transactionId], success, error);
                }
                finalizeTransactionUpdates() {
                    for (let i = 0; i < this.pendingUpdates.length; ++i) {
                        const args = this.pendingUpdates[i];
                        this.transactionUpdated(args.state, args.errorCode, args.errorText, args.transactionIdentifier, args.productId, args.transactionReceipt, args.originalTransactionIdentifier, args.transactionDate, args.discountId);
                    }
                    this.pendingUpdates = [];
                }
                lastTransactionUpdated() {
                    // no more pending transactions
                }
                // This is called from native.
                //
                // Note that it may eventually be called before initialization... unfortunately.
                // In this case, we'll just keep pending updates in a list for later processing.
                transactionUpdated(state, errorCode, errorText, transactionIdentifier, productId, transactionReceipt, originalTransactionIdentifier, transactionDate, discountId) {
                    if (!this.initialized) {
                        this.pendingUpdates.push({ state, errorCode, errorText, transactionIdentifier, productId, transactionReceipt, originalTransactionIdentifier, transactionDate, discountId });
                        return;
                    }
                    log("transaction updated:" + transactionIdentifier + " state:" + state + " product:" + productId);
                    if (productId && transactionIdentifier) {
                        if (this.transactionsForProduct[productId]) {
                            this.transactionsForProduct[productId].push(transactionIdentifier);
                        }
                        else {
                            this.transactionsForProduct[productId] = [transactionIdentifier];
                        }
                    }
                    switch (state) {
                        case "PaymentTransactionStatePurchasing":
                            protectCall(this.options.purchasing, 'options.purchasing', productId);
                            return;
                        case "PaymentTransactionStatePurchased":
                            protectCall(this.options.purchased, 'options.purchase', transactionIdentifier, productId, originalTransactionIdentifier, transactionDate, discountId);
                            return;
                        case "PaymentTransactionStateDeferred":
                            protectCall(this.options.deferred, 'options.deferred', productId);
                            return;
                        case "PaymentTransactionStateFailed":
                            protectCall(this.options.purchaseFailed, 'options.purchaseFailed', productId, errorCode || CdvPurchase.ErrorCode.UNKNOWN, errorText || 'ERROR');
                            protectCall(this.options.error, 'options.error', errorCode || CdvPurchase.ErrorCode.UNKNOWN, errorText || 'ERROR', { productId });
                            return;
                        case "PaymentTransactionStateRestored":
                            protectCall(this.options.restored, 'options.restore', transactionIdentifier, productId);
                            return;
                        case "PaymentTransactionStateFinished":
                            protectCall(this.options.finished, 'options.finish', transactionIdentifier, productId);
                            return;
                    }
                }
                restoreCompletedTransactionsFinished() {
                    if (!this.needRestoreNotification)
                        return;
                    this.needRestoreNotification = false;
                    protectCall(this.options.restoreCompleted, 'options.restoreCompleted');
                }
                restoreCompletedTransactionsFailed(errorCode) {
                    if (!this.needRestoreNotification)
                        return;
                    this.needRestoreNotification = false;
                    protectCall(this.options.restoreFailed, 'options.restoreFailed', errorCode);
                }
                parseReceiptArgs(args) {
                    const base64 = args[0];
                    const bundleIdentifier = args[1];
                    const bundleShortVersion = args[2];
                    const bundleNumericVersion = args[3];
                    const bundleSignature = args[4];
                    log('infoPlist: ' + bundleIdentifier + "," + bundleShortVersion + "," + bundleNumericVersion + "," + bundleSignature);
                    return {
                        appStoreReceipt: base64,
                        bundleIdentifier: bundleIdentifier,
                        bundleShortVersion: bundleShortVersion,
                        bundleNumericVersion: bundleNumericVersion,
                        bundleSignature: bundleSignature
                    };
                }
                refreshReceipts(successCb, errorCb) {
                    const loaded = (args) => {
                        const data = this.parseReceiptArgs(args);
                        this.appStoreReceipt = data;
                        protectCall(this.options.receiptsRefreshed, 'options.receiptsRefreshed', data);
                        protectCall(successCb, "refreshReceipts.success", data);
                    };
                    const error = (errMessage) => {
                        log('refresh receipt failed: ' + errMessage);
                        if (errMessage.includes("(@AMSErrorDomain:100)")) {
                            log('authentication failed, indicated by the string "(@AMSErrorDomain:100)"');
                        }
                        protectCall(this.options.error, 'options.error', CdvPurchase.ErrorCode.REFRESH_RECEIPTS, 'Failed to refresh receipt: ' + errMessage);
                        protectCall(errorCb, "refreshReceipts.error", CdvPurchase.ErrorCode.REFRESH_RECEIPTS, 'Failed to refresh receipt: ' + errMessage);
                    };
                    this.appStoreReceipt = null;
                    log('refreshing appStoreReceipt');
                    exec('appStoreRefreshReceipt', [], loaded, error);
                }
                loadReceipts(callback, errorCb) {
                    const loaded = (args) => {
                        const data = this.parseReceiptArgs(args);
                        this.appStoreReceipt = data;
                        protectCall(callback, 'loadReceipts.callback', data);
                    };
                    const error = (errMessage) => {
                        // should not happen (native side never triggers an error)
                        // log('load failed: ' + errMessage);
                        // protectCall(this.options.error, 'options.error', ErrorCode.LOAD_RECEIPTS, 'Failed to load receipt: ' + errMessage);
                        // protectCall(errorCb, 'loadReceipts.error', ErrorCode.LOAD_RECEIPTS, 'Failed to load receipt: ' + errMessage);
                    };
                    log('loading appStoreReceipt');
                    exec('appStoreReceipt', [], loaded, error);
                }
            }
            Bridge_1.Bridge = Bridge;
        })(Bridge = AppleAppStore.Bridge || (AppleAppStore.Bridge = {}));
    })(AppleAppStore = CdvPurchase.AppleAppStore || (CdvPurchase.AppleAppStore = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    /**
     * Apple AppStore adapter using StoreKit version 1
     */
    let AppleAppStore;
    (function (AppleAppStore) {
        /** @internal */
        let Internal;
        (function (Internal) {
            class DiscountEligibilities {
                constructor(request, response) {
                    this.request = request;
                    this.response = response;
                }
                isEligible(productId, discountType, discountId) {
                    var _a;
                    for (let i = 0; i < this.request.length; ++i) {
                        const req = this.request[i];
                        if (req.productId === productId && req.discountId === discountId && req.discountType === discountType) {
                            return (_a = this.response[i]) !== null && _a !== void 0 ? _a : false;
                        }
                    }
                    // No request for this product, let's say it's eligible.
                    return true;
                }
            }
            Internal.DiscountEligibilities = DiscountEligibilities;
        })(Internal = AppleAppStore.Internal || (AppleAppStore.Internal = {}));
    })(AppleAppStore = CdvPurchase.AppleAppStore || (CdvPurchase.AppleAppStore = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    /**
     * Apple AppStore adapter using StoreKit version 1
     */
    let AppleAppStore;
    (function (AppleAppStore) {
        AppleAppStore.DEFAULT_OFFER_ID = '$';
        class SKOffer extends CdvPurchase.Offer {
            constructor(options, decorator) {
                super(options, decorator);
                this.offerType = options.offerType;
            }
        }
        AppleAppStore.SKOffer = SKOffer;
        class SKProduct extends CdvPurchase.Product {
            constructor(validProduct, p, decorator, eligibilities) {
                super(p, decorator);
                this.raw = validProduct;
                this.refresh(validProduct, decorator, eligibilities);
            }
            removeIneligibleDiscounts(eligibilities) {
                this.offers = this.offers.filter(offer => {
                    const skOffer = offer;
                    if (skOffer.offerType === 'Default')
                        return true;
                    return eligibilities.isEligible(this.id, skOffer.offerType, offer.id);
                });
            }
            refresh(valid, decorator, eligibilities) {
                var _a;
                this.raw = valid;
                this.title = valid.title;
                this.description = valid.description;
                this.countryCode = valid.countryCode;
                if (valid.group)
                    this.group = valid.group;
                this.removeIneligibleDiscounts(eligibilities);
                // default offer
                const finalPhase = {
                    price: valid.price,
                    priceMicros: valid.priceMicros,
                    currency: valid.currency,
                    billingPeriod: formatBillingPeriod(valid.billingPeriod, valid.billingPeriodUnit),
                    paymentMode: this.type === CdvPurchase.ProductType.PAID_SUBSCRIPTION ? CdvPurchase.PaymentMode.PAY_AS_YOU_GO : CdvPurchase.PaymentMode.UP_FRONT,
                    recurrenceMode: this.type === CdvPurchase.ProductType.PAID_SUBSCRIPTION ? CdvPurchase.RecurrenceMode.INFINITE_RECURRING : CdvPurchase.RecurrenceMode.NON_RECURRING,
                };
                // discounts
                (_a = valid.discounts) === null || _a === void 0 ? void 0 : _a.forEach(discount => {
                    if (eligibilities.isEligible(valid.id, discount.type, discount.id)) {
                        const pricingPhases = [];
                        const numCycles = discount.paymentMode === CdvPurchase.PaymentMode.PAY_AS_YOU_GO ? discount.period : 1;
                        const numPeriods = discount.paymentMode === CdvPurchase.PaymentMode.PAY_AS_YOU_GO ? 1 : discount.period;
                        const discountPhase = {
                            price: discount.price,
                            priceMicros: discount.priceMicros,
                            currency: valid.currency,
                            billingPeriod: formatBillingPeriod(numPeriods, discount.periodUnit),
                            billingCycles: numCycles,
                            paymentMode: discount.paymentMode,
                            recurrenceMode: CdvPurchase.RecurrenceMode.FINITE_RECURRING,
                        };
                        pricingPhases.push(discountPhase);
                        pricingPhases.push(finalPhase);
                        this.addOffer(new SKOffer({ id: discount.id, product: this, pricingPhases, offerType: discount.type }, decorator));
                    }
                });
                if (!hasIntroductoryOffer(this)) {
                    const defaultPhases = [];
                    // According to specs, intro price should be in the discounts array, but it turns out
                    // it's not always the case (when there are no discount offers maybe?)...
                    if (valid.introPrice && valid.introPriceMicros !== undefined && eligibilities.isEligible(valid.id, 'Introductory', 'intro')) {
                        const introPrice = {
                            price: valid.introPrice,
                            priceMicros: valid.introPriceMicros,
                            currency: valid.currency,
                            billingPeriod: formatBillingPeriod(valid.introPricePeriod, valid.introPricePeriodUnit),
                            paymentMode: valid.introPricePaymentMode,
                            recurrenceMode: CdvPurchase.RecurrenceMode.FINITE_RECURRING,
                            billingCycles: 1,
                        };
                        defaultPhases.push(introPrice);
                    }
                    defaultPhases.push(finalPhase);
                    this.addOffer(new SKOffer({
                        id: AppleAppStore.DEFAULT_OFFER_ID,
                        product: this,
                        pricingPhases: defaultPhases,
                        offerType: 'Default',
                    }, decorator));
                }
                function hasIntroductoryOffer(product) {
                    return product.offers.filter(offer => {
                        const skOffer = offer;
                        return (skOffer.offerType === 'Introductory') || (skOffer.offerType === 'Default' && skOffer.pricingPhases.length > 1);
                        // return (offer as SKOffer).offerType === 'Introductory';
                    }).length > 0;
                }
                /**
                 * Return ISO form of an IPeriodUnit + number of periods
                 */
                function formatBillingPeriod(numPeriods, period) {
                    if (numPeriods && period)
                        return `P${numPeriods}${period[0]}`;
                    else
                        return undefined;
                }
            }
        }
        AppleAppStore.SKProduct = SKProduct;
    })(AppleAppStore = CdvPurchase.AppleAppStore || (CdvPurchase.AppleAppStore = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    let AppleAppStore;
    (function (AppleAppStore) {
        /**
         * Transaction ID used for the application virtual transaction
         */
        AppleAppStore.APPLICATION_VIRTUAL_TRANSACTION_ID = 'appstore.application';
        /**
         * StoreKit 1 exposes a single receipt that contains all transactions.
         */
        class SKApplicationReceipt extends CdvPurchase.Receipt {
            constructor(applicationReceipt, needApplicationReceipt, decorator) {
                super(CdvPurchase.Platform.APPLE_APPSTORE, decorator);
                this.nativeData = applicationReceipt;
                this.refresh(this.nativeData, needApplicationReceipt, decorator);
            }
            refresh(nativeData, needApplicationReceipt, decorator) {
                this.nativeData = nativeData;
                if (needApplicationReceipt) {
                    const existing = this.transactions.find(t => t.transactionId === AppleAppStore.APPLICATION_VIRTUAL_TRANSACTION_ID);
                    if (existing) {
                        return;
                    }
                    const t = new CdvPurchase.Transaction(CdvPurchase.Platform.APPLE_APPSTORE, this, decorator);
                    t.transactionId = AppleAppStore.APPLICATION_VIRTUAL_TRANSACTION_ID;
                    t.state = CdvPurchase.TransactionState.APPROVED;
                    t.products.push({
                        id: nativeData.bundleIdentifier,
                    });
                    this.transactions.push(t);
                }
            }
        }
        AppleAppStore.SKApplicationReceipt = SKApplicationReceipt;
        /** StoreKit transaction */
        class SKTransaction extends CdvPurchase.Transaction {
            refresh(productId, originalTransactionIdentifier, transactionDate, discountId) {
                if (productId)
                    this.products = [{ id: productId, offerId: discountId }];
                if (originalTransactionIdentifier)
                    this.originalTransactionId = originalTransactionIdentifier;
                if (transactionDate)
                    this.purchaseDate = new Date(+transactionDate);
            }
        }
        AppleAppStore.SKTransaction = SKTransaction;
    })(AppleAppStore = CdvPurchase.AppleAppStore || (CdvPurchase.AppleAppStore = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    let AppleAppStore;
    (function (AppleAppStore) {
        let VerifyReceipt;
        (function (VerifyReceipt) {
            /** The reason a subscription expired.
             * https://developer.apple.com/documentation/appstorereceipts/expiration_intent
             */
            let AppleExpirationIntent;
            (function (AppleExpirationIntent) {
                /** The customer voluntarily canceled their subscription. */
                AppleExpirationIntent["CANCELED"] = "1";
                /** Billing error; for example, the customer"s payment information was no longer valid. */
                AppleExpirationIntent["BILLING_ERROR"] = "2";
                /** The customer did not agree to a recent price increase. */
                AppleExpirationIntent["PRICE_INCREASE"] = "3";
                /** The product was not available for purchase at the time of renewal. */
                AppleExpirationIntent["PRODUCT_NOT_AVAILABLE"] = "4";
                /** Unknown error. */
                AppleExpirationIntent["UNKNOWN"] = "5";
            })(AppleExpirationIntent = VerifyReceipt.AppleExpirationIntent || (VerifyReceipt.AppleExpirationIntent = {}));
        })(VerifyReceipt = AppleAppStore.VerifyReceipt || (AppleAppStore.VerifyReceipt = {}));
    })(AppleAppStore = CdvPurchase.AppleAppStore || (CdvPurchase.AppleAppStore = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    let Braintree;
    (function (Braintree) {
        // export type Nonce = {
        //     type: PaymentMethod.THREE_D_SECURE;
        //     value: string;
        // };
        // export type NonceProvider = (type: PaymentMethod, callback: Callback<Nonce | IError>) => void;
        // export enum PaymentMethod {
        //     THREE_D_SECURE = 'THREE_D_SECURE',
        // }
        class BraintreeReceipt extends CdvPurchase.Receipt {
            constructor(paymentRequest, dropInResult, decorator) {
                // Now we have to send this to the server + the request
                // result.paymentDescription; // "1111"
                // result.paymentMethodType; // "VISA"
                // result.deviceData; // undefined
                // result.paymentMethodNonce; // {"isDefault":false,"nonce":"tokencc_bh_rdjmsc_76vjtq_9tzsv3_4467mg_tt4"}
                var _a, _b, _c;
                super(CdvPurchase.Platform.BRAINTREE, decorator);
                const transaction = new CdvPurchase.Transaction(CdvPurchase.Platform.BRAINTREE, this, decorator);
                transaction.purchaseDate = new Date();
                transaction.products = ((_a = paymentRequest.items) === null || _a === void 0 ? void 0 : _a.filter(p => p).map(product => ({ id: (product === null || product === void 0 ? void 0 : product.id) || '' }))) || [];
                transaction.state = CdvPurchase.TransactionState.APPROVED;
                transaction.transactionId = (_c = (_b = dropInResult.paymentMethodNonce) === null || _b === void 0 ? void 0 : _b.nonce) !== null && _c !== void 0 ? _c : `UNKNOWN_${dropInResult.paymentMethodType}_${dropInResult.paymentDescription}`;
                this.transactions = [transaction];
                this.dropInResult = dropInResult;
                this.paymentRequest = paymentRequest;
                this.refresh(paymentRequest, dropInResult, decorator);
            }
            refresh(paymentRequest, dropInResult, decorator) {
                var _a, _b;
                this.dropInResult = dropInResult;
                this.paymentRequest = paymentRequest;
                const transaction = new CdvPurchase.Transaction(CdvPurchase.Platform.BRAINTREE, this, decorator);
                transaction.products = paymentRequest.items.filter(p => p).map(product => ({ id: (product === null || product === void 0 ? void 0 : product.id) || '' }));
                transaction.state = CdvPurchase.TransactionState.APPROVED;
                transaction.transactionId = (_b = (_a = dropInResult.paymentMethodNonce) === null || _a === void 0 ? void 0 : _a.nonce) !== null && _b !== void 0 ? _b : `UNKNOWN_${dropInResult.paymentMethodType}_${dropInResult.paymentDescription}`;
                transaction.amountMicros = paymentRequest.amountMicros;
                transaction.currency = paymentRequest.currency;
                this.transactions = [transaction];
            }
        }
        Braintree.BraintreeReceipt = BraintreeReceipt;
        class Adapter {
            constructor(context, options) {
                this.id = CdvPurchase.Platform.BRAINTREE;
                this.name = 'BrainTree';
                this.ready = false;
                this.products = [];
                this._receipts = [];
                this.supportsParallelLoading = false;
                this.context = context;
                this.log = context.log.child("Braintree");
                this.options = options;
            }
            get receipts() { return this._receipts; }
            get isSupported() {
                return Braintree.IosBridge.Bridge.isSupported() || Braintree.AndroidBridge.Bridge.isSupported();
            }
            /**
             * Initialize the Braintree Adapter.
             */
            initialize() {
                return new Promise(resolve => {
                    this.log.info("initialize()");
                    if (Braintree.IosBridge.Bridge.isSupported()) {
                        this.log.info("instantiating ios bridge...");
                        this.iosBridge = new Braintree.IosBridge.Bridge(this.log, (callback) => {
                            if (this.options.tokenizationKey)
                                callback(this.options.tokenizationKey);
                            else if (this.options.clientTokenProvider)
                                this.options.clientTokenProvider(callback);
                            else
                                callback(braintreeError(CdvPurchase.ErrorCode.CLIENT_INVALID, 'Braintree iOS Bridge requires a clientTokenProvider or tokenizationKey'));
                        }, this.options.applePay);
                        this.iosBridge.initialize(this.context, resolve);
                    }
                    else if (Braintree.AndroidBridge.Bridge.isSupported() && !this.androidBridge) {
                        this.log.info("instantiating android bridge...");
                        this.androidBridge = new Braintree.AndroidBridge.Bridge(this.log);
                        this.log.info("calling android bridge -> initialize...");
                        const auth = this.options.tokenizationKey
                            ? this.options.tokenizationKey
                            : this.options.clientTokenProvider
                                ? this.options.clientTokenProvider
                                : '';
                        this.androidBridge.initialize(auth, resolve);
                    }
                    else {
                        this.log.info("platform not supported...");
                        resolve(undefined);
                    }
                    this.context.listener.receiptsReady(CdvPurchase.Platform.BRAINTREE);
                });
            }
            loadProducts(products) {
                return __awaiter(this, void 0, void 0, function* () {
                    return products.map(p => braintreeError(CdvPurchase.ErrorCode.PRODUCT_NOT_AVAILABLE, 'N/A'));
                });
            }
            loadReceipts() {
                return __awaiter(this, void 0, void 0, function* () {
                    this.context.listener.receiptsReady(CdvPurchase.Platform.BRAINTREE);
                    return [];
                });
            }
            order(offer) {
                return __awaiter(this, void 0, void 0, function* () {
                    return braintreeError(CdvPurchase.ErrorCode.UNKNOWN, 'N/A: Not implemented with Braintree');
                });
            }
            finish(transaction) {
                return __awaiter(this, void 0, void 0, function* () {
                    transaction.state = CdvPurchase.TransactionState.FINISHED;
                    this.context.listener.receiptsUpdated(CdvPurchase.Platform.TEST, [transaction.parentReceipt]);
                    return;
                });
            }
            manageSubscriptions() {
                return __awaiter(this, void 0, void 0, function* () {
                    this.log.info('N/A: manageSubscriptions() is not available with Braintree');
                    return;
                });
            }
            manageBilling() {
                return __awaiter(this, void 0, void 0, function* () {
                    this.log.info('N/A: manageBilling() is not available with Braintree');
                    return;
                });
            }
            // async getNonce(paymentMethod: PaymentMethod): Promise<Nonce | IError> {
            //     return new Promise(resolve => {
            //         if (this.options.nonceProvider) {
            //             this.options.nonceProvider(paymentMethod, resolve);
            //         }
            //         else {
            //             resolve({
            //                 code: ErrorCode.UNAUTHORIZED_REQUEST_DATA,
            //                 message: 'Braintree requires a nonceProvider',
            //             });
            //         }
            //     });
            // }
            launchDropIn(paymentRequest, dropInRequest) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (this.androidBridge)
                        return this.androidBridge.launchDropIn(dropInRequest);
                    if (this.iosBridge)
                        return this.iosBridge.launchDropIn(paymentRequest, dropInRequest);
                    return braintreeError(CdvPurchase.ErrorCode.PURCHASE, 'Braintree is not available');
                });
            }
            requestPayment(paymentRequest, additionalData) {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                return __awaiter(this, void 0, void 0, function* () {
                    this.log.info("requestPayment()" + JSON.stringify(paymentRequest));
                    const dropInRequest = ((_a = additionalData === null || additionalData === void 0 ? void 0 : additionalData.braintree) === null || _a === void 0 ? void 0 : _a.dropInRequest) || {};
                    // Apple Pay
                    if (!(yield Braintree.IosBridge.ApplePayPlugin.isSupported(this.log))) {
                        this.log.info("Apple Pay is not supported.");
                        dropInRequest.applePayDisabled = true;
                    }
                    // Google Pay
                    if (this.options.googlePay || dropInRequest.googlePayRequest) {
                        const googlePay = Object.assign(Object.assign({}, ((_b = this.options.googlePay) !== null && _b !== void 0 ? _b : {})), ((_c = dropInRequest.googlePayRequest) !== null && _c !== void 0 ? _c : {}));
                        if (!googlePay.transactionInfo) {
                            googlePay.transactionInfo = {
                                currencyCode: ((_d = paymentRequest.currency) !== null && _d !== void 0 ? _d : ''),
                                totalPrice: ((_e = paymentRequest.amountMicros) !== null && _e !== void 0 ? _e : 0) / 1000000,
                                totalPriceStatus: Braintree.GooglePay.TotalPriceStatus.FINAL,
                            };
                        }
                        dropInRequest.googlePayRequest = googlePay;
                    }
                    // 3DS
                    if (this.options.threeDSecure || dropInRequest.threeDSecureRequest) {
                        const threeDS = Object.assign(Object.assign({}, ((_f = this.options.threeDSecure) !== null && _f !== void 0 ? _f : {})), ((_g = dropInRequest.threeDSecureRequest) !== null && _g !== void 0 ? _g : {}));
                        if (!threeDS.amount) {
                            threeDS.amount = asDecimalString((_h = paymentRequest.amountMicros) !== null && _h !== void 0 ? _h : 0);
                        }
                        if (!threeDS.billingAddress && paymentRequest.billingAddress) {
                            threeDS.billingAddress = {
                                givenName: paymentRequest.billingAddress.givenName,
                                surname: paymentRequest.billingAddress.surname,
                                countryCodeAlpha2: paymentRequest.billingAddress.countryCode,
                                postalCode: paymentRequest.billingAddress.postalCode,
                                locality: paymentRequest.billingAddress.locality,
                                streetAddress: paymentRequest.billingAddress.streetAddress1,
                                extendedAddress: paymentRequest.billingAddress.streetAddress2,
                                line3: paymentRequest.billingAddress.streetAddress3,
                                phoneNumber: paymentRequest.billingAddress.phoneNumber,
                                region: paymentRequest.billingAddress.region,
                            };
                        }
                        if (!threeDS.email) {
                            threeDS.email = paymentRequest.email;
                        }
                        dropInRequest.threeDSecureRequest = threeDS;
                    }
                    const response = yield this.launchDropIn(paymentRequest, dropInRequest);
                    if (!dropInResponseIsOK(response))
                        return dropInResponseError(this.log, response);
                    const dropInResult = response;
                    this.log.info("launchDropIn success: " + JSON.stringify({ paymentRequest, dropInResult }));
                    if (!((_j = dropInResult.paymentMethodNonce) === null || _j === void 0 ? void 0 : _j.nonce)) {
                        return braintreeError(CdvPurchase.ErrorCode.BAD_RESPONSE, 'launchDropIn returned no paymentMethodNonce');
                    }
                    let receipt = this._receipts.find(r => { var _a, _b; return ((_a = r.dropInResult.paymentMethodNonce) === null || _a === void 0 ? void 0 : _a.nonce) === ((_b = dropInResult.paymentMethodNonce) === null || _b === void 0 ? void 0 : _b.nonce); });
                    if (receipt) {
                        receipt.refresh(paymentRequest, dropInResult, this.context.apiDecorators);
                    }
                    else {
                        receipt = new BraintreeReceipt(paymentRequest, dropInResult, this.context.apiDecorators);
                        this.receipts.push(receipt);
                    }
                    this.context.listener.receiptsUpdated(CdvPurchase.Platform.BRAINTREE, [receipt]);
                    return receipt.transactions[0];
                });
            }
            receiptValidationBody(receipt) {
                var _a, _b, _c, _d, _e;
                return __awaiter(this, void 0, void 0, function* () {
                    if (!isBraintreeReceipt(receipt)) {
                        this.log.error("Unexpected error, expecting a BraintreeReceipt: " + JSON.stringify(receipt));
                        return;
                    }
                    this.log.info("create receiptValidationBody for: " + JSON.stringify(receipt));
                    return {
                        id: (_c = (_b = (_a = receipt.paymentRequest.items) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : 'unknown',
                        type: CdvPurchase.ProductType.CONSUMABLE,
                        priceMicros: receipt.paymentRequest.amountMicros,
                        currency: receipt.paymentRequest.currency,
                        products: [],
                        transaction: {
                            type: CdvPurchase.Platform.BRAINTREE,
                            deviceData: receipt.dropInResult.deviceData,
                            id: 'nonce',
                            paymentMethodNonce: (_e = (_d = receipt.dropInResult.paymentMethodNonce) === null || _d === void 0 ? void 0 : _d.nonce) !== null && _e !== void 0 ? _e : '',
                            paymentDescription: receipt.dropInResult.paymentDescription,
                            paymentMethodType: receipt.dropInResult.paymentMethodType,
                        }
                    };
                });
            }
            /**
             * Handle a response from a receipt validation process.
             *
             * @param receipt The receipt being validated.
             * @param response The response payload from the receipt validation process.
             * @returns A promise that resolves when the response has been handled.
             */
            handleReceiptValidationResponse(receipt, response) {
                var _a;
                return __awaiter(this, void 0, void 0, function* () {
                    this.log.info("receipt validation response: " + JSON.stringify(response));
                    if ((response === null || response === void 0 ? void 0 : response.data) && ('transaction' in response.data)) {
                        if (response.data.transaction.type === 'braintree') {
                            const lCustomerId = (_a = response.data.transaction.data.transaction) === null || _a === void 0 ? void 0 : _a.customer.id;
                            if (lCustomerId && !Braintree.customerId) {
                                this.log.info("customerId updated: " + lCustomerId);
                                Braintree.customerId = lCustomerId;
                            }
                        }
                    }
                });
            }
            checkSupport(functionality) {
                return functionality === 'requestPayment';
            }
            restorePurchases() {
                return __awaiter(this, void 0, void 0, function* () {
                    return undefined;
                });
            }
        }
        Braintree.Adapter = Adapter;
        function asDecimalString(amountMicros) {
            const amountCents = '' + (amountMicros / 10000);
            return (amountCents.slice(0, -2) || '0') + '.' + (amountCents.slice(-2, -1) || '0') + (amountCents.slice(-1) || '0');
        }
        function isBraintreeReceipt(receipt) {
            return receipt.platform === CdvPurchase.Platform.BRAINTREE;
        }
        const dropInResponseIsOK = (response) => {
            return (!!response) && !('code' in response && 'message' in response);
        };
        /**
         * Returns the error response from Drop In
         *
         * If the "error" is that the user cancelled the payment, then returns undefined
         * (as per the specification for requestPayment)
         */
        const dropInResponseError = (log, response) => {
            if (!response) {
                log.warn("launchDropIn failed: no response");
                return braintreeError(CdvPurchase.ErrorCode.BAD_RESPONSE, 'Braintree failed to launch drop in');
            }
            else {
                // Failed
                if (response.code === CdvPurchase.ErrorCode.PAYMENT_CANCELLED) {
                    log.info("User cancelled the payment request");
                    return undefined;
                }
                log.warn("launchDropIn failed: " + JSON.stringify(response));
                return response;
            }
        };
        function braintreeError(code, message) {
            return CdvPurchase.storeError(code, message, CdvPurchase.Platform.BRAINTREE, null);
        }
        Braintree.braintreeError = braintreeError;
    })(Braintree = CdvPurchase.Braintree || (CdvPurchase.Braintree = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    let Braintree;
    (function (Braintree) {
        /**
         * Cordova plugin ID for the braintree plugin.
         */
        const PLUGIN_ID = 'BraintreePlugin';
        let AndroidBridge;
        (function (AndroidBridge) {
            /**
             * Bridge to access native functions.
             *
             * This tries to export pretty raw functions from the underlying native SDKs.
             */
            class Bridge {
                constructor(log) {
                    this.log = log.child("AndroidBridge");
                }
                /** Receive asynchronous messages from the native side */
                listener(msg) {
                    // Handle changes to purchase that are being notified
                    // through the PurchasesUpdatedListener on the native side (android)
                    this.log.debug('listener: ' + JSON.stringify(msg));
                    if (!msg || !msg.type) {
                        return;
                    }
                    if (msg.type === "getClientToken") {
                        this.getClientToken();
                    }
                    else if (msg.type === "ready") {
                    }
                }
                // Braintree reported an error
                // private onError(message: string) {
                //     this.log.warn("Braintree reported an error: " + message);
                //     // TODO - bubble that up to the client
                // }
                /*
                 * Initialize the braintree client.
                 *
                 * @param clientTokenProvider Provide clientTokens to the SDK when it needs them.
                 */
                initialize(clientTokenProvider, callback) {
                    try {
                        // Set a listener (see "listener()" function above)
                        if (typeof clientTokenProvider === 'string') {
                            const token = clientTokenProvider;
                            this.clientTokenProvider = (callback) => { callback(token); };
                        }
                        else {
                            this.clientTokenProvider = clientTokenProvider;
                        }
                        this.log.info("exec.setListener()");
                        const listener = this.listener.bind(this);
                        window.cordova.exec(listener, null, PLUGIN_ID, "setListener", []);
                        callback(undefined);
                    }
                    catch (err) {
                        this.log.warn("initialization failed: " + (err === null || err === void 0 ? void 0 : err.message));
                        callback(Braintree.braintreeError(CdvPurchase.ErrorCode.SETUP, 'Failed to initialize Braintree Android Bridge: ' + (err === null || err === void 0 ? void 0 : err.message)));
                    }
                }
                /**
                 * Fetches a client token and sends it to the SDK.
                 *
                 * This method is called by the native side when the SDK requests a Client Token.
                 */
                getClientToken() {
                    this.log.info("getClientToken()");
                    if (this.clientTokenProvider) {
                        this.log.debug("clientTokenProvider set, calling.");
                        this.clientTokenProvider((value) => {
                            if (typeof value === 'string') {
                                window.cordova.exec(null, null, PLUGIN_ID, "onClientTokenSuccess", [value]);
                            }
                            else {
                                window.cordova.exec(null, null, PLUGIN_ID, "onClientTokenFailure", [value.code, value.message]);
                            }
                        });
                    }
                    else {
                        this.log.debug("clientTokenProvider not set, retrying later...");
                        setTimeout(() => this.getClientToken(), 1000); // retry after 1s (over and over)
                    }
                }
                /** Returns true on Android, the only platform supported by this Braintree bridge */
                static isSupported() {
                    return window.cordova.platformId === 'android';
                }
                isApplePaySupported() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return false;
                    });
                }
                launchDropIn(dropInRequest) {
                    return new Promise(resolve => {
                        window.cordova.exec((result) => {
                            this.log.info("dropInSuccess: " + JSON.stringify(result));
                            resolve(result);
                        }, (err) => {
                            this.log.info("dropInFailure: " + err);
                            const errCode = err.split("|")[0];
                            const errMessage = err.split("|").slice(1).join('');
                            if (errCode === "UserCanceledException") {
                                resolve(Braintree.braintreeError(CdvPurchase.ErrorCode.PAYMENT_CANCELLED, errMessage));
                            }
                            else if (errCode === "AuthorizationException") {
                                resolve(Braintree.braintreeError(CdvPurchase.ErrorCode.UNAUTHORIZED_REQUEST_DATA, errMessage));
                            }
                            else {
                                resolve(Braintree.braintreeError(CdvPurchase.ErrorCode.UNKNOWN, err));
                            }
                        }, PLUGIN_ID, "launchDropIn", [dropInRequest]);
                    });
                }
            }
            AndroidBridge.Bridge = Bridge;
            // /**
            //  * Successful callback result for the presentDropInPaymentUI method.
            //  */
            // interface PaymentUIResult {
            //     /**
            //      * Indicates if the user used the cancel button to close the dialog without
            //      * completing the payment.
            //      */
            //     userCancelled: boolean;
            //     /**
            //      * The nonce for the payment transaction (if a payment was completed).
            //      */
            //     nonce: string;
            //     /**
            //      * The payment type (if a payment was completed).
            //      */
            //     type: string;
            //     /**
            //      * A description of the payment method (if a payment was completed).
            //      */
            //     localizedDescription: string;
            //     /**
            //      * Information about the credit card used to complete a payment (if a credit card was used).
            //      */
            //     card: {
            //         /**
            //          * The last two digits of the credit card used.
            //          */
            //         lastTwo: string;
            //         /**
            //          * An enumerated value used to indicate the type of credit card used.
            //          *
            //          * Can be one of the following values:
            //          *
            //          * BTCardNetworkUnknown
            //          * BTCardNetworkAMEX
            //          * BTCardNetworkDinersClub
            //          * BTCardNetworkDiscover
            //          * BTCardNetworkMasterCard
            //          * BTCardNetworkVisa
            //          * BTCardNetworkJCB
            //          * BTCardNetworkLaser
            //          * BTCardNetworkMaestro
            //          * BTCardNetworkUnionPay
            //          * BTCardNetworkSolo
            //          * BTCardNetworkSwitch
            //          * BTCardNetworkUKMaestro
            //          */
            //         network: string;
            //     };
            //     /**
            //      * Information about the PayPal account used to complete a payment (if a PayPal account was used).
            //      */
            //     payPalAccount: {
            //         email: string;
            //         firstName: string;
            //         lastName: string;
            //         phone: string;
            //         billingAddress: string;
            //         shippingAddress: string;
            //         clientMetadataId: string;
            //         payerId: string;
            //     };
            //     /**
            //      * Information about the Apple Pay card used to complete a payment (if Apple Pay was used).
            //      */
            //     applePaycard: {
            //     };
            //     /**
            //      * Information about 3D Secure card used to complete a payment (if 3D Secure was used).
            //      */
            //     threeDSecureInfo: {
            //         liabilityShifted: boolean;
            //         liabilityShiftPossible: boolean;
            //     };
            //     /**
            //      * Information about Venmo account used to complete a payment (if a Venmo account was used).
            //      */
            //     venmoAccount: {
            //         username: string;
            //     };
            // }
        })(AndroidBridge = Braintree.AndroidBridge || (Braintree.AndroidBridge = {}));
    })(Braintree = CdvPurchase.Braintree || (CdvPurchase.Braintree = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    let Braintree;
    (function (Braintree) {
        let IosBridge;
        (function (IosBridge) {
            /**
             * Cordova plugin ID for the braintree-applepay plugin.
             */
            const PLUGIN_ID = 'BraintreeApplePayPlugin';
            /**
             * Bridge to the cordova-plugin-purchase-braintree-applepay plugin
             */
            class ApplePayPlugin {
                /**
                 * Retrieve the plugin definition.
                 *
                 * Useful to check if it is installed.
                 */
                static get() {
                    return window.CdvPurchaseBraintreeApplePay;
                }
                /**
                 * Initiate a payment with Apple Pay.
                 */
                static requestPayment(request) {
                    return new Promise(resolve => {
                        var _a;
                        if (!((_a = ApplePayPlugin.get()) === null || _a === void 0 ? void 0 : _a.installed)) {
                            return resolve(Braintree.braintreeError(CdvPurchase.ErrorCode.SETUP, 'cordova-plugin-purchase-braintree-applepay does not appear to be installed.'));
                        }
                        else {
                            const success = (result) => {
                                resolve(result);
                            };
                            const failure = (err) => {
                                const message = err !== null && err !== void 0 ? err : 'payment request failed';
                                resolve(Braintree.braintreeError(CdvPurchase.ErrorCode.PURCHASE, 'Braintree+ApplePay ERROR: ' + message));
                            };
                            window.cordova.exec(success, failure, PLUGIN_ID, 'presentDropInPaymentUI', [request]);
                        }
                    });
                }
                /**
                 * Returns true if the device supports Apple Pay.
                 *
                 * This does not necessarily mean the user has a card setup already.
                 */
                static isSupported(log) {
                    return new Promise(resolve => {
                        var _a;
                        if (window.cordova.platformId !== 'ios') {
                            log.info('BraintreeApplePayPlugin is only available for ios.');
                            return resolve(false);
                        }
                        if (!((_a = ApplePayPlugin.get()) === null || _a === void 0 ? void 0 : _a.installed)) {
                            log.info('BraintreeApplePayPlugin does not appear to be installed.');
                            return resolve(false);
                        }
                        try {
                            window.cordova.exec((result) => {
                                resolve(result);
                            }, () => {
                                log.info('BraintreeApplePayPlugin is not available.');
                                resolve(false);
                            }, PLUGIN_ID, "isApplePaySupported", []);
                        }
                        catch (err) {
                            log.info('BraintreeApplePayPlugin is not installed.');
                            resolve(false);
                        }
                    });
                }
            }
            IosBridge.ApplePayPlugin = ApplePayPlugin;
        })(IosBridge = Braintree.IosBridge || (Braintree.IosBridge = {}));
    })(Braintree = CdvPurchase.Braintree || (CdvPurchase.Braintree = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    let Braintree;
    (function (Braintree) {
        /**
         * Cordova plugin ID for the braintree ios plugin.
         */
        const PLUGIN_ID = 'BraintreePlugin';
        let IosBridge;
        (function (IosBridge) {
            class Bridge {
                constructor(log, clientTokenProvider, applePayOptions) {
                    this.log = log.child("IosBridge");
                    this.clientTokenProvider = clientTokenProvider;
                    this.applePayOptions = applePayOptions;
                }
                initialize(verbosity, callback) {
                    window.cordova.exec(null, null, "BraintreePlugin", "setVerbosity", [verbosity.verbosity]);
                    window.cordova.exec(message => this.log.debug('(Native) ' + message), null, "BraintreePlugin", "setLogger", []);
                    setTimeout(() => callback(undefined), 0);
                }
                continueDropInForApplePay(paymentRequest, DropInRequest, dropInResult) {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                    return __awaiter(this, void 0, void 0, function* () {
                        const request = ((_b = (_a = this.applePayOptions) === null || _a === void 0 ? void 0 : _a.preparePaymentRequest) === null || _b === void 0 ? void 0 : _b.call(_a, paymentRequest)) || {
                            merchantCapabilities: [CdvPurchase.ApplePay.MerchantCapability.ThreeDS],
                        };
                        if (!request.paymentSummaryItems) {
                            const items = paymentRequest.items.filter(p => p).map((product, index) => {
                                var _a, _b, _c;
                                return ({
                                    type: 'final',
                                    label: (product === null || product === void 0 ? void 0 : product.title) || (product === null || product === void 0 ? void 0 : product.id) || `Item #${index + 1}`,
                                    amount: `${Math.round(((_c = (_b = (_a = product === null || product === void 0 ? void 0 : product.pricing) === null || _a === void 0 ? void 0 : _a.priceMicros) !== null && _b !== void 0 ? _b : paymentRequest.amountMicros) !== null && _c !== void 0 ? _c : 0) / 10000) / 100}`,
                                });
                            });
                            const total = {
                                type: 'final',
                                label: (_d = (_c = this.applePayOptions) === null || _c === void 0 ? void 0 : _c.companyName) !== null && _d !== void 0 ? _d : 'Total',
                                amount: `${Math.round(((_e = paymentRequest.amountMicros) !== null && _e !== void 0 ? _e : 0) / 10000) / 100}`,
                            };
                            request.paymentSummaryItems = [...items, total];
                        }
                        const result = yield IosBridge.ApplePayPlugin.requestPayment(request);
                        this.log.info('Result from Apple Pay: ' + JSON.stringify(result));
                        if ('isError' in result)
                            return result;
                        if (result.userCancelled) {
                            return Braintree.braintreeError(CdvPurchase.ErrorCode.PAYMENT_CANCELLED, 'User cancelled the payment request');
                        }
                        return {
                            paymentMethodNonce: {
                                isDefault: false,
                                nonce: (_g = (_f = result.applePayCardNonce) === null || _f === void 0 ? void 0 : _f.nonce) !== null && _g !== void 0 ? _g : '',
                                type: (_j = (_h = result.applePayCardNonce) === null || _h === void 0 ? void 0 : _h.type) !== null && _j !== void 0 ? _j : '',
                            },
                            paymentMethodType: dropInResult.paymentMethodType,
                            deviceData: dropInResult.deviceData,
                            paymentDescription: dropInResult.paymentDescription,
                        };
                    });
                }
                launchDropIn(paymentRequest, dropInRequest) {
                    return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                        const onSuccess = (result) => {
                            this.log.info("dropInSuccess: " + JSON.stringify(result));
                            if (result.paymentMethodType === Braintree.DropIn.PaymentMethod.APPLE_PAY) {
                                this.log.info("it's an ApplePay request, we have to process it.");
                                this.continueDropInForApplePay(paymentRequest, dropInRequest, result).then(resolve);
                            }
                            else {
                                resolve(result);
                            }
                        };
                        const onError = (errorString) => {
                            this.log.info("dropInFailure: " + errorString);
                            const [errCode, errMessage] = errorString.split('|');
                            if (errCode === "UserCanceledException") {
                                resolve(Braintree.braintreeError(CdvPurchase.ErrorCode.PAYMENT_CANCELLED, errMessage));
                            }
                            else {
                                resolve(Braintree.braintreeError(CdvPurchase.ErrorCode.UNKNOWN, 'ERROR ' + errCode + ': ' + errMessage));
                            }
                        };
                        this.clientTokenProvider((clientToken) => {
                            if (typeof clientToken === 'string')
                                window.cordova.exec(onSuccess, onError, "BraintreePlugin", "launchDropIn", [clientToken, dropInRequest]);
                            else // failed to get token
                                resolve(clientToken);
                        });
                    }));
                }
                braintreePlugin() {
                    return window.CdvPurchaseBraintree;
                }
                static isSupported() {
                    return window.cordova.platformId === 'ios';
                }
            }
            IosBridge.Bridge = Bridge;
        })(IosBridge = Braintree.IosBridge || (Braintree.IosBridge = {}));
    })(Braintree = CdvPurchase.Braintree || (CdvPurchase.Braintree = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    let Braintree;
    (function (Braintree) {
        let DropIn;
        (function (DropIn) {
            /** How a field will behave in CardForm. */
            let CardFormFieldStatus;
            (function (CardFormFieldStatus) {
                CardFormFieldStatus[CardFormFieldStatus["DISABLED"] = 0] = "DISABLED";
                CardFormFieldStatus[CardFormFieldStatus["OPTIONAL"] = 1] = "OPTIONAL";
                CardFormFieldStatus[CardFormFieldStatus["REQUIRED"] = 2] = "REQUIRED";
            })(CardFormFieldStatus = DropIn.CardFormFieldStatus || (DropIn.CardFormFieldStatus = {}));
        })(DropIn = Braintree.DropIn || (Braintree.DropIn = {}));
    })(Braintree = CdvPurchase.Braintree || (CdvPurchase.Braintree = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    let Braintree;
    (function (Braintree) {
        let DropIn;
        (function (DropIn) {
            /** Payment method used or selected by the user. */
            let PaymentMethod;
            (function (PaymentMethod) {
                /** Google only */
                PaymentMethod["GOOGLE_PAY"] = "GOOGLE_PAY";
                /** ios only */
                PaymentMethod["LASER"] = "LASER";
                /** ios only */
                PaymentMethod["UK_MAESTRO"] = "UK_MAESTRO";
                /** ios only */
                PaymentMethod["SWITCH"] = "SWITCH";
                /** ios only */
                PaymentMethod["SOLOR"] = "SOLO";
                /** ios only */
                PaymentMethod["APPLE_PAY"] = "APPLE_PAY";
                PaymentMethod["AMEX"] = "AMEX";
                PaymentMethod["DINERS_CLUB"] = "DINERS_CLUB";
                PaymentMethod["DISCOVER"] = "DISCOVER";
                PaymentMethod["JCB"] = "JCB";
                PaymentMethod["MAESTRO"] = "MAESTRO";
                PaymentMethod["MASTERCARD"] = "MASTERCARD";
                PaymentMethod["PAYPAL"] = "PAYPAL";
                PaymentMethod["VISA"] = "VISA";
                PaymentMethod["VENMO"] = "VENMO";
                PaymentMethod["UNIONPAY"] = "UNIONPAY";
                PaymentMethod["HIPER"] = "HIPER";
                PaymentMethod["HIPERCARD"] = "HIPERCARD";
                PaymentMethod["UNKNOWN"] = "UNKNOWN";
            })(PaymentMethod = DropIn.PaymentMethod || (DropIn.PaymentMethod = {}));
        })(DropIn = Braintree.DropIn || (Braintree.DropIn = {}));
    })(Braintree = CdvPurchase.Braintree || (CdvPurchase.Braintree = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    let Braintree;
    (function (Braintree) {
        let GooglePay;
        (function (GooglePay) {
            /**
             * The Google Pay API will collect the billing address for you if required
             */
            let BillingAddressFormat;
            (function (BillingAddressFormat) {
                /**
                 * When this format is used, the billing address returned will only contain the minimal info, including name, country code, and postal code.
                 *
                 * Note that some countries do not use postal codes, so the postal code field will be empty in those countries.
                 */
                BillingAddressFormat[BillingAddressFormat["MIN"] = 0] = "MIN";
                /**
                 * When this format is used, the billing address returned will be the full address.
                 *
                 * Only select this format when it's required to process the order since it can increase friction during the checkout process and can lead to a lower conversion rate.
                 */
                BillingAddressFormat[BillingAddressFormat["FULL"] = 1] = "FULL";
            })(BillingAddressFormat = GooglePay.BillingAddressFormat || (GooglePay.BillingAddressFormat = {}));
            /**
             * This enum represents the status of the total price of a transaction.
             *
             * It can take on one of the following values:
             * - TotalPriceStatus.NOT_CURRENTLY_KNOWN: The total price is not currently known.
             * - TotalPriceStatus.ESTIMATED: The total price is an estimate.
             * - TotalPriceStatus.FINAL: The total price is final.
             */
            let TotalPriceStatus;
            (function (TotalPriceStatus) {
                /** The total price is not currently known. */
                TotalPriceStatus[TotalPriceStatus["NOT_CURRENTLY_KNOWN"] = 1] = "NOT_CURRENTLY_KNOWN";
                /** The total price is an estimate. */
                TotalPriceStatus[TotalPriceStatus["ESTIMATED"] = 2] = "ESTIMATED";
                /** The total price is final. */
                TotalPriceStatus[TotalPriceStatus["FINAL"] = 3] = "FINAL";
            })(TotalPriceStatus = GooglePay.TotalPriceStatus || (GooglePay.TotalPriceStatus = {}));
        })(GooglePay = Braintree.GooglePay || (Braintree.GooglePay = {}));
    })(Braintree = CdvPurchase.Braintree || (CdvPurchase.Braintree = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    let Braintree;
    (function (Braintree) {
        let ThreeDSecure;
        (function (ThreeDSecure) {
            /** The account type */
            let AccountType;
            (function (AccountType) {
                AccountType["UNSPECIFIED"] = "00";
                AccountType["CREDIT"] = "01";
                AccountType["DEBIT"] = "02";
            })(AccountType = ThreeDSecure.AccountType || (ThreeDSecure.AccountType = {}));
            /** The shipping method */
            let ShippingMethod;
            (function (ShippingMethod) {
                /** Unspecified */
                ShippingMethod[ShippingMethod["UNSPECIFIED"] = 0] = "UNSPECIFIED";
                /** Same say */
                ShippingMethod[ShippingMethod["SAME_DAY"] = 1] = "SAME_DAY";
                /** Overnight / Expedited */
                ShippingMethod[ShippingMethod["EXPEDITED"] = 2] = "EXPEDITED";
                /** Priority */
                ShippingMethod[ShippingMethod["PRIORITY"] = 3] = "PRIORITY";
                /** Ground */
                ShippingMethod[ShippingMethod["GROUND"] = 4] = "GROUND";
                /** Electronic delivery */
                ShippingMethod[ShippingMethod["ELECTRONIC_DELIVERY"] = 5] = "ELECTRONIC_DELIVERY";
                /** Ship to store */
                ShippingMethod[ShippingMethod["SHIP_TO_STORE"] = 6] = "SHIP_TO_STORE";
            })(ShippingMethod = ThreeDSecure.ShippingMethod || (ThreeDSecure.ShippingMethod = {}));
            let Version;
            (function (Version) {
                /** 3DS 1.0 */
                Version[Version["V1"] = 0] = "V1";
                /** 3DS 2.0 */
                Version[Version["V2"] = 1] = "V2";
            })(Version = ThreeDSecure.Version || (ThreeDSecure.Version = {}));
        })(ThreeDSecure = Braintree.ThreeDSecure || (Braintree.ThreeDSecure = {}));
    })(Braintree = CdvPurchase.Braintree || (CdvPurchase.Braintree = {}));
})(CdvPurchase || (CdvPurchase = {}));
/// <reference path="../../receipt.ts" />
/// <reference path="../../transaction.ts" />
var CdvPurchase;
(function (CdvPurchase) {
    let GooglePlay;
    (function (GooglePlay) {
        class Transaction extends CdvPurchase.Transaction {
            constructor(purchase, parentReceipt, decorator) {
                super(CdvPurchase.Platform.GOOGLE_PLAY, parentReceipt, decorator);
                this.nativePurchase = purchase;
                this.refresh(purchase);
            }
            static toState(state, isAcknowledged, isConsumed) {
                switch (state) {
                    case GooglePlay.Bridge.PurchaseState.PENDING:
                        return CdvPurchase.TransactionState.INITIATED;
                    case GooglePlay.Bridge.PurchaseState.PURCHASED:
                        // Note: we still want to validate acknowledged non-consumables and subscriptions,
                        //       so we don't return APPROVED
                        if (isConsumed)
                            return CdvPurchase.TransactionState.FINISHED;
                        else
                            return CdvPurchase.TransactionState.APPROVED;
                    case GooglePlay.Bridge.PurchaseState.UNSPECIFIED_STATE:
                        return CdvPurchase.TransactionState.UNKNOWN_STATE;
                }
            }
            /**
             * Refresh the value in the transaction based on the native purchase update
             */
            refresh(purchase) {
                var _a, _b;
                this.nativePurchase = purchase;
                this.transactionId = `${purchase.orderId || purchase.purchaseToken}`;
                this.purchaseId = `${purchase.purchaseToken}`;
                this.products = purchase.productIds.map(productId => ({ id: productId }));
                if (purchase.purchaseTime)
                    this.purchaseDate = new Date(purchase.purchaseTime);
                this.isPending = (purchase.getPurchaseState === GooglePlay.Bridge.PurchaseState.PENDING);
                if (typeof purchase.acknowledged !== 'undefined')
                    this.isAcknowledged = purchase.acknowledged;
                if (typeof purchase.consumed !== 'undefined')
                    this.isConsumed = purchase.consumed;
                if (typeof purchase.autoRenewing !== 'undefined')
                    this.renewalIntent = purchase.autoRenewing ? CdvPurchase.RenewalIntent.RENEW : CdvPurchase.RenewalIntent.LAPSE;
                this.state = Transaction.toState(purchase.getPurchaseState, (_a = this.isAcknowledged) !== null && _a !== void 0 ? _a : false, (_b = this.isConsumed) !== null && _b !== void 0 ? _b : false);
            }
        }
        GooglePlay.Transaction = Transaction;
        class Receipt extends CdvPurchase.Receipt {
            /** @internal */
            constructor(purchase, decorator) {
                super(CdvPurchase.Platform.GOOGLE_PLAY, decorator);
                this.transactions = [new Transaction(purchase, this, decorator)];
                this.purchaseToken = purchase.purchaseToken;
                this.orderId = purchase.orderId;
            }
            /** Refresh the content of the purchase based on the native BridgePurchase */
            refreshPurchase(purchase) {
                var _a;
                (_a = this.transactions[0]) === null || _a === void 0 ? void 0 : _a.refresh(purchase);
                this.orderId = purchase.orderId;
            }
        }
        GooglePlay.Receipt = Receipt;
        class Adapter {
            constructor(context, autoRefreshIntervalMillis = 1000 * 3600 * 24) {
                /** Adapter identifier */
                this.id = CdvPurchase.Platform.GOOGLE_PLAY;
                /** Adapter name */
                this.name = 'GooglePlay';
                /** Has the adapter been successfully initialized */
                this.ready = false;
                this.supportsParallelLoading = false;
                this._receipts = [];
                /** The GooglePlay bridge */
                this.bridge = new GooglePlay.Bridge.Bridge();
                /** Prevent double initialization */
                this.initialized = false;
                /** Used to retry failed commands */
                this.retry = new CdvPurchase.Internal.Retry();
                this.autoRefreshIntervalMillis = 0;
                if (Adapter._instance)
                    throw new Error('GooglePlay adapter already initialized');
                this._products = new GooglePlay.Products(context.apiDecorators);
                this.autoRefreshIntervalMillis = autoRefreshIntervalMillis;
                this.context = context;
                this.log = context.log.child('GooglePlay');
                Adapter._instance = this;
            }
            /** List of products managed by the GooglePlay adapter */
            get products() { return this._products.products; }
            get receipts() { return this._receipts; }
            /** Returns true on Android, the only platform supported by this adapter */
            get isSupported() {
                return window.cordova.platformId === 'android';
            }
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
                            showLog: this.context.verbosity >= CdvPurchase.LogLevel.DEBUG ? true : false,
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
                            this.context.error(playStoreError(CdvPurchase.ErrorCode.SETUP, "Init failed - " + err, null));
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
                    if (product.type === CdvPurchase.ProductType.PAID_SUBSCRIPTION)
                        subsSkus.push(product.id);
                    else
                        inAppSkus.push(product.id);
                }
                return { inAppSkus, subsSkus };
            }
            /** @inheritdoc */
            loadReceipts() {
                return new Promise((resolve) => {
                    // let's also refresh purchases
                    this.getPurchases()
                        .then(err => {
                        resolve(this._receipts);
                    });
                });
            }
            /** @inheritDoc */
            loadProducts(products) {
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
                                return playStoreError(CdvPurchase.ErrorCode.INVALID_PRODUCT_ID, `Product with id ${registeredProduct.id} not found.`, registeredProduct.id);
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
                            this.context.error(playStoreError(CdvPurchase.ErrorCode.LOAD, 'Loading product info failed - ' + err + ' - retrying later...', null));
                        });
                    };
                    go();
                });
            }
            /** @inheritDoc */
            finish(transaction) {
                return new Promise(resolve => {
                    const onSuccess = () => {
                        if (transaction.state !== CdvPurchase.TransactionState.FINISHED) {
                            transaction.state = CdvPurchase.TransactionState.FINISHED;
                            this.context.listener.receiptsUpdated(CdvPurchase.Platform.GOOGLE_PLAY, [transaction.parentReceipt]);
                        }
                        resolve(undefined);
                    };
                    const firstProduct = transaction.products[0];
                    if (!firstProduct)
                        return resolve(playStoreError(CdvPurchase.ErrorCode.FINISH, 'Cannot finish a transaction with no product', null));
                    const product = this._products.getProduct(firstProduct.id);
                    if (!product)
                        return resolve(playStoreError(CdvPurchase.ErrorCode.FINISH, 'Cannot finish transaction, unknown product ' + firstProduct.id, firstProduct.id));
                    const receipt = this._receipts.find(r => r.hasTransaction(transaction));
                    if (!receipt)
                        return resolve(playStoreError(CdvPurchase.ErrorCode.FINISH, 'Cannot finish transaction, linked receipt not found.', product.id));
                    if (!receipt.purchaseToken)
                        return resolve(playStoreError(CdvPurchase.ErrorCode.FINISH, 'Cannot finish transaction, linked receipt contains no purchaseToken.', product.id));
                    const onFailure = (message, code) => resolve(playStoreError(code || CdvPurchase.ErrorCode.UNKNOWN, message, product.id));
                    if (product.type === CdvPurchase.ProductType.NON_RENEWING_SUBSCRIPTION || product.type === CdvPurchase.ProductType.CONSUMABLE) {
                        if (!transaction.isConsumed)
                            return this.bridge.consumePurchase(onSuccess, onFailure, receipt.purchaseToken);
                    }
                    else { // subscription and non-consumable
                        if (!transaction.isAcknowledged)
                            return this.bridge.acknowledgePurchase(onSuccess, onFailure, receipt.purchaseToken);
                    }
                    // nothing to do
                    resolve(undefined);
                });
            }
            /** Called by the bridge when a purchase has been consumed */
            onPurchaseConsumed(purchase) {
                this.log.debug("onPurchaseConsumed: " + purchase.orderId);
                purchase.acknowledged = true; // consumed is the equivalent of acknowledged for consumables
                purchase.consumed = true;
                this.onPurchasesUpdated([purchase]);
            }
            /** Called when the platform reports update for some purchases */
            onPurchasesUpdated(purchases) {
                this.log.debug("onPurchaseUpdated: " + purchases.map(p => p.orderId).join(', '));
                // GooglePlay generates one receipt for each purchase
                purchases.forEach(purchase => {
                    const existingReceipt = this.receipts.find(r => r.purchaseToken === purchase.purchaseToken);
                    if (existingReceipt) {
                        existingReceipt.refreshPurchase(purchase);
                        this.context.listener.receiptsUpdated(CdvPurchase.Platform.GOOGLE_PLAY, [existingReceipt]);
                    }
                    else {
                        const newReceipt = new Receipt(purchase, this.context.apiDecorators);
                        this.receipts.push(newReceipt);
                        this.context.listener.receiptsUpdated(CdvPurchase.Platform.GOOGLE_PLAY, [newReceipt]);
                    }
                });
            }
            /** Called when the platform reports some purchases */
            onSetPurchases(purchases) {
                this.log.debug("onSetPurchases: " + JSON.stringify(purchases));
                this.onPurchasesUpdated(purchases);
                this.context.listener.receiptsReady(CdvPurchase.Platform.GOOGLE_PLAY);
            }
            onPriceChangeConfirmationResult(result) {
            }
            /** Refresh purchases from GooglePlay */
            getPurchases() {
                return new Promise(resolve => {
                    this.log.debug('getPurchases');
                    const success = () => {
                        this.log.debug('getPurchases success');
                        setTimeout(() => resolve(undefined), 0);
                    };
                    const failure = (message, code) => {
                        this.log.warn('getPurchases failed: ' + message + ' (' + code + ')');
                        setTimeout(() => resolve(playStoreError(code || CdvPurchase.ErrorCode.UNKNOWN, message, null)), 0);
                    };
                    this.bridge.getPurchases(success, failure);
                });
            }
            /** @inheritDoc */
            order(offer, additionalData) {
                return __awaiter(this, void 0, void 0, function* () {
                    return new Promise(resolve => {
                        this.log.info("Order - " + JSON.stringify(offer));
                        const buySuccess = () => resolve(undefined);
                        const buyFailed = (message, code) => {
                            this.log.warn('Order failed: ' + JSON.stringify({ message, code }));
                            resolve(playStoreError(code !== null && code !== void 0 ? code : CdvPurchase.ErrorCode.UNKNOWN, message, offer.productId));
                        };
                        if (offer.productType === CdvPurchase.ProductType.PAID_SUBSCRIPTION) {
                            const idAndToken = 'token' in offer ? offer.productId + '@' + offer.token : offer.productId;
                            // find if the user already owns a product in the same group
                            const oldPurchaseToken = this.findOldPurchaseToken(offer.productId, offer.productGroup);
                            if (oldPurchaseToken) {
                                if (!additionalData.googlePlay)
                                    additionalData.googlePlay = { oldPurchaseToken };
                                else if (!additionalData.googlePlay.oldPurchaseToken) {
                                    additionalData.googlePlay.oldPurchaseToken = oldPurchaseToken;
                                }
                            }
                            this.bridge.subscribe(buySuccess, buyFailed, idAndToken, additionalData);
                        }
                        else {
                            this.bridge.buy(buySuccess, buyFailed, offer.productId, additionalData);
                        }
                    });
                });
            }
            /**
             * Find a purchaseToken for an owned product in the same group as the requested one.
             *
             * @param productId - The product identifier to request matching purchaseToken for.
             * @param productGroup - The group of the product to request matching purchaseToken for.
             *
             * @return A purchaseToken, undefined if none have been found.
             */
            findOldPurchaseToken(productId, productGroup) {
                if (!productGroup)
                    return undefined;
                const oldReceipt = this._receipts.find(r => {
                    return !!r.transactions.find(t => {
                        return !!t.products.find(p => {
                            const product = this._products.getProduct(p.id);
                            if (!product)
                                return false;
                            if (!CdvPurchase.Internal.LocalReceipts.isOwned([r], product))
                                return false;
                            return (p.id === productId) || (productGroup && product.group === productGroup);
                        });
                    });
                });
                return oldReceipt === null || oldReceipt === void 0 ? void 0 : oldReceipt.purchaseToken;
            }
            /**
             * Prepare for receipt validation
             */
            receiptValidationBody(receipt) {
                var _a;
                return __awaiter(this, void 0, void 0, function* () {
                    const transaction = receipt.transactions[0];
                    if (!transaction)
                        return;
                    const productId = (_a = transaction.products[0]) === null || _a === void 0 ? void 0 : _a.id;
                    if (!productId)
                        return;
                    const product = this._products.getProduct(productId);
                    if (!product)
                        return;
                    const purchase = transaction.nativePurchase;
                    return {
                        id: productId,
                        type: product.type,
                        offers: product.offers,
                        products: this._products.products,
                        transaction: {
                            type: CdvPurchase.Platform.GOOGLE_PLAY,
                            id: receipt.transactions[0].transactionId,
                            purchaseToken: purchase.purchaseToken,
                            signature: purchase.signature,
                            receipt: purchase.receipt,
                        }
                    };
                });
            }
            handleReceiptValidationResponse(receipt, response) {
                var _a;
                return __awaiter(this, void 0, void 0, function* () {
                    if (response === null || response === void 0 ? void 0 : response.ok) {
                        const transaction = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.transaction;
                        if ((transaction === null || transaction === void 0 ? void 0 : transaction.type) !== CdvPurchase.Platform.GOOGLE_PLAY)
                            return;
                        switch (transaction.kind) {
                            case 'androidpublisher#productPurchase':
                                break;
                            case 'androidpublisher#subscriptionPurchase':
                                break;
                            case 'androidpublisher#subscriptionPurchaseV2':
                                transaction;
                                break;
                            case 'fovea#subscriptionGone':
                                // the transaction doesn't exist anymore
                                break;
                        }
                    }
                    return; // Nothing specific to do on GooglePlay
                });
            }
            requestPayment(payment, additionalData) {
                return __awaiter(this, void 0, void 0, function* () {
                    return playStoreError(CdvPurchase.ErrorCode.UNKNOWN, 'requestPayment not supported', null);
                });
            }
            manageSubscriptions() {
                return __awaiter(this, void 0, void 0, function* () {
                    this.bridge.manageSubscriptions();
                    return;
                });
            }
            manageBilling() {
                return __awaiter(this, void 0, void 0, function* () {
                    this.bridge.manageBilling();
                    return;
                });
            }
            checkSupport(functionality) {
                const supported = [
                    'order', 'manageBilling', 'manageSubscriptions'
                ];
                return supported.indexOf(functionality) >= 0;
            }
            restorePurchases() {
                return new Promise(resolve => {
                    this.bridge.getPurchases(() => resolve(undefined), (message, code) => {
                        this.log.warn('getPurchases() failed: ' + (code !== null && code !== void 0 ? code : 'ERROR') + ': ' + message);
                        resolve(playStoreError(code !== null && code !== void 0 ? code : CdvPurchase.ErrorCode.UNKNOWN, message, null));
                    });
                });
            }
        }
        Adapter.trimProductTitles = true;
        GooglePlay.Adapter = Adapter;
        function playStoreError(code, message, productId) {
            return CdvPurchase.storeError(code, message, CdvPurchase.Platform.GOOGLE_PLAY, productId);
        }
    })(GooglePlay = CdvPurchase.GooglePlay || (CdvPurchase.GooglePlay = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    let GooglePlay;
    (function (GooglePlay) {
        let Bridge;
        (function (Bridge) {
            /* export namespace V11 {
                export interface Subscription {
                    product_format: "v11.0";
                    productId: string;
                    title: string;
                    name: string;
                    billing_period: string;
                    billing_period_unit: string;
                    description: string;
                    price: string;
                    price_amount_micros: string;
                    price_currency_code: string;
                    trial_period: string;
                    trial_period_unit: string;
                    formatted_price: string;
                    freeTrialPeriod: string;
                    introductoryPrice: string;
                    introductoryPriceAmountMicros: string;
                    introductoryPriceCycles: string;
                    introductoryPricePeriod: string;
                    subscriptionPeriod: string;
                }
            } */
            let RecurrenceMode;
            (function (RecurrenceMode) {
                RecurrenceMode["FINITE_RECURRING"] = "FINITE_RECURRING";
                RecurrenceMode["INFINITE_RECURRING"] = "INFINITE_RECURRING";
                RecurrenceMode["NON_RECURRING"] = "NON_RECURRING";
            })(RecurrenceMode = Bridge.RecurrenceMode || (Bridge.RecurrenceMode = {}));
        })(Bridge = GooglePlay.Bridge || (GooglePlay.Bridge = {}));
    })(GooglePlay = CdvPurchase.GooglePlay || (CdvPurchase.GooglePlay = {}));
})(CdvPurchase || (CdvPurchase = {}));
/*
 * Copyright (C) 2012-2013 by Guillaume Charhon
 * Modifications 10/16/2013 by Brian Thurlow
 */
/*global cordova */
var CdvPurchase;
(function (CdvPurchase) {
    let GooglePlay;
    (function (GooglePlay) {
        /** Replace SKU ProrationMode.
         *
         * See https://developer.android.com/reference/com/android/billingclient/api/BillingFlowParams.ProrationMode */
        let ProrationMode;
        (function (ProrationMode) {
            /** Replacement takes effect immediately, and the remaining time will be prorated and credited to the user. */
            ProrationMode["IMMEDIATE_WITH_TIME_PRORATION"] = "IMMEDIATE_WITH_TIME_PRORATION";
            /** Replacement takes effect immediately, and the billing cycle remains the same. */
            ProrationMode["IMMEDIATE_AND_CHARGE_PRORATED_PRICE"] = "IMMEDIATE_AND_CHARGE_PRORATED_PRICE";
            /** Replacement takes effect immediately, and the new price will be charged on next recurrence time. */
            ProrationMode["IMMEDIATE_WITHOUT_PRORATION"] = "IMMEDIATE_WITHOUT_PRORATION";
            /** Replacement takes effect when the old plan expires, and the new price will be charged at the same time. */
            ProrationMode["DEFERRED"] = "DEFERRED";
            /** Replacement takes effect immediately, and the user is charged full price of new plan and is given a full billing cycle of subscription, plus remaining prorated time from the old plan. */
            ProrationMode["IMMEDIATE_AND_CHARGE_FULL_PRICE"] = "IMMEDIATE_AND_CHARGE_FULL_PRICE";
        })(ProrationMode = GooglePlay.ProrationMode || (GooglePlay.ProrationMode = {}));
        let Bridge;
        (function (Bridge_2) {
            let log = function log(msg) {
                console.log("InAppBilling[js]: " + msg);
            };
            let PurchaseState;
            (function (PurchaseState) {
                PurchaseState[PurchaseState["UNSPECIFIED_STATE"] = 0] = "UNSPECIFIED_STATE";
                PurchaseState[PurchaseState["PURCHASED"] = 1] = "PURCHASED";
                PurchaseState[PurchaseState["PENDING"] = 2] = "PENDING";
            })(PurchaseState = Bridge_2.PurchaseState || (Bridge_2.PurchaseState = {}));
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
                    window.cordova.exec(listener, function (err) { }, "InAppBillingPlugin", "setListener", []);
                    window.cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "init", []);
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
                                fail(msg, CdvPurchase.ErrorCode.INVALID_PRODUCT_ID);
                                return;
                            }
                            if (this.options.showLog) {
                                log('load ' + JSON.stringify(skus));
                            }
                            hasSKUs = true;
                        }
                    }
                    window.cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "load", [skus, inAppSkus, subsSkus]);
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
                    return window.cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "getPurchases", ["null"]);
                }
                buy(success, fail, productId, additionalData) {
                    if (this.options.showLog) {
                        log('buy()');
                    }
                    return window.cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "buy", [
                        productId, extendAdditionalData(additionalData)
                    ]);
                }
                subscribe(success, fail, productId, additionalData) {
                    var _a;
                    if (this.options.showLog) {
                        log('subscribe()');
                    }
                    if (((_a = additionalData.googlePlay) === null || _a === void 0 ? void 0 : _a.oldPurchaseToken) && this.options.showLog) {
                        log('subscribe() -> upgrading from an old purchase');
                    }
                    return window.cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "subscribe", [
                        productId, extendAdditionalData(additionalData)
                    ]);
                }
                consumePurchase(success, fail, purchaseToken) {
                    if (this.options.showLog) {
                        log('consumePurchase()');
                    }
                    return window.cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "consumePurchase", [purchaseToken]);
                }
                acknowledgePurchase(success, fail, purchaseToken) {
                    if (this.options.showLog) {
                        log('acknowledgePurchase()');
                    }
                    return window.cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "acknowledgePurchase", [purchaseToken]);
                }
                getAvailableProducts(inAppSkus, subsSkus, success, fail) {
                    if (this.options.showLog) {
                        log('getAvailableProducts()');
                    }
                    return window.cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "getAvailableProducts", [inAppSkus, subsSkus]);
                }
                manageSubscriptions() {
                    return window.cordova.exec(function () { }, function () { }, "InAppBillingPlugin", "manageSubscriptions", []);
                }
                manageBilling() {
                    return window.cordova.exec(function () { }, function () { }, "InAppBillingPlugin", "manageBilling", []);
                }
                launchPriceChangeConfirmationFlow(productId) {
                    return window.cordova.exec(function () { }, function () { }, "InAppBillingPlugin", "launchPriceChangeConfirmationFlow", [productId]);
                }
            }
            Bridge_2.Bridge = Bridge;
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
                    additionalData.accountId = CdvPurchase.Utils.md5(ad.applicationUsername);
                }
                return additionalData;
            }
        })(Bridge = GooglePlay.Bridge || (GooglePlay.Bridge = {}));
    })(GooglePlay = CdvPurchase.GooglePlay || (CdvPurchase.GooglePlay = {}));
})(CdvPurchase || (CdvPurchase = {}));
/// <reference path="../../offer.ts" />
var CdvPurchase;
(function (CdvPurchase) {
    let GooglePlay;
    (function (GooglePlay) {
        class GProduct extends CdvPurchase.Product {
        }
        GooglePlay.GProduct = GProduct;
        class InAppOffer extends CdvPurchase.Offer {
            constructor() {
                super(...arguments);
                this.type = 'inapp';
            }
        }
        GooglePlay.InAppOffer = InAppOffer;
        class SubscriptionOffer extends CdvPurchase.Offer {
            constructor(options, decorator) {
                super(options, decorator);
                this.type = 'subs';
                this.tags = options.tags;
                this.token = options.token;
            }
        }
        GooglePlay.SubscriptionOffer = SubscriptionOffer;
        class Products {
            constructor(decorator) {
                /** List of products managed by the GooglePlay adapter */
                this.products = [];
                /** List of offers managed by the GooglePlay adapter */
                this.offers = [];
                this.decorator = decorator;
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
                const p = existingProduct !== null && existingProduct !== void 0 ? existingProduct : new GProduct(registeredProduct, this.decorator);
                p.title = vp.title || vp.name || p.title;
                if (GooglePlay.Adapter.trimProductTitles)
                    p.title = p.title.replace(/ \(.*\)$/, '');
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
                    // Add the base plan's pricing phase to offers that do not end-up as infinite recurring.
                    const lastPhase = productOffer.pricing_phases.slice(-1)[0];
                    if ((lastPhase === null || lastPhase === void 0 ? void 0 : lastPhase.recurrence_mode) === CdvPurchase.RecurrenceMode.FINITE_RECURRING) {
                        const baseOffer = findBasePlan(productOffer.base_plan_id);
                        if (baseOffer && (baseOffer !== productOffer)) {
                            productOffer.pricing_phases.push(...baseOffer.pricing_phases);
                        }
                    }
                    // Convert the offer to the generic representation
                    const offer = this.iabSubsOfferV12Loaded(product, vp, productOffer);
                    product.addOffer(offer);
                });
                function findBasePlan(basePlanId) {
                    if (!basePlanId)
                        return null;
                    for (const offer of vp.offers) {
                        if (offer.base_plan_id === basePlanId && !offer.offer_id) {
                            return offer;
                        }
                    }
                    return null;
                }
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
            makeOfferId(productId, productOffer) {
                let id = productId;
                if (productOffer.base_plan_id) {
                    if (productOffer.offer_id) {
                        return productId + '@' + productOffer.base_plan_id + '@' + productOffer.offer_id;
                    }
                    return productId + '@' + productOffer.base_plan_id;
                }
                return productId + '@' + productOffer.token;
            }
            iabSubsOfferV12Loaded(product, vp, productOffer) {
                const offerId = this.makeOfferId(vp.productId, productOffer);
                const existingOffer = this.getOffer(offerId);
                const pricingPhases = productOffer.pricing_phases.map(p => this.toPricingPhase(p));
                if (existingOffer) {
                    existingOffer.pricingPhases = pricingPhases;
                    return existingOffer;
                }
                else {
                    const offer = new SubscriptionOffer({ id: offerId, product, pricingPhases, token: productOffer.token, tags: productOffer.tags }, this.decorator);
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
                        recurrenceMode: CdvPurchase.RecurrenceMode.NON_RECURRING,
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
                    const newOffer = new InAppOffer({ id: vp.productId, product: p, pricingPhases }, this.decorator);
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
                    ? CdvPurchase.PaymentMode.FREE_TRIAL
                    : phase.recurrence_mode === GooglePlay.Bridge.RecurrenceMode.NON_RECURRING
                        ? CdvPurchase.PaymentMode.UP_FRONT
                        : CdvPurchase.PaymentMode.PAY_AS_YOU_GO;
            }
            toRecurrenceMode(mode) {
                switch (mode) {
                    case GooglePlay.Bridge.RecurrenceMode.FINITE_RECURRING: return CdvPurchase.RecurrenceMode.FINITE_RECURRING;
                    case GooglePlay.Bridge.RecurrenceMode.INFINITE_RECURRING: return CdvPurchase.RecurrenceMode.INFINITE_RECURRING;
                    case GooglePlay.Bridge.RecurrenceMode.NON_RECURRING: return CdvPurchase.RecurrenceMode.NON_RECURRING;
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
    })(GooglePlay = CdvPurchase.GooglePlay || (CdvPurchase.GooglePlay = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    let GooglePlay;
    (function (GooglePlay) {
        let PublisherAPI;
        (function (PublisherAPI) {
            let GoogleErrorReason;
            (function (GoogleErrorReason) {
                /** The subscription purchase is no longer available for query because it has been expired for too long. */
                GoogleErrorReason["SUBSCRIPTION_NO_LONGER_AVAILABLE"] = "subscriptionPurchaseNoLongerAvailable";
                /** The purchase token is no longer valid. */
                GoogleErrorReason["PURCHASE_TOKEN_NO_LONGER_VALID"] = "purchaseTokenNoLongerValid";
            })(GoogleErrorReason = PublisherAPI.GoogleErrorReason || (PublisherAPI.GoogleErrorReason = {}));
            /**
           * Those are actually HTTP status codes.
           *
           * Duplicated here for documentation purposes.
           */
            let ErrorCode;
            (function (ErrorCode) {
                /** The subscription purchase is no longer available for query because it has been expired for too long. */
                ErrorCode[ErrorCode["GONE"] = 410] = "GONE";
            })(ErrorCode = PublisherAPI.ErrorCode || (PublisherAPI.ErrorCode = {}));
        })(PublisherAPI = GooglePlay.PublisherAPI || (GooglePlay.PublisherAPI = {}));
    })(GooglePlay = CdvPurchase.GooglePlay || (CdvPurchase.GooglePlay = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    /**
     * Test Adapter and related classes.
     */
    let Test;
    (function (Test) {
        const platform = CdvPurchase.Platform.TEST;
        let verifiedPurchases = [];
        function updateVerifiedPurchases(tr) {
            tr.products.forEach(p => {
                var _a, _b, _c, _d;
                const existing = verifiedPurchases.find(v => p.id === v.id);
                const attributes = {
                    id: p.id,
                    purchaseDate: (_a = tr.purchaseDate) === null || _a === void 0 ? void 0 : _a.getTime(),
                    expiryDate: (_b = tr.expirationDate) === null || _b === void 0 ? void 0 : _b.getTime(),
                    lastRenewalDate: (_c = tr.lastRenewalDate) === null || _c === void 0 ? void 0 : _c.getTime(),
                    renewalIntent: tr.renewalIntent,
                    renewalIntentChangeDate: (_d = tr.renewalIntentChangeDate) === null || _d === void 0 ? void 0 : _d.getTime(),
                };
                if (existing) {
                    Object.assign(existing, attributes);
                }
                else {
                    verifiedPurchases.push(attributes);
                }
            });
        }
        /**
         * Test Adapter used for local testing with mock products.
         *
         * This adapter simulates a payment platform that supports both In-App Products and Payment Requests.
         *
         * The list of supported In-App Products
         *
         * @see {@link Test.TEST_PRODUCTS}
         */
        class Adapter {
            constructor(context) {
                this.id = CdvPurchase.Platform.TEST;
                this.name = 'Test';
                this.ready = false;
                this.products = [];
                this.receipts = [];
                this.supportsParallelLoading = true;
                this.context = context;
                this.log = context.log.child("Test");
            }
            get isSupported() {
                return true;
            }
            initialize() {
                return __awaiter(this, void 0, void 0, function* () { return; });
            }
            loadReceipts() {
                return __awaiter(this, void 0, void 0, function* () {
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            this.context.listener.receiptsReady(CdvPurchase.Platform.TEST);
                            resolve(this.receipts);
                        }, 600);
                    });
                });
            }
            loadProducts(products) {
                return __awaiter(this, void 0, void 0, function* () {
                    return products.map(registerProduct => {
                        if (!Test.testProductsArray.find(p => p.id === registerProduct.id && p.type === registerProduct.type)) {
                            return testStoreError(CdvPurchase.ErrorCode.PRODUCT_NOT_AVAILABLE, 'This product is not available', registerProduct.id);
                        }
                        // Ensure it's not been loaded already.
                        const existingProduct = this.products.find(p => p.id === registerProduct.id);
                        if (existingProduct)
                            return existingProduct;
                        // Enable the active subscription if loaded by the user.
                        if (registerProduct.id === Test.testProducts.PAID_SUBSCRIPTION_ACTIVE.id) {
                            setTimeout(() => {
                                this.reportActiveSubscription();
                            }, 500); // it'll get reported in 500ms
                        }
                        const product = Test.initTestProduct(registerProduct.id, this.context.apiDecorators);
                        if (!product)
                            return testStoreError(CdvPurchase.ErrorCode.PRODUCT_NOT_AVAILABLE, 'Could not load this product', registerProduct.id);
                        this.products.push(product);
                        this.context.listener.productsUpdated(CdvPurchase.Platform.TEST, [product]);
                        return product;
                    });
                });
            }
            order(offer) {
                return __awaiter(this, void 0, void 0, function* () {
                    // Purchasing products with "-fail-" in the id will fail.
                    if (offer.id.indexOf("-fail-") > 0) {
                        return testStoreError(CdvPurchase.ErrorCode.PURCHASE, 'Purchase failed.', offer.productId);
                    }
                    const product = this.products.find(p => p.id === offer.productId);
                    if (!CdvPurchase.Internal.LocalReceipts.canPurchase(this.receipts, product)) {
                        return testStoreError(CdvPurchase.ErrorCode.PURCHASE, 'Product already owned', offer.productId);
                    }
                    // a receipt containing a transaction with the given product.
                    const response = prompt(`Do you want to purchase ${offer.productId} for ${offer.pricingPhases[0].price}?\nEnter "Y" to confirm.\nEnter "E" to fail with an error.\Anything else to cancel.`);
                    if ((response === null || response === void 0 ? void 0 : response.toUpperCase()) === 'E')
                        return testStoreError(CdvPurchase.ErrorCode.PURCHASE, 'Purchase failed', offer.productId);
                    if ((response === null || response === void 0 ? void 0 : response.toUpperCase()) !== 'Y')
                        return testStoreError(CdvPurchase.ErrorCode.PAYMENT_CANCELLED, 'Purchase flow has been cancelled by the user', offer.productId);
                    // purchase succeeded, let's generate a mock receipt.
                    const receipt = new CdvPurchase.Receipt(platform, this.context.apiDecorators);
                    const tr = new CdvPurchase.Transaction(platform, receipt, this.context.apiDecorators);
                    receipt.transactions = [tr];
                    tr.products = [{
                            id: offer.productId,
                            offerId: offer.id,
                        }];
                    tr.state = CdvPurchase.TransactionState.APPROVED;
                    tr.purchaseDate = new Date();
                    tr.transactionId = offer.productId + '-' + (new Date().getTime());
                    tr.isAcknowledged = false;
                    if (offer.productType === CdvPurchase.ProductType.PAID_SUBSCRIPTION) {
                        tr.expirationDate = new Date(+new Date() + 604800000);
                        tr.renewalIntent = CdvPurchase.RenewalIntent.RENEW;
                    }
                    updateVerifiedPurchases(tr);
                    this.receipts.push(receipt);
                    this.context.listener.receiptsUpdated(CdvPurchase.Platform.TEST, [receipt]);
                });
            }
            finish(transaction) {
                return new Promise(resolve => {
                    setTimeout(() => {
                        transaction.state = CdvPurchase.TransactionState.FINISHED;
                        transaction.isAcknowledged = true;
                        updateVerifiedPurchases(transaction);
                        const product = this.products.find(p => transaction.products[0].id === p.id);
                        if ((product === null || product === void 0 ? void 0 : product.type) === CdvPurchase.ProductType.CONSUMABLE)
                            transaction.isConsumed = true;
                        const receipts = this.receipts.filter(r => r.hasTransaction(transaction));
                        this.context.listener.receiptsUpdated(platform, receipts);
                        resolve(undefined);
                    }, 500);
                });
            }
            receiptValidationBody(receipt) {
                return __awaiter(this, void 0, void 0, function* () {
                    return;
                });
            }
            handleReceiptValidationResponse(receipt, response) {
                return __awaiter(this, void 0, void 0, function* () {
                    return;
                });
            }
            /**
             * This function simulates a payment process by prompting the user to confirm the payment.
             *
             * It creates a `Receipt` and `Transaction` object and returns the `Transaction` object if the user enters "Y" in the prompt.
             *
             * @param paymentRequest - An object containing information about the payment, such as the amount and currency.
             * @param additionalData - Additional data to be included in the receipt.
             *
             * @returns A promise that resolves to either an error object (if the user enters "E" in the prompt),
             * a `Transaction` object (if the user confirms the payment), or `undefined` (if the user does not confirm the payment).
             *
             * @example
             *
             * const paymentRequest = {
             *   amountMicros: 1000000,
             *   currency: "USD",
             *   items: [{ id: "product-1" }, { id: "product-2" }]
             * };
             * const result = await requestPayment(paymentRequest);
             * if (result?.isError) {
             *   console.error(`Error: ${result.message}`);
             * } else if (result) {
             *   console.log(`Transaction approved: ${result.transactionId}`);
             * } else {
             *   console.log("Payment cancelled by user");
             * }
             */
            requestPayment(paymentRequest, additionalData) {
                var _a;
                return __awaiter(this, void 0, void 0, function* () {
                    yield CdvPurchase.Utils.asyncDelay(100); // maybe app has some UI to update... and "prompt" prevents that
                    const response = prompt(`Mock payment of ${((_a = paymentRequest.amountMicros) !== null && _a !== void 0 ? _a : 0) / 1000000} ${paymentRequest.currency}. Enter "Y" to confirm. Enter "E" to trigger an error.`);
                    if ((response === null || response === void 0 ? void 0 : response.toUpperCase()) === 'E')
                        return testStoreError(CdvPurchase.ErrorCode.PAYMENT_NOT_ALLOWED, 'Payment not allowed', null);
                    if ((response === null || response === void 0 ? void 0 : response.toUpperCase()) !== 'Y')
                        return;
                    const receipt = new CdvPurchase.Receipt(platform, this.context.apiDecorators);
                    const transaction = new CdvPurchase.Transaction(CdvPurchase.Platform.TEST, receipt, this.context.apiDecorators);
                    transaction.purchaseDate = new Date();
                    transaction.products = paymentRequest.items.filter(p => p).map(product => ({ id: (product === null || product === void 0 ? void 0 : product.id) || '' })),
                        transaction.state = CdvPurchase.TransactionState.APPROVED;
                    transaction.transactionId = 'payment-' + new Date().getTime();
                    transaction.amountMicros = paymentRequest.amountMicros;
                    transaction.currency = paymentRequest.currency;
                    receipt.transactions = [transaction];
                    this.receipts.push(receipt);
                    setTimeout(() => {
                        this.context.listener.receiptsUpdated(platform, [receipt]);
                    }, 400);
                    return transaction;
                });
            }
            manageSubscriptions() {
                return __awaiter(this, void 0, void 0, function* () {
                    alert('Pseudo subscription management interface. Close it when you are done.');
                    return;
                });
            }
            manageBilling() {
                return __awaiter(this, void 0, void 0, function* () {
                    alert('Pseudo billing management interface. Close it when you are done.');
                    return;
                });
            }
            reportActiveSubscription() {
                if (this.receipts.find(r => r.transactions[0].transactionId === transactionId(1))) {
                    // already reported
                    return;
                }
                const RENEWS_EVERY_MS = 2 * 60000; // 2 minutes
                const receipt = new CdvPurchase.Receipt(platform, this.context.apiDecorators);
                const makeTransaction = (n) => {
                    var _a, _b;
                    const tr = new CdvPurchase.Transaction(platform, receipt, this.context.apiDecorators);
                    tr.products = [{
                            id: Test.testProducts.PAID_SUBSCRIPTION_ACTIVE.id,
                            offerId: Test.testProducts.PAID_SUBSCRIPTION_ACTIVE.extra.offerId,
                        }];
                    tr.state = CdvPurchase.TransactionState.APPROVED;
                    tr.transactionId = transactionId(n);
                    tr.isAcknowledged = n == 1;
                    tr.renewalIntent = CdvPurchase.RenewalIntent.RENEW;
                    const firstPurchase = +(((_b = (_a = receipt === null || receipt === void 0 ? void 0 : receipt.transactions) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.purchaseDate) || new Date());
                    tr.purchaseDate = new Date(firstPurchase);
                    tr.lastRenewalDate = new Date(firstPurchase + RENEWS_EVERY_MS * (n - 1));
                    tr.expirationDate = new Date(firstPurchase + RENEWS_EVERY_MS * n);
                    updateVerifiedPurchases(tr);
                    return tr;
                };
                receipt.transactions.push(makeTransaction(1));
                this.receipts.push(receipt);
                this.context.listener.receiptsUpdated(CdvPurchase.Platform.TEST, [receipt]);
                function transactionId(n) {
                    return 'test-active-subscription-transaction-' + n;
                }
                let transactionNumber = 1;
                setInterval(() => {
                    this.log.info('auto-renewing the mock subscription');
                    transactionNumber += 1;
                    receipt.transactions.push(makeTransaction(transactionNumber));
                    this.context.listener.receiptsUpdated(CdvPurchase.Platform.TEST, [receipt]);
                }, RENEWS_EVERY_MS);
            }
            static verify(receipt, callback) {
                setTimeout(() => {
                    var _a, _b;
                    callback({
                        receipt,
                        payload: {
                            ok: true,
                            data: {
                                id: (_b = (_a = receipt.transactions[0]) === null || _a === void 0 ? void 0 : _a.products[0]) === null || _b === void 0 ? void 0 : _b.id,
                                latest_receipt: true,
                                transaction: { type: 'test' },
                                collection: verifiedPurchases,
                            }
                        }
                    });
                }, 500);
            }
            checkSupport(functionality) {
                return true;
            }
            restorePurchases() {
                return __awaiter(this, void 0, void 0, function* () {
                    return undefined;
                });
            }
        }
        Test.Adapter = Adapter;
        function testStoreError(code, message, productId) {
            return CdvPurchase.storeError(code, message, CdvPurchase.Platform.TEST, productId);
        }
    })(Test = CdvPurchase.Test || (CdvPurchase.Test = {}));
})(CdvPurchase || (CdvPurchase = {}));
/// <reference path="../../utils/compatibility.ts" />
var CdvPurchase;
(function (CdvPurchase) {
    let Test;
    (function (Test) {
        const platform = CdvPurchase.Platform.TEST;
        /**
         * Definition of the test products.
         */
        Test.testProducts = {
            /**
             * A valid consumable product.
             *
             * - id: "test-consumable"
             * - type: ProductType.CONSUMABLE
             */
            CONSUMABLE: {
                platform,
                id: 'test-consumable',
                type: CdvPurchase.ProductType.CONSUMABLE,
            },
            /**
             * A consumable product for which the purchase will always fail.
             *
             * - id: "test-consumable-fail"
             * - type: ProductType.CONSUMABLE
             */
            CONSUMABLE_FAILING: {
                platform,
                id: 'test-consumable-fail',
                type: CdvPurchase.ProductType.CONSUMABLE,
            },
            /**
             * A valid non-consumable product.
             *
             * - id: "test-non-consumable"
             * - type: ProductType.NON_CONSUMABLE
             */
            NON_CONSUMABLE: {
                platform,
                id: 'test-non-consumable',
                type: CdvPurchase.ProductType.NON_CONSUMABLE,
            },
            /**
             * A paid-subscription that auto-renews for the duration of the session.
             *
             * This subscription has a free trial period, that renews every week, 3 times.
             * It then costs $4.99 per month.
             *
             * - id: "test-subscription"
             * - type: ProductType.PAID_SUBSCRIPTION
             */
            PAID_SUBSCRIPTION: {
                platform,
                id: 'test-subscription',
                type: CdvPurchase.ProductType.PAID_SUBSCRIPTION,
            },
            /**
             * A paid-subscription that is already active when the app starts.
             *
             * It behaves as if the user subscribed on a different device. It will renew forever.
             *
             * - id: "test-subscription-active"
             * - type: ProductType.PAID_SUBSCRIPTION
             */
            PAID_SUBSCRIPTION_ACTIVE: {
                platform,
                id: 'test-subscription-active',
                type: CdvPurchase.ProductType.PAID_SUBSCRIPTION,
                /** @internal */
                extra: {
                    offerId: 'test-paid-subscription-active-offer1',
                }
            },
        };
        /**
         * List of test products definitions as an array.
         */
        Test.testProductsArray = CdvPurchase.Utils.objectValues(Test.testProducts);
        /**
         * Initialize a test product.
         *
         * @internal
         */
        function initTestProduct(productId, decorator) {
            const key = Object.keys(Test.testProducts).find(key => Test.testProducts[key] && Test.testProducts[key].id === productId);
            if (!key)
                return;
            const product = new CdvPurchase.Product(Test.testProducts[key], decorator);
            switch (key) {
                case 'CONSUMABLE':
                    product.title = 'Test Consumable';
                    product.description = 'A consumable product that you can purchase';
                    product.addOffer(new CdvPurchase.Offer({
                        id: 'test-consumable-offer1',
                        pricingPhases: [{
                                price: '$4.99',
                                currency: 'USD',
                                priceMicros: 4990000,
                                paymentMode: CdvPurchase.PaymentMode.UP_FRONT,
                                recurrenceMode: CdvPurchase.RecurrenceMode.NON_RECURRING,
                            }],
                        product,
                    }, decorator));
                    break;
                case 'CONSUMABLE_FAILING':
                    product.title = 'Failing Consumable';
                    product.description = 'A consumable product that cannot be purchased';
                    product.addOffer(new CdvPurchase.Offer({
                        id: 'test-consumable-fail-offer1',
                        pricingPhases: [{
                                price: '$1.99',
                                currency: 'USD',
                                priceMicros: 1990000,
                                paymentMode: CdvPurchase.PaymentMode.UP_FRONT,
                                recurrenceMode: CdvPurchase.RecurrenceMode.NON_RECURRING,
                            }],
                        product,
                    }, decorator));
                    break;
                case 'NON_CONSUMABLE':
                    product.title = 'Non Consumable';
                    product.description = 'A non consumable product';
                    product.addOffer(new CdvPurchase.Offer({
                        id: 'test-non-consumable-offer1',
                        pricingPhases: [{
                                price: '$9.99',
                                currency: 'USD',
                                priceMicros: 9990000,
                                paymentMode: CdvPurchase.PaymentMode.UP_FRONT,
                                recurrenceMode: CdvPurchase.RecurrenceMode.NON_RECURRING,
                            }],
                        product,
                    }, decorator));
                    break;
                case 'PAID_SUBSCRIPTION':
                    product.title = 'A subscription product';
                    product.description = 'An auto-renewing paid subscription with a trial period';
                    product.addOffer(new CdvPurchase.Offer({
                        id: 'test-paid-subscription-offer1',
                        product,
                        pricingPhases: [{
                                price: '$0.00',
                                currency: 'USD',
                                priceMicros: 0,
                                paymentMode: CdvPurchase.PaymentMode.FREE_TRIAL,
                                recurrenceMode: CdvPurchase.RecurrenceMode.FINITE_RECURRING,
                                billingCycles: 3,
                                billingPeriod: 'P1W',
                            }, {
                                price: '$4.99',
                                currency: 'USD',
                                priceMicros: 4990000,
                                paymentMode: CdvPurchase.PaymentMode.PAY_AS_YOU_GO,
                                recurrenceMode: CdvPurchase.RecurrenceMode.INFINITE_RECURRING,
                                billingPeriod: 'P1M',
                            }],
                    }, decorator));
                    break;
                case 'PAID_SUBSCRIPTION_ACTIVE':
                    product.title = 'An owned subscription product';
                    product.description = 'An active paid subscription';
                    product.addOffer(new CdvPurchase.Offer({
                        id: Test.testProducts.PAID_SUBSCRIPTION_ACTIVE.extra.offerId,
                        product,
                        pricingPhases: [{
                                price: '$19.99',
                                currency: 'USD',
                                priceMicros: 19990000,
                                paymentMode: CdvPurchase.PaymentMode.PAY_AS_YOU_GO,
                                recurrenceMode: CdvPurchase.RecurrenceMode.INFINITE_RECURRING,
                                billingPeriod: 'P1Y',
                            }],
                    }, decorator));
                    break;
                default:
                    const unhandledSwitchCase = key;
                    throw new Error(`Unhandled enum case: ${unhandledSwitchCase}`);
            }
            return product;
        }
        Test.initTestProduct = initTestProduct;
    })(Test = CdvPurchase.Test || (CdvPurchase.Test = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    let WindowsStore;
    (function (WindowsStore) {
        class Adapter {
            constructor() {
                this.id = CdvPurchase.Platform.WINDOWS_STORE;
                this.name = 'WindowsStore';
                this.ready = false;
                this.supportsParallelLoading = false;
                this.products = [];
                this.receipts = [];
            }
            initialize() {
                return __awaiter(this, void 0, void 0, function* () { return; });
            }
            get isSupported() {
                return false;
            }
            loadProducts(products) {
                return __awaiter(this, void 0, void 0, function* () {
                    return products.map(p => windowsStoreError(CdvPurchase.ErrorCode.PRODUCT_NOT_AVAILABLE, 'TODO', p.id));
                });
            }
            loadReceipts() {
                return __awaiter(this, void 0, void 0, function* () {
                    return [];
                });
            }
            order(offer) {
                return __awaiter(this, void 0, void 0, function* () {
                    return windowsStoreError(CdvPurchase.ErrorCode.UNKNOWN, 'TODO: Not implemented', offer.productId);
                });
            }
            finish(transaction) {
                return __awaiter(this, void 0, void 0, function* () {
                    return windowsStoreError(CdvPurchase.ErrorCode.UNKNOWN, 'TODO: Not implemented', null);
                });
            }
            handleReceiptValidationResponse(receipt, response) {
                return __awaiter(this, void 0, void 0, function* () {
                    return;
                });
            }
            receiptValidationBody(receipt) {
                return __awaiter(this, void 0, void 0, function* () {
                    return;
                });
            }
            requestPayment(payment, additionalData) {
                return __awaiter(this, void 0, void 0, function* () {
                    return windowsStoreError(CdvPurchase.ErrorCode.UNKNOWN, 'requestPayment not supported', null);
                });
            }
            manageSubscriptions() {
                return __awaiter(this, void 0, void 0, function* () {
                    return windowsStoreError(CdvPurchase.ErrorCode.UNKNOWN, 'manageSubscriptions not supported', null);
                });
            }
            manageBilling() {
                return __awaiter(this, void 0, void 0, function* () {
                    return windowsStoreError(CdvPurchase.ErrorCode.UNKNOWN, 'manageBilling not supported', null);
                });
            }
            checkSupport(functionality) {
                return false;
            }
            restorePurchases() {
                return __awaiter(this, void 0, void 0, function* () {
                    return undefined;
                });
            }
        }
        WindowsStore.Adapter = Adapter;
        function windowsStoreError(code, message, productId) {
            return CdvPurchase.storeError(code, message, CdvPurchase.Platform.WINDOWS_STORE, productId);
        }
    })(WindowsStore = CdvPurchase.WindowsStore || (CdvPurchase.WindowsStore = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    let Utils;
    (function (Utils) {
        let Ajax;
        (function (Ajax) {
            /** HTTP status returned when a request times out */
            Ajax.HTTP_REQUEST_TIMEOUT = 408;
        })(Ajax = Utils.Ajax || (Utils.Ajax = {}));
        /**
         * Simplified version of jQuery's ajax method based on XMLHttpRequest.
         *
         * Uses cordova's http plugin when installed.
         *
         * Only supports JSON requests.
         */
        function ajax(log, options) {
            if (typeof window !== 'undefined' && window.cordova && window.cordova.plugin && window.cordova.plugin.http) {
                return ajaxWithHttpPlugin(log, options);
            }
            var doneCb = function () { };
            var xhr = new XMLHttpRequest();
            if (options.timeout) {
                xhr.timeout = options.timeout;
                xhr.ontimeout = function ( /*event*/) {
                    log.warn("ajax -> request to " + options.url + " timeout");
                    Utils.callExternal(log, 'ajax.error', options.error, Ajax.HTTP_REQUEST_TIMEOUT, "Timeout");
                };
            }
            xhr.open(options.method || 'POST', options.url, true);
            xhr.onreadystatechange = function ( /*event*/) {
                try {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            Utils.callExternal(log, 'ajax.success', options.success, JSON.parse(xhr.responseText));
                        }
                        else {
                            log.warn("ajax -> request to " + options.url + " failed with status " + xhr.status + " (" + xhr.statusText + ")");
                            Utils.callExternal(log, 'ajax.error', options.error, xhr.status, xhr.statusText);
                        }
                    }
                }
                catch (e) {
                    log.warn("ajax -> request to " + options.url + " failed with an exception: " + e.message);
                    if (options.error)
                        options.error(417, e.message, null);
                }
                if (xhr.readyState === 4)
                    Utils.callExternal(log, 'ajax.done', doneCb);
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
        Utils.ajax = ajax;
        /**
         * Simplified version of jQuery's ajax method based on XMLHttpRequest.
         *
         * Uses the http plugin.
         */
        function ajaxWithHttpPlugin(log, options) {
            let doneCb = function () { };
            const ajaxOptions = {
                method: (options.method || 'get').toLowerCase(),
                data: options.data,
                serializer: 'json',
                // responseType: 'json',
            };
            if (options.customHeaders) {
                log.debug('ajax[http] -> adding custom headers: ' + JSON.stringify(options.customHeaders));
                ajaxOptions.headers = options.customHeaders;
            }
            log.debug('ajax[http] -> send request to ' + options.url);
            const ajaxDone = (response) => {
                try {
                    if (response.status == 200) {
                        Utils.callExternal(log, 'ajax.success', options.success, JSON.parse(response.data));
                    }
                    else {
                        log.warn("ajax[http] -> request to " + options.url + " failed with status " + response.status + " (" + response.error + ")");
                        Utils.callExternal(log, 'ajax.error', options.error, response.status, response.error);
                    }
                }
                catch (e) {
                    log.warn("ajax[http] -> request to " + options.url + " failed with an exception: " + e.message);
                    if (options.error)
                        Utils.callExternal(log, 'ajax.error', options.error, 417, e.message);
                }
                Utils.callExternal(log, 'ajax.done', doneCb);
            };
            window.cordova.plugin.http.sendRequest(options.url, ajaxOptions, ajaxDone, ajaxDone);
            return {
                done: function (cb) { doneCb = cb; return this; }
            };
        }
    })(Utils = CdvPurchase.Utils || (CdvPurchase.Utils = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    let Utils;
    (function (Utils) {
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
         * Utils.callExternal(store.log, "ajax.error", options.error, 404, "Not found");
         * ```
         *
         * @internal
         */
        function callExternal(log, name, callback, ...args) {
            try {
                const args = Array.prototype.slice.call(arguments, 3);
                // store.log.debug("calling " + name + "(" + JSON.stringify(args2) + ")");
                if (callback)
                    callback.apply(CdvPurchase.store, args);
            }
            catch (e) {
                log.logCallbackException(name, e);
            }
        }
        Utils.callExternal = callExternal;
    })(Utils = CdvPurchase.Utils || (CdvPurchase.Utils = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    let Utils;
    (function (Utils) {
        /** @internal */
        function delay(fn, milliseconds) {
            return setTimeout(fn, milliseconds);
        }
        Utils.delay = delay;
        /** @internal */
        function debounce(fn, milliseconds) {
            let timeout = null;
            const later = function (context, args) {
                timeout = null;
                fn();
            };
            const debounced = function () {
                if (timeout)
                    window.clearTimeout(timeout);
                timeout = setTimeout(later, milliseconds);
            };
            return debounced;
        }
        Utils.debounce = debounce;
        function asyncDelay(milliseconds) {
            return new Promise(resolve => setTimeout(resolve, milliseconds));
        }
        Utils.asyncDelay = asyncDelay;
    })(Utils = CdvPurchase.Utils || (CdvPurchase.Utils = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    let Utils;
    (function (Utils) {
        /**
         * Generate a plain english version of the billing cycle in a pricing phase.
         *
         * Example outputs:
         *
         * - "3x 1 month": for `FINITE_RECURRING`, 3 cycles, period "P1M"
         * - "for 1 year": for `NON_RECURRING`, period "P1Y"
         * - "every week": for `INFINITE_RECURRING, period "P1W"
         *
         * @example
         * Utils.formatBillingCycleEN(offer.pricingPhases[0])
         */
        function formatBillingCycleEN(pricingPhase) {
            switch (fixedRecurrenceMode(pricingPhase)) {
                case CdvPurchase.RecurrenceMode.FINITE_RECURRING:
                    return `${pricingPhase.billingCycles}x ${Utils.formatDurationEN(pricingPhase.billingPeriod)}`;
                case CdvPurchase.RecurrenceMode.NON_RECURRING:
                    return 'for ' + Utils.formatDurationEN(pricingPhase.billingPeriod);
                default: // INFINITE_RECURRING
                    return 'every ' + Utils.formatDurationEN(pricingPhase.billingPeriod, { omitOne: true });
            }
        }
        Utils.formatBillingCycleEN = formatBillingCycleEN;
        /**
         * FINITE_RECURRING with billingCycles=1 is like NON_RECURRING
         * FINITE_RECURRING with billingCycles=0 is like INFINITE_RECURRING
         */
        function fixedRecurrenceMode(pricingPhase) {
            var _a;
            const cycles = (_a = pricingPhase.billingCycles) !== null && _a !== void 0 ? _a : 0;
            if (pricingPhase.recurrenceMode === CdvPurchase.RecurrenceMode.FINITE_RECURRING) {
                if (cycles == 1)
                    return CdvPurchase.RecurrenceMode.NON_RECURRING;
                if (cycles <= 0)
                    return CdvPurchase.RecurrenceMode.INFINITE_RECURRING;
            }
            return pricingPhase.recurrenceMode;
        }
    })(Utils = CdvPurchase.Utils || (CdvPurchase.Utils = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    let Utils;
    (function (Utils) {
        /**
         * Format a simple ISO 8601 duration to plain English.
         *
         * This works for non-composite durations, i.e. that have a single unit with associated amount. For example: "P1Y" or "P3W".
         *
         * See https://en.wikipedia.org/wiki/ISO_8601#Durations
         *
         * This method is provided as a utility for getting simple things done quickly. In your application, you'll probably
         * need some other method that supports multiple locales.
         *
         * @param iso - Duration formatted in IS0 8601
         * @return The duration in plain english. Example: "1 year" or "3 weeks".
         */
        function formatDurationEN(iso, options) {
            if (!iso)
                return '';
            const l = iso.length;
            const n = iso.slice(1, l - 1);
            if (n === '1') {
                if (options === null || options === void 0 ? void 0 : options.omitOne) {
                    return ({ 'D': 'day', 'W': 'week', 'M': 'month', 'Y': 'year', }[iso[l - 1]]) || iso[l - 1];
                }
                else {
                    return ({ 'D': '1 day', 'W': '1 week', 'M': '1 month', 'Y': '1 year', }[iso[l - 1]]) || iso[l - 1];
                }
            }
            else {
                const u = ({ 'D': 'days', 'W': 'weeks', 'M': 'months', 'Y': 'years', }[iso[l - 1]]) || iso[l - 1];
                return `${n} ${u}`;
            }
        }
        Utils.formatDurationEN = formatDurationEN;
    })(Utils = CdvPurchase.Utils || (CdvPurchase.Utils = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    let Utils;
    (function (Utils) {
        const HEX2STR = "0123456789abcdef".split("");
        function toHexString(r) {
            for (var n = "", e = 0; e < 4; e++)
                n += HEX2STR[r >> 8 * e + 4 & 15] + HEX2STR[r >> 8 * e & 15];
            return n;
        }
        function hexStringFromArray(array) {
            const out = [];
            for (var arrayLength = array.length, i = 0; i < arrayLength; i++)
                out.push(toHexString(array[i]));
            return out.join("");
        }
        function add32(r, n) {
            return r + n & 4294967295;
        }
        function complexShift(r, n, e, t, o, u, shiftFunction) {
            function shiftAdd32(op0, op1, v1) {
                return add32(op0 << op1 | op0 >>> 32 - op1, v1);
            }
            function add32x4(i0, i1, j0, j1) {
                return add32(add32(i1, i0), add32(j0, j1));
            }
            return shiftAdd32(add32x4(r, n, t, u), o, e);
        }
        var step1Function = function (shiftFunction, n, e, t, o, u, f, a) { return complexShift(e & t | ~e & o, n, e, u, f, a, shiftFunction); };
        var step2Function = function (shiftFunction, n, e, t, o, u, f, a) { return complexShift(e & o | t & ~o, n, e, u, f, a, shiftFunction); };
        var step3Function = function (shiftFunction, n, e, t, o, u, f, a) { return complexShift(e ^ t ^ o, n, e, u, f, a, shiftFunction); };
        var step4Function = function (shiftFunction, n, e, t, o, u, f, a) { return complexShift(t ^ (e | ~o), n, e, u, f, a, shiftFunction); };
        function hashStep(inOutVec4, strAsInts, shiftFunction) {
            if (!shiftFunction)
                shiftFunction = add32;
            let v0 = inOutVec4[0];
            let v1 = inOutVec4[1];
            let v2 = inOutVec4[2];
            let v3 = inOutVec4[3];
            var step1 = step1Function.bind(null, shiftFunction);
            v0 = step1(v0, v1, v2, v3, strAsInts[0], 7, -680876936);
            v3 = step1(v3, v0, v1, v2, strAsInts[1], 12, -389564586);
            v2 = step1(v2, v3, v0, v1, strAsInts[2], 17, 606105819);
            v1 = step1(v1, v2, v3, v0, strAsInts[3], 22, -1044525330);
            v0 = step1(v0, v1, v2, v3, strAsInts[4], 7, -176418897);
            v3 = step1(v3, v0, v1, v2, strAsInts[5], 12, 1200080426);
            v2 = step1(v2, v3, v0, v1, strAsInts[6], 17, -1473231341);
            v1 = step1(v1, v2, v3, v0, strAsInts[7], 22, -45705983);
            v0 = step1(v0, v1, v2, v3, strAsInts[8], 7, 1770035416);
            v3 = step1(v3, v0, v1, v2, strAsInts[9], 12, -1958414417);
            v2 = step1(v2, v3, v0, v1, strAsInts[10], 17, -42063);
            v1 = step1(v1, v2, v3, v0, strAsInts[11], 22, -1990404162);
            v0 = step1(v0, v1, v2, v3, strAsInts[12], 7, 1804603682);
            v3 = step1(v3, v0, v1, v2, strAsInts[13], 12, -40341101);
            v2 = step1(v2, v3, v0, v1, strAsInts[14], 17, -1502002290);
            v1 = step1(v1, v2, v3, v0, strAsInts[15], 22, 1236535329);
            var step2 = step2Function.bind(null, shiftFunction);
            v0 = step2(v0, v1, v2, v3, strAsInts[1], 5, -165796510);
            v3 = step2(v3, v0, v1, v2, strAsInts[6], 9, -1069501632);
            v2 = step2(v2, v3, v0, v1, strAsInts[11], 14, 643717713);
            v1 = step2(v1, v2, v3, v0, strAsInts[0], 20, -373897302);
            v0 = step2(v0, v1, v2, v3, strAsInts[5], 5, -701558691);
            v3 = step2(v3, v0, v1, v2, strAsInts[10], 9, 38016083);
            v2 = step2(v2, v3, v0, v1, strAsInts[15], 14, -660478335);
            v1 = step2(v1, v2, v3, v0, strAsInts[4], 20, -405537848);
            v0 = step2(v0, v1, v2, v3, strAsInts[9], 5, 568446438);
            v3 = step2(v3, v0, v1, v2, strAsInts[14], 9, -1019803690);
            v2 = step2(v2, v3, v0, v1, strAsInts[3], 14, -187363961);
            v1 = step2(v1, v2, v3, v0, strAsInts[8], 20, 1163531501);
            v0 = step2(v0, v1, v2, v3, strAsInts[13], 5, -1444681467);
            v3 = step2(v3, v0, v1, v2, strAsInts[2], 9, -51403784);
            v2 = step2(v2, v3, v0, v1, strAsInts[7], 14, 1735328473);
            v1 = step2(v1, v2, v3, v0, strAsInts[12], 20, -1926607734);
            var step3 = step3Function.bind(null, shiftFunction);
            v0 = step3(v0, v1, v2, v3, strAsInts[5], 4, -378558);
            v3 = step3(v3, v0, v1, v2, strAsInts[8], 11, -2022574463);
            v2 = step3(v2, v3, v0, v1, strAsInts[11], 16, 1839030562);
            v1 = step3(v1, v2, v3, v0, strAsInts[14], 23, -35309556);
            v0 = step3(v0, v1, v2, v3, strAsInts[1], 4, -1530992060);
            v3 = step3(v3, v0, v1, v2, strAsInts[4], 11, 1272893353);
            v2 = step3(v2, v3, v0, v1, strAsInts[7], 16, -155497632);
            v1 = step3(v1, v2, v3, v0, strAsInts[10], 23, -1094730640);
            v0 = step3(v0, v1, v2, v3, strAsInts[13], 4, 681279174);
            v3 = step3(v3, v0, v1, v2, strAsInts[0], 11, -358537222);
            v2 = step3(v2, v3, v0, v1, strAsInts[3], 16, -722521979);
            v1 = step3(v1, v2, v3, v0, strAsInts[6], 23, 76029189);
            v0 = step3(v0, v1, v2, v3, strAsInts[9], 4, -640364487);
            v3 = step3(v3, v0, v1, v2, strAsInts[12], 11, -421815835);
            v2 = step3(v2, v3, v0, v1, strAsInts[15], 16, 530742520);
            v1 = step3(v1, v2, v3, v0, strAsInts[2], 23, -995338651);
            var step4 = step4Function.bind(null, shiftFunction);
            v0 = step4(v0, v1, v2, v3, strAsInts[0], 6, -198630844);
            v3 = step4(v3, v0, v1, v2, strAsInts[7], 10, 1126891415);
            v2 = step4(v2, v3, v0, v1, strAsInts[14], 15, -1416354905);
            v1 = step4(v1, v2, v3, v0, strAsInts[5], 21, -57434055);
            v0 = step4(v0, v1, v2, v3, strAsInts[12], 6, 1700485571);
            v3 = step4(v3, v0, v1, v2, strAsInts[3], 10, -1894986606);
            v2 = step4(v2, v3, v0, v1, strAsInts[10], 15, -1051523);
            v1 = step4(v1, v2, v3, v0, strAsInts[1], 21, -2054922799);
            v0 = step4(v0, v1, v2, v3, strAsInts[8], 6, 1873313359);
            v3 = step4(v3, v0, v1, v2, strAsInts[15], 10, -30611744);
            v2 = step4(v2, v3, v0, v1, strAsInts[6], 15, -1560198380);
            v1 = step4(v1, v2, v3, v0, strAsInts[13], 21, 1309151649);
            v0 = step4(v0, v1, v2, v3, strAsInts[4], 6, -145523070);
            v3 = step4(v3, v0, v1, v2, strAsInts[11], 10, -1120210379);
            v2 = step4(v2, v3, v0, v1, strAsInts[2], 15, 718787259);
            v1 = step4(v1, v2, v3, v0, strAsInts[9], 21, -343485551);
            inOutVec4[0] = shiftFunction(v0, inOutVec4[0]);
            inOutVec4[1] = shiftFunction(v1, inOutVec4[1]);
            inOutVec4[2] = shiftFunction(v2, inOutVec4[2]);
            inOutVec4[3] = shiftFunction(v3, inOutVec4[3]);
        }
        ;
        function stringToIntArray(r) {
            for (var ret = [], e = 0; e < 64; e += 4)
                ret[e >> 2] = r.charCodeAt(e) + (r.charCodeAt(e + 1) << 8) + (r.charCodeAt(e + 2) << 16) + (r.charCodeAt(e + 3) << 24);
            return ret;
        }
        function computeMD5(str, shiftFunction) {
            let lastCharIndex;
            const strLength = str.length;
            const vec4 = [1732584193, -271733879, -1732584194, 271733878];
            for (lastCharIndex = 64; lastCharIndex <= strLength; lastCharIndex += 64)
                hashStep(vec4, stringToIntArray(str.substring(lastCharIndex - 64, lastCharIndex)), shiftFunction);
            const vec16 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            const reminderLength = (str = str.substring(lastCharIndex - 64)).length;
            // process by batch of 64
            let vec16Index;
            for (vec16Index = 0; vec16Index < reminderLength; vec16Index++)
                vec16[vec16Index >> 2] |= str.charCodeAt(vec16Index) << (vec16Index % 4 << 3);
            vec16[vec16Index >> 2] |= 128 << (vec16Index % 4 << 3);
            if (vec16Index > 55) {
                hashStep(vec4, vec16, shiftFunction);
                for (vec16Index = 16; vec16Index--;)
                    vec16[vec16Index] = 0;
            }
            vec16[14] = 8 * strLength;
            hashStep(vec4, vec16, shiftFunction);
            return vec4;
        }
        ;
        /**
         * Returns the MD5 hash-value of the passed string.
         *
         * Based on the work of Jeff Mott, who did a pure JS implementation of the MD5 algorithm that was published by Ronald L. Rivest in 1991.
         * Code was imported from https://github.com/pvorb/node-md5
         *
         * I cleaned up the all-including minified version of it.
         */
        function md5(str) {
            if (!str)
                return '';
            let shiftFunction;
            if ("5d41402abc4b2a76b9719d911017c592" !== hexStringFromArray(computeMD5("hello")))
                shiftFunction = function (r, n) {
                    const e = (65535 & r) + (65535 & n);
                    return (r >> 16) + (n >> 16) + (e >> 16) << 16 | 65535 & e;
                };
            return hexStringFromArray(computeMD5(str, shiftFunction));
        }
        Utils.md5 = md5;
    })(Utils = CdvPurchase.Utils || (CdvPurchase.Utils = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    let Utils;
    (function (Utils) {
        /**
         * Return a safer version of a callback that runs inside a try/catch block.
         *
         * @param logger - Used to log errors.
         * @param className - Type of callback, helps debugging when a function failed.
         * @param callback - The callback function is turn into a safer version.
         */
        function safeCallback(logger, className, callback, callbackName, reason) {
            return function (value) {
                safeCall(logger, className, callback, value, callbackName, reason);
            };
        }
        Utils.safeCallback = safeCallback;
        /**
         * Run a callback inside a try/catch block.
         *
         * @param logger - Used to log errors.
         * @param className - Type of callback, helps debugging when a function failed.
         * @param callback - The callback function is turn into a safer version.
         * @param value - Value passed to the callback.
         */
        function safeCall(logger, className, callback, value, callbackName, reason) {
            if (!callbackName) {
                callbackName = callback.name || ('#' + Utils.md5(callback.toString()));
            }
            setTimeout(() => {
                try {
                    logger.debug(`Calling callback: type=${className} name=${callbackName} reason=${reason}`);
                    callback(value);
                }
                catch (error) {
                    logger.error(`Error in callback: type=${className} name=${callbackName} reason=${reason}`);
                    logger.debug(callback.toString());
                    const errorAsError = error;
                    if ('message' in errorAsError)
                        logger.error(errorAsError.message);
                    if ('fileName' in error)
                        logger.error('in ' + error.fileName + ':' + error.lineNumber);
                    if ('stack' in errorAsError)
                        logger.error(errorAsError.stack);
                }
            }, 0);
        }
        Utils.safeCall = safeCall;
    })(Utils = CdvPurchase.Utils || (CdvPurchase.Utils = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    let Utils;
    (function (Utils) {
        function getCryptoExtension() {
            return (window.crypto || window.msCrypto);
        }
        /** Returns an UUID v4. Uses `window.crypto` internally to generate random values. */
        function uuidv4() {
            // @ts-ignore
            return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
                return (c ^ getCryptoExtension().getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
            });
        }
        Utils.uuidv4 = uuidv4;
    })(Utils = CdvPurchase.Utils || (CdvPurchase.Utils = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    let Validator;
    (function (Validator) {
        /**
         * @internal
         */
        let Internal;
        (function (Internal) {
            function isArray(arg) {
                return Object.prototype.toString.call(arg) === '[object Array]';
            }
            function isObject(arg) {
                return Object.prototype.toString.call(arg) === '[object Object]';
            }
            // List of functions allowed by store.validator_privacy_policy
            function getPrivacyPolicy(store) {
                if (typeof store.validator_privacy_policy === 'string')
                    return store.validator_privacy_policy.split(',');
                else if (isArray(store.validator_privacy_policy))
                    return store.validator_privacy_policy;
                else // default: no tracking
                    return ['analytics', 'support', 'fraud'];
            }
            function getDeviceInfo(store) {
                const privacyPolicy = getPrivacyPolicy(store); // string[]
                function allowed(policy) {
                    return privacyPolicy.indexOf(policy) >= 0;
                }
                // Different versions of the plugin use different response fields.
                // Sending this information allows the validator to reply with only expected information.
                const ret = {
                    plugin: 'cordova-plugin-purchase/' + CdvPurchase.PLUGIN_VERSION,
                };
                const wdw = window;
                // the cordova-plugin-device global object
                const device = isObject(wdw.device) ? wdw.device : {};
                // Send the receipt validator information about the device.
                // This will allow to make vendor or device specific fixes and detect class
                // of devices with issues.
                // Knowing running version of OS and libraries also required for handling
                // support requests.
                if (allowed('analytics') || allowed('support')) {
                    // Version of ionic (if applicable)
                    const ionic = wdw.Ionic || wdw.ionic;
                    if (ionic && ionic.version)
                        ret.ionic = ionic.version;
                    // Information from the cordova-plugin-device (if installed)
                    if (device.cordova)
                        ret.cordova = device.cordova; // Version of cordova
                    if (device.model)
                        ret.model = device.model; // Device model
                    if (device.platform)
                        ret.platform = device.platform; // OS
                    if (device.version)
                        ret.version = device.version; // OS version
                    if (device.manufacturer)
                        ret.manufacturer = device.manufacturer; // Device manufacturer
                }
                // Device identifiers are used for tracking users across services
                // It is sometimes required for support requests too, but I choose to
                // keep this out.
                if (allowed('tracking')) {
                    if (device.serial)
                        ret.serial = device.serial; // Hardware serial number
                    if (device.uuid)
                        ret.uuid = device.uuid; // Device UUID
                }
                // Running from a simulator is an error condition for in-app purchases.
                // Since only developers run in a simulator, let's always report that.
                if (device.isVirtual)
                    ret.isVirtual = device.isVirtual; // Simulator
                // Probably nobody wants to disable fraud discovery.
                // A fingerprint of the device identifiers is used for fraud discovery.
                // An alert should be triggered by the validator when a lot of devices
                // share a single receipt.
                if (allowed('fraud')) {
                    // For fraud discovery, we only need a fingerprint of the device.
                    var fingerprint = '';
                    if (device.serial)
                        fingerprint = 'serial:' + device.serial; // Hardware serial number
                    else if (device.uuid)
                        fingerprint = 'uuid:' + device.uuid; // Device UUID
                    else {
                        // Using only model and manufacturer, we might end-up with many
                        // users sharing the same fingerprint, which is fine for fraud discovery.
                        if (device.model)
                            fingerprint += '/' + device.model;
                        if (device.manufacturer)
                            fingerprint = '/' + device.manufacturer;
                    }
                    // Fingerprint is hashed to keep required level of privacy.
                    if (fingerprint)
                        ret.fingerprint = CdvPurchase.Utils.md5(fingerprint);
                }
                return ret;
            }
            Internal.getDeviceInfo = getDeviceInfo;
        })(Internal = Validator.Internal || (Validator.Internal = {}));
    })(Validator = CdvPurchase.Validator || (CdvPurchase.Validator = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    let Validator;
    (function (Validator) {
        let Request;
        (function (Request) {
            ;
        })(Request = Validator.Request || (Validator.Request = {}));
    })(Validator = CdvPurchase.Validator || (CdvPurchase.Validator = {}));
})(CdvPurchase || (CdvPurchase = {}));
var CdvPurchase;
(function (CdvPurchase) {
    /** Receipt data as validated by the receipt validation server */
    class VerifiedReceipt {
        /**
         * @internal
         */
        constructor(receipt, response, decorator) {
            var _a;
            /** @internal */
            this.className = 'VerifiedReceipt';
            this.id = response.id;
            this.sourceReceipt = receipt;
            this.collection = (_a = response.collection) !== null && _a !== void 0 ? _a : [];
            this.latestReceipt = response.latest_receipt;
            this.nativeTransactions = [response.transaction];
            this.warning = response.warning;
            Object.defineProperty(this, 'raw', { 'enumerable': false, get() { return response; } });
            Object.defineProperty(this, 'finish', { 'enumerable': false, get() { return () => decorator.finish(this); } });
        }
        /** Platform this receipt originated from */
        get platform() { return this.sourceReceipt.platform; }
        /** Get raw response data from the receipt validation request */
        get raw() { return {}; } // actual implementation as "defineProperty" in constructor.
        /**
         * Update the receipt content
         *
         * @internal
         */
        set(receipt, response) {
            var _a;
            this.id = response.id;
            this.sourceReceipt = receipt;
            this.collection = (_a = response.collection) !== null && _a !== void 0 ? _a : [];
            this.latestReceipt = response.latest_receipt;
            this.nativeTransactions = [response.transaction];
            this.warning = response.warning;
        }
        /** Finish all transactions in the receipt */
        finish() {
            return __awaiter(this, void 0, void 0, function* () { });
        }
    }
    CdvPurchase.VerifiedReceipt = VerifiedReceipt;
})(CdvPurchase || (CdvPurchase = {}));
