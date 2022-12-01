# Class: Transaction

[CdvPurchase](../modules/CdvPurchase.md).[GooglePlay](../modules/CdvPurchase.GooglePlay.md).Transaction

Transaction as reported by the device

**`See`**

 - [Receipt](CdvPurchase.GooglePlay.Receipt.md)
 - store.localTransactions

## Hierarchy

- [`Transaction`](CdvPurchase.Transaction.md)

  ↳ **`Transaction`**

## Table of contents

### Constructors

- [constructor](CdvPurchase.GooglePlay.Transaction.md#constructor)

### Properties

- [amountMicros](CdvPurchase.GooglePlay.Transaction.md#amountmicros)
- [currency](CdvPurchase.GooglePlay.Transaction.md#currency)
- [expirationDate](CdvPurchase.GooglePlay.Transaction.md#expirationdate)
- [isAcknowledged](CdvPurchase.GooglePlay.Transaction.md#isacknowledged)
- [isConsumed](CdvPurchase.GooglePlay.Transaction.md#isconsumed)
- [isPending](CdvPurchase.GooglePlay.Transaction.md#ispending)
- [lastRenewalDate](CdvPurchase.GooglePlay.Transaction.md#lastrenewaldate)
- [nativePurchase](CdvPurchase.GooglePlay.Transaction.md#nativepurchase)
- [platform](CdvPurchase.GooglePlay.Transaction.md#platform)
- [products](CdvPurchase.GooglePlay.Transaction.md#products)
- [purchaseDate](CdvPurchase.GooglePlay.Transaction.md#purchasedate)
- [purchaseId](CdvPurchase.GooglePlay.Transaction.md#purchaseid)
- [renewalIntent](CdvPurchase.GooglePlay.Transaction.md#renewalintent)
- [renewalIntentChangeDate](CdvPurchase.GooglePlay.Transaction.md#renewalintentchangedate)
- [state](CdvPurchase.GooglePlay.Transaction.md#state)
- [transactionId](CdvPurchase.GooglePlay.Transaction.md#transactionid)

### Accessors

- [parentReceipt](CdvPurchase.GooglePlay.Transaction.md#parentreceipt)

### Methods

- [finish](CdvPurchase.GooglePlay.Transaction.md#finish)
- [refresh](CdvPurchase.GooglePlay.Transaction.md#refresh)
- [verify](CdvPurchase.GooglePlay.Transaction.md#verify)
- [toState](CdvPurchase.GooglePlay.Transaction.md#tostate)

## Constructors

### constructor

• **new Transaction**(`purchase`, `parentReceipt`, `decorator`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `purchase` | [`Purchase`](../interfaces/CdvPurchase.GooglePlay.Bridge.Purchase.md) |
| `parentReceipt` | [`Receipt`](CdvPurchase.GooglePlay.Receipt.md) |
| `decorator` | `TransactionDecorator` |

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

### nativePurchase

• **nativePurchase**: [`Purchase`](../interfaces/CdvPurchase.GooglePlay.Bridge.Purchase.md)

___

### platform

• **platform**: [`Platform`](../enums/CdvPurchase.Platform.md)

Platform this transaction was created on

#### Inherited from

[Transaction](CdvPurchase.Transaction.md).[platform](CdvPurchase.Transaction.md#platform)

___

### products

• **products**: { `id`: `string` ; `offerId?`: `string`  }[] = `[]`

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

#### Inherited from

[Transaction](CdvPurchase.Transaction.md).[finish](CdvPurchase.Transaction.md#finish)

___

### refresh

▸ **refresh**(`purchase`): `void`

Refresh the value in the transaction based on the native purchase update

#### Parameters

| Name | Type |
| :------ | :------ |
| `purchase` | [`Purchase`](../interfaces/CdvPurchase.GooglePlay.Bridge.Purchase.md) |

#### Returns

`void`

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

#### Inherited from

[Transaction](CdvPurchase.Transaction.md).[verify](CdvPurchase.Transaction.md#verify)

___

### toState

▸ `Static` **toState**(`state`, `isAcknowledged`): [`TransactionState`](../enums/CdvPurchase.TransactionState.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`PurchaseState`](../enums/CdvPurchase.GooglePlay.Bridge.PurchaseState.md) |
| `isAcknowledged` | `boolean` |

#### Returns

[`TransactionState`](../enums/CdvPurchase.TransactionState.md)
