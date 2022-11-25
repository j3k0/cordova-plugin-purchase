namespace CdvPurchase {

    export namespace Internal {

        /**
         * Manage a list of callbacks
         */
        export class Callbacks<T> {

            /** List of registered callbacks */
            callbacks: Callback<T>[] = [];

            /** Add a callback to the list */
            push(callback: Callback<T>) {
                this.callbacks.push(callback);
            }

            /** Call all registered callbacks with the given value */
            trigger(value: T): void {
                this.callbacks.forEach(cb => setTimeout(cb, 0, value));
            }

            /** Remove a callback from the list */
            remove(callback: Callback<T>): void {
                this.callbacks = this.callbacks.filter(el => el !== callback);
            }
        }

    }
}
