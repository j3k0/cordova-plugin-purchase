# Namespace: Test

[CdvPurchase](CdvPurchase.md).Test

Test Adapter and related classes.

## Table of contents

### Classes

- [Adapter](../classes/CdvPurchase.Test.Adapter.md)

### Variables

- [testProducts](CdvPurchase.Test.md#testproducts)
- [testProductsArray](CdvPurchase.Test.md#testproductsarray)

## Variables

### testProducts

• `Const` **testProducts**: `Object`

Definition of the test products.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `CONSUMABLE` | { `id`: `string` = 'test-consumable'; `platform`: [`Platform`](../enums/CdvPurchase.Platform.md) ; `type`: [`ProductType`](../enums/CdvPurchase.ProductType.md) = ProductType.CONSUMABLE } | A valid consumable product.  - id: "test-consumable" - type: ProductType.CONSUMABLE |
| `CONSUMABLE.id` | `string` | - |
| `CONSUMABLE.platform` | [`Platform`](../enums/CdvPurchase.Platform.md) | - |
| `CONSUMABLE.type` | [`ProductType`](../enums/CdvPurchase.ProductType.md) | - |
| `CONSUMABLE_FAILING` | { `id`: `string` = 'test-consumable-fail'; `platform`: [`Platform`](../enums/CdvPurchase.Platform.md) ; `type`: [`ProductType`](../enums/CdvPurchase.ProductType.md) = ProductType.CONSUMABLE } | A consumable product for which the purchase will always fail.  - id: "test-consumable-fail" - type: ProductType.CONSUMABLE |
| `CONSUMABLE_FAILING.id` | `string` | - |
| `CONSUMABLE_FAILING.platform` | [`Platform`](../enums/CdvPurchase.Platform.md) | - |
| `CONSUMABLE_FAILING.type` | [`ProductType`](../enums/CdvPurchase.ProductType.md) | - |
| `NON_CONSUMABLE` | { `id`: `string` = 'test-non-consumable'; `platform`: [`Platform`](../enums/CdvPurchase.Platform.md) ; `type`: [`ProductType`](../enums/CdvPurchase.ProductType.md) = ProductType.NON\_CONSUMABLE } | A valid non-consumable product.  - id: "test-non-consumable" - type: ProductType.NON_CONSUMABLE |
| `NON_CONSUMABLE.id` | `string` | - |
| `NON_CONSUMABLE.platform` | [`Platform`](../enums/CdvPurchase.Platform.md) | - |
| `NON_CONSUMABLE.type` | [`ProductType`](../enums/CdvPurchase.ProductType.md) | - |
| `PAID_SUBSCRIPTION` | { `id`: `string` = 'test-subscription'; `platform`: [`Platform`](../enums/CdvPurchase.Platform.md) ; `type`: [`ProductType`](../enums/CdvPurchase.ProductType.md) = ProductType.PAID\_SUBSCRIPTION } | A paid-subscription that auto-renews for the duration of the session.  This subscription has a free trial period, that renews every week, 3 times. It then costs $4.99 per month.  - id: "test-subscription" - type: ProductType.PAID_SUBSCRIPTION |
| `PAID_SUBSCRIPTION.id` | `string` | - |
| `PAID_SUBSCRIPTION.platform` | [`Platform`](../enums/CdvPurchase.Platform.md) | - |
| `PAID_SUBSCRIPTION.type` | [`ProductType`](../enums/CdvPurchase.ProductType.md) | - |
| `PAID_SUBSCRIPTION_ACTIVE` | { `id`: `string` = 'test-subscription-active'; `platform`: [`Platform`](../enums/CdvPurchase.Platform.md) ; `type`: [`ProductType`](../enums/CdvPurchase.ProductType.md) = ProductType.PAID\_SUBSCRIPTION } | A paid-subscription that is already active when the app starts.  It behaves as if the user subscribed on a different device. It will renew forever.  - id: "test-subscription-active" - type: ProductType.PAID_SUBSCRIPTION |
| `PAID_SUBSCRIPTION_ACTIVE.id` | `string` | - |
| `PAID_SUBSCRIPTION_ACTIVE.platform` | [`Platform`](../enums/CdvPurchase.Platform.md) | - |
| `PAID_SUBSCRIPTION_ACTIVE.type` | [`ProductType`](../enums/CdvPurchase.ProductType.md) | - |

___

### testProductsArray

• `Const` **testProductsArray**: [`IRegisterProduct`](../interfaces/CdvPurchase.IRegisterProduct.md)[]

List of test products definitions as an array.
