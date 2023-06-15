# Interface: When

[CdvPurchase](../modules/CdvPurchase.md).When

Store events listener

## Table of contents

### Methods

- [approved](CdvPurchase.When.md#approved)
- [finished](CdvPurchase.When.md#finished)
- [pending](CdvPurchase.When.md#pending)
- [productUpdated](CdvPurchase.When.md#productupdated)
- [receiptUpdated](CdvPurchase.When.md#receiptupdated)
- [receiptsReady](CdvPurchase.When.md#receiptsready)
- [receiptsVerified](CdvPurchase.When.md#receiptsverified)
- [unverified](CdvPurchase.When.md#unverified)
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

### pending

▸ **pending**(`cb`): [`When`](CdvPurchase.When.md)

Register a function called when transaction is pending.

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

### receiptsReady

▸ **receiptsReady**(`cb`): [`When`](CdvPurchase.When.md)

Register a function called when all receipts have been loaded.

This handler is called only once. Use this when you want to run some code at startup after
all the local receipts have been loaded, for example to process the initial ownership status
of your products. When you have a receipt validation server in place, a better option is to
use the sister method "receiptsVerified".

If no platforms have any receipts (the user made no purchase), this will also get called.

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | [`Callback`](../modules/CdvPurchase.md#callback)<`void`\> |

#### Returns

[`When`](CdvPurchase.When.md)

___

### receiptsVerified

▸ **receiptsVerified**(`cb`): [`When`](CdvPurchase.When.md)

Register a function called when all receipts have been verified.

If no platforms have any receipts (user made no purchase), this will also get called.

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | [`Callback`](../modules/CdvPurchase.md#callback)<`void`\> |

#### Returns

[`When`](CdvPurchase.When.md)

___

### unverified

▸ **unverified**(`cb`): [`When`](CdvPurchase.When.md)

Register a function called when a receipt failed validation.

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | [`Callback`](../modules/CdvPurchase.md#callback)<[`UnverifiedReceipt`](CdvPurchase.UnverifiedReceipt.md)\> |

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
