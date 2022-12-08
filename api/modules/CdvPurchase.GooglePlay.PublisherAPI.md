# Namespace: PublisherAPI

[CdvPurchase](CdvPurchase.md).[GooglePlay](CdvPurchase.GooglePlay.md).PublisherAPI

## Table of contents

### Enumerations

- [ErrorCode](../enums/CdvPurchase.GooglePlay.PublisherAPI.ErrorCode.md)
- [GoogleErrorReason](../enums/CdvPurchase.GooglePlay.PublisherAPI.GoogleErrorReason.md)

### Interfaces

- [ApiError](../interfaces/CdvPurchase.GooglePlay.PublisherAPI.ApiError.md)
- [AutoRenewingPlan](../interfaces/CdvPurchase.GooglePlay.PublisherAPI.AutoRenewingPlan.md)
- [CancelSurveyResult](../interfaces/CdvPurchase.GooglePlay.PublisherAPI.CancelSurveyResult.md)
- [ErrorResponse\_API](../interfaces/CdvPurchase.GooglePlay.PublisherAPI.ErrorResponse_API.md)
- [ExternalAccountIdentifiers](../interfaces/CdvPurchase.GooglePlay.PublisherAPI.ExternalAccountIdentifiers.md)
- [GoogleSubscriptionGone](../interfaces/CdvPurchase.GooglePlay.PublisherAPI.GoogleSubscriptionGone.md)
- [IntroductoryPriceInfo](../interfaces/CdvPurchase.GooglePlay.PublisherAPI.IntroductoryPriceInfo.md)
- [PausedStateContext](../interfaces/CdvPurchase.GooglePlay.PublisherAPI.PausedStateContext.md)
- [PrepaidPlan](../interfaces/CdvPurchase.GooglePlay.PublisherAPI.PrepaidPlan.md)
- [Price](../interfaces/CdvPurchase.GooglePlay.PublisherAPI.Price.md)
- [ProductPurchaseExt](../interfaces/CdvPurchase.GooglePlay.PublisherAPI.ProductPurchaseExt.md)
- [SubscribeWithGoogleInfo](../interfaces/CdvPurchase.GooglePlay.PublisherAPI.SubscribeWithGoogleInfo.md)
- [SubscriptionCancelSurveyResult](../interfaces/CdvPurchase.GooglePlay.PublisherAPI.SubscriptionCancelSurveyResult.md)
- [SubscriptionPriceChange](../interfaces/CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPriceChange.md)
- [SubscriptionPurchaseExt](../interfaces/CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseExt.md)
- [SubscriptionPurchaseV2Ext](../interfaces/CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseV2Ext.md)
- [UserInitiatedCancellation](../interfaces/CdvPurchase.GooglePlay.PublisherAPI.UserInitiatedCancellation.md)

### Type Aliases

- [AcknowledgementState](CdvPurchase.GooglePlay.PublisherAPI.md#acknowledgementstate)
- [CancelSurveyReason](CdvPurchase.GooglePlay.PublisherAPI.md#cancelsurveyreason)
- [CanceledStateContext](CdvPurchase.GooglePlay.PublisherAPI.md#canceledstatecontext)
- [DeveloperInitiatedCancellation](CdvPurchase.GooglePlay.PublisherAPI.md#developerinitiatedcancellation)
- [GooglePurchase](CdvPurchase.GooglePlay.PublisherAPI.md#googlepurchase)
- [ReplacementCancellation](CdvPurchase.GooglePlay.PublisherAPI.md#replacementcancellation)
- [SubscriptionPurchaseLineItem](CdvPurchase.GooglePlay.PublisherAPI.md#subscriptionpurchaselineitem)
- [SubscriptionState](CdvPurchase.GooglePlay.PublisherAPI.md#subscriptionstate)
- [SystemInitiatedCancellation](CdvPurchase.GooglePlay.PublisherAPI.md#systeminitiatedcancellation)
- [TestPurchase](CdvPurchase.GooglePlay.PublisherAPI.md#testpurchase)

## Type Aliases

### AcknowledgementState

Ƭ **AcknowledgementState**: ``"ACKNOWLEDGEMENT_STATE_UNSPECIFIED"`` \| ``"ACKNOWLEDGEMENT_STATE_PENDING"`` \| ``"ACKNOWLEDGEMENT_STATE_ACKNOWLEDGED"``

The possible acknowledgement states for a subscription.

___

### CancelSurveyReason

Ƭ **CancelSurveyReason**: ``"CANCEL_SURVEY_REASON_UNSPECIFIED"`` \| ``"CANCEL_SURVEY_REASON_NOT_ENOUGH_USAGE"`` \| ``"CANCEL_SURVEY_REASON_TECHNICAL_ISSUES"`` \| ``"CANCEL_SURVEY_REASON_COST_RELATED"`` \| ``"CANCEL_SURVEY_REASON_FOUND_BETTER_APP"`` \| ``"CANCEL_SURVEY_REASON_OTHERS"``

The reason the user selected in the cancel survey.

___

### CanceledStateContext

Ƭ **CanceledStateContext**: { `userInitiatedCancellation`: [`UserInitiatedCancellation`](../interfaces/CdvPurchase.GooglePlay.PublisherAPI.UserInitiatedCancellation.md)  } \| { `systemInitiatedCancellation`: [`SystemInitiatedCancellation`](CdvPurchase.GooglePlay.PublisherAPI.md#systeminitiatedcancellation)  } \| { `developerInitiatedCancellation`: [`DeveloperInitiatedCancellation`](CdvPurchase.GooglePlay.PublisherAPI.md#developerinitiatedcancellation)  } \| { `replacementCancellation`: [`ReplacementCancellation`](CdvPurchase.GooglePlay.PublisherAPI.md#replacementcancellation)  }

Information specific to a subscription in canceled state.

___

### DeveloperInitiatedCancellation

Ƭ **DeveloperInitiatedCancellation**: `unknown`

Information specific to cancellations initiated by developers.

___

### GooglePurchase

Ƭ **GooglePurchase**: [`ProductPurchaseExt`](../interfaces/CdvPurchase.GooglePlay.PublisherAPI.ProductPurchaseExt.md) \| [`SubscriptionPurchaseExt`](../interfaces/CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseExt.md) \| [`SubscriptionPurchaseV2Ext`](../interfaces/CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseV2Ext.md) \| [`GoogleSubscriptionGone`](../interfaces/CdvPurchase.GooglePlay.PublisherAPI.GoogleSubscriptionGone.md)

___

### ReplacementCancellation

Ƭ **ReplacementCancellation**: `unknown`

Information specific to cancellations caused by subscription replacement.

___

### SubscriptionPurchaseLineItem

Ƭ **SubscriptionPurchaseLineItem**: { `expiryTime?`: `string` \| ``null`` ; `productId?`: `string` \| ``null``  } & { `autoRenewingPlan?`: [`AutoRenewingPlan`](../interfaces/CdvPurchase.GooglePlay.PublisherAPI.AutoRenewingPlan.md) \| ``null``  } \| { `prepaidPlan?`: [`PrepaidPlan`](../interfaces/CdvPurchase.GooglePlay.PublisherAPI.PrepaidPlan.md) \| ``null``  }

Item-level info for a subscription purchase.

___

### SubscriptionState

Ƭ **SubscriptionState**: ``"SUBSCRIPTION_STATE_UNSPECIFIED"`` \| ``"SUBSCRIPTION_STATE_PENDING"`` \| ``"SUBSCRIPTION_STATE_ACTIVE"`` \| ``"SUBSCRIPTION_STATE_PAUSED"`` \| ``"SUBSCRIPTION_STATE_IN_GRACE_PERIOD"`` \| ``"SUBSCRIPTION_STATE_ON_HOLD"`` \| ``"SUBSCRIPTION_STATE_CANCELED"`` \| ``"SUBSCRIPTION_STATE_EXPIRED"``

The potential states a subscription can be in, for example whether it is active or canceled.

The items within a subscription purchase can either be all auto renewing plans or prepaid plans.

___

### SystemInitiatedCancellation

Ƭ **SystemInitiatedCancellation**: `unknown`

Information specific to cancellations initiated by Google system.

___

### TestPurchase

Ƭ **TestPurchase**: `unknown`

Whether this subscription purchase is a test purchase.
