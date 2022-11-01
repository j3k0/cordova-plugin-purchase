# Namespace: Response

[CdvPurchase](CdvPurchase.md).[Validator](CdvPurchase.Validator.md).Response

## Interfaces

- [ErrorPayload](../interfaces/CdvPurchase.Validator.Response.ErrorPayload.md)
- [SuccessPayload](../interfaces/CdvPurchase.Validator.Response.SuccessPayload.md)

## Type Aliases

### NativeTransaction

Ƭ **NativeTransaction**: { `data`: [`TransactionObject`](../interfaces/CdvPurchase.Braintree.TransactionObject.md) ; `type`: ``"braintree"``  } \| { `type`: ``"windows-store-transaction"``  } & [`WindowsSubscription`](../interfaces/CdvPurchase.WindowsStore.WindowsSubscription.md) \| { `type`: ``"ios-appstore"``  } & [`AppleTransaction`](../interfaces/CdvPurchase.AppleAppStore.VerifyReceipt.AppleTransaction.md) \| [`AppleVerifyReceiptResponseReceipt`](../interfaces/CdvPurchase.AppleAppStore.VerifyReceipt.AppleVerifyReceiptResponseReceipt.md) \| { `type`: ``"android-playstore"``  } & [`GooglePurchase`](CdvPurchase.GooglePlay.PublisherAPI.md#googlepurchase)

___

### Payload

Ƭ **Payload**: [`SuccessPayload`](../interfaces/CdvPurchase.Validator.Response.SuccessPayload.md) \| [`ErrorPayload`](../interfaces/CdvPurchase.Validator.Response.ErrorPayload.md)
