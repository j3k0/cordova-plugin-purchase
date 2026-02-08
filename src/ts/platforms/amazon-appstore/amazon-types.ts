namespace CdvPurchase {
    export namespace AmazonAppStore {

        export namespace Bridge {

            /** Amazon product data */
            export interface AmazonProduct {
                /** Product SKU */
                productId: string;
                /** Product title */
                title: string;
                /** Product description */
                description: string;
                /** Formatted price string (e.g., "$0.99") */
                price?: string;
                /** Price in micro-units */
                priceMicros?: number;
                /** Currency code */
                currency?: string;
                /** Product type: CONSUMABLE, ENTITLED, or SUBSCRIPTION */
                productType: string;
            }

            /** Amazon purchase receipt */
            export interface AmazonPurchase {
                /** Amazon receipt ID */
                receiptId: string;
                /** Product SKU */
                productId: string;
                /** Product type */
                productType: string;
                /** Purchase date (ms since epoch) */
                purchaseDate: number;
                /** Whether the purchase has been canceled */
                canceled: boolean;
                /** Amazon user ID */
                userId?: string;
                /** Amazon marketplace */
                marketplace?: string;
            }

            /** Response from getProductData */
            export interface ProductDataResponse {
                products: AmazonProduct[];
                unavailableSkus: string[];
            }

            /** Response from purchase */
            export interface PurchaseResponse {
                purchase: AmazonPurchase;
                status: string;
            }

            /** Options for bridge initialization */
            export interface Options {
                log?: (msg: string) => void;
                showLog?: boolean;
                onPurchasesUpdated?: (purchases: AmazonPurchase[]) => void;
                onSetPurchases?: (purchases: AmazonPurchase[]) => void;
                onPurchaseFulfilled?: (purchase: AmazonPurchase) => void;
            }

            export type ErrorCallback = (message: string, code?: ErrorCode) => void;

            export type Message = {
                type: "setPurchases";
                data: { purchases: AmazonPurchase[]; };
            } | {
                type: "purchasesUpdated";
                data: { purchases: AmazonPurchase[]; };
            } | {
                type: "purchaseFulfilled";
                data: { purchase: AmazonPurchase; };
            };
        }
    }
}
