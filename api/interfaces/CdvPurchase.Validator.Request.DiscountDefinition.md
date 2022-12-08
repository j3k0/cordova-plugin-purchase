# Interface: DiscountDefinition

[Validator](../modules/CdvPurchase.Validator.md).[Request](../modules/CdvPurchase.Validator.Request.md).DiscountDefinition

Describe a discount

## Table of contents

### Properties

- [id](CdvPurchase.Validator.Request.DiscountDefinition.md#id)
- [paymentMode](CdvPurchase.Validator.Request.DiscountDefinition.md#paymentmode)
- [period](CdvPurchase.Validator.Request.DiscountDefinition.md#period)
- [periodUnit](CdvPurchase.Validator.Request.DiscountDefinition.md#periodunit)
- [price](CdvPurchase.Validator.Request.DiscountDefinition.md#price)
- [priceMicros](CdvPurchase.Validator.Request.DiscountDefinition.md#pricemicros)
- [type](CdvPurchase.Validator.Request.DiscountDefinition.md#type)

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
