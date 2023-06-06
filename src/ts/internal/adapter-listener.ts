namespace CdvPurchase
{
    export namespace Internal {

        export interface StoreAdapterDelegate {
            approvedCallbacks: Callbacks<Transaction>;
            pendingCallbacks: Callbacks<Transaction>;
            finishedCallbacks: Callbacks<Transaction>;
            updatedCallbacks: Callbacks<Product>;
            updatedReceiptCallbacks: Callbacks<Receipt>;
        }

        /**
         * Monitor the updates for products and receipt.
         *
         * Call the callbacks when appropriate.
         */
        export class StoreAdapterListener implements AdapterListener {

            delegate: StoreAdapterDelegate;
            constructor(delegate: StoreAdapterDelegate) { this.delegate = delegate; }

            lastTransactionState: { [transactionToken: string]: TransactionState } = {};
            static makeTransactionToken(transaction: Transaction): string {
                return transaction.platform + '|' + transaction.transactionId;
            }

            productsUpdated(platform: Platform, products: Product[]): void {
                products.forEach(product => this.delegate.updatedCallbacks.trigger(product));
            }

            receiptsUpdated(platform: Platform, receipts: Receipt[]): void {
                receipts.forEach(receipt => {
                    this.delegate.updatedReceiptCallbacks.trigger(receipt);
                    receipt.transactions.forEach(transaction => {
                        const transactionToken = StoreAdapterListener.makeTransactionToken(transaction);
                        const lastState = this.lastTransactionState[transactionToken];
                        if (transaction.state === TransactionState.APPROVED) {
                            this.delegate.approvedCallbacks.trigger(transaction);
                            // better retrigger (so validation is rerun on potential update)
                        }
                        else if (lastState !== transaction.state) {
                            if (transaction.state === TransactionState.FINISHED) {
                                this.delegate.finishedCallbacks.trigger(transaction);
                            }
                            else if (transaction.state === TransactionState.PENDING) {
                                this.delegate.pendingCallbacks.trigger(transaction);
                            }
                        }
                        this.lastTransactionState[transactionToken] = transaction.state;
                    });
                });
            }
        }
    }
}
