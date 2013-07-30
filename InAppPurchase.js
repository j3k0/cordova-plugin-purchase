/** 
 * A plugin to enable iOS In-App Purchases.
 *
 * Copyright (c) Matt Kane 2011
 * Copyright (c) Guillaume Charhon 2012
 * Copyright (c) Jean-Christophe Hoelt 2013
 */

var exec = function (methodName, options, success, error) {
    cordova.exec(success, error, "InAppPurchase", methodName, options);
};

var log = function (msg) {
    console.log("InAppPurchase[js]: " + msg);
};

var InAppPurchase = function () {
    this.options = {};
};

// Error codes.
InAppPurchase.ERR_SETUP = 1;
InAppPurchase.ERR_LOAD = 2;
InAppPurchase.ERR_PURCHASE = 3;

InAppPurchase.prototype.init = function (options) {
    this.options = {
        ready:    options.ready || function () {},
        purchase: options.purchase || function () {},
        restore:  options.restore || function () {},
        restoreFailed:  options.restoreFailed || function () {},
        restoreCompleted:  options.restoreCompleted || function () {},
        error:    options.error || function () {}
    };

    var that = this;
    var setupOk = function () {
        log('setup ok');
        that.options.ready();

        // Is there a reason why we wouldn't like to do this automatically?
        // YES! it does ask the user for his password.
        // that.restore();
    };
    var setupFailed = function () {
        log('setup failed');
        options.error(InAppPurchase.ERR_SETUP, 'Setup failed');
    };

    exec('setup', [], setupOk, setupFailed);
};

/**
 * Makes an in-app purchase. 
 * 
 * @param {String} productId The product identifier. e.g. "com.example.MyApp.myproduct"
 * @param {int} quantity 
 */
InAppPurchase.prototype.purchase = function (productId, quantity) {
	quantity = (quantity|0) || 1;
    var options = this.options;
    var purchaseOk = function () {
        log('Purchased ' + productId);
        if (typeof options.purchase === 'function')
            options.purchase(productId, quantity);
    };
    var purchaseFailed = function () {
        var msg = 'Purchasing ' + productId + ' failed';
        log(msg);
        if (typeof options.error === 'function')
            options.error(InAppPurchase.ERR_PURCHASE, msg, productId, quantity);
    };
    return exec('purchase', [productId, quantity], purchaseOk, purchaseFailed);
};

/**
 * Asks the payment queue to restore previously completed purchases.
 * The restored transactions are passed to the onRestored callback, so make sure you define a handler for that first.
 * 
 */
InAppPurchase.prototype.restore = function() {
    return exec('restoreCompletedTransactions', []);
};

/**
 * Retrieves localized product data, including price (as localized
 * string), name, description of multiple products.
 *
 * @param {Array} productIds
 *   An array of product identifier strings.
 *
 * @param {Function} callback
 *   Called once with the result of the products request. Signature:
 *
 *     function(validProducts, invalidProductIds)
 *
 *   where validProducts receives an array of objects of the form:
 *
 *     {
 *       id: "<productId>",
 *       title: "<localised title>",
 *       description: "<localised escription>",
 *       price: "<localised price>"
 *     }
 *
 *  and invalidProductIds receives an array of product identifier
 *  strings which were rejected by the app store.
 */
InAppPurchase.prototype.load = function (productIds, callback) {
    var options = this.options;
    if (typeof productIds === "string") {
        productIds = [productIds];
    }
    if (!productIds.length) {
        // Empty array, nothing to do.
        callback([], []);
    }
    else {
        if (typeof productIds[0] !== 'string') {
            var msg = 'invalid productIds given to store.load: ' + JSON.stringify(productIds);
            log(msg);
            options.error(InAppPurchase.ERR_LOAD, msg);
            return;
        }
        log('load ' + JSON.stringify(productIds));

        var loadOk = function (array) {
            var valid = array[0];
            var invalid = array[1];
            log('load ok: { valid:' + JSON.stringify(valid) + ' invalid:' + JSON.stringify(invalid) + ' }');
            callback(valid, invalid);
        };
        var loadFailed = function (errMessage) {
            log('load failed: ' + errMessage);
            options.error(InAppPurchase.ERR_LOAD, 'Failed to load product data: ' + errMessage);
        };

        exec('load', [productIds], loadOk, loadFailed);
    }
};

/* This is called from native.*/
InAppPurchase.prototype.updatedTransactionCallback = function (state, errorCode, errorText, transactionIdentifier, productId, transactionReceipt) {
    // alert(state);
	switch(state) {
		case "PaymentTransactionStatePurchased":
            this.options.purchase(transactionIdentifier, productId, transactionReceipt);
			return; 
		case "PaymentTransactionStateFailed":
            this.options.error(errorCode, errorText);
			return;
		case "PaymentTransactionStateRestored":
            this.options.restore(transactionIdentifier, productId, transactionReceipt);
			return;
	}
};

InAppPurchase.prototype.restoreCompletedTransactionsFinished = function () {
    this.options.restoreCompleted();
};

InAppPurchase.prototype.restoreCompletedTransactionsFailed = function (errorCode) {
    this.options.restoreFailed(errorCode);
};

/*
 * This queue stuff is here because we may be sent events before listeners have been registered. This is because if we have 
 * incomplete transactions when we quit, the app will try to run these when we resume. If we don't register to receive these
 * right away then they may be missed. As soon as a callback has been registered then it will be sent any events waiting
 * in the queue.
 */
InAppPurchase.prototype.runQueue = function () {
	if(!this.eventQueue.length || (!this.onPurchased && !this.onFailed && !this.onRestored)) {
		return;
	}
	var args;
	/* We can't work directly on the queue, because we're pushing new elements onto it */
	var queue = this.eventQueue.slice();
	this.eventQueue = [];
    args = queue.shift();
	while (args) {
		this.updatedTransactionCallback.apply(this, args);
        args = queue.shift();
	}
	if (!this.eventQueue.length) {	
		this.unWatchQueue();
	}
};

InAppPurchase.prototype.watchQueue = function () {
	if (this.timer) {
		return;
	}
	this.timer = window.setInterval(function () {
        window.storekit.runQueue();
    }, 10000);
};

InAppPurchase.prototype.unWatchQueue = function () {
	if (this.timer) {
		window.clearInterval(this.timer);
		this.timer = null;
	}
};

InAppPurchase.prototype.eventQueue = [];
InAppPurchase.prototype.timer = null;

module.exports = new InAppPurchase();
