# Interface: PaymentRequestItem

[CdvPurchase](../modules/CdvPurchase.md).PaymentRequestItem

Item being purchased with `requestPayment`

The format is such as it's compatible with `Product`. This way, normal products can be added to
the payment request.

## Table of contents

### Properties

- [id](CdvPurchase.PaymentRequestItem.md#id)
- [pricing](CdvPurchase.PaymentRequestItem.md#pricing)
- [title](CdvPurchase.PaymentRequestItem.md#title)

## Properties

### id

• **id**: `string`

Identifier

___

### pricing

• `Optional` **pricing**: `Object`

Item pricing information.

It can be undefined if a single product is purchased. If that case, it's assumed the price
is equal to the total amount requested.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `currency?` | `string` | Currency, for verification, if set it should be equal to the PaymentRequest currency |
| `priceMicros` | `number` | Price in micro units (i.e. price * 1,000,000) |

___

### title

• **title**: `string`

Label for the item
