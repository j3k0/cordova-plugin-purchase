# Interface: ApiValidatorBodyTransactionAppleSK2

[Validator](../modules/CdvPurchase.Validator.md).[Request](../modules/CdvPurchase.Validator.Request.md).ApiValidatorBodyTransactionAppleSK2

Transaction type from an Apple device using StoreKit 2

## Table of contents

### Properties

- [id](CdvPurchase.Validator.Request.ApiValidatorBodyTransactionAppleSK2.md#id)
- [jwsRepresentation](CdvPurchase.Validator.Request.ApiValidatorBodyTransactionAppleSK2.md#jwsrepresentation)
- [type](CdvPurchase.Validator.Request.ApiValidatorBodyTransactionAppleSK2.md#type)

## Properties

### id

• `Optional` **id**: `string`

Product identifier (e.g. "com.example.premium"), NOT the numeric transaction ID

___

### jwsRepresentation

• **jwsRepresentation**: `string`

JWS representation of the transaction from StoreKit 2

___

### type

• **type**: ``"apple-sk2"``

Value `"apple-sk2"` — distinct from `"ios-appstore"` (SK1)
