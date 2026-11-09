import '../www/store';

describe('CDVPurchase', () => {

  describe('Iaptic', () => {
    // Check that iaptic correctly parses the ineligible_for_intro_price array from validation response
    describe('appStoreDiscountEligibilityDeterminer', () => {
      const testReceipt: CdvPurchase.VerifiedReceipt = {
        className: 'VerifiedReceipt',
        validationDate: new Date(),
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

    describe('SKProduct.getOffer()', () => {
      const noOpDecorators = {
        canPurchase: (product: CdvPurchase.Product | CdvPurchase.Offer): boolean => true,
        finish: (receipt: CdvPurchase.Receipt | CdvPurchase.Transaction): Promise<void> => new Promise<void>(resolve => resolve()),
        order: (offer: CdvPurchase.Offer, additionalData?: CdvPurchase.AdditionalData): Promise<CdvPurchase.IError | undefined> =>
          new Promise<undefined>(resolve => resolve(undefined)),
        owned: (product: CdvPurchase.Product): boolean => false,
        verify: (receipt: CdvPurchase.Receipt | CdvPurchase.Transaction): Promise<void> => new Promise<void>(resolve => resolve()),
      };

      const alwaysEligible: CdvPurchase.AppleAppStore.Internal.IDiscountEligibilities = {
        isEligible: () => true,
      };

      test('getOffer() returns the default offer when discount offers exist', () => {
        const validProduct: CdvPurchase.AppleAppStore.Bridge.ValidProduct = {
          id: 'com.test.sub',
          countryCode: 'US',
          currency: 'USD',
          description: 'Test subscription',
          price: '$9.99',
          priceMicros: 9990000,
          title: 'Test Sub',
          billingPeriod: 1,
          billingPeriodUnit: 'Month',
          discounts: [{
            id: 'summer-sale',
            type: 'Subscription' as CdvPurchase.AppleAppStore.DiscountType,
            price: '$4.99',
            priceMicros: 4990000,
            period: 1,
            periodUnit: 'Month',
            paymentMode: CdvPurchase.PaymentMode.PAY_AS_YOU_GO,
          }],
        };

        const product = new CdvPurchase.AppleAppStore.SKProduct(
          validProduct,
          { id: 'com.test.sub', platform: CdvPurchase.Platform.APPLE_APPSTORE, type: CdvPurchase.ProductType.PAID_SUBSCRIPTION },
          noOpDecorators,
          alwaysEligible,
        );

        // getOffer() with no args should return the default offer (id '$'), not the discount offer
        const defaultOffer = product.getOffer();
        expect(defaultOffer).toBeDefined();
        expect(defaultOffer!.id).toBe('$');

        // The discount offer should still be accessible by id
        const discountOffer = product.getOffer('summer-sale');
        expect(discountOffer).toBeDefined();
        expect(discountOffer!.id).toBe('summer-sale');

        // Default offer should be at index 0 of offers array
        expect(product.offers[0].id).toBe('$');
      });

      test('getOffer() returns default offer when product has no discounts', () => {
        const validProduct: CdvPurchase.AppleAppStore.Bridge.ValidProduct = {
          id: 'com.test.sub2',
          countryCode: 'US',
          currency: 'USD',
          description: 'Test subscription',
          price: '$9.99',
          priceMicros: 9990000,
          title: 'Test Sub 2',
          billingPeriod: 1,
          billingPeriodUnit: 'Month',
        };

        const product = new CdvPurchase.AppleAppStore.SKProduct(
          validProduct,
          { id: 'com.test.sub2', platform: CdvPurchase.Platform.APPLE_APPSTORE, type: CdvPurchase.ProductType.PAID_SUBSCRIPTION },
          noOpDecorators,
          alwaysEligible,
        );

        const defaultOffer = product.getOffer();
        expect(defaultOffer).toBeDefined();
        expect(defaultOffer!.id).toBe('$');
      });
    });

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
        obfuscateUsername: (username: string, platform: CdvPurchase.Platform) => username,
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
        storefronts: new CdvPurchase.Internal.Storefronts(new CdvPurchase.Logger({ verbosity: CdvPurchase.LogLevel.WARNING })),
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

    // The Braintree token request must carry the username of the store given to Iaptic, not the global one.
    describe('braintreeClientTokenProvider', () => {
      test('uses the username of the store given to the constructor', () => {
        const sent: string[] = [];
        const OriginalXHR = (window as any).XMLHttpRequest;
        const originalUsername = CdvPurchase.store.applicationUsername;
        (window as any).XMLHttpRequest = class {
          open() {}
          setRequestHeader() {}
          send(body?: string) { sent.push(body ?? ''); }
        };
        try {
          CdvPurchase.store.applicationUsername = 'global-user';
          const otherStore = new CdvPurchase.Store();
          otherStore.applicationUsername = 'other-user';
          const iaptic = new CdvPurchase.Iaptic({ apiKey: 'k', appName: 'a' }, otherStore);
          iaptic.braintreeClientTokenProvider(() => {});
          expect(sent.length).toBe(1);
          expect(JSON.parse(sent[0]).applicationUsername).toBe('other-user');
        } finally {
          (window as any).XMLHttpRequest = OriginalXHR;
          CdvPurchase.store.applicationUsername = originalUsername;
        }
      });

      test('reads the username when the token is requested, not when Iaptic is created', () => {
        const sent: string[] = [];
        const OriginalXHR = (window as any).XMLHttpRequest;
        (window as any).XMLHttpRequest = class {
          open() {}
          setRequestHeader() {}
          send(body?: string) { sent.push(body ?? ''); }
        };
        try {
          let user = 'before';
          const otherStore = new CdvPurchase.Store();
          otherStore.applicationUsername = () => user;
          const iaptic = new CdvPurchase.Iaptic({ apiKey: 'k', appName: 'a' }, otherStore);
          user = 'after';
          iaptic.braintreeClientTokenProvider(() => {});
          expect(sent.length).toBe(1);
          expect(JSON.parse(sent[0]).applicationUsername).toBe('after');
        } finally {
          (window as any).XMLHttpRequest = OriginalXHR;
        }
      });

      test('encodes appName and apiKey in the URL', () => {
        const urls: string[] = [];
        const OriginalXHR = (window as any).XMLHttpRequest;
        (window as any).XMLHttpRequest = class {
          open(_method: string, url: string) { urls.push(url); }
          setRequestHeader() {}
          send() {}
        };
        try {
          const iaptic = new CdvPurchase.Iaptic({ apiKey: 'k&x=1', appName: 'my app' }, new CdvPurchase.Store());
          iaptic.braintreeClientTokenProvider(() => {});
          expect(urls[0]).toContain('appName=my%20app&apiKey=k%26x%3D1');
        } finally {
          (window as any).XMLHttpRequest = OriginalXHR;
        }
      });
    });

    // gh #1751: the Braintree customer ID must not leak from one application username to another.
    describe('Braintree customerId', () => {
      const Braintree = CdvPurchase.Braintree;

      /** Response of the validator for a Braintree transaction made by the given customer */
      function validationResponse(customerId: string): CdvPurchase.Validator.Response.Payload {
        return {
          ok: true,
          data: {
            id: 'x',
            latest_receipt: true,
            transaction: { type: 'braintree', data: { transaction: { customer: { id: customerId } } } },
          },
        } as unknown as CdvPurchase.Validator.Response.Payload;
      }

      /** Create a Braintree adapter for the given store, and a function to feed it validation responses */
      function makeAdapter(store: CdvPurchase.Store) {
        const adapter = new Braintree.Adapter({
          log: new CdvPurchase.Logger({ verbosity: CdvPurchase.LogLevel.QUIET }),
          getApplicationUsername: () => store.getApplicationUsername(),
        } as unknown as CdvPurchase.Internal.AdapterContext, {});
        return (customerId: string) =>
          adapter.handleReceiptValidationResponse({} as CdvPurchase.Receipt, validationResponse(customerId));
      }

      /** Request a client token and return the customerId that was sent to iaptic */
      function sentCustomerId(store: CdvPurchase.Store): string | undefined {
        const sent: string[] = [];
        const OriginalXHR = (window as any).XMLHttpRequest;
        (window as any).XMLHttpRequest = class {
          open() {}
          setRequestHeader() {}
          send(body?: string) { sent.push(body ?? ''); }
        };
        try {
          new CdvPurchase.Iaptic({ apiKey: 'k', appName: 'a' }, store).braintreeClientTokenProvider(() => {});
          return JSON.parse(sent[0]).customerId;
        } finally {
          (window as any).XMLHttpRequest = OriginalXHR;
        }
      }

      beforeEach(() => {
        Braintree.resetCapturedCustomerIds();
        Braintree.customerId = undefined;
      });
      afterAll(() => {
        Braintree.resetCapturedCustomerIds();
        Braintree.customerId = undefined;
      });

      test('is sent for the user it was captured for', async () => {
        const store = new CdvPurchase.Store();
        store.applicationUsername = 'alice';
        await makeAdapter(store)('cust-alice');
        expect(sentCustomerId(store)).toBe('cust-alice');
        expect(Braintree.customerId).toBe('cust-alice');
      });

      test('is not sent after the application username changes', async () => {
        const store = new CdvPurchase.Store();
        store.applicationUsername = 'alice';
        await makeAdapter(store)('cust-alice');
        store.applicationUsername = 'bob';
        expect(sentCustomerId(store)).toBeUndefined();
        store.applicationUsername = undefined;
        expect(sentCustomerId(store)).toBeUndefined();
      });

      test('is kept per user', async () => {
        const store = new CdvPurchase.Store();
        const validated = makeAdapter(store);
        store.applicationUsername = 'alice';
        await validated('cust-alice');
        store.applicationUsername = 'bob';
        await validated('cust-bob');
        expect(sentCustomerId(store)).toBe('cust-bob');
        store.applicationUsername = 'alice';
        expect(sentCustomerId(store)).toBe('cust-alice');
      });

      test('is replaced by a newer value for the same user', async () => {
        const store = new CdvPurchase.Store();
        store.applicationUsername = 'alice';
        const validated = makeAdapter(store);
        await validated('cust-old');
        await validated('cust-new');
        expect(sentCustomerId(store)).toBe('cust-new');
        expect(Braintree.customerId).toBe('cust-new');
      });

      test('a value set by the app is sent as-is and not overwritten', async () => {
        const store = new CdvPurchase.Store();
        store.applicationUsername = 'alice';
        Braintree.customerId = 'manual';
        await makeAdapter(store)('cust-alice');
        expect(Braintree.customerId).toBe('manual');
        store.applicationUsername = 'bob';
        expect(sentCustomerId(store)).toBe('manual');
        // once the app clears it, captured values are used again
        Braintree.customerId = undefined;
        store.applicationUsername = 'alice';
        expect(sentCustomerId(store)).toBe('cust-alice');
      });
    });
  });
});
