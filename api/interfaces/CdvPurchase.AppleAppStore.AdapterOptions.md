# Interface: AdapterOptions

[CdvPurchase](../modules/CdvPurchase.md).[AppleAppStore](../modules/CdvPurchase.AppleAppStore.md).AdapterOptions

Optional options for the AppleAppStore adapter

## Table of contents

### Properties

- [autoFinish](CdvPurchase.AppleAppStore.AdapterOptions.md#autofinish)
- [discountEligibilityDeterminer](CdvPurchase.AppleAppStore.AdapterOptions.md#discounteligibilitydeterminer)
- [needAppReceipt](CdvPurchase.AppleAppStore.AdapterOptions.md#needappreceipt)

## Properties

### autoFinish

• `Optional` **autoFinish**: `boolean`

Auto-finish pending transaction

Use this if the transaction queue is filled with unwanted transactions (in development).
It's safe to keep this option to "true" when using a receipt validation server and you only
sell subscriptions.

___

### discountEligibilityDeterminer

• `Optional` **discountEligibilityDeterminer**: [`DiscountEligibilityDeterminer`](../modules/CdvPurchase.AppleAppStore.md#discounteligibilitydeterminer)

Determine which discount the user is eligible to.

**`Param`**

An apple appstore receipt

**`Param`**

List of discount offers to evaluate eligibility for

**`Param`**

Get the response, a boolean for each request (matched by index).

___

### needAppReceipt

• `Optional` **needAppReceipt**: `boolean`

Set to false if you don't need to verify the application receipt

Verifying the application receipt at startup is useful in different cases:

 - Retrieve information about the user's first app download.
 - Make it harder to side-load your application.
 - Determine eligibility to introductory prices.

The default is "true", use "false" is an optimization.
