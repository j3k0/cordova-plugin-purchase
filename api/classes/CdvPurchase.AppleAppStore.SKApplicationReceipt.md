# Class: SKApplicationReceipt

[CdvPurchase](../modules/CdvPurchase.md).[AppleAppStore](../modules/CdvPurchase.AppleAppStore.md).SKApplicationReceipt

StoreKit 1 exposes a single receipt that contains all transactions.

## Hierarchy

- [`Receipt`](CdvPurchase.Receipt.md)

  ↳ **`SKApplicationReceipt`**

## Table of contents

### Constructors

- [constructor](CdvPurchase.AppleAppStore.SKApplicationReceipt.md#constructor)

### Properties

- [nativeData](CdvPurchase.AppleAppStore.SKApplicationReceipt.md#nativedata)
- [platform](CdvPurchase.AppleAppStore.SKApplicationReceipt.md#platform)
- [transactions](CdvPurchase.AppleAppStore.SKApplicationReceipt.md#transactions)

### Methods

- [finish](CdvPurchase.AppleAppStore.SKApplicationReceipt.md#finish)
- [hasTransaction](CdvPurchase.AppleAppStore.SKApplicationReceipt.md#hastransaction)
- [lastTransaction](CdvPurchase.AppleAppStore.SKApplicationReceipt.md#lasttransaction)
- [refresh](CdvPurchase.AppleAppStore.SKApplicationReceipt.md#refresh)
- [verify](CdvPurchase.AppleAppStore.SKApplicationReceipt.md#verify)

## Constructors

### constructor

• **new SKApplicationReceipt**(`applicationReceipt`, `needApplicationReceipt`, `decorator`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `applicationReceipt` | [`ApplicationReceipt`](../interfaces/CdvPurchase.AppleAppStore.ApplicationReceipt.md) |
| `needApplicationReceipt` | `boolean` |
| `decorator` | `ReceiptDecorator` & `TransactionDecorator` |

#### Overrides

Receipt.constructor

## Properties

### nativeData

• **nativeData**: [`ApplicationReceipt`](../interfaces/CdvPurchase.AppleAppStore.ApplicationReceipt.md)

___

### platform

• **platform**: [`Platform`](../enums/CdvPurchase.Platform.md)

Platform that generated the receipt

#### Inherited from

[Receipt](CdvPurchase.Receipt.md).[platform](CdvPurchase.Receipt.md#platform)

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

### refresh

▸ **refresh**(`nativeData`, `needApplicationReceipt`, `decorator`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `nativeData` | [`ApplicationReceipt`](../interfaces/CdvPurchase.AppleAppStore.ApplicationReceipt.md) |
| `needApplicationReceipt` | `boolean` |
| `decorator` | `ReceiptDecorator` & `TransactionDecorator` |

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
