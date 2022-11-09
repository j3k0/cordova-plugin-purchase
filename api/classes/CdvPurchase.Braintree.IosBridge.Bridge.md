# Class: Bridge

[Braintree](../modules/CdvPurchase.Braintree.md).[IosBridge](../modules/CdvPurchase.Braintree.IosBridge.md).Bridge

## Table of contents

### Constructors

- [constructor](CdvPurchase.Braintree.IosBridge.Bridge.md#constructor)

### Properties

- [clientTokenProvider](CdvPurchase.Braintree.IosBridge.Bridge.md#clienttokenprovider)
- [log](CdvPurchase.Braintree.IosBridge.Bridge.md#log)

### Methods

- [initialize](CdvPurchase.Braintree.IosBridge.Bridge.md#initialize)
- [launchDropIn](CdvPurchase.Braintree.IosBridge.Bridge.md#launchdropin)
- [isSupported](CdvPurchase.Braintree.IosBridge.Bridge.md#issupported)

## Constructors

### constructor

• **new Bridge**(`log`, `clientTokenProvider`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `log` | [`Logger`](CdvPurchase.Logger.md) |
| `clientTokenProvider` | [`ClientTokenProvider`](../modules/CdvPurchase.Braintree.md#clienttokenprovider) |

## Properties

### clientTokenProvider

• **clientTokenProvider**: [`ClientTokenProvider`](../modules/CdvPurchase.Braintree.md#clienttokenprovider)

___

### log

• **log**: [`Logger`](CdvPurchase.Logger.md)

## Methods

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

#### Returns

`boolean`
