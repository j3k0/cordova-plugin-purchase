# Interface: SubscriptionPurchaseExt

[GooglePlay](../modules/CdvPurchase.GooglePlay.md).[PublisherAPI](../modules/CdvPurchase.GooglePlay.PublisherAPI.md).SubscriptionPurchaseExt

## Hierarchy

- `SubscriptionPurchase_API`

  ↳ **`SubscriptionPurchaseExt`**

## Table of contents

### Properties

- [acknowledgementState](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseExt.md#acknowledgementstate)
- [autoRenewing](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseExt.md#autorenewing)
- [autoResumeTimeMillis](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseExt.md#autoresumetimemillis)
- [cancelReason](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseExt.md#cancelreason)
- [cancelSurveyResult](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseExt.md#cancelsurveyresult)
- [countryCode](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseExt.md#countrycode)
- [developerPayload](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseExt.md#developerpayload)
- [emailAddress](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseExt.md#emailaddress)
- [expiryTimeMillis](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseExt.md#expirytimemillis)
- [externalAccountId](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseExt.md#externalaccountid)
- [familyName](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseExt.md#familyname)
- [givenName](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseExt.md#givenname)
- [introductoryPriceInfo](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseExt.md#introductorypriceinfo)
- [kind](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseExt.md#kind)
- [linkedPurchaseToken](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseExt.md#linkedpurchasetoken)
- [obfuscatedExternalAccountId](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseExt.md#obfuscatedexternalaccountid)
- [obfuscatedExternalProfileId](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseExt.md#obfuscatedexternalprofileid)
- [orderId](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseExt.md#orderid)
- [paymentState](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseExt.md#paymentstate)
- [priceAmountMicros](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseExt.md#priceamountmicros)
- [priceChange](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseExt.md#pricechange)
- [priceCurrencyCode](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseExt.md#pricecurrencycode)
- [productId](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseExt.md#productid)
- [profileId](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseExt.md#profileid)
- [profileName](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseExt.md#profilename)
- [promotionCode](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseExt.md#promotioncode)
- [promotionType](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseExt.md#promotiontype)
- [purchaseType](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseExt.md#purchasetype)
- [startTimeMillis](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseExt.md#starttimemillis)
- [userCancellationTimeMillis](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPurchaseExt.md#usercancellationtimemillis)

## Properties

### acknowledgementState

• `Optional` **acknowledgementState**: ``null`` \| `number`

The acknowledgement state of the subscription product. Possible values are: 0. Yet to be acknowledged 1. Acknowledged

#### Inherited from

SubscriptionPurchase\_API.acknowledgementState

___

### autoRenewing

• `Optional` **autoRenewing**: ``null`` \| `boolean`

Whether the subscription will automatically be renewed when it reaches its current expiry time.

#### Inherited from

SubscriptionPurchase\_API.autoRenewing

___

### autoResumeTimeMillis

• `Optional` **autoResumeTimeMillis**: ``null`` \| `string`

Time at which the subscription will be automatically resumed, in milliseconds since the Epoch. Only present if the user has requested to pause the subscription.

#### Inherited from

SubscriptionPurchase\_API.autoResumeTimeMillis

___

### cancelReason

• `Optional` **cancelReason**: ``null`` \| `number`

The reason why a subscription was canceled or is not auto-renewing. Possible values are: 0. User canceled the subscription 1. Subscription was canceled by the system, for example because of a billing problem 2. Subscription was replaced with a new subscription 3. Subscription was canceled by the developer

#### Inherited from

SubscriptionPurchase\_API.cancelReason

___

### cancelSurveyResult

• `Optional` **cancelSurveyResult**: [`SubscriptionCancelSurveyResult`](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionCancelSurveyResult.md)

Information provided by the user when they complete the subscription cancellation flow (cancellation reason survey).

#### Inherited from

SubscriptionPurchase\_API.cancelSurveyResult

___

### countryCode

• `Optional` **countryCode**: ``null`` \| `string`

ISO 3166-1 alpha-2 billing country/region code of the user at the time the subscription was granted.

#### Inherited from

SubscriptionPurchase\_API.countryCode

___

### developerPayload

• `Optional` **developerPayload**: ``null`` \| `string`

A developer-specified string that contains supplemental information about an order.

#### Inherited from

SubscriptionPurchase\_API.developerPayload

___

### emailAddress

• `Optional` **emailAddress**: ``null`` \| `string`

The email address of the user when the subscription was purchased. Only present for purchases made with 'Subscribe with Google'.

#### Inherited from

SubscriptionPurchase\_API.emailAddress

___

### expiryTimeMillis

• `Optional` **expiryTimeMillis**: ``null`` \| `string`

Time at which the subscription will expire, in milliseconds since the Epoch.

#### Inherited from

SubscriptionPurchase\_API.expiryTimeMillis

___

### externalAccountId

• `Optional` **externalAccountId**: ``null`` \| `string`

User account identifier in the third-party service. Only present if account linking happened as part of the subscription purchase flow.

#### Inherited from

SubscriptionPurchase\_API.externalAccountId

___

### familyName

• `Optional` **familyName**: ``null`` \| `string`

The family name of the user when the subscription was purchased. Only present for purchases made with 'Subscribe with Google'.

#### Inherited from

SubscriptionPurchase\_API.familyName

___

### givenName

• `Optional` **givenName**: ``null`` \| `string`

The given name of the user when the subscription was purchased. Only present for purchases made with 'Subscribe with Google'.

#### Inherited from

SubscriptionPurchase\_API.givenName

___

### introductoryPriceInfo

• `Optional` **introductoryPriceInfo**: [`IntroductoryPriceInfo`](CdvPurchase.GooglePlay.PublisherAPI.IntroductoryPriceInfo.md)

Introductory price information of the subscription. This is only present when the subscription was purchased with an introductory price. This field does not indicate the subscription is currently in introductory price period.

#### Inherited from

SubscriptionPurchase\_API.introductoryPriceInfo

___

### kind

• **kind**: ``"androidpublisher#subscriptionPurchase"``

#### Overrides

SubscriptionPurchase\_API.kind

___

### linkedPurchaseToken

• `Optional` **linkedPurchaseToken**: ``null`` \| `string`

The purchase token of the originating purchase if this subscription is one of the following: 0. Re-signup of a canceled but non-lapsed subscription 1. Upgrade/downgrade from a previous subscription For example, suppose a user originally signs up and you receive purchase token X, then the user cancels and goes through the resignup flow (before their subscription lapses) and you receive purchase token Y, and finally the user upgrades their subscription and you receive purchase token Z. If you call this API with purchase token Z, this field will be set to Y. If you call this API with purchase token Y, this field will be set to X. If you call this API with purchase token X, this field will not be set.

#### Inherited from

SubscriptionPurchase\_API.linkedPurchaseToken

___

### obfuscatedExternalAccountId

• `Optional` **obfuscatedExternalAccountId**: ``null`` \| `string`

An obfuscated version of the id that is uniquely associated with the user's account in your app. Present for the following purchases: * If account linking happened as part of the subscription purchase flow. * It was specified using https://developer.android.com/reference/com/android/billingclient/api/BillingFlowParams.Builder#setobfuscatedaccountid when the purchase was made.

#### Inherited from

SubscriptionPurchase\_API.obfuscatedExternalAccountId

___

### obfuscatedExternalProfileId

• `Optional` **obfuscatedExternalProfileId**: ``null`` \| `string`

An obfuscated version of the id that is uniquely associated with the user's profile in your app. Only present if specified using https://developer.android.com/reference/com/android/billingclient/api/BillingFlowParams.Builder#setobfuscatedprofileid when the purchase was made.

#### Inherited from

SubscriptionPurchase\_API.obfuscatedExternalProfileId

___

### orderId

• `Optional` **orderId**: ``null`` \| `string`

The order id of the latest recurring order associated with the purchase of the subscription. If the subscription was canceled because payment was declined, this will be the order id from the payment declined order.

#### Inherited from

SubscriptionPurchase\_API.orderId

___

### paymentState

• `Optional` **paymentState**: ``null`` \| `number`

The payment state of the subscription. Possible values are: 0. Payment pending 1. Payment received 2. Free trial 3. Pending deferred upgrade/downgrade Not present for canceled, expired subscriptions.

#### Inherited from

SubscriptionPurchase\_API.paymentState

___

### priceAmountMicros

• `Optional` **priceAmountMicros**: ``null`` \| `string`

Price of the subscription, For tax exclusive countries, the price doesn't include tax. For tax inclusive countries, the price includes tax. Price is expressed in micro-units, where 1,000,000 micro-units represents one unit of the currency. For example, if the subscription price is €1.99, price_amount_micros is 1990000.

#### Inherited from

SubscriptionPurchase\_API.priceAmountMicros

___

### priceChange

• `Optional` **priceChange**: [`SubscriptionPriceChange`](CdvPurchase.GooglePlay.PublisherAPI.SubscriptionPriceChange.md)

The latest price change information available. This is present only when there is an upcoming price change for the subscription yet to be applied. Once the subscription renews with the new price or the subscription is canceled, no price change information will be returned.

#### Inherited from

SubscriptionPurchase\_API.priceChange

___

### priceCurrencyCode

• `Optional` **priceCurrencyCode**: ``null`` \| `string`

ISO 4217 currency code for the subscription price. For example, if the price is specified in British pounds sterling, price_currency_code is "GBP".

#### Inherited from

SubscriptionPurchase\_API.priceCurrencyCode

___

### productId

• `Optional` **productId**: `string`

___

### profileId

• `Optional` **profileId**: ``null`` \| `string`

The Google profile id of the user when the subscription was purchased. Only present for purchases made with 'Subscribe with Google'.

#### Inherited from

SubscriptionPurchase\_API.profileId

___

### profileName

• `Optional` **profileName**: ``null`` \| `string`

The profile name of the user when the subscription was purchased. Only present for purchases made with 'Subscribe with Google'.

#### Inherited from

SubscriptionPurchase\_API.profileName

___

### promotionCode

• `Optional` **promotionCode**: ``null`` \| `string`

The promotion code applied on this purchase. This field is only set if a vanity code promotion is applied when the subscription was purchased.

#### Inherited from

SubscriptionPurchase\_API.promotionCode

___

### promotionType

• `Optional` **promotionType**: ``null`` \| `number`

The type of promotion applied on this purchase. This field is only set if a promotion is applied when the subscription was purchased. Possible values are: 0. One time code 1. Vanity code

#### Inherited from

SubscriptionPurchase\_API.promotionType

___

### purchaseType

• `Optional` **purchaseType**: ``null`` \| `number`

The type of purchase of the subscription. This field is only set if this purchase was not made using the standard in-app billing flow. Possible values are: 0. Test (i.e. purchased from a license testing account) 1. Promo (i.e. purchased using a promo code)

#### Inherited from

SubscriptionPurchase\_API.purchaseType

___

### startTimeMillis

• `Optional` **startTimeMillis**: ``null`` \| `string`

Time at which the subscription was granted, in milliseconds since the Epoch.

#### Inherited from

SubscriptionPurchase\_API.startTimeMillis

___

### userCancellationTimeMillis

• `Optional` **userCancellationTimeMillis**: ``null`` \| `string`

The time at which the subscription was canceled by the user, in milliseconds since the epoch. Only present if cancelReason is 0.

#### Inherited from

SubscriptionPurchase\_API.userCancellationTimeMillis
