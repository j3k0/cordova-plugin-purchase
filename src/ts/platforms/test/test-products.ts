/// <reference path="../../utils/compatibility.ts" />
namespace CdvPurchase {
  export namespace Test {

    const platform = Platform.TEST;

    /**
     * Metadata for test products.
     */
    export interface TestProductMetadata {
      title: string;
      description: string;
      offerId: string;
      pricing: {
        price: string;
        currency: string;
        priceMicros: number;
      } | PricingPhase[];
    }

    export type IRegisterTestProduct = IRegisterProduct & Partial<TestProductMetadata>;

    /**
     * Storage for custom test products registered by the user.
     * 
     * @internal
     */
    export const customTestProducts: { [key: string]: IRegisterProduct & { customMetadata?: TestProductMetadata } } = {};

    /**
     * Definition of the built-in test products.
     */
    export const testProducts = {

      /**
       * A valid consumable product.
       *
       * - id: "test-consumable"
       * - type: ProductType.CONSUMABLE
       */
      CONSUMABLE: {
        platform,
        id: 'test-consumable',
        type: ProductType.CONSUMABLE,
      },

      /**
       * A consumable product for which the purchase will always fail.
       *
       * - id: "test-consumable-fail"
       * - type: ProductType.CONSUMABLE
       */
      CONSUMABLE_FAILING: {
        platform,
        id: 'test-consumable-fail',
        type: ProductType.CONSUMABLE,
      },

      /**
       * A valid non-consumable product.
       *
       * - id: "test-non-consumable"
       * - type: ProductType.NON_CONSUMABLE
       */
      NON_CONSUMABLE: {
        platform,
        id: 'test-non-consumable',
        type: ProductType.NON_CONSUMABLE,
      },

      /**
       * A paid-subscription that auto-renews for the duration of the session.
       *
       * This subscription has a free trial period, that renews every week, 3 times.
       * It then costs $4.99 per month.
       *
       * - id: "test-subscription"
       * - type: ProductType.PAID_SUBSCRIPTION
       */
      PAID_SUBSCRIPTION: {
        platform,
        id: 'test-subscription',
        type: ProductType.PAID_SUBSCRIPTION,
      },

      /**
       * A paid-subscription that is already active when the app starts.
       *
       * It behaves as if the user subscribed on a different device. It will renew forever.
       *
       * - id: "test-subscription-active"
       * - type: ProductType.PAID_SUBSCRIPTION
       */
      PAID_SUBSCRIPTION_ACTIVE: {
        platform,
        id: 'test-subscription-active',
        type: ProductType.PAID_SUBSCRIPTION,

        /** @internal */
        extra: {
          offerId: 'test-paid-subscription-active-offer1',
        }
      },
    }

    /**
     * List of test products definitions as an array.
     */
    export const testProductsArray: IRegisterProduct[] = Utils.objectValues(testProducts);

    /**
     * Default pricing phase configuration for different product types.
     */
    const defaultPricingPhaseConfig: { [key: string]: PricingPhase[] } = {
      [ProductType.CONSUMABLE]: [{
        price: '$1.99',
        currency: 'USD',
        priceMicros: 1990000,
        paymentMode: PaymentMode.UP_FRONT,
        recurrenceMode: RecurrenceMode.NON_RECURRING,
      }],
      [ProductType.NON_CONSUMABLE]: [{
        price: '$4.99',
        currency: 'USD',
        priceMicros: 4990000,
        paymentMode: PaymentMode.UP_FRONT,
        recurrenceMode: RecurrenceMode.NON_RECURRING,
      }],
      [ProductType.PAID_SUBSCRIPTION]: [{
        price: '$9.99',
        currency: 'USD',
        priceMicros: 9990000,
        paymentMode: PaymentMode.PAY_AS_YOU_GO,
        recurrenceMode: RecurrenceMode.INFINITE_RECURRING,
        billingPeriod: 'P1M',
      }],
    };

    /**
     * Register a custom test product that can be used during development.
     * 
     * This function allows developers to create custom test products for development
     * and testing purposes. These products will be available in the Test platform
     * alongside the standard test products.
     * 
     * @param config - Configuration for the test product
     * @returns The registered product configuration
     * 
     * @example
     * ```typescript
     * // Register a custom consumable product
     * CdvPurchase.Test.registerTestProduct({
     *   id: 'my-consumable',
     *   type: CdvPurchase.ProductType.CONSUMABLE,
     *   title: 'My Custom Consumable',
     *   description: 'A custom test consumable product',
     *   pricing: {
     *     price: '$2.99', 
     *     currency: 'USD',
     *     priceMicros: 2990000
     *   }
     * });
     * 
     * // Later register it with the store
     * store.register([{
     *   id: 'my-consumable',
     *   type: CdvPurchase.ProductType.CONSUMABLE,
     *   platform: CdvPurchase.Platform.TEST
     * }]);
     * 
     * // Note that this can be done in a single step:
     * store.register([{
     *   id: 'my-custom-product',
     *   type: CdvPurchase.ProductType.CONSUMABLE,
     *   platform: CdvPurchase.Platform.TEST,
     *   title: '...',
     *   description: 'A custom test consumable product',
     *   pricing: {
     *     price: '$2.99', 
     *     currency: 'USD',
     *     priceMicros: 2990000
     *   }
     * }]);
     * ```
     */
    export function registerTestProduct(config: IRegisterTestProduct): IRegisterProduct & { customMetadata?: TestProductMetadata } {
      
      // Validate required fields
      if (!config.id) throw new Error('Product ID is required');
      if (config.type === undefined) throw new Error('Product type is required');
      
      // Create the product configuration with required metadata
      const metadata: TestProductMetadata = {
        title: config.title || `Test ${config.type}`,
        description: config.description || `A test ${config.type} product`,
        offerId: config.offerId || `${config.id}-offer1`,
        pricing: config.pricing || defaultPricingPhaseConfig[config.type]
      };
      
      const productConfig: IRegisterProduct & { customMetadata: TestProductMetadata } = {
        platform,
        id: config.id,
        type: config.type,
        customMetadata: metadata
      };
      
      // Store the custom product
      customTestProducts[config.id] = productConfig;
      
      return productConfig;
    }

    /**
     * Initialize a test product.
     *
     * @internal
     */
    export function initTestProduct(productId: string, decorator: Internal.ProductDecorator & Internal.OfferDecorator) {
      // First check if it's a custom product
      if (customTestProducts[productId]) {
        const customConfig = customTestProducts[productId];
        const product: Product = new Product({
          platform,
          id: customConfig.id,
          type: customConfig.type
        }, decorator);
        
        // Set product details from custom metadata
        if (customConfig.customMetadata) {
          product.title = customConfig.customMetadata.title;
          product.description = customConfig.customMetadata.description;
          
          const offerId = customConfig.customMetadata.offerId;
          let pricingPhases: PricingPhase[] = [];
          
          // Handle different pricing formats
          if (Array.isArray(customConfig.customMetadata.pricing)) {
            pricingPhases = customConfig.customMetadata.pricing;
          } else if (customConfig.customMetadata.pricing) {
            const pricing = customConfig.customMetadata.pricing;
            pricingPhases = [{
              price: pricing.price,
              currency: pricing.currency,
              priceMicros: pricing.priceMicros,
              paymentMode: customConfig.type === ProductType.PAID_SUBSCRIPTION 
                ? PaymentMode.PAY_AS_YOU_GO 
                : PaymentMode.UP_FRONT,
              recurrenceMode: customConfig.type === ProductType.PAID_SUBSCRIPTION 
                ? RecurrenceMode.INFINITE_RECURRING 
                : RecurrenceMode.NON_RECURRING,
              billingPeriod: customConfig.type === ProductType.PAID_SUBSCRIPTION ? 'P1M' : undefined,
            }];
          }
          
          // Add offer to the product
          product.addOffer(new Offer({
            id: offerId,
            product,
            pricingPhases
          }, decorator));
        }
        
        return product;
      }
      
      // If not a custom product, use the built-in test products implementation
      const key = (Object.keys(testProducts) as (keyof typeof testProducts)[]).find(key => testProducts[key] && testProducts[key].id === productId);
      if (!key) return;
      const product: Product = new Product(testProducts[key], decorator);

      switch (key) {

        case 'CONSUMABLE':
          product.title = 'Test Consumable';
          product.description = 'A consumable product that you can purchase';
          product.addOffer(new Offer({
            id: 'test-consumable-offer1',
            pricingPhases: [{
              price: '$4.99',
              currency: 'USD',
              priceMicros: 4990000,
              paymentMode: PaymentMode.UP_FRONT,
              recurrenceMode: RecurrenceMode.NON_RECURRING,
            }],
            product,
          }, decorator));
          break;

        case 'CONSUMABLE_FAILING':
          product.title = 'Failing Consumable';
          product.description = 'A consumable product that cannot be purchased';
          product.addOffer(new Offer({
            id: 'test-consumable-fail-offer1',
            pricingPhases: [{
              price: '$1.99',
              currency: 'USD',
              priceMicros: 1990000,
              paymentMode: PaymentMode.UP_FRONT,
              recurrenceMode: RecurrenceMode.NON_RECURRING,
            }],
            product,
          }, decorator));
          break;

        case 'NON_CONSUMABLE':
          product.title = 'Non Consumable';
          product.description = 'A non consumable product';
          product.addOffer(new Offer({
            id: 'test-non-consumable-offer1',
            pricingPhases: [{
              price: '$9.99',
              currency: 'USD',
              priceMicros: 9990000,
              paymentMode: PaymentMode.UP_FRONT,
              recurrenceMode: RecurrenceMode.NON_RECURRING,
            }],
            product,
          }, decorator));
          break;

        case 'PAID_SUBSCRIPTION':
          product.title = 'A subscription product';
          product.description = 'An auto-renewing paid subscription with a trial period';
          product.addOffer(new Offer({
            id: 'test-paid-subscription-offer1',
            product,
            pricingPhases: [{
              price: '$0.00',
              currency: 'USD',
              priceMicros: 0,
              paymentMode: PaymentMode.FREE_TRIAL,
              recurrenceMode: RecurrenceMode.FINITE_RECURRING,
              billingCycles: 3,
              billingPeriod: 'P1W',
            }, {
              price: '$4.99',
              currency: 'USD',
              priceMicros: 4990000,
              paymentMode: PaymentMode.PAY_AS_YOU_GO,
              recurrenceMode: RecurrenceMode.INFINITE_RECURRING,
              billingPeriod: 'P1M',
            }],
          }, decorator));
          break;

        case 'PAID_SUBSCRIPTION_ACTIVE':
          product.title = 'An owned subscription product';
          product.description = 'An active paid subscription';
          product.addOffer(new Offer({
            id: testProducts.PAID_SUBSCRIPTION_ACTIVE.extra.offerId,
            product,
            pricingPhases: [{
              price: '$19.99',
              currency: 'USD',
              priceMicros: 19990000,
              paymentMode: PaymentMode.PAY_AS_YOU_GO,
              recurrenceMode: RecurrenceMode.INFINITE_RECURRING,
              billingPeriod: 'P1Y',
            }],
          }, decorator));
          break;

        default:
          const unhandledSwitchCase: never = key;
          throw new Error(`Unhandled enum case: ${unhandledSwitchCase}`);
      }
      return product;
    }
  }
}