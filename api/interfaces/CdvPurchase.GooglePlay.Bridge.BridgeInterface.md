# Interface: BridgeInterface

[GooglePlay](../modules/CdvPurchase.GooglePlay.md).[Bridge](../modules/CdvPurchase.GooglePlay.Bridge.md).BridgeInterface

Shared interface for Google Play bridge implementations.
Both Cordova and Capacitor bridges implement this interface.
The adapter programs against this interface, not a concrete class.

## Implemented by

- [`Bridge`](../classes/CdvPurchase.GooglePlay.Bridge.Bridge.md)
- [`CapacitorBridge`](../classes/CdvPurchase.GooglePlay.Bridge.CapacitorBridge.md)

## Table of contents

### Properties

- [options](CdvPurchase.GooglePlay.Bridge.BridgeInterface.md#options)

### Methods

- [acknowledgePurchase](CdvPurchase.GooglePlay.Bridge.BridgeInterface.md#acknowledgepurchase)
- [buy](CdvPurchase.GooglePlay.Bridge.BridgeInterface.md#buy)
- [consumePurchase](CdvPurchase.GooglePlay.Bridge.BridgeInterface.md#consumepurchase)
- [getAvailableProducts](CdvPurchase.GooglePlay.Bridge.BridgeInterface.md#getavailableproducts)
- [getPurchases](CdvPurchase.GooglePlay.Bridge.BridgeInterface.md#getpurchases)
- [init](CdvPurchase.GooglePlay.Bridge.BridgeInterface.md#init)
- [launchPriceChangeConfirmationFlow](CdvPurchase.GooglePlay.Bridge.BridgeInterface.md#launchpricechangeconfirmationflow)
- [load](CdvPurchase.GooglePlay.Bridge.BridgeInterface.md#load)
- [manageBilling](CdvPurchase.GooglePlay.Bridge.BridgeInterface.md#managebilling)
- [manageSubscriptions](CdvPurchase.GooglePlay.Bridge.BridgeInterface.md#managesubscriptions)
- [subscribe](CdvPurchase.GooglePlay.Bridge.BridgeInterface.md#subscribe)

## Properties

### options

• **options**: [`Options`](CdvPurchase.GooglePlay.Bridge.Options.md)

## Methods

### acknowledgePurchase

▸ **acknowledgePurchase**(`success`, `fail`, `purchaseToken`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `success` | () => `void` |
| `fail` | [`ErrorCallback`](../modules/CdvPurchase.GooglePlay.Bridge.md#errorcallback) |
| `purchaseToken` | `string` |

#### Returns

`void`

___

### buy

▸ **buy**(`success`, `fail`, `productId`, `additionalData`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `success` | () => `void` |
| `fail` | [`ErrorCallback`](../modules/CdvPurchase.GooglePlay.Bridge.md#errorcallback) |
| `productId` | `string` |
| `additionalData` | [`AdditionalData`](CdvPurchase.AdditionalData.md) |

#### Returns

`void`

___

### consumePurchase

▸ **consumePurchase**(`success`, `fail`, `purchaseToken`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `success` | () => `void` |
| `fail` | [`ErrorCallback`](../modules/CdvPurchase.GooglePlay.Bridge.md#errorcallback) |
| `purchaseToken` | `string` |

#### Returns

`void`

___

### getAvailableProducts

▸ **getAvailableProducts**(`inAppSkus`, `subsSkus`, `success`, `fail`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `inAppSkus` | `string`[] |
| `subsSkus` | `string`[] |
| `success` | (`validProducts`: ([`InAppProduct`](CdvPurchase.GooglePlay.Bridge.InAppProduct.md) \| [`Subscription`](CdvPurchase.GooglePlay.Bridge.Subscription.md))[]) => `void` |
| `fail` | [`ErrorCallback`](../modules/CdvPurchase.GooglePlay.Bridge.md#errorcallback) |

#### Returns

`void`

___

### getPurchases

▸ **getPurchases**(`success`, `fail`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `success` | () => `void` |
| `fail` | [`ErrorCallback`](../modules/CdvPurchase.GooglePlay.Bridge.md#errorcallback) |

#### Returns

`void`

___

### init

▸ **init**(`success`, `fail`, `options`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `success` | () => `void` |
| `fail` | [`ErrorCallback`](../modules/CdvPurchase.GooglePlay.Bridge.md#errorcallback) |
| `options` | [`Options`](CdvPurchase.GooglePlay.Bridge.Options.md) |

#### Returns

`void`

___

### launchPriceChangeConfirmationFlow

▸ **launchPriceChangeConfirmationFlow**(`productId`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `productId` | `string` |

#### Returns

`void`

___

### load

▸ **load**(`success`, `fail`, `skus`, `inAppSkus`, `subsSkus`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `success` | () => `void` |
| `fail` | [`ErrorCallback`](../modules/CdvPurchase.GooglePlay.Bridge.md#errorcallback) |
| `skus` | `string`[] |
| `inAppSkus` | `string`[] |
| `subsSkus` | `string`[] |

#### Returns

`void`

___

### manageBilling

▸ **manageBilling**(): `void`

#### Returns

`void`

___

### manageSubscriptions

▸ **manageSubscriptions**(): `void`

#### Returns

`void`

___

### subscribe

▸ **subscribe**(`success`, `fail`, `productId`, `additionalData`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `success` | () => `void` |
| `fail` | [`ErrorCallback`](../modules/CdvPurchase.GooglePlay.Bridge.md#errorcallback) |
| `productId` | `string` |
| `additionalData` | [`AdditionalData`](CdvPurchase.AdditionalData.md) |

#### Returns

`void`
