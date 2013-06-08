# iOS In-App Purchase plugin

WARNING: I'M CURRENLTY REWRITING PART OF THIS PLUGING. IT'S NOT YET USABLE!

 * Allows In-App Purchases to be made from a Phonegap Application.
 * Wraps StoreKit.

Original code: Matt Kane
Maintainer: Jean-Christophe Hoelt

## Install the Plugin

### Automatically using Plugman

    plugman --platform ios --project <directory> --plugin git://github.com/j3k0/PhoneGap-InAppPurchase-iOS.git

See [Cordova Plugman](https://github.com/apache/cordova-plugman).

### Manually

Copy the .h and .m file from `src/ios/` to the Plugins directory in your project. Copy the .js file to your www directory and reference it from your html file(s). Finally, add StoreKit.framework to your Xcode project if you haven't already.

## Using the plugin

**NOTE: In-app purchases can be complicated, with very unhelpful error messages and lots of things that need to be configured perfectly for them to work. I cannot provide support for them. Errors are highly unlikely to have been caused by the plugin. Please see the Apple Developer Forums for help!**

Please read [the In-App Purchase Programming Guide](http://developer.apple.com/library/ios/#documentation/NetworkingInternet/Conceptual/StoreKitGuide/Introduction/Introduction.html) and the [iTunes Connect Developer Guide](https://itunesconnect.apple.com/docs/iTunesConnect_DeveloperGuide.pdf).

The plugin adds the `window.storekit` object, with the following methods:

    storekit.init({
        purchase: function (transactionId, productId, transactionReceipt) {},
        restore:  function (originalTransactionId, productId, originalTransactionReceipt) {},
        error:    function (errorCode, errorText) {},
        ready:    function () {}
    })
    storekit.load(productIds, callback)
    storekit.purchase(productId, quantity)
 
You should also listen to the following events:


You should register the callbacks early in your app's initialisation process, because StoreKit will automatically attempt to complete any unfinished transactions when you launch the app.
If the plugin does receive callbacks before you have registered a handler, they will be placed into a queue and executed when you do register one.

Before attempting to make a purchase you should first call `load` to retrieve the localised product data. If you don't do this, then any attempt to make a purchase will fail.

A basic usage example is below:

    storekit.on('purchased', function (transactionId, productId, transactionReceipt) {
        console.log('purchased: ' + productId);
        /* Give coins, enable subscriptions etc */
    });
    
    storekit.on('restored', function (transactionId, productId, transactionReceipt) {
        console.log('restored: ' + productId);
        /* See the developer guide for details of what to do with this */
    });
    
    storekit.on('failed', function (errno, errtext) {
        console.log('failed: ' + errtext);
    });

    storekit.requestProductData("com.example.test", function (productId, title, description, price) {
        console.log("productId: " + productId);
        console.log("title: " + title);
        console.log("description: " + description);
        console.log("price: " + price);
        storekit.makePurchase(productId, 1);
    }, function (id) {
        console.log("Invalid product id: " + id);
    });
	
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
