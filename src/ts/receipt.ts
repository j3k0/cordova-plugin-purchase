namespace CdvPurchase
{

    /** @internal */
    export namespace Internal {
        export interface ReceiptDecorator {
            verify(receiptOrTransaction: Transaction | Receipt): Promise<void>;
        }
    }

    export class Receipt {

        private className: 'Receipt' = 'Receipt';

        /** Platform that generated the receipt */
        platform: Platform;

        /** List of transactions contained in the receipt, ordered by date ascending. */
        transactions: Transaction[];

        /** Verify a receipt */
        async verify(): Promise<void> {}

        /** @internal */
        constructor(options: { platform: Platform, transactions: Transaction[] }, decorator: Internal.ReceiptDecorator) {
            this.platform = options.platform;
            this.transactions = options.transactions;
            Object.defineProperty(this, 'verify', { 'enumerable': false, get() { return () => decorator.verify(this); } });
        }

        /** Return true if the receipt contains the given transaction */
        hasTransaction(value: Transaction) {
            return !!this.transactions.find(t => t === value);
        }

        /** Return the last transaction in this receipt */
        lastTransaction() {
            return this.transactions[this.transactions.length - 1];
        }
    }
}
