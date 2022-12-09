# Interface: ApplePayOptions

[Braintree](../modules/CdvPurchase.Braintree.md).[IosBridge](../modules/CdvPurchase.Braintree.IosBridge.md).ApplePayOptions

Options for enabling Apple Pay payments.

## Table of contents

### Properties

- [companyName](CdvPurchase.Braintree.IosBridge.ApplePayOptions.md#companyname)
- [preparePaymentRequest](CdvPurchase.Braintree.IosBridge.ApplePayOptions.md#preparepaymentrequest)

## Properties

### companyName

• `Optional` **companyName**: `string`

Your company name, required to prepare the payment request.

If you are setting `paymentSummaryItems` manually in `preparePaymentRequest`, this field will
not be used.

___

### preparePaymentRequest

• `Optional` **preparePaymentRequest**: (`paymentRequest`: [`PaymentRequest`](CdvPurchase.PaymentRequest.md)) => [`PaymentRequest`](CdvPurchase.ApplePay.PaymentRequest.md)

#### Type declaration

▸ (`paymentRequest`): [`PaymentRequest`](CdvPurchase.ApplePay.PaymentRequest.md)

When the user selects Apple Pay as a payment method, the plugin will initialize a payment request
client side using the PassKit SDK.

You can customize the ApplePay payment request by implementing the `preparePaymentRequest` function.

This let's you prefill some information you have on database about the user, limit payment methods,
enable coupon codes, etc.

**`See`**

[https://developer.apple.com/documentation/passkit/pkpaymentrequest/](https://developer.apple.com/documentation/passkit/pkpaymentrequest/)

##### Parameters

| Name | Type |
| :------ | :------ |
| `paymentRequest` | [`PaymentRequest`](CdvPurchase.PaymentRequest.md) |

##### Returns

[`PaymentRequest`](CdvPurchase.ApplePay.PaymentRequest.md)
