declare namespace CDVPurchase2 {
    namespace Internal {
        interface StoreAdapterDelegate {
            updatedCallbacks: Callbacks<Product>;
            updatedReceiptCallbacks: Callbacks<Receipt>;
            approvedCallbacks: Callbacks<Transaction>;
            finishedCallbacks: Callbacks<Transaction>;
        }
        class StoreAdapterListener implements AdapterListener {
            delegate: StoreAdapterDelegate;
            constructor(delegate: StoreAdapterDelegate);
            lastTransactionState: {
                [transactionToken: string]: TransactionState;
            };
            static makeTransactionToken(transaction: Transaction): string;
            productsUpdated(platform: Platform, products: Product[]): void;
            receiptsUpdated(platform: Platform, receipts: Receipt[]): void;
        }
    }
}
declare namespace CDVPurchase2 {
    namespace Internal {
        /** Adapter execution context */
        interface AdapterContext {
            /** Logger */
            log: Log;
            /** Verbosity level */
            verbosity: LogLevel;
            /** Error reporting */
            error: (error: IError) => void;
            /** List of registered products */
            registeredProducts: Internal.RegisteredProducts;
            /** The events listener */
            listener: AdapterListener;
            /** Retrieves the application username */
            getApplicationUsername: () => string | undefined;
        }
        class Adapters {
            list: Adapter[];
            add(adapters: Platform[], context: AdapterContext): void;
            initialize(platforms: (Platform | {
                platform: Platform;
                options: any;
            })[] | undefined, context: AdapterContext): Promise<IError[]>;
            find(platform: Platform): Adapter | undefined;
        }
    }
}
declare namespace CDVPurchase2 {
    /** Manage a list of callbacks */
    class Callbacks<T> {
        callbacks: Callback<T>[];
        push(callback: Callback<T>): void;
        trigger(value: T): void;
    }
}
declare namespace CDVPurchase2 {
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
        MISSING_OFFER_PARAMS
    }
}
declare namespace CDVPurchase2 {
    enum LogLevel {
        QUIET = 0,
        ERROR = 1,
        WARNING = 2,
        INFO = 3,
        DEBUG = 4
    }
    namespace Internal {
        interface VerbosityProvider {
            verbosity: LogLevel | boolean;
        }
        class Log {
            private prefix;
            private store;
            constructor(store: VerbosityProvider, prefix?: string);
            child(prefix: string): Log;
            error(o: any): void;
            warn(o: any): void;
            info(o: any): void;
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
        }
    }
}
declare var msCrypto: any;
declare namespace CDVPurchase2 {
    namespace Internal {
        interface IAjaxOptions {
            url: string;
            method?: string;
            success?: (data: any) => void;
            error?: (statusCode: number, statusText: string, data: null | object) => void;
            data?: object;
            customHeaders?: {
                [key: string]: string;
            };
        }
        interface ExecutionContext {
            log: Log;
            callExternal<F extends Function = Function>(name: string, callback: F, ...args: any): void;
        }
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
            static callExternal<F extends Function = Function>(context: ExecutionContext, name: string, callback: F, ...args: any): void;
            static ajax(context: ExecutionContext, options: IAjaxOptions): {
                done: (cb: () => void) => void;
            };
            /** Simplified version of jQuery's ajax method based on XMLHttpRequest.
             *
             * Uses the http plugin. */
            static ajaxWithHttpPlugin(context: ExecutionContext, options: IAjaxOptions): {
                done: (cb: () => void) => void;
            };
            /** Returns an UUID v4. Uses `window.crypto` internally to generate random values. */
            static uuidv4(): string;
            static md5(r: any): any;
            static delay(fn: () => void, wait: number): number;
            static debounce(fn: () => void, wait: number): () => void;
            static nonEnumerable: {
                (target: any, name: string): void;
                (target: any, name: string, desc: PropertyDescriptor): PropertyDescriptor;
            };
        }
    }
}
declare namespace CDVPurchase2 {
    class Offer {
        /** Offer identifier */
        id: string;
        /** Parent product */
        product: Product;
        /** Pricing phases */
        pricingPhases: PricingPhase[];
        constructor(options: {
            id: string;
            product: Product;
            pricingPhases: PricingPhase[];
        });
    }
}
declare namespace CDVPurchase2 {
    /** Ready callbacks */
    class ReadyCallbacks {
        /** True when the plugin is ready */
        isReady: boolean;
        /** Callbacks when the store is ready */
        readyCallbacks: Callback<void>[];
        /** Register a callback to be called when the plugin is ready. */
        add(cb: Callback<void>): unknown;
        /** Calls the ready callbacks */
        trigger(): void;
    }
}
declare namespace CDVPurchase2 {
    class Receipt {
        /** Platform that generated the receipt */
        platform: Platform;
        /** List of transactions contained in the receipt */
        transactions: Transaction[];
        constructor(options: {
            platform: Platform;
            transactions: Transaction[];
        });
        hasTransaction(value: Transaction): boolean;
    }
}
declare namespace CDVPurchase2 {
    /**
     * Data provided to store.register()
     */
    interface IRegisterProduct {
        /** Identifier of the product on the store */
        id: string;
        /**
         * List of payment platforms the product is available on
         *
         * If you do not specify anything, the product is assumed to be available only on the
         * default payment platform. (Apple AppStore on iOS, Google Play on Android)
         */
        platform: Platform;
        /** Product type, should be one of the defined product types */
        type: ProductType;
        /**
         * Name of the group your subscription product is a member of (default to "default").
         *
         * If you don't set anything, all subscription will be members of the same group.
         */
        group?: string;
    }
    namespace Internal {
        class RegisteredProducts {
            list: IRegisterProduct[];
            find(platform: Platform, id: string): IRegisterProduct | undefined;
            add(product: IRegisterProduct | IRegisterProduct[]): void;
            byPlatform(): {
                platform: Platform;
                products: IRegisterProduct[];
            }[];
        }
    }
}
declare namespace CDVPurchase2 {
    /** Retry failed requests
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
declare namespace CDVPurchase2 {
    const PLUGIN_VERSION = "13.0.0";
    class Store {
        /** Payment platform adapters */
        adapters: Internal.Adapters;
        /** List of registered products */
        registeredProducts: Internal.RegisteredProducts;
        /** Logger */
        log: Internal.Log;
        /** Verbosity level for log */
        verbosity: LogLevel;
        /** Return the identifier of the user for your application */
        applicationUsername?: string | (() => string);
        /** Get the application username as a string by either calling or returning Store.applicationUsername */
        getApplicationUsername(): string | undefined;
        /** URL or implementation of the receipt validator */
        validator: string | ValidatorFunction | ValidatorTarget | undefined;
        private _validator;
        /** When adding information to receipt validation requests, those can serve different functions:
         *
         *  - handling support requests
         *  - fraud detection
         *  - analytics
         *  - tracking
         */
        validator_privacy_policy?: PrivacyPolicyItem | PrivacyPolicyItem[];
        /** List of callbacks for the "ready" events */
        private _readyCallbacks;
        /** Listens to adapters */
        listener: Internal.StoreAdapterListener;
        constructor();
        /** Register a product */
        register(product: IRegisterProduct | IRegisterProduct[]): void;
        /**
         * Call to initialize the in-app purchase plugin.
         *
         * @param platforms - List of payment platforms to initialize, default to Store.defaultPlatform().
         */
        initialize(platforms?: (Platform | {
            platform: Platform;
            options: any;
        })[]): Promise<IError[]>;
        /**
         * @deprecated - use store.initialize(), store.update() or store.restorePurchases()
         */
        refresh(): void;
        /**
         * Call to refresh the price of products and status of purchases.
         */
        update(): Promise<void>;
        /** Register a callback to be called when the plugin is ready. */
        ready(cb: Callback<void>): void;
        when(): When;
        /** Callbacks when a product definition was updated */
        private updatedCallbacks;
        /** Callback when a receipt was updated */
        private updatedReceiptsCallbacks;
        /** Callbacks when a product is owned */
        private ownedCallbacks;
        /** Callbacks when a transaction has been approved */
        private approvedCallbacks;
        /** Callbacks when a transaction has been finished */
        private finishedCallbacks;
        /** Callbacks when a receipt has been validated */
        private verifiedCallbacks;
        /** List of all active products */
        get products(): Product[];
        /** Find a product from its id and platform */
        get(productId: string, platform?: Platform): Product | undefined;
        /** List of all receipts */
        get receipts(): Receipt[];
        /** Place an order for a given offer */
        order(offer: Offer, additionalData?: AdditionalData): Promise<IError | undefined>;
        /** TODO */
        pay(options: {
            platform: Platform;
            amount: number;
            currency: string;
            description: string;
        }): Promise<void>;
        verify(receiptOrTransaction: Transaction | Receipt): Promise<void>;
        /** Finalize a transaction */
        finish(transaction: Transaction | Receipt): Promise<void>;
        restorePurchases(): Promise<void>;
        /**
         * The default payment platform to use depending on the OS.
         *
         * - on iOS: `APPLE_APPSTORE`
         * - on Android: `GOOGLE_PLAY`
         */
        static defaultPlatform(): Platform;
        errorCallbacks: Callbacks<IError>;
        error(error: IError | Callback<IError>): void;
        version: string;
    }
    namespace WindowsStore {
        class Adapter implements Adapter {
            id: Platform;
            products: Product[];
            receipts: Receipt[];
            initialize(): Promise<IError | undefined>;
            load(products: IRegisterProduct[]): Promise<(Product | IError)[]>;
            order(offer: Offer): Promise<undefined | IError>;
            finish(transaction: Transaction): Promise<undefined | IError>;
        }
    }
    namespace Braintree {
        class Adapter implements Adapter {
            id: Platform;
            products: Product[];
            receipts: Receipt[];
            initialize(): Promise<IError | undefined>;
            load(products: IRegisterProduct[]): Promise<(Product | IError)[]>;
            order(offer: Offer): Promise<undefined | IError>;
            finish(transaction: Transaction): Promise<undefined | IError>;
        }
    }
    namespace Test {
        class Adapter implements Adapter {
            id: Platform;
            products: Product[];
            receipts: Receipt[];
            initialize(): Promise<IError | undefined>;
            load(products: IRegisterProduct[]): Promise<(Product | IError)[]>;
            order(offer: Offer): Promise<undefined | IError>;
            finish(transaction: Transaction): Promise<undefined | IError>;
        }
    }
}
/** window.store - the global store object */
declare namespace CDVPurchase2 {
    class Transaction {
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
        /** Purchased products */
        products: {
            /** Product identifier */
            productId: string;
            /** Offer identifier, if known */
            offerId?: string;
        }[];
        constructor(platform: Platform);
    }
    /** Whether or not the user intends to let the subscription auto-renew. */
    enum RenewalIntent {
        /** The user intends to let the subscription expire without renewing. */
        LAPSE = "Lapse",
        /** The user intends to renew the subscription. */
        RENEW = "Renew"
    }
}
declare namespace CDVPurchase2 {
    type Callback<T> = (t: T) => void;
    /** An error triggered by the In-App Purchase plugin */
    interface IError {
        /** See store.ERR_* for the available codes.
         *
         * https://github.com/j3k0/cordova-plugin-purchase/blob/master/doc/api.md#error-codes */
        code: ErrorCode;
        /** Human readable message, in plain english */
        message: string;
    }
    type IErrorCallback = (err?: IError) => void;
    /** Types of In-App-Products */
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
    class Product {
        platform: Platform;
        type: ProductType;
        id: string;
        valid?: boolean;
        offers: Offer[];
        /**
         * Product title from the store.
         */
        title: string;
        /**
         * Product full description from the store.
         */
        description: string;
        get pricing(): PricingPhase | undefined;
        constructor(p: IRegisterProduct);
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
         * Find and return an offer for this product from its id
         *
         * If id isn't specified, returns the first offer.
         *
         * @param id - Identifier of the offer to return
         */
        addOffer(offer: Offer): void;
    }
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
     * @see Product.pricingPhases
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
    enum PaymentMode {
        PAY_AS_YOU_GO = "PayAsYouGo",
        UP_FRONT = "UpFront",
        FREE_TRIAL = "FreeTrial"
    }
    interface AdapterListener {
        productsUpdated(platform: Platform, products: Product[]): void;
        receiptsUpdated(platform: Platform, receipts: Receipt[]): void;
    }
    interface Adapter {
        /**
         * Platform identifier
         */
        id: Platform;
        /**
         * List of products managed by the adapter.
         */
        get products(): Product[];
        /**
         * List of purchase receipts.
         */
        get receipts(): Receipt[];
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
        load(products: IRegisterProduct[]): Promise<(Product | IError)[]>;
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
    }
    interface AdditionalData {
        /** The application's user identifier, will be obfuscated with md5 to fill `accountId` if necessary */
        applicationUsername?: string;
        /** GooglePlay specific additional data */
        googlePlay?: GooglePlay.AdditionalData;
    }
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
        TEST = "dummy-store"
    }
    /** Possible states of a product */
    enum TransactionState {
        INITIATED = "initiated",
        APPROVED = "approved",
        CANCELLED = "cancelled",
        FINISHED = "finished",
        UNKNOWN_STATE = ""
    }
    type PrivacyPolicyItem = 'fraud' | 'support' | 'analytics' | 'tracking';
    interface When {
        updated(cb: Callback<Product>): When;
        owned(cb: Callback<Product>): When;
        approved(cb: Callback<Transaction>): When;
        finished(cb: Callback<Transaction>): When;
        verified(cb: Callback<Receipt>): When;
    }
}
declare namespace CDVPurchase2 {
    interface ValidatorCallback {
        (success: boolean, data: any): void;
    }
    interface ValidatorFunction {
        (offer: Offer, callback: ValidatorCallback): void;
    }
    interface ValidatorTarget {
        url: string;
        headers?: {
            [token: string]: string;
        };
    }
    namespace Internal {
        class ReceiptsToValidate {
            private array;
            get(): Receipt[];
            add(receipt: Receipt): void;
            clear(): void;
            has(receipt: Receipt): boolean;
        }
        interface ValidatorController {
            get validator(): string | ValidatorFunction | ValidatorTarget | undefined;
            get receipts(): Receipt[];
        }
        class Validator {
            private receipts;
            private controller;
            constructor(controller: ValidatorController);
            add(receiptOrTransaction: Receipt | Transaction): void;
            run(onVerified: (receipt: Receipt) => void): void;
        }
    }
}
declare namespace CDVPurchase2 {
    namespace AppleStore {
        class SKReceipt extends Receipt {
        }
        class SKProduct extends Product {
        }
        class SKOffer extends Offer {
        }
        class SKTransaction extends Transaction {
        }
        class Adapter implements CDVPurchase2.Adapter {
            id: Platform;
            products: SKProduct[];
            receipts: SKReceipt[];
            constructor(context: Internal.AdapterContext);
            initialize(): Promise<IError | undefined>;
            load(products: IRegisterProduct[]): Promise<(Product | IError)[]>;
            order(offer: Offer): Promise<undefined | IError>;
            finish(transaction: Transaction): Promise<undefined | IError>;
        }
    }
}
declare namespace CDVPurchase2 {
    namespace GooglePlay {
        class Transaction extends CDVPurchase2.Transaction {
            nativePurchase: BridgePurchase;
            constructor(purchase: BridgePurchase);
            static toState(state: BridgePurchaseState, isAcknowledged: boolean): TransactionState;
            /**
             * Refresh the value in the transaction based on the native purchase update
             */
            refresh(purchase: BridgePurchase): void;
        }
        class Receipt extends CDVPurchase2.Receipt {
            /** Token that uniquely identifies a purchase for a given item and user pair. */
            purchaseToken: string;
            /** Unique order identifier for the transaction.  (like GPA.XXXX-XXXX-XXXX-XXXXX) */
            orderId?: string;
            constructor(purchase: BridgePurchase);
            /** Refresh the content of the purchase based on the native BridgePurchase */
            refresh(purchase: BridgePurchase): void;
        }
        class Adapter implements CDVPurchase2.Adapter {
            /** Adapter identifier */
            id: Platform;
            /** List of products managed by the GooglePlay adapter */
            get products(): Product[];
            private _products;
            get receipts(): Receipt[];
            private _receipts;
            /** The GooglePlay bridge */
            bridge: Bridge;
            /** Prevent double initialization */
            initialized: boolean;
            /** Used to retry failed commands */
            retry: Retry<Function>;
            private context;
            private log;
            autoRefreshIntervalMillis: number;
            static _instance: Adapter;
            constructor(context: Internal.AdapterContext, autoRefreshIntervalMillis?: number);
            private initializationPromise?;
            initialize(): Promise<undefined | IError>;
            /** Prepare the list of SKUs sorted by type */
            getSkusOf(products: IRegisterProduct[]): {
                inAppSkus: string[];
                subsSkus: string[];
            };
            /** @inheritdoc */
            load(products: IRegisterProduct[]): Promise<(Product | IError)[]>;
            /** @inheritdoc */
            finish(transaction: CDVPurchase2.Transaction): Promise<IError | undefined>;
            onPurchaseConsumed(purchase: BridgePurchase): void;
            onPurchasesUpdated(purchases: BridgePurchase[]): void;
            onSetPurchases(purchases: BridgePurchase[]): void;
            onPriceChangeConfirmationResult(result: "OK" | "UserCanceled" | "UnknownProduct"): void;
            getPurchases(callback?: () => void): void;
            /** @inheritdoc */
            order(offer: Offer, additionalData: CDVPurchase2.AdditionalData): Promise<IError | undefined>;
        }
    }
}
declare namespace CDVPurchase2 {
    namespace GooglePlay {
        interface BridgeOptions {
            log?: (msg: string) => void;
            showLog?: boolean;
            onPurchaseConsumed?: (purchase: BridgePurchase) => void;
            onPurchasesUpdated?: (purchases: BridgePurchase[]) => void;
            onSetPurchases?: (purchases: BridgePurchase[]) => void;
            onPriceChangeConfirmationResult?: (result: "OK" | "UserCanceled" | "UnknownProduct") => void;
        }
        type BridgeErrorCallback = (message: string, code?: ErrorCode) => void;
        interface BridgePurchase {
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
            /** One of BridgePurchaseState indicating the state of the purchase. */
            getPurchaseState: BridgePurchaseState;
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
        enum BridgePurchaseState {
            UNSPECIFIED_STATE = 0,
            PURCHASED = 1,
            PENDING = 2
        }
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
        type BridgeMessage = {
            type: "setPurchases";
            data: {
                purchases: BridgePurchase[];
            };
        } | {
            type: "purchasesUpdated";
            data: {
                purchases: BridgePurchase[];
            };
        } | {
            type: "purchaseConsumed";
            data: {
                purchase: BridgePurchase;
            };
        } | {
            type: "onPriceChangeConfirmationResultOK" | "onPriceChangeConfirmationResultUserCanceled" | "onPriceChangeConfirmationResultUnknownSku";
            data: {
                purchase: BridgePurchase;
            };
        };
        class Bridge {
            options: BridgeOptions;
            init(success: () => void, fail: BridgeErrorCallback, options: BridgeOptions): void;
            load(success: () => void, fail: BridgeErrorCallback, skus: string[], inAppSkus: string[], subsSkus: string[]): void;
            listener(msg: BridgeMessage): void;
            getPurchases(success: () => void, fail: BridgeErrorCallback): void;
            buy(success: () => void, fail: BridgeErrorCallback, productId: string, additionalData: CDVPurchase2.AdditionalData): void;
            subscribe(success: () => void, fail: BridgeErrorCallback, productId: string, additionalData: CDVPurchase2.AdditionalData): void;
            consumePurchase(success: () => void, fail: BridgeErrorCallback, purchaseToken: string): void;
            acknowledgePurchase(success: () => void, fail: BridgeErrorCallback, purchaseToken: string): void;
            getAvailableProducts(inAppSkus: string[], subsSkus: string[], success: (validProducts: (BridgeInAppProduct | BridgeSubscriptionV12)[]) => void, fail: BridgeErrorCallback): void;
            manageSubscriptions(): void;
            manageBilling(): void;
            launchPriceChangeConfirmationFlow(productId: string): void;
        }
    }
}
declare namespace CDVPurchase2 {
    namespace GooglePlay {
        class GooglePlayProduct extends Product {
        }
        class GooglePlayInAppOffer extends Offer {
            type: string;
        }
        class GooglePlaySubscriptionOffer extends Offer {
            type: string;
            tags: string[];
            token: string;
            constructor(options: {
                id: string;
                product: GooglePlayProduct;
                pricingPhases: PricingPhase[];
                tags: string[];
                token: string;
            });
        }
        type GooglePlayOffer = GooglePlayInAppOffer | GooglePlaySubscriptionOffer;
        class Products {
            /** List of products managed by the GooglePlay adapter */
            products: Product[];
            getProduct(id: string): Product | undefined;
            /** List of offers managed by the GooglePlay adapter */
            offers: GooglePlayOffer[];
            getOffer(id: string): GooglePlayOffer | undefined;
            /**  */
            addProduct(registeredProduct: IRegisterProduct, vp: BridgeInAppProduct | BridgeSubscriptionV12): Product;
            private onSubsV12Loaded;
            private iabSubsOfferV12Loaded;
            private onInAppLoaded;
            private toPaymentMode;
            private toRecurrenceMode;
            private toPricingPhase;
        }
    }
}
declare namespace CDVPurchase2 {
    namespace GooglePlay {
        interface BridgeSubscriptionV11 {
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
        interface BridgeSubscriptionV12 {
            product_format: "v12.0";
            product_type: "subs";
            productId: string;
            name: string;
            title: string;
            description: string;
            offers: BridgeSubscriptionOfferV12[];
        }
        interface BridgeSubscriptionOfferV12 {
            token: string;
            tags: string[];
            pricing_phases: BridgePricingPhaseV12[];
        }
        enum BridgeRecurrenceModeV12 {
            FINITE_RECURRING = "FINITE_RECURRING",
            INFINITE_RECURRING = "INFINITE_RECURRING",
            NON_RECURRING = "NON_RECURRING"
        }
        interface BridgePricingPhaseV12 {
            recurrence_mode: BridgeRecurrenceModeV12;
            billing_period: string;
            billing_cycle_count: number;
            formatted_price: string;
            price_amount_micros: number;
            price_currency_code: string;
        }
        interface BridgeInAppProduct {
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
