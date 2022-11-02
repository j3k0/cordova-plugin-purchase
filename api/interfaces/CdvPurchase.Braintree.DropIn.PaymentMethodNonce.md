# Interface: PaymentMethodNonce

[Braintree](../modules/CdvPurchase.Braintree.md).[DropIn](../modules/CdvPurchase.Braintree.DropIn.md).PaymentMethodNonce

A method of payment for a customer.

PaymentMethodNonce represents the common interface of all payment method nonces,
and can be handled by a server interchangeably.

## Table of contents

### Properties

- [isDefault](CdvPurchase.Braintree.DropIn.PaymentMethodNonce.md#isdefault)
- [nonce](CdvPurchase.Braintree.DropIn.PaymentMethodNonce.md#nonce)
- [type](CdvPurchase.Braintree.DropIn.PaymentMethodNonce.md#type)

## Properties

### isDefault

• **isDefault**: `boolean`

true if this payment method is the default for the current customer, false otherwise.

___

### nonce

• **nonce**: `string`

The nonce generated for this payment method by the Braintree gateway.

The nonce will represent this PaymentMethod for the purposes of creating transactions and other monetary actions.

___

### type

• `Optional` **type**: `string`

The type of the tokenized data, e.g. PayPal, Venmo, MasterCard, Visa, Amex.

(iOS Only)
