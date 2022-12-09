# Interface: ShippingMethod

[CdvPurchase](../modules/CdvPurchase.md).[ApplePay](../modules/CdvPurchase.ApplePay.md).ShippingMethod

Shipping method for delivering physical goods.

## Hierarchy

- [`PaymentSummaryItem`](CdvPurchase.ApplePay.PaymentSummaryItem.md)

  ↳ **`ShippingMethod`**

## Table of contents

### Properties

- [amount](CdvPurchase.ApplePay.ShippingMethod.md#amount)
- [detail](CdvPurchase.ApplePay.ShippingMethod.md#detail)
- [identifier](CdvPurchase.ApplePay.ShippingMethod.md#identifier)
- [label](CdvPurchase.ApplePay.ShippingMethod.md#label)
- [type](CdvPurchase.ApplePay.ShippingMethod.md#type)

## Properties

### amount

• **amount**: `string`

Summary item’s amount.

The amount’s currency is specified at the payment level by setting a
value for the currencyCode property on the request.

#### Inherited from

[PaymentSummaryItem](CdvPurchase.ApplePay.PaymentSummaryItem.md).[amount](CdvPurchase.ApplePay.PaymentSummaryItem.md#amount)

___

### detail

• `Optional` **detail**: `string`

A user - readable description of the shipping method.

___

### identifier

• `Optional` **identifier**: `string`

A unique identifier for the shipping method, used by the app.

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
