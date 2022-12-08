# Class: BraintreeReceipt

[CdvPurchase](../modules/CdvPurchase.md).[Braintree](../modules/CdvPurchase.Braintree.md).BraintreeReceipt

## Hierarchy

- [`Receipt`](CdvPurchase.Receipt.md)

  ↳ **`BraintreeReceipt`**

## Table of contents

### Constructors

- [constructor](CdvPurchase.Braintree.BraintreeReceipt.md#constructor)

### Properties

- [dropInResult](CdvPurchase.Braintree.BraintreeReceipt.md#dropinresult)
- [paymentRequest](CdvPurchase.Braintree.BraintreeReceipt.md#paymentrequest)
- [platform](CdvPurchase.Braintree.BraintreeReceipt.md#platform)
- [transactions](CdvPurchase.Braintree.BraintreeReceipt.md#transactions)

### Methods

- [finish](CdvPurchase.Braintree.BraintreeReceipt.md#finish)
- [hasTransaction](CdvPurchase.Braintree.BraintreeReceipt.md#hastransaction)
- [lastTransaction](CdvPurchase.Braintree.BraintreeReceipt.md#lasttransaction)
- [refresh](CdvPurchase.Braintree.BraintreeReceipt.md#refresh)
- [verify](CdvPurchase.Braintree.BraintreeReceipt.md#verify)

## Constructors

### constructor

• **new BraintreeReceipt**(`paymentRequest`, `dropInResult`, `decorator`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentRequest` | [`PaymentRequest`](../interfaces/CdvPurchase.PaymentRequest.md) |
| `dropInResult` | [`Result`](../interfaces/CdvPurchase.Braintree.DropIn.Result.md) |
| `decorator` | `TransactionDecorator` & `ReceiptDecorator` |

#### Overrides

Receipt.constructor

## Properties

### dropInResult

• **dropInResult**: [`Result`](../interfaces/CdvPurchase.Braintree.DropIn.Result.md)

___

### paymentRequest

• **paymentRequest**: [`PaymentRequest`](../interfaces/CdvPurchase.PaymentRequest.md)

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

▸ **refresh**(`paymentRequest`, `dropInResult`, `decorator`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentRequest` | [`PaymentRequest`](../interfaces/CdvPurchase.PaymentRequest.md) |
| `dropInResult` | [`Result`](../interfaces/CdvPurchase.Braintree.DropIn.Result.md) |
| `decorator` | `TransactionDecorator` |

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
