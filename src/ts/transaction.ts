namespace CDVPurchase2
{
    export class Transaction {

        state: TransactionState = TransactionState.REQUESTED;

        /** Product identifier */
        productId: string = '';

        /** Offer identifier */
        offerId: string = '';

        /** Transaction identifier */
        transactionId: string = '';
    }
}
