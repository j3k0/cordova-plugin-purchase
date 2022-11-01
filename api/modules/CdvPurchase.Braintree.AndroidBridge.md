# Namespace: AndroidBridge

[CdvPurchase](CdvPurchase.md).[Braintree](CdvPurchase.Braintree.md).AndroidBridge

## Classes

- [Bridge](../classes/CdvPurchase.Braintree.AndroidBridge.Bridge.md)

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
