# Class: Offer

[CdvPurchase](../modules/CdvPurchase.md).Offer

## Hierarchy

- **`Offer`**

  ↳ [`SKOffer`](CdvPurchase.AppleAppStore.SKOffer.md)

  ↳ [`InAppOffer`](CdvPurchase.GooglePlay.InAppOffer.md)

  ↳ [`SubscriptionOffer`](CdvPurchase.GooglePlay.SubscriptionOffer.md)

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

___

### product

• **product**: [`Product`](CdvPurchase.Product.md)

Parent product
