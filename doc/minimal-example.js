// We must wait for the "deviceready" event to fire before we can use the plugin.
document.addEventListener('deviceready', initializeStore, false);

function initializeStore() {

    // We register out products.
    CdvPurchase.store.register([{
        id:    "my-consumable",
        type:  CdvPurchase.ProductType.CONSUMABLE,
        platform: Platform.APPLE_APPSTORE
    }, {
        id:    "basic-subscription",
        type:  CdvPurchase.ProductType.PAID_SUBSCRIPTION,
        platform: Platform.GOOGLE_PLAY,
        group: "group-1"
    }, {
        id:    "premium-subscription",
        type:  CdvPurchase.ProductType.PAID_SUBSCRIPTION,
        platform: Platform.GOOGLE_PLAY,
        group: "group-1"
    }]);

    // Initialize the store, we just want Google Play and Apple AppStore enabled
    CdvPurchase.store.initialize([CdvPurchase.Platform.GOOGLE_PLAY, CdvPurchase.Platform.APPLE_APPSTORE])
    .then(function() {
        console.log("\\o/ STORE READY \\o/");
    });
}
