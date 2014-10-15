    store.registerProducts([{
        id: "com.example.app.inappid1",
        alias: "100 coins",
        type: store.CONSUMABLE
    }, {
        id: "com.example.app.inappid2",
        alias: "full version",
        type: store.NON_CONSUMABLE
    }, {
        id: "com.example.app.inappid3",
        type: store.PAID_SUBSCRIPTION
    }, {
        id: "com.example.app.inappid3",
        type: store.FREE_SUBSCRIPTION
    }]);

    // Request more information about a product
    store.ask("100 coins")
        .then(function(data) {
            console.log('Price: ' + data.price);
            console.log('Description: ' + data.description);
        })
        .error(function(err) {
            // Invalid product / no connection.
            console.log('ERROR: ' + err.code);
            console.log('ERROR: ' + err.message);
        });

    store.when("order").approved(function(order) {
        // Log all approved orders
        console.log("order " + order.alias + " approved");
    });

    store.when("consumable order").approved(function(order) {
        // Auto-finish all consumable orders
        order.finish();
    });

    store.when("order 100 coins").approved(function(order) {
        app.addCoins(100);
        order.finish();
    });

    // note: purchased and approved are aliases
    store.when("full version")
        .purchased(function(order) {
            app.unlock();
            order.finish();
        })
        .refunded(function() {
            app.lock();
        });

    store.when("free subscription").approved(function(subscription) {
    });

    store.when("subscription status").updated(function(subscription) {
        if (subscription.expired) {
        }
        else {
        }
    });

    store.when("order com.example.app.inappid3").approved(function(order) {
        // Special case for the com.example.app.inappid3 purchase
        order.finish();
    });

    store.when("order").rejected(function(order) {
    });

    store.when("order").cancelled(function(order) {
    });

    store.ready(); // true or false

    // execute when (or immediately if) the store is ready and available.
    store.ready(function() { });

    store.off(callback);

    store.refresh();

    // Call restore if supported
    if (store.restore)
        store.restore();

    store.order("com.example.app.inappid3")
        .initiated(function() {
            // order initiated, waiting approval...
        },
        .error(function(err) {
            // cannot initiate the order.
        });

    // [consumable|non consumable|free subscription|paid subscription|subscription]
    // [order]
    // [productId]
    // [approved|purchased|updated|rejected|cancelled|finished]

    // id updated
    // alias updated
    // order alias updated
    // type updated
    // id finished
    // alias finished
    // type finished
