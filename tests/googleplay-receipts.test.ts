import '../www/store';

describe('GooglePlay purchase inventory', () => {
    const { GooglePlay, Platform, ProductType, TransactionState, RenewalIntent } = CdvPurchase;
    const premium = { id: 'premium', platform: Platform.GOOGLE_PLAY };
    let adapter: CdvPurchase.GooglePlay.Adapter;
    let receiptsUpdated: jest.Mock;

    function purchase(id: string, overrides: Partial<CdvPurchase.GooglePlay.Bridge.Purchase> = {}) {
        return {
            productId: id,
            productIds: [id],
            purchaseToken: id + '-token',
            orderId: id + '-order',
            purchaseTime: Date.now() - 1000,
            getPurchaseState: GooglePlay.Bridge.PurchaseState.PURCHASED,
            acknowledged: true,
            quantity: 1,
            ...overrides,
        } as CdvPurchase.GooglePlay.Bridge.Purchase;
    }

    function subscription(withExpiry: boolean, autoRenewing = false) {
        return purchase(premium.id, {
            autoRenewing,
            expiryTimeMillis: withExpiry ? String(Date.now() + 86400000) : undefined,
        });
    }

    function ownsPremium() {
        return CdvPurchase.Internal.LocalReceipts.isOwned(adapter.receipts, premium);
    }

    beforeEach(() => {
        jest.useFakeTimers();
        GooglePlay.Adapter._instance = undefined;
        receiptsUpdated = jest.fn();
        adapter = new GooglePlay.Adapter({
            log: new CdvPurchase.Logger({ verbosity: CdvPurchase.LogLevel.QUIET }),
            apiDecorators: {},
            listener: { receiptsUpdated, receiptsReady: jest.fn() },
        } as unknown as CdvPurchase.Internal.AdapterContext);
        adapter.products.push({ id: premium.id, type: ProductType.PAID_SUBSCRIPTION } as CdvPurchase.GooglePlay.GProduct);
    });

    afterEach(() => {
        GooglePlay.Adapter._instance = undefined;
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    it.each([false, true])('keeps ownership when renewal is canceled (expiry supplied: %s)', withExpiry => {
        adapter.onSetPurchases([subscription(withExpiry, true)]);
        adapter.onSetPurchases([subscription(withExpiry, false)]);

        expect(adapter.receipts[0].transactions[0].renewalIntent).toBe(RenewalIntent.LAPSE);
        expect(ownsPremium()).toBe(true);
    });

    describe.each(['purchase update', 'consumption'])('%s for another product', event => {
        it.each([false, true])('preserves a canceled renewal (expiry supplied: %s)', withExpiry => {
            const coins = purchase('coins');
            adapter.onSetPurchases([subscription(withExpiry), coins]);
            const transaction = adapter.receipts[0].transactions[0];
            const expirationDate = transaction.expirationDate;

            if (event === 'consumption') adapter.onPurchaseConsumed(coins);
            else adapter.onPurchasesUpdated([coins]);

            expect(ownsPremium()).toBe(true);
            expect(transaction.state).toBe(TransactionState.APPROVED);
            expect(transaction.expirationDate).toEqual(expirationDate);
        });
    });

    it.each([false, true])('revokes and notifies for a missing subscription (empty snapshot: %s)', empty => {
        const coins = purchase('coins');
        adapter.onSetPurchases([subscription(true), coins]);
        const receipt = adapter.receipts[0];
        receiptsUpdated.mockClear();

        adapter.onSetPurchases(empty ? [] : [coins]);

        expect(ownsPremium()).toBe(false);
        expect(receipt.transactions[0].state).toBe(TransactionState.CANCELLED);
        expect(receiptsUpdated).toHaveBeenCalledWith(Platform.GOOGLE_PLAY, expect.arrayContaining([receipt]));
    });

    it('revokes ownership when the subscription expiration is reported', () => {
        adapter.onSetPurchases([subscription(true)]);
        adapter.onPurchasesUpdated([purchase(premium.id, {
            autoRenewing: false,
            expiryTimeMillis: String(Date.now() - 1000),
        })]);

        expect(ownsPremium()).toBe(false);
    });
});
