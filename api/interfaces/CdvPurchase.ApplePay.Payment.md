# Interface: Payment

[CdvPurchase](../modules/CdvPurchase.md).[ApplePay](../modules/CdvPurchase.ApplePay.md).Payment

Represents the result of authorizing a payment request and contains payment information, encrypted in the payment token.

**`See`**

[https://developer.apple.com/documentation/passkit/pkpayment?language=objc](https://developer.apple.com/documentation/passkit/pkpayment?language=objc)

## Table of contents

### Properties

- [billingContact](CdvPurchase.ApplePay.Payment.md#billingcontact)
- [shippingContact](CdvPurchase.ApplePay.Payment.md#shippingcontact)
- [shippingMethod](CdvPurchase.ApplePay.Payment.md#shippingmethod)
- [token](CdvPurchase.ApplePay.Payment.md#token)

## Properties

### billingContact

• `Optional` **billingContact**: [`Contact`](CdvPurchase.ApplePay.Contact.md)

The user-selected billing address for this transaction.

___

### shippingContact

• `Optional` **shippingContact**: [`Contact`](CdvPurchase.ApplePay.Contact.md)

The user-selected shipping address for this transaction.

___

### shippingMethod

• `Optional` **shippingMethod**: [`ShippingMethod`](CdvPurchase.ApplePay.ShippingMethod.md)

The user-selected shipping method for this transaction.

A value is set for this property only if the corresponding payment request specified available
shipping methods in the shippingMethods property of the PaymentRequest object.
Otherwise, the value is undefined.

___

### token

• **token**: [`PaymentToken`](CdvPurchase.ApplePay.PaymentToken.md)

The encrypted payment information.

**`See`**

doc://com.apple.documentation/documentation/passkit/apple_pay/payment_token_format_reference?language=swift
