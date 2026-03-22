namespace CdvPurchase {
    export namespace AppleAppStore {

        /** Global type for the SK2 extension plugin marker */
        export interface CdvPurchaseStoreKit2 {
            installed?: boolean;
            version?: string;
        }

        export namespace Bridge {

            /**
             * Shared interface implemented by both the SK1 and SK2 bridges.
             * The adapter programs against this interface, not a concrete class.
             */
            export interface BridgeInterface {
                /** Cached app store receipt */
                appStoreReceipt?: ApplicationReceipt | null;
                /** Transaction IDs grouped by product */
                transactionsForProduct: { [productId: string]: string[] };
                /** Whether this bridge uses StoreKit 2 */
                readonly isSK2?: boolean;

                init(options: Partial<BridgeOptions>, success: () => void,
                     error: (code: ErrorCode, message: string) => void): void;
                load(productIds: string[],
                     success: (validProducts: ValidProduct[], invalidProductIds: string[]) => void,
                     error: (code: ErrorCode, message: string) => void): void;
                purchase(productId: string, quantity: number,
                         applicationUsername: string | undefined,
                         discount: PaymentDiscount | undefined,
                         success: () => void, error: () => void): void;
                finish(transactionId: string, success: () => void,
                       error: (msg: string) => void): void;
                canMakePayments(success: () => void,
                                error: (message: string) => void): void;
                restore(callback?: Callback<any>): void;
                manageSubscriptions(callback?: Callback<any>): void;
                manageBilling(callback?: Callback<any>): void;
                presentCodeRedemptionSheet(callback?: Callback<any>): void;
                refreshReceipts(successCb: (receipt: ApplicationReceipt) => void,
                                errorCb: (code: ErrorCode, message: string) => void): void;
                loadReceipts(callback: (receipt: ApplicationReceipt) => void,
                             errorCb: (code: ErrorCode, message: string) => void): void;
            }
        }
    }
}
