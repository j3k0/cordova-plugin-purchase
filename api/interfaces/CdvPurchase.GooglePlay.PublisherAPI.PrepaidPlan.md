# Interface: PrepaidPlan

[GooglePlay](../modules/CdvPurchase.GooglePlay.md).[PublisherAPI](../modules/CdvPurchase.GooglePlay.PublisherAPI.md).PrepaidPlan

Information related to a prepaid plan.

## Table of contents

### Properties

- [allowExtendAfterTime](CdvPurchase.GooglePlay.PublisherAPI.PrepaidPlan.md#allowextendaftertime)

## Properties

### allowExtendAfterTime

• `Optional` **allowExtendAfterTime**: ``null`` \| `string`

After this time, the subscription is allowed for a new top-up purchase. Not present if the subscription is already extended by a top-up purchase.

A timestamp in RFC3339 UTC "Zulu" format, with nanosecond resolution and up to nine fractional digits. Examples: "2014-10-02T15:01:23Z" and "2014-10-02T15:01:23.045123456Z".
