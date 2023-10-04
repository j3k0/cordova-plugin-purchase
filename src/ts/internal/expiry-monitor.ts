/**
 * The platform doesn't send notifications when a subscription expires.
 *
 * However this is useful, so let's do just that.
 */
namespace CdvPurchase {

  export namespace Internal {

    /** Data and callbacks to interface with the ExpiryMonitor */
    export interface ExpiryMonitorController {

      verifiedReceipts: VerifiedReceipt[];
      // localReceipts: Receipt[];

      /** Called when a verified purchase expires */
      onVerifiedPurchaseExpired(verifiedPurchase: VerifiedPurchase, receipt: VerifiedReceipt): void;

      /** Called when a transaction expires */
      // onTransactionExpired(transaction: Transaction): void;
    }

    export class ExpiryMonitor {

      /** Time between checks for newly expired subscriptions */
      static INTERVAL_MS = 10000;

      /**
       * Extra time until re-validating an expired subscription.
       *
       * The platform will take unspecified amount of time to report the renewal via their APIs.
       * Values below have been selected via trial-and-error, might require tweaking.
       */
      static GRACE_PERIOD_MS: { [platform: string]: number } = {
        DEFAULT: 60000,
        "ios-appstore": 60000, // Apple takes longer to propagate renewals
        "android-playstore": 30000,
      }

      /** controller */
      controller: ExpiryMonitorController;

      /** reference to the function that runs at a given interval */
      interval?: number;

      /** Track active verified purchases */
      activePurchases: {
        [transactionId: string]: true;
      } = {};

      /** Track notified verified purchases */
      notifiedPurchases: {
        [transactionId: string]: true;
      } = {};

      /** Track active local transactions */
      // activeTransactions: {
      //   [transactionId: string]: true;
      // } = {};

      /** Track notified local transactions */
      // notifiedTransactions: {
      //   [transactionId: string]: true;
      // } = {};

      constructor(controller: ExpiryMonitorController) {
        this.controller = controller;
      }

      launch() {
        this.interval = setInterval(() => {
          const now = +new Date();
          // Check for verified purchases expiry
          for (const receipt of this.controller.verifiedReceipts) {
            const gracePeriod = ExpiryMonitor.GRACE_PERIOD_MS[receipt.platform] ?? ExpiryMonitor.GRACE_PERIOD_MS.DEFAULT;
            for (const purchase of receipt.collection) {
              if (purchase.expiryDate) {
                const expiryDate = purchase.expiryDate + gracePeriod;
                const transactionId = purchase.transactionId ?? `${expiryDate}`;
                if (expiryDate > now) {
                  this.activePurchases[transactionId] = true;
                }
                if (expiryDate < now && this.activePurchases[transactionId] && !this.notifiedPurchases[transactionId]) {
                  this.notifiedPurchases[transactionId] = true;
                  this.controller.onVerifiedPurchaseExpired(purchase, receipt);
                }
              }
            }
          }
          // Check for local purchases expiry
          // for (const receipt of this.controller.localReceipts) {
          //   for (const transaction of receipt.transactions) {
          //     if (transaction.expirationDate) {
          //       const expirationDate = +transaction.expirationDate + ExpiryMonitor.GRACE_PERIOD_MS;
          //       const transactionId = transaction.transactionId ?? `${expirationDate}`;
          //       if (expirationDate > now) {
          //         this.activeTransactions[transactionId] = true;
          //       }
          //       if (expirationDate < now && this.activeTransactions[transactionId] && !this.notifiedTransactions[transactionId]) {
          //         this.notifiedTransactions[transactionId] = true;
          //         this.controller.onTransactionExpired(transaction);
          //       }
          //     }
          //   }
          // }
        }, ExpiryMonitor.INTERVAL_MS);
      }
    }
  }
}
