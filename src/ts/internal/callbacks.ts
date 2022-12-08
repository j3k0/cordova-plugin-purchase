namespace CdvPurchase {

    export namespace Internal {

        /**
         * Manage a list of callbacks
         */
        export class Callbacks<T> {

            /** Type of callbacks */
            className: string;

            /** Log to the console */
            logger: Logger;

            /** List of registered callbacks */
            callbacks: Callback<T>[] = [];

            /**
             * @param className - Type of callbacks (used to help with debugging)
             */
            constructor(logger: Logger, className: string) {
                this.logger = logger;
                this.className = className;
            }

            /** Add a callback to the list */
            push(callback: Callback<T>) {
                this.callbacks.push(callback);
            }

            /** Call all registered callbacks with the given value */
            trigger(value: T): void {
                this.callbacks.forEach(callback => {
                    Utils.safeCall(this.logger, this.className, callback, value);
                });
            }

            /** Remove a callback from the list */
            remove(callback: Callback<T>): void {
                this.callbacks = this.callbacks.filter(el => el !== callback);
            }
        }

    }
}
