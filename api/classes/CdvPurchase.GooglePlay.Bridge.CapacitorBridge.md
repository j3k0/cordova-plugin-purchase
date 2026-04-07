# Class: CapacitorBridge

[GooglePlay](../modules/CdvPurchase.GooglePlay.md).[Bridge](../modules/CdvPurchase.GooglePlay.Bridge.md).CapacitorBridge

Capacitor implementation of the Google Play bridge.
Uses Capacitor.Plugins.PurchasePlugin instead of cordova.exec().

## Implements

- [`BridgeInterface`](../interfaces/CdvPurchase.GooglePlay.Bridge.BridgeInterface.md)

## Table of contents

### Constructors

- [constructor](CdvPurchase.GooglePlay.Bridge.CapacitorBridge.md#constructor)

### Properties

- [options](CdvPurchase.GooglePlay.Bridge.CapacitorBridge.md#options)

### Methods

- [acknowledgePurchase](CdvPurchase.GooglePlay.Bridge.CapacitorBridge.md#acknowledgepurchase)
- [buy](CdvPurchase.GooglePlay.Bridge.CapacitorBridge.md#buy)
- [consumePurchase](CdvPurchase.GooglePlay.Bridge.CapacitorBridge.md#consumepurchase)
- [getAvailableProducts](CdvPurchase.GooglePlay.Bridge.CapacitorBridge.md#getavailableproducts)
- [getPurchases](CdvPurchase.GooglePlay.Bridge.CapacitorBridge.md#getpurchases)
- [init](CdvPurchase.GooglePlay.Bridge.CapacitorBridge.md#init)
- [launchPriceChangeConfirmationFlow](CdvPurchase.GooglePlay.Bridge.CapacitorBridge.md#launchpricechangeconfirmationflow)
- [load](CdvPurchase.GooglePlay.Bridge.CapacitorBridge.md#load)
- [manageBilling](CdvPurchase.GooglePlay.Bridge.CapacitorBridge.md#managebilling)
- [manageSubscriptions](CdvPurchase.GooglePlay.Bridge.CapacitorBridge.md#managesubscriptions)
- [subscribe](CdvPurchase.GooglePlay.Bridge.CapacitorBridge.md#subscribe)
- [isAvailable](CdvPurchase.GooglePlay.Bridge.CapacitorBridge.md#isavailable)

## Constructors

### constructor

• **new CapacitorBridge**(): [`CapacitorBridge`](CdvPurchase.GooglePlay.Bridge.CapacitorBridge.md)

#### Returns

[`CapacitorBridge`](CdvPurchase.GooglePlay.Bridge.CapacitorBridge.md)

## Properties

### options

• **options**: [`Options`](../interfaces/CdvPurchase.GooglePlay.Bridge.Options.md) = `{}`

#### Implementation of

[BridgeInterface](../interfaces/CdvPurchase.GooglePlay.Bridge.BridgeInterface.md).[options](../interfaces/CdvPurchase.GooglePlay.Bridge.BridgeInterface.md#options)

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

#### Implementation of

[BridgeInterface](../interfaces/CdvPurchase.GooglePlay.Bridge.BridgeInterface.md).[acknowledgePurchase](../interfaces/CdvPurchase.GooglePlay.Bridge.BridgeInterface.md#acknowledgepurchase)

___

### buy

▸ **buy**(`success`, `fail`, `productId`, `additionalData`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `success` | () => `void` |
| `fail` | [`ErrorCallback`](../modules/CdvPurchase.GooglePlay.Bridge.md#errorcallback) |
| `productId` | `string` |
| `additionalData` | [`AdditionalData`](../interfaces/CdvPurchase.AdditionalData.md) |

#### Returns

`void`

#### Implementation of

[BridgeInterface](../interfaces/CdvPurchase.GooglePlay.Bridge.BridgeInterface.md).[buy](../interfaces/CdvPurchase.GooglePlay.Bridge.BridgeInterface.md#buy)

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

#### Implementation of

[BridgeInterface](../interfaces/CdvPurchase.GooglePlay.Bridge.BridgeInterface.md).[consumePurchase](../interfaces/CdvPurchase.GooglePlay.Bridge.BridgeInterface.md#consumepurchase)

___

### getAvailableProducts

▸ **getAvailableProducts**(`inAppSkus`, `subsSkus`, `success`, `fail`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `inAppSkus` | `string`[] |
| `subsSkus` | `string`[] |
| `success` | (`validProducts`: ([`InAppProduct`](../interfaces/CdvPurchase.GooglePlay.Bridge.InAppProduct.md) \| [`Subscription`](../interfaces/CdvPurchase.GooglePlay.Bridge.Subscription.md))[]) => `void` |
| `fail` | [`ErrorCallback`](../modules/CdvPurchase.GooglePlay.Bridge.md#errorcallback) |

#### Returns

`void`

#### Implementation of

[BridgeInterface](../interfaces/CdvPurchase.GooglePlay.Bridge.BridgeInterface.md).[getAvailableProducts](../interfaces/CdvPurchase.GooglePlay.Bridge.BridgeInterface.md#getavailableproducts)

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

#### Implementation of

[BridgeInterface](../interfaces/CdvPurchase.GooglePlay.Bridge.BridgeInterface.md).[getPurchases](../interfaces/CdvPurchase.GooglePlay.Bridge.BridgeInterface.md#getpurchases)

___

### init

▸ **init**(`success`, `fail`, `options`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `success` | () => `void` |
| `fail` | [`ErrorCallback`](../modules/CdvPurchase.GooglePlay.Bridge.md#errorcallback) |
| `options` | [`Options`](../interfaces/CdvPurchase.GooglePlay.Bridge.Options.md) |

#### Returns

`void`

#### Implementation of

[BridgeInterface](../interfaces/CdvPurchase.GooglePlay.Bridge.BridgeInterface.md).[init](../interfaces/CdvPurchase.GooglePlay.Bridge.BridgeInterface.md#init)

___

### launchPriceChangeConfirmationFlow

▸ **launchPriceChangeConfirmationFlow**(`productId`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `productId` | `string` |

#### Returns

`void`

#### Implementation of

[BridgeInterface](../interfaces/CdvPurchase.GooglePlay.Bridge.BridgeInterface.md).[launchPriceChangeConfirmationFlow](../interfaces/CdvPurchase.GooglePlay.Bridge.BridgeInterface.md#launchpricechangeconfirmationflow)

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

#### Implementation of

[BridgeInterface](../interfaces/CdvPurchase.GooglePlay.Bridge.BridgeInterface.md).[load](../interfaces/CdvPurchase.GooglePlay.Bridge.BridgeInterface.md#load)

___

### manageBilling

▸ **manageBilling**(): `void`

#### Returns

`void`

#### Implementation of

[BridgeInterface](../interfaces/CdvPurchase.GooglePlay.Bridge.BridgeInterface.md).[manageBilling](../interfaces/CdvPurchase.GooglePlay.Bridge.BridgeInterface.md#managebilling)

___

### manageSubscriptions

▸ **manageSubscriptions**(): `void`

#### Returns

`void`

#### Implementation of

[BridgeInterface](../interfaces/CdvPurchase.GooglePlay.Bridge.BridgeInterface.md).[manageSubscriptions](../interfaces/CdvPurchase.GooglePlay.Bridge.BridgeInterface.md#managesubscriptions)

___

### subscribe

▸ **subscribe**(`success`, `fail`, `productId`, `additionalData`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `success` | () => `void` |
| `fail` | [`ErrorCallback`](../modules/CdvPurchase.GooglePlay.Bridge.md#errorcallback) |
| `productId` | `string` |
| `additionalData` | [`AdditionalData`](../interfaces/CdvPurchase.AdditionalData.md) |

#### Returns

`void`

#### Implementation of

[BridgeInterface](../interfaces/CdvPurchase.GooglePlay.Bridge.BridgeInterface.md).[subscribe](../interfaces/CdvPurchase.GooglePlay.Bridge.BridgeInterface.md#subscribe)

___

### isAvailable

▸ **isAvailable**(): `boolean`

Check if the Capacitor purchase plugin is available

#### Returns

`boolean`
