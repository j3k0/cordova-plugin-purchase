# Namespace: CdvPurchase

Namespace for the cordova-plugin-purchase plugin.

All classes, enumerations and variables defined by the plugin are in this namespace.

Throughout the documentation, in order to keep examples readable, we omit the `CdvPurchase` prefix.

When you see, for example `ProductType.PAID_SUBSCRIPTION`, it refers to `CdvPurchase.ProductType.PAID_SUBSCRIPTION`.

In the files that interact with the plugin, I recommend creating those shortcuts (and more if needed):

```ts
const {store, ProductType, Platform, LogLevel} = CdvPurchase;
```

## Table of contents

### Namespaces

- [AppleAppStore](CdvPurchase.AppleAppStore.md)
- [ApplePay](CdvPurchase.ApplePay.md)
- [Braintree](CdvPurchase.Braintree.md)
- [GooglePlay](CdvPurchase.GooglePlay.md)
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
- [TransactionMonitor](../interfaces/CdvPurchase.TransactionMonitor.md)
- [UnverifiedReceipt](../interfaces/CdvPurchase.UnverifiedReceipt.md)
- [VerifiedPurchase](../interfaces/CdvPurchase.VerifiedPurchase.md)
- [When](../interfaces/CdvPurchase.When.md)

### Type Aliases

- [Callback](CdvPurchase.md#callback)
- [IPeriodUnit](CdvPurchase.md#iperiodunit)
- [PlatformFunctionality](CdvPurchase.md#platformfunctionality)
- [PlatformWithOptions](CdvPurchase.md#platformwithoptions)
- [PrivacyPolicyItem](CdvPurchase.md#privacypolicyitem)

### Variables

- [PLUGIN\_VERSION](CdvPurchase.md#plugin_version)
- [store](CdvPurchase.md#store)

## Type Aliases

### Callback

Ƭ **Callback**<`T`\>: (`t`: `T`) => `void`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

▸ (`t`): `void`

Callback

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

### PlatformFunctionality

Ƭ **PlatformFunctionality**: ``"requestPayment"`` \| ``"order"`` \| ``"manageSubscriptions"`` \| ``"manageBilling"``

Functionality optionality provided by a given platform.

**`See`**

[checkSupport](../classes/CdvPurchase.Store.md#checksupport)

___

### PlatformWithOptions

Ƭ **PlatformWithOptions**: [`Braintree`](../interfaces/CdvPurchase.PlatformOptions.Braintree.md) \| [`AppleAppStore`](../interfaces/CdvPurchase.PlatformOptions.AppleAppStore.md) \| [`GooglePlay`](../interfaces/CdvPurchase.PlatformOptions.GooglePlay.md) \| [`Test`](../interfaces/CdvPurchase.PlatformOptions.Test.md) \| [`WindowsStore`](../interfaces/CdvPurchase.PlatformOptions.WindowsStore.md)

Used to initialize a platform with some options

**`See`**

[initialize](../classes/CdvPurchase.Store.md#initialize)

___

### PrivacyPolicyItem

Ƭ **PrivacyPolicyItem**: ``"fraud"`` \| ``"support"`` \| ``"analytics"`` \| ``"tracking"``

## Variables

### PLUGIN\_VERSION

• `Const` **PLUGIN\_VERSION**: ``"13.6.0"``

Current release number of the plugin.

___

### store

• **store**: [`Store`](../classes/CdvPurchase.Store.md)

The global store object.
