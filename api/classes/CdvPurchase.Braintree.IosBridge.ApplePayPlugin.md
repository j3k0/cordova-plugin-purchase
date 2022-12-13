# Class: ApplePayPlugin

[Braintree](../modules/CdvPurchase.Braintree.md).[IosBridge](../modules/CdvPurchase.Braintree.IosBridge.md).ApplePayPlugin

Bridge to the cordova-plugin-purchase-braintree-applepay plugin

## Table of contents

### Constructors

- [constructor](CdvPurchase.Braintree.IosBridge.ApplePayPlugin.md#constructor)

### Methods

- [get](CdvPurchase.Braintree.IosBridge.ApplePayPlugin.md#get)
- [isSupported](CdvPurchase.Braintree.IosBridge.ApplePayPlugin.md#issupported)
- [requestPayment](CdvPurchase.Braintree.IosBridge.ApplePayPlugin.md#requestpayment)

## Constructors

### constructor

• **new ApplePayPlugin**()

## Methods

### get

▸ `Static` **get**(): `undefined` \| [`CdvPurchaseBraintreeApplePay`](../interfaces/CdvPurchase.Braintree.IosBridge.CdvPurchaseBraintreeApplePay.md)

Retrieve the plugin definition.

Useful to check if it is installed.

#### Returns

`undefined` \| [`CdvPurchaseBraintreeApplePay`](../interfaces/CdvPurchase.Braintree.IosBridge.CdvPurchaseBraintreeApplePay.md)

___

### isSupported

▸ `Static` **isSupported**(`log`): `Promise`<`boolean`\>

Returns true if the device supports Apple Pay.

This does not necessarily mean the user has a card setup already.

#### Parameters

| Name | Type |
| :------ | :------ |
| `log` | [`Logger`](CdvPurchase.Logger.md) |

#### Returns

`Promise`<`boolean`\>

___

### requestPayment

▸ `Static` **requestPayment**(`request`): `Promise`<[`IError`](../interfaces/CdvPurchase.IError.md) \| [`ApplePayPaymentResult`](../interfaces/CdvPurchase.Braintree.IosBridge.ApplePayPaymentResult.md)\>

Initiate a payment with Apple Pay.

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`PaymentRequest`](../interfaces/CdvPurchase.ApplePay.PaymentRequest.md) |

#### Returns

`Promise`<[`IError`](../interfaces/CdvPurchase.IError.md) \| [`ApplePayPaymentResult`](../interfaces/CdvPurchase.Braintree.IosBridge.ApplePayPaymentResult.md)\>
