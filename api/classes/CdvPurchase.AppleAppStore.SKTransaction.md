# Class: SKTransaction

[CdvPurchase](../modules/CdvPurchase.md).[AppleAppStore](../modules/CdvPurchase.AppleAppStore.md).SKTransaction

## Hierarchy

- [`Transaction`](CdvPurchase.Transaction.md)

  ↳ **`SKTransaction`**

## Constructors

### constructor

• **new SKTransaction**(`platform`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `platform` | [`Platform`](../enums/CdvPurchase.Platform.md) |

#### Inherited from

[Transaction](CdvPurchase.Transaction.md).[constructor](CdvPurchase.Transaction.md#constructor)

## Properties

### expirationDate

• `Optional` **expirationDate**: `Date`

Time when the subscription is set to expire following this transaction

#### Inherited from

[Transaction](CdvPurchase.Transaction.md).[expirationDate](CdvPurchase.Transaction.md#expirationdate)

___

### isAcknowledged

• `Optional` **isAcknowledged**: `boolean`

True when the transaction has been acknowledged to the platform.

#### Inherited from

[Transaction](CdvPurchase.Transaction.md).[isAcknowledged](CdvPurchase.Transaction.md#isacknowledged)

___

### isConsumed

• `Optional` **isConsumed**: `boolean`

True when the transaction was consumed.

#### Inherited from

[Transaction](CdvPurchase.Transaction.md).[isConsumed](CdvPurchase.Transaction.md#isconsumed)

___

### isPending

• `Optional` **isPending**: `boolean`

True when the transaction is still pending payment.

#### Inherited from

[Transaction](CdvPurchase.Transaction.md).[isPending](CdvPurchase.Transaction.md#ispending)

___

### lastRenewalDate

• `Optional` **lastRenewalDate**: `Date`

Time a subscription was last renewed

#### Inherited from

[Transaction](CdvPurchase.Transaction.md).[lastRenewalDate](CdvPurchase.Transaction.md#lastrenewaldate)

___

### platform

• **platform**: [`Platform`](../enums/CdvPurchase.Platform.md)

Platform this transaction was created on

#### Inherited from

[Transaction](CdvPurchase.Transaction.md).[platform](CdvPurchase.Transaction.md#platform)

___

### products

• **products**: { `offerId?`: `string` ; `productId`: `string`  }[] = `[]`

Purchased products

#### Inherited from

[Transaction](CdvPurchase.Transaction.md).[products](CdvPurchase.Transaction.md#products)

___

### purchaseDate

• `Optional` **purchaseDate**: `Date`

Time the purchase was made.

For subscriptions this is equal to the date of the first transaction.
Note that it might be undefined for deleted transactions (google for instance don't provide any info in that case).

#### Inherited from

[Transaction](CdvPurchase.Transaction.md).[purchaseDate](CdvPurchase.Transaction.md#purchasedate)

___

### purchaseId

• `Optional` **purchaseId**: `string`

Identifier for the purchase this transaction is a part of.

#### Inherited from

[Transaction](CdvPurchase.Transaction.md).[purchaseId](CdvPurchase.Transaction.md#purchaseid)

___

### renewalIntent

• `Optional` **renewalIntent**: [`RenewalIntent`](../enums/CdvPurchase.RenewalIntent.md)

Is the subscription set to renew.

#### Inherited from

[Transaction](CdvPurchase.Transaction.md).[renewalIntent](CdvPurchase.Transaction.md#renewalintent)

___

### renewalIntentChangeDate

• `Optional` **renewalIntentChangeDate**: `Date`

Time when the renewal intent was changed

#### Inherited from

[Transaction](CdvPurchase.Transaction.md).[renewalIntentChangeDate](CdvPurchase.Transaction.md#renewalintentchangedate)

___

### state

• **state**: [`TransactionState`](../enums/CdvPurchase.TransactionState.md) = `TransactionState.UNKNOWN_STATE`

State this transaction is in

#### Inherited from

[Transaction](CdvPurchase.Transaction.md).[state](CdvPurchase.Transaction.md#state)

___

### transactionId

• **transactionId**: `string` = `''`

Transaction identifier.

#### Inherited from

[Transaction](CdvPurchase.Transaction.md).[transactionId](CdvPurchase.Transaction.md#transactionid)
