# Interface: CancelSurveyResult

[GooglePlay](../modules/CdvPurchase.GooglePlay.md).[PublisherAPI](../modules/CdvPurchase.GooglePlay.PublisherAPI.md).CancelSurveyResult

Result of the cancel survey when the subscription was canceled by the user.

## Table of contents

### Properties

- [reason](CdvPurchase.GooglePlay.PublisherAPI.CancelSurveyResult.md#reason)
- [reasonUserInput](CdvPurchase.GooglePlay.PublisherAPI.CancelSurveyResult.md#reasonuserinput)

## Properties

### reason

• `Optional` **reason**: ``null`` \| [`CancelSurveyReason`](../modules/CdvPurchase.GooglePlay.PublisherAPI.md#cancelsurveyreason)

The reason the user selected in the cancel survey.

___

### reasonUserInput

• `Optional` **reasonUserInput**: ``null`` \| `string`

Only set for CANCEL_SURVEY_REASON_OTHERS. This is the user's freeform response to the survey.
