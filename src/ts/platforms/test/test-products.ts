namespace CdvPurchase {
  export namespace Test {

    const platform = Platform.TEST;

    /**
     * A valid consumable product.
     *
     * id: "test-consumable"
     * type: ProductType.CONSUMABLE
     */
    export const CONSUMABLE_OK = new Product({
      platform,
      id: 'test-consumable',
      type: ProductType.CONSUMABLE,
    });
    CONSUMABLE_OK.title = 'Test Consumable';
    CONSUMABLE_OK.description = 'A consumable product that you can purchase';
    CONSUMABLE_OK.addOffer(new Offer({
      id: 'test-consumable-offer1',
      pricingPhases: [{
        price: '$4.99',
        currency: 'USD',
        priceMicros: 4990000,
        paymentMode: PaymentMode.UP_FRONT,
        recurrenceMode: RecurrenceMode.NON_RECURRING,
      }],
      product: CONSUMABLE_OK,
    }));

    /**
     * A consumable product for which the purchase will always fail.
     *
     * id: "test-consumable-fail"
     * type: ProductType.CONSUMABLE
     */
    export const CONSUMABLE_FAILING = new Product({
      platform,
      id: 'test-consumable-fail',
      type: ProductType.CONSUMABLE,
    });
    CONSUMABLE_FAILING.title = 'Failing Consumable';
    CONSUMABLE_FAILING.description = 'A consumable product that cannot be purchased';
    CONSUMABLE_FAILING.addOffer(new Offer({
      id: 'test-consumable-fail-offer1',
      pricingPhases: [{
        price: '$1.99',
        currency: 'USD',
        priceMicros: 1990000,
        paymentMode: PaymentMode.UP_FRONT,
        recurrenceMode: RecurrenceMode.NON_RECURRING,
      }],
      product: CONSUMABLE_FAILING,
    }));

    /**
     * A valid non-consumable product.
     *
     * id: "test-non-consumable"
     * type: ProductType.NON_CONSUMABLE
     */
    export const NON_CONSUMABLE_OK = new Product({
      platform,
      id: 'test-non-consumable',
      type: ProductType.NON_CONSUMABLE,
    });
    NON_CONSUMABLE_OK.title = 'Non Consumable';
    NON_CONSUMABLE_OK.description = 'A non consumable product';
    NON_CONSUMABLE_OK.addOffer(new Offer({
      id: 'test-non-consumable-offer1',
      pricingPhases: [{
        price: '$9.99',
        currency: 'USD',
        priceMicros: 9990000,
        paymentMode: PaymentMode.UP_FRONT,
        recurrenceMode: RecurrenceMode.NON_RECURRING,
      }],
      product: NON_CONSUMABLE_OK,
    }));

    /**
     * A paid-subscription that auto-renews for the duration of the session.
     *
     * This subscription has a free trial period, that renews every week, 3 times.
     * It then costs $4.99 per month.
     *
     * id: "test-subscription"
     * type: ProductType.PAID_SUBSCRIPTION
     */
    export const PAID_SUBSCRIPTION_OK = new Product({
      platform,
      id: 'test-subscription',
      type: ProductType.PAID_SUBSCRIPTION,
    });
    PAID_SUBSCRIPTION_OK.title = 'A subscription product';
    PAID_SUBSCRIPTION_OK.description = 'An auto-renewing paid subscription with a trial period';
    PAID_SUBSCRIPTION_OK.addOffer(new Offer({
      id: 'test-paid-subscription-offer1',
      product: PAID_SUBSCRIPTION_OK,
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
    }));

    /**
     * A paid-subscription that is already active when the app starts.
     *
     * It behaves as if the user subscribed on a different device. It will renew forever.
     *
     * id: "test-subscription-active"
     * type: ProductType.PAID_SUBSCRIPTION
     */
    export const PAID_SUBSCRIPTION_ACTIVE = new Product({
      platform,
      id: 'test-subscription-active',
      type: ProductType.PAID_SUBSCRIPTION,
    });
    PAID_SUBSCRIPTION_ACTIVE.title = 'An owned subscription product';
    PAID_SUBSCRIPTION_ACTIVE.description = 'An active paid subscription';
    PAID_SUBSCRIPTION_ACTIVE.addOffer(new Offer({
      id: 'test-paid-subscription-active-offer1',
      product: PAID_SUBSCRIPTION_ACTIVE,
      pricingPhases: [{
        price: '$19.99',
        currency: 'USD',
        priceMicros: 19990000,
        paymentMode: PaymentMode.PAY_AS_YOU_GO,
        recurrenceMode: RecurrenceMode.INFINITE_RECURRING,
        billingPeriod: 'P1Y',
      }],
    }));

    /**
     * List of all recognized test products for the Test Adapter.
     *
     * Register those products at startup with `store.register()` to activate them.
     */
    export const TEST_PRODUCTS: Product[] = [
      CONSUMABLE_OK,
      CONSUMABLE_FAILING,
      NON_CONSUMABLE_OK,
      PAID_SUBSCRIPTION_OK,
      PAID_SUBSCRIPTION_ACTIVE,
    ];
  }
}
