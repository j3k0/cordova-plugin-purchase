# Troubleshooting

## iOS requires minimum deployment target 15.0

This plugin uses **StoreKit 2**, which requires **iOS 15.0**. Capacitor 6 and 7 generate Podfiles with a lower default. Open `ios/App/Podfile` and update:

```ruby
# Change this:
platform :ios, '13.0'
# To this:
platform :ios, '15.0'
```

Then run `npx cap sync ios`.

## "No podspec found for CapacitorPluginCdvPurchase"

Make sure you're on the latest version of the plugin. If you're using a local path (`file:../path`), verify the podspec exists at the plugin package root.

## Different bundle IDs on iOS and Android

Capacitor does not support per-platform `appId` in `capacitor.config.json` — it's a single global value. If your iOS and Android apps have different bundle IDs, you'll need to change `appId` when switching platforms, or use Xcode schemes (iOS) / product flavors (Android) for overrides.

## Testing on Mac (Catalyst)

To test on your Mac without a physical device:

1. `npx cap open ios`
2. In Xcode, select your Mac as the destination ("My Mac (Designed for iPad)" or "My Mac (Mac Catalyst)")
3. Set your signing team and build

This works for testing the purchase flow with sandbox accounts.

## Capacitor 8 / SPM requires Xcode 26

Capacitor 8 defaults to Swift Package Manager (SPM). The Capacitor xcframework is compiled with Xcode 26 (Swift 6.2+), so **you need Xcode 26 or later** to build.

If you see errors like `value of type 'CAPPluginCall' has no member 'reject'`, your Xcode is too old. Update to Xcode 26+.

As a fallback, you can use CocoaPods instead:

```bash
rm -rf ios
npx cap add ios --packagemanager CocoaPods
npx cap sync ios
```
