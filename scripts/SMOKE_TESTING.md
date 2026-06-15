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
scripts/smoke-test.sh                 # all 4 combos (Android + iOS)
scripts/smoke-test.sh --platform ios  # iOS only, both repos
scripts/smoke-test.sh --no-build      # reuse already-built artifacts
scripts/smoke-test.sh --help
```

Exit code is `0` only if every selected combo passed the **hard** assertions.
Soft product-validity notes are reported but never fail the gate (see below).

## The 4 combos

| Repo | Example | Android | iOS |
|---|---|---|---|
| `cordova-purchase-micro-example`   | `subscriptions`, `consumables` | APK on `Pixel_4_API_35_Play` AVD | Simulator `.app` |
| `capacitor-purchase-examples`      | `subscriptions`, `consumables` | APK on `Pixel_4_API_35_Play` AVD | Simulator `.app` |

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

For each combo, three **hard** assertions (any miss → FAIL) and one **soft**
check (reported, never fails the gate):

| Assertion | How it's checked | Why |
|---|---|---|
| App launched + plugin JS ran | log line `[CdvPurchase] INFO: initialize([...]) v<ver>` | catches launch crashes, broken JS bundle, version regressions |
| Platform adapter came up | `GooglePlay initialized.` / `AppStore initialized.` | catches a broken native bridge |
| Product-load round-trip completed | `products loaded:` | proves StoreKit/Billing `loadProducts` was called and returned |
| *(soft)* known-good product resolved | product id seen as `valid` | environmental (store config + sandbox account) — reported, not failed |

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

- **iOS product validity is sandbox/Connect-dependent.** The Cordova examples
  build with iOS bundle id `cc.fovea.purchase.demo.nc` (the `ios-id` in
  `config.xml` is not applied to `CFBundleIdentifier`), while the App Store
  Connect products are under `cc.fovea.subsdemo` — so Cordova-iOS products
  come back `invalid:`. That is an example-config matter, not a plugin
  regression, which is exactly why product validity is a **soft** check. The
  Capacitor examples use `cc.fovea.subsdemo` and resolve against the sandbox.
- **The AVD boots headless** (`-no-window -no-audio`); first boot takes ~60s.
- A **full** run rebuilds all four apps and can take 10+ minutes. Use
  `--platform`, `--repo`, `--example` to narrow it, or `--no-build` to reuse
  artifacts during iteration.
