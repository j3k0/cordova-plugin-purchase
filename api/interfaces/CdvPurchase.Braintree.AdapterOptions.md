# Interface: AdapterOptions

[CdvPurchase](../modules/CdvPurchase.md).[Braintree](../modules/CdvPurchase.Braintree.md).AdapterOptions

## Table of contents

### Properties

- [applePay](CdvPurchase.Braintree.AdapterOptions.md#applepay)
- [clientTokenProvider](CdvPurchase.Braintree.AdapterOptions.md#clienttokenprovider)
- [googlePay](CdvPurchase.Braintree.AdapterOptions.md#googlepay)
- [threeDSecure](CdvPurchase.Braintree.AdapterOptions.md#threedsecure)
- [tokenizationKey](CdvPurchase.Braintree.AdapterOptions.md#tokenizationkey)

## Properties

### applePay

• `Optional` **applePay**: [`ApplePayOptions`](CdvPurchase.Braintree.IosBridge.ApplePayOptions.md)

Options for making Apple Pay payment requests

___

### clientTokenProvider

• `Optional` **clientTokenProvider**: [`ClientTokenProvider`](../modules/CdvPurchase.Braintree.md#clienttokenprovider)

Function used to retrieve a Client Token (used if no tokenizationKey are provided).

___

### googlePay

• `Optional` **googlePay**: [`Request`](CdvPurchase.Braintree.GooglePay.Request.md)

Google Pay request parameters applied to all Braintree DropIn requests

___

### threeDSecure

• `Optional` **threeDSecure**: [`Request`](CdvPurchase.Braintree.ThreeDSecure.Request.md)

3DS request parameters applied to all Braintree DropIn requests

___

### tokenizationKey

• `Optional` **tokenizationKey**: `string`

Authorization key, as a direct string.
