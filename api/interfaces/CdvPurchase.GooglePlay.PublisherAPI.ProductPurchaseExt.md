# Interface: ProductPurchaseExt

[GooglePlay](../modules/CdvPurchase.GooglePlay.md).[PublisherAPI](../modules/CdvPurchase.GooglePlay.PublisherAPI.md).ProductPurchaseExt

## Hierarchy

- `ProductPurchase_API`

  ↳ **`ProductPurchaseExt`**

## Table of contents

### Properties

- [acknowledgementState](CdvPurchase.GooglePlay.PublisherAPI.ProductPurchaseExt.md#acknowledgementstate)
- [consumptionState](CdvPurchase.GooglePlay.PublisherAPI.ProductPurchaseExt.md#consumptionstate)
- [developerPayload](CdvPurchase.GooglePlay.PublisherAPI.ProductPurchaseExt.md#developerpayload)
- [kind](CdvPurchase.GooglePlay.PublisherAPI.ProductPurchaseExt.md#kind)
- [obfuscatedExternalAccountId](CdvPurchase.GooglePlay.PublisherAPI.ProductPurchaseExt.md#obfuscatedexternalaccountid)
- [obfuscatedExternalProfileId](CdvPurchase.GooglePlay.PublisherAPI.ProductPurchaseExt.md#obfuscatedexternalprofileid)
- [orderId](CdvPurchase.GooglePlay.PublisherAPI.ProductPurchaseExt.md#orderid)
- [productId](CdvPurchase.GooglePlay.PublisherAPI.ProductPurchaseExt.md#productid)
- [purchaseState](CdvPurchase.GooglePlay.PublisherAPI.ProductPurchaseExt.md#purchasestate)
- [purchaseTimeMillis](CdvPurchase.GooglePlay.PublisherAPI.ProductPurchaseExt.md#purchasetimemillis)
- [purchaseToken](CdvPurchase.GooglePlay.PublisherAPI.ProductPurchaseExt.md#purchasetoken)
- [purchaseType](CdvPurchase.GooglePlay.PublisherAPI.ProductPurchaseExt.md#purchasetype)
- [quantity](CdvPurchase.GooglePlay.PublisherAPI.ProductPurchaseExt.md#quantity)
- [regionCode](CdvPurchase.GooglePlay.PublisherAPI.ProductPurchaseExt.md#regioncode)

## Properties

### acknowledgementState

• `Optional` **acknowledgementState**: ``null`` \| `number`

The acknowledgement state of the inapp product. Possible values are: 0. Yet to be acknowledged 1. Acknowledged

#### Inherited from

ProductPurchase\_API.acknowledgementState

___

### consumptionState

• `Optional` **consumptionState**: ``null`` \| `number`

The consumption state of the inapp product. Possible values are: 0. Yet to be consumed 1. Consumed

#### Inherited from

ProductPurchase\_API.consumptionState

___

### developerPayload

• `Optional` **developerPayload**: ``null`` \| `string`

A developer-specified string that contains supplemental information about an order.

#### Inherited from

ProductPurchase\_API.developerPayload

___

### kind

• **kind**: ``"androidpublisher#productPurchase"``

#### Overrides

ProductPurchase\_API.kind

___

### obfuscatedExternalAccountId

• `Optional` **obfuscatedExternalAccountId**: ``null`` \| `string`

An obfuscated version of the id that is uniquely associated with the user's account in your app. Only present if specified using https://developer.android.com/reference/com/android/billingclient/api/BillingFlowParams.Builder#setobfuscatedaccountid when the purchase was made.

#### Inherited from

ProductPurchase\_API.obfuscatedExternalAccountId

___

### obfuscatedExternalProfileId

• `Optional` **obfuscatedExternalProfileId**: ``null`` \| `string`

An obfuscated version of the id that is uniquely associated with the user's profile in your app. Only present if specified using https://developer.android.com/reference/com/android/billingclient/api/BillingFlowParams.Builder#setobfuscatedprofileid when the purchase was made.

#### Inherited from

ProductPurchase\_API.obfuscatedExternalProfileId

___

### orderId

• `Optional` **orderId**: ``null`` \| `string`

The order id associated with the purchase of the inapp product.

#### Inherited from

ProductPurchase\_API.orderId

___

### productId

• `Optional` **productId**: `string`

#### Overrides

ProductPurchase\_API.productId

___

### purchaseState

• `Optional` **purchaseState**: ``null`` \| `number`

The purchase state of the order. Possible values are: 0. Purchased 1. Canceled 2. Pending

#### Inherited from

ProductPurchase\_API.purchaseState

___

### purchaseTimeMillis

• `Optional` **purchaseTimeMillis**: ``null`` \| `string`

The time the product was purchased, in milliseconds since the epoch (Jan 1, 1970).

#### Inherited from

ProductPurchase\_API.purchaseTimeMillis

___

### purchaseToken

• `Optional` **purchaseToken**: ``null`` \| `string`

The purchase token generated to identify this purchase.

#### Inherited from

ProductPurchase\_API.purchaseToken

___

### purchaseType

• `Optional` **purchaseType**: ``null`` \| `number`

The type of purchase of the inapp product. This field is only set if this purchase was not made using the standard in-app billing flow. Possible values are: 0. Test (i.e. purchased from a license testing account) 1. Promo (i.e. purchased using a promo code) 2. Rewarded (i.e. from watching a video ad instead of paying)

#### Inherited from

ProductPurchase\_API.purchaseType

___

### quantity

• `Optional` **quantity**: ``null`` \| `number`

The quantity associated with the purchase of the inapp product.

#### Inherited from

ProductPurchase\_API.quantity

___

### regionCode

• `Optional` **regionCode**: ``null`` \| `string`

ISO 3166-1 alpha-2 billing region code of the user at the time the product was granted.

#### Inherited from

ProductPurchase\_API.regionCode
