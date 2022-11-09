namespace CdvPurchase {
  /** @internal */
  export namespace Internal {

    /** Helper class to monitor changes in transaction states */
    export class TransactionStateMonitors {

      private monitors: Monitor[] = [];
      private findMonitors(transaction: Transaction): Monitor[] {
        return this.monitors.filter(monitor => monitor.transaction === transaction);
      }

      constructor(when: When) {
        when
          .approved(transaction => this.callOnChange(transaction))
          .finished(transaction => this.callOnChange(transaction));
      }

      private callOnChange(transaction: Transaction) {
        this.findMonitors(transaction).forEach(monitor => monitor.onChange(transaction.state));
      }

      start(transaction: Transaction, onChange: Callback<TransactionState>) {
        this.monitors.push({ transaction, onChange });
      }

      stop(transaction: Transaction, onChange: Callback<TransactionState>) {
        this.monitors = this.monitors.filter(m => m.transaction !== transaction || m.onChange !== onChange);
      }
    }

    interface Monitor {
      transaction: Transaction;
      onChange: Callback<TransactionState>;
    }
  }
}
