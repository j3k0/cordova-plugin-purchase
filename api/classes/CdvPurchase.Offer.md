# Class: Offer

[CdvPurchase](../modules/CdvPurchase.md).Offer

## Hierarchy

- **`Offer`**

  ↳ [`SKOffer`](CdvPurchase.AppleAppStore.SKOffer.md)

  ↳ [`InAppOffer`](CdvPurchase.GooglePlay.InAppOffer.md)

  ↳ [`SubscriptionOffer`](CdvPurchase.GooglePlay.SubscriptionOffer.md)

## Table of contents

### Constructors

- [constructor](CdvPurchase.Offer.md#constructor)

### Properties

- [id](CdvPurchase.Offer.md#id)
- [pricingPhases](CdvPurchase.Offer.md#pricingphases)

### Accessors

- [platform](CdvPurchase.Offer.md#platform)
- [productId](CdvPurchase.Offer.md#productid)
- [productType](CdvPurchase.Offer.md#producttype)

## Constructors

### constructor

• **new Offer**(`options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.id` | `string` |
| `options.pricingPhases` | [`PricingPhase`](../interfaces/CdvPurchase.PricingPhase.md)[] |
| `options.product` | [`Product`](CdvPurchase.Product.md) |

## Properties

### id

• **id**: `string`

Offer identifier

___

### pricingPhases

• **pricingPhases**: [`PricingPhase`](../interfaces/CdvPurchase.PricingPhase.md)[]

Pricing phases

## Accessors

### platform

• `get` **platform**(): [`Platform`](../enums/CdvPurchase.Platform.md)

#### Returns

[`Platform`](../enums/CdvPurchase.Platform.md)

___

### productId

• `get` **productId**(): `string`

#### Returns

`string`

___

### productType

• `get` **productType**(): [`ProductType`](../enums/CdvPurchase.ProductType.md)

#### Returns

[`ProductType`](../enums/CdvPurchase.ProductType.md)
