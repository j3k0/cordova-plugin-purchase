# Interface: PaymentMethod

[CdvPurchase](../modules/CdvPurchase.md).[ApplePay](../modules/CdvPurchase.ApplePay.md).PaymentMethod

## Table of contents

### Properties

- [billingAddress](CdvPurchase.ApplePay.PaymentMethod.md#billingaddress)
- [displayName](CdvPurchase.ApplePay.PaymentMethod.md#displayname)
- [network](CdvPurchase.ApplePay.PaymentMethod.md#network)
- [secureElementPass](CdvPurchase.ApplePay.PaymentMethod.md#secureelementpass)
- [type](CdvPurchase.ApplePay.PaymentMethod.md#type)

## Properties

### billingAddress

• `Optional` **billingAddress**: [`CNContact`](CdvPurchase.ApplePay.CNContact.md)

___

### displayName

• **displayName**: `string`

A string, suitable for display, that describes the card.

### Discussion

The display name enables a user to recognize a particular card from a list of cards.

For debit and credit cards, the display name often includes the card brand and the
last four digits of the credit card number when available, for example: “Visa 1233”,
“MasterCard 5678”, “AmEx 9876”. For Apple Pay Cash cards, the display name is “Apple Pay Cash”.
However, there is no standard format for the display name’s content.

To protect the user’s privacy, Apple Pay sets the display name only after the user
authorizes the purchase. You can safely access this property as soon as the system calls
your delegate’s paymentAuthorizationController:didAuthorizePayment:completion: method.

___

### network

• **network**: `string`

A string, suitable for display, that describes the payment network for the card.

**`See`**

[https://developer.apple.com/documentation/passkit/pkpaymentnetwork?language=objc](https://developer.apple.com/documentation/passkit/pkpaymentnetwork?language=objc)

___

### secureElementPass

• `Optional` **secureElementPass**: [`SecureElementPass`](CdvPurchase.ApplePay.SecureElementPass.md)

The accompanying Secure Element pass.

### Discussion

If your app has an association with the pass that is funding the payment, this property contains
information about that pass; otherwise, it’s undefined.

Use this property to detect your brand of credit and debit cards.
For example, you can provide a discount if the user pays using your store-branded credit card.

### Note

To be able to access the pass, the issuer must add your App ID to the pass when it provisions it.
To add your App ID to these passes, contact the bank that issues your cards or the person who
manages your cobrand program.

___

### type

• **type**: [`PaymentMethodType`](../modules/CdvPurchase.ApplePay.md#paymentmethodtype)

A value that represents the card’s type.
