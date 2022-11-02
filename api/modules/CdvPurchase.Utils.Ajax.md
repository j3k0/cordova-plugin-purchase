# Namespace: Ajax

[CdvPurchase](CdvPurchase.md).[Utils](CdvPurchase.Utils.md).Ajax

## Table of contents

### Interfaces

- [Options](../interfaces/CdvPurchase.Utils.Ajax.Options.md)

### Type Aliases

- [ErrorCallback](CdvPurchase.Utils.Ajax.md#errorcallback)
- [SuccessCallback](CdvPurchase.Utils.Ajax.md#successcallback)

## Type Aliases

### ErrorCallback

Ƭ **ErrorCallback**: (`statusCode`: `number`, `statusText`: `string`, `data`: ``null`` \| `object`) => `void`

#### Type declaration

▸ (`statusCode`, `statusText`, `data`): `void`

Error callback for an ajax call

##### Parameters

| Name | Type |
| :------ | :------ |
| `statusCode` | `number` |
| `statusText` | `string` |
| `data` | ``null`` \| `object` |

##### Returns

`void`

___

### SuccessCallback

Ƭ **SuccessCallback**<`T`\>: (`body`: `T`) => `void`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

▸ (`body`): `void`

Success callback for an ajax call

##### Parameters

| Name | Type |
| :------ | :------ |
| `body` | `T` |

##### Returns

`void`
