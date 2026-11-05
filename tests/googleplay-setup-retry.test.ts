import '../www/store';

// A failed Google Play setup (e.g. SERVICE_DISCONNECTED) is retried until the
// Play Store answers, so the store still becomes ready without an app restart.

const noop = () => {};

function makeContext(errors: CdvPurchase.IError[]): any {
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
    error: (error: CdvPurchase.IError) => { errors.push(error); },
    registeredProducts: new CdvPurchase.Internal.RegisteredProducts(),
    storefronts: new CdvPurchase.Internal.Storefronts(new CdvPurchase.Logger({ verbosity: CdvPurchase.LogLevel.QUIET })),
  };
}

describe('GooglePlay adapter: setup retry', () => {
  afterEach(() => { (CdvPurchase.GooglePlay.Adapter as any)._instance = undefined; });

  test('runs the native setup again after a failure', async () => {
    const errors: CdvPurchase.IError[] = [];
    const adapter = new CdvPurchase.GooglePlay.Adapter(makeContext(errors), 0);
    let attempts = 0;
    adapter.bridge.init = (success, fail) => {
      attempts++;
      if (attempts === 1) {
        fail('Setup failure. SERVICE_DISCONNECTED: Service connection is disconnected.', CdvPurchase.ErrorCode.SETUP);
      } else {
        success();
      }
    };
    // Run retries right away instead of after the back-off delay.
    adapter.retry.retry = (fn: Function) => { fn(); };

    await expect(adapter.initialize()).resolves.toBeUndefined();
    expect(attempts).toBe(2);
    expect(errors.map(e => e.code)).toEqual([CdvPurchase.ErrorCode.SETUP]);
  });

  test('does not retry when the Play Store is blocked', async () => {
    const errors: CdvPurchase.IError[] = [];
    const adapter = new CdvPurchase.GooglePlay.Adapter(makeContext(errors), 0);
    let attempts = 0;
    adapter.bridge.init = (_success, fail) => {
      attempts++;
      fail('Play Store is blocked on this device', CdvPurchase.ErrorCode.STORE_BLOCKED);
    };
    adapter.retry.retry = (fn: Function) => { fn(); };

    const result = await adapter.initialize();
    expect(result?.code).toBe(CdvPurchase.ErrorCode.STORE_BLOCKED);
    expect(attempts).toBe(1);
  });
});

describe('Capacitor Google Play bridge: init called again to retry', () => {
  afterEach(() => { delete (window as any).Capacitor; });

  test('listens to the plugin once, with the latest callbacks', async () => {
    const added: string[] = [];
    const listeners: { [event: string]: (data: any) => void } = {};
    (window as any).Capacitor = {
      Plugins: {
        PurchasePlugin: {
          addListener: (event: string, cb: (data: any) => void) => { added.push(event); listeners[event] = cb; },
          init: () => Promise.resolve(),
        },
      },
    };
    const bridge = new CdvPurchase.GooglePlay.Bridge.CapacitorBridge();
    const init = (options: CdvPurchase.GooglePlay.Bridge.Options) =>
      new Promise<void>((resolve, reject) => bridge.init(resolve, message => reject(message), options));

    const first = jest.fn();
    const second = jest.fn();
    await init({ onPurchasesUpdated: first });
    await init({ onPurchasesUpdated: second });

    expect(added.filter(event => event === 'purchasesUpdated')).toHaveLength(1);
    listeners['purchasesUpdated']({ purchases: [] });
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });
});
