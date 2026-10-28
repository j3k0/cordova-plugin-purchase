import '../www/store';

/**
 * LocalReceipts.find must return the latest transaction for a product.
 * It used to return the oldest one, so an expired first purchase hid the
 * current renewal: isOwned() returned false and canPurchase() returned true
 * for an active subscriber.
 */
describe('Internal.LocalReceipts.find', () => {

    const { LocalReceipts } = CdvPurchase.Internal;
    const PLATFORM = CdvPurchase.Platform.TEST;
    const product = { id: 'sub.monthly', platform: PLATFORM };
    const DAY = 24 * 60 * 60 * 1000;

    function makeTransaction(tx: Partial<CdvPurchase.Transaction>): CdvPurchase.Transaction {
        return { products: [{ id: product.id }], platform: PLATFORM, ...tx } as unknown as CdvPurchase.Transaction;
    }

    function makeReceipts(transactions: CdvPurchase.Transaction[]): CdvPurchase.Receipt[] {
        return [{ platform: PLATFORM, transactions } as unknown as CdvPurchase.Receipt];
    }

    it.each([false, true])('returns the newest transaction, so an active renewal is owned (reversed: %s)', reversed => {
        const now = Date.now();
        const expired = makeTransaction({ purchaseDate: new Date(now - 60 * DAY), expirationDate: new Date(now - 30 * DAY) });
        const current = makeTransaction({ purchaseDate: new Date(now - 2 * DAY), expirationDate: new Date(now + 28 * DAY) });
        const receipts = makeReceipts(reversed ? [current, expired] : [expired, current]);

        expect(LocalReceipts.find(receipts, product)).toBe(current);
        expect(LocalReceipts.isOwned(receipts, product)).toBe(true);
        expect(LocalReceipts.canPurchase(receipts, product)).toBe(false);
    });

    it.each([false, true])('still prefers an undated (in-flight) transaction (reversed: %s)', reversed => {
        const dated = makeTransaction({ purchaseDate: new Date(1000) });
        const undated = makeTransaction({});
        const receipts = makeReceipts(reversed ? [undated, dated] : [dated, undated]);

        expect(LocalReceipts.find(receipts, product)).toBe(undated);
    });
});
