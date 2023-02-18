# Namespace: AppleAppStore

[CdvPurchase](CdvPurchase.md).AppleAppStore

Apple AppStore adapter using StoreKit version 1

## Table of contents

### Namespaces

- [Bridge](CdvPurchase.AppleAppStore.Bridge.md)
- [VerifyReceipt](CdvPurchase.AppleAppStore.VerifyReceipt.md)

### Classes

- [Adapter](../classes/CdvPurchase.AppleAppStore.Adapter.md)
- [SKApplicationReceipt](../classes/CdvPurchase.AppleAppStore.SKApplicationReceipt.md)
- [SKOffer](../classes/CdvPurchase.AppleAppStore.SKOffer.md)
- [SKProduct](../classes/CdvPurchase.AppleAppStore.SKProduct.md)
- [SKTransaction](../classes/CdvPurchase.AppleAppStore.SKTransaction.md)

### Interfaces

- [AdapterOptions](../interfaces/CdvPurchase.AppleAppStore.AdapterOptions.md)
- [AdditionalData](../interfaces/CdvPurchase.AppleAppStore.AdditionalData.md)
- [ApplicationReceipt](../interfaces/CdvPurchase.AppleAppStore.ApplicationReceipt.md)
- [DiscountEligibilityRequest](../interfaces/CdvPurchase.AppleAppStore.DiscountEligibilityRequest.md)
- [PaymentDiscount](../interfaces/CdvPurchase.AppleAppStore.PaymentDiscount.md)

### Type Aliases

- [DiscountEligibilityDeterminer](CdvPurchase.AppleAppStore.md#discounteligibilitydeterminer)
- [DiscountType](CdvPurchase.AppleAppStore.md#discounttype)
- [PaymentMonitor](CdvPurchase.AppleAppStore.md#paymentmonitor)
- [PaymentMonitorStatus](CdvPurchase.AppleAppStore.md#paymentmonitorstatus)
- [SKOfferType](CdvPurchase.AppleAppStore.md#skoffertype)

### Variables

- [APPLICATION\_VIRTUAL\_TRANSACTION\_ID](CdvPurchase.AppleAppStore.md#application_virtual_transaction_id)
- [DEFAULT\_OFFER\_ID](CdvPurchase.AppleAppStore.md#default_offer_id)

## Type Aliases

### DiscountEligibilityDeterminer

Ƭ **DiscountEligibilityDeterminer**: (`applicationReceipt`: [`ApplicationReceipt`](../interfaces/CdvPurchase.AppleAppStore.ApplicationReceipt.md), `requests`: [`DiscountEligibilityRequest`](../interfaces/CdvPurchase.AppleAppStore.DiscountEligibilityRequest.md)[], `callback`: (`response`: `boolean`[]) => `void`) => `void`

#### Type declaration

▸ (`applicationReceipt`, `requests`, `callback`): `void`

Determine which discount the user is eligible to.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `applicationReceipt` | [`ApplicationReceipt`](../interfaces/CdvPurchase.AppleAppStore.ApplicationReceipt.md) | An apple appstore receipt |
| `requests` | [`DiscountEligibilityRequest`](../interfaces/CdvPurchase.AppleAppStore.DiscountEligibilityRequest.md)[] | List of discount offers to evaluate eligibility for |
| `callback` | (`response`: `boolean`[]) => `void` | Get the response, a boolean for each request (matched by index). |

##### Returns

`void`

___

### DiscountType

Ƭ **DiscountType**: ``"Introductory"`` \| ``"Subscription"``

___

### PaymentMonitor

Ƭ **PaymentMonitor**: (`status`: [`PaymentMonitorStatus`](CdvPurchase.AppleAppStore.md#paymentmonitorstatus)) => `void`

#### Type declaration

▸ (`status`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `status` | [`PaymentMonitorStatus`](CdvPurchase.AppleAppStore.md#paymentmonitorstatus) |

##### Returns

`void`

___

### PaymentMonitorStatus

Ƭ **PaymentMonitorStatus**: ``"cancelled"`` \| ``"failed"`` \| ``"purchased"`` \| ``"deferred"``

___

### SKOfferType

Ƭ **SKOfferType**: [`DiscountType`](CdvPurchase.AppleAppStore.md#discounttype) \| ``"Default"``

## Variables

### APPLICATION\_VIRTUAL\_TRANSACTION\_ID

• `Const` **APPLICATION\_VIRTUAL\_TRANSACTION\_ID**: ``"appstore.application"``

Transaction ID used for the application virtual transaction

___

### DEFAULT\_OFFER\_ID

• `Const` **DEFAULT\_OFFER\_ID**: ``"$"``
