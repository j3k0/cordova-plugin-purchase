# Interface: AllowedPaymentMethod

[Braintree](../modules/CdvPurchase.Braintree.md).[GooglePay](../modules/CdvPurchase.Braintree.GooglePay.md).AllowedPaymentMethod

A payment method(s) that is allowed to be used.

**`Example`**

```ts
{
       *   type: "CARD",
       *   parameters: {
       *     allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
       *     allowedCardNetworks: ["AMEX", "DISCOVER", "VISA", "MASTERCARD"]
       *   }
       * }
```

## Table of contents

### Properties

- [allowedAuthMethods](CdvPurchase.Braintree.GooglePay.AllowedPaymentMethod.md#allowedauthmethods)
- [allowedCardNetworks](CdvPurchase.Braintree.GooglePay.AllowedPaymentMethod.md#allowedcardnetworks)
- [parameters](CdvPurchase.Braintree.GooglePay.AllowedPaymentMethod.md#parameters)
- [tokenizationSpecification](CdvPurchase.Braintree.GooglePay.AllowedPaymentMethod.md#tokenizationspecification)
- [type](CdvPurchase.Braintree.GooglePay.AllowedPaymentMethod.md#type)

## Properties

### allowedAuthMethods

• `Optional` **allowedAuthMethods**: `string`[]

Fields supported to authenticate a card transaction.

**`See`**

[https://developers.google.com/pay/api/android/reference/request-objects#CardParameters](https://developers.google.com/pay/api/android/reference/request-objects#CardParameters)

___

### allowedCardNetworks

• `Optional` **allowedCardNetworks**: `string`[]

One or more card networks that you support, also supported by the Google Pay API.

**`See`**

[https://developers.google.com/pay/api/android/reference/request-objects#CardParameters](https://developers.google.com/pay/api/android/reference/request-objects#CardParameters)

___

### parameters

• `Optional` **parameters**: `Object`

Additional parameters for the payment method. The specific parameters depend on the payment method type.

For example "assuranceDetailsRequired", "allowCreditCards", etc.

**`See`**

[https://developers.google.com/pay/api/android/reference/request-objects#CardParameters](https://developers.google.com/pay/api/android/reference/request-objects#CardParameters)

#### Index signature

▪ [key: `string`]: `any`

___

### tokenizationSpecification

• `Optional` **tokenizationSpecification**: `Object`

Tokenization specification for this payment method type.

#### Index signature

▪ [key: `string`]: `any`

___

### type

• **type**: [`PaymentMethodType`](../modules/CdvPurchase.Braintree.GooglePay.md#paymentmethodtype)

A string that represents the type of payment method. This can be one of the following values:
- "CARD": A credit or debit card.
- "TOKENIZED_CARD": A tokenized credit or debit card.
