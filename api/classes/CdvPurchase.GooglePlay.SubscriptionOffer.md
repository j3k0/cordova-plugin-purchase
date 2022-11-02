# Class: SubscriptionOffer

[CdvPurchase](../modules/CdvPurchase.md).[GooglePlay](../modules/CdvPurchase.GooglePlay.md).SubscriptionOffer

## Hierarchy

- [`Offer`](CdvPurchase.Offer.md)

  ↳ **`SubscriptionOffer`**

## Table of contents

### Constructors

- [constructor](CdvPurchase.GooglePlay.SubscriptionOffer.md#constructor)

### Properties

- [id](CdvPurchase.GooglePlay.SubscriptionOffer.md#id)
- [pricingPhases](CdvPurchase.GooglePlay.SubscriptionOffer.md#pricingphases)
- [tags](CdvPurchase.GooglePlay.SubscriptionOffer.md#tags)
- [token](CdvPurchase.GooglePlay.SubscriptionOffer.md#token)
- [type](CdvPurchase.GooglePlay.SubscriptionOffer.md#type)

### Accessors

- [platform](CdvPurchase.GooglePlay.SubscriptionOffer.md#platform)
- [productId](CdvPurchase.GooglePlay.SubscriptionOffer.md#productid)
- [productType](CdvPurchase.GooglePlay.SubscriptionOffer.md#producttype)

## Constructors

### constructor

• **new SubscriptionOffer**(`options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.id` | `string` |
| `options.pricingPhases` | [`PricingPhase`](../interfaces/CdvPurchase.PricingPhase.md)[] |
| `options.product` | [`GProduct`](CdvPurchase.GooglePlay.GProduct.md) |
| `options.tags` | `string`[] |
| `options.token` | `string` |

#### Overrides

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

### tags

• **tags**: `string`[]

___

### token

• **token**: `string`

___

### type

• **type**: `string` = `'subs'`

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
