# Interface: Storefront

[CdvPurchase](../modules/CdvPurchase.md).Storefront

A storefront country code, scoped to a specific payment platform.

Returned from [Store.getStorefront](../classes/CdvPurchase.Store.md#getstorefront) and passed to
`when().storefrontUpdated()` listeners.

## Table of contents

### Properties

- [countryCode](CdvPurchase.Storefront.md#countrycode)
- [platform](CdvPurchase.Storefront.md#platform)

## Properties

### countryCode

• `Optional` `Readonly` **countryCode**: `string`

ISO 3166-1 alpha-2 country code (e.g., "US", "FR").

Undefined if the value has not been fetched yet, or if the fetch
failed. Never set to a falsy value once populated — a later failed
refresh will preserve the previously-known country code.

___

### platform

• `Readonly` **platform**: [`Platform`](../enums/CdvPurchase.Platform.md)

The platform this storefront belongs to.
