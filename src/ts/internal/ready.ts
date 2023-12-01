namespace CdvPurchase {

    /** @internal */
    export namespace Internal {
        /**
         * Ready callbacks
         */
        export class ReadyCallbacks {

            /** True when the plugin is ready */
            isReady = false;

            /** Callbacks when the store is ready */
            readyCallbacks: Callback<void>[] = [];

            /** Logger */
            logger: Logger;

            constructor(logger: Logger) {
                this.logger = logger;
            }

            /** Register a callback to be called when the plugin is ready. */
            add(cb: Callback<void>): unknown {
                if (this.isReady) return setTimeout(cb, 0);
                this.readyCallbacks.push(cb);
            }

            /** Calls the ready callbacks */
            trigger(reason: string): void {
                this.isReady = true;
                this.readyCallbacks.forEach(cb => Utils.safeCall(this.logger, 'ready()', cb, undefined, undefined, reason));
                this.readyCallbacks = [];
            }

            remove(cb: Callback<void>): void {
                this.readyCallbacks = this.readyCallbacks.filter(el => el !== cb);
            }
        }
    }
}
