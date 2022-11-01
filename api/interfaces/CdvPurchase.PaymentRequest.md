# Interface: PaymentRequest

[CdvPurchase](../modules/CdvPurchase.md).PaymentRequest

Request for payment.

## Properties

### amountMicros

• **amountMicros**: `number`

Amount to pay.

___

### billingAddress

• `Optional` **billingAddress**: [`PostalAddress`](CdvPurchase.PostalAddress.md)

The billing address used for verification. Optional.

___

### currency

• `Optional` **currency**: `string`

Currency.

___

### description

• `Optional` **description**: `string`

Description for the payment.

___

### email

• `Optional` **email**: `string`

The email used for verification. Optional.

___

### mobilePhoneNumber

• `Optional` **mobilePhoneNumber**: `string`

The mobile phone number used for verification. Optional.

Only numbers. Remove dashes, parentheses and other characters.

___

### platform

• **platform**: [`Platform`](../enums/CdvPurchase.Platform.md)

Platform that will handle the payment request.

___

### productIds

• **productIds**: `string`[]

Products being purchased.

Used for your reference, does not have to be a product registered with the plugin.
