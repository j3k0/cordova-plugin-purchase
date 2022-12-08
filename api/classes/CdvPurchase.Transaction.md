# Class: Transaction

[CdvPurchase](../modules/CdvPurchase.md).Transaction

Transaction as reported by the device

**`See`**

 - [Receipt](CdvPurchase.Receipt.md)
 - store.localTransactions

## Hierarchy

- **`Transaction`**

  ↳ [`SKTransaction`](CdvPurchase.AppleAppStore.SKTransaction.md)

  ↳ [`Transaction`](CdvPurchase.GooglePlay.Transaction.md)

## Table of contents

### Properties

- [amountMicros](CdvPurchase.Transaction.md#amountmicros)
- [currency](CdvPurchase.Transaction.md#currency)
- [expirationDate](CdvPurchase.Transaction.md#expirationdate)
- [isAcknowledged](CdvPurchase.Transaction.md#isacknowledged)
- [isConsumed](CdvPurchase.Transaction.md#isconsumed)
- [isPending](CdvPurchase.Transaction.md#ispending)
- [lastRenewalDate](CdvPurchase.Transaction.md#lastrenewaldate)
- [platform](CdvPurchase.Transaction.md#platform)
- [products](CdvPurchase.Transaction.md#products)
- [purchaseDate](CdvPurchase.Transaction.md#purchasedate)
- [purchaseId](CdvPurchase.Transaction.md#purchaseid)
- [renewalIntent](CdvPurchase.Transaction.md#renewalintent)
- [renewalIntentChangeDate](CdvPurchase.Transaction.md#renewalintentchangedate)
- [state](CdvPurchase.Transaction.md#state)
- [transactionId](CdvPurchase.Transaction.md#transactionid)

### Accessors

- [parentReceipt](CdvPurchase.Transaction.md#parentreceipt)

### Methods

- [finish](CdvPurchase.Transaction.md#finish)
- [verify](CdvPurchase.Transaction.md#verify)

## Properties

### amountMicros

• `Optional` **amountMicros**: `number`

Amount paid by the user, if known, in micro units. Divide by 1,000,000 for value.

___

### currency

• `Optional` **currency**: `string`

Currency used to pay for the transaction, if known.

___

### expirationDate

• `Optional` **expirationDate**: `Date`

Time when the subscription is set to expire following this transaction

___

### isAcknowledged

• `Optional` **isAcknowledged**: `boolean`

True when the transaction has been acknowledged to the platform.

___

### isConsumed

• `Optional` **isConsumed**: `boolean`

True when the transaction was consumed.

___

### isPending

• `Optional` **isPending**: `boolean`

True when the transaction is still pending payment.

___

### lastRenewalDate

• `Optional` **lastRenewalDate**: `Date`

Time a subscription was last renewed

___

### platform

• **platform**: [`Platform`](../enums/CdvPurchase.Platform.md)

Platform this transaction was created on

___

### products

• **products**: { `id`: `string` ; `offerId?`: `string`  }[] = `[]`

Purchased products

___

### purchaseDate

• `Optional` **purchaseDate**: `Date`

Time the purchase was made.

For subscriptions this is equal to the date of the first transaction.
Note that it might be undefined for deleted transactions (google for instance don't provide any info in that case).

___

### purchaseId

• `Optional` **purchaseId**: `string`

Identifier for the purchase this transaction is a part of.

___

### renewalIntent

• `Optional` **renewalIntent**: [`RenewalIntent`](../enums/CdvPurchase.RenewalIntent.md)

Is the subscription set to renew.

___

### renewalIntentChangeDate

• `Optional` **renewalIntentChangeDate**: `Date`

Time when the renewal intent was changed

___

### state

• **state**: [`TransactionState`](../enums/CdvPurchase.TransactionState.md) = `TransactionState.UNKNOWN_STATE`

State this transaction is in

___

### transactionId

• **transactionId**: `string` = `''`

Transaction identifier.

## Accessors

### parentReceipt

• `get` **parentReceipt**(): [`Receipt`](CdvPurchase.Receipt.md)

Return the receipt this transaction is part of.

#### Returns

[`Receipt`](CdvPurchase.Receipt.md)

## Methods

### finish

▸ **finish**(): `Promise`<`void`\>

Finish a transaction.

When the application has delivered the product, it should finalizes the order.
Only after that, money will be transferred to your account.
This method ensures that no customers is charged for a product that couldn't be delivered.

**`Example`**

```ts
store.when()
  .approved(transaction => transaction.verify())
  .verified(receipt => receipt.finish())
```

#### Returns

`Promise`<`void`\>

___

### verify

▸ **verify**(): `Promise`<`void`\>

Verify a transaction.

This will trigger a call to the receipt validation service for the attached receipt.
Once the receipt has been verified, you can finish the transaction.

**`Example`**

```ts
store.when()
  .approved(transaction => transaction.verify())
  .verified(receipt => receipt.finish())
```

#### Returns

`Promise`<`void`\>
