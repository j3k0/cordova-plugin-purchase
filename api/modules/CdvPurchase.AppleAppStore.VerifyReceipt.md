# Namespace: VerifyReceipt

[CdvPurchase](CdvPurchase.md).[AppleAppStore](CdvPurchase.AppleAppStore.md).VerifyReceipt

## Table of contents

### Enumerations

- [AppleExpirationIntent](../enums/CdvPurchase.AppleAppStore.VerifyReceipt.AppleExpirationIntent.md)

### Interfaces

- [ApplePendingRenewalInfo](../interfaces/CdvPurchase.AppleAppStore.VerifyReceipt.ApplePendingRenewalInfo.md)
- [AppleTransaction](../interfaces/CdvPurchase.AppleAppStore.VerifyReceipt.AppleTransaction.md)
- [AppleUnifiedReceipt](../interfaces/CdvPurchase.AppleAppStore.VerifyReceipt.AppleUnifiedReceipt.md)
- [AppleVerifyReceiptResponse](../interfaces/CdvPurchase.AppleAppStore.VerifyReceipt.AppleVerifyReceiptResponse.md)
- [AppleVerifyReceiptResponseReceipt](../interfaces/CdvPurchase.AppleAppStore.VerifyReceipt.AppleVerifyReceiptResponseReceipt.md)

### Type Aliases

- [AppleBoolean](CdvPurchase.AppleAppStore.VerifyReceipt.md#appleboolean)
- [AppleEnvironment](CdvPurchase.AppleAppStore.VerifyReceipt.md#appleenvironment)
- [AppleReceiptType](CdvPurchase.AppleAppStore.VerifyReceipt.md#applereceipttype)

## Type Aliases

### AppleBoolean

Ƭ **AppleBoolean**: ``"false"`` \| ``"true"`` \| ``"0"`` \| ``"1"``

___

### AppleEnvironment

Ƭ **AppleEnvironment**: ``"Production"`` \| ``"Sandbox"``

___

### AppleReceiptType

Ƭ **AppleReceiptType**: ``"Production"`` \| ``"ProductionVPP"`` \| ``"ProductionSandbox"`` \| ``"ProductionVPPSandbox"``

The type of receipt generated. The value corresponds to the environment in
which the app or VPP purchase was made. (VPP = volume purchase)
