declare var store: IapStore.IStore;

declare namespace IapStore {
  export type StoreProductType =
    'consumable' |
    'non consumable' |
    'free subscription' |
    'paid subscription' |
    'non renewing subscription';

  export interface IError {
    code: number;
    message: string;
  }

  export interface IWhen {
    approved(callback: (product: IStoreProduct) => void): IWhen;
    error(callback: (err: IError, product: IStoreProduct) => void): IWhen;
    loaded(callback: (product: IStoreProduct) => void): IWhen;
    updated(callback: (product: IStoreProduct) => void): IWhen;
    owned(callback: (product: IStoreProduct) => void): IWhen;
    cancelled(callback: (product: IStoreProduct) => void): IWhen;
    refunded(callback: (product: IStoreProduct) => void): IWhen;
    verified(callback: (product: IStoreProduct) => void): IWhen;
    unverified(callback: (product: IStoreProduct) => void): IWhen;
    downloading(callback: (product: IStoreProduct, progress: number, timeRemaining: number) => void): IWhen;
    downloaded(callback: (product: IStoreProduct) => void): IWhen;
    verified(callback: (product: IStoreProduct) => void): IWhen;
    expired(callback: (product: IStoreProduct) => void): IWhen;
    finished(callback: (product: IStoreProduct) => void): IWhen;
    initiated(callback: (product: IStoreProduct) => void): IWhen;
    invalid(callback: (product: IStoreProduct) => void): IWhen;
    registered(callback: (product: IStoreProduct) => void): IWhen;
    requested(callback: (product: IStoreProduct) => void): IWhen;
    valid(callback: (product: IStoreProduct) => void): IWhen;
  }

  export interface IValidatorCallback {
    (success: boolean, data: any): void;
  }

  export interface IValidator {
    (product: IStoreProduct, callback: IValidatorCallback): void;
  }

  export interface IStore {
    FREE_SUBSCRIPTION: StoreProductType;
    PAID_SUBSCRIPTION: StoreProductType;
    NON_RENEWING_SUBSCRIPTION: StoreProductType;
    CONSUMABLE: StoreProductType;
    NON_CONSUMABLE: StoreProductType;

    REGISTERED: StoreProductState;
    INVALID: StoreProductState;
    VALID: StoreProductState;
    REQUESTED: StoreProductState;
    INITIATED: StoreProductState;
    APPROVED: StoreProductState;
    FINISHED: StoreProductState;
    OWNED: StoreProductState;
    DOWNLOADING: StoreProductState;
    DOWNLOADED: StoreProductState;

    QUIET: number;
    ERROR: number;
    WARNING: number;
    INFO: number;
    DEBUG: number;

    ERR_SETUP: number;
    ERR_LOAD: number;
    ERR_PURCHASE: number;
    ERR_LOAD_RECEIPTS: number;
    ERR_CLIENT_INVALID: number;
    ERR_PAYMENT_CANCELLED: number;
    ERR_PAYMENT_INVALID: number;
    ERR_PAYMENT_NOT_ALLOWED: number;
    ERR_UNKNOWN: number;
    ERR_REFRESH_RECEIPTS: number;
    ERR_INVALID_PRODUCT_ID: number;
    ERR_FINISH: number;
    ERR_COMMUNICATION: number;
    ERR_SUBSCRIPTIONS_NOT_AVAILABLE: number;
    ERR_MISSING_TOKEN: number;
    ERR_VERIFICATION_FAILED: number;
    ERR_BAD_RESPONSE: number;
    ERR_REFRESH: number;
    ERR_PAYMENT_EXPIRED: number;
    ERR_DOWNLOAD: number;
    ERR_SUBSCRIPTION_UPDATE_NOT_AVAILABLE: number;

    INVALID_PAYLOAD: number;
    CONNECTION_FAILED: number;
    PURCHASE_EXPIRED: number;

    verbosity: number | boolean;
    validator: string | IValidator;
    autoFinishTransactions: boolean;
    disableHostedContent: boolean;

    error(callback: (err: IError) => void): void;
    get(id: string): IStoreProduct;
    once(query: string): IWhen;
    once(action: string, callback: () => void): void;
    once(query: string, action: string, callback: (product: IStoreProduct) => void): IWhen;
    register(request: IRegisterRequest): void;
    when(query: string): IWhen;
    when(action: string, callback: () => void): void;
    when(query: string, action: string, callback: (product: IStoreProduct) => void): IWhen;
    ready(callback: () => void): void;
    ready(): boolean;
    refresh(): void;
    off(callback: Function): void;
    order(id: string, additionalData?: null | { oldPurchasedSkus: string[] } | { developerPayload: string }): void;
  }

  export type TransactionType = 'ios-appstore' | 'android-playstore' | 'windows-store-transaction';
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
    id: string;
    // Android only
    type: TransactionType;
    developerPayload?: string;
    purchaseToken?: string;
    receipt?: string;
    // iOS only
    appStoreReceipt?: string;
    transactionReceipt?: string;
  }

  export interface IRegisterRequest {
    id: string;
    alias?: string;
    type: StoreProductType;
  }

  export interface IStoreProduct extends IRegisterRequest {
    canPurchase: boolean;
    currency: string;
    description: string;
    downloading: boolean;
    downloaded: boolean;
    finish: () => void;
    loaded: string | boolean;
    owned: boolean;
    price: string;
    state: StoreProductState;
    title: string;
    transaction: ITransaction;
    valid: boolean;
    verify: () => void;
    countryCode: string;
    additionalData: any;
    priceMicros: number;
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
