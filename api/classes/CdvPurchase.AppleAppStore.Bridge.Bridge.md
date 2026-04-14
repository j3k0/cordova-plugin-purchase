# Class: Bridge

[AppleAppStore](../modules/CdvPurchase.AppleAppStore.md).[Bridge](../modules/CdvPurchase.AppleAppStore.Bridge.md).Bridge

Shared interface implemented by both the SK1 and SK2 bridges.
The adapter programs against this interface, not a concrete class.

## Implements

- [`BridgeInterface`](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md)

## Table of contents

### Constructors

- [constructor](CdvPurchase.AppleAppStore.Bridge.Bridge.md#constructor)

### Properties

- [appStoreReceipt](CdvPurchase.AppleAppStore.Bridge.Bridge.md#appstorereceipt)
- [onFailed](CdvPurchase.AppleAppStore.Bridge.Bridge.md#onfailed)
- [onPurchased](CdvPurchase.AppleAppStore.Bridge.Bridge.md#onpurchased)
- [onRestored](CdvPurchase.AppleAppStore.Bridge.Bridge.md#onrestored)
- [options](CdvPurchase.AppleAppStore.Bridge.Bridge.md#options)
- [transactionsForProduct](CdvPurchase.AppleAppStore.Bridge.Bridge.md#transactionsforproduct)

### Methods

- [canMakePayments](CdvPurchase.AppleAppStore.Bridge.Bridge.md#canmakepayments)
- [finalizeTransactionUpdates](CdvPurchase.AppleAppStore.Bridge.Bridge.md#finalizetransactionupdates)
- [finish](CdvPurchase.AppleAppStore.Bridge.Bridge.md#finish)
- [getStorefront](CdvPurchase.AppleAppStore.Bridge.Bridge.md#getstorefront)
- [init](CdvPurchase.AppleAppStore.Bridge.Bridge.md#init)
- [lastTransactionUpdated](CdvPurchase.AppleAppStore.Bridge.Bridge.md#lasttransactionupdated)
- [load](CdvPurchase.AppleAppStore.Bridge.Bridge.md#load)
- [loadReceipts](CdvPurchase.AppleAppStore.Bridge.Bridge.md#loadreceipts)
- [manageBilling](CdvPurchase.AppleAppStore.Bridge.Bridge.md#managebilling)
- [manageSubscriptions](CdvPurchase.AppleAppStore.Bridge.Bridge.md#managesubscriptions)
- [parseReceiptArgs](CdvPurchase.AppleAppStore.Bridge.Bridge.md#parsereceiptargs)
- [presentCodeRedemptionSheet](CdvPurchase.AppleAppStore.Bridge.Bridge.md#presentcoderedemptionsheet)
- [processPendingTransactions](CdvPurchase.AppleAppStore.Bridge.Bridge.md#processpendingtransactions)
- [purchase](CdvPurchase.AppleAppStore.Bridge.Bridge.md#purchase)
- [refreshReceipts](CdvPurchase.AppleAppStore.Bridge.Bridge.md#refreshreceipts)
- [restore](CdvPurchase.AppleAppStore.Bridge.Bridge.md#restore)
- [restoreCompletedTransactionsFailed](CdvPurchase.AppleAppStore.Bridge.Bridge.md#restorecompletedtransactionsfailed)
- [restoreCompletedTransactionsFinished](CdvPurchase.AppleAppStore.Bridge.Bridge.md#restorecompletedtransactionsfinished)
- [transactionUpdated](CdvPurchase.AppleAppStore.Bridge.Bridge.md#transactionupdated)

## Constructors

### constructor

• **new Bridge**(): [`Bridge`](CdvPurchase.AppleAppStore.Bridge.Bridge.md)

#### Returns

[`Bridge`](CdvPurchase.AppleAppStore.Bridge.Bridge.md)

## Properties

### appStoreReceipt

• `Optional` **appStoreReceipt**: ``null`` \| [`ApplicationReceipt`](../interfaces/CdvPurchase.AppleAppStore.ApplicationReceipt.md)

The application receipt from AppStore, cached in javascript

#### Implementation of

[BridgeInterface](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md).[appStoreReceipt](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md#appstorereceipt)

___

### onFailed

• **onFailed**: `boolean` = `false`

**`Deprecated`**

___

### onPurchased

• **onPurchased**: `boolean` = `false`

**`Deprecated`**

___

### onRestored

• **onRestored**: `boolean` = `false`

**`Deprecated`**

___

### options

• **options**: [`BridgeCallbacks`](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md)

Callbacks set by the adapter

___

### transactionsForProduct

• **transactionsForProduct**: `Object` = `{}`

Transactions for a given product

#### Index signature

▪ [productId: `string`]: `string`[]

#### Implementation of

[BridgeInterface](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md).[transactionsForProduct](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md#transactionsforproduct)

## Methods

### canMakePayments

▸ **canMakePayments**(`success`, `error`): `void`

Checks if device/user is allowed to make in-app purchases

#### Parameters

| Name | Type |
| :------ | :------ |
| `success` | () => `void` |
| `error` | (`message`: `string`) => `void` |

#### Returns

`void`

#### Implementation of

[BridgeInterface](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md).[canMakePayments](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md#canmakepayments)

___

### finalizeTransactionUpdates

▸ **finalizeTransactionUpdates**(): `void`

#### Returns

`void`

___

### finish

▸ **finish**(`transactionId`, `success`, `error`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionId` | `string` |
| `success` | () => `void` |
| `error` | (`msg`: `string`) => `void` |

#### Returns

`void`

#### Implementation of

[BridgeInterface](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md).[finish](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md#finish)

___

### getStorefront

▸ **getStorefront**(): `Promise`\<`undefined` \| `string`\>

Retrieve the storefront country code from StoreKit

#### Returns

`Promise`\<`undefined` \| `string`\>

#### Implementation of

[BridgeInterface](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md).[getStorefront](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md#getstorefront)

___

### init

▸ **init**(`options`, `success`, `error`): `void`

Initialize the AppStore bridge.

This calls the native "setup" method from the "InAppPurchase" Objective-C class.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Partial`\<[`BridgeOptions`](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeOptions.md)\> | Options for the bridge |
| `success` | () => `void` | Called when the bridge is ready |
| `error` | (`code`: [`ErrorCode`](../enums/CdvPurchase.ErrorCode.md), `message`: `string`) => `void` | Called when the bridge failed to initialize |

#### Returns

`void`

#### Implementation of

[BridgeInterface](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md).[init](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md#init)

___

### lastTransactionUpdated

▸ **lastTransactionUpdated**(): `void`

#### Returns

`void`

___

### load

▸ **load**(`productIds`, `success`, `error`): `void`

Retrieves localized product data, including price (as localized
string), name, description of multiple products.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productIds` | `string`[] | An array of product identifier strings. |
| `success` | (`validProducts`: [`ValidProduct`](../interfaces/CdvPurchase.AppleAppStore.Bridge.ValidProduct.md)[], `invalidProductIds`: `string`[]) => `void` | - |
| `error` | (`code`: [`ErrorCode`](../enums/CdvPurchase.ErrorCode.md), `message`: `string`) => `void` | - |

#### Returns

`void`

#### Implementation of

[BridgeInterface](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md).[load](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md#load)

___

### loadReceipts

▸ **loadReceipts**(`callback`, `errorCb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | (`receipt`: [`ApplicationReceipt`](../interfaces/CdvPurchase.AppleAppStore.ApplicationReceipt.md)) => `void` |
| `errorCb` | (`code`: [`ErrorCode`](../enums/CdvPurchase.ErrorCode.md), `message`: `string`) => `void` |

#### Returns

`void`

#### Implementation of

[BridgeInterface](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md).[loadReceipts](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md#loadreceipts)

___

### manageBilling

▸ **manageBilling**(`callback?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback?` | [`Callback`](../modules/CdvPurchase.md#callback)\<`any`\> |

#### Returns

`void`

#### Implementation of

[BridgeInterface](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md).[manageBilling](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md#managebilling)

___

### manageSubscriptions

▸ **manageSubscriptions**(`callback?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback?` | [`Callback`](../modules/CdvPurchase.md#callback)\<`any`\> |

#### Returns

`void`

#### Implementation of

[BridgeInterface](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md).[manageSubscriptions](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md#managesubscriptions)

___

### parseReceiptArgs

▸ **parseReceiptArgs**(`args`): [`ApplicationReceipt`](../interfaces/CdvPurchase.AppleAppStore.ApplicationReceipt.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `RawReceiptArgs` |

#### Returns

[`ApplicationReceipt`](../interfaces/CdvPurchase.AppleAppStore.ApplicationReceipt.md)

___

### presentCodeRedemptionSheet

▸ **presentCodeRedemptionSheet**(`callback?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback?` | [`Callback`](../modules/CdvPurchase.md#callback)\<`any`\> |

#### Returns

`void`

#### Implementation of

[BridgeInterface](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md).[presentCodeRedemptionSheet](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md#presentcoderedemptionsheet)

___

### processPendingTransactions

▸ **processPendingTransactions**(): `void`

#### Returns

`void`

___

### purchase

▸ **purchase**(`productId`, `quantity`, `applicationUsername`, `discount`, `success`, `error`): `void`

Makes an in-app purchase.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | The product identifier. e.g. "com.example.MyApp.myproduct" |
| `quantity` | `number` | Quantity of product to purchase |
| `applicationUsername` | `undefined` \| `string` | - |
| `discount` | `undefined` \| [`PaymentDiscount`](../interfaces/CdvPurchase.AppleAppStore.PaymentDiscount.md) | - |
| `success` | () => `void` | - |
| `error` | () => `void` | - |

#### Returns

`void`

#### Implementation of

[BridgeInterface](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md).[purchase](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md#purchase)

___

### refreshReceipts

▸ **refreshReceipts**(`successCb`, `errorCb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `successCb` | (`receipt`: [`ApplicationReceipt`](../interfaces/CdvPurchase.AppleAppStore.ApplicationReceipt.md)) => `void` |
| `errorCb` | (`code`: [`ErrorCode`](../enums/CdvPurchase.ErrorCode.md), `message`: `string`) => `void` |

#### Returns

`void`

#### Implementation of

[BridgeInterface](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md).[refreshReceipts](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md#refreshreceipts)

___

### restore

▸ **restore**(`callback?`): `void`

Asks the payment queue to restore previously completed purchases.

The restored transactions are passed to the onRestored callback, so make sure you define a handler for that first.

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback?` | [`Callback`](../modules/CdvPurchase.md#callback)\<`any`\> |

#### Returns

`void`

#### Implementation of

[BridgeInterface](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md).[restore](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md#restore)

___

### restoreCompletedTransactionsFailed

▸ **restoreCompletedTransactionsFailed**(`errorCode`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `errorCode` | [`ErrorCode`](../enums/CdvPurchase.ErrorCode.md) |

#### Returns

`void`

___

### restoreCompletedTransactionsFinished

▸ **restoreCompletedTransactionsFinished**(): `void`

#### Returns

`void`

___

### transactionUpdated

▸ **transactionUpdated**(`state`, `errorCode`, `errorText`, `transactionIdentifier`, `productId`, `transactionReceipt`, `originalTransactionIdentifier`, `transactionDate`, `discountId`, `quantity`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`TransactionState`](../modules/CdvPurchase.AppleAppStore.Bridge.md#transactionstate) |
| `errorCode` | `undefined` \| [`ErrorCode`](../enums/CdvPurchase.ErrorCode.md) |
| `errorText` | `undefined` \| `string` |
| `transactionIdentifier` | `string` |
| `productId` | `string` |
| `transactionReceipt` | `never` |
| `originalTransactionIdentifier` | `undefined` \| `string` |
| `transactionDate` | `undefined` \| `string` |
| `discountId` | `undefined` \| `string` |
| `quantity` | `undefined` \| `number` |

#### Returns

`void`
