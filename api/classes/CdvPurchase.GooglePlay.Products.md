# Class: Products

[CdvPurchase](../modules/CdvPurchase.md).[GooglePlay](../modules/CdvPurchase.GooglePlay.md).Products

## Constructors

### constructor

• **new Products**()

## Properties

### offers

• **offers**: [`GOffer`](../modules/CdvPurchase.GooglePlay.md#goffer)[] = `[]`

List of offers managed by the GooglePlay adapter

___

### products

• **products**: [`GProduct`](CdvPurchase.GooglePlay.GProduct.md)[] = `[]`

List of products managed by the GooglePlay adapter

## Methods

### addProduct

▸ **addProduct**(`registeredProduct`, `vp`): [`GProduct`](CdvPurchase.GooglePlay.GProduct.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `registeredProduct` | [`IRegisterProduct`](../interfaces/CdvPurchase.IRegisterProduct.md) |
| `vp` | [`InAppProduct`](../interfaces/CdvPurchase.GooglePlay.Bridge.InAppProduct.md) \| [`Subscription`](../interfaces/CdvPurchase.GooglePlay.Bridge.Subscription.md) |

#### Returns

[`GProduct`](CdvPurchase.GooglePlay.GProduct.md)

___

### getOffer

▸ **getOffer**(`id`): `undefined` \| [`GOffer`](../modules/CdvPurchase.GooglePlay.md#goffer)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`undefined` \| [`GOffer`](../modules/CdvPurchase.GooglePlay.md#goffer)

___

### getProduct

▸ **getProduct**(`id`): `undefined` \| [`GProduct`](CdvPurchase.GooglePlay.GProduct.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`undefined` \| [`GProduct`](CdvPurchase.GooglePlay.GProduct.md)
