/*
 * Copyright (C) 2012-2013 by Guillaume Charhon
 * Modifications 10/16/2013 by Brian Thurlow
 */
/*global cordova */

(function() {


var log = function (msg) {
    console.log("InAppBilling[js]: " + msg);
};

var InAppBilling = function () {
    this.options = {};
};

InAppBilling.prototype.init = function (success, fail, options, skus, inAppSkus, subsSkus) {
	if (!options)
        options = {};

	this.options = {
		showLog: options.showLog !== false,
        onPurchaseConsumed: options.onPurchaseConsumed,
        onPurchasesUpdated: options.onPurchasesUpdated,
        onSetPurchases: options.onSetPurchases,
	};

	if (this.options.showLog) {
		log('setup ok');
	}

	var hasSKUs = false;
	// Optional Load SKUs to Inventory.
	if (typeof skus !== "undefined"){
		if (typeof skus === "string") {
			skus = [skus];
		}
		if (skus.length > 0) {
			if (typeof skus[0] !== 'string') {
				var msg = 'invalid productIds: ' + JSON.stringify(skus);
				if (this.options.showLog) {
					log(msg);
				}
				fail(msg, store.ERR_INVALID_PRODUCT_ID);
				return;
			}
			if (this.options.showLog) {
				log('load ' + JSON.stringify(skus));
			}
			hasSKUs = true;
		}
	}

    // Set a listener (see "listener()" function above)
    var listener = this.listener.bind(this);
    cordova.exec(listener, function(err) {}, "InAppBillingPlugin", "setListener", []);

	if (hasSKUs) {
		cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "init", [skus, inAppSkus, subsSkus]);
    }
	else {
        //No SKUs
		cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "init", []);
    }
};
InAppBilling.prototype.listener = function (msg) {
    // Handle changes to purchase that are being notified
    // through the PurchasesUpdatedListener on the native side (android)
    if (this.options.showLog) {
        log('listener: ' + JSON.stringify(msg));
    }
    if (!msg || !msg.type) {
        return;
    }
    if (msg.type === "setPurchases" && this.options.onSetPurchases) {
        this.options.onSetPurchases(msg.data.purchases);
    }
    if (msg.type === "purchasesUpdated" && this.options.onPurchasesUpdated) {
        this.options.onPurchasesUpdated(msg.data.purchases);
    }
    if (msg.type === "purchaseConsumed" && this.options.onPurchaseConsumed) {
        this.options.onPurchaseConsumed(msg.data.purchase);
    }
};
InAppBilling.prototype.getPurchases = function (success, fail) {
	if (this.options.showLog) {
		log('getPurchases()');
	}
	return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "getPurchases", ["null"]);
};
function ensureObject(obj) {
    return !!obj && obj.constructor === Object ? obj : {};
}
function extendAdditionalData(ad) {
    var additionalData = ensureObject(ad);
    if (!additionalData.accountId && additionalData.applicationUsername) {
        additionalData.accountId = store.utils.md5(additionalData.applicationUsername);
    }
    return additionalData;
}
InAppBilling.prototype.buy = function (success, fail, productId, additionalData) {
	if (this.options.showLog) {
		log('buy()');
	}
	return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "buy", [
        productId, extendAdditionalData(additionalData) ]);
};
InAppBilling.prototype.subscribe = function (success, fail, productId, additionalData) {
	if (this.options.showLog) {
		log('subscribe()');
	}
	if (additionalData.oldPurchasedSkus && this.options.showLog) {
        log('subscribe() -> upgrading of old SKUs!');
    }
	return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "subscribe", [
        productId, extendAdditionalData(additionalData) ]);
};
InAppBilling.prototype.consumePurchase = function (success, fail, productId, transactionId, developerPayload) {
	if (this.options.showLog) {
		log('consumePurchase()');
	}
	return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "consumePurchase", [productId, transactionId, developerPayload]);
};
InAppBilling.prototype.acknowledgePurchase = function (success, fail, productId, transactionId, developerPayload) {
	if (this.options.showLog) {
		log('acknowledgePurchase()');
	}
	return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "acknowledgePurchase", [productId, transactionId, developerPayload]);
};
InAppBilling.prototype.getAvailableProducts = function (success, fail) {
	if (this.options.showLog) {
		log('getAvailableProducts()');
	}
	return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "getAvailableProducts", ["null"]);
};
InAppBilling.prototype.manageSubscriptions = function () {
  return cordova.exec(function(){}, function(){}, "InAppBillingPlugin", "manageSubscriptions", []);
};
InAppBilling.prototype.manageBilling = function () {
  return cordova.exec(function(){}, function(){}, "InAppBillingPlugin", "manageBilling", []);
};

// Generates a `fail` function that accepts an optional error code
// in the first part of the error string.
//
// format: `code|message`
//
// `fail` function will be called with `message` as a first argument
// and `code` as a second argument (or undefined). This ensures
// backward compatibility with legacy code.
function errorCb(fail) {
    return function(error) {
        if (!fail)
            return;
        var tokens = typeof error === 'string' ? error.split('|') : [ error ];
        if (tokens.length > 1 && /^[-+]?(\d+)$/.test(tokens[0])) {
            var code = tokens[0];
            var message = tokens[1];
            fail(message, +code);
        }
        else {
            fail(error);
        }
    };
}

window.inappbilling = new InAppBilling();

// That's for compatibility with the unified IAP plugin.
try {
    store.inappbilling = window.inappbilling;
}
catch (e) {
    log(e);
}

})();
