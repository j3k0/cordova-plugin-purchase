# Interface: TransactionInfo

[Braintree](../modules/CdvPurchase.Braintree.md).[GooglePay](../modules/CdvPurchase.Braintree.GooglePay.md).TransactionInfo

Represents information about a transaction.

This interface represents information about a transaction, including the currency code (in ISO 4217 format), the total price, and the status of the total price.
The totalPriceStatus field is of type TotalPriceStatus, which is an enum that can take on one of the following values:
- TotalPriceStatus.ESTIMATED: The total price is an estimate.
- TotalPriceStatus.FINAL: The total price is final.

## Table of contents

### Properties

- [currencyCode](CdvPurchase.Braintree.GooglePay.TransactionInfo.md#currencycode)
- [totalPrice](CdvPurchase.Braintree.GooglePay.TransactionInfo.md#totalprice)
- [totalPriceStatus](CdvPurchase.Braintree.GooglePay.TransactionInfo.md#totalpricestatus)

## Properties

### currencyCode

• **currencyCode**: `string`

ISO 4217 currency code of the transaction.

___

### totalPrice

• **totalPrice**: `number`

Total price of the transaction.

___

### totalPriceStatus

• **totalPriceStatus**: [`TotalPriceStatus`](../enums/CdvPurchase.Braintree.GooglePay.TotalPriceStatus.md)

Status of the total price.
