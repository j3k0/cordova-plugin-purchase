# Interface: SuccessPayload

[Validator](../modules/CdvPurchase.Validator.md).[Response](../modules/CdvPurchase.Validator.Response.md).SuccessPayload

Response from a validator endpoint

## Table of contents

### Properties

- [data](CdvPurchase.Validator.Response.SuccessPayload.md#data)
- [ok](CdvPurchase.Validator.Response.SuccessPayload.md#ok)

## Properties

### data

• **data**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `cache?` | [`ValidatorCacheInfo`](CdvPurchase.Validator.Response.ValidatorCacheInfo.md) | Present when the server answered from its last successful validation of this receipt because the store couldn't be reached, instead of asking the store. |
| `collection?` | [`VerifiedPurchase`](CdvPurchase.VerifiedPurchase.md)[] | The collection of purchases in this receipt. An array of ValidatorPurchase |
| `date?` | `string` | Date and time the receipt was validated. It will provide the client with a more reliable clock time than the user's device when needed. |
| `id` | `string` | Id of the product that have been validated |
| `ineligible_for_intro_price?` | `string`[] | List of product ids for which intro price isn't available anymore |
| `latest_receipt` | `boolean` | Tell the plugin that we've used the latest receipt |
| `transaction` | [`NativeTransaction`](../modules/CdvPurchase.Validator.Response.md#nativetransaction) | Native transaction detail |
| `warning?` | `string` | A warning message about this validation. It might be present when the server had to fallback to a backup validation solution. |

___

### ok

• **ok**: ``true``

Indicates a successful request
