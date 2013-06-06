# Get the git
rm -fr "$DOWNLOADS_PATH/PhoneGap-InAppPurchase-iOS"
gitPackage "https://github.com/j3k0/PhoneGap-InAppPurchase-iOS.git"

# Patch it with working directory
cp "$PROJECT_PATH"/../../plugin.xml "$DOWNLOADS_PATH/PhoneGap-InAppPurchase-iOS/"
cp "$PROJECT_PATH"/../../src/ios/*  "$DOWNLOADS_PATH/PhoneGap-InAppPurchase-iOS/src/ios/"
cp "$PROJECT_PATH"/../../*.js      "$DOWNLOADS_PATH/PhoneGap-InAppPurchase-iOS/"
