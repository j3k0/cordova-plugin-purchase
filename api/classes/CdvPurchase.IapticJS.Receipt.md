# Class: Receipt

[CdvPurchase](../modules/CdvPurchase.md).[IapticJS](../modules/CdvPurchase.IapticJS.md).Receipt

## Hierarchy

- [`Receipt`](CdvPurchase.Receipt.md)

  ↳ **`Receipt`**

## Table of contents

### Constructors

- [constructor](CdvPurchase.IapticJS.Receipt.md#constructor)

### Properties

- [accessToken](CdvPurchase.IapticJS.Receipt.md#accesstoken)
- [platform](CdvPurchase.IapticJS.Receipt.md#platform)
- [purchases](CdvPurchase.IapticJS.Receipt.md#purchases)
- [transactions](CdvPurchase.IapticJS.Receipt.md#transactions)

### Methods

- [finish](CdvPurchase.IapticJS.Receipt.md#finish)
- [hasTransaction](CdvPurchase.IapticJS.Receipt.md#hastransaction)
- [lastTransaction](CdvPurchase.IapticJS.Receipt.md#lasttransaction)
- [refresh](CdvPurchase.IapticJS.Receipt.md#refresh)
- [verify](CdvPurchase.IapticJS.Receipt.md#verify)

## Constructors

### constructor

• **new Receipt**(`purchases`, `accessToken`, `context`): [`Receipt`](CdvPurchase.IapticJS.Receipt.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `purchases` | `Purchase`[] |
| `accessToken` | `string` |
| `context` | `AdapterContext` |

#### Returns

[`Receipt`](CdvPurchase.IapticJS.Receipt.md)

#### Overrides

CdvPurchase.Receipt.constructor

## Properties

### accessToken

• **accessToken**: `string`

___

### platform

• **platform**: [`Platform`](../enums/CdvPurchase.Platform.md)

Platform that generated the receipt

#### Inherited from

[Receipt](CdvPurchase.Receipt.md).[platform](CdvPurchase.Receipt.md#platform)

___

### purchases

• **purchases**: `Purchase`[]

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

### refresh

▸ **refresh**(`purchases`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `purchases` | `Purchase`[] |

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
