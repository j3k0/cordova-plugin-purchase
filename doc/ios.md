# iOS Configuration

## Configure the App

Member center: https://developer.apple.com/membercenter/index.action

 - Create an Identifier
 - Create a Development Provisioning Profile

iTunes Connect: http://itunesconnect.apple.com

 - Create a new app (using the Identifier)
 - Create a purchase (type consumable)
 - (Add a dummy screenshot)
 - Create a test user

Device

 - Logout from iTunes from the settings
 - cordova build ios
 - open with XCode and run

### Test users and subscriptions

1 month subscriptions auto-renew every 5 minutes. So far so good.
They auto-renew 5 times and then they stop,
so after 25 minutes you will get the 21006 error.
However even when repurchasing the same subscription it will NOT auto-renew
again on the same test account since it has already auto-renewed 5 times.
So if you want to test renewal and you have been messing with these
subscriptions for a while you need to create a new itunes connect test user.


### Hosted content

Apple offers the option to host non-consumable content on its servers, which is automatically downloaded to the device on successfully purchasing a non-consumable IAP (see the [documentation](https://developer.apple.com/library/ios/documentation/LanguagesUtilities/Conceptual/iTunesConnectInAppPurchase_Guide/Chapters/CreatingInAppPurchaseProducts.html#//apple_ref/doc/uid/TP40013727-CH3-SW4) in the Apple Dev Center for more on this).

To configure this in the demo app, follow these additional steps:

iTunes Connect

- Create a new purchase in iTunes Connect (type non-consumable)
- (Add a dummy screenshot)
- Check the box "Hosting Content with Apple"

Demo IAP content project

- Clone this Git repo containing a demo IAP containing content for hosting: [https://github.com/dpa99c/cordova-plugin-purchase-demo-ios-hosted](https://github.com/dpa99c/cordova-plugin-purchase-demo-ios-hosted)
- Edit the ContentInfo.plist (either in XCode or text editor) and set the `IAPProductIdentifier` key appropriately for your app Identifier
- Using XCode, select from the menu "Product" > "Archive"
- Then "Export..." > "Export as an Installer Package" > "Next" > "Export" to create an IAP .pkg file

Application Loader

- Download and install Apple's [Application Loader](https://itunesconnect.apple.com/docs/UsingApplicationLoader.pdf)
- Run Application Loaded and sign in with your iTunes Connect account details
- On the "Template Chooser" screen, select "New In-App purchases" > "Choose"
- Select the demo app Identifier > "Manage"
- Select the non-consumable IAP configured for Hosted content that you created above
- Select "Hosted Content"
- Ensure "Host Content with Apple" is checked and select "Choose..."
- Browse to and select the IAP .pkg file you exported from XCode
- Select "Next", then "Save" if prompted, then "Deliver"
- Once the package is uploaded to iTunes Connect, you'll see a big green tick

Demo application project

- Edit [config.xml](https://github.com/dpa99c/cordova-plugin-purchase-demo/blob/master/config.xml) and set the `id` attribute in the `<widget>` element to that of your app Identifier
- Edit [www/index.js](https://github.com/dpa99c/cordova-plugin-purchase-demo/blob/master/www/js/index.js) and set the `id` fields under `store.register` are for your IAP Identifiers.
