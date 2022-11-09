# Class: SKReceipt

[CdvPurchase](../modules/CdvPurchase.md).[AppleAppStore](../modules/CdvPurchase.AppleAppStore.md).SKReceipt

## Hierarchy

- [`Receipt`](CdvPurchase.Receipt.md)

  ↳ **`SKReceipt`**

## Table of contents

### Properties

- [platform](CdvPurchase.AppleAppStore.SKReceipt.md#platform)
- [transactions](CdvPurchase.AppleAppStore.SKReceipt.md#transactions)

### Methods

- [finish](CdvPurchase.AppleAppStore.SKReceipt.md#finish)
- [hasTransaction](CdvPurchase.AppleAppStore.SKReceipt.md#hastransaction)
- [lastTransaction](CdvPurchase.AppleAppStore.SKReceipt.md#lasttransaction)
- [verify](CdvPurchase.AppleAppStore.SKReceipt.md#verify)

## Properties

### platform

• **platform**: [`Platform`](../enums/CdvPurchase.Platform.md)

Platform that generated the receipt

#### Inherited from

[Receipt](CdvPurchase.Receipt.md).[platform](CdvPurchase.Receipt.md#platform)

___

### transactions

• **transactions**: [`Transaction`](CdvPurchase.Transaction.md)[]

List of transactions contained in the receipt, ordered by date ascending.

#### Inherited from

[Receipt](CdvPurchase.Receipt.md).[transactions](CdvPurchase.Receipt.md#transactions)

## Methods

### finish

▸ **finish**(): `Promise`<`void`\>

Finish all transactions in a receipt

#### Returns

`Promise`<`void`\>

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

### verify

▸ **verify**(): `Promise`<`void`\>

Verify a receipt

#### Returns

`Promise`<`void`\>

#### Inherited from

[Receipt](CdvPurchase.Receipt.md).[verify](CdvPurchase.Receipt.md#verify)
