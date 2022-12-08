# Interface: PaymentRequest

[CdvPurchase](../modules/CdvPurchase.md).PaymentRequest

Request for payment.

Use with [requestPayment](../classes/CdvPurchase.Store.md#requestpayment) to initiate a payment for a given amount.

**`Example`**

```ts
const {store, Platform, ErrorCode} = CdvPurchase;
 store.requestPayment({
   platform: Platform.BRAINTREE,
   productIds: ['my-product-1', 'my-product-2'],
   amountMicros: 1990000,
   currency: 'USD',
   description: 'This this the description of the payment request',
 }).then((result) => {
   if (result && result.isError && result.code !== ErrorCode.PAYMENT_CANCELLED) {
     alert(result.message);
   }
 });
```

## Table of contents

### Properties

- [amountMicros](CdvPurchase.PaymentRequest.md#amountmicros)
- [billingAddress](CdvPurchase.PaymentRequest.md#billingaddress)
- [currency](CdvPurchase.PaymentRequest.md#currency)
- [description](CdvPurchase.PaymentRequest.md#description)
- [email](CdvPurchase.PaymentRequest.md#email)
- [mobilePhoneNumber](CdvPurchase.PaymentRequest.md#mobilephonenumber)
- [platform](CdvPurchase.PaymentRequest.md#platform)
- [productIds](CdvPurchase.PaymentRequest.md#productids)

## Properties

### amountMicros

• **amountMicros**: `number`

Amount to pay. Required.

___

### billingAddress

• `Optional` **billingAddress**: [`PostalAddress`](CdvPurchase.PostalAddress.md)

The billing address used for verification. Optional.

___

### currency

• `Optional` **currency**: `string`

Currency.

Some payment platforms only support one currency thus do not require this field.

___

### description

• `Optional` **description**: `string`

Description for the payment.

___

### email

• `Optional` **email**: `string`

The email used for verification. Optional.

___

### mobilePhoneNumber

• `Optional` **mobilePhoneNumber**: `string`

The mobile phone number used for verification. Optional.

Only numbers. Remove dashes, parentheses and other characters.

___

### platform

• **platform**: [`Platform`](../enums/CdvPurchase.Platform.md)

Platform that will handle the payment request.

___

### productIds

• **productIds**: `string`[]

Products being purchased.

Used for your reference, does not have to be a product registered with the plugin.
