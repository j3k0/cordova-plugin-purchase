# Class: Transaction

[CdvPurchase](../modules/CdvPurchase.md).[AmazonAppStore](../modules/CdvPurchase.AmazonAppStore.md).Transaction

Transaction as reported by the device

**`See`**

 - [Receipt](CdvPurchase.Receipt.md)
 - [store.localTransactions](CdvPurchase.Store.md#localtransactions)

## Hierarchy

- [`Transaction`](CdvPurchase.Transaction.md)

  ↳ **`Transaction`**

## Table of contents

### Constructors

- [constructor](CdvPurchase.AmazonAppStore.Transaction.md#constructor)

### Properties

- [amountMicros](CdvPurchase.AmazonAppStore.Transaction.md#amountmicros)
- [currency](CdvPurchase.AmazonAppStore.Transaction.md#currency)
- [expirationDate](CdvPurchase.AmazonAppStore.Transaction.md#expirationdate)
- [isAcknowledged](CdvPurchase.AmazonAppStore.Transaction.md#isacknowledged)
- [isConsumed](CdvPurchase.AmazonAppStore.Transaction.md#isconsumed)
- [isPending](CdvPurchase.AmazonAppStore.Transaction.md#ispending)
- [lastRenewalDate](CdvPurchase.AmazonAppStore.Transaction.md#lastrenewaldate)
- [nativePurchase](CdvPurchase.AmazonAppStore.Transaction.md#nativepurchase)
- [platform](CdvPurchase.AmazonAppStore.Transaction.md#platform)
- [products](CdvPurchase.AmazonAppStore.Transaction.md#products)
- [purchaseDate](CdvPurchase.AmazonAppStore.Transaction.md#purchasedate)
- [purchaseId](CdvPurchase.AmazonAppStore.Transaction.md#purchaseid)
- [renewalIntent](CdvPurchase.AmazonAppStore.Transaction.md#renewalintent)
- [renewalIntentChangeDate](CdvPurchase.AmazonAppStore.Transaction.md#renewalintentchangedate)
- [state](CdvPurchase.AmazonAppStore.Transaction.md#state)
- [transactionId](CdvPurchase.AmazonAppStore.Transaction.md#transactionid)

### Accessors

- [parentReceipt](CdvPurchase.AmazonAppStore.Transaction.md#parentreceipt)

### Methods

- [finish](CdvPurchase.AmazonAppStore.Transaction.md#finish)
- [refresh](CdvPurchase.AmazonAppStore.Transaction.md#refresh)
- [verify](CdvPurchase.AmazonAppStore.Transaction.md#verify)
- [toState](CdvPurchase.AmazonAppStore.Transaction.md#tostate)

## Constructors

### constructor

• **new Transaction**(`purchase`, `parentReceipt`, `decorator`): [`Transaction`](CdvPurchase.AmazonAppStore.Transaction.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `purchase` | [`AmazonPurchase`](../interfaces/CdvPurchase.AmazonAppStore.Bridge.AmazonPurchase.md) |
| `parentReceipt` | [`Receipt`](CdvPurchase.AmazonAppStore.Receipt.md) |
| `decorator` | `TransactionDecorator` |

#### Returns

[`Transaction`](CdvPurchase.AmazonAppStore.Transaction.md)

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

• **nativePurchase**: [`AmazonPurchase`](../interfaces/CdvPurchase.AmazonAppStore.Bridge.AmazonPurchase.md)

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

▸ **refresh**(`purchase`, `fromConstructor?`): `void`

Refresh the transaction based on the native purchase update

#### Parameters

| Name | Type |
| :------ | :------ |
| `purchase` | [`AmazonPurchase`](../interfaces/CdvPurchase.AmazonAppStore.Bridge.AmazonPurchase.md) |
| `fromConstructor?` | `boolean` |

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

___

### toState

▸ **toState**(`purchase`, `fromConstructor`): [`TransactionState`](../enums/CdvPurchase.TransactionState.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `purchase` | [`AmazonPurchase`](../interfaces/CdvPurchase.AmazonAppStore.Bridge.AmazonPurchase.md) |
| `fromConstructor` | `boolean` |

#### Returns

[`TransactionState`](../enums/CdvPurchase.TransactionState.md)
