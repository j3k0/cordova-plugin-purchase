# Interface: PaymentRequest

[CdvPurchase](../modules/CdvPurchase.md).PaymentRequest

Request for payment.

Use with [requestPayment](../classes/CdvPurchase.Store.md#requestpayment) to initiate a payment for a given amount.

**`Example`**

```ts
const {store, Platform, ErrorCode} = CdvPurchase;
 store.requestPayment({
   platform: Platform.BRAINTREE,
   items: [{
     id: 'margherita_large',
     title: 'Pizza Margherita Large',
     pricing: {
       priceMicros: 9990000,
     }
   }, {
     id: 'delivery_standard',
     title: 'Delivery',
     pricing: {
       priceMicros: 2000000,
     }
   }]
   amountMicros: 11990000,
   currency: 'USD',
   description: 'This this the description of the payment request',
 })
 .cancelled(() => { // user cancelled by closing the window
 })
 .failed(error => { // payment request failed
 })
 .initiated(transaction => { // transaction initiated
 })
 .approved(transaction => { // transaction approved
 })
 .finished(transaction => { // transaction finished
 });
```

## Table of contents

### Properties

- [amountMicros](CdvPurchase.PaymentRequest.md#amountmicros)
- [billingAddress](CdvPurchase.PaymentRequest.md#billingaddress)
- [currency](CdvPurchase.PaymentRequest.md#currency)
- [description](CdvPurchase.PaymentRequest.md#description)
- [email](CdvPurchase.PaymentRequest.md#email)
- [items](CdvPurchase.PaymentRequest.md#items)
- [mobilePhoneNumber](CdvPurchase.PaymentRequest.md#mobilephonenumber)
- [platform](CdvPurchase.PaymentRequest.md#platform)

## Properties

### amountMicros

• `Optional` **amountMicros**: `number`

Amount to pay.

Default to the sum of all items.

___

### billingAddress

• `Optional` **billingAddress**: [`PostalAddress`](CdvPurchase.PostalAddress.md)

The billing address used for verification. Optional.

___

### currency

• `Optional` **currency**: `string`

Currency.

Some payment platforms only support one currency thus do not require this field.

Default to the currency of the items.

___

### description

• `Optional` **description**: `string`

Description for the payment.

___

### email

• `Optional` **email**: `string`

The email used for verification. Optional.

___

### items

• **items**: (`undefined` \| [`PaymentRequestItem`](CdvPurchase.PaymentRequestItem.md))[]

Products being purchased.

They do not have to be products registered with the plugin, but they can be.

___

### mobilePhoneNumber

• `Optional` **mobilePhoneNumber**: `string`

The mobile phone number used for verification. Optional.

Only numbers. Remove dashes, parentheses and other characters.

___

### platform

• **platform**: [`Platform`](../enums/CdvPurchase.Platform.md)

Platform that will handle the payment request.
