//
// This file contains a demo usage of the API, for illustration purpose, but also to confirm that the API's types are correct.
//
/// <reference path="../ts/store.ts" />

namespace CdvPurchase
{
    namespace StoreDemo {

        function demo() {

            const store = CdvPurchase.store;

            // shortcuts
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

            // store.receipts.forEach(receipt => {
            //     receipt.transactions.forEach(transaction => {
            //         transaction.productId;
            //     });
            // });

            store.applicationUsername = () => "demo-user";
            store.validator = "https://validator.iaptic.com/";

            store.initialize([Platform.APPLE_APPSTORE, Platform.GOOGLE_PLAY])
                .then(() => {
                    console.log('Store Ready!');
                });

            function updatePurchases(receipt: CdvPurchase.Receipt) {
                receipt.transactions.forEach(transaction => {
                    transaction.products.forEach(trProduct => {
                        const product = store.get(trProduct.id);
                        if (product && product.owned) {
                        }
                    });
                });
            }

            function updateUI(product: CdvPurchase.Product) {
                console.log(`title: ${product.title}`);
                const pricing = product.pricing;
                if (pricing) {
                    console.log(`price: ${pricing.price} ${pricing.currency}`);
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

        }
    }
}


function tutorial2() {

const { store, ProductType, Platform } = CdvPurchase;
store.register([{
    type: ProductType.NON_CONSUMABLE,
    id: 'test-non-consumable',
    platform: Platform.TEST,
}]);

store.when()
    .approved(transaction => {
        unlockFeature();
        transaction.finish();
    });
store.initialize([Platform.TEST]);

function unlockFeature() {
    alert('full version unlocked');
}

function buy() {
    CdvPurchase.store.get('test-non-consumable').getOffer().order();
}
}
