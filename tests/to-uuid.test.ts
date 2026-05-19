import '../www/store';

describe('Utils.md5toUUID', () => {
    test('converts MD5 hash to UUIDv3-like format', () => {
        // MD5 of "hello" is 5d41402abc4b2a76b9719d911017c592
        // UUIDv3 format: xxxxxxxx-xxxx-3xxx-8xxx-xxxxxxxxxxxx
        // Position 12: version '3', position 16: variant '8'
        const result = CdvPurchase.Utils.md5toUUID('hello');
        expect(result).toBe('5d41402a-bc4b-3a76-8971-9d911017c592');
    });

    test('produces valid UUID format', () => {
        const result = CdvPurchase.Utils.md5toUUID('test');
        expect(result).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });

    test('version nibble is 3 (UUIDv3)', () => {
        const result = CdvPurchase.Utils.md5toUUID('hello');
        expect(result?.charAt(14)).toBe('3');
    });

    test('variant nibble is 8 (RFC 4122)', () => {
        const result = CdvPurchase.Utils.md5toUUID('hello');
        expect(result?.charAt(19)).toBe('8');
    });

    test('is deterministic', () => {
        expect(CdvPurchase.Utils.md5toUUID('user1')).toBe(CdvPurchase.Utils.md5toUUID('user1'));
    });

    test('different inputs produce different outputs', () => {
        expect(CdvPurchase.Utils.md5toUUID('user1')).not.toBe(CdvPurchase.Utils.md5toUUID('user2'));
    });

    test('returns empty string for empty input', () => {
        expect(CdvPurchase.Utils.md5toUUID('')).toBe('');
    });

    test('preserves remaining MD5 hex in UUID', () => {
        // MD5 of "a" is 0cc175b9c0f1b6a831c399e269772661
        const result = CdvPurchase.Utils.md5toUUID('a');
        const md5 = CdvPurchase.Utils.md5('a');
        // First 8 hex chars of UUID should match first 8 of MD5
        expect(result.substring(0, 8)).toBe(md5.substring(0, 8));
        // Last 12 hex chars of UUID should match last 12 of MD5
        expect(result.substring(24)).toBe(md5.substring(20));
    });
});
