//
// This file contains an example usage of the API, for illustration purpose.
//
// It's also used to find regressions in the API's typings. This file should compile.
//
/// <reference path="../ts/store.ts" />

function demo() {

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

    store.when()
        .approved(transaction => transaction.verify())
        .verified(receipt => receipt.finish())
        .finished(transaction => console.log('Products owned: ' + transaction.products.map(p => p.id).join(',')))
        .receiptUpdated(r => updatePurchases(r))
        .productUpdated(p => updateUI(p));

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
    }

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
