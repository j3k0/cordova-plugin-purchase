# capacitor-plugin-cdv-purchase

In-App Purchase plugin for Capacitor 6+ — iOS (StoreKit 2) and Android (Google Play Billing).

This is the Capacitor edition of [cordova-plugin-purchase](https://github.com/j3k0/cordova-plugin-purchase), sharing the same API and adapter layer.

## Installation

```bash
npm install capacitor-plugin-cdv-purchase
npx cap sync
```

## Usage

```typescript
import { store, ProductType, Platform } from 'capacitor-plugin-cdv-purchase';

// Register products
store.register([{
  id: 'my_subscription',
  type: ProductType.PAID_SUBSCRIPTION,
  platform: Platform.GOOGLE_PLAY, // or Platform.APPLE_APPSTORE
}]);

// Listen for events
store.when()
  .productUpdated((product) => { console.log('Product updated:', product); })
  .approved((transaction) => transaction.verify())
  .verified((receipt) => receipt.finish());

// Initialize
await store.initialize();
```

## Migrating from cordova-plugin-purchase

If you're using `cordova-plugin-purchase` in a Capacitor app:

1. `npm uninstall cordova-plugin-purchase` (and `cordova-plugin-purchase-storekit2` if installed)
2. `npm install capacitor-plugin-cdv-purchase`
3. `npx cap sync`
4. Update your import to `import { store, ProductType, Platform } from 'capacitor-plugin-cdv-purchase'` — the API is identical

### Behavior change: purchase events at app launch (iOS)

The Cordova build used StoreKit 1, which only re-delivers *unfinished* transactions at launch. The Capacitor build uses StoreKit 2, where `store.initialize()` surfaces the user's full set of **current entitlements** by firing `approved` for:

- every non-consumable purchase,
- the latest transaction of each auto-renewable subscription,
- each non-renewing subscription — **including transactions you already finished**.

`restorePurchases()` fires `approved` for the same set.

Consumables are **not** re-delivered this way: they never appear in StoreKit 2's current entitlements. Unfinished consumables are still re-delivered once per launch, exactly as under StoreKit 1.

**What this means for your app:** with the common pattern

```typescript
store.when().approved((transaction) => {
  deliverToServer(transaction); // your fulfillment endpoint
  transaction.finish();
});
```

`approved` fires for already-fulfilled non-consumables and non-renewing subscriptions on every app launch. Those transactions have `isAcknowledged === true` (you already finished them), so you can skip them without keeping your own list of processed ids:

```typescript
store.when().approved((transaction) => {
  if (transaction.isAcknowledged) return transaction.finish(); // already delivered
  deliverToServer(transaction).then(() => transaction.finish());
});
```

`isAcknowledged` is `false` for transactions you haven't finished yet, and becomes `true` once you call `finish()`. It's the same flag Google Play uses for acknowledged purchases. Keeping server-side fulfillment idempotent on the transaction id is still good practice: an app killed between delivery and `finish()` gets the transaction again, unfinished.

## Device info for receipt validation

When validating receipts, the plugin sends device information (OS, model, manufacturer) to the validator to support fraud detection and support requests. In Capacitor apps, this information is collected automatically via `@capacitor/device` through the Capacitor plugin proxy — no additional plugin installation is required.

Customize what is sent with `store.validator_privacy_policy`:

```typescript
store.validator_privacy_policy = ['fraud', 'support', 'analytics'];
```

See the [privacy policy documentation](https://github.com/j3k0/cordova-plugin-purchase/blob/master/api/classes/CdvPurchase.Store.md#validator_privacy_policy) for details.

## Platform Support

| Platform | Native API | Minimum OS |
|----------|-----------|------------|
| iOS      | StoreKit 2 | iOS 15+    |
| Android  | Google Play Billing 8.3 | API 23+ |

## Documentation

Full API documentation: https://github.com/j3k0/cordova-plugin-purchase/blob/master/doc/api.md

## License

MIT
