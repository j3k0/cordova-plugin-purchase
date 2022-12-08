namespace CdvPurchase {

    export namespace Utils {

        function getCryptoExtension(): any {
            return (window.crypto || (window as any).msCrypto);
        }

        /** Returns an UUID v4. Uses `window.crypto` internally to generate random values. */
        export function uuidv4(): string {
            // @ts-ignore
            return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
                return (c ^ getCryptoExtension().getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
            });
        }
    }
}
