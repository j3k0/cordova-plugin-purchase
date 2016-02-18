var cordova = require('cordova');

module.exports = {
    init: function (win, fail, args) {

        var testmode = args[0];


        if (!this.currentApp) {
            if (!testmode) {
                this.currentApp = Windows.ApplicationModel.Store.CurrentApp;
                win(true);
            } else {
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
                                              fail("failed xml file load");
                                          }
                                      },
                                      function (err) {
                                          console.log("This is still not working!!");
                                          console.log(err);
                                          fail(err);
                                      }
                                  );
                              });
                      }
                  );
            }
        }
    },


    getPurchases: function (win, fail, args) {
        var licenses = [];
        // now get a specific licenses.
        for (var productId in this.currentApp.licenseInformation.productLicenses) {
            if (this.currentApp.licenseInformation.productLicenses.hasOwnProperty(productId)) {
                licenses.push({ license: this.currentApp.licenseInformation.productLicenses.lookup(productId) });
            }
        }
        win(licenses);
    },

    getAvailableProducts: function (win, fail, args) {
        // get the listing information for the products this app supports
        this.currentApp.loadListingInformationAsync().done(
            function (listing) {

                var productListings = listing.productListings;
                var products = [];
                // loadListingInformationAsync returns the ListingInformation object in listing.
                // get the product listing collection from the ProductListings property.

                var iterator = listing.productListings.first();
                while (iterator.hasCurrent) {
                    products.push(iterator.current.value);
                    iterator.moveNext();
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

                var iterator = listing.productListings.first();
                while (iterator.hasCurrent) {
                    products.push(iterator.current.value);
                    iterator.moveNext();
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
                win({ transaction: purchaseResults });
            },
            function (err) {
                fail(err);
            }
        );
    },

    subscribe: function (win, fail, args) {
        var productId = args[0];
        if (this.currentApp.licenseInformation.productLicenses.lookup(productId).isActive) {
            //TODO - Subscriptions?
        } else {
            this.buy(win, fail, args);
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

    /*
     *
     function purchaseAndFulfillProduct1() {
        log("Buying product 1...", "sample", "status");
        currentApp.requestProductPurchaseAsync("product1").done(
            function (purchaseResults) {
                if (purchaseResults.status === ProductPurchaseStatus.succeeded) {
                    grantFeatureLocally("product1", purchaseResults.transactionId);
                    fulfillProduct1("product1", purchaseResults.transactionId);
                } else if (purchaseResults.status === ProductPurchaseStatus.notFulfilled) {
                    if (!isLocallyFulfilled("product1", purchaseResults.transactionId)) {
                        grantFeatureLocally("product1", purchaseResults.transactionId);
                    }
                    fulfillProduct1("product1", purchaseResults.transactionId);
                } else if (purchaseResults.status === ProductPurchaseStatus.notPurchased) {
                    log("Product 1 was not purchased.", "sample", "status");
                }
            },
            function () {
                log("Unable to buy product 1.", "sample", "error");
            });
    }
    function fulfillProduct1(productId, transactionId) {
        currentApp.reportConsumableFulfillmentAsync(productId, transactionId).done(
            function (result) {
                switch (result) {
                    case FulfillmentResult.succeeded:
                        log("You bought and fulfilled product 1.", "sample", "status");
                        break;
                    case FulfillmentResult.nothingToFulfill:
                        log("There is no purchased product 1 to fulfill.", "sample", "status");
                        break;
                    case FulfillmentResult.purchasePending:
                        log("You bought product 1. The purchase is pending so we cannot fulfill the product.", "sample", "status");
                        break;
                    case FulfillmentResult.purchaseReverted:
                        log("You bought product 1. But your purchase has been reverted.", "sample", "status");
                        // Since the user's purchase was revoked, they got their money back.
                        // You may want to revoke the user's access to the consumable content that was granted.
                        break;
                    case FulfillmentResult.serverError:
                        log("You bought product 1. There was an error when fulfilling.", "sample", "status");
                        break;
                }
            },
            function (error) {
                log("You bought Product 1. There was an error when attempting to fulfill.", "sample", "error");
            });
    }
     */

};

require("cordova/exec/proxy").add("InAppBillingPlugin", module.exports);
