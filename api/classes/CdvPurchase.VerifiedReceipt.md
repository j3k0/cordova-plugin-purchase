# Class: VerifiedReceipt

[CdvPurchase](../modules/CdvPurchase.md).VerifiedReceipt

Receipt data as validated by the receipt validation server

## Constructors

### constructor

• **new VerifiedReceipt**(`receipt`, `response`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `receipt` | [`Receipt`](CdvPurchase.Receipt.md) | - |
| `response` | `Object` | - |
| `response.collection?` | [`VerifiedPurchase`](../interfaces/CdvPurchase.VerifiedPurchase.md)[] | The collection of purchases in this receipt.  An array of ValidatorPurchase |
| `response.id` | `string` | Id of the product that have been validated |
| `response.ineligible_for_intro_price?` | `string`[] | List of product ids for which intro price isn't available anymore |
| `response.latest_receipt` | `boolean` | Tell the plugin that we've used the latest receipt |
| `response.transaction` | [`NativeTransaction`](../modules/CdvPurchase.Validator.Response.md#nativetransaction) | Native transaction detail |
| `response.warning?` | `string` | A warning message about this validation.  It might be present when the server had to fallback to a backup validation solution. |

## Properties

### collection

• **collection**: [`VerifiedPurchase`](../interfaces/CdvPurchase.VerifiedPurchase.md)[]

The collection of purchases in this receipt.

An array of ValidatorPurchase

___

### id

• **id**: `string`

Id of the product that have been validated. Used internally.

___

### latestReceipt

• **latestReceipt**: `boolean`

Tell the plugin that we've used the latest receipt

___

### nativeTransactions

• **nativeTransactions**: [`NativeTransaction`](../modules/CdvPurchase.Validator.Response.md#nativetransaction)[]

Native transactions detail

___

### sourceReceipt

• **sourceReceipt**: [`Receipt`](CdvPurchase.Receipt.md)

Source local receipt used for this validation

___

### warning

• `Optional` **warning**: `string`

Optional warning message about this validation.

It might be present when the server had to fallback to a backup validation solution (like a cached response or using local validation only).
This happens generally when communication with the platform's receipt validation service isn't possible (because it's down, there's a network issue, ...)

Threat the content of this receipt accordingly.

## Accessors

### platform

• `get` **platform**(): [`Platform`](../enums/CdvPurchase.Platform.md)

Platform this receipt originated from

#### Returns

[`Platform`](../enums/CdvPurchase.Platform.md)

## Methods

### set

▸ **set**(`receipt`, `response`): `void`

Update the receipt content

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `receipt` | [`Receipt`](CdvPurchase.Receipt.md) | - |
| `response` | `Object` | - |
| `response.collection?` | [`VerifiedPurchase`](../interfaces/CdvPurchase.VerifiedPurchase.md)[] | The collection of purchases in this receipt.  An array of ValidatorPurchase |
| `response.id` | `string` | Id of the product that have been validated |
| `response.ineligible_for_intro_price?` | `string`[] | List of product ids for which intro price isn't available anymore |
| `response.latest_receipt` | `boolean` | Tell the plugin that we've used the latest receipt |
| `response.transaction` | [`NativeTransaction`](../modules/CdvPurchase.Validator.Response.md#nativetransaction) | Native transaction detail |
| `response.warning?` | `string` | A warning message about this validation.  It might be present when the server had to fallback to a backup validation solution. |

#### Returns

`void`
