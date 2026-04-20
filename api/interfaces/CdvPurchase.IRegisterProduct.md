# Interface: IRegisterProduct

[CdvPurchase](../modules/CdvPurchase.md).IRegisterProduct

Data provided to store.register()

## Table of contents

### Properties

- [group](CdvPurchase.IRegisterProduct.md#group)
- [id](CdvPurchase.IRegisterProduct.md#id)
- [platform](CdvPurchase.IRegisterProduct.md#platform)
- [type](CdvPurchase.IRegisterProduct.md#type)

## Properties

### group

• `Optional` **group**: `string`

Name of the group your subscription product is a member of.

When set, purchasing a subscription in a group will replace the currently
owned one (on Google Play, this triggers the subscription replacement flow).
When not set, subscriptions are independent — no automatic replacement.

___

### id

• **id**: `string`

Identifier of the product on the store

___

### platform

• **platform**: [`Platform`](../enums/CdvPurchase.Platform.md)

The payment platform the product is available on.

___

### type

• **type**: [`ProductType`](../enums/CdvPurchase.ProductType.md)

Product type, should be one of the defined product types
