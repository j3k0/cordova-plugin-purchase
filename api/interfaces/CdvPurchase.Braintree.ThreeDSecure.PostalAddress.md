# Interface: PostalAddress

[Braintree](../modules/CdvPurchase.Braintree.md).[ThreeDSecure](../modules/CdvPurchase.Braintree.ThreeDSecure.md).PostalAddress

Postal address for 3D Secure flows.

**`Link`**

https://braintree.github.io/braintree_ios/current/Classes/BTThreeDSecurePostalAddress.html

## Table of contents

### Properties

- [countryCodeAlpha2](CdvPurchase.Braintree.ThreeDSecure.PostalAddress.md#countrycodealpha2)
- [extendedAddress](CdvPurchase.Braintree.ThreeDSecure.PostalAddress.md#extendedaddress)
- [givenName](CdvPurchase.Braintree.ThreeDSecure.PostalAddress.md#givenname)
- [line3](CdvPurchase.Braintree.ThreeDSecure.PostalAddress.md#line3)
- [locality](CdvPurchase.Braintree.ThreeDSecure.PostalAddress.md#locality)
- [phoneNumber](CdvPurchase.Braintree.ThreeDSecure.PostalAddress.md#phonenumber)
- [postalCode](CdvPurchase.Braintree.ThreeDSecure.PostalAddress.md#postalcode)
- [region](CdvPurchase.Braintree.ThreeDSecure.PostalAddress.md#region)
- [streetAddress](CdvPurchase.Braintree.ThreeDSecure.PostalAddress.md#streetaddress)
- [surname](CdvPurchase.Braintree.ThreeDSecure.PostalAddress.md#surname)

## Properties

### countryCodeAlpha2

• `Optional` **countryCodeAlpha2**: `string`

2 letter country code

___

### extendedAddress

• `Optional` **extendedAddress**: `string`

Line 2 of the Address (eg. suite, apt #, etc.)

___

### givenName

• `Optional` **givenName**: `string`

Given name associated with the address.

___

### line3

• `Optional` **line3**: `string`

Line 3 of the Address (eg. suite, apt #, etc.)

___

### locality

• `Optional` **locality**: `string`

City name

___

### phoneNumber

• `Optional` **phoneNumber**: `string`

The phone number associated with the address

Note: Only numbers. Remove dashes, parentheses and other characters

___

### postalCode

• `Optional` **postalCode**: `string`

Zip code or equivalent is usually required for countries that have them.

For a list of countries that do not have postal codes please refer to http://en.wikipedia.org/wiki/Postal_code

___

### region

• `Optional` **region**: `string`

Either a two-letter state code (for the US), or an ISO-3166-2 country subdivision code of up to three letters.

___

### streetAddress

• `Optional` **streetAddress**: `string`

Line 1 of the Address (eg. number, street, etc)

___

### surname

• `Optional` **surname**: `string`

Surname associated with the address.
