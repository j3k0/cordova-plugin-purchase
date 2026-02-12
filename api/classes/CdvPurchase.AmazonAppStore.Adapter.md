# Class: Adapter

[CdvPurchase](../modules/CdvPurchase.md).[AmazonAppStore](../modules/CdvPurchase.AmazonAppStore.md).Adapter

Adapter for a payment or in-app purchase platform

## Implements

- [`Adapter`](../interfaces/CdvPurchase.Adapter.md)

## Table of contents

### Constructors

- [constructor](CdvPurchase.AmazonAppStore.Adapter.md#constructor)

### Properties

- [bridge](CdvPurchase.AmazonAppStore.Adapter.md#bridge)
- [id](CdvPurchase.AmazonAppStore.Adapter.md#id)
- [initialized](CdvPurchase.AmazonAppStore.Adapter.md#initialized)
- [name](CdvPurchase.AmazonAppStore.Adapter.md#name)
- [ready](CdvPurchase.AmazonAppStore.Adapter.md#ready)
- [retry](CdvPurchase.AmazonAppStore.Adapter.md#retry)
- [supportsParallelLoading](CdvPurchase.AmazonAppStore.Adapter.md#supportsparallelloading)
- [\_instance](CdvPurchase.AmazonAppStore.Adapter.md#_instance)

### Accessors

- [isSupported](CdvPurchase.AmazonAppStore.Adapter.md#issupported)
- [products](CdvPurchase.AmazonAppStore.Adapter.md#products)
- [receipts](CdvPurchase.AmazonAppStore.Adapter.md#receipts)

### Methods

- [checkSupport](CdvPurchase.AmazonAppStore.Adapter.md#checksupport)
- [finish](CdvPurchase.AmazonAppStore.Adapter.md#finish)
- [getPurchaseUpdates](CdvPurchase.AmazonAppStore.Adapter.md#getpurchaseupdates)
- [handleReceiptValidationResponse](CdvPurchase.AmazonAppStore.Adapter.md#handlereceiptvalidationresponse)
- [initialize](CdvPurchase.AmazonAppStore.Adapter.md#initialize)
- [loadProducts](CdvPurchase.AmazonAppStore.Adapter.md#loadproducts)
- [loadReceipts](CdvPurchase.AmazonAppStore.Adapter.md#loadreceipts)
- [manageBilling](CdvPurchase.AmazonAppStore.Adapter.md#managebilling)
- [manageSubscriptions](CdvPurchase.AmazonAppStore.Adapter.md#managesubscriptions)
- [onPurchaseFulfilled](CdvPurchase.AmazonAppStore.Adapter.md#onpurchasefulfilled)
- [onPurchasesUpdated](CdvPurchase.AmazonAppStore.Adapter.md#onpurchasesupdated)
- [onSetPurchases](CdvPurchase.AmazonAppStore.Adapter.md#onsetpurchases)
- [order](CdvPurchase.AmazonAppStore.Adapter.md#order)
- [receiptValidationBody](CdvPurchase.AmazonAppStore.Adapter.md#receiptvalidationbody)
- [requestPayment](CdvPurchase.AmazonAppStore.Adapter.md#requestpayment)
- [restorePurchases](CdvPurchase.AmazonAppStore.Adapter.md#restorepurchases)

## Constructors

### constructor

• **new Adapter**(`context`): [`Adapter`](CdvPurchase.AmazonAppStore.Adapter.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | `AdapterContext` |

#### Returns

[`Adapter`](CdvPurchase.AmazonAppStore.Adapter.md)

## Properties

### bridge

• **bridge**: [`Bridge`](CdvPurchase.AmazonAppStore.Bridge.Bridge.md)

The Amazon bridge

___

### id

• **id**: [`Platform`](../enums/CdvPurchase.Platform.md) = `Platform.AMAZON_APPSTORE`

Adapter identifier

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[id](../interfaces/CdvPurchase.Adapter.md#id)

___

### initialized

• **initialized**: `boolean` = `false`

Prevent double initialization

___

### name

• **name**: `string` = `'AmazonAppStore'`

Adapter name

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[name](../interfaces/CdvPurchase.Adapter.md#name)

___

### ready

• **ready**: `boolean` = `false`

Has the adapter been successfully initialized

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[ready](../interfaces/CdvPurchase.Adapter.md#ready)

___

### retry

• **retry**: `Retry`\<`Function`\>

Used to retry failed commands

___

### supportsParallelLoading

• **supportsParallelLoading**: `boolean` = `false`

Set to true if receipts and products can be loaded in parallel

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[supportsParallelLoading](../interfaces/CdvPurchase.Adapter.md#supportsparallelloading)

___

### \_instance

▪ `Static` **\_instance**: [`Adapter`](CdvPurchase.AmazonAppStore.Adapter.md)

## Accessors

### isSupported

• `get` **isSupported**(): `boolean`

Returns true on Android, the platform supported by this adapter

#### Returns

`boolean`

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[isSupported](../interfaces/CdvPurchase.Adapter.md#issupported)

___

### products

• `get` **products**(): [`Product`](CdvPurchase.Product.md)[]

List of products managed by the adapter

#### Returns

[`Product`](CdvPurchase.Product.md)[]

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[products](../interfaces/CdvPurchase.Adapter.md#products)

___

### receipts

• `get` **receipts**(): [`Receipt`](CdvPurchase.AmazonAppStore.Receipt.md)[]

List of purchase receipts.

#### Returns

[`Receipt`](CdvPurchase.AmazonAppStore.Receipt.md)[]

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
| `transaction` | [`Transaction`](CdvPurchase.Transaction.md) |

#### Returns

`Promise`\<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[finish](../interfaces/CdvPurchase.Adapter.md#finish)

___

### getPurchaseUpdates

▸ **getPurchaseUpdates**(): `Promise`\<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

Refresh purchases from Amazon

#### Returns

`Promise`\<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

___

### handleReceiptValidationResponse

▸ **handleReceiptValidationResponse**(`_receipt`, `_response`): `Promise`\<`void`\>

Handle platform specific fields from receipt validation response.

#### Parameters

| Name | Type |
| :------ | :------ |
| `_receipt` | [`Receipt`](CdvPurchase.Receipt.md) |
| `_response` | [`Payload`](../modules/CdvPurchase.Validator.Response.md#payload) |

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

▸ **loadReceipts**(): `Promise`\<[`Receipt`](CdvPurchase.Receipt.md)[]\>

Load the receipts

#### Returns

`Promise`\<[`Receipt`](CdvPurchase.Receipt.md)[]\>

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

### onPurchaseFulfilled

▸ **onPurchaseFulfilled**(`purchase`): `void`

Called by the bridge when a purchase has been fulfilled

#### Parameters

| Name | Type |
| :------ | :------ |
| `purchase` | [`AmazonPurchase`](../interfaces/CdvPurchase.AmazonAppStore.Bridge.AmazonPurchase.md) |

#### Returns

`void`

___

### onPurchasesUpdated

▸ **onPurchasesUpdated**(`purchases`): `void`

Called when the platform reports updates for some purchases

#### Parameters

| Name | Type |
| :------ | :------ |
| `purchases` | [`AmazonPurchase`](../interfaces/CdvPurchase.AmazonAppStore.Bridge.AmazonPurchase.md)[] |

#### Returns

`void`

___

### onSetPurchases

▸ **onSetPurchases**(`purchases`): `void`

Called when the platform reports initial purchases

#### Parameters

| Name | Type |
| :------ | :------ |
| `purchases` | [`AmazonPurchase`](../interfaces/CdvPurchase.AmazonAppStore.Bridge.AmazonPurchase.md)[] |

#### Returns

`void`

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
| `receipt` | [`Receipt`](CdvPurchase.AmazonAppStore.Receipt.md) |

#### Returns

`Promise`\<`undefined` \| [`Body`](../interfaces/CdvPurchase.Validator.Request.Body.md)\>

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[receiptValidationBody](../interfaces/CdvPurchase.Adapter.md#receiptvalidationbody)

___

### requestPayment

▸ **requestPayment**(`_payment`, `_additionalData?`): `Promise`\<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md) \| [`Transaction`](CdvPurchase.AmazonAppStore.Transaction.md)\>

Request a payment from the user

#### Parameters

| Name | Type |
| :------ | :------ |
| `_payment` | [`PaymentRequest`](../interfaces/CdvPurchase.PaymentRequest.md) |
| `_additionalData?` | [`AdditionalData`](../interfaces/CdvPurchase.AdditionalData.md) |

#### Returns

`Promise`\<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md) \| [`Transaction`](CdvPurchase.AmazonAppStore.Transaction.md)\>

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
