/** 
 * A plugin to enable iOS In-App Purchases.
 *
 * Copyright (c) Matt Kane 2011
 * Copyright (c) Guillaume Charhon 2012
 * Copyright (c) Jean-Christophe Hoelt 2013
 */

var exec = function (method, options, success, error) {
    cordova.exec(success, error, "InAppPurchase", method, [options]);
};

var log = function (msg) {
    console.log("InAppPurchase: " + msg);
};

var InAppPurchase = function () {
};

InAppPurchase.prototype.setup = function (success, error) {
    var that = this;
    var setupOk = function () {
        log('setup ok');
        if (typeof success === 'function') success.call(this);
    };
    var setupFailed = function () {
        log('setup failed');
        if (typeof error === 'function') error.call(this, 'setup failed');
    };
    exec('setup', [], setupOk, setupFailed);
};

/**
 * Makes an in-app purchase. 
 * 
 * @param {String} productId The product identifier. e.g. "com.example.MyApp.myproduct"
 * @param {int} quantity 
 */
InAppPurchase.prototype.makePurchase = function (productId, quantity, success, error) {
	var q = parseInt(quantity);
	if (!q) {
		q = 1;
	}
    var purchaseOk = function () {
        log('purchased ' + productId);
        if (typeof success === 'function') success.call(this, productId, quantity);
    };
    var purchaseFailed = function () {
        var msg = 'purchasing ' + productId + ' failed';
        log(msg);
        if (typeof error === 'function') error.call(this, m, productId, quantity);
    };
    return exec('makePurchase', [productId, q], purchaseOk, purchaseFailed);
};

/**
 * Asks the payment queue to restore previously completed purchases.
 * The restored transactions are passed to the onRestored callback, so make sure you define a handler for that first.
 * 
 */
InAppPurchase.prototype.restoreCompletedTransactions = function() {
    return PhoneGap.exec('InAppPurchase.restoreCompletedTransactions');		
}


/**
 * Retrieves the localised product data, including price (as a localised string), name, description.
 * You must call this before attempting to make a purchase.
 *
 * @param {String} productId The product identifier. e.g. "com.example.MyApp.myproduct"
 * @param {Function} successCallback Called once for each returned product id. Signature is function(productId, title, description, price)
 * @param {Function} failCallback Called once for each invalid product id. Signature is function(productId)
 */

InAppPurchase.prototype.requestProductData = function(productId, successCallback, failCallback) {
	var key = 'f' + this.callbackIdx++;
	window.plugins.inAppPurchase.callbackMap[key] = {
    success: function(productId, title, description, price ) {
        if (productId == '__DONE') {
            delete window.plugins.inAppPurchase.callbackMap[key]
            return;
        }
        successCallback(productId, title, description, price);
    },
    fail: failCallback
	}
	var callback = 'window.plugins.inAppPurchase.callbackMap.' + key;
    PhoneGap.exec('InAppPurchase.requestProductData', productId, callback + '.success', callback + '.fail');	
}

/**
 * Retrieves localised product data, including price (as localised
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
 *   where validProducts receives an array of objects of the form
 *
 *     {
 *      id: "<productId>",
 *      title: "<localised title>",
 *      description: "<localised escription>",
 *      price: "<localised price>"
 *     }
 *
 *  and invalidProductIds receives an array of product identifier
 *  strings which were rejected by the app store.
 */
InAppPurchase.prototype.requestProductsData = function(productIds, callback) {
	var key = 'b' + this.callbackIdx++;
	window.plugins.inAppPurchase.callbackMap[key] = function(validProducts, invalidProductIds) {
		delete window.plugins.inAppPurchase.callbackMap[key];
		callback(validProducts, invalidProductIds);
	};
	var callbackName = 'window.plugins.inAppPurchase.callbackMap.' + key;
	PhoneGap.exec('InAppPurchase.requestProductsData', callbackName, {productIds: productIds});
};

/* function(transactionIdentifier, productId, transactionReceipt) */
InAppPurchase.prototype.onPurchased = null;

/* function(originalTransactionIdentifier, productId, originalTransactionReceipt) */
InAppPurchase.prototype.onRestored = null;

/* function(errorCode, errorText) */
InAppPurchase.prototype.onFailed = null;

/* function() */
InAppPurchase.prototype.onRestoreCompletedTransactionsFinished = null;

/* function(errorCode) */
InAppPurchase.prototype.onRestoreCompletedTransactionsFailed = null;

/* This is called from native.*/

InAppPurchase.prototype.updatedTransactionCallback = function(state, errorCode, errorText, transactionIdentifier, productId, transactionReceipt) {
    alert(state);
	switch(state) {
		case "PaymentTransactionStatePurchased":
			if(window.plugins.inAppPurchase.onPurchased)
                window.plugins.inAppPurchase.onPurchased(transactionIdentifier, productId, transactionReceipt);
			
			return; 
			
		case "PaymentTransactionStateFailed":
			if(window.plugins.inAppPurchase.onFailed)
				window.plugins.inAppPurchase.onFailed(errorCode, errorText);
			
			return;
            
		case "PaymentTransactionStateRestored":
            if(window.plugins.inAppPurchase.onRestored)
                window.plugins.inAppPurchase.onRestored(transactionIdentifier, productId, transactionReceipt);
			return;
	}
};

InAppPurchase.prototype.restoreCompletedTransactionsFinished = function() {
    if (this.onRestoreCompletedTransactionsFinished) {
        this.onRestoreCompletedTransactionsFinished();
    }
};

InAppPurchase.prototype.restoreCompletedTransactionsFailed = function(errorCode) {
    if (this.onRestoreCompletedTransactionsFailed) {
        this.onRestoreCompletedTransactionsFailed(errorCode);
    }
};

/*
 * This queue stuff is here because we may be sent events before listeners have been registered. This is because if we have 
 * incomplete transactions when we quit, the app will try to run these when we resume. If we don't register to receive these
 * right away then they may be missed. As soon as a callback has been registered then it will be sent any events waiting
 * in the queue.
 */

InAppPurchase.prototype.runQueue = function() {
	if(!this.eventQueue.length || (!this.onPurchased && !this.onFailed && !this.onRestored)) {
		return;
	}
	var args;
	/* We can't work directly on the queue, because we're pushing new elements onto it */
	var queue = this.eventQueue.slice();
	this.eventQueue = [];
	while(args = queue.shift()) {
		this.updatedTransactionCallback.apply(this, args);
	}
	if(!this.eventQueue.length) {	
		this.unWatchQueue();
	}
}

InAppPurchase.prototype.watchQueue = function() {
	if(this.timer) {
		return;
	}
	this.timer = setInterval("window.plugins.inAppPurchase.runQueue()", 10000);
}

InAppPurchase.prototype.unWatchQueue = function() {
	if(this.timer) {
		clearInterval(this.timer);
		this.timer = null;
	}
}


InAppPurchase.prototype.callbackMap = {};
InAppPurchase.prototype.callbackIdx = 0;
InAppPurchase.prototype.eventQueue = [];
InAppPurchase.prototype.timer = null;

module.exports = new InAppPurchase();
