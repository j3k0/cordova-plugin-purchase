# Interface: Request

[Braintree](../modules/CdvPurchase.Braintree.md).[GooglePay](../modules/CdvPurchase.Braintree.GooglePay.md).Request

Used to initialize a Google Pay payment flow.

Represents the parameters that are needed to use the Google Pay API.

## Table of contents

### Properties

- [allowPrepaidCards](CdvPurchase.Braintree.GooglePay.Request.md#allowprepaidcards)
- [allowedPaymentMethod](CdvPurchase.Braintree.GooglePay.Request.md#allowedpaymentmethod)
- [billingAddressFormat](CdvPurchase.Braintree.GooglePay.Request.md#billingaddressformat)
- [billingAddressRequired](CdvPurchase.Braintree.GooglePay.Request.md#billingaddressrequired)
- [countryCode](CdvPurchase.Braintree.GooglePay.Request.md#countrycode)
- [emailRequired](CdvPurchase.Braintree.GooglePay.Request.md#emailrequired)
- [environment](CdvPurchase.Braintree.GooglePay.Request.md#environment)
- [googleMerchantId](CdvPurchase.Braintree.GooglePay.Request.md#googlemerchantid)
- [googleMerchantName](CdvPurchase.Braintree.GooglePay.Request.md#googlemerchantname)
- [payPalEnabled](CdvPurchase.Braintree.GooglePay.Request.md#paypalenabled)
- [phoneNumberRequired](CdvPurchase.Braintree.GooglePay.Request.md#phonenumberrequired)
- [shippingAddressRequired](CdvPurchase.Braintree.GooglePay.Request.md#shippingaddressrequired)
- [shippingAddressRequirements](CdvPurchase.Braintree.GooglePay.Request.md#shippingaddressrequirements)
- [transactionInfo](CdvPurchase.Braintree.GooglePay.Request.md#transactioninfo)

## Properties

### allowPrepaidCards

• `Optional` **allowPrepaidCards**: `boolean`

Set to false if you don't support prepaid cards. Default: The prepaid card class is supported.

___

### allowedPaymentMethod

• `Optional` **allowedPaymentMethod**: [`AllowedPaymentMethod`](CdvPurchase.Braintree.GooglePay.AllowedPaymentMethod.md)[]

The payment method(s) that are allowed to be used.

___

### billingAddressFormat

• `Optional` **billingAddressFormat**: [`BillingAddressFormat`](../enums/CdvPurchase.Braintree.GooglePay.BillingAddressFormat.md)

___

### billingAddressRequired

• `Optional` **billingAddressRequired**: `boolean`

If set to true, the user must provide a billing address.

___

### countryCode

• `Optional` **countryCode**: `string`

ISO 3166-1 alpha-2 country code where the transaction is processed.

This is required for merchants based in European Economic Area (EEA) countries.

NOTE: to support Elo cards, country code must be set to "BR"

___

### emailRequired

• `Optional` **emailRequired**: `boolean`

___

### environment

• `Optional` **environment**: `string`

A string that represents the environment in which the Google Pay API will be used (e.g. "TEST" or "PRODUCTION").

___

### googleMerchantId

• `Optional` **googleMerchantId**: `string`

Google Merchant ID is no longer required and will be removed.

**`Deprecated`**

Google Merchant ID is no longer required and will be removed.

___

### googleMerchantName

• `Optional` **googleMerchantName**: `string`

The merchant name that will be presented in Google Pay

___

### payPalEnabled

• `Optional` **payPalEnabled**: `boolean`

Defines if PayPal should be an available payment method in Google Pay.

{@code true} by default

___

### phoneNumberRequired

• `Optional` **phoneNumberRequired**: `boolean`

___

### shippingAddressRequired

• `Optional` **shippingAddressRequired**: `boolean`

If set to true, the user must provide a shipping address.

___

### shippingAddressRequirements

• `Optional` **shippingAddressRequirements**: [`ShippingAddressRequirements`](CdvPurchase.Braintree.GooglePay.ShippingAddressRequirements.md)

Optional shipping address requirements for the returned shipping address.

___

### transactionInfo

• `Optional` **transactionInfo**: [`TransactionInfo`](CdvPurchase.Braintree.GooglePay.TransactionInfo.md)

Details and the price of the transaction.

Automatically filled by the plugin from the `PaymentRequest`.
