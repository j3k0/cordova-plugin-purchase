namespace CdvPurchase {

    export namespace Validator {

        export namespace Response {

            export type Payload = SuccessPayload | ErrorPayload;

            /** Response from a validator endpoint */
            export interface SuccessPayload {

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
                }
            }

            export type NativeTransaction =
                | ({ type: 'braintree'; data: Braintree.TransactionObject})
                | ({ type: 'windows-store-transaction' } & WindowsStore.WindowsSubscription)
                | ({ type: 'ios-appstore'; } & (AppleAppStore.VerifyReceipt.AppleTransaction | AppleAppStore.VerifyReceipt.AppleVerifyReceiptResponseReceipt))
                | ({ type: 'android-playstore'; } & GooglePlay.PublisherAPI.GooglePurchase)
                | ({ type: 'test'; })
                //  | ({ type: 'stripe-charge'; } & StripeCharge);
                ;

            /** Error response from the validator endpoint */
            export interface ErrorPayload {
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
