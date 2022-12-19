# Interface: Request

[Braintree](../modules/CdvPurchase.Braintree.md).[DropIn](../modules/CdvPurchase.Braintree.DropIn.md).Request

A Braintree Drop-In Request

## Table of contents

### Properties

- [allowVaultCardOverride](CdvPurchase.Braintree.DropIn.Request.md#allowvaultcardoverride)
- [applePayDisabled](CdvPurchase.Braintree.DropIn.Request.md#applepaydisabled)
- [cardDisabled](CdvPurchase.Braintree.DropIn.Request.md#carddisabled)
- [cardholderNameStatus](CdvPurchase.Braintree.DropIn.Request.md#cardholdernamestatus)
- [googlePayRequest](CdvPurchase.Braintree.DropIn.Request.md#googlepayrequest)
- [maskCardNumber](CdvPurchase.Braintree.DropIn.Request.md#maskcardnumber)
- [maskSecurityCode](CdvPurchase.Braintree.DropIn.Request.md#masksecuritycode)
- [paypalDisabled](CdvPurchase.Braintree.DropIn.Request.md#paypaldisabled)
- [threeDSecureRequest](CdvPurchase.Braintree.DropIn.Request.md#threedsecurerequest)
- [vaultCard](CdvPurchase.Braintree.DropIn.Request.md#vaultcard)
- [vaultCardDefaultValue](CdvPurchase.Braintree.DropIn.Request.md#vaultcarddefaultvalue)
- [vaultManager](CdvPurchase.Braintree.DropIn.Request.md#vaultmanager)

## Properties

### allowVaultCardOverride

• `Optional` **allowVaultCardOverride**: `boolean`

- true shows save card CheckBox to allow user to choose whether or not to vault their card.
- false does not show Save Card CheckBox.

Default value is false.

___

### applePayDisabled

• `Optional` **applePayDisabled**: `boolean`

Use this parameter to disable Apple Pay.

Otherwise if Apple Pay is correctly configured, Apple Pay will appear
as a selection in the Payment Method options.

___

### cardDisabled

• `Optional` **cardDisabled**: `boolean`

If set to true, disables Card in Drop-in. Default value is false.

___

### cardholderNameStatus

• `Optional` **cardholderNameStatus**: [`CardFormFieldStatus`](../enums/CdvPurchase.Braintree.DropIn.CardFormFieldStatus.md)

Sets the Cardholder Name field status, which is how it will behave in CardForm.

Default is DISABLED.

___

### googlePayRequest

• `Optional` **googlePayRequest**: [`Request`](CdvPurchase.Braintree.GooglePay.Request.md)

Provide the Google Pay request if you need Google Pay support

___

### maskCardNumber

• `Optional` **maskCardNumber**: `boolean`

True to mask the card number when the field is not focused.

See com.braintreepayments.cardform.view.CardEditText for more details.

Android only.

___

### maskSecurityCode

• `Optional` **maskSecurityCode**: `boolean`

true to mask the security code during input. Defaults to false.

___

### paypalDisabled

• `Optional` **paypalDisabled**: `boolean`

Set to true to hide the PayPal option even if enabled for your account.

Defaults to false. Set to true to hide the PayPal option even if enabled for your account.

___

### threeDSecureRequest

• `Optional` **threeDSecureRequest**: [`Request`](CdvPurchase.Braintree.ThreeDSecure.Request.md)

Provide the ThreeDSecure request if you need 3DS support

___

### vaultCard

• `Optional` **vaultCard**: `boolean`

Whether or not to vault the card upon tokenization.

Can only be applied when initializing the Braintree client with a client token
that was generated with a customer ID.

When set to `false` with `allowVaultCardOverride` set to `false`, then cards will not be vaulted.

Defaults to true

___

### vaultCardDefaultValue

• `Optional` **vaultCardDefaultValue**: `boolean`

the default value used to determine if Drop-in should vault the customer's card.

This setting can be overwritten by the customer if the save card checkbox is visible using setAllowVaultCardOverride(boolean)

If the save card CheckBox is shown, and default vault value is true: the save card CheckBox will appear pre-checked.
If the save card CheckBox is shown, and default vault value is false: the save card Checkbox will appear un-checked.
If the save card CheckBox is not shown, and default vault value is true: card always vaults.
If the save card CheckBox is not shown, and default vault value is false: card never vaults.

This value is true by default.

___

### vaultManager

• `Optional` **vaultManager**: `boolean`

true to allow customers to manage their vaulted payment methods.

Defaults to false.
