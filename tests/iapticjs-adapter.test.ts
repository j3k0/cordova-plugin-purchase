import '../www/store';

describe('IapticJS.Transaction', () => {

  const context = { apiDecorators: {} } as unknown as CdvPurchase.Internal.AdapterContext;

  const purchase = (fields: Partial<ModuleIapticJS.Purchase>): ModuleIapticJS.Purchase => ({
    purchaseId: 'stripe:pi_test',
    transactionId: 'stripe:pi_test',
    productId: 'stripe:prod_test',
    platform: 'stripe',
    ...fields,
  });

  test('a one-time payment without dates has no dates (not Invalid Date)', () => {
    const receipt = new CdvPurchase.IapticJS.Receipt([purchase({})], 'token', context);
    const transaction = receipt.transactions[0];
    expect(transaction.purchaseDate).toBeUndefined();
    expect(transaction.expirationDate).toBeUndefined();
    expect(transaction.lastRenewalDate).toBeUndefined();
  });

  test('dates sent by the server are parsed', () => {
    const receipt = new CdvPurchase.IapticJS.Receipt([purchase({
      purchaseDate: '2026-01-01T00:00:00.000Z',
      lastRenewalDate: '2026-02-01T00:00:00.000Z',
      expirationDate: '2026-03-01T00:00:00.000Z',
    })], 'token', context);
    const transaction = receipt.transactions[0];
    expect(transaction.purchaseDate?.toISOString()).toBe('2026-01-01T00:00:00.000Z');
    expect(transaction.lastRenewalDate?.toISOString()).toBe('2026-02-01T00:00:00.000Z');
    expect(transaction.expirationDate?.toISOString()).toBe('2026-03-01T00:00:00.000Z');
  });
});
