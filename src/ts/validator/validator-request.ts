namespace CdvPurchase {
    export namespace Validator {
        export namespace Request {
            /**
             * Body of a receipt validation request
             */
            export interface Body {

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

                offers?: { id: string; pricingPhases: PricingPhase[] }[];
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
                device?: CdvPurchase.Validator.DeviceInfo;

                /** List of products available in the store */
                products: {
                    /** Type of product (subscription, consumable, etc.) */
                    type: ProductType;

                    /** Product identifier on the store (unique per platform) */
                    id: string;

                    /** List of offers available for this product */
                    offers: {
                        id: string;
                        pricingPhases: PricingPhase[];
                    }[];
                }[];
            }

            export type ApiValidatorBodyTransaction =
                | ApiValidatorBodyTransactionApple
                | ApiValidatorBodyTransactionGoogle
                | ApiValidatorBodyTransactionWindows
                | ApiValidatorBodyTransactionBraintree
            //  | ApiValidatorBodyTransactionStripe;
                ;

            /** Transaction type from an Apple powered device  */
            export interface ApiValidatorBodyTransactionApple {

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
                transactionReceipt?: never;
            }

            /** Transaction type from a google powered device  */
            export interface ApiValidatorBodyTransactionGoogle {
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

                // /** Google's purchase state. @ignore */
                // purchaseState?: number;

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
            export interface ApiValidatorBodyTransactionWindows {

                /** Value `"windows-store-transaction"` */
                type: Platform.WINDOWS_STORE;

                // /** @ignore */
                // id?: string;

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

            /** Transaction type from Braintree */
            export interface ApiValidatorBodyTransactionBraintree {

                /** Value `"braintree"` */
                type: Platform.BRAINTREE;

                /** No need for an id, just set to a non-empty string */
                id: string;

                /** Payment method nonce */
                paymentMethodNonce: string;

                /** Type of payment method (only used for information) */
                paymentMethodType?: string;

                /** Description of the payment method (only used for information) */
                paymentDescription?: string;

                /** Data collected on the device */
                deviceData: any;
            }

            /* Transaction type from Stripe
             *
             * Currently unsupported.
            export interface ApiValidatorBodyTransactionStripe {

                /** Value `"stripe-charge"` *
                type: 'stripe-charge';

                /** Identifier of the Stripe charge. @required *
                id?: string;
            }*/

            /** Describe a discount */
            export interface DiscountDefinition {
                /** Discount identifier */
                id?: string;
                /** Localized Price */
                price?: string;
                /** Price is micro units */
                priceMicros?: number;
                /** Payment mode */
                paymentMode?: DiscountPaymentMode
                /** Number of periods */
                period?: number;
                /** Discount type */
                type?: DiscountType;
                /** Period unit */
                periodUnit?: SubscriptionPeriodUnit;
            };

            export type DiscountType = 'Subscription';

            export type DiscountPaymentMode =
                'FreeTrial';

            export type SubscriptionPeriodUnit = 'Day' | 'Week' | 'Month' | 'Year';
        }
    }
}
