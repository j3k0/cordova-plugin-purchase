# Interface: RecurringPaymentSummaryItem

[CdvPurchase](../modules/CdvPurchase.md).[ApplePay](../modules/CdvPurchase.ApplePay.md).RecurringPaymentSummaryItem

An object that defines a summary item for a payment that occurs repeatedly at a specified interval, such as a subscription.

RecurringPaymentSummaryItem is a subclass of PaymentSummaryItemType and inherits all properties of the parent class.

Add a summary item of this type to the paymentSummaryItems property of a PaymentRequest to display to the user a recurring payment in the summary items on the payment sheet.

To describe a recurring payment, set the summary item values as follows:
- In the amount property, provide the billing amount for the set interval, for example, the amount charged per week if the intervalUnit is a week.
- Omit the type property. The summary item type is only relevant for the PKPaymentSummaryItem parent class.
- Set the startDate and endDate to represent the term for the recurring payments, as appropriate.
- Set the intervalUnit, intervalCount, and endDate to specify a number of repeating payments.

## Hierarchy

- [`PaymentSummaryItem`](CdvPurchase.ApplePay.PaymentSummaryItem.md)

  ↳ **`RecurringPaymentSummaryItem`**

## Table of contents

### Properties

- [amount](CdvPurchase.ApplePay.RecurringPaymentSummaryItem.md#amount)
- [endDate](CdvPurchase.ApplePay.RecurringPaymentSummaryItem.md#enddate)
- [intervalCount](CdvPurchase.ApplePay.RecurringPaymentSummaryItem.md#intervalcount)
- [intervalUnit](CdvPurchase.ApplePay.RecurringPaymentSummaryItem.md#intervalunit)
- [label](CdvPurchase.ApplePay.RecurringPaymentSummaryItem.md#label)
- [startDate](CdvPurchase.ApplePay.RecurringPaymentSummaryItem.md#startdate)
- [type](CdvPurchase.ApplePay.RecurringPaymentSummaryItem.md#type)

## Properties

### amount

• **amount**: `string`

Summary item’s amount.

The amount’s currency is specified at the payment level by setting a
value for the currencyCode property on the request.

#### Inherited from

[PaymentSummaryItem](CdvPurchase.ApplePay.PaymentSummaryItem.md).[amount](CdvPurchase.ApplePay.PaymentSummaryItem.md#amount)

___

### endDate

• `Optional` **endDate**: `number`

The date of the final payment. The default value is nil which specifies no end date.

In milliseconds since epoch.

___

### intervalCount

• **intervalCount**: `number`

The number of interval units that make up the total payment interval.

___

### intervalUnit

• **intervalUnit**: [`IPeriodUnit`](../modules/CdvPurchase.md#iperiodunit)

The amount of time – in calendar units such as day, month, or year – that represents a fraction of the total payment interval.

Note. "Week" is not supported.

___

### label

• **label**: `string`

Short, localized description of the item.

#### Inherited from

[PaymentSummaryItem](CdvPurchase.ApplePay.PaymentSummaryItem.md).[label](CdvPurchase.ApplePay.PaymentSummaryItem.md#label)

___

### startDate

• `Optional` **startDate**: `number`

The date of the first payment. The default value is undefined which requests the first payment as part of the initial transaction.

In milliseconds since epoch.

___

### type

• `Optional` **type**: [`SummaryItemType`](../modules/CdvPurchase.ApplePay.md#summaryitemtype)

Type that indicates whether the amount is final.

#### Inherited from

[PaymentSummaryItem](CdvPurchase.ApplePay.PaymentSummaryItem.md).[type](CdvPurchase.ApplePay.PaymentSummaryItem.md#type)
