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
   * Helper to integrate with https://www.iaptic.com
   */
  export class Iaptic {

    private store: CdvPurchase.Store;
    public log: Logger;
    public config: IapticConfig;

    constructor(config: IapticConfig, store?: CdvPurchase.Store) {
      this.config = config;
      if (!config.url) {
        config.url = 'https://validator.iaptic.com';
      }
      this.store = store ?? CdvPurchase.store;
      this.log = this.store.log.child('Iaptic');
    }

    get braintreeClientTokenProvider(): CdvPurchase.Braintree.ClientTokenProvider {
      return callback => {
        store.log.info('Calling Braintree clientTokenProvider');
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
            callback(storeError(err as CdvPurchase.ErrorCode, 'ERROR ' + err));
          },
        })
      }
    }

    get validator() {
      return `${this.config.url}/v1/validate?appName=${this.config.appName}&apiKey=${this.config.apiKey}`;
    }
  }

}