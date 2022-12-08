# Class: Product

[CdvPurchase](../modules/CdvPurchase.md).Product

Product definition from a store

## Hierarchy

- **`Product`**

  ↳ [`SKProduct`](CdvPurchase.AppleAppStore.SKProduct.md)

  ↳ [`GProduct`](CdvPurchase.GooglePlay.GProduct.md)

## Table of contents

### Properties

- [description](CdvPurchase.Product.md#description)
- [group](CdvPurchase.Product.md#group)
- [id](CdvPurchase.Product.md#id)
- [offers](CdvPurchase.Product.md#offers)
- [platform](CdvPurchase.Product.md#platform)
- [title](CdvPurchase.Product.md#title)
- [type](CdvPurchase.Product.md#type)

### Accessors

- [canPurchase](CdvPurchase.Product.md#canpurchase)
- [owned](CdvPurchase.Product.md#owned)
- [pricing](CdvPurchase.Product.md#pricing)

### Methods

- [getOffer](CdvPurchase.Product.md#getoffer)

## Properties

### description

• **description**: `string` = `''`

Product full description from the store.

___

### group

• `Optional` **group**: `string`

Group the product is member of.

Only 1 product of a given group can be owned. This is generally used
to provide different levels for subscriptions, for example: silver
and gold.

Purchasing a different level will replace the previously owned one.

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

### canPurchase

• `get` **canPurchase**(): `boolean`

Returns true if the product can be purchased.

#### Returns

`boolean`

___

### owned

• `get` **owned**(): `boolean`

Returns true if the product is owned.

#### Returns

`boolean`

___

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
