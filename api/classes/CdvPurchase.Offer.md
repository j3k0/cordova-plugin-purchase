# Class: Offer

[CdvPurchase](../modules/CdvPurchase.md).Offer

One of the available offers to purchase a given product

## Hierarchy

- **`Offer`**

  ↳ [`SKOffer`](CdvPurchase.AppleAppStore.SKOffer.md)

  ↳ [`InAppOffer`](CdvPurchase.GooglePlay.InAppOffer.md)

  ↳ [`SubscriptionOffer`](CdvPurchase.GooglePlay.SubscriptionOffer.md)

## Table of contents

### Properties

- [id](CdvPurchase.Offer.md#id)
- [pricingPhases](CdvPurchase.Offer.md#pricingphases)

### Accessors

- [canPurchase](CdvPurchase.Offer.md#canpurchase)
- [platform](CdvPurchase.Offer.md#platform)
- [productGroup](CdvPurchase.Offer.md#productgroup)
- [productId](CdvPurchase.Offer.md#productid)
- [productType](CdvPurchase.Offer.md#producttype)

### Methods

- [order](CdvPurchase.Offer.md#order)

## Properties

### id

• **id**: `string`

Offer identifier

___

### pricingPhases

• **pricingPhases**: [`PricingPhase`](../interfaces/CdvPurchase.PricingPhase.md)[]

Pricing phases

## Accessors

### canPurchase

• `get` **canPurchase**(): `boolean`

true if the offer can be purchased.

#### Returns

`boolean`

___

### platform

• `get` **platform**(): [`Platform`](../enums/CdvPurchase.Platform.md)

Platform this offer is available from

#### Returns

[`Platform`](../enums/CdvPurchase.Platform.md)

___

### productGroup

• `get` **productGroup**(): `undefined` \| `string`

Group the product related to this offer is member of

#### Returns

`undefined` \| `string`

___

### productId

• `get` **productId**(): `string`

Identifier of the product related to this offer

#### Returns

`string`

___

### productType

• `get` **productType**(): [`ProductType`](../enums/CdvPurchase.ProductType.md)

Type of the product related to this offer

#### Returns

[`ProductType`](../enums/CdvPurchase.ProductType.md)

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
