/// <reference path="../types.ts" />
/// <reference path="../receipt.ts" />
/// <reference path="../offer.ts" />
/// <reference path="../transaction.ts" />

namespace CDVPurchase2 {

    // Apple
    export namespace AppleStore {

        export class SKReceipt extends Receipt {
        }

        export class SKProduct extends Product {
        }

        export class SKOffer extends Offer {
        }

        export class SKTransaction extends Transaction {
        }

        export class Adapter implements CDVPurchase2.Adapter {

            id = Platform.APPLE_APPSTORE;
            products: SKProduct[] = [];
            receipts: SKReceipt[] = [];

            constructor(context: Internal.AdapterContext) {}

            async initialize(): Promise<IError | undefined> { return; }
            async load(products: IRegisterProduct[]): Promise<(Product | IError)[]> {
                return products.map(p => ({ code: ErrorCode.LOAD, message: 'Not implemented' } as IError));
            }
            async order(offer: Offer): Promise<Transaction | IError> {
                return {
                    code: ErrorCode.UNKNOWN,
                    message: 'TODO: Not implemented'
                } as IError;
            }
        }
    }
}
