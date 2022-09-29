namespace CDVPurchase2
{
    export namespace Internal {

        export interface StoreAdapterDelegate {
            approvedCallbacks: Callbacks<Transaction>;
            finishedCallbacks: Callbacks<Transaction>;
            updatedCallbacks: Callbacks<Product>;
            updatedReceiptCallbacks: Callbacks<Receipt>;
        }

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
                        if (lastState !== transaction.state) {
                            this.lastTransactionState[transactionToken] = transaction.state;
                            switch (transaction.state) {
                                case TransactionState.APPROVED:
                                    this.delegate.approvedCallbacks.trigger(transaction);
                                    break;
                                case TransactionState.FINISHED:
                                    this.delegate.finishedCallbacks.trigger(transaction);
                                    break;
                            }
                        }
                    });
                });
            }
        }
    }
}
