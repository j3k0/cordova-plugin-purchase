# Enumeration: BillingAddressFormat

[Braintree](../modules/CdvPurchase.Braintree.md).[GooglePay](../modules/CdvPurchase.Braintree.GooglePay.md).BillingAddressFormat

The Google Pay API will collect the billing address for you if required

## Table of contents

### Enumeration Members

- [FULL](CdvPurchase.Braintree.GooglePay.BillingAddressFormat.md#full)
- [MIN](CdvPurchase.Braintree.GooglePay.BillingAddressFormat.md#min)

## Enumeration Members

### FULL

• **FULL** = ``1``

When this format is used, the billing address returned will be the full address.

Only select this format when it's required to process the order since it can increase friction during the checkout process and can lead to a lower conversion rate.

___

### MIN

• **MIN** = ``0``

When this format is used, the billing address returned will only contain the minimal info, including name, country code, and postal code.

Note that some countries do not use postal codes, so the postal code field will be empty in those countries.
