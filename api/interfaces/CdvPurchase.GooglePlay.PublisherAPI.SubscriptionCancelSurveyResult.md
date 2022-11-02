# Interface: SubscriptionCancelSurveyResult

[GooglePlay](../modules/CdvPurchase.GooglePlay.md).[PublisherAPI](../modules/CdvPurchase.GooglePlay.PublisherAPI.md).SubscriptionCancelSurveyResult

Information provided by the user when they complete the subscription cancellation flow (cancellation reason survey).

## Table of contents

### Properties

- [cancelSurveyReason](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionCancelSurveyResult.md#cancelsurveyreason)
- [userInputCancelReason](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionCancelSurveyResult.md#userinputcancelreason)

## Properties

### cancelSurveyReason

• `Optional` **cancelSurveyReason**: ``null`` \| `number`

The cancellation reason the user chose in the survey. Possible values are: 0. Other 1. I don't use this service enough 2. Technical issues 3. Cost-related reasons 4. I found a better app

___

### userInputCancelReason

• `Optional` **userInputCancelReason**: ``null`` \| `string`

The customized input cancel reason from the user. Only present when cancelReason is 0.
