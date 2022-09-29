namespace CDVPurchase2 {
    export namespace Utils {

        export function delay(fn: () => void, wait: number) {
            return setTimeout(fn, wait);
        }

        export function debounce(fn: () => void, wait: number): () => void {
            let timeout: any | null = null;
            const later = function (context: any, args: any) {
                timeout = null;
                fn();
            };
            const debounced = function () {
                if (timeout) window.clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            }
            return debounced;
        }
    }
}
