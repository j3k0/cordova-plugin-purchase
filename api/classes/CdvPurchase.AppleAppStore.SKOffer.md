# Class: SKOffer

[CdvPurchase](../modules/CdvPurchase.md).[AppleAppStore](../modules/CdvPurchase.AppleAppStore.md).SKOffer

One of the available offers to purchase a given product

## Hierarchy

- [`Offer`](CdvPurchase.Offer.md)

  ↳ **`SKOffer`**

## Table of contents

### Properties

- [id](CdvPurchase.AppleAppStore.SKOffer.md#id)
- [pricingPhases](CdvPurchase.AppleAppStore.SKOffer.md#pricingphases)

### Accessors

- [canPurchase](CdvPurchase.AppleAppStore.SKOffer.md#canpurchase)
- [platform](CdvPurchase.AppleAppStore.SKOffer.md#platform)
- [productId](CdvPurchase.AppleAppStore.SKOffer.md#productid)
- [productType](CdvPurchase.AppleAppStore.SKOffer.md#producttype)

### Methods

- [order](CdvPurchase.AppleAppStore.SKOffer.md#order)

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

### canPurchase

• `get` **canPurchase**(): `boolean`

true if the offer can be purchased.

#### Returns

`boolean`

#### Inherited from

Offer.canPurchase

___

### platform

• `get` **platform**(): [`Platform`](../enums/CdvPurchase.Platform.md)

Platform this offer is available from

#### Returns

[`Platform`](../enums/CdvPurchase.Platform.md)

#### Inherited from

Offer.platform

___

### productId

• `get` **productId**(): `string`

Identifier of the product related to this offer

#### Returns

`string`

#### Inherited from

Offer.productId

___

### productType

• `get` **productType**(): [`ProductType`](../enums/CdvPurchase.ProductType.md)

Type of the product related to this offer

#### Returns

[`ProductType`](../enums/CdvPurchase.ProductType.md)

#### Inherited from

Offer.productType

## Methods

### order

▸ **order**(`additionalData?`): `Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

Initiate a purchase of this offer.

**`Example`**

```ts
store.get("my-product").getOffer().order();
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `additionalData?` | [`AdditionalData`](../interfaces/CdvPurchase.AdditionalData.md) |

#### Returns

`Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

#### Inherited from

[Offer](CdvPurchase.Offer.md).[order](CdvPurchase.Offer.md#order)
