# Namespace: Bridge

[CdvPurchase](CdvPurchase.md).[AmazonAppStore](CdvPurchase.AmazonAppStore.md).Bridge

## Table of contents

### Classes

- [Bridge](../classes/CdvPurchase.AmazonAppStore.Bridge.Bridge.md)

### Interfaces

- [AmazonProduct](../interfaces/CdvPurchase.AmazonAppStore.Bridge.AmazonProduct.md)
- [AmazonPurchase](../interfaces/CdvPurchase.AmazonAppStore.Bridge.AmazonPurchase.md)
- [Options](../interfaces/CdvPurchase.AmazonAppStore.Bridge.Options.md)
- [ProductDataResponse](../interfaces/CdvPurchase.AmazonAppStore.Bridge.ProductDataResponse.md)
- [PurchaseResponse](../interfaces/CdvPurchase.AmazonAppStore.Bridge.PurchaseResponse.md)

### Type Aliases

- [ErrorCallback](CdvPurchase.AmazonAppStore.Bridge.md#errorcallback)
- [Message](CdvPurchase.AmazonAppStore.Bridge.md#message)

## Type Aliases

### ErrorCallback

Ƭ **ErrorCallback**: (`message`: `string`, `code?`: [`ErrorCode`](../enums/CdvPurchase.ErrorCode.md)) => `void`

#### Type declaration

▸ (`message`, `code?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |
| `code?` | [`ErrorCode`](../enums/CdvPurchase.ErrorCode.md) |

##### Returns

`void`

___

### Message

Ƭ **Message**: \{ `data`: \{ `purchases`: [`AmazonPurchase`](../interfaces/CdvPurchase.AmazonAppStore.Bridge.AmazonPurchase.md)[]  } ; `type`: ``"setPurchases"``  } \| \{ `data`: \{ `purchases`: [`AmazonPurchase`](../interfaces/CdvPurchase.AmazonAppStore.Bridge.AmazonPurchase.md)[]  } ; `type`: ``"purchasesUpdated"``  } \| \{ `data`: \{ `purchase`: [`AmazonPurchase`](../interfaces/CdvPurchase.AmazonAppStore.Bridge.AmazonPurchase.md)  } ; `type`: ``"purchaseFulfilled"``  }
