# Interface: InAppOffer

[GooglePlay](../modules/CdvPurchase.GooglePlay.md).[Bridge](../modules/CdvPurchase.GooglePlay.Bridge.md).InAppOffer

One-time purchase offer details (new in Billing Library 8.0.0)

## Table of contents

### Properties

- [formatted\_price](CdvPurchase.GooglePlay.Bridge.InAppOffer.md#formatted_price)
- [offer\_id](CdvPurchase.GooglePlay.Bridge.InAppOffer.md#offer_id)
- [offer\_tags](CdvPurchase.GooglePlay.Bridge.InAppOffer.md#offer_tags)
- [offer\_token](CdvPurchase.GooglePlay.Bridge.InAppOffer.md#offer_token)
- [price\_amount\_micros](CdvPurchase.GooglePlay.Bridge.InAppOffer.md#price_amount_micros)
- [price\_currency\_code](CdvPurchase.GooglePlay.Bridge.InAppOffer.md#price_currency_code)

## Properties

### formatted\_price

• **formatted\_price**: `string`

Formatted price for display

___

### offer\_id

• **offer\_id**: ``null`` \| `string`

Offer id associated with this offer (may be null for default offer)

___

### offer\_tags

• **offer\_tags**: `string`[]

___

### offer\_token

• **offer\_token**: `string`

Token required to pass in launchBillingFlow to purchase with this offer

___

### price\_amount\_micros

• **price\_amount\_micros**: `number`

Price in micro-units (divide by 1000000 to get numeric price)

___

### price\_currency\_code

• **price\_currency\_code**: `string`

ISO 4217 currency code
