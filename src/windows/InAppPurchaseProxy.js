var cordova = require('cordova');

var log = (s) => console.log('[InAppPurchaseProxy.js]', s);

var MICROSOFT_ERROR_DESCRIPTIONS = {
    // Miscellaneous error codes
    "0x80070525": "Current user is not signed in to the Store.",
    // In-app purchase error codes
    // The following error codes are related to in-app purchase operations.
    "0x803F6100": "The in-app purchase could not be completed because Kid's Corner is active. To complete the purchase, sign in to the device with your Microsoft account and run the application again.",
    "0x803F6101": "The specified app could not be found. The app may no longer be available in the Store, or you might have provided the wrong Store ID for the app.",
    "0x803F6102": "The specified add-on could not be found. The add-on may no longer be available in the Store, or your might have provided the wrong Store ID for the add-on.",
    "0x803F6103": "The specified product could not be found. The product may no longer be available in the Store, or you might have provided the wrong Store ID for the product.",
    "0x803F6104": "The in-app purchase could not be completed because you are running a trial version of the app. To complete in-app purchases, install the full version of the app.",
    "0x803F6105": "The in-app purchase could not be completed because you are not signed in with your Microsoft account.",
    "0x803F6107": "Something unexpected happened while processing the current operation.",
    "0x803F6108": "The in-app purchase could not be completed because the app license is missing information. This error can occur when you side-load your app. To resolve this issue, uninstall the app and then reinstall it from the Store to refresh the app license.",
    "0x803F6109": "The consumable add-on fulfillment could not be completed because the specified quantity is more than the remaining balance.",
    "0x803F610A": "The specified provider type for the Store user account is not supported.",
    "0x803F610B": "The specified Store operation is not supported.",
    "0x803F610C": "The app does not support the specified background task contract.",
    "0x80040001": "The provided list of add-on product IDs is invalid.",
    "0x80040002": "The provided list of keywords is invalid.",
    "0x80040003": "The fulfillment target is invalid.",
    // Licensing error codes
    // The following error codes are related to licensing operations for apps or add-ons.
    "0x803F700C": "The device is currently offline. To use this app while the device is offline, open your Store settings and toggle the Offline Permissions setting.",
    "0x803F8001": "You do not have an entitlement for the product. You might be using a different Microsoft account than the one that was used to purchase the product.",
    "0x803F8002": "Your entitlement for the product has expired.",
    "0x803F8003": "Your entitlement for the product is in an invalid state that prevents a license from being created.",
    "0x803F8009": "The trial period for the app has expired.",
    "0x803F800A": "The trial period for the app has expired.",
    "0x803F8190": "The license doesn't allow the product to be used in the current country or region of your device.",
    "0x803F81F5": "You have reached the maximum number of devices that can be used with games and apps from the Store. To use this game or app on the current device, first remove another device from your account.",
    "0x803F81F6": "You have reached the maximum number of devices that can be used with games and apps from the Store. To use this game or app on the current device, first remove another device from your account.",
    "0x803F81F7": "You have reached the maximum number of devices that can be used with games and apps from the Store. To use this game or app on the current device, first remove another device from your account.",
    "0x803F81F8": "You have reached the maximum number of devices that can be used with games and apps from the Store. To use this game or app on the current device, first remove another device from your account.",
    "0x803F81F9": "You have reached the maximum number of devices that can be used with games and apps from the Store. To use this game or app on the current device, first remove another device from your account.",
    "0x803F9000": "The license is expired or corrupt. To help resolve this error, try running the troubleshooter for Windows apps to reset the Store cache.",
    "0x803F9001": "The license is expired or corrupt. To help resolve this error, try running the troubleshooter for Windows apps to reset the Store cache.",
    "0x803F9006": "The operation could not be completed because the user who is entitled to this product is not signed in to the device with their Microsoft account.",
    "0x803F9008": "Your device is offline. Your device needs to be online to use this product.",
    "0x803F9009": "Your device is offline. Your device needs to be online to use this product.",
    "0x803F900A": "The subscription has expired.",
    // Self-install update error codes
    // The following error codes are related to self-installing package updates.
    "0x803F6200": "User consent is required to download the package update.",
    "0x803F6201": "User consent is required to download and install the package update.",
    "0x803F6203": "User consent is required to install the package update.",
    "0x803F6204": "User consent is required to download the package update because the download will occur on a metered network connection.",
    "0x803F6206": "User consent is required to download and install the package update because the download will occur on a metered network connection.",
};

function oldApi() {

    var setTestMode = function (win, fail, args) {
        //switch between live and similator mode for IAP testing
        this.currentApp = Windows.ApplicationModel.Store.CurrentAppSimulator;

        Windows.ApplicationModel.Package.current.installedLocation.getFolderAsync("www").done(
            function (folder) {
                folder.getFileAsync("in-app-purchase.xml").done(
                    function (file) {
                        console.log("got the xml file for currentAppSimulator", file);
                        this.currentApp.reloadSimulatorAsync(file).done(
                            function () {
                                // Get the license info
                                this.productLicenses = this.currentApp.licenseInformation.productLicenses;
                                if (this.currentApp && this.productLicenses) {
                                    console.log("loaded xml file");
                                    win(true);
                                } else {
                                    console.log("failed xml file");
                                    fail();
                                }
                            }.bind(this),
                            function (err) {
                                console.log("error loading Windows IAP simulator");
                                console.log(err);
                                fail();
                            }
                        );
                    }.bind(this));
            }.bind(this)
        );
    };

    module.exports = {
        init: function (win, fail, args) {
            if (store && store.sandbox){
                setTestMode(win, fail, args);
                return;
            }
            if (!this.currentApp){
                this.currentApp = Windows.ApplicationModel.Store.CurrentApp;
                // Load the product licenses
                this.productLicenses = this.currentApp.licenseInformation.productLicenses;
            }
            //Don't need to init anything else here
            win(true);
        },

        getPurchases: function (win, fail, args) {
            var licenses = [];
            // now get a specific licenses.
            for (var productId in this.productLicenses){
                if (this.productLicenses.hasOwnProperty(productId)) {
                    licenses.push({ license: this.productLicenses.lookup(productId) });
                }
            }
            console.log("licenses", licenses);
            win(licenses);
        },

        getAvailableProducts: function (win, fail, args) {
            // get the listing information for the products this app supports
            this.currentApp.loadListingInformationAsync().then(
                function (listing) {

                    console.log("listing", listing);
                    var productListings = listing.productListings;
                    var products = [];
                    // loadListingInformationAsync returns the ListingInformation object in listing.
                    // get the product listing collection from the ProductListings property.
                    for (var productId in productListings) if (productListings.hasOwnProperty(productId)) {
                        var product = productListings.lookup(productId);
                        if (product) {
                            products.push(product);
                        }
                    }
                    win(products);
                },
                fail
            );
        },

        getProductDetails: function (win, fail, args) {
            // get the listing information for the products this app supports
            this.currentApp.loadListingInformationAsync().then(
                function (listing) {
                    // loadListingInformationAsync returns the ListingInformation object in listing.
                    // get the product listing collection from the ProductListings property.
                    var productListings = listing.productListings;
                    var products = [];
                    // now get a specific product.

                    for (var productId in productListings) if (productListings.hasOwnProperty(productId)) {
                        var product = productListings.lookup(productId);
                        if (product) {
                            products.push(product);
                        }
                    }
                    win(products);
                },
                fail
            );
        },

        buy: function (win, fail, args) {
            var productId = args[0];
            this.currentApp.requestProductPurchaseAsync(productId).done(
                function (purchaseResults) {
                    // Create the transaction json from the PurchaseResults object that Windows returns
                    var transaction_results = {
                        transaction: {
                            offerId: purchaseResults.offerId,
                            receiptXml: purchaseResults.receiptXml,
                            status: purchaseResults.status,
                            transactionId: purchaseResults.transactionId
                        }
                    };
                    win(transaction_results);
                },
                function (err) {
                    fail(err);
                }
            );
        },

        subscribe: function (win, fail, args) {
            var productId = args[0];
            if (this.productLicenses.lookup(productId).isActive) {
                //TODO - Subscriptions?
            } else {
                this.inappbilling.buy(win, fail, productId);
            }
        },

        consumePurchase: function (win, fail, args) {
            var fulfillmentResult = Windows.ApplicationModel.Store.FulfillmentResult;
            var productId = args[0];
            var transactionId = args[1];
            this.currentApp.reportConsumableFulfillmentAsync(productId, transactionId).done(
                function (result) {
                    switch (result) {
                        case fulfillmentResult.succeeded:
                            win("There is no purchased product 1 to fulfill.", fulfillmentResult.succeeded);
                            break;
                        case fulfillmentResult.nothingToFulfill:
                            fail("There is no purchased product 1 to fulfill.", fulfillmentResult.nothingToFulfill);
                            break;
                        case fulfillmentResult.purchasePending:
                            fail("The purchase is pending so we cannot fulfill the product.", fulfillmentResult.purchasePending);
                            break;
                        case fulfillmentResult.purchaseReverted:
                            fail("Your purchase has been reverted..", fulfillmentResult.purchaseReverted);
                            // Since the user's purchase was revoked, they got their money back. 
                            // You may want to revoke the user's access to the consumable content that was granted. 
                            break;
                        case fulfillmentResult.serverError:
                            fail("There was an error when fulfilling.", fulfillmentResult.serverError);
                            break;
                    }
                },
                function (error) {
                    fail(error);
                }
            );
        }
    };
}

function newApi () {

    var storeContext, products;

    var errorString = (code) => {
        var fixedError = (code) => (code >= 0 ? code : (0x100000000 + code));
        var codeString = (code) => ('0x' + fixedError(code).toString(16).toUpperCase());
        var e = codeString(code);
        var d = MICROSOFT_ERROR_DESCRIPTIONS[e]
        return 'Windows.Services.Store ' + s + (d ? ': ' + d : '');
    };

    var ALL_PRODUCT_TYPES = [
        "Durable", "Consumable", "UnmanagedConsumable"
    ];

    module.exports = {
        init: function (win, fail, args) {
            log('init()');
            if (!storeContext)
                storeContext = Windows.Services.Store.StoreContext.getDefault();
            win(true);
        },

        getPurchases: function (win, fail, args) {
            log('getPurchases()');
            storeContext.getUserCollectionAsync(ALL_PRODUCT_TYPES).done((result) => {
                log('getUserCollectionAsync: ' + JSON.stringify({
                    extendedError: result.extendedError,
                    products: result.products
                }));
                if (result.extendedError)
                    return fail(errorString(result.extendedError));
                win(Object.values(result.products)
                .filter(p => typeof p === 'object' && p.storeId)
                .map(p => {
                    log('Product in collection: ' + JSON.stringify(p));
                    var skus = p.skus.filter((sku) => typeof sku === 'object' && sku.collectionData);
                    return {
                        id: p.inAppOfferToken,
                        license: {
                            productId: p.inAppOfferToken,
                            expirationDate: skus.reduce((acc, sku) => Math.max(acc, +sku.collectionData.endDate), 0),
                            isActive: !!skus.find(sku => sku.isInUserCollection),
                        },
                        transaction: {
                            status: 0,
                            transactionId: '?',
                            offerId: '?',
                            receipt: '?',
                        },
                        skus: skus,
                    };
                    // {
                    //     description: "This subscription lets you enjoy the fact that you're a subscriber.",
                    //     extendedJsonData:  {...},
                    //     hasDigitalDownload: false,
                    //     images: { },
                    //     inAppOfferToken: "monthly_basic_1",
                    //     isInUserCollection: true,
                    //     keywords: { },
                    //     language: "neutral",
                    //     linkUri: { },
                    //     price: { },
                    //     productKind: "Durable",
                    //     skus: {
                    //         0: {
                    //             availabilities: { },
                    //             bundledSkus: { },
                    //             collectionData: {
                    //                 acquiredDate: [date] Fri Mar 15 2019 11:03:14 GMT+0100 (Paris, Madrid),
                    //                 campaignId: "",
                    //                 developerOfferId: "",
                    //                 endDate: [date] Mon Apr 15 2019 02:00:00 GMT+0200 (Paris, Madrid (heure d’été)),
                    //                 extendedJsonData: {...},
                    //                 isTrial: false,
                    //                 startDate: [date] Fri Mar 15 2019 01:00:00 GMT+0100 (Paris, Madrid),
                    //                 trialTimeRemaining: 922337203685477.6
                    //             },
                    //             customDeveloperData: "",
                    //             description: "This subscription lets you enjoy the fact that you're a subscriber.",
                    //             extendedJsonData: {...},
                    //             images: { },
                    //             isInUserCollection: true,
                    //             isSubscription: false,
                    //             isTrial: false,
                    //             language: "neutral",
                    //             price: { },
                    //             storeId: "9NWCC3C10NK2/0020",
                    //             subscriptionInfo: null,
                    //             title: "Subscribe to Nothing for 1 Month",
                    //             videos: { }
                    //         },
                    //         length: 1,
                    //         size: 1
                    //     },
                    //     storeId: "9NWCC3C10NK2",
                    //     title: "Subscribe to Nothing for 1 Month",
                    //     videos: { }
                    // },
                }));
                // win([]);
            }, (err) => {
                log('getUserCollectionAsync failed ' + err);
                fail(err);
            });
        },

        getAvailableProducts: function (win, fail, args) {
            log('getAvailableProducts()');
            storeContext.getAssociatedStoreProductsAsync(ALL_PRODUCT_TYPES).done((result) => {
                log('getAssociatedStoreProductsAsync: ' + JSON.stringify(result));
                if (result.extendedError)
                    return fail(errorString(result.extendedError));
                products = result.products;
                var trialPeriod = function (p) {
                    if (!p.skus) return {};
                    var sku = p.skus.find(sku => sku.isTrial);
                    if (!sku) return {};
                    var info = sku.subscriptionInfo;
                    if (!info) return {};
                    return {
                        value: sku.trialPeriod,
                        unit: sku.trialPeriodUnit
                    };
                };
                win(Object.values(products).map((p) => ({
                    productId: p.inAppOfferToken,
                    title: p.title,
                    description: p.description,
                    price: p.price.formattedReccurencePrice || p.price.formattedPrice,
                    price_currency_code: p.price.currencyCode,
                    trial_period: trialPeriod(p).value || null,
                    trial_period_unit: trialPeriod(p).unit || null,
                })));
            }, fail);
        },

        buy: function (win, fail, args) {
            log('buy()');
            var logAndFail = function(code) {
                log(code);
                fail(code);
            };
            if (!products) {
                return logAndFail('Cannot make a purchase before loading product metadata');
            }
            var productId = args[0];
            var product = Object.values(products)
                .find((p) => p.inAppOfferToken === productId);
            storeContext.requestPurchaseAsync(product.storeId).done((result) => {
                log('requestPurchaseAsync: ' + JSON.stringify(result));
                if (result.extendedError)
                    return fail(errorString(result.extendedError));
                var StorePurchaseStatus = Windows.Services.Store.StorePurchaseStatus;
                switch (result.status) {
                    case StorePurchaseStatus.succeeded:
                        log('StorePurchaseStatus.succeeded');
                        var transaction_results = {
                            transaction: {
                                status: result.status,
                            },
                        };
                        win(transaction_results);
                        break;
                    case StorePurchaseStatus.notPurchased:
                        logAndFail('6777006|StorePurchaseStatus.notPurchased');
                        break;
                    case StorePurchaseStatus.networkError:
                        logAndFail('6777014|StorePurchaseStatus.networkError');
                        break;
                    case StorePurchaseStatus.serverError:
                        logAndFail('6777014|StorePurchaseStatus.serverError');
                        break;
                    default:
                        logAndFail('StorePurchaseStatus.unknownError');
                        break;
                }
            }, fail);
        },

        subscribe: function (win, fail, args) {
            log('subscribe()');
            return module.exports.buy(win, fail, args);
        },

        consumePurchase: function (win, fail, args) {
            log('consumePurchase()');
            /* TODO
            var fulfillmentResult = Windows.ApplicationModel.Store.FulfillmentResult;
            var productId = args[0];
            var transactionId = args[1];
            this.currentApp.reportConsumableFulfillmentAsync(productId, transactionId).done(
                function (result) {
                    switch (result) {
                        case fulfillmentResult.succeeded:
                            win("There is no purchased product 1 to fulfill.", fulfillmentResult.succeeded);
                            break;
                        case fulfillmentResult.nothingToFulfill:
                            fail("There is no purchased product 1 to fulfill.", fulfillmentResult.nothingToFulfill);
                            break;
                        case fulfillmentResult.purchasePending:
                            fail("The purchase is pending so we cannot fulfill the product.", fulfillmentResult.purchasePending);
                            break;
                        case fulfillmentResult.purchaseReverted:
                            fail("Your purchase has been reverted..", fulfillmentResult.purchaseReverted);
                            // Since the user's purchase was revoked, they got their money back. 
                            // You may want to revoke the user's access to the consumable content that was granted. 
                            break;
                        case fulfillmentResult.serverError:
                            fail("There was an error when fulfilling.", fulfillmentResult.serverError);
                            break;
                    }
                },
                function (error) {
                    fail(error);
                }
            );
            */
        }
    };
}

if (Windows.Services && Windows.Services.Store)
    newApi();
else
    oldApi();

require("cordova/exec/proxy").add("InAppBillingPlugin", module.exports);
