# Class: SKProduct

[CdvPurchase](../modules/CdvPurchase.md).[AppleAppStore](../modules/CdvPurchase.AppleAppStore.md).SKProduct

Product definition from a store

## Hierarchy

- [`Product`](CdvPurchase.Product.md)

  ↳ **`SKProduct`**

## Table of contents

### Constructors

- [constructor](CdvPurchase.AppleAppStore.SKProduct.md#constructor)

### Properties

- [countryCode](CdvPurchase.AppleAppStore.SKProduct.md#countrycode)
- [description](CdvPurchase.AppleAppStore.SKProduct.md#description)
- [group](CdvPurchase.AppleAppStore.SKProduct.md#group)
- [id](CdvPurchase.AppleAppStore.SKProduct.md#id)
- [offers](CdvPurchase.AppleAppStore.SKProduct.md#offers)
- [platform](CdvPurchase.AppleAppStore.SKProduct.md#platform)
- [raw](CdvPurchase.AppleAppStore.SKProduct.md#raw)
- [title](CdvPurchase.AppleAppStore.SKProduct.md#title)
- [type](CdvPurchase.AppleAppStore.SKProduct.md#type)

### Accessors

- [canPurchase](CdvPurchase.AppleAppStore.SKProduct.md#canpurchase)
- [owned](CdvPurchase.AppleAppStore.SKProduct.md#owned)
- [pricing](CdvPurchase.AppleAppStore.SKProduct.md#pricing)

### Methods

- [getOffer](CdvPurchase.AppleAppStore.SKProduct.md#getoffer)
- [refresh](CdvPurchase.AppleAppStore.SKProduct.md#refresh)
- [removeIneligibleDiscounts](CdvPurchase.AppleAppStore.SKProduct.md#removeineligiblediscounts)

## Constructors

### constructor

• **new SKProduct**(`validProduct`, `p`, `decorator`, `eligibilities`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `validProduct` | [`ValidProduct`](../interfaces/CdvPurchase.AppleAppStore.Bridge.ValidProduct.md) |
| `p` | [`IRegisterProduct`](../interfaces/CdvPurchase.IRegisterProduct.md) |
| `decorator` | `ProductDecorator` & `OfferDecorator` |
| `eligibilities` | `IDiscountEligibilities` |

#### Overrides

Product.constructor

## Properties

### countryCode

• `Optional` **countryCode**: `string`

AppStore country this product has been fetched for

___

### description

• **description**: `string` = `''`

Product full description from the store.

#### Inherited from

[Product](CdvPurchase.Product.md).[description](CdvPurchase.Product.md#description)

___

### group

• `Optional` **group**: `string`

Group the product is member of.

Only 1 product of a given group can be owned. This is generally used
to provide different levels for subscriptions, for example: silver
and gold.

Purchasing a different level will replace the previously owned one.

#### Inherited from

[Product](CdvPurchase.Product.md).[group](CdvPurchase.Product.md#group)

___

### id

• **id**: `string`

Product identifier on the store (unique per platform)

#### Inherited from

[Product](CdvPurchase.Product.md).[id](CdvPurchase.Product.md#id)

___

### offers

• **offers**: [`Offer`](CdvPurchase.Offer.md)[]

List of offers available for this product

#### Inherited from

[Product](CdvPurchase.Product.md).[offers](CdvPurchase.Product.md#offers)

___

### platform

• **platform**: [`Platform`](../enums/CdvPurchase.Platform.md)

Platform this product is available from

#### Inherited from

[Product](CdvPurchase.Product.md).[platform](CdvPurchase.Product.md#platform)

___

### raw

• **raw**: [`ValidProduct`](../interfaces/CdvPurchase.AppleAppStore.Bridge.ValidProduct.md)

Raw data returned by native side

___

### title

• **title**: `string` = `''`

Product title from the store.

#### Inherited from

[Product](CdvPurchase.Product.md).[title](CdvPurchase.Product.md#title)

___

### type

• **type**: [`ProductType`](../enums/CdvPurchase.ProductType.md)

Type of product (subscription, consumable, etc.)

#### Inherited from

[Product](CdvPurchase.Product.md).[type](CdvPurchase.Product.md#type)

## Accessors

### canPurchase

• `get` **canPurchase**(): `boolean`

Returns true if the product can be purchased.

#### Returns

`boolean`

#### Inherited from

Product.canPurchase

___

### owned

• `get` **owned**(): `boolean`

Returns true if the product is owned.

#### Returns

`boolean`

#### Inherited from

Product.owned

___

### pricing

• `get` **pricing**(): `undefined` \| [`PricingPhase`](../interfaces/CdvPurchase.PricingPhase.md)

Shortcut to offers[0].pricingPhases[0]

Useful when you know products have a single offer and a single pricing phase.

#### Returns

`undefined` \| [`PricingPhase`](../interfaces/CdvPurchase.PricingPhase.md)

#### Inherited from

Product.pricing

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

#### Inherited from

[Product](CdvPurchase.Product.md).[getOffer](CdvPurchase.Product.md#getoffer)

___

### refresh

▸ **refresh**(`valid`, `decorator`, `eligibilities`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `valid` | [`ValidProduct`](../interfaces/CdvPurchase.AppleAppStore.Bridge.ValidProduct.md) |
| `decorator` | `ProductDecorator` & `OfferDecorator` |
| `eligibilities` | `IDiscountEligibilities` |

#### Returns

`void`

___

### removeIneligibleDiscounts

▸ **removeIneligibleDiscounts**(`eligibilities`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `eligibilities` | `IDiscountEligibilities` |

#### Returns

`void`
