import '../www/store';

// These tests drive Validator end-to-end through runValidatorRequest with a
// stubbed Utils.ajax. They exercise the isValidatorResponsePayload guard via
// its only caller, so the helper can stay module-private.

function makeLogger(): CdvPurchase.Logger {
  const noop = () => {};
  return {
    verbosity: CdvPurchase.LogLevel.QUIET,
    error: noop,
    warn: noop,
    info: noop,
    debug: noop,
    child: () => makeLogger(),
    logger: { log: noop },
  } as unknown as CdvPurchase.Logger;
}

function makeAdapter(platform: CdvPurchase.Platform): CdvPurchase.Adapter {
  return {
    id: platform,
    name: `adapter-${platform}`,
    ready: true,
    products: [],
    receipts: [],
    isSupported: true,
    receiptValidationBody: async () => ({
      id: 'com.test.product',
      type: CdvPurchase.ProductType.CONSUMABLE,
      transaction: { type: 'test', id: 't1' },
    }),
    handleReceiptValidationResponse: async () => {},
  } as unknown as CdvPurchase.Adapter;
}

function makeReceipt(platform: CdvPurchase.Platform): CdvPurchase.Receipt {
  return new CdvPurchase.Receipt(platform, {
    verify: async () => {},
    finish: async () => {},
  });
}

interface RunResult {
  verified: CdvPurchase.VerifiedReceipt[];
  unverified: { receipt: CdvPurchase.Receipt; payload: CdvPurchase.Validator.Response.Payload }[];
}

async function runValidator(payload: unknown): Promise<RunResult> {
  const platform = CdvPurchase.Platform.GOOGLE_PLAY;
  const adapter = makeAdapter(platform);
  const verifiedCallbacks = new CdvPurchase.Internal.Callbacks<CdvPurchase.VerifiedReceipt>(makeLogger(), 'verified');
  const unverifiedCallbacks = new CdvPurchase.Internal.Callbacks<CdvPurchase.UnverifiedReceipt>(makeLogger(), 'unverified');

  const verified: CdvPurchase.VerifiedReceipt[] = [];
  const unverified: { receipt: CdvPurchase.Receipt; payload: CdvPurchase.Validator.Response.Payload }[] = [];
  verifiedCallbacks.push(vr => { verified.push(vr); }, 'recorder');
  unverifiedCallbacks.push(uv => { unverified.push(uv); }, 'recorder');

  const controller: CdvPurchase.Internal.ValidatorController = {
    validator: 'https://example.test/validate',
    localReceipts: [],
    adapters: { find: () => adapter } as unknown as CdvPurchase.Internal.Adapters,
    validator_privacy_policy: undefined,
    getApplicationUsername: () => undefined,
    obfuscateUsername: (_applicationUsername: string, _platform: CdvPurchase.Platform) => undefined,
    verifiedCallbacks,
    unverifiedCallbacks,
    finish: async () => {},
  };

  const originalAjax = CdvPurchase.Utils.ajax;
  (CdvPurchase.Utils as any).ajax = (_log: CdvPurchase.Logger, opts: any) => {
    setTimeout(() => opts.success(payload), 0);
    return { done: () => {} };
  };

  try {
    const validator = new CdvPurchase.Internal.Validator(controller, makeLogger());
    validator.maxAttempts = 1; // retries are covered in validator-transient.test.ts
    const receipt = makeReceipt(platform);
    validator.add(receipt);
    validator.run();

    // Flush the async buildRequestBody chain and the setTimeout(0) ajax callback.
    // The Validator.run() → buildRequestBody → ajax → success → onResponse →
    // handleReceiptValidationResponse chain has multiple awaits, so wait
    // generously for it to settle.
    for (let i = 0; i < 10; i++) await Promise.resolve();
    await new Promise(r => setTimeout(r, 50));
    for (let i = 0; i < 10; i++) await Promise.resolve();
  } finally {
    (CdvPurchase.Utils as any).ajax = originalAjax;
  }

  return { verified, unverified };
}

describe('Validator integration — invalid responses trigger BAD_RESPONSE', () => {
  // The message tells developers of custom validators what to fix.
  test.each([
    ['ok:true with no data', { ok: true }, '"data" must be an object when "ok" is true, got undefined'],
    ['ok:true with array data', { ok: true, data: [] }, '"data" must be an object when "ok" is true, got array'],
    ['ok:true with data missing id', { ok: true, data: { latest_receipt: true, transaction: {} } }, '"data.id" must be a string, got undefined'],
    ['ok:true with non-string id', { ok: true, data: { id: 1, latest_receipt: true, transaction: {} } }, '"data.id" must be a string, got number'],
    ['null', null, 'expected a JSON object, got null'],
    ['undefined', undefined, 'expected a JSON object, got undefined'],
    ['string', 'oops', 'expected a JSON object, got string'],
    ['object without ok', { data: {} }, '"ok" must be a boolean, got undefined'],
  ])('rejects %s as BAD_RESPONSE', async (_label, payload, problem) => {
    const { verified, unverified } = await runValidator(payload);
    expect(verified).toHaveLength(0);
    expect(unverified).toHaveLength(1);
    const p = unverified[0].payload as CdvPurchase.Validator.Response.ErrorPayload;
    expect(p.ok).toBe(false);
    expect(p.code).toBe(CdvPurchase.ErrorCode.BAD_RESPONSE);
    expect(p.message).toBe('Validator responded with invalid data: ' + problem);
  });
});

describe('Validator integration — valid success payloads', () => {
  test('well-formed success payload triggers verifiedCallbacks', async () => {
    const payload = {
      ok: true,
      data: {
        id: 'com.test.product',
        latest_receipt: true,
        transaction: { type: 'android-playstore', purchaseToken: 'token' },
      },
    };
    const { verified, unverified } = await runValidator(payload);
    expect(unverified).toHaveLength(0);
    expect(verified).toHaveLength(1);
    expect(verified[0].id).toBe('com.test.product');
  });

  test('success payload with optional collection field triggers verifiedCallbacks', async () => {
    const payload = {
      ok: true,
      data: {
        id: 'com.test.product',
        latest_receipt: true,
        transaction: { type: 'test' },
        collection: [{ id: 'com.test.product', transactionId: 'txn1' }],
      },
    };
    const { verified, unverified } = await runValidator(payload);
    expect(unverified).toHaveLength(0);
    expect(verified).toHaveLength(1);
  });

  // latest_receipt is documented as required in SuccessPayload, but in
  // practice it's only metadata stored on VerifiedReceipt.latestReceipt and
  // never branched on. Older validators may omit it; treat it as optional.
  test('success payload omitting latest_receipt is accepted', async () => {
    const payload = {
      ok: true,
      data: {
        id: 'com.test.product',
        transaction: { type: 'test' },
      },
    };
    const { verified, unverified } = await runValidator(payload);
    expect(unverified).toHaveLength(0);
    expect(verified).toHaveLength(1);
  });

  // transaction is only stored on VerifiedReceipt.nativeTransactions and read
  // by adapters when present. Custom validators may omit it (it was accepted
  // until 13.15.x); a missing or non-object value gives an empty list.
  test.each([
    ['missing', undefined],
    ['null', null],
    ['a string', 'raw-receipt'],
  ])('success payload with transaction %s is accepted, nativeTransactions empty', async (_label, transaction) => {
    const data: any = { id: 'com.test.product', collection: [{ id: 'com.test.product' }] };
    if (transaction !== undefined) data.transaction = transaction;
    const { verified, unverified } = await runValidator({ ok: true, data });
    expect(unverified).toHaveLength(0);
    expect(verified).toHaveLength(1);
    expect(verified[0].nativeTransactions).toEqual([]);
    expect(verified[0].collection).toEqual([{ id: 'com.test.product' }]);
    expect((verified[0].raw as any).transaction).toBe(transaction);
  });

  test('transaction object is kept in nativeTransactions', async () => {
    const transaction = { type: 'android-playstore', purchaseToken: 'token' };
    const { verified } = await runValidator({ ok: true, data: { id: 'com.test.product', transaction } });
    expect(verified[0].nativeTransactions).toEqual([transaction]);
  });
});

describe('Validator integration — valid error payloads', () => {
  // Pin down that legitimate ok:false responses are NOT coerced to BAD_RESPONSE.
  test('ok:false without data passes through to unverifiedCallbacks with original code', async () => {
    const payload = {
      ok: false,
      code: CdvPurchase.ErrorCode.VERIFICATION_FAILED,
      message: 'boom',
    };
    const { verified, unverified } = await runValidator(payload);
    expect(verified).toHaveLength(0);
    expect(unverified).toHaveLength(1);
    const p = unverified[0].payload as CdvPurchase.Validator.Response.ErrorPayload;
    expect(p.ok).toBe(false);
    expect(p.code).toBe(CdvPurchase.ErrorCode.VERIFICATION_FAILED);
  });
});
