# Interface: ValidProduct

[AppleAppStore](../modules/CdvPurchase.AppleAppStore.md).[Bridge](../modules/CdvPurchase.AppleAppStore.Bridge.md).ValidProduct

Product as loaded from AppStore

## Table of contents

### Properties

- [billingPeriod](CdvPurchase.AppleAppStore.Bridge.ValidProduct.md#billingperiod)
- [billingPeriodUnit](CdvPurchase.AppleAppStore.Bridge.ValidProduct.md#billingperiodunit)
- [countryCode](CdvPurchase.AppleAppStore.Bridge.ValidProduct.md#countrycode)
- [currency](CdvPurchase.AppleAppStore.Bridge.ValidProduct.md#currency)
- [description](CdvPurchase.AppleAppStore.Bridge.ValidProduct.md#description)
- [discounts](CdvPurchase.AppleAppStore.Bridge.ValidProduct.md#discounts)
- [group](CdvPurchase.AppleAppStore.Bridge.ValidProduct.md#group)
- [id](CdvPurchase.AppleAppStore.Bridge.ValidProduct.md#id)
- [introPrice](CdvPurchase.AppleAppStore.Bridge.ValidProduct.md#introprice)
- [introPriceMicros](CdvPurchase.AppleAppStore.Bridge.ValidProduct.md#intropricemicros)
- [introPricePaymentMode](CdvPurchase.AppleAppStore.Bridge.ValidProduct.md#intropricepaymentmode)
- [introPricePeriod](CdvPurchase.AppleAppStore.Bridge.ValidProduct.md#intropriceperiod)
- [introPricePeriodUnit](CdvPurchase.AppleAppStore.Bridge.ValidProduct.md#intropriceperiodunit)
- [price](CdvPurchase.AppleAppStore.Bridge.ValidProduct.md#price)
- [priceMicros](CdvPurchase.AppleAppStore.Bridge.ValidProduct.md#pricemicros)
- [title](CdvPurchase.AppleAppStore.Bridge.ValidProduct.md#title)

## Properties

### billingPeriod

• `Optional` **billingPeriod**: `number`

Number of period units in each billing cycle

___

### billingPeriodUnit

• `Optional` **billingPeriodUnit**: [`IPeriodUnit`](../modules/CdvPurchase.md#iperiodunit)

Unit for the billing cycle

___

### countryCode

• **countryCode**: `string`

AppStore country this product has been fetched for

___

### currency

• **currency**: `string`

Currency used by this product

___

### description

• **description**: `string`

localized description

___

### discounts

• `Optional` **discounts**: [`Discount`](CdvPurchase.AppleAppStore.Bridge.Discount.md)[]

Available discount offers

___

### group

• `Optional` **group**: `string`

Group this product is member of

___

### id

• **id**: `string`

product id

___

### introPrice

• `Optional` **introPrice**: `string`

Localized price for introductory period

___

### introPriceMicros

• `Optional` **introPriceMicros**: `number`

Introductory price in micro units

___

### introPricePaymentMode

• `Optional` **introPricePaymentMode**: [`PaymentMode`](../enums/CdvPurchase.PaymentMode.md)

Payment mode for introductory price

___

### introPricePeriod

• `Optional` **introPricePeriod**: `number`

Number of introductory price periods

___

### introPricePeriodUnit

• `Optional` **introPricePeriodUnit**: [`IPeriodUnit`](../modules/CdvPurchase.md#iperiodunit)

Duration of an introductory price period

___

### price

• **price**: `string`

localized price

___

### priceMicros

• **priceMicros**: `number`

Price in micro units

___

### title

• **title**: `string`

localized title
