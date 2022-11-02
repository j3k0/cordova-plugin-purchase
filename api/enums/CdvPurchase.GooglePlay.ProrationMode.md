# Enumeration: ProrationMode

[CdvPurchase](../modules/CdvPurchase.md).[GooglePlay](../modules/CdvPurchase.GooglePlay.md).ProrationMode

Replace SKU ProrationMode.

See https://developer.android.com/reference/com/android/billingclient/api/BillingFlowParams.ProrationMode

## Table of contents

### Enumeration Members

- [DEFERRED](CdvPurchase.GooglePlay.ProrationMode.md#deferred)
- [IMMEDIATE\_AND\_CHARGE\_FULL\_PRICE](CdvPurchase.GooglePlay.ProrationMode.md#immediate_and_charge_full_price)
- [IMMEDIATE\_AND\_CHARGE\_PRORATED\_PRICE](CdvPurchase.GooglePlay.ProrationMode.md#immediate_and_charge_prorated_price)
- [IMMEDIATE\_WITHOUT\_PRORATION](CdvPurchase.GooglePlay.ProrationMode.md#immediate_without_proration)
- [IMMEDIATE\_WITH\_TIME\_PRORATION](CdvPurchase.GooglePlay.ProrationMode.md#immediate_with_time_proration)

## Enumeration Members

### DEFERRED

• **DEFERRED** = ``"DEFERRED"``

Replacement takes effect when the old plan expires, and the new price will be charged at the same time.

___

### IMMEDIATE\_AND\_CHARGE\_FULL\_PRICE

• **IMMEDIATE\_AND\_CHARGE\_FULL\_PRICE** = ``"IMMEDIATE_AND_CHARGE_FULL_PRICE"``

Replacement takes effect immediately, and the user is charged full price of new plan and is given a full billing cycle of subscription, plus remaining prorated time from the old plan.

___

### IMMEDIATE\_AND\_CHARGE\_PRORATED\_PRICE

• **IMMEDIATE\_AND\_CHARGE\_PRORATED\_PRICE** = ``"IMMEDIATE_AND_CHARGE_PRORATED_PRICE"``

Replacement takes effect immediately, and the billing cycle remains the same.

___

### IMMEDIATE\_WITHOUT\_PRORATION

• **IMMEDIATE\_WITHOUT\_PRORATION** = ``"IMMEDIATE_WITHOUT_PRORATION"``

Replacement takes effect immediately, and the new price will be charged on next recurrence time.

___

### IMMEDIATE\_WITH\_TIME\_PRORATION

• **IMMEDIATE\_WITH\_TIME\_PRORATION** = ``"IMMEDIATE_WITH_TIME_PRORATION"``

Replacement takes effect immediately, and the remaining time will be prorated and credited to the user.
