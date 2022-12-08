# Interface: AppleTransaction

[AppleAppStore](../modules/CdvPurchase.AppleAppStore.md).[VerifyReceipt](../modules/CdvPurchase.AppleAppStore.VerifyReceipt.md).AppleTransaction

## Table of contents

### Properties

- [app\_account\_token](CdvPurchase.AppleAppStore.VerifyReceipt.AppleTransaction.md#app_account_token)
- [cancellation\_date](CdvPurchase.AppleAppStore.VerifyReceipt.AppleTransaction.md#cancellation_date)
- [cancellation\_date\_ms](CdvPurchase.AppleAppStore.VerifyReceipt.AppleTransaction.md#cancellation_date_ms)
- [cancellation\_reason](CdvPurchase.AppleAppStore.VerifyReceipt.AppleTransaction.md#cancellation_reason)
- [expires\_date](CdvPurchase.AppleAppStore.VerifyReceipt.AppleTransaction.md#expires_date)
- [expires\_date\_ms](CdvPurchase.AppleAppStore.VerifyReceipt.AppleTransaction.md#expires_date_ms)
- [expires\_date\_pst](CdvPurchase.AppleAppStore.VerifyReceipt.AppleTransaction.md#expires_date_pst)
- [in\_app\_ownership\_type](CdvPurchase.AppleAppStore.VerifyReceipt.AppleTransaction.md#in_app_ownership_type)
- [is\_in\_intro\_offer\_period](CdvPurchase.AppleAppStore.VerifyReceipt.AppleTransaction.md#is_in_intro_offer_period)
- [is\_trial\_period](CdvPurchase.AppleAppStore.VerifyReceipt.AppleTransaction.md#is_trial_period)
- [is\_upgraded](CdvPurchase.AppleAppStore.VerifyReceipt.AppleTransaction.md#is_upgraded)
- [offer\_code\_ref\_name](CdvPurchase.AppleAppStore.VerifyReceipt.AppleTransaction.md#offer_code_ref_name)
- [original\_purchase\_date](CdvPurchase.AppleAppStore.VerifyReceipt.AppleTransaction.md#original_purchase_date)
- [original\_purchase\_date\_ms](CdvPurchase.AppleAppStore.VerifyReceipt.AppleTransaction.md#original_purchase_date_ms)
- [original\_purchase\_date\_pst](CdvPurchase.AppleAppStore.VerifyReceipt.AppleTransaction.md#original_purchase_date_pst)
- [original\_transaction\_id](CdvPurchase.AppleAppStore.VerifyReceipt.AppleTransaction.md#original_transaction_id)
- [product\_id](CdvPurchase.AppleAppStore.VerifyReceipt.AppleTransaction.md#product_id)
- [promotional\_offer\_id](CdvPurchase.AppleAppStore.VerifyReceipt.AppleTransaction.md#promotional_offer_id)
- [purchase\_date](CdvPurchase.AppleAppStore.VerifyReceipt.AppleTransaction.md#purchase_date)
- [purchase\_date\_ms](CdvPurchase.AppleAppStore.VerifyReceipt.AppleTransaction.md#purchase_date_ms)
- [purchase\_date\_pst](CdvPurchase.AppleAppStore.VerifyReceipt.AppleTransaction.md#purchase_date_pst)
- [quantity](CdvPurchase.AppleAppStore.VerifyReceipt.AppleTransaction.md#quantity)
- [subscription\_group\_identifier](CdvPurchase.AppleAppStore.VerifyReceipt.AppleTransaction.md#subscription_group_identifier)
- [transaction\_id](CdvPurchase.AppleAppStore.VerifyReceipt.AppleTransaction.md#transaction_id)
- [web\_order\_line\_item\_id](CdvPurchase.AppleAppStore.VerifyReceipt.AppleTransaction.md#web_order_line_item_id)

## Properties

### app\_account\_token

• `Optional` **app\_account\_token**: `string`

The appAccountToken associated with this transaction.

This field is only present if your app supplied an appAccountToken(_:) when the user made the purchase.

___

### cancellation\_date

• `Optional` **cancellation\_date**: `string`

The time Apple customer support canceled a transaction,
in a date-time format similar to the ISO 8601.

This field is only present for refunded transactions.

___

### cancellation\_date\_ms

• `Optional` **cancellation\_date\_ms**: `string`

The time Apple customer support canceled a transaction,
in UNIX epoch time format.

https://developer.apple.com/documentation/appstorereceipts/cancellation_date_ms

___

### cancellation\_reason

• `Optional` **cancellation\_reason**: ``"0"`` \| ``"1"``

The reason for a refunded transaction.

When a customer cancels a transaction, the App Store gives them a refund
and provides a value for this key.

- A value of “1” indicates that the customer canceled their transaction due
  to an actual or perceived issue within your app.
- A value of “0” indicates that the transaction was canceled for another reason;
  for example, if the customer made the purchase accidentally.

___

### expires\_date

• `Optional` **expires\_date**: `string`

The time a subscription expires or when it will renew,
in a date-time format similar to the ISO 8601.

___

### expires\_date\_ms

• `Optional` **expires\_date\_ms**: `string`

The time a subscription expires or when it will renew,
in UNIX epoch time format, in milliseconds.

Use this time format for processing dates.
https://developer.apple.com/documentation/appstorereceipts/expires_date_ms

___

### expires\_date\_pst

• `Optional` **expires\_date\_pst**: `string`

The time a subscription expires or when it will renew, in the Pacific Time zone.

___

### in\_app\_ownership\_type

• `Optional` **in\_app\_ownership\_type**: ``"FAMILY_SHARED"`` \| ``"PURCHASED"``

The relationship of the user with the family-shared purchase to which they have access.

Possible Values:

- `FAMILY_SHARED`: The transaction belongs to a family member who benefits from service.</li>
- `PURCHASED`: The transaction belongs to the purchaser.</li>

___

### is\_in\_intro\_offer\_period

• `Optional` **is\_in\_intro\_offer\_period**: ``"true"`` \| ``"false"``

An indicator of whether an auto-renewable subscription is in the introductory price period.

https://developer.apple.com/documentation/appstorereceipts/is_in_intro_offer_period

___

### is\_trial\_period

• `Optional` **is\_trial\_period**: ``"true"`` \| ``"false"``

An indicator of whether a subscription is in the free trial period.

https://developer.apple.com/documentation/appstorereceipts/is_trial_period

___

### is\_upgraded

• `Optional` **is\_upgraded**: ``"true"`` \| ``"false"``

An indicator that a subscription has been canceled due to an upgrade.

This field is only present for upgrade transactions.

___

### offer\_code\_ref\_name

• `Optional` **offer\_code\_ref\_name**: `string`

Reference name of an offer code used by the user to make this transaction.

___

### original\_purchase\_date

• **original\_purchase\_date**: `string`

The time of the original app purchase, in a date-time format similar to ISO 8601.

___

### original\_purchase\_date\_ms

• **original\_purchase\_date\_ms**: `string`

The time of the original app purchase, in UNIX epoch time format, in milliseconds.

Use this time format for processing dates. For an auto-renewable subscription,
this value indicates the date of the subscription's initial purchase.
The original purchase date applies to all product types and remains the same
in all transactions for the same product ID.
This value corresponds to the original transaction’s transactionDate property
in StoreKit.

___

### original\_purchase\_date\_pst

• **original\_purchase\_date\_pst**: `string`

The time of the original app purchase, in the Pacific Time zone.

___

### original\_transaction\_id

• **original\_transaction\_id**: `string`

The transaction identifier of the original purchase.

https://developer.apple.com/documentation/appstorereceipts/original_transaction_id

___

### product\_id

• **product\_id**: `string`

The unique identifier of the product purchased.

You provide this value when creating the product in App Store Connect,
and it corresponds to the productIdentifier property of the SKPayment object
stored in the transaction's payment property.

___

### promotional\_offer\_id

• `Optional` **promotional\_offer\_id**: `string`

The identifier of the subscription offer redeemed by the user.

https://developer.apple.com/documentation/appstorereceipts/promotional_offer_id

___

### purchase\_date

• **purchase\_date**: `string`

The time the App Store charged the user's account for a purchased or restored product,
or the time the App Store charged the user’s account for a subscription purchase
or renewal after a lapse, in a date-time format similar to ISO 8601.

___

### purchase\_date\_ms

• **purchase\_date\_ms**: `string`

The time the App Store charged the user's account for a purchase or renewal,
in milliseconds since EPOCH.

For consumable, non-consumable, and non-renewing subscription products,
the time the App Store charged the user's account for a purchased or restored product.

For auto-renewable subscriptions, the time the App Store charged the user’s account
for a subscription purchase or renewal after a lapse.

Use this time format for processing dates.

___

### purchase\_date\_pst

• **purchase\_date\_pst**: `string`

The time the App Store charged the user's account for a purchase or renewal,
in the Pacific Time zone.

___

### quantity

• `Optional` **quantity**: `string`

The number of consumable products purchased.

This value corresponds to the quantity property of the SKPayment object
stored in the transaction's payment property.

The value is usually “1” unless modified with a mutable payment.

The maximum value is 10.

___

### subscription\_group\_identifier

• `Optional` **subscription\_group\_identifier**: `string`

The identifier of the subscription group to which the subscription belongs.

The value for this field is identical to the subscriptionGroupIdentifier property
in SKProduct.

___

### transaction\_id

• **transaction\_id**: `string`

A unique identifier for a transaction such as a purchase, restore, or renewal.

https://developer.apple.com/documentation/appstorereceipts/transaction_id

___

### web\_order\_line\_item\_id

• **web\_order\_line\_item\_id**: `string`

A unique identifier for purchase events across devices,
including subscription-renewal events.

This value is the primary key for identifying subscription purchases.
