namespace CdvPurchase {

  /**
   * Request for payment.
   */
  export interface PaymentRequest {

    /**
     * Products being purchased.
     * 
     * Used for your reference, does not have to be a product registered with the plugin.
     */
    productIds: string[];

    /**
     * Platform that will handle the payment request.
     */
    platform: Platform;

    /**
     * Amount to pay.
     */
    amountMicros: number;

    /**
     * Currency.
     */
    currency?: string;

    /**
     * Description for the payment.
     */
    description?: string;

    /** The email used for verification. Optional. */
    email?: string;

    /**
     * The mobile phone number used for verification. Optional.
     *
     * Only numbers. Remove dashes, parentheses and other characters.
     */
    mobilePhoneNumber?: string;

    /** The billing address used for verification. Optional. */
    billingAddress?: PostalAddress;
  }

  /**
   * Postal address for payment requests.
   */
  export interface PostalAddress {

    /** Given name associated with the address. */
    givenName?: string;

    /** Surname associated with the address. */
    surname?: string;

    /** Line 1 of the Address (eg. number, street, etc) */
    streetAddress1?: string;

    /** Line 2 of the Address (eg. suite, apt #, etc.) */
    streetAddress2?: string;

    /** Line 3 of the Address (eg. suite, apt #, etc.) */
    streetAddress3?: string;

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
    countryCode?: string;
  }
}