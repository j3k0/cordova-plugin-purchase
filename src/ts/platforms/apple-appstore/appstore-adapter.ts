/// <reference path="../../types.ts" />
/// <reference path="../../product.ts" />
/// <reference path="../../receipt.ts" />
/// <reference path="../../offer.ts" />
/// <reference path="../../transaction.ts" />

namespace CdvPurchase {

    // Apple
    export namespace AppleAppStore {

        export class SKReceipt extends Receipt {
        }

        export class SKProduct extends Product {
        }

        export class SKOffer extends Offer {
        }

        export class SKTransaction extends Transaction {
        }

        export class Adapter implements CdvPurchase.Adapter {

            id = Platform.APPLE_APPSTORE;
            name = 'AppStore';
            products: SKProduct[] = [];
            receipts: SKReceipt[] = [];

            constructor(context: Internal.AdapterContext) {}

            async initialize(): Promise<IError | undefined> { return; }

            async load(products: IRegisterProduct[]): Promise<(Product | IError)[]> {
                return products.map(p => ({ code: ErrorCode.LOAD, message: 'Not implemented' } as IError));
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

            receiptValidationBody(receipt: Receipt): Validator.Request.Body | undefined {
                // TODO
                return;
            }

            async handleReceiptValidationResponse(receipt: Receipt, response: Validator.Response.Payload): Promise<void> {
                return;
            }

            async requestPayment(payment: PaymentRequest, additionalData?: CdvPurchase.AdditionalData): Promise<undefined | IError> {
                return {
                    code: ErrorCode.UNKNOWN,
                    message: 'requestPayment not supported',
                };
            }
        }
    }
}
