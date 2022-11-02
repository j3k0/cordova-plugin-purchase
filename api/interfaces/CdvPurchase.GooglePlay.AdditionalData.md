# Interface: AdditionalData

[CdvPurchase](../modules/CdvPurchase.md).[GooglePlay](../modules/CdvPurchase.GooglePlay.md).AdditionalData

## Table of contents

### Properties

- [accountId](CdvPurchase.GooglePlay.AdditionalData.md#accountid)
- [offerToken](CdvPurchase.GooglePlay.AdditionalData.md#offertoken)
- [oldPurchaseToken](CdvPurchase.GooglePlay.AdditionalData.md#oldpurchasetoken)
- [profileId](CdvPurchase.GooglePlay.AdditionalData.md#profileid)
- [prorationMode](CdvPurchase.GooglePlay.AdditionalData.md#prorationmode)

## Properties

### accountId

• `Optional` **accountId**: `string`

Obfuscated user account identifier

Default to md5(store.applicationUsername)

___

### offerToken

• `Optional` **offerToken**: `string`

The GooglePlay offer token

___

### oldPurchaseToken

• `Optional` **oldPurchaseToken**: `string`

Replace another purchase with the new one

Your can find the old token in the receipts.

___

### profileId

• `Optional` **profileId**: `string`

Some applications allow users to have multiple profiles within a single account.

Use this method to send the user's profile identifier to Google.

___

### prorationMode

• `Optional` **prorationMode**: [`ProrationMode`](../enums/CdvPurchase.GooglePlay.ProrationMode.md)

See https://github.com/j3k0/cordova-plugin-purchase/blob/master/doc/api.md#storeorderproduct-additionaldata for details
