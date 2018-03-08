declare var store: store.IStore;

declare namespace store {
  export type StoreProductType = 'consumable' | 'non consumable' | 'free subscription' | 'paid subscription';

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

    verbosity: number | boolean;
    validator: string | IValidator;

    error(callback: (err: IError) => void): void;
    get(id: string): IStoreProduct;
    once(query: string, action: string, callback: any): void;
    register(request: IRegisterRequest): void;
    when(query: string): IWhen;
    when(action: string, query: string, callback: (product: IStoreProduct) => void): IWhen;
    ready(callback: () => void): void;
    refresh(): void;
    off(callback: Function): void;
    order(id: string): void;
  }

  export type TransactionType = 'ios-appstore' | 'android-playstore';
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
    alias: string;
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
  }
}
