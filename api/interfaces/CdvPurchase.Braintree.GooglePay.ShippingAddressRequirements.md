# Interface: ShippingAddressRequirements

[Braintree](../modules/CdvPurchase.Braintree.md).[GooglePay](../modules/CdvPurchase.Braintree.GooglePay.md).ShippingAddressRequirements

## Table of contents

### Properties

- [allowedCountryCodes](CdvPurchase.Braintree.GooglePay.ShippingAddressRequirements.md#allowedcountrycodes)

## Properties

### allowedCountryCodes

• **allowedCountryCodes**: `string`[]

An array of strings that represents the list of country codes (in ISO 3166-1 alpha-2 format)
in which the shipping address must be located.

If this field is not empty, the shipping address must be in one of the specified countries.
