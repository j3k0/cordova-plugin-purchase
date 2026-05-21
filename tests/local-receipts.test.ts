import '../www/store';

/**
 * Unit tests for Internal.LocalReceipts.canPurchase — covers the fix for
 * issue #1705: canPurchase used to return true for transactions that were
 * approved-but-not-finished (and for transactions stuck in Google Play's
 * PENDING state), allowing users to start a second purchase while the
 * previous one was still in flight.
 */
describe('Internal.LocalReceipts.canPurchase (#1705)', () => {

    const { LocalReceipts } = CdvPurchase.Internal;
    const PLATFORM = CdvPurchase.Platform.TEST;
    const PRODUCT_ID = 'consumable.coins';

    function makeReceipt(tx: Partial<CdvPurchase.Transaction>): CdvPurchase.Receipt {
        const transaction = {
            products: [{ id: PRODUCT_ID }],
            platform: PLATFORM,
            ...tx,
        } as unknown as CdvPurchase.Transaction;
        return {
            platform: PLATFORM,
            transactions: [transaction],
        } as unknown as CdvPurchase.Receipt;
    }

    it('returns true when no receipt exists for the product', () => {
        expect(LocalReceipts.canPurchase([], { id: PRODUCT_ID, platform: PLATFORM })).toBe(true);
    });

    it('returns true after a consumable has been consumed (finished)', () => {
        const receipts = [makeReceipt({ isConsumed: true })];
        expect(LocalReceipts.canPurchase(receipts, { id: PRODUCT_ID, platform: PLATFORM })).toBe(true);
    });

    it('returns false when a transaction is approved but not finished', () => {
        const receipts = [makeReceipt({ isConsumed: false })];
        expect(LocalReceipts.canPurchase(receipts, { id: PRODUCT_ID, platform: PLATFORM })).toBe(false);
    });

    it('returns false when a Google Play transaction is still pending payment', () => {
        const receipts = [makeReceipt({ isPending: true })];
        expect(LocalReceipts.canPurchase(receipts, { id: PRODUCT_ID, platform: PLATFORM })).toBe(false);
    });

    it('returns false when a subscription is still active', () => {
        const future = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const receipts = [makeReceipt({ expirationDate: future })];
        expect(LocalReceipts.canPurchase(receipts, { id: PRODUCT_ID, platform: PLATFORM })).toBe(false);
    });

    it('returns true when a subscription has expired', () => {
        const past = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const receipts = [makeReceipt({ expirationDate: past })];
        expect(LocalReceipts.canPurchase(receipts, { id: PRODUCT_ID, platform: PLATFORM })).toBe(true);
    });

    it('returns false when no product is provided', () => {
        expect(LocalReceipts.canPurchase([], undefined)).toBe(false);
    });
});
