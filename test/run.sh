#!/bin/sh

# Set variables: PLUGIN_DIR, TEST_DIR, BIN_DIR
cd `dirname $0`/..
ROOT_DIR=`pwd`
TEST_DIR="$ROOT_DIR/test"
BIN_DIR="$TEST_DIR/bin"

# Create and enter the bin directory
rm -fr "$BIN_DIR"
cd "$TEST_DIR"

# Command line parameters
BUNDLE_ID="$1"
IAP_ID="$2"

PLUGIN_URL="git://github.com/j3k0/PhoneGap-InAppPurchase-iOS.git#unified"

# DIR=platforms/ios/HelloWorld/Plugins/cc.fovea.plugins.inapppurchase
# WWW=platforms/ios/www/plugins/cc.fovea.plugins.inapppurchase
# PROJ=platforms/ios/HelloWorld.xcodeproj/project.pbxproj

if [ "x$IAP_ID" = "x" ] || [ "x$1" = "x--help" ]; then
    echo
    echo "usage: $0 <bundle_id> <iap_id>"
    echo
    echo "This will generate a cordova project using Cordova $TEST_VERSION (required)."
    echo "If plugin install is successful, you can test your IAP as follow:"
    echo " - if your device is logged-in a production iTunes account, go unlog (in device's settings)"
    echo " - open ./bin/platforms/ios/Test.xcodeproj"
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
export PATH="$ROOT_DIR/node_modules/cordova/bin:$PATH"

# Create a project
cordova create bin $BUNDLE_ID Test

# Copy project's files
cp "$TEST_DIR/src/css/"* "$BIN_DIR/www/css/"
cp "$TEST_DIR/src/js/"* "$BIN_DIR/www/js/"
cp "$TEST_DIR/src/index.html" "$BIN_DIR/www/"
sed -i "" "s/babygooinapp1/$IAP_ID/g" "$BIN_DIR/www/js/iap.js"
cd "$BIN_DIR"

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

hasFile "$DIR/InAppPurchase.m"
hasFile "$DIR/InAppPurchase.h"
hasFile "$DIR/SKProduct+LocalizedPrice.h"
hasFile "$DIR/SKProduct+LocalizedPrice.m"
hasFile "$WWW/InAppPurchase.js"

if grep StoreKit.framework "$PROJ" > /dev/null; then
    echo "StoreKit framework added."
else
    echo "ERROR: StoreKit framework missing."
    EXIT=1
fi

if [ "x$EXIT" != "x1" ]; then echo "Great! Everything looks good."; fi
exit $EXIT
