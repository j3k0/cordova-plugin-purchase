/// <reference path="../../utils/compatibility.ts" />
namespace CdvPurchase {
  export namespace Test {

    const platform = Platform.TEST;

    /**
     * Definition of the test products.
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
     * Initialize a test product.
     *
     * @internal
     */
    export function initTestProduct(productId: string, decorator: Internal.ProductDecorator & Internal.OfferDecorator) {
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
