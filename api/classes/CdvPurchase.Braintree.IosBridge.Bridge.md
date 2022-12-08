# Class: Bridge

[Braintree](../modules/CdvPurchase.Braintree.md).[IosBridge](../modules/CdvPurchase.Braintree.IosBridge.md).Bridge

## Table of contents

### Constructors

- [constructor](CdvPurchase.Braintree.IosBridge.Bridge.md#constructor)

### Properties

- [applePayOptions](CdvPurchase.Braintree.IosBridge.Bridge.md#applepayoptions)
- [clientTokenProvider](CdvPurchase.Braintree.IosBridge.Bridge.md#clienttokenprovider)
- [log](CdvPurchase.Braintree.IosBridge.Bridge.md#log)

### Methods

- [continueDropInForApplePay](CdvPurchase.Braintree.IosBridge.Bridge.md#continuedropinforapplepay)
- [initialize](CdvPurchase.Braintree.IosBridge.Bridge.md#initialize)
- [isApplePaySupported](CdvPurchase.Braintree.IosBridge.Bridge.md#isapplepaysupported)
- [launchDropIn](CdvPurchase.Braintree.IosBridge.Bridge.md#launchdropin)
- [requestApplePayPayment](CdvPurchase.Braintree.IosBridge.Bridge.md#requestapplepaypayment)
- [isSupported](CdvPurchase.Braintree.IosBridge.Bridge.md#issupported)

## Constructors

### constructor

• **new Bridge**(`log`, `clientTokenProvider`, `applePayOptions?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `log` | [`Logger`](CdvPurchase.Logger.md) |
| `clientTokenProvider` | [`ClientTokenProvider`](../modules/CdvPurchase.Braintree.md#clienttokenprovider) |
| `applePayOptions?` | [`ApplePayOptions`](../interfaces/CdvPurchase.Braintree.IosBridge.ApplePayOptions.md) |

## Properties

### applePayOptions

• `Optional` **applePayOptions**: [`ApplePayOptions`](../interfaces/CdvPurchase.Braintree.IosBridge.ApplePayOptions.md)

___

### clientTokenProvider

• **clientTokenProvider**: [`ClientTokenProvider`](../modules/CdvPurchase.Braintree.md#clienttokenprovider)

___

### log

• **log**: [`Logger`](CdvPurchase.Logger.md)

## Methods

### continueDropInForApplePay

▸ **continueDropInForApplePay**(`paymentRequest`, `DropInRequest`, `dropInResult`): `Promise`<[`IError`](../interfaces/CdvPurchase.IError.md) \| [`Result`](../interfaces/CdvPurchase.Braintree.DropIn.Result.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentRequest` | [`PaymentRequest`](../interfaces/CdvPurchase.PaymentRequest.md) |
| `DropInRequest` | [`Request`](../interfaces/CdvPurchase.Braintree.DropIn.Request.md) |
| `dropInResult` | [`Result`](../interfaces/CdvPurchase.Braintree.DropIn.Result.md) |

#### Returns

`Promise`<[`IError`](../interfaces/CdvPurchase.IError.md) \| [`Result`](../interfaces/CdvPurchase.Braintree.DropIn.Result.md)\>

___

### initialize

▸ **initialize**(`verbosity`, `callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `verbosity` | `VerbosityProvider` |
| `callback` | [`Callback`](../modules/CdvPurchase.md#callback)<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\> |

#### Returns

`void`

___

### isApplePaySupported

▸ **isApplePaySupported**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

___

### launchDropIn

▸ **launchDropIn**(`paymentRequest`, `dropInRequest`): `Promise`<[`IError`](../interfaces/CdvPurchase.IError.md) \| [`Result`](../interfaces/CdvPurchase.Braintree.DropIn.Result.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentRequest` | [`PaymentRequest`](../interfaces/CdvPurchase.PaymentRequest.md) |
| `dropInRequest` | [`Request`](../interfaces/CdvPurchase.Braintree.DropIn.Request.md) |

#### Returns

`Promise`<[`IError`](../interfaces/CdvPurchase.IError.md) \| [`Result`](../interfaces/CdvPurchase.Braintree.DropIn.Result.md)\>

___

### requestApplePayPayment

▸ **requestApplePayPayment**(`request`): `Promise`<[`IError`](../interfaces/CdvPurchase.IError.md) \| [`ApplePayPaymentResult`](../interfaces/CdvPurchase.Braintree.IosBridge.ApplePayPaymentResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`PaymentRequest`](../interfaces/CdvPurchase.ApplePay.PaymentRequest.md) |

#### Returns

`Promise`<[`IError`](../interfaces/CdvPurchase.IError.md) \| [`ApplePayPaymentResult`](../interfaces/CdvPurchase.Braintree.IosBridge.ApplePayPaymentResult.md)\>

___

### isSupported

▸ `Static` **isSupported**(): `boolean`

#### Returns

`boolean`
