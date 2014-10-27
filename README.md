# Cordova Purchase Plugin

[![Build Status](https://travis-ci.org/j3k0/cordova-plugin-purchase.svg)](https://travis-ci.org/j3k0/cordova-plugin-purchase) [![Coverage Status](https://img.shields.io/coveralls/j3k0/cordova-plugin-purchase.svg)](https://coveralls.io/r/j3k0/cordova-plugin-purchase)

**Author**: Jean-Christophe Hoelt - <hoelt@fovea.cc>

## Summary

This plugin allows **In-App Purchases** to be made from **Cordova and PhoneGap** applications.

It lets you handle both platforms with a single codebase.

### Features

 - consumable purchases (e.g. virtual currencies)
 - non consumable purchases (e.g. features unlocking)
 - paid and free subscriptions
 - receipts validation
 - restoring of purchases made on other devices

### Supported platforms

 - **iOS** version 6.0 or higher.
 - **Android** version 2.2 (API level 8) or higher
   - with Google Play client version 3.9.16 or higher

## Getting Started

If you don't know much about In-App Purchases, you'll find a good introduction
on the subject here: [In-App Purchase Guidelines](https://developer.apple.com/in-app-purchase/In-App-Purchase-Guidelines.pdf).
It's from Apple, but the exact same concepts apply to Android.

You probably want to start by installing the plugin into your project.
This is documented in the [Setup Guide](https://github.com/j3k0/cordova-plugin-purchase/wiki/Setup)

Once your project is setup properly, add the minimal initialization code in
your project and check that it works. You'll find a [Minimal Example Here](doc/minimal-example.js).

Find a more [Complete Example Here](https://github.com/Fovea/cordova-plugin-purchase-demo).

If you can't get things to work, go through the [Troubleshooting Checklist](doc/troubleshooting.md). *(coming soon)*

You're all good? Time to read some more documentation. Hooray!

## Documentation

 - [API Documentation](doc/api.md)
 - [Documentation for iOS](doc/ios.md)
 - [Documentation for Android](doc/android.md)

## Resources

### for iOS

 - [Getting Started with In-App Purchase on iOS](https://developer.apple.com/in-app-purchase/In-App-Purchase-Guidelines.pdf)
   - Read about the business models supported by In-App Purchase and the types of items you can sell in your app.
 - [In-App Purchase Configuration Guide for iTunes Connect](https://developer.apple.com/library/ios/documentation/LanguagesUtilities/Conceptual/iTunesConnectInAppPurchase_Guide/Chapters/Introduction.html)
   - Learn how to set up and manage In-App Purchases with iTunes Connect.

# Contribute

 - [Contributor Guide](doc/contributor-guide.md)

### Contributors:

 * Jean-Christophe Hoelt
 * Guillaume Charhon (initial Android code)
 * Matt Kane (initial iOS code)
 * Mohammad Naghavi (original unification attempt)

## Sponsors
Big thanks to:

 * Fovea (http://www.fovea.cc) for sponsoring most of JC's work on the plugin
 * Maxwell C. Moore ([MCM Consulting, LLC](http://mcmconsulting.biz))
 * Justin Noel [@calendee](https://github.com/calendee)
 * Ionic Framework Team (http://ionicframework.com/)
 * [Those guys](https://www.indiegogo.com/projects/phonegap-cordova-in-app-purchase-ios-and-android#pledges)

## Licence

The MIT License

Copyright (c) 2014, Jean-Christophe Hoelt and contributors

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
