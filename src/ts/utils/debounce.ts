namespace CdvPurchase {
    export namespace Utils {

        /** @internal */
        export function delay(fn: () => void, milliseconds: number) {
            return setTimeout(fn, milliseconds);
        }

        /** @internal */
        export function debounce(fn: () => void, milliseconds: number): () => void {
            let timeout: any | null = null;
            const later = function (context: any, args: any) {
                timeout = null;
                fn();
            };
            const debounced = function () {
                if (timeout) window.clearTimeout(timeout);
                timeout = setTimeout(later, milliseconds);
            }
            return debounced;
        }

        export function asyncDelay(milliseconds: number): Promise<void> {
            return new Promise(resolve => setTimeout(resolve, milliseconds));
        }
    }
}
