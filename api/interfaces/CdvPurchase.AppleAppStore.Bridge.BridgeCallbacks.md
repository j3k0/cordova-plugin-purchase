# Interface: BridgeCallbacks

[AppleAppStore](../modules/CdvPurchase.AppleAppStore.md).[Bridge](../modules/CdvPurchase.AppleAppStore.Bridge.md).BridgeCallbacks

## Hierarchy

- **`BridgeCallbacks`**

  ↳ [`BridgeOptions`](CdvPurchase.AppleAppStore.Bridge.BridgeOptions.md)

## Table of contents

### Properties

- [deferred](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md#deferred)
- [error](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md#error)
- [finished](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md#finished)
- [purchaseEnqueued](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md#purchaseenqueued)
- [purchaseFailed](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md#purchasefailed)
- [purchased](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md#purchased)
- [purchasing](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md#purchasing)
- [ready](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md#ready)
- [receiptsRefreshed](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md#receiptsrefreshed)
- [restoreCompleted](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md#restorecompleted)
- [restoreFailed](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md#restorefailed)
- [restored](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md#restored)

## Properties

### deferred

• **deferred**: (`productId`: `string`) => `void`

Called when a transaction is deferred (waiting for approval)

#### Type declaration

▸ (`productId`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `productId` | `string` |

##### Returns

`void`

___

### error

• **error**: (`code`: [`ErrorCode`](../enums/CdvPurchase.ErrorCode.md), `message`: `string`, `options?`: \{ `productId`: `string` ; `quantity?`: `number`  }) => `void`

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

___

### finished

• **finished**: (`transactionIdentifier`: `string`, `productId`: `string`) => `void`

Called when a transaction is in "finished" state

#### Type declaration

▸ (`transactionIdentifier`, `productId`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `transactionIdentifier` | `string` |
| `productId` | `string` |

##### Returns

`void`

___

### purchaseEnqueued

• **purchaseEnqueued**: (`productId`: `string`, `quantity`: `number`) => `void`

Called when a transaction has been enqueued

#### Type declaration

▸ (`productId`, `quantity`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `productId` | `string` |
| `quantity` | `number` |

##### Returns

`void`

___

### purchaseFailed

• **purchaseFailed**: (`productId`: `string`, `code`: [`ErrorCode`](../enums/CdvPurchase.ErrorCode.md), `message`: `string`) => `void`

Called when a transaction failed.

Watch out for ErrorCode.PAYMENT_CANCELLED (means user closed the dialog)

#### Type declaration

▸ (`productId`, `code`, `message`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `productId` | `string` |
| `code` | [`ErrorCode`](../enums/CdvPurchase.ErrorCode.md) |
| `message` | `string` |

##### Returns

`void`

___

### purchased

• **purchased**: (`transactionIdentifier`: `string`, `productId`: `string`, `originalTransactionIdentifier?`: `string`, `transactionDate?`: `string`, `discountId?`: `string`) => `void`

Called when a transaction is in "Purchased" state

#### Type declaration

▸ (`transactionIdentifier`, `productId`, `originalTransactionIdentifier?`, `transactionDate?`, `discountId?`): `void`

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

___

### purchasing

• **purchasing**: (`productId`: `string`) => `void`

Called when a transaction is in "purchasing" state

#### Type declaration

▸ (`productId`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `productId` | `string` |

##### Returns

`void`

___

### ready

• **ready**: () => `void`

Called when the bridge is ready (after setup)

#### Type declaration

▸ (): `void`

##### Returns

`void`

___

### receiptsRefreshed

• **receiptsRefreshed**: (`receipt`: [`ApplicationReceipt`](CdvPurchase.AppleAppStore.ApplicationReceipt.md)) => `void`

Called when the application receipt is refreshed

#### Type declaration

▸ (`receipt`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `receipt` | [`ApplicationReceipt`](CdvPurchase.AppleAppStore.ApplicationReceipt.md) |

##### Returns

`void`

___

### restoreCompleted

• **restoreCompleted**: () => `void`

Called when a call to "restore" is complete

#### Type declaration

▸ (): `void`

##### Returns

`void`

___

### restoreFailed

• **restoreFailed**: (`errorCode`: [`ErrorCode`](../enums/CdvPurchase.ErrorCode.md)) => `void`

Called when a call to "restore" failed

#### Type declaration

▸ (`errorCode`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `errorCode` | [`ErrorCode`](../enums/CdvPurchase.ErrorCode.md) |

##### Returns

`void`

___

### restored

• **restored**: (`transactionIdentifier`: `string`, `productId`: `string`) => `void`

Called when a transaction is in "restored" state

#### Type declaration

▸ (`transactionIdentifier`, `productId`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `transactionIdentifier` | `string` |
| `productId` | `string` |

##### Returns

`void`
