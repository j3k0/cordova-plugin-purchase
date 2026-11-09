import '../www/store';

// Since the validator accepts success answers without a `transaction` object
// (custom validators may omit it), each adapter's handleReceiptValidationResponse
// must handle it being absent, null or not an object. If it threw, the
// validator would report VERIFICATION_FAILED instead of a verified receipt.
//
// The adapters are created without their constructor (which talks to the
// native bridges): handleReceiptValidationResponse only needs a logger.

function makeLogger(): CdvPurchase.Logger {
  const noop = () => {};
  return {
    verbosity: CdvPurchase.LogLevel.QUIET,
    error: noop, warn: noop, info: noop, debug: noop,
    child: () => makeLogger(),
    logger: { log: noop },
  } as unknown as CdvPurchase.Logger;
}

function bareAdapter(AdapterClass: { prototype: CdvPurchase.Adapter }): CdvPurchase.Adapter {
  const adapter = Object.create(AdapterClass.prototype);
  adapter.log = makeLogger();
  return adapter;
}

const adapters: [string, () => CdvPurchase.Adapter][] = [
  ['Google Play', () => bareAdapter(CdvPurchase.GooglePlay.Adapter)],
  ['Apple App Store', () => bareAdapter(CdvPurchase.AppleAppStore.Adapter)],
  ['Braintree', () => bareAdapter(CdvPurchase.Braintree.Adapter)],
];

const transactions: [string, unknown][] = [
  ['missing', undefined],
  ['null', null],
  ['a string', 'raw-receipt'],
];

describe('handleReceiptValidationResponse without a transaction object', () => {
  for (const [adapterName, makeAdapter] of adapters) {
    test.each(transactions)(`${adapterName}: transaction %s`, async (_label, transaction) => {
      const data: any = { id: 'com.test.product' };
      if (transaction !== undefined) data.transaction = transaction;
      const receipt = new CdvPurchase.Receipt(CdvPurchase.Platform.TEST, {
        verify: async () => {},
        finish: async () => {},
      });
      await expect(makeAdapter().handleReceiptValidationResponse(receipt, { ok: true, data } as any)).resolves.toBeUndefined();
    });
  }
});
