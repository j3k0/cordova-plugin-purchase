import '../www/store';

// Drives Validator end-to-end with a stubbed Utils.ajax and checks the
// `transient` flag set on `unverified` events.

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

type AjaxOutcome =
  | { success: unknown }
  | { error: { status: number; message: string } };

async function runValidator(outcome: AjaxOutcome | AjaxOutcome[]) {
  // A list of outcomes is served one per request, the last one repeats.
  const outcomes = Array.isArray(outcome) ? outcome : [outcome];
  let calls = 0;
  let counters: { requests: number, responses: number }[] = [];
  const platform = CdvPurchase.Platform.GOOGLE_PLAY;
  const adapter = {
    id: platform,
    receiptValidationBody: async () => ({
      id: 'com.test.product',
      type: CdvPurchase.ProductType.PAID_SUBSCRIPTION,
      transaction: { type: 'test', id: 't1' },
    }),
    handleReceiptValidationResponse: async () => {},
  } as unknown as CdvPurchase.Adapter;
  const verifiedCallbacks = new CdvPurchase.Internal.Callbacks<CdvPurchase.VerifiedReceipt>(makeLogger(), 'verified');
  const unverifiedCallbacks = new CdvPurchase.Internal.Callbacks<CdvPurchase.UnverifiedReceipt>(makeLogger(), 'unverified');
  const verified: CdvPurchase.VerifiedReceipt[] = [];
  const unverified: CdvPurchase.UnverifiedReceipt[] = [];
  verifiedCallbacks.push(vr => { verified.push(vr); }, 'recorder');
  unverifiedCallbacks.push(uv => { unverified.push(uv); }, 'recorder');

  const controller: CdvPurchase.Internal.ValidatorController = {
    validator: 'https://example.test/validate',
    localReceipts: [],
    adapters: { find: () => adapter } as unknown as CdvPurchase.Internal.Adapters,
    validator_privacy_policy: undefined,
    getApplicationUsername: () => undefined,
    obfuscateUsername: () => undefined,
    verifiedCallbacks,
    unverifiedCallbacks,
    finish: async () => {},
  };

  let validator: CdvPurchase.Internal.Validator;
  const originalAjax = CdvPurchase.Utils.ajax;
  (CdvPurchase.Utils as any).ajax = (_log: CdvPurchase.Logger, opts: any) => {
    const outcome = outcomes[Math.min(calls++, outcomes.length - 1)];
    counters.push({ requests: validator.numRequests, responses: validator.numResponses });
    setTimeout(() => {
      if ('success' in outcome) opts.success(outcome.success);
      else opts.error(outcome.error.status, outcome.error.message, null);
    }, 0);
    return { done: () => {} };
  };

  try {
    validator = new CdvPurchase.Internal.Validator(controller, makeLogger());
    (validator as any).retry = new CdvPurchase.Internal.Retry(1, 1); // retry fast
    validator.add(new CdvPurchase.Receipt(platform, { verify: async () => {}, finish: async () => {} }));
    validator.run();
    for (let i = 0; i < 100 && verified.length + unverified.length === 0; i++)
      await new Promise(r => setTimeout(r, 10));
    await new Promise(r => setTimeout(r, 50)); // let any extra retry show up
    counters.push({ requests: validator.numRequests, responses: validator.numResponses });
  } finally {
    (CdvPurchase.Utils as any).ajax = originalAjax;
  }
  return { verified, unverified, calls, counters };
}

/** Error body as sent by iaptic: HTTP 200 with ok:false. */
const body = (status: number, code: number) => ({
  success: { ok: false, status, code, message: 'error', data: { latest_receipt: true } },
});

describe('unverified() transient flag', () => {
  test.each<[string, AjaxOutcome]>([
    ['body 502 CONNECTION_FAILED (store unreachable)', body(502, 6778002)],
    ['body 503', body(503, 6778000)],
    ['body 500', body(500, 6778000)],
    ['HTTP 502 from a proxy', { error: { status: 502, message: 'Bad Gateway' } }],
    ['HTTP 503', { error: { status: 503, message: 'Service Unavailable' } }],
    ['request timeout', { error: { status: 408, message: 'Timeout' } }],
    ['no network (XMLHttpRequest)', { error: { status: 0, message: '' } }],
    ['no network (advanced-http)', { error: { status: -6, message: 'not connected' } }],
    ['unreadable response (captive portal)', { error: { status: 417, message: 'Unexpected token <' } }],
  ])('%s → transient', async (_label, outcome) => {
    const { verified, unverified } = await runValidator(outcome);
    expect(verified).toHaveLength(0);
    expect(unverified).toHaveLength(1);
    expect(unverified[0].transient).toBe(true);
  });

  test.each<[string, AjaxOutcome]>([
    ['body 400 INVALID_PAYLOAD', body(400, 6778001)],
    ['body 401', body(401, 6778000)],
    ['body 403', body(403, 6778000)],
    ['body 410', body(410, 6778000)],
    ['body 419 expired', body(419, 6778003)],
    ['HTTP 400', { error: { status: 400, message: 'Bad Request' } }],
    ['HTTP 401', { error: { status: 401, message: 'Unauthorized' } }],
    ['HTTP 404', { error: { status: 404, message: 'Not Found' } }],
    ['invalid success payload (BAD_RESPONSE)', { success: { ok: true } }],
  ])('%s → not transient', async (_label, outcome) => {
    const { verified, unverified } = await runValidator(outcome);
    expect(verified).toHaveLength(0);
    expect(unverified).toHaveLength(1);
    expect(unverified[0].transient).toBe(false);
  });

  test('a successful validation fires verified(), not unverified()', async () => {
    const { verified, unverified } = await runValidator({
      success: { ok: true, data: { id: 'com.test.product', latest_receipt: true, transaction: { type: 'test' } } },
    });
    expect(unverified).toHaveLength(0);
    expect(verified).toHaveLength(1);
  });
});

describe('retry on temporary failures', () => {
  const ok = { success: { ok: true, data: { id: 'com.test.product', latest_receipt: true, transaction: { type: 'test' } } } };

  test.each<[string, AjaxOutcome]>([
    ['no network', { error: { status: 0, message: '' } }],
    ['request timeout', { error: { status: 408, message: 'Timeout' } }],
    ['HTTP 503', { error: { status: 503, message: 'Service Unavailable' } }],
    ['body 502 CONNECTION_FAILED', body(502, 6778002)],
    ['invalid success payload (BAD_RESPONSE)', { success: { ok: true } }],
  ])('%s, then success → verified, no unverified', async (_label, failure) => {
    const { verified, unverified, calls } = await runValidator([failure, failure, ok]);
    expect(calls).toBe(3);
    expect(unverified).toHaveLength(0);
    expect(verified).toHaveLength(1);
  });

  test('a receipt waiting for a retry stays counted as pending', async () => {
    const failure = { error: { status: 0, message: '' } };
    const { counters } = await runValidator([failure, failure, ok]);
    // one entry per request, then the final state
    expect(counters).toEqual([
      { requests: 1, responses: 0 },
      { requests: 1, responses: 0 },
      { requests: 1, responses: 0 },
      { requests: 1, responses: 1 },
    ]);
  });

  test('gives up after 4 attempts and fires unverified once', async () => {
    const { verified, unverified, calls } = await runValidator({ error: { status: 0, message: '' } });
    expect(calls).toBe(4);
    expect(verified).toHaveLength(0);
    expect(unverified).toHaveLength(1);
  });

  test.each<[string, AjaxOutcome]>([
    ['body 400 INVALID_PAYLOAD', body(400, 6778001)],
    ['body 419 expired', body(419, 6778003)],
    ['HTTP 401', { error: { status: 401, message: 'Unauthorized' } }],
  ])('%s → no retry', async (_label, verdict) => {
    const { verified, unverified, calls } = await runValidator([verdict, ok]);
    expect(calls).toBe(1);
    expect(verified).toHaveLength(0);
    expect(unverified).toHaveLength(1);
  });
});
