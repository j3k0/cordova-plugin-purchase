namespace CdvPurchase {
  export namespace Braintree {
    export namespace IosBridge {

      /**
       * Cordova plugin ID for the braintree-applepay plugin.
       */
      const PLUGIN_ID = 'BraintreeApplePayPlugin';

      /**
       * Bridge to the cordova-plugin-purchase-braintree-applepay plugin
       */
      export class ApplePayPlugin {

        /**
         * Retrieve the plugin definition.
         *
         * Useful to check if it is installed.
         */
        static get(): CdvPurchaseBraintreeApplePay | undefined {
          return (window as any).CdvPurchaseBraintreeApplePay;
        }

        /**
         * Initiate a payment with Apple Pay.
         */
        static requestPayment(request: ApplePay.PaymentRequest): Promise<ApplePayPaymentResult | IError> {
          return new Promise(resolve => {
            if (!ApplePayPlugin.get()?.installed) {
              return resolve(braintreeError(ErrorCode.SETUP, 'cordova-plugin-purchase-braintree-applepay does not appear to be installed.'));
            }
            else {
              const success = (result: ApplePayPaymentResult) => {
                resolve(result);
              };
              const failure = (err?: string) => {
                const message = err ?? 'payment request failed';
                resolve(braintreeError(ErrorCode.PURCHASE, 'Braintree+ApplePay ERROR: ' + message));
              };
              window.cordova.exec(success, failure, PLUGIN_ID, 'presentDropInPaymentUI', [request]);
            }
          });
        }

        /**
         * Returns true if the device supports Apple Pay.
         *
         * This does not necessarily mean the user has a card setup already.
         */
        static isSupported(log: Logger): Promise<boolean> {
          return new Promise(resolve => {
            if (window.cordova.platformId !== 'ios') {
              log.info('BraintreeApplePayPlugin is only available for ios.');
              return resolve(false);
            }
            if (!ApplePayPlugin.get()?.installed) {
              log.info('BraintreeApplePayPlugin does not appear to be installed.');
              return resolve(false);
            }
            try {
              window.cordova.exec((result: boolean) => {
                resolve(result);
              }, () => {
                log.info('BraintreeApplePayPlugin is not available.');
                resolve(false);
              }, PLUGIN_ID, "isApplePaySupported", []);
            }
            catch (err) {
              log.info('BraintreeApplePayPlugin is not installed.');
              resolve(false);
            }
          });
        }
      }
    }
  }
}
