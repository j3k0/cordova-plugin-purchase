namespace CdvPurchase {

    export namespace Internal {

        /** Default timeout for a storefront refresh call, in milliseconds. */
        const DEFAULT_STOREFRONT_REFRESH_TIMEOUT_MS = 2000;

        /**
         * Collection of per-platform storefront country codes.
         *
         * Maintains the cached value for each platform that exposes one and
         * notifies listeners when a value changes. Adapter-agnostic — callers
         * are responsible for validating that a platform has a ready adapter.
         */
        export class Storefronts {

            /** Cached country code per platform. */
            private values: Partial<Record<Platform, string>> = {};

            /** Registered change listeners. */
            private callbacks: Callbacks<Storefront>;

            constructor(logger: Logger) {
                this.callbacks = new Callbacks<Storefront>(logger, 'storefrontUpdated()');
            }

            /**
             * Refresh the cached value for a given adapter.
             *
             * The returned promise:
             *   - resolves when the adapter responds within `timeoutMs`
             *   - rejects with a timeout error otherwise
             *
             * Regardless of timeout, if the adapter eventually yields a value,
             * the cache is silently updated and listeners are notified.
             * A failed or empty response never overwrites the cache.
             */
            async refreshWith(adapter: Adapter, timeoutMs: number = DEFAULT_STOREFRONT_REFRESH_TIMEOUT_MS): Promise<void> {
                if (!adapter.getStorefront) return;
                const platform = adapter.id;

                // Start the fetch; handle result + errors independently of the race.
                const fetch = adapter.getStorefront()
                    .then(code => { if (code) this.setValue(platform, code); })
                    .catch(() => { /* adapter logs; preserve cached value */ });

                let timerId: ReturnType<typeof setTimeout>;
                const timeout = new Promise<void>((_, reject) => {
                    timerId = setTimeout(() => reject(new Error('storefront refresh timeout')), timeoutMs);
                });

                try {
                    await Promise.race([fetch, timeout]);
                } finally {
                    clearTimeout(timerId!);
                }
            }

            /**
             * Retrieve a storefront value.
             *
             * - With a platform: always returns `{ platform, countryCode }`,
             *   where `countryCode` may be undefined if nothing is cached.
             * - Without a platform: returns the first cached non-empty
             *   storefront, or `undefined` if nothing is cached.
             */
            getValueFor(platform?: Platform): Storefront | undefined {
                if (platform) {
                    return { platform, countryCode: this.values[platform] };
                }
                for (const p of Object.keys(this.values) as Platform[]) {
                    if (this.values[p]) {
                        return { platform: p, countryCode: this.values[p] };
                    }
                }
                return undefined;
            }

            /** Register a change listener. */
            listen(cb: Callback<Storefront>, callbackName?: string): void {
                this.callbacks.push(cb, callbackName);
            }

            /** Remove a previously registered listener. */
            off(cb: Callback<Storefront>): void {
                this.callbacks.remove(cb);
            }

            /** Update the cache and notify listeners on change. */
            private setValue(platform: Platform, countryCode: string): void {
                if (this.values[platform] === countryCode) return;
                this.values[platform] = countryCode;
                this.callbacks.trigger({ platform, countryCode }, 'storefront_changed');
            }
        }
    }
}
