# Namespace: CdvPurchase

Namespace for the cordova-plugin-purchase plugin.

All classes, enumerations and variables defined by the plugin are in this namespace.

Throughout the documentation, in order to keep examples readable, we omit the `CdvPurchase` prefix.

When you see, for example `ProductType.PAID_SUBSCRIPTION`, it refers to `CdvPurchase.ProductType.PAID_SUBSCRIPTION`.

In your code, you should access members directly through the CdvPurchase namespace:

```ts
// Recommended approach (works reliably with minification)
CdvPurchase.store.initialize();
CdvPurchase.store.register({
  id: 'my-product',
  type: CdvPurchase.ProductType.PAID_SUBSCRIPTION,
  platform: CdvPurchase.Platform.APPLE_APPSTORE
});
```

Note: Using destructuring with the namespace may cause issues with minification tools:

```ts
// NOT recommended - may cause issues with minification tools like Terser
const { store, ProductType, Platform, LogLevel } = CdvPurchase;
```

## Table of contents

### Namespaces

- [AppleAppStore](CdvPurchase.AppleAppStore.md)
- [ApplePay](CdvPurchase.ApplePay.md)
- [Braintree](CdvPurchase.Braintree.md)
- [GooglePlay](CdvPurchase.GooglePlay.md)
- [IapticJS](CdvPurchase.IapticJS.md)
- [PlatformOptions](CdvPurchase.PlatformOptions.md)
- [Test](CdvPurchase.Test.md)
- [Utils](CdvPurchase.Utils.md)
- [Validator](CdvPurchase.Validator.md)
- [WindowsStore](CdvPurchase.WindowsStore.md)

### Enumerations

- [CancelationReason](../enums/CdvPurchase.CancelationReason.md)
- [ErrorCode](../enums/CdvPurchase.ErrorCode.md)
- [LogLevel](../enums/CdvPurchase.LogLevel.md)
- [PaymentMode](../enums/CdvPurchase.PaymentMode.md)
- [Platform](../enums/CdvPurchase.Platform.md)
- [PriceConsentStatus](../enums/CdvPurchase.PriceConsentStatus.md)
- [ProductType](../enums/CdvPurchase.ProductType.md)
- [RecurrenceMode](../enums/CdvPurchase.RecurrenceMode.md)
- [RenewalIntent](../enums/CdvPurchase.RenewalIntent.md)
- [TransactionState](../enums/CdvPurchase.TransactionState.md)

### Classes

- [Iaptic](../classes/CdvPurchase.Iaptic.md)
- [Logger](../classes/CdvPurchase.Logger.md)
- [Offer](../classes/CdvPurchase.Offer.md)
- [PaymentRequestPromise](../classes/CdvPurchase.PaymentRequestPromise.md)
- [Product](../classes/CdvPurchase.Product.md)
- [Receipt](../classes/CdvPurchase.Receipt.md)
- [Store](../classes/CdvPurchase.Store.md)
- [Transaction](../classes/CdvPurchase.Transaction.md)
- [VerifiedReceipt](../classes/CdvPurchase.VerifiedReceipt.md)

### Interfaces

- [Adapter](../interfaces/CdvPurchase.Adapter.md)
- [AdditionalData](../interfaces/CdvPurchase.AdditionalData.md)
- [Console](../interfaces/CdvPurchase.Console.md)
- [IError](../interfaces/CdvPurchase.IError.md)
- [IRegisterProduct](../interfaces/CdvPurchase.IRegisterProduct.md)
- [IapticConfig](../interfaces/CdvPurchase.IapticConfig.md)
- [PaymentRequest](../interfaces/CdvPurchase.PaymentRequest.md)
- [PaymentRequestItem](../interfaces/CdvPurchase.PaymentRequestItem.md)
- [PostalAddress](../interfaces/CdvPurchase.PostalAddress.md)
- [PricingPhase](../interfaces/CdvPurchase.PricingPhase.md)
- [Storefront](../interfaces/CdvPurchase.Storefront.md)
- [TransactionMonitor](../interfaces/CdvPurchase.TransactionMonitor.md)
- [UnverifiedReceipt](../interfaces/CdvPurchase.UnverifiedReceipt.md)
- [VerifiedPurchase](../interfaces/CdvPurchase.VerifiedPurchase.md)
- [When](../interfaces/CdvPurchase.When.md)

### Type Aliases

- [Callback](CdvPurchase.md#callback)
- [IPeriodUnit](CdvPurchase.md#iperiodunit)
- [Obfuscator](CdvPurchase.md#obfuscator)
- [PlatformFunctionality](CdvPurchase.md#platformfunctionality)
- [PlatformWithOptions](CdvPurchase.md#platformwithoptions)
- [PrivacyPolicyItem](CdvPurchase.md#privacypolicyitem)

### Variables

- [PLUGIN\_VERSION](CdvPurchase.md#plugin_version)
- [store](CdvPurchase.md#store)

## Type Aliases

### Callback

Ƭ **Callback**\<`T`\>: (`t`: `T`) => `void`

Callback

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

▸ (`t`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `t` | `T` |

##### Returns

`void`

___

### IPeriodUnit

Ƭ **IPeriodUnit**: ``"Minute"`` \| ``"Hour"`` \| ``"Day"`` \| ``"Week"`` \| ``"Month"`` \| ``"Year"``

Unit for measuring durations

___

### Obfuscator

Ƭ **Obfuscator**: ``"legacy"`` \| ``"uuid"`` \| ``"disabled"`` \| (`applicationUsername`: `string`, `platform`: [`Platform`](../enums/CdvPurchase.Platform.md)) => `string`

Obfuscation strategy for the application username.

Controls how `applicationUsername` is transformed before being sent to
each platform's native API.

- `'uuid'` — **Recommended.** MD5 hash formatted as UUIDv3 on all
  platforms. Deterministic, valid UUID, works as Apple's
  `appAccountToken` (SK1 + SK2) and Google Play's
  `obfuscatedAccountId`.

- `'legacy'` (default) — Only use this when an existing server-side
  integration already correlates against the original 32-hex MD5 value
  sent on Google Play. New integrations should pick `'uuid'`.
  - Google Play: raw MD5 hash (32 hex chars)
  - Apple AppStore (SK2): MD5 hash formatted as UUIDv3
  - Apple AppStore (SK1, deprecated): raw username, unchanged
  - Other platforms: MD5 hash formatted as UUIDv3

- `'disabled'` — No obfuscation. The raw `applicationUsername` is
  passed through to all platforms. For Apple SK2, the value must be a
  valid UUID string or `appAccountToken` will not be set.

- Custom function — `(username: string, platform: Platform) => string`.
  Receives the raw username and platform, returns the obfuscated value.
  For Apple (both SK1 and SK2), the function must return a valid UUID
  string.

**`See`**

 - [Store.obfuscator](../classes/CdvPurchase.Store.md#obfuscator)
 - [https://github.com/j3k0/cordova-plugin-purchase/issues/1665](https://github.com/j3k0/cordova-plugin-purchase/issues/1665)

___

### PlatformFunctionality

Ƭ **PlatformFunctionality**: ``"requestPayment"`` \| ``"order"`` \| ``"orderQuantity"`` \| ``"manageSubscriptions"`` \| ``"manageBilling"`` \| ``"getStorefront"``

Functionality optionality provided by a given platform.

**`See`**

[Store.checkSupport](../classes/CdvPurchase.Store.md#checksupport)

___

### PlatformWithOptions

Ƭ **PlatformWithOptions**: [`Braintree`](../interfaces/CdvPurchase.PlatformOptions.Braintree.md) \| [`AppleAppStore`](../interfaces/CdvPurchase.PlatformOptions.AppleAppStore.md) \| [`GooglePlay`](../interfaces/CdvPurchase.PlatformOptions.GooglePlay.md) \| [`Test`](../interfaces/CdvPurchase.PlatformOptions.Test.md) \| [`WindowsStore`](../interfaces/CdvPurchase.PlatformOptions.WindowsStore.md) \| [`IapticJS`](../interfaces/CdvPurchase.PlatformOptions.IapticJS.md)

Used to initialize a platform with some options

**`See`**

[Store.initialize](../classes/CdvPurchase.Store.md#initialize)

___

### PrivacyPolicyItem

Ƭ **PrivacyPolicyItem**: ``"fraud"`` \| ``"support"`` \| ``"analytics"`` \| ``"tracking"``

## Variables

### PLUGIN\_VERSION

• `Const` **PLUGIN\_VERSION**: ``"13.17.2"``

Current release number of the plugin.

___

### store

• **store**: [`Store`](../classes/CdvPurchase.Store.md)

The global store object.
