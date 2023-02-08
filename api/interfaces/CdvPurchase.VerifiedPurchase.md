# Interface: VerifiedPurchase

[CdvPurchase](../modules/CdvPurchase.md).VerifiedPurchase

A purchase object returned by the receipt validator

## Table of contents

### Properties

- [cancelationReason](CdvPurchase.VerifiedPurchase.md#cancelationreason)
- [discountId](CdvPurchase.VerifiedPurchase.md#discountid)
- [expiryDate](CdvPurchase.VerifiedPurchase.md#expirydate)
- [id](CdvPurchase.VerifiedPurchase.md#id)
- [isBillingRetryPeriod](CdvPurchase.VerifiedPurchase.md#isbillingretryperiod)
- [isExpired](CdvPurchase.VerifiedPurchase.md#isexpired)
- [isIntroPeriod](CdvPurchase.VerifiedPurchase.md#isintroperiod)
- [isTrialPeriod](CdvPurchase.VerifiedPurchase.md#istrialperiod)
- [lastRenewalDate](CdvPurchase.VerifiedPurchase.md#lastrenewaldate)
- [platform](CdvPurchase.VerifiedPurchase.md#platform)
- [priceConsentStatus](CdvPurchase.VerifiedPurchase.md#priceconsentstatus)
- [purchaseDate](CdvPurchase.VerifiedPurchase.md#purchasedate)
- [purchaseId](CdvPurchase.VerifiedPurchase.md#purchaseid)
- [renewalIntent](CdvPurchase.VerifiedPurchase.md#renewalintent)
- [renewalIntentChangeDate](CdvPurchase.VerifiedPurchase.md#renewalintentchangedate)
- [transactionId](CdvPurchase.VerifiedPurchase.md#transactionid)

## Properties

### cancelationReason

• `Optional` **cancelationReason**: [`CancelationReason`](../enums/CdvPurchase.CancelationReason.md)

The reason a subscription or purchase was cancelled.

___

### discountId

• `Optional` **discountId**: `string`

Identifier of the discount currently applied to a purchase.

Correspond to the product's offerId. When undefined it means there is only one offer for the given product.

___

### expiryDate

• `Optional` **expiryDate**: `number`

Date of expiry for a subscription.

___

### id

• **id**: `string`

Product identifier

___

### isBillingRetryPeriod

• `Optional` **isBillingRetryPeriod**: `boolean`

True when a subscription a subscription is in the grace period after a failed attempt to collect payment

___

### isExpired

• `Optional` **isExpired**: `boolean`

True when a subscription is expired.

___

### isIntroPeriod

• `Optional` **isIntroPeriod**: `boolean`

True when a subscription is in introductory pricing period

___

### isTrialPeriod

• `Optional` **isTrialPeriod**: `boolean`

True when a subscription is in trial period

___

### lastRenewalDate

• `Optional` **lastRenewalDate**: `number`

Last time a subscription was renewed.

___

### platform

• `Optional` **platform**: [`Platform`](../enums/CdvPurchase.Platform.md)

Platform this purchase was made on

___

### priceConsentStatus

• `Optional` **priceConsentStatus**: [`PriceConsentStatus`](../enums/CdvPurchase.PriceConsentStatus.md)

Whether or not the user agreed or has been notified of a price change.

___

### purchaseDate

• `Optional` **purchaseDate**: `number`

Date of first purchase (timestamp).

___

### purchaseId

• `Optional` **purchaseId**: `string`

Purchase identifier (optional)

___

### renewalIntent

• `Optional` **renewalIntent**: `string`

Renewal intent.

___

### renewalIntentChangeDate

• `Optional` **renewalIntentChangeDate**: `number`

Date the renewal intent was updated by the user.

___

### transactionId

• `Optional` **transactionId**: `string`

Identifier of the last transaction (optional)
