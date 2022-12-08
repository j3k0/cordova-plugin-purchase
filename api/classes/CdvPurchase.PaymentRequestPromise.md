# Class: PaymentRequestPromise

[CdvPurchase](../modules/CdvPurchase.md).PaymentRequestPromise

## Table of contents

### Constructors

- [constructor](CdvPurchase.PaymentRequestPromise.md#constructor)

### Methods

- [approved](CdvPurchase.PaymentRequestPromise.md#approved)
- [cancelled](CdvPurchase.PaymentRequestPromise.md#cancelled)
- [failed](CdvPurchase.PaymentRequestPromise.md#failed)
- [finished](CdvPurchase.PaymentRequestPromise.md#finished)
- [initiated](CdvPurchase.PaymentRequestPromise.md#initiated)

## Constructors

### constructor

• **new PaymentRequestPromise**()

## Methods

### approved

▸ **approved**(`callback`): [`PaymentRequestPromise`](CdvPurchase.PaymentRequestPromise.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | [`Callback`](../modules/CdvPurchase.md#callback)<[`Transaction`](CdvPurchase.Transaction.md)\> |

#### Returns

[`PaymentRequestPromise`](CdvPurchase.PaymentRequestPromise.md)

___

### cancelled

▸ **cancelled**(`callback`): [`PaymentRequestPromise`](CdvPurchase.PaymentRequestPromise.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | [`Callback`](../modules/CdvPurchase.md#callback)<`void`\> |

#### Returns

[`PaymentRequestPromise`](CdvPurchase.PaymentRequestPromise.md)

___

### failed

▸ **failed**(`callback`): [`PaymentRequestPromise`](CdvPurchase.PaymentRequestPromise.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | [`Callback`](../modules/CdvPurchase.md#callback)<[`IError`](../interfaces/CdvPurchase.IError.md)\> |

#### Returns

[`PaymentRequestPromise`](CdvPurchase.PaymentRequestPromise.md)

___

### finished

▸ **finished**(`callback`): [`PaymentRequestPromise`](CdvPurchase.PaymentRequestPromise.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | [`Callback`](../modules/CdvPurchase.md#callback)<[`Transaction`](CdvPurchase.Transaction.md)\> |

#### Returns

[`PaymentRequestPromise`](CdvPurchase.PaymentRequestPromise.md)

___

### initiated

▸ **initiated**(`callback`): [`PaymentRequestPromise`](CdvPurchase.PaymentRequestPromise.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | [`Callback`](../modules/CdvPurchase.md#callback)<[`Transaction`](CdvPurchase.Transaction.md)\> |

#### Returns

[`PaymentRequestPromise`](CdvPurchase.PaymentRequestPromise.md)
