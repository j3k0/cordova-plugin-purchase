# Class: ReadyCallbacks

[CdvPurchase](../modules/CdvPurchase.md).ReadyCallbacks

Ready callbacks

## Constructors

### constructor

• **new ReadyCallbacks**()

## Properties

### isReady

• **isReady**: `boolean` = `false`

True when the plugin is ready

___

### readyCallbacks

• **readyCallbacks**: [`Callback`](../modules/CdvPurchase.md#callback)<`void`\>[] = `[]`

Callbacks when the store is ready

## Methods

### add

▸ **add**(`cb`): `unknown`

Register a callback to be called when the plugin is ready.

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | [`Callback`](../modules/CdvPurchase.md#callback)<`void`\> |

#### Returns

`unknown`

___

### trigger

▸ **trigger**(): `void`

Calls the ready callbacks

#### Returns

`void`
