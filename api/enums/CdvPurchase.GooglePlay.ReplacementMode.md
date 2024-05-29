# Enumeration: ReplacementMode

[CdvPurchase](../modules/CdvPurchase.md).[GooglePlay](../modules/CdvPurchase.GooglePlay.md).ReplacementMode

Supported replacement modes to replace an existing subscription with a new one.

**`See`**

[https://developer.android.com/google/play/billing/subscriptions#replacement-modes](https://developer.android.com/google/play/billing/subscriptions#replacement-modes)

## Table of contents

### Enumeration Members

- [CHARGE\_FULL\_PRICE](CdvPurchase.GooglePlay.ReplacementMode.md#charge_full_price)
- [CHARGE\_PRORATED\_PRICE](CdvPurchase.GooglePlay.ReplacementMode.md#charge_prorated_price)
- [DEFERRED](CdvPurchase.GooglePlay.ReplacementMode.md#deferred)
- [WITHOUT\_PRORATION](CdvPurchase.GooglePlay.ReplacementMode.md#without_proration)
- [WITH\_TIME\_PRORATION](CdvPurchase.GooglePlay.ReplacementMode.md#with_time_proration)

## Enumeration Members

### CHARGE\_FULL\_PRICE

• **CHARGE\_FULL\_PRICE** = ``"IMMEDIATE_AND_CHARGE_FULL_PRICE"``

Replacement takes effect immediately, and the user is charged full price of new plan and is given a full billing cycle of subscription, plus remaining prorated time from the old plan.

___

### CHARGE\_PRORATED\_PRICE

• **CHARGE\_PRORATED\_PRICE** = ``"IMMEDIATE_AND_CHARGE_PRORATED_PRICE"``

Replacement takes effect immediately, and the billing cycle remains the same.

___

### DEFERRED

• **DEFERRED** = ``"DEFERRED"``

Replacement takes effect when the old plan expires, and the new price will be charged at the same time.

___

### WITHOUT\_PRORATION

• **WITHOUT\_PRORATION** = ``"IMMEDIATE_WITHOUT_PRORATION"``

Replacement takes effect immediately, and the new price will be charged on next recurrence time.

___

### WITH\_TIME\_PRORATION

• **WITH\_TIME\_PRORATION** = ``"IMMEDIATE_WITH_TIME_PRORATION"``

Replacement takes effect immediately, and the remaining time will be prorated and credited to the user.
