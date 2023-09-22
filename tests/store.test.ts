import '../www/store';

describe('CDVPurchase', () => {
  test('should be defined', () => {
    expect(window).toBeDefined();
    expect(window.CdvPurchase).toBeDefined();
  });

  describe('Store', () => {
    test('should be defined', () => {
      expect(CdvPurchase.store).toBeDefined();
    });
  });
});
