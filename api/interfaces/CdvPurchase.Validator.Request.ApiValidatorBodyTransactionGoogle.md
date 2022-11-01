# Interface: ApiValidatorBodyTransactionGoogle

[Validator](../modules/CdvPurchase.Validator.md).[Request](../modules/CdvPurchase.Validator.Request.md).ApiValidatorBodyTransactionGoogle

Transaction type from a google powered device

## Properties

### id

• `Optional` **id**: `string`

Identifier of the transaction to evaluate.

Corresponds to:
- the `orderId` in the receipt from Google.
- the `transactionId` in the receipt from Apple (or bundleID for the application receipt).

**`Required`**

___

### purchaseToken

• `Optional` **purchaseToken**: `string`

Google purchase token.

**`Required`**

___

### receipt

• `Optional` **receipt**: `string`

Google receipt in a JSON-encoded string.

**`Required`**

___

### signature

• `Optional` **signature**: `string`

Google receipt signature (used to validate the local receipt).

**`Required`**

___

### type

• **type**: [`GOOGLE_PLAY`](../enums/CdvPurchase.Platform.md#google_play)

Value `"android-playstore"`
