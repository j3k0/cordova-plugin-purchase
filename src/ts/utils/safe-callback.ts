namespace CdvPurchase {
  export namespace Utils {

    /**
     * Return a safer version of a callback that runs inside a try/catch block.
     *
     * @param logger - Used to log errors.
     * @param className - Type of callback, helps debugging when a function failed.
     * @param callback - The callback function is turn into a safer version.
     */
    export function safeCallback<T>(logger: Logger, className: string, callback: Callback<T>, callbackName: string | undefined, reason: string): Callback<T> {
      return function (value: T) {
        safeCall(logger, className, callback, value, callbackName, reason);
      }
    }

    /**
     * Run a callback inside a try/catch block.
     *
     * @param logger - Used to log errors.
     * @param className - Type of callback, helps debugging when a function failed.
     * @param callback - The callback function is turn into a safer version.
     * @param value - Value passed to the callback.
     */
    export function safeCall<T>(logger: Logger, className: string, callback: Callback<T>, value: T, callbackName: string | undefined, reason: string): void {
      if (!callbackName) {
        callbackName = callback.name || ('#' + md5(callback.toString()));
      }
      setTimeout(() => {
        try {
          logger.debug(`Calling callback: type=${className} name=${callbackName} reason=${reason}`);
          callback(value);
        }
        catch (error) {
          logger.error(`Error in callback: type=${className} name=${callbackName} reason=${reason}`);
          logger.debug(callback.toString());
          const errorAsError = error as Error;
          if ('message' in errorAsError)
            logger.error(errorAsError.message);
          if ('fileName' in (error as any))
            logger.error('in ' + (error as any).fileName + ':' + (error as any).lineNumber);
          if ('stack' in errorAsError)
            logger.error(errorAsError.stack);
        }
      }, 0);
    }
  }
}
