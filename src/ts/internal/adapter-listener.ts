namespace CdvPurchase
{
    export namespace Internal {

        export interface StoreAdapterDelegate {
            initiatedCallbacks: Callbacks<Transaction>;
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

            /** Store the listener's latest calling time (in ms) for a given transaction at a given state */
            lastCallTimeForState: { [transactionTokenWithState: string]: number } = {};

            /**
             * Set the list of supported platforms.
             *
             * Called by the store when it is initialized.
             */
            setSupportedPlatforms(platforms: Platform[]) {
                this.log.debug(`setSupportedPlatforms: ${platforms.join(',')} (${this.platformWithReceiptsReady.length} have their receipts ready)`);
                this.supportedPlatforms = platforms;
                if (this.supportedPlatforms.length === this.platformWithReceiptsReady.length) {
                    this.log.debug('triggering receiptsReady()');
                    this.delegate.receiptsReadyCallbacks.trigger(undefined, 'adapterListener_setSupportedPlatforms');
                }
            }

            /**
             * Trigger the "receiptsReady" event when all platforms have reported that their receipts are ready.
             *
             * This function is used by adapters to report that their receipts are ready.
             * Once all adapters have reported their receipts, the "receiptsReady" event is triggered.
             *
             * @param platform The platform that has its receipts ready.
             */
            receiptsReady(platform: Platform): void {
                if (this.supportedPlatforms.length > 0 && this.platformWithReceiptsReady.length === this.supportedPlatforms.length) {
                    this.log.debug('receiptsReady: ' + platform + '(skipping)');
                    return;
                }
                if (this.platformWithReceiptsReady.indexOf(platform) < 0) {
                    this.platformWithReceiptsReady.push(platform);
                    this.log.debug(`receiptsReady: ${platform} (${this.platformWithReceiptsReady.length}/${this.supportedPlatforms.length})`);
                    if (this.platformWithReceiptsReady.length === this.supportedPlatforms.length) {
                        this.log.debug('triggering receiptsReady()');
                        this.delegate.receiptsReadyCallbacks.trigger(undefined, 'adapterListener_receiptsReady');
                    }
                }
            }

            /**
             * Trigger the "updated" event for each product.
             */
            productsUpdated(platform: Platform, products: Product[]): void {
                products.forEach(product => this.delegate.updatedCallbacks.trigger(product, 'adapterListener_productsUpdated'));
            }

            updatedReceiptsToProcess: Receipt[] = [];
            updatedReceiptsProcessor: number | undefined;

            /**
             * Triggers the "approved", "pending" and "finished" events for transactions.
             *
             * - "approved" is triggered only if it hasn't been called for the same transaction in the last 5 seconds.
             * - "finished" and "pending" are triggered only if the transaction state has changed.
             *
             * @param platform The platform that has its receipts updated.
             * @param receipts The receipts that have been updated.
             */
            receiptsUpdated(platform: Platform, receipts: Receipt[]): void {
                this.log.debug("receiptsUpdated: " + JSON.stringify(receipts.map(r => ({
                    platform: r.platform,
                    transactions: r.transactions,
                }))));
                for (const receipt of receipts) {
                    if (this.updatedReceiptsToProcess.indexOf(receipt) < 0) {
                        this.updatedReceiptsToProcess.push(receipt);
                    }
                }
                if (this.updatedReceiptsProcessor !== undefined) {
                    clearTimeout(this.updatedReceiptsProcessor);
                }
                this.updatedReceiptsProcessor = setTimeout(() => {
                    this._processUpdatedReceipts();
                }, 500);
            }

            private _processUpdatedReceipts() {
                this.log.debug("processing " + this.updatedReceiptsToProcess.length + " updated receipts");
                const now = +new Date();
                const receipts = this.updatedReceiptsToProcess;
                this.updatedReceiptsToProcess = [];
                receipts.forEach(receipt => {
                    this.delegate.updatedReceiptCallbacks.trigger(receipt, 'adapterListener_receiptsUpdated');
                    receipt.transactions.forEach(transaction => {
                        const transactionToken = StoreAdapterListener.makeTransactionToken(transaction);
                        const tokenWithState = transactionToken + '@' + transaction.state;
                        const lastState = this.lastTransactionState[transactionToken];
                        // Retrigger "approved", so validation is rerun on potential update.
                        if (transaction.state === TransactionState.APPROVED) {
                            // prevent calling approved twice in a very short period (60 seconds).
                            const lastCalled = this.lastCallTimeForState[tokenWithState] ?? 0;
                            if (now - lastCalled > 60000) {
                                this.lastCallTimeForState[tokenWithState] = now;
                                this.delegate.approvedCallbacks.trigger(transaction, 'adapterListener_receiptsUpdated_approved');
                            }
                            else {
                                this.log.debug(`Skipping ${tokenWithState}, because it has been last called ${lastCalled > 0 ? Math.round(now - lastCalled) + 'ms ago (' + now + '-' + lastCalled + ')' : 'never'}`);
                            }
                        }
                        else if (lastState !== transaction.state) {
                            if (transaction.state === TransactionState.INITIATED) {
                                this.lastCallTimeForState[tokenWithState] = now;
                                this.delegate.initiatedCallbacks.trigger(transaction, 'adapterListener_receiptsUpdated_initiated');
                            }
                            else if (transaction.state === TransactionState.FINISHED) {
                                this.lastCallTimeForState[tokenWithState] = now;
                                this.delegate.finishedCallbacks.trigger(transaction, 'adapterListener_receiptsUpdated_finished');
                            }
                            else if (transaction.state === TransactionState.PENDING) {
                                this.lastCallTimeForState[tokenWithState] = now;
                                this.delegate.pendingCallbacks.trigger(transaction, 'adapterListener_receiptsUpdated_pending');
                            }
                        }
                        this.lastTransactionState[transactionToken] = transaction.state;
                    });
                });
            }
        }
    }
}
