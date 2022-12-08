# Class: Receipt

[CdvPurchase](../modules/CdvPurchase.md).Receipt

## Hierarchy

- **`Receipt`**

  ↳ [`SKApplicationReceipt`](CdvPurchase.AppleAppStore.SKApplicationReceipt.md)

  ↳ [`BraintreeReceipt`](CdvPurchase.Braintree.BraintreeReceipt.md)

  ↳ [`Receipt`](CdvPurchase.GooglePlay.Receipt.md)

## Table of contents

### Properties

- [platform](CdvPurchase.Receipt.md#platform)
- [transactions](CdvPurchase.Receipt.md#transactions)

### Methods

- [finish](CdvPurchase.Receipt.md#finish)
- [hasTransaction](CdvPurchase.Receipt.md#hastransaction)
- [lastTransaction](CdvPurchase.Receipt.md#lasttransaction)
- [verify](CdvPurchase.Receipt.md#verify)

## Properties

### platform

• **platform**: [`Platform`](../enums/CdvPurchase.Platform.md)

Platform that generated the receipt

___

### transactions

• **transactions**: [`Transaction`](CdvPurchase.Transaction.md)[] = `[]`

List of transactions contained in the receipt, ordered by date ascending.

## Methods

### finish

▸ **finish**(): `Promise`<`void`\>

Finish all transactions in a receipt

#### Returns

`Promise`<`void`\>

___

### hasTransaction

▸ **hasTransaction**(`value`): `boolean`

Return true if the receipt contains the given transaction

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`Transaction`](CdvPurchase.Transaction.md) |

#### Returns

`boolean`

___

### lastTransaction

▸ **lastTransaction**(): [`Transaction`](CdvPurchase.Transaction.md)

Return the last transaction in this receipt

#### Returns

[`Transaction`](CdvPurchase.Transaction.md)

___

### verify

▸ **verify**(): `Promise`<`void`\>

Verify a receipt

#### Returns

`Promise`<`void`\>
