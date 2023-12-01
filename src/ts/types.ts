/// <reference path="store.ts" />

namespace CdvPurchase {

    /** Callback */
    export type Callback<T> = (t: T) => void;

    /** An error triggered by the In-App Purchase plugin */
    export interface IError {

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
    export enum ProductType {
        /** Type: An consumable product, that can be purchased multiple time */
        CONSUMABLE = 'consumable',
        /** Type: A non-consumable product, that can purchased only once and the user keeps forever */
        NON_CONSUMABLE = 'non consumable',
        /** @deprecated use PAID_SUBSCRIPTION */
        FREE_SUBSCRIPTION = 'free subscription',
        /** Type: An auto-renewable subscription */
        PAID_SUBSCRIPTION = 'paid subscription',
        /** Type: An non-renewing subscription */
        NON_RENEWING_SUBSCRIPTION = 'non renewing subscription',
        /** Type: The application bundle */
        APPLICATION = 'application',
    }

    /** Unit for measuring durations */
    export type IPeriodUnit = "Minute" | "Hour" | "Day" | "Week" | "Month" | "Year";

    /**
     * Type of recurring payment
     *
     * - FINITE_RECURRING: Payment recurs for a fixed number of billing period set in `paymentPhase.cycles`.
     * - INFINITE_RECURRING: Payment recurs for infinite billing periods unless cancelled.
     * - NON_RECURRING: A one time charge that does not repeat.
     */
    export enum RecurrenceMode {
        NON_RECURRING = "NON_RECURRING",
        FINITE_RECURRING = "FINITE_RECURRING",
        INFINITE_RECURRING = "INFINITE_RECURRING"
    }

    /**
     * Description of a phase for the pricing of a purchase.
     *
     * @see {@link Offer.pricingPhases}
     */
    export interface PricingPhase {
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
    export enum PaymentMode {

        /** Used for subscriptions, pay at the beginning of each billing period */
        PAY_AS_YOU_GO = "PayAsYouGo",

        /** Pay the whole amount up front */
        UP_FRONT = "UpFront",

        /** Nothing to be paid */
        FREE_TRIAL = "FreeTrial",
    }


    /** Adapter for a payment or in-app purchase platform */
    export interface Adapter {

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
    export interface AdditionalData {

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
    export enum Platform {

        /** Apple AppStore */
        APPLE_APPSTORE = 'ios-appstore',

        /** Google Play */
        GOOGLE_PLAY = 'android-playstore',

        /** Windows Store */
        WINDOWS_STORE = 'windows-store-transaction',

        /** Braintree */
        BRAINTREE = 'braintree',

        // /** Stripe */
        // STRIPE = 'stripe',

        /** Test platform */
        TEST = 'test',
    }

    /**
     * Functionality optionality provided by a given platform.
     *
     * @see {@link Store.checkSupport}
     */
    export type PlatformFunctionality = 'requestPayment' | 'order' | 'manageSubscriptions' | 'manageBilling';

    /** Possible states of a product */
    export enum TransactionState {
        // REQUESTED = 'requested',
        INITIATED = 'initiated',
        PENDING = 'pending',
        APPROVED = 'approved',
        CANCELLED = 'cancelled',
        FINISHED = 'finished',
        // OWNED = 'owned',
        // EXPIRED = 'expired',
        UNKNOWN_STATE = '',
    }

    export type PrivacyPolicyItem = 'fraud' | 'support' | 'analytics' | 'tracking';

    /** Store events listener */
    export interface When {

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

        // /** Register a function called when a product is owned. */
        // owned(cb: Callback<Product>): When;

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
    export enum RenewalIntent {
        /** The user intends to let the subscription expire without renewing. */
        LAPSE = "Lapse",
        /** The user intends to renew the subscription. */
        RENEW = "Renew",
    }

    /** Whether or not the user was notified or agreed to a price change */
    export enum PriceConsentStatus {
        NOTIFIED = 'Notified',
        AGREED = 'Agreed',
    }

    /** Reason why a subscription has been canceled */
    export enum CancelationReason {
        /** Not canceled */
        NOT_CANCELED = '',
        /** Subscription canceled by the developer. */
        DEVELOPER = 'Developer',
        /** Subscription canceled by the system for an unspecified reason. */
        SYSTEM = 'System',
        /** Subscription upgraded or downgraded to a new subscription. */
        SYSTEM_REPLACED = 'System.Replaced',
        /** Product not available for purchase at the time of renewal. */
        SYSTEM_PRODUCT_UNAVAILABLE = 'System.ProductUnavailable',
        /** Billing error; for example customer’s payment information is no longer valid. */
        SYSTEM_BILLING_ERROR = 'System.BillingError',
        /** Transaction is gone; It has been deleted. */
        SYSTEM_DELETED = 'System.Deleted',
        /** Subscription canceled by the user for an unspecified reason. */
        CUSTOMER = 'Customer',
        /** Customer canceled their transaction due to an actual or perceived issue within your app. */
        CUSTOMER_TECHNICAL_ISSUES = 'Customer.TechnicalIssues',
        /** Customer did not agree to a recent price increase. See also priceConsentStatus. */
        CUSTOMER_PRICE_INCREASE = 'Customer.PriceIncrease',
        /** Customer canceled for cost-related reasons. */
        CUSTOMER_COST = 'Customer.Cost',
        /** Customer claimed to have found a better app. */
        CUSTOMER_FOUND_BETTER_APP = 'Customer.FoundBetterApp',
        /** Customer did not feel he is using this service enough. */
        CUSTOMER_NOT_USEFUL_ENOUGH = 'Customer.NotUsefulEnough',
        /** Subscription canceled for another reason; for example, if the customer made the purchase accidentally. */
        CUSTOMER_OTHER_REASON = 'Customer.OtherReason',
        /** Subscription canceled for unknown reasons. */
        UNKNOWN = 'Unknown'
    }
}
