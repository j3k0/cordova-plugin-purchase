declare namespace CdvPurchase {
    /**
     * Error codes
     */
    enum ErrorCode {
        /** Error: Failed to intialize the in-app purchase library */
        SETUP,
        /** Error: Failed to load in-app products metadata */
        LOAD,
        /** Error: Failed to make a purchase */
        PURCHASE,
        /** Error: Failed to load the purchase receipt */
        LOAD_RECEIPTS,
        /** Error: Client is not allowed to issue the request */
        CLIENT_INVALID,
        /** Error: Purchase flow has been cancelled by user */
        PAYMENT_CANCELLED,
        /** Error: Something is suspicious about a purchase */
        PAYMENT_INVALID,
        /** Error: The user is not allowed to make a payment */
        PAYMENT_NOT_ALLOWED,
        /** Error: Unknown error */
        UNKNOWN,
        /** Error: Failed to refresh the purchase receipt */
        REFRESH_RECEIPTS,
        /** Error: The product identifier is invalid */
        INVALID_PRODUCT_ID,
        /** Error: Cannot finalize a transaction or acknowledge a purchase */
        FINISH,
        /** Error: Failed to communicate with the server */
        COMMUNICATION,
        /** Error: Subscriptions are not available */
        SUBSCRIPTIONS_NOT_AVAILABLE,
        /** Error: Purchase information is missing token */
        MISSING_TOKEN,
        /** Error: Verification of store data failed */
        VERIFICATION_FAILED,
        /** Error: Bad response from the server */
        BAD_RESPONSE,
        /** Error: Failed to refresh the store */
        REFRESH,
        /** Error: Payment has expired */
        PAYMENT_EXPIRED,
        /** Error: Failed to download the content */
        DOWNLOAD,
        /** Error: Failed to update a subscription */
        SUBSCRIPTION_UPDATE_NOT_AVAILABLE,
        /** Error: The requested product is not available in the store. */
        PRODUCT_NOT_AVAILABLE,
        /** Error: The user has not allowed access to Cloud service information */
        CLOUD_SERVICE_PERMISSION_DENIED,
        /** Error: The device could not connect to the network. */
        CLOUD_SERVICE_NETWORK_CONNECTION_FAILED,
        /** Error: The user has revoked permission to use this cloud service. */
        CLOUD_SERVICE_REVOKED,
        /** Error: The user has not yet acknowledged Apple’s privacy policy */
        PRIVACY_ACKNOWLEDGEMENT_REQUIRED,
        /** Error: The app is attempting to use a property for which it does not have the required entitlement. */
        UNAUTHORIZED_REQUEST_DATA,
        /** Error: The offer identifier is invalid. */
        INVALID_OFFER_IDENTIFIER,
        /** Error: The price you specified in App Store Connect is no longer valid. */
        INVALID_OFFER_PRICE,
        /** Error: The signature in a payment discount is not valid. */
        INVALID_SIGNATURE,
        /** Error: Parameters are missing in a payment discount. */
        MISSING_OFFER_PARAMS,
        /**
         * Server code used when a subscription expired.
         *
         * @deprecated Validator should now return the transaction in the collection as expired.
         */
        VALIDATOR_SUBSCRIPTION_EXPIRED = 6778003
    }
    /**
     * Create an {@link IError} instance
     *
     * @internal
     */
    function storeError(code: ErrorCode, message: string, platform: Platform | null, productId: string | null): IError;
}
declare namespace CdvPurchase {
    interface IapticConfig {
        /** Default to https://validator.iaptic.com */
        url?: string;
        /** App Name */
        appName: string;
        /** Public API Key */
        apiKey: string;
    }
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
        private store;
        log: Logger;
        config: IapticConfig;
        constructor(config: IapticConfig, store?: Store);
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
        get braintreeClientTokenProvider(): Braintree.ClientTokenProvider;
        /**
         * Determine the eligibility of discounts based on the content of the application receipt.
         *
         * The secret sauce used here is to wait for validation of the application receipt.
         * The receipt validator will return the necessary data to determine eligibility.
         *
         * Receipt validation is expected to happen after loading product information, so the implementation here is to
         * wait for a validation response.
         */
        get appStoreDiscountEligibilityDeterminer(): AppleAppStore.DiscountEligibilityDeterminer;
        /** Validator URL */
        get validator(): string;
    }
}
declare namespace CdvPurchase {
    /**
     * Desired logging level for the {@link Logger}
     *
     * @see {@link Store.verbosity}
     */
    enum LogLevel {
        /** Disable all logging (default) */
        QUIET = 0,
        /** Show only error messages */
        ERROR = 1,
        /** Show warnings and errors */
        WARNING = 2,
        /** Also show information messages */
        INFO = 3,
        /** Enable internal debugging messages. */
        DEBUG = 4
    }
    /** @internal */
    interface VerbosityProvider {
        verbosity: LogLevel | boolean;
    }
    class Logger {
        /** All log lines are prefixed with this string */
        private prefix;
        /**
         * Object that provides the desired level of verbosity
         */
        private store;
        /** @internal */
        constructor(store: VerbosityProvider, prefix?: string);
        /**
         * Create a child logger, whose prefix will be this one's + the given string.
         *
         * @example
         * const log = store.log.child('AppStore')
         */
        child(prefix: string): Logger;
        /**
         * Logs an error message, only if `store.verbosity` >= store.ERROR
         */
        error(o: any): void;
        /**
         * Logs a warning message, only if `store.verbosity` >= store.WARNING
         */
        warn(o: any): void;
        /**
         * Logs an info message, only if `store.verbosity` >= store.INFO
         */
        info(o: any): void;
        /**
         * Logs a debug message, only if `store.verbosity` >= store.DEBUG
         */
        debug(o: any): void;
        /**
         * Add warning logs on a console describing an exceptions.
         *
         * This method is mostly used when executing user registered callbacks.
         *
         * @param context - a string describing why the method was called
         * @param error - a javascript Error object thrown by a exception
         */
        logCallbackException(context: string, err: Error | string): void;
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
        static console: Console;
    }
    /**
     * Interface to implement to provide custom logging facility.
     */
    interface Console {
        log(message: string): void;
        warn(message: string): void;
        error(message: string): void;
    }
}
declare namespace CdvPurchase {
    namespace Utils {
        const nonEnumerable: {
            (target: any, name: string): void;
            (target: any, name: string, desc: PropertyDescriptor): PropertyDescriptor;
        };
    }
}
declare namespace CdvPurchase {
    /** @internal */
    namespace Internal {
        /**
         * Set of function used to decorate Product objects with useful function.
         */
        interface ProductDecorator {
            /**
             * Returns true if the product is owned.
             */
            owned(product: Product): boolean;
            /**
             * Returns true if the product can be purchased.
             */
            canPurchase(product: Product): boolean;
        }
    }
    /** Product definition from a store */
    class Product {
        /** @internal */
        className: 'Product';
        /** Platform this product is available from */
        platform: Platform;
        /** Type of product (subscription, consumable, etc.) */
        type: ProductType;
        /** Product identifier on the store (unique per platform) */
        id: string;
        /** List of offers available for this product */
        offers: Offer[];
        /** Product title from the store. */
        title: string;
        /** Product full description from the store. */
        description: string;
        /**
         * Group the product is member of.
         *
         * Only 1 product of a given group can be owned. This is generally used
         * to provide different levels for subscriptions, for example: silver
         * and gold.
         *
         * Purchasing a different level will replace the previously owned one.
         */
        group?: string;
        /**
         * Shortcut to offers[0].pricingPhases[0]
         *
         * Useful when you know products have a single offer and a single pricing phase.
         */
        get pricing(): PricingPhase | undefined;
        /**
         * Returns true if the product can be purchased.
         */
        get canPurchase(): boolean;
        /**
         * Returns true if the product is owned.
         */
        get owned(): boolean;
        /** @internal */
        constructor(p: IRegisterProduct, decorator: Internal.ProductDecorator);
        /**
         * Find and return an offer for this product from its id
         *
         * If id isn't specified, returns the first offer.
         *
         * @param id - Identifier of the offer to return
         * @return An Offer or undefined if no match is found
         */
        getOffer(id?: string): Offer | undefined;
        /**
         * Add an offer to this product.
         *
         * @internal
         */
        addOffer(offer: Offer): this;
    }
}
declare namespace CdvPurchase {
    namespace Utils {
        /** Object.values() for ES6 */
        function objectValues<T>(obj: {
            [key: string]: T;
        }): T[];
    }
}
declare namespace CdvPurchase {
    namespace Utils {
        /** Returns human format name for a given platform */
        function platformName(platform: Platform): string;
    }
}
declare namespace CdvPurchase {
    /**
     * @internal
     */
    namespace Internal {
        interface ReceiptResponse {
            receipt: Receipt;
            payload: Validator.Response.Payload;
        }
        /** Queue of receipts to validate */
        class ReceiptsToValidate {
            private array;
            get length(): number;
            get(): Receipt[];
            add(receipt: Receipt): void;
            clear(): void;
            has(receipt: Receipt): boolean;
        }
        interface ValidatorController {
            validator: string | Validator.Function | Validator.Target | undefined;
            localReceipts: Receipt[];
            adapters: Adapters;
            validator_privacy_policy: PrivacyPolicyItem | PrivacyPolicyItem[] | undefined;
            getApplicationUsername(): string | undefined;
            verifiedCallbacks: Callbacks<VerifiedReceipt>;
            unverifiedCallbacks: Callbacks<UnverifiedReceipt>;
            finish(receipt: VerifiedReceipt): Promise<void>;
        }
        /** Handles communication with the remote receipt validation service */
        class Validator {
            /** List of receipts waiting for validation */
            private receiptsToValidate;
            /**  */
            private controller;
            /** Logger */
            private log;
            /** List of verified receipts */
            verifiedReceipts: VerifiedReceipt[];
            constructor(controller: ValidatorController, log: Logger);
            numRequests: number;
            numResponses: number;
            incrRequestsCounter(): void;
            incrResponsesCounter(): void;
            /** Add/update a verified receipt from the server response */
            addVerifiedReceipt(receipt: Receipt, data: Validator.Response.SuccessPayload['data']): VerifiedReceipt;
            /** Add a receipt to the validation queue. It'll get validated after a few milliseconds. */
            add(receiptOrTransaction: Receipt | Transaction): void;
            /** Run validation for all receipts in the queue */
            run(): void;
            private runOnReceipt;
            private runValidatorFunction;
            private buildRequestBody;
            /**
             * For each md5-hashed values of the validator request's ".transaction" field,
             * store the response from the server.
             *
             * This way, if a subsequent request is necessary (without a couple of minutes)
             * we just reuse the same data.
             */
            private cache;
            private removeExpiredCache;
            private runValidatorRequest;
        }
    }
}
declare namespace CdvPurchase {
    namespace PlatformOptions {
        interface Braintree {
            platform: Platform.BRAINTREE;
            options: Braintree.AdapterOptions;
        }
        interface GooglePlay {
            platform: Platform.GOOGLE_PLAY;
        }
        interface AppleAppStore {
            platform: Platform.APPLE_APPSTORE;
            options?: AppleAppStore.AdapterOptions;
        }
        interface Test {
            platform: Platform.TEST;
        }
        interface WindowsStore {
            platform: Platform.WINDOWS_STORE;
        }
    }
    /**
     * Used to initialize a platform with some options
     *
     * @see {@link Store.initialize}
     */
    type PlatformWithOptions = PlatformOptions.Braintree | PlatformOptions.AppleAppStore | PlatformOptions.GooglePlay | PlatformOptions.Test | PlatformOptions.WindowsStore;
    /** @internal */
    namespace Internal {
        interface AdapterListener {
            productsUpdated(platform: Platform, products: Product[]): void;
            receiptsUpdated(platform: Platform, receipts: Receipt[]): void;
            receiptsReady(platform: Platform): void;
        }
        /** Adapter execution context */
        interface AdapterContext {
            /** Logger */
            log: Logger;
            /** Verbosity level */
            verbosity: LogLevel;
            /** Report an Error */
            error: (error: IError) => void;
            /** List of registered products */
            registeredProducts: Internal.RegisteredProducts;
            /** The events listener */
            listener: AdapterListener;
            /** Retrieves the application username */
            getApplicationUsername: () => string | undefined;
            /** Functions used to decorate the API */
            apiDecorators: ProductDecorator & TransactionDecorator & OfferDecorator & ReceiptDecorator;
        }
        /**
         * The list of active platform adapters
         */
        class Adapters {
            /**
             * List of instantiated adapters.
             *
             * They are added to this list by "initialize()".
             */
            list: Adapter[];
            add(log: Logger, adapters: (PlatformWithOptions)[], context: AdapterContext): void;
            /**
             * Initialize some platform adapters.
             */
            initialize(platforms: (Platform | PlatformWithOptions)[], context: AdapterContext): Promise<IError[]>;
            /**
             * Retrieve a platform adapter.
             */
            find(platform: Platform): Adapter | undefined;
            /**
             * Retrieve the first platform adapter in the ready state, if any.
             *
             * You can optionally force the platform adapter you are looking for.
             *
             * Useful for methods that accept an optional "platform" argument, so they either act
             * on the only active adapter or on the one selected by the user, if it's ready.
             */
            findReady(platform?: Platform): Adapter | undefined;
        }
    }
}
declare namespace CdvPurchase {
    namespace Internal {
        interface StoreAdapterDelegate {
            approvedCallbacks: Callbacks<Transaction>;
            pendingCallbacks: Callbacks<Transaction>;
            finishedCallbacks: Callbacks<Transaction>;
            updatedCallbacks: Callbacks<Product>;
            updatedReceiptCallbacks: Callbacks<Receipt>;
            receiptsReadyCallbacks: Callbacks<void>;
        }
        /**
         * Monitor the updates for products and receipt.
         *
         * Call the callbacks when appropriate.
         */
        class StoreAdapterListener implements AdapterListener {
            delegate: StoreAdapterDelegate;
            private log;
            /** The list of supported platforms, needs to be set by "store.initialize" */
            private supportedPlatforms;
            constructor(delegate: StoreAdapterDelegate, log: Logger);
            /** Those platforms have reported that their receipts are ready */
            private platformWithReceiptsReady;
            lastTransactionState: {
                [transactionToken: string]: TransactionState;
            };
            static makeTransactionToken(transaction: Transaction): string;
            /** Store the listener's latest calling time (in ms) for a given transaction at a given state */
            lastCallTimeForState: {
                [transactionTokenWithState: string]: number;
            };
            /**
             * Set the list of supported platforms.
             *
             * Called by the store when it is initialized.
             */
            setSupportedPlatforms(platforms: Platform[]): void;
            /**
             * Trigger the "receiptsReady" event when all platforms have reported that their receipts are ready.
             *
             * This function is used by adapters to report that their receipts are ready.
             * Once all adapters have reported their receipts, the "receiptsReady" event is triggered.
             *
             * @param platform The platform that has its receipts ready.
             */
            receiptsReady(platform: Platform): void;
            /**
             * Trigger the "updated" event for each product.
             */
            productsUpdated(platform: Platform, products: Product[]): void;
            /**
             * Triggers the "approved", "pending" and "finished" events for transactions.
             *
             * - "approved" is triggered only if it hasn't been called for the same transaction in the last 5 seconds.
             * - "finished" and "pending" are triggered only if the transaction state has changed.
             *
             * @param platform The platform that has its receipts updated.
             * @param receipts The receipts that have been updated.
             */
            receiptsUpdated(platform: Platform, receipts: Receipt[]): void;
        }
    }
}
declare namespace CdvPurchase {
    namespace Internal {
        /**
         * Manage a list of callbacks
         */
        class Callbacks<T> {
            /** Type of callbacks */
            className: string;
            /** Log to the console */
            logger: Logger;
            /** List of registered callbacks */
            callbacks: {
                callback: Callback<T>;
                callbackName?: string;
            }[];
            /** If true, newly registered callbacks will be called immediately when the event was already triggered.
             *
             * Those callbacks are used to ensure the plugin has reached a given state. */
            finalStateMode: boolean;
            /** Number of times those callbacks have been triggered */
            numTriggers: number;
            /** Argument used the last time callbacks have been triggered */
            lastTriggerArgument?: T;
            /**
             * @param className - Type of callbacks (used to help with debugging)
             * @param finalStateMode - If true, newly registered callbacks will be called immediately when the event was already triggered.
             */
            constructor(logger: Logger, className: string, finalStateMode?: boolean);
            /** Add a callback to the list */
            push(callback: Callback<T>, callbackName?: string): void;
            /** Call all registered callbacks with the given value */
            trigger(value: T, reason: string): void;
            /** Remove a callback from the list */
            remove(callback: Callback<T>): void;
        }
    }
}
declare namespace CdvPurchase {
    /** @internal */
    namespace Internal {
        /**
         * Ready callbacks
         */
        class ReadyCallbacks {
            /** True when the plugin is ready */
            isReady: boolean;
            /** Callbacks when the store is ready */
            readyCallbacks: Callback<void>[];
            /** Logger */
            logger: Logger;
            constructor(logger: Logger);
            /** Register a callback to be called when the plugin is ready. */
            add(cb: Callback<void>): unknown;
            /** Calls the ready callbacks */
            trigger(reason: string): void;
            remove(cb: Callback<void>): void;
        }
    }
}
declare namespace CdvPurchase {
    /**
     * Data provided to store.register()
     */
    interface IRegisterProduct {
        /** Identifier of the product on the store */
        id: string;
        /**
         * The payment platform the product is available on.
         */
        platform: Platform;
        /** Product type, should be one of the defined product types */
        type: ProductType;
        /**
         * Name of the group your subscription product is a member of.
         *
         * If you don't set anything, all subscription will be members of the same group.
         */
        group?: string;
    }
    namespace Internal {
        class RegisteredProducts {
            list: IRegisterProduct[];
            find(platform: Platform, id: string): IRegisterProduct | undefined;
            add(product: IRegisterProduct | IRegisterProduct[]): IError[];
            byPlatform(): {
                platform: Platform;
                products: IRegisterProduct[];
            }[];
        }
    }
}
declare namespace CdvPurchase {
    /**
     * Instance of a function monitoring changes to a given transaction.
     *
     * Can be stopped with `monitor.stop()`.
     */
    interface TransactionMonitor {
        /** Stop monitoring the transaction. */
        stop(): void;
        /** Transaction being monitored. */
        transaction: Transaction;
    }
    /** @internal */
    namespace Internal {
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
            private monitors;
            private findMonitors;
            constructor(when: When);
            private callOnChange;
            /**
             * Start monitoring the provided transaction for state changes.
             */
            start(transaction: Transaction, onChange: Callback<TransactionState>): TransactionMonitor;
            stop(monitorId: string): void;
        }
    }
}
declare namespace CdvPurchase {
    namespace Internal {
        interface ReceiptsMonitorController {
            when(): When;
            hasLocalReceipts(): boolean;
            receiptsVerified(): void;
            hasValidator(): boolean;
            numValidationRequests(): number;
            numValidationResponses(): number;
            off<T>(callback: Callback<T>): void;
            log: Logger;
        }
        class ReceiptsMonitor {
            controller: ReceiptsMonitorController;
            log: Logger;
            intervalChecker?: number;
            constructor(controller: ReceiptsMonitorController);
            private hasCalledReceiptsVerified;
            callReceiptsVerified(): void;
            launch(): void;
        }
    }
}
/**
 * The platform doesn't send notifications when a subscription expires.
 *
 * However this is useful, so let's do just that.
 */
declare namespace CdvPurchase {
    namespace Internal {
        /** Data and callbacks to interface with the ExpiryMonitor */
        interface ExpiryMonitorController {
            verifiedReceipts: VerifiedReceipt[];
            /** Called when a verified purchase expires */
            onVerifiedPurchaseExpired(verifiedPurchase: VerifiedPurchase, receipt: VerifiedReceipt): void;
        }
        class ExpiryMonitor {
            /** Time between checks for newly expired subscriptions */
            static INTERVAL_MS: number;
            /**
             * Extra time until re-validating an expired subscription.
             *
             * The platform will take unspecified amount of time to report the renewal via their APIs.
             * Values below have been selected via trial-and-error, might require tweaking.
             */
            static GRACE_PERIOD_MS: {
                [platform: string]: number;
            };
            /** controller */
            controller: ExpiryMonitorController;
            /** reference to the function that runs at a given interval */
            interval?: number;
            /** Track active verified purchases */
            activePurchases: {
                [transactionId: string]: true;
            };
            /** Track notified verified purchases */
            notifiedPurchases: {
                [transactionId: string]: true;
            };
            /** Track active local transactions */
            /** Track notified local transactions */
            constructor(controller: ExpiryMonitorController);
            launch(): void;
        }
    }
}
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
declare namespace CdvPurchase {
    /**
     * Current release number of the plugin.
     */
    const PLUGIN_VERSION = "13.10.0";
    /**
     * Entry class of the plugin.
     */
    class Store {
        /**
         * Payment platform adapters.
         */
        private adapters;
        /**
         * Retrieve a platform adapter.
         *
         * The platform adapter has to have been initialized before.
         *
         * @see {@link initialize}
         */
        getAdapter(platform: Platform): Adapter | undefined;
        /**
         * List of registered products.
         *
         * Products are added to this list of products by {@link Store.register}, an internal job will defer loading to the platform adapters.
         */
        private registeredProducts;
        /** Logger */
        log: Logger;
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
        verbosity: LogLevel;
        /** Return the identifier of the user for your application */
        applicationUsername?: string | (() => string | undefined);
        /**
         * Get the application username as a string by either calling or returning {@link Store.applicationUsername}
        */
        getApplicationUsername(): string | undefined;
        /**
         * URL or implementation of the receipt validation service
         *
         * @example
         * Define the validator as a string
         * ```ts
         * CdvPurchase.store.validator = "https://validator.iaptic.com/v1/validate?appName=test"
         * ```
         *
         * @example
         * Define the validator as a function
         * ```ts
         * CdvPurchase.store.validator = (receipt, callback) => {
         *   callback({
         *     ok: true,
         *     data: {
         *       // see CdvPurchase.Validator.Response.Payload for details
         *     }
         *   })
         * }
         * ```
         *
         * @see {@link CdvPurchase.Validator.Response.Payload}
         */
        validator: string | Validator.Function | Validator.Target | undefined;
        /**
         * When adding information to receipt validation requests, those can serve different functions:
         *
         *  - handling support requests
         *  - fraud detection
         *  - analytics
         *  - tracking
         *
         * Make sure the value your select is in line with your application's privacy policy and your users' tracking preference.
         *
         * @example
         * CdvPurchase.store.validator_privacy_policy = [
         *   'fraud', 'support', 'analytics', 'tracking'
         * ]
         */
        validator_privacy_policy: PrivacyPolicyItem | PrivacyPolicyItem[] | undefined;
        /** List of callbacks for the "ready" events */
        private _readyCallbacks;
        /** Listens to adapters */
        private listener;
        /** Callbacks when a product definition was updated */
        private updatedCallbacks;
        /** Callback when a receipt was updated */
        private updatedReceiptsCallbacks;
        /** Callbacks when a product is owned */
        /** Callbacks when a transaction has been approved */
        private approvedCallbacks;
        /** Callbacks when a transaction has been finished */
        private finishedCallbacks;
        /** Callbacks when a transaction is pending */
        private pendingCallbacks;
        /** Callbacks when a receipt has been validated */
        private verifiedCallbacks;
        /** Callbacks when a receipt has been validated */
        private unverifiedCallbacks;
        /** Callbacks when all receipts have been loaded */
        private receiptsReadyCallbacks;
        /** Callbacks when all receipts have been verified */
        private receiptsVerifiedCallbacks;
        /** Callbacks for errors */
        private errorCallbacks;
        /** Internal implementation of the receipt validation service integration */
        private _validator;
        /** Monitor state changes for transactions */
        private transactionStateMonitors;
        /** Monitor subscription expiry */
        private expiryMonitor;
        constructor();
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
        register(product: IRegisterProduct | IRegisterProduct[]): void;
        private initializedHasBeenCalled;
        /**
         * Call to initialize the in-app purchase plugin.
         *
         * @param platforms - List of payment platforms to initialize, default to Store.defaultPlatform().
         */
        initialize(platforms?: (Platform | PlatformWithOptions)[]): Promise<IError[]>;
        /**
         * @deprecated - use store.initialize(), store.update() or store.restorePurchases()
         */
        refresh(): void;
        /** Stores the last time the store was updated (or initialized), to skip calls in quick succession. */
        private lastUpdate;
        /**
         * Avoid invoking store.update() if the most recent call occurred within this specific number of milliseconds.
         */
        minTimeBetweenUpdates: number;
        /**
         * Call to refresh the price of products and status of purchases.
         */
        update(): Promise<void>;
        /**
         * Register a callback to be called when the plugin is ready.
         *
         * This happens when all the platforms are initialized and their products loaded.
         */
        ready(cb: Callback<void>): void;
        /** true if the plugin is initialized and ready */
        get isReady(): boolean;
        /**
         * Setup events listener.
         *
         * @example
         * store.when()
         *      .productUpdated(product => updateUI(product))
         *      .approved(transaction => transaction.verify())
         *      .verified(receipt => receipt.finish());
         */
        when(): When;
        /**
         * Remove a callback from any listener it might have been added to.
         */
        off<T>(callback: Callback<T>): void;
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
        monitor(transaction: Transaction, onChange: Callback<TransactionState>, callbackName: string): TransactionMonitor;
        /**
         * List of all active products.
         *
         * Products are active if their details have been successfully loaded from the store.
         */
        get products(): Product[];
        /**
         * Find a product from its id and platform
         *
         * @param productId Product identifier on the platform.
         * @param platform The product the product exists in. Can be omitted if you're only using a single payment platform.
         */
        get(productId: string, platform?: Platform): Product | undefined;
        /**
         * List of all receipts present on the device.
         */
        get localReceipts(): Receipt[];
        /** List of all transaction from the local receipts. */
        get localTransactions(): Transaction[];
        /**
         * List of receipts verified with the receipt validation service.
         *
         * Those receipt contains more information and are generally more up-to-date than the local ones.
         */
        get verifiedReceipts(): VerifiedReceipt[];
        /**
         * List of all purchases from the verified receipts.
         */
        get verifiedPurchases(): VerifiedPurchase[];
        /**
         * Find the last verified purchase for a given product, from those verified by the receipt validator.
         */
        findInVerifiedReceipts(product: Product): VerifiedPurchase | undefined;
        /**
         * Find the latest transaction for a given product, from those reported by the device.
         */
        findInLocalReceipts(product: Product): Transaction | undefined;
        /** Return true if a product or offer can be purchased */
        private canPurchase;
        /**
         * Return true if a product is owned
         *
         * @param product - The product object or identifier of the product.
         */
        owned(product: {
            id: string;
            platform?: Platform;
        } | string): boolean;
        /**
         * Place an order for a given offer.
         */
        order(offer: Offer, additionalData?: AdditionalData): Promise<IError | undefined>;
        /**
         * Request a payment.
         *
         * A payment is a custom amount to charge the user. Make sure the selected payment platform
         * supports Payment Requests.
         *
         * @param paymentRequest Parameters of the payment request
         * @param additionalData Additional parameters
         */
        requestPayment(paymentRequest: PaymentRequest, additionalData?: AdditionalData): PaymentRequestPromise;
        /**
         * Returns true if a platform supports the requested functionality.
         *
         * @example
         * store.checkSupport(Platform.APPLE_APPSTORE, 'requestPayment');
         * // => false
         */
        checkSupport(platform: Platform, functionality: PlatformFunctionality): boolean;
        /**
         * Verify a receipt or transacting with the receipt validation service.
         *
         * This will be called from the Receipt or Transaction objects using the API decorators.
         */
        private verify;
        /**
         * Finalize a transaction.
         *
         * This will be called from the Receipt, Transaction or VerifiedReceipt objects using the API decorators.
         */
        private finish;
        /**
         * Replay the users transactions.
         *
         * This method exists to cover an Apple AppStore requirement.
         */
        restorePurchases(): Promise<IError | undefined>;
        /**
         * Open the subscription management interface for the selected platform.
         *
         * If platform is not specified, the first available platform will be used.
         *
         * @example
         * const activeSubscription: Purchase = // ...
         * store.manageSubscriptions(activeSubscription.platform);
         */
        manageSubscriptions(platform?: Platform): Promise<IError | undefined>;
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
        manageBilling(platform?: Platform): Promise<IError | undefined>;
        /**
         * The default payment platform to use depending on the OS.
         *
         * - on iOS: `APPLE_APPSTORE`
         * - on Android: `GOOGLE_PLAY`
         */
        defaultPlatform(): Platform;
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
        error(error: Callback<IError>): void;
        /**
         * Trigger an error event.
         *
         * @internal
         */
        triggerError(error: IError): void;
        /**
         * Version of the plugin currently installed.
         */
        version: string;
    }
    /**
     * The global store object.
     */
    let store: Store;
    /**
     * @internal
     *
     * This namespace contains things never meant for being used directly by the user of the plugin.
     */
    namespace Internal { }
}
declare function initCDVPurchase(): void;
declare namespace CdvPurchase {
    /** Callback */
    type Callback<T> = (t: T) => void;
    /** An error triggered by the In-App Purchase plugin */
    interface IError {
        /** Indicates that the returned object is an error */
        isError: true;
        /** See store.ERR_* for the available codes.
         *
         * https://github.com/j3k0/cordova-plugin-purchase/blob/master/doc/api.md#error-codes */
        code: ErrorCode;
        /** Human readable message, in plain english */
        message: string;
        /** Optional platform the error occured on */
        platform: Platform | null;
        /** Optional ID of the product the error occurred on */
        productId: string | null;
    }
    /** Types of In-App Products */
    enum ProductType {
        /** Type: An consumable product, that can be purchased multiple time */
        CONSUMABLE = "consumable",
        /** Type: A non-consumable product, that can purchased only once and the user keeps forever */
        NON_CONSUMABLE = "non consumable",
        /** @deprecated use PAID_SUBSCRIPTION */
        FREE_SUBSCRIPTION = "free subscription",
        /** Type: An auto-renewable subscription */
        PAID_SUBSCRIPTION = "paid subscription",
        /** Type: An non-renewing subscription */
        NON_RENEWING_SUBSCRIPTION = "non renewing subscription",
        /** Type: The application bundle */
        APPLICATION = "application"
    }
    /** Unit for measuring durations */
    type IPeriodUnit = "Minute" | "Hour" | "Day" | "Week" | "Month" | "Year";
    /**
     * Type of recurring payment
     *
     * - FINITE_RECURRING: Payment recurs for a fixed number of billing period set in `paymentPhase.cycles`.
     * - INFINITE_RECURRING: Payment recurs for infinite billing periods unless cancelled.
     * - NON_RECURRING: A one time charge that does not repeat.
     */
    enum RecurrenceMode {
        NON_RECURRING = "NON_RECURRING",
        FINITE_RECURRING = "FINITE_RECURRING",
        INFINITE_RECURRING = "INFINITE_RECURRING"
    }
    /**
     * Description of a phase for the pricing of a purchase.
     *
     * @see {@link Offer.pricingPhases}
     */
    interface PricingPhase {
        /** Price formatted for humans */
        price: string;
        /** Price in micro-units (divide by 1000000 to get numeric price) */
        priceMicros: number;
        /** Currency code */
        currency?: string;
        /** ISO 8601 duration of the period (https://en.wikipedia.org/wiki/ISO_8601#Durations) */
        billingPeriod?: string;
        /** Number of recurrence cycles (if recurrenceMode is FINITE_RECURRING) */
        billingCycles?: number;
        /** Type of recurring payment */
        recurrenceMode?: RecurrenceMode;
        /** Payment mode for the pricing phase ("PayAsYouGo", "UpFront", or "FreeTrial") */
        paymentMode?: PaymentMode;
    }
    /** Mode of payment */
    enum PaymentMode {
        /** Used for subscriptions, pay at the beginning of each billing period */
        PAY_AS_YOU_GO = "PayAsYouGo",
        /** Pay the whole amount up front */
        UP_FRONT = "UpFront",
        /** Nothing to be paid */
        FREE_TRIAL = "FreeTrial"
    }
    /** Adapter for a payment or in-app purchase platform */
    interface Adapter {
        /**
         * Platform identifier
         */
        id: Platform;
        /**
         * Nice name for the adapter
         */
        name: string;
        /**
         * true after the platform has been successfully initialized.
         *
         * The value is set by the "Adapters" class (which is responsible for initializing adapters).
         */
        ready: boolean;
        /**
         * List of products managed by the adapter.
         */
        products: Product[];
        /**
         * List of purchase receipts.
         */
        receipts: Receipt[];
        /**
         * Returns true is the adapter is supported on this device.
         */
        isSupported: boolean;
        /**
         * Initializes a platform adapter.
         *
         * Will resolve when initialization is complete.
         *
         * Will fail with an `IError` in case of an unrecoverable error.
         *
         * In other case of a potentially recoverable error, the adapter will keep retrying to initialize forever.
         */
        initialize(): Promise<undefined | IError>;
        /**
         * Load product definitions from the platform.
         */
        loadProducts(products: IRegisterProduct[]): Promise<(Product | IError)[]>;
        /**
         * Load the receipts
         */
        loadReceipts(): Promise<Receipt[]>;
        /**
         * Set to true if receipts and products can be loaded in parallel
         */
        supportsParallelLoading: boolean;
        /**
         * Initializes an order.
         */
        order(offer: Offer, additionalData: AdditionalData): Promise<undefined | IError>;
        /**
         * Finish a transaction.
         *
         * For non-consumables, this will acknowledge the purchase.
         * For consumable, this will acknowledge and consume the purchase.
         */
        finish(transaction: Transaction): Promise<IError | undefined>;
        /**
         * Prepare for receipt validation
         */
        receiptValidationBody(receipt: Receipt): Promise<Validator.Request.Body | undefined>;
        /**
         * Handle platform specific fields from receipt validation response.
         */
        handleReceiptValidationResponse(receipt: Receipt, response: Validator.Response.Payload): Promise<void>;
        /**
         * Request a payment from the user
         */
        requestPayment(payment: PaymentRequest, additionalData?: AdditionalData): Promise<IError | Transaction | undefined>;
        /**
         * Open the platforms' subscription management interface.
         */
        manageSubscriptions(): Promise<IError | undefined>;
        /**
         * Open the platforms' billing management interface.
         */
        manageBilling(): Promise<IError | undefined>;
        /**
         * Returns true if the platform supports the given functionality.
         */
        checkSupport(functionality: PlatformFunctionality): boolean;
        /**
         * Replay the queue of transactions.
         *
         * Might ask the user to login.
         */
        restorePurchases(): Promise<IError | undefined>;
    }
    /**
     * Data to attach to a transaction.
     *
     * @see {@link Offer.order}
     * @see {@link Store.requestPayment}
     */
    interface AdditionalData {
        /** The application's user identifier, will be obfuscated with md5 to fill `accountId` if necessary */
        applicationUsername?: string;
        /** GooglePlay specific additional data */
        googlePlay?: GooglePlay.AdditionalData;
        /** Braintree specific additional data */
        braintree?: Braintree.AdditionalData;
        /** Apple AppStore specific additional data */
        appStore?: AppleAppStore.AdditionalData;
    }
    /**
     * Purchase platforms supported by the plugin
     */
    enum Platform {
        /** Apple AppStore */
        APPLE_APPSTORE = "ios-appstore",
        /** Google Play */
        GOOGLE_PLAY = "android-playstore",
        /** Windows Store */
        WINDOWS_STORE = "windows-store-transaction",
        /** Braintree */
        BRAINTREE = "braintree",
        /** Test platform */
        TEST = "test"
    }
    /**
     * Functionality optionality provided by a given platform.
     *
     * @see {@link Store.checkSupport}
     */
    type PlatformFunctionality = 'requestPayment' | 'order' | 'manageSubscriptions' | 'manageBilling';
    /** Possible states of a product */
    enum TransactionState {
        INITIATED = "initiated",
        PENDING = "pending",
        APPROVED = "approved",
        CANCELLED = "cancelled",
        FINISHED = "finished",
        UNKNOWN_STATE = ""
    }
    type PrivacyPolicyItem = 'fraud' | 'support' | 'analytics' | 'tracking';
    /** Store events listener */
    interface When {
        /**
         * Register a function called when a product or receipt is updated.
         *
         * @deprecated - Use `productUpdated` or `receiptUpdated`.
         */
        updated(cb: Callback<Product | Receipt>, callbackName?: string): When;
        /** Register a function called when a receipt is updated. */
        receiptUpdated(cb: Callback<Receipt>, callbackName?: string): When;
        /** Register a function called when a product is updated. */
        productUpdated(cb: Callback<Product>, callbackName?: string): When;
        /** Register a function called when transaction is approved. */
        approved(cb: Callback<Transaction>, callbackName?: string): When;
        /** Register a function called when transaction is pending. */
        pending(cb: Callback<Transaction>, callbackName?: string): When;
        /** Register a function called when a transaction is finished. */
        finished(cb: Callback<Transaction>, callbackName?: string): When;
        /** Register a function called when a receipt is verified. */
        verified(cb: Callback<VerifiedReceipt>, callbackName?: string): When;
        /** Register a function called when a receipt failed validation. */
        unverified(cb: Callback<UnverifiedReceipt>, callbackName?: string): When;
        /**
         * Register a function called when all receipts have been loaded.
         *
         * This handler is called only once. Use this when you want to run some code at startup after
         * all the local receipts have been loaded, for example to process the initial ownership status
         * of your products. When you have a receipt validation server in place, a better option is to
         * use the sister method "receiptsVerified".
         *
         * If no platforms have any receipts (the user made no purchase), this will also get called.
         */
        receiptsReady(cb: Callback<void>, callbackName?: string): When;
        /**
         * Register a function called when all receipts have been verified.
         *
         * If no platforms have any receipts (user made no purchase), this will also get called.
         */
        receiptsVerified(cb: Callback<void>, callbackName?: string): When;
    }
    /** Whether or not the user intends to let the subscription auto-renew. */
    enum RenewalIntent {
        /** The user intends to let the subscription expire without renewing. */
        LAPSE = "Lapse",
        /** The user intends to renew the subscription. */
        RENEW = "Renew"
    }
    /** Whether or not the user was notified or agreed to a price change */
    enum PriceConsentStatus {
        NOTIFIED = "Notified",
        AGREED = "Agreed"
    }
    /** Reason why a subscription has been canceled */
    enum CancelationReason {
        /** Not canceled */
        NOT_CANCELED = "",
        /** Subscription canceled by the developer. */
        DEVELOPER = "Developer",
        /** Subscription canceled by the system for an unspecified reason. */
        SYSTEM = "System",
        /** Subscription upgraded or downgraded to a new subscription. */
        SYSTEM_REPLACED = "System.Replaced",
        /** Product not available for purchase at the time of renewal. */
        SYSTEM_PRODUCT_UNAVAILABLE = "System.ProductUnavailable",
        /** Billing error; for example customer’s payment information is no longer valid. */
        SYSTEM_BILLING_ERROR = "System.BillingError",
        /** Transaction is gone; It has been deleted. */
        SYSTEM_DELETED = "System.Deleted",
        /** Subscription canceled by the user for an unspecified reason. */
        CUSTOMER = "Customer",
        /** Customer canceled their transaction due to an actual or perceived issue within your app. */
        CUSTOMER_TECHNICAL_ISSUES = "Customer.TechnicalIssues",
        /** Customer did not agree to a recent price increase. See also priceConsentStatus. */
        CUSTOMER_PRICE_INCREASE = "Customer.PriceIncrease",
        /** Customer canceled for cost-related reasons. */
        CUSTOMER_COST = "Customer.Cost",
        /** Customer claimed to have found a better app. */
        CUSTOMER_FOUND_BETTER_APP = "Customer.FoundBetterApp",
        /** Customer did not feel he is using this service enough. */
        CUSTOMER_NOT_USEFUL_ENOUGH = "Customer.NotUsefulEnough",
        /** Subscription canceled for another reason; for example, if the customer made the purchase accidentally. */
        CUSTOMER_OTHER_REASON = "Customer.OtherReason",
        /** Subscription canceled for unknown reasons. */
        UNKNOWN = "Unknown"
    }
}
declare namespace CdvPurchase {
    /** @internal */
    namespace Internal {
        interface OfferDecorator {
            /**
             * Initiate a purchase for the provided offer.
             */
            order(offer: Offer, additionalData?: AdditionalData): Promise<IError | undefined>;
            /**
             * Returns true if the offer can be purchased.
             */
            canPurchase(offer: Offer): boolean;
        }
    }
    /**
     * One of the available offers to purchase a given product
     */
    class Offer {
        /** className, used to make sure we're passing an actual instance of the "Offer" class. */
        private className;
        /** Offer identifier */
        id: string;
        /** Identifier of the product related to this offer */
        get productId(): string;
        /** Type of the product related to this offer */
        get productType(): ProductType;
        /** Group the product related to this offer is member of */
        get productGroup(): string | undefined;
        /** Platform this offer is available from */
        get platform(): Platform;
        /** Pricing phases */
        pricingPhases: PricingPhase[];
        /**
         * Initiate a purchase of this offer.
         *
         * @example
         * store.get("my-product").getOffer().order();
         */
        order(additionalData?: AdditionalData): Promise<IError | undefined>;
        /**
         * true if the offer can be purchased.
         */
        get canPurchase(): boolean;
        /** @internal */
        constructor(options: {
            id: string;
            product: Product;
            pricingPhases: PricingPhase[];
        }, decorator: Internal.OfferDecorator);
    }
}
declare namespace CdvPurchase {
    class PaymentRequestPromise {
        private failedCallbacks;
        failed(callback: Callback<IError>): PaymentRequestPromise;
        private initiatedCallbacks;
        initiated(callback: Callback<Transaction>): PaymentRequestPromise;
        private approvedCallbacks;
        approved(callback: Callback<Transaction>): PaymentRequestPromise;
        private finishedCallbacks;
        finished(callback: Callback<Transaction>): PaymentRequestPromise;
        private cancelledCallback;
        cancelled(callback: Callback<void>): PaymentRequestPromise;
        /** @internal */
        trigger(argument?: IError | Transaction): PaymentRequestPromise;
        /**
         * Return a failed promise.
         *
         * @internal
         */
        static failed(code: ErrorCode, message: string, platform: Platform | null, productId: string | null): PaymentRequestPromise;
        /**
         * Return a failed promise.
         *
         * @internal
         */
        static cancelled(): PaymentRequestPromise;
        /**
         * Return an initiated transaction.
         *
         * @internal
         */
        static initiated(transaction: Transaction): PaymentRequestPromise;
    }
    /**
     * Item being purchased with `requestPayment`
     *
     * The format is such as it's compatible with `Product`. This way, normal products can be added to
     * the payment request.
     */
    interface PaymentRequestItem {
        /** Identifier */
        id: string;
        /** Label for the item */
        title: string;
        /** Item pricing information.
         *
         * It can be undefined if a single product is purchased. If that case, it's assumed the price
         * is equal to the total amount requested. */
        pricing?: {
            /** Price in micro units (i.e. price * 1,000,000) */
            priceMicros: number;
            /** Currency, for verification, if set it should be equal to the PaymentRequest currency */
            currency?: string;
        };
    }
    /**
     * Request for payment.
     *
     * Use with {@link Store.requestPayment} to initiate a payment for a given amount.
     *
     * @example
     *  const {store, Platform, ErrorCode} = CdvPurchase;
     *  store.requestPayment({
     *    platform: Platform.BRAINTREE,
     *    items: [{
     *      id: 'margherita_large',
     *      title: 'Pizza Margherita Large',
     *      pricing: {
     *        priceMicros: 9990000,
     *      }
     *    }, {
     *      id: 'delivery_standard',
     *      title: 'Delivery',
     *      pricing: {
     *        priceMicros: 2000000,
     *      }
     *    }]
     *    amountMicros: 11990000,
     *    currency: 'USD',
     *    description: 'This this the description of the payment request',
     *  })
     *  .cancelled(() => { // user cancelled by closing the window
     *  })
     *  .failed(error => { // payment request failed
     *  })
     *  .initiated(transaction => { // transaction initiated
     *  })
     *  .approved(transaction => { // transaction approved
     *  })
     *  .finished(transaction => { // transaction finished
     *  });
     */
    interface PaymentRequest {
        /**
         * Products being purchased.
         *
         * They do not have to be products registered with the plugin, but they can be.
         */
        items: (PaymentRequestItem | undefined)[];
        /**
         * Platform that will handle the payment request.
         */
        platform: Platform;
        /**
         * Amount to pay.
         *
         * Default to the sum of all items.
         */
        amountMicros?: number;
        /**
         * Currency.
         *
         * Some payment platforms only support one currency thus do not require this field.
         *
         * Default to the currency of the items.
         */
        currency?: string;
        /**
         * Description for the payment.
         */
        description?: string;
        /** The email used for verification. Optional. */
        email?: string;
        /**
         * The mobile phone number used for verification. Optional.
         *
         * Only numbers. Remove dashes, parentheses and other characters.
         */
        mobilePhoneNumber?: string;
        /** The billing address used for verification. Optional. */
        billingAddress?: PostalAddress;
    }
    /**
     * Postal address for payment requests.
     */
    interface PostalAddress {
        /** Given name associated with the address. */
        givenName?: string;
        /** Surname associated with the address. */
        surname?: string;
        /** Line 1 of the Address (eg. number, street, etc) */
        streetAddress1?: string;
        /** Line 2 of the Address (eg. suite, apt #, etc.) */
        streetAddress2?: string;
        /** Line 3 of the Address (eg. suite, apt #, etc.) */
        streetAddress3?: string;
        /** City name */
        locality?: string;
        /** Either a two-letter state code (for the US), or an ISO-3166-2 country subdivision code of up to three letters. */
        region?: string;
        /**
         * Zip code or equivalent is usually required for countries that have them.
         *
         * For a list of countries that do not have postal codes please refer to http://en.wikipedia.org/wiki/Postal_code
         */
        postalCode?: string;
        /**
         * The phone number associated with the address
         *
         * Note: Only numbers. Remove dashes, parentheses and other characters
         */
        phoneNumber?: string;
        /**
         * 2 letter country code
         */
        countryCode?: string;
    }
}
declare namespace CdvPurchase {
    /** @internal */
    namespace Internal {
        interface ReceiptDecorator {
            verify(receipt: Receipt): Promise<void>;
            finish(receipt: Receipt): Promise<void>;
        }
    }
    class Receipt {
        /** @internal */
        className: 'Receipt';
        /** Platform that generated the receipt */
        platform: Platform;
        /** List of transactions contained in the receipt, ordered by date ascending. */
        transactions: Transaction[];
        /** Verify a receipt */
        verify(): Promise<void>;
        /** Finish all transactions in a receipt */
        finish(): Promise<void>;
        /** @internal */
        constructor(platform: Platform, decorator: Internal.ReceiptDecorator);
        /** Return true if the receipt contains the given transaction */
        hasTransaction(value: Transaction): boolean;
        /** Return the last transaction in this receipt */
        lastTransaction(): Transaction;
    }
}
declare namespace CdvPurchase {
    /** @internal */
    namespace Internal {
        /**
         * Set of function used to provide a nicer API (or more backward compatible)
         */
        interface TransactionDecorator {
            finish(transaction: Transaction): Promise<void>;
            verify(transaction: Transaction): Promise<void>;
        }
    }
    /**
     * Transaction as reported by the device
     *
     * @see {@link Receipt}
     * @see {@link store.localTransactions}
     */
    class Transaction {
        /** @internal */
        className: 'Transaction';
        /** Platform this transaction was created on */
        platform: Platform;
        /** Transaction identifier. */
        transactionId: string;
        /** Identifier for the purchase this transaction is a part of. */
        purchaseId?: string;
        /**
         * Time the purchase was made.
         *
         * For subscriptions this is equal to the date of the first transaction.
         * Note that it might be undefined for deleted transactions (google for instance don't provide any info in that case).
         */
        purchaseDate?: Date;
        /** Time a subscription was last renewed */
        lastRenewalDate?: Date;
        /** Time when the subscription is set to expire following this transaction */
        expirationDate?: Date;
        /** True when the transaction has been acknowledged to the platform. */
        isAcknowledged?: boolean;
        /** True when the transaction is still pending payment. */
        isPending?: boolean;
        /** True when the transaction was consumed. */
        isConsumed?: boolean;
        /** Is the subscription set to renew. */
        renewalIntent?: RenewalIntent;
        /** Time when the renewal intent was changed */
        renewalIntentChangeDate?: Date;
        /** State this transaction is in */
        state: TransactionState;
        /** Amount paid by the user, if known, in micro units. Divide by 1,000,000 for value. */
        amountMicros?: number;
        /** Currency used to pay for the transaction, if known. */
        currency?: string;
        /** Purchased products */
        products: {
            /** Product identifier */
            id: string;
            /** Offer identifier, if known */
            offerId?: string;
        }[];
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
        finish(): Promise<void>;
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
        verify(): Promise<void>;
        /**
         * Return the receipt this transaction is part of.
         */
        get parentReceipt(): Receipt;
        /** @internal */
        constructor(platform: Platform, parentReceipt: Receipt, decorator: Internal.TransactionDecorator);
    }
}
declare namespace CdvPurchase {
    namespace Internal {
        /** Analyze the list of local receipts. */
        class LocalReceipts {
            /**
             * Find the latest transaction for a given product, from those reported by the device.
             */
            static find(localReceipts: Receipt[], product?: {
                id: string;
                platform?: Platform;
            }): Transaction | undefined;
            /** Return true if a product is owned */
            static isOwned(localReceipts: Receipt[], product?: {
                id: string;
                platform?: Platform;
            }): boolean;
            static canPurchase(localReceipts: Receipt[], product?: {
                id: string;
                platform?: Platform;
            }): boolean;
        }
    }
}
declare namespace CdvPurchase {
    namespace Internal {
        /** Options for the {@link owned} function */
        interface OwnedOptions {
            product: {
                id: string;
                platform?: Platform;
            };
            verifiedReceipts?: VerifiedReceipt[];
            localReceipts?: Receipt[];
        }
        /**
         * Return true if a product is owned.
         *
         * Will use the list of verified receipts if provided.
         * Will only use the list of local receipts if verifiedReceipt is undefined.
         */
        function owned(options: OwnedOptions): boolean;
    }
}
declare namespace CdvPurchase {
    namespace Internal {
        class PromiseLike<T> {
            resolved: boolean;
            resolvedArgument?: T;
            /** List of registered callbacks */
            callbacks: Callback<T>[];
            /** Add a callback to the list */
            push(callback: Callback<T>): void;
            /** Call all registered callbacks with the given value */
            resolve(value: T): void;
        }
    }
}
declare namespace CdvPurchase {
    namespace Internal {
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
        class Retry<F extends Function = Function> {
            maxTimeout: number;
            minTimeout: number;
            retryTimeout: number;
            retries: {
                tid: number;
                fn: F;
            }[];
            constructor(minTimeout?: number, maxTimeout?: number);
            retry(fn: F): void;
        }
    }
}
declare namespace CdvPurchase {
    namespace Internal {
        /** Analyze the list of local receipts. */
        class VerifiedReceipts {
            /**
             * Find the last verified purchase for a given product, from those verified by the receipt validator.
             */
            static find(verifiedReceipts: VerifiedReceipt[], product?: {
                id: string;
                platform?: Platform;
            }): VerifiedPurchase | undefined;
            /** Return true if a product is owned, based on the content of the list of verified receipts  */
            static isOwned(verifiedReceipts: VerifiedReceipt[], product?: {
                id: string;
                platform?: Platform;
            }): boolean;
            static getVerifiedPurchases(verifiedReceipts: VerifiedReceipt[]): VerifiedPurchase[];
        }
    }
}
declare namespace CdvPurchase {
    /**
     * Define types for ApplePay
     *
     * At the moment Apple Pay is only supported as an extension for Braintree.
     */
    namespace ApplePay {
        /**
         * Request for payment with Apple Pay.
         *
         * Including information about payment processing capabilities, the payment amount, and shipping information.
         *
         * Details here: {@link https://developer.apple.com/documentation/passkit/pkpaymentrequest/}
         */
        interface PaymentRequest {
            /**
             * Apple Pay Merchant ID
             *
             * When using Braintree, this field is automatically populated.
             *
             * This value must match one of the merchant identifiers specified by the Merchant IDs Entitlement
             * key in the app’s entitlements.
             *
             * For more information on adding merchant IDs, see Configure Apple Pay (iOS, watchOS).
             */
            merchantIdentifier?: string;
            /**
             * Payment processing protocols and card types that you support.
             *
             * ### Discussion
             *
             * The "ThreeDS" and "EMV" values of ApplePayMerchantCapability specify the supported
             * cryptographic payment protocols. At least one of these two values is required.
             *
             * Check with your payment processors about the cryptographic payment protocols they support.
             * As a general rule, if you want to support China UnionPay cards, you use EMV.
             *
             * To support cards from other networks—like American Express, Visa, or Mastercard—use ThreeDS.
             *
             * To filter the types of cards to make available for the transaction, pass the "Credit"
             * and "Debit" values. If neither is passed, all card types will be available.
             */
            merchantCapabilities: MerchantCapability[];
            /**
             * The three-letter ISO 4217 currency code that determines the currency this payment request uses.
             *
             * When using Braintree, this field is automatically populated.
             */
            currencyCode?: string;
            /**
             * A list of ISO 3166 country codes to limit payments to cards from specific countries or regions.
             */
            supportedCountries?: string[];
            /**
             * The merchant’s two-letter ISO 3166 country code.
             *
             * When using Braintree, this field is automatically populated.
             */
            countryCode?: string;
            /**
             * An array of payment summary item objects that summarize the amount of the payment.
             *
             * Discussion
             *
             * A typical transaction includes separate summary items for the order total, shipping cost, tax, and the grand total.
             *
             * Apple Pay uses the last item in the paymentSummaryItems array as the grand total for the purchase shown in Listing 1. The PKPaymentAuthorizationViewController class displays this item differently than the rest of the summary items. As a result, there are additional requirements placed on both its amount and its label.
             *
             * - Set the grand total amount to the sum of all the other items in the array. This amount must be greater than or equal to zero.
             * - Set the grand total label to the name of your company. This label represents the person or company receiving payment.
             *
             * Your payment processor might have additional requirements, such as a minimum or maximum payment amount.
             *
             * In iOS 15 and later you can create three different types of payment summary items:
             *
             * - Use a PaymentSummaryItem for an immediate payment.
             * - Use a DeferredPaymentSummaryItem for a payment that occurs in the future, such as a pre-order.
             * - Use a RecurringPaymentSummaryItem for a payment that occurs more than once, such as a subscription.
             *
             * Note
             * In versions of iOS prior to version 12.0 and watchOS prior to version 5.0, the amount of the grand total must be greater than zero.
             */
            paymentSummaryItems?: PaymentSummaryItem[];
            /**
             * The payment methods that you support.
             *
             * When using Braintree, this field is automatically populated (so the value is not used).
             *
             * ### Discussion
             *
             * This property constrains the payment methods that the user can select to fund the payment.
             * For possible values, see ApplePayPaymentNetwork.
             *
             * In macOS 12.3, iOS 15.4, watchOS 8.5, and Mac Catalyst 15.4 or later, specify payment
             * methods in the order you prefer.
             *
             * For example, to specify the default network to use for cobadged cards, set the first element
             * in the array to the default network, and alternate networks afterward in the order you
             * prefer.
             *
             * ### Note
             *
             * Apps supporting debit networks should check for regional regulations. For more information, see Complying with Regional Regulations.
             */
            supportedNetworks?: PaymentNetwork[];
            /**
             * Prepopulated billing address.
             *
             * If you have an up-to-date billing address on file, you can set it here.
             * This billing address appears in the payment sheet.
             * The user can either use the address you specify or select a different address.
             *
             * Note that a Contact object that represents a billing contact contains information for
             * only the postalAddress property. All other properties in the object are undefined.
             */
            billingContact?: Contact;
            /**
             * Prepopulated shipping address.
             *
             * If you have an up-to-date shipping address on file, you can set this property to that address.
             * This shipping address appears in the payment sheet.
             * When the view is presented, the user can either keep the address you specified
             * or enter a different address.
             *
             * Note that a Contact object that represents a shipping contact contains information for
             * only the postalAddress, emailAddress, and phoneNumber properties.
             * All other properties in the object are undefined.
             */
            shippingContact?: Contact;
            /** A list of fields that you need for a billing contact in order to process the transaction. */
            requiredBillingContactFields?: ContactField[];
            /** A list of fields that you need for a shipping contact in order to process the transaction. */
            requiredShippingContactFields?: ContactField[];
            /**
             * The initial coupon code for the payment request.
             *
             * Set the value to undefined or the empty string to indicate that there’s no initial coupon.
             */
            couponCode?: string;
            /**
             * A Boolean value that determines whether the payment sheet displays the coupon code field.
             *
             * Set the value to true to display the coupon code field.
             */
            supportsCouponCode?: boolean;
            /** List of supported shipping methods for the user to chose from.
             *
             * @example
             * paymentRequest.shippingMethods = [{
             *   label: "Free Shipping",
             *   amount: "0.00",
             *   identifier: "free",
             *   detail: "Arrive by July 2"
             * }, {
             *   label: "Standard Shipping",
             *   amount: "3.29",
             *   identifier: "standard",
             *   detail: "Arrive by June 29"
             * }, {
             *   label: "Express Shipping",
             *   amount: "24.69",
             *   identifier: "express",
             *   detail: "Ships withing 24h"
             * }];
             */
            shippingMethods?: ShippingMethod[];
        }
        /**
         * Summary item in a payment request—for example, total, tax, discount, or grand total.
         *
         * @see {@link https://developer.apple.com/documentation/passkit/pkpaymentrequest/1619231-paymentsummaryitems}
         */
        interface PaymentSummaryItem {
            /** Short, localized description of the item. */
            label: string;
            /**
             * Summary item’s amount.
             *
             * The amount’s currency is specified at the payment level by setting a
             * value for the currencyCode property on the request.
             */
            amount: string;
            /** Type that indicates whether the amount is final. */
            type?: SummaryItemType;
        }
        /**
         * An object that defines a summary item for a payment that’s charged at a later date, such as a pre-order.
         */
        interface DeferredPaymentSummaryItem extends PaymentSummaryItem {
            /**
             * The date, in the future, of the payment.
             *
             * In milliseconds since epoch.
             */
            deferredDate?: number;
        }
        /**
         * An object that defines a summary item for a payment that occurs repeatedly at a specified interval, such as a subscription.
         *
         * RecurringPaymentSummaryItem is a subclass of PaymentSummaryItemType and inherits all properties of the parent class.
         *
         * Add a summary item of this type to the paymentSummaryItems property of a PaymentRequest to display to the user a recurring payment in the summary items on the payment sheet.
         *
         * To describe a recurring payment, set the summary item values as follows:
         * - In the amount property, provide the billing amount for the set interval, for example, the amount charged per week if the intervalUnit is a week.
         * - Omit the type property. The summary item type is only relevant for the PKPaymentSummaryItem parent class.
         * - Set the startDate and endDate to represent the term for the recurring payments, as appropriate.
         * - Set the intervalUnit, intervalCount, and endDate to specify a number of repeating payments.
         */
        interface RecurringPaymentSummaryItem extends PaymentSummaryItem {
            /**
             * The date of the first payment. The default value is undefined which requests the first payment as part of the initial transaction.
             *
             * In milliseconds since epoch.
             */
            startDate?: number;
            /**
             * The date of the final payment. The default value is nil which specifies no end date.
             *
             * In milliseconds since epoch.
             */
            endDate?: number;
            /**
             * The amount of time – in calendar units such as day, month, or year – that represents a fraction of the total payment interval.
             *
             * Note. "Week" is not supported.
             */
            intervalUnit: IPeriodUnit;
            /** The number of interval units that make up the total payment interval. */
            intervalCount: number;
        }
        type SummaryItemType = "final" | "pending";
        /** Shipping method for delivering physical goods. */
        interface ShippingMethod extends PaymentSummaryItem {
            /** A unique identifier for the shipping method, used by the app. */
            identifier?: string;
            /** A user - readable description of the shipping method. */
            detail?: string;
        }
        /** The fields that describe a contact. */
        enum ContactField {
            Name = "name",
            EmailAddress = "emailAddress",
            PhoneNumber = "phoneNumber",
            PostalAddress = "postalAddress",
            PhoneticName = "phoneticName"
        }
        interface Contact {
            /** Contact's name. */
            name?: string;
            /** Contact's email address. */
            emailAddress?: string;
            /** Contact's telephone number. */
            phoneNumber?: string;
            /** The contact’s full street address including name, street, city, state or province, postal code, and country or region */
            postalAddress?: PostalAddress;
            /**
             * Contact’s sublocality, or undefined if the sublocality is not needed for the transaction.
             *
             * @deprecated
             */
            supplementarySubLocality?: string;
        }
        /** Postal address for a contact. */
        interface PostalAddress {
            /** The street name in a postal address. */
            street?: string;
            /** The city name in a postal address. */
            city?: string;
            /** The state name in a postal address. */
            state?: string;
            /** The postal code in a postal address. */
            postalCode?: string;
            /** The country or region name in a postal address. */
            country?: string;
            /** The ISO country code for the country or region in a postal address, using the ISO 3166-1 alpha-2 standard. */
            ISOCountryCode?: string;
            /** The subadministrative area (such as a county or other region) in a postal address. */
            subAdministrativeArea?: string;
            /** Additional information associated with the location, typically defined at the city or town level, in a postal address. */
            subLocality?: string;
        }
        /** A type that represents a payment method. */
        enum PaymentNetwork {
            /** An American Express payment card. */
            Amex = "Amex",
            /** A QR code used for payment. */
            Barcode = "Barcode",
            /** A Cartes Bancaires payment card. */
            CartesBancaires = "CartesBancaires",
            /** A China Union Pay payment card. */
            ChinaUnionPay = "ChinaUnionPay",
            /** The Dankort payment card. */
            Dankort = "Dankort",
            /** A Discover payment card. */
            Discover = "Discover",
            /** The electronic funds transfer at point of sale (EFTPOS) payment method. */
            Eftpos = "Eftpos",
            /** An Electron debit card. */
            Electron = "Electron",
            /** The Elo payment card. */
            Elo = "Elo",
            /** A Girocard payment method. */
            Girocard = "Girocard",
            /** An iD payment card. */
            IDCredit = "IDCredit",
            /** The Interac payment method. */
            Interac = "Interac",
            /** A JCB payment card. */
            JCB = "JCB",
            /** A mada payment card. */
            Mada = "Mada",
            /** A Maestro payment card. */
            Maestro = "Maestro",
            /** A MasterCard payment card. */
            MasterCard = "MasterCard",
            /** A Mir payment card. */
            Mir = "Mir",
            /** A Nanaco payment card. */
            Nanaco = "Nanaco",
            /** Store credit and debit cards. */
            PrivateLabel = "PrivateLabel",
            /** A QUICPay payment card. */
            QuicPay = "QuicPay",
            /** A Suica payment card. */
            Suica = "Suica",
            /** A Visa payment card. */
            Visa = "Visa",
            /** A Visa V Pay payment card. */
            VPay = "VPay",
            /** A WAON payment card. */
            Waon = "Waon"
        }
        /** Capabilities for processing payment. */
        enum MerchantCapability {
            /** Support for the 3-D Secure protocol. */
            ThreeDS = "3DS",
            /** Support for the EMV protocol. */
            EMV = "EMV",
            /** Support for credit cards. */
            Credit = "Credit",
            /** Support for debit cards. */
            Debit = "Debit"
        }
        interface PaymentMethod {
            /**
             * A string, suitable for display, that describes the card.
             *
             * ### Discussion
             *
             * The display name enables a user to recognize a particular card from a list of cards.
             *
             * For debit and credit cards, the display name often includes the card brand and the
             * last four digits of the credit card number when available, for example: “Visa 1233”,
             * “MasterCard 5678”, “AmEx 9876”. For Apple Pay Cash cards, the display name is “Apple Pay Cash”.
             * However, there is no standard format for the display name’s content.
             *
             * To protect the user’s privacy, Apple Pay sets the display name only after the user
             * authorizes the purchase. You can safely access this property as soon as the system calls
             * your delegate’s paymentAuthorizationController:didAuthorizePayment:completion: method.
             */
            displayName: string;
            /**
             * A string, suitable for display, that describes the payment network for the card.
             *
             * @see {@link https://developer.apple.com/documentation/passkit/pkpaymentnetwork?language=objc}
             */
            network: string;
            /** A value that represents the card’s type. */
            type: PaymentMethodType;
            /**
             * The accompanying Secure Element pass.
             *
             * ### Discussion
             *
             * If your app has an association with the pass that is funding the payment, this property contains
             * information about that pass; otherwise, it’s undefined.
             *
             * Use this property to detect your brand of credit and debit cards.
             * For example, you can provide a discount if the user pays using your store-branded credit card.
             *
             * ### Note
             *
             * To be able to access the pass, the issuer must add your App ID to the pass when it provisions it.
             * To add your App ID to these passes, contact the bank that issues your cards or the person who
             * manages your cobrand program.
             */
            secureElementPass?: SecureElementPass;
            billingAddress?: CNContact;
        }
        /**
         * An object that stores information about a single contact, such as the contact's first name, phone numbers, and addresses.
         */
        interface CNContact {
            /** the contact type. */
            contactType?: "Person" | "Organization";
            /**
             * A value that uniquely identifies a contact on the device.
             *
             * It is recommended that you use the identifier when re-fetching the contact.
             * An identifier can be persisted between the app launches. Note that this identifier only
             * uniquely identifies the contact on the current device.
             */
            identifier?: string;
            /**
             * The name prefix of the contact.
             */
            namePrefix?: string;
            /**
             * The given name of the contact.
             *
             * The given name is often known as the first name of the contact.
             */
            givenName?: string;
            /** The middle name of the contact. */
            middleName?: string;
            /**
             * A string for the previous family name of the contact.
             *
             * The previous family name is often known as the maiden name of the contact.
             */
            previousFamilyName?: string;
            /**
             * The name suffix of the contact.
             */
            nameSuffix?: string;
            /** Nickname */
            nickname?: string;
            /** The name of the organization associated with the contact. */
            organizationName?: string;
            /** The name of the department associated with the contact. */
            departmentName?: string;
            /** The contact’s job title. */
            jobTitle?: string;
            /** A string containing notes for the contact. */
            note?: string;
            /** An array of phone numbers for a contact. */
            phoneNumbers?: string[];
            /** An array of email addresses for the contact. */
            emailAddresses?: string[];
            /** An array of URL addresses for a contact. */
            urlAddresses?: string[];
            phoneticGivenName?: string;
            phoneticMiddleName?: string;
            phoneticFamilyName?: string;
            phoneticOrganizationName?: string;
        }
        /**
         * A pass with a credential that the device stores in a certified payment information chip.
         *
         * THIS IS NOT SUPPORTED WITH BRAINTREE AT THE MOMENT.
         */
        interface SecureElementPass {
        }
        /**
         * @see {@link https://developer.apple.com/documentation/passkit/pkpaymentmethodtype?language=objc}
         */
        type PaymentMethodType = "Unknown" | "Debit" | "Credit" | "Prepaid" | "Store" | "EMoney";
        interface PaymentToken {
            /**
             * A unique identifier for this payment.
             *
             * This identifier is suitable for use in a receipt.
             */
            transactionIdentifier: string;
            /** Information about the card used in the transaction. */
            paymentMethod: PaymentMethod;
            /**
             * Base64 encoded UTF-8 JSON
             *
             * Send this data to your e-commerce back-end system, where it can be decrypted and submitted to your payment processor.
             *
             * @see {@link https://developer.apple.com/library/archive/documentation/PassKit/Reference/PaymentTokenJSON/PaymentTokenJSON.html#//apple_ref/doc/uid/TP40014929}
             */
            paymentData?: string;
        }
        /**
         * Represents the result of authorizing a payment request and contains payment information, encrypted in the payment token.
         *
         * @see {@link https://developer.apple.com/documentation/passkit/pkpayment?language=objc}
         */
        interface Payment {
            /**
             * The encrypted payment information.
             *
             * @see {@link doc://com.apple.documentation/documentation/passkit/apple_pay/payment_token_format_reference?language=swift}
             */
            token: PaymentToken;
            /**
             * The user-selected shipping method for this transaction.
             *
             * A value is set for this property only if the corresponding payment request specified available
             * shipping methods in the shippingMethods property of the PaymentRequest object.
             * Otherwise, the value is undefined.
             */
            shippingMethod?: ShippingMethod;
            /**
             * The user-selected shipping address for this transaction.
             */
            shippingContact?: Contact;
            /**
             * The user-selected billing address for this transaction.
             */
            billingContact?: Contact;
        }
        interface Contact {
        }
    }
}
declare namespace CdvPurchase {
    /**
     * Apple AppStore adapter using StoreKit version 1
     */
    namespace AppleAppStore {
        type PaymentMonitorStatus = 'cancelled' | 'failed' | 'purchased' | 'deferred';
        type PaymentMonitor = (status: PaymentMonitorStatus) => void;
        /** Additional data passed with an order on AppStore */
        interface AdditionalData {
            /** Information about the payment discount */
            discount?: PaymentDiscount;
        }
        /**
         * Determine which discount the user is eligible to.
         *
         * @param applicationReceipt An apple appstore receipt
         * @param requests List of discount offers to evaluate eligibility for
         * @param callback Get the response, a boolean for each request (matched by index).
         */
        type DiscountEligibilityDeterminer = ((applicationReceipt: ApplicationReceipt, requests: DiscountEligibilityRequest[], callback: (response: boolean[]) => void) => void) & {
            cacheReceipt?: (receipt: VerifiedReceipt) => void;
        };
        /**
         * Optional options for the AppleAppStore adapter
         */
        interface AdapterOptions {
            /**
             * Determine which discount the user is eligible to.
             *
             * @param applicationReceipt An apple appstore receipt
             * @param requests List of discount offers to evaluate eligibility for
             * @param callback Get the response, a boolean for each request (matched by index).
             */
            discountEligibilityDeterminer?: DiscountEligibilityDeterminer;
            /**
             * Set to false if you don't need to verify the application receipt
             *
             * Verifying the application receipt at startup is useful in different cases:
             *
             *  - Retrieve information about the user's first app download.
             *  - Make it harder to side-load your application.
             *  - Determine eligibility to introductory prices.
             *
             * The default is "true", use "false" is an optimization.
             */
            needAppReceipt?: boolean;
            /**
             * Auto-finish pending transaction
             *
             * Use this if the transaction queue is filled with unwanted transactions (in development).
             * It's safe to keep this option to "true" when using a receipt validation server and you only
             * sell subscriptions.
             */
            autoFinish?: boolean;
        }
        /**
         * Adapter for Apple AppStore using StoreKit version 1
         */
        class Adapter implements CdvPurchase.Adapter {
            id: Platform;
            name: string;
            ready: boolean;
            _canMakePayments: boolean;
            /**
             * Set to true to force a full refresh of the receipt when preparing a receipt validation call.
             *
             * This is typically done when placing an order and restoring purchases.
             */
            forceReceiptReload: boolean;
            /** List of products loaded from AppStore */
            _products: SKProduct[];
            get products(): Product[];
            /** Find a given product from ID */
            getProduct(id: string): SKProduct | undefined;
            /** The application receipt, contains all transactions */
            _receipt?: SKApplicationReceipt;
            /** The pseudo receipt stores purchases in progress */
            pseudoReceipt: Receipt;
            get receipts(): Receipt[];
            private validProducts;
            addValidProducts(registerProducts: IRegisterProduct[], validProducts: Bridge.ValidProduct[]): void;
            bridge: Bridge.Bridge;
            context: CdvPurchase.Internal.AdapterContext;
            log: Logger;
            /** Component that determine eligibility to a given discount offer */
            discountEligibilityDeterminer?: DiscountEligibilityDeterminer;
            /** True when we need to validate the application receipt */
            needAppReceipt: boolean;
            /** True to auto-finish all transactions */
            autoFinish: boolean;
            /** Callback called when the restore process is completed */
            onRestoreCompleted?: (code: IError | undefined) => void;
            constructor(context: CdvPurchase.Internal.AdapterContext, options: AdapterOptions);
            /** Returns true on iOS, the only platform supported by this adapter */
            get isSupported(): boolean;
            private upsertTransactionInProgress;
            /** Remove a transaction from the pseudo receipt */
            private removeTransactionInProgress;
            /** Insert or update a transaction in the pseudo receipt, based on data collected from the native side */
            private upsertTransaction;
            private removeTransaction;
            /** Debounced version of _receiptUpdated */
            private receiptsUpdated;
            /** Notify the store that the receipts have been updated */
            private _receiptsUpdated;
            private _paymentMonitor;
            private setPaymentMonitor;
            private callPaymentMonitor;
            initialize(): Promise<IError | undefined>;
            supportsParallelLoading: boolean;
            loadReceipts(): Promise<Receipt[]>;
            private canMakePayments;
            /** True iff the appStoreReceipt is already being initialized */
            private _appStoreReceiptLoading;
            /** List of functions waiting for the appStoreReceipt to be initialized */
            private _appStoreReceiptCallbacks;
            /**
             * Create the application receipt
             */
            private initializeAppReceipt;
            private prepareReceipt;
            /** Promisified loading of the AppStore receipt */
            private loadAppStoreReceipt;
            private loadEligibility;
            private callDiscountEligibilityDeterminer;
            loadProducts(products: IRegisterProduct[]): Promise<(Product | IError)[]>;
            order(offer: Offer, additionalData: CdvPurchase.AdditionalData): Promise<undefined | IError>;
            finish(transaction: Transaction): Promise<undefined | IError>;
            refreshReceipt(): Promise<undefined | IError | ApplicationReceipt>;
            receiptValidationBody(receipt: Receipt): Promise<Validator.Request.Body | undefined>;
            handleReceiptValidationResponse(_receipt: Receipt, response: Validator.Response.Payload): Promise<void>;
            requestPayment(payment: PaymentRequest, additionalData?: CdvPurchase.AdditionalData): Promise<IError | Transaction | undefined>;
            manageSubscriptions(): Promise<IError | undefined>;
            manageBilling(): Promise<IError | undefined>;
            checkSupport(functionality: PlatformFunctionality): boolean;
            restorePurchases(): Promise<IError | undefined>;
            presentCodeRedemptionSheet(): Promise<void>;
        }
    }
}
declare namespace CdvPurchase {
    namespace AppleAppStore {
        /**
         * Application receipt with information about the app bundle.
         */
        interface ApplicationReceipt {
            /** Application receipt in base64 */
            appStoreReceipt: string;
            /** String containing the apps bundle identifier */
            bundleIdentifier: string;
            /** Application version in string format */
            bundleShortVersion: string;
            /** Application version in numeric format */
            bundleNumericVersion: number;
            /** Bundle signature */
            bundleSignature: string;
        }
        /**
         * The signed discount applied to a payment
         *
         * @see {@link https://developer.apple.com/documentation/storekit/skpaymentdiscount?language=objc}
         */
        interface PaymentDiscount {
            /** A string used to uniquely identify a discount offer for a product. */
            id: string;
            /** A string that identifies the key used to generate the signature. */
            key: string;
            /** A universally unique ID (UUID) value that you define. */
            nonce: string;
            /** A string representing the properties of a specific promotional offer, cryptographically signed. */
            signature: string;
            /** The date and time of the signature's creation in milliseconds, formatted in Unix epoch time. */
            timestamp: string;
        }
        namespace Bridge {
            /**
             * Product as loaded from AppStore
             */
            export interface ValidProduct {
                /** product id */
                id: string;
                /** localized title */
                title: string;
                /** localized description */
                description: string;
                /** localized price */
                price: string;
                /** Price in micro units */
                priceMicros: number;
                /** Currency used by this product */
                currency: string;
                /** AppStore country this product has been fetched for */
                countryCode: string;
                /** Number of period units in each billing cycle */
                billingPeriod?: number;
                /** Unit for the billing cycle */
                billingPeriodUnit?: IPeriodUnit;
                /** Localized price for introductory period */
                introPrice?: string;
                /** Introductory price in micro units */
                introPriceMicros?: number;
                /** Number of introductory price periods */
                introPricePeriod?: number;
                /** Duration of an introductory price period */
                introPricePeriodUnit?: IPeriodUnit;
                /** Payment mode for introductory price */
                introPricePaymentMode?: PaymentMode;
                /** Available discount offers */
                discounts?: Discount[];
                /** Group this product is member of */
                group?: string;
            }
            export type DiscountType = "Introductory" | "Subscription";
            /** Subscription discount offer */
            export interface Discount {
                /** Discount identifier */
                id: string;
                /** Discount type */
                type: DiscountType;
                /** Localized price */
                price: string;
                /** Price in micro units */
                priceMicros: number;
                /** Number of periods */
                period: number;
                /** Subscription period unit */
                periodUnit: IPeriodUnit;
                /** Payment mode */
                paymentMode: PaymentMode;
            }
            /**
             * State of a transaction
             */
            export type TransactionState = "PaymentTransactionStatePurchasing" | "PaymentTransactionStatePurchased" | "PaymentTransactionStateDeferred" | "PaymentTransactionStateFailed" | "PaymentTransactionStateRestored" | "PaymentTransactionStateFinished";
            /**
             * A receipt returned by the native side.
             */
            type RawReceiptArgs = [
                base64: string,
                bundleIdentifier: string,
                bundleShortVersion: string,
                bundleNumericVersion: number,
                bundleSignature: string
            ];
            export interface BridgeCallbacks {
                error: (code: ErrorCode, message: string, options?: {
                    productId: string;
                    quantity?: number;
                }) => void;
                /** Called when the bridge is ready (after setup) */
                ready: () => void;
                /** Called when a transaction is in "Purchased" state */
                purchased: (transactionIdentifier: string, productId: string, originalTransactionIdentifier?: string, transactionDate?: string, discountId?: string) => void;
                /** Called when a transaction has been enqueued */
                purchaseEnqueued: (productId: string, quantity: number) => void;
                /**
                 * Called when a transaction failed.
                 *
                 * Watch out for ErrorCode.PAYMENT_CANCELLED (means user closed the dialog)
                 */
                purchaseFailed: (productId: string, code: ErrorCode, message: string) => void;
                /**
                 * Called when a transaction is in "purchasing" state
                 */
                purchasing: (productId: string) => void;
                /** Called when a transaction is deferred (waiting for approval) */
                deferred: (productId: string) => void;
                /** Called when a transaction is in "finished" state */
                finished: (transactionIdentifier: string, productId: string) => void;
                /** Called when a transaction is in "restored" state */
                restored: (transactionIdentifier: string, productId: string) => void;
                /** Called when the application receipt is refreshed */
                receiptsRefreshed: (receipt: ApplicationReceipt) => void;
                /** Called when a call to "restore" failed */
                restoreFailed: (errorCode: ErrorCode) => void;
                /** Called when a call to "restore" is complete */
                restoreCompleted: () => void;
            }
            export interface BridgeOptions extends BridgeCallbacks {
                /** Custom logger for the bridge */
                log: (message: string) => void;
                /** True to enable lot of logs on the console */
                debug: boolean;
                /** Auto-finish transaction */
                autoFinish: boolean;
            }
            export class Bridge {
                /** Callbacks set by the adapter */
                options: BridgeCallbacks;
                /** Transactions for a given product */
                transactionsForProduct: {
                    [productId: string]: string[];
                };
                /** True when the SDK has been initialized */
                private initialized;
                /** The application receipt from AppStore, cached in javascript */
                appStoreReceipt?: ApplicationReceipt | null;
                /** List of registered product identifiers */
                private registeredProducts;
                /** True if "restoreCompleted" or "restoreFailed" should be called when restore is done */
                private needRestoreNotification;
                /** List of transaction updates to process */
                private pendingUpdates;
                constructor();
                /**
                 * Initialize the AppStore bridge.
                 *
                 * This calls the native "setup" method from the "InAppPurchase" Objective-C class.
                 *
                 * @param options Options for the bridge
                 * @param success Called when the bridge is ready
                 * @param error Called when the bridge failed to initialize
                 */
                init(options: Partial<BridgeOptions>, success: () => void, error: (code: ErrorCode, message: string) => void): void;
                processPendingTransactions(): void;
                /**
                 * Makes an in-app purchase.
                 *
                 * @param {String} productId The product identifier. e.g. "com.example.MyApp.myproduct"
                 * @param {int} quantity Quantity of product to purchase
                 */
                purchase(productId: string, quantity: number, applicationUsername: string | undefined, discount: PaymentDiscount | undefined, success: () => void, error: () => void): void;
                /**
                 * Checks if device/user is allowed to make in-app purchases
                 */
                canMakePayments(success: () => void, error: (message: string) => void): void;
                /**
                 * Asks the payment queue to restore previously completed purchases.
                 *
                 * The restored transactions are passed to the onRestored callback, so make sure you define a handler for that first.
                 */
                restore(callback?: Callback<any>): void;
                manageSubscriptions(callback?: Callback<any>): void;
                manageBilling(callback?: Callback<any>): void;
                presentCodeRedemptionSheet(callback?: Callback<any>): void;
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
                load(productIds: string[], success: (validProducts: ValidProduct[], invalidProductIds: string[]) => void, error: (code: ErrorCode, message: string) => void): void;
                finish(transactionId: string, success: () => void, error: (msg: string) => void): void;
                finalizeTransactionUpdates(): void;
                lastTransactionUpdated(): void;
                transactionUpdated(state: TransactionState, errorCode: ErrorCode | undefined, errorText: string | undefined, transactionIdentifier: string, productId: string, transactionReceipt: never, originalTransactionIdentifier: string | undefined, transactionDate: string | undefined, discountId: string | undefined): void;
                restoreCompletedTransactionsFinished(): void;
                restoreCompletedTransactionsFailed(errorCode: ErrorCode): void;
                parseReceiptArgs(args: RawReceiptArgs): ApplicationReceipt;
                refreshReceipts(successCb: (receipt: ApplicationReceipt) => void, errorCb: (code: ErrorCode, message: string) => void): void;
                loadReceipts(callback: (receipt: ApplicationReceipt) => void, errorCb: (code: ErrorCode, message: string) => void): void;
                /** @deprecated */
                onPurchased: boolean;
                /** @deprecated */
                onFailed: boolean;
                /** @deprecated */
                onRestored: boolean;
            }
            export {};
        }
    }
}
declare namespace CdvPurchase {
    /**
     * Apple AppStore adapter using StoreKit version 1
     */
    namespace AppleAppStore {
        type DiscountType = "Introductory" | "Subscription";
        interface DiscountEligibilityRequest {
            productId: string;
            discountType: DiscountType;
            discountId: string;
        }
        /** @internal */
        namespace Internal {
            interface IDiscountEligibilities {
                isEligible(productId: string, discountType: DiscountType, discountId: string): boolean;
            }
            class DiscountEligibilities implements IDiscountEligibilities {
                request: DiscountEligibilityRequest[];
                response: boolean[];
                constructor(request: DiscountEligibilityRequest[], response: boolean[]);
                isEligible(productId: string, discountType: DiscountType, discountId: string): boolean;
            }
        }
    }
}
declare namespace CdvPurchase {
    /**
     * Apple AppStore adapter using StoreKit version 1
     */
    namespace AppleAppStore {
        const DEFAULT_OFFER_ID = "$";
        type SKOfferType = DiscountType | 'Default';
        class SKOffer extends Offer {
            offerType: SKOfferType;
            constructor(options: {
                id: string;
                product: Product;
                pricingPhases: PricingPhase[];
                offerType: SKOfferType;
            }, decorator: CdvPurchase.Internal.OfferDecorator);
        }
        class SKProduct extends Product {
            /** Raw data returned by native side */
            raw: Bridge.ValidProduct;
            /** AppStore country this product has been fetched for */
            countryCode?: string;
            constructor(validProduct: Bridge.ValidProduct, p: IRegisterProduct, decorator: CdvPurchase.Internal.ProductDecorator & CdvPurchase.Internal.OfferDecorator, eligibilities: Internal.IDiscountEligibilities);
            removeIneligibleDiscounts(eligibilities: Internal.IDiscountEligibilities): void;
            refresh(valid: Bridge.ValidProduct, decorator: CdvPurchase.Internal.ProductDecorator & CdvPurchase.Internal.OfferDecorator, eligibilities: Internal.IDiscountEligibilities): void;
        }
    }
}
declare namespace CdvPurchase {
    namespace AppleAppStore {
        /**
         * Transaction ID used for the application virtual transaction
         */
        const APPLICATION_VIRTUAL_TRANSACTION_ID = "appstore.application";
        /**
         * StoreKit 1 exposes a single receipt that contains all transactions.
         */
        class SKApplicationReceipt extends Receipt {
            nativeData: ApplicationReceipt;
            constructor(applicationReceipt: ApplicationReceipt, needApplicationReceipt: boolean, decorator: CdvPurchase.Internal.ReceiptDecorator & CdvPurchase.Internal.TransactionDecorator);
            refresh(nativeData: ApplicationReceipt, needApplicationReceipt: boolean, decorator: CdvPurchase.Internal.ReceiptDecorator & CdvPurchase.Internal.TransactionDecorator): void;
        }
        /** StoreKit transaction */
        class SKTransaction extends Transaction {
            originalTransactionId?: string;
            refresh(productId?: string, originalTransactionIdentifier?: string, transactionDate?: string, discountId?: string): void;
        }
    }
}
declare namespace CdvPurchase {
    namespace AppleAppStore {
        namespace VerifyReceipt {
            interface AppleTransaction {
                /**
                 * The appAccountToken associated with this transaction.
                 *
                 * This field is only present if your app supplied an appAccountToken(_:) when the user made the purchase.
                 */
                app_account_token?: string;
                /** The time Apple customer support canceled a transaction,
                 * in a date-time format similar to the ISO 8601.
                 *
                 * This field is only present for refunded transactions. */
                cancellation_date?: string;
                /** The time Apple customer support canceled a transaction,
                 * in UNIX epoch time format.
                 *
                 * https://developer.apple.com/documentation/appstorereceipts/cancellation_date_ms */
                cancellation_date_ms?: string;
                /** The reason for a refunded transaction.
                 *
                 * When a customer cancels a transaction, the App Store gives them a refund
                 * and provides a value for this key.
                 *
                 * - A value of “1” indicates that the customer canceled their transaction due
                 *   to an actual or perceived issue within your app.
                 * - A value of “0” indicates that the transaction was canceled for another reason;
                 *   for example, if the customer made the purchase accidentally.
                 */
                cancellation_reason?: '0' | '1';
                /** The time a subscription expires or when it will renew,
                 * in a date-time format similar to the ISO 8601. */
                expires_date?: string;
                /** The time a subscription expires or when it will renew,
                 * in UNIX epoch time format, in milliseconds.
                 *
                 * Use this time format for processing dates.
                 * https://developer.apple.com/documentation/appstorereceipts/expires_date_ms */
                expires_date_ms?: string;
                /** The time a subscription expires or when it will renew, in the Pacific Time zone. */
                expires_date_pst?: string;
                /** An indicator of whether an auto-renewable subscription is in the introductory price period.
                 *
                 * https://developer.apple.com/documentation/appstorereceipts/is_in_intro_offer_period */
                is_in_intro_offer_period?: 'true' | 'false';
                /** An indicator of whether a subscription is in the free trial period.
                 *
                 * https://developer.apple.com/documentation/appstorereceipts/is_trial_period */
                is_trial_period?: 'true' | 'false';
                /** An indicator that a subscription has been canceled due to an upgrade.
                 *
                 * This field is only present for upgrade transactions. */
                is_upgraded?: 'false' | 'true';
                /** Reference name of an offer code used by the user to make this transaction. */
                offer_code_ref_name?: string;
                /** The time of the original app purchase, in a date-time format similar to ISO 8601. */
                original_purchase_date: string;
                /** The time of the original app purchase, in UNIX epoch time format, in milliseconds.
                 *
                 * Use this time format for processing dates. For an auto-renewable subscription,
                 * this value indicates the date of the subscription's initial purchase.
                 * The original purchase date applies to all product types and remains the same
                 * in all transactions for the same product ID.
                 * This value corresponds to the original transaction’s transactionDate property
                 * in StoreKit. */
                original_purchase_date_ms: string;
                /** The time of the original app purchase, in the Pacific Time zone. */
                original_purchase_date_pst: string;
                /** The transaction identifier of the original purchase.
                 *
                 * https://developer.apple.com/documentation/appstorereceipts/original_transaction_id */
                original_transaction_id: string;
                /** The unique identifier of the product purchased.
                 *
                 * You provide this value when creating the product in App Store Connect,
                 * and it corresponds to the productIdentifier property of the SKPayment object
                 * stored in the transaction's payment property. */
                product_id: string;
                /** The identifier of the subscription offer redeemed by the user.
                 *
                 * https://developer.apple.com/documentation/appstorereceipts/promotional_offer_id */
                promotional_offer_id?: string;
                /** The time the App Store charged the user's account for a purchased or restored product,
                 * or the time the App Store charged the user’s account for a subscription purchase
                 * or renewal after a lapse, in a date-time format similar to ISO 8601. */
                purchase_date: string;
                /** The time the App Store charged the user's account for a purchase or renewal,
                 * in milliseconds since EPOCH.
                 *
                 * For consumable, non-consumable, and non-renewing subscription products,
                 * the time the App Store charged the user's account for a purchased or restored product.
                 *
                 * For auto-renewable subscriptions, the time the App Store charged the user’s account
                 * for a subscription purchase or renewal after a lapse.
                 *
                 * Use this time format for processing dates. */
                purchase_date_ms: string;
                /** The time the App Store charged the user's account for a purchase or renewal,
                 * in the Pacific Time zone. */
                purchase_date_pst: string;
                /** The number of consumable products purchased.
                 *
                 * This value corresponds to the quantity property of the SKPayment object
                 * stored in the transaction's payment property.
                 *
                 * The value is usually “1” unless modified with a mutable payment.
                 *
                 * The maximum value is 10. */
                quantity?: string;
                /** The identifier of the subscription group to which the subscription belongs.
                 *
                 * The value for this field is identical to the subscriptionGroupIdentifier property
                 * in SKProduct. */
                subscription_group_identifier?: string;
                /** A unique identifier for a transaction such as a purchase, restore, or renewal.
                 *
                 * https://developer.apple.com/documentation/appstorereceipts/transaction_id */
                transaction_id: string;
                /** A unique identifier for purchase events across devices,
                 * including subscription-renewal events.
                 *
                 * This value is the primary key for identifying subscription purchases. */
                web_order_line_item_id: string;
                /** The relationship of the user with the family-shared purchase to which they have access.
                 *
                 * Possible Values:
                 *
                 * - `FAMILY_SHARED`: The transaction belongs to a family member who benefits from service.</li>
                 * - `PURCHASED`: The transaction belongs to the purchaser.</li>
                 */
                in_app_ownership_type?: 'FAMILY_SHARED' | 'PURCHASED';
            }
            /**
             * @api {type} / class Validate.TransactionApple
             * @apiDescription Native Apple transaction
             * @apiName Validate.TransactionApple
             * @apiVersion 3.0.0
             * @apiGroup Types
             * @apiSuccessInterface {ApiValidatorBodyTransactionApple}
             */
            /** An object that contains information about the most recent in-app purchase
             * transactions for the app.
             *
             * https://developer.apple.com/documentation/appstoreservernotifications/unified_receipt
             */
            interface AppleUnifiedReceipt {
                /** The environment for which the receipt was generated. */
                environment: AppleEnvironment;
                /** The latest Base64-encoded app receipt.*/
                latest_receipt?: string;
                /** An array that contains the latest 100 in-app purchase transactions of the
                 * decoded value in latest_receipt. This array excludes transactions for
                 * consumable products that your app has marked as finished. The contents of
                 * this array are identical to those in responseBody.Latest_receipt_info in
                 * the verifyReceipt endpoint response for receipt validation. */
                latest_receipt_info?: Array<AppleTransaction>;
                /** An array where each element contains the pending renewal information for
                 * each auto-renewable subscription identified in product_id. The contents of
                 * this array are identical to those in responseBody.Pending_renewal_info in
                 * the verifyReciept endpoint response for receipt validation. */
                pending_renewal_info?: Array<ApplePendingRenewalInfo>;
                /** The status code, where 0 indicates that the notification is valid. */
                status: number;
            }
            interface ApplePendingRenewalInfo {
                auto_renew_product_id?: string;
                auto_renew_status?: '1' | '0';
                expiration_intent?: AppleExpirationIntent;
                grace_period_expires_date?: string;
                grace_period_expires_date_ms?: string;
                grace_period_expires_date_pst?: string;
                is_in_billing_retry_period?: string;
                original_transaction_id: string;
                price_consent_status?: '0' | '1';
                product_id: string;
            }
            /** The reason a subscription expired.
             * https://developer.apple.com/documentation/appstorereceipts/expiration_intent
             */
            enum AppleExpirationIntent {
                /** The customer voluntarily canceled their subscription. */
                CANCELED = "1",
                /** Billing error; for example, the customer"s payment information was no longer valid. */
                BILLING_ERROR = "2",
                /** The customer did not agree to a recent price increase. */
                PRICE_INCREASE = "3",
                /** The product was not available for purchase at the time of renewal. */
                PRODUCT_NOT_AVAILABLE = "4",
                /** Unknown error. */
                UNKNOWN = "5"
            }
            interface AppleVerifyReceiptResponse extends AppleUnifiedReceipt {
                /** Either 0 if the receipt is valid, or a status code if there is an error.
                 * The status code reflects the status of the app receipt as a whole.
                 * https://developer.apple.com/documentation/appstorereceipts/status */
                status: number;
                /** The environment for which the receipt was generated. Possible values:
                 * Sandbox, Production. */
                environment: AppleEnvironment;
                /** An indicator that an error occurred during the request. A value of 1
                 * indicates a temporary issue; retry validation for this receipt at a later
                 * time. A value of 0 indicates an unresolvable issue; do not retry
                 * validation for this receipt. Only applicable to status codes 21100-21199.
                 */
                'is-retryable'?: boolean;
                /** A JSON representation of the receipt that was sent for verification. */
                receipt: AppleVerifyReceiptResponseReceipt;
                /** An array that contains all in-app purchase transactions. This excludes
                 * transactions for consumable products that have been marked as finished by
                 * your app. Only returned for receipts that contain auto-renewable
                 * subscriptions. */
                latest_receipt_info?: Array<AppleTransaction>;
                /** The latest Base64 encoded app receipt. Only returned for receipts that
                 * contain auto-renewable subscriptions. */
                latest_receipt?: string;
                /** In the JSON file, an array where each element contains the pending
                 * renewal information for each auto-renewable subscription identified by the
                 * product_id. Only returned for app receipts that contain auto-renewable
                 * subscriptions. */
                pending_renewal_info?: Array<ApplePendingRenewalInfo>;
                /** Description of an error, when there's an internal server error at Apple. */
                exception?: string;
            }
            interface AppleVerifyReceiptResponseReceipt {
                /** The type of receipt generated. The value corresponds to the environment
                 * in which the app or VPP purchase was made. Possible values: Production,
                 * ProductionVPP, ProductionSandbox, ProductionVPPSandbox */
                receipt_type: AppleReceiptType;
                /** See app_item_id. */
                adam_id: number;
                /** Generated by App Store Connect and used by the App Store to uniquely
                 * identify the app purchased. Apps are assigned this identifier only in
                 * production. Treat this value as a 64-bit long integer. */
                app_item_id: number;
                /** The bundle identifier for the app to which the receipt belongs. You
                 * provide this string on App Store Connect. This corresponds to the value of
                 * CFBundleIdentifier in the Info.plist file of the app. */
                bundle_id: string;
                /** The app’s version number. The app's version number corresponds to the
                 * value of CFBundleVersion (in iOS) or CFBundleShortVersionString (in macOS)
                 * in the Info.plist. In production, this value is the current version of the
                 * app on the device based on the receipt_creation_date_ms. In the sandbox,
                 * the value is always "1.0". */
                application_version: string;
                /** A unique identifier for the app download transaction. */
                download_id: number;
                /** The time the receipt expires for apps purchased through the Volume
                 * Purchase Program, in a date-time format similar to the ISO 8601. */
                expiration_date?: string;
                /** The time the receipt expires for apps purchased through the Volume
                 * Purchase Program, in UNIX epoch time format, in milliseconds. If this key
                 * is not present for apps purchased through the Volume Purchase Program, the
                 * receipt does not expire. Use this time format for processing dates. */
                expiration_date_ms?: string;
                /** in the Pacific Time zone. */
                expiration_date_pst?: string;
                /** The time of the original app purchase, in a date-time format similar to
                 * ISO 8601. */
                original_purchase_date: string;
                /** The time of the original app purchase, in UNIX epoch time format, in
                 * milliseconds. Use this time format for processing dates. */
                original_purchase_date_ms: string;
                /** The time of the original app purchase, in the Pacific Time zone. */
                original_purchase_date_pst: string;
                /** The version of the app that the user originally purchased. This value
                 * does not change, and corresponds to the value of CFBundleVersion (in iOS)
                 * or CFBundleShortVersionString (in macOS) in the Info.plist file of the
                 * original purchase. In the sandbox environment, the value is always "1.0".
                 */
                original_application_version: string;
                /** The time the user ordered the app available for pre-order, in a date-time
                 * format similar to ISO 8601. */
                preorder_date?: string;
                /** The time the user ordered the app available for pre-order, in UNIX epoch
                 * time format, in milliseconds. This field is only present if the user
                 * pre-orders the app. Use this time format for processing dates. */
                preorder_date_ms?: string;
                /** in the Pacific Time zone. */
                preorder_date_pst?: string;
                /** An array that contains the in-app purchase receipt fields for all in-app
                 * purchase transactions. */
                in_app: string | Array<AppleTransaction>;
                /** The time the App Store generated the receipt, in a date-time format
                 * similar to ISO 8601. */
                receipt_creation_date: string;
                /** The time the App Store generated the receipt, in UNIX epoch time format,
                 * in milliseconds. Use this time format for processing dates. This value
                 * does not change. */
                receipt_creation_date_ms: string;
                /** in the Pacific Time zone. */
                receipt_creation_date_pst: string;
                /** The time the request to the verifyReceipt endpoint was processed and the
                 * response was generated, in a date-time format similar to ISO 8601. */
                request_date: string;
                /** The time the request to the verifyReceipt endpoint was processed and the
                 * response was generated, in UNIX epoch time format, in milliseconds. Use
                 * this time format for processing dates. */
                request_date_ms: string;
                /** The time the request to the verifyReceipt endpoint was processed and the
                 * response was generated, in the Pacific Time zone. */
                request_date_pst: string;
                /** An arbitrary number that identifies a revision of your app. In the
                 * sandbox, this key's value is “0”. */
                version_external_identifier: number;
            }
            /** The type of receipt generated. The value corresponds to the environment in
              * which the app or VPP purchase was made. (VPP = volume purchase) */
            type AppleReceiptType = 'Production' | 'ProductionVPP' | 'ProductionSandbox' | 'ProductionVPPSandbox';
            type AppleEnvironment = 'Production' | 'Sandbox';
            type AppleBoolean = 'false' | 'true' | '0' | '1';
        }
    }
}
declare namespace CdvPurchase {
    namespace Braintree {
        /** The Braintree customer identifier. Set it to allow reusing of payment methods. */
        let customerId: string | undefined;
        interface AdapterOptions {
            /** Authorization key, as a direct string. */
            tokenizationKey?: string;
            /** Function used to retrieve a Client Token (used if no tokenizationKey are provided). */
            clientTokenProvider?: ClientTokenProvider;
            /** Options for making Apple Pay payment requests */
            applePay?: IosBridge.ApplePayOptions;
            /**
             * Google Pay request parameters applied to all Braintree DropIn requests
             */
            googlePay?: GooglePay.Request;
            /**
             * 3DS request parameters applied to all Braintree DropIn requests
             */
            threeDSecure?: ThreeDSecure.Request;
        }
        type ClientTokenProvider = (callback: Callback<string | IError>) => void;
        interface TransactionObject {
            success: boolean;
            transaction?: ({
                status: 'authorization_expired' | 'authorized' | 'authorizing' | 'settlement_confirmed' | 'settlement_pending' | 'failed' | 'settled' | 'settling' | 'submitted_for_settlement' | 'voided';
            } | {
                status: "processor_declined";
                /** e.g. paypal or credit card */
                paymentInstrumentType: string;
                /** e.g. "soft_declined" */
                processorResponseType: "soft_declined" | "hard_declined" | "approved";
                /** e.g. "2001" */
                processorResponseCode: string;
                /** e.g. "Insufficient Funds" */
                processorResponseText: string;
                /** e.g. "05 : NOT AUTHORISED" */
                additionalProcessorResponse: string;
            } | {
                status: "settlement_declined";
                /** e.g. "4001" */
                processorSettlementResponseCode: string;
                /** e.g. "Settlement Declined" */
                processorSettlementResponseText: string;
            } | {
                status: "gateway_rejected";
                /** e.g. "cvv" */
                gatewayRejectionReason: string;
            }) & {
                /**
                 * Each merchant account can only process transactions for a single currency.
                 * Setting which merchant account to use will also determine which currency the transaction is processed with.
                 *
                 * e.g. "USD"
                 */
                currencyIsoCode: string;
                /** Risk data on credit card verifications and on transactions with all compatible payment methods */
                riskData: {
                    /** e.g. "1SG23YHM4BT5" */
                    id: string;
                    /** e.g. "Decline" */
                    decision: "Not Evaluated" | "Approve" | "Review" | "Decline";
                    /** e.g. true */
                    deviceDataCaptured: boolean;
                    /** e.g. "Kount" */
                    fraudServiceProvider: string;
                    /** e.g.["reason1", "reason2"] */
                    decisionReasons: string[];
                    /** e.g. 42 */
                    riskScore: number;
                };
                customer: {
                    id: string;
                    company?: string | undefined;
                    customFields?: any;
                    email?: string | undefined;
                    fax?: string | undefined;
                    firstName?: string | undefined;
                    lastName?: string | undefined;
                    phone?: string | undefined;
                    website?: string | undefined;
                };
                creditCard?: {
                    bin: string;
                    cardholderName?: string | undefined;
                    cardType: string;
                    commercial: Commercial;
                    countryOfIssuance: string;
                    customerLocation: CustomerLocation;
                    debit: string;
                    durbinRegulated: DurbinRegulated;
                    expirationDate?: string | undefined;
                    expirationMonth?: string | undefined;
                    expirationYear?: string | undefined;
                    healthcare: HealthCare;
                    imageUrl?: string | undefined;
                    issuingBank: string;
                    last4: string;
                    maskedNumber?: string | undefined;
                    payroll: Payroll;
                    prepaid: Prepaid;
                    productId: string;
                    token: string;
                    uniqueNumberIdentifier: string;
                };
            };
            errors?: {}[];
        }
        type Commercial = 'Yes' | 'No' | 'Unknown';
        type CustomerLocation = 'US' | 'International';
        type Debit = 'Yes' | 'No' | 'Unknown';
        type DurbinRegulated = 'Yes' | 'No' | 'Unknown';
        type HealthCare = 'Yes' | 'No' | 'Unknown';
        type Payroll = 'Yes' | 'No' | 'Unknown';
        type Prepaid = 'Yes' | 'No' | 'Unknown';
        class BraintreeReceipt extends Receipt {
            dropInResult: DropIn.Result;
            paymentRequest: PaymentRequest;
            constructor(paymentRequest: PaymentRequest, dropInResult: DropIn.Result, decorator: Internal.TransactionDecorator & Internal.ReceiptDecorator);
            refresh(paymentRequest: PaymentRequest, dropInResult: DropIn.Result, decorator: Internal.TransactionDecorator): void;
        }
        class Adapter implements CdvPurchase.Adapter {
            id: Platform;
            name: string;
            ready: boolean;
            products: Product[];
            _receipts: BraintreeReceipt[];
            get receipts(): Receipt[];
            private context;
            log: Logger;
            iosBridge?: IosBridge.Bridge;
            androidBridge?: AndroidBridge.Bridge;
            options: AdapterOptions;
            constructor(context: Internal.AdapterContext, options: AdapterOptions);
            get isSupported(): boolean;
            supportsParallelLoading: boolean;
            /**
             * Initialize the Braintree Adapter.
             */
            initialize(): Promise<IError | undefined>;
            loadProducts(products: IRegisterProduct[]): Promise<(Product | IError)[]>;
            loadReceipts(): Promise<Receipt[]>;
            order(offer: Offer): Promise<undefined | IError>;
            finish(transaction: Transaction): Promise<undefined | IError>;
            manageSubscriptions(): Promise<IError | undefined>;
            manageBilling(): Promise<IError | undefined>;
            private launchDropIn;
            requestPayment(paymentRequest: PaymentRequest, additionalData?: CdvPurchase.AdditionalData): Promise<IError | Transaction | undefined>;
            receiptValidationBody(receipt: BraintreeReceipt): Promise<Validator.Request.Body | undefined>;
            /**
             * Handle a response from a receipt validation process.
             *
             * @param receipt The receipt being validated.
             * @param response The response payload from the receipt validation process.
             * @returns A promise that resolves when the response has been handled.
             */
            handleReceiptValidationResponse(receipt: Receipt, response: Validator.Response.Payload): Promise<void>;
            checkSupport(functionality: PlatformFunctionality): boolean;
            restorePurchases(): Promise<IError | undefined>;
        }
        function braintreeError(code: ErrorCode, message: string): IError;
    }
}
declare namespace CdvPurchase {
    namespace Braintree {
        /** Parameters for a payment with Braintree */
        /**
         * Data for a Braintree payment request.
         */
        interface AdditionalData {
            /**
             * Specify the full DropIn Request parameters for full customization.
             *
             * When set, this takes precedence over all other options.
             */
            dropInRequest?: DropIn.Request;
        }
    }
}
declare namespace CdvPurchase {
    namespace Braintree {
        namespace AndroidBridge {
            /**
             * Message received by the native plugin.
             */
            type Message = {
                type: "ready";
            } | {
                type: "getClientToken";
            };
            type ClientTokenProvider = (callback: Callback<string | IError>) => void;
            /**
             * Bridge to access native functions.
             *
             * This tries to export pretty raw functions from the underlying native SDKs.
             */
            class Bridge {
                private log;
                private clientTokenProvider?;
                constructor(log: Logger);
                /** Receive asynchronous messages from the native side */
                private listener;
                initialize(clientTokenProvider: ClientTokenProvider | string, callback: Callback<IError | undefined>): void;
                /**
                 * Fetches a client token and sends it to the SDK.
                 *
                 * This method is called by the native side when the SDK requests a Client Token.
                 */
                private getClientToken;
                /** Returns true on Android, the only platform supported by this Braintree bridge */
                static isSupported(): boolean;
                isApplePaySupported(): Promise<boolean>;
                launchDropIn(dropInRequest: DropIn.Request): Promise<DropIn.Result | IError>;
            }
        }
    }
}
declare namespace CdvPurchase {
    namespace Braintree {
        namespace IosBridge {
            /**
             * Bridge to the cordova-plugin-purchase-braintree-applepay plugin
             */
            class ApplePayPlugin {
                /**
                 * Retrieve the plugin definition.
                 *
                 * Useful to check if it is installed.
                 */
                static get(): CdvPurchaseBraintreeApplePay | undefined;
                /**
                 * Initiate a payment with Apple Pay.
                 */
                static requestPayment(request: ApplePay.PaymentRequest): Promise<ApplePayPaymentResult | IError>;
                /**
                 * Returns true if the device supports Apple Pay.
                 *
                 * This does not necessarily mean the user has a card setup already.
                 */
                static isSupported(log: Logger): Promise<boolean>;
            }
        }
    }
}
declare namespace CdvPurchase {
    namespace Braintree {
        namespace IosBridge {
            interface CdvPurchaseBraintreeApplePay {
                installed?: boolean;
                version?: string;
            }
            interface CdvPurchaseBraintree {
                installed?: boolean;
                version?: string;
            }
            interface BinData {
                prepaid: string;
                healthcare: string;
                debit: string;
                durbinRegulated: string;
                commercial: string;
                payroll: string;
                issuingBank: string;
                countryOfIssuance: string;
                productID: string;
            }
            interface ApplePayPaymentResult {
                /** True if user closed the window without paying. */
                userCancelled?: boolean;
                applePayCardNonce?: {
                    nonce: string;
                    type: string;
                    binData?: BinData;
                };
                payment?: ApplePay.Payment;
            }
            /**
             * Options for enabling Apple Pay payments.
             */
            interface ApplePayOptions {
                /**
                 * Your company name, required to prepare the payment request.
                 *
                 * If you are setting `paymentSummaryItems` manually in `preparePaymentRequest`, this field will
                 * not be used.
                 */
                companyName?: string;
                /**
                 * When the user selects Apple Pay as a payment method, the plugin will initialize a payment request
                 * client side using the PassKit SDK.
                 *
                 * You can customize the ApplePay payment request by implementing the `preparePaymentRequest` function.
                 *
                 * This let's you prefill some information you have on database about the user, limit payment methods,
                 * enable coupon codes, etc.
                 *
                 * @see {@link https://developer.apple.com/documentation/passkit/pkpaymentrequest/}
                 */
                preparePaymentRequest?: (paymentRequest: CdvPurchase.PaymentRequest) => ApplePay.PaymentRequest;
            }
            class Bridge {
                log: Logger;
                clientTokenProvider: ClientTokenProvider;
                applePayOptions?: ApplePayOptions;
                constructor(log: Logger, clientTokenProvider: ClientTokenProvider, applePayOptions?: ApplePayOptions);
                initialize(verbosity: VerbosityProvider, callback: Callback<IError | undefined>): void;
                continueDropInForApplePay(paymentRequest: PaymentRequest, DropInRequest: DropIn.Request, dropInResult: DropIn.Result): Promise<DropIn.Result | IError>;
                launchDropIn(paymentRequest: PaymentRequest, dropInRequest: DropIn.Request): Promise<DropIn.Result | IError>;
                private braintreePlugin;
                static isSupported(): boolean;
            }
        }
    }
}
declare namespace CdvPurchase {
    namespace Braintree {
        namespace DropIn {
            /** A Braintree Drop-In Request */
            interface Request {
                /** Provide the ThreeDSecure request if you need 3DS support */
                threeDSecureRequest?: ThreeDSecure.Request;
                /** Provide the Google Pay request if you need Google Pay support */
                googlePayRequest?: GooglePay.Request;
                /**
                 * the default value used to determine if Drop-in should vault the customer's card.
                 *
                 * This setting can be overwritten by the customer if the save card checkbox is visible using setAllowVaultCardOverride(boolean)
                 *
                 * If the save card CheckBox is shown, and default vault value is true: the save card CheckBox will appear pre-checked.
                 * If the save card CheckBox is shown, and default vault value is false: the save card Checkbox will appear un-checked.
                 * If the save card CheckBox is not shown, and default vault value is true: card always vaults.
                 * If the save card CheckBox is not shown, and default vault value is false: card never vaults.
                 *
                 * This value is true by default.
                 */
                vaultCardDefaultValue?: boolean;
                /**
                 * - true shows save card CheckBox to allow user to choose whether or not to vault their card.
                 * - false does not show Save Card CheckBox.
                 *
                 * Default value is false.
                 */
                allowVaultCardOverride?: boolean;
                /**
                 * Sets the Cardholder Name field status, which is how it will behave in CardForm.
                 *
                 * Default is DISABLED.
                 */
                cardholderNameStatus?: CardFormFieldStatus;
                /**
                 * true to allow customers to manage their vaulted payment methods.
                 *
                 * Defaults to false.
                 */
                vaultManager?: boolean;
                /**
                 * Whether or not to vault the card upon tokenization.
                 *
                 * Can only be applied when initializing the Braintree client with a client token
                 * that was generated with a customer ID.
                 *
                 * When set to `false` with `allowVaultCardOverride` set to `false`, then cards will not be vaulted.
                 *
                 * Defaults to true
                 */
                vaultCard?: boolean;
                /**
                 * If set to true, disables Card in Drop-in. Default value is false.
                 */
                cardDisabled?: boolean;
                /**
                 * True to mask the card number when the field is not focused.
                 *
                 * See com.braintreepayments.cardform.view.CardEditText for more details.
                 *
                 * Android only.
                 */
                maskCardNumber?: boolean;
                /**
                 * true to mask the security code during input. Defaults to false.
                 */
                maskSecurityCode?: boolean;
                /**
                 * Use this parameter to disable Apple Pay.
                 *
                 * Otherwise if Apple Pay is correctly configured, Apple Pay will appear
                 * as a selection in the Payment Method options.
                 */
                applePayDisabled?: boolean;
                /**
                 * Set to true to hide the PayPal option even if enabled for your account.
                 *
                 * Defaults to false. Set to true to hide the PayPal option even if enabled for your account.
                 */
                paypalDisabled?: boolean;
            }
            /** How a field will behave in CardForm. */
            enum CardFormFieldStatus {
                DISABLED = 0,
                OPTIONAL = 1,
                REQUIRED = 2
            }
        }
    }
}
declare namespace CdvPurchase {
    namespace Braintree {
        namespace DropIn {
            interface Result {
                /**
                 * The previously used {@link PaymentMethod} or `undefined` if there was no
                 * previous payment method. If the type is {@link PaymentMethod#GOOGLE_PAY} the Google
                 * Pay flow will need to be performed by the user again at the time of checkout,
                 * {@link #paymentMethodNonce()} will be `undefined` in this case.
                 */
                paymentMethodType?: PaymentMethod;
                /**
                 * The previous {@link PaymentMethodNonce} or `undefined` if there is no previous payment method
                 * or the previous payment method was {@link com.braintreepayments.api.GooglePayCardNonce}.
                 */
                paymentMethodNonce?: PaymentMethodNonce;
                /**
                 * A `deviceData` string that represents data about a customer's device.
                 *
                 * This is generated from Braintree's advanced fraud protection service.
                 *
                 * `deviceData` should be passed into server-side calls, such as `Transaction.sale`.
                 * This enables you to collect data about a customer's device and correlate it with a session identifier on your server.
                 *
                 * Collecting and passing this data with transactions helps reduce decline rates and detect fraudulent transactions.
                 */
                deviceData?: string;
                /**
                 * A description of the payment method.
                 *
                 * - For cards, the last four digits of the card number.
                 * - For PayPal, the email address associated with the account.
                 * - For Venmo, the username associated with the account.
                 * - For Apple Pay, the text "Apple Pay".
                 */
                paymentDescription?: string;
            }
            /**
             * A method of payment for a customer.
             *
             * PaymentMethodNonce represents the common interface of all payment method nonces,
             * and can be handled by a server interchangeably.
             */
            interface PaymentMethodNonce {
                /**
                 * The nonce generated for this payment method by the Braintree gateway.
                 *
                 * The nonce will represent this PaymentMethod for the purposes of creating transactions and other monetary actions.
                 */
                nonce: string;
                /** true if this payment method is the default for the current customer, false otherwise. */
                isDefault: boolean;
                /**
                 * The type of the tokenized data, e.g. PayPal, Venmo, MasterCard, Visa, Amex.
                 *
                 * (iOS Only)
                 */
                type?: string;
            }
            /** Payment method used or selected by the user. */
            enum PaymentMethod {
                /** Google only */
                GOOGLE_PAY = "GOOGLE_PAY",
                /** ios only */
                LASER = "LASER",
                /** ios only */
                UK_MAESTRO = "UK_MAESTRO",
                /** ios only */
                SWITCH = "SWITCH",
                /** ios only */
                SOLOR = "SOLO",
                /** ios only */
                APPLE_PAY = "APPLE_PAY",
                AMEX = "AMEX",
                DINERS_CLUB = "DINERS_CLUB",
                DISCOVER = "DISCOVER",
                JCB = "JCB",
                MAESTRO = "MAESTRO",
                MASTERCARD = "MASTERCARD",
                PAYPAL = "PAYPAL",
                VISA = "VISA",
                VENMO = "VENMO",
                UNIONPAY = "UNIONPAY",
                HIPER = "HIPER",
                HIPERCARD = "HIPERCARD",
                UNKNOWN = "UNKNOWN"
            }
        }
    }
}
declare namespace CdvPurchase {
    namespace Braintree {
        namespace GooglePay {
            /**
             * Used to initialize a Google Pay payment flow.
             *
             * Represents the parameters that are needed to use the Google Pay API.
             */
            interface Request {
                /**
                 * ISO 3166-1 alpha-2 country code where the transaction is processed.
                 *
                 * This is required for merchants based in European Economic Area (EEA) countries.
                 *
                 * NOTE: to support Elo cards, country code must be set to "BR"
                 */
                countryCode?: string;
                /**
                 * Defines if PayPal should be an available payment method in Google Pay.
                 *
                 * {@code true} by default
                 */
                payPalEnabled?: boolean;
                /**
                 * Google Merchant ID is no longer required and will be removed.
                 *
                 * @deprecated Google Merchant ID is no longer required and will be removed.
                 */
                googleMerchantId?: string;
                /** The merchant name that will be presented in Google Pay */
                googleMerchantName?: string;
                /** If set to true, the user must provide a billing address. */
                billingAddressRequired?: boolean;
                billingAddressFormat?: BillingAddressFormat;
                /** If set to true, the user must provide a shipping address. */
                shippingAddressRequired?: boolean;
                /** Optional shipping address requirements for the returned shipping address. */
                shippingAddressRequirements?: ShippingAddressRequirements;
                emailRequired?: boolean;
                phoneNumberRequired?: boolean;
                /** Set to false if you don't support prepaid cards. Default: The prepaid card class is supported. */
                allowPrepaidCards?: boolean;
                /**
                 * Details and the price of the transaction.
                 *
                 * Automatically filled by the plugin from the `PaymentRequest`.
                 */
                transactionInfo?: TransactionInfo;
                /**
                 * The payment method(s) that are allowed to be used.
                 */
                allowedPaymentMethod?: AllowedPaymentMethod[];
                /** A string that represents the environment in which the Google Pay API will be used (e.g. "TEST" or "PRODUCTION"). */
                environment?: string;
            }
            /**
             * A string that represents the type of payment method. This can be one of the following values:
             * - "CARD": A credit or debit card.
             * - "TOKENIZED_CARD": A tokenized credit or debit card.
             */
            type PaymentMethodType = 'CARD' | 'TOKENIZED_CARD' | 'PAYPAL';
            /**
             * A payment method(s) that is allowed to be used.
             *
             * @example
             * {
             *   type: "CARD",
             *   parameters: {
             *     allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
             *     allowedCardNetworks: ["AMEX", "DISCOVER", "VISA", "MASTERCARD"]
             *   }
             * }
             */
            interface AllowedPaymentMethod {
                /**
                * A string that represents the type of payment method. This can be one of the following values:
                * - "CARD": A credit or debit card.
                * - "TOKENIZED_CARD": A tokenized credit or debit card.
                */
                type: PaymentMethodType;
                /**
                 * One or more card networks that you support, also supported by the Google Pay API.
                 *
                 * @see {@link https://developers.google.com/pay/api/android/reference/request-objects#CardParameters}
                 */
                allowedCardNetworks?: string[];
                /**
                 * Fields supported to authenticate a card transaction.
                 *
                 * @see {@link https://developers.google.com/pay/api/android/reference/request-objects#CardParameters}
                 */
                allowedAuthMethods?: string[];
                /**
                 * Additional parameters for the payment method. The specific parameters depend on the payment method type.
                 *
                 * For example "assuranceDetailsRequired", "allowCreditCards", etc.
                 *
                 * @see {@link https://developers.google.com/pay/api/android/reference/request-objects#CardParameters}
                 */
                parameters?: {
                    [key: string]: any;
                };
                /**
                 * Tokenization specification for this payment method type.
                 */
                tokenizationSpecification?: {
                    [key: string]: any;
                };
            }
            interface ShippingAddressRequirements {
                /**
                 * An array of strings that represents the list of country codes (in ISO 3166-1 alpha-2 format)
                 * in which the shipping address must be located.
                 *
                 * If this field is not empty, the shipping address must be in one of the specified countries.
                 */
                allowedCountryCodes: string[];
            }
            /**
             * The Google Pay API will collect the billing address for you if required
             */
            enum BillingAddressFormat {
                /**
                 * When this format is used, the billing address returned will only contain the minimal info, including name, country code, and postal code.
                 *
                 * Note that some countries do not use postal codes, so the postal code field will be empty in those countries.
                 */
                MIN = 0,
                /**
                 * When this format is used, the billing address returned will be the full address.
                 *
                 * Only select this format when it's required to process the order since it can increase friction during the checkout process and can lead to a lower conversion rate.
                 */
                FULL = 1
            }
            /**
             * Represents information about a transaction.
             *
             * This interface represents information about a transaction, including the currency code (in ISO 4217 format), the total price, and the status of the total price.
             * The totalPriceStatus field is of type TotalPriceStatus, which is an enum that can take on one of the following values:
             * - TotalPriceStatus.ESTIMATED: The total price is an estimate.
             * - TotalPriceStatus.FINAL: The total price is final.
             */
            interface TransactionInfo {
                /**
                 * ISO 4217 currency code of the transaction.
                 */
                currencyCode: string;
                /**
                 * Total price of the transaction.
                 */
                totalPrice: number;
                /**
                 * Status of the total price.
                 */
                totalPriceStatus: TotalPriceStatus;
            }
            /**
             * This enum represents the status of the total price of a transaction.
             *
             * It can take on one of the following values:
             * - TotalPriceStatus.NOT_CURRENTLY_KNOWN: The total price is not currently known.
             * - TotalPriceStatus.ESTIMATED: The total price is an estimate.
             * - TotalPriceStatus.FINAL: The total price is final.
             */
            enum TotalPriceStatus {
                /** The total price is not currently known. */
                NOT_CURRENTLY_KNOWN = 1,
                /** The total price is an estimate. */
                ESTIMATED = 2,
                /** The total price is final. */
                FINAL = 3
            }
        }
    }
}
declare namespace CdvPurchase {
    namespace Braintree {
        namespace ThreeDSecure {
            /**
             * Used to initialize a 3D Secure payment flow.
             */
            interface Request {
                /**
                 * Amount for the transaction.
                 *
                 * String representation of a decimal number.
                 *
                 * Automatically filled from the `PaymentRequest`.
                 */
                amount?: string;
                /**
                 * A nonce to be verified by ThreeDSecure.
                 */
                nonce?: string;
                /**
                 *  The email used for verification. Optional.
                 *
                 * Automatically filled from the `PaymentRequest`
                 */
                email?: string;
                /**
                 * The billing address used for verification. Optional.
                 *
                 * Automatically filled from the `PaymentRequest`
                 */
                billingAddress?: PostalAddress;
                /**
                 * The mobile phone number used for verification.
                 *
                 * Only numbers. Remove dashes, parentheses and other characters.
                 */
                mobilePhoneNumber?: string;
                /** The shipping method chosen for the transaction. */
                shippingMethod?: ShippingMethod;
                /**
                 * The account type selected by the cardholder.
                 *
                 * Note: Some cards can be processed using either a credit or debit account and cardholders have the option to choose which account to use.
                 */
                accountType?: AccountType;
                /** The additional information used for verification. */
                additionalInformation?: AdditionalInformation;
                /** Set to V2 if ThreeDSecure V2 flows are desired, when possible. Defaults to V2 */
                versionRequested?: Version;
                /** If set to true, an authentication challenge will be forced if possible. */
                challengeRequested?: boolean;
                /**  If set to true, an exemption to the authentication challenge will be requested. */
                exemptionRequested?: boolean;
                /**
                 * An authentication created using this property should only be used for adding a payment method to the merchant’s vault and not for creating transactions.
                 *
                 * If set to true (REQUESTED), the authentication challenge will be requested from the issuer to confirm adding new card to the merchant’s vault.
                 * If set to false (NOT_REQUESTED) the authentication challenge will not be requested from the issuer. If set to BTThreeDSecureAddCardChallengeUnspecified, when the amount is 0, the authentication challenge will be requested from the issuer.
                 * If set to undefined (UNSPECIFIED), when the amount is greater than 0, the authentication challenge will not be requested from the issuer.
                 */
                cardAddChallenge?: boolean;
            }
            /** The account type */
            enum AccountType {
                UNSPECIFIED = "00",
                CREDIT = "01",
                DEBIT = "02"
            }
            /** The shipping method */
            enum ShippingMethod {
                /** Unspecified */
                UNSPECIFIED = 0,
                /** Same say */
                SAME_DAY = 1,
                /** Overnight / Expedited */
                EXPEDITED = 2,
                /** Priority */
                PRIORITY = 3,
                /** Ground */
                GROUND = 4,
                /** Electronic delivery */
                ELECTRONIC_DELIVERY = 5,
                /** Ship to store */
                SHIP_TO_STORE = 6
            }
            /** Additional information for a 3DS lookup. Used in 3DS 2.0+ flows. */
            interface AdditionalInformation {
                /** The shipping address used for verification */
                shippingAddress?: PostalAddress;
                /**
                 * The 2-digit string indicating the shipping method chosen for the transaction
                 *
                 * Possible Values:
                 *  - "01": Ship to cardholder billing address
                 *  - "02": Ship to another verified address on file with merchant
                 *  - "03": Ship to address that is different than billing address
                 *  - "04": Ship to store (store address should be populated on request)
                 *  - "05": Digital goods
                 *  - "06": Travel and event tickets, not shipped
                 *  - "07": Other
                 */
                shippingMethodIndicator?: "01" | "02" | "03" | "04" | "05" | "06" | "07";
                /**
                 * The 3-letter string representing the merchant product code
                 *
                 * Possible Values:
                 *  - "AIR": Airline
                 *  - "GEN": General Retail
                 *  - "DIG": Digital Goods
                 *  - "SVC": Services
                 *  - "RES": Restaurant
                 *  - "TRA": Travel
                 *  - "DSP": Cash Dispensing
                 *  - "REN": Car Rental
                 *  - "GAS": Fueld
                 *  - "LUX": Luxury Retail
                 *  - "ACC": Accommodation Retail
                 *  - "TBD": Other
                 */
                productCode?: "AIR" | "GEN" | "DIG" | "SVC" | "RES" | "TRA" | "DSP" | "REN" | "GAS" | "LUX" | "ACC" | "TBD";
                /**
                 * The 2-digit number indicating the delivery timeframe
                 *
                 * Possible values:
                 *  - "01": Electronic delivery
                 *  - "02": Same day shipping
                 *  - "03": Overnight shipping
                 *  - "04": Two or more day shipping
                 */
                deliveryTimeframe?: "01" | "02" | "03" | "04";
                /** For electronic delivery, email address to which the merchandise was delivered */
                deliveryEmail?: string;
                /**
                 * The 2-digit number indicating whether the cardholder is reordering previously purchased merchandise
                 *
                 * Possible values:
                 *  - "01": First time ordered
                 *  - "02": Reordered
                 */
                reorderIndicator?: "01" | "02";
                /**
                 * The 2-digit number indicating whether the cardholder is placing an order with a future availability or release date
                 *
                 * Possible values:
                 *  - "01": Merchandise available
                 *  - "02": Future availability
                 */
                preorderIndicator?: "01" | "02";
                /** The 8-digit number (format: YYYYMMDD) indicating expected date that a pre-ordered purchase will be available */
                preorderDate?: string;
                /** The purchase amount total for prepaid gift cards in major units */
                giftCardAmount?: string;
                /** ISO 4217 currency code for the gift card purchased */
                giftCardCurrencyCode?: string;
                /** Total count of individual prepaid gift cards purchased */
                giftCardCount?: string;
                /**
                 * The 2-digit value representing the length of time cardholder has had account.
                 *
                 * Possible values:
                 *  - "01": No account
                 *  - "02": Created during transaction
                 *  - "03": Less than 30 days
                 *  - "04": 30-60 days
                 *  - "05": More than 60 days
                 */
                accountAgeIndicator?: "01" | "02" | "03" | "04" | "05";
                /** The 8-digit number (format: YYYYMMDD) indicating the date the cardholder opened the account. */
                accountCreateDate?: string;
                /** The 2-digit value representing the length of time since the last change to the cardholder account. This includes shipping address, new payment account or new user added.
                 *
                 * Possible values:
                 *  - "01": Changed during transaction
                 *  - "02": Less than 30 days
                 *  - "03": 30-60 days
                 *  - "04": More than 60 days
                 */
                accountChangeIndicator?: "01" | "02" | "03" | "04";
                /** The 8-digit number (format: YYYYMMDD) indicating the date the cardholder's account was last changed. This includes changes to the billing or shipping address, new payment accounts or new users added. */
                accountChangeDate?: string;
                /**
                 * Optional. The 2-digit value representing the length of time since the cardholder changed or reset the password on the account.
                 * Possible values:
                 * 01 No change
                 * 02 Changed during transaction
                 * 03 Less than 30 days
                 * 04 30-60 days
                 * 05 More than 60 days
                 */
                accountPwdChangeIndicator?: "01" | "02" | "03" | "04" | "05";
                /**
                 * Optional. The 8-digit number (format: YYYYMMDD) indicating the date the cardholder last changed or reset password on account.
                 */
                accountPwdChangeDate?: string;
                /**
                 * Optional. The 2-digit value indicating when the shipping address used for transaction was first used.
                 *
                 * Possible values:
                 * 01 This transaction
                 * 02 Less than 30 days
                 * 03 30-60 days
                 * 04 More than 60 days
                 */
                shippingAddressUsageIndicator?: "01" | "02" | "03" | "04";
                /**
                 * Optional. The 8-digit number (format: YYYYMMDD) indicating the date when the shipping address used for this transaction was first used.
                 */
                shippingAddressUsageDate?: string;
                /**
                 * Optional. Number of transactions (successful or abandoned) for this cardholder account within the last 24 hours.
                 */
                transactionCountDay?: string;
                /**
                 * Optional. Number of transactions (successful or abandoned) for this cardholder account within the last year.
                 */
                transactionCountYear?: string;
                /**
                 * Optional. Number of add card attempts in the last 24 hours.
                 */
                addCardAttempts?: string;
                /**
                 * Optional. Number of purchases with this cardholder account during the previous six months.
                 */
                accountPurchases?: string;
                /**
                 * Optional. The 2-digit value indicating whether the merchant experienced suspicious activity (including previous fraud) on the account.
                 * Possible values:
                 * 01 No suspicious activity
                 * 02 Suspicious activity observed
                 */
                fraudActivity?: "01" | "02";
                /**
                 * Optional. The 2-digit value indicating if the cardholder name on the account is identical to the shipping name used for the transaction.
                 * Possible values:
                 * 01 Account name identical to shipping name
                 * 02 Account name different than shipping name
                 */
                shippingNameIndicator?: "01" | "02";
                /**
                 * Optional. The 2-digit value indicating the length of time that the payment account was enrolled in the merchant account.
                 * Possible values:
                 * 01 No account (guest checkout)
                 * 02 During the transaction
                 * 03 Less than 30 days
                 * 04 30-60 days
                 * 05 More than 60 days
                 */
                paymentAccountIndicator?: "01" | "02" | "03" | "04" | "05";
                /**
                 * Optional. The 8-digit number (format: YYYYMMDD) indicating the date the payment account was added to the cardholder account.
                 */
                paymentAccountAge?: string;
                /**
                 * Optional. The 1-character value (Y/N) indicating whether cardholder billing and shipping addresses match.
                 */
                addressMatch?: string;
                /**
                 * Optional. Additional cardholder account information.
                 */
                accountID?: string;
                /**
                 * Optional. The IP address of the consumer. IPv4 and IPv6 are supported.
                 */
                ipAddress?: string;
                /**
                 * Optional. Brief description of items purchased.
                 */
                orderDescription?: string;
                /**
                 * Optional. Unformatted tax amount without any decimalization (ie. $123.67 = 12367).
                 */
                taxAmount?: string;
                /**
                 * Optional. The exact content of the HTTP user agent header.
                 */
                userAgent?: string;
                /**
                 * Optional. The 2-digit number indicating the type of authentication request.
                 * Possible values:
                 * 02 Recurring transaction
                 * 03 Installment transaction
                 */
                authenticationIndicator?: "02" | "03";
                /**
                 * Optional.  An integer value greater than 1 indicating the maximum number of permitted authorizations for installment payments.
                 */
                installment?: string;
                /**
                 * Optional. The 14-digit number (format: YYYYMMDDHHMMSS) indicating the date in UTC of original purchase.
                 */
                purchaseDate?: string;
                /**
                 * Optional. The 8-digit number (format: YYYYMMDD) indicating the date after which no further recurring authorizations should be performed..
                 */
                recurringEnd?: string;
                /**
                 * Optional. Integer value indicating the minimum number of days between recurring authorizations. A frequency of monthly is indicated by the value 28. Multiple of 28 days will be used to indicate months (ex. 6 months = 168).
                 */
                recurringFrequency?: string;
                /**
                 * Optional. The 2-digit number of minutes (minimum 05) to set the maximum amount of time for all 3DS 2.0 messages to be communicated between all components.
                 */
                sdkMaxTimeout?: string;
                /**
                 * Optional. The work phone number used for verification. Only numbers; remove dashes, parenthesis and other characters.
                 */
                workPhoneNumber?: string;
            }
            enum Version {
                /** 3DS 1.0 */
                V1 = 0,
                /** 3DS 2.0 */
                V2 = 1
            }
            /** The card add challenge request */
            /**
             * Postal address for 3D Secure flows.
             *
             * @link https://braintree.github.io/braintree_ios/current/Classes/BTThreeDSecurePostalAddress.html
             */
            interface PostalAddress {
                /** Given name associated with the address. */
                givenName?: string;
                /** Surname associated with the address. */
                surname?: string;
                /** Line 1 of the Address (eg. number, street, etc) */
                streetAddress?: string;
                /** Line 2 of the Address (eg. suite, apt #, etc.) */
                extendedAddress?: string;
                /** Line 3 of the Address (eg. suite, apt #, etc.) */
                line3?: string;
                /** City name */
                locality?: string;
                /** Either a two-letter state code (for the US), or an ISO-3166-2 country subdivision code of up to three letters. */
                region?: string;
                /**
                 * Zip code or equivalent is usually required for countries that have them.
                 *
                 * For a list of countries that do not have postal codes please refer to http://en.wikipedia.org/wiki/Postal_code
                 */
                postalCode?: string;
                /**
                 * The phone number associated with the address
                 *
                 * Note: Only numbers. Remove dashes, parentheses and other characters
                 */
                phoneNumber?: string;
                /**
                 * 2 letter country code
                 */
                countryCodeAlpha2?: string;
            }
        }
    }
}
declare namespace CdvPurchase {
    namespace GooglePlay {
        class Transaction extends CdvPurchase.Transaction {
            nativePurchase: Bridge.Purchase;
            constructor(purchase: Bridge.Purchase, parentReceipt: Receipt, decorator: Internal.TransactionDecorator);
            static toState(state: Bridge.PurchaseState, isAcknowledged: boolean, isConsumed: boolean): TransactionState;
            /**
             * Refresh the value in the transaction based on the native purchase update
             */
            refresh(purchase: Bridge.Purchase): void;
        }
        class Receipt extends CdvPurchase.Receipt {
            /** Token that uniquely identifies a purchase for a given item and user pair. */
            purchaseToken: string;
            /** Unique order identifier for the transaction.  (like GPA.XXXX-XXXX-XXXX-XXXXX) */
            orderId?: string;
            /** @internal */
            constructor(purchase: Bridge.Purchase, decorator: Internal.TransactionDecorator & Internal.ReceiptDecorator);
            /** Refresh the content of the purchase based on the native BridgePurchase */
            refreshPurchase(purchase: Bridge.Purchase): void;
        }
        class Adapter implements CdvPurchase.Adapter {
            /** Adapter identifier */
            id: Platform;
            /** Adapter name */
            name: string;
            /** Has the adapter been successfully initialized */
            ready: boolean;
            supportsParallelLoading: boolean;
            /** List of products managed by the GooglePlay adapter */
            get products(): GProduct[];
            private _products;
            get receipts(): Receipt[];
            private _receipts;
            /** The GooglePlay bridge */
            bridge: Bridge.Bridge;
            /** Prevent double initialization */
            initialized: boolean;
            /** Used to retry failed commands */
            retry: Internal.Retry<Function>;
            private context;
            private log;
            autoRefreshIntervalMillis: number;
            static trimProductTitles: boolean;
            static _instance: Adapter;
            constructor(context: Internal.AdapterContext, autoRefreshIntervalMillis?: number);
            private initializationPromise?;
            /** Returns true on Android, the only platform supported by this adapter */
            get isSupported(): boolean;
            initialize(): Promise<undefined | IError>;
            /** Prepare the list of SKUs sorted by type */
            getSkusOf(products: IRegisterProduct[]): {
                inAppSkus: string[];
                subsSkus: string[];
            };
            /** @inheritdoc */
            loadReceipts(): Promise<CdvPurchase.Receipt[]>;
            /** @inheritDoc */
            loadProducts(products: IRegisterProduct[]): Promise<(GProduct | IError)[]>;
            /** @inheritDoc */
            finish(transaction: CdvPurchase.Transaction): Promise<IError | undefined>;
            /** Called by the bridge when a purchase has been consumed */
            onPurchaseConsumed(purchase: Bridge.Purchase): void;
            /** Called when the platform reports update for some purchases */
            onPurchasesUpdated(purchases: Bridge.Purchase[]): void;
            /** Called when the platform reports some purchases */
            onSetPurchases(purchases: Bridge.Purchase[]): void;
            onPriceChangeConfirmationResult(result: "OK" | "UserCanceled" | "UnknownProduct"): void;
            /** Refresh purchases from GooglePlay */
            getPurchases(): Promise<IError | undefined>;
            /** @inheritDoc */
            order(offer: GOffer, additionalData: CdvPurchase.AdditionalData): Promise<IError | undefined>;
            /**
             * Find a purchaseToken for an owned product in the same group as the requested one.
             *
             * @param productId - The product identifier to request matching purchaseToken for.
             * @param productGroup - The group of the product to request matching purchaseToken for.
             *
             * @return A purchaseToken, undefined if none have been found.
             */
            findOldPurchaseToken(productId: string, productGroup?: string): string | undefined;
            /**
             * Prepare for receipt validation
             */
            receiptValidationBody(receipt: Receipt): Promise<Validator.Request.Body | undefined>;
            handleReceiptValidationResponse(receipt: CdvPurchase.Receipt, response: Validator.Response.Payload): Promise<void>;
            requestPayment(payment: PaymentRequest, additionalData?: CdvPurchase.AdditionalData): Promise<IError | Transaction | undefined>;
            manageSubscriptions(): Promise<IError | undefined>;
            manageBilling(): Promise<IError | undefined>;
            checkSupport(functionality: PlatformFunctionality): boolean;
            restorePurchases(): Promise<IError | undefined>;
        }
    }
}
declare namespace CdvPurchase {
    namespace GooglePlay {
        namespace Bridge {
            interface Subscription {
                product_format: "v12.0";
                product_type: "subs";
                productId: string;
                name: string;
                title: string;
                description: string;
                offers: SubscriptionOffer[];
            }
            interface SubscriptionOffer {
                /** Base plan id associated with the subscription product (since billing library v6). */
                base_plan_id: string | null;
                /** Offer id associated with the subscription product (since billing library v6). */
                offer_id: string | null;
                /** Token required to pass in launchBillingFlow to purchase the subscription product with these pricing phases. */
                token: string;
                /** Tags associated with this Subscription Offer. */
                tags: string[];
                /** Pricing phases for the subscription product. */
                pricing_phases: PricingPhase[];
            }
            enum RecurrenceMode {
                FINITE_RECURRING = "FINITE_RECURRING",
                INFINITE_RECURRING = "INFINITE_RECURRING",
                NON_RECURRING = "NON_RECURRING"
            }
            interface PricingPhase {
                recurrence_mode: RecurrenceMode;
                billing_period: string;
                billing_cycle_count: number;
                formatted_price: string;
                price_amount_micros: number;
                price_currency_code: string;
            }
            interface InAppProduct {
                product_format: "v12.0" | "v11.0";
                product_type: "inapp";
                productId: string;
                name?: string;
                title?: string;
                description?: string;
                price_currency_code?: string;
                formatted_price?: string;
                price?: string;
                price_amount_micros?: number;
            }
        }
    }
}
declare namespace CdvPurchase {
    namespace GooglePlay {
        /** Replace SKU ProrationMode.
         *
         * See https://developer.android.com/reference/com/android/billingclient/api/BillingFlowParams.ProrationMode */
        enum ProrationMode {
            /** Replacement takes effect immediately, and the remaining time will be prorated and credited to the user. */
            IMMEDIATE_WITH_TIME_PRORATION = "IMMEDIATE_WITH_TIME_PRORATION",
            /** Replacement takes effect immediately, and the billing cycle remains the same. */
            IMMEDIATE_AND_CHARGE_PRORATED_PRICE = "IMMEDIATE_AND_CHARGE_PRORATED_PRICE",
            /** Replacement takes effect immediately, and the new price will be charged on next recurrence time. */
            IMMEDIATE_WITHOUT_PRORATION = "IMMEDIATE_WITHOUT_PRORATION",
            /** Replacement takes effect when the old plan expires, and the new price will be charged at the same time. */
            DEFERRED = "DEFERRED",
            /** Replacement takes effect immediately, and the user is charged full price of new plan and is given a full billing cycle of subscription, plus remaining prorated time from the old plan. */
            IMMEDIATE_AND_CHARGE_FULL_PRICE = "IMMEDIATE_AND_CHARGE_FULL_PRICE"
        }
        interface AdditionalData {
            /** The GooglePlay offer token */
            offerToken?: string;
            /** Replace another purchase with the new one
             *
             * Your can find the old token in the receipts. */
            oldPurchaseToken?: string;
            /**
             * Obfuscated user account identifier
             *
             * Default to md5(store.applicationUsername)
             */
            accountId?: string;
            /**
             * Some applications allow users to have multiple profiles within a single account.
             *
             * Use this method to send the user's profile identifier to Google.
             */
            profileId?: string;
            /** See https://github.com/j3k0/cordova-plugin-purchase/blob/master/doc/api.md#storeorderproduct-additionaldata for details */
            prorationMode?: ProrationMode;
        }
        namespace Bridge {
            interface Options {
                log?: (msg: string) => void;
                showLog?: boolean;
                onPurchaseConsumed?: (purchase: Purchase) => void;
                onPurchasesUpdated?: (purchases: Purchase[]) => void;
                onSetPurchases?: (purchases: Purchase[]) => void;
                onPriceChangeConfirmationResult?: (result: "OK" | "UserCanceled" | "UnknownProduct") => void;
            }
            type ErrorCallback = (message: string, code?: ErrorCode) => void;
            interface Purchase {
                /** Unique order identifier for the transaction.  (like GPA.XXXX-XXXX-XXXX-XXXXX) */
                orderId?: string;
                /** Application package from which the purchase originated. */
                packageName: string;
                /** Identifier of the purchased product.
                 *
                 * @deprecated - use productIds (since Billing v5 a single purchase can contain multiple products) */
                productId: string;
                /** Identifier of the purchased products */
                productIds: string[];
                /** Time the product was purchased, in milliseconds since the epoch (Jan 1, 1970). */
                purchaseTime: number;
                /** Payload specified when the purchase was acknowledged or consumed.
                 *
                 * @deprecated - This was removed from Billing v5 */
                developerPayload: string;
                /** Purchase state in the original JSON
                 *
                 * @deprecated - use getPurchaseState */
                purchaseState: number;
                /** Token that uniquely identifies a purchase for a given item and user pair. */
                purchaseToken: string;
                /** quantity of the purchased product */
                quantity: number;
                /** Whether the purchase has been acknowledged. */
                acknowledged: boolean;
                /** Whether the purchase has been consumed */
                consumed?: boolean;
                /** One of BridgePurchaseState indicating the state of the purchase. */
                getPurchaseState: PurchaseState;
                /** Whether the subscription renews automatically. */
                autoRenewing: false;
                /** String containing the signature of the purchase data that was signed with the private key of the developer. */
                signature: string;
                /** String in JSON format that contains details about the purchase order. */
                receipt: string;
                /** Obfuscated account id specified at purchase - by default md5(applicationUsername) */
                accountId: string;
                /** Obfuscated profile id specified at purchase - used when a single user can have multiple profiles */
                profileId: string;
            }
            enum PurchaseState {
                UNSPECIFIED_STATE = 0,
                PURCHASED = 1,
                PENDING = 2
            }
            type Message = {
                type: "setPurchases";
                data: {
                    purchases: Purchase[];
                };
            } | {
                type: "purchasesUpdated";
                data: {
                    purchases: Purchase[];
                };
            } | {
                type: "purchaseConsumed";
                data: {
                    purchase: Purchase;
                };
            } | {
                type: "onPriceChangeConfirmationResultOK" | "onPriceChangeConfirmationResultUserCanceled" | "onPriceChangeConfirmationResultUnknownSku";
                data: {
                    purchase: Purchase;
                };
            };
            class Bridge {
                options: Options;
                init(success: () => void, fail: ErrorCallback, options: Options): void;
                load(success: () => void, fail: ErrorCallback, skus: string[], inAppSkus: string[], subsSkus: string[]): void;
                listener(msg: Message): void;
                getPurchases(success: () => void, fail: ErrorCallback): void;
                buy(success: () => void, fail: ErrorCallback, productId: string, additionalData: CdvPurchase.AdditionalData): void;
                subscribe(success: () => void, fail: ErrorCallback, productId: string, additionalData: CdvPurchase.AdditionalData): void;
                consumePurchase(success: () => void, fail: ErrorCallback, purchaseToken: string): void;
                acknowledgePurchase(success: () => void, fail: ErrorCallback, purchaseToken: string): void;
                getAvailableProducts(inAppSkus: string[], subsSkus: string[], success: (validProducts: (InAppProduct | Subscription)[]) => void, fail: ErrorCallback): void;
                manageSubscriptions(): void;
                manageBilling(): void;
                launchPriceChangeConfirmationFlow(productId: string): void;
            }
        }
    }
}
declare namespace CdvPurchase {
    namespace GooglePlay {
        class GProduct extends CdvPurchase.Product {
        }
        class InAppOffer extends CdvPurchase.Offer {
            type: string;
        }
        class SubscriptionOffer extends CdvPurchase.Offer {
            type: string;
            tags: string[];
            token: string;
            constructor(options: {
                id: string;
                product: GProduct;
                pricingPhases: PricingPhase[];
                tags: string[];
                token: string;
            }, decorator: Internal.OfferDecorator);
        }
        type GOffer = InAppOffer | SubscriptionOffer;
        class Products {
            /** Decorate products API  */
            private decorator;
            constructor(decorator: Internal.ProductDecorator & Internal.OfferDecorator);
            /** List of products managed by the GooglePlay adapter */
            products: GProduct[];
            getProduct(id: string): GProduct | undefined;
            /** List of offers managed by the GooglePlay adapter */
            offers: GOffer[];
            getOffer(id: string): GOffer | undefined;
            /**  */
            addProduct(registeredProduct: IRegisterProduct, vp: Bridge.InAppProduct | Bridge.Subscription): GProduct;
            private onSubsV12Loaded;
            private makeOfferId;
            private iabSubsOfferV12Loaded;
            private onInAppLoaded;
            private toPaymentMode;
            private toRecurrenceMode;
            private toPricingPhase;
        }
    }
}
declare namespace CdvPurchase {
    namespace GooglePlay {
        namespace PublisherAPI {
            /**
             * A SubscriptionPurchase resource indicates the status of a user's subscription purchase.
             */
            interface SubscriptionPurchase_API {
                /**
                 * This kind represents a subscriptionPurchase object in the androidpublisher service.
                 */
                kind: "androidpublisher#subscriptionPurchase";
                /**
                 * The acknowledgement state of the subscription product. Possible values are: 0. Yet to be acknowledged 1. Acknowledged
                 */
                acknowledgementState?: number | null;
                /**
                 * Whether the subscription will automatically be renewed when it reaches its current expiry time.
                 */
                autoRenewing?: boolean | null;
                /**
                 * Time at which the subscription will be automatically resumed, in milliseconds since the Epoch. Only present if the user has requested to pause the subscription.
                 */
                autoResumeTimeMillis?: string | null;
                /**
                 * The reason why a subscription was canceled or is not auto-renewing. Possible values are: 0. User canceled the subscription 1. Subscription was canceled by the system, for example because of a billing problem 2. Subscription was replaced with a new subscription 3. Subscription was canceled by the developer
                 */
                cancelReason?: number | null;
                /**
                 * Information provided by the user when they complete the subscription cancellation flow (cancellation reason survey).
                 */
                cancelSurveyResult?: SubscriptionCancelSurveyResult;
                /**
                 * ISO 3166-1 alpha-2 billing country/region code of the user at the time the subscription was granted.
                 */
                countryCode?: string | null;
                /**
                 * A developer-specified string that contains supplemental information about an order.
                 */
                developerPayload?: string | null;
                /**
                 * The email address of the user when the subscription was purchased. Only present for purchases made with 'Subscribe with Google'.
                 */
                emailAddress?: string | null;
                /**
                 * Time at which the subscription will expire, in milliseconds since the Epoch.
                 */
                expiryTimeMillis?: string | null;
                /**
                 * User account identifier in the third-party service. Only present if account linking happened as part of the subscription purchase flow.
                 */
                externalAccountId?: string | null;
                /**
                 * The family name of the user when the subscription was purchased. Only present for purchases made with 'Subscribe with Google'.
                 */
                familyName?: string | null;
                /**
                 * The given name of the user when the subscription was purchased. Only present for purchases made with 'Subscribe with Google'.
                 */
                givenName?: string | null;
                /**
                 * Introductory price information of the subscription. This is only present when the subscription was purchased with an introductory price. This field does not indicate the subscription is currently in introductory price period.
                 */
                introductoryPriceInfo?: IntroductoryPriceInfo;
                /**
                 * The purchase token of the originating purchase if this subscription is one of the following: 0. Re-signup of a canceled but non-lapsed subscription 1. Upgrade/downgrade from a previous subscription For example, suppose a user originally signs up and you receive purchase token X, then the user cancels and goes through the resignup flow (before their subscription lapses) and you receive purchase token Y, and finally the user upgrades their subscription and you receive purchase token Z. If you call this API with purchase token Z, this field will be set to Y. If you call this API with purchase token Y, this field will be set to X. If you call this API with purchase token X, this field will not be set.
                 */
                linkedPurchaseToken?: string | null;
                /**
                 * An obfuscated version of the id that is uniquely associated with the user's account in your app. Present for the following purchases: * If account linking happened as part of the subscription purchase flow. * It was specified using https://developer.android.com/reference/com/android/billingclient/api/BillingFlowParams.Builder#setobfuscatedaccountid when the purchase was made.
                 */
                obfuscatedExternalAccountId?: string | null;
                /**
                 * An obfuscated version of the id that is uniquely associated with the user's profile in your app. Only present if specified using https://developer.android.com/reference/com/android/billingclient/api/BillingFlowParams.Builder#setobfuscatedprofileid when the purchase was made.
                 */
                obfuscatedExternalProfileId?: string | null;
                /**
                 * The order id of the latest recurring order associated with the purchase of the subscription. If the subscription was canceled because payment was declined, this will be the order id from the payment declined order.
                 */
                orderId?: string | null;
                /**
                 * The payment state of the subscription. Possible values are: 0. Payment pending 1. Payment received 2. Free trial 3. Pending deferred upgrade/downgrade Not present for canceled, expired subscriptions.
                 */
                paymentState?: number | null;
                /**
                 * Price of the subscription, For tax exclusive countries, the price doesn't include tax. For tax inclusive countries, the price includes tax. Price is expressed in micro-units, where 1,000,000 micro-units represents one unit of the currency. For example, if the subscription price is €1.99, price_amount_micros is 1990000.
                 */
                priceAmountMicros?: string | null;
                /**
                 * The latest price change information available. This is present only when there is an upcoming price change for the subscription yet to be applied. Once the subscription renews with the new price or the subscription is canceled, no price change information will be returned.
                 */
                priceChange?: SubscriptionPriceChange;
                /**
                 * ISO 4217 currency code for the subscription price. For example, if the price is specified in British pounds sterling, price_currency_code is "GBP".
                 */
                priceCurrencyCode?: string | null;
                /**
                 * The Google profile id of the user when the subscription was purchased. Only present for purchases made with 'Subscribe with Google'.
                 */
                profileId?: string | null;
                /**
                 * The profile name of the user when the subscription was purchased. Only present for purchases made with 'Subscribe with Google'.
                 */
                profileName?: string | null;
                /**
                 * The promotion code applied on this purchase. This field is only set if a vanity code promotion is applied when the subscription was purchased.
                 */
                promotionCode?: string | null;
                /**
                 * The type of promotion applied on this purchase. This field is only set if a promotion is applied when the subscription was purchased. Possible values are: 0. One time code 1. Vanity code
                 */
                promotionType?: number | null;
                /**
                 * The type of purchase of the subscription. This field is only set if this purchase was not made using the standard in-app billing flow. Possible values are: 0. Test (i.e. purchased from a license testing account) 1. Promo (i.e. purchased using a promo code)
                 */
                purchaseType?: number | null;
                /**
                 * Time at which the subscription was granted, in milliseconds since the Epoch.
                 */
                startTimeMillis?: string | null;
                /**
                 * The time at which the subscription was canceled by the user, in milliseconds since the epoch. Only present if cancelReason is 0.
                 */
                userCancellationTimeMillis?: string | null;
            }
            /**
             * Contains the price change information for a subscription that can be used to control the user journey for the price change in the app. This can be in the form of seeking confirmation from the user or tailoring the experience for a successful conversion.
             */
            export interface SubscriptionPriceChange {
                /**
                 * The new price the subscription will renew with if the price change is accepted by the user.
                 */
                newPrice?: Price;
                /**
                 * The current state of the price change. Possible values are: 0. Outstanding: State for a pending price change waiting for the user to agree. In this state, you can optionally seek confirmation from the user using the In-App API. 1. Accepted: State for an accepted price change that the subscription will renew with unless it's canceled. The price change takes effect on a future date when the subscription renews. Note that the change might not occur when the subscription is renewed next.
                 */
                state?: number | null;
            }
            /**
             * Definition of a price, i.e. currency and units.
             */
            export interface Price {
                /**
                 * 3 letter Currency code, as defined by ISO 4217. See java/com/google/common/money/CurrencyCode.java
                 */
                currency?: string | null;
                /**
                 * Price in 1/million of the currency base unit, represented as a string.
                 */
                priceMicros?: string | null;
            }
            /**
             * Information provided by the user when they complete the subscription cancellation flow (cancellation reason survey).
             */
            export interface SubscriptionCancelSurveyResult {
                /**
                 * The cancellation reason the user chose in the survey. Possible values are: 0. Other 1. I don't use this service enough 2. Technical issues 3. Cost-related reasons 4. I found a better app
                 */
                cancelSurveyReason?: number | null;
                /**
                 * The customized input cancel reason from the user. Only present when cancelReason is 0.
                 */
                userInputCancelReason?: string | null;
            }
            /** Information specific to a subscription in canceled state. */
            export type CanceledStateContext = {
                /** Subscription was canceled by user. */
                userInitiatedCancellation: UserInitiatedCancellation;
            } | {
                /** Subscription was canceled by the system, for example because of a billing problem. */
                systemInitiatedCancellation: SystemInitiatedCancellation;
            } | {
                /** Subscription was canceled by the developer. */
                developerInitiatedCancellation: DeveloperInitiatedCancellation;
            } | {
                /** Subscription was replaced by a new subscription. */
                replacementCancellation: ReplacementCancellation;
            };
            /** Information specific to cancellations initiated by users. */
            export interface UserInitiatedCancellation {
                /** Information provided by the user when they complete the subscription cancellation flow (cancellation reason survey). */
                cancelSurveyResult?: CancelSurveyResult;
                /**
                 * The time at which the subscription was canceled by the user. The user might still have access to the subscription after this time. Use lineItems.expiry_time to determine if a user still has access.
                 *
                 * A timestamp in RFC3339 UTC "Zulu" format, with nanosecond resolution and up to nine fractional digits. Examples: "2014-10-02T15:01:23Z" and "2014-10-02T15:01:23.045123456Z".
                 */
                cancelTime?: string | null;
            }
            /** Result of the cancel survey when the subscription was canceled by the user. */
            export interface CancelSurveyResult {
                /**
                 * The reason the user selected in the cancel survey.
                 */
                reason?: CancelSurveyReason | null;
                /**
                 * Only set for CANCEL_SURVEY_REASON_OTHERS. This is the user's freeform response to the survey.
                 */
                reasonUserInput?: string | null;
            }
            /** The reason the user selected in the cancel survey. */
            export type CancelSurveyReason = "CANCEL_SURVEY_REASON_UNSPECIFIED" | "CANCEL_SURVEY_REASON_NOT_ENOUGH_USAGE" | "CANCEL_SURVEY_REASON_TECHNICAL_ISSUES" | "CANCEL_SURVEY_REASON_COST_RELATED" | "CANCEL_SURVEY_REASON_FOUND_BETTER_APP" | "CANCEL_SURVEY_REASON_OTHERS";
            /** Information specific to cancellations initiated by Google system. */
            export type SystemInitiatedCancellation = unknown;
            /** Information specific to cancellations initiated by developers. */
            export type DeveloperInitiatedCancellation = unknown;
            /** Information specific to cancellations caused by subscription replacement. */
            export type ReplacementCancellation = unknown;
            /**
             * A SubscriptionPurchase resource indicates the status of a user's subscription purchase.
             */
            interface SubscriptionPurchaseV2_API {
                /**
                 * This kind represents a subscriptionPurchase object in the androidpublisher service.
                 */
                kind: "androidpublisher#subscriptionPurchaseV2";
                /**
                 * The acknowledgement state of the subscription.
                 */
                acknowledgementState?: AcknowledgementState | null;
                /**
                 * Additional context around canceled subscriptions. Only present if the subscription currently has subscriptionState SUBSCRIPTION_STATE_CANCELED.
                 */
                canceledStateContext?: CanceledStateContext | null;
                /**
                 * User account identifier in the third-party service.
                 */
                externalAccountIdentifiers?: ExternalAccountIdentifiers | null;
                /**
                 * The order id of the latest order associated with the purchase of the subscription. For autoRenewing subscription, this is the order id of signup order if it is not renewed yet, or the last recurring order id (success, pending, or declined order). For prepaid subscription, this is the order id associated with the queried purchase token.
                 */
                latestOrderId?: string | null;
                /**
                 * Item-level info for a subscription purchase. The items in the same purchase should be either all with AutoRenewingPlan or all with PrepaidPlan.
                 */
                lineItems?: SubscriptionPurchaseLineItem[] | null;
                /**
                 * The purchase token of the old subscription if this subscription is one of the following:
                 * - Re-signup of a canceled but non-lapsed subscription
                 * - Upgrade/downgrade from a previous subscription.
                 * - Convert from prepaid to auto renewing subscription.
                 * - Convert from an auto renewing subscription to prepaid.
                 * - Topup a prepaid subscription.
                 */
                linkedPurchaseToken?: string | null;
                /**
                 * Additional context around paused subscriptions. Only present if the subscription currently has subscriptionState SUBSCRIPTION_STATE_PAUSED.
                 */
                pausedStateContext?: PausedStateContext | null;
                /**
                 * ISO 3166-1 alpha-2 billing country/region code of the user at the time the subscription was granted.
                 */
                regionCode?: string | null;
                /**
                 * Time at which the subscription was granted. Not set for pending subscriptions (subscription was created but awaiting payment during signup).
                 *
                 * A timestamp in RFC3339 UTC "Zulu" format, with nanosecond resolution and up to nine fractional digits. Examples: "2014-10-02T15:01:23Z" and "2014-10-02T15:01:23.045123456Z".
                 */
                startTime?: string | null;
                /**
                 * User profile associated with purchases made with 'Subscribe with Google'.
                 */
                subscribeWithGoogleInfo?: SubscribeWithGoogleInfo | null;
                /**
                 * The current state of the subscription.
                 */
                subscriptionState?: SubscriptionState | null;
                /**
                 * Only present if this subscription purchase is a test purchase.
                 */
                testPurchase?: TestPurchase | null;
            }
            /**
             * Information specific to a subscription in paused state.
             */
            export interface PausedStateContext {
                /**
                 * Time at which the subscription will be automatically resumed.
                 *
                 * A timestamp in RFC3339 UTC "Zulu" format, with nanosecond resolution and up to nine fractional digits. Examples: "2014-10-02T15:01:23Z" and "2014-10-02T15:01:23.045123456Z".
                 */
                autoResumeTime?: string | null;
            }
            /**
             * The potential states a subscription can be in, for example whether it is active or canceled.
             *
             * The items within a subscription purchase can either be all auto renewing plans or prepaid plans.
             */
            export type SubscriptionState = "SUBSCRIPTION_STATE_UNSPECIFIED" | "SUBSCRIPTION_STATE_PENDING" | "SUBSCRIPTION_STATE_ACTIVE" | "SUBSCRIPTION_STATE_PAUSED" | "SUBSCRIPTION_STATE_IN_GRACE_PERIOD" | "SUBSCRIPTION_STATE_ON_HOLD" | "SUBSCRIPTION_STATE_CANCELED" | "SUBSCRIPTION_STATE_EXPIRED";
            /**
             * Information associated with purchases made with 'Subscribe with Google'.
             */
            export interface SubscribeWithGoogleInfo {
                /**
                 * The Google profile id of the user when the subscription was purchased.
                 */
                profileId?: string | null;
                /**
                 * The profile name of the user when the subscription was purchased.
                 */
                profileName?: string | null;
                /**
                 * The email address of the user when the subscription was purchased.
                 */
                emailAddress?: string | null;
                /**
                 * The given name of the user when the subscription was purchased.
                 */
                givenName?: string | null;
                /**
                 * The family name of the user when the subscription was purchased.
                 */
                familyName?: string | null;
            }
            /**
             * Item-level info for a subscription purchase.
             */
            export type SubscriptionPurchaseLineItem = {
                /**
                 * The purchased product ID (for example, 'monthly001').
                 */
                productId?: string | null;
                /**
                 * Time at which the subscription expired or will expire unless the access is extended (ex. renews).
                 *
                 * A timestamp in RFC3339 UTC "Zulu" format, with nanosecond resolution and up to nine fractional digits. Examples: "2014-10-02T15:01:23Z" and "2014-10-02T15:01:23.045123456Z".
                 */
                expiryTime?: string | null;
            } & ({
                /**
                 * The item is auto renewing.
                 */
                autoRenewingPlan?: AutoRenewingPlan | null;
            } | {
                /**
                 * The item is prepaid.
                 */
                prepaidPlan?: PrepaidPlan | null;
            });
            /** The possible acknowledgement states for a subscription. */
            export type AcknowledgementState = "ACKNOWLEDGEMENT_STATE_UNSPECIFIED" | "ACKNOWLEDGEMENT_STATE_PENDING" | "ACKNOWLEDGEMENT_STATE_ACKNOWLEDGED";
            /** User account identifier in the third-party service. */
            export interface ExternalAccountIdentifiers {
                /**
                 * User account identifier in the third-party service. Only present if account linking happened as part of the subscription purchase flow.
                 */
                externalAccountId?: string | null;
                /**
                 * An obfuscated version of the id that is uniquely associated with the user's account in your app. Present for the following purchases: * If account linking happened as part of the subscription purchase flow. * It was specified using https://developer.android.com/reference/com/android/billingclient/api/BillingFlowParams.Builder#setobfuscatedaccountid when the purchase was made.
                 */
                obfuscatedExternalAccountId?: string | null;
                /**
                 * An obfuscated version of the id that is uniquely associated with the user's profile in your app. Only present if specified using https://developer.android.com/reference/com/android/billingclient/api/BillingFlowParams.Builder#setobfuscatedprofileid when the purchase was made.
                 */
                obfuscatedExternalProfileId?: string | null;
            }
            /** Information related to an auto renewing plan. */
            export interface AutoRenewingPlan {
                /**
                 * If the subscription is currently set to auto-renew, e.g. the user has not canceled the subscription
                 */
                autoRenewEnabled?: boolean;
            }
            /**
             * Information related to a prepaid plan.
             */
            export interface PrepaidPlan {
                /**
                 * After this time, the subscription is allowed for a new top-up purchase. Not present if the subscription is already extended by a top-up purchase.
                 *
                 * A timestamp in RFC3339 UTC "Zulu" format, with nanosecond resolution and up to nine fractional digits. Examples: "2014-10-02T15:01:23Z" and "2014-10-02T15:01:23.045123456Z".
                 */
                allowExtendAfterTime?: string | null;
            }
            /** Whether this subscription purchase is a test purchase. */
            export type TestPurchase = unknown;
            /**
             * Contains the introductory price information for a subscription.
             */
            export interface IntroductoryPriceInfo {
                /**
                 * Introductory price of the subscription, not including tax. The currency is the same as price_currency_code. Price is expressed in micro-units, where 1,000,000 micro-units represents one unit of the currency. For example, if the subscription price is €1.99, price_amount_micros is 1990000.
                 */
                introductoryPriceAmountMicros?: string | null;
                /**
                 * ISO 4217 currency code for the introductory subscription price. For example, if the price is specified in British pounds sterling, price_currency_code is "GBP".
                 */
                introductoryPriceCurrencyCode?: string | null;
                /**
                 * The number of billing period to offer introductory pricing.
                 */
                introductoryPriceCycles?: number | null;
                /**
                 * Introductory price period, specified in ISO 8601 format. Common values are (but not limited to) "P1W" (one week), "P1M" (one month), "P3M" (three months), "P6M" (six months), and "P1Y" (one year).
                 */
                introductoryPricePeriod?: string | null;
            }
            /**
             * A ProductPurchase resource indicates the status of a user's inapp product purchase.
             */
            interface ProductPurchase_API {
                /**
                 * This kind represents an inappPurchase object in the androidpublisher service.
                 */
                kind: "androidpublisher#productPurchase";
                /**
                 * The acknowledgement state of the inapp product. Possible values are: 0. Yet to be acknowledged 1. Acknowledged
                 */
                acknowledgementState?: number | null;
                /**
                 * The consumption state of the inapp product. Possible values are: 0. Yet to be consumed 1. Consumed
                 */
                consumptionState?: number | null;
                /**
                 * A developer-specified string that contains supplemental information about an order.
                 */
                developerPayload?: string | null;
                /**
                 * An obfuscated version of the id that is uniquely associated with the user's account in your app. Only present if specified using https://developer.android.com/reference/com/android/billingclient/api/BillingFlowParams.Builder#setobfuscatedaccountid when the purchase was made.
                 */
                obfuscatedExternalAccountId?: string | null;
                /**
                 * An obfuscated version of the id that is uniquely associated with the user's profile in your app. Only present if specified using https://developer.android.com/reference/com/android/billingclient/api/BillingFlowParams.Builder#setobfuscatedprofileid when the purchase was made.
                 */
                obfuscatedExternalProfileId?: string | null;
                /**
                 * The order id associated with the purchase of the inapp product.
                 */
                orderId?: string | null;
                /**
                 * The inapp product SKU.
                 */
                productId?: string | null;
                /**
                 * The purchase state of the order. Possible values are: 0. Purchased 1. Canceled 2. Pending
                 */
                purchaseState?: number | null;
                /**
                 * The time the product was purchased, in milliseconds since the epoch (Jan 1, 1970).
                 */
                purchaseTimeMillis?: string | null;
                /**
                 * The purchase token generated to identify this purchase.
                 */
                purchaseToken?: string | null;
                /**
                 * The type of purchase of the inapp product. This field is only set if this purchase was not made using the standard in-app billing flow. Possible values are: 0. Test (i.e. purchased from a license testing account) 1. Promo (i.e. purchased using a promo code) 2. Rewarded (i.e. from watching a video ad instead of paying)
                 */
                purchaseType?: number | null;
                /**
                 * The quantity associated with the purchase of the inapp product.
                 */
                quantity?: number | null;
                /**
                 * ISO 3166-1 alpha-2 billing region code of the user at the time the product was granted.
                 */
                regionCode?: string | null;
            }
            export type GooglePurchase = ProductPurchaseExt | SubscriptionPurchaseExt | SubscriptionPurchaseV2Ext | GoogleSubscriptionGone;
            export interface SubscriptionPurchaseExt extends SubscriptionPurchase_API {
                kind: 'androidpublisher#subscriptionPurchase';
                productId?: string;
            }
            export interface SubscriptionPurchaseV2Ext extends SubscriptionPurchaseV2_API {
                kind: 'androidpublisher#subscriptionPurchaseV2';
            }
            export interface ProductPurchaseExt extends ProductPurchase_API {
                kind: 'androidpublisher#productPurchase';
                productId?: string;
            }
            export interface GoogleSubscriptionGone extends ErrorResponse_API {
                kind: 'fovea#subscriptionGone';
            }
            export enum GoogleErrorReason {
                /** The subscription purchase is no longer available for query because it has been expired for too long. */
                SUBSCRIPTION_NO_LONGER_AVAILABLE = "subscriptionPurchaseNoLongerAvailable",
                /** The purchase token is no longer valid. */
                PURCHASE_TOKEN_NO_LONGER_VALID = "purchaseTokenNoLongerValid"
            }
            /** Google API error */
            export interface ApiError {
                message: string;
                domain: "androidpublisher";
                reason: GoogleErrorReason;
                location?: string;
                locationType?: string;
            }
            /** Google API error response payload */
            export interface ErrorResponse_API {
                kind?: string;
                errors: Array<ApiError>;
                code: ErrorCode;
                message: string;
            }
            /**
           * Those are actually HTTP status codes.
           *
           * Duplicated here for documentation purposes.
           */
            export enum ErrorCode {
                /** The subscription purchase is no longer available for query because it has been expired for too long. */
                GONE = 410
            }
            export {};
        }
    }
}
declare namespace CdvPurchase {
    /**
     * Test Adapter and related classes.
     */
    namespace Test {
        /**
         * Test Adapter used for local testing with mock products.
         *
         * This adapter simulates a payment platform that supports both In-App Products and Payment Requests.
         *
         * The list of supported In-App Products
         *
         * @see {@link Test.TEST_PRODUCTS}
         */
        class Adapter implements CdvPurchase.Adapter {
            id: Platform;
            name: string;
            ready: boolean;
            products: Product[];
            receipts: Receipt[];
            private context;
            private log;
            constructor(context: Internal.AdapterContext);
            get isSupported(): boolean;
            supportsParallelLoading: boolean;
            initialize(): Promise<IError | undefined>;
            loadReceipts(): Promise<Receipt[]>;
            loadProducts(products: IRegisterProduct[]): Promise<(Product | IError)[]>;
            order(offer: Offer): Promise<undefined | IError>;
            finish(transaction: Transaction): Promise<undefined | IError>;
            receiptValidationBody(receipt: Receipt): Promise<Validator.Request.Body | undefined>;
            handleReceiptValidationResponse(receipt: Receipt, response: Validator.Response.Payload): Promise<void>;
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
            requestPayment(paymentRequest: PaymentRequest, additionalData?: CdvPurchase.AdditionalData): Promise<IError | Transaction | undefined>;
            manageSubscriptions(): Promise<IError | undefined>;
            manageBilling(): Promise<IError | undefined>;
            private reportActiveSubscription;
            static verify(receipt: Receipt, callback: Callback<Internal.ReceiptResponse>): void;
            checkSupport(functionality: PlatformFunctionality): boolean;
            restorePurchases(): Promise<IError | undefined>;
        }
    }
}
declare namespace CdvPurchase {
    namespace Test {
        /**
         * Definition of the test products.
         */
        const testProducts: {
            /**
             * A valid consumable product.
             *
             * - id: "test-consumable"
             * - type: ProductType.CONSUMABLE
             */
            CONSUMABLE: {
                platform: Platform;
                id: string;
                type: ProductType;
            };
            /**
             * A consumable product for which the purchase will always fail.
             *
             * - id: "test-consumable-fail"
             * - type: ProductType.CONSUMABLE
             */
            CONSUMABLE_FAILING: {
                platform: Platform;
                id: string;
                type: ProductType;
            };
            /**
             * A valid non-consumable product.
             *
             * - id: "test-non-consumable"
             * - type: ProductType.NON_CONSUMABLE
             */
            NON_CONSUMABLE: {
                platform: Platform;
                id: string;
                type: ProductType;
            };
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
                platform: Platform;
                id: string;
                type: ProductType;
            };
            /**
             * A paid-subscription that is already active when the app starts.
             *
             * It behaves as if the user subscribed on a different device. It will renew forever.
             *
             * - id: "test-subscription-active"
             * - type: ProductType.PAID_SUBSCRIPTION
             */
            PAID_SUBSCRIPTION_ACTIVE: {
                platform: Platform;
                id: string;
                type: ProductType;
                /** @internal */
                extra: {
                    offerId: string;
                };
            };
        };
        /**
         * List of test products definitions as an array.
         */
        const testProductsArray: IRegisterProduct[];
        /**
         * Initialize a test product.
         *
         * @internal
         */
        function initTestProduct(productId: string, decorator: Internal.ProductDecorator & Internal.OfferDecorator): Product | undefined;
    }
}
declare namespace CdvPurchase {
    namespace WindowsStore {
        class Adapter implements CdvPurchase.Adapter {
            id: Platform;
            name: string;
            ready: boolean;
            supportsParallelLoading: boolean;
            products: Product[];
            receipts: Receipt[];
            initialize(): Promise<IError | undefined>;
            get isSupported(): boolean;
            loadProducts(products: IRegisterProduct[]): Promise<(Product | IError)[]>;
            loadReceipts(): Promise<Receipt[]>;
            order(offer: Offer): Promise<undefined | IError>;
            finish(transaction: Transaction): Promise<undefined | IError>;
            handleReceiptValidationResponse(receipt: Receipt, response: Validator.Response.Payload): Promise<void>;
            receiptValidationBody(receipt: Receipt): Promise<Validator.Request.Body | undefined>;
            requestPayment(payment: PaymentRequest, additionalData?: CdvPurchase.AdditionalData): Promise<IError | Transaction | undefined>;
            manageSubscriptions(): Promise<IError | undefined>;
            manageBilling(): Promise<IError | undefined>;
            checkSupport(functionality: PlatformFunctionality): boolean;
            restorePurchases(): Promise<IError | undefined>;
        }
    }
}
declare namespace CdvPurchase {
    namespace WindowsStore {
        /**
         * Date and time in ISO 8601 format.
         *
         * Example: "2017-06-11T03:07:49.2552941+00:00"
         */
        type ISODate = string;
        /**
         * WindowsStore Subscription from Microsoft API
         */
        interface WindowsSubscription {
            /** The ID of the beneficiary of the entitlement that is associated with this subscription. */
            beneficiary: string;
            /** Indicates whether the subscription is configured to automatically renew at the end of the current subscription period. */
            autoRenew: boolean;
            /**
             * The date and time the subscription will expire, in ISO 8601 format.
             *
             * This field is only available when the subscription is in certain states.
             * The expiration time usually indicates when the current state expires.
             * For example, for an active subscription, the expiration date indicates when the next automatic renewal will occur.
             *
             * Example: "2017-06-11T03:07:49.2552941+00:00"
             */
            expirationTime: ISODate;
            /**
             * The date and time the subscription will expire including the grace period, in ISO 8601 format.
             *
             * This value indicates when the user will lose access to the subscription after the subscription has failed to automatically renew.
             */
            expirationTimeWithGrace: ISODate;
            /**
             * The ID of the subscription.
             *
             * Use this value to indicate which subscription you want to modify when you call the change the billing state of a subscription for a user method.
             */
            id: string;
            /**
             * Indicates whether the subscription is a trial.
             */
            isTrial: boolean;
            /**
             * The date and time the subscription was last modified, in ISO 8601 format.
             *
             * Example: "2017-01-08T21:07:51.1459644+00:00"
             */
            lastModified: ISODate;
            /** The country code (in two-letter ISO 3166-1 alpha-2 format) in which the user acquired the subscription. */
            market: string;
            /** The Store ID for the product that represents the subscription add-on in the Microsoft Store catalog.
             *
             * An example Store ID for a product is "9NBLGGH42CFD". */
            productId: string;
            /** The Store ID for the SKU that represents the subscription add-on the Microsoft Store catalog.
             *
             * An example Store ID for a SKU is "0010". */
            skuId: string;
            /** The start date and time for the subscription, in ISO 8601 format. */
            startTime: ISODate;
            /**
             * One of the following values:
             *
             *  - None:  This indicates a perpetual subscription.
             *  - Active:  The subscription is active and the user is entitled to use the services.
             *  - Inactive:  The subscription is past the expiration date, and the user turned off the automatic renew option for the subscription.
             *  - Canceled:  The subscription has been purposefully terminated before the expiration date, with or without a refund.
             *  - InDunning:  The subscription is in dunning (that is, the subscription is nearing expiration, and Microsoft is trying to acquire funds to automatically renew the subscription).
             *  - Failed:  The dunning period is over and the subscription failed to renew after several attempts.
             *
             * Note:
             *
             *  - Inactive/Canceled/Failed are terminal states. When a subscription enters one of these states, the user must repurchase the subscription to activate it again. The user is not entitled to use the services in these states.
             *  - When a subscription is Canceled, the expirationTime will be updated with the date and time of the cancellation.
             *  - The ID of the subscription will remain the same during its entire lifetime. It will not change if the auto-renew option is turned on or off. If a user repurchases a subscription after reaching a terminal state, a new subscription ID will be created.
             *  - The ID of a subscription should be used to execute any operation on an individual subscription.
             *  - When a user repurchases a subscription after cancelling or discontinuing it, if you query the results for the user you will get two entries: one with the old subscription ID in a terminal state, and one with the new subscription ID in an active state.
             *  - It's always a good practice to check both recurrenceState and expirationTime, since updates to recurrenceState can potentially be delayed by a few minutes (or occasionally hours).
             */
            recurrenceState: "None" | "Active" | "Inactive" | "Canceled" | "InDunning" | "Failed";
            /** The date and time the user's subscription was cancelled, in ISO 8601 format. */
            cancellationDate: ISODate;
        }
    }
}
declare var msCrypto: any;
declare namespace CdvPurchase {
    namespace Utils {
        namespace Ajax {
            /** HTTP status returned when a request times out */
            const HTTP_REQUEST_TIMEOUT = 408;
            /** Success callback for an ajax call */
            type SuccessCallback<T> = (body: T) => void;
            /** Error callback for an ajax call */
            type ErrorCallback = (statusCode: number, statusText: string, data: null | object) => void;
            /** Option for an external HTTP request */
            interface Options<T> {
                /** URL of the request (https://example.com) */
                url: string;
                /** Method for the request (POST, GET, ...) */
                method?: string;
                /** A success callback taking the body as an argument */
                success?: SuccessCallback<T>;
                /** Error callback taking the response error code, text and body as arguments */
                error?: ErrorCallback;
                /** Payload for a POST request */
                data?: object;
                /** Custom headers to pass tot the HTTP request. */
                customHeaders?: {
                    [key: string]: string;
                };
                /** Request timeout in milliseconds */
                timeout?: number;
            }
        }
        /**
         * Simplified version of jQuery's ajax method based on XMLHttpRequest.
         *
         * Uses cordova's http plugin when installed.
         *
         * Only supports JSON requests.
         */
        function ajax<T>(log: Logger, options: Ajax.Options<T>): {
            done: (cb: () => void) => void;
        };
    }
}
declare namespace CdvPurchase {
    namespace Utils {
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
        function callExternal<F extends Function = Function>(log: Logger, name: string, callback: F | undefined, ...args: any): void;
    }
}
declare namespace CdvPurchase {
    namespace Utils {
        /** @internal */
        function delay(fn: () => void, milliseconds: number): number;
        /** @internal */
        function debounce(fn: () => void, milliseconds: number): () => void;
        function asyncDelay(milliseconds: number): Promise<void>;
    }
}
declare namespace CdvPurchase {
    namespace Utils {
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
        function formatBillingCycleEN(pricingPhase: PricingPhase): string;
    }
}
declare namespace CdvPurchase {
    namespace Utils {
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
        function formatDurationEN(iso?: string, options?: {
            omitOne?: boolean;
        }): string;
    }
}
declare namespace CdvPurchase {
    namespace Utils {
        /**
         * Returns the MD5 hash-value of the passed string.
         *
         * Based on the work of Jeff Mott, who did a pure JS implementation of the MD5 algorithm that was published by Ronald L. Rivest in 1991.
         * Code was imported from https://github.com/pvorb/node-md5
         *
         * I cleaned up the all-including minified version of it.
         */
        function md5(str: string): string;
    }
}
declare namespace CdvPurchase {
    namespace Utils {
        /**
         * Return a safer version of a callback that runs inside a try/catch block.
         *
         * @param logger - Used to log errors.
         * @param className - Type of callback, helps debugging when a function failed.
         * @param callback - The callback function is turn into a safer version.
         */
        function safeCallback<T>(logger: Logger, className: string, callback: Callback<T>, callbackName: string | undefined, reason: string): Callback<T>;
        /**
         * Run a callback inside a try/catch block.
         *
         * @param logger - Used to log errors.
         * @param className - Type of callback, helps debugging when a function failed.
         * @param callback - The callback function is turn into a safer version.
         * @param value - Value passed to the callback.
         */
        function safeCall<T>(logger: Logger, className: string, callback: Callback<T>, value: T, callbackName: string | undefined, reason: string): void;
    }
}
declare namespace CdvPurchase {
    namespace Utils {
        /** Returns an UUID v4. Uses `window.crypto` internally to generate random values. */
        function uuidv4(): string;
    }
}
declare namespace CdvPurchase {
    namespace Validator {
        interface DeviceInfo {
            /** Version of the plugin. Requires "support" or "analytics" policy. */
            plugin?: string;
            /** Version of cordova. Requires "support" or "analytics" policy. */
            cordova?: string;
            /** Device model. Requires "support" or "analytics" policy. */
            model?: string;
            /** OS. Requires "support" or "analytics" policy. */
            platform?: string;
            /** OS version. Requires "support" or "analytics" policy. */
            version?: string;
            /** Device manufacturer. Requires "support" or "analytics" policy. */
            manufacturer?: string;
            /** Ionic version. Requires "support" or "analytics" policy. */
            ionic?: string;
            /** Hardware serial number. Only when the "tracking" policy is enabled. */
            serial?: string;
            /** Device UUID. Only when the "tracking" policy is enabled. */
            uuid?: string;
            /** If the device is running in a simulator */
            isVirtual?: boolean;
            /** Best effort device fingerprint. Only when the "fraud" policy is enabled. */
            fingerprint?: string;
        }
        /**
         * @internal
         */
        namespace Internal {
            interface PrivacyPolicyProvider {
                validator_privacy_policy: undefined | string | string[];
            }
            function getDeviceInfo(store: PrivacyPolicyProvider): DeviceInfo;
        }
    }
}
declare namespace CdvPurchase {
    namespace Validator {
        namespace Request {
            /**
             * Body of a receipt validation request
             */
            interface Body {
                /**
                 * Identifier of the product you want to validate. On iOS, can be set to your application identifier. @required
                 */
                id?: string;
                /**
                 * Type of product being validated. Possible values:
                 *
                 * <ul>
                 * <li>`application` – Validate the application download (Apple only).</li>
                 * <li>`paid subscription` – An auto-renewing subscription.</li>
                 * <li>`non renewing subscription` – A non renewing subscription.</li>
                 * <li>`consumable` – A consumable product.</li>
                 * <li>`non consumable` – A non-consumable product.</li>
                 * </ul>
                 *
                 * @required
                 */
                type?: ProductType;
                /**
                 * Details about the native transaction.
                 *
                 * Can be:
                 * <ul>
                 *  <li>An <a href="#api-Types-Validate.TransactionApple">Apple Transaction</a></li>
                 *  <li>A <a href="#api-Types-Validate.TransactionGoogle">Google Transaction</a></li>
                 *  <li>A <a href="#api-Types-Validate.TransactionWindows">Windows Transaction</a></li>
                 *  <li>A <a href="#api-Types-Validate.TransactionStripe">Stripe Transaction</a></li>
                 * </ul>
                 *
                 * @required
                 */
                transaction?: ApiValidatorBodyTransaction;
                /** Additional data about the purchase */
                additionalData?: {
                    /** Attach the purchases to the given application user. Should be a string.
                     *
                     * See [/documentation/application-username](/documentation/application-username) for more information.
                     *
                     * @optional */
                    applicationUsername?: string | number;
                };
                /** Microsoft license information */
                license?: {
                    /** Not sure why this is here... @ignore */
                    applicationUsername?: string;
                    /** Microsoft b2bKey for collections. @optional */
                    storeIdKey_collections?: string;
                    /** Microsoft b2bKey for purchases. @optional */
                    storeIdKey_purchases?: string;
                };
                offers?: {
                    id: string;
                    pricingPhases: PricingPhase[];
                }[];
                /** The subscription group this product is part of */
                group?: string;
                /** Define the price of the product in micro units (i.e. `price / 1000000`) for the associated currency */
                priceMicros?: number;
                /** Currency used for this product price (cf `priceMicros`) */
                currency?: string;
                /** The requesting users' 3 letters ISO Country Code. */
                countryCode?: string;
                /** Number of periods units of between payments. */
                billingPeriod?: number | string;
                /** Period unit used to define the billing interval (Day, Week, Month or Year) */
                billingPeriodUnit?: SubscriptionPeriodUnit;
                /** Define the price of this product in the introductory period, in micro units, for the associated currency */
                introPriceMicros?: number;
                /** Number of periods units of introductory pricing */
                introPricePeriod?: number | string;
                /** Period unit of introductory pricing (Day, Week, Month or Year) */
                introPricePeriodUnit?: SubscriptionPeriodUnit;
                /** Possible discounts for this product. An Array of DiscountDefinition. @ignore */
                discounts?: Array<DiscountDefinition>;
                /** Define the duration of the trial period, number of period units */
                trialPeriod?: number | string;
                /** Define the unit for the duration of the trial period (Day, Week, Month, Year) */
                trialPeriodUnit?: SubscriptionPeriodUnit;
                /** Metadata about the user's device */
                device?: CdvPurchase.Validator.DeviceInfo;
                /** List of products available in the store */
                products: {
                    /** Type of product (subscription, consumable, etc.) */
                    type: ProductType;
                    /** Product identifier on the store (unique per platform) */
                    id: string;
                    /** List of offers available for this product */
                    offers: {
                        id: string;
                        pricingPhases: PricingPhase[];
                    }[];
                }[];
            }
            type ApiValidatorBodyTransaction = ApiValidatorBodyTransactionApple | ApiValidatorBodyTransactionGoogle | ApiValidatorBodyTransactionWindows | ApiValidatorBodyTransactionBraintree;
            /** Transaction type from an Apple powered device  */
            interface ApiValidatorBodyTransactionApple {
                /** Value `"ios-appstore"` */
                type: 'ios-appstore';
                /** Identifier of the transaction to evaluate, or set it to your application identifier if id has been set so. @required */
                id?: string;
                /** Apple appstore receipt, base64 encoded. @required */
                appStoreReceipt?: string;
                /**
                 * Apple ios 6 transaction receipt.
                 *
                 * @deprecated Use `appStoreReceipt`
                 */
                transactionReceipt?: never;
            }
            /** Transaction type from a google powered device  */
            interface ApiValidatorBodyTransactionGoogle {
                /** Value `"android-playstore"` */
                type: Platform.GOOGLE_PLAY;
                /** Identifier of the transaction to evaluate.
                 *
                 * Corresponds to:
                 * - the `orderId` in the receipt from Google.
                 * - the `transactionId` in the receipt from Apple (or bundleID for the application receipt).
                 *
                 * @required */
                id?: string;
                /** Google purchase token. @required */
                purchaseToken?: string;
                /** Google receipt in a JSON-encoded string. @required */
                receipt?: string;
                /** Google receipt signature (used to validate the local receipt). @required */
                signature?: string;
            }
            /** Native Microsoft Windows transaction
             *
             * <h4>Note about Microsoft validation request</h4>
             *
             * Validation for microsoft can respond with specific fields set:
             *
             * - `data.serviceTicketType` – with value “purchase” or “collections”
             * - `data.serviceTicket` – an authentication ticket
             *
             * The value of this ticket is used to retrieve the storeId required in the validation request.
             *
             * The process is to make a first request without the `storeId`, then use the `serviceTicket` in the
             * response to fetch it and repeat the validation request to finalize the validation process.
             *
             * Contact us if you need assistance with this integration.
             */
            interface ApiValidatorBodyTransactionWindows {
                /** Value `"windows-store-transaction"` */
                type: Platform.WINDOWS_STORE;
                /**
                 * The Store ID for a product in the Microsoft Store catalog.
                 *
                 * An example Store ID for a product is "9NBLGGH42CFD".
                 */
                storeId: string;
                /**
                 * The Store ID for a product's SKU in the Microsoft Store catalog.
                 *
                 * An example Store ID for a SKU is "0010.
                 */
                skuId: string;
            }
            /** Transaction type from Braintree */
            interface ApiValidatorBodyTransactionBraintree {
                /** Value `"braintree"` */
                type: Platform.BRAINTREE;
                /** No need for an id, just set to a non-empty string */
                id: string;
                /** Payment method nonce */
                paymentMethodNonce: string;
                /** Type of payment method (only used for information) */
                paymentMethodType?: string;
                /** Description of the payment method (only used for information) */
                paymentDescription?: string;
                /** Data collected on the device */
                deviceData: any;
            }
            /** Describe a discount */
            interface DiscountDefinition {
                /** Discount identifier */
                id?: string;
                /** Localized Price */
                price?: string;
                /** Price is micro units */
                priceMicros?: number;
                /** Payment mode */
                paymentMode?: DiscountPaymentMode;
                /** Number of periods */
                period?: number;
                /** Discount type */
                type?: DiscountType;
                /** Period unit */
                periodUnit?: SubscriptionPeriodUnit;
            }
            type DiscountType = 'Subscription';
            type DiscountPaymentMode = 'FreeTrial';
            type SubscriptionPeriodUnit = 'Day' | 'Week' | 'Month' | 'Year';
        }
    }
}
declare namespace CdvPurchase {
    namespace Validator {
        namespace Response {
            type Payload = SuccessPayload | ErrorPayload;
            /** Response from a validator endpoint */
            interface SuccessPayload {
                /** Indicates a successful request */
                ok: true;
                data: {
                    /** The collection of purchases in this receipt.
                     *
                     * An array of ValidatorPurchase */
                    collection?: VerifiedPurchase[];
                    /** List of product ids for which intro price isn't available anymore */
                    ineligible_for_intro_price?: string[];
                    /** Id of the product that have been validated */
                    id: string;
                    /** Tell the plugin that we've used the latest receipt */
                    latest_receipt: boolean;
                    /** Native transaction detail */
                    transaction: NativeTransaction;
                    /** A warning message about this validation.
                     *
                     * It might be present when the server had to fallback to a backup validation solution. */
                    warning?: string;
                };
            }
            type NativeTransaction = ({
                type: 'braintree';
                data: Braintree.TransactionObject;
            }) | ({
                type: 'windows-store-transaction';
            } & WindowsStore.WindowsSubscription) | ({
                type: 'ios-appstore';
            } & (AppleAppStore.VerifyReceipt.AppleTransaction | AppleAppStore.VerifyReceipt.AppleVerifyReceiptResponseReceipt)) | ({
                type: 'android-playstore';
            } & GooglePlay.PublisherAPI.GooglePurchase) | ({
                type: 'test';
            });
            /** Error response from the validator endpoint */
            interface ErrorPayload {
                /** Value `false` indicates that the request returned an error */
                ok: false;
                /** Error status (HTTP status) */
                status?: number;
                /** An ErrorCode */
                code?: ErrorCode;
                /** Human readable description of the error */
                message?: string;
                data?: {
                    /** We validated using the latest version of the receipt, not need to refresh it. */
                    latest_receipt?: boolean;
                };
            }
        }
    }
}
declare namespace CdvPurchase {
    namespace Validator {
        /**
         * Dates stored as a ISO formatted string
         */
        type ISODate = string;
        /**
         * Receipt validator as a function.
         */
        interface Function {
            (receipt: Validator.Request.Body, callback: Callback<Validator.Response.Payload>): void;
        }
        /**
         * Custom definition of the validation request target.
         */
        interface Target {
            /** URL of the receipt validator */
            url: string;
            /** Custom headers */
            headers?: {
                [token: string]: string;
            };
            /** Request timeout in millseconds */
            timeout?: number;
        }
    }
}
declare namespace CdvPurchase {
    /** @internal */
    namespace Internal {
        /**
         * Set of function used to provide a nicer API (or more backward compatible)
         */
        interface VerifiedReceiptDecorator {
            finish(receipt: VerifiedReceipt): Promise<void>;
        }
    }
    interface UnverifiedReceipt {
        receipt: Receipt;
        payload: Validator.Response.ErrorPayload;
    }
    /** Receipt data as validated by the receipt validation server */
    class VerifiedReceipt {
        /** @internal */
        className: 'VerifiedReceipt';
        /** Platform this receipt originated from */
        get platform(): Platform;
        /** Source local receipt used for this validation */
        sourceReceipt: Receipt;
        /**
         * The collection of purchases in this receipt.
         */
        collection: VerifiedPurchase[];
        /**
         * True if we've used the latest receipt.
         */
        latestReceipt: boolean;
        /**
         * Raw content from the platform's API.
         */
        nativeTransactions: Validator.Response.NativeTransaction[];
        /**
         * Optional warning message about this validation.
         *
         * It might be present when the server had to fallback to a backup validation solution (like a cached response or using local validation only).
         * This happens generally when communication with the platform's receipt validation service isn't possible (because it's down, there's a network issue, ...)
         *
         * When a warning is present, you should threat the content of this receipt accordingly.
         */
        warning?: string;
        /**
         * Id of the product that have been validated. Used internally.
         */
        id: string;
        /** Get raw response data from the receipt validation request */
        get raw(): Validator.Response.SuccessPayload['data'];
        /**
         * @internal
         */
        constructor(receipt: Receipt, response: Validator.Response.SuccessPayload['data'], decorator: Internal.VerifiedReceiptDecorator);
        /**
         * Update the receipt content
         *
         * @internal
         */
        set(receipt: Receipt, response: Validator.Response.SuccessPayload['data']): void;
        /** Finish all transactions in the receipt */
        finish(): Promise<void>;
    }
    /** A purchase object returned by the receipt validator */
    interface VerifiedPurchase {
        /** Product identifier */
        id: string;
        /** Platform this purchase was made on */
        platform?: Platform;
        /** Purchase identifier (optional) */
        purchaseId?: string;
        /** Identifier of the last transaction (optional) */
        transactionId?: string;
        /** Date of first purchase (timestamp). */
        purchaseDate?: number;
        /** Date of expiry for a subscription. */
        expiryDate?: number;
        /** True when a subscription is expired. */
        isExpired?: boolean;
        /** Renewal intent. */
        renewalIntent?: string;
        /** Date the renewal intent was updated by the user. */
        renewalIntentChangeDate?: number;
        /** The reason a subscription or purchase was cancelled. */
        cancelationReason?: CancelationReason;
        /** True when a subscription a subscription is in the grace period after a failed attempt to collect payment */
        isBillingRetryPeriod?: boolean;
        /** True when a subscription is in trial period */
        isTrialPeriod?: boolean;
        /** True when a subscription is in introductory pricing period */
        isIntroPeriod?: boolean;
        /** Identifier of the discount currently applied to a purchase.
         *
         * Correspond to the product's offerId. When undefined it means there is only one offer for the given product. */
        discountId?: string;
        /** Whether or not the user agreed or has been notified of a price change. */
        priceConsentStatus?: PriceConsentStatus;
        /** Last time a subscription was renewed. */
        lastRenewalDate?: number;
    }
}
