namespace CdvPurchase {

    export namespace Internal {

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
             * Resolves after `adapter.getStorefront()` settles. Failure and
             * timeout handling are added in later tasks.
             */
            async refreshWith(adapter: Adapter): Promise<void> {
                if (!adapter.getStorefront) return;
                try {
                    const code = await adapter.getStorefront();
                    if (code) this.setValue(adapter.id, code);
                } catch {
                    // Adapter logs its own failures. Preserve the cached value.
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

            /** Update the cache and notify listeners on change. */
            private setValue(platform: Platform, countryCode: string): void {
                if (this.values[platform] === countryCode) return;
                this.values[platform] = countryCode;
                this.callbacks.trigger({ platform, countryCode }, 'storefront_changed');
            }
        }
    }
}
