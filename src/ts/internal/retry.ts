namespace CdvPurchase {

    export namespace Internal {
        /**
         * Retry failed requests
         *
         * When setup and/or load failed, the plugin will retry over and over till it can connect
         * to the store.
         *
         * However, to be nice with the battery, it'll double the retry timeout each time.
         *
         * Special case, when the device goes online, it'll trigger all retry callback in the queue.
         */
        export class Retry<F extends Function = Function> {

            public maxTimeout = 120000;
            public minTimeout = 5000;
            public retryTimeout = 5000;
            public retries: { tid: number, fn: F }[] = [];

            constructor(minTimeout: number = 5000, maxTimeout: number = 120000) {

                this.minTimeout = minTimeout;
                this.maxTimeout = maxTimeout;
                this.retryTimeout = minTimeout;

                document.addEventListener("online", () => {
                    const a = this.retries;
                    this.retries = [];
                    this.retryTimeout = this.minTimeout;
                    for (var i = 0; i < a.length; ++i) {
                        clearTimeout(a[i].tid);
                        a[i].fn.call(this);
                    }
                }, false);
            }

            retry(fn: F) {

                var tid = setTimeout(() => {
                    this.retries = this.retries.filter(function (o) {
                        return tid !== o.tid;
                    });
                    fn();
                }, this.retryTimeout);

                this.retries.push({ tid: tid, fn: fn });
                this.retryTimeout *= 2;

                // Max out the waiting time to 2 minutes.
                if (this.retryTimeout > this.maxTimeout)
                    this.retryTimeout = this.maxTimeout;
            }
        }
    }
}

