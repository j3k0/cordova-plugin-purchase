# Contributing

## Podspec naming convention

Capacitor CLI derives the CocoaPods pod name from the npm package name:

```
npm: capacitor-plugin-cdv-purchase → pod: CapacitorPluginCdvPurchase
```

The podspec filename and `s.name` must match this derived name exactly. A mismatch causes "No podspec found" during `pod install`.

The plugin ships a single podspec at the package root:
- `CapacitorPluginCdvPurchase.podspec` — used by Capacitor CLI (paths relative to package root)

## iOS availability guards

The plugin targets iOS 15.0 but some APIs require newer versions:

- `AppTransaction.shared` — requires `#available(iOS 16.0, *)`
- `AppStore.presentOfferCodeRedeemSheet` — requires `#available(iOS 16.0, *)`
- `Locale.region` — requires `#available(iOS 16.0, *)`

Always wrap these in availability checks with a fallback.

## SPM and Xcode version requirements

Capacitor 8 defaults to SPM and distributes its iOS framework as a precompiled `.xcframework` via `capacitor-swift-pm`. The xcframework is compiled with **Xcode 26** (Swift 6.2+), which enables `$NonescapableTypes` by default. The `.swiftinterface` files gate extension methods (`reject()`, `getString()`, `getBool()`, etc.) behind this compiler feature flag.

**This means Capacitor 8 + SPM requires Xcode 26.** With the correct Xcode version, all APIs work natively — no workarounds needed. Use idiomatic Capacitor APIs in the plugin code.

Capacitor 6 and 7 use CocoaPods by default, which compiles from source. Any Xcode version that supports the deployment target (15.0) works.

## CI matrix

| Capacitor | Runner   | Xcode | Package Manager |
|-----------|----------|-------|-----------------|
| 6         | macOS-14 | 15.4  | CocoaPods       |
| 7         | macOS-14 | 15.4  | CocoaPods       |
| 8         | macOS-15 | 26.0  | SPM             |

## CI environment notes

- **macOS-15 + Xcode 16.2** fails with "iOS 18.2 Platform Not Installed" on storyboard compilation. Use Xcode 26 (for Cap 8) or macOS-14 + Xcode 15.4 (for Cap 6/7).
- **`@capacitor/create-app`** always scaffolds the latest template (Cap 8 / SPM) regardless of CLI version. For testing older versions, scaffold manually with `npm init` + pinned deps.
- **Podfile deployment target**: Cap 6/7 generate Podfiles defaulting to iOS 13.0/14.0. The plugin needs 15.0 — CI patches this with `sed`.
- **Ruby version conflicts** on macOS: `pod` (Homebrew) and `gem` (system) may point to different Ruby versions. Install gems with the Homebrew Ruby if needed.
