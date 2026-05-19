namespace CdvPurchase {
    export namespace Utils {

        /**
         * Convert a string to a UUIDv3-like format using MD5 hashing.
         *
         * Takes an input string, computes its MD5 hash, then formats the 32 hex
         * characters as a UUID with version nibble set to '3' (MD5) and variant
         * nibble set to '8' (RFC 4122).
         *
         * This produces a deterministic, valid UUID suitable for Apple's SK2
         * `appAccountToken` and Google Play's `obfuscatedAccountId`.
         *
         * @param str - The input string to hash and format
         * @returns A UUIDv3-like string (36 chars with dashes), or empty string if input is empty
         */
        export function md5toUUID(str: string): string {
            if (!str) return '';
            const hash = Utils.md5(str);
            // UUID format: xxxxxxxx-xxxx-3xxx-8xxx-xxxxxxxxxxxx
            // Position 12: version '3' (MD5), Position 16: variant '8' (RFC 4122)
            return hash.substring(0, 8) + '-'
                + hash.substring(8, 12) + '-'
                + '3' + hash.substring(13, 16) + '-'
                + '8' + hash.substring(17, 20) + '-'
                + hash.substring(20, 32);
        }
    }
}
