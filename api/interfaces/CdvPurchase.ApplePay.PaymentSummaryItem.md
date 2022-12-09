# Interface: PaymentSummaryItem

[CdvPurchase](../modules/CdvPurchase.md).[ApplePay](../modules/CdvPurchase.ApplePay.md).PaymentSummaryItem

Summary item in a payment request—for example, total, tax, discount, or grand total.

**`See`**

[https://developer.apple.com/documentation/passkit/pkpaymentrequest/1619231-paymentsummaryitems](https://developer.apple.com/documentation/passkit/pkpaymentrequest/1619231-paymentsummaryitems)

## Hierarchy

- **`PaymentSummaryItem`**

  ↳ [`DeferredPaymentSummaryItem`](CdvPurchase.ApplePay.DeferredPaymentSummaryItem.md)

  ↳ [`RecurringPaymentSummaryItem`](CdvPurchase.ApplePay.RecurringPaymentSummaryItem.md)

  ↳ [`ShippingMethod`](CdvPurchase.ApplePay.ShippingMethod.md)

## Table of contents

### Properties

- [amount](CdvPurchase.ApplePay.PaymentSummaryItem.md#amount)
- [label](CdvPurchase.ApplePay.PaymentSummaryItem.md#label)
- [type](CdvPurchase.ApplePay.PaymentSummaryItem.md#type)

## Properties

### amount

• **amount**: `string`

Summary item’s amount.

The amount’s currency is specified at the payment level by setting a
value for the currencyCode property on the request.

___

### label

• **label**: `string`

Short, localized description of the item.

___

### type

• `Optional` **type**: [`SummaryItemType`](../modules/CdvPurchase.ApplePay.md#summaryitemtype)

Type that indicates whether the amount is final.
