namespace CdvPurchase {
    export namespace Braintree {

        /** The Braintree customer identifier. Set it to allow reusing of payment methods. */
        export let customerId: string | undefined;

        export interface AdapterOptions {

            /** Authorization key, as a direct string. */
            tokenizationKey?: string;

            /** Function used to retrieve a Client Token (used if no tokenizationKey are provided). */
            clientTokenProvider?: ClientTokenProvider;

            /** Options for making Apple Pay payment requests */
            applePay?: IosBridge.ApplePayOptions;

            /**
             * Google Pay request parameters applied to all Braintree DropIn requests
             */
            googlePay?: GooglePay.Request;

            /**
             * 3DS request parameters applied to all Braintree DropIn requests
             */
            threeDSecure?: ThreeDSecure.Request;
        }

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

            constructor(paymentRequest: PaymentRequest, dropInResult: DropIn.Result, decorator: Internal.TransactionDecorator & Internal.ReceiptDecorator) {

                // Now we have to send this to the server + the request
                // result.paymentDescription; // "1111"
                // result.paymentMethodType; // "VISA"
                // result.deviceData; // undefined
                // result.paymentMethodNonce; // {"isDefault":false,"nonce":"tokencc_bh_rdjmsc_76vjtq_9tzsv3_4467mg_tt4"}

                super(Platform.BRAINTREE, decorator);

                const transaction = new Transaction(Platform.BRAINTREE, this, decorator);
                transaction.purchaseDate = new Date();
                transaction.products = paymentRequest.items?.filter(p => p).map(product => ({ id: product?.id || ''})) || [];
                transaction.state = TransactionState.APPROVED;
                transaction.transactionId = dropInResult.paymentMethodNonce?.nonce ?? `UNKNOWN_${dropInResult.paymentMethodType}_${dropInResult.paymentDescription}`;
                this.transactions = [transaction];

                this.dropInResult = dropInResult;
                this.paymentRequest = paymentRequest;
                this.refresh(paymentRequest, dropInResult, decorator);
            }

            refresh(paymentRequest: PaymentRequest, dropInResult: DropIn.Result, decorator: Internal.TransactionDecorator) {
                this.dropInResult = dropInResult;
                this.paymentRequest = paymentRequest;
                const transaction = new Transaction(Platform.BRAINTREE, this, decorator);
                transaction.products = paymentRequest.items.filter(p => p).map(product => ({ id: product?.id || ''}));
                transaction.state = TransactionState.APPROVED;
                transaction.transactionId = dropInResult.paymentMethodNonce?.nonce ?? `UNKNOWN_${dropInResult.paymentMethodType}_${dropInResult.paymentDescription}`;
                transaction.amountMicros = paymentRequest.amountMicros;
                transaction.currency = paymentRequest.currency;
                this.transactions = [transaction];
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

            supportsParallelLoading = false;

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
                                callback(braintreeError(ErrorCode.CLIENT_INVALID, 'Braintree iOS Bridge requires a clientTokenProvider or tokenizationKey'));
                        }, this.options.applePay);
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
                    this.context.listener.receiptsReady(Platform.BRAINTREE);
                });
            }

            async loadProducts(products: IRegisterProduct[]): Promise<(Product | IError)[]> {
                return products.map(p => braintreeError(ErrorCode.PRODUCT_NOT_AVAILABLE, 'N/A'));
            }

            async loadReceipts(): Promise<Receipt[]> {
                this.context.listener.receiptsReady(Platform.BRAINTREE);
                return [];
            }

            async order(offer: Offer): Promise<undefined | IError> {
                return braintreeError(ErrorCode.UNKNOWN, 'N/A: Not implemented with Braintree');
            }

            async finish(transaction: Transaction): Promise<undefined | IError> {
                transaction.state = TransactionState.FINISHED;
                this.context.listener.receiptsUpdated(Platform.TEST, [transaction.parentReceipt]);
                return;
            }

            async manageSubscriptions(): Promise<IError | undefined> {
                this.log.info('N/A: manageSubscriptions() is not available with Braintree');
                return;
            }

            async manageBilling(): Promise<IError | undefined> {
                this.log.info('N/A: manageBilling() is not available with Braintree');
                return;
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

            private async launchDropIn(paymentRequest: PaymentRequest, dropInRequest: DropIn.Request): Promise<DropIn.Result | IError> {
                if (this.androidBridge) return this.androidBridge.launchDropIn(dropInRequest);
                if (this.iosBridge) return this.iosBridge.launchDropIn(paymentRequest, dropInRequest);
                return braintreeError(ErrorCode.PURCHASE, 'Braintree is not available');
            }

            async requestPayment(paymentRequest: PaymentRequest, additionalData?: CdvPurchase.AdditionalData): Promise<IError | Transaction | undefined> {

                this.log.info("requestPayment()" + JSON.stringify(paymentRequest));
                const dropInRequest: DropIn.Request = additionalData?.braintree?.dropInRequest || {};

                // Apple Pay
                if (!await IosBridge.ApplePayPlugin.isSupported(this.log)) {
                    this.log.info("Apple Pay is not supported.");
                    dropInRequest.applePayDisabled = true;
                }

                // Google Pay
                if (this.options.googlePay || dropInRequest.googlePayRequest) {
                    const googlePay: GooglePay.Request = {
                        ...(this.options.googlePay ?? {}),
                        ...(dropInRequest.googlePayRequest ?? {}),
                    }
                    if (!googlePay.transactionInfo) {
                        googlePay.transactionInfo = {
                            currencyCode: (paymentRequest.currency ?? ''),
                            totalPrice: (paymentRequest.amountMicros ?? 0) / 1000000,
                            totalPriceStatus: GooglePay.TotalPriceStatus.FINAL,
                        }
                    }
                    dropInRequest.googlePayRequest = googlePay;
                }

                // 3DS
                if (this.options.threeDSecure || dropInRequest.threeDSecureRequest) {
                    const threeDS: ThreeDSecure.Request = {
                        ...(this.options.threeDSecure ?? {}),
                        ...(dropInRequest.threeDSecureRequest ?? {}),
                    }
                    if (!threeDS.amount) {
                        threeDS.amount = asDecimalString(paymentRequest.amountMicros ?? 0);
                    }
                    if (!threeDS.billingAddress && paymentRequest.billingAddress) {
                        threeDS.billingAddress = {
                            givenName: paymentRequest.billingAddress.givenName,
                            surname: paymentRequest.billingAddress.surname,
                            countryCodeAlpha2: paymentRequest.billingAddress.countryCode,
                            postalCode: paymentRequest.billingAddress.postalCode,
                            locality: paymentRequest.billingAddress.locality,
                            streetAddress: paymentRequest.billingAddress.streetAddress1,
                            extendedAddress: paymentRequest.billingAddress.streetAddress2,
                            line3: paymentRequest.billingAddress.streetAddress3,
                            phoneNumber: paymentRequest.billingAddress.phoneNumber,
                            region: paymentRequest.billingAddress.region,
                        }
                    }
                    if (!threeDS.email) {
                        threeDS.email = paymentRequest.email;
                    }
                    dropInRequest.threeDSecureRequest = threeDS;
                }

                const response = await this.launchDropIn(paymentRequest, dropInRequest);
                if (!dropInResponseIsOK(response)) return dropInResponseError(this.log, response);
                const dropInResult: DropIn.Result = response;

                this.log.info("launchDropIn success: " + JSON.stringify({ paymentRequest, dropInResult }));
                if (!dropInResult.paymentMethodNonce?.nonce) {
                    return braintreeError(ErrorCode.BAD_RESPONSE, 'launchDropIn returned no paymentMethodNonce');
                }

                let receipt = this._receipts.find(r => r.dropInResult.paymentMethodNonce?.nonce === dropInResult.paymentMethodNonce?.nonce);
                if (receipt) {
                    receipt.refresh(paymentRequest, dropInResult, this.context.apiDecorators);
                }
                else {
                    receipt = new BraintreeReceipt(paymentRequest, dropInResult, this.context.apiDecorators);
                    this.receipts.push(receipt);
                }
                this.context.listener.receiptsUpdated(Platform.BRAINTREE, [receipt]);
                return receipt.transactions[0];
            }

            async receiptValidationBody(receipt: BraintreeReceipt): Promise<Validator.Request.Body | undefined> {
                if (!isBraintreeReceipt(receipt)) {
                    this.log.error("Unexpected error, expecting a BraintreeReceipt: " + JSON.stringify(receipt));
                    return;
                }
                this.log.info("create receiptValidationBody for: " + JSON.stringify(receipt));
                return {
                    id: receipt.paymentRequest.items?.[0]?.id ?? 'unknown',
                    type: ProductType.CONSUMABLE,
                    priceMicros: receipt.paymentRequest.amountMicros,
                    currency: receipt.paymentRequest.currency,
                    products: [],
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

            /**
             * Handle a response from a receipt validation process.
             *
             * @param receipt The receipt being validated.
             * @param response The response payload from the receipt validation process.
             * @returns A promise that resolves when the response has been handled.
             */
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

            checkSupport(functionality: PlatformFunctionality): boolean {
                return functionality === 'requestPayment';
            }

            async restorePurchases(): Promise<IError | undefined> {
                return undefined;
            }
        }

        function asDecimalString(amountMicros: number): string {
            const amountCents = '' + (amountMicros / 10000);
            return (amountCents.slice(0, -2) || '0') + '.' + (amountCents.slice(-2, -1) || '0') + (amountCents.slice(-1) || '0');
        }

        function isBraintreeReceipt(receipt: Receipt): receipt is BraintreeReceipt {
            return receipt.platform === Platform.BRAINTREE;
        }

        const dropInResponseIsOK = (response?: DropIn.Result | IError): response is DropIn.Result => {
            return (!!response) && !('code' in response && 'message' in response);
        }

        /**
         * Returns the error response from Drop In
         *
         * If the "error" is that the user cancelled the payment, then returns undefined
         * (as per the specification for requestPayment)
         */
        const dropInResponseError = (log: Logger, response?: IError): (IError | undefined) => {
            if (!response) {
                log.warn("launchDropIn failed: no response");
                return braintreeError(ErrorCode.BAD_RESPONSE, 'Braintree failed to launch drop in');
            }
            else {
                // Failed
                if (response.code === ErrorCode.PAYMENT_CANCELLED) {
                    log.info("User cancelled the payment request");
                    return undefined;
                }
                log.warn("launchDropIn failed: " + JSON.stringify(response));
                return response;
            }
        }

        export function braintreeError(code: ErrorCode, message: string) {
            return storeError(code, message, Platform.BRAINTREE, null);
        }
    }
}
