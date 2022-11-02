# Class: SKOffer

[CdvPurchase](../modules/CdvPurchase.md).[AppleAppStore](../modules/CdvPurchase.AppleAppStore.md).SKOffer

## Hierarchy

- [`Offer`](CdvPurchase.Offer.md)

  ↳ **`SKOffer`**

## Table of contents

### Constructors

- [constructor](CdvPurchase.AppleAppStore.SKOffer.md#constructor)

### Properties

- [id](CdvPurchase.AppleAppStore.SKOffer.md#id)
- [pricingPhases](CdvPurchase.AppleAppStore.SKOffer.md#pricingphases)

### Accessors

- [platform](CdvPurchase.AppleAppStore.SKOffer.md#platform)
- [productId](CdvPurchase.AppleAppStore.SKOffer.md#productid)
- [productType](CdvPurchase.AppleAppStore.SKOffer.md#producttype)

## Constructors

### constructor

• **new SKOffer**(`options`)

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

## Accessors

### platform

• `get` **platform**(): [`Platform`](../enums/CdvPurchase.Platform.md)

#### Returns

[`Platform`](../enums/CdvPurchase.Platform.md)

#### Inherited from

Offer.platform

___

### productId

• `get` **productId**(): `string`

#### Returns

`string`

#### Inherited from

Offer.productId

___

### productType

• `get` **productType**(): [`ProductType`](../enums/CdvPurchase.ProductType.md)

#### Returns

[`ProductType`](../enums/CdvPurchase.ProductType.md)

#### Inherited from

Offer.productType
