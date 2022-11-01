# Interface: Body

[Validator](../modules/CdvPurchase.Validator.md).[Request](../modules/CdvPurchase.Validator.Request.md).Body

Body of a receipt validation request

## Properties

### additionalData

• `Optional` **additionalData**: `Object`

Additional data about the purchase

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `applicationUsername?` | `string` \| `number` | Attach the purchases to the given application user. Should be a string.  See [/documentation/application-username](/documentation/application-username) for more information.  **`Optional`** |

___

### billingPeriod

• `Optional` **billingPeriod**: `string` \| `number`

Number of periods units of between payments.

___

### billingPeriodUnit

• `Optional` **billingPeriodUnit**: [`SubscriptionPeriodUnit`](../modules/CdvPurchase.Validator.Request.md#subscriptionperiodunit)

Period unit used to define the billing interval (Day, Week, Month or Year)

___

### countryCode

• `Optional` **countryCode**: `string`

The requesting users' 3 letters ISO Country Code.

___

### currency

• `Optional` **currency**: `string`

Currency used for this product price (cf `priceMicros`)

___

### device

• `Optional` **device**: [`DeviceInfo`](CdvPurchase.Validator.DeviceInfo.md)

Metadata about the user's device

___

### group

• `Optional` **group**: `string`

The subscription group this product is part of

___

### id

• `Optional` **id**: `string`

Identifier of the product you want to validate. On iOS, can be set to your application identifier.

**`Required`**

___

### introPriceMicros

• `Optional` **introPriceMicros**: `number`

Define the price of this product in the introductory period, in micro units, for the associated currency

___

### introPricePeriod

• `Optional` **introPricePeriod**: `string` \| `number`

Number of periods units of introductory pricing

___

### introPricePeriodUnit

• `Optional` **introPricePeriodUnit**: [`SubscriptionPeriodUnit`](../modules/CdvPurchase.Validator.Request.md#subscriptionperiodunit)

Period unit of introductory pricing (Day, Week, Month or Year)

___

### license

• `Optional` **license**: `Object`

Microsoft license information

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `storeIdKey_collections?` | `string` | Microsoft b2bKey for collections.  **`Optional`** |
| `storeIdKey_purchases?` | `string` | Microsoft b2bKey for purchases.  **`Optional`** |

___

### offers

• `Optional` **offers**: { `id`: `string` ; `pricingPhases`: [`PricingPhase`](CdvPurchase.PricingPhase.md)[]  }[]

___

### priceMicros

• `Optional` **priceMicros**: `number`

Define the price of the product in micro units (i.e. `price / 1000000`) for the associated currency

___

### transaction

• `Optional` **transaction**: [`ApiValidatorBodyTransaction`](../modules/CdvPurchase.Validator.Request.md#apivalidatorbodytransaction)

Details about the native transaction.

Can be:
<ul>
 <li>An <a href="#api-Types-Validate.TransactionApple">Apple Transaction</a></li>
 <li>A <a href="#api-Types-Validate.TransactionGoogle">Google Transaction</a></li>
 <li>A <a href="#api-Types-Validate.TransactionWindows">Windows Transaction</a></li>
 <li>A <a href="#api-Types-Validate.TransactionStripe">Stripe Transaction</a></li>
</ul>

**`Required`**

___

### trialPeriod

• `Optional` **trialPeriod**: `string` \| `number`

Define the duration of the trial period, number of period units

___

### trialPeriodUnit

• `Optional` **trialPeriodUnit**: [`SubscriptionPeriodUnit`](../modules/CdvPurchase.Validator.Request.md#subscriptionperiodunit)

Define the unit for the duration of the trial period (Day, Week, Month, Year)

___

### type

• `Optional` **type**: [`ProductType`](../enums/CdvPurchase.ProductType.md)

Type of product being validated. Possible values:

<ul>
<li>`application` – Validate the application download (Apple only).</li>
<li>`paid subscription` – An auto-renewing subscription.</li>
<li>`non renewing subscription` – A non renewing subscription.</li>
<li>`consumable` – A consumable product.</li>
<li>`non consumable` – A non-consumable product.</li>
</ul>

**`Required`**
