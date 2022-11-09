# Class: VerifiedReceipt

[CdvPurchase](../modules/CdvPurchase.md).VerifiedReceipt

Receipt data as validated by the receipt validation server

## Table of contents

### Properties

- [collection](CdvPurchase.VerifiedReceipt.md#collection)
- [id](CdvPurchase.VerifiedReceipt.md#id)
- [latestReceipt](CdvPurchase.VerifiedReceipt.md#latestreceipt)
- [nativeTransactions](CdvPurchase.VerifiedReceipt.md#nativetransactions)
- [sourceReceipt](CdvPurchase.VerifiedReceipt.md#sourcereceipt)
- [warning](CdvPurchase.VerifiedReceipt.md#warning)

### Accessors

- [platform](CdvPurchase.VerifiedReceipt.md#platform)

### Methods

- [finish](CdvPurchase.VerifiedReceipt.md#finish)

## Properties

### collection

• **collection**: [`VerifiedPurchase`](../interfaces/CdvPurchase.VerifiedPurchase.md)[]

The collection of purchases in this receipt.

___

### id

• **id**: `string`

Id of the product that have been validated. Used internally.

___

### latestReceipt

• **latestReceipt**: `boolean`

True if we've used the latest receipt.

___

### nativeTransactions

• **nativeTransactions**: [`NativeTransaction`](../modules/CdvPurchase.Validator.Response.md#nativetransaction)[]

Raw content from the platform's API.

___

### sourceReceipt

• **sourceReceipt**: [`Receipt`](CdvPurchase.Receipt.md)

Source local receipt used for this validation

___

### warning

• `Optional` **warning**: `string`

Optional warning message about this validation.

It might be present when the server had to fallback to a backup validation solution (like a cached response or using local validation only).
This happens generally when communication with the platform's receipt validation service isn't possible (because it's down, there's a network issue, ...)

When a warning is present, you should threat the content of this receipt accordingly.

## Accessors

### platform

• `get` **platform**(): [`Platform`](../enums/CdvPurchase.Platform.md)

Platform this receipt originated from

#### Returns

[`Platform`](../enums/CdvPurchase.Platform.md)

## Methods

### finish

▸ **finish**(): `Promise`<`void`\>

Finish all transactions in the receipt

#### Returns

`Promise`<`void`\>
