# Interface: IntroductoryPriceInfo

[GooglePlay](../modules/CdvPurchase.GooglePlay.md).[PublisherAPI](../modules/CdvPurchase.GooglePlay.PublisherAPI.md).IntroductoryPriceInfo

Contains the introductory price information for a subscription.

## Table of contents

### Properties

- [introductoryPriceAmountMicros](CdvPurchase.GooglePlay.PublisherAPI.IntroductoryPriceInfo.md#introductorypriceamountmicros)
- [introductoryPriceCurrencyCode](CdvPurchase.GooglePlay.PublisherAPI.IntroductoryPriceInfo.md#introductorypricecurrencycode)
- [introductoryPriceCycles](CdvPurchase.GooglePlay.PublisherAPI.IntroductoryPriceInfo.md#introductorypricecycles)
- [introductoryPricePeriod](CdvPurchase.GooglePlay.PublisherAPI.IntroductoryPriceInfo.md#introductorypriceperiod)

## Properties

### introductoryPriceAmountMicros

• `Optional` **introductoryPriceAmountMicros**: ``null`` \| `string`

Introductory price of the subscription, not including tax. The currency is the same as price_currency_code. Price is expressed in micro-units, where 1,000,000 micro-units represents one unit of the currency. For example, if the subscription price is €1.99, price_amount_micros is 1990000.

___

### introductoryPriceCurrencyCode

• `Optional` **introductoryPriceCurrencyCode**: ``null`` \| `string`

ISO 4217 currency code for the introductory subscription price. For example, if the price is specified in British pounds sterling, price_currency_code is "GBP".

___

### introductoryPriceCycles

• `Optional` **introductoryPriceCycles**: ``null`` \| `number`

The number of billing period to offer introductory pricing.

___

### introductoryPricePeriod

• `Optional` **introductoryPricePeriod**: ``null`` \| `string`

Introductory price period, specified in ISO 8601 format. Common values are (but not limited to) "P1W" (one week), "P1M" (one month), "P3M" (three months), "P6M" (six months), and "P1Y" (one year).
