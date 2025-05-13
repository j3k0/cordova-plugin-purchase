# Class: Adapter

[CdvPurchase](../modules/CdvPurchase.md).[GooglePlay](../modules/CdvPurchase.GooglePlay.md).Adapter

Adapter for a payment or in-app purchase platform

## Implements

- [`Adapter`](../interfaces/CdvPurchase.Adapter.md)

## Table of contents

### Constructors

- [constructor](CdvPurchase.GooglePlay.Adapter.md#constructor)

### Properties

- [autoRefreshIntervalMillis](CdvPurchase.GooglePlay.Adapter.md#autorefreshintervalmillis)
- [bridge](CdvPurchase.GooglePlay.Adapter.md#bridge)
- [canSkipFinish](CdvPurchase.GooglePlay.Adapter.md#canskipfinish)
- [id](CdvPurchase.GooglePlay.Adapter.md#id)
- [initialized](CdvPurchase.GooglePlay.Adapter.md#initialized)
- [name](CdvPurchase.GooglePlay.Adapter.md#name)
- [ready](CdvPurchase.GooglePlay.Adapter.md#ready)
- [retry](CdvPurchase.GooglePlay.Adapter.md#retry)
- [supportsParallelLoading](CdvPurchase.GooglePlay.Adapter.md#supportsparallelloading)
- [\_instance](CdvPurchase.GooglePlay.Adapter.md#_instance)
- [trimProductTitles](CdvPurchase.GooglePlay.Adapter.md#trimproducttitles)

### Accessors

- [isSupported](CdvPurchase.GooglePlay.Adapter.md#issupported)
- [products](CdvPurchase.GooglePlay.Adapter.md#products)
- [receipts](CdvPurchase.GooglePlay.Adapter.md#receipts)

### Methods

- [checkSupport](CdvPurchase.GooglePlay.Adapter.md#checksupport)
- [findOldPurchaseToken](CdvPurchase.GooglePlay.Adapter.md#findoldpurchasetoken)
- [finish](CdvPurchase.GooglePlay.Adapter.md#finish)
- [getPurchases](CdvPurchase.GooglePlay.Adapter.md#getpurchases)
- [getSkusOf](CdvPurchase.GooglePlay.Adapter.md#getskusof)
- [handleReceiptValidationResponse](CdvPurchase.GooglePlay.Adapter.md#handlereceiptvalidationresponse)
- [initialize](CdvPurchase.GooglePlay.Adapter.md#initialize)
- [loadProducts](CdvPurchase.GooglePlay.Adapter.md#loadproducts)
- [loadReceipts](CdvPurchase.GooglePlay.Adapter.md#loadreceipts)
- [manageBilling](CdvPurchase.GooglePlay.Adapter.md#managebilling)
- [manageSubscriptions](CdvPurchase.GooglePlay.Adapter.md#managesubscriptions)
- [onPriceChangeConfirmationResult](CdvPurchase.GooglePlay.Adapter.md#onpricechangeconfirmationresult)
- [onPurchaseConsumed](CdvPurchase.GooglePlay.Adapter.md#onpurchaseconsumed)
- [onPurchasesUpdated](CdvPurchase.GooglePlay.Adapter.md#onpurchasesupdated)
- [onSetPurchases](CdvPurchase.GooglePlay.Adapter.md#onsetpurchases)
- [order](CdvPurchase.GooglePlay.Adapter.md#order)
- [receiptValidationBody](CdvPurchase.GooglePlay.Adapter.md#receiptvalidationbody)
- [requestPayment](CdvPurchase.GooglePlay.Adapter.md#requestpayment)
- [restorePurchases](CdvPurchase.GooglePlay.Adapter.md#restorepurchases)

## Constructors

### constructor

• **new Adapter**(`context`, `autoRefreshIntervalMillis?`): [`Adapter`](CdvPurchase.GooglePlay.Adapter.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | `AdapterContext` |
| `autoRefreshIntervalMillis` | `number` |

#### Returns

[`Adapter`](CdvPurchase.GooglePlay.Adapter.md)

## Properties

### autoRefreshIntervalMillis

• **autoRefreshIntervalMillis**: `number` = `0`

___

### bridge

• **bridge**: [`Bridge`](CdvPurchase.GooglePlay.Bridge.Bridge.md)

The GooglePlay bridge

___

### canSkipFinish

• **canSkipFinish**: `boolean` = `true`

Returns true if the adapter can skip the native finish method for a transaction.

Some platforms (e.g. Apple AppStore) require explicit acknowledgement of a purchase so it can be removed from
the queue of pending transactions, regardless of whether the transaction is acknowledged or consumed already.

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[canSkipFinish](../interfaces/CdvPurchase.Adapter.md#canskipfinish)

___

### id

• **id**: [`Platform`](../enums/CdvPurchase.Platform.md) = `Platform.GOOGLE_PLAY`

Adapter identifier

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[id](../interfaces/CdvPurchase.Adapter.md#id)

___

### initialized

• **initialized**: `boolean` = `false`

Prevent double initialization

___

### name

• **name**: `string` = `'GooglePlay'`

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

▪ `Static` **\_instance**: [`Adapter`](CdvPurchase.GooglePlay.Adapter.md)

___

### trimProductTitles

▪ `Static` **trimProductTitles**: `boolean` = `true`

## Accessors

### isSupported

• `get` **isSupported**(): `boolean`

Returns true on Android, the only platform supported by this adapter

#### Returns

`boolean`

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[isSupported](../interfaces/CdvPurchase.Adapter.md#issupported)

___

### products

• `get` **products**(): [`GProduct`](CdvPurchase.GooglePlay.GProduct.md)[]

List of products managed by the GooglePlay adapter

#### Returns

[`GProduct`](CdvPurchase.GooglePlay.GProduct.md)[]

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[products](../interfaces/CdvPurchase.Adapter.md#products)

___

### receipts

• `get` **receipts**(): [`Receipt`](CdvPurchase.GooglePlay.Receipt.md)[]

List of purchase receipts.

#### Returns

[`Receipt`](CdvPurchase.GooglePlay.Receipt.md)[]

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

### findOldPurchaseToken

▸ **findOldPurchaseToken**(`productId`, `productGroup?`): `undefined` \| `string`

Find a purchaseToken for an owned product in the same group as the requested one.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | The product identifier to request matching purchaseToken for. |
| `productGroup?` | `string` | The group of the product to request matching purchaseToken for. |

#### Returns

`undefined` \| `string`

A purchaseToken, undefined if none have been found.

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

### getPurchases

▸ **getPurchases**(): `Promise`\<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

Refresh purchases from GooglePlay

#### Returns

`Promise`\<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

___

### getSkusOf

▸ **getSkusOf**(`products`): `Object`

Prepare the list of SKUs sorted by type

#### Parameters

| Name | Type |
| :------ | :------ |
| `products` | [`IRegisterProduct`](../interfaces/CdvPurchase.IRegisterProduct.md)[] |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `inAppSkus` | `string`[] |
| `subsSkus` | `string`[] |

___

### handleReceiptValidationResponse

▸ **handleReceiptValidationResponse**(`receipt`, `response`): `Promise`\<`void`\>

Handle platform specific fields from receipt validation response.

#### Parameters

| Name | Type |
| :------ | :------ |
| `receipt` | [`Receipt`](CdvPurchase.Receipt.md) |
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

▸ **loadProducts**(`products`): `Promise`\<([`IError`](../interfaces/CdvPurchase.IError.md) \| [`GProduct`](CdvPurchase.GooglePlay.GProduct.md))[]\>

Load product definitions from the platform.

#### Parameters

| Name | Type |
| :------ | :------ |
| `products` | [`IRegisterProduct`](../interfaces/CdvPurchase.IRegisterProduct.md)[] |

#### Returns

`Promise`\<([`IError`](../interfaces/CdvPurchase.IError.md) \| [`GProduct`](CdvPurchase.GooglePlay.GProduct.md))[]\>

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

### onPriceChangeConfirmationResult

▸ **onPriceChangeConfirmationResult**(`result`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `result` | ``"OK"`` \| ``"UserCanceled"`` \| ``"UnknownProduct"`` |

#### Returns

`void`

___

### onPurchaseConsumed

▸ **onPurchaseConsumed**(`purchase`): `void`

Called by the bridge when a purchase has been consumed

#### Parameters

| Name | Type |
| :------ | :------ |
| `purchase` | [`Purchase`](../interfaces/CdvPurchase.GooglePlay.Bridge.Purchase.md) |

#### Returns

`void`

___

### onPurchasesUpdated

▸ **onPurchasesUpdated**(`purchases`): `void`

Called when the platform reports updates for some purchases

Notice that purchases can be removed from the array, we should handle that so they stop
being "owned" by the user.

#### Parameters

| Name | Type |
| :------ | :------ |
| `purchases` | [`Purchase`](../interfaces/CdvPurchase.GooglePlay.Bridge.Purchase.md)[] |

#### Returns

`void`

___

### onSetPurchases

▸ **onSetPurchases**(`purchases`): `void`

Called when the platform reports some purchases

#### Parameters

| Name | Type |
| :------ | :------ |
| `purchases` | [`Purchase`](../interfaces/CdvPurchase.GooglePlay.Bridge.Purchase.md)[] |

#### Returns

`void`

___

### order

▸ **order**(`offer`, `additionalData`): `Promise`\<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

Initializes an order.

#### Parameters

| Name | Type |
| :------ | :------ |
| `offer` | [`GOffer`](../modules/CdvPurchase.GooglePlay.md#goffer) |
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
| `receipt` | [`Receipt`](CdvPurchase.GooglePlay.Receipt.md) |

#### Returns

`Promise`\<`undefined` \| [`Body`](../interfaces/CdvPurchase.Validator.Request.Body.md)\>

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[receiptValidationBody](../interfaces/CdvPurchase.Adapter.md#receiptvalidationbody)

___

### requestPayment

▸ **requestPayment**(`payment`, `additionalData?`): `Promise`\<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md) \| [`Transaction`](CdvPurchase.GooglePlay.Transaction.md)\>

Request a payment from the user

#### Parameters

| Name | Type |
| :------ | :------ |
| `payment` | [`PaymentRequest`](../interfaces/CdvPurchase.PaymentRequest.md) |
| `additionalData?` | [`AdditionalData`](../interfaces/CdvPurchase.AdditionalData.md) |

#### Returns

`Promise`\<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md) \| [`Transaction`](CdvPurchase.GooglePlay.Transaction.md)\>

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
