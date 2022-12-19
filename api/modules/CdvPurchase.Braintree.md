# Namespace: Braintree

[CdvPurchase](CdvPurchase.md).Braintree

## Table of contents

### Namespaces

- [AndroidBridge](CdvPurchase.Braintree.AndroidBridge.md)
- [DropIn](CdvPurchase.Braintree.DropIn.md)
- [GooglePay](CdvPurchase.Braintree.GooglePay.md)
- [IosBridge](CdvPurchase.Braintree.IosBridge.md)
- [ThreeDSecure](CdvPurchase.Braintree.ThreeDSecure.md)

### Classes

- [Adapter](../classes/CdvPurchase.Braintree.Adapter.md)
- [BraintreeReceipt](../classes/CdvPurchase.Braintree.BraintreeReceipt.md)

### Interfaces

- [AdapterOptions](../interfaces/CdvPurchase.Braintree.AdapterOptions.md)
- [AdditionalData](../interfaces/CdvPurchase.Braintree.AdditionalData.md)
- [TransactionObject](../interfaces/CdvPurchase.Braintree.TransactionObject.md)

### Type Aliases

- [ClientTokenProvider](CdvPurchase.Braintree.md#clienttokenprovider)
- [Commercial](CdvPurchase.Braintree.md#commercial)
- [CustomerLocation](CdvPurchase.Braintree.md#customerlocation)
- [Debit](CdvPurchase.Braintree.md#debit)
- [DurbinRegulated](CdvPurchase.Braintree.md#durbinregulated)
- [HealthCare](CdvPurchase.Braintree.md#healthcare)
- [Payroll](CdvPurchase.Braintree.md#payroll)
- [Prepaid](CdvPurchase.Braintree.md#prepaid)

### Variables

- [customerId](CdvPurchase.Braintree.md#customerid)

## Type Aliases

### ClientTokenProvider

Ƭ **ClientTokenProvider**: (`callback`: [`Callback`](CdvPurchase.md#callback)<`string` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>) => `void`

#### Type declaration

▸ (`callback`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | [`Callback`](CdvPurchase.md#callback)<`string` \| [`IError`](../interfaces/CdvPurchase.IError.md)\> |

##### Returns

`void`

___

### Commercial

Ƭ **Commercial**: ``"Yes"`` \| ``"No"`` \| ``"Unknown"``

___

### CustomerLocation

Ƭ **CustomerLocation**: ``"US"`` \| ``"International"``

___

### Debit

Ƭ **Debit**: ``"Yes"`` \| ``"No"`` \| ``"Unknown"``

___

### DurbinRegulated

Ƭ **DurbinRegulated**: ``"Yes"`` \| ``"No"`` \| ``"Unknown"``

___

### HealthCare

Ƭ **HealthCare**: ``"Yes"`` \| ``"No"`` \| ``"Unknown"``

___

### Payroll

Ƭ **Payroll**: ``"Yes"`` \| ``"No"`` \| ``"Unknown"``

___

### Prepaid

Ƭ **Prepaid**: ``"Yes"`` \| ``"No"`` \| ``"Unknown"``

## Variables

### customerId

• **customerId**: `string` \| `undefined`

The Braintree customer identifier. Set it to allow reusing of payment methods.
