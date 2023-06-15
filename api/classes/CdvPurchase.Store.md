# Class: Store

[CdvPurchase](../modules/CdvPurchase.md).Store

Entry class of the plugin.

## Table of contents

### Constructors

- [constructor](CdvPurchase.Store.md#constructor)

### Properties

- [applicationUsername](CdvPurchase.Store.md#applicationusername)
- [log](CdvPurchase.Store.md#log)
- [validator](CdvPurchase.Store.md#validator)
- [validator\_privacy\_policy](CdvPurchase.Store.md#validator_privacy_policy)
- [verbosity](CdvPurchase.Store.md#verbosity)
- [version](CdvPurchase.Store.md#version)

### Accessors

- [isReady](CdvPurchase.Store.md#isready)
- [localReceipts](CdvPurchase.Store.md#localreceipts)
- [localTransactions](CdvPurchase.Store.md#localtransactions)
- [products](CdvPurchase.Store.md#products)
- [verifiedPurchases](CdvPurchase.Store.md#verifiedpurchases)
- [verifiedReceipts](CdvPurchase.Store.md#verifiedreceipts)

### Methods

- [checkSupport](CdvPurchase.Store.md#checksupport)
- [defaultPlatform](CdvPurchase.Store.md#defaultplatform)
- [error](CdvPurchase.Store.md#error)
- [findInLocalReceipts](CdvPurchase.Store.md#findinlocalreceipts)
- [findInVerifiedReceipts](CdvPurchase.Store.md#findinverifiedreceipts)
- [get](CdvPurchase.Store.md#get)
- [getAdapter](CdvPurchase.Store.md#getadapter)
- [getApplicationUsername](CdvPurchase.Store.md#getapplicationusername)
- [initialize](CdvPurchase.Store.md#initialize)
- [manageBilling](CdvPurchase.Store.md#managebilling)
- [manageSubscriptions](CdvPurchase.Store.md#managesubscriptions)
- [monitor](CdvPurchase.Store.md#monitor)
- [off](CdvPurchase.Store.md#off)
- [order](CdvPurchase.Store.md#order)
- [owned](CdvPurchase.Store.md#owned)
- [ready](CdvPurchase.Store.md#ready)
- [refresh](CdvPurchase.Store.md#refresh)
- [register](CdvPurchase.Store.md#register)
- [requestPayment](CdvPurchase.Store.md#requestpayment)
- [restorePurchases](CdvPurchase.Store.md#restorepurchases)
- [update](CdvPurchase.Store.md#update)
- [when](CdvPurchase.Store.md#when)

## Constructors

### constructor

• **new Store**()

## Properties

### applicationUsername

• `Optional` **applicationUsername**: `string` \| () => `string`

Return the identifier of the user for your application

___

### log

• **log**: [`Logger`](CdvPurchase.Logger.md)

Logger

___

### validator

• **validator**: `undefined` \| `string` \| [`Function`](../interfaces/CdvPurchase.Validator.Function.md) \| [`Target`](../interfaces/CdvPurchase.Validator.Target.md)

URL or implementation of the receipt validation service

**`Example`**

Define the validator as a string
```ts
CdvPurchase.store.validator = "https://validator.iaptic.com/v1/validate?appName=test"
```

**`Example`**

Define the validator as a function
```ts
CdvPurchase.store.validator = (receipt, callback) => {
  callback({
    ok: true,
    data: {
      // see CdvPurchase.Validator.Response.Payload for details
    }
  })
}
```

**`See`**

[Payload](../modules/CdvPurchase.Validator.Response.md#payload)

___

### validator\_privacy\_policy

• **validator\_privacy\_policy**: `undefined` \| [`PrivacyPolicyItem`](../modules/CdvPurchase.md#privacypolicyitem) \| [`PrivacyPolicyItem`](../modules/CdvPurchase.md#privacypolicyitem)[]

When adding information to receipt validation requests, those can serve different functions:

 - handling support requests
 - fraud detection
 - analytics
 - tracking

Make sure the value your select is in line with your application's privacy policy and your users' tracking preference.

**`Example`**

```ts
CdvPurchase.store.validator_privacy_policy = [
  'fraud', 'support', 'analytics', 'tracking'
]
```

___

### verbosity

• **verbosity**: [`LogLevel`](../enums/CdvPurchase.LogLevel.md) = `LogLevel.ERROR`

Verbosity level used by the plugin logger

Set to:

 - LogLevel.QUIET or 0 to disable all logging (default)
 - LogLevel.ERROR or 1 to show only error messages
 - LogLevel.WARNING or 2 to show warnings and errors
 - LogLevel.INFO or 3 to also show information messages
 - LogLevel.DEBUG or 4 to enable internal debugging messages.

**`See`**

[LogLevel](../enums/CdvPurchase.LogLevel.md)

___

### version

• **version**: `string` = `PLUGIN_VERSION`

Version of the plugin currently installed.

## Accessors

### isReady

• `get` **isReady**(): `boolean`

true if the plugin is initialized and ready

#### Returns

`boolean`

___

### localReceipts

• `get` **localReceipts**(): [`Receipt`](CdvPurchase.Receipt.md)[]

List of all receipts present on the device.

#### Returns

[`Receipt`](CdvPurchase.Receipt.md)[]

___

### localTransactions

• `get` **localTransactions**(): [`Transaction`](CdvPurchase.Transaction.md)[]

List of all transaction from the local receipts.

#### Returns

[`Transaction`](CdvPurchase.Transaction.md)[]

___

### products

• `get` **products**(): [`Product`](CdvPurchase.Product.md)[]

List of all active products.

Products are active if their details have been successfully loaded from the store.

#### Returns

[`Product`](CdvPurchase.Product.md)[]

___

### verifiedPurchases

• `get` **verifiedPurchases**(): [`VerifiedPurchase`](../interfaces/CdvPurchase.VerifiedPurchase.md)[]

List of all purchases from the verified receipts.

#### Returns

[`VerifiedPurchase`](../interfaces/CdvPurchase.VerifiedPurchase.md)[]

___

### verifiedReceipts

• `get` **verifiedReceipts**(): [`VerifiedReceipt`](CdvPurchase.VerifiedReceipt.md)[]

List of receipts verified with the receipt validation service.

Those receipt contains more information and are generally more up-to-date than the local ones.

#### Returns

[`VerifiedReceipt`](CdvPurchase.VerifiedReceipt.md)[]

## Methods

### checkSupport

▸ **checkSupport**(`platform`, `functionality`): `boolean`

Returns true if a platform supports the requested functionality.

**`Example`**

```ts
store.checkSupport(Platform.APPLE_APPSTORE, 'requestPayment');
// => false
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `platform` | [`Platform`](../enums/CdvPurchase.Platform.md) |
| `functionality` | [`PlatformFunctionality`](../modules/CdvPurchase.md#platformfunctionality) |

#### Returns

`boolean`

___

### defaultPlatform

▸ **defaultPlatform**(): [`Platform`](../enums/CdvPurchase.Platform.md)

The default payment platform to use depending on the OS.

- on iOS: `APPLE_APPSTORE`
- on Android: `GOOGLE_PLAY`

#### Returns

[`Platform`](../enums/CdvPurchase.Platform.md)

___

### error

▸ **error**(`error`): `void`

Register an error handler.

**`Example`**

```ts
store.error(function(error) {
  console.error('CdvPurchase ERROR: ' + error.message);
});
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `error` | [`Callback`](../modules/CdvPurchase.md#callback)<[`IError`](../interfaces/CdvPurchase.IError.md)\> | An error callback that takes the error as an argument |

#### Returns

`void`

___

### findInLocalReceipts

▸ **findInLocalReceipts**(`product`): `undefined` \| [`Transaction`](CdvPurchase.Transaction.md)

Find the latest transaction for a given product, from those reported by the device.

#### Parameters

| Name | Type |
| :------ | :------ |
| `product` | [`Product`](CdvPurchase.Product.md) |

#### Returns

`undefined` \| [`Transaction`](CdvPurchase.Transaction.md)

___

### findInVerifiedReceipts

▸ **findInVerifiedReceipts**(`product`): `undefined` \| [`VerifiedPurchase`](../interfaces/CdvPurchase.VerifiedPurchase.md)

Find the last verified purchase for a given product, from those verified by the receipt validator.

#### Parameters

| Name | Type |
| :------ | :------ |
| `product` | [`Product`](CdvPurchase.Product.md) |

#### Returns

`undefined` \| [`VerifiedPurchase`](../interfaces/CdvPurchase.VerifiedPurchase.md)

___

### get

▸ **get**(`productId`, `platform?`): `undefined` \| [`Product`](CdvPurchase.Product.md)

Find a product from its id and platform

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | Product identifier on the platform. |
| `platform?` | [`Platform`](../enums/CdvPurchase.Platform.md) | The product the product exists in. Can be omitted if you're only using a single payment platform. |

#### Returns

`undefined` \| [`Product`](CdvPurchase.Product.md)

___

### getAdapter

▸ **getAdapter**(`platform`): `undefined` \| [`Adapter`](../interfaces/CdvPurchase.Adapter.md)

Retrieve a platform adapter.

The platform adapter has to have been initialized before.

**`See`**

[initialize](CdvPurchase.Store.md#initialize)

#### Parameters

| Name | Type |
| :------ | :------ |
| `platform` | [`Platform`](../enums/CdvPurchase.Platform.md) |

#### Returns

`undefined` \| [`Adapter`](../interfaces/CdvPurchase.Adapter.md)

___

### getApplicationUsername

▸ **getApplicationUsername**(): `undefined` \| `string`

Get the application username as a string by either calling or returning [applicationUsername](CdvPurchase.Store.md#applicationusername)

#### Returns

`undefined` \| `string`

___

### initialize

▸ **initialize**(`platforms?`): `Promise`<[`IError`](../interfaces/CdvPurchase.IError.md)[]\>

Call to initialize the in-app purchase plugin.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `platforms` | ([`Platform`](../enums/CdvPurchase.Platform.md) \| [`PlatformWithOptions`](../modules/CdvPurchase.md#platformwithoptions))[] | List of payment platforms to initialize, default to Store.defaultPlatform(). |

#### Returns

`Promise`<[`IError`](../interfaces/CdvPurchase.IError.md)[]\>

___

### manageBilling

▸ **manageBilling**(`platform?`): `Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

Opens the billing methods page on AppStore, Play, Microsoft, ...

From this page, the user can update their payment methods.

If platform is not specified, the first available platform will be used.

**`Example`**

```ts
if (purchase.isBillingRetryPeriod)
    store.manageBilling(purchase.platform);
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `platform?` | [`Platform`](../enums/CdvPurchase.Platform.md) |

#### Returns

`Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

___

### manageSubscriptions

▸ **manageSubscriptions**(`platform?`): `Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

Open the subscription management interface for the selected platform.

If platform is not specified, the first available platform will be used.

**`Example`**

```ts
const activeSubscription: Purchase = // ...
store.manageSubscriptions(activeSubscription.platform);
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `platform?` | [`Platform`](../enums/CdvPurchase.Platform.md) |

#### Returns

`Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

___

### monitor

▸ **monitor**(`transaction`, `onChange`): [`TransactionMonitor`](../interfaces/CdvPurchase.TransactionMonitor.md)

Setup a function to be notified of changes to a transaction state.

**`Example`**

```ts
const monitor = store.monitor(transaction, state => {
  console.log('new state: ' + state);
  if (state === TransactionState.FINISHED)
    monitor.stop();
});
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transaction` | [`Transaction`](CdvPurchase.Transaction.md) | The transaction to monitor. |
| `onChange` | [`Callback`](../modules/CdvPurchase.md#callback)<[`TransactionState`](../enums/CdvPurchase.TransactionState.md)\> | Function to be called when the transaction status changes. |

#### Returns

[`TransactionMonitor`](../interfaces/CdvPurchase.TransactionMonitor.md)

A monitor which can be stopped with `monitor.stop()`

___

### off

▸ **off**<`T`\>(`callback`): `void`

Remove a callback from any listener it might have been added to.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | [`Callback`](../modules/CdvPurchase.md#callback)<`T`\> |

#### Returns

`void`

___

### order

▸ **order**(`offer`, `additionalData?`): `Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

Place an order for a given offer.

#### Parameters

| Name | Type |
| :------ | :------ |
| `offer` | [`Offer`](CdvPurchase.Offer.md) |
| `additionalData?` | [`AdditionalData`](../interfaces/CdvPurchase.AdditionalData.md) |

#### Returns

`Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

___

### owned

▸ **owned**(`product`): `boolean`

Return true if a product is owned

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `product` | `string` \| { `id`: `string` ; `platform?`: [`Platform`](../enums/CdvPurchase.Platform.md)  } | The product object or identifier of the product. |

#### Returns

`boolean`

___

### ready

▸ **ready**(`cb`): `void`

Register a callback to be called when the plugin is ready.

This happens when all the platforms are initialized and their products loaded.

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | [`Callback`](../modules/CdvPurchase.md#callback)<`void`\> |

#### Returns

`void`

___

### refresh

▸ **refresh**(): `void`

**`Deprecated`**

- use store.initialize(), store.update() or store.restorePurchases()

#### Returns

`void`

___

### register

▸ **register**(`product`): `void`

Register a product.

**`Example`**

```ts
store.register([{
      id: 'subscription1',
      type: ProductType.PAID_SUBSCRIPTION,
      platform: Platform.APPLE_APPSTORE,
  }, {
      id: 'subscription1',
      type: ProductType.PAID_SUBSCRIPTION,
      platform: Platform.GOOGLE_PLAY,
  }, {
      id: 'consumable1',
      type: ProductType.CONSUMABLE,
      platform: Platform.BRAINTREE,
  }]);
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `product` | [`IRegisterProduct`](../interfaces/CdvPurchase.IRegisterProduct.md) \| [`IRegisterProduct`](../interfaces/CdvPurchase.IRegisterProduct.md)[] |

#### Returns

`void`

___

### requestPayment

▸ **requestPayment**(`paymentRequest`, `additionalData?`): [`PaymentRequestPromise`](CdvPurchase.PaymentRequestPromise.md)

Request a payment.

A payment is a custom amount to charge the user. Make sure the selected payment platform
supports Payment Requests.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentRequest` | [`PaymentRequest`](../interfaces/CdvPurchase.PaymentRequest.md) | Parameters of the payment request |
| `additionalData?` | [`AdditionalData`](../interfaces/CdvPurchase.AdditionalData.md) | Additional parameters |

#### Returns

[`PaymentRequestPromise`](CdvPurchase.PaymentRequestPromise.md)

___

### restorePurchases

▸ **restorePurchases**(): `Promise`<`void`\>

Replay the users transactions.

This method exists to cover an Apple AppStore requirement.

#### Returns

`Promise`<`void`\>

___

### update

▸ **update**(): `Promise`<`void`\>

Call to refresh the price of products and status of purchases.

#### Returns

`Promise`<`void`\>

___

### when

▸ **when**(): [`When`](../interfaces/CdvPurchase.When.md)

Setup events listener.

**`Example`**

```ts
store.when()
     .productUpdated(product => updateUI(product))
     .approved(transaction => transaction.verify())
     .verified(receipt => receipt.finish());
```

#### Returns

[`When`](../interfaces/CdvPurchase.When.md)
