import '../www/store';

// A failed initialization must not look like a success (GitHub #1720, #1721):
// - an adapter whose initialize() returns an error is not marked ready;
// - a second store.initialize() returns the result of the first call, not [].

const noop = () => {};
const FAILING = 'failing-test-platform' as CdvPurchase.Platform;
const SLOW = 'slow-test-platform' as CdvPurchase.Platform;

function makeContext(errors: CdvPurchase.IError[] = []): any {
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

const setupError = () => CdvPurchase.storeError(CdvPurchase.ErrorCode.SETUP, 'Setup failed', FAILING, null);

let initializeCalls = 0;

class FailingAdapter extends CdvPurchase.Test.Adapter {
  id = FAILING;
  name = 'Failing';
  async initialize(): Promise<CdvPurchase.IError | undefined> {
    initializeCalls++;
    return setupError();
  }
}

let resolveSlow: () => void = noop;

class SlowAdapter extends CdvPurchase.Test.Adapter {
  id = SLOW;
  name = 'Slow';
  initialize(): Promise<CdvPurchase.IError | undefined> {
    initializeCalls++;
    return new Promise(resolve => { resolveSlow = () => resolve(setupError()); });
  }
}

CdvPurchase.Internal.Adapters.registerAdapter(FAILING, context => new FailingAdapter(context));
CdvPurchase.Internal.Adapters.registerAdapter(SLOW, context => new SlowAdapter(context));

describe('Adapters.initialize: ready state', () => {

  test('an adapter that fails to initialize is not ready', async () => {
    const adapters = new CdvPurchase.Internal.Adapters();
    const errors = await adapters.initialize([FAILING], makeContext());
    expect(errors.map(e => e.code)).toEqual([CdvPurchase.ErrorCode.SETUP]);
    expect(adapters.find(FAILING)?.ready).toBe(false);
    expect(adapters.findReady(FAILING)).toBeUndefined();
    expect(adapters.findReady()).toBeUndefined();
  });

  test('an adapter that initializes is ready', async () => {
    const adapters = new CdvPurchase.Internal.Adapters();
    const errors = await adapters.initialize([CdvPurchase.Platform.TEST], makeContext());
    expect(errors).toEqual([]);
    expect(adapters.find(CdvPurchase.Platform.TEST)?.ready).toBe(true);
  });

  test('a failed adapter does not hide a ready one', async () => {
    const adapters = new CdvPurchase.Internal.Adapters();
    const errors = await adapters.initialize([FAILING, CdvPurchase.Platform.TEST], makeContext());
    expect(errors.length).toBe(1);
    expect(adapters.findReady()?.id).toBe(CdvPurchase.Platform.TEST);
  });

  describe('Google Play', () => {
    const originalCordova = (window as any).cordova;
    const bridge = CdvPurchase.GooglePlay.Bridge.Bridge.prototype as any;
    const originalInit = bridge.init;
    const originalGetStorefront = bridge.getStorefront;
    const originalRetry = CdvPurchase.Internal.Retry.prototype.retry;

    beforeEach(() => {
      (window as any).cordova = { platformId: 'android' };
      bridge.getStorefront = (success: (code: string) => void) => success('US');
      // Run retries right away instead of after the back-off delay.
      CdvPurchase.Internal.Retry.prototype.retry = function (fn: Function) { fn(); } as any;
    });

    afterEach(() => {
      (window as any).cordova = originalCordova;
      bridge.init = originalInit;
      bridge.getStorefront = originalGetStorefront;
      CdvPurchase.Internal.Retry.prototype.retry = originalRetry;
      (CdvPurchase.GooglePlay.Adapter as any)._instance = undefined;
    });

    test('is ready once a retried setup succeeds (#1745)', async () => {
      let attempts = 0;
      bridge.init = (success: () => void, fail: (msg: string, code?: number) => void) => {
        attempts++;
        if (attempts === 1) fail('SERVICE_DISCONNECTED', CdvPurchase.ErrorCode.SETUP);
        else success();
      };
      const adapters = new CdvPurchase.Internal.Adapters();
      const errors = await adapters.initialize([CdvPurchase.Platform.GOOGLE_PLAY], makeContext());
      expect(attempts).toBe(2);
      expect(errors).toEqual([]);
      expect(adapters.find(CdvPurchase.Platform.GOOGLE_PLAY)?.ready).toBe(true);
    });

    test('is not ready when the Play Store is blocked', async () => {
      bridge.init = (_success: () => void, fail: (msg: string, code?: number) => void) => {
        fail('blocked', CdvPurchase.ErrorCode.STORE_BLOCKED);
      };
      const adapters = new CdvPurchase.Internal.Adapters();
      const errors = await adapters.initialize([CdvPurchase.Platform.GOOGLE_PLAY], makeContext());
      expect(errors.map(e => e.code)).toEqual([CdvPurchase.ErrorCode.STORE_BLOCKED]);
      expect(adapters.find(CdvPurchase.Platform.GOOGLE_PLAY)?.ready).toBe(false);
    });
  });
});

describe('store.initialize() called twice', () => {

  beforeEach(() => {
    initializeCalls = 0;
    // @ts-ignore - reset the store between tests
    CdvPurchase.store.adapters = new CdvPurchase.Internal.Adapters();
    // @ts-ignore
    CdvPurchase.store.initializePromise = undefined;
  });

  test('returns the errors of the first call, without initializing again', async () => {
    const first = await CdvPurchase.store.initialize([FAILING]);
    const second = await CdvPurchase.store.initialize([FAILING]);
    expect(first.map(e => e.code)).toEqual([CdvPurchase.ErrorCode.SETUP]);
    expect(second).toEqual(first);
    expect(initializeCalls).toBe(1);
  });

  test('returns an empty list after a successful first call', async () => {
    expect(await CdvPurchase.store.initialize([CdvPurchase.Platform.TEST])).toEqual([]);
    expect(await CdvPurchase.store.initialize([CdvPurchase.Platform.TEST])).toEqual([]);
  });

  test('waits for the first call when it is still running', async () => {
    const first = CdvPurchase.store.initialize([SLOW]);
    let secondResult: CdvPurchase.IError[] | undefined;
    const second = CdvPurchase.store.initialize([SLOW]).then(r => secondResult = r);
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(secondResult).toBeUndefined();
    resolveSlow();
    await second;
    expect(secondResult).toEqual(await first);
    expect(secondResult?.map(e => e.code)).toEqual([CdvPurchase.ErrorCode.SETUP]);
    expect(initializeCalls).toBe(1);
  });
});
