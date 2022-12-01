# Interface: AdditionalInformation

[Braintree](../modules/CdvPurchase.Braintree.md).[ThreeDSecure](../modules/CdvPurchase.Braintree.ThreeDSecure.md).AdditionalInformation

Additional information for a 3DS lookup. Used in 3DS 2.0+ flows.

## Table of contents

### Properties

- [accountAgeIndicator](CdvPurchase.Braintree.ThreeDSecure.AdditionalInformation.md#accountageindicator)
- [accountChangeDate](CdvPurchase.Braintree.ThreeDSecure.AdditionalInformation.md#accountchangedate)
- [accountChangeIndicator](CdvPurchase.Braintree.ThreeDSecure.AdditionalInformation.md#accountchangeindicator)
- [accountCreateDate](CdvPurchase.Braintree.ThreeDSecure.AdditionalInformation.md#accountcreatedate)
- [accountID](CdvPurchase.Braintree.ThreeDSecure.AdditionalInformation.md#accountid)
- [accountPurchases](CdvPurchase.Braintree.ThreeDSecure.AdditionalInformation.md#accountpurchases)
- [accountPwdChangeDate](CdvPurchase.Braintree.ThreeDSecure.AdditionalInformation.md#accountpwdchangedate)
- [accountPwdChangeIndicator](CdvPurchase.Braintree.ThreeDSecure.AdditionalInformation.md#accountpwdchangeindicator)
- [addCardAttempts](CdvPurchase.Braintree.ThreeDSecure.AdditionalInformation.md#addcardattempts)
- [addressMatch](CdvPurchase.Braintree.ThreeDSecure.AdditionalInformation.md#addressmatch)
- [authenticationIndicator](CdvPurchase.Braintree.ThreeDSecure.AdditionalInformation.md#authenticationindicator)
- [deliveryEmail](CdvPurchase.Braintree.ThreeDSecure.AdditionalInformation.md#deliveryemail)
- [deliveryTimeframe](CdvPurchase.Braintree.ThreeDSecure.AdditionalInformation.md#deliverytimeframe)
- [fraudActivity](CdvPurchase.Braintree.ThreeDSecure.AdditionalInformation.md#fraudactivity)
- [giftCardAmount](CdvPurchase.Braintree.ThreeDSecure.AdditionalInformation.md#giftcardamount)
- [giftCardCount](CdvPurchase.Braintree.ThreeDSecure.AdditionalInformation.md#giftcardcount)
- [giftCardCurrencyCode](CdvPurchase.Braintree.ThreeDSecure.AdditionalInformation.md#giftcardcurrencycode)
- [installment](CdvPurchase.Braintree.ThreeDSecure.AdditionalInformation.md#installment)
- [ipAddress](CdvPurchase.Braintree.ThreeDSecure.AdditionalInformation.md#ipaddress)
- [orderDescription](CdvPurchase.Braintree.ThreeDSecure.AdditionalInformation.md#orderdescription)
- [paymentAccountAge](CdvPurchase.Braintree.ThreeDSecure.AdditionalInformation.md#paymentaccountage)
- [paymentAccountIndicator](CdvPurchase.Braintree.ThreeDSecure.AdditionalInformation.md#paymentaccountindicator)
- [preorderDate](CdvPurchase.Braintree.ThreeDSecure.AdditionalInformation.md#preorderdate)
- [preorderIndicator](CdvPurchase.Braintree.ThreeDSecure.AdditionalInformation.md#preorderindicator)
- [productCode](CdvPurchase.Braintree.ThreeDSecure.AdditionalInformation.md#productcode)
- [purchaseDate](CdvPurchase.Braintree.ThreeDSecure.AdditionalInformation.md#purchasedate)
- [recurringEnd](CdvPurchase.Braintree.ThreeDSecure.AdditionalInformation.md#recurringend)
- [recurringFrequency](CdvPurchase.Braintree.ThreeDSecure.AdditionalInformation.md#recurringfrequency)
- [reorderIndicator](CdvPurchase.Braintree.ThreeDSecure.AdditionalInformation.md#reorderindicator)
- [sdkMaxTimeout](CdvPurchase.Braintree.ThreeDSecure.AdditionalInformation.md#sdkmaxtimeout)
- [shippingAddress](CdvPurchase.Braintree.ThreeDSecure.AdditionalInformation.md#shippingaddress)
- [shippingAddressUsageDate](CdvPurchase.Braintree.ThreeDSecure.AdditionalInformation.md#shippingaddressusagedate)
- [shippingAddressUsageIndicator](CdvPurchase.Braintree.ThreeDSecure.AdditionalInformation.md#shippingaddressusageindicator)
- [shippingMethodIndicator](CdvPurchase.Braintree.ThreeDSecure.AdditionalInformation.md#shippingmethodindicator)
- [shippingNameIndicator](CdvPurchase.Braintree.ThreeDSecure.AdditionalInformation.md#shippingnameindicator)
- [taxAmount](CdvPurchase.Braintree.ThreeDSecure.AdditionalInformation.md#taxamount)
- [transactionCountDay](CdvPurchase.Braintree.ThreeDSecure.AdditionalInformation.md#transactioncountday)
- [transactionCountYear](CdvPurchase.Braintree.ThreeDSecure.AdditionalInformation.md#transactioncountyear)
- [userAgent](CdvPurchase.Braintree.ThreeDSecure.AdditionalInformation.md#useragent)
- [workPhoneNumber](CdvPurchase.Braintree.ThreeDSecure.AdditionalInformation.md#workphonenumber)

## Properties

### accountAgeIndicator

• `Optional` **accountAgeIndicator**: ``"01"`` \| ``"02"`` \| ``"03"`` \| ``"04"`` \| ``"05"``

The 2-digit value representing the length of time cardholder has had account.

Possible values:
 - "01": No account
 - "02": Created during transaction
 - "03": Less than 30 days
 - "04": 30-60 days
 - "05": More than 60 days

___

### accountChangeDate

• `Optional` **accountChangeDate**: `string`

The 8-digit number (format: YYYYMMDD) indicating the date the cardholder's account was last changed. This includes changes to the billing or shipping address, new payment accounts or new users added.

___

### accountChangeIndicator

• `Optional` **accountChangeIndicator**: ``"01"`` \| ``"02"`` \| ``"03"`` \| ``"04"``

The 2-digit value representing the length of time since the last change to the cardholder account. This includes shipping address, new payment account or new user added.

Possible values:
 - "01": Changed during transaction
 - "02": Less than 30 days
 - "03": 30-60 days
 - "04": More than 60 days

___

### accountCreateDate

• `Optional` **accountCreateDate**: `string`

The 8-digit number (format: YYYYMMDD) indicating the date the cardholder opened the account.

___

### accountID

• `Optional` **accountID**: `string`

Optional. Additional cardholder account information.

___

### accountPurchases

• `Optional` **accountPurchases**: `string`

Optional. Number of purchases with this cardholder account during the previous six months.

___

### accountPwdChangeDate

• `Optional` **accountPwdChangeDate**: `string`

Optional. The 8-digit number (format: YYYYMMDD) indicating the date the cardholder last changed or reset password on account.

___

### accountPwdChangeIndicator

• `Optional` **accountPwdChangeIndicator**: ``"01"`` \| ``"02"`` \| ``"03"`` \| ``"04"`` \| ``"05"``

Optional. The 2-digit value representing the length of time since the cardholder changed or reset the password on the account.
Possible values:
01 No change
02 Changed during transaction
03 Less than 30 days
04 30-60 days
05 More than 60 days

___

### addCardAttempts

• `Optional` **addCardAttempts**: `string`

Optional. Number of add card attempts in the last 24 hours.

___

### addressMatch

• `Optional` **addressMatch**: `string`

Optional. The 1-character value (Y/N) indicating whether cardholder billing and shipping addresses match.

___

### authenticationIndicator

• `Optional` **authenticationIndicator**: ``"02"`` \| ``"03"``

Optional. The 2-digit number indicating the type of authentication request.
Possible values:
02 Recurring transaction
03 Installment transaction

___

### deliveryEmail

• `Optional` **deliveryEmail**: `string`

For electronic delivery, email address to which the merchandise was delivered

___

### deliveryTimeframe

• `Optional` **deliveryTimeframe**: ``"01"`` \| ``"02"`` \| ``"03"`` \| ``"04"``

The 2-digit number indicating the delivery timeframe

Possible values:
 - "01": Electronic delivery
 - "02": Same day shipping
 - "03": Overnight shipping
 - "04": Two or more day shipping

___

### fraudActivity

• `Optional` **fraudActivity**: ``"01"`` \| ``"02"``

Optional. The 2-digit value indicating whether the merchant experienced suspicious activity (including previous fraud) on the account.
Possible values:
01 No suspicious activity
02 Suspicious activity observed

___

### giftCardAmount

• `Optional` **giftCardAmount**: `string`

The purchase amount total for prepaid gift cards in major units

___

### giftCardCount

• `Optional` **giftCardCount**: `string`

Total count of individual prepaid gift cards purchased

___

### giftCardCurrencyCode

• `Optional` **giftCardCurrencyCode**: `string`

ISO 4217 currency code for the gift card purchased

___

### installment

• `Optional` **installment**: `string`

Optional.  An integer value greater than 1 indicating the maximum number of permitted authorizations for installment payments.

___

### ipAddress

• `Optional` **ipAddress**: `string`

Optional. The IP address of the consumer. IPv4 and IPv6 are supported.

___

### orderDescription

• `Optional` **orderDescription**: `string`

Optional. Brief description of items purchased.

___

### paymentAccountAge

• `Optional` **paymentAccountAge**: `string`

Optional. The 8-digit number (format: YYYYMMDD) indicating the date the payment account was added to the cardholder account.

___

### paymentAccountIndicator

• `Optional` **paymentAccountIndicator**: ``"01"`` \| ``"02"`` \| ``"03"`` \| ``"04"`` \| ``"05"``

Optional. The 2-digit value indicating the length of time that the payment account was enrolled in the merchant account.
Possible values:
01 No account (guest checkout)
02 During the transaction
03 Less than 30 days
04 30-60 days
05 More than 60 days

___

### preorderDate

• `Optional` **preorderDate**: `string`

The 8-digit number (format: YYYYMMDD) indicating expected date that a pre-ordered purchase will be available

___

### preorderIndicator

• `Optional` **preorderIndicator**: ``"01"`` \| ``"02"``

The 2-digit number indicating whether the cardholder is placing an order with a future availability or release date

Possible values:
 - "01": Merchandise available
 - "02": Future availability

___

### productCode

• `Optional` **productCode**: ``"AIR"`` \| ``"GEN"`` \| ``"DIG"`` \| ``"SVC"`` \| ``"RES"`` \| ``"TRA"`` \| ``"DSP"`` \| ``"REN"`` \| ``"GAS"`` \| ``"LUX"`` \| ``"ACC"`` \| ``"TBD"``

The 3-letter string representing the merchant product code

Possible Values:
 - "AIR": Airline
 - "GEN": General Retail
 - "DIG": Digital Goods
 - "SVC": Services
 - "RES": Restaurant
 - "TRA": Travel
 - "DSP": Cash Dispensing
 - "REN": Car Rental
 - "GAS": Fueld
 - "LUX": Luxury Retail
 - "ACC": Accommodation Retail
 - "TBD": Other

___

### purchaseDate

• `Optional` **purchaseDate**: `string`

Optional. The 14-digit number (format: YYYYMMDDHHMMSS) indicating the date in UTC of original purchase.

___

### recurringEnd

• `Optional` **recurringEnd**: `string`

Optional. The 8-digit number (format: YYYYMMDD) indicating the date after which no further recurring authorizations should be performed..

___

### recurringFrequency

• `Optional` **recurringFrequency**: `string`

Optional. Integer value indicating the minimum number of days between recurring authorizations. A frequency of monthly is indicated by the value 28. Multiple of 28 days will be used to indicate months (ex. 6 months = 168).

___

### reorderIndicator

• `Optional` **reorderIndicator**: ``"01"`` \| ``"02"``

The 2-digit number indicating whether the cardholder is reordering previously purchased merchandise

Possible values:
 - "01": First time ordered
 - "02": Reordered

___

### sdkMaxTimeout

• `Optional` **sdkMaxTimeout**: `string`

Optional. The 2-digit number of minutes (minimum 05) to set the maximum amount of time for all 3DS 2.0 messages to be communicated between all components.

___

### shippingAddress

• `Optional` **shippingAddress**: [`PostalAddress`](CdvPurchase.Braintree.ThreeDSecure.PostalAddress.md)

The shipping address used for verification

___

### shippingAddressUsageDate

• `Optional` **shippingAddressUsageDate**: `string`

Optional. The 8-digit number (format: YYYYMMDD) indicating the date when the shipping address used for this transaction was first used.

___

### shippingAddressUsageIndicator

• `Optional` **shippingAddressUsageIndicator**: ``"01"`` \| ``"02"`` \| ``"03"`` \| ``"04"``

Optional. The 2-digit value indicating when the shipping address used for transaction was first used.

Possible values:
01 This transaction
02 Less than 30 days
03 30-60 days
04 More than 60 days

___

### shippingMethodIndicator

• `Optional` **shippingMethodIndicator**: ``"01"`` \| ``"02"`` \| ``"03"`` \| ``"04"`` \| ``"05"`` \| ``"06"`` \| ``"07"``

The 2-digit string indicating the shipping method chosen for the transaction

Possible Values:
 - "01": Ship to cardholder billing address
 - "02": Ship to another verified address on file with merchant
 - "03": Ship to address that is different than billing address
 - "04": Ship to store (store address should be populated on request)
 - "05": Digital goods
 - "06": Travel and event tickets, not shipped
 - "07": Other

___

### shippingNameIndicator

• `Optional` **shippingNameIndicator**: ``"01"`` \| ``"02"``

Optional. The 2-digit value indicating if the cardholder name on the account is identical to the shipping name used for the transaction.
Possible values:
01 Account name identical to shipping name
02 Account name different than shipping name

___

### taxAmount

• `Optional` **taxAmount**: `string`

Optional. Unformatted tax amount without any decimalization (ie. $123.67 = 12367).

___

### transactionCountDay

• `Optional` **transactionCountDay**: `string`

Optional. Number of transactions (successful or abandoned) for this cardholder account within the last 24 hours.

___

### transactionCountYear

• `Optional` **transactionCountYear**: `string`

Optional. Number of transactions (successful or abandoned) for this cardholder account within the last year.

___

### userAgent

• `Optional` **userAgent**: `string`

Optional. The exact content of the HTTP user agent header.

___

### workPhoneNumber

• `Optional` **workPhoneNumber**: `string`

Optional. The work phone number used for verification. Only numbers; remove dashes, parenthesis and other characters.
