namespace CdvPurchase {
  export namespace Internal {
    export class PromiseLike<T> {

      resolved: boolean = false;
      resolvedArgument?: T;

      /** List of registered callbacks */
      callbacks: Callback<T>[] = [];

      /** Add a callback to the list */
      push(callback: Callback<T>) {
        if (this.resolved)
          setTimeout(callback, 0, this.resolvedArgument);
        else
          this.callbacks.push(callback);
      }

      /** Call all registered callbacks with the given value */
      resolve(value: T): void {
        if (this.resolved) return; // do not resolve twice
        this.resolved = true;
        this.resolvedArgument = value;
        this.callbacks.forEach(cb => setTimeout(cb, 0, value));
        this.callbacks = [];
      }
    }
  }
}
