import '../www/store';

describe('CDVPurchase', () => {
  test('should be defined', () => {
    expect(window).toBeDefined();
    expect(window.CdvPurchase).toBeDefined();
  });

  describe('Store', () => {
    test('should be defined', () => {
      expect(CdvPurchase.store).toBeDefined();
    });
  });

  describe('Test Platform', () => {
    describe('registerTestProduct', () => {
      // Clear custom test products before each test
      beforeEach(() => {
        // Reset the customTestProducts object
        Object.keys(CdvPurchase.Test.customTestProducts).forEach(key => {
          delete CdvPurchase.Test.customTestProducts[key];
        });
      });

      test('should register a consumable product with minimal config', () => {
        const productId = 'test-minimal-consumable';
        const product = CdvPurchase.Test.registerTestProduct({
          id: productId,
          type: CdvPurchase.ProductType.CONSUMABLE,
          platform: CdvPurchase.Platform.TEST
        });

        // Verify the product was registered
        expect(CdvPurchase.Test.customTestProducts[productId]).toBeDefined();
        expect(product.id).toBe(productId);
        expect(product.type).toBe(CdvPurchase.ProductType.CONSUMABLE);
        
        // Verify metadata was created with default values
        expect(product.customMetadata).toBeDefined();
        expect(product.customMetadata?.title).toBe(`Test ${CdvPurchase.ProductType.CONSUMABLE}`);
        expect(product.customMetadata?.description).toBe(`A test ${CdvPurchase.ProductType.CONSUMABLE} product`);
        expect(product.customMetadata?.offerId).toBe(`${productId}-offer1`);
        expect(product.customMetadata?.pricing).toBeDefined();
      });

      test('should register a product with custom metadata', () => {
        const productId = 'test-custom-metadata';
        const customTitle = 'My Custom Product';
        const customDesc = 'This is a custom product description';
        const customPrice = '$5.99';
        const customCurrency = 'EUR';
        const customPriceMicros = 5990000;
        
        const product = CdvPurchase.Test.registerTestProduct({
          id: productId,
          type: CdvPurchase.ProductType.NON_CONSUMABLE,
          platform: CdvPurchase.Platform.TEST,
          title: customTitle,
          description: customDesc,
          pricing: {
            price: customPrice,
            currency: customCurrency,
            priceMicros: customPriceMicros
          }
        });

        // Verify custom metadata was set correctly
        expect(product.customMetadata?.title).toBe(customTitle);
        expect(product.customMetadata?.description).toBe(customDesc);
        expect(product.customMetadata?.pricing).toEqual({
          price: customPrice,
          currency: customCurrency,
          priceMicros: customPriceMicros
        });
      });

      test('should register a subscription with custom pricing phases', () => {
        const productId = 'test-subscription-phases';
        const pricingPhases = [
          {
            price: '$0.00',
            currency: 'USD',
            priceMicros: 0,
            paymentMode: CdvPurchase.PaymentMode.FREE_TRIAL,
            recurrenceMode: CdvPurchase.RecurrenceMode.FINITE_RECURRING,
            billingCycles: 1,
            billingPeriod: 'P1W'
          },
          {
            price: '$9.99',
            currency: 'USD',
            priceMicros: 9990000,
            paymentMode: CdvPurchase.PaymentMode.PAY_AS_YOU_GO,
            recurrenceMode: CdvPurchase.RecurrenceMode.INFINITE_RECURRING,
            billingPeriod: 'P1M'
          }
        ];
        
        const product = CdvPurchase.Test.registerTestProduct({
          id: productId,
          type: CdvPurchase.ProductType.PAID_SUBSCRIPTION,
          platform: CdvPurchase.Platform.TEST,
          pricing: pricingPhases
        });

        // Verify pricing phases were set correctly
        expect(Array.isArray(product.customMetadata?.pricing)).toBe(true);
        expect(product.customMetadata?.pricing).toEqual(pricingPhases);
      });

      test('should throw error when required fields are missing', () => {
        // Missing ID
        expect(() => {
          CdvPurchase.Test.registerTestProduct({
            id: '',
            type: CdvPurchase.ProductType.CONSUMABLE,
            platform: CdvPurchase.Platform.TEST
          });
        }).toThrow('Product ID is required');

        // Missing type
        expect(() => {
          CdvPurchase.Test.registerTestProduct({
            id: 'test-product',
            platform: CdvPurchase.Platform.TEST,
            type: undefined as any
          });
        }).toThrow('Product type is required');
      });

      test('should verify TestProductMetadata structure', () => {
        const productId = 'test-metadata-structure';
        const product = CdvPurchase.Test.registerTestProduct({
          id: productId,
          type: CdvPurchase.ProductType.CONSUMABLE,
          platform: CdvPurchase.Platform.TEST
        });
        
        // Check the structure of the TestProductMetadata interface
        const metadata = product.customMetadata;
        expect(metadata).toBeDefined();
        
        // Verify the required properties exist
        expect(metadata).toHaveProperty('title');
        expect(metadata).toHaveProperty('description');
        expect(metadata).toHaveProperty('offerId');
        expect(metadata).toHaveProperty('pricing');
        
        // Verify the types of the properties
        expect(typeof metadata?.title).toBe('string');
        expect(typeof metadata?.description).toBe('string');
        expect(typeof metadata?.offerId).toBe('string');
        
        // Pricing can be either an object or an array
        const pricing = metadata?.pricing;
        expect(pricing).toBeDefined();
        
        if (Array.isArray(pricing)) {
          // If it's an array of PricingPhase objects
          expect(pricing.length).toBeGreaterThan(0);
        } else {
          // If it's a simple pricing object
          expect(pricing).toHaveProperty('price');
          expect(pricing).toHaveProperty('currency');
          expect(pricing).toHaveProperty('priceMicros');
        }
      });
    });
  });

  describe('Integration Tests', () => {
    // Reset the store before each test
    beforeEach(() => {
      // Reset any initialized adapters
      if (CdvPurchase.store.getAdapter(CdvPurchase.Platform.TEST)) {
        // @ts-ignore - accessing private property for testing
        CdvPurchase.store.adapters = new CdvPurchase.Internal.Adapters();
        // @ts-ignore - reset the initialized flag
        CdvPurchase.store.initializedHasBeenCalled = false;
      }
    });

    test('should register and load custom test products using store.register', async () => {
      // Define test product parameters
      const productId = 'custom-test-product';
      const customTitle = 'My Store Custom Product';
      const customDesc = 'A product registered through store.register';
      const customPrice = '$3.99';
      const customCurrency = 'USD';
      const customPriceMicros = 3990000;
      
      // Register the custom test product using the public API
      CdvPurchase.store.register({
        id: productId,
        type: CdvPurchase.ProductType.CONSUMABLE,
        platform: CdvPurchase.Platform.TEST,
        title: customTitle,
        description: customDesc,
        pricing: {
          price: customPrice,
          currency: customCurrency,
          priceMicros: customPriceMicros
        }
      });
      
      // Initialize the Test platform
      const errors = await CdvPurchase.store.initialize([CdvPurchase.Platform.TEST]);
      expect(errors.length).toBe(0);
      
      // Wait for the store to be ready
      await new Promise<void>(resolve => {
        CdvPurchase.store.ready(() => resolve());
      });
      
      // Get the product from the store
      const product = CdvPurchase.store.get(productId, CdvPurchase.Platform.TEST);
      
      // Verify the product is available and has the correct properties
      expect(product).toBeDefined();
      expect(product?.id).toBe(productId);
      expect(product?.type).toBe(CdvPurchase.ProductType.CONSUMABLE);
      expect(product?.title).toBe(customTitle);
      expect(product?.description).toBe(customDesc);
      
      // Verify the product has offers
      expect(product?.offers.length).toBeGreaterThan(0);
      
      // Verify the first offer has the correct pricing
      const offer = product?.offers[0];
      expect(offer).toBeDefined();
      expect(offer?.pricingPhases.length).toBeGreaterThan(0);
      
      const pricingPhase = offer?.pricingPhases[0];
      expect(pricingPhase).toBeDefined();
      expect(pricingPhase?.price).toBe(customPrice);
      expect(pricingPhase?.priceMicros).toBe(customPriceMicros);
      expect(pricingPhase?.currency).toBe(customCurrency);
    });

    test('should register and load a subscription with custom pricing phases', async () => {
      // Define a subscription with trial and regular phases
      const productId = 'custom-test-subscription';
      const pricingPhases = [
        {
          price: '$0.00',
          currency: 'USD',
          priceMicros: 0,
          paymentMode: CdvPurchase.PaymentMode.FREE_TRIAL,
          recurrenceMode: CdvPurchase.RecurrenceMode.FINITE_RECURRING,
          billingCycles: 1,
          billingPeriod: 'P1W'
        },
        {
          price: '$7.99',
          currency: 'USD',
          priceMicros: 7990000,
          paymentMode: CdvPurchase.PaymentMode.PAY_AS_YOU_GO,
          recurrenceMode: CdvPurchase.RecurrenceMode.INFINITE_RECURRING,
          billingPeriod: 'P1M'
        }
      ];
      
      // Register the subscription using the public API
      CdvPurchase.store.register({
        id: productId,
        type: CdvPurchase.ProductType.PAID_SUBSCRIPTION,
        platform: CdvPurchase.Platform.TEST,
        title: 'Custom Subscription',
        description: 'A subscription with trial period',
        pricing: pricingPhases
      });
      
      // Initialize the Test platform
      const errors = await CdvPurchase.store.initialize([CdvPurchase.Platform.TEST]);
      expect(errors.length).toBe(0);
      
      // Wait for the store to be ready
      await new Promise<void>(resolve => {
        CdvPurchase.store.ready(() => resolve());
      });
      
      // Get the product from the store
      const product = CdvPurchase.store.get(productId, CdvPurchase.Platform.TEST);
      
      // Verify the product is available
      expect(product).toBeDefined();
      expect(product?.id).toBe(productId);
      expect(product?.type).toBe(CdvPurchase.ProductType.PAID_SUBSCRIPTION);
      
      // Verify the product has offers
      expect(product?.offers.length).toBeGreaterThan(0);
      
      // Verify the offer has the correct pricing phases
      const offer = product?.offers[0];
      expect(offer?.pricingPhases.length).toBe(2);
      
      // Verify the trial phase
      const trialPhase = offer?.pricingPhases[0];
      expect(trialPhase?.price).toBe('$0.00');
      expect(trialPhase?.priceMicros).toBe(0);
      expect(trialPhase?.paymentMode).toBe(CdvPurchase.PaymentMode.FREE_TRIAL);
      expect(trialPhase?.recurrenceMode).toBe(CdvPurchase.RecurrenceMode.FINITE_RECURRING);
      expect(trialPhase?.billingCycles).toBe(1);
      expect(trialPhase?.billingPeriod).toBe('P1W');
      
      // Verify the regular phase
      const regularPhase = offer?.pricingPhases[1];
      expect(regularPhase?.price).toBe('$7.99');
      expect(regularPhase?.priceMicros).toBe(7990000);
      expect(regularPhase?.paymentMode).toBe(CdvPurchase.PaymentMode.PAY_AS_YOU_GO);
      expect(regularPhase?.recurrenceMode).toBe(CdvPurchase.RecurrenceMode.INFINITE_RECURRING);
      expect(regularPhase?.billingPeriod).toBe('P1M');
    });
  });
});
