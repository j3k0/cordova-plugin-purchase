# Interface: AppleVerifyReceiptResponse

[AppleAppStore](../modules/CdvPurchase.AppleAppStore.md).[VerifyReceipt](../modules/CdvPurchase.AppleAppStore.VerifyReceipt.md).AppleVerifyReceiptResponse

An object that contains information about the most recent in-app purchase
transactions for the app.

https://developer.apple.com/documentation/appstoreservernotifications/unified_receipt

## Hierarchy

- [`AppleUnifiedReceipt`](CdvPurchase.AppleAppStore.VerifyReceipt.AppleUnifiedReceipt.md)

  ↳ **`AppleVerifyReceiptResponse`**

## Table of contents

### Properties

- [environment](CdvPurchase.AppleAppStore.VerifyReceipt.AppleVerifyReceiptResponse.md#environment)
- [exception](CdvPurchase.AppleAppStore.VerifyReceipt.AppleVerifyReceiptResponse.md#exception)
- [is-retryable](CdvPurchase.AppleAppStore.VerifyReceipt.AppleVerifyReceiptResponse.md#is-retryable)
- [latest\_receipt](CdvPurchase.AppleAppStore.VerifyReceipt.AppleVerifyReceiptResponse.md#latest_receipt)
- [latest\_receipt\_info](CdvPurchase.AppleAppStore.VerifyReceipt.AppleVerifyReceiptResponse.md#latest_receipt_info)
- [pending\_renewal\_info](CdvPurchase.AppleAppStore.VerifyReceipt.AppleVerifyReceiptResponse.md#pending_renewal_info)
- [receipt](CdvPurchase.AppleAppStore.VerifyReceipt.AppleVerifyReceiptResponse.md#receipt)
- [status](CdvPurchase.AppleAppStore.VerifyReceipt.AppleVerifyReceiptResponse.md#status)

## Properties

### environment

• **environment**: [`AppleEnvironment`](../modules/CdvPurchase.AppleAppStore.VerifyReceipt.md#appleenvironment)

The environment for which the receipt was generated. Possible values:
Sandbox, Production.

#### Overrides

[AppleUnifiedReceipt](CdvPurchase.AppleAppStore.VerifyReceipt.AppleUnifiedReceipt.md).[environment](CdvPurchase.AppleAppStore.VerifyReceipt.AppleUnifiedReceipt.md#environment)

___

### exception

• `Optional` **exception**: `string`

Description of an error, when there's an internal server error at Apple.

___

### is-retryable

• `Optional` **is-retryable**: `boolean`

An indicator that an error occurred during the request. A value of 1
indicates a temporary issue; retry validation for this receipt at a later
time. A value of 0 indicates an unresolvable issue; do not retry
validation for this receipt. Only applicable to status codes 21100-21199.

___

### latest\_receipt

• `Optional` **latest\_receipt**: `string`

The latest Base64 encoded app receipt. Only returned for receipts that
contain auto-renewable subscriptions.

#### Overrides

[AppleUnifiedReceipt](CdvPurchase.AppleAppStore.VerifyReceipt.AppleUnifiedReceipt.md).[latest_receipt](CdvPurchase.AppleAppStore.VerifyReceipt.AppleUnifiedReceipt.md#latest_receipt)

___

### latest\_receipt\_info

• `Optional` **latest\_receipt\_info**: [`AppleTransaction`](CdvPurchase.AppleAppStore.VerifyReceipt.AppleTransaction.md)[]

An array that contains all in-app purchase transactions. This excludes
transactions for consumable products that have been marked as finished by
your app. Only returned for receipts that contain auto-renewable
subscriptions.

#### Overrides

[AppleUnifiedReceipt](CdvPurchase.AppleAppStore.VerifyReceipt.AppleUnifiedReceipt.md).[latest_receipt_info](CdvPurchase.AppleAppStore.VerifyReceipt.AppleUnifiedReceipt.md#latest_receipt_info)

___

### pending\_renewal\_info

• `Optional` **pending\_renewal\_info**: [`ApplePendingRenewalInfo`](CdvPurchase.AppleAppStore.VerifyReceipt.ApplePendingRenewalInfo.md)[]

In the JSON file, an array where each element contains the pending
renewal information for each auto-renewable subscription identified by the
product_id. Only returned for app receipts that contain auto-renewable
subscriptions.

#### Overrides

[AppleUnifiedReceipt](CdvPurchase.AppleAppStore.VerifyReceipt.AppleUnifiedReceipt.md).[pending_renewal_info](CdvPurchase.AppleAppStore.VerifyReceipt.AppleUnifiedReceipt.md#pending_renewal_info)

___

### receipt

• **receipt**: [`AppleVerifyReceiptResponseReceipt`](CdvPurchase.AppleAppStore.VerifyReceipt.AppleVerifyReceiptResponseReceipt.md)

A JSON representation of the receipt that was sent for verification.

___

### status

• **status**: `number`

Either 0 if the receipt is valid, or a status code if there is an error.
The status code reflects the status of the app receipt as a whole.
https://developer.apple.com/documentation/appstorereceipts/status

#### Overrides

[AppleUnifiedReceipt](CdvPurchase.AppleAppStore.VerifyReceipt.AppleUnifiedReceipt.md).[status](CdvPurchase.AppleAppStore.VerifyReceipt.AppleUnifiedReceipt.md#status)
