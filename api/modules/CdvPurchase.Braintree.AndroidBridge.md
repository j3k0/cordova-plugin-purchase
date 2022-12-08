# Namespace: AndroidBridge

[CdvPurchase](CdvPurchase.md).[Braintree](CdvPurchase.Braintree.md).AndroidBridge

## Table of contents

### Classes

- [Bridge](../classes/CdvPurchase.Braintree.AndroidBridge.Bridge.md)

### Type Aliases

- [ClientTokenProvider](CdvPurchase.Braintree.AndroidBridge.md#clienttokenprovider)
- [Message](CdvPurchase.Braintree.AndroidBridge.md#message)

## Type Aliases

### ClientTokenProvider

Ƭ **ClientTokenProvider**: (`callback`: [`Callback`](CdvPurchase.md#callback)<`string` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>) => `void`

#### Type declaration

▸ (`callback`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | [`Callback`](CdvPurchase.md#callback)<`string` \| [`IError`](../interfaces/CdvPurchase.IError.md)\> |

##### Returns

`void`

___

### Message

Ƭ **Message**: { `type`: ``"ready"``  } \| { `type`: ``"getClientToken"``  }

Message received by the native plugin.
