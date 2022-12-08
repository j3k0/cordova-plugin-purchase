# Enumeration: AppleExpirationIntent

[AppleAppStore](../modules/CdvPurchase.AppleAppStore.md).[VerifyReceipt](../modules/CdvPurchase.AppleAppStore.VerifyReceipt.md).AppleExpirationIntent

The reason a subscription expired.
https://developer.apple.com/documentation/appstorereceipts/expiration_intent

## Table of contents

### Enumeration Members

- [BILLING\_ERROR](CdvPurchase.AppleAppStore.VerifyReceipt.AppleExpirationIntent.md#billing_error)
- [CANCELED](CdvPurchase.AppleAppStore.VerifyReceipt.AppleExpirationIntent.md#canceled)
- [PRICE\_INCREASE](CdvPurchase.AppleAppStore.VerifyReceipt.AppleExpirationIntent.md#price_increase)
- [PRODUCT\_NOT\_AVAILABLE](CdvPurchase.AppleAppStore.VerifyReceipt.AppleExpirationIntent.md#product_not_available)
- [UNKNOWN](CdvPurchase.AppleAppStore.VerifyReceipt.AppleExpirationIntent.md#unknown)

## Enumeration Members

### BILLING\_ERROR

• **BILLING\_ERROR** = ``"2"``

Billing error; for example, the customer"s payment information was no longer valid.

___

### CANCELED

• **CANCELED** = ``"1"``

The customer voluntarily canceled their subscription.

___

### PRICE\_INCREASE

• **PRICE\_INCREASE** = ``"3"``

The customer did not agree to a recent price increase.

___

### PRODUCT\_NOT\_AVAILABLE

• **PRODUCT\_NOT\_AVAILABLE** = ``"4"``

The product was not available for purchase at the time of renewal.

___

### UNKNOWN

• **UNKNOWN** = ``"5"``

Unknown error.
