# Interface: ErrorPayload

[Validator](../modules/CdvPurchase.Validator.md).[Response](../modules/CdvPurchase.Validator.Response.md).ErrorPayload

Error response from the validator endpoint

## Table of contents

### Properties

- [code](CdvPurchase.Validator.Response.ErrorPayload.md#code)
- [data](CdvPurchase.Validator.Response.ErrorPayload.md#data)
- [message](CdvPurchase.Validator.Response.ErrorPayload.md#message)
- [ok](CdvPurchase.Validator.Response.ErrorPayload.md#ok)
- [status](CdvPurchase.Validator.Response.ErrorPayload.md#status)

## Properties

### code

• `Optional` **code**: [`ErrorCode`](../enums/CdvPurchase.ErrorCode.md)

An ErrorCode

___

### data

• `Optional` **data**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `latest_receipt?` | `boolean` | We validated using the latest version of the receipt, not need to refresh it. |

___

### message

• `Optional` **message**: `string`

Human readable description of the error

___

### ok

• **ok**: ``false``

Value `false` indicates that the request returned an error

___

### status

• `Optional` **status**: `number`

Error status (HTTP status)
