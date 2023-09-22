import '../www/store';

describe('CDVPurchase', () => {

  describe('Iaptic', () => {
    // Check that iaptic correctly parses the ineligible_for_intro_price array from validation response
    describe('appStoreDiscountEligibilityDeterminer', () => {
      const testReceipt: CdvPurchase.VerifiedReceipt = {
        className: 'VerifiedReceipt',
        set: (receipt, response) => { },
        platform: CdvPurchase.Platform.APPLE_APPSTORE,
        id: 'my-receipt',
        finish: () => new Promise<void>(resolve => { }),
        raw: {
          id: '',
          latest_receipt: true,
          transaction: {} as unknown as CdvPurchase.Validator.Response.NativeTransaction,
          ineligible_for_intro_price: ['not-eligible'],
        },
        collection: [],
        sourceReceipt: {
          className: 'Receipt',
          platform: CdvPurchase.Platform.APPLE_APPSTORE,
          transactions: [],
          hasTransaction: x => false,
          lastTransaction: () => ({} as unknown as CdvPurchase.Transaction),
          finish: () => new Promise<void>(resolve => { }),
          verify: () => new Promise<void>(resolve => { }),
        },
        latestReceipt: true,
        nativeTransactions: [],
      }
      const appReceipt = {
        appStoreReceipt: '',
        bundleIdentifier: '',
        bundleNumericVersion: 0,
        bundleShortVersion: '',
        bundleSignature: '',
      }
      const iaptic = new CdvPurchase.Iaptic({
        apiKey: '',
        appName: '',
      });
      CdvPurchase.store.validator = iaptic.validator;
      const determiner = iaptic.appStoreDiscountEligibilityDeterminer;
      if (determiner.cacheReceipt) {
        determiner.cacheReceipt(testReceipt);
      }

      // Product with ID 'eligible' is eligible.
      test('eligible to intro period', (done) => {
        determiner(appReceipt, [{
          productId: 'eligible',
          discountId: 'intro',
          discountType: 'Introductory'
        }], (response) => {
          expect(response).toEqual([true]);
          done();
        });
      });

      // Product with ID 'not-eligible' is not eligible.
      test('ineligible to intro period', (done) => {
        determiner(appReceipt, [{
          productId: 'not-eligible',
          discountId: 'intro',
          discountType: 'Introductory'
        }], (response) => {
          expect(response).toEqual([false]);
          done();
        });
      });
    });
  });

  describe('AppleAppStore', () => {

    // Test that the AppStore adapter uses the discountEligibilityDeterminer to remove unavailable discounts
    test('Filter out available products according to the appStoreDiscountEligibilityDeterminer', (done) => {
      let determinerRequests: CdvPurchase.AppleAppStore.DiscountEligibilityRequest[] = [];
      const adapter = new CdvPurchase.AppleAppStore.Adapter({
        verbosity: CdvPurchase.LogLevel.WARNING,
        apiDecorators: {
          canPurchase: (product: CdvPurchase.Product | CdvPurchase.Offer): boolean => true,
          finish: (receipt: CdvPurchase.Receipt | CdvPurchase.Transaction): Promise<void> => new Promise<void>(resolve => resolve()),
          order: (offer: CdvPurchase.Offer, additionalData?: CdvPurchase.AdditionalData): Promise<CdvPurchase.IError | undefined> =>
            new Promise<undefined>(resolve => resolve(undefined)),
          owned: (product: CdvPurchase.Product): boolean => false,
          verify: (receipt: CdvPurchase.Receipt | CdvPurchase.Transaction): Promise<void> => new Promise<void>(resolve => resolve()),
        },
        getApplicationUsername: () => 'user',
        listener: {
          productsUpdated: (platform: CdvPurchase.Platform, products: CdvPurchase.Product[]): void => {},
          receiptsUpdated: (platform: CdvPurchase.Platform, receipts: CdvPurchase.Receipt[]): void => {},
          receiptsReady: (platform: CdvPurchase.Platform): void => {},
        },
        log: new CdvPurchase.Logger({
          verbosity: CdvPurchase.LogLevel.WARNING,
        }),
        error: (error: CdvPurchase.IError) => {},
        registeredProducts: new CdvPurchase.Internal.RegisteredProducts(),
      }, {
        discountEligibilityDeterminer: Object.assign((applicationReceipt: CdvPurchase.AppleAppStore.ApplicationReceipt, requests: CdvPurchase.AppleAppStore.DiscountEligibilityRequest[], callback: (response: boolean[]) => void): void => {
          // console.log('Calling the determiner: ' + JSON.stringify(requests));
          determinerRequests = requests;
          callback(requests.map(r => r.productId === 'eligible'));
        }, {
          cacheReceipt: () => {}
        })
      });
      adapter.bridge.init = (options: Partial<CdvPurchase.AppleAppStore.Bridge.BridgeOptions>, success: () => void, error: (code: CdvPurchase.ErrorCode, message: string) => void): void => {
        success();
      }
      adapter.bridge.canMakePayments = (success: () => void, error: (message: string) => void): void => {
        success();
      }
      adapter.bridge.load = (productIds: string[], success: (validProducts: CdvPurchase.AppleAppStore.Bridge.ValidProduct[], invalidProductIds: string[]) => void, error: (code: CdvPurchase.ErrorCode, message: string) => void): void => {
        success([{
          id: 'eligible',
          countryCode: 'US',
          currency: 'USD',
          description: 'A product eligible for intro price',
          price: '$1.99',
          priceMicros: 1990000,
          title: 'Eligible',
          billingPeriod: 1,
          billingPeriodUnit: 'Month',
          introPrice: '$0.00',
          introPriceMicros: 0,
          introPricePaymentMode: CdvPurchase.PaymentMode.FREE_TRIAL,
          introPricePeriod: 1,
          introPricePeriodUnit: 'Month',
        }, {
          id: 'not-eligible',
          countryCode: 'US',
          currency: 'USD',
          description: 'A product not eligible for intro price',
          price: '$1.99',
          priceMicros: 1990000,
          title: 'Not Eligible',
          billingPeriod: 1,
          billingPeriodUnit: 'Month',
          introPrice: '$0.00',
          introPriceMicros: 0,
          introPricePaymentMode: CdvPurchase.PaymentMode.FREE_TRIAL,
          introPricePeriod: 1,
          introPricePeriodUnit: 'Month',
        }], []);
      }
      adapter.bridge.appStoreReceipt = {
        appStoreReceipt: 'dummy',
        bundleIdentifier: '',
        bundleNumericVersion: 0,
        bundleShortVersion: '',
        bundleSignature: '',
      }
      adapter.initialize().then(() => {
        adapter.loadProducts([{
          id: 'eligible',
          platform: CdvPurchase.Platform.APPLE_APPSTORE,
          type: CdvPurchase.ProductType.PAID_SUBSCRIPTION,
        }, {
          id: 'not-eligible',
          platform: CdvPurchase.Platform.APPLE_APPSTORE,
          type: CdvPurchase.ProductType.PAID_SUBSCRIPTION,
        }])
        .then(results => {
          expect(determinerRequests).toEqual([{
            productId: "eligible",
            discountId: "intro",
            discountType: "Introductory",
          }, {
            productId: "not-eligible",
            discountId: "intro",
            discountType: "Introductory",
          }]);
          expect((results.filter(p => 'id' in p && p.id === 'eligible') as CdvPurchase.Product[])[0].offers[0].pricingPhases.length).toEqual(2);
          expect((results.filter(p => 'id' in p && p.id === 'not-eligible') as CdvPurchase.Product[])[0].offers[0].pricingPhases.length).toEqual(1);
          done();
        });
      });
    })
  });
});
