# Release Notes - Cordova Plugin Purchase


## 11.0.0

### Upgrade to Google Play Billing library v4.0

With the upgrade to the Billing Library v4, the main change was the way
subscriptions are upgraded / downgraded. However, as this plugin offers a more
high level interface, we were able to implement this migration in a non
breaking way.

There are 2 noticeable additions to the API:

####  Add `store.launchPriceChangeConfirmationFlow(productId, callback)`

#### `"IMMEDIATE_AND_CHARGE_FULL_PRICE"` proration mode

New proration mode that can be used when upgrading / downgrading a subscription.

The replacement takes effect immediately, and the user is charged full price of
new plan and is given a full billing cycle of subscription, plus remaining
prorated time from the old plan.


## 10.6.1

Bug fixes:

 * c5fdc88 (android) Fix #1223 - Product with no title
 * 0f828c6 (android) Fix issue in order() when `additionalData` is undefined


## 10.6.0

### Use the advanced-http plugin when installed

Receipt validation requests will use the [advanced-http plugin](https://github.com/silkimen/cordova-plugin-advanced-http) when it is installed.

This allows to setup some extra options (like header authentication) and get rid of CORS issues.

See 68a6c3f

### Bug fixes

 * 29af7bd (ios) Fix #1190 crash when order invalid product
 * 98f7323 (android) Fix #1201: Parsing of free trial periods


## 10.5.0

**XCode 12** (with support for iOS 14.0 new APIs) **is required to use this version of the plugin for iOS**.

#### dd6bf6f Add `store.redeem()`

Redeems a promotional offer from within the app.

   * On iOS, calling `store.redeem()` will open the Code Redemption Sheet.
       * See the [offer codes documentation](https://developer.apple.com/app-store/subscriptions/#offer-codes) for details.
   * This call does nothing on Android and Microsoft UWP.

**example usage**

```js
    store.redeem();
```


## 10.4.0

This release contains fixes for minor bugs and edge cases.

#### c579e87 Improve use of `isExpired` collection field

The plugin now better handles the case where the receipt validator reports a subscription as expired using the `collection` field, even when this happens when validating the application receipt.

In particular, with this change, the `expired` event will be triggered when subscription expiry is set this way.

#### c0fc12e (ios) Limit interactive renewals detection to 1 hour

This fixes an issue where, for some users, the receipt was ever-refreshing because the plugin though it just expired, while this happened long ago.

#### 43eff81 (ios) Don't assume in_app array is sorted

`in_app` used to be sorted chronologically, it's not true anymore. It was a bad assumption anyway.

#### fba6605 (ios) Fix #1123 - Found nil parameter when creating SKPaymentDiscount

`SKPaymentDiscount` was mistakenly initiated with `nil` parameters, which iOS 14.1 started to complain about.

#### Chores

 * 9193479 Add `store.applicationUsername` to typescript definitions
 * c1612e6 (ios) Remove "const" from ios-adapter.js
   * Keep the plugin compatible with old javascript engines.


## 10.3.0

### (android) Upgrade to Google Play Billing Library to 3.0.0

The upgrade to the latest version of Google Play Billing Library comes with some difference, mainly in the native code, but also some new features and modified options.

#### Subscription proration modes

When upgrading and downgrading a subscription, you can now specify the proration mode, i.e. when and how the replacement will take place.

To support this, the plugin now accepts the `prorationMode` key in the `additionalData` passed to the `store.order()` function. Itis a string that describes the proration mode to apply when upgrading/downgrading a subscription with `oldSku` on Android. See https://developer.android.com/google/play/billing/subs#change

**Possible values:**
 - `DEFERRED` - Replacement takes effect when the old plan expires, and the new price will be charged at the same time.
 - `IMMEDIATE_AND_CHARGE_PRORATED_PRICE` - Replacement takes effect immediately, and the billing cycle remains the same.
 - `IMMEDIATE_WITHOUT_PRORATION` - Replacement takes effect immediately, and the new price will be charged on next recurrence time.
 - `IMMEDIATE_WITH_TIME_PRORATION` - Replacement takes effect immediately, and the remaining time will be prorated and credited to the user.

#### Removing developerPayload

`developerPayload` isn't supported anymore with Billing Library v3. See https://developer.android.com/google/play/billing/developer-payload

#### Update the subscription upgrade / downgrade

The new version now requires the `oldPurchaseToken` next to the `oldSku` to upgrade a subscription. This is a random string that identifies a purchase. The plugin is smart enough to figure it out for you when upgrading a subscription so there shouldn't be a reason to update your code.

However, it's now possible to force the value for this parameter (in case you have a doubt whether the running instance of your app doesn't have the latest data, this might safeguard against a unwanted upgrade).

### (all) Add `.failed` and `.cancelled` to `refresh()` return value

Allows apps to display some UI element while the `refresh()` operation is in progress.

### Disable retrying validator for expired subscription

This code dates from the era before Apple was returning the `latest_receipt_info` in the validator. There is no need to refresh the receipt anymore to make sure we have the latest info.

### Bugs

- (ios) Fix #1066 bug readonly property with WKWebView
- (ios) #1092 Disable appStoreReceipt refresh on purchase
   - Calling refreshReceipt on iOS was triggering an unecessary password prompt, different from the fingerprint validation required by a purchase.


## 10.2.0

### (all) Add `product.device` to validation requests

This will extend the info already retrieved from cordova-plugin-device. See f636bcf

### (android) Upgrade play billing library to 2.2.0

See  f0da787

### (all) Set `ineligibleForIntroPrice` to all group members

When a product is ineligible for introductory price, all members of the subscriptions group should be ineligible as well. See fc1b39e


## 10.1.2

### Add promise-like return value to store.refresh

`store.refresh()` now returns a promise-like object with the following functions:
- `.completed(fn)` - Calls `fn` when the queue of previous purchases have been processed. At this point, all previously owned products should be in the approved state.
- `.finished(fn)` - Calls `fn` when all purchased in the approved state have been finished or expired.

In the case of the restore purchases call, you will want to hide any progress bar when the `finished` callback is called.

```html
<button onclick="restorePurchases()">Restore Purchases</button>
```

```js
function restorePurchases() {
   showProgress();
   store.refresh().finished(hideProgress);
}
```


## 10.1.1

* (ios) Refresh `appStoreReceipt` when purchase starts
* (ios) Add `appStoreReceipt` to `approved` products
* Fix `store.register()` when given an empty array


## 10.1.0

### (ios) Add support for deferred purchases

Add `deferred` status information to products in the `INITIATED `state.
- `product.deferred` - Purchase has been initiated but is waiting for external action (for example, Ask to Buy on iOS).

see https://developer.apple.com/documentation/storekit/skpaymenttransactionstate/skpaymenttransactionstatedeferred

### (ios) Show restore receipt error reason

Add the native error code from restorePurchases to the error message.

### (android) Implement store.update()

Refresh the status of purchase (pretty much same as `store.refresh()`)

### (all) Send device information with validation requests.

Add information to receipt validation requests that can serve different functions:

- handling support requests
- fraud detection
- analytics
- tracking

Information sent to the validator can be customized with `store.validator_privacy_policy`
- `store.validator_privacy_policy` is an array of allowed functions.
    - `fraud` - send data required for fraud detection.
        - A hashed fingerprint of the device identifier or model. It allows to trigger alerts on your server when a lot of devices share a single receipt.
    - `support` - send information required for handling support request (OS, OS version, Device Manufacturer, Cordova version, ...)
    - `analytics` - same data as `support`, but indicate you'll make a different use of the data.
    - `tracking` - send device identifiers and/or uuid (if available).

Default: `store.validator_privacy_policy = ['fraud', 'support', 'analytics']`

**Important**: this feature requires the `cordova-plugin-device` plugin to be installed!

See 58e24c3


## 10.0.1

### Android

- (FIX) Purchases were reported incorrectly (See #967)


## 10.0.0

This release improves greatly the plugin's support of auto-renewing subscriptions, with features including discounts, subscription groups, billing periods, billing management, application receipts, plus some neat additions to the API. Here's the detail.

**Important**: New minimal system requirements for Apple devices is now **XCode 10.2** (for support of Discount Offers on iOS and OSX).

### store.update()

The new API method `store.update()` is a lightweight version of `store.refresh()`. It performs a similar function but guarantees never to ask for the user's password.

This new method is recommended to call whenever your user enters the Store screen (to ensure the most up-to-date prices are being displayed) or account status screen (to ensure subscriptions or ownership status are up-to-date as well).

See https://github.com/j3k0/cordova-plugin-purchase/blob/master/doc/api.md#-storeupdate for details.

### Discount offers

The plugin now has full support for introductory offers and discounts for subscriptions.

Product's `introPrice*` and `discounts.*` fields contain details about available discounts.

See the related product attributes for details: https://github.com/j3k0/cordova-plugin-purchase/blob/master/doc/api.md#storeproduct-public-attributes

### Subscription groups on iOS

`product.group` is now filled automatically for iOS subscription product.

### Billing period fields

2 new fields are now exposed for subscription products: `billingPeriod` and `billingPeriodUnit`. They give you access to the billing cycle definition for the subscription. See the product attributes for details: https://github.com/j3k0/cordova-plugin-purchase/blob/master/doc/api.md#storeproduct-public-attributes

### Manage billing

On iOS and Android, the new `store.manageBilling()` call will open the AppStore / Google Play page where the user can update his/her payment details (like the credit card associated with their account).

For example, you can now provide a direct link to this screen to a user which subscription renewal failed.

### Application receipt

Better support for application receipts for iOS. A `product` whose type is `store.APPLICATION` is created for you. It can be validated to update data for all products based on the receipt.

### Parse `collection` from receipt validator

When the receipt validator returns a `collection` field, it will be used to fill any field of the products. A collection is a map whose keys are product identifiers and values an object with fields to set.

Example: `{..., "collection": { "my_subscription": { "expiryDate": "2019-12-01T10:00Z" } }`

### New error codes

New error codes than have been introduced since iOS 11 are now reported, instead of a generic error code.

* `store.ERR_PRODUCT_NOT_AVAILABLE` -- Error code indicating that the requested product is not available in the store.
* `store.ERR_CLOUD_SERVICE_PERMISSION_DENIED` -- Error code indicating that the user has not allowed access to Cloud service information.
* `store.ERR_CLOUD_SERVICE_NETWORK_CONNECTION_FAILED` -- Error code indicating that the device could not connect to the network.
* `store.ERR_CLOUD_SERVICE_REVOKED` -- Error code indicating that the user has revoked permission to use this cloud service.
* `store.ERR_PRIVACY_ACKNOWLEDGEMENT_REQUIRED` -- Error code indicating that the user has not yet acknowledged Apple’s privacy policy for Apple Music.
* `store.ERR_UNAUTHORIZED_REQUEST_DATA` -- Error code indicating that the app is attempting to use a property for which it does not have the required entitlement.
* `store.ERR_INVALID_OFFER_IDENTIFIER` -- Error code indicating that the offer identifier is invalid.
* `store.ERR_INVALID_OFFER_PRICE` -- Error code indicating that the price you specified in App Store Connect is no longer valid.
* `store.ERR_INVALID_SIGNATURE` -- Error code indicating that the signature in a payment discount is not valid.
* `store.ERR_MISSING_OFFER_PARAMS` -- Error code indicating that parameters are missing in a payment discount.

### Fixes and minor updates

- (ios) Set applicationUsername in purchase requests
- (ios) Don't cache appStoreReceipt in localStorage
- (all) Fully restore the state of a product when purchase has been cancelled
- (all) Watch and verify expired subscriptions
- (all) Add `store.getApplicationUsername()`
- (all) Add `store.platform` (apple, google or windows)
- (android) Fix reporting purchase cancellation
- (ios,osx) Remove support for XCode 9
- update typescript


## 9.0.0

### Android full rewrite

The native side has be re-implemented using the Billing Library v2. We wiped out the old code completely.

If your app follows all implementation recommendations, you shouldn't have anything to change in your application. In particular:

1. Finish approved transactions with `.finish()`, optionally after receipt validation.
2. Be ready to handle purchase events as soon as the application starts.

Those steps were already required on iOS, they're now as well on Android.

Some explanation can be found on Android Billing Library release notes: https://developer.android.com/google/play/billing/billing_library_releases_notes#release-2_0

- Google now requires apps to *acknowledge* purchases (which is done by calling `finish()`).
- Google Play now supports Pending Transactions, which will can be handled on a subsequent application startup (potentially on a different device).

More at the link above.

### store.applicationUsername

For the same reason as above. The new API ensure `applicationUsername` can be made available to the plugin whenever needed. A nice side effect is that it will now be added to all receipt validation requests (before, it was only there at purchase time).

See https://github.com/j3k0/cordova-plugin-purchase/blob/master/doc/api.md#storeapplicationusername for details.

### subscription groups

`product.group` now contains the name of the group a subscription product is a member of (default to `"default"`).

Only 1 product in a subscription group can be owned. On Android, purchasing a new subscription in the same group will replace the existing active one (if any).

### store.developerPayload

`developerPayload` used to be set at purchase time (as additional data, but this won't work anymore with the new Android Billing Library (with Pending Transactions), thus the introduction of this new API.

See https://github.com/j3k0/cordova-plugin-purchase/blob/master/doc/api.md#storedeveloperpayload for details.

### store.developerName

An optional string of developer profile name. This value can be used for payment risk evaluation (Android only).

See https://github.com/j3k0/cordova-plugin-purchase/blob/master/doc/api.md#storedevelopername

### General

- `cordova-plugin-purchase` is now the official name for the plugin
- Fix: Typescript definitions


## 8.1.1

### (android/windows) Auto-retry failed initialization

 * Ported the auto-retry-initialization logic from the iOS implementation to android and windows.

_Contributor: Jean-Christophe Hoelt_

### Documentation

A lot of minor improvements to the documentation.


## 8.1.0

### macOS support

 * macOS In-App Purchase is not supported. It shares most of the iOS implementation.
 * The implementation is 100% compatible with iOS.

_Contributor: Giuseppe La Torre_

### Disable Hosted Content (Apple)

You can now omit automatic downloading of hosted content by setting the `disableHostedContent` store flag, for example:

```js
    store.disableHostedContent = true;
```

_Contributor: Dave Alden_

### Android ANR fix

 * Backported some code from frostwire that fixes an occasional ANR at startup in `IabHelper`.

_Contributors: Jean-Christophe Hoelt, Dave Alden_


## 8.0.0

### Microsoft Window UWP Support

With the addition of the UWP support, you can now target Windows 10, XBox and Windows 10 Mobile. All product types are supported: Subscriptions, Consumables and Non-Consumables.

Thanks to SimPlan for co-funding this feature!

### Introductory Prices

Support for Introductory Prices have been added to iOS, Android and Windows.

New fields added to product objects:

 - `product.introPrice` - Localized introductory price, with currency symbol
 - `product.introPriceMicros` - Introductory price in micro-units (divide by 1000000 to get numeric price)
 - `product.introPriceNumberOfPeriods` - number of periods the introductory price is available
 - `product.introPriceSubscriptionPeriod` - Period for the introductory price ("Day", "Week", "Month" or "Year")
 - `product.introPricePaymentMode` - Payment mode for the introductory price ("PayAsYouGo", "UpFront", or "FreeTrial")
 - `product.ineligibleForIntroPrice` - True when a trial or introductory price has been applied to a subscription. Only available after receipt validation. Available only on iOS

### Refresh Receipt from validation server (iOS)

Validation servers can now inform the client that the most up-to-date receipt have been used. On iOS, the plugin had to refresh the receipt when the subscription expired, thus opening the AppStore password popup for the user. This can now be prevented by returning the `latestReceipt` from the validation server.

### Remove iOS 6 support

Support for `receipt.forTransaction` has been dropped. Per-transaction receipts were a thing prior to iOS 7. Everyone now uses per-application receipts.

### Subscription Expiry Date

Two new fields have been added to subscription products:

 - `product.expiryDate` - Latest known expiry date for a subscription (a javascript Date)
 - `product.lastRenewalDate - Latest date a subscription was renewed (a javascript Date)

Those are filled using data from the local receipt on Android and Windows. For iOS, it has to be returned by the receipt validation server (other platform will also update the value based on what the server returns).

### Compatibility

This version has been tested with the following cordova platforms versions.

 * cordova-android 6.4.0, 7.1.0, 7.1.4, 8.0.0.
    * 2 versions are known to fail: 7.1.1 and 7.1.2, a bug fix in cordova-android@7.1.1 created other issues, like breaking a few plugins installation (including this one).
 * cordova-ios 4.5.5 and 5.0.1
 * cordova-osx 4.5.5 and 5.0.0
 * cordova-windows 7.0.0
 * cordova 7.1.0, 8.1.2, 9.0.0
