namespace CdvPurchase {

    /** @internal */
    export namespace Internal {
        /**
         * Set of function used to provide a nicer API (or more backward compatible)
         */
        export interface VerifiedReceiptDecorator {
            finish(receipt: VerifiedReceipt): Promise<void>;
        }
    }

    export interface UnverifiedReceipt {
        receipt: Receipt;
        payload: Validator.Response.ErrorPayload;

        /**
         * True when validation failed without a definitive answer about the
         * receipt: the validator (or the store behind it) couldn't be
         * reached, timed out, answered with a server error, or responded with
         * malformed data. The receipt may well be valid.
         *
         * Don't revoke access on a transient failure: keep what your app (or
         * your server) last knew, and validate again later.
         *
         * The plugin already retried a few times (with backoff) before firing
         * a transient failure. This matches the plugin's own retry decision:
         * since v13.20.0, `BAD_RESPONSE` (the validator's answer was
         * malformed) is reported as transient (it used to be
         * `transient: false`).
         *
         * False when the validator gave a definitive answer (e.g. invalid
         * receipt, expired subscription, authentication error).
         *
         * Transient:
         * - HTTP 5xx, from the transport or as `payload.status` in the response body
         * - `CONNECTION_FAILED` (6778002) from the validator
         * - request timeout, no network, unreadable response
         * - `BAD_RESPONSE`: the validator's answer was malformed
         *
         * Definitive: everything else (HTTP 400 `INVALID_PAYLOAD`, 401/403, 410,
         * 419 expired, ...).
         *
         * Set by the plugin on every `unverified` event since v13.19.0.
         */
        transient?: boolean;
    }

    /** Receipt data as validated by the receipt validation server */
    export class VerifiedReceipt {

        /** @internal */
        className: 'VerifiedReceipt' = 'VerifiedReceipt';

        /** Date and time the receipt was verified */
        validationDate: Date;

        /** Platform this receipt originated from */
        get platform(): Platform { return this.sourceReceipt.platform; }

        /** Source local receipt used for this validation */
        sourceReceipt: Receipt;

        /**
         * The collection of purchases in this receipt.
         */
        collection: VerifiedPurchase[];

        /**
         * True if we've used the latest receipt.
         */
        latestReceipt: boolean;

        /**
         * Raw content from the platform's API.
         */
        nativeTransactions: Validator.Response.NativeTransaction[];

        /**
         * Optional warning message about this validation.
         *
         * It might be present when the server had to fallback to a backup validation solution (like a cached response or using local validation only).
         * This happens generally when communication with the platform's receipt validation service isn't possible (because it's down, there's a network issue, ...)
         *
         * When a warning is present, you should threat the content of this receipt accordingly.
         */
        warning?: string;

        /**
         * Set when the validator answered from its last successful validation of this receipt,
         * because the store (Apple, Google, ...) couldn't be reached.
         *
         * `undefined` means the store confirmed this receipt during the validation.
         * The content is the last one confirmed by the store, `cache.lastConfirmedAt` tells when.
         *
         * Receipts with a `cache` are as valid as the others (no purchase is owned past its `expiryDate`),
         * but you might prefer to validate again later, or tell your users.
         */
        cache?: Validator.Response.ValidatorCacheInfo;

        /**
         * Id of the product that have been validated. Used internally.
         */
        id: string;

        /** Get raw response data from the receipt validation request */
        get raw(): Validator.Response.SuccessPayload['data'] { return {} as any; } // actual implementation as "defineProperty" in constructor.

        /**
         * @internal
         */
        constructor(receipt: Receipt, response: Validator.Response.SuccessPayload['data'], decorator: Internal.VerifiedReceiptDecorator) {
            this.id = response.id;
            this.sourceReceipt = receipt;
            this.collection = response.collection ?? [];
            this.latestReceipt = response.latest_receipt;
            this.nativeTransactions = [response.transaction];
            this.warning = response.warning;
            this.cache = response.cache;
            this.validationDate = response.date ? new Date(response.date) : new Date();
            Object.defineProperty(this, 'raw', { 'enumerable': false, get() { return response; } });
            Object.defineProperty(this, 'finish', { 'enumerable': false, get() { return () => decorator.finish(this); } });
        }

        /**
         * Update the receipt content
         *
         * @internal
         */
        set(receipt: Receipt, response: Validator.Response.SuccessPayload['data']) {
            this.id = response.id;
            this.sourceReceipt = receipt;
            this.collection = response.collection ?? [];
            this.latestReceipt = response.latest_receipt;
            this.nativeTransactions = [response.transaction];
            this.warning = response.warning;
            this.cache = response.cache;
        }

        /** Finish all transactions in the receipt */
        async finish(): Promise<void> {}
    }

    /** A purchase object returned by the receipt validator */
    export interface VerifiedPurchase {

        /** Product identifier */
        id: string;

        /** Platform this purchase was made on */
        platform?: Platform;

        /** Purchase identifier (optional) */
        purchaseId?: string;

        /** Identifier of the last transaction (optional) */
        transactionId?: string;

        /** Date of first purchase (timestamp). */
        purchaseDate?: number;

        /** Date of expiry for a subscription. */
        expiryDate?: number;

        /** True when a subscription is expired. */
        isExpired?: boolean;

        /** True when a purchase has been acknowledged to the platform. */
        isAcknowledged?: boolean;

        /** True when a purchase has been consumed (for consumable products). */
        isConsumed?: boolean;

        /** Renewal intent. */
        renewalIntent?: string;

        /** Date the renewal intent was updated by the user. */
        renewalIntentChangeDate?: number;

        /** The reason a subscription or purchase was cancelled. */
        cancelationReason?: CancelationReason;

        /** True when a subscription a subscription is in the grace period after a failed attempt to collect payment */
        isBillingRetryPeriod?: boolean;

        /** True when a subscription is in trial period */
        isTrialPeriod?: boolean;

        /** True when a subscription is in introductory pricing period */
        isIntroPeriod?: boolean;

        /** Identifier of the discount currently applied to a purchase.
         *
         * Correspond to the product's offerId. When undefined it means there is only one offer for the given product. */
        discountId?: string;

        /** Whether or not the user agreed or has been notified of a price change. */
        priceConsentStatus?: PriceConsentStatus;

        /** Last time a subscription was renewed. */
        lastRenewalDate?: number;

        /**
         * Quantity of items purchased in a single transaction.
         *
         * For consumable products, this value represents the number of items purchased.
         * For non-consumable products and subscriptions, this value is always 1.
         */
        quantity?: number;
    }
}
