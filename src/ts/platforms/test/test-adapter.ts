namespace CdvPurchase {

    /** Test (or Mock) Adapter and related classes */
    export namespace Test {

        /** Test Adapter used for local testing with mock products */
        export class Adapter implements CdvPurchase.Adapter {

            id = Platform.TEST;
            name = 'Test';
            products: Product[] = TEST_PRODUCTS;
            receipts: Receipt[] = [];

            private context: Internal.AdapterContext;
            private log: Logger;

            constructor(context: Internal.AdapterContext) {
                this.context = context;
                this.log = context.log.child("Test");
            }

            async initialize(): Promise<IError | undefined> { return; }

            async load(products: IRegisterProduct[]): Promise<(Product | IError)[]> {
                return products.map(p => {
                    const product = TEST_PRODUCTS.find(tp => tp.id === p.id && tp.type === p.type);
                    if (product) {
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
                if (offer.product.id.indexOf("-fail-") > 0) {
                    return {
                        code: ErrorCode.PURCHASE,
                        message: 'Purchase failed.'
                    } as IError;
                }
                else {
                    // purchase succeeded, let's generate a mock receipt.
                    const receipt = new Receipt({
                        platform: Platform.TEST,
                        transactions: [{
                            platform: Platform.TEST,
                            products: [{
                                productId: offer.product.id,
                                offerId: offer.id,
                            }],
                            state: TransactionState.APPROVED,
                            transactionId: 'test-' + (new Date().getTime()),
                            isAcknowledged: false,
                        }]
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
        }
    }
}
