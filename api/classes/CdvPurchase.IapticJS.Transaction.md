# Class: Transaction

[CdvPurchase](../modules/CdvPurchase.md).[IapticJS](../modules/CdvPurchase.IapticJS.md).Transaction

Transaction as reported by the device

**`See`**

 - [Receipt](CdvPurchase.Receipt.md)
 - [store.localTransactions](CdvPurchase.Store.md#localtransactions)

## Hierarchy

- [`Transaction`](CdvPurchase.Transaction.md)

  ↳ **`Transaction`**

## Table of contents

### Constructors

- [constructor](CdvPurchase.IapticJS.Transaction.md#constructor)

### Properties

- [amountMicros](CdvPurchase.IapticJS.Transaction.md#amountmicros)
- [currency](CdvPurchase.IapticJS.Transaction.md#currency)
- [expirationDate](CdvPurchase.IapticJS.Transaction.md#expirationdate)
- [isAcknowledged](CdvPurchase.IapticJS.Transaction.md#isacknowledged)
- [isConsumed](CdvPurchase.IapticJS.Transaction.md#isconsumed)
- [isPending](CdvPurchase.IapticJS.Transaction.md#ispending)
- [lastRenewalDate](CdvPurchase.IapticJS.Transaction.md#lastrenewaldate)
- [platform](CdvPurchase.IapticJS.Transaction.md#platform)
- [products](CdvPurchase.IapticJS.Transaction.md#products)
- [purchase](CdvPurchase.IapticJS.Transaction.md#purchase)
- [purchaseDate](CdvPurchase.IapticJS.Transaction.md#purchasedate)
- [purchaseId](CdvPurchase.IapticJS.Transaction.md#purchaseid)
- [quantity](CdvPurchase.IapticJS.Transaction.md#quantity)
- [renewalIntent](CdvPurchase.IapticJS.Transaction.md#renewalintent)
- [renewalIntentChangeDate](CdvPurchase.IapticJS.Transaction.md#renewalintentchangedate)
- [state](CdvPurchase.IapticJS.Transaction.md#state)
- [transactionId](CdvPurchase.IapticJS.Transaction.md#transactionid)

### Accessors

- [parentReceipt](CdvPurchase.IapticJS.Transaction.md#parentreceipt)

### Methods

- [finish](CdvPurchase.IapticJS.Transaction.md#finish)
- [refresh](CdvPurchase.IapticJS.Transaction.md#refresh)
- [verify](CdvPurchase.IapticJS.Transaction.md#verify)

## Constructors

### constructor

• **new Transaction**(`receipt`, `purchase`, `decorator`): [`Transaction`](CdvPurchase.IapticJS.Transaction.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `receipt` | [`Receipt`](CdvPurchase.IapticJS.Receipt.md) |
| `purchase` | `Purchase` |
| `decorator` | `TransactionDecorator` |

#### Returns

[`Transaction`](CdvPurchase.IapticJS.Transaction.md)

#### Overrides

CdvPurchase.Transaction.constructor

## Properties

### amountMicros

• `Optional` **amountMicros**: `number`

Amount paid by the user, if known, in micro units. Divide by 1,000,000 for value.

#### Inherited from

[Transaction](CdvPurchase.Transaction.md).[amountMicros](CdvPurchase.Transaction.md#amountmicros)

___

### currency

• `Optional` **currency**: `string`

Currency used to pay for the transaction, if known.

#### Inherited from

[Transaction](CdvPurchase.Transaction.md).[currency](CdvPurchase.Transaction.md#currency)

___

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

• **products**: \{ `id`: `string` ; `offerId?`: `string`  }[] = `[]`

Purchased products

#### Inherited from

[Transaction](CdvPurchase.Transaction.md).[products](CdvPurchase.Transaction.md#products)

___

### purchase

• **purchase**: `Purchase`

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

### quantity

• `Optional` **quantity**: `number`

Quantity of items purchased in a single transaction.

For consumable products, this value represents the number of items purchased.
For non-consumable products and subscriptions, this value is always 1.

This is only supported on Android (Google Play) platform when using the multi-quantity purchase feature.
On other platforms, the quantity is always 1.

#### Inherited from

[Transaction](CdvPurchase.Transaction.md).[quantity](CdvPurchase.Transaction.md#quantity)

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

## Accessors

### parentReceipt

• `get` **parentReceipt**(): [`Receipt`](CdvPurchase.Receipt.md)

Return the receipt this transaction is part of.

#### Returns

[`Receipt`](CdvPurchase.Receipt.md)

#### Inherited from

CdvPurchase.Transaction.parentReceipt

## Methods

### finish

▸ **finish**(): `Promise`\<`void`\>

Finish a transaction.

When the application has delivered the product, it should finalizes the order.
Only after that, money will be transferred to your account.
This method ensures that no customers is charged for a product that couldn't be delivered.

#### Returns

`Promise`\<`void`\>

**`Example`**

```ts
store.when()
  .approved(transaction => transaction.verify())
  .verified(receipt => receipt.finish())
```

#### Inherited from

[Transaction](CdvPurchase.Transaction.md).[finish](CdvPurchase.Transaction.md#finish)

___

### refresh

▸ **refresh**(`purchase`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `purchase` | `Purchase` |

#### Returns

`void`

___

### verify

▸ **verify**(): `Promise`\<`void`\>

Verify a transaction.

This will trigger a call to the receipt validation service for the attached receipt.
Once the receipt has been verified, you can finish the transaction.

#### Returns

`Promise`\<`void`\>

**`Example`**

```ts
store.when()
  .approved(transaction => transaction.verify())
  .verified(receipt => receipt.finish())
```

#### Inherited from

[Transaction](CdvPurchase.Transaction.md).[verify](CdvPurchase.Transaction.md#verify)
