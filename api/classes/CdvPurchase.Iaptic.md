# Class: Iaptic

[CdvPurchase](../modules/CdvPurchase.md).Iaptic

Helper to integrate with https://www.iaptic.com

## Table of contents

### Constructors

- [constructor](CdvPurchase.Iaptic.md#constructor)

### Properties

- [config](CdvPurchase.Iaptic.md#config)
- [log](CdvPurchase.Iaptic.md#log)

### Accessors

- [braintreeClientTokenProvider](CdvPurchase.Iaptic.md#braintreeclienttokenprovider)
- [validator](CdvPurchase.Iaptic.md#validator)

## Constructors

### constructor

• **new Iaptic**(`config`, `store?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`IapticConfig`](../interfaces/CdvPurchase.IapticConfig.md) |
| `store?` | [`Store`](CdvPurchase.Store.md) |

## Properties

### config

• **config**: [`IapticConfig`](../interfaces/CdvPurchase.IapticConfig.md)

___

### log

• **log**: [`Logger`](CdvPurchase.Logger.md)

## Accessors

### braintreeClientTokenProvider

• `get` **braintreeClientTokenProvider**(): [`ClientTokenProvider`](../modules/CdvPurchase.Braintree.md#clienttokenprovider)

#### Returns

[`ClientTokenProvider`](../modules/CdvPurchase.Braintree.md#clienttokenprovider)

___

### validator

• `get` **validator**(): `string`

#### Returns

`string`
