#!/bin/sh

TEST_VERSION="3.1"
TEST_NAME="v31"

#PLUGIN_URL="git://github.com/j3k0/PhoneGap-InAppPurchase-iOS.git"
PLUGIN_URL="/Users/jeko/GitHub/PhoneGap-InAppPurchase-iOS"

# Check PhoneGap version
V=`phonegap version`
MAJOR=`echo $V | cut -d. -f1`
MINOR=`echo $V | cut -d. -f2`
if [ "x$MAJOR.$MINOR" != "x$TEST_VERSION" ]; then
    echo "This test is validated with PhoneGap $TEST_VERSION only (you are running $MAJOR.$MINOR)."
    exit 1
fi

# Clean things
cd `dirname $0`
rm -fr $TEST_NAME-build

# Create a project
phonegap create $TEST_NAME-build -n TestIAP$TEST_NAME -i cc.fovea.babygoo

cp $TEST_NAME-src/css/* $TEST_NAME-build/www/css/
cp $TEST_NAME-src/js/* $TEST_NAME-build/www/js/
cp $TEST_NAME-src/index.html $TEST_NAME-build/www/

cd $TEST_NAME-build

# Add our plugin
phonegap local plugin add git://github.com/j3k0/PhoneGap-InAppPurchase-iOS.git || exit 1
# Add console debug
phonegap local plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-console.git || exit 1

# Compile for iOS
phonegap local build ios || exit 1

# Check existance of the plugins files
function hasFile() {
    if test -e "$1"; then
       echo "File $1 installed."
    else
       echo "ERROR: File $1 is missing."
       EXIT=1
    fi
}

DIR=platforms/ios/TestIAP$TEST_NAME/Plugins/com.phonegap.plugins.inapppurchase
WWW=platforms/ios/www/plugins/com.phonegap.plugins.inapppurchase
PROJ=platforms/ios/TestIAP${TEST_NAME}.xcodeproj/project.pbxproj

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
