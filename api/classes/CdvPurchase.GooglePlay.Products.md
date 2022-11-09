# Class: Products

[CdvPurchase](../modules/CdvPurchase.md).[GooglePlay](../modules/CdvPurchase.GooglePlay.md).Products

## Table of contents

### Constructors

- [constructor](CdvPurchase.GooglePlay.Products.md#constructor)

### Properties

- [offers](CdvPurchase.GooglePlay.Products.md#offers)
- [products](CdvPurchase.GooglePlay.Products.md#products)

### Methods

- [addProduct](CdvPurchase.GooglePlay.Products.md#addproduct)
- [getOffer](CdvPurchase.GooglePlay.Products.md#getoffer)
- [getProduct](CdvPurchase.GooglePlay.Products.md#getproduct)

## Constructors

### constructor

• **new Products**(`decorator`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `decorator` | `ProductDecorator` & `OfferDecorator` |

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
