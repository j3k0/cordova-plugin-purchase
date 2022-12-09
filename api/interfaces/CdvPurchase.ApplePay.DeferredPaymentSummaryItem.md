# Interface: DeferredPaymentSummaryItem

[CdvPurchase](../modules/CdvPurchase.md).[ApplePay](../modules/CdvPurchase.ApplePay.md).DeferredPaymentSummaryItem

An object that defines a summary item for a payment that’s charged at a later date, such as a pre-order.

## Hierarchy

- [`PaymentSummaryItem`](CdvPurchase.ApplePay.PaymentSummaryItem.md)

  ↳ **`DeferredPaymentSummaryItem`**

## Table of contents

### Properties

- [amount](CdvPurchase.ApplePay.DeferredPaymentSummaryItem.md#amount)
- [deferredDate](CdvPurchase.ApplePay.DeferredPaymentSummaryItem.md#deferreddate)
- [label](CdvPurchase.ApplePay.DeferredPaymentSummaryItem.md#label)
- [type](CdvPurchase.ApplePay.DeferredPaymentSummaryItem.md#type)

## Properties

### amount

• **amount**: `string`

Summary item’s amount.

The amount’s currency is specified at the payment level by setting a
value for the currencyCode property on the request.

#### Inherited from

[PaymentSummaryItem](CdvPurchase.ApplePay.PaymentSummaryItem.md).[amount](CdvPurchase.ApplePay.PaymentSummaryItem.md#amount)

___

### deferredDate

• `Optional` **deferredDate**: `number`

The date, in the future, of the payment.

In milliseconds since epoch.

___

### label

• **label**: `string`

Short, localized description of the item.

#### Inherited from

[PaymentSummaryItem](CdvPurchase.ApplePay.PaymentSummaryItem.md).[label](CdvPurchase.ApplePay.PaymentSummaryItem.md#label)

___

### type

• `Optional` **type**: [`SummaryItemType`](../modules/CdvPurchase.ApplePay.md#summaryitemtype)

Type that indicates whether the amount is final.

#### Inherited from

[PaymentSummaryItem](CdvPurchase.ApplePay.PaymentSummaryItem.md).[type](CdvPurchase.ApplePay.PaymentSummaryItem.md#type)
