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
    }

    /** Receipt data as validated by the receipt validation server */
    export class VerifiedReceipt {

        /** @internal */
        className: 'VerifiedReceipt' = 'VerifiedReceipt';

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
    }
}
