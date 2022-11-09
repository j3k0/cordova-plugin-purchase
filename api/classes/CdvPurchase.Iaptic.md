# Class: Iaptic

[CdvPurchase](../modules/CdvPurchase.md).Iaptic

Integrate with https://www.iaptic.com/

**`Example`**

```ts
const iaptic = new CdvPurchase.Iaptic({
  url: 'https://validator.iaptic.com',
  appName: 'test',
  apiKey: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
});
store.validator = iaptic.validator;
```

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

Provides a client token generated on iaptic's servers

Can be passed to the Braintree Adapter at initialization.

**`Example`**

```ts
store.initialize([
  {
    platform: Platform.BRAINTREE,
    options: {
      clientTokenProvider: iaptic.braintreeClientTokenProvider
    }
  }
]);
```

#### Returns

[`ClientTokenProvider`](../modules/CdvPurchase.Braintree.md#clienttokenprovider)

___

### validator

• `get` **validator**(): `string`

Validator URL

#### Returns

`string`
