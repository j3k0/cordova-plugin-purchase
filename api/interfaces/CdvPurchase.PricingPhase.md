# Interface: PricingPhase

[CdvPurchase](../modules/CdvPurchase.md).PricingPhase

Description of a phase for the pricing of a purchase.

**`See`**

[pricingPhases](../classes/CdvPurchase.Offer.md#pricingphases)

## Table of contents

### Properties

- [billingCycles](CdvPurchase.PricingPhase.md#billingcycles)
- [billingPeriod](CdvPurchase.PricingPhase.md#billingperiod)
- [currency](CdvPurchase.PricingPhase.md#currency)
- [paymentMode](CdvPurchase.PricingPhase.md#paymentmode)
- [price](CdvPurchase.PricingPhase.md#price)
- [priceMicros](CdvPurchase.PricingPhase.md#pricemicros)
- [recurrenceMode](CdvPurchase.PricingPhase.md#recurrencemode)

## Properties

### billingCycles

• `Optional` **billingCycles**: `number`

Number of recurrence cycles (if recurrenceMode is FINITE_RECURRING)

___

### billingPeriod

• `Optional` **billingPeriod**: `string`

ISO 8601 duration of the period (https://en.wikipedia.org/wiki/ISO_8601#Durations)

___

### currency

• `Optional` **currency**: `string`

Currency code

___

### paymentMode

• `Optional` **paymentMode**: [`PaymentMode`](../enums/CdvPurchase.PaymentMode.md)

Payment mode for the pricing phase ("PayAsYouGo", "UpFront", or "FreeTrial")

___

### price

• **price**: `string`

Price formatted for humans

___

### priceMicros

• **priceMicros**: `number`

Price in micro-units (divide by 1000000 to get numeric price)

___

### recurrenceMode

• `Optional` **recurrenceMode**: [`RecurrenceMode`](../enums/CdvPurchase.RecurrenceMode.md)

Type of recurring payment
