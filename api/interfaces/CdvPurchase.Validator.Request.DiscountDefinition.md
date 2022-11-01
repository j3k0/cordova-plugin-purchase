# Interface: DiscountDefinition

[Validator](../modules/CdvPurchase.Validator.md).[Request](../modules/CdvPurchase.Validator.Request.md).DiscountDefinition

Describe a discount

## Properties

### id

• `Optional` **id**: `string`

Discount identifier

___

### paymentMode

• `Optional` **paymentMode**: ``"FreeTrial"``

Payment mode

___

### period

• `Optional` **period**: `number`

Number of periods

___

### periodUnit

• `Optional` **periodUnit**: [`SubscriptionPeriodUnit`](../modules/CdvPurchase.Validator.Request.md#subscriptionperiodunit)

Period unit

___

### price

• `Optional` **price**: `string`

Localized Price

___

### priceMicros

• `Optional` **priceMicros**: `number`

Price is micro units

___

### type

• `Optional` **type**: ``"Subscription"``

Discount type
