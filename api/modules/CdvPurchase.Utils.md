# Namespace: Utils

[CdvPurchase](CdvPurchase.md).Utils

## Namespaces

- [Ajax](CdvPurchase.Utils.Ajax.md)

## Functions

### ajax

▸ **ajax**<`T`\>(`log`, `options`): `Object`

Simplified version of jQuery's ajax method based on XMLHttpRequest.

Uses cordova's http plugin when installed.

Only supports JSON requests.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `log` | [`Logger`](../classes/CdvPurchase.Logger.md) |
| `options` | [`Options`](../interfaces/CdvPurchase.Utils.Ajax.Options.md)<`T`\> |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `done` | (`cb`: () => `void`) => `void` |

___

### callExternal

▸ **callExternal**<`F`\>(`log`, `name`, `callback`, ...`args`): `void`

Calls an user-registered callback.

Won't throw exceptions, only logs errors.

**`Example`**

```js
Utils.callExternal(store.log, "ajax.error", options.error, 404, "Not found");
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `F` | extends `Function` = `Function` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `log` | [`Logger`](../classes/CdvPurchase.Logger.md) | - |
| `name` | `string` | a short string describing the callback |
| `callback` | `undefined` \| `F` | the callback to call (won't fail if undefined) |
| `...args` | `any` | - |

#### Returns

`void`

___

### debounce

▸ **debounce**(`fn`, `wait`): () => `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | () => `void` |
| `wait` | `number` |

#### Returns

`fn`

▸ (): `void`

##### Returns

`void`

___

### delay

▸ **delay**(`fn`, `wait`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | () => `void` |
| `wait` | `number` |

#### Returns

`number`

___

### md5

▸ **md5**(`str`): `string`

Returns the MD5 hash-value of the passed string.

Based on the work of Jeff Mott, who did a pure JS implementation of the MD5 algorithm that was published by Ronald L. Rivest in 1991.
Code was imported from https://github.com/pvorb/node-md5

I cleaned up the all-including minified version of it.

#### Parameters

| Name | Type |
| :------ | :------ |
| `str` | `string` |

#### Returns

`string`

___

### nonEnumerable

▸ **nonEnumerable**(`target`, `name`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `any` |
| `name` | `string` |

#### Returns

`void`

▸ **nonEnumerable**(`target`, `name`, `desc`): `PropertyDescriptor`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `any` |
| `name` | `string` |
| `desc` | `PropertyDescriptor` |

#### Returns

`PropertyDescriptor`

___

### uuidv4

▸ **uuidv4**(): `string`

Returns an UUID v4. Uses `window.crypto` internally to generate random values.

#### Returns

`string`
