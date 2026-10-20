import '../www/store';

// The validator marks answers served from its last successful validation with `data.cache`
// (store unreachable). The plugin surfaces it on the VerifiedReceipt and never grants
// ownership past a purchase's expiryDate, whatever the source of the answer.

const decorator = { finish: async () => {} };
const receipt = () => new CdvPurchase.Receipt(CdvPurchase.Platform.GOOGLE_PLAY, { verify: async () => {}, finish: async () => {} });
const cache = { source: 'last-verified', reason: 'store_unreachable', lastConfirmedAt: '2026-10-19T10:00:00.000Z' } as const;
const DAY = 86400000;

const data = (extra: object = {}, expiryDate = Date.now() + DAY) => ({
  id: 'com.test.sub',
  latest_receipt: true,
  transaction: { type: 'test' },
  collection: [{ id: 'com.test.sub', purchaseDate: Date.now() - DAY, expiryDate }],
  ...extra,
}) as any;

describe('data.cache marker', () => {
  test('is surfaced on the verified receipt', () => {
    const vr = new CdvPurchase.VerifiedReceipt(receipt(), data({ cache, warning: 'cached' }), decorator);
    expect(vr.cache).toEqual(cache);
    expect(vr.warning).toBe('cached');
  });

  test('is undefined for a store-confirmed answer', () => {
    const vr = new CdvPurchase.VerifiedReceipt(receipt(), data(), decorator);
    expect(vr.cache).toBeUndefined();
  });

  test('set() takes the marker of the new answer, and drops it when the store confirms again', () => {
    const r = receipt();
    const vr = new CdvPurchase.VerifiedReceipt(r, data(), decorator);
    vr.set(r, data({ cache }));
    expect(vr.cache).toEqual(cache);
    vr.set(r, data());
    expect(vr.cache).toBeUndefined();
  });

  test('set() replaces the collection with the new answer (no merge)', () => {
    const r = receipt();
    const vr = new CdvPurchase.VerifiedReceipt(r, data(), decorator);
    vr.set(r, data({ collection: [{ id: 'com.test.other' }] }));
    expect(vr.collection.map(p => p.id)).toEqual(['com.test.other']);
  });
});

describe('ownership of a cached answer', () => {
  const owned = (vr: CdvPurchase.VerifiedReceipt) =>
    CdvPurchase.Internal.VerifiedReceipts.isOwned([vr], { id: 'com.test.sub' });

  test('owned before expiryDate', () => {
    expect(owned(new CdvPurchase.VerifiedReceipt(receipt(), data({ cache }), decorator))).toBe(true);
  });

  test('not owned past expiryDate', () => {
    expect(owned(new CdvPurchase.VerifiedReceipt(receipt(), data({ cache }, Date.now() - 1000), decorator))).toBe(false);
  });

  test('not owned once the validator reports the purchase expired', () => {
    const d = data({ cache });
    d.collection[0].isExpired = true;
    expect(owned(new CdvPurchase.VerifiedReceipt(receipt(), d, decorator))).toBe(false);
  });
});
