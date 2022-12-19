// We must wait for the "deviceready" event to fire before we can use the plugin.
document.addEventListener('deviceready', initializeStore, false);

function initializeStore() {

    // We register a dummy product.
    CdvPurchase.store.register({
        id:    "com.example.app.inappid1",
        alias: "100 coins",
        type:  CdvPurchase.ProductType.CONSUMABLE
    });

    // Initialize the store, we just want Google Play and Apple AppStore enabled
    CdvPurchase.store.initialize([CdvPurchase.Platform.GOOGLE_PLAY, CdvPurchase.Platform.APPLE_APPSTORE])
    .then(function() {
        console.log("\\o/ STORE READY \\o/");
    });
}

