# Class: Adapter

[CdvPurchase](../modules/CdvPurchase.md).[Braintree](../modules/CdvPurchase.Braintree.md).Adapter

Adapter for a payment or in-app purchase platform

## Implements

- [`Adapter`](../interfaces/CdvPurchase.Adapter.md)

## Table of contents

### Constructors

- [constructor](CdvPurchase.Braintree.Adapter.md#constructor)

### Properties

- [\_receipts](CdvPurchase.Braintree.Adapter.md#_receipts)
- [androidBridge](CdvPurchase.Braintree.Adapter.md#androidbridge)
- [id](CdvPurchase.Braintree.Adapter.md#id)
- [iosBridge](CdvPurchase.Braintree.Adapter.md#iosbridge)
- [log](CdvPurchase.Braintree.Adapter.md#log)
- [name](CdvPurchase.Braintree.Adapter.md#name)
- [options](CdvPurchase.Braintree.Adapter.md#options)
- [products](CdvPurchase.Braintree.Adapter.md#products)
- [ready](CdvPurchase.Braintree.Adapter.md#ready)

### Accessors

- [isSupported](CdvPurchase.Braintree.Adapter.md#issupported)
- [receipts](CdvPurchase.Braintree.Adapter.md#receipts)

### Methods

- [checkSupport](CdvPurchase.Braintree.Adapter.md#checksupport)
- [finish](CdvPurchase.Braintree.Adapter.md#finish)
- [handleReceiptValidationResponse](CdvPurchase.Braintree.Adapter.md#handlereceiptvalidationresponse)
- [initialize](CdvPurchase.Braintree.Adapter.md#initialize)
- [loadProducts](CdvPurchase.Braintree.Adapter.md#loadproducts)
- [loadReceipts](CdvPurchase.Braintree.Adapter.md#loadreceipts)
- [manageBilling](CdvPurchase.Braintree.Adapter.md#managebilling)
- [manageSubscriptions](CdvPurchase.Braintree.Adapter.md#managesubscriptions)
- [order](CdvPurchase.Braintree.Adapter.md#order)
- [receiptValidationBody](CdvPurchase.Braintree.Adapter.md#receiptvalidationbody)
- [requestPayment](CdvPurchase.Braintree.Adapter.md#requestpayment)
- [restorePurchases](CdvPurchase.Braintree.Adapter.md#restorepurchases)

## Constructors

### constructor

• **new Adapter**(`context`, `options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | `AdapterContext` |
| `options` | [`AdapterOptions`](../interfaces/CdvPurchase.Braintree.AdapterOptions.md) |

## Properties

### \_receipts

• **\_receipts**: [`BraintreeReceipt`](CdvPurchase.Braintree.BraintreeReceipt.md)[] = `[]`

___

### androidBridge

• `Optional` **androidBridge**: [`Bridge`](CdvPurchase.Braintree.AndroidBridge.Bridge.md)

___

### id

• **id**: [`Platform`](../enums/CdvPurchase.Platform.md) = `Platform.BRAINTREE`

Platform identifier

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[id](../interfaces/CdvPurchase.Adapter.md#id)

___

### iosBridge

• `Optional` **iosBridge**: [`Bridge`](CdvPurchase.Braintree.IosBridge.Bridge.md)

___

### log

• **log**: [`Logger`](CdvPurchase.Logger.md)

___

### name

• **name**: `string` = `'BrainTree'`

Nice name for the adapter

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[name](../interfaces/CdvPurchase.Adapter.md#name)

___

### options

• **options**: [`AdapterOptions`](../interfaces/CdvPurchase.Braintree.AdapterOptions.md)

___

### products

• **products**: [`Product`](CdvPurchase.Product.md)[] = `[]`

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[products](../interfaces/CdvPurchase.Adapter.md#products)

___

### ready

• **ready**: `boolean` = `false`

true after the platform has been successfully initialized.

The value is set by the "Adapters" class (which is responsible for initializing adapters).

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[ready](../interfaces/CdvPurchase.Adapter.md#ready)

## Accessors

### isSupported

• `get` **isSupported**(): `boolean`

Returns true is the adapter is supported on this device.

#### Returns

`boolean`

#### Implementation of

CdvPurchase.Adapter.isSupported

___

### receipts

• `get` **receipts**(): [`Receipt`](CdvPurchase.Receipt.md)[]

List of purchase receipts.

#### Returns

[`Receipt`](CdvPurchase.Receipt.md)[]

#### Implementation of

CdvPurchase.Adapter.receipts

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

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[checkSupport](../interfaces/CdvPurchase.Adapter.md#checksupport)

___

### finish

▸ **finish**(`transaction`): `Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

Finish a transaction.

For non-consumables, this will acknowledge the purchase.
For consumable, this will acknowledge and consume the purchase.

#### Parameters

| Name | Type |
| :------ | :------ |
| `transaction` | [`Transaction`](CdvPurchase.Transaction.md) |

#### Returns

`Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[finish](../interfaces/CdvPurchase.Adapter.md#finish)

___

### handleReceiptValidationResponse

▸ **handleReceiptValidationResponse**(`receipt`, `response`): `Promise`<`void`\>

Handle a response from a receipt validation process.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `receipt` | [`Receipt`](CdvPurchase.Receipt.md) | The receipt being validated. |
| `response` | [`Payload`](../modules/CdvPurchase.Validator.Response.md#payload) | The response payload from the receipt validation process. |

#### Returns

`Promise`<`void`\>

A promise that resolves when the response has been handled.

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[handleReceiptValidationResponse](../interfaces/CdvPurchase.Adapter.md#handlereceiptvalidationresponse)

___

### initialize

▸ **initialize**(): `Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

Initialize the Braintree Adapter.

#### Returns

`Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[initialize](../interfaces/CdvPurchase.Adapter.md#initialize)

___

### loadProducts

▸ **loadProducts**(`products`): `Promise`<([`IError`](../interfaces/CdvPurchase.IError.md) \| [`Product`](CdvPurchase.Product.md))[]\>

Load product definitions from the platform.

#### Parameters

| Name | Type |
| :------ | :------ |
| `products` | [`IRegisterProduct`](../interfaces/CdvPurchase.IRegisterProduct.md)[] |

#### Returns

`Promise`<([`IError`](../interfaces/CdvPurchase.IError.md) \| [`Product`](CdvPurchase.Product.md))[]\>

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[loadProducts](../interfaces/CdvPurchase.Adapter.md#loadproducts)

___

### loadReceipts

▸ **loadReceipts**(): `Promise`<[`Receipt`](CdvPurchase.Receipt.md)[]\>

Load the receipts

#### Returns

`Promise`<[`Receipt`](CdvPurchase.Receipt.md)[]\>

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[loadReceipts](../interfaces/CdvPurchase.Adapter.md#loadreceipts)

___

### manageBilling

▸ **manageBilling**(): `Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

Open the platforms' billing management interface.

#### Returns

`Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[manageBilling](../interfaces/CdvPurchase.Adapter.md#managebilling)

___

### manageSubscriptions

▸ **manageSubscriptions**(): `Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

Open the platforms' subscription management interface.

#### Returns

`Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[manageSubscriptions](../interfaces/CdvPurchase.Adapter.md#managesubscriptions)

___

### order

▸ **order**(`offer`): `Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

Initializes an order.

#### Parameters

| Name | Type |
| :------ | :------ |
| `offer` | [`Offer`](CdvPurchase.Offer.md) |

#### Returns

`Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[order](../interfaces/CdvPurchase.Adapter.md#order)

___

### receiptValidationBody

▸ **receiptValidationBody**(`receipt`): `Promise`<`undefined` \| [`Body`](../interfaces/CdvPurchase.Validator.Request.Body.md)\>

Prepare for receipt validation

#### Parameters

| Name | Type |
| :------ | :------ |
| `receipt` | [`BraintreeReceipt`](CdvPurchase.Braintree.BraintreeReceipt.md) |

#### Returns

`Promise`<`undefined` \| [`Body`](../interfaces/CdvPurchase.Validator.Request.Body.md)\>

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[receiptValidationBody](../interfaces/CdvPurchase.Adapter.md#receiptvalidationbody)

___

### requestPayment

▸ **requestPayment**(`paymentRequest`, `additionalData?`): `Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md) \| [`Transaction`](CdvPurchase.Transaction.md)\>

Request a payment from the user

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentRequest` | [`PaymentRequest`](../interfaces/CdvPurchase.PaymentRequest.md) |
| `additionalData?` | [`AdditionalData`](../interfaces/CdvPurchase.AdditionalData.md) |

#### Returns

`Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md) \| [`Transaction`](CdvPurchase.Transaction.md)\>

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[requestPayment](../interfaces/CdvPurchase.Adapter.md#requestpayment)

___

### restorePurchases

▸ **restorePurchases**(): `Promise`<`void`\>

Replay the queue of transactions.

Might ask the user to login.

#### Returns

`Promise`<`void`\>

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[restorePurchases](../interfaces/CdvPurchase.Adapter.md#restorepurchases)
