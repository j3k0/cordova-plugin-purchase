# Class: InAppOffer

[CdvPurchase](../modules/CdvPurchase.md).[GooglePlay](../modules/CdvPurchase.GooglePlay.md).InAppOffer

## Hierarchy

- [`Offer`](CdvPurchase.Offer.md)

  ↳ **`InAppOffer`**

## Table of contents

### Constructors

- [constructor](CdvPurchase.GooglePlay.InAppOffer.md#constructor)

### Properties

- [id](CdvPurchase.GooglePlay.InAppOffer.md#id)
- [pricingPhases](CdvPurchase.GooglePlay.InAppOffer.md#pricingphases)
- [type](CdvPurchase.GooglePlay.InAppOffer.md#type)

### Accessors

- [platform](CdvPurchase.GooglePlay.InAppOffer.md#platform)
- [productId](CdvPurchase.GooglePlay.InAppOffer.md#productid)
- [productType](CdvPurchase.GooglePlay.InAppOffer.md#producttype)

## Constructors

### constructor

• **new InAppOffer**(`options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.id` | `string` |
| `options.pricingPhases` | [`PricingPhase`](../interfaces/CdvPurchase.PricingPhase.md)[] |
| `options.product` | [`Product`](CdvPurchase.Product.md) |

#### Inherited from

[Offer](CdvPurchase.Offer.md).[constructor](CdvPurchase.Offer.md#constructor)

## Properties

### id

• **id**: `string`

Offer identifier

#### Inherited from

[Offer](CdvPurchase.Offer.md).[id](CdvPurchase.Offer.md#id)

___

### pricingPhases

• **pricingPhases**: [`PricingPhase`](../interfaces/CdvPurchase.PricingPhase.md)[]

Pricing phases

#### Inherited from

[Offer](CdvPurchase.Offer.md).[pricingPhases](CdvPurchase.Offer.md#pricingphases)

___

### type

• **type**: `string` = `'inapp'`

## Accessors

### platform

• `get` **platform**(): [`Platform`](../enums/CdvPurchase.Platform.md)

#### Returns

[`Platform`](../enums/CdvPurchase.Platform.md)

#### Inherited from

CdvPurchase.Offer.platform

___

### productId

• `get` **productId**(): `string`

#### Returns

`string`

#### Inherited from

CdvPurchase.Offer.productId

___

### productType

• `get` **productType**(): [`ProductType`](../enums/CdvPurchase.ProductType.md)

#### Returns

[`ProductType`](../enums/CdvPurchase.ProductType.md)

#### Inherited from

CdvPurchase.Offer.productType
