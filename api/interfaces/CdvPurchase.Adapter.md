# Interface: Adapter

[CdvPurchase](../modules/CdvPurchase.md).Adapter

Adapter for a payment or in-app purchase platform

## Implemented by

- [`Adapter`](../classes/CdvPurchase.AppleAppStore.Adapter.md)
- [`Adapter`](../classes/CdvPurchase.Braintree.Adapter.md)
- [`Adapter`](../classes/CdvPurchase.GooglePlay.Adapter.md)
- [`Adapter`](../classes/CdvPurchase.Test.Adapter.md)
- [`Adapter`](../classes/CdvPurchase.WindowsStore.Adapter.md)

## Table of contents

### Properties

- [id](CdvPurchase.Adapter.md#id)
- [isSupported](CdvPurchase.Adapter.md#issupported)
- [name](CdvPurchase.Adapter.md#name)
- [products](CdvPurchase.Adapter.md#products)
- [ready](CdvPurchase.Adapter.md#ready)
- [receipts](CdvPurchase.Adapter.md#receipts)
- [supportsParallelLoading](CdvPurchase.Adapter.md#supportsparallelloading)

### Methods

- [checkSupport](CdvPurchase.Adapter.md#checksupport)
- [finish](CdvPurchase.Adapter.md#finish)
- [handleReceiptValidationResponse](CdvPurchase.Adapter.md#handlereceiptvalidationresponse)
- [initialize](CdvPurchase.Adapter.md#initialize)
- [loadProducts](CdvPurchase.Adapter.md#loadproducts)
- [loadReceipts](CdvPurchase.Adapter.md#loadreceipts)
- [manageBilling](CdvPurchase.Adapter.md#managebilling)
- [manageSubscriptions](CdvPurchase.Adapter.md#managesubscriptions)
- [order](CdvPurchase.Adapter.md#order)
- [receiptValidationBody](CdvPurchase.Adapter.md#receiptvalidationbody)
- [requestPayment](CdvPurchase.Adapter.md#requestpayment)
- [restorePurchases](CdvPurchase.Adapter.md#restorepurchases)

## Properties

### id

• **id**: [`Platform`](../enums/CdvPurchase.Platform.md)

Platform identifier

___

### isSupported

• **isSupported**: `boolean`

Returns true is the adapter is supported on this device.

___

### name

• **name**: `string`

Nice name for the adapter

___

### products

• **products**: [`Product`](../classes/CdvPurchase.Product.md)[]

List of products managed by the adapter.

___

### ready

• **ready**: `boolean`

true after the platform has been successfully initialized.

The value is set by the "Adapters" class (which is responsible for initializing adapters).

___

### receipts

• **receipts**: [`Receipt`](../classes/CdvPurchase.Receipt.md)[]

List of purchase receipts.

___

### supportsParallelLoading

• **supportsParallelLoading**: `boolean`

Set to true if receipts and products can be loaded in parallel

## Methods

### checkSupport

▸ **checkSupport**(`functionality`): `boolean`

Returns true if the platform supports the given functionality.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionality` | [`PlatformFunctionality`](../modules/CdvPurchase.md#platformfunctionality) |

#### Returns

`boolean`

___

### finish

▸ **finish**(`transaction`): `Promise`\<`undefined` \| [`IError`](CdvPurchase.IError.md)\>

Finish a transaction.

For non-consumables, this will acknowledge the purchase.
For consumable, this will acknowledge and consume the purchase.

#### Parameters

| Name | Type |
| :------ | :------ |
| `transaction` | [`Transaction`](../classes/CdvPurchase.Transaction.md) |

#### Returns

`Promise`\<`undefined` \| [`IError`](CdvPurchase.IError.md)\>

___

### handleReceiptValidationResponse

▸ **handleReceiptValidationResponse**(`receipt`, `response`): `Promise`\<`void`\>

Handle platform specific fields from receipt validation response.

#### Parameters

| Name | Type |
| :------ | :------ |
| `receipt` | [`Receipt`](../classes/CdvPurchase.Receipt.md) |
| `response` | [`Payload`](../modules/CdvPurchase.Validator.Response.md#payload) |

#### Returns

`Promise`\<`void`\>

___

### initialize

▸ **initialize**(): `Promise`\<`undefined` \| [`IError`](CdvPurchase.IError.md)\>

Initializes a platform adapter.

Will resolve when initialization is complete.

Will fail with an `IError` in case of an unrecoverable error.

In other case of a potentially recoverable error, the adapter will keep retrying to initialize forever.

#### Returns

`Promise`\<`undefined` \| [`IError`](CdvPurchase.IError.md)\>

___

### loadProducts

▸ **loadProducts**(`products`): `Promise`\<([`IError`](CdvPurchase.IError.md) \| [`Product`](../classes/CdvPurchase.Product.md))[]\>

Load product definitions from the platform.

#### Parameters

| Name | Type |
| :------ | :------ |
| `products` | [`IRegisterProduct`](CdvPurchase.IRegisterProduct.md)[] |

#### Returns

`Promise`\<([`IError`](CdvPurchase.IError.md) \| [`Product`](../classes/CdvPurchase.Product.md))[]\>

___

### loadReceipts

▸ **loadReceipts**(): `Promise`\<[`Receipt`](../classes/CdvPurchase.Receipt.md)[]\>

Load the receipts

#### Returns

`Promise`\<[`Receipt`](../classes/CdvPurchase.Receipt.md)[]\>

___

### manageBilling

▸ **manageBilling**(): `Promise`\<`undefined` \| [`IError`](CdvPurchase.IError.md)\>

Open the platforms' billing management interface.

#### Returns

`Promise`\<`undefined` \| [`IError`](CdvPurchase.IError.md)\>

___

### manageSubscriptions

▸ **manageSubscriptions**(): `Promise`\<`undefined` \| [`IError`](CdvPurchase.IError.md)\>

Open the platforms' subscription management interface.

#### Returns

`Promise`\<`undefined` \| [`IError`](CdvPurchase.IError.md)\>

___

### order

▸ **order**(`offer`, `additionalData`): `Promise`\<`undefined` \| [`IError`](CdvPurchase.IError.md)\>

Initializes an order.

#### Parameters

| Name | Type |
| :------ | :------ |
| `offer` | [`Offer`](../classes/CdvPurchase.Offer.md) |
| `additionalData` | [`AdditionalData`](CdvPurchase.AdditionalData.md) |

#### Returns

`Promise`\<`undefined` \| [`IError`](CdvPurchase.IError.md)\>

___

### receiptValidationBody

▸ **receiptValidationBody**(`receipt`): `Promise`\<`undefined` \| [`Body`](CdvPurchase.Validator.Request.Body.md)\>

Prepare for receipt validation

#### Parameters

| Name | Type |
| :------ | :------ |
| `receipt` | [`Receipt`](../classes/CdvPurchase.Receipt.md) |

#### Returns

`Promise`\<`undefined` \| [`Body`](CdvPurchase.Validator.Request.Body.md)\>

___

### requestPayment

▸ **requestPayment**(`payment`, `additionalData?`): `Promise`\<`undefined` \| [`IError`](CdvPurchase.IError.md) \| [`Transaction`](../classes/CdvPurchase.Transaction.md)\>

Request a payment from the user

#### Parameters

| Name | Type |
| :------ | :------ |
| `payment` | [`PaymentRequest`](CdvPurchase.PaymentRequest.md) |
| `additionalData?` | [`AdditionalData`](CdvPurchase.AdditionalData.md) |

#### Returns

`Promise`\<`undefined` \| [`IError`](CdvPurchase.IError.md) \| [`Transaction`](../classes/CdvPurchase.Transaction.md)\>

___

### restorePurchases

▸ **restorePurchases**(): `Promise`\<`undefined` \| [`IError`](CdvPurchase.IError.md)\>

Replay the queue of transactions.

Might ask the user to login.

#### Returns

`Promise`\<`undefined` \| [`IError`](CdvPurchase.IError.md)\>
