# Interface: AdditionalData

[CdvPurchase](../modules/CdvPurchase.md).AdditionalData

Data to attach to a transaction.

**`See`**

 - [Offer.order](../classes/CdvPurchase.Offer.md#order)
 - [Store.requestPayment](../classes/CdvPurchase.Store.md#requestpayment)

## Table of contents

### Properties

- [appStore](CdvPurchase.AdditionalData.md#appstore)
- [applicationUsername](CdvPurchase.AdditionalData.md#applicationusername)
- [braintree](CdvPurchase.AdditionalData.md#braintree)
- [googlePlay](CdvPurchase.AdditionalData.md#googleplay)
- [quantity](CdvPurchase.AdditionalData.md#quantity)

## Properties

### appStore

• `Optional` **appStore**: [`AdditionalData`](CdvPurchase.AppleAppStore.AdditionalData.md)

Apple AppStore specific additional data

___

### applicationUsername

• `Optional` **applicationUsername**: `string`

The application's user identifier.

**`Deprecated`**

Set [Store.applicationUsername](../classes/CdvPurchase.Store.md#applicationusername) instead. The
per-transaction value is ignored — adapters always read the
store-level username so receipt validation later (which doesn't
have access to the original additionalData) sees the same value
that was sent to the native API at purchase time. Passing this
field logs a one-shot notice.

___

### braintree

• `Optional` **braintree**: [`AdditionalData`](CdvPurchase.Braintree.AdditionalData.md)

Braintree specific additional data

___

### googlePlay

• `Optional` **googlePlay**: [`AdditionalData`](CdvPurchase.GooglePlay.AdditionalData.md)

GooglePlay specific additional data

___

### quantity

• `Optional` **quantity**: `number`

Quantity of items to purchase.

Only supported on platforms that report the `'orderQuantity'` capability.
Platforms without support will ignore this field.

**`See`**

[Store.checkSupport](../classes/CdvPurchase.Store.md#checksupport)
