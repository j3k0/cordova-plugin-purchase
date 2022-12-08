# Interface: ApiValidatorBodyTransactionWindows

[Validator](../modules/CdvPurchase.Validator.md).[Request](../modules/CdvPurchase.Validator.Request.md).ApiValidatorBodyTransactionWindows

Native Microsoft Windows transaction

<h4>Note about Microsoft validation request</h4>

Validation for microsoft can respond with specific fields set:

- `data.serviceTicketType` – with value “purchase” or “collections”
- `data.serviceTicket` – an authentication ticket

The value of this ticket is used to retrieve the storeId required in the validation request.

The process is to make a first request without the `storeId`, then use the `serviceTicket` in the
response to fetch it and repeat the validation request to finalize the validation process.

Contact us if you need assistance with this integration.

## Table of contents

### Properties

- [skuId](CdvPurchase.Validator.Request.ApiValidatorBodyTransactionWindows.md#skuid)
- [storeId](CdvPurchase.Validator.Request.ApiValidatorBodyTransactionWindows.md#storeid)
- [type](CdvPurchase.Validator.Request.ApiValidatorBodyTransactionWindows.md#type)

## Properties

### skuId

• **skuId**: `string`

The Store ID for a product's SKU in the Microsoft Store catalog.

An example Store ID for a SKU is "0010.

___

### storeId

• **storeId**: `string`

The Store ID for a product in the Microsoft Store catalog.

An example Store ID for a product is "9NBLGGH42CFD".

___

### type

• **type**: [`WINDOWS_STORE`](../enums/CdvPurchase.Platform.md#windows_store)

Value `"windows-store-transaction"`
