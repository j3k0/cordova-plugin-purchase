# Setup

## Add your license key

As android uses a public key for verification of purchase data consistency, you have to put the public key of your application inside the config.xml file under a preference tag like this:

    <preference name="android-iabplugin-license-key"    value="yourpublickey" />

You can find your public key inside Google Developer Console under SERVICES & APIS tab of the specific application.

## PlayStore

from https://github.com/mohamnag/InAppBilling/wiki/Stores%20setup#playstore

> Recently you can test IAP on PlayStore only if your app is already published. If you don't want to make it available before testing, you can publish it in alpha (recommended) or beta state instead of production.

Read Google's documentations about IAP and testing it. Any thing may have been changed in between.

Steps to setup IAP in Google's developer console:

1. `Developer Console` Create your app, provide all needed meta data

2. `Developer Console` Upload a **signed release** APK to either alpha, beta or production

3. `Developer Console` Setup your in app items

4. `Developer Console` Setup your test users if you don't want to spend real money buying your own app ;)
Its easier to be done with an alpha published app. You add users to a google group then send a link and they sign up on their own.

4. `Developer Console` Publish your app and wait until it is available to (test) users.
This may take hours!

5. Install **same** release signed app on a device which is logged into play store using a test account.
If you use the debug build, you can do some actions, however you will not be able to buy the product.

6. Try in-app purchasing!


