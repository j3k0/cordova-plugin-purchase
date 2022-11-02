# Interface: UserInitiatedCancellation

[GooglePlay](../modules/CdvPurchase.GooglePlay.md).[PublisherAPI](../modules/CdvPurchase.GooglePlay.PublisherAPI.md).UserInitiatedCancellation

Information specific to cancellations initiated by users.

## Table of contents

### Properties

- [cancelSurveyResult](CdvPurchase.GooglePlay.PublisherAPI.UserInitiatedCancellation.md#cancelsurveyresult)
- [cancelTime](CdvPurchase.GooglePlay.PublisherAPI.UserInitiatedCancellation.md#canceltime)

## Properties

### cancelSurveyResult

• `Optional` **cancelSurveyResult**: [`CancelSurveyResult`](CdvPurchase.GooglePlay.PublisherAPI.CancelSurveyResult.md)

Information provided by the user when they complete the subscription cancellation flow (cancellation reason survey).

___

### cancelTime

• `Optional` **cancelTime**: ``null`` \| `string`

The time at which the subscription was canceled by the user. The user might still have access to the subscription after this time. Use lineItems.expiry_time to determine if a user still has access.

A timestamp in RFC3339 UTC "Zulu" format, with nanosecond resolution and up to nine fractional digits. Examples: "2014-10-02T15:01:23Z" and "2014-10-02T15:01:23.045123456Z".
