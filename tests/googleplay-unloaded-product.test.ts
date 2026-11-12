import '../www/store';

// Google Play doesn't return inactive products when the plugin loads them, but users who
// bought them keep renewing (#1729). Their purchases must still be validated and finished,
// using the product type from store.register().

const noop = () => {};

function makeContext(registered: CdvPurchase.IRegisterProduct[]): any {
  const registeredProducts = new CdvPurchase.Internal.RegisteredProducts();
  registeredProducts.add(registered);
  return {
    verbosity: CdvPurchase.LogLevel.QUIET,
    apiDecorators: {
      canPurchase: () => true,
      finish: () => Promise.resolve(),
      order: () => Promise.resolve(undefined),
      owned: () => false,
      verify: () => Promise.resolve(),
    },
    getApplicationUsername: () => undefined,
    obfuscateUsername: (u: string) => u,
    listener: { productsUpdated: noop, receiptsUpdated: noop, receiptsReady: noop },
    log: new CdvPurchase.Logger({ verbosity: CdvPurchase.LogLevel.QUIET }),
    error: noop,
    registeredProducts,
    storefronts: new CdvPurchase.Internal.Storefronts(new CdvPurchase.Logger({ verbosity: CdvPurchase.LogLevel.QUIET })),
  };
}

function makePurchase(productId: string, acknowledged: boolean): CdvPurchase.GooglePlay.Bridge.Purchase {
  return {
    orderId: 'GPA.0000-0000-0000-00000',
    packageName: 'com.example.app',
    productId,
    productIds: [productId],
    purchaseTime: 1700000000000,
    purchaseToken: 'test-purchase-token',
    signature: 'test-signature',
    receipt: '{}',
    getPurchaseState: CdvPurchase.GooglePlay.Bridge.PurchaseState.PURCHASED,
    acknowledged,
    autoRenewing: true,
    developerPayload: '',
    accountId: '',
    profileId: '',
    quantity: 1,
  } as unknown as CdvPurchase.GooglePlay.Bridge.Purchase;
}

const legacySub: CdvPurchase.IRegisterProduct = {
  id: 'legacy_sub',
  type: CdvPurchase.ProductType.PAID_SUBSCRIPTION,
  platform: CdvPurchase.Platform.GOOGLE_PLAY,
};

describe('GooglePlay adapter: purchases of products Google Play did not return', () => {
  afterEach(() => { (CdvPurchase.GooglePlay.Adapter as any)._instance = undefined; });

  test('builds the validation request from the registered product', async () => {
    const adapter = new CdvPurchase.GooglePlay.Adapter(makeContext([legacySub]), 0);
    adapter.onPurchasesUpdated([makePurchase('legacy_sub', true)]);
    const body = await adapter.receiptValidationBody(adapter.receipts[0]);
    expect(body?.id).toBe('legacy_sub');
    expect(body?.type).toBe(CdvPurchase.ProductType.PAID_SUBSCRIPTION);
    expect(body?.transaction).toMatchObject({
      type: CdvPurchase.Platform.GOOGLE_PLAY,
      purchaseToken: 'test-purchase-token',
    });
  });

  test('returns no request body when the product is not registered either', async () => {
    const adapter = new CdvPurchase.GooglePlay.Adapter(makeContext([]), 0);
    adapter.onPurchasesUpdated([makePurchase('unknown_sub', true)]);
    await expect(adapter.receiptValidationBody(adapter.receipts[0])).resolves.toBeUndefined();
  });

  test('finishes the purchase using the registered product type', async () => {
    const adapter = new CdvPurchase.GooglePlay.Adapter(makeContext([legacySub]), 0);
    adapter.onPurchasesUpdated([makePurchase('legacy_sub', false)]);
    const acknowledged: string[] = [];
    adapter.bridge.acknowledgePurchase = (success: () => void, _fail: any, token: string) => {
      acknowledged.push(token);
      success();
    };
    adapter.bridge.consumePurchase = () => { throw new Error('a subscription must not be consumed'); };
    await expect(adapter.finish(adapter.receipts[0].transactions[0])).resolves.toBeUndefined();
    expect(acknowledged).toEqual(['test-purchase-token']);
  });
});

describe('Validator: no request body', () => {
  test('emits a transient "unverified" instead of failing silently', async () => {
    const logger = new CdvPurchase.Logger({ verbosity: CdvPurchase.LogLevel.QUIET });
    const adapter = {
      id: CdvPurchase.Platform.GOOGLE_PLAY,
      receiptValidationBody: async () => undefined,
      handleReceiptValidationResponse: async () => {},
    } as unknown as CdvPurchase.Adapter;
    const verifiedCallbacks = new CdvPurchase.Internal.Callbacks<CdvPurchase.VerifiedReceipt>(logger, 'verified');
    const unverifiedCallbacks = new CdvPurchase.Internal.Callbacks<CdvPurchase.UnverifiedReceipt>(logger, 'unverified');
    const unverified: CdvPurchase.UnverifiedReceipt[] = [];
    unverifiedCallbacks.push(u => unverified.push(u));
    let ajaxCalls = 0;
    const originalAjax = CdvPurchase.Utils.ajax;
    (CdvPurchase.Utils as any).ajax = () => { ajaxCalls++; return { done: noop }; };

    try {
      const validator = new CdvPurchase.Internal.Validator({
        validator: 'https://example.test/validate',
        localReceipts: [],
        adapters: { find: () => adapter } as unknown as CdvPurchase.Internal.Adapters,
        validator_privacy_policy: undefined,
        getApplicationUsername: () => undefined,
        obfuscateUsername: () => undefined,
        verifiedCallbacks,
        unverifiedCallbacks,
        finish: async () => {},
      }, logger);
      validator.add(new CdvPurchase.Receipt(CdvPurchase.Platform.GOOGLE_PLAY, {
        verify: async () => {},
        finish: async () => {},
      }));
      validator.run();
      await new Promise(r => setTimeout(r, 10));

      expect(ajaxCalls).toBe(0);
      expect(unverified).toHaveLength(1);
      expect(unverified[0].payload.code).toBe(CdvPurchase.ErrorCode.VERIFICATION_FAILED);
      expect(unverified[0].transient).toBe(true);
      expect(validator.numResponses).toBe(validator.numRequests);
    } finally {
      (CdvPurchase.Utils as any).ajax = originalAjax;
    }
  });
});
