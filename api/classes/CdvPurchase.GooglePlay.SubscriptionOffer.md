# Class: SubscriptionOffer

[CdvPurchase](../modules/CdvPurchase.md).[GooglePlay](../modules/CdvPurchase.GooglePlay.md).SubscriptionOffer

One of the available offers to purchase a given product

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

- [canPurchase](CdvPurchase.GooglePlay.SubscriptionOffer.md#canpurchase)
- [platform](CdvPurchase.GooglePlay.SubscriptionOffer.md#platform)
- [productGroup](CdvPurchase.GooglePlay.SubscriptionOffer.md#productgroup)
- [productId](CdvPurchase.GooglePlay.SubscriptionOffer.md#productid)
- [productType](CdvPurchase.GooglePlay.SubscriptionOffer.md#producttype)

### Methods

- [order](CdvPurchase.GooglePlay.SubscriptionOffer.md#order)

## Constructors

### constructor

• **new SubscriptionOffer**(`options`, `decorator`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.id` | `string` |
| `options.pricingPhases` | [`PricingPhase`](../interfaces/CdvPurchase.PricingPhase.md)[] |
| `options.product` | [`GProduct`](CdvPurchase.GooglePlay.GProduct.md) |
| `options.tags` | `string`[] |
| `options.token` | `string` |
| `decorator` | `OfferDecorator` |

#### Overrides

CdvPurchase.Offer.constructor

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
