namespace CdvPurchase
{

    /** @internal */
    export namespace Internal {
        export interface ReceiptDecorator {
            verify(receipt: Receipt): Promise<void>;
            finish(receipt: Receipt): Promise<void>;
        }
    }

    export class Receipt {

        /** @internal */
        className: 'Receipt' = 'Receipt';

        /** Platform that generated the receipt */
        platform: Platform;

        /** List of transactions contained in the receipt, ordered by date ascending. */
        transactions: Transaction[] = [];

        /** Verify a receipt */
        async verify(): Promise<void> {}

        /** Finish all transactions in a receipt */
        async finish(): Promise<void> {}

        /** @internal */
        constructor(platform: Platform, decorator: Internal.ReceiptDecorator) {
            this.platform = platform;
            Object.defineProperty(this, 'verify', { 'enumerable': false, get() { return () => decorator.verify(this); } });
            Object.defineProperty(this, 'finish', { 'enumerable': false, get() { return () => decorator.finish(this); } });
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
