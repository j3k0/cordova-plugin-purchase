# Class: Receipt

[CdvPurchase](../modules/CdvPurchase.md).[AmazonAppStore](../modules/CdvPurchase.AmazonAppStore.md).Receipt

## Hierarchy

- [`Receipt`](CdvPurchase.Receipt.md)

  ↳ **`Receipt`**

## Table of contents

### Properties

- [platform](CdvPurchase.AmazonAppStore.Receipt.md#platform)
- [receiptId](CdvPurchase.AmazonAppStore.Receipt.md#receiptid)
- [transactions](CdvPurchase.AmazonAppStore.Receipt.md#transactions)

### Methods

- [finish](CdvPurchase.AmazonAppStore.Receipt.md#finish)
- [hasTransaction](CdvPurchase.AmazonAppStore.Receipt.md#hastransaction)
- [lastTransaction](CdvPurchase.AmazonAppStore.Receipt.md#lasttransaction)
- [refreshPurchase](CdvPurchase.AmazonAppStore.Receipt.md#refreshpurchase)
- [verify](CdvPurchase.AmazonAppStore.Receipt.md#verify)

## Properties

### platform

• **platform**: [`Platform`](../enums/CdvPurchase.Platform.md)

Platform that generated the receipt

#### Inherited from

[Receipt](CdvPurchase.Receipt.md).[platform](CdvPurchase.Receipt.md#platform)

___

### receiptId

• **receiptId**: `string`

Amazon receipt ID

___

### transactions

• **transactions**: [`Transaction`](CdvPurchase.Transaction.md)[] = `[]`

List of transactions contained in the receipt, ordered by date ascending.

#### Inherited from

[Receipt](CdvPurchase.Receipt.md).[transactions](CdvPurchase.Receipt.md#transactions)

## Methods

### finish

▸ **finish**(): `Promise`\<`void`\>

Finish all transactions in a receipt

#### Returns

`Promise`\<`void`\>

#### Inherited from

[Receipt](CdvPurchase.Receipt.md).[finish](CdvPurchase.Receipt.md#finish)

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

#### Inherited from

[Receipt](CdvPurchase.Receipt.md).[hasTransaction](CdvPurchase.Receipt.md#hastransaction)

___

### lastTransaction

▸ **lastTransaction**(): [`Transaction`](CdvPurchase.Transaction.md)

Return the last transaction in this receipt

#### Returns

[`Transaction`](CdvPurchase.Transaction.md)

#### Inherited from

[Receipt](CdvPurchase.Receipt.md).[lastTransaction](CdvPurchase.Receipt.md#lasttransaction)

___

### refreshPurchase

▸ **refreshPurchase**(`purchase`): `void`

Refresh the content of the receipt based on the native purchase

#### Parameters

| Name | Type |
| :------ | :------ |
| `purchase` | [`AmazonPurchase`](../interfaces/CdvPurchase.AmazonAppStore.Bridge.AmazonPurchase.md) |

#### Returns

`void`

___

### verify

▸ **verify**(): `Promise`\<`void`\>

Verify a receipt

#### Returns

`Promise`\<`void`\>

#### Inherited from

[Receipt](CdvPurchase.Receipt.md).[verify](CdvPurchase.Receipt.md#verify)
