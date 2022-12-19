namespace CdvPurchase {
  export namespace Braintree {
    export namespace ThreeDSecure {
      /**
       * Used to initialize a 3D Secure payment flow.
       */
      export interface Request {

        /**
         * Amount for the transaction.
         *
         * String representation of a decimal number.
         *
         * Automatically filled from the `PaymentRequest`.
         */
        amount?: string;

        /**
         * A nonce to be verified by ThreeDSecure.
         */
        nonce?: string;

        /**
         *  The email used for verification. Optional.
         *
         * Automatically filled from the `PaymentRequest`
         */
        email?: string;

        /**
         * The billing address used for verification. Optional.
         *
         * Automatically filled from the `PaymentRequest`
         */
        billingAddress?: PostalAddress;

        /**
         * The mobile phone number used for verification.
         *
         * Only numbers. Remove dashes, parentheses and other characters.
         */
        mobilePhoneNumber?: string;

        /** The shipping method chosen for the transaction. */
        shippingMethod?: ShippingMethod;

        /**
         * The account type selected by the cardholder.
         *
         * Note: Some cards can be processed using either a credit or debit account and cardholders have the option to choose which account to use.
         */
        accountType?: AccountType;

        /** The additional information used for verification. */
        additionalInformation?: AdditionalInformation;

        /** Set to V2 if ThreeDSecure V2 flows are desired, when possible. Defaults to V2 */
        versionRequested?: Version;

        /** If set to true, an authentication challenge will be forced if possible. */
        challengeRequested?: boolean;

        /**  If set to true, an exemption to the authentication challenge will be requested. */
        exemptionRequested?: boolean;

        /**
         * An authentication created using this property should only be used for adding a payment method to the merchant’s vault and not for creating transactions.
         *
         * If set to true (REQUESTED), the authentication challenge will be requested from the issuer to confirm adding new card to the merchant’s vault.
         * If set to false (NOT_REQUESTED) the authentication challenge will not be requested from the issuer. If set to BTThreeDSecureAddCardChallengeUnspecified, when the amount is 0, the authentication challenge will be requested from the issuer.
         * If set to undefined (UNSPECIFIED), when the amount is greater than 0, the authentication challenge will not be requested from the issuer.
         */
        cardAddChallenge?: boolean;
      }

      /** The account type */
      export enum AccountType {
        UNSPECIFIED = "00",
        CREDIT = "01",
        DEBIT = "02",
      }

      /** The shipping method */
      export enum ShippingMethod {
        /** Unspecified */
        UNSPECIFIED = 0,
        /** Same say */
        SAME_DAY = 1,
        /** Overnight / Expedited */
        EXPEDITED = 2,
        /** Priority */
        PRIORITY = 3,
        /** Ground */
        GROUND = 4,
        /** Electronic delivery */
        ELECTRONIC_DELIVERY = 5,
        /** Ship to store */
        SHIP_TO_STORE = 6,
      }

      /** Additional information for a 3DS lookup. Used in 3DS 2.0+ flows. */
      export interface AdditionalInformation {

        /** The shipping address used for verification */
        shippingAddress?: PostalAddress;

        /**
         * The 2-digit string indicating the shipping method chosen for the transaction
         *
         * Possible Values:
         *  - "01": Ship to cardholder billing address
         *  - "02": Ship to another verified address on file with merchant
         *  - "03": Ship to address that is different than billing address
         *  - "04": Ship to store (store address should be populated on request)
         *  - "05": Digital goods
         *  - "06": Travel and event tickets, not shipped
         *  - "07": Other
         */
        shippingMethodIndicator?: "01" | "02" | "03" | "04" | "05" | "06" | "07";


        /**
         * The 3-letter string representing the merchant product code
         *
         * Possible Values:
         *  - "AIR": Airline
         *  - "GEN": General Retail
         *  - "DIG": Digital Goods
         *  - "SVC": Services
         *  - "RES": Restaurant
         *  - "TRA": Travel
         *  - "DSP": Cash Dispensing
         *  - "REN": Car Rental
         *  - "GAS": Fueld
         *  - "LUX": Luxury Retail
         *  - "ACC": Accommodation Retail
         *  - "TBD": Other
         */
        productCode?: "AIR" | "GEN" | "DIG" | "SVC" | "RES" | "TRA" | "DSP" | "REN" | "GAS" | "LUX" | "ACC" | "TBD";

        /**
         * The 2-digit number indicating the delivery timeframe
         *
         * Possible values:
         *  - "01": Electronic delivery
         *  - "02": Same day shipping
         *  - "03": Overnight shipping
         *  - "04": Two or more day shipping
         */
        deliveryTimeframe?: "01" | "02" | "03" | "04";

        /** For electronic delivery, email address to which the merchandise was delivered */
        deliveryEmail?: string;

        /**
         * The 2-digit number indicating whether the cardholder is reordering previously purchased merchandise
         *
         * Possible values:
         *  - "01": First time ordered
         *  - "02": Reordered
         */
        reorderIndicator?: "01" | "02";

        /**
         * The 2-digit number indicating whether the cardholder is placing an order with a future availability or release date
         *
         * Possible values:
         *  - "01": Merchandise available
         *  - "02": Future availability
         */
        preorderIndicator?: "01" | "02";

        /** The 8-digit number (format: YYYYMMDD) indicating expected date that a pre-ordered purchase will be available */
        preorderDate?: string;

        /** The purchase amount total for prepaid gift cards in major units */
        giftCardAmount?: string;

        /** ISO 4217 currency code for the gift card purchased */
        giftCardCurrencyCode?: string;

        /** Total count of individual prepaid gift cards purchased */
        giftCardCount?: string;

        /**
         * The 2-digit value representing the length of time cardholder has had account.
         *
         * Possible values:
         *  - "01": No account
         *  - "02": Created during transaction
         *  - "03": Less than 30 days
         *  - "04": 30-60 days
         *  - "05": More than 60 days
         */
        accountAgeIndicator?: "01" | "02" | "03" | "04" | "05";

        /** The 8-digit number (format: YYYYMMDD) indicating the date the cardholder opened the account. */
        accountCreateDate?: string;

        /** The 2-digit value representing the length of time since the last change to the cardholder account. This includes shipping address, new payment account or new user added.
         *
         * Possible values:
         *  - "01": Changed during transaction
         *  - "02": Less than 30 days
         *  - "03": 30-60 days
         *  - "04": More than 60 days
         */
        accountChangeIndicator?: "01" | "02" | "03" | "04";

        /** The 8-digit number (format: YYYYMMDD) indicating the date the cardholder's account was last changed. This includes changes to the billing or shipping address, new payment accounts or new users added. */
        accountChangeDate?: string;

        /**
         * Optional. The 2-digit value representing the length of time since the cardholder changed or reset the password on the account.
         * Possible values:
         * 01 No change
         * 02 Changed during transaction
         * 03 Less than 30 days
         * 04 30-60 days
         * 05 More than 60 days
         */
        accountPwdChangeIndicator?: "01" | "02" | "03" | "04" | "05";

        /**
         * Optional. The 8-digit number (format: YYYYMMDD) indicating the date the cardholder last changed or reset password on account.
         */
        accountPwdChangeDate?: string;

        /**
         * Optional. The 2-digit value indicating when the shipping address used for transaction was first used.
         *
         * Possible values:
         * 01 This transaction
         * 02 Less than 30 days
         * 03 30-60 days
         * 04 More than 60 days
         */
        shippingAddressUsageIndicator?: "01" | "02" | "03" | "04";

        /**
         * Optional. The 8-digit number (format: YYYYMMDD) indicating the date when the shipping address used for this transaction was first used.
         */
        shippingAddressUsageDate?: string;

        /**
         * Optional. Number of transactions (successful or abandoned) for this cardholder account within the last 24 hours.
         */
        transactionCountDay?: string;

        /**
         * Optional. Number of transactions (successful or abandoned) for this cardholder account within the last year.
         */
        transactionCountYear?: string;

        /**
         * Optional. Number of add card attempts in the last 24 hours.
         */
        addCardAttempts?: string;

        /**
         * Optional. Number of purchases with this cardholder account during the previous six months.
         */
        accountPurchases?: string;

        /**
         * Optional. The 2-digit value indicating whether the merchant experienced suspicious activity (including previous fraud) on the account.
         * Possible values:
         * 01 No suspicious activity
         * 02 Suspicious activity observed
         */
        fraudActivity?: "01" | "02";

        /**
         * Optional. The 2-digit value indicating if the cardholder name on the account is identical to the shipping name used for the transaction.
         * Possible values:
         * 01 Account name identical to shipping name
         * 02 Account name different than shipping name
         */
        shippingNameIndicator?: "01" | "02";

        /**
         * Optional. The 2-digit value indicating the length of time that the payment account was enrolled in the merchant account.
         * Possible values:
         * 01 No account (guest checkout)
         * 02 During the transaction
         * 03 Less than 30 days
         * 04 30-60 days
         * 05 More than 60 days
         */
        paymentAccountIndicator?: "01" | "02" | "03" | "04" | "05";

        /**
         * Optional. The 8-digit number (format: YYYYMMDD) indicating the date the payment account was added to the cardholder account.
         */
        paymentAccountAge?: string;

        /**
         * Optional. The 1-character value (Y/N) indicating whether cardholder billing and shipping addresses match.
         */
        addressMatch?: string;

        /**
         * Optional. Additional cardholder account information.
         */
        accountID?: string;

        /**
         * Optional. The IP address of the consumer. IPv4 and IPv6 are supported.
         */
        ipAddress?: string;

        /**
         * Optional. Brief description of items purchased.
         */
        orderDescription?: string;

        /**
         * Optional. Unformatted tax amount without any decimalization (ie. $123.67 = 12367).
         */
        taxAmount?: string;

        /**
         * Optional. The exact content of the HTTP user agent header.
         */
        userAgent?: string;

        /**
         * Optional. The 2-digit number indicating the type of authentication request.
         * Possible values:
         * 02 Recurring transaction
         * 03 Installment transaction
         */
        authenticationIndicator?: "02" | "03";

        /**
         * Optional.  An integer value greater than 1 indicating the maximum number of permitted authorizations for installment payments.
         */
        installment?: string;

        /**
         * Optional. The 14-digit number (format: YYYYMMDDHHMMSS) indicating the date in UTC of original purchase.
         */
        purchaseDate?: string;

        /**
         * Optional. The 8-digit number (format: YYYYMMDD) indicating the date after which no further recurring authorizations should be performed..
         */
        recurringEnd?: string;

        /**
         * Optional. Integer value indicating the minimum number of days between recurring authorizations. A frequency of monthly is indicated by the value 28. Multiple of 28 days will be used to indicate months (ex. 6 months = 168).
         */
        recurringFrequency?: string;

        /**
         * Optional. The 2-digit number of minutes (minimum 05) to set the maximum amount of time for all 3DS 2.0 messages to be communicated between all components.
         */
        sdkMaxTimeout?: string;

        /**
         * Optional. The work phone number used for verification. Only numbers; remove dashes, parenthesis and other characters.
         */
        workPhoneNumber?: string;
      }

      export enum Version {

        /** 3DS 1.0 */
        V1 = 0,

        /** 3DS 2.0 */
        V2 = 1,
      }

      /** The card add challenge request */
      // export enum ThreeDSecureCardAddChallenge {
      //     UNSPECIFIED = "00",
      //     REQUESTED = "01",
      //     NOT_REQUESTED = "02",
      // }

      /**
       * Postal address for 3D Secure flows.
       *
       * @link https://braintree.github.io/braintree_ios/current/Classes/BTThreeDSecurePostalAddress.html
       */
      export interface PostalAddress {

        /** Given name associated with the address. */
        givenName?: string;

        /** Surname associated with the address. */
        surname?: string;

        /** Line 1 of the Address (eg. number, street, etc) */
        streetAddress?: string;

        /** Line 2 of the Address (eg. suite, apt #, etc.) */
        extendedAddress?: string;

        /** Line 3 of the Address (eg. suite, apt #, etc.) */
        line3?: string;

        /** City name */
        locality?: string;

        /** Either a two-letter state code (for the US), or an ISO-3166-2 country subdivision code of up to three letters. */
        region?: string;

        /**
         * Zip code or equivalent is usually required for countries that have them.
         *
         * For a list of countries that do not have postal codes please refer to http://en.wikipedia.org/wiki/Postal_code
         */
        postalCode?: string;

        /**
         * The phone number associated with the address
         *
         * Note: Only numbers. Remove dashes, parentheses and other characters
         */
        phoneNumber?: string;

        /**
         * 2 letter country code
         */
        countryCodeAlpha2?: string;
      }
    }
  }
}
