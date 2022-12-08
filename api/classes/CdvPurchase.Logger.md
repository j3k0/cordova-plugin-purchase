# Class: Logger

[CdvPurchase](../modules/CdvPurchase.md).Logger

## Table of contents

### Properties

- [console](CdvPurchase.Logger.md#console)

### Methods

- [child](CdvPurchase.Logger.md#child)
- [debug](CdvPurchase.Logger.md#debug)
- [error](CdvPurchase.Logger.md#error)
- [info](CdvPurchase.Logger.md#info)
- [logCallbackException](CdvPurchase.Logger.md#logcallbackexception)
- [warn](CdvPurchase.Logger.md#warn)

## Properties

### console

▪ `Static` **console**: [`Console`](../interfaces/CdvPurchase.Console.md) = `window.console`

Console object used to display log lines.

It can be replaced by your implementation if you want to, for example, send logs to a remote server.

**`Example`**

```ts
Logger.console = {
  log: (message) => { remoteLog('LOG', message); }
  warn: (message) => { remoteLog('WARN', message); }
  error: (message) => { remoteLog('ERROR', message); }
}
```

## Methods

### child

▸ **child**(`prefix`): [`Logger`](CdvPurchase.Logger.md)

Create a child logger, whose prefix will be this one's + the given string.

**`Example`**

```ts
const log = store.log.child('AppStore')
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `prefix` | `string` |

#### Returns

[`Logger`](CdvPurchase.Logger.md)

___

### debug

▸ **debug**(`o`): `void`

Logs a debug message, only if `store.verbosity` >= store.DEBUG

#### Parameters

| Name | Type |
| :------ | :------ |
| `o` | `any` |

#### Returns

`void`

___

### error

▸ **error**(`o`): `void`

Logs an error message, only if `store.verbosity` >= store.ERROR

#### Parameters

| Name | Type |
| :------ | :------ |
| `o` | `any` |

#### Returns

`void`

___

### info

▸ **info**(`o`): `void`

Logs an info message, only if `store.verbosity` >= store.INFO

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

Logs a warning message, only if `store.verbosity` >= store.WARNING

#### Parameters

| Name | Type |
| :------ | :------ |
| `o` | `any` |

#### Returns

`void`
