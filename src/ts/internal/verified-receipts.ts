namespace CdvPurchase {
  export namespace Internal {

    /** Analyze the list of local receipts. */
    export class VerifiedReceipts {

      /**
       * Find the last verified purchase for a given product, from those verified by the receipt validator.
       */
      static find(verifiedReceipts: VerifiedReceipt[], product?: { id: string; platform?: Platform }): VerifiedPurchase | undefined {
        if (!product) return undefined;
        let found: VerifiedPurchase | undefined;
        for (const receipt of verifiedReceipts) {
          if (product.platform && receipt.platform !== product.platform) continue;
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
      static isOwned(verifiedReceipts: VerifiedReceipt[], product?: { id: string; platform?: Platform }) {
        if (!product) return false;
        const purchase = VerifiedReceipts.find(verifiedReceipts, product);
        if (!purchase) return false;
        if (purchase?.isExpired) return false;
        if (purchase?.expiryDate) {
          return (purchase.expiryDate > +new Date());
        }
        return true;
      }

      static getVerifiedPurchases(verifiedReceipts: VerifiedReceipt[]): VerifiedPurchase[] {
        const indexed: { [key: string]: VerifiedPurchase } = {};
        for (const receipt of verifiedReceipts) {
          for (const purchase of receipt.collection) {
            const key = receipt.platform + ':' + purchase.id;
            const existing = indexed[key];
            if (!existing || (existing && (existing.lastRenewalDate ?? existing.purchaseDate ?? 0) < (purchase.lastRenewalDate ?? purchase.purchaseDate ?? 0))) {
              indexed[key] = { ...purchase, platform: receipt.platform };
            }
          }
        }
        return Object.keys(indexed).map(key => indexed[key]);
      }

    }
  }
}
