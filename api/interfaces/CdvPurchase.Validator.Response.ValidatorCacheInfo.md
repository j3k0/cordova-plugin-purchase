# Interface: ValidatorCacheInfo

[Validator](../modules/CdvPurchase.Validator.md).[Response](../modules/CdvPurchase.Validator.Response.md).ValidatorCacheInfo

Marker added by the validator to an answer that wasn't confirmed by the store just now.

## Table of contents

### Properties

- [lastConfirmedAt](CdvPurchase.Validator.Response.ValidatorCacheInfo.md#lastconfirmedat)
- [reason](CdvPurchase.Validator.Response.ValidatorCacheInfo.md#reason)
- [source](CdvPurchase.Validator.Response.ValidatorCacheInfo.md#source)

## Properties

### lastConfirmedAt

• **lastConfirmedAt**: `string`

When the store last confirmed this receipt (ISO 8601).

___

### reason

• **reason**: `string` & {} \| ``"store_unreachable"``

Why the cache was used. `store_unreachable`: the store (Apple, Google, ...) couldn't be reached.

___

### source

• **source**: `string` & {} \| ``"last-verified"``

Where the answer comes from. `last-verified`: the last answer the store confirmed for this exact receipt.
