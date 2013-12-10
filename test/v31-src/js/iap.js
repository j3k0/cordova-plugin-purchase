
    var IAP = {
        list: [ 'babygooinapp1' ],
        products: {}
    };
    var localStorage = window.localStorage || {};

    IAP.initialize = function () {
        // Check availability of the storekit plugin
        if (!window.storekit) {
            console.log('In-App Purchases not available');
            return;
        }

        // Initialize
        storekit.init({
            debug:    true,
            ready:    IAP.onReady,
            purchase: IAP.onPurchase,
            restore:  IAP.onRestore,
            error:    IAP.onError,
            restoreCompleted: IAP.onRestoreCompleted
        });
    };

    IAP.onReady = function () {
        // Once setup is done, load all product data.
        storekit.load(IAP.list, function (products, invalidIds) {
            console.log('IAPs loading done:');
            for (var j = 0; j < products.length; ++j) {
                var p = products[j];
                console.log('Loaded IAP(' + j + '). title:' + p.title +
                            ' description:' + p.description +
                            ' price:' + p.price +
                            ' id:' + p.id);
                IAP.products[p.id] = p;
            }
            IAP.loaded = true;
            for (var i = 0; i < invalidIds.length; ++i) {
                console.log('Error: could not load ' + invalidIds[i]);
            }
            IAP.render();
        });

        // Also check the receipts
        storekit.loadReceipts(function (receipts) {
            console.log('appStoreReceipt:' + receipts);
        });
    };

    IAP.onPurchase = function (transactionId, productId) {
        var n = (localStorage['storekit.' + productId]|0) + 1;
        localStorage['storekit.' + productId] = n;
        if (IAP.purchaseCallback) {
            IAP.purchaseCallback(productId);
            delete IAP.purchaseCallbackl;
        }
    };

    IAP.onError = function (errorCode, errorMessage) {
        alert('Error: ' + errorMessage);
    };

    IAP.onRestore = function (transactionId, productId) {
        console.log("Restored: " + productId);
        var n = (localStorage['storekit.' + productId]|0) + 1;
        localStorage['storekit.' + productId] = n;
    };

    IAP.onRestoreCompleted = function () {
        console.log("Restore Completed");
    };

    IAP.buy = function (productId, callback) {
        IAP.purchaseCallback = callback;
        storekit.purchase(productId);
    };

    IAP.restore = function () {
        storekit.restore();
    };

    IAP.fullVersion = function () {
        return localStorage['storekit.babygooinapp1'];
    };
