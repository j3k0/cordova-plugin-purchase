# Interface: Request

[Braintree](../modules/CdvPurchase.Braintree.md).[ThreeDSecure](../modules/CdvPurchase.Braintree.ThreeDSecure.md).Request

Used to initialize a 3D Secure payment flow.

## Table of contents

### Properties

- [accountType](CdvPurchase.Braintree.ThreeDSecure.Request.md#accounttype)
- [additionalInformation](CdvPurchase.Braintree.ThreeDSecure.Request.md#additionalinformation)
- [amount](CdvPurchase.Braintree.ThreeDSecure.Request.md#amount)
- [billingAddress](CdvPurchase.Braintree.ThreeDSecure.Request.md#billingaddress)
- [cardAddChallenge](CdvPurchase.Braintree.ThreeDSecure.Request.md#cardaddchallenge)
- [challengeRequested](CdvPurchase.Braintree.ThreeDSecure.Request.md#challengerequested)
- [email](CdvPurchase.Braintree.ThreeDSecure.Request.md#email)
- [exemptionRequested](CdvPurchase.Braintree.ThreeDSecure.Request.md#exemptionrequested)
- [mobilePhoneNumber](CdvPurchase.Braintree.ThreeDSecure.Request.md#mobilephonenumber)
- [nonce](CdvPurchase.Braintree.ThreeDSecure.Request.md#nonce)
- [shippingMethod](CdvPurchase.Braintree.ThreeDSecure.Request.md#shippingmethod)
- [versionRequested](CdvPurchase.Braintree.ThreeDSecure.Request.md#versionrequested)

## Properties

### accountType

• `Optional` **accountType**: [`AccountType`](../enums/CdvPurchase.Braintree.ThreeDSecure.AccountType.md)

The account type selected by the cardholder.

Note: Some cards can be processed using either a credit or debit account and cardholders have the option to choose which account to use.

___

### additionalInformation

• `Optional` **additionalInformation**: [`AdditionalInformation`](CdvPurchase.Braintree.ThreeDSecure.AdditionalInformation.md)

The additional information used for verification.

___

### amount

• `Optional` **amount**: `string`

Amount for the transaction.

String representation of a decimal number.

Automatically filled from the `PaymentRequest`.

___

### billingAddress

• `Optional` **billingAddress**: [`PostalAddress`](CdvPurchase.Braintree.ThreeDSecure.PostalAddress.md)

The billing address used for verification. Optional.

Automatically filled from the `PaymentRequest`

___

### cardAddChallenge

• `Optional` **cardAddChallenge**: `boolean`

An authentication created using this property should only be used for adding a payment method to the merchant’s vault and not for creating transactions.

If set to true (REQUESTED), the authentication challenge will be requested from the issuer to confirm adding new card to the merchant’s vault.
If set to false (NOT_REQUESTED) the authentication challenge will not be requested from the issuer. If set to BTThreeDSecureAddCardChallengeUnspecified, when the amount is 0, the authentication challenge will be requested from the issuer.
If set to undefined (UNSPECIFIED), when the amount is greater than 0, the authentication challenge will not be requested from the issuer.

___

### challengeRequested

• `Optional` **challengeRequested**: `boolean`

If set to true, an authentication challenge will be forced if possible.

___

### email

• `Optional` **email**: `string`

The email used for verification. Optional.

Automatically filled from the `PaymentRequest`

___

### exemptionRequested

• `Optional` **exemptionRequested**: `boolean`

If set to true, an exemption to the authentication challenge will be requested.

___

### mobilePhoneNumber

• `Optional` **mobilePhoneNumber**: `string`

The mobile phone number used for verification.

Only numbers. Remove dashes, parentheses and other characters.

___

### nonce

• `Optional` **nonce**: `string`

A nonce to be verified by ThreeDSecure.

___

### shippingMethod

• `Optional` **shippingMethod**: [`ShippingMethod`](../enums/CdvPurchase.Braintree.ThreeDSecure.ShippingMethod.md)

The shipping method chosen for the transaction.

___

### versionRequested

• `Optional` **versionRequested**: [`Version`](../enums/CdvPurchase.Braintree.ThreeDSecure.Version.md)

Set to V2 if ThreeDSecure V2 flows are desired, when possible. Defaults to V2
