# Class: Product

[CdvPurchase](../modules/CdvPurchase.md).Product

Product definition from a store

## Hierarchy

- **`Product`**

  ↳ [`SKProduct`](CdvPurchase.AppleAppStore.SKProduct.md)

  ↳ [`GProduct`](CdvPurchase.GooglePlay.GProduct.md)

## Table of contents

### Constructors

- [constructor](CdvPurchase.Product.md#constructor)

### Properties

- [description](CdvPurchase.Product.md#description)
- [id](CdvPurchase.Product.md#id)
- [offers](CdvPurchase.Product.md#offers)
- [platform](CdvPurchase.Product.md#platform)
- [title](CdvPurchase.Product.md#title)
- [type](CdvPurchase.Product.md#type)

### Accessors

- [pricing](CdvPurchase.Product.md#pricing)

### Methods

- [getOffer](CdvPurchase.Product.md#getoffer)

## Constructors

### constructor

• **new Product**(`p`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `p` | [`IRegisterProduct`](../interfaces/CdvPurchase.IRegisterProduct.md) |

## Properties

### description

• **description**: `string` = `''`

Product full description from the store.

___

### id

• **id**: `string`

Product identifier on the store (unique per platform)

___

### offers

• **offers**: [`Offer`](CdvPurchase.Offer.md)[]

List of offers available for this product

___

### platform

• **platform**: [`Platform`](../enums/CdvPurchase.Platform.md)

Platform this product is available from

___

### title

• **title**: `string` = `''`

Product title from the store.

___

### type

• **type**: [`ProductType`](../enums/CdvPurchase.ProductType.md)

Type of product (subscription, consumable, etc.)

## Accessors

### pricing

• `get` **pricing**(): `undefined` \| [`PricingPhase`](../interfaces/CdvPurchase.PricingPhase.md)

Shortcut to offers[0].pricingPhases[0]

Useful when you know products have a single offer and a single pricing phase.

#### Returns

`undefined` \| [`PricingPhase`](../interfaces/CdvPurchase.PricingPhase.md)

## Methods

### getOffer

▸ **getOffer**(`id?`): `undefined` \| [`Offer`](CdvPurchase.Offer.md)

Find and return an offer for this product from its id

If id isn't specified, returns the first offer.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `id` | `string` | `''` | Identifier of the offer to return |

#### Returns

`undefined` \| [`Offer`](CdvPurchase.Offer.md)

An Offer or undefined if no match is found
