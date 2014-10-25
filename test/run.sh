#!/bin/sh

# Set variables: PLUGIN_DIR, TEST_DIR, BUILD_DIR
cd `dirname $0`/..
ROOT_DIR=`pwd`
TEST_DIR="$ROOT_DIR/test"

BUILD_DIR="/tmp/build-$RANDOM"

# Create and enter the build directory
rm -fr "$BUILD_DIR"
cd "$TEST_DIR"

# Command line parameters
BUNDLE_ID="$1"
IAP_ID="$2"

#PLUGIN_URL="git://github.com/j3k0/PhoneGap-InAppPurchase-iOS.git#unified"
PLUGIN_URL="$ROOT_DIR"

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
sed -i "" "s/babygooinapp1/$IAP_ID/g" "$BUILD_DIR/www/js/iap.js"
cd "$BUILD_DIR"

echo Prepare iOS and Android platforms
cordova platform add ios || exit 1
cordova platform add android || exit 1

echo Add Purchase plugin
cordova plugin add "$PLUGIN_URL" || exit 1

echo Copy non commited files
rsync -r "$ROOT_DIR"/src/android/ plugins/cc.fovea.cordova.purchase/src/android
cp "$ROOT_DIR"/src/ios/*.[hm] plugins/cc.fovea.cordova.purchase/src/ios/
cp "$ROOT_DIR"/www/*.js plugins/cc.fovea.cordova.purchase/www/

# Add console debug
cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-console.git || exit 1

# Compile for iOS
cordova build ios || exit 1

# Compile for Android
cordova build android || exit 1

# Check existance of the plugins files
function hasFile() {
    if test -e "$1"; then
       echo "File $1 installed."
    else
       echo "ERROR: File $1 is missing."
       EXIT=1
    fi
}

echo
echo Check iOS installation
IOS_PLUGIN_DIR="$BUILD_DIR/platforms/ios/Test/Plugins/cc.fovea.cordova.purchase"
IOS_WWW_DIR="$BUILD_DIR/platforms/ios/www/plugins/cc.fovea.cordova.purchase/www"
IOS_PROJ="$BUILD_DIR/platforms/ios/Test.xcodeproj/project.pbxproj"

hasFile "$IOS_PLUGIN_DIR/InAppPurchase.m"
hasFile "$IOS_PLUGIN_DIR/InAppPurchase.h"
hasFile "$IOS_PLUGIN_DIR/SKProduct+LocalizedPrice.h"
hasFile "$IOS_PLUGIN_DIR/SKProduct+LocalizedPrice.m"
hasFile "$IOS_WWW_DIR/purchase-ios.js"

if grep StoreKit.framework "$IOS_PROJ" > /dev/null; then
    echo "StoreKit framework added."
else
    echo "ERROR: StoreKit framework missing."
    EXIT=1
fi

echo Check Android installation
ANDROID_CLASSES_DIR="$BUILD_DIR/platforms/android/ant-build/classes"
ANDROID_MANIFEST="$BUILD_DIR/platforms/android/ant-build/AndroidManifest.cordova.xml"

hasFile "$ANDROID_CLASSES_DIR/com/mohamnag/inappbilling/InAppBillingPlugin.class"
hasFile "$BUILD_DIR/platforms/android/src/com/mohamnag/inappbilling/InAppBillingPlugin.java"

if grep "com.android.vending.BILLING" "$ANDROID_MANIFEST" > /dev/null; then
    echo "BILLING permission added."
else
    echo "ERROR: Not BILLING permission."
    EXIT=1
fi

if [ "x$EXIT" != "x1" ]; then echo "Great! Everything looks good."; fi
exit $EXIT
