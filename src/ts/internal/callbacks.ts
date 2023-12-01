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
            callbacks: { callback: Callback<T>, callbackName?: string }[] = [];

            /** If true, newly registered callbacks will be called immediately when the event was already triggered.
             *
             * Those callbacks are used to ensure the plugin has reached a given state. */
            finalStateMode: boolean;

            /** Number of times those callbacks have been triggered */
            numTriggers: number = 0;

            /** Argument used the last time callbacks have been triggered */
            lastTriggerArgument?: T;

            /**
             * @param className - Type of callbacks (used to help with debugging)
             * @param finalStateMode - If true, newly registered callbacks will be called immediately when the event was already triggered.
             */
            constructor(logger: Logger, className: string, finalStateMode: boolean = false) {
                this.logger = logger;
                this.className = className;
                this.finalStateMode = finalStateMode;
            }

            /** Add a callback to the list */
            push(callback: Callback<T>, callbackName?: string) {
                if (this.finalStateMode && this.numTriggers > 0) {
                    callback(this.lastTriggerArgument!);
                }
                else {
                    // Detecting double registration to help with debugging issues
                    for (const existing of this.callbacks) {
                        if (existing.callback === callback) {
                            throw new Error('REGISTERING THE SAME CALLBACK TWICE? This is indicative of a bug in your integration.');
                        }
                    }
                    this.callbacks.push({ callback, callbackName });
                }
            }

            /** Call all registered callbacks with the given value */
            trigger(value: T, reason: string): void {
                this.lastTriggerArgument = value;
                this.numTriggers++;
                const callbacks = this.callbacks;
                if (this.finalStateMode) {
                    // in final state mode, callbacks are only triggered once
                    this.callbacks = [];
                }
                callbacks.forEach(callback => {
                    Utils.safeCall(this.logger, this.className, callback.callback, value, callback.callbackName, reason);
                });
            }

            /** Remove a callback from the list */
            remove(callback: Callback<T>): void {
                this.callbacks = this.callbacks.filter(el => el.callback !== callback);
            }
        }

    }
}
