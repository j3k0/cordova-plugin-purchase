namespace CdvPurchase {

    /** Manage a list of callbacks */
    export class Callbacks<T> {

        callbacks: Callback<T>[] = [];

        push(callback: Callback<T>) {
            this.callbacks.push(callback);
        }

        trigger(value: T): void {
            this.callbacks.forEach(cb => setTimeout(cb, 0, value));
        }
    }
}
