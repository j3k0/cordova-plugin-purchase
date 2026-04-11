# Interface: BridgeInterface

[AppleAppStore](../modules/CdvPurchase.AppleAppStore.md).[Bridge](../modules/CdvPurchase.AppleAppStore.Bridge.md).BridgeInterface

Shared interface implemented by both the SK1 and SK2 bridges.
The adapter programs against this interface, not a concrete class.

## Implemented by

- [`Bridge`](../classes/CdvPurchase.AppleAppStore.Bridge.Bridge.md)
- [`CapacitorNativeBridge`](../classes/CdvPurchase.AppleAppStore.CapacitorBridge.CapacitorNativeBridge.md)
- [`SK2NativeBridge`](../classes/CdvPurchase.AppleAppStore.SK2Bridge.SK2NativeBridge.md)

## Table of contents

### Properties

- [appStoreReceipt](CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md#appstorereceipt)
- [isSK2](CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md#issk2)
- [transactionsForProduct](CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md#transactionsforproduct)

### Methods

- [canMakePayments](CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md#canmakepayments)
- [finish](CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md#finish)
- [getStorefront](CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md#getstorefront)
- [init](CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md#init)
- [load](CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md#load)
- [loadReceipts](CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md#loadreceipts)
- [manageBilling](CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md#managebilling)
- [manageSubscriptions](CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md#managesubscriptions)
- [presentCodeRedemptionSheet](CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md#presentcoderedemptionsheet)
- [purchase](CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md#purchase)
- [refreshReceipts](CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md#refreshreceipts)
- [restore](CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md#restore)

## Properties

### appStoreReceipt

• `Optional` **appStoreReceipt**: ``null`` \| [`ApplicationReceipt`](CdvPurchase.AppleAppStore.ApplicationReceipt.md)

Cached app store receipt

___

### isSK2

• `Optional` `Readonly` **isSK2**: `boolean`

Whether this bridge uses StoreKit 2

___

### transactionsForProduct

• **transactionsForProduct**: `Object`

Transaction IDs grouped by product

#### Index signature

▪ [productId: `string`]: `string`[]

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

___

### getStorefront

▸ **getStorefront**(): `Promise`\<`undefined` \| `string`\>

Retrieve the storefront country code (alpha-3 on iOS)

#### Returns

`Promise`\<`undefined` \| `string`\>

___

### init

▸ **init**(`options`, `success`, `error`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`\<[`BridgeOptions`](CdvPurchase.AppleAppStore.Bridge.BridgeOptions.md)\> |
| `success` | () => `void` |
| `error` | (`code`: [`ErrorCode`](../enums/CdvPurchase.ErrorCode.md), `message`: `string`) => `void` |

#### Returns

`void`

___

### load

▸ **load**(`productIds`, `success`, `error`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `productIds` | `string`[] |
| `success` | (`validProducts`: [`ValidProduct`](CdvPurchase.AppleAppStore.Bridge.ValidProduct.md)[], `invalidProductIds`: `string`[]) => `void` |
| `error` | (`code`: [`ErrorCode`](../enums/CdvPurchase.ErrorCode.md), `message`: `string`) => `void` |

#### Returns

`void`

___

### loadReceipts

▸ **loadReceipts**(`callback`, `errorCb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | (`receipt`: [`ApplicationReceipt`](CdvPurchase.AppleAppStore.ApplicationReceipt.md)) => `void` |
| `errorCb` | (`code`: [`ErrorCode`](../enums/CdvPurchase.ErrorCode.md), `message`: `string`) => `void` |

#### Returns

`void`

___

### manageBilling

▸ **manageBilling**(`callback?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback?` | [`Callback`](../modules/CdvPurchase.md#callback)\<`any`\> |

#### Returns

`void`

___

### manageSubscriptions

▸ **manageSubscriptions**(`callback?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback?` | [`Callback`](../modules/CdvPurchase.md#callback)\<`any`\> |

#### Returns

`void`

___

### presentCodeRedemptionSheet

▸ **presentCodeRedemptionSheet**(`callback?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback?` | [`Callback`](../modules/CdvPurchase.md#callback)\<`any`\> |

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
| `discount` | `undefined` \| [`PaymentDiscount`](CdvPurchase.AppleAppStore.PaymentDiscount.md) |
| `success` | () => `void` |
| `error` | () => `void` |

#### Returns

`void`

___

### refreshReceipts

▸ **refreshReceipts**(`successCb`, `errorCb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `successCb` | (`receipt`: [`ApplicationReceipt`](CdvPurchase.AppleAppStore.ApplicationReceipt.md)) => `void` |
| `errorCb` | (`code`: [`ErrorCode`](../enums/CdvPurchase.ErrorCode.md), `message`: `string`) => `void` |

#### Returns

`void`

___

### restore

▸ **restore**(`callback?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback?` | [`Callback`](../modules/CdvPurchase.md#callback)\<`any`\> |

#### Returns

`void`
