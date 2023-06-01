# Namespace: Ajax

[CdvPurchase](CdvPurchase.md).[Utils](CdvPurchase.Utils.md).Ajax

## Table of contents

### Interfaces

- [Options](../interfaces/CdvPurchase.Utils.Ajax.Options.md)

### Type Aliases

- [ErrorCallback](CdvPurchase.Utils.Ajax.md#errorcallback)
- [SuccessCallback](CdvPurchase.Utils.Ajax.md#successcallback)

### Variables

- [HTTP\_REQUEST\_TIMEOUT](CdvPurchase.Utils.Ajax.md#http_request_timeout)

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

## Variables

### HTTP\_REQUEST\_TIMEOUT

• `Const` **HTTP\_REQUEST\_TIMEOUT**: ``408``

HTTP status returned when a request times out
