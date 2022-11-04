# Class: SKReceipt

[CdvPurchase](../modules/CdvPurchase.md).[AppleAppStore](../modules/CdvPurchase.AppleAppStore.md).SKReceipt

## Hierarchy

- [`Receipt`](CdvPurchase.Receipt.md)

  ↳ **`SKReceipt`**

## Table of contents

### Constructors

- [constructor](CdvPurchase.AppleAppStore.SKReceipt.md#constructor)

### Properties

- [platform](CdvPurchase.AppleAppStore.SKReceipt.md#platform)
- [transactions](CdvPurchase.AppleAppStore.SKReceipt.md#transactions)

### Methods

- [hasTransaction](CdvPurchase.AppleAppStore.SKReceipt.md#hastransaction)
- [lastTransaction](CdvPurchase.AppleAppStore.SKReceipt.md#lasttransaction)

## Constructors

### constructor

• **new SKReceipt**(`options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.platform` | [`Platform`](../enums/CdvPurchase.Platform.md) |
| `options.transactions` | [`Transaction`](CdvPurchase.Transaction.md)[] |

#### Inherited from

[Receipt](CdvPurchase.Receipt.md).[constructor](CdvPurchase.Receipt.md#constructor)

## Properties

### platform

• **platform**: [`Platform`](../enums/CdvPurchase.Platform.md)

Platform that generated the receipt

#### Inherited from

[Receipt](CdvPurchase.Receipt.md).[platform](CdvPurchase.Receipt.md#platform)

___

### transactions

• **transactions**: [`Transaction`](CdvPurchase.Transaction.md)[]

List of transactions contained in the receipt

#### Inherited from

[Receipt](CdvPurchase.Receipt.md).[transactions](CdvPurchase.Receipt.md#transactions)

## Methods

### hasTransaction

▸ **hasTransaction**(`value`): `boolean`

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

#### Returns

[`Transaction`](CdvPurchase.Transaction.md)

#### Inherited from

[Receipt](CdvPurchase.Receipt.md).[lastTransaction](CdvPurchase.Receipt.md#lasttransaction)
