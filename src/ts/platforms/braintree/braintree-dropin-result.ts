namespace CdvPurchase {
  export namespace Braintree {
    export namespace DropIn {

      export interface Result {

        /**
         * The previously used {@link PaymentMethod} or {@code undefined} if there was no
         * previous payment method. If the type is {@link PaymentMethod#GOOGLE_PAY} the Google
         * Pay flow will need to be performed by the user again at the time of checkout,
         * {@link #paymentMethodNonce()} will be {@code undefined} in this case.
         */
        paymentMethodType?: PaymentMethod;

        /**
         * The previous {@link PaymentMethodNonce} or {@code undefined} if there is no previous payment method
         * or the previous payment method was {@link com.braintreepayments.api.GooglePayCardNonce}.
         */
        paymentMethodNonce?: PaymentMethodNonce;

        /**
         * Device data.
         */
        deviceData?: string;

        /**
         * A description of the payment method.
         */
        paymentDescription?: string;
      }

      /**
       * A method of payment for a customer.
       * 
       * PaymentMethodNonce represents the common interface of all payment method nonces,
       * and can be handled by a server interchangeably.
       */
      export interface PaymentMethodNonce {

        /**
         * The nonce generated for this payment method by the Braintree gateway.
         * 
         * The nonce will represent this PaymentMethod for the purposes of creating transactions and other monetary actions.
         */
        nonce: string;

        /** true if this payment method is the default for the current customer, false otherwise. */
        isDefault: boolean;
      }

      export enum PaymentMethod {
        AMEX = "AMEX",
        GOOGLE_PAY = "GOOGLE_PAY",
        DINERS_CLUB = "DINERS_CLUB",
        DISCOVER = "DISCOVER",
        JCB = "JCB",
        MAESTRO = "MAESTRO",
        MASTERCARD = "MASTERCARD",
        PAYPAL = "PAYPAL",
        VISA = "VISA",
        VENMO = "VENMO",
        UNIONPAY = "UNIONPAY",
        HIPER = "HIPER",
        HIPERCARD = "HIPERCARD",
        UNKNOWN = "UNKNOWN"
      }
    }
  }
}