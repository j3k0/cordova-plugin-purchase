namespace CdvPurchase {
  export namespace Braintree {
    /** Parameters for a payment with Braintree */

    /**
     * Data for a Braintree payment request.
     */
    export interface AdditionalData {

      /**
       * Specify the full DropIn Request parameters.
       * 
       * When specified, all fields from PaymentRequest will be ignored.
       */
      dropInRequest?: DropIn.Request,

      /*
       * Payment method (default to THREE_D_SECURE)
       *
       * method?: PaymentMethod;
       */
    }
  }
}