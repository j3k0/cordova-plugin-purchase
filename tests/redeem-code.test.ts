import '../www/store';

// store.redeemCode() — public offer-code redemption API (FOV-2765).

const noop = () => {};

function makeContext(): any {
  return {
    verbosity: CdvPurchase.LogLevel.QUIET,
    apiDecorators: {
      canPurchase: () => true,
      finish: () => Promise.resolve(),
      order: () => Promise.resolve(undefined),
      owned: () => false,
      verify: () => Promise.resolve(),
    },
    getApplicationUsername: () => 'user',
    obfuscateUsername: (u: string) => u,
    listener: { productsUpdated: noop, receiptsUpdated: noop, receiptsReady: noop },
    log: new CdvPurchase.Logger({ verbosity: CdvPurchase.LogLevel.QUIET }),
    error: noop,
    registeredProducts: new CdvPurchase.Internal.RegisteredProducts(),
    storefronts: new CdvPurchase.Internal.Storefronts(new CdvPurchase.Logger({ verbosity: CdvPurchase.LogLevel.QUIET })),
  };
}

describe('Store.redeemCode()', () => {
  test('without a ready adapter, resolves a SETUP error', async () => {
    const ret = await CdvPurchase.store.redeemCode();
    expect(ret?.code).toBe(CdvPurchase.ErrorCode.SETUP);
    expect(ret?.message).toContain('redeemCode');
  });
});

describe('AppStore adapter: redeemCode()', () => {

  async function makeAdapter() {
    const adapter = new CdvPurchase.AppleAppStore.Adapter(makeContext(), {});
    adapter.bridge.init = (options: any, success: () => void) => success();
    adapter.bridge.canMakePayments = (success: () => void) => success();
    adapter.bridge.loadReceipts = (success: any) => success({ appStoreReceipt: 'receipt' });
    await adapter.initialize();
    return adapter;
  }

  test('checkSupport("redeemCode") is true wherever the sheet can open', async () => {
    expect((await makeAdapter()).checkSupport('redeemCode')).toBe(true);
  });

  test('resolves undefined on success and forwards options to the bridge', async () => {
    const adapter = await makeAdapter();
    const calls: any[][] = [];
    adapter.bridge.redeemCode = (options: string[], success: () => void) => { calls.push(options); success(); };
    expect(await adapter.redeemCode([])).toBeUndefined();
    expect(await adapter.redeemCode(['future-option'])).toBeUndefined();
    expect(calls).toEqual([[], ['future-option']]);
  });

  test('resolves an IError with the native code and message on failure', async () => {
    const adapter = await makeAdapter();
    adapter.bridge.redeemCode = (_options: string[], _success: () => void, error: any) =>
      error(CdvPurchase.ErrorCode.PAYMENT_CANCELLED, 'userCancelled');
    const ret = await adapter.redeemCode([]);
    expect(ret?.code).toBe(CdvPurchase.ErrorCode.PAYMENT_CANCELLED);
    expect(ret?.message).toBe('userCancelled');
  });

  test('deprecated presentCodeRedemptionSheet() resolves and ignores the result', async () => {
    const adapter = await makeAdapter();
    adapter.bridge.redeemCode = (_options: string[], _success: () => void, error: any) =>
      error(CdvPurchase.ErrorCode.UNKNOWN, 'failed');
    await expect(adapter.presentCodeRedemptionSheet()).resolves.toBeUndefined();
  });
});

describe('SK1 bridge: redeemCode()', () => {
  afterEach(() => { delete (window as any).cordova; });

  test('presents the sheet fire-and-forget and resolves', async () => {
    const methods: string[] = [];
    (window as any).cordova = {
      exec: (success: any, _error: any, _service: string, method: string) => {
        methods.push(method);
        success();
      },
    };
    const bridge = new CdvPurchase.AppleAppStore.Bridge.Bridge();
    await new Promise<void>(resolve => bridge.redeemCode([], resolve, noop));
    expect(methods).toEqual(['presentCodeRedemptionSheet']);
  });
});

describe('SK2 bridge: redeemCode()', () => {
  afterEach(() => { delete (window as any).cordova; });

  function makeSK2Bridge(failWith?: any) {
    const execs: { service: string, method: string, args: any[] }[] = [];
    (window as any).cordova = {
      exec: (success: any, error: any, service: string, method: string, args: any[]) => {
        execs.push({ service, method, args });
        if (failWith) error(failWith);
        else success();
      },
    };
    return { bridge: new CdvPurchase.AppleAppStore.SK2Bridge.SK2NativeBridge(), execs };
  }

  test('execs the native redeemCode with the options', async () => {
    const { bridge, execs } = makeSK2Bridge();
    await new Promise<void>(resolve => bridge.redeemCode(['opt'], resolve, noop));
    expect(execs[0].service).toBe('StoreKit2Plugin');
    expect(execs[0].method).toBe('redeemCode');
    expect(execs[0].args).toEqual([['opt']]);
  });

  test('maps a native [code, message] failure to the error callback', async () => {
    const { bridge } = makeSK2Bridge([CdvPurchase.ErrorCode.PAYMENT_CANCELLED, 'userCancelled']);
    const ret = await new Promise<any>(resolve =>
      bridge.redeemCode([], noop, (code: number, message: string) => resolve({ code, message })));
    expect(ret).toEqual({
      code: CdvPurchase.ErrorCode.PAYMENT_CANCELLED,
      message: 'userCancelled',
    });
  });

  test('a non-array native failure maps to UNKNOWN', async () => {
    const { bridge } = makeSK2Bridge('something went wrong');
    const ret = await new Promise<any>(resolve =>
      bridge.redeemCode([], noop, (code: number, message: string) => resolve({ code, message })));
    expect(ret.code).toBe(CdvPurchase.ErrorCode.UNKNOWN);
    expect(ret.message).toBe('something went wrong');
  });
});

describe('Capacitor bridge: redeemCode()', () => {
  afterEach(() => { delete (window as any).Capacitor; });

  function makeCapacitorBridge(native: any) {
    (window as any).Capacitor = { Plugins: { PurchasePlugin: native } };
    return new CdvPurchase.AppleAppStore.CapacitorBridge.CapacitorNativeBridge();
  }

  test('resolves on native success, forwards options', async () => {
    const calls: any[] = [];
    const bridge = makeCapacitorBridge({
      redeemCode: (options: any) => { calls.push(options); return Promise.resolve(); },
    });
    await new Promise<void>(resolve => bridge.redeemCode(['opt'], resolve, noop));
    expect(calls).toEqual([{ options: ['opt'] }]);
  });

  test('a native rejection with a stringified code maps to the error callback', async () => {
    const bridge = makeCapacitorBridge({
      redeemCode: () => Promise.reject({ code: String(CdvPurchase.ErrorCode.PAYMENT_CANCELLED), message: 'userCancelled' }),
    });
    const ret = await new Promise<any>(resolve =>
      bridge.redeemCode([], noop, (code: number, message: string) => resolve({ code, message })));
    expect(ret).toEqual({ code: CdvPurchase.ErrorCode.PAYMENT_CANCELLED, message: 'userCancelled' });
  });

  test('a native rejection without a code maps to UNKNOWN', async () => {
    const bridge = makeCapacitorBridge({
      redeemCode: () => Promise.reject({ message: 'boom' }),
    });
    const ret = await new Promise<any>(resolve =>
      bridge.redeemCode([], noop, (code: number, message: string) => resolve({ code, message })));
    expect(ret).toEqual({ code: CdvPurchase.ErrorCode.UNKNOWN, message: 'boom' });
  });
});
