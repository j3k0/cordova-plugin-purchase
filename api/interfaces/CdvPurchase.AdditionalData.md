# Interface: AdditionalData

[CdvPurchase](../modules/CdvPurchase.md).AdditionalData

Data to attach to a transaction.

**`See`**

 - [order](../classes/CdvPurchase.Offer.md#order)
 - [requestPayment](../classes/CdvPurchase.Store.md#requestpayment)

## Table of contents

### Properties

- [applicationUsername](CdvPurchase.AdditionalData.md#applicationusername)
- [braintree](CdvPurchase.AdditionalData.md#braintree)
- [googlePlay](CdvPurchase.AdditionalData.md#googleplay)

## Properties

### applicationUsername

• `Optional` **applicationUsername**: `string`

The application's user identifier, will be obfuscated with md5 to fill `accountId` if necessary

___

### braintree

• `Optional` **braintree**: [`AdditionalData`](CdvPurchase.Braintree.AdditionalData.md)

Braintree specific additional data

___

### googlePlay

• `Optional` **googlePlay**: [`AdditionalData`](CdvPurchase.GooglePlay.AdditionalData.md)

GooglePlay specific additional data
