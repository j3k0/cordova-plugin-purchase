# Enumeration: CancelationReason

[CdvPurchase](../modules/CdvPurchase.md).CancelationReason

Reason why a subscription has been canceled

## Table of contents

### Enumeration Members

- [CUSTOMER](CdvPurchase.CancelationReason.md#customer)
- [CUSTOMER\_COST](CdvPurchase.CancelationReason.md#customer_cost)
- [CUSTOMER\_FOUND\_BETTER\_APP](CdvPurchase.CancelationReason.md#customer_found_better_app)
- [CUSTOMER\_NOT\_USEFUL\_ENOUGH](CdvPurchase.CancelationReason.md#customer_not_useful_enough)
- [CUSTOMER\_OTHER\_REASON](CdvPurchase.CancelationReason.md#customer_other_reason)
- [CUSTOMER\_PRICE\_INCREASE](CdvPurchase.CancelationReason.md#customer_price_increase)
- [CUSTOMER\_TECHNICAL\_ISSUES](CdvPurchase.CancelationReason.md#customer_technical_issues)
- [DEVELOPER](CdvPurchase.CancelationReason.md#developer)
- [NOT\_CANCELED](CdvPurchase.CancelationReason.md#not_canceled)
- [SYSTEM](CdvPurchase.CancelationReason.md#system)
- [SYSTEM\_BILLING\_ERROR](CdvPurchase.CancelationReason.md#system_billing_error)
- [SYSTEM\_DELETED](CdvPurchase.CancelationReason.md#system_deleted)
- [SYSTEM\_PRODUCT\_UNAVAILABLE](CdvPurchase.CancelationReason.md#system_product_unavailable)
- [SYSTEM\_REPLACED](CdvPurchase.CancelationReason.md#system_replaced)
- [UNKNOWN](CdvPurchase.CancelationReason.md#unknown)

## Enumeration Members

### CUSTOMER

• **CUSTOMER** = ``"Customer"``

Subscription canceled by the user for an unspecified reason.

___

### CUSTOMER\_COST

• **CUSTOMER\_COST** = ``"Customer.Cost"``

Customer canceled for cost-related reasons.

___

### CUSTOMER\_FOUND\_BETTER\_APP

• **CUSTOMER\_FOUND\_BETTER\_APP** = ``"Customer.FoundBetterApp"``

Customer claimed to have found a better app.

___

### CUSTOMER\_NOT\_USEFUL\_ENOUGH

• **CUSTOMER\_NOT\_USEFUL\_ENOUGH** = ``"Customer.NotUsefulEnough"``

Customer did not feel he is using this service enough.

___

### CUSTOMER\_OTHER\_REASON

• **CUSTOMER\_OTHER\_REASON** = ``"Customer.OtherReason"``

Subscription canceled for another reason; for example, if the customer made the purchase accidentally.

___

### CUSTOMER\_PRICE\_INCREASE

• **CUSTOMER\_PRICE\_INCREASE** = ``"Customer.PriceIncrease"``

Customer did not agree to a recent price increase. See also priceConsentStatus.

___

### CUSTOMER\_TECHNICAL\_ISSUES

• **CUSTOMER\_TECHNICAL\_ISSUES** = ``"Customer.TechnicalIssues"``

Customer canceled their transaction due to an actual or perceived issue within your app.

___

### DEVELOPER

• **DEVELOPER** = ``"Developer"``

Subscription canceled by the developer.

___

### NOT\_CANCELED

• **NOT\_CANCELED** = ``""``

Not canceled

___

### SYSTEM

• **SYSTEM** = ``"System"``

Subscription canceled by the system for an unspecified reason.

___

### SYSTEM\_BILLING\_ERROR

• **SYSTEM\_BILLING\_ERROR** = ``"System.BillingError"``

Billing error; for example customer’s payment information is no longer valid.

___

### SYSTEM\_DELETED

• **SYSTEM\_DELETED** = ``"System.Deleted"``

Transaction is gone; It has been deleted.

___

### SYSTEM\_PRODUCT\_UNAVAILABLE

• **SYSTEM\_PRODUCT\_UNAVAILABLE** = ``"System.ProductUnavailable"``

Product not available for purchase at the time of renewal.

___

### SYSTEM\_REPLACED

• **SYSTEM\_REPLACED** = ``"System.Replaced"``

Subscription upgraded or downgraded to a new subscription.

___

### UNKNOWN

• **UNKNOWN** = ``"Unknown"``

Subscription canceled for unknown reasons.
