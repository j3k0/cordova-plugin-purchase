# Class: Adapter

[CdvPurchase](../modules/CdvPurchase.md).[Test](../modules/CdvPurchase.Test.md).Adapter

Test Adapter used for local testing with mock products.

This adapter simulates a payment platform that supports both In-App Products and Payment Requests.

The list of supported In-App Products

**`See`**

Test.TEST_PRODUCTS

## Implements

- [`Adapter`](../interfaces/CdvPurchase.Adapter.md)

## Table of contents

### Constructors

- [constructor](CdvPurchase.Test.Adapter.md#constructor)

### Properties

- [id](CdvPurchase.Test.Adapter.md#id)
- [name](CdvPurchase.Test.Adapter.md#name)
- [products](CdvPurchase.Test.Adapter.md#products)
- [ready](CdvPurchase.Test.Adapter.md#ready)
- [receipts](CdvPurchase.Test.Adapter.md#receipts)

### Accessors

- [isSupported](CdvPurchase.Test.Adapter.md#issupported)

### Methods

- [finish](CdvPurchase.Test.Adapter.md#finish)
- [handleReceiptValidationResponse](CdvPurchase.Test.Adapter.md#handlereceiptvalidationresponse)
- [initialize](CdvPurchase.Test.Adapter.md#initialize)
- [load](CdvPurchase.Test.Adapter.md#load)
- [manageSubscriptions](CdvPurchase.Test.Adapter.md#managesubscriptions)
- [order](CdvPurchase.Test.Adapter.md#order)
- [receiptValidationBody](CdvPurchase.Test.Adapter.md#receiptvalidationbody)
- [requestPayment](CdvPurchase.Test.Adapter.md#requestpayment)
- [verify](CdvPurchase.Test.Adapter.md#verify)

## Constructors

### constructor

• **new Adapter**(`context`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | `AdapterContext` |

## Properties

### id

• **id**: [`Platform`](../enums/CdvPurchase.Platform.md) = `Platform.TEST`

Platform identifier

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[id](../interfaces/CdvPurchase.Adapter.md#id)

___

### name

• **name**: `string` = `'Test'`

Nice name for the adapter

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[name](../interfaces/CdvPurchase.Adapter.md#name)

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

___

### receipts

• **receipts**: [`Receipt`](CdvPurchase.Receipt.md)[] = `[]`

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[receipts](../interfaces/CdvPurchase.Adapter.md#receipts)

## Accessors

### isSupported

• `get` **isSupported**(): `boolean`

Returns true is the adapter is supported on this device.

#### Returns

`boolean`

#### Implementation of

CdvPurchase.Adapter.isSupported

## Methods

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

Handle platform specific fields from receipt validation response.

#### Parameters

| Name | Type |
| :------ | :------ |
| `receipt` | [`Receipt`](CdvPurchase.Receipt.md) |
| `response` | [`Payload`](../modules/CdvPurchase.Validator.Response.md#payload) |

#### Returns

`Promise`<`void`\>

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[handleReceiptValidationResponse](../interfaces/CdvPurchase.Adapter.md#handlereceiptvalidationresponse)

___

### initialize

▸ **initialize**(): `Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

Initializes a platform adapter.

Will resolve when initialization is complete.

Will fail with an `IError` in case of an unrecoverable error.

In other case of a potentially recoverable error, the adapter will keep retrying to initialize forever.

#### Returns

`Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[initialize](../interfaces/CdvPurchase.Adapter.md#initialize)

___

### load

▸ **load**(`products`): `Promise`<([`IError`](../interfaces/CdvPurchase.IError.md) \| [`Product`](CdvPurchase.Product.md))[]\>

Load product definitions from the platform.

#### Parameters

| Name | Type |
| :------ | :------ |
| `products` | [`IRegisterProduct`](../interfaces/CdvPurchase.IRegisterProduct.md)[] |

#### Returns

`Promise`<([`IError`](../interfaces/CdvPurchase.IError.md) \| [`Product`](CdvPurchase.Product.md))[]\>

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[load](../interfaces/CdvPurchase.Adapter.md#load)

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

▸ **receiptValidationBody**(`receipt`): `undefined` \| [`Body`](../interfaces/CdvPurchase.Validator.Request.Body.md)

Prepare for receipt validation

#### Parameters

| Name | Type |
| :------ | :------ |
| `receipt` | [`Receipt`](CdvPurchase.Receipt.md) |

#### Returns

`undefined` \| [`Body`](../interfaces/CdvPurchase.Validator.Request.Body.md)

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[receiptValidationBody](../interfaces/CdvPurchase.Adapter.md#receiptvalidationbody)

___

### requestPayment

▸ **requestPayment**(`paymentRequest`, `additionalData?`): `Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

Request a payment from the user

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentRequest` | [`PaymentRequest`](../interfaces/CdvPurchase.PaymentRequest.md) |
| `additionalData?` | [`AdditionalData`](../interfaces/CdvPurchase.AdditionalData.md) |

#### Returns

`Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[requestPayment](../interfaces/CdvPurchase.Adapter.md#requestpayment)

___

### verify

▸ `Static` **verify**(`receipt`, `callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `receipt` | [`Receipt`](CdvPurchase.Receipt.md) |
| `callback` | [`Callback`](../modules/CdvPurchase.md#callback)<`ReceiptResponse`\> |

#### Returns

`void`
