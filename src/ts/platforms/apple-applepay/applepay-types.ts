namespace CdvPurchase {

  /**
   * Define types for ApplePay
   *
   * At the moment Apple Pay is only supported as an extension for Braintree.
   */
  export namespace ApplePay {

    /**
     * Request for payment with Apple Pay.
     *
     * Including information about payment processing capabilities, the payment amount, and shipping information.
     *
     * Details here: {@link https://developer.apple.com/documentation/passkit/pkpaymentrequest/}
     */
    export interface PaymentRequest {

      /* decimal number in a string (example "12.99") *
      amount: string;

      ** payment description *
      description?: string;
      */

      /**
       * Apple Pay Merchant ID
       *
       * When using Braintree, this field is automatically populated.
       *
       * This value must match one of the merchant identifiers specified by the Merchant IDs Entitlement
       * key in the app’s entitlements.
       *
       * For more information on adding merchant IDs, see Configure Apple Pay (iOS, watchOS).
       */
      merchantIdentifier?: string;

      /**
       * Payment processing protocols and card types that you support.
       *
       * ### Discussion
       *
       * The "ThreeDS" and "EMV" values of ApplePayMerchantCapability specify the supported
       * cryptographic payment protocols. At least one of these two values is required.
       *
       * Check with your payment processors about the cryptographic payment protocols they support.
       * As a general rule, if you want to support China UnionPay cards, you use EMV.
       *
       * To support cards from other networks—like American Express, Visa, or Mastercard—use ThreeDS.
       *
       * To filter the types of cards to make available for the transaction, pass the "Credit"
       * and "Debit" values. If neither is passed, all card types will be available.
       */
      merchantCapabilities: MerchantCapability[];

      /**
       * The three-letter ISO 4217 currency code that determines the currency this payment request uses.
       *
       * When using Braintree, this field is automatically populated.
       */
      currencyCode?: string;

      /**
       * A list of ISO 3166 country codes to limit payments to cards from specific countries or regions.
       */
      supportedCountries?: string[];

      /**
       * The merchant’s two-letter ISO 3166 country code.
       *
       * When using Braintree, this field is automatically populated.
       */
      countryCode?: string;

      /**
       * An array of payment summary item objects that summarize the amount of the payment.
       *
       * Discussion
       *
       * A typical transaction includes separate summary items for the order total, shipping cost, tax, and the grand total.
       *
       * Apple Pay uses the last item in the paymentSummaryItems array as the grand total for the purchase shown in Listing 1. The PKPaymentAuthorizationViewController class displays this item differently than the rest of the summary items. As a result, there are additional requirements placed on both its amount and its label.
       *
       * - Set the grand total amount to the sum of all the other items in the array. This amount must be greater than or equal to zero.
       * - Set the grand total label to the name of your company. This label represents the person or company receiving payment.
       *
       * Your payment processor might have additional requirements, such as a minimum or maximum payment amount.
       *
       * In iOS 15 and later you can create three different types of payment summary items:
       *
       * - Use a PaymentSummaryItem for an immediate payment.
       * - Use a DeferredPaymentSummaryItem for a payment that occurs in the future, such as a pre-order.
       * - Use a RecurringPaymentSummaryItem for a payment that occurs more than once, such as a subscription.
       *
       * Note
       * In versions of iOS prior to version 12.0 and watchOS prior to version 5.0, the amount of the grand total must be greater than zero.
       */
      paymentSummaryItems?: PaymentSummaryItem[];

      /**
       * The payment methods that you support.
       *
       * When using Braintree, this field is automatically populated (so the value is not used).
       *
       * ### Discussion
       *
       * This property constrains the payment methods that the user can select to fund the payment.
       * For possible values, see ApplePayPaymentNetwork.
       *
       * In macOS 12.3, iOS 15.4, watchOS 8.5, and Mac Catalyst 15.4 or later, specify payment
       * methods in the order you prefer.
       *
       * For example, to specify the default network to use for cobadged cards, set the first element
       * in the array to the default network, and alternate networks afterward in the order you
       * prefer.
       *
       * ### Note
       *
       * Apps supporting debit networks should check for regional regulations. For more information, see Complying with Regional Regulations.
       */
      supportedNetworks?: PaymentNetwork[];

      /**
       * Prepopulated billing address.
       *
       * If you have an up-to-date billing address on file, you can set it here.
       * This billing address appears in the payment sheet.
       * The user can either use the address you specify or select a different address.
       *
       * Note that a Contact object that represents a billing contact contains information for
       * only the postalAddress property. All other properties in the object are undefined.
       */
      billingContact?: Contact;

      /**
       * Prepopulated shipping address.
       *
       * If you have an up-to-date shipping address on file, you can set this property to that address.
       * This shipping address appears in the payment sheet.
       * When the view is presented, the user can either keep the address you specified
       * or enter a different address.
       *
       * Note that a Contact object that represents a shipping contact contains information for
       * only the postalAddress, emailAddress, and phoneNumber properties.
       * All other properties in the object are undefined.
       */
      shippingContact?: Contact;

      /** A list of fields that you need for a billing contact in order to process the transaction. */
      requiredBillingContactFields?: ContactField[];

      /** A list of fields that you need for a shipping contact in order to process the transaction. */
      requiredShippingContactFields?: ContactField[];

      /**
       * The initial coupon code for the payment request.
       *
       * Set the value to undefined or the empty string to indicate that there’s no initial coupon.
       */
      couponCode?: string;

      /**
       * A Boolean value that determines whether the payment sheet displays the coupon code field.
       *
       * Set the value to true to display the coupon code field.
       */
      supportsCouponCode?: boolean;

      /** List of supported shipping methods for the user to chose from.
       *
       * @example
       * paymentRequest.shippingMethods = [{
       *   label: "Free Shipping",
       *   amount: "0.00",
       *   identifier: "free",
       *   detail: "Arrive by July 2"
       * }, {
       *   label: "Standard Shipping",
       *   amount: "3.29",
       *   identifier: "standard",
       *   detail: "Arrive by June 29"
       * }, {
       *   label: "Express Shipping",
       *   amount: "24.69",
       *   identifier: "express",
       *   detail: "Ships withing 24h"
       * }];
       */
      shippingMethods?: ShippingMethod[];
    }

    /**
     * Summary item in a payment request—for example, total, tax, discount, or grand total.
     *
     * @see {@link https://developer.apple.com/documentation/passkit/pkpaymentrequest/1619231-paymentsummaryitems}
     */
    export interface PaymentSummaryItem {

      /** Short, localized description of the item. */
      label: string;

      /**
       * Summary item’s amount.
       *
       * The amount’s currency is specified at the payment level by setting a
       * value for the currencyCode property on the request.
       */
      amount: string;

      /** Type that indicates whether the amount is final. */
      type?: SummaryItemType;
    }

    /**
     * An object that defines a summary item for a payment that’s charged at a later date, such as a pre-order.
     */
    export interface DeferredPaymentSummaryItem extends PaymentSummaryItem {
      /**
       * The date, in the future, of the payment.
       *
       * In milliseconds since epoch.
       */
      deferredDate?: number;
    }

    /**
     * An object that defines a summary item for a payment that occurs repeatedly at a specified interval, such as a subscription.
     *
     * RecurringPaymentSummaryItem is a subclass of PaymentSummaryItemType and inherits all properties of the parent class.
     *
     * Add a summary item of this type to the paymentSummaryItems property of a PaymentRequest to display to the user a recurring payment in the summary items on the payment sheet.
     *
     * To describe a recurring payment, set the summary item values as follows:
     * - In the amount property, provide the billing amount for the set interval, for example, the amount charged per week if the intervalUnit is a week.
     * - Omit the type property. The summary item type is only relevant for the PKPaymentSummaryItem parent class.
     * - Set the startDate and endDate to represent the term for the recurring payments, as appropriate.
     * - Set the intervalUnit, intervalCount, and endDate to specify a number of repeating payments.
     */
    export interface RecurringPaymentSummaryItem extends PaymentSummaryItem {

      /**
       * The date of the first payment. The default value is undefined which requests the first payment as part of the initial transaction.
       *
       * In milliseconds since epoch.
       */

      startDate?: number;
      /**
       * The date of the final payment. The default value is nil which specifies no end date.
       *
       * In milliseconds since epoch.
       */
      endDate?: number;

      /**
       * The amount of time – in calendar units such as day, month, or year – that represents a fraction of the total payment interval.
       *
       * Note. "Week" is not supported.
       */
      intervalUnit: IPeriodUnit;

      /** The number of interval units that make up the total payment interval. */
      intervalCount: number;
    }

    export type SummaryItemType = "final" | "pending";

    /** Shipping method for delivering physical goods. */
    export interface ShippingMethod extends PaymentSummaryItem {

      /** A unique identifier for the shipping method, used by the app. */
      identifier?: string;

      /** A user - readable description of the shipping method. */
      detail?: string;

      /*
      Unsupported.
      An expected range of delivery or shipping dates for a package, or the time range when an item is available for pickup.
      dateComponentsRange?: { start: {day, month, year}, end: {day, month, year}};
      */
    }

    /** The fields that describe a contact. */
    export enum ContactField {
      Name = 'name',
      EmailAddress = 'emailAddress',
      PhoneNumber = 'phoneNumber',
      PostalAddress = 'postalAddress',
      PhoneticName = 'phoneticName',
    }

    export interface Contact {

      /** Contact's name. */
      name?: string;

      /** Contact's email address. */
      emailAddress?: string;

      /** Contact's telephone number. */
      phoneNumber?: string;

      /** The contact’s full street address including name, street, city, state or province, postal code, and country or region */
      postalAddress?: PostalAddress;

      /**
       * Contact’s sublocality, or undefined if the sublocality is not needed for the transaction.
       *
       * @deprecated
       */
      supplementarySubLocality?: string;
    }

    /** Postal address for a contact. */
    export interface PostalAddress {
      /** The street name in a postal address. */
      street?: string;
      /** The city name in a postal address. */
      city?: string;
      /** The state name in a postal address. */
      state?: string;
      /** The postal code in a postal address. */
      postalCode?: string;
      /** The country or region name in a postal address. */
      country?: string;
      /** The ISO country code for the country or region in a postal address, using the ISO 3166-1 alpha-2 standard. */
      ISOCountryCode?: string;
      /** The subadministrative area (such as a county or other region) in a postal address. */
      subAdministrativeArea?: string;
      /** Additional information associated with the location, typically defined at the city or town level, in a postal address. */
      subLocality?: string;
    }

    /** A type that represents a payment method. */
    export enum PaymentNetwork {
      /** An American Express payment card. */
      Amex = "Amex",
      /** A QR code used for payment. */
      Barcode = "Barcode",
      /** A Cartes Bancaires payment card. */
      CartesBancaires = "CartesBancaires",
      /** A China Union Pay payment card. */
      ChinaUnionPay = "ChinaUnionPay",
      /** The Dankort payment card. */
      Dankort = "Dankort",
      /** A Discover payment card. */
      Discover = "Discover",
      /** The electronic funds transfer at point of sale (EFTPOS) payment method. */
      Eftpos = "Eftpos",
      /** An Electron debit card. */
      Electron = "Electron",
      /** The Elo payment card. */
      Elo = "Elo",
      /** A Girocard payment method. */
      Girocard = "Girocard",
      /** An iD payment card. */
      IDCredit = "IDCredit",
      /** The Interac payment method. */
      Interac = "Interac",
      /** A JCB payment card. */
      JCB = "JCB",
      /** A mada payment card. */
      Mada = "Mada",
      /** A Maestro payment card. */
      Maestro = "Maestro",
      /** A MasterCard payment card. */
      MasterCard = "MasterCard",
      /** A Mir payment card. */
      Mir = "Mir",
      /** A Nanaco payment card. */
      Nanaco = "Nanaco",
      /** Store credit and debit cards. */
      PrivateLabel = "PrivateLabel",
      /** A QUICPay payment card. */
      QuicPay = "QuicPay",
      /** A Suica payment card. */
      Suica = "Suica",
      /** A Visa payment card. */
      Visa = "Visa",
      /** A Visa V Pay payment card. */
      VPay = "VPay",
      /** A WAON payment card. */
      Waon = "Waon",
    }

    /** Capabilities for processing payment. */
    export enum MerchantCapability {
      /** Support for the 3-D Secure protocol. */
      ThreeDS = "3DS",
      /** Support for the EMV protocol. */
      EMV = "EMV",
      /** Support for credit cards. */
      Credit = "Credit",
      /** Support for debit cards. */
      Debit = "Debit",
    }

    //
    // PAYMENT
    //

    export interface PaymentMethod {
      /**
       * A string, suitable for display, that describes the card.
       *
       * ### Discussion
       *
       * The display name enables a user to recognize a particular card from a list of cards.
       *
       * For debit and credit cards, the display name often includes the card brand and the
       * last four digits of the credit card number when available, for example: “Visa 1233”,
       * “MasterCard 5678”, “AmEx 9876”. For Apple Pay Cash cards, the display name is “Apple Pay Cash”.
       * However, there is no standard format for the display name’s content.
       *
       * To protect the user’s privacy, Apple Pay sets the display name only after the user
       * authorizes the purchase. You can safely access this property as soon as the system calls
       * your delegate’s paymentAuthorizationController:didAuthorizePayment:completion: method.
       */
      displayName: string;

      /**
       * A string, suitable for display, that describes the payment network for the card.
       *
       * @see {@link https://developer.apple.com/documentation/passkit/pkpaymentnetwork?language=objc}
       */
      network: string;

      /** A value that represents the card’s type. */
      type: PaymentMethodType;

      /**
       * The accompanying Secure Element pass.
       *
       * ### Discussion
       *
       * If your app has an association with the pass that is funding the payment, this property contains
       * information about that pass; otherwise, it’s undefined.
       *
       * Use this property to detect your brand of credit and debit cards.
       * For example, you can provide a discount if the user pays using your store-branded credit card.
       *
       * ### Note
       *
       * To be able to access the pass, the issuer must add your App ID to the pass when it provisions it.
       * To add your App ID to these passes, contact the bank that issues your cards or the person who
       * manages your cobrand program.
       */
      secureElementPass?: SecureElementPass;

      billingAddress?: CNContact;
    }

    /**
     * An object that stores information about a single contact, such as the contact's first name, phone numbers, and addresses.
     */
    export interface CNContact {

      /** the contact type. */
      contactType?: "Person" | "Organization";

      /**
       * A value that uniquely identifies a contact on the device.
       *
       * It is recommended that you use the identifier when re-fetching the contact.
       * An identifier can be persisted between the app launches. Note that this identifier only
       * uniquely identifies the contact on the current device.
       */
      identifier?: string;

      /**
       * The name prefix of the contact.
       */
      namePrefix?: string;

      /**
       * The given name of the contact.
       *
       * The given name is often known as the first name of the contact.
       */
      givenName?: string;

      /** The middle name of the contact. */
      middleName?: string;

      /**
       * A string for the previous family name of the contact.
       *
       * The previous family name is often known as the maiden name of the contact.
       */
      previousFamilyName?: string;

      /**
       * The name suffix of the contact.
       */
      nameSuffix?: string;

      /** Nickname */
      nickname?: string;

      /** The name of the organization associated with the contact. */
      organizationName?: string;

      /** The name of the department associated with the contact. */
      departmentName?: string;

      /** The contact’s job title. */
      jobTitle?: string;

      /** A string containing notes for the contact. */
      note?: string;

      /** An array of phone numbers for a contact. */
      phoneNumbers?: string[];

      /** An array of email addresses for the contact. */
      emailAddresses?: string[];

      /** An array of URL addresses for a contact. */
      urlAddresses?: string[];

      phoneticGivenName?: string;
      phoneticMiddleName?: string;
      phoneticFamilyName?: string;
      phoneticOrganizationName?: string;
    }

    /**
     * A pass with a credential that the device stores in a certified payment information chip.
     *
     * THIS IS NOT SUPPORTED WITH BRAINTREE AT THE MOMENT.
     */
    export interface SecureElementPass {
      /* should not be empty, but it is */
    }

    /**
     * @see {@link https://developer.apple.com/documentation/passkit/pkpaymentmethodtype?language=objc}
     */
    export type PaymentMethodType = "Unknown" | "Debit" | "Credit" | "Prepaid" | "Store" | "EMoney";

    // export interface CNContact {
    // }

    export interface PaymentToken {

      /**
       * A unique identifier for this payment.
       *
       * This identifier is suitable for use in a receipt.
       */
      transactionIdentifier: string;

      /** Information about the card used in the transaction. */
      paymentMethod: PaymentMethod;

      /**
       * Base64 encoded UTF-8 JSON
       *
       * Send this data to your e-commerce back-end system, where it can be decrypted and submitted to your payment processor.
       *
       * @see {@link https://developer.apple.com/library/archive/documentation/PassKit/Reference/PaymentTokenJSON/PaymentTokenJSON.html#//apple_ref/doc/uid/TP40014929}
       */
      paymentData?: string;
    }

    /**
     * Represents the result of authorizing a payment request and contains payment information, encrypted in the payment token.
     *
     * @see {@link https://developer.apple.com/documentation/passkit/pkpayment?language=objc}
     */
    export interface Payment {

      /**
       * The encrypted payment information.
       *
       * @see {@link doc://com.apple.documentation/documentation/passkit/apple_pay/payment_token_format_reference?language=swift}
       */
      token: PaymentToken;

      /**
       * The user-selected shipping method for this transaction.
       *
       * A value is set for this property only if the corresponding payment request specified available
       * shipping methods in the shippingMethods property of the PaymentRequest object.
       * Otherwise, the value is undefined.
       */
      shippingMethod?: ShippingMethod;

      /**
       * The user-selected shipping address for this transaction.
       */
      shippingContact?: Contact;

      /**
       * The user-selected billing address for this transaction.
       */
      billingContact?: Contact;
    }

    export interface Contact {
    }
  }
}
