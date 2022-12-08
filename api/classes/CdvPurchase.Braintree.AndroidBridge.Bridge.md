# Class: Bridge

[Braintree](../modules/CdvPurchase.Braintree.md).[AndroidBridge](../modules/CdvPurchase.Braintree.AndroidBridge.md).Bridge

Bridge to access native functions.

This tries to export pretty raw functions from the underlying native SDKs.

## Table of contents

### Constructors

- [constructor](CdvPurchase.Braintree.AndroidBridge.Bridge.md#constructor)

### Methods

- [initialize](CdvPurchase.Braintree.AndroidBridge.Bridge.md#initialize)
- [isApplePaySupported](CdvPurchase.Braintree.AndroidBridge.Bridge.md#isapplepaysupported)
- [launchDropIn](CdvPurchase.Braintree.AndroidBridge.Bridge.md#launchdropin)
- [isSupported](CdvPurchase.Braintree.AndroidBridge.Bridge.md#issupported)

## Constructors

### constructor

• **new Bridge**(`log`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `log` | [`Logger`](CdvPurchase.Logger.md) |

## Methods

### initialize

▸ **initialize**(`clientTokenProvider`, `callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `clientTokenProvider` | `string` \| [`ClientTokenProvider`](../modules/CdvPurchase.Braintree.AndroidBridge.md#clienttokenprovider) |
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

▸ **launchDropIn**(`dropInRequest`): `Promise`<[`IError`](../interfaces/CdvPurchase.IError.md) \| [`Result`](../interfaces/CdvPurchase.Braintree.DropIn.Result.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `dropInRequest` | [`Request`](../interfaces/CdvPurchase.Braintree.DropIn.Request.md) |

#### Returns

`Promise`<[`IError`](../interfaces/CdvPurchase.IError.md) \| [`Result`](../interfaces/CdvPurchase.Braintree.DropIn.Result.md)\>

___

### isSupported

▸ `Static` **isSupported**(): `boolean`

Returns true on Android, the only platform supported by this Braintree bridge

#### Returns

`boolean`
