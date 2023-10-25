namespace CdvPurchase {
    export namespace WindowsStore {
        export class Adapter implements CdvPurchase.Adapter {
            id = Platform.WINDOWS_STORE;
            name = 'WindowsStore';
            ready = false;
            supportsParallelLoading = false;
            products: Product[] = [];
            receipts: Receipt[] = [];
            async initialize(): Promise<IError | undefined> { return; }
            get isSupported(): boolean {
                return false;
            }
            async loadProducts(products: IRegisterProduct[]): Promise<(Product | IError)[]> {
                return products.map(p => windowsStoreError(ErrorCode.PRODUCT_NOT_AVAILABLE, 'TODO', p.id));
            }
            async loadReceipts(): Promise<Receipt[]> {
                return [];
            }
            async order(offer: Offer): Promise<undefined | IError> {
                return windowsStoreError(ErrorCode.UNKNOWN, 'TODO: Not implemented', offer.productId);
            }
            async finish(transaction: Transaction): Promise<undefined | IError> {
                return windowsStoreError(ErrorCode.UNKNOWN, 'TODO: Not implemented', null);
            }
            async handleReceiptValidationResponse(receipt: Receipt, response: Validator.Response.Payload): Promise<void> {
                return;
            }
            async receiptValidationBody(receipt: Receipt): Promise<Validator.Request.Body | undefined> {
                return;
            }
            async requestPayment(payment: PaymentRequest, additionalData?: CdvPurchase.AdditionalData): Promise<IError | Transaction | undefined> {
                return windowsStoreError(ErrorCode.UNKNOWN, 'requestPayment not supported', null);
            }
            async manageSubscriptions(): Promise<IError | undefined> {
                return windowsStoreError(ErrorCode.UNKNOWN, 'manageSubscriptions not supported', null);
            }
            async manageBilling(): Promise<IError | undefined> {
                return windowsStoreError(ErrorCode.UNKNOWN, 'manageBilling not supported', null);
            }
            checkSupport(functionality: PlatformFunctionality): boolean {
                return false;
            }
            async restorePurchases(): Promise<IError | undefined> {
                return undefined;
            }
        }

        function windowsStoreError(code: ErrorCode, message: string, productId: string | null) {
            return storeError(code, message, Platform.WINDOWS_STORE, productId);
        }
    }
}
