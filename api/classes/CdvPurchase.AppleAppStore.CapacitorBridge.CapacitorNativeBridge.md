# Class: CapacitorNativeBridge

[AppleAppStore](../modules/CdvPurchase.AppleAppStore.md).[CapacitorBridge](../modules/CdvPurchase.AppleAppStore.CapacitorBridge.md).CapacitorNativeBridge

Shared interface implemented by both the SK1 and SK2 bridges.
The adapter programs against this interface, not a concrete class.

## Implements

- [`BridgeInterface`](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md)

## Table of contents

### Constructors

- [constructor](CdvPurchase.AppleAppStore.CapacitorBridge.CapacitorNativeBridge.md#constructor)

### Properties

- [appStoreReceipt](CdvPurchase.AppleAppStore.CapacitorBridge.CapacitorNativeBridge.md#appstorereceipt)
- [isSK2](CdvPurchase.AppleAppStore.CapacitorBridge.CapacitorNativeBridge.md#issk2)
- [transactionsForProduct](CdvPurchase.AppleAppStore.CapacitorBridge.CapacitorNativeBridge.md#transactionsforproduct)

### Methods

- [canMakePayments](CdvPurchase.AppleAppStore.CapacitorBridge.CapacitorNativeBridge.md#canmakepayments)
- [finish](CdvPurchase.AppleAppStore.CapacitorBridge.CapacitorNativeBridge.md#finish)
- [getStorefront](CdvPurchase.AppleAppStore.CapacitorBridge.CapacitorNativeBridge.md#getstorefront)
- [init](CdvPurchase.AppleAppStore.CapacitorBridge.CapacitorNativeBridge.md#init)
- [load](CdvPurchase.AppleAppStore.CapacitorBridge.CapacitorNativeBridge.md#load)
- [loadReceipts](CdvPurchase.AppleAppStore.CapacitorBridge.CapacitorNativeBridge.md#loadreceipts)
- [manageBilling](CdvPurchase.AppleAppStore.CapacitorBridge.CapacitorNativeBridge.md#managebilling)
- [manageSubscriptions](CdvPurchase.AppleAppStore.CapacitorBridge.CapacitorNativeBridge.md#managesubscriptions)
- [presentCodeRedemptionSheet](CdvPurchase.AppleAppStore.CapacitorBridge.CapacitorNativeBridge.md#presentcoderedemptionsheet)
- [purchase](CdvPurchase.AppleAppStore.CapacitorBridge.CapacitorNativeBridge.md#purchase)
- [refreshReceipts](CdvPurchase.AppleAppStore.CapacitorBridge.CapacitorNativeBridge.md#refreshreceipts)
- [restore](CdvPurchase.AppleAppStore.CapacitorBridge.CapacitorNativeBridge.md#restore)
- [isAvailable](CdvPurchase.AppleAppStore.CapacitorBridge.CapacitorNativeBridge.md#isavailable)

## Constructors

### constructor

• **new CapacitorNativeBridge**(): [`CapacitorNativeBridge`](CdvPurchase.AppleAppStore.CapacitorBridge.CapacitorNativeBridge.md)

#### Returns

[`CapacitorNativeBridge`](CdvPurchase.AppleAppStore.CapacitorBridge.CapacitorNativeBridge.md)

## Properties

### appStoreReceipt

• **appStoreReceipt**: ``null`` \| [`ApplicationReceipt`](../interfaces/CdvPurchase.AppleAppStore.ApplicationReceipt.md) = `null`

Cached app store receipt

#### Implementation of

[BridgeInterface](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md).[appStoreReceipt](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md#appstorereceipt)

___

### isSK2

• `Readonly` **isSK2**: ``true``

Whether this bridge uses StoreKit 2

#### Implementation of

[BridgeInterface](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md).[isSK2](../interfaces/CdvPurchase.AppleAppStore.Bridge.BridgeInterface.md#issk2)

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

### isAvailable

▸ **isAvailable**(): `boolean`

Check if the Capacitor purchase plugin is available

#### Returns

`boolean`
