namespace CdvPurchase {

  /**
   * Instance of a function monitoring changes to a given transaction.
   *
   * Can be stopped with `monitor.stop()`.
   */
  export interface TransactionMonitor {

    /** Stop monitoring the transaction. */
    stop(): void;

    /** Transaction being monitored. */
    transaction: Transaction;
  }

  /** @internal */
  export namespace Internal {

    /**
     * Helper class to monitor changes in transaction states.
     *
     * @example
     * const monitor = monitors.start(transaction, (state) => {
     *   // ... transaction state has changed
     * });
     * monitor.stop();
     */
    export class TransactionStateMonitors {

      private monitors: Monitor[] = [];
      private findMonitors(transaction: Transaction): Monitor[] {
        return this.monitors.filter(monitor =>
          monitor.transaction.platform === transaction.platform
          && monitor.transaction.transactionId === transaction.transactionId);
      }

      constructor(when: When) {
        when
          .approved(transaction => this.callOnChange(transaction), 'transactionStateMonitors_callOnChange')
          .finished(transaction => this.callOnChange(transaction), 'transactionStateMonitors_callOnChange');
      }

      private callOnChange(transaction: Transaction) {
        this.findMonitors(transaction).forEach(monitor => {
          if (monitor.lastChange !== transaction.state) {
            monitor.lastChange = transaction.state;
            monitor.onChange(transaction.state);
          }
        });
      }

      /**
       * Start monitoring the provided transaction for state changes.
       */
      start(transaction: Transaction, onChange: Callback<TransactionState>): TransactionMonitor {
        const monitorId = Utils.uuidv4();
        this.monitors.push({ monitorId, transaction, onChange, lastChange: transaction.state });
        setTimeout(onChange, 0, transaction.state);
        return {
          transaction,
          stop: () => this.stop(monitorId),
        }
      }

      stop(monitorId: string) {
        this.monitors = this.monitors.filter(m => m.monitorId !== monitorId);
      }
    }

    interface Monitor {
      monitorId: string;
      transaction: {
        platform: Platform,
        transactionId: string;
      };
      onChange: Callback<TransactionState>;
      lastChange: TransactionState;
    }
  }
}
