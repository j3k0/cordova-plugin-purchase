namespace CdvPurchase {

    export namespace AppleAppStore {

        export namespace VerifyReceipt {

            export interface AppleTransaction {

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
            export interface AppleUnifiedReceipt {

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


            // https://developer.apple.com/documentation/appstorereceipts/responsebody/pending_renewal_info
            export interface ApplePendingRenewalInfo {
                // The current renewal preference for the auto-renewable subscription. The value for this key corresponds to the productIdentifier property of the product that the customer’s subscription renews. This field is only present if the user downgrades or crossgrades to a subscription of a different duration for the subsequent subscription period.
                auto_renew_product_id?: string;

                // The current renewal status for the auto-renewable subscription. See auto_renew_status for more information.
                auto_renew_status?: '1' | '0';

                // The reason a subscription expired. This field is only present for a receipt that contains an expired auto-renewable subscription.
                expiration_intent?: AppleExpirationIntent;

                // The time at which the grace period for subscription renewals expires, in a date-time format similar to the ISO 8601.
                grace_period_expires_date?: string;

                // The time at which the grace period for subscription renewals expires, in UNIX epoch time format, in milliseconds. This key is only present for apps that have Billing Grace Period enabled and when the user experiences a billing error at the time of renewal. Use this time format for processing dates.
                grace_period_expires_date_ms?: string;

                // The time at which the grace period for subscription renewals expires, in the Pacific Time zone.
                grace_period_expires_date_pst?: string;

                // https://developer.apple.com/documentation/appstorereceipts/is_in_billing_retry_period
                // A flag that indicates Apple is attempting to renew an expired subscription automatically. This field is only present if an auto-renewable subscription is in the billing retry state.
                is_in_billing_retry_period?: string;

                // The transaction identifier of the original purchase.
                original_transaction_id: string; // XXX can this be undefined?

                // The price consent status for a subscription price increase. This field is only present if the customer was notified of the price increase. The default value is "0" and changes to "1" if the customer consents.
                price_consent_status?: '0' | '1';

                // The unique identifier of the product purchased. You provide this value when creating the product in App Store Connect, and it corresponds to the productIdentifier property of the SKPayment object stored in the transaction's payment property.
                product_id: string;
            }

            /** The reason a subscription expired.
             * https://developer.apple.com/documentation/appstorereceipts/expiration_intent
             */
            export enum AppleExpirationIntent {
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

            export interface AppleVerifyReceiptResponse extends AppleUnifiedReceipt {

                /** Either 0 if the receipt is valid, or a status code if there is an error.
                 * The status code reflects the status of the app receipt as a whole.
                 * https://developer.apple.com/documentation/appstorereceipts/status */
                status: number; // 0 indicates a valid receipt

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

            export interface AppleVerifyReceiptResponseReceipt {

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
            export type AppleReceiptType =
                'Production'
                | 'ProductionVPP'
                | 'ProductionSandbox'
                | 'ProductionVPPSandbox';

            export type AppleEnvironment =
                'Production' | 'Sandbox';

            export type AppleBoolean =
                'false' | 'true' | '0' | '1';
        }
    }
}
