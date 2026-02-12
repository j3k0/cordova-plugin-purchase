# Interface: Options

[AmazonAppStore](../modules/CdvPurchase.AmazonAppStore.md).[Bridge](../modules/CdvPurchase.AmazonAppStore.Bridge.md).Options

Options for bridge initialization

## Table of contents

### Properties

- [log](CdvPurchase.AmazonAppStore.Bridge.Options.md#log)
- [onPurchaseFulfilled](CdvPurchase.AmazonAppStore.Bridge.Options.md#onpurchasefulfilled)
- [onPurchasesUpdated](CdvPurchase.AmazonAppStore.Bridge.Options.md#onpurchasesupdated)
- [onSetPurchases](CdvPurchase.AmazonAppStore.Bridge.Options.md#onsetpurchases)
- [showLog](CdvPurchase.AmazonAppStore.Bridge.Options.md#showlog)

## Properties

### log

• `Optional` **log**: (`msg`: `string`) => `void`

#### Type declaration

▸ (`msg`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | `string` |

##### Returns

`void`

___

### onPurchaseFulfilled

• `Optional` **onPurchaseFulfilled**: (`purchase`: [`AmazonPurchase`](CdvPurchase.AmazonAppStore.Bridge.AmazonPurchase.md)) => `void`

#### Type declaration

▸ (`purchase`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `purchase` | [`AmazonPurchase`](CdvPurchase.AmazonAppStore.Bridge.AmazonPurchase.md) |

##### Returns

`void`

___

### onPurchasesUpdated

• `Optional` **onPurchasesUpdated**: (`purchases`: [`AmazonPurchase`](CdvPurchase.AmazonAppStore.Bridge.AmazonPurchase.md)[]) => `void`

#### Type declaration

▸ (`purchases`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `purchases` | [`AmazonPurchase`](CdvPurchase.AmazonAppStore.Bridge.AmazonPurchase.md)[] |

##### Returns

`void`

___

### onSetPurchases

• `Optional` **onSetPurchases**: (`purchases`: [`AmazonPurchase`](CdvPurchase.AmazonAppStore.Bridge.AmazonPurchase.md)[]) => `void`

#### Type declaration

▸ (`purchases`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `purchases` | [`AmazonPurchase`](CdvPurchase.AmazonAppStore.Bridge.AmazonPurchase.md)[] |

##### Returns

`void`

___

### showLog

• `Optional` **showLog**: `boolean`
