# Interface: ApiValidatorBodyTransactionApple

[Validator](../modules/CdvPurchase.Validator.md).[Request](../modules/CdvPurchase.Validator.Request.md).ApiValidatorBodyTransactionApple

Transaction type from an Apple powered device

## Table of contents

### Properties

- [appStoreReceipt](CdvPurchase.Validator.Request.ApiValidatorBodyTransactionApple.md#appstorereceipt)
- [id](CdvPurchase.Validator.Request.ApiValidatorBodyTransactionApple.md#id)
- [transactionReceipt](CdvPurchase.Validator.Request.ApiValidatorBodyTransactionApple.md#transactionreceipt)
- [type](CdvPurchase.Validator.Request.ApiValidatorBodyTransactionApple.md#type)

## Properties

### appStoreReceipt

• `Optional` **appStoreReceipt**: `string`

Apple appstore receipt, base64 encoded.

**`Required`**

___

### id

• `Optional` **id**: `string`

Identifier of the transaction to evaluate, or set it to your application identifier if id has been set so.

**`Required`**

___

### transactionReceipt

• `Optional` **transactionReceipt**: `undefined`

Apple ios 6 transaction receipt.

**`Deprecated`**

Use `appStoreReceipt`

___

### type

• **type**: ``"ios-appstore"``

Value `"ios-appstore"`
