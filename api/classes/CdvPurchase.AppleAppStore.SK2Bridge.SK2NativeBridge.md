# Class: SK2NativeBridge

[AppleAppStore](../modules/CdvPurchase.AppleAppStore.md).[SK2Bridge](../modules/CdvPurchase.AppleAppStore.SK2Bridge.md).SK2NativeBridge

Shared interface implemented by both the SK1 and SK2 bridges.
The adapter programs against this interface, not a concrete class.

## Implements

- [`BridgeInterface`](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md)

## Table of contents

### Constructors

- [constructor](CdvPurchase.AppleAppStore.SK2Bridge.SK2NativeBridge.md#constructor)

### Properties

- [appStoreReceipt](CdvPurchase.AppleAppStore.SK2Bridge.SK2NativeBridge.md#appstorereceipt)
- [isSK2](CdvPurchase.AppleAppStore.SK2Bridge.SK2NativeBridge.md#issk2)
- [options](CdvPurchase.AppleAppStore.SK2Bridge.SK2NativeBridge.md#options)
- [transactionsForProduct](CdvPurchase.AppleAppStore.SK2Bridge.SK2NativeBridge.md#transactionsforproduct)

### Methods

- [canMakePayments](CdvPurchase.AppleAppStore.SK2Bridge.SK2NativeBridge.md#canmakepayments)
- [finalizeTransactionUpdates](CdvPurchase.AppleAppStore.SK2Bridge.SK2NativeBridge.md#finalizetransactionupdates)
- [finish](CdvPurchase.AppleAppStore.SK2Bridge.SK2NativeBridge.md#finish)
- [getStorefront](CdvPurchase.AppleAppStore.SK2Bridge.SK2NativeBridge.md#getstorefront)
- [init](CdvPurchase.AppleAppStore.SK2Bridge.SK2NativeBridge.md#init)
- [lastTransactionUpdated](CdvPurchase.AppleAppStore.SK2Bridge.SK2NativeBridge.md#lasttransactionupdated)
- [load](CdvPurchase.AppleAppStore.SK2Bridge.SK2NativeBridge.md#load)
- [loadReceipts](CdvPurchase.AppleAppStore.SK2Bridge.SK2NativeBridge.md#loadreceipts)
- [manageBilling](CdvPurchase.AppleAppStore.SK2Bridge.SK2NativeBridge.md#managebilling)
- [manageSubscriptions](CdvPurchase.AppleAppStore.SK2Bridge.SK2NativeBridge.md#managesubscriptions)
- [parseReceiptArgs](CdvPurchase.AppleAppStore.SK2Bridge.SK2NativeBridge.md#parsereceiptargs)
- [presentCodeRedemptionSheet](CdvPurchase.AppleAppStore.SK2Bridge.SK2NativeBridge.md#presentcoderedemptionsheet)
- [processPendingTransactions](CdvPurchase.AppleAppStore.SK2Bridge.SK2NativeBridge.md#processpendingtransactions)
- [purchase](CdvPurchase.AppleAppStore.SK2Bridge.SK2NativeBridge.md#purchase)
- [refreshReceipts](CdvPurchase.AppleAppStore.SK2Bridge.SK2NativeBridge.md#refreshreceipts)
- [restore](CdvPurchase.AppleAppStore.SK2Bridge.SK2NativeBridge.md#restore)
- [restoreCompletedTransactionsFailed](CdvPurchase.AppleAppStore.SK2Bridge.SK2NativeBridge.md#restorecompletedtransactionsfailed)
- [restoreCompletedTransactionsFinished](CdvPurchase.AppleAppStore.SK2Bridge.SK2NativeBridge.md#restorecompletedtransactionsfinished)
- [transactionUpdated](CdvPurchase.AppleAppStore.SK2Bridge.SK2NativeBridge.md#transactionupdated)
- [isAvailable](CdvPurchase.AppleAppStore.SK2Bridge.SK2NativeBridge.md#isavailable)

## Constructors

### constructor

• **new SK2NativeBridge**(): [`SK2NativeBridge`](CdvPurchase.AppleAppStore.SK2Bridge.SK2NativeBridge.md)

#### Returns

[`SK2NativeBridge`](CdvPurchase.AppleAppStore.SK2Bridge.SK2NativeBridge.md)

## Properties

### appStoreReceipt

• `Optional` **appStoreReceipt**: ``null`` \| [`ApplicationReceipt`](../interfaces/CdvPurchase.AppleAppStore.ApplicationReceipt.md)

Cached app store receipt

#### Implementation of

[BridgeInterface](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md).[appStoreReceipt](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md#appstorereceipt)

___

### isSK2

• `Readonly` **isSK2**: ``true``

True when this bridge is active (SK2 extension installed + iOS 15+)

#### Implementation of

[BridgeInterface](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md).[isSK2](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md#issk2)

___

### options

• **options**: [`SK2BridgeCallbacks`](../interfaces/CdvPurchase.AppleAppStore.SK2Bridge.SK2BridgeCallbacks.md)

___

### transactionsForProduct

• **transactionsForProduct**: `Object` = `{}`

Transaction IDs grouped by product

#### Index signature

▪ [productId: `string`]: `string`[]

#### Implementation of

[BridgeInterface](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md).[transactionsForProduct](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md#transactionsforproduct)

## Methods

### canMakePayments

▸ **canMakePayments**(`success`, `error`): `void`

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

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`\<[`BridgeOptions`](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeOptions.md)\> |
| `success` | () => `void` |
| `error` | (`code`: [`ErrorCode`](../enums/CdvPurchase.ErrorCode.md), `message`: `string`) => `void` |

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

#### Parameters

| Name | Type |
| :------ | :------ |
| `productIds` | `string`[] |
| `success` | (`validProducts`: [`ValidProduct`](../interfaces/CdvPurchase.AppleAppStore.Bridge.ValidProduct.md)[], `invalidProductIds`: `string`[]) => `void` |
| `error` | (`code`: [`ErrorCode`](../enums/CdvPurchase.ErrorCode.md), `message`: `string`) => `void` |

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
| `args` | [`string`, `string`, `string`, `number`, `string`] |

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

#### Parameters

| Name | Type |
| :------ | :------ |
| `productId` | `string` |
| `quantity` | `number` |
| `applicationUsername` | `undefined` \| `string` |
| `discount` | `undefined` \| [`PaymentDiscount`](../interfaces/CdvPurchase.AppleAppStore.PaymentDiscount.md) |
| `success` | () => `void` |
| `error` | () => `void` |

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

▸ **transactionUpdated**(`state`, `errorCode`, `errorText`, `transactionIdentifier`, `productId`, `transactionReceipt`, `originalTransactionIdentifier`, `transactionDate`, `discountId`, `expirationDate?`, `jwsRepresentation?`): `void`

Called from native. Same as SK1 but with extra SK2 fields.

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
| `expirationDate?` | `string` |
| `jwsRepresentation?` | `string` |

#### Returns

`void`

___

### isAvailable

▸ **isAvailable**(): `boolean`

Check if the SK2 extension plugin is installed

#### Returns

`boolean`
