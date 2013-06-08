#!/bin/bash
set -e

function hasFile() {
    if test -e "$1"; then
       echo "File $1 installed."
    else
       echo "ERROR: File $1 is missing"
       EXIT=1
    fi
}

cd `dirname $0`/test-install
jackbone update
jackbone build ios-dev testing

DIR=build/ios/MyProject/MyProject/Plugins
WWW=build/ios/MyProject/www
PROJ=build/ios/MyProject/MyProject.xcodeproj/project.pbxproj

hasFile "$DIR/InAppPurchase.m"
hasFile "$DIR/InAppPurchase.h"
hasFile "$DIR/SKProduct+LocalizedPrice.h"
hasFile "$DIR/SKProduct+LocalizedPrice.m"
hasFile "$WWW/plugins/com.phonegap.plugins.inapppurchase/InAppPurchase.js"

if grep StoreKit.framework "$PROJ" > /dev/null; then
    echo "StoreKit framework added"
else
    echo "ERROR: StoreKit framework missing"
    EXIT=1
fi

jackbone run

exit $EXIT
