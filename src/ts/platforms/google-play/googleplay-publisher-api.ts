namespace CdvPurchase {

    export namespace GooglePlay {

        export namespace PublisherAPI {

            /**
             * A SubscriptionPurchase resource indicates the status of a user's subscription purchase.
             */
            interface SubscriptionPurchase_API {
                /**
                 * This kind represents a subscriptionPurchase object in the androidpublisher service.
                 */
                kind: "androidpublisher#subscriptionPurchase";
                /**
                 * The acknowledgement state of the subscription product. Possible values are: 0. Yet to be acknowledged 1. Acknowledged
                 */
                acknowledgementState?: number | null;
                /**
                 * Whether the subscription will automatically be renewed when it reaches its current expiry time.
                 */
                autoRenewing?: boolean | null;
                /**
                 * Time at which the subscription will be automatically resumed, in milliseconds since the Epoch. Only present if the user has requested to pause the subscription.
                 */
                autoResumeTimeMillis?: string | null;
                /**
                 * The reason why a subscription was canceled or is not auto-renewing. Possible values are: 0. User canceled the subscription 1. Subscription was canceled by the system, for example because of a billing problem 2. Subscription was replaced with a new subscription 3. Subscription was canceled by the developer
                 */
                cancelReason?: number | null;
                /**
                 * Information provided by the user when they complete the subscription cancellation flow (cancellation reason survey).
                 */
                cancelSurveyResult?: SubscriptionCancelSurveyResult;
                /**
                 * ISO 3166-1 alpha-2 billing country/region code of the user at the time the subscription was granted.
                 */
                countryCode?: string | null;
                /**
                 * A developer-specified string that contains supplemental information about an order.
                 */
                developerPayload?: string | null;
                /**
                 * The email address of the user when the subscription was purchased. Only present for purchases made with 'Subscribe with Google'.
                 */
                emailAddress?: string | null;
                /**
                 * Time at which the subscription will expire, in milliseconds since the Epoch.
                 */
                expiryTimeMillis?: string | null;
                /**
                 * User account identifier in the third-party service. Only present if account linking happened as part of the subscription purchase flow.
                 */
                externalAccountId?: string | null;
                /**
                 * The family name of the user when the subscription was purchased. Only present for purchases made with 'Subscribe with Google'.
                 */
                familyName?: string | null;
                /**
                 * The given name of the user when the subscription was purchased. Only present for purchases made with 'Subscribe with Google'.
                 */
                givenName?: string | null;
                /**
                 * Introductory price information of the subscription. This is only present when the subscription was purchased with an introductory price. This field does not indicate the subscription is currently in introductory price period.
                 */
                introductoryPriceInfo?: IntroductoryPriceInfo;
                /**
                 * The purchase token of the originating purchase if this subscription is one of the following: 0. Re-signup of a canceled but non-lapsed subscription 1. Upgrade/downgrade from a previous subscription For example, suppose a user originally signs up and you receive purchase token X, then the user cancels and goes through the resignup flow (before their subscription lapses) and you receive purchase token Y, and finally the user upgrades their subscription and you receive purchase token Z. If you call this API with purchase token Z, this field will be set to Y. If you call this API with purchase token Y, this field will be set to X. If you call this API with purchase token X, this field will not be set.
                 */
                linkedPurchaseToken?: string | null;
                /**
                 * An obfuscated version of the id that is uniquely associated with the user's account in your app. Present for the following purchases: * If account linking happened as part of the subscription purchase flow. * It was specified using https://developer.android.com/reference/com/android/billingclient/api/BillingFlowParams.Builder#setobfuscatedaccountid when the purchase was made.
                 */
                obfuscatedExternalAccountId?: string | null;
                /**
                 * An obfuscated version of the id that is uniquely associated with the user's profile in your app. Only present if specified using https://developer.android.com/reference/com/android/billingclient/api/BillingFlowParams.Builder#setobfuscatedprofileid when the purchase was made.
                 */
                obfuscatedExternalProfileId?: string | null;
                /**
                 * The order id of the latest recurring order associated with the purchase of the subscription. If the subscription was canceled because payment was declined, this will be the order id from the payment declined order.
                 */
                orderId?: string | null;
                /**
                 * The payment state of the subscription. Possible values are: 0. Payment pending 1. Payment received 2. Free trial 3. Pending deferred upgrade/downgrade Not present for canceled, expired subscriptions.
                 */
                paymentState?: number | null;
                /**
                 * Price of the subscription, For tax exclusive countries, the price doesn't include tax. For tax inclusive countries, the price includes tax. Price is expressed in micro-units, where 1,000,000 micro-units represents one unit of the currency. For example, if the subscription price is €1.99, price_amount_micros is 1990000.
                 */
                priceAmountMicros?: string | null;
                /**
                 * The latest price change information available. This is present only when there is an upcoming price change for the subscription yet to be applied. Once the subscription renews with the new price or the subscription is canceled, no price change information will be returned.
                 */
                priceChange?: SubscriptionPriceChange;
                /**
                 * ISO 4217 currency code for the subscription price. For example, if the price is specified in British pounds sterling, price_currency_code is "GBP".
                 */
                priceCurrencyCode?: string | null;
                /**
                 * The Google profile id of the user when the subscription was purchased. Only present for purchases made with 'Subscribe with Google'.
                 */
                profileId?: string | null;
                /**
                 * The profile name of the user when the subscription was purchased. Only present for purchases made with 'Subscribe with Google'.
                 */
                profileName?: string | null;
                /**
                 * The promotion code applied on this purchase. This field is only set if a vanity code promotion is applied when the subscription was purchased.
                 */
                promotionCode?: string | null;
                /**
                 * The type of promotion applied on this purchase. This field is only set if a promotion is applied when the subscription was purchased. Possible values are: 0. One time code 1. Vanity code
                 */
                promotionType?: number | null;
                /**
                 * The type of purchase of the subscription. This field is only set if this purchase was not made using the standard in-app billing flow. Possible values are: 0. Test (i.e. purchased from a license testing account) 1. Promo (i.e. purchased using a promo code)
                 */
                purchaseType?: number | null;
                /**
                 * Time at which the subscription was granted, in milliseconds since the Epoch.
                 */
                startTimeMillis?: string | null;
                /**
                 * The time at which the subscription was canceled by the user, in milliseconds since the epoch. Only present if cancelReason is 0.
                 */
                userCancellationTimeMillis?: string | null;
            }

            /**
             * Contains the price change information for a subscription that can be used to control the user journey for the price change in the app. This can be in the form of seeking confirmation from the user or tailoring the experience for a successful conversion.
             */
            export interface SubscriptionPriceChange {
                /**
                 * The new price the subscription will renew with if the price change is accepted by the user.
                 */
                newPrice?: Price;
                /**
                 * The current state of the price change. Possible values are: 0. Outstanding: State for a pending price change waiting for the user to agree. In this state, you can optionally seek confirmation from the user using the In-App API. 1. Accepted: State for an accepted price change that the subscription will renew with unless it's canceled. The price change takes effect on a future date when the subscription renews. Note that the change might not occur when the subscription is renewed next.
                 */
                state?: number | null;
            }

            /**
             * Definition of a price, i.e. currency and units.
             */
            export interface Price {
                /**
                 * 3 letter Currency code, as defined by ISO 4217. See java/com/google/common/money/CurrencyCode.java
                 */
                currency?: string | null;
                /**
                 * Price in 1/million of the currency base unit, represented as a string.
                 */
                priceMicros?: string | null;
            }

            /**
             * Information provided by the user when they complete the subscription cancellation flow (cancellation reason survey).
             */
            export interface SubscriptionCancelSurveyResult {
                /**
                 * The cancellation reason the user chose in the survey. Possible values are: 0. Other 1. I don't use this service enough 2. Technical issues 3. Cost-related reasons 4. I found a better app
                 */
                cancelSurveyReason?: number | null;
                /**
                 * The customized input cancel reason from the user. Only present when cancelReason is 0.
                 */
                userInputCancelReason?: string | null;
            }

            /** Information specific to a subscription in canceled state. */
            export type CanceledStateContext =
                // Union field cancellation_reason can be only one of the following:
                {
                    /** Subscription was canceled by user. */
                    userInitiatedCancellation: UserInitiatedCancellation;
                } |
                {
                    /** Subscription was canceled by the system, for example because of a billing problem. */
                    systemInitiatedCancellation: SystemInitiatedCancellation;
                } |
                {
                    /** Subscription was canceled by the developer. */
                    developerInitiatedCancellation: DeveloperInitiatedCancellation;
                } |
                {
                    /** Subscription was replaced by a new subscription. */
                    replacementCancellation: ReplacementCancellation;
                };

            /** Information specific to cancellations initiated by users. */
            export interface UserInitiatedCancellation {
                /** Information provided by the user when they complete the subscription cancellation flow (cancellation reason survey). */
                cancelSurveyResult?: CancelSurveyResult;
                /**
                 * The time at which the subscription was canceled by the user. The user might still have access to the subscription after this time. Use lineItems.expiry_time to determine if a user still has access.
                 *
                 * A timestamp in RFC3339 UTC "Zulu" format, with nanosecond resolution and up to nine fractional digits. Examples: "2014-10-02T15:01:23Z" and "2014-10-02T15:01:23.045123456Z".
                 */
                cancelTime?: string | null;
            }
            /** Result of the cancel survey when the subscription was canceled by the user. */

            export interface CancelSurveyResult {
                /**
                 * The reason the user selected in the cancel survey.
                 */
                reason?: CancelSurveyReason | null;
                /**
                 * Only set for CANCEL_SURVEY_REASON_OTHERS. This is the user's freeform response to the survey.
                 */
                reasonUserInput?: string | null;
            }
            /** The reason the user selected in the cancel survey. */

            export type CancelSurveyReason =
                | "CANCEL_SURVEY_REASON_UNSPECIFIED" // Unspecified cancel survey reason.
                | "CANCEL_SURVEY_REASON_NOT_ENOUGH_USAGE" // Not enough usage of the subscription.
                | "CANCEL_SURVEY_REASON_TECHNICAL_ISSUES" // Technical issues while using the app.
                | "CANCEL_SURVEY_REASON_COST_RELATED" // Cost related issues.
                | "CANCEL_SURVEY_REASON_FOUND_BETTER_APP" // The user found a better app.
                | "CANCEL_SURVEY_REASON_OTHERS" // Other reasons.
                ;
            /** Information specific to cancellations initiated by Google system. */

            export type SystemInitiatedCancellation = unknown;
            /** Information specific to cancellations initiated by developers. */

            export type DeveloperInitiatedCancellation = unknown;
            /** Information specific to cancellations caused by subscription replacement. */

            export type ReplacementCancellation = unknown;

            /**
             * A SubscriptionPurchase resource indicates the status of a user's subscription purchase.
             */
            interface SubscriptionPurchaseV2_API {
                /**
                 * This kind represents a subscriptionPurchase object in the androidpublisher service.
                 */
                kind: "androidpublisher#subscriptionPurchaseV2";
                /**
                 * The acknowledgement state of the subscription.
                 */
                acknowledgementState?: AcknowledgementState | null;
                /**
                 * Additional context around canceled subscriptions. Only present if the subscription currently has subscriptionState SUBSCRIPTION_STATE_CANCELED.
                 */
                canceledStateContext?: CanceledStateContext | null;
                /**
                 * User account identifier in the third-party service.
                 */
                externalAccountIdentifiers?: ExternalAccountIdentifiers | null;
                /**
                 * The order id of the latest order associated with the purchase of the subscription. For autoRenewing subscription, this is the order id of signup order if it is not renewed yet, or the last recurring order id (success, pending, or declined order). For prepaid subscription, this is the order id associated with the queried purchase token.
                 */
                latestOrderId?: string | null;
                /**
                 * Item-level info for a subscription purchase. The items in the same purchase should be either all with AutoRenewingPlan or all with PrepaidPlan.
                 */
                lineItems?: SubscriptionPurchaseLineItem[] | null;
                /**
                 * The purchase token of the old subscription if this subscription is one of the following:
                 * - Re-signup of a canceled but non-lapsed subscription
                 * - Upgrade/downgrade from a previous subscription.
                 * - Convert from prepaid to auto renewing subscription.
                 * - Convert from an auto renewing subscription to prepaid.
                 * - Topup a prepaid subscription.
                 */
                linkedPurchaseToken?: string | null;
                /**
                 * Additional context around paused subscriptions. Only present if the subscription currently has subscriptionState SUBSCRIPTION_STATE_PAUSED.
                 */
                pausedStateContext?: PausedStateContext | null;
                /**
                 * ISO 3166-1 alpha-2 billing country/region code of the user at the time the subscription was granted.
                 */
                regionCode?: string | null;
                /**
                 * Time at which the subscription was granted. Not set for pending subscriptions (subscription was created but awaiting payment during signup).
                 *
                 * A timestamp in RFC3339 UTC "Zulu" format, with nanosecond resolution and up to nine fractional digits. Examples: "2014-10-02T15:01:23Z" and "2014-10-02T15:01:23.045123456Z".
                 */
                startTime?: string | null;
                /**
                 * User profile associated with purchases made with 'Subscribe with Google'.
                 */
                subscribeWithGoogleInfo?: SubscribeWithGoogleInfo | null;
                /**
                 * The current state of the subscription.
                 */
                subscriptionState?: SubscriptionState | null;
                /**
                 * Only present if this subscription purchase is a test purchase.
                 */
                testPurchase?: TestPurchase | null;
            }

            /**
             * Information specific to a subscription in paused state.
             */
            export interface PausedStateContext {
                /**
                 * Time at which the subscription will be automatically resumed.
                 *
                 * A timestamp in RFC3339 UTC "Zulu" format, with nanosecond resolution and up to nine fractional digits. Examples: "2014-10-02T15:01:23Z" and "2014-10-02T15:01:23.045123456Z".
                 */
                autoResumeTime?: string | null;
            }

            /**
             * The potential states a subscription can be in, for example whether it is active or canceled.
             *
             * The items within a subscription purchase can either be all auto renewing plans or prepaid plans.
             */
            export type SubscriptionState =
                | "SUBSCRIPTION_STATE_UNSPECIFIED" // Unspecified subscription state.
                | "SUBSCRIPTION_STATE_PENDING" // Subscription was created but awaiting payment during signup. In this state, all items are awaiting payment.
                | "SUBSCRIPTION_STATE_ACTIVE" // Subscription is active. - (1) If the subscription is an auto renewing plan, at least one item is autoRenewEnabled and not expired. - (2) If the subscription is a prepaid plan, at least one item is not expired.
                | "SUBSCRIPTION_STATE_PAUSED" // Subscription is paused. The state is only available when the subscription is an auto renewing plan. In this state, all items are in paused state.
                | "SUBSCRIPTION_STATE_IN_GRACE_PERIOD" // Subscription is in grace period. The state is only available when the subscription is an auto renewing plan. In this state, all items are in grace period.
                | "SUBSCRIPTION_STATE_ON_HOLD" // Subscription is on hold (suspended). The state is only available when the subscription is an auto renewing plan. In this state, all items are on hold.
                | "SUBSCRIPTION_STATE_CANCELED" // Subscription is canceled but not expired yet. The state is only available when the subscription is an auto renewing plan. All items have autoRenewEnabled set to false.
                | "SUBSCRIPTION_STATE_EXPIRED" // Subscription is expired. All items have expiryTime in the past.
                ;

            /**
             * Information associated with purchases made with 'Subscribe with Google'.
             */
            export interface SubscribeWithGoogleInfo {
                /**
                 * The Google profile id of the user when the subscription was purchased.
                 */
                profileId?: string | null;
                /**
                 * The profile name of the user when the subscription was purchased.
                 */
                profileName?: string | null;
                /**
                 * The email address of the user when the subscription was purchased.
                 */
                emailAddress?: string | null;
                /**
                 * The given name of the user when the subscription was purchased.
                 */
                givenName?: string | null;
                /**
                 * The family name of the user when the subscription was purchased.
                 */
                familyName?: string | null;
            }
            /**
             * Item-level info for a subscription purchase.
             */

            export type SubscriptionPurchaseLineItem = {
                /**
                 * The purchased product ID (for example, 'monthly001').
                 */
                productId?: string | null;
                /**
                 * Time at which the subscription expired or will expire unless the access is extended (ex. renews).
                 *
                 * A timestamp in RFC3339 UTC "Zulu" format, with nanosecond resolution and up to nine fractional digits. Examples: "2014-10-02T15:01:23Z" and "2014-10-02T15:01:23.045123456Z".
                 */
                expiryTime?: string | null;
            } & ({
                /**
                 * The item is auto renewing.
                 */
                autoRenewingPlan?: AutoRenewingPlan | null;
            } | {
                /**
                 * The item is prepaid.
                 */
                prepaidPlan?: PrepaidPlan | null;
            });

            /** The possible acknowledgement states for a subscription. */

            export type AcknowledgementState = "ACKNOWLEDGEMENT_STATE_UNSPECIFIED" // Unspecified acknowledgement state.
                |
                "ACKNOWLEDGEMENT_STATE_PENDING" // The subscription is not acknowledged yet.
                |
                "ACKNOWLEDGEMENT_STATE_ACKNOWLEDGED"; // The subscription is acknowledged.

            /** User account identifier in the third-party service. */
            export interface ExternalAccountIdentifiers {
                /**
                 * User account identifier in the third-party service. Only present if account linking happened as part of the subscription purchase flow.
                 */
                externalAccountId?: string | null;
                /**
                 * An obfuscated version of the id that is uniquely associated with the user's account in your app. Present for the following purchases: * If account linking happened as part of the subscription purchase flow. * It was specified using https://developer.android.com/reference/com/android/billingclient/api/BillingFlowParams.Builder#setobfuscatedaccountid when the purchase was made.
                 */
                obfuscatedExternalAccountId?: string | null;

                /**
                 * An obfuscated version of the id that is uniquely associated with the user's profile in your app. Only present if specified using https://developer.android.com/reference/com/android/billingclient/api/BillingFlowParams.Builder#setobfuscatedprofileid when the purchase was made.
                 */
                obfuscatedExternalProfileId?: string | null;
            }

            /** Information related to an auto renewing plan. */

            export interface AutoRenewingPlan {
                /**
                 * If the subscription is currently set to auto-renew, e.g. the user has not canceled the subscription
                 */
                autoRenewEnabled?: boolean;
            }
            /**
             * Information related to a prepaid plan.
             */

            export interface PrepaidPlan {
                /**
                 * After this time, the subscription is allowed for a new top-up purchase. Not present if the subscription is already extended by a top-up purchase.
                 *
                 * A timestamp in RFC3339 UTC "Zulu" format, with nanosecond resolution and up to nine fractional digits. Examples: "2014-10-02T15:01:23Z" and "2014-10-02T15:01:23.045123456Z".
                 */
                allowExtendAfterTime?: string | null;
            }

            /** Whether this subscription purchase is a test purchase. */
            export type TestPurchase = unknown;

            /**
             * Contains the introductory price information for a subscription.
             */
            export interface IntroductoryPriceInfo {
                /**
                 * Introductory price of the subscription, not including tax. The currency is the same as price_currency_code. Price is expressed in micro-units, where 1,000,000 micro-units represents one unit of the currency. For example, if the subscription price is €1.99, price_amount_micros is 1990000.
                 */
                introductoryPriceAmountMicros?: string | null;
                /**
                 * ISO 4217 currency code for the introductory subscription price. For example, if the price is specified in British pounds sterling, price_currency_code is "GBP".
                 */
                introductoryPriceCurrencyCode?: string | null;
                /**
                 * The number of billing period to offer introductory pricing.
                 */
                introductoryPriceCycles?: number | null;
                /**
                 * Introductory price period, specified in ISO 8601 format. Common values are (but not limited to) "P1W" (one week), "P1M" (one month), "P3M" (three months), "P6M" (six months), and "P1Y" (one year).
                 */
                introductoryPricePeriod?: string | null;
            }

            /**
             * A ProductPurchase resource indicates the status of a user's inapp product purchase.
             */
            interface ProductPurchase_API {
                /**
                 * This kind represents an inappPurchase object in the androidpublisher service.
                 */
                kind: "androidpublisher#productPurchase";
                /**
                 * The acknowledgement state of the inapp product. Possible values are: 0. Yet to be acknowledged 1. Acknowledged
                 */
                acknowledgementState?: number | null;
                /**
                 * The consumption state of the inapp product. Possible values are: 0. Yet to be consumed 1. Consumed
                 */
                consumptionState?: number | null;
                /**
                 * A developer-specified string that contains supplemental information about an order.
                 */
                developerPayload?: string | null;
                /**
                 * An obfuscated version of the id that is uniquely associated with the user's account in your app. Only present if specified using https://developer.android.com/reference/com/android/billingclient/api/BillingFlowParams.Builder#setobfuscatedaccountid when the purchase was made.
                 */
                obfuscatedExternalAccountId?: string | null;
                /**
                 * An obfuscated version of the id that is uniquely associated with the user's profile in your app. Only present if specified using https://developer.android.com/reference/com/android/billingclient/api/BillingFlowParams.Builder#setobfuscatedprofileid when the purchase was made.
                 */
                obfuscatedExternalProfileId?: string | null;
                /**
                 * The order id associated with the purchase of the inapp product.
                 */
                orderId?: string | null;
                /**
                 * The inapp product SKU.
                 */
                productId?: string | null;
                /**
                 * The purchase state of the order. Possible values are: 0. Purchased 1. Canceled 2. Pending
                 */
                purchaseState?: number | null;
                /**
                 * The time the product was purchased, in milliseconds since the epoch (Jan 1, 1970).
                 */
                purchaseTimeMillis?: string | null;
                /**
                 * The purchase token generated to identify this purchase.
                 */
                purchaseToken?: string | null;
                /**
                 * The type of purchase of the inapp product. This field is only set if this purchase was not made using the standard in-app billing flow. Possible values are: 0. Test (i.e. purchased from a license testing account) 1. Promo (i.e. purchased using a promo code) 2. Rewarded (i.e. from watching a video ad instead of paying)
                 */
                purchaseType?: number | null;
                /**
                 * The quantity associated with the purchase of the inapp product.
                 */
                quantity?: number | null;
                /**
                 * ISO 3166-1 alpha-2 billing region code of the user at the time the product was granted.
                 */
                regionCode?: string | null;
            }

            export type GooglePurchase = ProductPurchaseExt | SubscriptionPurchaseExt | SubscriptionPurchaseV2Ext | GoogleSubscriptionGone;

            export interface SubscriptionPurchaseExt
                extends SubscriptionPurchase_API {
                kind: 'androidpublisher#subscriptionPurchase';
                productId?: string;
            }

            export interface SubscriptionPurchaseV2Ext
                extends SubscriptionPurchaseV2_API {
                kind: 'androidpublisher#subscriptionPurchaseV2';
            }

            export interface ProductPurchaseExt
                extends ProductPurchase_API {
                kind: 'androidpublisher#productPurchase';
                productId?: string;
            }

            export interface GoogleSubscriptionGone extends ErrorResponse_API {
                kind: 'fovea#subscriptionGone';
            }


            export enum GoogleErrorReason {

                /** The subscription purchase is no longer available for query because it has been expired for too long. */
                SUBSCRIPTION_NO_LONGER_AVAILABLE = "subscriptionPurchaseNoLongerAvailable",

                /** The purchase token is no longer valid. */
                PURCHASE_TOKEN_NO_LONGER_VALID = "purchaseTokenNoLongerValid",
            }

            /** Google API error */
            export interface ApiError {
                message: string;
                domain: "androidpublisher";
                reason: GoogleErrorReason;
                location?: string;
                locationType?: string;
            }

            /** Google API error response payload */
            export interface ErrorResponse_API {
                kind?: string;
                errors: Array<ApiError>;
                code: ErrorCode;
                message: string;
            }

            /**
           * Those are actually HTTP status codes.
           *
           * Duplicated here for documentation purposes.
           */
            export enum ErrorCode {
                /** The subscription purchase is no longer available for query because it has been expired for too long. */
                GONE = 410,
            }

        }
    }
}
