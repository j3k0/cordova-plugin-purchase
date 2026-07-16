# Interface: OfflineStorageAdapter

[CdvPurchase](../modules/CdvPurchase.md).OfflineStorageAdapter

Storage adapter for persisting offline entitlements.

## Table of contents

### Methods

- [getItem](CdvPurchase.OfflineStorageAdapter.md#getitem)
- [removeItem](CdvPurchase.OfflineStorageAdapter.md#removeitem)
- [setItem](CdvPurchase.OfflineStorageAdapter.md#setitem)

## Methods

### getItem

▸ **getItem**(`key`): `Promise`\<``null`` \| `string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`\<``null`` \| `string`\>

___

### removeItem

▸ **removeItem**(`key`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`\<`void`\>

___

### setItem

▸ **setItem**(`key`, `value`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `value` | `string` |

#### Returns

`Promise`\<`void`\>
