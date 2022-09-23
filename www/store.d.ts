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
            initialize(platforms: Platform[] | undefined, context: AdapterContext): Promise<IError[]>;
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
    export const PLUGIN_VERSION = "13.0.0";
    interface StoreAdapterDelegate {
        updatedCallbacks: Callbacks<Product>;
    }
    class StoreAdapterListener implements AdapterListener {
        delegate: StoreAdapterDelegate;
        constructor(delegate: StoreAdapterDelegate);
        productsUpdated(platform: Platform, products: Product[]): void;
    }
    export class Store {
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
        listener: StoreAdapterListener;
        constructor();
        /** Register a product */
        register(product: IRegisterProduct | IRegisterProduct[]): void;
        /**
         * Call to initialize the in-app purchase plugin.
         *
         * @param platforms - List of payment platforms to initialize, default to Store.defaultPlatform().
         */
        initialize(platforms?: Platform[]): Promise<IError[]>;
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
        order(offer: Offer, additionalData: AdditionalData): Promise<IError | Transaction>;
        verify(receiptOrTransaction: Transaction | Receipt): Promise<void>;
        finish(value: Transaction | Receipt): Promise<void>;
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
    export namespace WindowsStore {
        class Adapter implements Adapter {
            id: Platform;
            products: Product[];
            receipts: Receipt[];
            initialize(): Promise<IError | undefined>;
            load(products: IRegisterProduct[]): Promise<(Product | IError)[]>;
        }
    }
    export namespace Braintree {
        class Adapter implements Adapter {
            id: Platform;
            products: Product[];
            receipts: Receipt[];
            initialize(): Promise<IError | undefined>;
            load(products: IRegisterProduct[]): Promise<(Product | IError)[]>;
            order(offer: Offer): Promise<Transaction | IError>;
        }
    }
    export namespace Test {
        class Adapter implements Adapter {
            id: Platform;
            products: Product[];
            receipts: Receipt[];
            initialize(): Promise<IError | undefined>;
            load(products: IRegisterProduct[]): Promise<(Product | IError)[]>;
            order(offer: Offer): Promise<Transaction | IError>;
        }
    }
    export {};
}
/** window.store - the global store object */
declare namespace CDVPurchase2 {
    class Transaction {
        state: TransactionState;
        /** Product identifier */
        productId: string;
        /** Offer identifier */
        offerId: string;
        /** Transaction identifier */
        transactionId: string;
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
        order(offer: Offer, additionalData: AdditionalData): Promise<Transaction | IError>;
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
        REQUESTED = "requested",
        INITIATED = "initiated",
        APPROVED = "approved",
        CANCELLED = "cancelled",
        FINISHED = "finished",
        OWNED = "owned",
        EXPIRED = "expired"
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
            order(offer: Offer): Promise<Transaction | IError>;
        }
    }
}
declare namespace CDVPurchase2 {
    namespace GooglePlay {
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
            /** Loads product metadata from the store */
            load(products: IRegisterProduct[]): Promise<(Product | IError)[]>;
            onPurchaseConsumed(purchase: BridgePurchase): void;
            onPurchasesUpdated(purchases: BridgePurchases): void;
            onSetPurchases(purchases: BridgePurchases): void;
            onPriceChangeConfirmationResult(result: "OK" | "UserCanceled" | "UnknownProduct"): void;
            getPurchases(callback?: () => void): void;
            order(offer: Offer, additionalData: CDVPurchase2.AdditionalData): Promise<IError | Transaction>;
        }
    }
}
declare namespace CDVPurchase2 {
    namespace GooglePlay {
        interface BridgeOptions {
            log?: (msg: string) => void;
            showLog?: boolean;
            onPurchaseConsumed?: (purchase: BridgePurchase) => void;
            onPurchasesUpdated?: (purchases: BridgePurchases) => void;
            onSetPurchases?: (purchases: BridgePurchases) => void;
            onPriceChangeConfirmationResult?: (result: "OK" | "UserCanceled" | "UnknownProduct") => void;
        }
        type BridgeErrorCallback = (message: string, code?: number) => void;
        interface BridgePurchases {
        }
        interface BridgePurchase {
        }
        /** See https://github.com/j3k0/cordova-plugin-purchase/blob/master/doc/api.md#storeorderproduct-additionaldata for details */
        type ProrationMode = 'IMMEDIATE_WITH_TIME_PRORATION' | 'IMMEDIATE_AND_CHARGE_PRORATED_PRICE' | 'IMMEDIATE_WITHOUT_PRORATION' | 'DEFERRED' | 'IMMEDIATE_AND_CHARGE_FULL_PRICE';
        interface AdditionalData {
            /** The GooglePlay offer token */
            offerToken?: string;
            oldPurchasedSkus?: string[];
            accountId?: string;
            /**
             * Some applications allow users to have multiple profiles within a single account.
             * Use this method to send the user's profile identifier to Google.
             */
            profileId?: string;
            prorationMode?: ProrationMode;
        }
        type BridgeMessage = {
            type: "setPurchases";
            data: {
                purchases: BridgePurchases;
            };
        } | {
            type: "purchasesUpdated";
            data: {
                purchases: BridgePurchases;
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
            consumePurchase(success: () => void, fail: BridgeErrorCallback, productId: string, transactionId: string, developerPayload: string): void;
            acknowledgePurchase(success: () => void, fail: BridgeErrorCallback, productId: string, transactionId: string, developerPayload: string): void;
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
