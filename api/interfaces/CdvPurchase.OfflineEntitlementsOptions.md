# Interface: OfflineEntitlementsOptions

[CdvPurchase](../modules/CdvPurchase.md).OfflineEntitlementsOptions

Options for [OfflineEntitlements](../classes/CdvPurchase.OfflineEntitlements.md).

## Table of contents

### Properties

- [detectClockRollback](CdvPurchase.OfflineEntitlementsOptions.md#detectclockrollback)
- [gracePeriodMs](CdvPurchase.OfflineEntitlementsOptions.md#graceperiodms)
- [onExpiredOffline](CdvPurchase.OfflineEntitlementsOptions.md#onexpiredoffline)
- [storage](CdvPurchase.OfflineEntitlementsOptions.md#storage)

## Properties

### detectClockRollback

• `Optional` **detectClockRollback**: `boolean`

If true, detect clock rollback (persisted lastSeenTimestamp is in the future relative to now) and deny access.

___

### gracePeriodMs

• `Optional` **gracePeriodMs**: `number`

Grace period in milliseconds after a subscription's expiryDate during which it's still considered owned. Defaults to 30 days.

___

### onExpiredOffline

• `Optional` **onExpiredOffline**: ``"deny"`` \| ``"readonly"``

Behavior when the grace period has elapsed and the device is still offline. `'readonly'` keeps granting access; `'deny'` revokes it. Defaults to `'readonly'`.

___

### storage

• `Optional` **storage**: [`OfflineStorageAdapter`](CdvPurchase.OfflineStorageAdapter.md)

Storage adapter. Defaults to a `localStorage` wrapper.
