namespace CdvPurchase {
  export namespace Braintree {
    export namespace GooglePay {

      /**
       * Used to initialize a Google Pay payment flow.
       *
       * Represents the parameters that are needed to use the Google Pay API.
       */
      export interface Request {

        /**
         * ISO 3166-1 alpha-2 country code where the transaction is processed.
         *
         * This is required for merchants based in European Economic Area (EEA) countries.
         *
         * NOTE: to support Elo cards, country code must be set to "BR"
         */
        countryCode?: string;

        /**
         * Defines if PayPal should be an available payment method in Google Pay.
         *
         * {@code true} by default
         */
        payPalEnabled?: boolean;

        /**
         * Google Merchant ID is no longer required and will be removed.
         *
         * @deprecated Google Merchant ID is no longer required and will be removed.
         */
        googleMerchantId?: string;

        /** The merchant name that will be presented in Google Pay */
        googleMerchantName?: string;

        /** If set to true, the user must provide a billing address. */
        billingAddressRequired?: boolean;

        /* How to collect the billing address if required. */
        billingAddressFormat?: BillingAddressFormat;

        /** If set to true, the user must provide a shipping address. */
        shippingAddressRequired?: boolean;

        /** Optional shipping address requirements for the returned shipping address. */
        shippingAddressRequirements?: ShippingAddressRequirements;

        /* If set to true, the user must provide an email address. */
        emailRequired?: boolean;

        /* If set to true, the user must provide phone number. */
        phoneNumberRequired?: boolean;

        /** Set to false if you don't support prepaid cards. Default: The prepaid card class is supported. */
        allowPrepaidCards?: boolean;

        /**
         * Details and the price of the transaction.
         *
         * Automatically filled by the plugin from the `PaymentRequest`.
         */
        transactionInfo?: TransactionInfo;

        /**
         * The payment method(s) that are allowed to be used.
         */
        allowedPaymentMethod?: AllowedPaymentMethod[];

        /** A string that represents the environment in which the Google Pay API will be used (e.g. "TEST" or "PRODUCTION"). */
        environment?: string;
      }

      /**
       * A string that represents the type of payment method. This can be one of the following values:
       * - "CARD": A credit or debit card.
       * - "TOKENIZED_CARD": A tokenized credit or debit card.
       */
      export type PaymentMethodType = 'CARD' | 'TOKENIZED_CARD' | 'PAYPAL';

      /**
       * A payment method(s) that is allowed to be used.
       *
       * @example
       * {
       *   type: "CARD",
       *   parameters: {
       *     allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
       *     allowedCardNetworks: ["AMEX", "DISCOVER", "VISA", "MASTERCARD"]
       *   }
       * }
       */
      export interface AllowedPaymentMethod {
        /**
        * A string that represents the type of payment method. This can be one of the following values:
        * - "CARD": A credit or debit card.
        * - "TOKENIZED_CARD": A tokenized credit or debit card.
        */
        type: PaymentMethodType;

        /**
         * One or more card networks that you support, also supported by the Google Pay API.
         *
         * @see {@link https://developers.google.com/pay/api/android/reference/request-objects#CardParameters}
         */
        allowedCardNetworks?: string[];

        /**
         * Fields supported to authenticate a card transaction.
         *
         * @see {@link https://developers.google.com/pay/api/android/reference/request-objects#CardParameters}
         */
        allowedAuthMethods?: string[];

        /**
         * Additional parameters for the payment method. The specific parameters depend on the payment method type.
         *
         * For example "assuranceDetailsRequired", "allowCreditCards", etc.
         *
         * @see {@link https://developers.google.com/pay/api/android/reference/request-objects#CardParameters}
         */
        parameters?: { [key: string]: any }

        /**
         * Tokenization specification for this payment method type.
         */
        tokenizationSpecification?: { [key: string]: any }
      }

      export interface ShippingAddressRequirements {
        /**
         * An array of strings that represents the list of country codes (in ISO 3166-1 alpha-2 format)
         * in which the shipping address must be located.
         *
         * If this field is not empty, the shipping address must be in one of the specified countries.
         */
        allowedCountryCodes: string[];
      }

      /**
       * The Google Pay API will collect the billing address for you if required
       */
      export enum BillingAddressFormat {
        /**
         * When this format is used, the billing address returned will only contain the minimal info, including name, country code, and postal code.
         *
         * Note that some countries do not use postal codes, so the postal code field will be empty in those countries.
         */
        MIN = 0,

        /**
         * When this format is used, the billing address returned will be the full address.
         *
         * Only select this format when it's required to process the order since it can increase friction during the checkout process and can lead to a lower conversion rate.
         */
        FULL = 1,
      }

      /**
       * Represents information about a transaction.
       *
       * This interface represents information about a transaction, including the currency code (in ISO 4217 format), the total price, and the status of the total price.
       * The totalPriceStatus field is of type TotalPriceStatus, which is an enum that can take on one of the following values:
       * - TotalPriceStatus.ESTIMATED: The total price is an estimate.
       * - TotalPriceStatus.FINAL: The total price is final.
       */
      export interface TransactionInfo {
        /**
         * ISO 4217 currency code of the transaction.
         */
        currencyCode: string;

        /**
         * Total price of the transaction.
         */
        totalPrice: number;

        /**
         * Status of the total price.
         */
        totalPriceStatus: TotalPriceStatus;
      }


      /**
       * This enum represents the status of the total price of a transaction.
       *
       * It can take on one of the following values:
       * - TotalPriceStatus.NOT_CURRENTLY_KNOWN: The total price is not currently known.
       * - TotalPriceStatus.ESTIMATED: The total price is an estimate.
       * - TotalPriceStatus.FINAL: The total price is final.
       */
      export enum TotalPriceStatus {
        /** The total price is not currently known. */
        NOT_CURRENTLY_KNOWN = 1,
        /** The total price is an estimate. */
        ESTIMATED = 2,
        /** The total price is final. */
        FINAL = 3,
      }
    }
  }
}
