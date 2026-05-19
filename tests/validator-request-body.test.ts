import '../www/store';

// These tests capture the request body that Validator.runValidatorRequest
// sends to ajax. They exercise the obfuscatedUsername wiring without
// touching a real native bridge.

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

function makeAdapter(platform: CdvPurchase.Platform): CdvPurchase.Adapter {
    return {
        id: platform,
        name: `adapter-${platform}`,
        ready: true,
        products: [],
        receipts: [],
        isSupported: true,
        receiptValidationBody: async () => ({
            id: 'com.test.product',
            type: CdvPurchase.ProductType.CONSUMABLE,
            transaction: { type: 'test', id: 't1' },
        }),
        handleReceiptValidationResponse: async () => {},
    } as unknown as CdvPurchase.Adapter;
}

function makeReceipt(platform: CdvPurchase.Platform): CdvPurchase.Receipt {
    return new CdvPurchase.Receipt(platform, {
        verify: async () => {},
        finish: async () => {},
    });
}

async function captureRequestBody(platform: CdvPurchase.Platform, store: CdvPurchase.Store): Promise<any> {
    const adapter = makeAdapter(platform);
    const verifiedCallbacks = new CdvPurchase.Internal.Callbacks<CdvPurchase.VerifiedReceipt>(makeLogger(), 'verified');
    const unverifiedCallbacks = new CdvPurchase.Internal.Callbacks<CdvPurchase.UnverifiedReceipt>(makeLogger(), 'unverified');

    const controller: CdvPurchase.Internal.ValidatorController = {
        validator: 'https://example.test/validate',
        localReceipts: [],
        adapters: { find: () => adapter } as unknown as CdvPurchase.Internal.Adapters,
        validator_privacy_policy: undefined,
        getApplicationUsername: () => store.getApplicationUsername(),
        obfuscateUsername: (u: string, p: CdvPurchase.Platform) => store.obfuscateUsername(u, p),
        verifiedCallbacks,
        unverifiedCallbacks,
        finish: async () => {},
    };

    let capturedBody: any = undefined;
    const originalAjax = CdvPurchase.Utils.ajax;
    (CdvPurchase.Utils as any).ajax = (_log: CdvPurchase.Logger, opts: any) => {
        capturedBody = opts.data;
        // Respond with a minimal valid success payload so the pipeline settles.
        setTimeout(() => opts.success({
            ok: true,
            data: { id: 'com.test.product', transaction: { type: 'test' } },
        }), 0);
        return { done: () => {} };
    };

    try {
        const validator = new CdvPurchase.Internal.Validator(controller, makeLogger());
        validator.add(makeReceipt(platform));
        validator.run();
        for (let i = 0; i < 10; i++) await Promise.resolve();
        await new Promise(r => setTimeout(r, 50));
        for (let i = 0; i < 10; i++) await Promise.resolve();
    } finally {
        (CdvPurchase.Utils as any).ajax = originalAjax;
    }

    return capturedBody;
}

describe('Validator request body — obfuscatedUsername wiring', () => {
    afterEach(() => {
        CdvPurchase.store.obfuscator = undefined;
        CdvPurchase.store.applicationUsername = undefined;
        (CdvPurchase.store as any)._legacyObfuscatorNoticeEmitted = false;
    });

    test('omits obfuscatedUsername when applicationUsername is unset', async () => {
        CdvPurchase.store.applicationUsername = undefined;
        const body = await captureRequestBody(CdvPurchase.Platform.GOOGLE_PLAY, CdvPurchase.store);
        expect(body.additionalData?.applicationUsername).toBeUndefined();
        expect(body.additionalData?.obfuscatedUsername).toBeUndefined();
    });

    test('includes both raw and obfuscated username on GOOGLE_PLAY with legacy obfuscator', async () => {
        CdvPurchase.store.applicationUsername = 'hello';
        CdvPurchase.store.obfuscator = 'legacy';
        const body = await captureRequestBody(CdvPurchase.Platform.GOOGLE_PLAY, CdvPurchase.store);
        expect(body.additionalData.applicationUsername).toBe('hello');
        expect(body.additionalData.obfuscatedUsername).toBe('5d41402abc4b2a76b9719d911017c592');
    });

    test('uuid obfuscator sends UUIDv3 format', async () => {
        CdvPurchase.store.applicationUsername = 'hello';
        CdvPurchase.store.obfuscator = 'uuid';
        const body = await captureRequestBody(CdvPurchase.Platform.APPLE_APPSTORE, CdvPurchase.store);
        expect(body.additionalData.applicationUsername).toBe('hello');
        expect(body.additionalData.obfuscatedUsername).toBe('5d41402a-bc4b-3a76-8971-9d911017c592');
    });

    test('disabled obfuscator sends raw value as obfuscatedUsername', async () => {
        CdvPurchase.store.applicationUsername = 'hello';
        CdvPurchase.store.obfuscator = 'disabled';
        const body = await captureRequestBody(CdvPurchase.Platform.GOOGLE_PLAY, CdvPurchase.store);
        expect(body.additionalData.obfuscatedUsername).toBe('hello');
    });

    test('custom obfuscator value reaches the validator body', async () => {
        CdvPurchase.store.applicationUsername = 'alice';
        CdvPurchase.store.obfuscator = (u, p) => `cf-${p}-${u}`;
        const body = await captureRequestBody(CdvPurchase.Platform.GOOGLE_PLAY, CdvPurchase.store);
        expect(body.additionalData.obfuscatedUsername).toBe('cf-android-playstore-alice');
    });
});
