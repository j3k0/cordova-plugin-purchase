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

#### Type declaration

▸ (`productId`): `void`

Called when a transaction is deferred (waiting for approval)

##### Parameters

| Name | Type |
| :------ | :------ |
| `productId` | `string` |

##### Returns

`void`

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

___

### ready

• **ready**: () => `void`

#### Type declaration

▸ (): `void`

Called when the bridge is ready (after setup)

##### Returns

`void`

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

___

### restoreCompleted

• **restoreCompleted**: () => `void`

#### Type declaration

▸ (): `void`

Called when a call to "restore" is complete

##### Returns

`void`

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
