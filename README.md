# Cordova Purchase Plugin

> In-App Purchases for Cordova

[![Build Status](https://travis-ci.org/j3k0/cordova-plugin-purchase.svg)](https://travis-ci.org/j3k0/cordova-plugin-purchase)

---

Need professional help and support? [Contact us](mailto:contact@fovea.cc)!

**Author**: Jean-Christophe Hoelt - <hoelt@fovea.cc>

**Active Contributors**:

 * [Josef Fröhle](https://github.com/Dexus)

## Summary

This plugin allows **In-App Purchases** to be made from **Cordova and PhoneGap** applications, on many platforms:

 - **Android**
 - **iOS**
 - **Windows**
 - **Windows 10 Mobile**
 - **Xbox One**

It lets you handle in-app purchases on all platforms with a single codebase.


## Installation

### Install the plugin (cordova)

```sh
cordova plugin add cordova-plugin-purchase [--variable BILLING_KEY="<BILLING_KEY>"]
```
`BILLING_KEY` is only required for Android. Check [here](https://github.com/j3k0/cordova-plugin-purchase/wiki/HOWTO#add-android-billing-key) for details.

### Setup your Application

See [Setup iOS Applications](https://github.com/j3k0/cordova-plugin-purchase/wiki/HOWTO#setup-ios-applications) and [Setup Android Applications](https://github.com/j3k0/cordova-plugin-purchase/wiki/HOWTO#setup-android-applications).

### Features
|  | ios | android | win 8 | win 10 |
|--|--|--|--|--|
| consumables | ✅ | ✅ | ✅ | ✅ |
| non consumables | ✅ | ✅ | ✅ | ✅ |
| subscriptions | ✅ | ✅ | ✅ | ✅ |
| restore purchases | ✅ | ✅ | ✅ | ✅ |
| receipt validations | ✅ | ✅ |  | ✅ |
| downloadable content | ✅ |   |   |   |

### Supported platforms

 - **iOS** version 6.0 or higher.
 - **Android** version 2.2 (API level 8) or higher
   - with Google Play client version 3.9.16 or higher
 - **Windows** Store/Phone 8.1 or higher
 - **Xbox One**
   - and any platform supporting Microsoft's UWP

## Extensions

 * [Simple Non-Renewing Subscriptions](https://github.com/j3k0/cordova-non-renewing-subscription)
   * The easiest way to integrate purchase into an app that only needs a non-renewing subscription.

## Getting Started

If you don't know much about In-App Purchases, you'll find a good introduction
on the subject here: [In-App Purchase Guidelines](https://developer.apple.com/in-app-purchase/).
It's from Apple, but the exact same concepts apply to Android.

You probably want to start by installing the plugin into your project.
This is documented in the [Setup Guide](https://github.com/j3k0/cordova-plugin-purchase/wiki/Setup)

Once your project is setup properly, add the minimal initialization code in
your project and check that it works. You'll find a [Minimal Example Here](doc/minimal-example.js).

Find a more [Complete Example Here](https://github.com/Fovea/cordova-plugin-purchase-demo).

If you can't get things to work, go through the [Troubleshooting Checklist](doc/troubleshooting.md).

You're all good? Time to read some more documentation. Hooray!

## Documentation

 - [API Documentation](doc/api.md)
 - [Documentation for iOS](doc/ios.md)
 - [Documentation for Android](doc/android.md)
 - [Documentation for Windows](doc/windows.md)

## Extra Resources

### for iOS

 - [Getting Started with In-App Purchase on iOS](https://developer.apple.com/in-app-purchase/)
   - Read about the business models supported by In-App Purchase and the types of items you can sell in your app.
 - [In-App Purchase Configuration Guide for iTunes Connect](https://developer.apple.com/library/ios/documentation/LanguagesUtilities/Conceptual/iTunesConnectInAppPurchase_Guide/Chapters/Introduction.html)
   - Learn how to set up and manage In-App Purchases with iTunes Connect.

# Contribute

 - [Contributor Guide](doc/contributor-guide.md)

### Contributors:

 * ![](https://avatars1.githubusercontent.com/u/191881?s=64&v=4) Jean-Christophe Hoelt, Author
* ![](https://avatars3.githubusercontent.com/u/1674289?s=64&v=4) Josef Fröhle, Support
 * Guillaume Charhon, initial Android code
 * Matt Kane, initial iOS code
 * Mohammad Naghavi, original unification attempt
 * Dave Alden [@dpa99c](https://github.com/dpa99c) (Apple-hosted IAPs for iOS)
 
## Sponsors

 * <a href="https://fovea.cc"><img alt="Logo Fovea" src="https://fovea.cc/blog/wp-content/uploads/2017/09/fovea-logo-flat-128.png" height="50" /></a><br/>For sponsoring most of JC's work on the plugin
 * <img alt="Logo Ionic" src="https://www.fovea.cc/files/Ionic-logo-landscape.png" height="50"><br/>Ionic Framework Team (http://ionicframework.com/)
 * **Simplan**<br/>Microsoft UWP support
 * Maxwell C. Moore ([MCM Consulting, LLC](http://mcmconsulting.biz))
 * Justin Noel [@calendee](https://github.com/calendee)
 * [Those guys](https://www.indiegogo.com/projects/phonegap-cordova-in-app-purchase-ios-and-android#pledges)

## Licence

The MIT License

Copyright (c) 2014-2019, Jean-Christophe Hoelt and contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

```
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
