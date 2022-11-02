# Interface: Purchase

[GooglePlay](../modules/CdvPurchase.GooglePlay.md).[Bridge](../modules/CdvPurchase.GooglePlay.Bridge.md).Purchase

## Table of contents

### Properties

- [accountId](CdvPurchase.GooglePlay.Bridge.Purchase.md#accountid)
- [acknowledged](CdvPurchase.GooglePlay.Bridge.Purchase.md#acknowledged)
- [autoRenewing](CdvPurchase.GooglePlay.Bridge.Purchase.md#autorenewing)
- [developerPayload](CdvPurchase.GooglePlay.Bridge.Purchase.md#developerpayload)
- [getPurchaseState](CdvPurchase.GooglePlay.Bridge.Purchase.md#getpurchasestate)
- [orderId](CdvPurchase.GooglePlay.Bridge.Purchase.md#orderid)
- [packageName](CdvPurchase.GooglePlay.Bridge.Purchase.md#packagename)
- [productId](CdvPurchase.GooglePlay.Bridge.Purchase.md#productid)
- [productIds](CdvPurchase.GooglePlay.Bridge.Purchase.md#productids)
- [profileId](CdvPurchase.GooglePlay.Bridge.Purchase.md#profileid)
- [purchaseState](CdvPurchase.GooglePlay.Bridge.Purchase.md#purchasestate)
- [purchaseTime](CdvPurchase.GooglePlay.Bridge.Purchase.md#purchasetime)
- [purchaseToken](CdvPurchase.GooglePlay.Bridge.Purchase.md#purchasetoken)
- [quantity](CdvPurchase.GooglePlay.Bridge.Purchase.md#quantity)
- [receipt](CdvPurchase.GooglePlay.Bridge.Purchase.md#receipt)
- [signature](CdvPurchase.GooglePlay.Bridge.Purchase.md#signature)

## Properties

### accountId

• **accountId**: `string`

Obfuscated account id specified at purchase - by default md5(applicationUsername)

___

### acknowledged

• **acknowledged**: `boolean`

Whether the purchase has been acknowledged.

___

### autoRenewing

• **autoRenewing**: ``false``

Whether the subscription renews automatically.

___

### developerPayload

• **developerPayload**: `string`

Payload specified when the purchase was acknowledged or consumed.

**`Deprecated`**

- This was removed from Billing v5

___

### getPurchaseState

• **getPurchaseState**: [`PurchaseState`](../enums/CdvPurchase.GooglePlay.Bridge.PurchaseState.md)

One of BridgePurchaseState indicating the state of the purchase.

___

### orderId

• `Optional` **orderId**: `string`

Unique order identifier for the transaction.  (like GPA.XXXX-XXXX-XXXX-XXXXX)

___

### packageName

• **packageName**: `string`

Application package from which the purchase originated.

___

### productId

• **productId**: `string`

Identifier of the purchased product.

**`Deprecated`**

- use productIds (since Billing v5 a single purchase can contain multiple products)

___

### productIds

• **productIds**: `string`[]

Identifier of the purchased products

___

### profileId

• **profileId**: `string`

Obfuscated profile id specified at purchase - used when a single user can have multiple profiles

___

### purchaseState

• **purchaseState**: `number`

Purchase state in the original JSON

**`Deprecated`**

- use getPurchaseState

___

### purchaseTime

• **purchaseTime**: `number`

Time the product was purchased, in milliseconds since the epoch (Jan 1, 1970).

___

### purchaseToken

• **purchaseToken**: `string`

Token that uniquely identifies a purchase for a given item and user pair.

___

### quantity

• **quantity**: `number`

quantity of the purchased product

___

### receipt

• **receipt**: `string`

String in JSON format that contains details about the purchase order.

___

### signature

• **signature**: `string`

String containing the signature of the purchase data that was signed with the private key of the developer.
