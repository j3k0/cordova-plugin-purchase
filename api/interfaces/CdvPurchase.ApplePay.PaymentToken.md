# Interface: PaymentToken

[CdvPurchase](../modules/CdvPurchase.md).[ApplePay](../modules/CdvPurchase.ApplePay.md).PaymentToken

## Table of contents

### Properties

- [paymentData](CdvPurchase.ApplePay.PaymentToken.md#paymentdata)
- [paymentMethod](CdvPurchase.ApplePay.PaymentToken.md#paymentmethod)
- [transactionIdentifier](CdvPurchase.ApplePay.PaymentToken.md#transactionidentifier)

## Properties

### paymentData

• `Optional` **paymentData**: `string`

Base64 encoded UTF-8 JSON

Send this data to your e-commerce back-end system, where it can be decrypted and submitted to your payment processor.

**`See`**

[https://developer.apple.com/library/archive/documentation/PassKit/Reference/PaymentTokenJSON/PaymentTokenJSON.html#//apple_ref/doc/uid/TP40014929](https://developer.apple.com/library/archive/documentation/PassKit/Reference/PaymentTokenJSON/PaymentTokenJSON.html#//apple_ref/doc/uid/TP40014929)

___

### paymentMethod

• **paymentMethod**: [`PaymentMethod`](CdvPurchase.ApplePay.PaymentMethod.md)

Information about the card used in the transaction.

___

### transactionIdentifier

• **transactionIdentifier**: `string`

A unique identifier for this payment.

This identifier is suitable for use in a receipt.
