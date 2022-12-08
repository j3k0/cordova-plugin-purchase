# Interface: CNContact

[CdvPurchase](../modules/CdvPurchase.md).[ApplePay](../modules/CdvPurchase.ApplePay.md).CNContact

An object that stores information about a single contact, such as the contact's first name, phone numbers, and addresses.

## Table of contents

### Properties

- [contactType](CdvPurchase.ApplePay.CNContact.md#contacttype)
- [departmentName](CdvPurchase.ApplePay.CNContact.md#departmentname)
- [emailAddresses](CdvPurchase.ApplePay.CNContact.md#emailaddresses)
- [givenName](CdvPurchase.ApplePay.CNContact.md#givenname)
- [identifier](CdvPurchase.ApplePay.CNContact.md#identifier)
- [jobTitle](CdvPurchase.ApplePay.CNContact.md#jobtitle)
- [middleName](CdvPurchase.ApplePay.CNContact.md#middlename)
- [namePrefix](CdvPurchase.ApplePay.CNContact.md#nameprefix)
- [nameSuffix](CdvPurchase.ApplePay.CNContact.md#namesuffix)
- [nickname](CdvPurchase.ApplePay.CNContact.md#nickname)
- [note](CdvPurchase.ApplePay.CNContact.md#note)
- [organizationName](CdvPurchase.ApplePay.CNContact.md#organizationname)
- [phoneNumbers](CdvPurchase.ApplePay.CNContact.md#phonenumbers)
- [phoneticFamilyName](CdvPurchase.ApplePay.CNContact.md#phoneticfamilyname)
- [phoneticGivenName](CdvPurchase.ApplePay.CNContact.md#phoneticgivenname)
- [phoneticMiddleName](CdvPurchase.ApplePay.CNContact.md#phoneticmiddlename)
- [phoneticOrganizationName](CdvPurchase.ApplePay.CNContact.md#phoneticorganizationname)
- [previousFamilyName](CdvPurchase.ApplePay.CNContact.md#previousfamilyname)
- [urlAddresses](CdvPurchase.ApplePay.CNContact.md#urladdresses)

## Properties

### contactType

• `Optional` **contactType**: ``"Person"`` \| ``"Organization"``

the contact type.

___

### departmentName

• `Optional` **departmentName**: `string`

The name of the department associated with the contact.

___

### emailAddresses

• `Optional` **emailAddresses**: `string`[]

An array of email addresses for the contact.

___

### givenName

• `Optional` **givenName**: `string`

The given name of the contact.

The given name is often known as the first name of the contact.

___

### identifier

• `Optional` **identifier**: `string`

A value that uniquely identifies a contact on the device.

It is recommended that you use the identifier when re-fetching the contact.
An identifier can be persisted between the app launches. Note that this identifier only
uniquely identifies the contact on the current device.

___

### jobTitle

• `Optional` **jobTitle**: `string`

The contact’s job title.

___

### middleName

• `Optional` **middleName**: `string`

The middle name of the contact.

___

### namePrefix

• `Optional` **namePrefix**: `string`

The name prefix of the contact.

___

### nameSuffix

• `Optional` **nameSuffix**: `string`

The name suffix of the contact.

___

### nickname

• `Optional` **nickname**: `string`

Nickname

___

### note

• `Optional` **note**: `string`

A string containing notes for the contact.

___

### organizationName

• `Optional` **organizationName**: `string`

The name of the organization associated with the contact.

___

### phoneNumbers

• `Optional` **phoneNumbers**: `string`[]

An array of phone numbers for a contact.

___

### phoneticFamilyName

• `Optional` **phoneticFamilyName**: `string`

___

### phoneticGivenName

• `Optional` **phoneticGivenName**: `string`

___

### phoneticMiddleName

• `Optional` **phoneticMiddleName**: `string`

___

### phoneticOrganizationName

• `Optional` **phoneticOrganizationName**: `string`

___

### previousFamilyName

• `Optional` **previousFamilyName**: `string`

A string for the previous family name of the contact.

The previous family name is often known as the maiden name of the contact.

___

### urlAddresses

• `Optional` **urlAddresses**: `string`[]

An array of URL addresses for a contact.
