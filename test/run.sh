#!/bin/bash
set -e
set -o xtrace

# Set variables: PLUGIN_DIR, TEST_DIR, BUILD_DIR
cd "$(dirname "$0")/.."
ROOT_DIR="$(pwd)"
TEST_DIR="$ROOT_DIR/test"
BUILD_DIR="${BUILD_DIR:-/tmp/build-$RANDOM}"

# Create and enter the build directory
rm -fr "$BUILD_DIR"
cd "$TEST_DIR"

# Command line parameters
BUNDLE_ID="$1"
IAP_ID="$2"

#PLUGIN_URL="git://github.com/j3k0/PhoneGap-InAppPurchase-iOS.git#unified"
PLUGIN_URL="$ROOT_DIR"

if [ "_$BILLING_KEY" = _ ]; then
    BILLING_KEY="0123456789abcdef"
fi

if [ "x$IAP_ID" = "x" ] || [ "x$1" = "x--help" ]; then
    echo
    echo "usage: $0 <bundle_id> <iap_id>"
    echo
    echo "This will generate a cordova project using Cordova $TEST_VERSION (required)."
    echo "If plugin install is successful, you can test your IAP as follow:"
    echo " - if your device is logged-in a production iTunes account, go unlog (in device's settings)"
    echo " - open ./build/platforms/ios/Test.xcodeproj"
    echo " - compile and run ON A DEVICE"
    echo " - the description of the IAP should appear after a while."
    echo " - click on the price to purchase, confirmation should appear on the console."
    echo " - click restore and check the console that it also worked."
    echo
    echo "example:"
    echo "    \$ $0 cc.fovea.babygoo babygooinapp1"
    echo
    exit 1
fi

# Add cordova to PATH
export PATH="$ROOT_DIR/node_modules/.bin:$PATH"

# Create a project
cordova create "$BUILD_DIR" "$BUNDLE_ID" Test

# Copy project's files
cp "$TEST_DIR/src/css/"* "$BUILD_DIR/www/css/"
cp "$TEST_DIR/src/js/"* "$BUILD_DIR/www/js/"
cp "$TEST_DIR/src/index.html" "$BUILD_DIR/www/"
sed -i "bak" "s/babygooinapp1/$IAP_ID/g" "$BUILD_DIR/www/js/iap.js" || true # let this pass for now
cd "$BUILD_DIR"

echo Prepare platforms
cordova platform add ios || exit 1
cordova platform add osx || exit 1
cordova platform add android || exit 1

echo Add Purchase plugin
cordova plugin add "$PLUGIN_URL" --variable BILLING_KEY="$BILLING_KEY" || exit 1

echo Copy non commited files
rsync -r "$ROOT_DIR"/src/android/ plugins/cc.fovea.cordova.purchase/src/android
cp "$ROOT_DIR"/src/ios/*.[hm] plugins/cc.fovea.cordova.purchase/src/ios/
cp "$ROOT_DIR"/www/*.js plugins/cc.fovea.cordova.purchase/www/

# Add console debug
cordova plugin add https://github.com/apache/cordova-plugin-console.git || exit 1

# Check existance of the plugins files
function hasFile() {
    if test -e "$1"; then
       echo "File $1 installed."
    else
       echo "ERROR: File $1 is missing."
       echo 
       echo " => it can be found at the following locations:"
       find "$BUILD_DIR" -name "$(basename "$1")"
       echo
       EXIT=1
    fi
}

# Compile for iOS
case "$OSTYPE" in darwin*)
    echo "iOS..."
    if cordova build ios 2>&1 > "$BUILD_DIR/build-ios.txt"; then
        echo build succeeded
    else
        tail -400 "$BUILD_DIR/build-ios.txt"
        echo build failed
        exit 1
    fi

    # cordova build ios fails silently
    # let's wait 1 minute and see if that's true
    tail -50 "$BUILD_DIR/build-ios.txt"
    find "$BUILD_DIR/platforms/ios/build"

    echo Check iOS installation
    IOS_PLUGIN_DIR="$BUILD_DIR/platforms/ios/Test/Plugins/cc.fovea.cordova.purchase"
    IOS_WWW_DIR="$BUILD_DIR/platforms/ios/www/plugins/cc.fovea.cordova.purchase/www"
    IOS_PROJ="$BUILD_DIR/platforms/ios/Test.xcodeproj/project.pbxproj"

    hasFile "$IOS_PLUGIN_DIR/InAppPurchase.m"
    hasFile "$IOS_PLUGIN_DIR/InAppPurchase.h"
    hasFile "$IOS_PLUGIN_DIR/SKProduct+LocalizedPrice.h"
    hasFile "$IOS_PLUGIN_DIR/SKProduct+LocalizedPrice.m"
    hasFile "$IOS_WWW_DIR/store-ios.js"
    hasFile "$BUILD_DIR/platforms/ios/build/emulator/Test.app"

    if grep StoreKit.framework "$IOS_PROJ" > /dev/null; then
        echo "StoreKit framework added."
    else
        echo "ERROR: StoreKit framework missing."
        EXIT=1
    fi
;; esac

# Compile for OSX
case "$OSTYPE" in darwin*)
    echo "OSX..."
    if ! cordova build osx 2>&1 > $BUILD_DIR/build-osx.txt; then
        tail -500 $BUILD_DIR/build-osx.txt
        exit 1
    fi
    tail -20 $BUILD_DIR/build-osx.txt

    echo Check OSX installation
    OSX_PLUGIN_DIR="$BUILD_DIR/platforms/osx/Test/Plugins/cc.fovea.cordova.purchase"
    OSX_WWW_DIR="$BUILD_DIR/platforms/osx/www/plugins/cc.fovea.cordova.purchase/www"
    OSX_PROJ="$BUILD_DIR/platforms/osx/Test.xcodeproj/project.pbxproj"

    hasFile "$OSX_PLUGIN_DIR/InAppPurchase.m"
    hasFile "$OSX_PLUGIN_DIR/InAppPurchase.h"
    hasFile "$OSX_PLUGIN_DIR/SKProduct+LocalizedPrice.h"
    hasFile "$OSX_PLUGIN_DIR/SKProduct+LocalizedPrice.m"
    hasFile "$OSX_WWW_DIR/store-ios.js"
    hasFile "$BUILD_DIR/platforms/osx/build/Test.app"

    if grep StoreKit.framework "$OSX_PROJ" > /dev/null; then
        echo "StoreKit framework added."
    else
        echo "ERROR: StoreKit framework missing."
        EXIT=1
    fi
;; esac

# Compile for Android
if [ "_$ANDROID_HOME" != "_" ]; then
    echo "Android..."
    if ! cordova build android 2>&1 > $BUILD_DIR/build-android.txt; then
        tail -500 $BUILD_DIR/build-android.txt
        exit 1
    fi
    tail -20 $BUILD_DIR/build-android.txt

    echo Check Android installation

    # Plugin class has been built
    ANDROID_CLASSES_DIR="$BUILD_DIR/platforms/android/build/intermediates/classes/debug"
    if test ! -e "$ANDROID_CLASSES_DIR"; then
      ANDROID_CLASSES_DIR="$BUILD_DIR/platforms/android/app/build/intermediates/classes/debug"
    fi
    hasFile "$ANDROID_CLASSES_DIR/com/smartmobilesoftware/inappbilling/InAppBillingPlugin.class"

    # Manifest has been patched
    ANDROID_MANIFEST="$BUILD_DIR/platforms/android/AndroidManifest.xml"
    if test ! -e "$ANDROID_MANIFEST"; then
      ANDROID_MANIFEST="$BUILD_DIR/platforms/android/app/src/main/AndroidManifest.xml"
    fi
    hasFile "$ANDROID_MANIFEST"
    if grep "com.android.vending.BILLING" "$ANDROID_MANIFEST" > /dev/null; then
        echo "BILLING permission added."
    else
        echo "ERROR: BILLING permission not added."
        EXIT=1
    fi

    # Billing key has been installed
    BILLING_KEY_FILE="$BUILD_DIR/platforms/android/res/values/billing_key_param.xml"
    if test ! -e "$BILLING_KEY_FILE"; then
      BILLING_KEY_FILE="$BUILD_DIR/platforms/android/app/src/main/res/values/billing_key_param.xml"
    fi
    hasFile "$BILLING_KEY_FILE"
    if grep "$BILLING_KEY" "$BILLING_KEY_FILE" > /dev/null; then
      echo "BILLING_KEY has been setup."
    else
      echo "ERROR: BILLING_KEY hasn't been setup."
      EXIT=1
    fi
fi

if [ "x$EXIT" != "x1" ]; then
  echo "Great! Everything looks good.";
fi

exit $EXIT
