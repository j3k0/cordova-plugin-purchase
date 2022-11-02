# Interface: SubscriptionPurchaseV2Ext

[GooglePlay](../modules/CdvPurchase.GooglePlay.md).[PublisherAPI](../modules/CdvPurchase.GooglePlay.PublisherAPI.md).SubscriptionPurchaseV2Ext

## Hierarchy

- `SubscriptionPurchaseV2_API`

  ↳ **`SubscriptionPurchaseV2Ext`**

## Table of contents

### Properties

- [acknowledgementState](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseV2Ext.md#acknowledgementstate)
- [canceledStateContext](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseV2Ext.md#canceledstatecontext)
- [externalAccountIdentifiers](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseV2Ext.md#externalaccountidentifiers)
- [kind](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseV2Ext.md#kind)
- [latestOrderId](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseV2Ext.md#latestorderid)
- [lineItems](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseV2Ext.md#lineitems)
- [linkedPurchaseToken](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseV2Ext.md#linkedpurchasetoken)
- [pausedStateContext](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseV2Ext.md#pausedstatecontext)
- [regionCode](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseV2Ext.md#regioncode)
- [startTime](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseV2Ext.md#starttime)
- [subscribeWithGoogleInfo](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseV2Ext.md#subscribewithgoogleinfo)
- [subscriptionState](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseV2Ext.md#subscriptionstate)
- [testPurchase](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseV2Ext.md#testpurchase)

## Properties

### acknowledgementState

• `Optional` **acknowledgementState**: ``null`` \| [`AcknowledgementState`](../modules/CdvPurchase.GooglePlay.PublisherAPI.md#acknowledgementstate)

The acknowledgement state of the subscription.

#### Inherited from

SubscriptionPurchaseV2\_API.acknowledgementState

___

### canceledStateContext

• `Optional` **canceledStateContext**: ``null`` \| [`CanceledStateContext`](../modules/CdvPurchase.GooglePlay.PublisherAPI.md#canceledstatecontext)

Additional context around canceled subscriptions. Only present if the subscription currently has subscriptionState SUBSCRIPTION_STATE_CANCELED.

#### Inherited from

SubscriptionPurchaseV2\_API.canceledStateContext

___

### externalAccountIdentifiers

• `Optional` **externalAccountIdentifiers**: ``null`` \| [`ExternalAccountIdentifiers`](CdvPurchase.GooglePlay.PublisherAPI.ExternalAccountIdentifiers.md)

User account identifier in the third-party service.

#### Inherited from

SubscriptionPurchaseV2\_API.externalAccountIdentifiers

___

### kind

• **kind**: ``"androidpublisher#subscriptionPurchaseV2"``

#### Overrides

SubscriptionPurchaseV2\_API.kind

___

### latestOrderId

• `Optional` **latestOrderId**: ``null`` \| `string`

The order id of the latest order associated with the purchase of the subscription. For autoRenewing subscription, this is the order id of signup order if it is not renewed yet, or the last recurring order id (success, pending, or declined order). For prepaid subscription, this is the order id associated with the queried purchase token.

#### Inherited from

SubscriptionPurchaseV2\_API.latestOrderId

___

### lineItems

• `Optional` **lineItems**: ``null`` \| [`SubscriptionPurchaseLineItem`](../modules/CdvPurchase.GooglePlay.PublisherAPI.md#subscriptionpurchaselineitem)[]

Item-level info for a subscription purchase. The items in the same purchase should be either all with AutoRenewingPlan or all with PrepaidPlan.

#### Inherited from

SubscriptionPurchaseV2\_API.lineItems

___

### linkedPurchaseToken

• `Optional` **linkedPurchaseToken**: ``null`` \| `string`

The purchase token of the old subscription if this subscription is one of the following:
- Re-signup of a canceled but non-lapsed subscription
- Upgrade/downgrade from a previous subscription.
- Convert from prepaid to auto renewing subscription.
- Convert from an auto renewing subscription to prepaid.
- Topup a prepaid subscription.

#### Inherited from

SubscriptionPurchaseV2\_API.linkedPurchaseToken

___

### pausedStateContext

• `Optional` **pausedStateContext**: ``null`` \| [`PausedStateContext`](CdvPurchase.GooglePlay.PublisherAPI.PausedStateContext.md)

Additional context around paused subscriptions. Only present if the subscription currently has subscriptionState SUBSCRIPTION_STATE_PAUSED.

#### Inherited from

SubscriptionPurchaseV2\_API.pausedStateContext

___

### regionCode

• `Optional` **regionCode**: ``null`` \| `string`

ISO 3166-1 alpha-2 billing country/region code of the user at the time the subscription was granted.

#### Inherited from

SubscriptionPurchaseV2\_API.regionCode

___

### startTime

• `Optional` **startTime**: ``null`` \| `string`

Time at which the subscription was granted. Not set for pending subscriptions (subscription was created but awaiting payment during signup).

A timestamp in RFC3339 UTC "Zulu" format, with nanosecond resolution and up to nine fractional digits. Examples: "2014-10-02T15:01:23Z" and "2014-10-02T15:01:23.045123456Z".

#### Inherited from

SubscriptionPurchaseV2\_API.startTime

___

### subscribeWithGoogleInfo

• `Optional` **subscribeWithGoogleInfo**: ``null`` \| [`SubscribeWithGoogleInfo`](CdvPurchase.GooglePlay.PublisherAPI.SubscribeWithGoogleInfo.md)

User profile associated with purchases made with 'Subscribe with Google'.

#### Inherited from

SubscriptionPurchaseV2\_API.subscribeWithGoogleInfo

___

### subscriptionState

• `Optional` **subscriptionState**: ``null`` \| [`SubscriptionState`](../modules/CdvPurchase.GooglePlay.PublisherAPI.md#subscriptionstate)

The current state of the subscription.

#### Inherited from

SubscriptionPurchaseV2\_API.subscriptionState

___

### testPurchase

• `Optional` **testPurchase**: `unknown`

Only present if this subscription purchase is a test purchase.

#### Inherited from

SubscriptionPurchaseV2\_API.testPurchase
