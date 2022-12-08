namespace CdvPurchase {
  export namespace Braintree {
    export namespace DropIn {

      export interface Result {

        /**
         * The previously used {@link PaymentMethod} or `undefined` if there was no
         * previous payment method. If the type is {@link PaymentMethod#GOOGLE_PAY} the Google
         * Pay flow will need to be performed by the user again at the time of checkout,
         * {@link #paymentMethodNonce()} will be `undefined` in this case.
         */
        paymentMethodType?: PaymentMethod;

        /**
         * The previous {@link PaymentMethodNonce} or `undefined` if there is no previous payment method
         * or the previous payment method was {@link com.braintreepayments.api.GooglePayCardNonce}.
         */
        paymentMethodNonce?: PaymentMethodNonce;

        /**
         * A `deviceData` string that represents data about a customer's device.
         * 
         * This is generated from Braintree's advanced fraud protection service.
         *
         * `deviceData` should be passed into server-side calls, such as `Transaction.sale`.
         * This enables you to collect data about a customer's device and correlate it with a session identifier on your server.
         *
         * Collecting and passing this data with transactions helps reduce decline rates and detect fraudulent transactions.
         */
        deviceData?: string;

        /**
         * A description of the payment method.
         * 
         * - For cards, the last four digits of the card number.
         * - For PayPal, the email address associated with the account.
         * - For Venmo, the username associated with the account.
         * - For Apple Pay, the text "Apple Pay".
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

        /**
         * The type of the tokenized data, e.g. PayPal, Venmo, MasterCard, Visa, Amex.
         * 
         * (iOS Only)
         */
        type?: string;
      }

      /** Payment method used or selected by the user. */
      export enum PaymentMethod {
        /** Google only */
        GOOGLE_PAY = "GOOGLE_PAY",
        /** ios only */
        LASER = "LASER",
        /** ios only */
        UK_MAESTRO = "UK_MAESTRO",
        /** ios only */
        SWITCH = "SWITCH",
        /** ios only */
        SOLOR = "SOLO",
        /** ios only */
        APPLE_PAY = "APPLE_PAY",
        AMEX = "AMEX",
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