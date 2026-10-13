import '../www/store';

// StoreKit 2 re-emits finished entitlements (non-consumables, non-renewing
// subscriptions) as "restored" at every launch. The native payload carries
// `isFinished`, surfaced as `transaction.isAcknowledged` (gh #1714).

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

describe('Capacitor bridge: isFinished payload field', () => {
  afterEach(() => { delete (window as any).Capacitor; });

  async function emit(payload: any): Promise<any[]> {
    const listeners: { [event: string]: (data: any) => void } = {};
    (window as any).Capacitor = {
      Plugins: {
        PurchasePlugin: {
          addListener: (event: string, cb: (data: any) => void) => { listeners[event] = cb; },
          init: () => Promise.resolve(),
        },
      },
    };
    const calls: any[][] = [];
    const bridge = new CdvPurchase.AppleAppStore.CapacitorBridge.CapacitorNativeBridge();
    await new Promise<void>((resolve, reject) => bridge.init({
      restored: (...args: any[]) => { calls.push(args); },
    } as any, resolve, (_c, m) => reject(m)));
    listeners['transactionUpdated'](payload);
    return calls;
  }

  test.each([true, false, undefined])('passes isFinished=%s to restored()', async (isFinished) => {
    const calls = await emit({
      state: 'PaymentTransactionStateRestored',
      transactionIdentifier: '1000',
      productId: 'nrs',
      ...(isFinished === undefined ? {} : { isFinished }),
    });
    expect(calls).toHaveLength(1);
    expect(calls[0][0]).toBe('1000');
    expect(calls[0][8]).toBe(isFinished);
  });
});

describe('AppStore adapter: isAcknowledged on SK2 transactions', () => {
  async function setup() {
    const adapter = new CdvPurchase.AppleAppStore.Adapter(makeContext(), {});
    let callbacks: any;
    adapter.bridge.init = (options: any, success: () => void) => { callbacks = options; success(); };
    adapter.bridge.canMakePayments = (success: () => void) => success();
    await adapter.initialize();
    (adapter as any)._receipt = new CdvPurchase.AppleAppStore.SKApplicationReceipt(
      { appStoreReceipt: '', bundleIdentifier: '', bundleShortVersion: '', bundleNumericVersion: 0, bundleSignature: '' },
      false, makeContext().apiDecorators);
    const find = (id: string) => ((adapter as any)._receipt.transactions as CdvPurchase.Transaction[]).find(t => t.transactionId === id);
    return { callbacks, find };
  }

  test('finished entitlement re-emitted at launch is approved and acknowledged', async () => {
    const { callbacks, find } = await setup();
    await callbacks.restored('1000', 'nrs', undefined, undefined, undefined, undefined, undefined, 1, true);
    expect(find('1000')!.state).toBe(CdvPurchase.TransactionState.APPROVED);
    expect(find('1000')!.isAcknowledged).toBe(true);
  });

  test('unfinished transaction is not acknowledged until finished', async () => {
    const { callbacks, find } = await setup();
    await callbacks.restored('1001', 'nrs', undefined, undefined, undefined, undefined, undefined, 1, false);
    expect(find('1001')!.isAcknowledged).toBe(false);
    await callbacks.finished('1001', 'nrs');
    expect(find('1001')!.state).toBe(CdvPurchase.TransactionState.FINISHED);
    expect(find('1001')!.isAcknowledged).toBe(true);
  });

  test('unknown finished state (SK1) leaves isAcknowledged undefined', async () => {
    const { callbacks, find } = await setup();
    await callbacks.restored('1002', 'nrs');
    expect(find('1002')!.isAcknowledged).toBeUndefined();
  });
});
