# Migrate to v13

Version 13 of the plugin introduces breaking changes. Let see what has changed and how to update an existing code.

**Ionic / Capacitor** users should also notice that "awesome-cordova-plugins" wasn't updated with the new API. However you can use this cordova plugin directly, without the wrapper.

## Global `store` object is now `CdvPurchase.store`

The plugin used to export the `store` object globally, in `window.store`. Some users complained that this interferes with other libraries. The global object is now in [CdvPurchase.store](../blob/v13/api/modules/CdvPurchase.md#store).

If you wish to minimize changes to your code, you can chose to export it globally by doing `window.store = window.CdvPurchase.store`. Typescript will have to add the type definition: `declare interface Window { store: CdvPurchase.Store; }`.

Every time you see `store` mentioned below, this refers to `CdvPurchase.store`.

## store.refresh() is now store.initialize() (and co.)

The `store.refresh()` method had 3 different purposes:

1. initialize the plugin
2. refresh product prices and status of purchases
3. restore purchases (on iOS)

The plugin now has one method for each of those purposes:

1. use [`store.initialize()`](/j3k0/cordova-plugin-purchase/blob/v13/api/classes/CdvPurchase.Store.md#initialize) at initialization
2. use [`store.update()`](/j3k0/cordova-plugin-purchase/blob/v13/api/classes/CdvPurchase.Store.md#update) to refresh product prices and status of purchases
3. use [`store.restorePurchases()`](/j3k0/cordova-plugin-purchase/blob/v13/api/classes/CdvPurchase.Store.md#restorePurchases) to restore purchases

## store.register() now requires a platform field

The plugin can now interacts with multiple payment platforms. As such, it needs to know which platform the registered products are related to.

- Before: `store.register([{ id, type }])`
- After: [`store.register([{id, type, platform }])`](/j3k0/cordova-plugin-purchase/blob/v13/api/classes/CdvPurchase.Store.md#register)

The value for `platform` has to be one from the enumeration [CdvPurchase.Platform](../blob/v13/api/enums/CdvPurchase.Platform.md).

## Products information has been refactored

The products in the plugin used to include a mix of:

- Metadata information from the store (price, description, ...)
- Purchase information related to the product, as reported by the device.
- Additional information added by the receipt validation server.

Those 3 categories have now been split into 3 different classes of objects:

- [Product](../blob/v13/api/classes/CdvPurchase.Product.md): only metadata from the store - title, offers, pricing, ...
- [Receipt](../blob/v13/api/classes/CdvPurchase.Receipt.md): information about the users' purchases, as reported by the device.
- [VerifiedReceipt](../blob/v13/api/classes/CdvPurchase.VerifiedReceipt.md): information returned by the receipt validation service.

## store.when("some_filter") is now store.when()

store.when() will trigger events that are now specific to either products, transactions or receipts.

- `store.when().productUpdated(product => {})`
- `store.when().approved(transaction => {})`
- `store.when().receiptUpdated(localReceipt => {})`
- `store.when().verified(verifiedReceipt => {})`

There is no more filter argument to `store.when()`, just implement your own filter in the event handler if necessary.

⚠️ **iOS:** You now must filter based on your own product ids, because the `.when()` handler triggers on every app start and gets passed the application's own bundle ID as a transaction. See [#1398](https://github.com/j3k0/cordova-plugin-purchase/issues/1398) and [#1428](https://github.com/j3k0/cordova-plugin-purchase/issues/1428).

More info: [CdvPurchase.Store.when](https://github.com/j3k0/cordova-plugin-purchase/blob/master/api/classes/CdvPurchase.Store.md#when).

### Product fields

Let's see how the information is now represented:

| Field | Class | Note |
|---|---|---|
| `.id` | Product | Unchanged: `store.get("pid").id` |
| `.type` | Product | Unchanged: `store.get("pid").type` |
| `.title` | Product | Unchanged: `store.get("pid").title` |
| `.description` | Product | Unchanged: `store.get("pid").description` |
| `.alias` |  | Removed: This field doesn't exist anymore |
| `.group` | Product |  Unchanged: `store.get("pid").group` |
| `.state` | All | `state` is now a function of what is known about the product. More details below this table. |
| `.priceMicros` | Product | See "Offers and Pricing" below this table. `priceMicros` is now in the final pricing period. In simple cases, you can use the shortcut: [product.pricing](../blob/v13/api/classes/CdvPurchase.Product.md#pricing) - `product.pricing.priceMicros` |
| `.price` | Product | Same as above. Simple case: `product.pricing.price` |
| `.currency` | Product | Same as above. Simple case: `product.pricing.currency` |
| `.billingPeriod*` | Product | Same as above. |
| `.introPrice*` | Product | Same as above. The intro price will be the first phase for multi-phase pricing. |
| `.trialPeriod*` | Product | Same as above. |
| `.countryCode` |   | Removed. |
| `.loaded` | Product | If the product is listed in the store when `initialize()` is done, then it's loaded and valid. `store.get("pid")` |
| `.valid` | Product | Same as above |
| `.canPurchase` | Product | Same as before |
| `.owned` | Product | Same as before |
| `.deferred` | Receipt | `store.findInLocalReceipts(product).state === TransactionState.PENDING` |
| `.ineligibleForIntroPrice` | VerifiedReceipt | Check that the receipt doesn't include any transaction for the given product |
| `.discounts` | Product | Discounts are now listed as additional offers in `product.offers` |
| `.downloading` |   | Support for downloadable content has been deprecated by Apple and dropped from the plugin |
| `.downloaded` |   | Same as above |
| `.additionalData` |  | Passed when placing an order with `store.order` or `store.requestPayment` |
| `.transaction` | VerifiedReceipt | `store.verifiedReceipts[].nativeTransactions` - Using this directly shouldn't be required. |
| `.expiryDate` | VerifiedReceipt | It's an info you should get from your server. |
| `.lastRenewalDate` | VerifiedReceipt | `store.findInVerifiedReceipts(product).lastRenewalDate` |

### Product state

- `valid` or `invalid` - If `store.get("pid")` returns an entry, it means the product is valid.
- `approved`, `finished` - Can be found if there's a transaction in the local receipt: `store.findInLocalReceipts(product).state`
- `owned` - Use the `product.owned` property or `store.owned("pid")`

### Offers and Pricing

A product can now have multiple offers, each offer possibly having multiple pricing phases.

Pricing information is now detailed in an array of `offers` in the product. Each offer can be priced in multiple phases (think: trial, followed by reduced price, followed by final price). So each offer contains a array of [PricingPhase](../blob/v13/api/interfaces/CdvPurchase.PricingPhase.md): `offer.pricingPhases`.

However, as most people like keeping it simple, you probably have a single offer with a single pricing phase for their products. So the plugin provides shortcuts to make the code more bearable:

- `product.pricing` - the sole pricing phase for the offer linked with the product: same as `product.offers[0].pricingPhases[0]`.
- `product.getOffer()` - the offer linked with the product.

See [product.offers](../blob/v13/api/classes/CdvPurchase.Product.md#offers) and [product.offers](../blob/v13/api/classes/CdvPurchase.Product.md#pricing).

An example.

**Before:**
```ts
console.log(`title: ${product.title}`);
if (product.price) {
  console.log(`price: ${product.price} ${product.currency}`);
}
```

**After:**
```ts
console.log(`title: ${product.title}`);
const pricing = product.pricing; // assuming there is a single offer with a single pricing phase
if (pricing) {
  console.log(`price: ${pricing.price} ${pricing.currency}`);
}
```

In the most complex case, a subscription with **multiple offers** and **multiple pricing phases**:
```ts
function renderOffers(product) {
  product.offers.forEach((offer, index) => {
    console.log(` - OFFER #${index + 1}: ` + offer.pricingPhases.map(pricing => {
      return `${pricing.price} (${CdvPurchase.Utils.formatBillingCycleEN(pricing)})`;
    }).join(' THEN '));
  });
}
```

- `CdvPurchase.Utils.formatBillingCycleEN(pricingPhase)` is an utility function that formats the pricing phase's billing cycle to plain English.

## Product events

Events used to be triggered for a product, they now apply to either a product, receipt or transaction.

| Event | Class | Note |
|---|---|---|
| `approved` | Transaction | Called when the transaction is approved |
| `verified` | Receipt | Called when a receipt has been verified |
| `finished` | Transaction | Called when a transaction has been finished |
| `owned` | _N/A_ | This event isn't triggered any more. You should listen for updates to the receipts. A general-case replacement is to check for ownership in `store.when().verified(receipt)`. See the [Product ownership](#product_ownership) section below. |
| `updated` | _deprecated_ | Use `store.when().productUpdated()` or `store.when().receiptUpdated()` |

_You'll notice after reading the next section that the required changes will generally be quite minimal._

## Product methods

Let's see where product's methods are now located:

| Method | Class | Note |
|---|---|---|
| `.verify()` | Transaction | Code is typically unchanged: `store.when().approved(tr => tr.verify())` |
| `.finish()` | Transaction or Receipt | Code is typically unchanged: `store.when().verified(receipt => receipt.finish())` |

## store.order() takes an offer

When placing a purchase, you need to specify which of the product's offer you want to purchase. The `store.order()` method now the offer that you wish to initiate a purchase. For example:

```ts
const offer = product.getOffer("offer-id");
store.order(offer);
```

As an alternative, you can also call `.order()` on the `Offer` object.

```ts
offer.order();
```

## Product ownership

At any moment, you can check `product.owned` or `store.owned(productID)` to see if a given product is owned. Notice however that this value will be `false` when the app starts and become `true` only after purchase receipts have been loaded and (optionally) validated.

Since the `store.when().owned()` event have been removed, we'll detail below the different if you want to monitor changed of ownership status.

The recommended approach depends on your use case:

### 1. You have a back-end server with user accounts

In that case, you enable receipt validations and store the ownership status of purchases server side and rely on that. Your server should probably provide the status of ownership of the in-app products you offer. This approach is cross-platform and allows user to switch devices while keeping the benefit of their purchase.

- If using a service like [iaptic (former Fovea.Billing)](https://www.iaptic.com/), this service will send server-to-server notifications from which you can update the status your users' collection of purchases.
- If you implement your own server-side receipt validation logic, update your users collection from there.

### 2. Using receipt validation with no back-end server

This is when you want to only rely on what the user owns based on the active store account (AppStore, GooglePlay, etc.), provide no user accounts so it doesn't matter if the user only has access to the feature on the device that share the same store account.

In that case the approach is to get the status of purchases when the receipt has been verified by the receipt validator. The plugin offers helpers that make the code quite simple.

**Option 1**, simple case:

```ts
store.when().verified(receipt => {
  if (store.owned("my-product")) {
    console.log("my-product is owned");
  }
});
```

**Option 2**, run through the content of the verified receipt:

```ts
store.when().verified(receipt => {
    receipt.collection.forEach(purchase => {
        if (store.owned(purchase)) {
            console.log("You own product: " + purchase.id);
        }
    });
});
```

### 3. Using local receipts

You are not validating receipt, only trusting what's reported by the device. Then the method is pretty similar, only you're gonna rely on the local receipt.

**Option 1**, simple check:

```ts
store.when().receiptUpdated(localReceipt => {
  if (store.owned("my-product")) {
    console.log("my-product is owned");
  }
});
```

**Option 2**, run through the list of transaction in the updated receipt:

```ts
store.when().receiptUpdated(localReceipt => {
    localReceipt.transactions.forEach(transaction => {
        transaction.products.forEach(product => {
            if (store.owned(product)) {
                console.log('You own product: ' + product.id);
            }
        });
    });
});
```

### Active ownership check

You can use `store.owned("id")` to see if a given product is owned. Internally, this will check if you've setup a receipt validator to decide to use either the content of local or verified receipts.

## Enumerations

All constants used to be added to the global `window.store` object. The plugin now organize them as dedicated enumerations (which makes code completion way more helpful).

- Product types, like `store.CONSUMABLE`, are now in `CdvPurchase.ProductType`. For example: `CdvPurchase.ProductType.CONSUMABLE`.
- Error codes, like `store.ERR_SETUP`, are now in `CdvPurchase.ErrorCode`. For example: `CdvPurchase.ErrorCode.SETUP`.
- Log levels, like `store.DEBUG`, are now in `CdvPurchase.LogLevel`. For example: `CdvPurchase.LogLevel.DEBUG`.

Notice that for backward compatibility, those constants are still merged into the `store` object, however it's recommended you switch to that new notation that is less error prone.

## Detecting failed purchases

To check for failed purchases, store.when("product").error() does not have a replacement in v13: you should now check for an error returned by the `store.order()` promise ([API Doc](https://github.com/j3k0/cordova-plugin-purchase/blob/master/api/classes/CdvPurchase.Store.md#order)).

```ts
store.order(...)
.then(error => {
  if (error) {
    if (error.code === CdvPurchase.ErrorCode.PAYMENT_CANCELLED) {
      // Purchase flow has been cancelled by user
    }
    else {
      // Other type of error, check error.code and error.message
    }
  }
});
```

More info: [CdvPurchase.ErrorCode](https://github.com/j3k0/cordova-plugin-purchase/blob/master/api/enums/CdvPurchase.ErrorCode.md)

## Detecting valid products

`store.when("product").valid(...)` was used to report when a product is valid. In the new version, only valid products are included in `store.products`, thus `store.when().productUpdated()` will only be called for valid products, so you can use it as a replacement.