namespace CdvPurchase
{
    export class Receipt {

        /** Platform that generated the receipt */
        platform: Platform;

        /** List of transactions contained in the receipt */
        transactions: Transaction[];

        constructor(options: { platform: Platform, transactions: Transaction[] }) {
            this.platform = options.platform;
            this.transactions = options.transactions;
        }

        // async verify(): Promise<IError | undefined> {
        //     return {
        //         code: ErrorCode.VERIFICATION_FAILED,
        //         message: 'TODO: Not implemented yet',
        //     };
        // }

        hasTransaction(value: Transaction) {
            return !!this.transactions.find(t => t === value);
        }
    }
}
