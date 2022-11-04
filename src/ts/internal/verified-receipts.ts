namespace CdvPurchase {
  export namespace Internal {

    /** Analyze the list of local receipts. */
    export class VerifiedReceipts {

      /**
       * Find the last verified purchase for a given product, from those verified by the receipt validator.
       */
      static find(verifiedReceipts: VerifiedReceipt[], product?: Product): VerifiedPurchase | undefined {
        if (!product) return undefined;
        let found: VerifiedPurchase | undefined;
        for (const receipt of verifiedReceipts) {
          if (receipt.platform !== product.platform) continue;
          for (const purchase of receipt.collection) {
            if (purchase.id === product.id) {
              if ((found?.purchaseDate ?? 0) < (purchase.purchaseDate ?? 1))
                found = purchase;
            }
          }
        }
        return found;
      }

      /** Return true if a product is owned, based on the content of the list of verified receipts  */
      static isOwned(verifiedReceipts: VerifiedReceipt[], product?: Product) {
        if (!product) return false;
        const purchase = VerifiedReceipts.find(verifiedReceipts, product);
        if (!purchase) return false;
        if (purchase?.isExpired) return true;
        if (purchase?.expiryDate) {
          return (purchase.expiryDate > +new Date());
        }
        return true;
      }
    }
  }
}
