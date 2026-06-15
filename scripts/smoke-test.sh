#!/usr/bin/env bash
#
# smoke-test.sh — pre-release integration gate for cordova-plugin-purchase
#                 and capacitor-plugin-cdv-purchase.
#
# Builds, launches and verifies the example apps (Cordova + Capacitor) on
# Android and iOS, asserting from device/simulator logs that each app
# **launched and loaded its products**. This is the "Integration testing"
# step of RELEASE_PROCESS.md (step 7), run between `make all` and the
# commit/tag/publish steps.
#
# What "pass" means (per combo):
#   1. The app built.
#   2. The app launched and the plugin JS ran:
#        log line:  [CdvPurchase] INFO: initialize([...]) v<version>
#   3. The platform adapter came up:
#        log line:  GooglePlay initialized.   |   AppStore initialized.
#   4. The product-load round-trip completed:
#        log line:  products loaded:
#   (soft) known-good product ids resolved — reported, not hard-failed, since
#   validity depends on the Play Console / App Store Connect + sandbox account,
#   which is environmental rather than a code regression.
#
# Usage:
#   scripts/smoke-test.sh                         # all 4 combos (android + ios)
#   scripts/smoke-test.sh --platform android      # both repos, android only
#   scripts/smoke-test.sh --platform ios          # both repos, ios only
#   scripts/smoke-test.sh --repo cordova          # cordova only, both platforms
#   scripts/smoke-test.sh --example consumables   # limit to one example kind
#   scripts/smoke-test.sh --no-build              # reuse already-built artifacts
#   scripts/smoke-test.sh --timeout 45            # seconds to capture logs after launch
#   scripts/smoke-test.sh --keep-emulator         # don't kill AVD/sim at the end
#
# Exit code: 0 only if every selected combo passed the hard assertions.
#
# Prerequisites:
#   - macOS with Xcode + the iOS simulators (xcrun simctl).
#   - Android SDK at $ANDROID_HOME (default ~/Library/Android/sdk) with the
#     `Pixel_4_API_35_Play` AVD (signed into a Play license-tester account).
#   - The two example repos checked out as siblings of this repo:
#       ../cordova-purchase-micro-example
#       ../capacitor-purchase-examples
#   - The plugin already built (`make all`) and the examples pointed at it
#     via `shared/update-plugin.sh file:$PLUGIN_DIR` (Cordova) / the local
#     capacitor package (Capacitor) — or run --no-build on a tree that is.

set -uo pipefail

# ─── configuration ───────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PLUGIN_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
CORDOVA_REPO="$(cd "$PLUGIN_DIR/../cordova-purchase-micro-example" 2>/dev/null && pwd)"
CAPACITOR_REPO="$(cd "$PLUGIN_DIR/../capacitor-purchase-examples" 2>/dev/null && pwd)"
ANDROID_HOME="${ANDROID_HOME:-$HOME/Library/Android/sdk}"
AVD_NAME="Pixel_4_API_35_Play"
IOS_SIM_NAME="${IOS_SIM_NAME:-iPhone 17}"     # any booted-able iPhone sim
PACKAGE="cc.fovea.purchase.demo.nc"           # Android applicationId (both repos)

PLATFORM_SEL="all"
REPO_SEL="both"
EXAMPLE_SEL="all"
NO_BUILD=0
CAPTURE_SECS=30
KEEP=0
WORK="$(mktemp -d -t cdv_smoke)"
PIDFILE_EMU=""
LOGPID=""
LAUNCHPID=""
emu_booted=0
sim_udid=""

# On any exit (incl. SIGINT/err under the eventual `set -e`/interrupt), stop the
# booted AVD/sim and drop the temp dir — unless --keep-emulator was given.
cleanup() {
  [ $KEEP -eq 1 ] && return
  [ -n "$LOGPID" ]    && kill "$LOGPID" 2>/dev/null
  [ -n "$LAUNCHPID" ] && kill "$LAUNCHPID" 2>/dev/null
  if [ $emu_booted -eq 1 ]; then
    [ -f "$WORK/emu.pid" ] && kill "$(cat "$WORK/emu.pid")" 2>/dev/null
    [ -n "$sim_udid" ] && xcrun simctl shutdown "$sim_udid" >/dev/null 2>&1
  fi
  rm -rf "$WORK" 2>/dev/null || true
}
trap cleanup EXIT

# ─── logging helpers ─────────────────────────────────────────────────────────
COLOR_RED=$'\033[31m'; COLOR_GRN=$'\033[32m'; COLOR_YLW=$'\033[33m'
COLOR_DIM=$'\033[2m'; COLOR_RST=$'\033[0m'
section() { printf "\n${COLOR_DIM}──── %s ────${COLOR_RST}\n" "$*"; }
info()    { printf "${COLOR_DIM}›${COLOR_RST} %s\n" "$*"; }
warn()    { printf "${COLOR_YLW}! %s${COLOR_RST}\n" "$*"; }

# ─── arg parsing ─────────────────────────────────────────────────────────────
while [ $# -gt 0 ]; do
  case "$1" in
    --platform)  PLATFORM_SEL="$2"; shift 2;;
    --repo)      REPO_SEL="$2"; shift 2;;
    --example)   EXAMPLE_SEL="$2"; shift 2;;
    --no-build)  NO_BUILD=1; shift;;
    --timeout)   CAPTURE_SECS="$2"; shift 2;;
    --keep-emulator) KEEP=1; shift;;
    -h|--help)   sed -n '2,40p' "$0"; exit 0;;
    *) echo "unknown arg: $1" >&2; exit 2;;
  esac
done

# validate selector values — an unknown value would silently select nothing,
# run zero combos and exit 0 (a false "all green").
validate_sel() {  # $1=value $2=label $3=allowed-regex
  [[ "$1" =~ $3 ]] || { echo "invalid $2: '$1' (expected: $3)" >&2; exit 2; }
}
validate_sel "$PLATFORM_SEL" "--platform" '^(all|android|ios)$'
validate_sel "$REPO_SEL"     "--repo"     '^(both|cordova|capacitor)$'
validate_sel "$EXAMPLE_SEL"  "--example"  '^(all|subscriptions|consumables)$'

EXAMPLES=()
[ "$EXAMPLE_SEL" = "all" ] && EXAMPLES=(subscriptions consumables) || EXAMPLES=("$EXAMPLE_SEL")

# results table
declare -a RESULTS=()
PASS=0; FAIL=0; SOFT=0
goodid_for() {  # $1 = example kind → known-good product id (in the stores)
  case "$1" in
    subscriptions) echo "subscription1";;
    consumables)   echo "consumable1";;
    *) echo "$1";;
  esac
}

# ─── build step ───────────────────────────────────────────────────────────────
# Build output goes to /tmp/cdv_build_<platform>.log; on failure we tail it so
# the failure isn't silent (iOS already did this via /tmp/cdv_xcbuild.log).
build_android() {  # $1 = example dir, $2 = "cordova"|"capacitor"
  local dir="$1" kind="$2"
  if [ "$kind" = "cordova" ]; then
    (cd "$dir" && npx cordova build android) >/tmp/cdv_build_android.log 2>&1 \
      || { warn "cordova build android failed — tail of /tmp/cdv_build_android.log:" >&2; tail -20 /tmp/cdv_build_android.log >&2; return 1; }
  else
    # vite build + cap sync, then assemble the debug APK (cap sync alone won't)
    (cd "$dir" && npm run build >/dev/null 2>&1 && npx cap sync android >/dev/null 2>&1 \
       && (cd android && ./gradlew assembleDebug)) >/tmp/cdv_build_android.log 2>&1 \
      || { warn "capacitor build android failed — tail of /tmp/cdv_build_android.log:" >&2; tail -20 /tmp/cdv_build_android.log >&2; return 1; }
  fi
}
build_ios() {  # $1 = example dir, $2 = "cordova"|"capacitor"
  local dir="$1" kind="$2"
  if [ "$kind" = "capacitor" ]; then
    # ensure the iOS project exists + pods are in sync
    (cd "$dir" && npm run build >/dev/null 2>&1)
    if [ ! -d "$dir/ios" ]; then
      (cd "$dir" && npx cap add ios >/dev/null 2>&1) || return 1
      # plugin requires StoreKit 2 → deployment target 15.0
      local pf="$dir/ios/App/Podfile"
      [ -f "$pf" ] && grep -q "platform :ios, '15.0'" "$pf" || \
        sed -i '' "s/platform :ios,.*/platform :ios, '15.0'/" "$pf" 2>/dev/null
    fi
    (cd "$dir" && npx cap sync ios) || return 1
  fi
  _xcodebuild_sim "$dir" "$kind"
}

_xcodebuild_sim() {  # $1 = example dir, $2 = kind
  local dir="$1" kind="$2" ws scheme
  if [ "$kind" = "cordova" ]; then
    ws="$dir/platforms/ios/App.xcworkspace"
  else
    ws="$dir/ios/App/App.xcworkspace"
  fi
  scheme="App"
  [ -d "$ws" ] || { warn "no workspace at $ws"; return 1; }
  xcodebuild -workspace "$ws" -scheme "$scheme" \
    -configuration Debug -sdk iphonesimulator \
    -destination 'generic/platform=iOS Simulator' \
    -derivedDataPath "$dir/build/smoke-derived" \
    CODE_SIGNING_ALLOWED=NO ONLY_ACTIVE_ARCH=NO \
    build >/tmp/cdv_xcbuild.log 2>&1 || {
      warn "xcodebuild failed — tail of /tmp/cdv_xcbuild.log:" >&2
      tail -20 /tmp/cdv_xcbuild.log >&2
      return 1
    }
}

# ─── android launch + capture ────────────────────────────────────────────────
ensure_android() {
  local adb="$ANDROID_HOME/platform-tools/adb"
  command -v "$adb" >/dev/null || { warn "adb not found at $adb"; return 1; }
  if "$adb" get-state >/dev/null 2>&1; then info "Android device/AVD already running"; return 0; fi
  info "booting AVD $AVD_NAME (headless)…"
  nohup "$ANDROID_HOME/emulator/emulator" -avd "$AVD_NAME" \
    -no-window -no-audio -no-boot-anim -no-snapshot -gpu swiftshader_indirect \
    >/tmp/cdv_avd.log 2>&1 &
  echo $! > "$WORK/emu.pid"
  "$adb" wait-for-device
  local i=0
  until [ "$("$adb" shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" = "1" ] || [ $i -ge 120 ]; do
    sleep 2; i=$((i+1))
  done
  [ $i -ge 120 ] && { warn "AVD did not finish booting"; return 1; }
  emu_booted=1
  return 0
}

run_android() {  # $1 = example dir
  local dir="$1" adb="$ANDROID_HOME/platform-tools/adb"
  local apk
  apk="$(find "$dir/platforms/android" "$dir/android" -path '*/outputs/apk/debug/app-debug.apk' -print -quit 2>/dev/null)"
  [ -f "$apk" ] || apk="$(find "$dir" -path '*/outputs/apk/debug/app-debug.apk' -print -quit 2>/dev/null)"
  [ -f "$apk" ] || { warn "no debug APK under $dir"; return 1; }
  info "APK: ${apk#$dir/}"
  "$adb" uninstall "$PACKAGE" >/dev/null 2>&1
  "$adb" install -r "$apk" >/dev/null 2>&1 || { warn "adb install failed"; return 1; }
  "$adb" logcat -c 2>/dev/null
  "$adb" shell monkey -p "$PACKAGE" -c android.intent.category.LAUNCHER 1 >/dev/null 2>&1
  info "launched; capturing ${CAPTURE_SECS}s of logcat…"
  sleep "$CAPTURE_SECS"
  "$adb" logcat -d > "$WORK/android.log" 2>/dev/null
  return 0
}

# ─── ios launch + capture ────────────────────────────────────────────────────
ensure_ios() {
  command -v xcrun >/dev/null || { warn "xcrun not found (Xcode?)"; return 1; }
  # reuse a booted sim, else boot a matching one. The `devices` JSON maps each
  # runtime to a LIST of device dicts (each has udid/state/name/isAvailable).
  sim_udid="$(xcrun simctl list devices booted -j 2>/dev/null | python3 -c '
import sys,json
d=json.load(sys.stdin)
for devs in d["devices"].values():
    for dev in devs:
        if dev.get("state")=="Booted": print(dev["udid"]); sys.exit()
' 2>/dev/null)"
  if [ -z "$sim_udid" ]; then
    sim_udid="$(xcrun simctl list devices available -j 2>/dev/null | python3 -c '
import sys,json
d=json.load(sys.stdin); name="'"$IOS_SIM_NAME"'"
for devs in d["devices"].values():
    for dev in devs:
        if dev.get("isAvailable") and dev.get("name")==name: print(dev["udid"]); sys.exit()
' 2>/dev/null)"
    [ -n "$sim_udid" ] || { warn "no available '$IOS_SIM_NAME' simulator (set IOS_SIM_NAME to an installed device)"; return 1; }
    info "booting simulator ${sim_udid}…"
    xcrun simctl boot "$sim_udid" >/dev/null 2>&1
    emu_booted=1
  fi
  xcrun simctl bootstatus "$sim_udid" -b >/dev/null 2>&1
  return 0
}

run_ios() {  # $1 = example dir
  local dir="$1" app bid
  app="$(find "$dir/platforms/ios/build" "$dir/build/smoke-derived" -name '*.app' -path '*Debug-iphonesimulator*' -not -path '*Build/Intermediates*' -print -quit 2>/dev/null)"
  [ -d "$app" ] || app="$(find "$dir" -name '*.app' -path '*Debug-iphonesimulator*' -not -path '*Build/Intermediates*' -print -quit 2>/dev/null)"
  [ -d "$app" ] || { warn "no .app (Debug-iphonesimulator) under $dir"; return 1; }
  info "APP: ${app#$dir/}"
  bid="$(/usr/libexec/PlistBuddy -c 'Print :CFBundleIdentifier' "$app/Info.plist" 2>/dev/null)"
  [ -n "$bid" ] || { warn "no CFBundleIdentifier in $app"; return 1; }
  info "bundle: $bid"
  xcrun simctl install "$sim_udid" "$app" >/dev/null 2>&1 || { warn "simctl install failed"; return 1; }
  xcrun simctl terminate "$sim_udid" "$bid" >/dev/null 2>&1
  # Capture from BOTH sources, because the two frameworks bridge console.log
  # differently on the iOS simulator:
  #  - Cordova's WKWebView surfaces JS console.log in the *unified log*.
  #  - Capacitor bridges console.log to print() (CAPLog), which lands on the
  #    app's *stdout* — only captured via `simctl launch --console-pty`.
  ( xcrun simctl spawn "$sim_udid" log stream --level debug --style compact \
      > "$WORK/ios_unified.log" 2>&1 ) & LOGPID=$!
  sleep 1
  xcrun simctl launch --console-pty "$sim_udid" "$bid" \
      > "$WORK/ios_stdout.log" 2>&1 & LAUNCHPID=$!
  info "launched; capturing ${CAPTURE_SECS}s (unified log + app stdout)…"
  sleep "$CAPTURE_SECS"
  kill "$LOGPID" 2>/dev/null
  xcrun simctl terminate "$sim_udid" "$bid" >/dev/null 2>&1
  kill "$LAUNCHPID" 2>/dev/null
  cat "$WORK/ios_unified.log" "$WORK/ios_stdout.log" 2>/dev/null > "$WORK/ios.log"
  return 0
}

# ─── assertions ──────────────────────────────────────────────────────────────
# $1 = log file, $2 = platform (android|ios), $3 = known-good product id
assert_markers() {
  local log="$1" platform="$2" goodid="$3"
  local adapter_init missing=0 soft=""
  if [ "$platform" = "android" ]; then adapter_init="GooglePlay initialized\."
  else adapter_init="AppStore initialized\."; fi

  check() {  # $1 = label, $2 = pattern
    if grep -qE "$2" "$log"; then printf "  ${COLOR_GRN}✓${COLOR_RST} %s\n" "$1"; else
      printf "  ${COLOR_RED}✗${COLOR_RST} %s\n" "$1"; missing=1; fi
  }
  check "app launched + plugin JS ran (initialize)" '\[CdvPurchase\] INFO: initialize\('
  check "platform adapter initialized"             "$adapter_init"
  check "product-load round-trip completed"        'products loaded:'

  # soft: did the known-good product resolve as valid?
  if [ "$platform" = "android" ]; then
    if grep -qE "productDetails.*\"productId\":\"$goodid\"|title.*$goodid" "$log" || \
       grep -qE "products loaded:.*\[[^]]*\"id\":\"$goodid\"" "$log"; then
      printf "  ${COLOR_GRN}•${COLOR_RST} product '%s' resolved (valid)\n" "$goodid"
    else soft="product '$goodid' not seen as valid (Play Console / env dependent)"
         printf "  ${COLOR_YLW}•${COLOR_RST} %s\n" "$soft"; fi
  else
    # AppStore bridge logs: `load ok: { valid:["id",...] invalid:["id",...] }`.
    # Anchor on ` valid:[` (leading space) so we don't match `invalid:[`.
    if grep -qE 'load ok:.*\{ valid:\[[^]]*"'"$goodid"'"' "$log"; then
      printf "  ${COLOR_GRN}•${COLOR_RST} product '%s' resolved (valid)\n" "$goodid"
    else soft="product '$goodid' invalid/not-found (App Store Connect bundle/sandbox dependent)"
         printf "  ${COLOR_YLW}•${COLOR_RST} %s\n" "$soft"; fi
  fi
  # hard assertions dominate: a failed marker is a FAIL even if the soft
  # product-validity check has something to say.
  [ $missing -eq 1 ] && return 1
  [ -n "$soft" ] && return 2
  return 0
}

# ─── one combo ───────────────────────────────────────────────────────────────
# $1=label $2=repo-kind $3=example-dir $4=platform $5=good-id
run_combo() {
  local label="$1" kind="$2" dir="$3" platform="$4" goodid="$5" rc logf
  section "$label — build+launch+verify"
  [ -d "$dir" ] || { warn "missing example dir $dir"; add_result "$label" SKIP; return; }
  if [ $NO_BUILD -eq 0 ]; then
    info "building ($platform)…"
    if [ "$platform" = "android" ]; then build_android "$dir" "$kind" || { add_result "$label" FAIL "build"; return; }
    else build_ios "$dir" "$kind" || { add_result "$label" FAIL "build"; return; }; fi
  fi
  if [ "$platform" = "android" ]; then run_android "$dir" || { add_result "$label" FAIL "launch"; return; }; logf="$WORK/android.log"
  else run_ios "$dir" || { add_result "$label" FAIL "launch"; return; }; logf="$WORK/ios.log"; fi
  assert_markers "$logf" "$platform" "$goodid"; rc=$?
  case $rc in
    0) add_result "$label" PASS;;
    2) add_result "$label" "PASS (soft)" ;;
    *) add_result "$label" FAIL "assert";;
  esac
}

add_result() {  # $1=label $2=status [$3=detail]
  RESULTS+=("$1|$2|${3:-}")
  case "$2" in
    PASS) PASS=$((PASS+1));;
    "PASS (soft)") PASS=$((PASS+1)); SOFT=$((SOFT+1));;
    SKIP) ;;
    *) FAIL=$((FAIL+1));;
  esac
}

# ─── main ────────────────────────────────────────────────────────────────────
main() {
  info "plugin:  $PLUGIN_DIR"
  info "cordova:   ${CORDOVA_REPO:-<missing>}"
  info "capacitor: ${CAPACITOR_REPO:-<missing>}"
  info "work:    $WORK"
  [ -d "$CORDOVA_REPO" ]   || warn "Cordova examples not found at $CORDOVA_REPO (--repo capacitor to skip)"
  [ -d "$CAPACITOR_REPO" ] || warn "Capacitor examples not found at $CAPACITOR_REPO (--repo cordova to skip)"

  local want_android=0 want_ios=0
  [ "$PLATFORM_SEL" = "all" ] && { want_android=1; want_ios=1; }
  [ "$PLATFORM_SEL" = "android" ] && want_android=1
  [ "$PLATFORM_SEL" = "ios" ] && want_ios=1

  # platform prerequisites — clear the want flag on failure so we skip those
  # combos with a clear reason instead of failing every one with a confusing
  # "adb not found" / "no debug APK" downstream.
  if [ $want_android -eq 1 ]; then
    ensure_android || { warn "Android prerequisites failed — skipping Android combos"; want_android=0; }
  fi
  if [ $want_ios -eq 1 ]; then
    ensure_ios || { warn "iOS prerequisites failed — skipping iOS combos"; want_ios=0; }
  fi

  # Cordova combos
  if { [ "$REPO_SEL" = "both" ] || [ "$REPO_SEL" = "cordova" ]; } && [ -d "$CORDOVA_REPO" ]; then
    for ex in "${EXAMPLES[@]}"; do
      [ $want_android -eq 1 ] && run_combo "cordova/$ex (android)" cordova "$CORDOVA_REPO/$ex" android "$(goodid_for "$ex")"
      [ $want_ios -eq 1 ]     && run_combo "cordova/$ex (ios)"     cordova "$CORDOVA_REPO/$ex" ios     "$(goodid_for "$ex")"
    done
  fi
  # Capacitor combos
  if { [ "$REPO_SEL" = "both" ] || [ "$REPO_SEL" = "capacitor" ]; } && [ -d "$CAPACITOR_REPO" ]; then
    for ex in "${EXAMPLES[@]}"; do
      [ $want_android -eq 1 ] && run_combo "capacitor/$ex (android)" capacitor "$CAPACITOR_REPO/$ex" android "$(goodid_for "$ex")"
      [ $want_ios -eq 1 ]     && run_combo "capacitor/$ex (ios)"     capacitor "$CAPACITOR_REPO/$ex" ios     "$(goodid_for "$ex")"
    done
  fi

  # nothing ran? (bad selection, or selected repos missing) — fail loudly rather
  # than exit 0 with an empty result table.
  if [ ${#RESULTS[@]} -eq 0 ]; then
    warn "no combos were selected/run (check --platform/--repo/--example and that the example repos exist)"
    [ $KEEP -eq 0 ] || info "kept running (--keep-emulator); logs in $WORK"
    exit 1
  fi

  # summary
  section "summary"
  printf "%-32s %-12s %s\n" "COMBO" "RESULT" "DETAIL"
  for r in "${RESULTS[@]}"; do
    IFS='|' read -r lbl st det <<< "$r"
    local color="$COLOR_GRN"
    [ "$st" = "FAIL" ] && color="$COLOR_RED"
    [ "$st" = "SKIP" ] && color="$COLOR_DIM"
    [ "$st" = "PASS (soft)" ] && color="$COLOR_YLW"
    printf "%-32s ${color}%-12s${COLOR_RST} %s\n" "$lbl" "$st" "$det"
  done
  echo
  printf "%d passed (%d with soft product-validity notes), %d failed\n" "$PASS" "$SOFT" "$FAIL"

  # AVD/sim + temp dir are cleaned by the EXIT trap; just note keep-mode here.
  [ $KEEP -eq 1 ] && info "kept running (--keep-emulator); logs in $WORK"

  [ $FAIL -eq 0 ] || exit 1
  info "all green"
}

main "$@"
