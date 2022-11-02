# Interface: ApiValidatorBodyTransactionBraintree

[Validator](../modules/CdvPurchase.Validator.md).[Request](../modules/CdvPurchase.Validator.Request.md).ApiValidatorBodyTransactionBraintree

Transaction type from Braintree

## Table of contents

### Properties

- [deviceData](CdvPurchase.Validator.Request.ApiValidatorBodyTransactionBraintree.md#devicedata)
- [id](CdvPurchase.Validator.Request.ApiValidatorBodyTransactionBraintree.md#id)
- [paymentDescription](CdvPurchase.Validator.Request.ApiValidatorBodyTransactionBraintree.md#paymentdescription)
- [paymentMethodNonce](CdvPurchase.Validator.Request.ApiValidatorBodyTransactionBraintree.md#paymentmethodnonce)
- [paymentMethodType](CdvPurchase.Validator.Request.ApiValidatorBodyTransactionBraintree.md#paymentmethodtype)
- [type](CdvPurchase.Validator.Request.ApiValidatorBodyTransactionBraintree.md#type)

## Properties

### deviceData

• **deviceData**: `any`

Data collected on the device

___

### id

• **id**: `string`

No need for an id, just set to a non-empty string

___

### paymentDescription

• `Optional` **paymentDescription**: `string`

Description of the payment method (only used for information)

___

### paymentMethodNonce

• **paymentMethodNonce**: `string`

Payment method nonce

___

### paymentMethodType

• `Optional` **paymentMethodType**: `string`

Type of payment method (only used for information)

___

### type

• **type**: [`BRAINTREE`](../enums/CdvPurchase.Platform.md#braintree)

Value `"braintree"`
