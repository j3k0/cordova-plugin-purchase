namespace CdvPurchase {
  export namespace Braintree {
    /** Parameters for a payment with Braintree */

    /**
     * Data for a Braintree payment request.
     */
    export interface AdditionalData {

      /**
       * Specify the full DropIn Request parameters for full customization.
       *
       * When set, this takes precedence over all other options.
       */
      dropInRequest?: DropIn.Request;
    }
  }
}
