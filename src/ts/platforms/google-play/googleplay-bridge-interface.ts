namespace CdvPurchase {
    export namespace GooglePlay {
        export namespace Bridge {

            /**
             * Shared interface for Google Play bridge implementations.
             * Both Cordova and Capacitor bridges implement this interface.
             * The adapter programs against this interface, not a concrete class.
             */
            export interface BridgeInterface {

                options: Options;

                init(success: () => void, fail: ErrorCallback, options: Options): void;

                load(success: () => void, fail: ErrorCallback,
                     skus: string[], inAppSkus: string[], subsSkus: string[]): void;

                getPurchases(success: () => void, fail: ErrorCallback): void;

                buy(success: () => void, fail: ErrorCallback,
                    productId: string, additionalData: CdvPurchase.AdditionalData): void;

                subscribe(success: () => void, fail: ErrorCallback,
                          productId: string, additionalData: CdvPurchase.AdditionalData): void;

                consumePurchase(success: () => void, fail: ErrorCallback,
                                purchaseToken: string): void;

                acknowledgePurchase(success: () => void, fail: ErrorCallback,
                                    purchaseToken: string): void;

                getAvailableProducts(inAppSkus: string[], subsSkus: string[],
                                     success: (validProducts: (InAppProduct | Subscription)[]) => void,
                                     fail: ErrorCallback): void;

                manageSubscriptions(): void;

                manageBilling(): void;

                launchPriceChangeConfirmationFlow(productId: string): void;

                getStorefront(success: (countryCode: string) => void, fail: ErrorCallback): void;
            }
        }
    }
}
