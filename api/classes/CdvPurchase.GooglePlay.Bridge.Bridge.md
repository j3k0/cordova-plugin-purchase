# Class: Bridge

[GooglePlay](../modules/CdvPurchase.GooglePlay.md).[Bridge](../modules/CdvPurchase.GooglePlay.Bridge.md).Bridge

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
- [init](CdvPurchase.GooglePlay.Bridge.Bridge.md#init)
- [launchPriceChangeConfirmationFlow](CdvPurchase.GooglePlay.Bridge.Bridge.md#launchpricechangeconfirmationflow)
- [listener](CdvPurchase.GooglePlay.Bridge.Bridge.md#listener)
- [load](CdvPurchase.GooglePlay.Bridge.Bridge.md#load)
- [manageBilling](CdvPurchase.GooglePlay.Bridge.Bridge.md#managebilling)
- [manageSubscriptions](CdvPurchase.GooglePlay.Bridge.Bridge.md#managesubscriptions)
- [subscribe](CdvPurchase.GooglePlay.Bridge.Bridge.md#subscribe)

## Constructors

### constructor

• **new Bridge**()

## Properties

### options

• **options**: [`Options`](../interfaces/CdvPurchase.GooglePlay.Bridge.Options.md) = `{}`

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
| `additionalData` | [`AdditionalData`](../interfaces/CdvPurchase.AdditionalData.md) |

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
| `success` | (`validProducts`: ([`InAppProduct`](../interfaces/CdvPurchase.GooglePlay.Bridge.InAppProduct.md) \| [`Subscription`](../interfaces/CdvPurchase.GooglePlay.Bridge.Subscription.md))[]) => `void` |
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
| `options` | [`Options`](../interfaces/CdvPurchase.GooglePlay.Bridge.Options.md) |

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
| `additionalData` | [`AdditionalData`](../interfaces/CdvPurchase.AdditionalData.md) |

#### Returns

`void`
