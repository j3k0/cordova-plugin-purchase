# Interface: AppleUnifiedReceipt

[AppleAppStore](../modules/CdvPurchase.AppleAppStore.md).[VerifyReceipt](../modules/CdvPurchase.AppleAppStore.VerifyReceipt.md).AppleUnifiedReceipt

An object that contains information about the most recent in-app purchase
transactions for the app.

https://developer.apple.com/documentation/appstoreservernotifications/unified_receipt

## Hierarchy

- **`AppleUnifiedReceipt`**

  ↳ [`AppleVerifyReceiptResponse`](CdvPurchase.AppleAppStore.VerifyReceipt.AppleVerifyReceiptResponse.md)

## Table of contents

### Properties

- [environment](CdvPurchase.AppleAppStore.VerifyReceipt.AppleUnifiedReceipt.md#environment)
- [latest\_receipt](CdvPurchase.AppleAppStore.VerifyReceipt.AppleUnifiedReceipt.md#latest_receipt)
- [latest\_receipt\_info](CdvPurchase.AppleAppStore.VerifyReceipt.AppleUnifiedReceipt.md#latest_receipt_info)
- [pending\_renewal\_info](CdvPurchase.AppleAppStore.VerifyReceipt.AppleUnifiedReceipt.md#pending_renewal_info)
- [status](CdvPurchase.AppleAppStore.VerifyReceipt.AppleUnifiedReceipt.md#status)

## Properties

### environment

• **environment**: [`AppleEnvironment`](../modules/CdvPurchase.AppleAppStore.VerifyReceipt.md#appleenvironment)

The environment for which the receipt was generated.

___

### latest\_receipt

• `Optional` **latest\_receipt**: `string`

The latest Base64-encoded app receipt.

___

### latest\_receipt\_info

• `Optional` **latest\_receipt\_info**: [`AppleTransaction`](CdvPurchase.AppleAppStore.VerifyReceipt.AppleTransaction.md)[]

An array that contains the latest 100 in-app purchase transactions of the
decoded value in latest_receipt. This array excludes transactions for
consumable products that your app has marked as finished. The contents of
this array are identical to those in responseBody.Latest_receipt_info in
the verifyReceipt endpoint response for receipt validation.

___

### pending\_renewal\_info

• `Optional` **pending\_renewal\_info**: [`ApplePendingRenewalInfo`](CdvPurchase.AppleAppStore.VerifyReceipt.ApplePendingRenewalInfo.md)[]

An array where each element contains the pending renewal information for
each auto-renewable subscription identified in product_id. The contents of
this array are identical to those in responseBody.Pending_renewal_info in
the verifyReciept endpoint response for receipt validation.

___

### status

• **status**: `number`

The status code, where 0 indicates that the notification is valid.
