# Multi-Quantity Purchases

Starting with version 13.11.1, cordova-plugin-purchase supports multi-quantity consumable purchases on Android (Google Play). Support for iOS (App Store) was added in version 13.14.1.

## Overview

Both Google Play and the App Store allow users to purchase multiple quantities of a consumable product in a single transaction. This is useful for apps that sell virtual goods or currencies that users might want to buy in bulk.

For example, a user might want to purchase 5 coins at once, instead of making 5 separate transactions.

## Platform Differences

The two platforms work differently:

- **Android (Google Play)**: The user sets the quantity in the Google Play purchase dialog. The developer has no control over quantity at order time — it is always set by the user.
- **iOS (App Store)**: The developer sets the quantity via `additionalData.quantity` when calling `store.order()`. The value must be an integer between 1 and 10 (Apple's limit). Check `store.checkSupport(platform, 'orderQuantity')` to know if the platform supports this.

## Usage

### Reading Quantity in Transactions

On both platforms, use `transaction.quantity` to know how many items were purchased:

```javascript
store.when()
  .approved(transaction => {
    const quantity = transaction.quantity || 1;
    console.log(`User purchased ${quantity} items`);
    creditUserAccount(transaction.products[0].id, quantity);
    transaction.finish();
  });
```

### Ordering with Quantity on iOS

Pass `additionalData.quantity` when calling `store.order()`:

```javascript
// Purchase 3 units in a single transaction (iOS only)
const error = await store.order(offer, {
  quantity: 3
});
if (error) {
  console.error('Purchase failed:', error);
}
```

## Important Notes

1. **Product Types**: Multi-quantity purchases only apply to consumable products. For non-consumable products and subscriptions, the quantity is always 1.

2. **Default Value**: Always provide a fallback (e.g., `quantity || 1`) when using this field, as it might not be available on all platforms or in older plugin versions.

3. **Consumption**: When a multi-quantity purchase is consumed, all quantities are consumed at once. Neither Google Play nor the App Store supports partial consumption of multi-quantity purchases.

4. **iOS range**: Apple enforces a maximum quantity of 10. Values outside 1–10 will return an error before reaching the payment sheet.

5. **Restored transactions**: On iOS, consumable products cannot be restored. Quantity is therefore never meaningful in a restored transaction.

## Example Implementation

```javascript
document.addEventListener('deviceready', function() {
  store.register({
    id: 'my_consumable',
    type: CdvPurchase.ProductType.CONSUMABLE,
    platform: CdvPurchase.Platform.GOOGLE_PLAY, // or APPLE_APPSTORE
  });

  store.when()
    .approved(transaction => {
      const quantity = transaction.quantity || 1;
      addItemsToUserInventory(transaction.products[0].id, quantity);
      transaction.finish();
    });

  store.initialize();
}, false);

function addItemsToUserInventory(productId, quantity) {
  console.log(`Adding ${quantity} of ${productId} to user inventory`);
  // Your implementation here
}
```

## Notes for Receipt Validation Services

If you're using a receipt validation service (such as [iaptic](https://www.iaptic.com)), make sure it properly handles the `quantity` field when validating receipts. The service should interpret the quantity value and apply the appropriate business logic when crediting the user's account.

Call `transaction.verify()` and only credit the user when the transaction has been verified.

### Extracting Quantity After Verification

`VerifiedPurchase` exposes an optional `quantity` field that validators can populate. Not all validators report it today, so the safest pattern is to read it from the validator first and fall back to the native transaction:

```javascript
store.when()
  .verified(receipt => {
    function findQuantity(purchase) {
      // The validator returned the quantity — prefer that.
      if (purchase.quantity) return purchase.quantity;
      if (!purchase.transactionId) return 1;
      // Otherwise, use the quantity reported by the native SDK.
      const t = receipt.sourceReceipt.transactions.find(t => t.transactionId === purchase.transactionId);
      return t?.quantity || 1;
    }

    for (const purchase of receipt.collection) {
      if (!ENV.consumableIds.includes(purchase.id)) continue;
      const quantity = findQuantity(purchase);
      creditUserAccount(purchase.id, quantity);
    }
    receipt.finish();
  });
```

In production, the recommended flow is to have your backend receive a webhook from the validation service (iaptic, or your own) containing the verified quantity — the client-side fallback above is useful for demos or as an additional layer alongside server-side validation.
