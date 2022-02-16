/**
 * The global object exported by in-app purchase plugin
 *
 * As with any other plugin, this object shouldn't be used before the "deviceready" event is fired.
 * Check cordova's documentation for more details if needed.
 */
declare var store: IapStore.IStore;

declare namespace IapStore {

  /** Types of In-App-Products */
  export type StoreProductType =
    'consumable' |
    'non consumable' |
    'free subscription' |
    'paid subscription' |
    'non renewing subscription' |
    'application';

  /** An error triggered by the In-App Purchase plugin */
  export interface IError {
    /** See store.ERR_* for the available codes.
     *
     * https://github.com/j3k0/cordova-plugin-purchase/blob/master/doc/api.md#error-codes */
    code: number;
    /** Human readable message, in plain english */
    message: string;
  }

  export interface IWhen {
    /** Called when a product order is approved. */
    approved(callback: (product: IStoreProduct) => void): IWhen;
    /** Called when an order failed. */
    error(callback: (err: IError, product: IStoreProduct) => void): IWhen;
    /** Called when product data is loaded from the store. */
    loaded(callback: (product: IStoreProduct) => void): IWhen;
    /** Called when any change occured to a product. */
    updated(callback: (product: IStoreProduct) => void): IWhen;
    /** Called when a non-consumable product or subscription is owned. */
    owned(callback: (product: IStoreProduct) => void): IWhen;
    /** Called when a product order is cancelled by the user. */
    cancelled(callback: (product: IStoreProduct) => void): IWhen;
    /** Called when an order is refunded by the user. */
    refunded(callback: (product: IStoreProduct) => void): IWhen;
    /** Called when content download is started */
    downloading(callback: (product: IStoreProduct, progress: number, timeRemaining: number) => void): IWhen;
    /** Called when content download has successfully completed */
    downloaded(callback: (product: IStoreProduct) => void): IWhen;
    /** Called when receipt validation successful */
    verified(callback: (product: IStoreProduct) => void): IWhen;
    /** Called when receipt verification failed */
    unverified(callback: (product: IStoreProduct) => void): IWhen;
    /** Called when validation find a subscription to be expired */
    expired(callback: (product: IStoreProduct) => void): IWhen;
    /** Called when the product enters the `finished` state: transaction has been finalized */
    finished(callback: (product: IStoreProduct) => void): IWhen;
    /** Called when the product enters the `initiated` state: purchase has been initiated */
    initiated(callback: (product: IStoreProduct) => void): IWhen;
    /** Called when the product enters the `invalid` state: product not found in the store */
    invalid(callback: (product: IStoreProduct) => void): IWhen;
    /** Called when the product enters the `registered` state: product registered with `register()` */
    registered(callback: (product: IStoreProduct) => void): IWhen;
    /** Called when the product enters the `requested` state: a purchase has been requested */
    requested(callback: (product: IStoreProduct) => void): IWhen;
    /** Called when the product enters the `valid` state: product details have been loaded from the store */
    valid(callback: (product: IStoreProduct) => void): IWhen;
  }

  export interface IValidatorCallback {
    (success: boolean, data: any): void;
  }

  export interface IValidator {
    (product: IStoreProduct, callback: IValidatorCallback): void;
  }

  export interface IValidatorTarget {
    url: string;
    headers?: { [token: string]: string };
  }

  /** See https://github.com/j3k0/cordova-plugin-purchase/blob/master/doc/api.md#storeorderproduct-additionaldata for details */
  export type IAndroidProrationMode =
    'IMMEDIATE_WITH_TIME_PRORATION'
  | 'IMMEDIATE_AND_CHARGE_PRORATED_PRICE'
  | 'IMMEDIATE_WITHOUT_PRORATION'
  | 'DEFERRED'
  | 'IMMEDIATE_AND_CHARGE_FULL_PRICE';

  export interface IAdditionalData {
    /** A string with the old subscription to upgrade/downgrade on Android.
     *
     * Note: if another subscription product is already owned that is member of the same group, oldSku will be set automatically for you (see product.group). */
    oldSku?: string
    /** A string with the purchaseToken of the subscription to upgrade/downgrade from on Android.
     *
     * Note that it is automatically filled for you if you already specify `oldSku`. */
    oldPurchaseToken?: string;
    /**
     * A string that describe the proration mode to apply when upgrading/downgrading a subscription (with oldSku) on Android.
     *
     * See https://developer.android.com/google/play/billing/subs#change
     */
    prorationMode?: IAndroidProrationMode;
    /** @deprecated use oldSku instead. */
    oldPurchasedSkus?: string[];
    /** @deprecated removed in Google Play Billing library v3 */
    developerPayload?: string;
    /** A object that describes the discount to apply with the purchase (iOS only):  */
    discount: IDiscount;
  }

  export interface IDiscount {
    /** discount identifier */
    id: string;
    /** key identifier */
    key: string;
    /** uuid value for the nonce */
    nonce: string;
    /** time at which the signature was generated (in milliseconds since epoch) */
    timestamp: number;
    /** cryptographic signature that unlock the discount */
    signature: string;
  }

  export interface IStore {
    /** @deprecated use PAID_SUBSCRIPTION */
    FREE_SUBSCRIPTION: StoreProductType;
    /** Type: An auto-renewable subscription */
    PAID_SUBSCRIPTION: StoreProductType;
    /** Type: An non-renewing subscription */
    NON_RENEWING_SUBSCRIPTION: StoreProductType;
    /** Type: An consumable product, that can be purchased multiple time */
    CONSUMABLE: StoreProductType;
    /** Type: A non-consumable product, that can purchased only once and the user keeps forever */
    NON_CONSUMABLE: StoreProductType;
    /** Type: The application bundle */
    APPLICATION: StoreProductType;

    /** State: Product has been registered with `store.register()` */
    REGISTERED: StoreProductState;
    /** State: Product is not available for sale */
    INVALID: StoreProductState;
    /** State: Product is valid and available for purchase */
    VALID: StoreProductState;
    /** State: A purchase has been requested */
    REQUESTED: StoreProductState;
    /** State: The purchase flow has been initiated */
    INITIATED: StoreProductState;
    /** State: The purchase has been approved by the platform */
    APPROVED: StoreProductState;
    /** State: The purchase has been finalized */
    FINISHED: StoreProductState;
    /** State: The product is owned */
    OWNED: StoreProductState;
    /** State: The product content is being downloaded */
    DOWNLOADING: StoreProductState;
    /** State: The product content has been downloaded */
    DOWNLOADED: StoreProductState;

    /** Verbosity: disable all logging (default) */
    QUIET: number;
    /** Verbosity: show only error messages */
    ERROR: number;
    /** Verbosity: show warnings and errors */
    WARNING: number;
    /** Verbosity: also show information messages */
    INFO: number;
    /** Verbosity: all messages including internal debugging messages. */
    DEBUG: number;

    /** Error: Failed to intialize the in-app purchase library */
    ERR_SETUP: number;
    /** Error: Failed to load in-app products metadata */
    ERR_LOAD: number;
    /** Error: Failed to make a purchase */
    ERR_PURCHASE: number;
    /** Error: Failed to load the purchase receipt */
    ERR_LOAD_RECEIPTS: number;
    /** Error: Client is not allowed to issue the request */
    ERR_CLIENT_INVALID: number;
    /** Error: Purchase flow has been cancelled by user */
    ERR_PAYMENT_CANCELLED: number;
    /** Error: Something is suspicious about a purchase */
    ERR_PAYMENT_INVALID: number;
    /** Error: The user is not allowed to make a payment */
    ERR_PAYMENT_NOT_ALLOWED: number;
    /** Error: Unknown error */
    ERR_UNKNOWN: number;
    /** Error: Failed to refresh the purchase receipt */
    ERR_REFRESH_RECEIPTS: number;
    /** Error: The product identifier is invalid */
    ERR_INVALID_PRODUCT_ID: number;
    /** Error: Cannot finalize a transaction or acknowledge a purchase */
    ERR_FINISH: number;
    /** Error: Failed to communicate with the server */
    ERR_COMMUNICATION: number;
    /** Error: Subscriptions are not available */
    ERR_SUBSCRIPTIONS_NOT_AVAILABLE: number;
    /** Error: Purchase information is missing token */
    ERR_MISSING_TOKEN: number;
    /** Error: Verification of store data failed */
    ERR_VERIFICATION_FAILED: number;
    /** Error: Bad response from the server */
    ERR_BAD_RESPONSE: number;
    /** Error: Failed to refresh the store */
    ERR_REFRESH: number;
    /** Error: Payment has expired */
    ERR_PAYMENT_EXPIRED: number;
    /** Error: Failed to download the content */
    ERR_DOWNLOAD: number;
    /** Error: Failed to update a subscription */
    ERR_SUBSCRIPTION_UPDATE_NOT_AVAILABLE: number;
    /** Error: The requested product is not available in the store. */
    ERR_PRODUCT_NOT_AVAILABLE: number;
    /** Error: The user has not allowed access to Cloud service information */
    ERR_CLOUD_SERVICE_PERMISSION_DENIED: number;
    /** Error: The device could not connect to the network. */
    ERR_CLOUD_SERVICE_NETWORK_CONNECTION_FAILED: number;
    /** Error: The user has revoked permission to use this cloud service. */
    ERR_CLOUD_SERVICE_REVOKED: number;
    /** Error: The user has not yet acknowledged Apple’s privacy policy */
    ERR_PRIVACY_ACKNOWLEDGEMENT_REQUIRED: number;
    /** Error: The app is attempting to use a property for which it does not have the required entitlement. */
    ERR_UNAUTHORIZED_REQUEST_DATA: number;
    /** Error: The offer identifier is invalid. */
    ERR_INVALID_OFFER_IDENTIFIER : number;
    /** Error: The price you specified in App Store Connect is no longer valid. */
    ERR_INVALID_OFFER_PRICE: number;
    /** Error: The signature in a payment discount is not valid. */
    ERR_INVALID_SIGNATURE: number;
    /** Error: Parameters are missing in a payment discount. */
    ERR_MISSING_OFFER_PARAMS: number;

    /** Validation Error: Request body is incorrect */
    INVALID_PAYLOAD: number;
    /** Validation Error: Connection issue with the receipt validation server or the platform's API */
    CONNECTION_FAILED: number;
    /** Validation Error: A subscription has expired or a product is no longer owned */
    PURCHASE_EXPIRED: number;
    /** Validation Error: A consumable product has been consumed already */
    PURCHASE_CONSUMED: number;
    /** Validation Error: Internal server error */
    INTERNAL_ERROR: number;
    /** Validation Error: More data is needed from the app to complete the validation request */
    NEED_MORE_DATA: number;

    /**
     * The verbosity property defines how much you want store.js to write on the console.
     *
     * Set to:
     *
     *  - store.QUIET or 0 to disable all logging (default)
     *  - store.ERROR or 1 to show only error messages
     *  - store.WARNING or 2 to show warnings and errors
     *  - store.INFO or 3 to also show information messages
     *  - store.DEBUG or 4 to enable internal debugging messages.
     *
     * See the logging levels constants.
     */
    verbosity: number | boolean;

    /**
     * The sandbox property defines if you want to invoke the platform purchase sandbox
     *
     * - Windows will use the IAP simulator if true (see Windows docs)
     * - Android: NOT IN USE
     * - iOS: NOT IN USE
     */
    sandbox: boolean;

    /**
     * The receipt validation service
     *
     * Set this attribute to either:
     *   - the URL of your purchase validation service: Fovea's receipt validator (https://billing.fovea.cc) or your own service.
     *   - a custom validation callback method.
     *   - an object contaning url and headers { url: 'https//...', headers: { Authorization: 'Bearer ' + authToken } }
     *
     * Note that a receipt validation server is required to properly handle subscriptions and refunds.
     *
     * See https://github.com/j3k0/cordova-plugin-purchase/blob/master/doc/api.md#-storevalidator
     */
    validator: string | IValidator | IValidatorTarget;

    /**
     * Set to true to automatically clean up the queue of transactions.
     *
     * This is safe to always set to true when using a receipt validation service.
     */
    autoFinishTransactions: boolean;

    /**
     * An optional string of developer profile name. This value can be used for payment risk evaluation.
     *
     * Do not use the user account ID for this field.
     *
     * https://github.com/j3k0/cordova-plugin-purchase/blob/master/doc/api.md#storedevelopername
     */
    developerName?: string;

    disableHostedContent: boolean;

    /** Register an error handler.
     *
     * https://github.com/j3k0/cordova-plugin-purchase/blob/master/doc/api.md#storeerrorcallback
     */
    error(callback: (err: IError) => void): void;

    /** Register an error handler that listens to a given error code.
     *
     * https://github.com/j3k0/cordova-plugin-purchase/blob/master/doc/api.md#storeerrorcallback
     */
    error(errorCode: number, callback: (err: IError) => void): void;

    /** Retrieve a product from its id or alias.
     *
     * example usage:
     * ```
     * var product = store.get("cc.fovea.product1");
     * ```
     */
    get(id: string): IStoreProduct | undefined;

    /** Return all products member of a given subscription group. */
    getGroup(groupId: string): IStoreProduct[];

    /** Identical to store.when, but the callback will be called only once.
     *
     * After being called, the callback is unregistered. */
    once(query: string): IWhen;
    once(action: string, callback: () => void): void;
    once(query: string, action: string, callback: (product: IStoreProduct) => void): IWhen;

    /** Add (or register) a product into the store.
     *
     * A product can't be used unless registered first!
     *
     * Note that some reserved keywords can't be used as a product `id` or `alias`:
     *
     *  - product
     *  - order
     *  - registered
     *  - valid
     *  - invalid
     *  - requested
     *  - initiated
     *  - approved
     *  - owned
     *  - finished
     *  - downloading
     *  - downloaded
     *  - refreshed
     *
     * https://github.com/j3k0/cordova-plugin-purchase/blob/master/doc/api.md#storeregisterproduct
     */
    register(request: IRegisterRequest | IRegisterRequest[]): void;

    /**
     * Register a callback for a product-related event.
     *
     * Please read the API documentation at the link below on how to format the query:
     *
     * https://github.com/j3k0/cordova-plugin-purchase/blob/master/doc/api.md#queries
     */
    when(query: string): IWhen;
    when(action: string, callback: () => void): void;
    /** Alternate way to register callbacks for product-related events.
     *
     * Example:
     * ```
     * store.when("cc.fovea.inapp1", "approved", function(product) { ... });
     * ```
     */
    when(query: string, action: string, callback: (product: IStoreProduct) => void): IWhen;

    /**
     * Register a callback to be called when the store is ready to be used.
     *
     * If the store is already ready, callback is executed immediately.
     */
    ready(callback: () => void): void;

    /** Returns true if the plugin has been initialized */
    ready(): boolean;

    /**
     * Load the status of purchases at startup.
     *
     * After you're done registering your store's product and events handlers,
     * you should call store.refresh(). Call it **once and only once** or this might ask the user for their password.
     *
     * `refresh()` will initiate all the complex behind-the-scene work, to load product data from the servers,
     * get the list of current purchase and process pending transactions.
     *
     * You can only call `refresh()` again if instructed by your user when they click a "Restore Purchases" button in your application.
     *
     * https://github.com/j3k0/cordova-plugin-purchase/blob/master/doc/api.md#storerefresh
     */
    refresh(): IRefreshPromise;

    /**
     * Refresh the historical state of purchases and price of items.
     *
     * This is required to know if a user is eligible for promotions like introductory offers or subscription discount.
     * It is recommended to call this method right before entering your in-app purchases or subscriptions page.
     * You can think of update() as a light version of refresh() that won't ask for the user password.
     * Note that this method is called automatically for you on a few useful occasions, like when a subscription expires.
     */
    update(): void;
    /** Opens the Manage Subscription page (AppStore, Play, Microsoft, ...), where the user can change his/her subscription settings or unsubscribe. */
    manageSubscriptions(): void;
    /** Opens the Manage Billing page (AppStore, Play, Microsoft, ...), where the user can update his/her payment methods. */
    manageBilling(): void;
    /** Display a generic dialog notifying the user of a subscription price change.
     *
     * See https://developer.android.com/google/play/billing/subscriptions#price-change-communicate
     *
     * Note: This call does nothing on iOS and Microsoft UWP. */
    launchPriceChangeConfirmationFlow(productId: string, callback: (status: 'UserCanceled' | 'OK' | 'UnknownProduct') => void): void;
    /** Redeems a promotional offer from within the app.
     *
     * - On iOS, calling store.redeem() will open the Code Redemption Sheet. See the "offer codes" documentation for details.
     * - This call does nothing on other platforms.
     */
    redeem(): void;
    /** Unregister a callback. Works for callbacks registered with ready, when, once and error. */
    off(callback: Function): void;
    /**
     * Initiate the purchase of a product.
     *
     * The product argument can be either:
     *
     *   - the store.Product object
     *   - the product id
     *   - the product alias
     *
     * Full documentation here:
     * https://github.com/j3k0/cordova-plugin-purchase/blob/master/doc/api.md#storeorderproduct-additionaldata
     */
    order(product: string | IStoreProduct, additionalData?: null | IAdditionalData): IOrderPromise;

    applicationUsername?: string | (() => string);
  }

  export type TransactionType = 'ios-appstore' | 'android-playstore' | 'windows-store-transaction';

  /** Possible states of a product */
  export type StoreProductState =
    'approved' |
    'cancelled' |
    'downloading' |
    'downloaded' |
    'expired' |
    'finished' |
    'initiated' |
    'invalid' |
    'owned' |
    'registered' |
    'requested' |
    'valid';

  export interface ITransaction {
    /** Transaction identifier */
    id?: string;
    // Android only
    type: TransactionType;
    /** @deprecated */
    developerPayload?: string;
    purchaseToken?: string;
    receipt?: string;
    // iOS only
    appStoreReceipt?: string;
    transactionReceipt?: string;
  }

  /**
   * Data provided to store.register()
   */
  export interface IRegisterRequest {
    /** Identifier of the product on the store */
    id: string;
    /** Optional alias you can refer the product with, can be used for more explicit queries */
    alias?: string;
    /** Product type, should be one of the defined product types */
    type: StoreProductType;
    /**
     * Name of the group your subscription product is a member of (default to "default").
     *
     * If you don't set anything, all subscription will be members of the same group.
     */
    group?: string;
  }

  export type IPeriodUnit = "Minute" | "Hour" | "Day" | "Week" | "Month" | "Year";

  /**
   * In-App Product or Application Bundle
   *
   * Most events methods give you access to a product object.
   */
  export interface IStoreProduct extends IRegisterRequest {
    /** Additional data possibly required for product purchase */
    additionalData: any;
    /** Duration of the billing period for a subscription, in the units specified by the billingPeriodUnit property. (not available on iOS < 11.2) */
    billingPeriod?: number;
    /** Units of the billing period for a subscription. Possible values: Minute, Hour, Day, Week, Month, Year. (not available on iOS < 11.2) */
    billingPeriodUnit: IPeriodUnit;
    /** Product is in a state where it can be purchased */
    canPurchase: boolean;
    /** Country code. Available only on iOS */
    countryCode: string;
    /** Currency code */
    currency?: string;
    /** Purchase has been initiated but is waiting for external action (for example, Ask to Buy on iOS) */
    deferred?: boolean;
    /** Localized long description */
    description: string;
    /** Array of discounts available for the product. */
    discounts?: IStoreDiscount[];
    /** Product is downloading non-consumable content */
    downloading: boolean;
    /** Non-consumable content has been successfully downloaded for this product */
    downloaded: boolean;
    /** Latest known expiry date for a subscription (a javascript Date) */
    expiryDate?: Date;
    /** Localized introductory price (if applicable), with currency symbol */
    introPrice?: string;
    /** Introductory price in micro-units, if applicable (divide by 1000000 to get numeric price) */
    introPriceMicros?: number;
    /** Duration the introductory price is available (in period-unit) */
    introPricePeriod?: string;
    /** Period for the introductory price ("Day", "Week", "Month" or "Year") */
    introPricePeriodUnit?: IPeriodUnit;
    /** Payment mode for the introductory price ("PayAsYouGo", "UpFront", or "FreeTrial") */
    introPricePaymentMode?: IPaymentMode;
    /** True when a trial or introductory price has been applied to a subscription.
     * Only available after receipt validation. Only on iOS */
    ineligibleForIntroPrice?: boolean;
    /** Latest date a subscription was renewed (a javascript Date) */
    lastRenewalDate?: Date;
    /** Product has been loaded from server, however it can still be either valid or not */
    loaded: string | boolean;
    /** Product is owned */
    owned: boolean;
    price: string;
    /** Price in micro-units (divide by 1000000 to get numeric price) */
    priceMicros?: number;
    /** Current state the product is in (see life-cycle in the API documentatin). */
    state: StoreProductState;
    /** Localized name or short description, as loaded from the store */
    title: string;
    /** Latest transaction data for this product. */
    transaction: ITransaction;
    /** Duration of the trial period for the subscription, in the units specified by the trialPeriodUnit property (windows only) */
    trialPeriod?: number;
    /** Units of the trial period for a subscription (windows only) */
    trialPeriodUnit?: IPeriodUnit;
    /** Product has been loaded and is a valid product.
     *
     * When product definitions can't be loaded from the store, you should display instead a warning like:
     * "You cannot make purchases at this stage. Try again in a moment. Make sure you didn't enable In-App-Purchases restrictions on your phone." */
    valid: boolean;

    /**
     * Call product.finish() to confirm to the store that an approved order has been delivered. This will change the product state from APPROVED to FINISHED (see life-cycle).
     *
     * As long as you keep the product in state APPROVED:
     *  - the money may not be in your account (i.e. user isn't charged)
     *  - you will receive the approved event each time the application starts, where you should try again to finish the pending transaction.
     *
     * See https://github.com/j3k0/cordova-plugin-purchase/blob/master/doc/api.md#productfinish
     */
    finish: () => void;

    /**
     * Initiate purchase validation as defined by `store.validator`.
     *
     * See https://github.com/j3k0/cordova-plugin-purchase/blob/master/doc/api.md#productverify
     */
    verify: () => IVerifyPromise;
  }

  export interface IStoreDiscount {
    /** The discount identifier */
    id: string;
    /** Localized price, with currency symbol */
    price: string;
    /** Price in micro-units (divide by 1000000 to get numeric price) */
    priceMicros: number;
    /** Number of subscription periods */
    period: number;
    /** Unit of the subcription period ("Day", "Week", "Month" or "Year") */
    periodUnit: IPeriodUnit;
    /** "PayAsYouGo", "UpFront", or "FreeTrial" */
    paymentMode: IPaymentMode;
    /** True if the user is deemed eligible for this discount by the platform */
    eligible: boolean;
  }

  export type IPaymentMode = "PayAsYouGo" | "UpFront" | "FreeTrial";

  /**
   * The store.refresh() method returns a promise-like object with the following functions
   */
  export interface IRefreshPromise {

    /** Calls `fn` when restoring purchases failed. */
    failed(callback: () => void): IRefreshPromise;

    /**
     * Calls `fn` when the queue of previous purchases have been processed.
     *
     * At this point, all previously owned products should be in the approved state.
     */
    completed(callback: () => void): IRefreshPromise;

    /** Calls `fn` when the user cancelled the refresh request. */
    cancelled(callback: () => void): IRefreshPromise;

    /**
     * Calls `fn` when the restore is finished, i.e. it has failed, been cancelled,
     * or all purchased in the approved state have been finished or expired.
     */
    finished(callback: () => void): IRefreshPromise;
  }

  export type IProductCallback = (product: IStoreProduct) => void;
  export type IVerifySuccessCallback = (product: IStoreProduct, purchaseData: any) => void;
  export type IErrorCallback = (err: IError) => void;

  export interface IVerifyPromise {
    /** Called whether verification failed or succeeded. */
    done(callback: IProductCallback): IVerifyPromise;
    /** Called if the purchase expired. */
    expired(callback: IProductCallback): IVerifyPromise;
    /** Called if the purchase is valid and verified.
     *
     * purchaseData is the device dependent transaction details returned by the validator,
     * which you can most probably ignore.
     */
    success(callback: IVerifySuccessCallback): IVerifyPromise;
    /** Validation failed, either because of expiry or communication failure.
     *
     * `err is an Error object, with a code describing the error.
     */
    error(callback: IErrorCallback): IVerifyPromise;
  }

  export interface IOrderPromise {
    /** Called when the order was successfully initiated */
    then: (callback: () => void) => IOrderPromise;
    /** Called if the order couldn't be initiated */
    error: (callback: IErrorCallback) => IOrderPromise;
  }
}

// For backward compatibility prior v7.1.4.
declare namespace store {
    export type StoreProductType = IapStore.StoreProductType;
    export type IError = IapStore.IError;
    export type IWhen = IapStore.IWhen;
    export type IValidatorCallback = IapStore.IValidatorCallback;
    export type IValidator = IapStore.IValidator;
    export type IStore = IapStore.IStore;
    export type TransactionType = IapStore.TransactionType;
    export type StoreProductState = IapStore.StoreProductState;
    export type ITransaction = IapStore.ITransaction;
    export type IRegisterRequest = IapStore.IRegisterRequest;
    export type IStoreProduct = IapStore.IStoreProduct;
}
