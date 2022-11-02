# Interface: SubscriptionPriceChange

[GooglePlay](../modules/CdvPurchase.GooglePlay.md).[PublisherAPI](../modules/CdvPurchase.GooglePlay.PublisherAPI.md).SubscriptionPriceChange

Contains the price change information for a subscription that can be used to control the user journey for the price change in the app. This can be in the form of seeking confirmation from the user or tailoring the experience for a successful conversion.

## Table of contents

### Properties

- [newPrice](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPriceChange.md#newprice)
- [state](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPriceChange.md#state)

## Properties

### newPrice

• `Optional` **newPrice**: [`Price`](CdvPurchase.GooglePlay.PublisherAPI.Price.md)

The new price the subscription will renew with if the price change is accepted by the user.

___

### state

• `Optional` **state**: ``null`` \| `number`

The current state of the price change. Possible values are: 0. Outstanding: State for a pending price change waiting for the user to agree. In this state, you can optionally seek confirmation from the user using the In-App API. 1. Accepted: State for an accepted price change that the subscription will renew with unless it's canceled. The price change takes effect on a future date when the subscription renews. Note that the change might not occur when the subscription is renewed next.
