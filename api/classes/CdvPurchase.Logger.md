# Class: Logger

[CdvPurchase](../modules/CdvPurchase.md).Logger

## Constructors

### constructor

• **new Logger**(`store`, `prefix?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `store` | [`VerbosityProvider`](../interfaces/CdvPurchase.VerbosityProvider.md) | `undefined` |
| `prefix` | `string` | `''` |

## Methods

### child

▸ **child**(`prefix`): [`Logger`](CdvPurchase.Logger.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `prefix` | `string` |

#### Returns

[`Logger`](CdvPurchase.Logger.md)

___

### debug

▸ **debug**(`o`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `o` | `any` |

#### Returns

`void`

___

### error

▸ **error**(`o`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `o` | `any` |

#### Returns

`void`

___

### info

▸ **info**(`o`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `o` | `any` |

#### Returns

`void`

___

### logCallbackException

▸ **logCallbackException**(`context`, `err`): `void`

Add warning logs on a console describing an exceptions.

This method is mostly used when executing user registered callbacks.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | `string` | a string describing why the method was called |
| `err` | `string` \| `Error` | - |

#### Returns

`void`

___

### warn

▸ **warn**(`o`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `o` | `any` |

#### Returns

`void`
