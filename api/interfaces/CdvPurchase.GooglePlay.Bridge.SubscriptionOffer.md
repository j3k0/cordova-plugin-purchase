# Interface: SubscriptionOffer

[GooglePlay](../modules/CdvPurchase.GooglePlay.md).[Bridge](../modules/CdvPurchase.GooglePlay.Bridge.md).SubscriptionOffer

## Table of contents

### Properties

- [base\_plan\_id](CdvPurchase.GooglePlay.Bridge.SubscriptionOffer.md#base_plan_id)
- [offer\_id](CdvPurchase.GooglePlay.Bridge.SubscriptionOffer.md#offer_id)
- [pricing\_phases](CdvPurchase.GooglePlay.Bridge.SubscriptionOffer.md#pricing_phases)
- [tags](CdvPurchase.GooglePlay.Bridge.SubscriptionOffer.md#tags)
- [token](CdvPurchase.GooglePlay.Bridge.SubscriptionOffer.md#token)

## Properties

### base\_plan\_id

• **base\_plan\_id**: ``null`` \| `string`

Base plan id associated with the subscription product (since billing library v6).

___

### offer\_id

• **offer\_id**: ``null`` \| `string`

Offer id associated with the subscription product (since billing library v6).

___

### pricing\_phases

• **pricing\_phases**: [`PricingPhase`](CdvPurchase.GooglePlay.Bridge.PricingPhase.md)[]

Pricing phases for the subscription product.

___

### tags

• **tags**: `string`[]

Tags associated with this Subscription Offer.

___

### token

• **token**: `string`

Token required to pass in launchBillingFlow to purchase the subscription product with these pricing phases.
