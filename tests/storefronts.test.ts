import '../www/store';

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

function makeAdapter(id: CdvPurchase.Platform, getStorefrontImpl?: () => Promise<string | undefined>): CdvPurchase.Adapter {
    return {
        id,
        name: `adapter-${id}`,
        ready: true,
        products: [],
        receipts: [],
        isSupported: true,
        getStorefront: getStorefrontImpl,
    } as unknown as CdvPurchase.Adapter;
}

describe('Internal.Storefronts', () => {
    beforeEach(() => { jest.useFakeTimers(); });
    afterEach(() => { jest.useRealTimers(); });

    describe('refreshWith — happy path', () => {
        test('caches value returned by adapter', async () => {
            const store = new CdvPurchase.Internal.Storefronts(makeLogger());
            const adapter = makeAdapter(CdvPurchase.Platform.TEST, async () => 'US');

            await store.refreshWith(adapter);

            expect(store.getValueFor(CdvPurchase.Platform.TEST)).toEqual({
                platform: CdvPurchase.Platform.TEST,
                countryCode: 'US',
            });
        });

        test('notifies listeners when a value is first cached', async () => {
            const store = new CdvPurchase.Internal.Storefronts(makeLogger());
            const adapter = makeAdapter(CdvPurchase.Platform.TEST, async () => 'FR');
            const events: CdvPurchase.Storefront[] = [];
            store.listen(s => events.push(s), 'test');

            await store.refreshWith(adapter);
            jest.runAllTimers();

            expect(events).toEqual([{ platform: CdvPurchase.Platform.TEST, countryCode: 'FR' }]);
        });

        test('getValueFor with specified platform and nothing cached returns object with undefined countryCode', () => {
            const store = new CdvPurchase.Internal.Storefronts(makeLogger());

            expect(store.getValueFor(CdvPurchase.Platform.TEST)).toEqual({
                platform: CdvPurchase.Platform.TEST,
                countryCode: undefined,
            });
        });

        test('getValueFor without argument returns undefined when nothing cached', () => {
            const store = new CdvPurchase.Internal.Storefronts(makeLogger());

            expect(store.getValueFor()).toBeUndefined();
        });

        test('getValueFor without argument returns first cached entry when something is cached', async () => {
            const store = new CdvPurchase.Internal.Storefronts(makeLogger());
            const adapter = makeAdapter(CdvPurchase.Platform.TEST, async () => 'US');
            await store.refreshWith(adapter);

            expect(store.getValueFor()).toEqual({
                platform: CdvPurchase.Platform.TEST,
                countryCode: 'US',
            });
        });
    });
});
