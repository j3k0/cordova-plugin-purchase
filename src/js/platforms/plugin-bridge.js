/*
 * Copyright (C) 2012-2013 by Guillaume Charhon
 * Modifications 10/16/2013 by Brian Thurlow
 */
/*global cordova */

(function() {
"use strict";

var log = function (msg) {
    console.log("InAppBilling[js]: " + msg);
};

var InAppBilling = function () {
    this.options = {};
};

InAppBilling.prototype.init = function (success, fail, options, skus) {
	if (!options)
        options = {};

	this.options = {
		showLog: options.showLog !== false
	};

	if (this.options.showLog) {
		log('setup ok');
	}

	var hasSKUs = false;
	//Optional Load SKUs to Inventory.
	if(typeof skus !== "undefined"){
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

	if (hasSKUs) {
		cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "init", [skus]);
    }
	else {
        //No SKUs
		cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "init", []);
    }
};
InAppBilling.prototype.getPurchases = function (success, fail) {
	if (this.options.showLog) {
		log('getPurchases called!');
	}
	return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "getPurchases", ["null"]);
};
InAppBilling.prototype.buy = function (success, fail, productId) {
	if (this.options.showLog) {
		log('buy called!');
	}
	return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "buy", [productId]);
};
InAppBilling.prototype.subscribe = function (success, fail, productId) {
	if (this.options.showLog) {
		log('subscribe called!');
	}
	return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "subscribe", [productId]);
};
InAppBilling.prototype.consumePurchase = function (success, fail, productId, transactionId) {
	if (this.options.showLog) {
		log('consumePurchase called!');
	}
	return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "consumePurchase", [productId, transactionId]);
};
InAppBilling.prototype.getAvailableProducts = function (success, fail) {
	if (this.options.showLog) {
		log('getAvailableProducts called!');
	}
	return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "getAvailableProducts", ["null"]);
};
InAppBilling.prototype.getProductDetails = function (success, fail, skus) {
	if (this.options.showLog) {
		log('getProductDetails called!');
	}

	if (typeof skus === "string") {
        skus = [skus];
    }
    if (!skus.length) {
        // Empty array, nothing to do.
        return;
    }else {
        if (typeof skus[0] !== 'string') {
            var msg = 'invalid productIds: ' + JSON.stringify(skus);
            log(msg);
			fail(msg, store.ERR_INVALID_PRODUCT_ID);
            return;
        }
        if (this.options.showLog) {
			log('load ' + JSON.stringify(skus));
        }
		cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "getProductDetails", [skus]);
    }
};
InAppBilling.prototype.setTestMode = function (success, fail) {
	if (this.options.showLog) {
		log('setTestMode called!');
	}
	return cordova.exec(success, errorCb(fail), "InAppBillingPlugin", "setTestMode", [""]);
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
catch (e) {}

})();
