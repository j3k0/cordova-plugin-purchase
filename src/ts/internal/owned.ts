namespace CdvPurchase {
  export namespace Internal {

    /** Options for the {@link owned} function */
    export interface OwnedOptions {
      product: { id: string; platform?: Platform };
      verifiedReceipts?: VerifiedReceipt[];
      localReceipts?: Receipt[];
    }

    /**
     * Return true if a product is owned.
     *
     * Will use the list of verified receipts if provided.
     * Will only use the list of local receipts if verifiedReceipt is undefined.
     */
    export function owned(options: OwnedOptions) {
        if (options.verifiedReceipts !== undefined) {
          return VerifiedReceipts.isOwned(options.verifiedReceipts, options.product);
        }
        else if (options.localReceipts !== undefined) {
          return LocalReceipts.isOwned(options.localReceipts, options.product);
        }
        else {
          return false;
        }
    }
  }

}
