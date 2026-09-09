import '../www/store';

describe('Internal.LocalReceipts.find', () => {
    const { LocalReceipts } = CdvPurchase.Internal;
    const product = { id: 'subscription.monthly', platform: CdvPurchase.Platform.TEST };

    function makeReceipt(transactions: Partial<CdvPurchase.Transaction>[], platform = product.platform): CdvPurchase.Receipt {
        return {
            platform,
            transactions: transactions.map(transaction => ({ products: [{ id: product.id }], ...transaction })),
        } as unknown as CdvPurchase.Receipt;
    }

    it.each([false, true])('uses the active transaction with the newer purchaseDate regardless of receipt order (reversed: %s)', reversed => {
        const now = Date.now();
        const expired = makeReceipt([{ purchaseDate: new Date(now - 2000), expirationDate: new Date(now - 1000) }]);
        const newer = makeReceipt([{ purchaseDate: new Date(now - 500), expirationDate: new Date(now + 24 * 60 * 60 * 1000) }]);
        const receipts = reversed ? [newer, expired] : [expired, newer];

        expect(LocalReceipts.find(receipts, product)).toBe(newer.transactions[0]);
        expect(LocalReceipts.isOwned(receipts, product)).toBe(true);
        expect(LocalReceipts.canPurchase(receipts, product)).toBe(false);
    });

    it('selects the latest matching transaction while ignoring other products and platforms', () => {
        const matching = makeReceipt([
            { purchaseDate: new Date(1000) },
            { purchaseDate: new Date(2000), products: [{ id: 'other.product' }, { id: product.id }] },
        ]);
        const otherProduct = makeReceipt([{ purchaseDate: new Date(3000), products: [{ id: 'other.product' }] }]);
        const otherPlatform = makeReceipt([{ purchaseDate: new Date(4000) }], CdvPurchase.Platform.GOOGLE_PLAY);

        expect(LocalReceipts.find([matching, otherProduct, otherPlatform], product)).toBe(matching.transactions[1]);
    });

    it.each([false, true])('preserves undated transaction precedence (reversed: %s)', reversed => {
        const dated = makeReceipt([{ purchaseDate: new Date(1000) }]);
        const undated = makeReceipt([{}]);
        const receipts = reversed ? [undated, dated] : [dated, undated];

        expect(LocalReceipts.find(receipts, product)).toBe(undated.transactions[0]);
    });

    it('keeps the first transaction when purchase dates are equal', () => {
        const purchaseDate = new Date(1000);
        const receipt = makeReceipt([{ purchaseDate }, { purchaseDate }]);

        expect(LocalReceipts.find([receipt], product)).toBe(receipt.transactions[0]);
    });

    it('keeps the last undated transaction as before', () => {
        const receipt = makeReceipt([{}, {}]);

        expect(LocalReceipts.find([receipt], product)).toBe(receipt.transactions[1]);
    });

    it.each([false, true])('blocks repurchase for an undated pending transaction after a consumed purchase (reversed: %s)', reversed => {
        const consumed = makeReceipt([{ purchaseDate: new Date(1000), isConsumed: true }]);
        const pending = makeReceipt([{ isPending: true }]);
        const receipts = reversed ? [pending, consumed] : [consumed, pending];

        expect(LocalReceipts.find(receipts, product)).toBe(pending.transactions[0]);
        expect(LocalReceipts.isOwned(receipts, product)).toBe(false);
        expect(LocalReceipts.canPurchase(receipts, product)).toBe(false);
    });

    it('uses the latest consumable purchase state instead of an older consumed purchase', () => {
        const receipt = makeReceipt([
            { purchaseDate: new Date(1000), isConsumed: true },
            { purchaseDate: new Date(2000), isConsumed: false },
        ]);

        expect(LocalReceipts.isOwned([receipt], product)).toBe(true);
        expect(LocalReceipts.canPurchase([receipt], product)).toBe(false);

        receipt.transactions[1].isConsumed = true;
        expect(LocalReceipts.isOwned([receipt], product)).toBe(false);
        expect(LocalReceipts.canPurchase([receipt], product)).toBe(true);
    });
});

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
