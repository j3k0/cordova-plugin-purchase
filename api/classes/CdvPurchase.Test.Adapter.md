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

- [checkSupport](CdvPurchase.Test.Adapter.md#checksupport)
- [finish](CdvPurchase.Test.Adapter.md#finish)
- [handleReceiptValidationResponse](CdvPurchase.Test.Adapter.md#handlereceiptvalidationresponse)
- [initialize](CdvPurchase.Test.Adapter.md#initialize)
- [loadProducts](CdvPurchase.Test.Adapter.md#loadproducts)
- [loadReceipts](CdvPurchase.Test.Adapter.md#loadreceipts)
- [manageBilling](CdvPurchase.Test.Adapter.md#managebilling)
- [manageSubscriptions](CdvPurchase.Test.Adapter.md#managesubscriptions)
- [order](CdvPurchase.Test.Adapter.md#order)
- [receiptValidationBody](CdvPurchase.Test.Adapter.md#receiptvalidationbody)
- [requestPayment](CdvPurchase.Test.Adapter.md#requestpayment)
- [restorePurchases](CdvPurchase.Test.Adapter.md#restorepurchases)
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
| `receipt` | [`Receipt`](CdvPurchase.Receipt.md) |

#### Returns

`Promise`<`undefined` \| [`Body`](../interfaces/CdvPurchase.Validator.Request.Body.md)\>

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[receiptValidationBody](../interfaces/CdvPurchase.Adapter.md#receiptvalidationbody)

___

### requestPayment

▸ **requestPayment**(`paymentRequest`, `additionalData?`): `Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md) \| [`Transaction`](CdvPurchase.Transaction.md)\>

This function simulates a payment process by prompting the user to confirm the payment.

It creates a `Receipt` and `Transaction` object and returns the `Transaction` object if the user enters "Y" in the prompt.

**`Example`**

const paymentRequest = {
  amountMicros: 1000000,
  currency: "USD",
  items: [{ id: "product-1" }, { id: "product-2" }]
};
const result = await requestPayment(paymentRequest);
if (result?.isError) {
  console.error(`Error: ${result.message}`);
} else if (result) {
  console.log(`Transaction approved: ${result.transactionId}`);
} else {
  console.log("Payment cancelled by user");
}

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentRequest` | [`PaymentRequest`](../interfaces/CdvPurchase.PaymentRequest.md) | An object containing information about the payment, such as the amount and currency. |
| `additionalData?` | [`AdditionalData`](../interfaces/CdvPurchase.AdditionalData.md) | Additional data to be included in the receipt. |

#### Returns

`Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md) \| [`Transaction`](CdvPurchase.Transaction.md)\>

A promise that resolves to either an error object (if the user enters "E" in the prompt),
a `Transaction` object (if the user confirms the payment), or `undefined` (if the user does not confirm the payment).

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
