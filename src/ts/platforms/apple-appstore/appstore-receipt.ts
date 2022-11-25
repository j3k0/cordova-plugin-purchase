namespace CdvPurchase {
  export namespace AppleAppStore {

    /**
     * Transaction ID used for the application virtual transaction
     */
    export const APPLICATION_VIRTUAL_TRANSACTION_ID = 'appstore.application';

    /**
     * StoreKit 1 exposes a single receipt that contains all transactions.
     */
    export class SKApplicationReceipt extends Receipt {

        nativeData: ApplicationReceipt;

        constructor(applicationReceipt: ApplicationReceipt, needApplicationReceipt: boolean, decorator: CdvPurchase.Internal.ReceiptDecorator & CdvPurchase.Internal.TransactionDecorator) {
            super(Platform.APPLE_APPSTORE, decorator);
            this.nativeData = applicationReceipt;
            this.refresh(this.nativeData, needApplicationReceipt, decorator);
        }

        refresh(nativeData: ApplicationReceipt, needApplicationReceipt: boolean, decorator: CdvPurchase.Internal.ReceiptDecorator & CdvPurchase.Internal.TransactionDecorator) {
            this.nativeData = nativeData;
            if (needApplicationReceipt) {
                const existing = this.transactions.find(t => t.transactionId === APPLICATION_VIRTUAL_TRANSACTION_ID);
                if (existing) {
                    return;
                }
                const t = new Transaction(Platform.APPLE_APPSTORE, this, decorator);
                t.transactionId = APPLICATION_VIRTUAL_TRANSACTION_ID;
                t.state = TransactionState.APPROVED;
                t.products.push({
                    id: nativeData.bundleIdentifier,
                });
                this.transactions.push(t);
            }
        }
    }

    /** StoreKit transaction */
    export class SKTransaction extends Transaction {

        originalTransactionId?: string;

        refresh(productId?: string, originalTransactionIdentifier?: string, transactionDate?: string, discountId?: string) {
            if (productId) this.products = [{ id: productId, offerId: discountId }];
            if (originalTransactionIdentifier) this.originalTransactionId = originalTransactionIdentifier;
            if (transactionDate) this.purchaseDate = new Date(+transactionDate);
        }
    }
  }
}
