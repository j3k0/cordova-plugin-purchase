declare namespace CDVPurchase2 {
    namespace Internal {
        interface StoreAdapterDelegate {
            approvedCallbacks: Callbacks<Transaction>;
            finishedCallbacks: Callbacks<Transaction>;
            updatedCallbacks: Callbacks<Product>;
            updatedReceiptCallbacks: Callbacks<Receipt>;
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
            log: Logger;
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
        /**
         * The list of active platform adapters
         */
        class Adapters {
            list: Adapter[];
            add(adapters: Platform[], context: AdapterContext): void;
            /**
             * Initialize some platform adapters.
             */
            initialize(platforms: (Platform | {
                platform: Platform;
                options: any;
            })[] | undefined, context: AdapterContext): Promise<IError[]>;
            /**
             * Retrieve a platform adapter.
             */
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
/** cordova-plugin-purchase global namespace */
declare namespace CDVPurchase2 { }
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
    interface VerbosityProvider {
        verbosity: LogLevel | boolean;
    }
    class Logger {
        private prefix;
        private store;
        constructor(store: VerbosityProvider, prefix?: string);
        child(prefix: string): Logger;
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
declare namespace CDVPurchase2 {
    namespace Utils {
        const nonEnumerable: {
            (target: any, name: string): void;
            (target: any, name: string, desc: PropertyDescriptor): PropertyDescriptor;
        };
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
    /** Product definition from a store */
    class Product {
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
         * Shortcut to offers[0].pricingPhases[0]
         *
         * Useful when you know products have a single offer and a single pricing phase.
         */
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
    type ValidatorCallback = (payload: Validator.Response.Payload) => void;
    interface ValidatorFunction {
        (receipt: Receipt, callback: ValidatorCallback): void;
    }
    interface ValidatorTarget {
        url: string;
        headers?: {
            [token: string]: string;
        };
    }
    namespace Internal {
        interface ReceiptResponse {
            receipt: Receipt;
            payload: Validator.Response.Payload;
        }
        /** Queue of receipts to validate */
        class ReceiptsToValidate {
            private array;
            get(): Receipt[];
            add(receipt: Receipt): void;
            clear(): void;
            has(receipt: Receipt): boolean;
        }
        interface ValidatorController {
            get validator(): string | ValidatorFunction | ValidatorTarget | undefined;
            get localReceipts(): Receipt[];
            get adapters(): Adapters;
            get validator_privacy_policy(): PrivacyPolicyItem | PrivacyPolicyItem[] | undefined;
            getApplicationUsername(): string | undefined;
            get verifiedCallbacks(): Callbacks<VerifiedReceipt>;
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
            /** Add/update a verified receipt from the server response */
            private addVerifiedReceipt;
            /** Add a receipt to the validation queue. It'll get validated after a few milliseconds. */
            add(receiptOrTransaction: Receipt | Transaction): void;
            /** Run validation for all receipts in the queue */
            run(): void;
            private runOnReceipt;
            private runValidatorFunction;
            private buildRequestBody;
            private runValidatorRequest;
        }
    }
}
declare namespace CDVPurchase2 {
    const PLUGIN_VERSION = "13.0.0";
    /**
     * Main class of the purchase.
     */
    class Store {
        /** The singleton store object */
        static get instance(): Store;
        /** Payment platform adapters */
        adapters: Internal.Adapters;
        /** List of registered products */
        private registeredProducts;
        /** Logger */
        log: Logger;
        /** Verbosity level for log */
        verbosity: LogLevel;
        /** Return the identifier of the user for your application */
        applicationUsername?: string | (() => string);
        /** Get the application username as a string by either calling or returning Store.applicationUsername */
        getApplicationUsername(): string | undefined;
        /** URL or implementation of the receipt validation service */
        validator: string | ValidatorFunction | ValidatorTarget | undefined;
        /** When adding information to receipt validation requests, those can serve different functions:
         *
         *  - handling support requests
         *  - fraud detection
         *  - analytics
         *  - tracking
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
        /** Callbacks when a receipt has been validated */
        private verifiedCallbacks;
        /** Callbacks for errors */
        private errorCallbacks;
        /** Internal implementation of the receipt validation service integration */
        private _validator;
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
        /** Setup events listener.
         *
         * @example
         * store.when()
         *      .productUpdated(product => updateUI(product))
         *      .approved(transaction => store.finish(transaction));
         */
        when(): When;
        /** List of all active products */
        get products(): Product[];
        /** Find a product from its id and platform */
        get(productId: string, platform?: Platform): Product | undefined;
        /** List of all receipts present on the device */
        get localReceipts(): Receipt[];
        /** List of receipts verified with the receipt validation service.
         *
         * Those receipt contains more information and are generally more up-to-date than the local ones. */
        get verifiedReceipts(): VerifiedReceipt[];
        /**
         * Find the last verified purchase for a given product, from those verified by the receipt validator.
         */
        findInVerifiedReceipts(product: Product): VerifiedPurchase | undefined;
        /**
         * Find the latest transaction for a givne product, from those reported by the device.
         */
        findInLocalReceipts(product: Product): Transaction | undefined;
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
        finish(receipt: Transaction | Receipt | VerifiedReceipt): Promise<void>;
        restorePurchases(): Promise<void>;
        /**
         * The default payment platform to use depending on the OS.
         *
         * - on iOS: `APPLE_APPSTORE`
         * - on Android: `GOOGLE_PLAY`
         */
        static defaultPlatform(): Platform;
        error(error: IError | Callback<IError>): void;
        version: string;
    }
    let store: Store;
}
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
}
declare namespace CDVPurchase2 {
    /** Callback */
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
         * Nice name for the adapter
         */
        name: string;
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
        /**
         * Prepare for receipt validation
         */
        receiptValidationBody(receipt: Receipt): Validator.Request.Body | undefined;
        /**
         * Handle platform specific fields from receipt validation response.
         */
        handleReceiptValidationResponse(receipt: Receipt, response: Validator.Response.Payload): Promise<void>;
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
    /** Store events listener */
    interface When {
        /**
         * Register a function called when a product is updated.
         *
         * @deprecated - Use `productUpdated` or `receiptUpdated`.
         */
        updated(cb: Callback<Product | Receipt>): When;
        /** Register a function called when a receipt is updated. */
        receiptUpdated(cb: Callback<Receipt>): When;
        /** Register a function called when a product is updated. */
        productUpdated(cb: Callback<Product>): When;
        /** Register a function called when transaction is approved. */
        approved(cb: Callback<Transaction>): When;
        /** Register a function called when a transaction is finished. */
        finished(cb: Callback<Transaction>): When;
        /** Register a function called when a receipt is verified. */
        verified(cb: Callback<VerifiedReceipt>): When;
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
declare namespace CDVPurchase2 {
    namespace AppleAppStore {
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
            name: string;
            products: SKProduct[];
            receipts: SKReceipt[];
            constructor(context: Internal.AdapterContext);
            initialize(): Promise<IError | undefined>;
            load(products: IRegisterProduct[]): Promise<(Product | IError)[]>;
            order(offer: Offer): Promise<undefined | IError>;
            finish(transaction: Transaction): Promise<undefined | IError>;
            receiptValidationBody(receipt: Receipt): Validator.Request.Body | undefined;
            handleReceiptValidationResponse(receipt: Receipt, response: Validator.Response.Payload): Promise<void>;
        }
    }
}
declare namespace CDVPurchase2 {
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
declare namespace CDVPurchase2 {
    namespace Braintree {
        class Adapter implements CDVPurchase2.Adapter {
            id: Platform;
            name: string;
            products: Product[];
            receipts: Receipt[];
            initialize(): Promise<IError | undefined>;
            load(products: IRegisterProduct[]): Promise<(Product | IError)[]>;
            order(offer: Offer): Promise<undefined | IError>;
            finish(transaction: Transaction): Promise<undefined | IError>;
            receiptValidationBody(receipt: Receipt): Validator.Request.Body | undefined;
            handleReceiptValidationResponse(receipt: Receipt, response: Validator.Response.Payload): Promise<void>;
        }
    }
}
declare namespace CDVPurchase2 {
    namespace GooglePlay {
        class Transaction extends CDVPurchase2.Transaction {
            nativePurchase: Bridge.Purchase;
            constructor(purchase: Bridge.Purchase);
            static toState(state: Bridge.PurchaseState, isAcknowledged: boolean): TransactionState;
            /**
             * Refresh the value in the transaction based on the native purchase update
             */
            refresh(purchase: Bridge.Purchase): void;
        }
        class Receipt extends CDVPurchase2.Receipt {
            /** Token that uniquely identifies a purchase for a given item and user pair. */
            purchaseToken: string;
            /** Unique order identifier for the transaction.  (like GPA.XXXX-XXXX-XXXX-XXXXX) */
            orderId?: string;
            constructor(purchase: Bridge.Purchase);
            /** Refresh the content of the purchase based on the native BridgePurchase */
            refresh(purchase: Bridge.Purchase): void;
        }
        class Adapter implements CDVPurchase2.Adapter {
            /** Adapter identifier */
            id: Platform;
            /** Adapter name */
            name: string;
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
            /** @inheritDoc */
            load(products: IRegisterProduct[]): Promise<(GProduct | IError)[]>;
            /** @inheritDoc */
            finish(transaction: CDVPurchase2.Transaction): Promise<IError | undefined>;
            onPurchaseConsumed(purchase: Bridge.Purchase): void;
            /** Called when the platform reports update for some purchases */
            onPurchasesUpdated(purchases: Bridge.Purchase[]): void;
            /** Called when the platform reports some purchases */
            onSetPurchases(purchases: Bridge.Purchase[]): void;
            onPriceChangeConfirmationResult(result: "OK" | "UserCanceled" | "UnknownProduct"): void;
            /** Refresh purchases from GooglePlay */
            getPurchases(): Promise<IError | undefined>;
            /** @inheritDoc */
            order(offer: GOffer, additionalData: CDVPurchase2.AdditionalData): Promise<IError | undefined>;
            /**
             * Prepare for receipt validation
             */
            receiptValidationBody(receipt: Receipt): Validator.Request.Body | undefined;
            handleReceiptValidationResponse(receipt: CDVPurchase2.Receipt, response: Validator.Response.Payload): Promise<void>;
        }
    }
}
declare namespace CDVPurchase2 {
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
                token: string;
                tags: string[];
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
declare namespace CDVPurchase2 {
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
                buy(success: () => void, fail: ErrorCallback, productId: string, additionalData: CDVPurchase2.AdditionalData): void;
                subscribe(success: () => void, fail: ErrorCallback, productId: string, additionalData: CDVPurchase2.AdditionalData): void;
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
declare namespace CDVPurchase2 {
    namespace GooglePlay {
        class GProduct extends CDVPurchase2.Product {
        }
        class InAppOffer extends CDVPurchase2.Offer {
            type: string;
        }
        class SubscriptionOffer extends CDVPurchase2.Offer {
            type: string;
            tags: string[];
            token: string;
            constructor(options: {
                id: string;
                product: GProduct;
                pricingPhases: PricingPhase[];
                tags: string[];
                token: string;
            });
        }
        type GOffer = InAppOffer | SubscriptionOffer;
        class Products {
            /** List of products managed by the GooglePlay adapter */
            products: GProduct[];
            getProduct(id: string): GProduct | undefined;
            /** List of offers managed by the GooglePlay adapter */
            offers: GOffer[];
            getOffer(id: string): GOffer | undefined;
            /**  */
            addProduct(registeredProduct: IRegisterProduct, vp: Bridge.InAppProduct | Bridge.Subscription): GProduct;
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
declare namespace CDVPurchase2 {
    namespace Test {
        class Adapter implements CDVPurchase2.Adapter {
            id: Platform;
            name: string;
            products: Product[];
            receipts: Receipt[];
            initialize(): Promise<IError | undefined>;
            load(products: IRegisterProduct[]): Promise<(Product | IError)[]>;
            order(offer: Offer): Promise<undefined | IError>;
            finish(transaction: Transaction): Promise<undefined | IError>;
            receiptValidationBody(receipt: Receipt): Validator.Request.Body | undefined;
            handleReceiptValidationResponse(receipt: Receipt, response: Validator.Response.Payload): Promise<void>;
        }
    }
}
declare namespace CDVPurchase2 {
    namespace WindowsStore {
        class Adapter implements CDVPurchase2.Adapter {
            id: Platform;
            name: string;
            products: Product[];
            receipts: Receipt[];
            initialize(): Promise<IError | undefined>;
            load(products: IRegisterProduct[]): Promise<(Product | IError)[]>;
            order(offer: Offer): Promise<undefined | IError>;
            finish(transaction: Transaction): Promise<undefined | IError>;
            handleReceiptValidationResponse(receipt: Receipt, response: Validator.Response.Payload): Promise<void>;
            receiptValidationBody(receipt: Receipt): Validator.Request.Body | undefined;
        }
    }
}
declare namespace CDVPurchase2 {
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
declare namespace CDVPurchase2 {
    namespace Utils {
        namespace Ajax {
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
declare namespace CDVPurchase2 {
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
         */
        function callExternal<F extends Function = Function>(log: Logger, name: string, callback: F | undefined, ...args: any): void;
    }
}
declare namespace CDVPurchase2 {
    namespace Utils {
        function delay(fn: () => void, wait: number): number;
        function debounce(fn: () => void, wait: number): () => void;
    }
}
declare namespace CDVPurchase2 {
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
declare namespace CDVPurchase2 {
    namespace Utils {
        /** Returns an UUID v4. Uses `window.crypto` internally to generate random values. */
        function uuidv4(): string;
    }
}
declare namespace CDVPurchase2 {
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
        namespace Internal {
            interface PrivacyPolicyProvider {
                get validator_privacy_policy(): undefined | string | string[];
            }
            function getDeviceInfo(store: PrivacyPolicyProvider): DeviceInfo;
        }
    }
}
declare namespace CDVPurchase2 {
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
                device?: CDVPurchase2.Validator.DeviceInfo;
            }
            type ApiValidatorBodyTransaction = ApiValidatorBodyTransactionApple | ApiValidatorBodyTransactionGoogle | ApiValidatorBodyTransactionWindows;
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
                transactionReceipt?: string;
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
            /** Transaction type from Stripe
             *
             * Currently unsupported. */
            interface ApiValidatorBodyTransactionStripe {
                /** Value `"stripe-charge"` */
                type: 'stripe-charge';
                /** Identifier of the Stripe charge. @required */
                id?: string;
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
declare namespace CDVPurchase2 {
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
                type: 'windows-store-transaction';
            } & WindowsStore.WindowsSubscription) | ({
                type: 'ios-appstore';
            } & (AppleAppStore.VerifyReceipt.AppleTransaction | AppleAppStore.VerifyReceipt.AppleVerifyReceiptResponseReceipt)) | ({
                type: 'android-playstore';
            } & GooglePlay.PublisherAPI.GooglePurchase);
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
declare namespace CDVPurchase2 {
    namespace Validator {
        /**
         * Dates stored as a ISO formatted string
         */
        type ISODate = string;
    }
}
declare namespace CDVPurchase2 {
    /** Receipt data as validated by the receipt validation server */
    class VerifiedReceipt {
        /** Platform this receipt originated from */
        get platform(): Platform;
        /** Source local receipt used for this validation */
        sourceReceipt: Receipt;
        /**
         * The collection of purchases in this receipt.
         *
         * An array of ValidatorPurchase
         */
        collection: VerifiedPurchase[];
        /** Tell the plugin that we've used the latest receipt */
        latestReceipt: boolean;
        /** Native transactions detail */
        nativeTransactions: Validator.Response.NativeTransaction[];
        /**
         * Optional warning message about this validation.
         *
         * It might be present when the server had to fallback to a backup validation solution (like a cached response or using local validation only).
         * This happens generally when communication with the platform's receipt validation service isn't possible (because it's down, there's a network issue, ...)
         *
         * Threat the content of this receipt accordingly.
         */
        warning?: string;
        /** Id of the product that have been validated. Used internally. */
        id: string;
        constructor(receipt: Receipt, response: Validator.Response.SuccessPayload['data']);
        /** Update the receipt content */
        set(receipt: Receipt, response: Validator.Response.SuccessPayload['data']): void;
    }
    /** A purchase object returned by the receipt validator */
    interface VerifiedPurchase {
        /** Product identifier */
        id: string;
        /** Date of first purchase (timestamp). */
        purchaseDate?: number;
        /** Date of expiry for a subscription. */
        expiryDate?: number;
        /** True when a subscription is expired. */
        isExpired?: boolean;
        /** Renewal intent
         *
         * See <a href="#api-Types-RenewalIntent">enum RenewalIntent</a> */
        renewalIntent?: string;
        /** Date the renewal intent was updated by the user. */
        renewalIntentChangeDate?: number;
        /** The reason a subscription or purchase was cancelled.
         *
         * See href="#api-Types-CancelationReason">enum CancelationReason</a>. */
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
        /** Whether or not the user agreed or has been notified of a price change.
         *
         * See <a href="#api-Types-PriceConsentStatus">"enum PriceConsentStatus"</a>. */
        priceConsentStatus?: PriceConsentStatus;
        /** Last time a subscription was renewed. */
        lastRenewalDate?: number;
    }
}
