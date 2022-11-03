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
            ready = false;
            products: SKProduct[] = [];
            receipts: SKReceipt[] = [];

            constructor(context: Internal.AdapterContext) {}

            get isSupported(): boolean {
                return false;
            }

            async initialize(): Promise<IError | undefined> { return; }

            async load(products: IRegisterProduct[]): Promise<(Product | IError)[]> {
                return products.map(p => storeError(ErrorCode.LOAD, 'Not implemented'));
            }

            async order(offer: Offer): Promise<undefined | IError> {
                return storeError(ErrorCode.UNKNOWN, 'TODO: Not implemented');
            }

            async finish(transaction: Transaction): Promise<undefined | IError> {
                return storeError(ErrorCode.UNKNOWN, 'TODO: Not implemented');
            }

            receiptValidationBody(receipt: Receipt): Validator.Request.Body | undefined {
                // TODO
                return;
            }

            async handleReceiptValidationResponse(receipt: Receipt, response: Validator.Response.Payload): Promise<void> {
                return;
            }

            async requestPayment(payment: PaymentRequest, additionalData?: CdvPurchase.AdditionalData): Promise<undefined | IError> {
                return storeError(ErrorCode.UNKNOWN, 'requestPayment not supported');
            }

            async manageSubscriptions(): Promise<IError | undefined> {
                return storeError(ErrorCode.UNKNOWN, 'TODO: Not implemented');
            }
        }
    }
}
