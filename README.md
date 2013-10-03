# iOS In-App Purchase plugin

 * Allows In-App Purchases to be made from a Phonegap Application.
 * Wraps StoreKit.

Original code: Matt Kane

Maintainer: Jean-Christophe Hoelt

## Install the Plugin

### PhoneGap/Cordova >= 3.0

For PhoneGap >= 3.0 this plugin can be installed with a single command:

    cordova plugin add git://github.com/j3k0/PhoneGap-InAppPurchase-iOS.git

Then some extra steps need to be done to disable ARC for the plugin's .m files. Follow [those instructions](http://stackoverflow.com/a/6658549/271585) for InAppPurchase.m and SKProduct+LocalizedPrice.m

### PhoneGap <= 2.9 using Plugman

    plugman install --platform ios --project <path to Xcode project> --plugin git://github.com/j3k0/PhoneGap-InAppPurchase-iOS.git

See [Cordova Plugman](https://github.com/apache/cordova-plugman).

**NOTE: If you plan on using the cordova-cli to build your project, copy the cordova_plugins.js file in the root of the www directory to merges/<platform> directory at the root of the solution folder otherwise the cordova_plugins.js will be overwritten. 

    cp ./cordova_plugins.js ../../../merges/ios/cordova_plugins.js

See [Cordova Cli](https://github.com/apache/cordova-cli).

### Manually

 * Copy the .h and .m file from `src/ios/` to the Plugins directory in your Xcode project. 
 * Create a `plugins` folder in your project's `<path to Xcode project>/www` folder if it does not exist.
 * Create a `com.phonegap.plugins.inapppurchase` folder inside the `plugins` folder.
 * Copy InAppPurchase.js into `<path to Xcode project>/www/plugins/com.phonegap.plugins.inapppurchase`
 * Add the following to the config.xml file in your Xcode project:

```xml
    <feature name="InAppPurchase">
       <param name="ios-package" value="InAppPurchase" />
    </feature>
```

 * Add the following to the config.xml file in your Xcode project:
 * Create a new file named `cordova_plugins.js` in the `<path to Xcode project>/www` folder if it does not exist.
 * Edit `cordova_plugins.js` and add a reference to the plugin to automatically load it:

```javascript
    cordova.define('cordova/plugin_list', function(require, exports, module) {
    module.exports = [
        {
            "file": "plugins/com.phonegap.plugins.inapppurchase/InAppPurchase.js",
            "id": "com.phonegap.plugins.inapppurchase.InAppPurchase",
            "clobbers": [
                "storekit"
	    ]
    	}
    ]
    });
```

## Using the plugin

**NOTE: In-app purchases can be complicated, with very unhelpful error messages and lots of things that need to be configured perfectly for them to work. I cannot provide support for them. Errors are highly unlikely to have been caused by the plugin. Please see the Apple Developer Forums for help!**

Please read [the In-App Purchase Programming Guide](http://developer.apple.com/library/ios/#documentation/NetworkingInternet/Conceptual/StoreKitGuide/Introduction/Introduction.html) and the [iTunes Connect Developer Guide](https://itunesconnect.apple.com/docs/iTunesConnect_DeveloperGuide.pdf).

### Tutorial

For a comprehensive tutorial, Check-out the [complete turorial](http://fovea.cc/blog/index.php/3-steps-tutorial-for-phonegap-in-app-purchase-on-ios/) on Fovea's blog [here](http://fovea.cc/blog/index.php/3-steps-tutorial-for-phonegap-in-app-purchase-on-ios/).

### Sample project

You can check out this [sample project by jkirkell](https://github.com/jkirkell/cordova-inapp-sample).

### Documentation

**NOTE: For more detailed information about these methods see the InAppPurchaseManager.js file.**

The plugin adds the `window.storekit` object, with the following methods:

    storekit.init({
        purchase: function (transactionId, productId, transactionReceipt) {},
        restore: function (originalTransactionId, productId, originalTransactionReceipt) {},
        restoreFailed: function (errCode) {},
        restoreCompleted: function () {},
        error: function (errorCode, errorText) {},
        ready: function () {}
    })
    storekit.load(productIds, callback)
    storekit.restore()
    storekit.purchase(productId, quantity)

You should register the callbacks early in your app's initialisation process, because StoreKit will automatically attempt to complete any unfinished transactions when you launch the app.
If the plugin does receive callbacks before you have registered a handler, they will be placed into a queue and executed when you do register one.

Before attempting to make a purchase you should first call `load` to retrieve the localised product data. If you don't do this, then any attempt to make a purchase will fail.

Here's a basic usage example:

In your 'deviceready' listener, call:

    window.storekit.init({
        purchase: function (transactionId, productId, transactionReceipt) {
            console.log('purchased: ' + productId);
        },
        restore: function (transactionId, productId, transactionReceipt) {
            console.log('restored: ' + productId);
        },
        restoreCompleted: function () {
            console.log('restoreCompleted');
        },
        restoreFailed: function (errCode) {
            console.log('Restore Failed: ' + errCode);
        },
        error: function (errno, errtext) {
            console.log('Failed: ' + errtext);
        },
        ready: function () {
            var productIds = [
                "com.example.app.inappid1", 
                "com.example.app.inappid2"
            ];
            window.storekit.load(productIds, function(validProducts, invalidProductIds) {
                $.each(validProducts, function (i, val) {
                    console.log("id: " + val.id + " title: " + val.title + " val: " + val.description + " price: " + val.price);
                });
                if(invalidProductIds.length) {
                    console.log("Invalid Product IDs: " + JSON.stringify(invalidProductIds));
                }
            });
        }
    });

To restore previous purchases:

    window.storekit.restore();

To make a purchase:

    window.storekit.purchase("com.example.app.inappid1", 1);

## BUGS AND CONTRIBUTIONS
For IAP support, please use [the Apple Developer Forum](https://devforums.apple.com/community/ios/integration/storekit).

The latest bleeding-edge version is available [on GitHub](http://github.com/j3k0/PhoneGap-InAppPurchase-iOS/). If you have a patch, fork and send pull requests.
	
## Licence

The MIT License

Copyright (c) 2011 Matt Kane

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
