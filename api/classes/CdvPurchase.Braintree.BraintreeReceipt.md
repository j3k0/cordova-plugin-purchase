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

- [hasTransaction](CdvPurchase.Braintree.BraintreeReceipt.md#hastransaction)
- [lastTransaction](CdvPurchase.Braintree.BraintreeReceipt.md#lasttransaction)
- [refresh](CdvPurchase.Braintree.BraintreeReceipt.md#refresh)

## Constructors

### constructor

• **new BraintreeReceipt**(`paymentRequest`, `dropInResult`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentRequest` | [`PaymentRequest`](../interfaces/CdvPurchase.PaymentRequest.md) |
| `dropInResult` | [`Result`](../interfaces/CdvPurchase.Braintree.DropIn.Result.md) |

#### Overrides

[Receipt](CdvPurchase.Receipt.md).[constructor](CdvPurchase.Receipt.md#constructor)

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

___

### refresh

▸ **refresh**(`paymentRequest`, `dropInResult`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentRequest` | [`PaymentRequest`](../interfaces/CdvPurchase.PaymentRequest.md) |
| `dropInResult` | [`Result`](../interfaces/CdvPurchase.Braintree.DropIn.Result.md) |

#### Returns

`void`
