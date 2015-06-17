(function () {
    "use strict";

    var initialized = false;
    var skus = [];

    /*
     *  Pruduct Listing
     *
        Description     Read-only	Windows Phone only. Gets the description for the in-app product.
        FormattedPrice  Read-only	Gets the in-app product purchase price with the appropriate formatting for the current market.
        ImageUri        Read-only	Gets the URI of the image associated with the in-app product.
        Keywords        Read-only	Gets the list of keywords associated with the in-app product. These keywords are useful for filtering product lists by keyword, for example, when calling LoadListingInformationByKeywordsAsync.
        Name            Read-only	Gets the descriptive name of the in-app product that is displayed customers in the current market.
        ProductId       Read-only	Gets the in-app product ID.
        ProductType     Read-only	Gets the type of this in-app product. Possible values are defined by ProductType.
        Tag             Read-only	Gets the tag string that contains custom information about an in-app product.
     */

    /*
     *  Pruduct Result
     *
        OfferId         Read-only	A unique ID used to identify a specific in-app product within a large catalog.
        ReceiptXml      Read-only	A full receipt that provides a transaction history for the purchase of an in-app product
        Status          Read-only	The current state of the purchase transaction for an in-app product.
        TransactionId   Read-only	A unique transaction ID associated with the purchase of a consumable in-app
     */

    /*
     * Product License
     *
        ExpirationDate  Read-only	Gets the current expiration date and time of the in-app product license.
        IsActive        Read-only	Indicates if the in-app product license is currently active.
        IsConsumable    Read-only	Indicates if the in-app product is consumable. A consumable product is a product that can be purchased, used, and purchased again.
        ProductId       Read-only	Gets the ID of an in-app product. This ID is used by the app to get info about the product or feature that is enabled when the customer buys it through an in-app purchase.
     */

    function setProductData(product, transaction, license) {

        store.log.debug("windows -> product data for " + product.id);
        store.log.debug(transaction);
        store.log.debug(license);

        product.license = {
            type: 'windows-store-license',
            expirationDate: license.expirationDate,
            isConsumable: license.isConsumable,
            isActive: license.isActive
        };

        product.transaction = {
            type: 'windows-store-transaction',
            id: transaction.transactionId,
            offerId: transaction.offerId,
            receipt: transaction.receiptXml
        };

        // When the product is owned, adjust the state if necessary
        if (product.state !== store.OWNED && product.state !== store.FINISHED &&
            product.state !== store.APPROVED) {
            //  Succeeded           || AlreadyPurchased
            if (transaction.status === 0) {
                product.set("state", store.APPROVED);
            }
            //AlreadyPurchased
            if (transaction.status === 1 || license.isActive) {
                product.set("state", store.OWNED);
            }
        }

        // When the product is cancelled or refunded, adjust the state if necessary
        if (product.state === store.OWNED || product.state === store.FINISHED ||
            product.state === store.APPROVED) {

            //NotPurchased
            if (transaction.status === 3) {
                product.trigger("cancelled");
                product.set("state", store.VALID);
            }
            //not fullfilled
            else if (transaction.status === 2) {
                product.trigger("refunded");
                product.set("state", store.VALID);
            }
        }
    }


    function iabGetPurchases() {
        store.windows.getLicenses(
            function (licenses) { // success
                /*
                 * Product License
                 *
                    ExpirationDate  Read-only	Gets the current expiration date and time of the in-app product license.
                    IsActive        Read-only	Indicates if the in-app product license is currently active.
                    IsConsumable    Read-only	Indicates if the in-app product is consumable. A consumable product is a product that can be purchased, used, and purchased again.
                    ProductId       Read-only	Gets the ID of an in-app product. This ID is used by the app to get info about the product or feature that is enabled when the customer buys it through an in-app purchase.
                 */
                if (licenses && licenses.length) {
                    for (var i = 0; i < licenses.length; ++i) {
                        var license = licenses[i];
                        var p = store.get(license.productId);
                        if (!p) {
                            store.log.warn("windows -> user owns a non-registered product");
                            continue;
                        }
                        setProductData(p, {}, license);
                    }
                }
                store.ready(true);
            },
            function () { // error
                // TODO
            }
            );
    }

    function iabLoaded(validProducts) {
        store.log.debug("windows -> loaded - " + JSON.stringify(validProducts));
        var p, i;
        for (i = 0; i < validProducts.length; ++i) {

            if (validProducts[i].productId)
                p = store.products.byId[validProducts[i].productId];
            else
                p = null;

            if (p) {
                p.set({
                    title: validProducts[i].name,
                    price: validProducts[i].formattedPrice,
                    description: validProducts[i].description,
                    currency: "",
                    state: store.VALID
                });
                p.trigger("loaded");
            }
        }
        for (i = 0; i < skus.length; ++i) {
            p = store.products.byId[skus[i]];
            if (p && !p.valid) {
                p.set("state", store.INVALID);
                p.trigger("loaded");
            }
        }

        iabGetPurchases();
    }


    function iabReady() {
        store.log.debug("windows -> ready");
        store.windows.getAvailableProducts(iabLoaded, function (err) {
            store.error({
                code: store.ERR_LOAD,
                message: 'Loading product info failed - ' + err
            });
        });
    }

    function init() {
        if (initialized) return;
        initialized = true;

        for (var i = 0; i < store.products.length; ++i)
            skus.push(store.products[i].id);

        store.windows.init(iabReady,
            function (err) {
                store.error({
                    code: store.ERR_SETUP,
                    message: 'Init failed - ' + err
                });
            },
            {
                showLog: store.verbosity >= store.DEBUG ? true : false
            },
            skus);
    }


    store.when("refreshed", function () {
        if (!initialized) init();
    });

    store.when("re-refreshed", function () {
        iabGetPurchases();
    });

    store.when("requested", function (product) {
        store.ready(function () {
            if (!product) {
                store.error({
                    code: store.ERR_INVALID_PRODUCT_ID,
                    message: "Trying to order an unknown product"
                });
                return;
            }
            if (!product.valid) {
                product.trigger("error", [new store.Error({
                    code: store.ERR_PURCHASE,
                    message: "`purchase()` called with an invalid product"
                }), product]);
                return;
            }

            if (product.owned) {
                product.trigger("error", [new store.Error({
                    code: store.ERR_PURCHASE,
                    message: "`purchase()` called with an already owned product"
                }), product]);
                return;
            }

            // Initiate the purchase
            product.set("state", store.INITIATED);

            store.windows.buy(function (result) {
                /*
                 *  Success callabck.
                 *
                 *  Pruduct Result
                 *
                    OfferId         Read-only	A unique ID used to identify a specific in-app product within a large catalog.
                    ReceiptXml      Read-only	A full receipt that provides a transaction history for the purchase of an in-app product
                    Status          Read-only	The current state of the purchase transaction for an in-app product.
                    TransactionId   Read-only	A unique transaction ID associated with the purchase of a consumable in-app
                 */
                setProductData(product, result, {});
            },
                function (err, code) {
                    store.log.info("windows -> buy error " + code);
                    if (code === store.ERR_PAYMENT_CANCELLED) {
                        // This isn't an error,
                        // just trigger the cancelled event.
                        product.transaction = null;
                        product.trigger("cancelled");
                    }
                    else {
                        store.error({
                            code: code || store.ERR_PURCHASE,
                            message: "Purchase failed: " + err
                        });
                    }
                    product.set("state", store.VALID);
                }, product.id);
        });
    });

    /// #### finish a purchase
    /// When a consumable product enters the store.FINISHED state,
    /// `consume()` the product.
    store.when("product", "finished", function (product) {
        store.log.debug("windows -> consumable finished");
        if (product.type === store.CONSUMABLE) {
            product.transaction = null;
            store.windows.consumePurchase(
                function () { // success
                    store.log.debug("windows -> consumable consumed");
                    product.set('state', store.VALID);
                },
                function (err, code) { // error
                    // can't finish.
                    store.error({
                        code: code || store.ERR_UNKNOWN,
                        message: err
                    });
                },
                product.id);
        }
        else {
            product.set('state', store.OWNED);
        }
    });

})();
