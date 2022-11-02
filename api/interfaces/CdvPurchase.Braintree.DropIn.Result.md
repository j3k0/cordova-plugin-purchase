# Interface: Result

[Braintree](../modules/CdvPurchase.Braintree.md).[DropIn](../modules/CdvPurchase.Braintree.DropIn.md).Result

## Table of contents

### Properties

- [deviceData](CdvPurchase.Braintree.DropIn.Result.md#devicedata)
- [paymentDescription](CdvPurchase.Braintree.DropIn.Result.md#paymentdescription)
- [paymentMethodNonce](CdvPurchase.Braintree.DropIn.Result.md#paymentmethodnonce)
- [paymentMethodType](CdvPurchase.Braintree.DropIn.Result.md#paymentmethodtype)

## Properties

### deviceData

• `Optional` **deviceData**: `string`

A `deviceData` string that represents data about a customer's device.

This is generated from Braintree's advanced fraud protection service.

`deviceData` should be passed into server-side calls, such as `Transaction.sale`.
This enables you to collect data about a customer's device and correlate it with a session identifier on your server.

Collecting and passing this data with transactions helps reduce decline rates and detect fraudulent transactions.

___

### paymentDescription

• `Optional` **paymentDescription**: `string`

A description of the payment method.

- For cards, the last four digits of the card number.
- For PayPal, the email address associated with the account.
- For Venmo, the username associated with the account.
- For Apple Pay, the text "Apple Pay".

___

### paymentMethodNonce

• `Optional` **paymentMethodNonce**: [`PaymentMethodNonce`](CdvPurchase.Braintree.DropIn.PaymentMethodNonce.md)

The previous [PaymentMethodNonce](CdvPurchase.Braintree.DropIn.PaymentMethodNonce.md) or `undefined` if there is no previous payment method
or the previous payment method was com.braintreepayments.api.GooglePayCardNonce.

___

### paymentMethodType

• `Optional` **paymentMethodType**: [`PaymentMethod`](../enums/CdvPurchase.Braintree.DropIn.PaymentMethod.md)

The previously used [PaymentMethod](../enums/CdvPurchase.Braintree.DropIn.PaymentMethod.md) or `undefined` if there was no
previous payment method. If the type is [GOOGLE_PAY](../enums/CdvPurchase.Braintree.DropIn.PaymentMethod.md#google_pay) the Google
Pay flow will need to be performed by the user again at the time of checkout,
[#paymentMethodNonce()](../modules/CdvPurchase.Braintree.DropIn.md) will be `undefined` in this case.
