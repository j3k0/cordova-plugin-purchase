(function () {


    //   {
    //     "purchaseToken":"tokenabc",
    //     "developerPayload":"mypayload1",
    //     "packageName":"com.example.MyPackage",
    //     "purchaseState":0, [0=purchased, 1=canceled, 2=refunded]
    //     "orderId":"12345.6789",
    //     "purchaseTime":1382517909216,
    //     "productId":"example_subscription"
    //   }
    store.setProductData = function(product, data) {

        store.log.debug("product data -> for " + product.id);
        store.log.debug("             -> " + JSON.stringify(data));
        var productBefore = JSON.stringify(product);

        product.transaction = {
            type: 'android-playstore', //TODO - does this need to be here?
            id: data.orderId,
            purchaseToken: data.purchaseToken,
            purchaseState: data.purchaseState,
            developerPayload: data.developerPayload,
            receipt: data.receipt,
            signature: data.signature
        };

        var isInitiated = product.state === store.INITIATED;
        var isPurchased = product.state === store.OWNED ||
          product.state === store.FINISHED ||
          product.state === store.APPROVED;

        // For some reasons, client API and server API both expose a
        // `purchaseState` field but with the meaning differ in both.

        if (typeof data.getPurchaseState !== undefined && data.getPurchaseState > 0) {
            // https://developer.android.com/reference/com/android/billingclient/api/Purchase.PurchaseState.html
            switch (data.getPurchaseState) {
                case 1: // purchased
                    if (!isPurchased) {
                        product.set("state", store.APPROVED);
                    }
                    break;
                case 2: // pending
                    if (!isInitiated) {
                        window.setTimeout(checkPendingPurchase, 60000);
                        product.set("state", store.INITIATED);
                        product.trigger("pending");
                    }
                    break;
            }
        }
        else if (typeof data.purchaseState !== 'undefined') {
            // https://developers.google.com/android-publisher/api-ref/purchases/products
            switch (data.purchaseState) {
                case 0: // purchased
                    if (!isPurchased) {
                        product.set("state", store.APPROVED);
                    }
                    break;
                case 1: // cancelled
                    if (isInitiated || isPurchased) {
                        product.set("state", store.VALID);
                        product.trigger("cancelled");
                    }
                    break;
                case 2: // pending or refunded
                    if (data.acknowledged === false) {
                        store.log.debug("Pending purchase: set to INITIATED");
                        if (!isInitiated) {
                            window.setTimeout(checkPendingPurchase, 60000);
                            product.set("state", store.INITIATED);
                            product.trigger("pending");
                        }
                    }
                    else {
                        if (isInitiated || isPurchased) {
                            product.set("state", store.VALID);
                            product.trigger("refunded");
                        }
                    }
                    break;
            }
        }

        if (typeof data.acknowledged === 'boolean') {
            product.set("acknowledged", data.acknowledged);
        }
        if (typeof data.autoRenewing === 'boolean') {
            if (product.type === store.PAID_SUBSCRIPTION) {
                if (product.state === store.OWNED || product.state === store.APPROVED || product.state === store.FINISHED) {
                    product.set("renewalIntent", data.autoRenewing ? "Renew" : "Lapse");
                }
                else {
                    product.set("renewalIntent", "");
                }
            }
        }

        // Check every minutes if something happened.
        function checkPendingPurchase() {
            if (product.state === store.INITIATED) {
                store.iabGetPurchases();
                window.setTimeout(checkPendingPurchase, 60000);
            }
        }

        var productAfter = JSON.stringify(product);
        if (productBefore !== productAfter) {
          product.trigger("updated");
        }
    };

    store.iabUpdatePurchases = function(purchases) {
      store.log.debug("iabUpdatePurchases: " + JSON.stringify(purchases));
      if (!purchases || !purchases.length) {
        purchases = [];
      }
      if (purchases && purchases.length) {
        for (var i = 0; i < purchases.length; ++i) {
          var purchase = purchases[i];
          var p = store.get(purchase.productId);
          if (!p) {
            store.log.warn("plugin -> user owns a non-registered product: " + purchase.productId);
            continue;
          }
          store.setProductData(p, purchase);
        }
      }
    };

    store.iabSetPurchases = function(purchases) {
      store.iabUpdatePurchases(purchases);
      var hasPurchase = {};
      if (purchases && purchases.length) {
        for (var i = 0; i < purchases.length; ++i) {
          var purchase = purchases[i];
          hasPurchase[purchase.productId] = true;
        }
      }
      store.products.forEach(function(product) {
        if (!hasPurchase[product.id]) {
          if ([ store.REGISTERED,
                store.REQUESTED,
                store.INITIATED,
                store.APPROVED,
                store.FINISHED,
                store.OWNED ].indexOf(product.state) >= 0) {
            product.set("state", store.VALID);
            product.trigger("cancelled");
          }
        }
      });
    };

    store.iabGetPurchases = function(callback) {
      store.log.debug("iabGetPurchases()");
        store.inappbilling.getPurchases(
            function(purchases) { // success
                // example purchases data:
                //
                // [
                //   {
                //     "purchaseToken":"tokenabc",
                //     "developerPayload":"mypayload1",
                //     "packageName":"com.example.MyPackage",
                //     "purchaseState":0,
                //     "orderId":"12345.6789",
                //     "purchaseTime":1382517909216,
                //     "productId":"example_subscription"
                //   },
                //   { ... }
                // ]
                store.log.debug("inappbilling.getPurchases() -> Success");
                store.log.debug("                            -> " + typeof purchases);
                store.log.debug("                            -> " + JSON.stringify(purchases));
                // store.iabUpdatePurchases(purchases); (sent to the setPurchases listener)
                store.ready(true);
                if (callback) callback();
            },
            function(err) { // error
                // TODO
                if (callback) callback();
            }
        );
    };

    store.manageSubscriptions = function() {
      store.inappbilling.manageSubscriptions();
    };

    store.manageBilling = function() {
      store.inappbilling.manageBilling();
    };

    store.redeem = function() {};

    store.requireAcknowledgment = true;

})();
