namespace CdvPurchase {

  export namespace Braintree {

      /**
       * Cordova plugin ID for the braintree ios plugin.
       */
      const PLUGIN_ID = 'BraintreePlugin';

      export namespace IosBridge {

        export class Bridge {

          log: Logger;
          clientTokenProvider: ClientTokenProvider;

          constructor(log: Logger, clientTokenProvider: ClientTokenProvider) {
            this.log = log.child("IosBridge");
            this.clientTokenProvider = clientTokenProvider;
          }

          initialize(verbosity: VerbosityProvider, callback: Callback<IError | undefined>) {
            window.cordova.exec(null, null, "BraintreePlugin", "setVerbosity", [verbosity.verbosity]);
            window.cordova.exec(message => this.log.debug('(Native) ' + message), null, "BraintreePlugin", "setLogger", []);
            setTimeout(() => callback(undefined), 0);
          }

          launchDropIn(dropInRequest: DropIn.Request): Promise<DropIn.Result | IError> {
            return new Promise(resolve => {
              const onSuccess = (result: DropIn.Result) => {
                this.log.info("dropInSuccess: " + JSON.stringify(result));
                resolve(result);
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

          static isSupported() {
            return window.cordova.platformId === 'ios';
          }
        }
      }
    }
  }
