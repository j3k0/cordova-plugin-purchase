namespace CdvPurchase {
  export namespace Internal {

    /** Analyze the list of local receipts. */
    export class LocalReceipts {

      /**
       * Find the latest transaction for a given product, from those reported by the device.
       */
      static find(localReceipts: Receipt[], product?: Product): Transaction | undefined {
        if (!product) return undefined;
        let found: Transaction | undefined;
        for (const receipt of localReceipts) {
          if (receipt.platform !== product.platform) continue;
          for (const transaction of receipt.transactions) {
            for (const trProducts of transaction.products) {
              if (trProducts.productId === product.id) {
                if ((transaction.purchaseDate ?? 0) < (found?.purchaseDate ?? 1))
                  found = transaction;
              }
            }
          }
        }
        return found;
      }


      /** Return true if a product is owned */
      static isOwned(localReceipts: Receipt[], product?: Product) {
        if (!product) return false;
        const transaction = LocalReceipts.find(localReceipts, product);
        if (!transaction) return false;
        if (transaction.isConsumed) return false;
        if (transaction.isPending) return false;
        if (transaction.expirationDate) return transaction.expirationDate.getTime() > +new Date();
        return true;
      }

      static canPurchase(localReceipts: Receipt[], product?: Product) {
        if (!product) return false;
        const transaction = LocalReceipts.find(localReceipts, product);
        if (!transaction) return true;
        if (transaction.isConsumed) return true;
        if (transaction.expirationDate) return transaction.expirationDate.getTime() <= +new Date();
        return true;
      }
    }
  }
}
