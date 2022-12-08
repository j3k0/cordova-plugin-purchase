# Class: InAppOffer

[CdvPurchase](../modules/CdvPurchase.md).[GooglePlay](../modules/CdvPurchase.GooglePlay.md).InAppOffer

One of the available offers to purchase a given product

## Hierarchy

- [`Offer`](CdvPurchase.Offer.md)

  ↳ **`InAppOffer`**

## Table of contents

### Properties

- [id](CdvPurchase.GooglePlay.InAppOffer.md#id)
- [pricingPhases](CdvPurchase.GooglePlay.InAppOffer.md#pricingphases)
- [type](CdvPurchase.GooglePlay.InAppOffer.md#type)

### Accessors

- [canPurchase](CdvPurchase.GooglePlay.InAppOffer.md#canpurchase)
- [platform](CdvPurchase.GooglePlay.InAppOffer.md#platform)
- [productGroup](CdvPurchase.GooglePlay.InAppOffer.md#productgroup)
- [productId](CdvPurchase.GooglePlay.InAppOffer.md#productid)
- [productType](CdvPurchase.GooglePlay.InAppOffer.md#producttype)

### Methods

- [order](CdvPurchase.GooglePlay.InAppOffer.md#order)

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

### canPurchase

• `get` **canPurchase**(): `boolean`

true if the offer can be purchased.

#### Returns

`boolean`

#### Inherited from

CdvPurchase.Offer.canPurchase

___

### platform

• `get` **platform**(): [`Platform`](../enums/CdvPurchase.Platform.md)

Platform this offer is available from

#### Returns

[`Platform`](../enums/CdvPurchase.Platform.md)

#### Inherited from

CdvPurchase.Offer.platform

___

### productGroup

• `get` **productGroup**(): `undefined` \| `string`

Group the product related to this offer is member of

#### Returns

`undefined` \| `string`

#### Inherited from

CdvPurchase.Offer.productGroup

___

### productId

• `get` **productId**(): `string`

Identifier of the product related to this offer

#### Returns

`string`

#### Inherited from

CdvPurchase.Offer.productId

___

### productType

• `get` **productType**(): [`ProductType`](../enums/CdvPurchase.ProductType.md)

Type of the product related to this offer

#### Returns

[`ProductType`](../enums/CdvPurchase.ProductType.md)

#### Inherited from

CdvPurchase.Offer.productType

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
