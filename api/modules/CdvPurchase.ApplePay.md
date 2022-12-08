# Namespace: ApplePay

[CdvPurchase](CdvPurchase.md).ApplePay

Define types for ApplePay

At the moment Apple Pay is only supported as an extension for Braintree.

## Table of contents

### Enumerations

- [ContactField](../enums/CdvPurchase.ApplePay.ContactField.md)
- [MerchantCapability](../enums/CdvPurchase.ApplePay.MerchantCapability.md)
- [PaymentNetwork](../enums/CdvPurchase.ApplePay.PaymentNetwork.md)

### Interfaces

- [CNContact](../interfaces/CdvPurchase.ApplePay.CNContact.md)
- [Contact](../interfaces/CdvPurchase.ApplePay.Contact.md)
- [DeferredPaymentSummaryItem](../interfaces/CdvPurchase.ApplePay.DeferredPaymentSummaryItem.md)
- [Payment](../interfaces/CdvPurchase.ApplePay.Payment.md)
- [PaymentMethod](../interfaces/CdvPurchase.ApplePay.PaymentMethod.md)
- [PaymentRequest](../interfaces/CdvPurchase.ApplePay.PaymentRequest.md)
- [PaymentSummaryItem](../interfaces/CdvPurchase.ApplePay.PaymentSummaryItem.md)
- [PaymentToken](../interfaces/CdvPurchase.ApplePay.PaymentToken.md)
- [PostalAddress](../interfaces/CdvPurchase.ApplePay.PostalAddress.md)
- [RecurringPaymentSummaryItem](../interfaces/CdvPurchase.ApplePay.RecurringPaymentSummaryItem.md)
- [SecureElementPass](../interfaces/CdvPurchase.ApplePay.SecureElementPass.md)
- [ShippingMethod](../interfaces/CdvPurchase.ApplePay.ShippingMethod.md)

### Type Aliases

- [PaymentMethodType](CdvPurchase.ApplePay.md#paymentmethodtype)
- [SummaryItemType](CdvPurchase.ApplePay.md#summaryitemtype)

## Type Aliases

### PaymentMethodType

Ƭ **PaymentMethodType**: ``"Unknown"`` \| ``"Debit"`` \| ``"Credit"`` \| ``"Prepaid"`` \| ``"Store"`` \| ``"EMoney"``

**`See`**

[https://developer.apple.com/documentation/passkit/pkpaymentmethodtype?language=objc](https://developer.apple.com/documentation/passkit/pkpaymentmethodtype?language=objc)

___

### SummaryItemType

Ƭ **SummaryItemType**: ``"final"`` \| ``"pending"``
