namespace CdvPurchase {
    export namespace Utils {

        /** @internal */
        export function delay(fn: () => void, milliseconds: number) {
            return setTimeout(fn, milliseconds);
        }

        /** @internal */
        export function debounce(fn: () => void, milliseconds: number): () => void {
            return createDebouncer(fn, milliseconds).call;
        }

        /** @internal */
        export function createDebouncer(fn: () => void, milliseconds: number): Debouncer {
            let timeout: any | null = null;
            let waiting: (() => void)[] = [];
            const later = function (context: any, args: any) {
                const toCall = waiting;
                waiting = [];
                timeout = null;
                fn();
                toCall.forEach(fn => fn());
            };
            const debounced = function () {
                if (timeout) window.clearTimeout(timeout);
                timeout = setTimeout(later, milliseconds);
            }
            return {
                call: debounced,
                wait: () => new Promise(resolve => {
                    if (timeout)
                        waiting.push(resolve);
                    else
                        resolve();
                })
            };
        }

        /** @internal */
        export function asyncDelay(milliseconds: number): Promise<void> {
            return new Promise(resolve => setTimeout(resolve, milliseconds));
        }

        /** @internal */
        export interface Debouncer {
            call: () => void;
            wait: () => Promise<void>;
        }
    }
}
