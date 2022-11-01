# Interface: VerifiedPurchase

[CdvPurchase](../modules/CdvPurchase.md).VerifiedPurchase

A purchase object returned by the receipt validator

## Properties

### cancelationReason

• `Optional` **cancelationReason**: [`CancelationReason`](../enums/CdvPurchase.CancelationReason.md)

The reason a subscription or purchase was cancelled.

See href="#api-Types-CancelationReason">enum CancelationReason</a>.

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

### priceConsentStatus

• `Optional` **priceConsentStatus**: [`PriceConsentStatus`](../enums/CdvPurchase.PriceConsentStatus.md)

Whether or not the user agreed or has been notified of a price change.

See <a href="#api-Types-PriceConsentStatus">"enum PriceConsentStatus"</a>.

___

### purchaseDate

• `Optional` **purchaseDate**: `number`

Date of first purchase (timestamp).

___

### renewalIntent

• `Optional` **renewalIntent**: `string`

Renewal intent

See <a href="#api-Types-RenewalIntent">enum RenewalIntent</a>

___

### renewalIntentChangeDate

• `Optional` **renewalIntentChangeDate**: `number`

Date the renewal intent was updated by the user.
