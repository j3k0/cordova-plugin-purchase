# Interface: ExternalAccountIdentifiers

[GooglePlay](../modules/CdvPurchase.GooglePlay.md).[PublisherAPI](../modules/CdvPurchase.GooglePlay.PublisherAPI.md).ExternalAccountIdentifiers

User account identifier in the third-party service.

## Table of contents

### Properties

- [externalAccountId](CdvPurchase.GooglePlay.PublisherAPI.ExternalAccountIdentifiers.md#externalaccountid)
- [obfuscatedExternalAccountId](CdvPurchase.GooglePlay.PublisherAPI.ExternalAccountIdentifiers.md#obfuscatedexternalaccountid)
- [obfuscatedExternalProfileId](CdvPurchase.GooglePlay.PublisherAPI.ExternalAccountIdentifiers.md#obfuscatedexternalprofileid)

## Properties

### externalAccountId

• `Optional` **externalAccountId**: ``null`` \| `string`

User account identifier in the third-party service. Only present if account linking happened as part of the subscription purchase flow.

___

### obfuscatedExternalAccountId

• `Optional` **obfuscatedExternalAccountId**: ``null`` \| `string`

An obfuscated version of the id that is uniquely associated with the user's account in your app. Present for the following purchases: * If account linking happened as part of the subscription purchase flow. * It was specified using https://developer.android.com/reference/com/android/billingclient/api/BillingFlowParams.Builder#setobfuscatedaccountid when the purchase was made.

___

### obfuscatedExternalProfileId

• `Optional` **obfuscatedExternalProfileId**: ``null`` \| `string`

An obfuscated version of the id that is uniquely associated with the user's profile in your app. Only present if specified using https://developer.android.com/reference/com/android/billingclient/api/BillingFlowParams.Builder#setobfuscatedprofileid when the purchase was made.
