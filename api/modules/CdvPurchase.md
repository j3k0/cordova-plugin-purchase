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
- [Braintree](CdvPurchase.Braintree.md)
- [GooglePlay](CdvPurchase.GooglePlay.md)
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
- [PostalAddress](../interfaces/CdvPurchase.PostalAddress.md)
- [PricingPhase](../interfaces/CdvPurchase.PricingPhase.md)
- [VerifiedPurchase](../interfaces/CdvPurchase.VerifiedPurchase.md)
- [When](../interfaces/CdvPurchase.When.md)

### Type Aliases

- [Callback](CdvPurchase.md#callback)
- [IPeriodUnit](CdvPurchase.md#iperiodunit)
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

### PlatformWithOptions

Ƭ **PlatformWithOptions**: { `options`: [`AdapterOptions`](../interfaces/CdvPurchase.Braintree.AdapterOptions.md) ; `platform`: [`BRAINTREE`](../enums/CdvPurchase.Platform.md#braintree)  } \| { `platform`: [`GOOGLE_PLAY`](../enums/CdvPurchase.Platform.md#google_play)  } \| { `platform`: [`APPLE_APPSTORE`](../enums/CdvPurchase.Platform.md#apple_appstore)  } \| { `platform`: [`TEST`](../enums/CdvPurchase.Platform.md#test)  } \| { `platform`: [`WINDOWS_STORE`](../enums/CdvPurchase.Platform.md#windows_store)  }

Used to initialize a platform with some options

**`See`**

[initialize](../classes/CdvPurchase.Store.md#initialize)

___

### PrivacyPolicyItem

Ƭ **PrivacyPolicyItem**: ``"fraud"`` \| ``"support"`` \| ``"analytics"`` \| ``"tracking"``

## Variables

### PLUGIN\_VERSION

• `Const` **PLUGIN\_VERSION**: ``"13.0.0"``

Current release number of the plugin.

___

### store

• **store**: [`Store`](../classes/CdvPurchase.Store.md)

The global store object.
