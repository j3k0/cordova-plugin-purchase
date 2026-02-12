# Interface: ApiValidatorBodyTransactionAmazon

[Validator](../modules/CdvPurchase.Validator.md).[Request](../modules/CdvPurchase.Validator.Request.md).ApiValidatorBodyTransactionAmazon

Transaction type from Amazon AppStore

## Table of contents

### Properties

- [id](CdvPurchase.Validator.Request.ApiValidatorBodyTransactionAmazon.md#id)
- [receiptId](CdvPurchase.Validator.Request.ApiValidatorBodyTransactionAmazon.md#receiptid)
- [type](CdvPurchase.Validator.Request.ApiValidatorBodyTransactionAmazon.md#type)
- [userId](CdvPurchase.Validator.Request.ApiValidatorBodyTransactionAmazon.md#userid)

## Properties

### id

• `Optional` **id**: `string`

Identifier of the transaction to evaluate.

**`Required`**

___

### receiptId

• `Optional` **receiptId**: `string`

Amazon receipt ID.

**`Required`**

___

### type

• **type**: [`AMAZON_APPSTORE`](../enums/CdvPurchase.Platform.md#amazon_appstore)

Value `"amazon-appstore"`

___

### userId

• `Optional` **userId**: `string`

Amazon user ID.

**`Optional`**
