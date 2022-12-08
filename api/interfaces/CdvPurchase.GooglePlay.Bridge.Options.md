# Interface: Options

[GooglePlay](../modules/CdvPurchase.GooglePlay.md).[Bridge](../modules/CdvPurchase.GooglePlay.Bridge.md).Options

## Table of contents

### Properties

- [log](CdvPurchase.GooglePlay.Bridge.Options.md#log)
- [onPriceChangeConfirmationResult](CdvPurchase.GooglePlay.Bridge.Options.md#onpricechangeconfirmationresult)
- [onPurchaseConsumed](CdvPurchase.GooglePlay.Bridge.Options.md#onpurchaseconsumed)
- [onPurchasesUpdated](CdvPurchase.GooglePlay.Bridge.Options.md#onpurchasesupdated)
- [onSetPurchases](CdvPurchase.GooglePlay.Bridge.Options.md#onsetpurchases)
- [showLog](CdvPurchase.GooglePlay.Bridge.Options.md#showlog)

## Properties

### log

• `Optional` **log**: (`msg`: `string`) => `void`

#### Type declaration

▸ (`msg`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | `string` |

##### Returns

`void`

___

### onPriceChangeConfirmationResult

• `Optional` **onPriceChangeConfirmationResult**: (`result`: ``"OK"`` \| ``"UserCanceled"`` \| ``"UnknownProduct"``) => `void`

#### Type declaration

▸ (`result`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `result` | ``"OK"`` \| ``"UserCanceled"`` \| ``"UnknownProduct"`` |

##### Returns

`void`

___

### onPurchaseConsumed

• `Optional` **onPurchaseConsumed**: (`purchase`: [`Purchase`](CdvPurchase.GooglePlay.Bridge.Purchase.md)) => `void`

#### Type declaration

▸ (`purchase`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `purchase` | [`Purchase`](CdvPurchase.GooglePlay.Bridge.Purchase.md) |

##### Returns

`void`

___

### onPurchasesUpdated

• `Optional` **onPurchasesUpdated**: (`purchases`: [`Purchase`](CdvPurchase.GooglePlay.Bridge.Purchase.md)[]) => `void`

#### Type declaration

▸ (`purchases`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `purchases` | [`Purchase`](CdvPurchase.GooglePlay.Bridge.Purchase.md)[] |

##### Returns

`void`

___

### onSetPurchases

• `Optional` **onSetPurchases**: (`purchases`: [`Purchase`](CdvPurchase.GooglePlay.Bridge.Purchase.md)[]) => `void`

#### Type declaration

▸ (`purchases`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `purchases` | [`Purchase`](CdvPurchase.GooglePlay.Bridge.Purchase.md)[] |

##### Returns

`void`

___

### showLog

• `Optional` **showLog**: `boolean`
