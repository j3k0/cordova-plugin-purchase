# Multi-Quantity Purchases

Starting with version 13.11.1, cordova-plugin-purchase provides support for multi-quantity consumable purchases on Android (Google Play).

## Overview

The Google Play Billing Library allows users to purchase multiple quantities of a consumable product in a single transaction. This feature is useful for apps that sell virtual goods or currencies that users might want to buy in bulk.

For example, a user might want to purchase 5 coins or 10 gems at once, instead of making separate transactions for each item.

## How It Works

When a purchase is completed, the plugin will now expose the `quantity` field from Google Play in the transaction object. This allows your app to know how many items were purchased in a single transaction.

## Usage

### Checking Quantity in Transactions

When processing a transaction, you can check the `quantity` field to determine how many items were purchased:

```javascript
store.when()
  .approved(transaction => {
    // Get the quantity from the transaction
    const quantity = transaction.quantity || 1;

    // Process the transaction based on quantity
    console.log(`User purchased ${quantity} items`);

    // You can credit the user's account accordingly
    creditUserAccount(transaction.products[0].id, quantity);

    // Finish the transaction
    transaction.finish();
  });
```

### Important Notes

1. **Platform Support**: Multi-quantity purchases are only supported on Android (Google Play). On other platforms like iOS, the quantity value will always be 1.

2. **Product Types**: Multi-quantity purchases only apply to consumable products. For non-consumable products and subscriptions, the quantity will always be 1.

3. **Default Value**: Always provide a fallback (e.g., `quantity || 1`) when using this field, as it might not be available on all platforms or in older plugin versions.

4. **Consumption**: When a multi-quantity purchase is consumed, all quantities are consumed at once. The Google Play Billing Library doesn't support partial consumption of multi-quantity purchases.

## Example Implementation

Here's a complete example of handling multi-quantity purchases:

```javascript
// Set up the store
document.addEventListener('deviceready', function() {
  // Register your consumable product
  store.register({
    id: 'my_consumable',
    type: store.CONSUMABLE
  });

  // Set up the purchase flow
  store.when('my_consumable')
    .approved(transaction => {
      // Get the quantity (default to 1 if not specified)
      const quantity = transaction.quantity || 1;

      // Credit the user's account with the appropriate quantity
      addItemsToUserInventory('my_consumable', quantity);

      // Finish the transaction
      transaction.finish();
    });

  // Initialize the store
  store.refresh();
}, false);

// Function to add items to user inventory
function addItemsToUserInventory(productId, quantity) {
  console.log(`Adding ${quantity} of ${productId} to user inventory`);
  // Your implementation here
}
```

## Notes for Receipt Validation Services

If you're using a receipt validation service, make sure it properly handles the quantity field when validating receipts. The validation service should interpret the quantity value and apply the appropriate business logic when crediting the user's account.

Call `transaction.verify()` and only credit the user when the transaction has been verified.

