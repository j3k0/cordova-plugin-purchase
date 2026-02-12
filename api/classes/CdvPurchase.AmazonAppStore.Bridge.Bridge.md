# Class: Bridge

[AmazonAppStore](../modules/CdvPurchase.AmazonAppStore.md).[Bridge](../modules/CdvPurchase.AmazonAppStore.Bridge.md).Bridge

## Table of contents

### Constructors

- [constructor](CdvPurchase.AmazonAppStore.Bridge.Bridge.md#constructor)

### Properties

- [options](CdvPurchase.AmazonAppStore.Bridge.Bridge.md#options)

### Methods

- [getProductData](CdvPurchase.AmazonAppStore.Bridge.Bridge.md#getproductdata)
- [getPurchaseUpdates](CdvPurchase.AmazonAppStore.Bridge.Bridge.md#getpurchaseupdates)
- [init](CdvPurchase.AmazonAppStore.Bridge.Bridge.md#init)
- [listener](CdvPurchase.AmazonAppStore.Bridge.Bridge.md#listener)
- [notifyFulfillment](CdvPurchase.AmazonAppStore.Bridge.Bridge.md#notifyfulfillment)
- [purchase](CdvPurchase.AmazonAppStore.Bridge.Bridge.md#purchase)

## Constructors

### constructor

• **new Bridge**(): [`Bridge`](CdvPurchase.AmazonAppStore.Bridge.Bridge.md)

#### Returns

[`Bridge`](CdvPurchase.AmazonAppStore.Bridge.Bridge.md)

## Properties

### options

• **options**: [`Options`](../interfaces/CdvPurchase.AmazonAppStore.Bridge.Options.md) = `{}`

## Methods

### getProductData

▸ **getProductData**(`skus`, `success`, `fail`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `skus` | `string`[] |
| `success` | (`products`: [`ProductDataResponse`](../interfaces/CdvPurchase.AmazonAppStore.Bridge.ProductDataResponse.md)) => `void` |
| `fail` | [`ErrorCallback`](../modules/CdvPurchase.AmazonAppStore.Bridge.md#errorcallback) |

#### Returns

`void`

___

### getPurchaseUpdates

▸ **getPurchaseUpdates**(`success`, `fail`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `success` | () => `void` |
| `fail` | [`ErrorCallback`](../modules/CdvPurchase.AmazonAppStore.Bridge.md#errorcallback) |

#### Returns

`void`

___

### init

▸ **init**(`success`, `fail`, `options`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `success` | () => `void` |
| `fail` | [`ErrorCallback`](../modules/CdvPurchase.AmazonAppStore.Bridge.md#errorcallback) |
| `options` | [`Options`](../interfaces/CdvPurchase.AmazonAppStore.Bridge.Options.md) |

#### Returns

`void`

___

### listener

▸ **listener**(`msg`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | [`Message`](../modules/CdvPurchase.AmazonAppStore.Bridge.md#message) |

#### Returns

`void`

___

### notifyFulfillment

▸ **notifyFulfillment**(`receiptId`, `success`, `fail`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `receiptId` | `string` |
| `success` | () => `void` |
| `fail` | [`ErrorCallback`](../modules/CdvPurchase.AmazonAppStore.Bridge.md#errorcallback) |

#### Returns

`void`

___

### purchase

▸ **purchase**(`productId`, `success`, `fail`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `productId` | `string` |
| `success` | () => `void` |
| `fail` | [`ErrorCallback`](../modules/CdvPurchase.AmazonAppStore.Bridge.md#errorcallback) |

#### Returns

`void`
