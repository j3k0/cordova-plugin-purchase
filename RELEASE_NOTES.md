# Release Notes - Cordova Plugin Purchase

## 13.10.0

#### (googleplay) Add "isConsumed" to consumed transactions

Local Google Play transaction now contain `isConsumed`, which is the same as `isAcknowledged`, but only set for consumable products.

#### Make it easier to debug callback calls

It's now possible to add a name to callbacks registered with "store.when()"

When callbacks are triggered, the reason is logged to the console.

#### Prevent instanciating CdvPurchase.store twice

So when ionic packages the plugin with the app code, no double instanciations of the plugin is performed.

## 13.9.0

#### (appstore) store.restorePurchases() return potential errors

The return value for `store.restorePurchases()` has been changed from `Promise<void>` to `Promise<IError|undefined>`.

You can now inspect the value returned to figure out if processing complete with or without errors.

#### (appstore) Fix forceReceiptReload

In certain conditions (calls to `order` and `restorePurchases`), the AppStore adapter wants to force a refresh of the application receipt. This fix prevents it from returning the version cached in memory.

## 13.8

### 13.8.6

#### Add CdvPurchase.Utils.platformName()

Convert `CdvPurchase.Platform` enum values to a more user friendly version.

Usage:

```ts
console.log(CdvPurchase.Utils.platformName(myTransaction.platform));

// returns "App Store" or "Google Play" or "Braintree", ....
```

#### Increase expiry monitor's grace period on Google Play

The 10 seconds wait before refreshing an expired subscription on Google Play wasn't enough: increased to 30 seconds.

Ref #1468

### 13.8.5

Fixes for Apple AppStore's introductory periods and
subscription renewals.

#### Load products and receipts in parallel on Apple

This solves the issue with processing the eligibility of
introductory periods.

#### Increase grace period for Apple subscription before refresh

After observing that Apple sometime needs more than a
minute before the API returns the subscription renewal
transaction, we increased the local grace period (time
before refresh) to 90 seconds.

```ts
CdvPurchase.Internal.ExpiryMonitor.GRACE_PERIOD_MS[Platform.APPLE_APPSTORE] = 90000;
```

### 13.8.4

#### Trim product titles on Google Play

Google Play returns the app name in parenthesis in product titles. The plugin
now automatically trims it from the app name.

This behavior can be disabled by setting:

```ts
CdvPurchase.GooglePlay.Adapter.trimProductTitles = false
```

#### Automatically re-validate just-expired subscriptions

The plugin will now monitor active subscripion purchases (as returned by a
receipt validation service) and re-validate the receipt automatically when the
subscription expires or renews.

You can customize the expiry monitor (which should rarely be needed):

```ts
// interval between checks in milliseconds
CdvPurchase.Internal.ExpiryMonitor.INTERVAL_MS = 10000; // default: 10s

// extra time before a subscription is considered expired (when re-validating
// too early, sometime the new transaction isn't available yet).
CdvPurchase.Internal.ExpiryMonitor.GRACE_PERIOD_MS = 10000; // default: 10s
```

#### Add expiry date to Test Adapter's subscription

The expiry date was missing from the test product:

```ts
CdvPurchase.Test.testProducts.PAID_SUBSCRIPTION
```

### 13.8.3

Fix npm package.

### 13.8.2

#### store.applicationUsername can return `undefined`

If no user is logged in, you `applicationUsername` function can return
undefined.

#### Add "productId" and "platform" to Error objects

All errors now include the "platform" and "productId" field (when applicable),
to get more context.

### 13.8.1

#### Fix AppStore eligibility determination of intro period

In the case where the StoreKit SDK doesn't return a "discounts" array,
determining the eligility of the intro period using iaptic was not functional.

### 13.8.0

#### Upgrade to Google Play Billing library 5.2.1

Adds access to offer and base plan identifiers.

#### Handle validator answer with code `VALIDATOR_SUBSCRIPTION_EXPIRED`

For backward compatibility, the validator also support responses with a 6778003
error code (expired) when the validated transaction is expired.

#### Fix: AppStore adapter should only return a localReceipt on iOS

A dummy appstore receipt was listed on other platforms, this is fixed.

#### Prevent various issues

**Prevent double calls to approved callbacks**

Make sure `.approved()` is only called once during a small time frame.

**Skip quick successive calls to store.update()**

The update will be performed only if `store.update()` or `store.initialize()`
was called less than `store.minTimeBetweenUpdates` milliseconds.

This make it safer to always call `store.update()` when entering the app's
Store screen.

**Block double callback registrations**

Throw an error when attempting the re-register an existing callback for a given
event handler. This is indicative of initialization code being run more than
once.

## 13.7.0

#### Fix AppStore introctory prices

Fix a regression with introctory prices on iOS. Unclear when this happened,
according to Apple documentation, the "discounts" array should contain the
introctory prices, but it turns out it does not anymore.

#### Set ES6 as minimal javascript version

Down from ES2015, for broader compatibility.

#### Ensure verify() resolves even if there's no validator

Some user do not specify a receipt validator but want to call
"transaction.verify()" (for example app building frameworks).

This changes makes sure the behavior gets back like it used to be in earlier
versions of the plugin.

## 13.6

### 13.6.0

#### Add store.when().receiptsReady(cb)

The "receiptsReady" event is triggered only once, as soon as all platforms are
done loading the receipts from the SDK.

It can be used by applications that do not rely on receipt validation, in order
to wait for the list of purchases reported by the native SDK to have been
processed. For example, before running some code that check products ownership
statuses at startup.

```ts
// at startup
CdvPurchase.store.when().receiptsReady(() => {
  console.log('All platforms have loaded their local receipts');
  console.log('Feature X: ' + CdvPurchase.store.get('unlock-feature-x').owned);
});
```

If the receipts have already been loaded before you setup this event handler,
it will be called immediately.

Users using a receipt validation server should rely on receiptsVerified()
instead (see below).

#### Add store.when().receiptsVerified(cb)

Similarly to "receiptsReady", "receiptsVerified" is triggered only once: after
all platforms have loaded their receipts and those have been verified by the
receipt validation server.

It can be used by applications that DO rely on receipt validation, in order to
wait for all receipts to have been processed by the receipt validation service.
A good use case is to encapsulate startup code that check products ownership
status.

```ts
// at startup
CdvPurchase.store.when().receiptsVerified(() => {
  console.log('Receipts have been validated');
  if (CdvPurchase.store.get('monthly').owned) {
    openMainScreen();
  }
  else {
    openSubscriptionScreen();
  }
});
```

If the receipts have already been verified before you setup this event handler,
it will be called immediately.

#### Add store.when().pending(cb)

This event handler can be notified when a transaction enters the "PENDING"
state, which happens when a user has "Ask to Buy" enabled, or in country where
cash payment is an option.

```ts
store.when().pending(transaction => {
  // Transaction is pending (waiting for parent approval, cash payment, ...)
});
```

#### Remove autogrouping of products

Starting at version 13.4.0, products were automatically added to the "default"
group. This created more issues than it solved, because it let the plugin
automatically try to replace potentially unrelated products.

People willing to rely on automatic subscription replacement on Android should
explicitely set those product's `group` property when registering them. Or
should use the `oldPurchaseToken` property when making an order.

**Examples:**

```ts
// Replace an old purchase when finalizing the new one on google play.
store.order(product, {
  googlePlay: {
    oldPurchaseToken: 'abcdefghijkl',
    prorationMode: CdvPurchase.GooglePlay.ProrationMode.IMMEDIATE_AND_CHARGE_PRORATED_PRICE,
  }
});

// For those 2 subscription products, the plugin will automatically replace
// the currently owned one (if any) when placing a new order.
store.register([{
  id: 'no_ads_yearly',
  type: ProductType.PAID_SUBSCRIPTION,
  platform: Platform.GOOGLE_PLAY,
  group: 'noAds'
}, {
  id: 'no_ads_monthly',
  type: ProductType.PAID_SUBSCRIPTION,
  platform: Platform.GOOGLE_PLAY,
  group: 'noAds'
}]);
```

## 13.5

### 13.5.0 - Add timeout to validation requests

By default, the plugin will now setup a 20 seconds timeout for receipt validation requests.

Receipt validation timeout can be detected using the following code:

```ts
CdvPurchase.store.when().unverified(function(response) {
  if (response.payload.code === CdvPurchase.ErrorCode.COMMUNICATION) {
    if (response.payload.status === CdvPurchase.Utils.Ajax.HTTP_REQUEST_TIMEOUT) {
      // request timeout
    }
  }
});
```

The value for timeout can be customized by specifying the validator this way:

```ts
CdvPurchase.store.validator = {
  url: 'https://validator.iaptic.com',
  timeout: 30000, // in milliseconds
}
```

## 13.4

### 13.4.3 - Add HTTP status to receipt validation error payload

Let the app know the HTTP status for a failed receipt validation call, in "response.payload.status".

```ts
CdvPurchase.store.when().unverified(response => {
    if (response.payload.code === CdvPurchase.ErrorCode.COMMUNICATION) {
        console.log("HTTP ERROR: " + response.payload.status);
    }
});
```

### 13.4.2 - Fix "owned" status when validator returns "isExpired"

Attempt to fix issue #1406 on iOS, with Ionic v6: `applicationUsername` isn't attached to purchase, it seems like this is due to strings passed as a subclass of NSString on this platform.

### 13.4.1 - Fix "owned" status when validator returns "isExpired"

Issue #1408 fixed. If the validator returns `isExpired`, the `owned()` method was returning an incorrect result.

### 13.4.0 - Product groups and Google Play

Products are now part of the `"default"` group when none is provided, as per the documentation. This is used on Google Play to automatically replace existing subscription by the newly ordered one.

This update can break your app if you have multiple **independent** subscription products on Google Play, as purchasing a subscription product will now cancel any existing one by default.

Use the `group` property in `store.register` to force legacy subscription products to be part of different groups.

## 13.3

Adding back functionalities that existed in version 11 of the plugin, mostly on iOS, and a few fixes. Detail below.

### 13.3.3 - Use canMakePayments on Apple AppStore

`offer.canPurchase` will be false if the platform reports that it doesn't support the "order" functionality.

When you check if the offer can be purchased, the plugin will now use the value from `canMakePurchases` (for Apple AppStore).

```ts
if (!offer.canPurchase) {
  // the given offer cannot be purchased. hide it or hide the buy button.
}
```

If none of the offers can be purchased, you can choose to hide the whole store.

There are 2 reasons why an offer cannot be purchased:

1. Product is already owned (see `product.owned`)
2. The adapter don't support "order()"

If you really want to access the low-level value of `canMakePurchases` you can do it like so:

```
const appStore = store.getAdapter(CdvPurchase.Platform.APPLE_APPSTORE);
if (appStore && appStore.checkSupport('order')) {
  // user can make payments
}
```

Ref #1378

### 13.3.2 - Add support for promotional offers on Apple AppStore

You can order a discount offer by providing additional data to "offer.order()" like so:

```ts
offer.order({
  appStore: {
    discount: {
      id: "discount-id",
      key: "...",
      nonce: "...",
      signature: "...",
      timestamp: "...",
    }
  }
});
```

Check Apple documentation about the meaning of those fields and how to fill them. https://developer.apple.com/documentation/storekit/in-app_purchase/original_api_for_in-app_purchase/subscriptions_and_offers/setting_up_promotional_offers?language=objc

You can check this old example server here: https://github.com/j3k0/nodejs-suboffer-signature-server

### 13.3.1 - Fix "store.order" promise resolution

Wait for the transaction to be purchased or the purchase cancelled before resolving.

Example usage:

```ts
store.order(offer)
  .then((result) => {
    if (result && result.isError) {
      if (result.code === CdvPurchase.ErrorCode.PAYMENT_CANCELLED) {
        // Payment cancelled: window closed by user
      }
      else {
        // Payment failed: check result.message
      }
    }
    else {
      // Success
    }
  });
```

### 13.3.0

#### Add the AppStore `autoFinish` option

Use this if the transaction queue is filled with unwanted transactions (in development).
It's safe to keep this option to "true" when using a receipt validation server and you only sell subscriptions

Example:

```ts
store.initialize([
  {
    platform: Platform.APPLE_APPSTORE,
    options: { autoFinish: true }
  },
  Platform.GOOGLE_PLAY
]);
```

#### Optimize AppStore receipt loaded multiple times in parallel

When the Apple `appStoreReceipt` is loaded from multiple source, it resulted in a lot of duplicate calls. 13.3.0 optimizes this use case.

#### Add transactionId and purchaseId to VerifiedPurchase

It's just a TypeScript definition since the plugin doesn't do much with it, but it has been requested by a few users.

## 13.2

### 13.2.1 - Fixing parsing of incorrectly formatted validator response

### 13.2.0

#### Adding store.when().unverified()

`unverified` will be called when receipt validation failed.

#### Fixing `Product.pricing`

Issue #1368 fixed: `product.pricing` was always `undefined`.

## 13.1

### 13.1.6 - Fixing `appStoreReceipt` null on first launch

Bug hasn't been reproduced, but the fix should handle the error case that happened to this user (based on the provided logs).

### 13.1.5 - AppStore fixes

- 51400ab Adding in-progress transaction to a pseudo receipt
- c0e47b3 Reloading receipt from native side before receipt validation
- 5a8542b Improved error reporting
- 7a80a6d Do not call "finished" for failed transactions
- 348431e Report success/failure of purchase
- e53017c Fix crash when logged out of iCloud (#1354)

### 13.1.4 - AppStore fixes

* b692e21 Don't error if finishing already finished transaction
* 49c0508 Force receipt refresh after order() and restorePurchases()

### 13.1.3

Fixing some receipt validation use cases on Apple devices.

* 9cfce2d Load missing iOS appStoreReceipt when validation call is requested
* 2569147 Update validator functions to include the receipts
* f03a751 Refresh appStoreReceipt if empty at validation stage

### Update to requestPayment()

In the payment request, the `items` array now replace the `productIds` array. Use this array to define the list of items the user is paying for. For example:

```ts
CdvPurchase.store.requestPayment({
  platform: CdvPurchase.Platform.BRAINTREE,
  amountMicros: 11000000,
  currency: 'USD',
  items: [{
    id: 'margherita_large',
    title: 'Pizza Margherita Large',
    pricing: {
      priceMicros: 10000000,
    }
  }, {
    id: 'delivery_standard',
    title: 'Delivery',
    pricing: {
      priceMicros: 1000000,
    }
  }]
});
```

The format for items makes them compatible with products loaded from the stores. You can then manage your inventory on Google Play but allow payment for those Google Play products using Braintree:

```ts
store.register([{
  id: 'five_tokens',
  type: ProductType.CONSUMABLE
  platform: Platform.GOOGLE_PLAY,
}]);

// Later on...
store.requestPayment({
  platform: CdvPurchase.Platform.BRAINTREE,
  amountMicros: 11000000,
  currency: 'USD',
  items: [store.get('five_tokens')],
});
```

See [PaymentRequest](https://github.com/j3k0/cordova-plugin-purchase/blob/master/api/interfaces/CdvPurchase.PaymentRequest.md) and [PaymentRequestItem](https://github.com/j3k0/cordova-plugin-purchase/blob/master/api/interfaces/CdvPurchase.PaymentRequestItem.md) for details.

### Fixes for Braintree.requestPayment()

Bug fixes:

* Properly using the provided `applePayOptions`
* Detecting payment request cancellations by user

### requestPayment() amount computed from items

If the amount is not provided in a payment request, it will be computed as the sum of all items.

Currency will also be retrieved from the items when missing.

## 13.0

This is a full rewrite of the API, updated to allow:

 * using multiple payment processors in parallel
 * exposing multiple offers for a single product and complex pricing
 * exposing purchases from receipts (either local receipts or verified from a server)
 * placing custom payment requests

All JavaScript code has being rewritten in TypeScript, typings are now 100% complete and accurate.

If you're upgrading from an earlier version, check the [migration guide](https://github.com/j3k0/cordova-plugin-purchase/wiki/HOWTO:-Migrate-to-v13).

The native code is built using version 12 as starting point, so all features from version 12 are available as well.

### Braintree

This version introduces support for Braintree as a payment processor, it requires an additional plugin to add the libraries to your project: https://github.com/j3k0/cordova-plugin-purchase-braintree

The Braintree integration supports payment with 3DSecure and Apple Pay.

### Windows Store

Support for payments on Windows Store has been dropped. It will be back in a later version.

### Overview

The new API separates the different concepts with their own first-level entities:

- Products
- Offers
- Receipts
- Transactions

**Products / Offers** will contain the definition of what's available to the user to purchase.

**Receipts / Transactions** will contain details about what the user has purchased.

In the new API, it is possible to initiate transactions not necessarily linked with a product (using payment processors like Braintree).

It defines a generic Adapter interface, implemented by the various payment platforms. The core of the plugin controls and monitors the different active adapters and expose the unified API. Previously, we basically had an iOS implementation of the unified API (using StoreKit), an android implementation, etc... Now, many adapters can coexist in peace.

## 12.0.0

This was a first attempt to port the code to billing library v5. It's not recommended to use this version as, trying to keep the API backward compatible, made it messy and bug prone. Use version 13.

### Upgrade to Google Play Billing library v5.0

With the upgrade to Google Play Billing library v5.0, many things will changes related to subscriptions, most importantly with the introduction of "subscription offers" and "pricing phases".

**Receipt validations**

Note that, at the time of writing this, validating purchases made with the Google Play Billing library v5.0 required the use the the SubscriptionV2 API. This API is already supported by [iaptic](https://www.iaptic.com/), the successor to Fovea's receipt validation service, so it might be a good option if you do not want to implement this new API.

### (Google Play) `store.launchPriceChangeConfirmationFlow` - Update

With Google Play, `store.launchPriceChangeConfirmationFlow(productId, callback)` is now the same as calling `store.manageSubscription()`. The underlying method provided by Google has been removed: https://developer.android.com/reference/com/android/billingclient/api/PriceChangeFlowParams - A deep link to the subscription management page on Google Play is now the newly recommended method.

### NEW: `product.offers` - Subscription Offers support

A single subscription product can now be purchased with different offers. See https://developer.android.com/google/play/billing/subscriptions

To enable this new feature in a backward compatible way, the plugin will generate one product for each offer.

The generated products will have all the attributes of a legacy subscription product, with those noticeable values:

 * `id`: `PARENT_PRODUCT_ID@OFFER_TOKEN`.
 * `group`: `PARENT_PRODUCT_ID`.

The parent product will have an `offers` attributes. It's an array of strings containing the identifiers for all offers available to the user.

You can get the information for those offers with `store.get(offerId)`, they are represented as virtual products.

### NEW: `product.pricingPhases` - Flexible Pricing Phases support

Google now allows more flexible pricing in multiple phases. While it's currently limited to 2 phases, the API doesn't really impose that limitation.

To reflect this, the plugin now include prices in the `product.pricingPhases` attribute. It's an array of phases, with various costs, durations and recurrence modes. When present, this supersedes the legacy way of including prices and durations.

Here is the newly defined type:

```typescript
/** Description of a phase for the pricing of a purchase. */
export interface IPricingPhase {
   /** Price formatted for humans */
   price: string;
   /** Price in micro-units (divide by 1000000 to get numeric price) */
   priceMicros: number;
   /** Currency code */
   currency?: string;
   /** ISO 8601 duration of the period (https://en.wikipedia.org/wiki/ISO_8601#Durations) */
   billingPeriod?: string;
   /** Number of recurrence cycles (if recurrenceMode is FINITE_RECURRING) */
   billingCycles?: number;
   /** Type of recurring payment */
   recurrenceMode?: RecurrenceMode;
   /** Payment mode for the pricing phase ("PayAsYouGo", "UpFront", or "FreeTrial") */
   paymentMode?: IPaymentMode;
}

/**
 * Type of recurring payment
 *
 * - FINITE_RECURRING: Payment recurs for a fixed number of billing period set in `paymentPhase.cycles`.
 * - INFINITE_RECURRING: Payment recurs for infinite billing periods unless cancelled.
 * - NON_RECURRING: A one time charge that does not repeat.
 */
export type RecurrenceMode = "NON_RECURRING" | "FINITE_RECURRING" | "INFINITE_RECURRING";
```

You can also keep the plugin in `v11` compatibility mode using `store.compatibility = 11` (or lower), in which case the legacy "introPrice", "billingPeriod" and such will be filled using the content of the pricingPhases array. Notice that this legacy mode can only support **at most** 2 pricing phases.

When in `v11` compatibility mode:

 - prices and billing periods will be set using values from the last of the pricing phases.
 - intro prices and billing periods will be set with the values from the first pricing phase (if there are more than one)
 - product prices and billing periods will be set using values from the first offer for that product.

### NEW: `store.compatibility` - Legacy compatibility

Let the plugin operate in compatibility mode by filling in deprecated fields. By default, the plugin does not attempt to work in compatibility mode.

* Anything lower than `12` will use the legacy product price definition instead of the more generic `offers` property.
* Anything lower than `10` will use the old names for intro period period definitions.

**NOTE**: the plugin might not be able to describe all Google Play subscription plans in compatibility mode (when non backward-compatible pricing modes are being used, for instance if there are more than 2 pricing phases).

## 11.0.0

### Upgrade to Google Play Billing library v4.0

With the upgrade to the Billing Library v4, the main change was the way subscriptions are upgraded / downgraded. However, as this plugin offers a more high level interface, we were able to implement this migration in a non breaking way.

There are 2 noticeable additions to the API:

####  `store.launchPriceChangeConfirmationFlow(productId, callback)`

Android only: display a generic dialog notifying the user of a subscription price change.

See https://developer.android.com/google/play/billing/subscriptions#price-change-communicate

* This call does nothing on iOS and Microsoft UWP.

##### example usage

```js
   store.launchPriceChangeConfirmationFlow('my_product_id', function(status) {
     if (status === "OK") { /* approved */ }
     if (status === "UserCanceled") { /* dialog canceled by user */ }
     if (status === "UnknownProduct") { /* trying to update price of an unregistered product */ }
   }));
```


#### `"IMMEDIATE_AND_CHARGE_FULL_PRICE"` proration mode

The proration mode is passed to `store.order()`, in the `additionalData.prorationMode` field.

If `IMMEDIATE_AND_CHARGE_FULL_PRICE` proration mode is used when upgrading / downgrading a subscription, the replacement takes effect immediately, and the user is charged full price of new plan and is given a full billing cycle of subscription, plus remaining prorated time from the old plan.


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


## 10.5.4

#### Add support for custom headers to validator call

`store.validatorCustomHeaders` can be set to an object containing keys and values of headers to be sent to the receipt validation server.

See 256a10e baae021

#### Minor changes

 * fb249b6 Adjust validator retry delay
    * When the request to the receipt validator fails, we now increase the retry delay to less agressive values.
 * 91489a4 (android) Query purchase on start every 24h only
    * The plugin used to query for purchases each time the app was sent to foreground.
    * No need to query more often than every 24h, to frequent calls used to causes issues (especially overlapping calls).
    * Ref #1110

#### Chores

 * 7be2fe6 Upgrade Google Billing Library to v3.0.3
 * eda72d7 (typescript) Integrate the documentation
 * f8bd21d (typescript) Add typings for refresh() return value

#### Bug fixes

 * ad70db7 (android) Fix #1126 - DEFERRED prorationMode typo


## 10.5.2

 * 7e9d58b (ios) Fix #1142 - Wrong references to `storekit.ERR_*`


## 10.5.1

 * c98817e Fix type chek error on tsc `^4.0.5`
   * Contributed by @caiiiycuk
 * 08e271d Minor improvement to `store.order()`


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
