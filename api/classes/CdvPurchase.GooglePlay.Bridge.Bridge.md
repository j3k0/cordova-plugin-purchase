# Class: Bridge

[GooglePlay](../modules/CdvPurchase.GooglePlay.md).[Bridge](../modules/CdvPurchase.GooglePlay.Bridge.md).Bridge

Shared interface for Google Play bridge implementations.
Both Cordova and Capacitor bridges implement this interface.
The adapter programs against this interface, not a concrete class.

## Implements

- [`BridgeInterface`](../interfaces/CdvPurchase.GooglePlay.Bridge.BridgeInterface.md)

## Table of contents

### Constructors

- [constructor](CdvPurchase.GooglePlay.Bridge.Bridge.md#constructor)

### Properties

- [options](CdvPurchase.GooglePlay.Bridge.Bridge.md#options)

### Methods

- [acknowledgePurchase](CdvPurchase.GooglePlay.Bridge.Bridge.md#acknowledgepurchase)
- [buy](CdvPurchase.GooglePlay.Bridge.Bridge.md#buy)
- [consumePurchase](CdvPurchase.GooglePlay.Bridge.Bridge.md#consumepurchase)
- [getAvailableProducts](CdvPurchase.GooglePlay.Bridge.Bridge.md#getavailableproducts)
- [getPurchases](CdvPurchase.GooglePlay.Bridge.Bridge.md#getpurchases)
- [getStorefront](CdvPurchase.GooglePlay.Bridge.Bridge.md#getstorefront)
- [init](CdvPurchase.GooglePlay.Bridge.Bridge.md#init)
- [launchPriceChangeConfirmationFlow](CdvPurchase.GooglePlay.Bridge.Bridge.md#launchpricechangeconfirmationflow)
- [listener](CdvPurchase.GooglePlay.Bridge.Bridge.md#listener)
- [load](CdvPurchase.GooglePlay.Bridge.Bridge.md#load)
- [manageBilling](CdvPurchase.GooglePlay.Bridge.Bridge.md#managebilling)
- [manageSubscriptions](CdvPurchase.GooglePlay.Bridge.Bridge.md#managesubscriptions)
- [subscribe](CdvPurchase.GooglePlay.Bridge.Bridge.md#subscribe)

## Constructors

### constructor

• **new Bridge**(): [`Bridge`](CdvPurchase.GooglePlay.Bridge.Bridge.md)

#### Returns

[`Bridge`](CdvPurchase.GooglePlay.Bridge.Bridge.md)

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

### getStorefront

▸ **getStorefront**(`success`, `fail`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `success` | (`countryCode`: `string`) => `void` |
| `fail` | [`ErrorCallback`](../modules/CdvPurchase.GooglePlay.Bridge.md#errorcallback) |

#### Returns

`void`

#### Implementation of

[BridgeInterface](../interfaces/CdvPurchase.GooglePlay.Bridge.BridgeInterface.md).[getStorefront](../interfaces/CdvPurchase.GooglePlay.Bridge.BridgeInterface.md#getstorefront)

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

### listener

▸ **listener**(`msg`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | [`Message`](../modules/CdvPurchase.GooglePlay.Bridge.md#message) |

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
