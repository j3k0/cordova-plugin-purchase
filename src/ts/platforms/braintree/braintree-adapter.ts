namespace CdvPurchase {
    export namespace Braintree {

        /** The Braintree customer identifier. Set it to allow reusing of payment methods. */
        export let customerId: string | undefined;

        export interface AdapterOptions {

            /** Authorization key, as a direct string. */
            tokenizationKey?: string;

            /** Function used to retrieve a Client Token (used if no tokenizationKey are provided). */
            clientTokenProvider?: ClientTokenProvider;

            // /** Provides a nonce for a payment request. */
            // nonceProvider: NonceProvider;

            /*
             * Create a transaction server side.
             *
             * @see https://developer.paypal.com/braintree/docs/start/hello-server
             *
             * serverCheckout?: ServerCheckout;
             */
        }
        // export type ServerCheckout = (dropInRequest: DropIn.Request, dropInResult: DropIn.Result, callback: Callback<TransactionResultObject>) => void;

        export type ClientTokenProvider = (callback: Callback<string | IError>) => void;

        export interface TransactionObject {
            success: boolean;
            transaction?: ({
                status: | 'authorization_expired'
                        | 'authorized'
                        | 'authorizing'
                        | 'settlement_confirmed'
                        | 'settlement_pending'
                        | 'failed'
                        | 'settled'
                        | 'settling'
                        | 'submitted_for_settlement'
                        | 'voided';
            } | {
                status: "processor_declined";
                /** e.g. paypal or credit card */
                paymentInstrumentType: string;
                /** e.g. "soft_declined" */
                processorResponseType: "soft_declined" | "hard_declined" | "approved";
                /** e.g. "2001" */
                processorResponseCode: string;
                /** e.g. "Insufficient Funds" */
                processorResponseText: string;
                /** e.g. "05 : NOT AUTHORISED" */
                additionalProcessorResponse: string;
            } | {
                status: "settlement_declined";
                /** e.g. "4001" */
                processorSettlementResponseCode: string;
                /** e.g. "Settlement Declined" */
                processorSettlementResponseText: string;
            } | {
                status: "gateway_rejected";
                /** e.g. "cvv" */
                gatewayRejectionReason: string;
            }) & {
                /**
                 * Each merchant account can only process transactions for a single currency.
                 * Setting which merchant account to use will also determine which currency the transaction is processed with.
                 *
                 * e.g. "USD"
                 */
                currencyIsoCode: string;

                /** Risk data on credit card verifications and on transactions with all compatible payment methods */
                riskData: {
                    /** e.g. "1SG23YHM4BT5" */
                    id: string;
                    /** e.g. "Decline" */
                    decision: "Not Evaluated" | "Approve" | "Review" | "Decline";
                    /** e.g. true */
                    deviceDataCaptured: boolean;
                    /** e.g. "Kount" */
                    fraudServiceProvider: string;
                    /** e.g.["reason1", "reason2"] */
                    decisionReasons: string[];
                    /** e.g. 42 */
                    riskScore: number;
                }

                customer: {
                    id: string;
                    company?: string | undefined;
                    customFields?: any;
                    email?: string | undefined;
                    fax?: string | undefined;
                    firstName?: string | undefined;
                    lastName?: string | undefined;
                    phone?: string | undefined;
                    website?: string | undefined;
                }

                creditCard?: {
                    bin: string;
                    cardholderName?: string | undefined;
                    cardType: string;
                    commercial: Commercial;
                    countryOfIssuance: string;
                    customerLocation: CustomerLocation;
                    debit: string;
                    durbinRegulated: DurbinRegulated;
                    expirationDate?: string | undefined;
                    expirationMonth?: string | undefined;
                    expirationYear?: string | undefined;
                    healthcare: HealthCare;
                    imageUrl?: string | undefined;
                    issuingBank: string;
                    last4: string;
                    maskedNumber?: string | undefined;
                    payroll: Payroll;
                    prepaid: Prepaid;
                    productId: string;
                    token: string;
                    uniqueNumberIdentifier: string;
                }
            }
            errors?: {
            }[];
        }

        export type Commercial = 'Yes' | 'No' | 'Unknown';
        export type CustomerLocation = 'US' | 'International';
        export type Debit = 'Yes' | 'No' | 'Unknown';
        export type DurbinRegulated = 'Yes' | 'No' | 'Unknown';
        export type HealthCare = 'Yes' | 'No' | 'Unknown';
        export type Payroll = 'Yes' | 'No' | 'Unknown';
        export type Prepaid = 'Yes' | 'No' | 'Unknown';

        // export type Nonce = {
        //     type: PaymentMethod.THREE_D_SECURE;
        //     value: string;
        // };
        // export type NonceProvider = (type: PaymentMethod, callback: Callback<Nonce | IError>) => void;
        // export enum PaymentMethod {
        //     THREE_D_SECURE = 'THREE_D_SECURE',
        // }

        export class BraintreeReceipt extends Receipt {

            public dropInResult: DropIn.Result;
            public paymentRequest: PaymentRequest;

            constructor(paymentRequest: PaymentRequest, dropInResult: DropIn.Result) {

                // Now we have to send this to the server + the request
                // result.paymentDescription; // "1111"
                // result.paymentMethodType; // "VISA"
                // result.deviceData; // undefined
                // result.paymentMethodNonce; // {"isDefault":false,"nonce":"tokencc_bh_rdjmsc_76vjtq_9tzsv3_4467mg_tt4"}

                const transaction = new Transaction(Platform.BRAINTREE);
                transaction.products = paymentRequest.productIds.map(productId => ({ productId }));
                transaction.state = TransactionState.APPROVED;
                transaction.transactionId = dropInResult.paymentMethodNonce?.nonce ?? `UNKNOWN_${dropInResult.paymentMethodType}_${dropInResult.paymentDescription}`;

                super({
                    platform: Platform.BRAINTREE,
                    transactions: [transaction],
                });

                this.dropInResult = dropInResult;
                this.paymentRequest = paymentRequest;
                this.refresh(paymentRequest, dropInResult);
            }

            refresh(paymentRequest: PaymentRequest, dropInResult: DropIn.Result) {
                this.dropInResult = dropInResult;
                this.paymentRequest = paymentRequest;
                const transaction = new Transaction(Platform.BRAINTREE);
                transaction.products = paymentRequest.productIds.map(productId => ({ productId }));
                transaction.state = TransactionState.APPROVED;
                transaction.transactionId = dropInResult.paymentMethodNonce?.nonce ?? `UNKNOWN_${dropInResult.paymentMethodType}_${dropInResult.paymentDescription}`;
                transaction.amountMicros = paymentRequest.amountMicros;
                transaction.currency = paymentRequest.currency;
            }
        }


        export class Adapter implements CdvPurchase.Adapter {

            id = Platform.BRAINTREE;
            name = 'BrainTree';
            ready = false;
            products: Product[] = [];

            _receipts: BraintreeReceipt[] = [];
            get receipts(): Receipt[] { return this._receipts; }

            private context: Internal.AdapterContext;

            log: Logger;
            iosBridge?: IosBridge.Bridge;
            androidBridge?: AndroidBridge.Bridge;
            options: AdapterOptions;

            constructor(context: Internal.AdapterContext, options: AdapterOptions) {
                this.context = context;
                this.log = context.log.child("Braintree");
                this.options = options;
            }

            get isSupported(): boolean {
                return IosBridge.Bridge.isSupported() || AndroidBridge.Bridge.isSupported();
            }

            /**
             * Initialize the Braintree Adapter.
             */
            initialize(): Promise<IError | undefined> {
                return new Promise(resolve => {
                    this.log.info("initialize()");
                    if (IosBridge.Bridge.isSupported()) {
                        this.log.info("instantiating ios bridge...");
                        this.iosBridge = new IosBridge.Bridge(this.log, (callback) => {
                            if (this.options.tokenizationKey)
                                callback(this.options.tokenizationKey);
                            else if (this.options.clientTokenProvider)
                                this.options.clientTokenProvider(callback);
                            else
                                callback(storeError(ErrorCode.CLIENT_INVALID, 'Braintree iOS Bridge requires a clientTokenProvider or tokenizationKey'));
                        });
                        this.iosBridge.initialize(this.context, resolve);
                    }
                    else if (AndroidBridge.Bridge.isSupported() && !this.androidBridge) {
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
                return products.map(p => storeError(ErrorCode.PRODUCT_NOT_AVAILABLE, 'N/A'));
            }

            async order(offer: Offer): Promise<undefined | IError> {
                return storeError(ErrorCode.UNKNOWN, 'N/A: Not implemented with Braintree');
            }

            async finish(transaction: Transaction): Promise<undefined | IError> {
                return; /* {
                    code: ErrorCode.UNKNOWN,
                    message: 'N/A: Not implemented with Braintree'
                } as IError; */
            }

            async manageSubscriptions(): Promise<IError | undefined> {
                return storeError(ErrorCode.SETUP, 'N/A: manageSubscriptions() is not available with Braintree');
            }

            // async getNonce(paymentMethod: PaymentMethod): Promise<Nonce | IError> {
            //     return new Promise(resolve => {
            //         if (this.options.nonceProvider) {
            //             this.options.nonceProvider(paymentMethod, resolve);
            //         }
            //         else {
            //             resolve({
            //                 code: ErrorCode.UNAUTHORIZED_REQUEST_DATA,
            //                 message: 'Braintree requires a nonceProvider',
            //             });
            //         }
            //     });
            // }

            private async launchDropIn(dropInRequest: DropIn.Request): Promise<DropIn.Result | IError> {
                if (this.androidBridge) return this.androidBridge.launchDropIn(dropInRequest);
                if (this.iosBridge) return this.iosBridge.launchDropIn(dropInRequest);
                return storeError(ErrorCode.PURCHASE, 'Braintree is not available');
            }

            async requestPayment(paymentRequest: PaymentRequest, additionalData?: CdvPurchase.AdditionalData): Promise<undefined | IError> {
                this.log.info("requestPayment()" + JSON.stringify(paymentRequest));
                let dropInResult: DropIn.Result;
                if (additionalData?.braintree?.dropInRequest) {
                    // User provided a full DropInRequest, just passing it through
                    const response = await this.launchDropIn(additionalData.braintree.dropInRequest);
                    if (!response || (('code' in response) && ('message' in response))) {
                        return response;
                    }
                    dropInResult = response;
                }
                /*
                else if (!additionalData?.braintree?.method || additionalData.braintree.method === PaymentMethod.THREE_D_SECURE) {
                    // User requested a 3D Secure payment
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
                        email: payment.email,
                        mobilePhoneNumber: payment.mobilePhoneNumber,
                        billingAddress: {
                            givenName: payment.billingAddress?.givenName,
                            surname: payment.billingAddress?.surname,
                            streetAddress: payment.billingAddress?.streetAddress1,
                            extendedAddress: payment.billingAddress?.streetAddress2,
                            line3: payment.billingAddress?.streetAddress3,
                            locality: payment.billingAddress?.locality,
                            phoneNumber: payment.billingAddress?.phoneNumber,
                            postalCode: payment.billingAddress?.postalCode,
                            region: payment.billingAddress?.region,
                            countryCodeAlpha2: payment.billingAddress?.countryCode,
                        },
                    }
                    const result = await this.androidBridge?.launchDropIn({ threeDSecureRequest });
                    if (result?.code) {
                        this.log.warn("launchDropIn failed: " + JSON.stringify(result));
                        return result;
                    }
                }
                */
                else {
                    // No other payment method as the moment...
                    const response = await this.launchDropIn({});
                    if (!response || (('code' in response) && ('message' in response))) {
                        // Failed
                        this.log.warn("launchDropIn failed: " + JSON.stringify(response));
                        return response;
                    }

                    // Success
                    dropInResult = response;
                }

                this.log.info("launchDropIn success: " + JSON.stringify({ paymentRequest, dropInResult }));
                if (!dropInResult.paymentMethodNonce?.nonce) {
                    return storeError(ErrorCode.BAD_RESPONSE, 'launchDropIn returned no paymentMethodNonce');
                }

                let receipt = this._receipts.find(r => r.dropInResult.paymentMethodNonce?.nonce === dropInResult.paymentMethodNonce?.nonce);
                if (receipt) {
                    receipt.refresh(paymentRequest, dropInResult);
                }
                else {
                    receipt = new BraintreeReceipt(paymentRequest, dropInResult);
                    this.receipts.push(receipt);
                }
                this.context.listener.receiptsUpdated(Platform.BRAINTREE, [receipt]);
            }

            receiptValidationBody(receipt: BraintreeReceipt): Validator.Request.Body | undefined {
                if (!isBraintreeReceipt(receipt)) {
                    this.log.error("Unexpected error, expecting a BraintreeReceipt: " + JSON.stringify(receipt));
                    return;
                }
                this.log.info("create receiptValidationBody for: " + JSON.stringify(receipt));
                return {
                    id: receipt.paymentRequest.productIds?.[0] ?? 'unknown',
                    type: ProductType.CONSUMABLE,
                    priceMicros: receipt.paymentRequest.amountMicros,
                    currency: receipt.paymentRequest.currency,
                    transaction: {
                        type: Platform.BRAINTREE,
                        deviceData: receipt.dropInResult.deviceData,
                        id: 'nonce',
                        paymentMethodNonce: receipt.dropInResult.paymentMethodNonce?.nonce ?? '',
                        paymentDescription: receipt.dropInResult.paymentDescription,
                        paymentMethodType: receipt.dropInResult.paymentMethodType,
                    }
                }
            }

            async handleReceiptValidationResponse(receipt: Receipt, response: Validator.Response.Payload): Promise<void> {
                this.log.info("receipt validation response: " + JSON.stringify(response));
                if (response?.data && ('transaction' in response.data)) {
                    if (response.data.transaction.type === 'braintree') {
                        const lCustomerId = response.data.transaction.data.transaction?.customer.id;
                        if (lCustomerId && !customerId) {
                            this.log.info("customerId updated: " + lCustomerId);
                            customerId = lCustomerId;
                        }
                    }
                }
            }
        }

        // function formatAmount(amountMicros: number): string {
        //     const amountCents = '' + (amountMicros / 10000);
        //     return (amountCents.slice(0, -2) || '0') + '.' + (amountCents.slice(-2, -1) || '0') + (amountCents.slice(-1) || '0');
        // }

        function isBraintreeReceipt(receipt: Receipt): receipt is BraintreeReceipt {
            return receipt.platform === Platform.BRAINTREE;
        }
    }
}
