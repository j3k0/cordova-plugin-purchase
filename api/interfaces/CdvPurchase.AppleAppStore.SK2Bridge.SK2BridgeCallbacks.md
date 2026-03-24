# Interface: SK2BridgeCallbacks

[AppleAppStore](../modules/CdvPurchase.AppleAppStore.md).[SK2Bridge](../modules/CdvPurchase.AppleAppStore.SK2Bridge.md).SK2BridgeCallbacks

Extended callbacks with SK2 fields

## Hierarchy

- [`BridgeCallbacks`](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md)

  ↳ **`SK2BridgeCallbacks`**

## Table of contents

### Properties

- [deferred](CdvPurchase.AppleAppStore.SK2Bridge.SK2BridgeCallbacks.md#deferred)
- [error](CdvPurchase.AppleAppStore.SK2Bridge.SK2BridgeCallbacks.md#error)
- [finished](CdvPurchase.AppleAppStore.SK2Bridge.SK2BridgeCallbacks.md#finished)
- [purchaseEnqueued](CdvPurchase.AppleAppStore.SK2Bridge.SK2BridgeCallbacks.md#purchaseenqueued)
- [purchaseFailed](CdvPurchase.AppleAppStore.SK2Bridge.SK2BridgeCallbacks.md#purchasefailed)
- [purchased](CdvPurchase.AppleAppStore.SK2Bridge.SK2BridgeCallbacks.md#purchased)
- [purchasing](CdvPurchase.AppleAppStore.SK2Bridge.SK2BridgeCallbacks.md#purchasing)
- [ready](CdvPurchase.AppleAppStore.SK2Bridge.SK2BridgeCallbacks.md#ready)
- [receiptsRefreshed](CdvPurchase.AppleAppStore.SK2Bridge.SK2BridgeCallbacks.md#receiptsrefreshed)
- [restoreCompleted](CdvPurchase.AppleAppStore.SK2Bridge.SK2BridgeCallbacks.md#restorecompleted)
- [restoreFailed](CdvPurchase.AppleAppStore.SK2Bridge.SK2BridgeCallbacks.md#restorefailed)
- [restored](CdvPurchase.AppleAppStore.SK2Bridge.SK2BridgeCallbacks.md#restored)

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

#### Inherited from

[BridgeCallbacks](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md).[deferred](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md#deferred)

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

#### Inherited from

[BridgeCallbacks](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md).[error](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md#error)

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

#### Inherited from

[BridgeCallbacks](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md).[finished](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md#finished)

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

#### Inherited from

[BridgeCallbacks](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md).[purchaseEnqueued](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md#purchaseenqueued)

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

#### Inherited from

[BridgeCallbacks](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md).[purchaseFailed](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md#purchasefailed)

___

### purchased

• **purchased**: (`transactionIdentifier`: `string`, `productId`: `string`, `originalTransactionIdentifier?`: `string`, `transactionDate?`: `string`, `discountId?`: `string`, `expirationDate?`: `string`, `jwsRepresentation?`: `string`) => `void`

Called when a transaction is in "Purchased" state

#### Type declaration

▸ (`transactionIdentifier`, `productId`, `originalTransactionIdentifier?`, `transactionDate?`, `discountId?`, `expirationDate?`, `jwsRepresentation?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `transactionIdentifier` | `string` |
| `productId` | `string` |
| `originalTransactionIdentifier?` | `string` |
| `transactionDate?` | `string` |
| `discountId?` | `string` |
| `expirationDate?` | `string` |
| `jwsRepresentation?` | `string` |

##### Returns

`void`

#### Overrides

[BridgeCallbacks](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md).[purchased](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md#purchased)

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

#### Inherited from

[BridgeCallbacks](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md).[purchasing](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md#purchasing)

___

### ready

• **ready**: () => `void`

Called when the bridge is ready (after setup)

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Inherited from

[BridgeCallbacks](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md).[ready](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md#ready)

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

#### Inherited from

[BridgeCallbacks](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md).[receiptsRefreshed](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md#receiptsrefreshed)

___

### restoreCompleted

• **restoreCompleted**: () => `void`

Called when a call to "restore" is complete

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Inherited from

[BridgeCallbacks](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md).[restoreCompleted](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md#restorecompleted)

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

#### Inherited from

[BridgeCallbacks](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md).[restoreFailed](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md#restorefailed)

___

### restored

• **restored**: (`transactionIdentifier`: `string`, `productId`: `string`, `originalTransactionIdentifier?`: `string`, `transactionDate?`: `string`, `discountId?`: `string`, `expirationDate?`: `string`, `jwsRepresentation?`: `string`) => `void`

Called when a transaction is in "restored" state

#### Type declaration

▸ (`transactionIdentifier`, `productId`, `originalTransactionIdentifier?`, `transactionDate?`, `discountId?`, `expirationDate?`, `jwsRepresentation?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `transactionIdentifier` | `string` |
| `productId` | `string` |
| `originalTransactionIdentifier?` | `string` |
| `transactionDate?` | `string` |
| `discountId?` | `string` |
| `expirationDate?` | `string` |
| `jwsRepresentation?` | `string` |

##### Returns

`void`

#### Overrides

[BridgeCallbacks](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md).[restored](CdvPurchase.AppleAppStore.Bridge.BridgeCallbacks.md#restored)
