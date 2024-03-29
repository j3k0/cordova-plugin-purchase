# Interface: IError

[CdvPurchase](../modules/CdvPurchase.md).IError

An error triggered by the In-App Purchase plugin

## Table of contents

### Properties

- [code](CdvPurchase.IError.md#code)
- [isError](CdvPurchase.IError.md#iserror)
- [message](CdvPurchase.IError.md#message)
- [platform](CdvPurchase.IError.md#platform)
- [productId](CdvPurchase.IError.md#productid)

## Properties

### code

• **code**: [`ErrorCode`](../enums/CdvPurchase.ErrorCode.md)

See store.ERR_* for the available codes.

https://github.com/j3k0/cordova-plugin-purchase/blob/master/doc/api.md#error-codes

___

### isError

• **isError**: ``true``

Indicates that the returned object is an error

___

### message

• **message**: `string`

Human readable message, in plain english

___

### platform

• **platform**: ``null`` \| [`Platform`](../enums/CdvPurchase.Platform.md)

Optional platform the error occured on

___

### productId

• **productId**: ``null`` \| `string`

Optional ID of the product the error occurred on
