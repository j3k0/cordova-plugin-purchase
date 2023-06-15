namespace CdvPurchase
{
    export namespace Internal {

        export interface StoreAdapterDelegate {
            approvedCallbacks: Callbacks<Transaction>;
            pendingCallbacks: Callbacks<Transaction>;
            finishedCallbacks: Callbacks<Transaction>;
            updatedCallbacks: Callbacks<Product>;
            updatedReceiptCallbacks: Callbacks<Receipt>;
            receiptsReadyCallbacks: Callbacks<void>;
        }

        /**
         * Monitor the updates for products and receipt.
         *
         * Call the callbacks when appropriate.
         */
        export class StoreAdapterListener implements AdapterListener {

            delegate: StoreAdapterDelegate;

            private log: Logger;

            /** The list of supported platforms, needs to be set by "store.initialize" */
            private supportedPlatforms: Platform[] = [];

            constructor(delegate: StoreAdapterDelegate, log: Logger) {
                this.delegate = delegate;
                this.log = log.child('AdapterListener');
            }

            /** Those platforms have reported that their receipts are ready */
            private platformWithReceiptsReady: Platform[] = [];

            lastTransactionState: { [transactionToken: string]: TransactionState } = {};
            static makeTransactionToken(transaction: Transaction): string {
                return transaction.platform + '|' + transaction.transactionId;
            }

            setSupportedPlatforms(platforms: Platform[]) {

                this.log.debug('setSupportedPlatforms: ' + platforms.join(','));
                this.supportedPlatforms = platforms;
                if (this.supportedPlatforms.length === this.platformWithReceiptsReady.length) {
                    this.delegate.receiptsReadyCallbacks.trigger();
                }
            }

            receiptsReady(platform: Platform): void {
                if (this.supportedPlatforms.length > 0 && this.platformWithReceiptsReady.length === this.supportedPlatforms.length) {
                    return;
                }
                if (this.platformWithReceiptsReady.indexOf(platform) < 0) {
                    this.log.debug('receiptsReady: ' + platform);
                    this.platformWithReceiptsReady.push(platform);
                    if (this.platformWithReceiptsReady.length === this.supportedPlatforms.length) {
                        this.log.debug('calling receiptsReady()');
                        this.delegate.receiptsReadyCallbacks.trigger();
                    }
                }
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
