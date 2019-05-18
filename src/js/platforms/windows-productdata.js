/* global Windows */
/* global crypto */

(function () {

	/*
     *  Product Listing
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
     *  Product Result
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

	store.setProductData = function(product, data) {
		var transaction = data.transaction;
		var license = data.license;

		store.log.debug("windows -> product data for " + product.id);
        store.log.debug(transaction);
        store.log.debug(license);

        if (license) {
            product.license = {
                type: 'windows-store-license',
                expirationDate: license.expirationDate,
                isActive: license.isActive,
                storeId: license.storeId
            };
            if (license.expirationDate > 0) {
                product.expiryDate = new Date(+license.expirationDate);
            }
        }
        else {
            license = {};
        }

        if (transaction) {
            product.transaction = Object.assign(product.transaction || {}, {
                type: 'windows-store-transaction',
                id: transaction.transactionId,
                offerId: transaction.offerId,
                receipt: transaction.receiptXml,
                storeId: transaction.storeId,
                skuId: transaction.skuId
            });
            if (license && license.expirationDate > 0) {
                product.transaction.expirationDate = license.expirationDate;
            }
        }
        else {
            transaction = {};
        }

        // When the product is owned, adjust the state if necessary
        if (product.state !== store.OWNED && product.state !== store.FINISHED &&
            product.state !== store.APPROVED) {
            //  Succeeded           || AlreadyPurchased
            if (transaction.status === 0) {
                product.set("state", store.APPROVED);
            }
            //AlreadyPurchased
            if (transaction.status === 1 || license.isActive) {
                // product.set("state", store.OWNED);
                product.set("state", store.APPROVED);
            }
        }

        if (product.state === store.INITIATED) {
            if (transaction.status === 3) {
                product.trigger("cancelled");
                product.set("state", store.VALID);
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
    };

    store.iabGetPurchases = function(callback) {
        store.inappbilling.getPurchases(function(purchases) {
            store.log.debug("getPurchases -> " + JSON.stringify(purchases));
            if (purchases && purchases.length) {
                for (var i = 0; i < purchases.length; ++i) {
                    var purchase = purchases[i];
                    var p = store.get(purchase.license.productId);
                    if (!p) {
                        store.log.warn("plugin -> user owns a non-registered product: " + purchase.license.productId);
                        continue;
                    }
                    store.setProductData(p, purchase);
                }
            }
            store.ready(true);
            if (callback) callback();
        }, function() { // error
            // TODO
            if (callback) callback();
        });
    };

    var ONE_DAY_MILLS = 24 * 3600 * 1000;
    var NINETY_DAYS_MILLIS = ONE_DAY_MILLS * 90;
    function loadStoreIdKey(type) {
        var value = window.localStorage['cordova_storeidkey_' + type];
        var created = window.localStorage['cordova_storeidkey_' + type + '_date'];
        var expires = (+new Date(created)) + NINETY_DAYS_MILLIS - ONE_DAY_MILLS;
        if (value && expires > +new Date())
            return value;
    }
    function saveStoreIdKey(type, value) {
        window.localStorage['cordova_storeidkey_' + type] = value;
        window.localStorage['cordova_storeidkey_' + type + '_date'] = (new Date()).toISOString();
    }
    store.when().updated(function(p) {
        if (!p.transaction)
            p.transaction = {};
        if (!p.license)
            p.license = {};
        if (!p.license.storeIdKey_purchase)
            p.license.storeIdKey_purchase = loadStoreIdKey('purchase');
        if (!p.license.storeIdKey_collections)
            p.license.storeIdKey_collections = loadStoreIdKey('collections');
        if (p.transaction.serviceTicket && p.transaction.serviceTicketType) {
            var storeIdKey = loadStoreIdKey(p.transaction.serviceTicketType);
            var cachedApplicationUsername = window.localStorage._cordova_application_username;
            p.licence = Object.assign(p.license || {}, {applicationUsername: cachedApplicationUsername});
            var publisherUserId = p.additionalData && p.additionalData.applicationUsername || cachedApplicationUsername || store.utils.uuidv4();
            if (!cachedApplicationUsername) {
                window.localStorage._cordova_application_username = publisherUserId;
            }
            var storeContext;
            if (storeIdKey) {
                p.license['storeIdKey_' + p.transaction.serviceTicketType] = storeIdKey;
            }
            else if (p.transaction.serviceTicketType === 'purchase') {
                storeContext = Windows.Services.Store.StoreContext.getDefault();
				storeContext.getCustomerPurchaseIdAsync(p.transaction.serviceTicket, publisherUserId)
                .done(function (result) {
                    if (result) {
                        store.log.info('getCustomerPurchaseIdAsync -> ' + result);
                        p.license['storeIdKey_' + p.transaction.serviceTicketType] = result;
                        delete p.transaction.serviceTicket;
                        delete p.transaction.serviceTicketType;
                        saveStoreIdKey('purchase', result);
                    }
                    else {
                        store.log.error('getCustomerPurchaseIdAsync failed');
                    }
                });
            }
            else if (p.transaction.serviceTicketType === 'collections') {
                storeContext = Windows.Services.Store.StoreContext.getDefault();
				storeContext.getCustomerCollectionsIdAsync(p.transaction.serviceTicket, publisherUserId)
                .done(function (result) {
                    if (result) {
                        store.log.info('getCustomerCollectionsIdAsync -> ' + result);
                        p.license['storeIdKey_' + p.transaction.serviceTicketType] = result;
                        delete p.transaction.serviceTicket;
                        delete p.transaction.serviceTicketType;
                        saveStoreIdKey('collections', result);
                    }
                    else {
                        store.log.error('getCustomerCollectionsIdAsync failed');
                    }
                });
            }
        }
    });

})();
