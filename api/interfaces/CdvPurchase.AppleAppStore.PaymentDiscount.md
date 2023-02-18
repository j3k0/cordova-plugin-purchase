# Interface: PaymentDiscount

[CdvPurchase](../modules/CdvPurchase.md).[AppleAppStore](../modules/CdvPurchase.AppleAppStore.md).PaymentDiscount

The signed discount applied to a payment

**`See`**

[https://developer.apple.com/documentation/storekit/skpaymentdiscount?language=objc](https://developer.apple.com/documentation/storekit/skpaymentdiscount?language=objc)

## Table of contents

### Properties

- [id](CdvPurchase.AppleAppStore.PaymentDiscount.md#id)
- [key](CdvPurchase.AppleAppStore.PaymentDiscount.md#key)
- [nonce](CdvPurchase.AppleAppStore.PaymentDiscount.md#nonce)
- [signature](CdvPurchase.AppleAppStore.PaymentDiscount.md#signature)
- [timestamp](CdvPurchase.AppleAppStore.PaymentDiscount.md#timestamp)

## Properties

### id

• **id**: `string`

A string used to uniquely identify a discount offer for a product.

___

### key

• **key**: `string`

A string that identifies the key used to generate the signature.

___

### nonce

• **nonce**: `string`

A universally unique ID (UUID) value that you define.

___

### signature

• **signature**: `string`

A string representing the properties of a specific promotional offer, cryptographically signed.

___

### timestamp

• **timestamp**: `string`

The date and time of the signature's creation in milliseconds, formatted in Unix epoch time.
