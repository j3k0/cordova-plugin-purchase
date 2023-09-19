//
// This file contains an example usage of the API, for illustration purpose.
//
// It's also used to find regressions in the API's typings. This file should compile.
//
/// <reference path="../ts/store.ts" />

function demo() {

    CdvPurchase.store.when().receiptsReady(() => {
        console.log('All platforms are done loading their local receipts');
    });

    CdvPurchase.store.localTransactions.forEach(t => {
        if (t.platform === CdvPurchase.Platform.APPLE_APPSTORE) {
            const appleTransaction = t as CdvPurchase.AppleAppStore.SKTransaction;
            appleTransaction.originalTransactionId;
        }
    });

    const myProduct = CdvPurchase.store.get('my-product');
    if (myProduct) {
        const transaction = CdvPurchase.store.findInLocalReceipts(myProduct);
    }

    function readyAndVerified(callback: Function) {
        CdvPurchase.store.ready(function () {
            var localReceipts = CdvPurchase.store.localReceipts;
            var verifiedReceipts = CdvPurchase.store.verifiedReceipts;
            if (!CdvPurchase.store.validator || verifiedReceipts.length === localReceipts.length) {
                callback();
                return;
            }
            var onVerified = function() {
                if (localReceipts.length === verifiedReceipts.length) {
                    CdvPurchase.store.off(onVerified);
                    if (callback) {
                        callback();
                        callback = null;
                    }
                }
            }
            CdvPurchase.store.when().verified(onVerified);
        });
    }

    const store = CdvPurchase.store;

    const appStore = store.getAdapter(CdvPurchase.Platform.APPLE_APPSTORE);
    if (appStore && appStore.checkSupport('order')) {
        // user can make payments
    }

    // Shortcuts
    const ProductType = CdvPurchase.ProductType;
    const Platform = CdvPurchase.Platform;

    store.register([{
        id: 'subscription1',
        type: ProductType.PAID_SUBSCRIPTION,
        platform: Platform.APPLE_APPSTORE,
    }, {
        id: 'subscription1',
        type: ProductType.PAID_SUBSCRIPTION,
        platform: Platform.GOOGLE_PLAY,
    }, {
        id: 'consumable1',
        type: ProductType.CONSUMABLE,
        platform: Platform.BRAINTREE,
    }]);

    store.validator = {
        url: 'https://validator.iaptic.com',
        timeout: 30000,
    }
    Platform.APPLE_APPSTORE

    store.when().pending(transaction => {
        // transaction is pending (waiting for parent approval, cash payment, ...)
    });

    // Replace an old purchase when finalizing the new one on google play.
    store.order(product, {
        googlePlay: {
            oldPurchaseToken: 'abcdefghijkl',
            prorationMode: CdvPurchase.GooglePlay.ProrationMode.IMMEDIATE_AND_CHARGE_PRORATED_PRICE,
        }
    });

    // For those 2 subscription products, the plugin will automatically replace the currently owned one (if any) when placing a new order.
    store.register([{
        id: 'no_ads_yearly',
        type: ProductType.PAID_SUBSCRIPTION,
        platform: Platform.GOOGLE_PLAY,
        group: 'noAds'
    }, {
        id: 'no_ads_monthly',
        type: ProductType.PAID_SUBSCRIPTION,
        platform: Platform.GOOGLE_PLAY,
        group: 'noAds'
    }]);

    store.when()
        .approved(transaction => transaction.verify())
        .verified(receipt => receipt.finish())
        .finished(transaction => console.log('Products owned: ' + transaction.products.map(p => p.id).join(',')))
        .receiptUpdated(r => updatePurchases(r))
        .productUpdated(p => updateUI(p))
        .unverified(r => {
            if (r.payload.code === CdvPurchase.ErrorCode.COMMUNICATION) {
                console.log("HTTP ERROR: " + r.payload.status);
            }
        })

    const iaptic = new CdvPurchase.Iaptic({
        appName: 'demo',
        apiKey: '00000000-0000-0000-0000-000000000000',
    });
    store.validator = iaptic.validator;
    store.applicationUsername = () => "demo-user";

    store.initialize([
        Platform.APPLE_APPSTORE,
        Platform.GOOGLE_PLAY, {
            platform: Platform.BRAINTREE,
            options: {
                applePay: {
                    companyName: 'The Company, LTD',
                },
                googlePay: {
                    countryCode: 'UK',
                    googleMerchantName: 'The Company',
                    environment: 'TEST'
                },
                threeDSecure: {
                    exemptionRequested: true
                },
            }
        }])
        .then(() => {
            console.log('Store is ready!');
        });

    store.localReceipts.forEach(x => x.verify());
store.register({
    id: '',
    platform: CdvPurchase.Platform.APPLE_APPSTORE,
});
store.initialize().then().catch();
store.when().verified(verifiedReceipt => {
})
.productUpdated(p => p.pricing?.price)

store.defaultPlatform

    function updatePurchases(receipt: CdvPurchase.Receipt) {
        receipt.transactions.forEach(transaction => {
            transaction.products.forEach(trProduct => {
                console.log(`product owned: ${trProduct.id}`);
            });
        });
    }

    function updateUI(product: CdvPurchase.Product) {
        console.log(`- title: ${product.title}`);
        const pricing = product.pricing;
        if (pricing) {
            console.log(`  price: ${pricing.price} ${pricing.currency}`);
        }
    }

    function placeOrder() {
        store.get("subscription1")?.getOffer()?.order()
            .then(result => {
                if (result) {
                    console.log("ERROR. Failed to place order. " + result.code + ": " + result.message);
                }
                else {
                    console.log("subscription1 ordered successfully");
                }
            });
            store.localTransactions[0].state
    }
    store.localTransactions.findIndex(transaction => {
        transaction.state === CdvPurchase.TransactionState.
    })

    store.verifiedReceipts[0].sourceReceipt
    instanceof CdvPurchase.GooglePlay.Receipt

    function manageSubscriptions() {
        store.manageSubscriptions(Platform.GOOGLE_PLAY);
    }

    function requestPayment() {
        store.requestPayment({
            platform: Platform.BRAINTREE,
            items: [{
                id: 'silver_check',
                title: 'Silver Check',
                pricing: { // 11 GBP
                    priceMicros: 11 * 1000000,
                    currency: 'GBP',
                }
            }],
            email: 'john@example.com',
        })
        .cancelled(() => {
            console.log('user cancelled the request');
        })
        .failed(error => {
            console.log('request failed');
        })
        .initiated(transaction => {
            console.log('transaction initiated');
        })
        .approved(transaction => {
            console.log('transaction approved');
        })
        .finished(transaction => {
            console.log('transaction finished');
        });
    }

    function appStoreRedemptionSheet() {
        const appStore = store.getAdapter(Platform.APPLE_APPSTORE) as CdvPurchase.AppleAppStore.Adapter;
        if (appStore?.ready) {
            appStore.presentCodeRedemptionSheet();
        }
    }
}
