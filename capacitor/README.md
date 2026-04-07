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

## Platform Support

| Platform | Native API | Minimum OS |
|----------|-----------|------------|
| iOS      | StoreKit 2 | iOS 15+    |
| Android  | Google Play Billing 8.3 | API 23+ |

## Documentation

Full API documentation: https://github.com/j3k0/cordova-plugin-purchase/blob/master/doc/api.md

## License

MIT
