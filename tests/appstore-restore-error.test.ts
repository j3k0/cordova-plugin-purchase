import '../www/store';

// A failed restore reports the native error code and message (gh #1726).

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

describe('Capacitor bridge: restoreFailed payload', () => {
  afterEach(() => { delete (window as any).Capacitor; });

  test('passes errorCode and errorMessage to restoreFailed()', async () => {
    const listeners: { [event: string]: (data: any) => void } = {};
    (window as any).Capacitor = {
      Plugins: {
        PurchasePlugin: {
          addListener: (event: string, cb: (data: any) => void) => { listeners[event] = cb; },
          init: () => Promise.resolve(),
          restore: () => new Promise(noop),
        },
      },
    };
    const calls: any[][] = [];
    const bridge = new CdvPurchase.AppleAppStore.CapacitorBridge.CapacitorNativeBridge();
    await new Promise<void>((resolve, reject) => bridge.init({
      restoreFailed: (...args: any[]) => { calls.push(args); },
    } as any, resolve, (_c, m) => reject(m)));
    bridge.restore();
    listeners['restoreFailed']({ errorCode: CdvPurchase.ErrorCode.PAYMENT_CANCELLED, errorMessage: 'cancelled' });
    expect(calls).toEqual([[CdvPurchase.ErrorCode.PAYMENT_CANCELLED, 'cancelled']]);
  });
});

describe('AppStore adapter: restorePurchases() error', () => {
  async function restoreWith(fail: (callbacks: any) => void) {
    const adapter = new CdvPurchase.AppleAppStore.Adapter(makeContext(), {});
    let callbacks: any;
    adapter.bridge.init = (options: any, success: () => void) => { callbacks = options; success(); };
    adapter.bridge.canMakePayments = (success: () => void) => success();
    adapter.bridge.refreshReceipts = (success: any) => success();
    adapter.bridge.restore = () => fail(callbacks);
    await adapter.initialize();
    return adapter.restorePurchases();
  }

  test('user cancel comes back as PAYMENT_CANCELLED with the native message', async () => {
    const err = await restoreWith(cb => cb.restoreFailed(CdvPurchase.ErrorCode.PAYMENT_CANCELLED, 'cancelled'));
    expect(err?.code).toBe(CdvPurchase.ErrorCode.PAYMENT_CANCELLED);
    expect(err?.message).toBe('Restore purchases failed: cancelled');
  });

  test('without a native message, keeps the generic message', async () => {
    const err = await restoreWith(cb => cb.restoreFailed(CdvPurchase.ErrorCode.UNKNOWN));
    expect(err?.code).toBe(CdvPurchase.ErrorCode.UNKNOWN);
    expect(err?.message).toBe('Restore purchases failed');
  });
});
