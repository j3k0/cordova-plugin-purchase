# Class: Adapter

[CdvPurchase](../modules/CdvPurchase.md).[AppleAppStore](../modules/CdvPurchase.AppleAppStore.md).Adapter

Adapter for Apple AppStore using StoreKit version 1

## Implements

- [`Adapter`](../interfaces/CdvPurchase.Adapter.md)

## Table of contents

### Constructors

- [constructor](CdvPurchase.AppleAppStore.Adapter.md#constructor)

### Properties

- [\_canMakePayments](CdvPurchase.AppleAppStore.Adapter.md#_canmakepayments)
- [\_products](CdvPurchase.AppleAppStore.Adapter.md#_products)
- [\_receipt](CdvPurchase.AppleAppStore.Adapter.md#_receipt)
- [autoFinish](CdvPurchase.AppleAppStore.Adapter.md#autofinish)
- [bridge](CdvPurchase.AppleAppStore.Adapter.md#bridge)
- [context](CdvPurchase.AppleAppStore.Adapter.md#context)
- [discountEligibilityDeterminer](CdvPurchase.AppleAppStore.Adapter.md#discounteligibilitydeterminer)
- [forceReceiptReload](CdvPurchase.AppleAppStore.Adapter.md#forcereceiptreload)
- [id](CdvPurchase.AppleAppStore.Adapter.md#id)
- [log](CdvPurchase.AppleAppStore.Adapter.md#log)
- [name](CdvPurchase.AppleAppStore.Adapter.md#name)
- [needAppReceipt](CdvPurchase.AppleAppStore.Adapter.md#needappreceipt)
- [pseudoReceipt](CdvPurchase.AppleAppStore.Adapter.md#pseudoreceipt)
- [ready](CdvPurchase.AppleAppStore.Adapter.md#ready)

### Accessors

- [isSupported](CdvPurchase.AppleAppStore.Adapter.md#issupported)
- [products](CdvPurchase.AppleAppStore.Adapter.md#products)
- [receipts](CdvPurchase.AppleAppStore.Adapter.md#receipts)

### Methods

- [addValidProducts](CdvPurchase.AppleAppStore.Adapter.md#addvalidproducts)
- [checkSupport](CdvPurchase.AppleAppStore.Adapter.md#checksupport)
- [finish](CdvPurchase.AppleAppStore.Adapter.md#finish)
- [getProduct](CdvPurchase.AppleAppStore.Adapter.md#getproduct)
- [handleReceiptValidationResponse](CdvPurchase.AppleAppStore.Adapter.md#handlereceiptvalidationresponse)
- [initialize](CdvPurchase.AppleAppStore.Adapter.md#initialize)
- [loadProducts](CdvPurchase.AppleAppStore.Adapter.md#loadproducts)
- [loadReceipts](CdvPurchase.AppleAppStore.Adapter.md#loadreceipts)
- [manageBilling](CdvPurchase.AppleAppStore.Adapter.md#managebilling)
- [manageSubscriptions](CdvPurchase.AppleAppStore.Adapter.md#managesubscriptions)
- [order](CdvPurchase.AppleAppStore.Adapter.md#order)
- [presentCodeRedemptionSheet](CdvPurchase.AppleAppStore.Adapter.md#presentcoderedemptionsheet)
- [receiptValidationBody](CdvPurchase.AppleAppStore.Adapter.md#receiptvalidationbody)
- [refreshReceipt](CdvPurchase.AppleAppStore.Adapter.md#refreshreceipt)
- [requestPayment](CdvPurchase.AppleAppStore.Adapter.md#requestpayment)
- [restorePurchases](CdvPurchase.AppleAppStore.Adapter.md#restorepurchases)

## Constructors

### constructor

• **new Adapter**(`context`, `options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | `AdapterContext` |
| `options` | [`AdapterOptions`](../interfaces/CdvPurchase.AppleAppStore.AdapterOptions.md) |

## Properties

### \_canMakePayments

• **\_canMakePayments**: `boolean` = `false`

___

### \_products

• **\_products**: [`SKProduct`](CdvPurchase.AppleAppStore.SKProduct.md)[] = `[]`

List of products loaded from AppStore

___

### \_receipt

• `Optional` **\_receipt**: [`SKApplicationReceipt`](CdvPurchase.AppleAppStore.SKApplicationReceipt.md)

The application receipt, contains all transactions

___

### autoFinish

• **autoFinish**: `boolean`

True to auto-finish all transactions

___

### bridge

• **bridge**: [`Bridge`](CdvPurchase.AppleAppStore.Bridge.Bridge.md)

___

### context

• **context**: `AdapterContext`

___

### discountEligibilityDeterminer

• `Optional` **discountEligibilityDeterminer**: [`DiscountEligibilityDeterminer`](../modules/CdvPurchase.AppleAppStore.md#discounteligibilitydeterminer)

Component that determine eligibility to a given discount offer

___

### forceReceiptReload

• **forceReceiptReload**: `boolean` = `false`

Set to true to force a full refresh of the receipt when preparing a receipt validation call.

This is typically done when placing an order and restoring purchases.

___

### id

• **id**: [`Platform`](../enums/CdvPurchase.Platform.md) = `Platform.APPLE_APPSTORE`

Platform identifier

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[id](../interfaces/CdvPurchase.Adapter.md#id)

___

### log

• **log**: [`Logger`](CdvPurchase.Logger.md)

___

### name

• **name**: `string` = `'AppStore'`

Nice name for the adapter

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[name](../interfaces/CdvPurchase.Adapter.md#name)

___

### needAppReceipt

• **needAppReceipt**: `boolean`

True when we need to validate the application receipt

___

### pseudoReceipt

• **pseudoReceipt**: [`Receipt`](CdvPurchase.Receipt.md)

The pseudo receipt stores purchases in progress

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

Returns true on iOS, the only platform supported by this adapter

#### Returns

`boolean`

#### Implementation of

CdvPurchase.Adapter.isSupported

___

### products

• `get` **products**(): [`Product`](CdvPurchase.Product.md)[]

List of products managed by the adapter.

#### Returns

[`Product`](CdvPurchase.Product.md)[]

#### Implementation of

CdvPurchase.Adapter.products

___

### receipts

• `get` **receipts**(): [`Receipt`](CdvPurchase.Receipt.md)[]

List of purchase receipts.

#### Returns

[`Receipt`](CdvPurchase.Receipt.md)[]

#### Implementation of

CdvPurchase.Adapter.receipts

## Methods

### addValidProducts

▸ **addValidProducts**(`registerProducts`, `validProducts`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `registerProducts` | [`IRegisterProduct`](../interfaces/CdvPurchase.IRegisterProduct.md)[] |
| `validProducts` | [`ValidProduct`](../interfaces/CdvPurchase.AppleAppStore.Bridge.ValidProduct.md)[] |

#### Returns

`void`

___

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

### getProduct

▸ **getProduct**(`id`): `undefined` \| [`SKProduct`](CdvPurchase.AppleAppStore.SKProduct.md)

Find a given product from ID

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`undefined` \| [`SKProduct`](CdvPurchase.AppleAppStore.SKProduct.md)

___

### handleReceiptValidationResponse

▸ **handleReceiptValidationResponse**(`_receipt`, `response`): `Promise`<`void`\>

Handle platform specific fields from receipt validation response.

#### Parameters

| Name | Type |
| :------ | :------ |
| `_receipt` | [`Receipt`](CdvPurchase.Receipt.md) |
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

▸ **order**(`offer`, `additionalData`): `Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

Initializes an order.

#### Parameters

| Name | Type |
| :------ | :------ |
| `offer` | [`Offer`](CdvPurchase.Offer.md) |
| `additionalData` | [`AdditionalData`](../interfaces/CdvPurchase.AdditionalData.md) |

#### Returns

`Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[order](../interfaces/CdvPurchase.Adapter.md#order)

___

### presentCodeRedemptionSheet

▸ **presentCodeRedemptionSheet**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

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

### refreshReceipt

▸ **refreshReceipt**(): `Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md) \| [`ApplicationReceipt`](../interfaces/CdvPurchase.AppleAppStore.ApplicationReceipt.md)\>

#### Returns

`Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md) \| [`ApplicationReceipt`](../interfaces/CdvPurchase.AppleAppStore.ApplicationReceipt.md)\>

___

### requestPayment

▸ **requestPayment**(`payment`, `additionalData?`): `Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md) \| [`Transaction`](CdvPurchase.Transaction.md)\>

Request a payment from the user

#### Parameters

| Name | Type |
| :------ | :------ |
| `payment` | [`PaymentRequest`](../interfaces/CdvPurchase.PaymentRequest.md) |
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
