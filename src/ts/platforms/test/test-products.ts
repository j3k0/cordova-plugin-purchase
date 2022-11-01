namespace CdvPurchase {
  export namespace Test {

    /** A consumable product for which the purchase goes through */
    export const CONSUMABLE_OK = new Product({
      id: 'test-consumable',
      platform: Platform.TEST,
      type: ProductType.CONSUMABLE,
    });
    CONSUMABLE_OK.title = 'Test Consumable';
    CONSUMABLE_OK.description = 'A consumable product that you can purchase';
    CONSUMABLE_OK.addOffer({
      id: 'test-consumable-offer1',
      pricingPhases: [{
        price: '$9.99',
        currency: 'USD',
        priceMicros: 9990000,
        paymentMode: PaymentMode.UP_FRONT,
        recurrenceMode: RecurrenceMode.NON_RECURRING,
      }],
      product: CONSUMABLE_OK,
    });

    /** A consumable product for which the purchase will fail */
    export const CONSUMABLE_FAILING = new Product({
      id: 'test-consumable-fail',
      platform: Platform.TEST,
      type: ProductType.CONSUMABLE,
    });
    CONSUMABLE_FAILING.title = 'Failing Consumable';
    CONSUMABLE_FAILING.description = 'A consumable product that cannot be purchased';
    CONSUMABLE_FAILING.addOffer({
      id: 'test-consumable-fail-offer1',
      pricingPhases: [{
        price: '$1.99',
        currency: 'USD',
        priceMicros: 9990000,
        paymentMode: PaymentMode.UP_FRONT,
        recurrenceMode: RecurrenceMode.NON_RECURRING,
      }],
      product: CONSUMABLE_FAILING,
    });

    /** List of all test products */
    export const TEST_PRODUCTS: Product[] = [CONSUMABLE_OK, CONSUMABLE_FAILING];
  }
}
