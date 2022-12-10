# Interface: ApplePayPaymentResult

[Braintree](../modules/CdvPurchase.Braintree.md).[IosBridge](../modules/CdvPurchase.Braintree.IosBridge.md).ApplePayPaymentResult

## Table of contents

### Properties

- [applePayCardNonce](CdvPurchase.Braintree.IosBridge.ApplePayPaymentResult.md#applepaycardnonce)
- [payment](CdvPurchase.Braintree.IosBridge.ApplePayPaymentResult.md#payment)
- [userCancelled](CdvPurchase.Braintree.IosBridge.ApplePayPaymentResult.md#usercancelled)

## Properties

### applePayCardNonce

• `Optional` **applePayCardNonce**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `binData?` | [`BinData`](CdvPurchase.Braintree.IosBridge.BinData.md) |
| `nonce` | `string` |
| `type` | `string` |

___

### payment

• `Optional` **payment**: [`Payment`](CdvPurchase.ApplePay.Payment.md)

___

### userCancelled

• `Optional` **userCancelled**: `boolean`

True if user closed the window without paying.
