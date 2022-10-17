namespace CdvPurchase {
    export namespace WindowsStore {
        export class Adapter implements CdvPurchase.Adapter {
            id = Platform.WINDOWS_STORE;
            name = 'WindowsStore';
            products: Product[] = [];
            receipts: Receipt[] = [];
            async initialize(): Promise<IError | undefined> { return; }
            async load(products: IRegisterProduct[]): Promise<(Product | IError)[]> {
                return products.map(p => ({ code: ErrorCode.PRODUCT_NOT_AVAILABLE, message: 'TODO' } as IError));
            }
            async order(offer: Offer): Promise<undefined | IError> {
                return {
                    code: ErrorCode.UNKNOWN,
                    message: 'TODO: Not implemented'
                } as IError;
            }
            async finish(transaction: Transaction): Promise<undefined | IError> {
                return {
                    code: ErrorCode.UNKNOWN,
                    message: 'TODO: Not implemented'
                } as IError;
            }
            async handleReceiptValidationResponse(receipt: Receipt, response: Validator.Response.Payload): Promise<void> {
                return;
            }
            receiptValidationBody(receipt: Receipt): Validator.Request.Body | undefined {
                return;
            }
            async requestPayment(payment: PaymentRequest, additionalData?: CdvPurchase.AdditionalData): Promise<undefined | IError> {
                return storeError(ErrorCode.UNKNOWN, 'requestPayment not supported');
            }
        }
    }
}
