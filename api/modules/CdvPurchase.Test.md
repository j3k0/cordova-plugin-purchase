# Namespace: Test

[CdvPurchase](CdvPurchase.md).Test

Test Adapter and related classes.

## Table of contents

### Classes

- [Adapter](../classes/CdvPurchase.Test.Adapter.md)

### Variables

- [CONSUMABLE\_FAILING](CdvPurchase.Test.md#consumable_failing)
- [CONSUMABLE\_OK](CdvPurchase.Test.md#consumable_ok)
- [NON\_CONSUMABLE\_OK](CdvPurchase.Test.md#non_consumable_ok)
- [PAID\_SUBSCRIPTION\_ACTIVE](CdvPurchase.Test.md#paid_subscription_active)
- [PAID\_SUBSCRIPTION\_OK](CdvPurchase.Test.md#paid_subscription_ok)
- [TEST\_PRODUCTS](CdvPurchase.Test.md#test_products)

## Variables

### CONSUMABLE\_FAILING

• `Const` **CONSUMABLE\_FAILING**: [`Product`](../classes/CdvPurchase.Product.md)

A consumable product for which the purchase will always fail.

id: "test-consumable-fail"
type: ProductType.CONSUMABLE

___

### CONSUMABLE\_OK

• `Const` **CONSUMABLE\_OK**: [`Product`](../classes/CdvPurchase.Product.md)

A valid consumable product.

id: "test-consumable"
type: ProductType.CONSUMABLE

___

### NON\_CONSUMABLE\_OK

• `Const` **NON\_CONSUMABLE\_OK**: [`Product`](../classes/CdvPurchase.Product.md)

A valid non-consumable product.

id: "test-non-consumable"
type: ProductType.NON_CONSUMABLE

___

### PAID\_SUBSCRIPTION\_ACTIVE

• `Const` **PAID\_SUBSCRIPTION\_ACTIVE**: [`Product`](../classes/CdvPurchase.Product.md)

A paid-subscription that is already active when the app starts.

It behaves as if the user subscribed on a different device. It will renew forever.

id: "test-subscription-active"
type: ProductType.PAID_SUBSCRIPTION

___

### PAID\_SUBSCRIPTION\_OK

• `Const` **PAID\_SUBSCRIPTION\_OK**: [`Product`](../classes/CdvPurchase.Product.md)

A paid-subscription that auto-renews for the duration of the session.

This subscription has a free trial period, that renews every week, 3 times.
It then costs $4.99 per month.

id: "test-subscription"
type: ProductType.PAID_SUBSCRIPTION

___

### TEST\_PRODUCTS

• `Const` **TEST\_PRODUCTS**: [`Product`](../classes/CdvPurchase.Product.md)[]

List of all recognized test products for the Test Adapter.

Register those products at startup with `store.register()` to activate them.
