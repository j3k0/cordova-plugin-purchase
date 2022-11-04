# Class: Receipt

[CdvPurchase](../modules/CdvPurchase.md).Receipt

## Hierarchy

- **`Receipt`**

  ↳ [`SKReceipt`](CdvPurchase.AppleAppStore.SKReceipt.md)

  ↳ [`BraintreeReceipt`](CdvPurchase.Braintree.BraintreeReceipt.md)

  ↳ [`Receipt`](CdvPurchase.GooglePlay.Receipt.md)

## Table of contents

### Constructors

- [constructor](CdvPurchase.Receipt.md#constructor)

### Properties

- [platform](CdvPurchase.Receipt.md#platform)
- [transactions](CdvPurchase.Receipt.md#transactions)

### Methods

- [hasTransaction](CdvPurchase.Receipt.md#hastransaction)
- [lastTransaction](CdvPurchase.Receipt.md#lasttransaction)

## Constructors

### constructor

• **new Receipt**(`options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.platform` | [`Platform`](../enums/CdvPurchase.Platform.md) |
| `options.transactions` | [`Transaction`](CdvPurchase.Transaction.md)[] |

## Properties

### platform

• **platform**: [`Platform`](../enums/CdvPurchase.Platform.md)

Platform that generated the receipt

___

### transactions

• **transactions**: [`Transaction`](CdvPurchase.Transaction.md)[]

List of transactions contained in the receipt

## Methods

### hasTransaction

▸ **hasTransaction**(`value`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`Transaction`](CdvPurchase.Transaction.md) |

#### Returns

`boolean`

___

### lastTransaction

▸ **lastTransaction**(): [`Transaction`](CdvPurchase.Transaction.md)

#### Returns

[`Transaction`](CdvPurchase.Transaction.md)
