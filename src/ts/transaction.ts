namespace CdvPurchase
{
    /** @internal */
    export namespace Internal {
        /**
         * Set of function used to provide a nicer API (or more backward compatible)
         */
        export interface TransactionDecorator {
            finish(transaction: Transaction): Promise<void>;
            verify(transaction: Transaction): Promise<void>;
        }
    }

    export class Transaction {

        private className: 'Transaction' = 'Transaction';

        /** Platform this transaction was created on */
        platform: Platform;

        /** Transaction identifier. */
        transactionId: string = '';

        /** Identifier for the purchase this transaction is a part of. */
        purchaseId?: string;

        /**
         * Time the purchase was made.
         *
         * For subscriptions this is equal to the date of the first transaction.
         * Note that it might be undefined for deleted transactions (google for instance don't provide any info in that case).
         */
        purchaseDate?: Date;

        /** Time a subscription was last renewed */
        lastRenewalDate?: Date;

        /** Time when the subscription is set to expire following this transaction */
        expirationDate?: Date;

        /** True when the transaction has been acknowledged to the platform. */
        isAcknowledged?: boolean;

        /** True when the transaction is still pending payment. */
        isPending?: boolean;

        /** True when the transaction was consumed. */
        isConsumed?: boolean;

        /** Is the subscription set to renew. */
        renewalIntent?: RenewalIntent;

        /** Time when the renewal intent was changed */
        renewalIntentChangeDate?: Date;

        /** State this transaction is in */
        state: TransactionState = TransactionState.UNKNOWN_STATE;

        /** Amount paid by the user, if known, in micro units. Divide by 1,000,000 for value. */
        amountMicros?: number;

        /** Currency used to pay for the transaction, if known. */
        currency?: string;

        /** Purchased products */
        products: {

            /** Product identifier */
            id: string;

            /** Offer identifier, if known */
            offerId?: string;
        }[] = [];

        /** Finish a transaction */
        async finish(): Promise<void> {}

        /** Verify a transaction */
        async verify(): Promise<void> {}

        /** @internal */
        constructor(platform: Platform, decorator: Internal.TransactionDecorator) {
            this.platform = platform;
            Object.defineProperty(this, 'finish', { 'enumerable': false, get() { return () => decorator.finish(this); } });
            Object.defineProperty(this, 'verify', { 'enumerable': false, get() { return () => decorator.verify(this); } });
        }
    }

}
