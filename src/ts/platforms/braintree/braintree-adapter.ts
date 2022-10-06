namespace CdvPurchase {
    export namespace Braintree {

        export interface AdapterOptions {
            
            /** Authorization key, as a direct string. */
            tokenizationKey?: string;

            /** Function used to retrieve a Client Token (used if no tokenizationKey are provided). */
            clientTokenProvider?: ClientTokenProvider;

            /** Provides a nonce for a payment request. */
            nonceProvider: NonceProvider;
        }

        export type ClientTokenProvider = (callback: Callback<string | IError>) => void;
        export type Nonce = {
            type: PaymentMethod.THREE_D_SECURE;
            value: string;
        };
        export type NonceProvider = (type: PaymentMethod, callback: Callback<Nonce | IError>) => void;

        export enum PaymentMethod {
            THREE_D_SECURE = 'THREE_D_SECURE',
        }

        /** Parameters for a payment with Braintree */
        export type AdditionalData = DropIn.Request;

        export class Adapter implements CdvPurchase.Adapter {

            id = Platform.BRAINTREE;
            name = 'BrainTree';
            products: Product[] = [];
            receipts: Receipt[] = [];

            log: Logger;
            androidBridge?: AndroidBridge.Bridge;
            options: AdapterOptions;

            constructor(log: Logger, options: AdapterOptions) {
                this.log = log.child("Braintree");
                this.options = options;
            }

            /**
             * Initialize the Braintree Adapter.
             */
            initialize(): Promise<IError | undefined> {
                return new Promise(resolve => {
                    this.log.info("initialize()");
                    if (AndroidBridge.Bridge.isSupported() && !this.androidBridge) {
                        this.log.info("instantiating android bridge...");
                        this.androidBridge = new AndroidBridge.Bridge(this.log);
                        this.log.info("calling android bridge -> initialize...");
                        const auth = this.options.tokenizationKey
                            ? this.options.tokenizationKey
                            : this.options.clientTokenProvider
                                ? this.options.clientTokenProvider
                                : '';
                        this.androidBridge.initialize(auth, resolve);
                    }
                    else {
                        this.log.info("platform not supported...");
                        resolve(undefined);
                    }
                });
            }

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

            async getNonce(paymentMethod: PaymentMethod): Promise<Nonce | IError> {
                return new Promise(resolve => {
                    if (this.options.nonceProvider) {
                        this.options.nonceProvider(paymentMethod, resolve);
                    }
                    else {
                        resolve({
                            code: ErrorCode.UNAUTHORIZED_REQUEST_DATA,
                            message: 'Braintree requires a nonceProvider',
                        });
                    }
                });
            }

            async requestPayment(payment: PaymentRequest, additionalData?: CdvPurchase.AdditionalData): Promise<undefined | IError> {
                this.log.info("requestPayment()");
                if (additionalData?.braintree) {
                    return this.androidBridge?.launchDropIn(additionalData.braintree);
                }
                else {
                    const nonce = await this.getNonce(PaymentMethod.THREE_D_SECURE);
                    if ('code' in nonce) {
                        return nonce;
                    }
                    if (nonce.type !== PaymentMethod.THREE_D_SECURE) {
                        return {
                            code: ErrorCode.BAD_RESPONSE,
                            message: 'The returned nonce should be of type THREE_D_SECURE',
                        };
                    }
                    const threeDSecureRequest: CdvPurchase.Braintree.ThreeDSecure.Request = {
                        amount: formatAmount(payment.amountMicros),
                        nonce: nonce.value,
                    }
                    const result = await this.androidBridge?.launchDropIn({ threeDSecureRequest });
                    if (result?.code) {
                        this.log.warn("launchDropIn failed: " + JSON.stringify(result));
                        return result;
                    }
                }
            }

            receiptValidationBody(receipt: Receipt): Validator.Request.Body | undefined {
                return;
            }

            async handleReceiptValidationResponse(receipt: Receipt, response: Validator.Response.Payload): Promise<void> {
                return;
            }
        }

        function formatAmount(amountMicros: number): string {
            const amountCents = '' + (amountMicros / 10000);
            return (amountCents.slice(0, -2) || '0') + '.' + (amountCents.slice(-2, -1) || '0') + (amountCents.slice(-1) || '0');
        }
    }
}
