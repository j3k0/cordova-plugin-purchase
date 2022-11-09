namespace CdvPurchase {

  export interface IapticConfig {
    /** Default to https://validator.iaptic.com */
    url?: string;

    /** App Name */
    appName: string;

    /** Public API Key */
    apiKey: string;
  }

  /**
   * Integrate with https://www.iaptic.com/
   *
   * @example
   * const iaptic = new CdvPurchase.Iaptic({
   *   url: 'https://validator.iaptic.com',
   *   appName: 'test',
   *   apiKey: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
   * });
   * store.validator = iaptic.validator;
   */
  export class Iaptic {

    private store: Store;
    public log: Logger;
    public config: IapticConfig;

    constructor(config: IapticConfig, store?: Store) {
      this.config = config;
      if (!config.url) {
        config.url = 'https://validator.iaptic.com';
      }
      this.store = store ?? CdvPurchase.store;
      this.log = this.store.log.child('Iaptic');
    }

    /**
     * Provides a client token generated on iaptic's servers
     *
     * Can be passed to the Braintree Adapter at initialization.
     *
     * @example
     * store.initialize([
     *   {
     *     platform: Platform.BRAINTREE,
     *     options: {
     *       clientTokenProvider: iaptic.braintreeClientTokenProvider
     *     }
     *   }
     * ]);
     */
    get braintreeClientTokenProvider(): Braintree.ClientTokenProvider {
      return callback => {
        this.log.info('Calling Braintree clientTokenProvider');
        Utils.ajax(this.log, {
          url: `${this.config.url}/v3/braintree/client-token?appName=${this.config.appName}&apiKey=${this.config.apiKey}`,
          method: 'POST',
          data: {
            applicationUsername: store.getApplicationUsername(),
            customerId: Braintree.customerId,
          },
          success: body => {
            this.log.info('clientTokenProvider success: ' + JSON.stringify(body));
            callback((body as any).clientToken);
          },
          error: err => {
            this.log.info('clientTokenProvider error: ' + JSON.stringify(err));
            callback(storeError(err as ErrorCode, 'ERROR ' + err));
          },
        })
      }
    }

    /** Validator URL */
    get validator() {
      return `${this.config.url}/v1/validate?appName=${this.config.appName}&apiKey=${this.config.apiKey}`;
    }
  }

}
