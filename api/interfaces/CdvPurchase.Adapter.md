# Interface: Adapter

[CdvPurchase](../modules/CdvPurchase.md).Adapter

## Implemented by

- [`Adapter`](../classes/CdvPurchase.AppleAppStore.Adapter.md)
- [`Adapter`](../classes/CdvPurchase.Braintree.Adapter.md)
- [`Adapter`](../classes/CdvPurchase.GooglePlay.Adapter.md)
- [`Adapter`](../classes/CdvPurchase.Test.Adapter.md)
- [`Adapter`](../classes/CdvPurchase.WindowsStore.Adapter.md)

## Properties

### id

• **id**: [`Platform`](../enums/CdvPurchase.Platform.md)

Platform identifier

___

### name

• **name**: `string`

Nice name for the adapter

## Accessors

### products

• `get` **products**(): [`Product`](../classes/CdvPurchase.Product.md)[]

List of products managed by the adapter.

#### Returns

[`Product`](../classes/CdvPurchase.Product.md)[]

___

### receipts

• `get` **receipts**(): [`Receipt`](../classes/CdvPurchase.Receipt.md)[]

List of purchase receipts.

#### Returns

[`Receipt`](../classes/CdvPurchase.Receipt.md)[]

## Methods

### finish

▸ **finish**(`transaction`): `Promise`<`undefined` \| [`IError`](CdvPurchase.IError.md)\>

Finish a transaction.

For non-consumables, this will acknowledge the purchase.
For consumable, this will acknowledge and consume the purchase.

#### Parameters

| Name | Type |
| :------ | :------ |
| `transaction` | [`Transaction`](../classes/CdvPurchase.Transaction.md) |

#### Returns

`Promise`<`undefined` \| [`IError`](CdvPurchase.IError.md)\>

___

### handleReceiptValidationResponse

▸ **handleReceiptValidationResponse**(`receipt`, `response`): `Promise`<`void`\>

Handle platform specific fields from receipt validation response.

#### Parameters

| Name | Type |
| :------ | :------ |
| `receipt` | [`Receipt`](../classes/CdvPurchase.Receipt.md) |
| `response` | [`Payload`](../modules/CdvPurchase.Validator.Response.md#payload) |

#### Returns

`Promise`<`void`\>

___

### initialize

▸ **initialize**(): `Promise`<`undefined` \| [`IError`](CdvPurchase.IError.md)\>

Initializes a platform adapter.

Will resolve when initialization is complete.

Will fail with an `IError` in case of an unrecoverable error.

In other case of a potentially recoverable error, the adapter will keep retrying to initialize forever.

#### Returns

`Promise`<`undefined` \| [`IError`](CdvPurchase.IError.md)\>

___

### load

▸ **load**(`products`): `Promise`<([`IError`](CdvPurchase.IError.md) \| [`Product`](../classes/CdvPurchase.Product.md))[]\>

Load product definitions from the platform.

#### Parameters

| Name | Type |
| :------ | :------ |
| `products` | [`IRegisterProduct`](CdvPurchase.IRegisterProduct.md)[] |

#### Returns

`Promise`<([`IError`](CdvPurchase.IError.md) \| [`Product`](../classes/CdvPurchase.Product.md))[]\>

___

### order

▸ **order**(`offer`, `additionalData`): `Promise`<`undefined` \| [`IError`](CdvPurchase.IError.md)\>

Initializes an order.

#### Parameters

| Name | Type |
| :------ | :------ |
| `offer` | [`Offer`](../classes/CdvPurchase.Offer.md) |
| `additionalData` | [`AdditionalData`](CdvPurchase.AdditionalData.md) |

#### Returns

`Promise`<`undefined` \| [`IError`](CdvPurchase.IError.md)\>

___

### receiptValidationBody

▸ **receiptValidationBody**(`receipt`): `undefined` \| [`Body`](CdvPurchase.Validator.Request.Body.md)

Prepare for receipt validation

#### Parameters

| Name | Type |
| :------ | :------ |
| `receipt` | [`Receipt`](../classes/CdvPurchase.Receipt.md) |

#### Returns

`undefined` \| [`Body`](CdvPurchase.Validator.Request.Body.md)

___

### requestPayment

▸ **requestPayment**(`payment`, `additionalData?`): `Promise`<`undefined` \| [`IError`](CdvPurchase.IError.md)\>

Request a payment from the user

#### Parameters

| Name | Type |
| :------ | :------ |
| `payment` | [`PaymentRequest`](CdvPurchase.PaymentRequest.md) |
| `additionalData?` | [`AdditionalData`](CdvPurchase.AdditionalData.md) |

#### Returns

`Promise`<`undefined` \| [`IError`](CdvPurchase.IError.md)\>
