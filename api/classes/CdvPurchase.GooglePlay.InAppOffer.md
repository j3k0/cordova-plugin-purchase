# Class: InAppOffer

[CdvPurchase](../modules/CdvPurchase.md).[GooglePlay](../modules/CdvPurchase.GooglePlay.md).InAppOffer

## Hierarchy

- [`Offer`](CdvPurchase.Offer.md)

  ↳ **`InAppOffer`**

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

### product

• **product**: [`Product`](CdvPurchase.Product.md)

Parent product

#### Inherited from

[Offer](CdvPurchase.Offer.md).[product](CdvPurchase.Offer.md#product)

___

### type

• **type**: `string` = `'inapp'`
