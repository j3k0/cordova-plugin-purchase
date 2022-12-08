# Interface: When

[CdvPurchase](../modules/CdvPurchase.md).When

Store events listener

## Table of contents

### Methods

- [approved](CdvPurchase.When.md#approved)
- [finished](CdvPurchase.When.md#finished)
- [productUpdated](CdvPurchase.When.md#productupdated)
- [receiptUpdated](CdvPurchase.When.md#receiptupdated)
- [updated](CdvPurchase.When.md#updated)
- [verified](CdvPurchase.When.md#verified)

## Methods

### approved

▸ **approved**(`cb`): [`When`](CdvPurchase.When.md)

Register a function called when transaction is approved.

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | [`Callback`](../modules/CdvPurchase.md#callback)<[`Transaction`](../classes/CdvPurchase.Transaction.md)\> |

#### Returns

[`When`](CdvPurchase.When.md)

___

### finished

▸ **finished**(`cb`): [`When`](CdvPurchase.When.md)

Register a function called when a transaction is finished.

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | [`Callback`](../modules/CdvPurchase.md#callback)<[`Transaction`](../classes/CdvPurchase.Transaction.md)\> |

#### Returns

[`When`](CdvPurchase.When.md)

___

### productUpdated

▸ **productUpdated**(`cb`): [`When`](CdvPurchase.When.md)

Register a function called when a product is updated.

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | [`Callback`](../modules/CdvPurchase.md#callback)<[`Product`](../classes/CdvPurchase.Product.md)\> |

#### Returns

[`When`](CdvPurchase.When.md)

___

### receiptUpdated

▸ **receiptUpdated**(`cb`): [`When`](CdvPurchase.When.md)

Register a function called when a receipt is updated.

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | [`Callback`](../modules/CdvPurchase.md#callback)<[`Receipt`](../classes/CdvPurchase.Receipt.md)\> |

#### Returns

[`When`](CdvPurchase.When.md)

___

### updated

▸ **updated**(`cb`): [`When`](CdvPurchase.When.md)

Register a function called when a product or receipt is updated.

**`Deprecated`**

- Use `productUpdated` or `receiptUpdated`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | [`Callback`](../modules/CdvPurchase.md#callback)<[`Product`](../classes/CdvPurchase.Product.md) \| [`Receipt`](../classes/CdvPurchase.Receipt.md)\> |

#### Returns

[`When`](CdvPurchase.When.md)

___

### verified

▸ **verified**(`cb`): [`When`](CdvPurchase.When.md)

Register a function called when a receipt is verified.

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | [`Callback`](../modules/CdvPurchase.md#callback)<[`VerifiedReceipt`](../classes/CdvPurchase.VerifiedReceipt.md)\> |

#### Returns

[`When`](CdvPurchase.When.md)
