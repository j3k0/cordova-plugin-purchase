# Class: OfflineEntitlements

[CdvPurchase](../modules/CdvPurchase.md).OfflineEntitlements

Persist a subset of [VerifiedPurchase](../interfaces/CdvPurchase.VerifiedPurchase.md) to device storage so that
`store.owned()` works when the device is offline or has just restarted
without connectivity.

Phase 1 — unsigned cache. No JWT, no crypto, no server changes.

**`Example`**

```typescript
const offline = new CdvPurchase.OfflineEntitlements(store, {
    gracePeriodMs: 30 * 24 * 60 * 60 * 1000, // 30 days
    onExpiredOffline: 'readonly',
    detectClockRollback: true,
});

await offline.ready();

function isUserPremium(): boolean {
    return store.owned('premium') || offline.isOwned('premium');
}
```

**Durability warning:** for long-offline deployments (weeks without
connectivity), pass a file-based or secure-storage adapter. `localStorage`
(the default) can be evicted by the WebView under storage pressure, which
would silently lose the cached entitlements.

## Table of contents

### Constructors

- [constructor](CdvPurchase.OfflineEntitlements.md#constructor)

### Methods

- [clear](CdvPurchase.OfflineEntitlements.md#clear)
- [find](CdvPurchase.OfflineEntitlements.md#find)
- [isOwned](CdvPurchase.OfflineEntitlements.md#isowned)
- [onEvent](CdvPurchase.OfflineEntitlements.md#onevent)
- [ready](CdvPurchase.OfflineEntitlements.md#ready)
- [refresh](CdvPurchase.OfflineEntitlements.md#refresh)

## Constructors

### constructor

• **new OfflineEntitlements**(`store`, `options?`): [`OfflineEntitlements`](CdvPurchase.OfflineEntitlements.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `store` | [`Store`](CdvPurchase.Store.md) |
| `options` | [`OfflineEntitlementsOptions`](../interfaces/CdvPurchase.OfflineEntitlementsOptions.md) |

#### Returns

[`OfflineEntitlements`](CdvPurchase.OfflineEntitlements.md)

## Methods

### clear

▸ **clear**(): `Promise`\<`void`\>

Remove all persisted entitlements from storage and clear the in-memory cache. For user logout.

#### Returns

`Promise`\<`void`\>

___

### find

▸ **find**(`productId`): `undefined` \| [`PersistedPurchase`](../interfaces/CdvPurchase.PersistedPurchase.md)

Retrieve the persisted entitlement for a product, analogous to
`store.findInVerifiedReceipts()`.

Returns the [PersistedPurchase](../interfaces/CdvPurchase.PersistedPurchase.md) (with `expiryDate`,
`renewalIntent`, `lastRenewalDate`, etc.) if one has been cached,
or `undefined` if no offline entitlement exists for this product.

Returns `undefined` for all products until `ready()` has resolved.

#### Parameters

| Name | Type |
| :------ | :------ |
| `productId` | `string` |

#### Returns

`undefined` \| [`PersistedPurchase`](../interfaces/CdvPurchase.PersistedPurchase.md)

**`Example`**

```typescript
const entitlement = offline.find('premium');
if (entitlement?.expiryDate) {
    const daysLeft = Math.ceil((entitlement.expiryDate - Date.now()) / 86400000);
    showRenewalBanner(daysLeft);
}
```

___

### isOwned

▸ **isOwned**(`productId`): `boolean`

Return `true` if the product is owned, using the persisted cache when
the in-memory `verifiedReceipts` don't grant ownership.

Returns `false` for all products until `ready()` has resolved.

#### Parameters

| Name | Type |
| :------ | :------ |
| `productId` | `string` |

#### Returns

`boolean`

___

### onEvent

▸ **onEvent**(`callback`): `void`

Register a callback for [OfflineEntitlementEvent](../interfaces/CdvPurchase.OfflineEntitlementEvent.md)s.

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | [`Callback`](../modules/CdvPurchase.md#callback)\<[`OfflineEntitlementEvent`](../interfaces/CdvPurchase.OfflineEntitlementEvent.md)\> |

#### Returns

`void`

___

### ready

▸ **ready**(): `Promise`\<`void`\>

Load persisted entitlements from storage into the in-memory cache. Idempotent.

#### Returns

`Promise`\<`void`\>

___

### refresh

▸ **refresh**(): `Promise`\<`void`\>

Reload from storage and re-evaluate. Resolves when the reload is complete. Call after reconnecting or manually.

#### Returns

`Promise`\<`void`\>
