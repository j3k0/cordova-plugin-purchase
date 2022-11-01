//
// This file contains a demo usage of the API, for illustration purpose, but also to confirm that the API's types are correct.
//
/// <reference path="../ts/store.ts" />

namespace CdvPurchase
{
    namespace StoreDemo {

        function demo() {

            const store = CdvPurchase.Store.instance;

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
                .approved(transaction => store.verify(transaction))
                .verified(receipt => store.finish(receipt))
                .finished(transaction => console.log('Products owned: ' + transaction.products.map(p => p.productId).join(',')))
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
            }

            function updateUI(product: CdvPurchase.Product) {
                console.log(`title: ${product.title}`);
                const pricing = product.pricing;
                if (pricing) {
                    console.log(`price: ${pricing.price} ${pricing.currency}`);
                }
            }

            function placeOrder() {

                const offer = store.get("subscription1")?.getOffer();
                if (!offer) return;
                store.order(offer)
                    .then(result => {
                        if (result) {
                            console.log("ERROR. Failed to place order. " + result.code + ": " + result.message);
                        }
                        else {
                            console.log("subscription1 ordered successfully");
                        }
                    });
            }

        }
    }
}
