# Interface: BridgeOptions

[AppleAppStore](../modules/CdvPurchase.AppleAppStore.md).[Bridge](../modules/CdvPurchase.AppleAppStore.Bridge.md).BridgeOptions

## Hierarchy

- [`BridgeCallbacks`](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md)

  ↳ **`BridgeOptions`**

## Table of contents

### Properties

- [autoFinish](CdvPurchase.AppleAppStore.Bridge.BridgeOptions.md#autofinish)
- [debug](CdvPurchase.AppleAppStore.Bridge.BridgeOptions.md#debug)
- [deferred](CdvPurchase.AppleAppStore.Bridge.BridgeOptions.md#deferred)
- [error](CdvPurchase.AppleAppStore.Bridge.BridgeOptions.md#error)
- [finished](CdvPurchase.AppleAppStore.Bridge.BridgeOptions.md#finished)
- [log](CdvPurchase.AppleAppStore.Bridge.BridgeOptions.md#log)
- [purchaseEnqueued](CdvPurchase.AppleAppStore.Bridge.BridgeOptions.md#purchaseenqueued)
- [purchaseFailed](CdvPurchase.AppleAppStore.Bridge.BridgeOptions.md#purchasefailed)
- [purchased](CdvPurchase.AppleAppStore.Bridge.BridgeOptions.md#purchased)
- [purchasing](CdvPurchase.AppleAppStore.Bridge.BridgeOptions.md#purchasing)
- [ready](CdvPurchase.AppleAppStore.Bridge.BridgeOptions.md#ready)
- [receiptsRefreshed](CdvPurchase.AppleAppStore.Bridge.BridgeOptions.md#receiptsrefreshed)
- [restoreCompleted](CdvPurchase.AppleAppStore.Bridge.BridgeOptions.md#restorecompleted)
- [restoreFailed](CdvPurchase.AppleAppStore.Bridge.BridgeOptions.md#restorefailed)
- [restored](CdvPurchase.AppleAppStore.Bridge.BridgeOptions.md#restored)

## Properties

### autoFinish

• **autoFinish**: `boolean`

Auto-finish transaction

___

### debug

• **debug**: `boolean`

True to enable lot of logs on the console

___

### deferred

• **deferred**: (`productId`: `string`) => `void`

#### Type declaration

▸ (`productId`): `void`

Called when a transaction is deferred (waiting for approval)

##### Parameters

| Name | Type |
| :------ | :------ |
| `productId` | `string` |

##### Returns

`void`

#### Inherited from

[BridgeCallbacks](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md).[deferred](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md#deferred)

___

### error

• **error**: (`code`: [`ErrorCode`](../enums/CdvPurchase.ErrorCode.md), `message`: `string`, `options?`: { `productId`: `string` ; `quantity?`: `number`  }) => `void`

#### Type declaration

▸ (`code`, `message`, `options?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `code` | [`ErrorCode`](../enums/CdvPurchase.ErrorCode.md) |
| `message` | `string` |
| `options?` | `Object` |
| `options.productId` | `string` |
| `options.quantity?` | `number` |

##### Returns

`void`

#### Inherited from

[BridgeCallbacks](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md).[error](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md#error)

___

### finished

• **finished**: (`transactionIdentifier`: `string`, `productId`: `string`) => `void`

#### Type declaration

▸ (`transactionIdentifier`, `productId`): `void`

Called when a transaction is in "finished" state

##### Parameters

| Name | Type |
| :------ | :------ |
| `transactionIdentifier` | `string` |
| `productId` | `string` |

##### Returns

`void`

#### Inherited from

[BridgeCallbacks](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md).[finished](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md#finished)

___

### log

• **log**: (`message`: `string`) => `void`

#### Type declaration

▸ (`message`): `void`

Custom logger for the bridge

##### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |

##### Returns

`void`

___

### purchaseEnqueued

• **purchaseEnqueued**: (`productId`: `string`, `quantity`: `number`) => `void`

#### Type declaration

▸ (`productId`, `quantity`): `void`

Called when a transaction has been enqueued

##### Parameters

| Name | Type |
| :------ | :------ |
| `productId` | `string` |
| `quantity` | `number` |

##### Returns

`void`

#### Inherited from

[BridgeCallbacks](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md).[purchaseEnqueued](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md#purchaseenqueued)

___

### purchaseFailed

• **purchaseFailed**: (`productId`: `string`, `code`: [`ErrorCode`](../enums/CdvPurchase.ErrorCode.md), `message`: `string`) => `void`

#### Type declaration

▸ (`productId`, `code`, `message`): `void`

Called when a transaction failed.

Watch out for ErrorCode.PAYMENT_CANCELLED (means user closed the dialog)

##### Parameters

| Name | Type |
| :------ | :------ |
| `productId` | `string` |
| `code` | [`ErrorCode`](../enums/CdvPurchase.ErrorCode.md) |
| `message` | `string` |

##### Returns

`void`

#### Inherited from

[BridgeCallbacks](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md).[purchaseFailed](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md#purchasefailed)

___

### purchased

• **purchased**: (`transactionIdentifier`: `string`, `productId`: `string`, `originalTransactionIdentifier?`: `string`, `transactionDate?`: `string`, `discountId?`: `string`) => `void`

#### Type declaration

▸ (`transactionIdentifier`, `productId`, `originalTransactionIdentifier?`, `transactionDate?`, `discountId?`): `void`

Called when a transaction is in "Purchased" state

##### Parameters

| Name | Type |
| :------ | :------ |
| `transactionIdentifier` | `string` |
| `productId` | `string` |
| `originalTransactionIdentifier?` | `string` |
| `transactionDate?` | `string` |
| `discountId?` | `string` |

##### Returns

`void`

#### Inherited from

[BridgeCallbacks](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md).[purchased](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md#purchased)

___

### purchasing

• **purchasing**: (`productId`: `string`) => `void`

#### Type declaration

▸ (`productId`): `void`

Called when a transaction is in "purchasing" state

##### Parameters

| Name | Type |
| :------ | :------ |
| `productId` | `string` |

##### Returns

`void`

#### Inherited from

[BridgeCallbacks](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md).[purchasing](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md#purchasing)

___

### ready

• **ready**: () => `void`

#### Type declaration

▸ (): `void`

Called when the bridge is ready (after setup)

##### Returns

`void`

#### Inherited from

[BridgeCallbacks](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md).[ready](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md#ready)

___

### receiptsRefreshed

• **receiptsRefreshed**: (`receipt`: [`ApplicationReceipt`](CdvPurchase.AppleAppStore.ApplicationReceipt.md)) => `void`

#### Type declaration

▸ (`receipt`): `void`

Called when the application receipt is refreshed

##### Parameters

| Name | Type |
| :------ | :------ |
| `receipt` | [`ApplicationReceipt`](CdvPurchase.AppleAppStore.ApplicationReceipt.md) |

##### Returns

`void`

#### Inherited from

[BridgeCallbacks](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md).[receiptsRefreshed](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md#receiptsrefreshed)

___

### restoreCompleted

• **restoreCompleted**: () => `void`

#### Type declaration

▸ (): `void`

Called when a call to "restore" is complete

##### Returns

`void`

#### Inherited from

[BridgeCallbacks](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md).[restoreCompleted](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md#restorecompleted)

___

### restoreFailed

• **restoreFailed**: (`errorCode`: [`ErrorCode`](../enums/CdvPurchase.ErrorCode.md)) => `void`

#### Type declaration

▸ (`errorCode`): `void`

Called when a call to "restore" failed

##### Parameters

| Name | Type |
| :------ | :------ |
| `errorCode` | [`ErrorCode`](../enums/CdvPurchase.ErrorCode.md) |

##### Returns

`void`

#### Inherited from

[BridgeCallbacks](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md).[restoreFailed](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md#restorefailed)

___

### restored

• **restored**: (`transactionIdentifier`: `string`, `productId`: `string`) => `void`

#### Type declaration

▸ (`transactionIdentifier`, `productId`): `void`

Called when a transaction is in "restored" state

##### Parameters

| Name | Type |
| :------ | :------ |
| `transactionIdentifier` | `string` |
| `productId` | `string` |

##### Returns

`void`

#### Inherited from

[BridgeCallbacks](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md).[restored](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md#restored)
