# Class: Adapter

[CdvPurchase](../modules/CdvPurchase.md).[IapticJS](../modules/CdvPurchase.IapticJS.md).Adapter

Adapter for a payment or in-app purchase platform

## Implements

- [`Adapter`](../interfaces/CdvPurchase.Adapter.md)

## Table of contents

### Constructors

- [constructor](CdvPurchase.IapticJS.Adapter.md#constructor)

### Properties

- [\_receipts](CdvPurchase.IapticJS.Adapter.md#_receipts)
- [id](CdvPurchase.IapticJS.Adapter.md#id)
- [name](CdvPurchase.IapticJS.Adapter.md#name)
- [products](CdvPurchase.IapticJS.Adapter.md#products)
- [ready](CdvPurchase.IapticJS.Adapter.md#ready)
- [supportsParallelLoading](CdvPurchase.IapticJS.Adapter.md#supportsparallelloading)

### Accessors

- [isSupported](CdvPurchase.IapticJS.Adapter.md#issupported)
- [receipts](CdvPurchase.IapticJS.Adapter.md#receipts)

### Methods

- [checkSupport](CdvPurchase.IapticJS.Adapter.md#checksupport)
- [finish](CdvPurchase.IapticJS.Adapter.md#finish)
- [handleReceiptValidationResponse](CdvPurchase.IapticJS.Adapter.md#handlereceiptvalidationresponse)
- [initialize](CdvPurchase.IapticJS.Adapter.md#initialize)
- [loadProducts](CdvPurchase.IapticJS.Adapter.md#loadproducts)
- [loadReceipts](CdvPurchase.IapticJS.Adapter.md#loadreceipts)
- [manageBilling](CdvPurchase.IapticJS.Adapter.md#managebilling)
- [manageSubscriptions](CdvPurchase.IapticJS.Adapter.md#managesubscriptions)
- [order](CdvPurchase.IapticJS.Adapter.md#order)
- [receiptValidationBody](CdvPurchase.IapticJS.Adapter.md#receiptvalidationbody)
- [requestPayment](CdvPurchase.IapticJS.Adapter.md#requestpayment)
- [restorePurchases](CdvPurchase.IapticJS.Adapter.md#restorepurchases)

## Constructors

### constructor

• **new Adapter**(`context`, `options`): [`Adapter`](CdvPurchase.IapticJS.Adapter.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | `AdapterContext` |
| `options` | `Config` |

#### Returns

[`Adapter`](CdvPurchase.IapticJS.Adapter.md)

## Properties

### \_receipts

• **\_receipts**: [`Receipt`](CdvPurchase.IapticJS.Receipt.md)[] = `[]`

___

### id

• **id**: [`Platform`](../enums/CdvPurchase.Platform.md) = `Platform.IAPTIC_JS`

Platform identifier

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[id](../interfaces/CdvPurchase.Adapter.md#id)

___

### name

• **name**: `string` = `'IapticJS'`

Nice name for the adapter

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[name](../interfaces/CdvPurchase.Adapter.md#name)

___

### products

• **products**: [`Product`](CdvPurchase.Product.md)[] = `[]`

List of products managed by the adapter.

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

### supportsParallelLoading

• **supportsParallelLoading**: `boolean` = `false`

Set to true if receipts and products can be loaded in parallel

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[supportsParallelLoading](../interfaces/CdvPurchase.Adapter.md#supportsparallelloading)

## Accessors

### isSupported

• `get` **isSupported**(): `boolean`

Returns true is the adapter is supported on this device.

#### Returns

`boolean`

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[isSupported](../interfaces/CdvPurchase.Adapter.md#issupported)

___

### receipts

• `get` **receipts**(): [`Receipt`](CdvPurchase.IapticJS.Receipt.md)[]

List of purchase receipts.

#### Returns

[`Receipt`](CdvPurchase.IapticJS.Receipt.md)[]

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[receipts](../interfaces/CdvPurchase.Adapter.md#receipts)

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

▸ **finish**(`transaction`): `Promise`\<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

Finish a transaction.

For non-consumables, this will acknowledge the purchase.
For consumable, this will acknowledge and consume the purchase.

#### Parameters

| Name | Type |
| :------ | :------ |
| `transaction` | [`Transaction`](CdvPurchase.IapticJS.Transaction.md) |

#### Returns

`Promise`\<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[finish](../interfaces/CdvPurchase.Adapter.md#finish)

___

### handleReceiptValidationResponse

▸ **handleReceiptValidationResponse**(`receipt`, `response`): `Promise`\<`void`\>

Handle platform specific fields from receipt validation response.

#### Parameters

| Name | Type |
| :------ | :------ |
| `receipt` | [`Receipt`](CdvPurchase.IapticJS.Receipt.md) |
| `response` | [`Payload`](../modules/CdvPurchase.Validator.Response.md#payload) |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[handleReceiptValidationResponse](../interfaces/CdvPurchase.Adapter.md#handlereceiptvalidationresponse)

___

### initialize

▸ **initialize**(): `Promise`\<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

Initializes a platform adapter.

Will resolve when initialization is complete.

Will fail with an `IError` in case of an unrecoverable error.

In other case of a potentially recoverable error, the adapter will keep retrying to initialize forever.

#### Returns

`Promise`\<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[initialize](../interfaces/CdvPurchase.Adapter.md#initialize)

___

### loadProducts

▸ **loadProducts**(`products`): `Promise`\<([`IError`](../interfaces/CdvPurchase.IError.md) \| [`Product`](CdvPurchase.Product.md))[]\>

Load product definitions from the platform.

#### Parameters

| Name | Type |
| :------ | :------ |
| `products` | [`IRegisterProduct`](../interfaces/CdvPurchase.IRegisterProduct.md)[] |

#### Returns

`Promise`\<([`IError`](../interfaces/CdvPurchase.IError.md) \| [`Product`](CdvPurchase.Product.md))[]\>

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[loadProducts](../interfaces/CdvPurchase.Adapter.md#loadproducts)

___

### loadReceipts

▸ **loadReceipts**(): `Promise`\<[`Receipt`](CdvPurchase.IapticJS.Receipt.md)[]\>

Load the receipts

#### Returns

`Promise`\<[`Receipt`](CdvPurchase.IapticJS.Receipt.md)[]\>

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[loadReceipts](../interfaces/CdvPurchase.Adapter.md#loadreceipts)

___

### manageBilling

▸ **manageBilling**(): `Promise`\<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

Open the platforms' billing management interface.

#### Returns

`Promise`\<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[manageBilling](../interfaces/CdvPurchase.Adapter.md#managebilling)

___

### manageSubscriptions

▸ **manageSubscriptions**(): `Promise`\<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

Open the platforms' subscription management interface.

#### Returns

`Promise`\<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[manageSubscriptions](../interfaces/CdvPurchase.Adapter.md#managesubscriptions)

___

### order

▸ **order**(`offer`, `additionalData`): `Promise`\<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

Initializes an order.

#### Parameters

| Name | Type |
| :------ | :------ |
| `offer` | [`Offer`](CdvPurchase.Offer.md) |
| `additionalData` | [`AdditionalData`](../interfaces/CdvPurchase.AdditionalData.md) |

#### Returns

`Promise`\<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[order](../interfaces/CdvPurchase.Adapter.md#order)

___

### receiptValidationBody

▸ **receiptValidationBody**(`receipt`): `Promise`\<`undefined` \| [`Body`](../interfaces/CdvPurchase.Validator.Request.Body.md)\>

Prepare for receipt validation

#### Parameters

| Name | Type |
| :------ | :------ |
| `receipt` | [`Receipt`](CdvPurchase.IapticJS.Receipt.md) |

#### Returns

`Promise`\<`undefined` \| [`Body`](../interfaces/CdvPurchase.Validator.Request.Body.md)\>

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[receiptValidationBody](../interfaces/CdvPurchase.Adapter.md#receiptvalidationbody)

___

### requestPayment

▸ **requestPayment**(`payment`, `additionalData?`): `Promise`\<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md) \| [`Transaction`](CdvPurchase.IapticJS.Transaction.md)\>

Request a payment from the user

#### Parameters

| Name | Type |
| :------ | :------ |
| `payment` | [`PaymentRequest`](../interfaces/CdvPurchase.PaymentRequest.md) |
| `additionalData?` | [`AdditionalData`](../interfaces/CdvPurchase.AdditionalData.md) |

#### Returns

`Promise`\<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md) \| [`Transaction`](CdvPurchase.IapticJS.Transaction.md)\>

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[requestPayment](../interfaces/CdvPurchase.Adapter.md#requestpayment)

___

### restorePurchases

▸ **restorePurchases**(): `Promise`\<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

Replay the queue of transactions.

Might ask the user to login.

#### Returns

`Promise`\<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[restorePurchases](../interfaces/CdvPurchase.Adapter.md#restorepurchases)
