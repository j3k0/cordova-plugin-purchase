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
            callback(storeError(err as ErrorCode, 'ERROR ' + err, Platform.BRAINTREE, null));
          },
        })
      }
    }

    /**
     * Determine the eligibility of discounts based on the content of the application receipt.
     *
     * The secret sauce used here is to wait for validation of the application receipt.
     * The receipt validator will return the necessary data to determine eligibility.
     *
     * Receipt validation is expected to happen after loading product information, so the implementation here is to
     * wait for a validation response.
     */
    get appStoreDiscountEligibilityDeterminer(): AppleAppStore.DiscountEligibilityDeterminer {
      // the user needs the appStoreDiscountEligibilityDeterminer, let's start listening to receipt validation events.
      let latestReceipt: VerifiedReceipt | undefined;
      this.log.debug("AppStore eligibility determiner is listening...");
      this.store.when().verified(receipt => {
        if (receipt.platform === Platform.APPLE_APPSTORE) {
          this.log.debug("Got a verified AppStore receipt.");
          latestReceipt = receipt;
        }
      }, 'appStoreDiscountEligibilityDeterminer_listening');

      const determiner = (_appStoreReceipt: AppleAppStore.ApplicationReceipt, requests: AppleAppStore.DiscountEligibilityRequest[], callback: (response: boolean[]) => void) => {
        this.log.debug("AppStore eligibility determiner");
        if (latestReceipt) {
          this.log.debug("Using cached receipt");
          return callback(analyzeReceipt(latestReceipt, requests));
        }
        const onVerified = (receipt: VerifiedReceipt) => {
          if (receipt.platform === Platform.APPLE_APPSTORE) {
            this.log.debug("Receipt is verified, let's analyze the content and respond.");
            this.store.off(onVerified);
            callback(analyzeReceipt(receipt, requests));
          }
        }
        this.log.debug("Waiting for receipt");
        this.store.when().verified(onVerified, 'appStoreDiscountEligibilityDeterminer_waiting');
      }

      determiner.cacheReceipt = function(receipt: VerifiedReceipt) {
        latestReceipt = receipt;
      }

      return determiner;

      function analyzeReceipt(receipt: VerifiedReceipt, requests: AppleAppStore.DiscountEligibilityRequest[]) {
        const ineligibleIntro = receipt.raw.ineligible_for_intro_price;
        return requests.map(request => {
          if (request.discountType === 'Introductory' && ineligibleIntro && ineligibleIntro.find(id => request.productId === id)) {
            // User is not eligible for this introductory offer
            return false;
          }
          else if (request.discountType === 'Subscription') {
            // Discount only available if user is or was a subscriber
            const matchingPurchase = receipt.raw.collection?.find(purchase => purchase.id === request.productId);
            return matchingPurchase ? true : false;
          }
          else {
            // In other cases, assume the user is eligible
            return true;
          }
        });
      }
    }

    /** Validator URL */
    get validator() {
      return `${this.config.url}/v1/validate?appName=${this.config.appName}&apiKey=${this.config.apiKey}`;
    }
  }

}
