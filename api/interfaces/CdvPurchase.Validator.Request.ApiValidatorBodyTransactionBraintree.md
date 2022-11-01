# Interface: ApiValidatorBodyTransactionBraintree

[Validator](../modules/CdvPurchase.Validator.md).[Request](../modules/CdvPurchase.Validator.Request.md).ApiValidatorBodyTransactionBraintree

Transaction type from Braintree

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
