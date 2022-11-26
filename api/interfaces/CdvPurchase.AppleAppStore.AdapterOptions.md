# Interface: AdapterOptions

[CdvPurchase](../modules/CdvPurchase.md).[AppleAppStore](../modules/CdvPurchase.AppleAppStore.md).AdapterOptions

Optional options for the AppleAppStore adapter

## Table of contents

### Properties

- [discountEligibilityDeterminer](CdvPurchase.AppleAppStore.AdapterOptions.md#discounteligibilitydeterminer)
- [needAppReceipt](CdvPurchase.AppleAppStore.AdapterOptions.md#needappreceipt)

## Properties

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
