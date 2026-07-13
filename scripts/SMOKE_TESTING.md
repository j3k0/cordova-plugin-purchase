# Pre-release smoke testing

`scripts/smoke-test.sh` is the **integration-testing gate** referenced by
step 7 of [`RELEASE_PROCESS.md`](../RELEASE_PROCESS.md). It builds, launches
and verifies the Cordova **and** Capacitor example apps on Android **and** iOS,
asserting from device/simulator logs that each app **launched and loaded its
products**.

It runs between `make all` and the release commit.

## Quick start

```sh
# from the repo root, after `make all` and pointing the examples at the build:
scripts/smoke-test.sh                 # all 6 combos (Android + iOS)
scripts/smoke-test.sh --platform ios  # iOS only, both repos
scripts/smoke-test.sh --no-build      # reuse already-built artifacts
scripts/smoke-test.sh --help
```

Exit code is `0` only if every selected combo passed the **hard** assertions.
Soft product-validity notes are reported but never fail the gate (see below).

## The 6 combos

| Repo | Example | Android | iOS |
|---|---|---|---|
| `cordova-purchase-micro-example`   | `subscriptions`, `consumables`, `offline` | APK on `Pixel_4_API_35_Play` AVD | Simulator `.app` |
| `capacitor-purchase-examples`      | `subscriptions`, `consumables`, `offline` | APK on `Pixel_4_API_35_Play` AVD | Simulator `.app` |

Prerequisites: the two example repos checked out as siblings of this one
(`../cordova-purchase-micro-example`, `../capacitor-purchase-examples`), the
Android SDK at `$ANDROID_HOME` with the Play-enabled `Pixel_4_API_35_Play` AVD
(signed into a license-tester account), and Xcode with at least one iPhone
simulator (override the name with `IOS_SIM_NAME=…`).

## Decision: iOS Simulator for the automated gate

Two iOS targets were candidates:

- **iOS Simulator** — chosen. `xcodebuild -sdk iphonesimulator -destination
  'generic/platform=iOS Simulator'` + `xcrun simctl boot/install/launch`.
  Fully agent-runnable (no Xcode GUI, no code signing, no sandbox tester
  account needed). The simulator's `storekitd` talks to the real App Store
  **sandbox**, so the StoreKit-2 product-load round-trip is exercised for
  real. Captured empirically: JS `console.log` reaches the logs (Cordova via
  the unified log; Capacitor via its `print()`-based console bridge captured
  through `simctl launch --console-pty`).
- **Mac Catalyst** — **not** used for the automated gate. Exercises real
  sandbox purchases, but requires GUI-driven Xcode signing
  (`CODE_SIGNING_ALLOWED=YES`, "My Mac — Designed for iPad") and a sandbox
  tester account — not agent-automatable as-is. It remains the documented
  option for a manual real-purchase check.

The simulator satisfies JC's stated bar (launch + load products, fully
automated). Full end-to-end purchase automation on iOS is a follow-up.

## What "pass" means

For each combo, three **hard** assertions (any miss → FAIL) plus a soft
product-validity check on Android (reported, never fails the gate). iOS
product validity is **hard** by default since the example products resolve
against the App Store sandbox. The `offline` example adds two extra hard
assertions that verify the `OfflineEntitlements` code path executed:

| Assertion | How it's checked | Why |
|---|---|---|
| App launched + plugin JS ran | log line `[CdvPurchase] INFO: initialize([...]) v<ver>` | catches launch crashes, broken JS bundle, version regressions |
| Platform adapter came up | `GooglePlay initialized.` / `AppStore initialized.` | catches a broken native bridge |
| Product-load round-trip completed | `products loaded:` | proves StoreKit/Billing `loadProducts` was called and returned |
| known-good product resolved | product id seen as `valid` | iOS: **hard** (fails the gate); Android: soft (Play Console/env dependent). Demote iOS to soft with `CDV_SMOKE_IOS_VALIDITY=soft` |
| Offline cache loaded (`offline` only) | log line `OfflineEntitlements ready — cache loaded` | proves `OfflineEntitlements` was instantiated and `offline.ready()` resolved (storage adapter read back) |
| `isOwned()` ran (`offline` only) | log line `offline.isOwned(` | proves the ownership check executed against the cache |

## Expected log lines (what success looks like)

The plugin's `Logger` emits `[<prefix>] INFO: …` / `…: products loaded: …`
lines. Verbosity is `DEBUG` in the examples, so these always print.

### Android (both repos) — `adb logcat`, tag `chromium`

```
I chromium: [INFO:CONSOLE:N] "[CdvPurchase] INFO: initialize([\"ios-appstore\",\"android-playstore\"]) v13.17.1", source: ...
I chromium: [INFO:CONSOLE:N] "[CdvPurchase.Adapters] INFO: GooglePlay initializing...", source: ...
I chromium: [INFO:CONSOLE:N] "[CdvPurchase.Adapters] INFO: GooglePlay initialized. ", source: ...
I chromium: [INFO:CONSOLE:N] "[CdvPurchase.Adapters] INFO: GooglePlay products loaded: [...]", source: ...
D CdvPurchase: getAvailableProducts() -> productDetails: ProductDetails{jsonString='{"productId":"subscription1", ...}', ...}
```
The native `D CdvPurchase: …productDetails… "<id>"` line is the proof the
product resolved against Google Play.

### iOS Cordova — unified log (`simctl spawn <sim> log stream`)

WKWebView surfaces JS `console.log` directly in the unified log, under the app
process:
```
… SubscriptionsExample[…] (SubscriptionsExample.debug.dylib) [CdvPurchase] INFO: initialize(["ios-appstore","android-playstore"]) v13.16.1
… SubscriptionsExample[…] [CdvPurchase.Adapters] INFO: AppStore initialized.
… SubscriptionsExample[…] [CdvPurchase.Adapters] INFO: AppStore products: [...]
… SubscriptionsExample[…] [CdvPurchase.AppleAppStore.Bridge] DEBUG: load ok: { valid:[] invalid:["subscription1",...] }
```
The ObjC bridge also logs via `NSLog`: `[CdvPurchase.AppleAppStore.objc] Initialized` /
`StoreKit2Plugin detected on iOS 15+, SK1 standing down.`

### iOS Capacitor — app stdout (`simctl launch --console-pty`)

Capacitor bridges `console.log` → its `CAPConsolePlugin` → `print()`, which lands
on the app's stdout (not the unified log). The runner captures it via
`--console-pty`; each JS line is prefixed `⚡️  [log] - `:
```
⚡️  [log] - [CdvPurchase] INFO: initialize(["ios-appstore","android-playstore"]) v13.17.1
⚡️  [log] - [CdvPurchase.Adapters] INFO: AppStore initializing...
⚡️  [log] - [CdvPurchase.AppleAppStore] INFO: bridge.init done
```
`scripts/smoke-test.sh` captures **both** the unified log and the app stdout for
every iOS combo, so the same `[CdvPurchase] … initialize(` / `… products loaded:`
grep works regardless of framework.

## Caveats

- **iOS bundle id.** Both example repos build their iOS apps with bundle id
  `cc.fovea.subsdemo`, set via the `ios-CFBundleIdentifier` attribute on
  `<widget>` in `config.xml` (the attribute cordova-ios reads — `ios-id`/
  `widget id` alone do **not** override `CFBundleIdentifier`). Products exist
  in App Store Connect under that bundle, so iOS product validity is a **hard**
  gate (see [iOS sandbox setup](#ios-sandbox-setup)); demote with
  `CDV_SMOKE_IOS_VALIDITY=soft` when iterating offline.
- **The AVD boots headless** (`-no-window -no-audio`); first boot takes ~60s.
- A **full** run rebuilds all six apps and can take 15+ minutes. Use
  `--platform`, `--repo`, `--example` to narrow it, or `--no-build` to reuse
  artifacts during iteration.

## The `offline` example

The `offline` example exercises the `OfflineEntitlements` class shipped in
[FOV-882]. It registers the same subscription products as the other examples
(`demo_weekly_basic` on iOS, `subscription1` on Android), instantiates
`OfflineEntitlements`, calls `offline.ready()` to load the persisted cache,
then calls `offline.isOwned()` for each registered product.

The smoke test asserts that the offline code path executed on a normal launch:
the `OfflineEntitlements ready — cache loaded` and `offline.isOwned(` log
lines must appear. The cache is empty on first launch (no prior `verified`
event), so `isOwned()` returns `false` — the assertion is that the call *ran*
and logged, not that it returned `true`. A true offline-cache test (purchase
online → go offline → assert `true`) is a manual or future-automation scenario.

## iOS sandbox setup

For iOS products to resolve as `valid` (not just `products loaded:`), the
simulator's `storekitd` must reach real App Store Connect data. Confirmed
working as of [FOV-478] — the known-good products resolve **without** a
signed-in sandbox account (metadata loading queries the catalog; an account is
only needed to *purchase*):

1. **Bundle id matches the Connect app.** The example apps build with
   `cc.fovea.subsdemo` (via `ios-CFBundleIdentifier` in `config.xml` / `appId`
   in `capacitor.config.json`). That bundle exists in App Store Connect.
2. **Products exist under that app.** Verified valid in App Store Connect under
   `cc.fovea.subsdemo`: `demo_weekly_basic` and `monthly_with_intro`
   (subscriptions) and `one_token` (consumables). These are the gate's
   known-good ids (`goodid_for` in `scripts/smoke-test.sh`). `subscription1`,
   `subscription2`, `consumable1`, `consumable2` and `1_token` are registered
   by the examples but do **not** exist in App Store Connect, so they return
   `invalid` (harmless). If the valid ids change, update `goodid_for`.
3. **Sandbox tester (purchase tests only).** Product *metadata* loading — what
   the gate checks — works without a signed-in account. To exercise an actual
   purchase, sign into **Settings → … → Media & Purchases** with an App Store
   Connect sandbox tester (*Users and Access → Sandbox → Testers*).

### iOS validity is a hard gate

iOS product validity fails the gate by default — an invalid known-good product
→ FAIL — because the products above resolve reliably. A successful load looks
like:

```
[CdvPurchase.AppleAppStore.Bridge] DEBUG: load ok: { valid:[{"id":"demo_weekly_basic",...},{"id":"monthly_with_intro",...}] invalid:["subscription1","subscription2"] }
```

To iterate offline (no network / App Store Connect), demote it to a
non-failing warning:

```sh
CDV_SMOKE_IOS_VALIDITY=soft scripts/smoke-test.sh --platform ios
```
