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

    describe('change detection', () => {
        test('does not notify listeners when the refreshed value is the same as cached', async () => {
            const store = new CdvPurchase.Internal.Storefronts(makeLogger());
            const adapter = makeAdapter(CdvPurchase.Platform.TEST, async () => 'US');
            await store.refreshWith(adapter);
            jest.runAllTimers(); // flush the first event
            const events: CdvPurchase.Storefront[] = [];
            store.listen(s => events.push(s), 'test-change');

            await store.refreshWith(adapter); // same value — no event
            jest.runAllTimers();

            expect(events).toEqual([]);
        });

        test('notifies listeners when the refreshed value is different', async () => {
            const store = new CdvPurchase.Internal.Storefronts(makeLogger());
            let country = 'US';
            const adapter = makeAdapter(CdvPurchase.Platform.TEST, async () => country);
            await store.refreshWith(adapter);
            jest.runAllTimers(); // flush the first event
            const events: CdvPurchase.Storefront[] = [];
            store.listen(s => events.push(s), 'test-change');

            country = 'FR';
            await store.refreshWith(adapter);
            jest.runAllTimers();

            expect(events).toEqual([{ platform: CdvPurchase.Platform.TEST, countryCode: 'FR' }]);
        });
    });

    describe('timeout', () => {
        beforeEach(() => { jest.useFakeTimers(); });
        afterEach(() => { jest.useRealTimers(); });

        test('rejects when adapter does not respond within timeoutMs', async () => {
            const store = new CdvPurchase.Internal.Storefronts(makeLogger());
            let resolveAdapter!: (value: string | undefined) => void;
            const adapter = makeAdapter(CdvPurchase.Platform.TEST,
                () => new Promise<string | undefined>(r => { resolveAdapter = r; }));

            const refresh = store.refreshWith(adapter, 100);
            jest.advanceTimersByTime(100);

            await expect(refresh).rejects.toThrow(/timeout/);

            // Cleanup
            resolveAdapter('US');
            await Promise.resolve();
            await Promise.resolve();
            jest.runAllTimers();
        });

        test('silently updates cache when adapter resolves after timeout', async () => {
            const store = new CdvPurchase.Internal.Storefronts(makeLogger());
            const events: CdvPurchase.Storefront[] = [];
            store.listen(s => events.push(s), 'timeout-late');

            let resolveAdapter!: (value: string | undefined) => void;
            const adapter = makeAdapter(CdvPurchase.Platform.TEST,
                () => new Promise<string | undefined>(r => { resolveAdapter = r; }));

            const refresh = store.refreshWith(adapter, 100).catch(() => { /* expected timeout */ });
            jest.advanceTimersByTime(100);
            await refresh;

            // Still nothing cached at this point.
            expect(store.getValueFor(CdvPurchase.Platform.TEST)?.countryCode).toBeUndefined();

            // Now the underlying fetch finishes. Cache should update silently.
            resolveAdapter('US');
            // Flush microtasks so the .then() chain runs
            await Promise.resolve();
            await Promise.resolve();
            // Flush the setTimeout(0) from safeCall
            jest.runAllTimers();

            expect(store.getValueFor(CdvPurchase.Platform.TEST)).toEqual({
                platform: CdvPurchase.Platform.TEST,
                countryCode: 'US',
            });
            expect(events).toEqual([{ platform: CdvPurchase.Platform.TEST, countryCode: 'US' }]);
        });

        test('resolves normally when adapter responds within timeoutMs', async () => {
            const store = new CdvPurchase.Internal.Storefronts(makeLogger());
            const adapter = makeAdapter(CdvPurchase.Platform.TEST, async () => 'US');

            await expect(store.refreshWith(adapter, 100)).resolves.toBeUndefined();
            jest.runAllTimers();
            expect(store.getValueFor(CdvPurchase.Platform.TEST)?.countryCode).toBe('US');
        });
    });

    describe('failure modes', () => {
        beforeEach(() => { jest.useFakeTimers(); });
        afterEach(() => { jest.useRealTimers(); });

        test('does not overwrite cached value when adapter returns undefined', async () => {
            const store = new CdvPurchase.Internal.Storefronts(makeLogger());
            let value: string | undefined = 'US';
            const adapter = makeAdapter(CdvPurchase.Platform.TEST, async () => value);
            await store.refreshWith(adapter);
            jest.runAllTimers();

            value = undefined;
            await store.refreshWith(adapter);
            jest.runAllTimers();

            expect(store.getValueFor(CdvPurchase.Platform.TEST)).toEqual({
                platform: CdvPurchase.Platform.TEST,
                countryCode: 'US',
            });
        });

        test('does not overwrite cached value when adapter throws', async () => {
            const store = new CdvPurchase.Internal.Storefronts(makeLogger());
            let shouldThrow = false;
            const adapter = makeAdapter(CdvPurchase.Platform.TEST, async () => {
                if (shouldThrow) throw new Error('native failure');
                return 'US';
            });
            await store.refreshWith(adapter);
            jest.runAllTimers();

            shouldThrow = true;
            await expect(store.refreshWith(adapter)).resolves.toBeUndefined();

            expect(store.getValueFor(CdvPurchase.Platform.TEST)).toEqual({
                platform: CdvPurchase.Platform.TEST,
                countryCode: 'US',
            });
        });

        test('does nothing when adapter does not implement getStorefront', async () => {
            const store = new CdvPurchase.Internal.Storefronts(makeLogger());
            const adapter = makeAdapter(CdvPurchase.Platform.TEST); // no getStorefront

            await expect(store.refreshWith(adapter)).resolves.toBeUndefined();

            expect(store.getValueFor(CdvPurchase.Platform.TEST)).toEqual({
                platform: CdvPurchase.Platform.TEST,
                countryCode: undefined,
            });
        });
    });
});
