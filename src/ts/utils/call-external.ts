namespace CdvPurchase {
    export namespace Utils {
        /**
         * Calls an user-registered callback.
         *
         * Won't throw exceptions, only logs errors.
         *
         * @param name a short string describing the callback
         * @param callback the callback to call (won't fail if undefined)
         *
         * @example
         * ```js
         * Utils.callExternal(store.log, "ajax.error", options.error, 404, "Not found");
         * ```
         *
         * @internal
         */
        export function callExternal<F extends Function = Function>(log: Logger, name: string, callback: F | undefined, ...args: any): void {
            try {
                const args = Array.prototype.slice.call(arguments, 3);
                // store.log.debug("calling " + name + "(" + JSON.stringify(args2) + ")");
                if (callback) callback.apply(CdvPurchase.store, args);
            }
            catch (e) {
                log.logCallbackException(name, e as Error);
            }
        }
    }
}
