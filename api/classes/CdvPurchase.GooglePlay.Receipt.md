# Class: Receipt

[CdvPurchase](../modules/CdvPurchase.md).[GooglePlay](../modules/CdvPurchase.GooglePlay.md).Receipt

## Hierarchy

- [`Receipt`](CdvPurchase.Receipt.md)

  ↳ **`Receipt`**

## Table of contents

### Properties

- [orderId](CdvPurchase.GooglePlay.Receipt.md#orderid)
- [platform](CdvPurchase.GooglePlay.Receipt.md#platform)
- [purchaseToken](CdvPurchase.GooglePlay.Receipt.md#purchasetoken)
- [transactions](CdvPurchase.GooglePlay.Receipt.md#transactions)

### Methods

- [finish](CdvPurchase.GooglePlay.Receipt.md#finish)
- [hasTransaction](CdvPurchase.GooglePlay.Receipt.md#hastransaction)
- [lastTransaction](CdvPurchase.GooglePlay.Receipt.md#lasttransaction)
- [refreshPurchase](CdvPurchase.GooglePlay.Receipt.md#refreshpurchase)
- [verify](CdvPurchase.GooglePlay.Receipt.md#verify)

## Properties

### orderId

• `Optional` **orderId**: `string`

Unique order identifier for the transaction.  (like GPA.XXXX-XXXX-XXXX-XXXXX)

___

### platform

• **platform**: [`Platform`](../enums/CdvPurchase.Platform.md)

Platform that generated the receipt

#### Inherited from

[Receipt](CdvPurchase.Receipt.md).[platform](CdvPurchase.Receipt.md#platform)

___

### purchaseToken

• **purchaseToken**: `string`

Token that uniquely identifies a purchase for a given item and user pair.

___

### transactions

• **transactions**: [`Transaction`](CdvPurchase.Transaction.md)[] = `[]`

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

### refreshPurchase

▸ **refreshPurchase**(`purchase`): `void`

Refresh the content of the purchase based on the native BridgePurchase

#### Parameters

| Name | Type |
| :------ | :------ |
| `purchase` | [`Purchase`](../interfaces/CdvPurchase.GooglePlay.Bridge.Purchase.md) |

#### Returns

`void`

___

### verify

▸ **verify**(): `Promise`<`void`\>

Verify a receipt

#### Returns

`Promise`<`void`\>

#### Inherited from

[Receipt](CdvPurchase.Receipt.md).[verify](CdvPurchase.Receipt.md#verify)
