namespace CdvPurchase {

    /** Test (or Mock) Adapter and related classes */
    export namespace Test {

        const platform = Platform.TEST;

        /** Test Adapter used for local testing with mock products */
        export class Adapter implements CdvPurchase.Adapter {

            id = Platform.TEST;
            name = 'Test';
            products: Product[] = [];
            receipts: Receipt[] = [];

            private context: Internal.AdapterContext;
            private log: Logger;

            constructor(context: Internal.AdapterContext) {
                this.context = context;
                this.log = context.log.child("Test");
            }

            async initialize(): Promise<IError | undefined> { return; }

            async load(products: IRegisterProduct[]): Promise<(Product | IError)[]> {

                // let's test this active subscription
                if (products.find(p => p.id === PAID_SUBSCRIPTION_ACTIVE.id)) {
                    setTimeout(() => {
                        this.reportActiveSubscription();
                    }, 500); // it'll get reported in 500ms
                }

                return products.map(p => {
                    const product = TEST_PRODUCTS.find(tp => tp.id === p.id && tp.type === p.type);
                    if (product && this.products.indexOf(product) < 0) {
                        this.products.push(product);
                        this.context.listener.productsUpdated(Platform.TEST, [product]);
                        return product;
                    }
                    else {
                        return { code: ErrorCode.PRODUCT_NOT_AVAILABLE, message: 'This product is not available for purchase' } as IError;
                    }
                });
            }

            async order(offer: Offer): Promise<undefined | IError> {
                // Purchasing products with "-fail-" in the id will fail.
                if (offer.id.indexOf("-fail-") > 0) {
                    return {
                        code: ErrorCode.PURCHASE,
                        message: 'Purchase failed.'
                    } as IError;
                }
                else {
                    // purchase succeeded, let's generate a mock receipt.
                    const tr = new Transaction(platform);
                    tr.products = [{
                        productId: offer.productId,
                        offerId: offer.id,
                    }];
                    tr.state = TransactionState.APPROVED;
                    tr.transactionId = 'test-' + (new Date().getTime());
                    tr.isAcknowledged = false;
                    const receipt = new Receipt({
                        platform,
                        transactions: [tr]
                    });
                    this.receipts.push(receipt);
                    this.context.listener.receiptsUpdated(Platform.TEST, [receipt]);
                }
            }

            async finish(transaction: Transaction): Promise<undefined | IError> {
                return {
                    code: ErrorCode.UNKNOWN,
                    message: 'TODO: Not implemented'
                } as IError;
            }

            receiptValidationBody(receipt: Receipt): Validator.Request.Body | undefined {
                return;
            }

            async handleReceiptValidationResponse(receipt: Receipt, response: Validator.Response.Payload): Promise<void> {
                return;
            }

            async requestPayment(payment: PaymentRequest, additionalData?: CdvPurchase.AdditionalData): Promise<undefined | IError> {
                return storeError(ErrorCode.UNKNOWN, 'requestPayment not supported');
            }

            private reportActiveSubscription() {

                if (this.receipts.find(r => r.transactions[0].transactionId === transactionId(1))) {
                    // already reported
                    return;
                }

                const RENEWS_EVERY_MS = 2 * 60000; // 2 minutes

                const receipt = new Receipt({
                    platform,
                    transactions: [],
                });
                function makeTransaction(n: number) {
                    const tr = new Transaction(platform);
                    tr.products = [{
                        productId: PAID_SUBSCRIPTION_ACTIVE.id,
                        offerId: PAID_SUBSCRIPTION_ACTIVE.offers[0].id,
                    }];
                    tr.state = TransactionState.APPROVED;
                    tr.transactionId = transactionId(n);
                    tr.isAcknowledged = n == 1;
                    tr.renewalIntent = RenewalIntent.RENEW;
                    tr.lastRenewalDate = new Date();
                    tr.expirationDate = new Date((+(receipt?.transactions?.[0]?.expirationDate || new Date())) + RENEWS_EVERY_MS);
                    return tr;
                }
                receipt.transactions.push(makeTransaction(1));
                this.receipts.push(receipt);
                this.context.listener.receiptsUpdated(Platform.TEST, [receipt]);

                function transactionId(n: number) {
                    return 'test-active-subscription-transaction-' + n;
                }

                let transactionNumber = 1;
                setInterval(() => {
                    this.log.info('auto-renewing the mock subscription')
                    transactionNumber += 1;
                    receipt.transactions.push(makeTransaction(transactionNumber));
                    this.context.listener.receiptsUpdated(Platform.TEST, [receipt]);
                }, RENEWS_EVERY_MS);
            }
        }
    }
}
