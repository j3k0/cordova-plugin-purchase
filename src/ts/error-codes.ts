namespace CdvPurchase {

    const ERROR_CODES_BASE = 6777000;

    /**
     * Error codes
     */
    export enum ErrorCode {

        /** Error: Failed to intialize the in-app purchase library */
        SETUP = ERROR_CODES_BASE + 1,
        /** Error: Failed to load in-app products metadata */
        LOAD = ERROR_CODES_BASE + 2,
        /** Error: Failed to make a purchase */
        PURCHASE = ERROR_CODES_BASE + 3,
        /** Error: Failed to load the purchase receipt */
        LOAD_RECEIPTS = ERROR_CODES_BASE + 4,
        /** Error: Client is not allowed to issue the request */
        CLIENT_INVALID = ERROR_CODES_BASE + 5,
        /** Error: Purchase flow has been cancelled by user */
        PAYMENT_CANCELLED = ERROR_CODES_BASE + 6,
        /** Error: Something is suspicious about a purchase */
        PAYMENT_INVALID = ERROR_CODES_BASE + 7,
        /** Error: The user is not allowed to make a payment */
        PAYMENT_NOT_ALLOWED = ERROR_CODES_BASE + 8,
        /** Error: Unknown error */
        UNKNOWN = ERROR_CODES_BASE + 10,
        /** Error: Failed to refresh the purchase receipt */
        REFRESH_RECEIPTS = ERROR_CODES_BASE + 11,
        /** Error: The product identifier is invalid */
        INVALID_PRODUCT_ID = ERROR_CODES_BASE + 12,
        /** Error: Cannot finalize a transaction or acknowledge a purchase */
        FINISH = ERROR_CODES_BASE + 13,
        /** Error: Failed to communicate with the server */
        COMMUNICATION = ERROR_CODES_BASE + 14,
        /** Error: Subscriptions are not available */
        SUBSCRIPTIONS_NOT_AVAILABLE = ERROR_CODES_BASE + 15,
        /** Error: Purchase information is missing token */
        MISSING_TOKEN = ERROR_CODES_BASE + 16,
        /** Error: Verification of store data failed */
        VERIFICATION_FAILED = ERROR_CODES_BASE + 17,
        /** Error: Bad response from the server */
        BAD_RESPONSE = ERROR_CODES_BASE + 18,
        /** Error: Failed to refresh the store */
        REFRESH = ERROR_CODES_BASE + 19,
        /** Error: Payment has expired */
        PAYMENT_EXPIRED = ERROR_CODES_BASE + 20,
        /** Error: Failed to download the content */
        DOWNLOAD = ERROR_CODES_BASE + 21,
        /** Error: Failed to update a subscription */
        SUBSCRIPTION_UPDATE_NOT_AVAILABLE = ERROR_CODES_BASE + 22,
        /** Error: The requested product is not available in the store. */
        PRODUCT_NOT_AVAILABLE = ERROR_CODES_BASE + 23,
        /** Error: The user has not allowed access to Cloud service information */
        CLOUD_SERVICE_PERMISSION_DENIED = ERROR_CODES_BASE + 24,
        /** Error: The device could not connect to the network. */
        CLOUD_SERVICE_NETWORK_CONNECTION_FAILED = ERROR_CODES_BASE + 25,
        /** Error: The user has revoked permission to use this cloud service. */
        CLOUD_SERVICE_REVOKED = ERROR_CODES_BASE + 26,
        /** Error: The user has not yet acknowledged Apple’s privacy policy */
        PRIVACY_ACKNOWLEDGEMENT_REQUIRED = ERROR_CODES_BASE + 27,
        /** Error: The app is attempting to use a property for which it does not have the required entitlement. */
        UNAUTHORIZED_REQUEST_DATA = ERROR_CODES_BASE + 28,
        /** Error: The offer identifier is invalid. */
        INVALID_OFFER_IDENTIFIER = ERROR_CODES_BASE + 29,
        /** Error: The price you specified in App Store Connect is no longer valid. */
        INVALID_OFFER_PRICE = ERROR_CODES_BASE + 30,
        /** Error: The signature in a payment discount is not valid. */
        INVALID_SIGNATURE = ERROR_CODES_BASE + 31,
        /** Error: Parameters are missing in a payment discount. */
        MISSING_OFFER_PARAMS = ERROR_CODES_BASE + 32,

        /**
         * Server code used when a subscription expired.
         *
         * @deprecated Validator should now return the transaction in the collection as expired.
         */
        VALIDATOR_SUBSCRIPTION_EXPIRED = 6778003
    }

    /**
     * Create an {@link IError} instance
     *
     * @internal
     */
    export function storeError(code: ErrorCode, message: string, platform: Platform | null, productId: string | null): IError {
        return { isError: true, code, message, platform, productId };
    }
}
