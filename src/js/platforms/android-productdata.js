(function () {
    "use strict";
	
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
    
        store.log.debug("android -> product data for " + product.id);
        store.log.debug(data);
    
        product.transaction = {
            type: 'android-playstore', //TODO - does this need to be here?
            id: data.orderId,
            purchaseToken: data.purchaseToken,
            developerPayload: data.developerPayload,
            receipt: data.receipt,
            signature: data.signature
        };
        
        //Windows junk for reference
        /*product.license = {
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
        };*/
    
        // When the product is owned, adjust the state if necessary
        if (product.state !== store.OWNED && product.state !== store.FINISHED &&
            product.state !== store.APPROVED) {
    
            if (data.purchaseState === 0) {
                product.set("state", store.APPROVED);
            }
        }
    
        // When the product is cancelled or refunded, adjust the state if necessary
        if (product.state === store.OWNED || product.state === store.FINISHED ||
            product.state === store.APPROVED) {
    
            if (data.purchaseState === 1) {
                product.trigger("cancelled");
                product.set("state", store.VALID);
            }
            else if (data.purchaseState === 2) {
                product.trigger("refunded");
                product.set("state", store.VALID);
            }
        }
    };
	
})();
