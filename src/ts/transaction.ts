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

    /**
     * Transaction as reported by the device
     *
     * @see {@link Receipt}
     * @see {@link store.localTransactions}
     */
    export class Transaction {

        /** @internal */
        className: 'Transaction' = 'Transaction';

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

        /**
         * Finish a transaction.
         *
         * When the application has delivered the product, it should finalizes the order.
         * Only after that, money will be transferred to your account.
         * This method ensures that no customers is charged for a product that couldn't be delivered.
         *
         * @example
         * store.when()
         *   .approved(transaction => transaction.verify())
         *   .verified(receipt => receipt.finish())
         */
        async finish(): Promise<void> {} // actual implementation in the constructor

        /**
         * Verify a transaction.
         *
         * This will trigger a call to the receipt validation service for the attached receipt.
         * Once the receipt has been verified, you can finish the transaction.
         *
         * @example
         * store.when()
         *   .approved(transaction => transaction.verify())
         *   .verified(receipt => receipt.finish())
         */
        async verify(): Promise<void> {} // actual implementation in the constructor

        /**
         * Return the receipt this transaction is part of.
         */
        get parentReceipt(): Receipt { return {} as Receipt; } // actual implementation in the constructor

        /** @internal */
        constructor(platform: Platform, parentReceipt: Receipt, decorator: Internal.TransactionDecorator) {
            this.platform = platform;
            Object.defineProperty(this, 'finish', { 'enumerable': false, get() { return () => decorator.finish(this); } });
            Object.defineProperty(this, 'verify', { 'enumerable': false, get() { return () => decorator.verify(this); } });
            Object.defineProperty(this, 'parentReceipt', { 'enumerable': false, get() { return parentReceipt; } });
        }
    }

}
