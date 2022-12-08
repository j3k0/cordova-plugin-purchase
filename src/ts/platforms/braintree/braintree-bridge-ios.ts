namespace CdvPurchase {

  export namespace Braintree {

      /**
       * Cordova plugin ID for the braintree ios plugin.
       */
      const PLUGIN_ID = 'BraintreePlugin';

      export namespace IosBridge {

        interface CdvPurchaseBraintreeApplePay {
          installed?: boolean;
        }

        export interface BinData {
          prepaid: string;
          healthcare: string;
          debit: string;
          durbinRegulated: string;
          commercial: string;
          payroll: string;
          issuingBank: string;
          countryOfIssuance: string;
          productID: string;
        }

        export interface ApplePayPaymentResult {
          applePayCardNonce: {
            nonce: string;
            type: string;
            binData?: BinData;
          }
          payment: ApplePay.Payment;
        }

        /**
         * Options for enabling Apple Pay payments.
         */
        export interface ApplePayOptions {

          /**
           * Your company name, required to prepare the payment request.
           *
           * If you are setting `paymentSummaryItems` manually in `preparePaymentRequest`, this field will
           * not be used.
           */
          companyName?: string;

          /**
           * When the user selects Apple Pay as a payment method, the plugin will initialize a payment request
           * client side using the PassKit SDK.
           *
           * You can customize the ApplePay payment request by implementing the `preparePaymentRequest` function.
           *
           * This let's you prefill some information you have on database about the user, limit payment methods,
           * enable coupon codes, etc.
           *
           * @see {@link https://developer.apple.com/documentation/passkit/pkpaymentrequest/}
           */
          preparePaymentRequest?: () => ApplePay.PaymentRequest;
        }

        export class Bridge {

          log: Logger;
          clientTokenProvider: ClientTokenProvider;
          applePayOptions?: ApplePayOptions;

          constructor(log: Logger, clientTokenProvider: ClientTokenProvider, applePayOptions?: ApplePayOptions) {
            this.log = log.child("IosBridge");
            this.clientTokenProvider = clientTokenProvider;
          }

          initialize(verbosity: VerbosityProvider, callback: Callback<IError | undefined>) {
            window.cordova.exec(null, null, "BraintreePlugin", "setVerbosity", [verbosity.verbosity]);
            window.cordova.exec(message => this.log.debug('(Native) ' + message), null, "BraintreePlugin", "setLogger", []);
            setTimeout(() => callback(undefined), 0);
          }

          async continueDropInForApplePay(paymentRequest: PaymentRequest, DropInRequest: DropIn.Request, dropInResult: DropIn.Result): Promise<DropIn.Result | IError> {
            const request: ApplePay.PaymentRequest = this.applePayOptions?.preparePaymentRequest?.() || {
              merchantCapabilities: [ApplePay.MerchantCapability.ThreeDS],
            };
            if (!request.paymentSummaryItems) {
              request.paymentSummaryItems = [{
                label: this.applePayOptions?.companyName ?? 'Total',
                type: 'final',
                amount: `${Math.round(paymentRequest.amountMicros / 10000) / 100}`,
              }];
            }
            const result = await this.requestApplePayPayment(request);
            this.log.info('Result from Apple Pay: ' + JSON.stringify(result));
            if ('isError' in result) return result;
            return {
              paymentMethodNonce: {
                isDefault: false,
                nonce: result.applePayCardNonce.nonce,
                type: result.applePayCardNonce.type,
              },
              paymentMethodType: dropInResult.paymentMethodType,
              deviceData: dropInResult.deviceData,
              paymentDescription: dropInResult.paymentDescription,
            }
          }

          launchDropIn(paymentRequest: PaymentRequest, dropInRequest: DropIn.Request): Promise<DropIn.Result | IError> {
            return new Promise(resolve => {
              const onSuccess = (result: DropIn.Result) => {
                this.log.info("dropInSuccess: " + JSON.stringify(result));
                if (result.paymentMethodType === DropIn.PaymentMethod.APPLE_PAY) {
                  this.log.info("it's an ApplePay request, we have to process it.");
                  this.continueDropInForApplePay(paymentRequest, dropInRequest, result).then(resolve);
                }
                else {
                  resolve(result);
                }
              }
              const onError = (errorString: string) => {
                this.log.info("dropInFailure: " + errorString);
                const [errCode, errMessage] = errorString.split('|');
                if (errCode === "UserCanceledException") {
                    resolve(storeError(ErrorCode.PAYMENT_CANCELLED, errMessage));
                }
                else {
                    resolve(storeError(ErrorCode.UNKNOWN, 'ERROR ' + errCode + ': ' + errMessage));
                }
              }
              this.clientTokenProvider((clientToken) => {
                if (typeof clientToken === 'string')
                  window.cordova.exec(onSuccess, onError, "BraintreePlugin", "launchDropIn", [clientToken, dropInRequest]);
                else // failed to get token
                  resolve(clientToken);
              });
            });
          }

          isApplePaySupported(): Promise<boolean> {
            return new Promise(resolve => {
              try {
                window.cordova.exec((result: boolean) => {
                  resolve(result);
                }, () => {
                  this.log.info('BraintreeApplePayPlugin is not available.');
                  resolve(false);
                }, "BraintreeApplePayPlugin", "isApplePaySupported", []);
              }
              catch (err) {
                this.log.info('BraintreeApplePayPlugin is not installed.');
                resolve(false);
              }
            });
          }

          requestApplePayPayment(request: ApplePay.PaymentRequest): Promise<ApplePayPaymentResult | IError> {
            return new Promise(resolve => {
              const braintreeApplePay = (window as any).CdvPurchaseBraintreeApplePay as (CdvPurchaseBraintreeApplePay | undefined);
              if (!braintreeApplePay?.installed) {
                return resolve(storeError(ErrorCode.SETUP, 'cordova-plugin-purchase-braintree-applepay does not appear to be installed.'));
              }
              else {
                const success = (result: ApplePayPaymentResult) => {
                  resolve(result);
                };
                const failure = (err?: string) => {
                  const message = err ?? 'payment request failed';
                  resolve(storeError(ErrorCode.PURCHASE, 'Braintree+ApplePay ERROR: ' + message));
                };
                window.cordova.exec(success, failure, 'CdvPurchaseBraintreeApplePay', 'presentDropInPaymentUI', [request]);
              }
            });
          }

          static isSupported() {
            return window.cordova.platformId === 'ios';
          }
        }
      }
    }
  }
