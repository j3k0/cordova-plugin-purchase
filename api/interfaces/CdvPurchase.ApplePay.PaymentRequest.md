# Interface: PaymentRequest

[CdvPurchase](../modules/CdvPurchase.md).[ApplePay](../modules/CdvPurchase.ApplePay.md).PaymentRequest

Request for payment with Apple Pay.

Including information about payment processing capabilities, the payment amount, and shipping information.

Details here: [https://developer.apple.com/documentation/passkit/pkpaymentrequest/](https://developer.apple.com/documentation/passkit/pkpaymentrequest/)

## Table of contents

### Properties

- [billingContact](CdvPurchase.ApplePay.PaymentRequest.md#billingcontact)
- [countryCode](CdvPurchase.ApplePay.PaymentRequest.md#countrycode)
- [couponCode](CdvPurchase.ApplePay.PaymentRequest.md#couponcode)
- [currencyCode](CdvPurchase.ApplePay.PaymentRequest.md#currencycode)
- [merchantCapabilities](CdvPurchase.ApplePay.PaymentRequest.md#merchantcapabilities)
- [merchantIdentifier](CdvPurchase.ApplePay.PaymentRequest.md#merchantidentifier)
- [paymentSummaryItems](CdvPurchase.ApplePay.PaymentRequest.md#paymentsummaryitems)
- [requiredBillingContactFields](CdvPurchase.ApplePay.PaymentRequest.md#requiredbillingcontactfields)
- [requiredShippingContactFields](CdvPurchase.ApplePay.PaymentRequest.md#requiredshippingcontactfields)
- [shippingContact](CdvPurchase.ApplePay.PaymentRequest.md#shippingcontact)
- [shippingMethods](CdvPurchase.ApplePay.PaymentRequest.md#shippingmethods)
- [supportedCountries](CdvPurchase.ApplePay.PaymentRequest.md#supportedcountries)
- [supportedNetworks](CdvPurchase.ApplePay.PaymentRequest.md#supportednetworks)
- [supportsCouponCode](CdvPurchase.ApplePay.PaymentRequest.md#supportscouponcode)

## Properties

### billingContact

• `Optional` **billingContact**: [`Contact`](CdvPurchase.ApplePay.Contact.md)

Prepopulated billing address.

If you have an up-to-date billing address on file, you can set it here.
This billing address appears in the payment sheet.
The user can either use the address you specify or select a different address.

Note that a Contact object that represents a billing contact contains information for
only the postalAddress property. All other properties in the object are undefined.

___

### countryCode

• `Optional` **countryCode**: `string`

The merchant’s two-letter ISO 3166 country code.

When using Braintree, this field is automatically populated.

___

### couponCode

• `Optional` **couponCode**: `string`

The initial coupon code for the payment request.

Set the value to undefined or the empty string to indicate that there’s no initial coupon.

___

### currencyCode

• `Optional` **currencyCode**: `string`

The three-letter ISO 4217 currency code that determines the currency this payment request uses.

When using Braintree, this field is automatically populated.

___

### merchantCapabilities

• **merchantCapabilities**: [`MerchantCapability`](../enums/CdvPurchase.ApplePay.MerchantCapability.md)[]

Payment processing protocols and card types that you support.

### Discussion

The "ThreeDS" and "EMV" values of ApplePayMerchantCapability specify the supported
cryptographic payment protocols. At least one of these two values is required.

Check with your payment processors about the cryptographic payment protocols they support.
As a general rule, if you want to support China UnionPay cards, you use EMV.

To support cards from other networks—like American Express, Visa, or Mastercard—use ThreeDS.

To filter the types of cards to make available for the transaction, pass the "Credit"
and "Debit" values. If neither is passed, all card types will be available.

___

### merchantIdentifier

• `Optional` **merchantIdentifier**: `string`

Apple Pay Merchant ID

When using Braintree, this field is automatically populated.

This value must match one of the merchant identifiers specified by the Merchant IDs Entitlement
key in the app’s entitlements.

For more information on adding merchant IDs, see Configure Apple Pay (iOS, watchOS).

___

### paymentSummaryItems

• `Optional` **paymentSummaryItems**: [`PaymentSummaryItem`](CdvPurchase.ApplePay.PaymentSummaryItem.md)[]

An array of payment summary item objects that summarize the amount of the payment.

Discussion

A typical transaction includes separate summary items for the order total, shipping cost, tax, and the grand total.

Apple Pay uses the last item in the paymentSummaryItems array as the grand total for the purchase shown in Listing 1. The PKPaymentAuthorizationViewController class displays this item differently than the rest of the summary items. As a result, there are additional requirements placed on both its amount and its label.

- Set the grand total amount to the sum of all the other items in the array. This amount must be greater than or equal to zero.
- Set the grand total label to the name of your company. This label represents the person or company receiving payment.

Your payment processor might have additional requirements, such as a minimum or maximum payment amount.

In iOS 15 and later you can create three different types of payment summary items:

- Use a PaymentSummaryItem for an immediate payment.
- Use a DeferredPaymentSummaryItem for a payment that occurs in the future, such as a pre-order.
- Use a RecurringPaymentSummaryItem for a payment that occurs more than once, such as a subscription.

Note
In versions of iOS prior to version 12.0 and watchOS prior to version 5.0, the amount of the grand total must be greater than zero.

___

### requiredBillingContactFields

• `Optional` **requiredBillingContactFields**: [`ContactField`](../enums/CdvPurchase.ApplePay.ContactField.md)[]

A list of fields that you need for a billing contact in order to process the transaction.

___

### requiredShippingContactFields

• `Optional` **requiredShippingContactFields**: [`ContactField`](../enums/CdvPurchase.ApplePay.ContactField.md)[]

A list of fields that you need for a shipping contact in order to process the transaction.

___

### shippingContact

• `Optional` **shippingContact**: [`Contact`](CdvPurchase.ApplePay.Contact.md)

Prepopulated shipping address.

If you have an up-to-date shipping address on file, you can set this property to that address.
This shipping address appears in the payment sheet.
When the view is presented, the user can either keep the address you specified
or enter a different address.

Note that a Contact object that represents a shipping contact contains information for
only the postalAddress, emailAddress, and phoneNumber properties.
All other properties in the object are undefined.

___

### shippingMethods

• `Optional` **shippingMethods**: [`ShippingMethod`](CdvPurchase.ApplePay.ShippingMethod.md)[]

List of supported shipping methods for the user to chose from.

**`Example`**

```ts
paymentRequest.shippingMethods = [{
  label: "Free Shipping",
  amount: "0.00",
  identifier: "free",
  detail: "Arrive by July 2"
}, {
  label: "Standard Shipping",
  amount: "3.29",
  identifier: "standard",
  detail: "Arrive by June 29"
}, {
  label: "Express Shipping",
  amount: "24.69",
  identifier: "express",
  detail: "Ships withing 24h"
}];
```

___

### supportedCountries

• `Optional` **supportedCountries**: `string`[]

A list of ISO 3166 country codes to limit payments to cards from specific countries or regions.

___

### supportedNetworks

• `Optional` **supportedNetworks**: [`PaymentNetwork`](../enums/CdvPurchase.ApplePay.PaymentNetwork.md)[]

The payment methods that you support.

When using Braintree, this field is automatically populated (so the value is not used).

### Discussion

This property constrains the payment methods that the user can select to fund the payment.
For possible values, see ApplePayPaymentNetwork.

In macOS 12.3, iOS 15.4, watchOS 8.5, and Mac Catalyst 15.4 or later, specify payment
methods in the order you prefer.

For example, to specify the default network to use for cobadged cards, set the first element
in the array to the default network, and alternate networks afterward in the order you
prefer.

### Note

Apps supporting debit networks should check for regional regulations. For more information, see Complying with Regional Regulations.

___

### supportsCouponCode

• `Optional` **supportsCouponCode**: `boolean`

A Boolean value that determines whether the payment sheet displays the coupon code field.

Set the value to true to display the coupon code field.
