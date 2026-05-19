import '../www/store';

describe('Store.obfuscateUsername', () => {
    afterEach(() => {
        CdvPurchase.store.obfuscator = undefined;
        (CdvPurchase.store as any)._legacyObfuscatorNoticeEmitted = false;
    });

    test('default (legacy) + GOOGLE_PLAY returns raw MD5 hash', () => {
        CdvPurchase.store.obfuscator = undefined;
        const result = CdvPurchase.store.obfuscateUsername('hello', CdvPurchase.Platform.GOOGLE_PLAY);
        // MD5 of "hello" is 5d41402abc4b2a76b9719d911017c592 (32 hex chars, no dashes)
        expect(result).toBe('5d41402abc4b2a76b9719d911017c592');
        expect(result).toHaveLength(32);
    });

    test('default (legacy) + APPLE_APPSTORE returns UUIDv3 format', () => {
        CdvPurchase.store.obfuscator = undefined;
        const result = CdvPurchase.store.obfuscateUsername('hello', CdvPurchase.Platform.APPLE_APPSTORE);
        expect(result).toBe('5d41402a-bc4b-3a76-8971-9d911017c592');
        expect(result).toHaveLength(36);
    });

    test('legacy + GOOGLE_PLAY returns raw MD5 hash', () => {
        CdvPurchase.store.obfuscator = 'legacy';
        const result = CdvPurchase.store.obfuscateUsername('hello', CdvPurchase.Platform.GOOGLE_PLAY);
        expect(result).toBe('5d41402abc4b2a76b9719d911017c592');
    });

    test('legacy + APPLE_APPSTORE returns UUIDv3 format', () => {
        CdvPurchase.store.obfuscator = 'legacy';
        const result = CdvPurchase.store.obfuscateUsername('hello', CdvPurchase.Platform.APPLE_APPSTORE);
        expect(result).toBe('5d41402a-bc4b-3a76-8971-9d911017c592');
    });

    test('uuid + any platform returns UUIDv3 format', () => {
        CdvPurchase.store.obfuscator = 'uuid';
        const google = CdvPurchase.store.obfuscateUsername('hello', CdvPurchase.Platform.GOOGLE_PLAY);
        const apple = CdvPurchase.store.obfuscateUsername('hello', CdvPurchase.Platform.APPLE_APPSTORE);
        expect(google).toBe('5d41402a-bc4b-3a76-8971-9d911017c592');
        expect(apple).toBe('5d41402a-bc4b-3a76-8971-9d911017c592');
    });

    test('disabled + any platform returns raw value', () => {
        CdvPurchase.store.obfuscator = 'disabled';
        expect(CdvPurchase.store.obfuscateUsername('user123', CdvPurchase.Platform.GOOGLE_PLAY)).toBe('user123');
        expect(CdvPurchase.store.obfuscateUsername('user123', CdvPurchase.Platform.APPLE_APPSTORE)).toBe('user123');
    });

    test('custom function receives username and platform', () => {
        CdvPurchase.store.obfuscator = (username: string, platform: CdvPurchase.Platform) => {
            return `custom-${platform}-${username}`;
        };
        expect(CdvPurchase.store.obfuscateUsername('alice', CdvPurchase.Platform.GOOGLE_PLAY)).toBe('custom-android-playstore-alice');
    });

    test('returns undefined for empty input', () => {
        CdvPurchase.store.obfuscator = 'legacy';
        expect(CdvPurchase.store.obfuscateUsername('', CdvPurchase.Platform.GOOGLE_PLAY)).toBeUndefined();
    });

    test('returns undefined for undefined obfuscator input', () => {
        CdvPurchase.store.obfuscator = 'legacy';
        expect(CdvPurchase.store.obfuscateUsername(undefined as any, CdvPurchase.Platform.GOOGLE_PLAY)).toBeUndefined();
    });

    test('legacy is deterministic', () => {
        CdvPurchase.store.obfuscator = 'legacy';
        expect(CdvPurchase.store.obfuscateUsername('user1', CdvPurchase.Platform.GOOGLE_PLAY))
            .toBe(CdvPurchase.store.obfuscateUsername('user1', CdvPurchase.Platform.GOOGLE_PLAY));
    });

    test('legacy emits info notice once', () => {
        const previousVerbosity = CdvPurchase.store.verbosity;
        CdvPurchase.store.verbosity = CdvPurchase.LogLevel.INFO;
        const logSpy = jest.spyOn(CdvPurchase.Logger.console, 'log').mockImplementation(() => {});
        CdvPurchase.store.obfuscator = 'legacy';
        CdvPurchase.store.obfuscateUsername('test1', CdvPurchase.Platform.GOOGLE_PLAY);
        CdvPurchase.store.obfuscateUsername('test2', CdvPurchase.Platform.GOOGLE_PLAY);
        const noticeCalls = logSpy.mock.calls.filter(args =>
            args.some(a => typeof a === 'string' && a.includes('store.obfuscator defaults to "legacy"')));
        expect(noticeCalls).toHaveLength(1);
        logSpy.mockRestore();
        CdvPurchase.store.verbosity = previousVerbosity;
    });
});
