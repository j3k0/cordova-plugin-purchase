# Namespace: CdvPurchase

cordova-plugin-purchase global namespace

## Namespaces

- [AppleAppStore](CdvPurchase.AppleAppStore.md)
- [Braintree](CdvPurchase.Braintree.md)
- [GooglePlay](CdvPurchase.GooglePlay.md)
- [Test](CdvPurchase.Test.md)
- [Utils](CdvPurchase.Utils.md)
- [Validator](CdvPurchase.Validator.md)
- [WindowsStore](CdvPurchase.WindowsStore.md)

## Enumerations

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

## Classes

- [Callbacks](../classes/CdvPurchase.Callbacks.md)
- [Iaptic](../classes/CdvPurchase.Iaptic.md)
- [Logger](../classes/CdvPurchase.Logger.md)
- [Offer](../classes/CdvPurchase.Offer.md)
- [Product](../classes/CdvPurchase.Product.md)
- [ReadyCallbacks](../classes/CdvPurchase.ReadyCallbacks.md)
- [Receipt](../classes/CdvPurchase.Receipt.md)
- [Store](../classes/CdvPurchase.Store.md)
- [Transaction](../classes/CdvPurchase.Transaction.md)
- [VerifiedReceipt](../classes/CdvPurchase.VerifiedReceipt.md)

## Interfaces

- [Adapter](../interfaces/CdvPurchase.Adapter.md)
- [AdapterListener](../interfaces/CdvPurchase.AdapterListener.md)
- [AdditionalData](../interfaces/CdvPurchase.AdditionalData.md)
- [IError](../interfaces/CdvPurchase.IError.md)
- [IRegisterProduct](../interfaces/CdvPurchase.IRegisterProduct.md)
- [IapticConfig](../interfaces/CdvPurchase.IapticConfig.md)
- [PaymentRequest](../interfaces/CdvPurchase.PaymentRequest.md)
- [PostalAddress](../interfaces/CdvPurchase.PostalAddress.md)
- [PricingPhase](../interfaces/CdvPurchase.PricingPhase.md)
- [VerbosityProvider](../interfaces/CdvPurchase.VerbosityProvider.md)
- [VerifiedPurchase](../interfaces/CdvPurchase.VerifiedPurchase.md)
- [When](../interfaces/CdvPurchase.When.md)

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

### IErrorCallback

Ƭ **IErrorCallback**: (`err?`: [`IError`](../interfaces/CdvPurchase.IError.md)) => `void`

#### Type declaration

▸ (`err?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `err?` | [`IError`](../interfaces/CdvPurchase.IError.md) |

##### Returns

`void`

___

### IPeriodUnit

Ƭ **IPeriodUnit**: ``"Minute"`` \| ``"Hour"`` \| ``"Day"`` \| ``"Week"`` \| ``"Month"`` \| ``"Year"``

___

### PlatformWithOptions

Ƭ **PlatformWithOptions**: { `options`: [`AdapterOptions`](../interfaces/CdvPurchase.Braintree.AdapterOptions.md) ; `platform`: [`BRAINTREE`](../enums/CdvPurchase.Platform.md#braintree)  } \| { `platform`: [`GOOGLE_PLAY`](../enums/CdvPurchase.Platform.md#google_play)  } \| { `platform`: [`APPLE_APPSTORE`](../enums/CdvPurchase.Platform.md#apple_appstore)  } \| { `platform`: [`TEST`](../enums/CdvPurchase.Platform.md#test)  } \| { `platform`: [`WINDOWS_STORE`](../enums/CdvPurchase.Platform.md#windows_store)  }

___

### PrivacyPolicyItem

Ƭ **PrivacyPolicyItem**: ``"fraud"`` \| ``"support"`` \| ``"analytics"`` \| ``"tracking"``

## Variables

### PLUGIN\_VERSION

• `Const` **PLUGIN\_VERSION**: ``"13.0.0"``

___

### store

• **store**: [`Store`](../classes/CdvPurchase.Store.md)

## Functions

### storeError

▸ **storeError**(`code`, `message`): [`IError`](../interfaces/CdvPurchase.IError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | [`ErrorCode`](../enums/CdvPurchase.ErrorCode.md) |
| `message` | `string` |

#### Returns

[`IError`](../interfaces/CdvPurchase.IError.md)
