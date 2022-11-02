# Namespace: Bridge

[CdvPurchase](CdvPurchase.md).[GooglePlay](CdvPurchase.GooglePlay.md).Bridge

## Table of contents

### Enumerations

- [PurchaseState](../enums/CdvPurchase.GooglePlay.Bridge.PurchaseState.md)
- [RecurrenceMode](../enums/CdvPurchase.GooglePlay.Bridge.RecurrenceMode.md)

### Classes

- [Bridge](../classes/CdvPurchase.GooglePlay.Bridge.Bridge.md)

### Interfaces

- [InAppProduct](../interfaces/CdvPurchase.GooglePlay.Bridge.InAppProduct.md)
- [Options](../interfaces/CdvPurchase.GooglePlay.Bridge.Options.md)
- [PricingPhase](../interfaces/CdvPurchase.GooglePlay.Bridge.PricingPhase.md)
- [Purchase](../interfaces/CdvPurchase.GooglePlay.Bridge.Purchase.md)
- [Subscription](../interfaces/CdvPurchase.GooglePlay.Bridge.Subscription.md)
- [SubscriptionOffer](../interfaces/CdvPurchase.GooglePlay.Bridge.SubscriptionOffer.md)

### Type Aliases

- [ErrorCallback](CdvPurchase.GooglePlay.Bridge.md#errorcallback)
- [Message](CdvPurchase.GooglePlay.Bridge.md#message)

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

Ƭ **Message**: { `data`: { `purchases`: [`Purchase`](../interfaces/CdvPurchase.GooglePlay.Bridge.Purchase.md)[]  } ; `type`: ``"setPurchases"``  } \| { `data`: { `purchases`: [`Purchase`](../interfaces/CdvPurchase.GooglePlay.Bridge.Purchase.md)[]  } ; `type`: ``"purchasesUpdated"``  } \| { `data`: { `purchase`: [`Purchase`](../interfaces/CdvPurchase.GooglePlay.Bridge.Purchase.md)  } ; `type`: ``"purchaseConsumed"``  } \| { `data`: { `purchase`: [`Purchase`](../interfaces/CdvPurchase.GooglePlay.Bridge.Purchase.md)  } ; `type`: ``"onPriceChangeConfirmationResultOK"`` \| ``"onPriceChangeConfirmationResultUserCanceled"`` \| ``"onPriceChangeConfirmationResultUnknownSku"``  }
