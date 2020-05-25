(function() {


/// ## <a name="refresh"></a>*store.refresh()*
///
/// After you're done registering your store's product and events handlers,
/// time to call `store.refresh()`.
///
/// This will initiate all the complex behind-the-scene work, to load product
/// data from the servers and restore whatever already have been
/// purchased by the user.
///
/// Note that you can call this method again later during the application
/// execution to re-trigger all that hard-work. It's kind of expensive in term of
/// processing, so you'd better consider it twice.
///
/// One good way of doing it is to add a "Refresh Purchases" button in your
/// applications settings. This way, if delivery of a purchase failed or
/// if a user wants to restore purchases he made from another device, he'll
/// have a way to do just that.
///
/// _NOTE:_ It is a required by the Apple AppStore that a "Refresh Purchases"
///         button be visible in the UI.
///
/// ##### return value
///
/// This method returns a promise-like object with the following functions:
///
/// - `.cancelled(fn)` - Calls `fn` when the user cancelled the refresh request.
/// - `.failed(fn)` - Calls `fn` when restoring purchases failed.
/// - `.completed(fn)` - Calls `fn` when the queue of previous purchases have been processed.
///   At this point, all previously owned products should be in the approved state.
/// - `.finished(fn)` - Calls `fn` when the restore is finished, i.e. it has failed, been cancelled,
///   or all purchased in the approved state have been finished or expired.
///
/// In the case of the restore purchases call, you will want to hide any progress bar when the
/// `finished` callback is called.
///
/// ##### example usage
///
/// ```js
///    // ...
///    // register products and events handlers here
///    // ...
///    //
///    // then and only then, call refresh.
///    store.refresh();
/// ```
///
/// ##### restore purchases example usage
///
/// Add a "Refresh Purchases" button to call the `store.refresh()` method, like:
///
/// ```html
/// <button onclick="restorePurchases()">Restore Purchases</button>
/// ```
///
/// ```js
/// function restorePurchases() {
///    showProgress();
///    store.refresh().finished(hideProgress);
/// }
/// ```
///
/// To make the restore purchases work as expected, please make sure that
/// the "approved" event listener had be registered properly
/// and, in the callback, `product.finish()` is called after handling.
///

var initialRefresh = true;

function createPromise() {
    var events = {};

    // User callbacks for each type of events
    var callbacks = {
        "refresh-failed": [],
        "refresh-cancelled": [],
        "refresh-completed": [],
        "refresh-finished": [],
    };

    // Setup our own event handlers
    store.once("", "refresh-failed", failed);
    store.once("", "refresh-cancelled", cancelled);
    store.once("", "refresh-completed", completed);
    store.once("", "refresh-finished", finished);
    store.error(error);

    // Return the promise object
    return {
        cancelled: genPromise("refresh-cancelled"),
        failed: genPromise("refresh-failed"),
        completed: genPromise("refresh-completed"),
        finished: genPromise("refresh-finished"),
    };

    // A promise function calls the callback or registers it
    function genPromise(eventName) {
        return function(cb) {
            if (events[eventName])
                cb();
            else
                callbacks[eventName].push(cb);
            return this;
        };
    }

    // Call all user callbacks for a given event
    function callback(eventName) {
        callbacks[eventName].forEach(function(cb) { cb(); });
        callbacks[eventName] = [];
    }

    // Delete user callbacks for a given event
    // Trigger the refresh-finished event when no more products are in the
    // approved state.
    function checkFinished() {
        if (events["refresh-finished"]) return;
        function isApproved(p) { return p.state === store.APPROVED; }
        if (store.products.filter(isApproved).length === 0) {
            // done processing
            store.off(checkFinished);
            finish();
        }
    }

    // Remove base events handlers
    function off() {
        store.off(cancelled);
        store.off(completed);
        store.off(failed);
        store.off(checkFinished);
        store.off(error);
    }

    // Fire a base event
    function fire(eventName) {
        if (events[eventName]) return false;
        events[eventName] = true;
        callback(eventName);
        return true;
    }

    // Fire the refresh-finished event
    function finish() {
        off();
        if (events["refresh-finished"]) return;
        events["refresh-finished"] = true;
        // setTimeout guarantees calling order
        setTimeout(function() {
            store.trigger("refresh-finished");
        }, 100);
    }

    // refresh-cancelled called when the user cancelled the password popup
    function cancelled() {
        fire("refresh-cancelled");
        finish();
    }

    // refresh-cancelled called when restore purchases couldn't complete
    // (can't connect to store or user not allowed to make purchases)
    function failed() {
        fire("refresh-failed");
        finish();
    }

    function error() {
        fire("refresh-failed");
        finish();
    }

    // refresh-completed is called when all owned products have been
    // sent to the approved state.
    function completed() {
        if (fire("refresh-completed")) {
            store.when().updated(checkFinished);
            checkFinished(); // make sure this is called at least once
        }
    }

    function finished() {
        callback("refresh-finished");
    }

}

store.refresh = function() {

    var promise = createPromise();

    store.trigger("refreshed");
    if (initialRefresh) {
        initialRefresh = false;
        return promise;
    }

    store.log.debug("refresh -> checking products state (" + store.products.length + " products)");
    for (var i = 0; i < store.products.length; ++i) {
        var p = store.products[i];
        store.log.debug("refresh -> product id " + p.id + " (" + p.alias + ")");
        store.log.debug("           in state '" + p.state + "'");

        // resend the "approved" event to all approved purchases.
        // give user a chance to try delivering the content again and
        // finish the purchase.
        if (p.state === store.APPROVED)
            p.trigger(store.APPROVED);

        // also send back subscription to approved so their expiry date gets validated again
        // BEWARE. If user is offline, he won't be able to access the content
        // because validation will fail with a connection timeout.
        else if (p.state === store.OWNED && (p.type === store.FREE_SUBSCRIPTION || p.type === store.PAID_SUBSCRIPTION))
            p.set("state", store.APPROVED);
    }

    store.trigger("re-refreshed");
    return promise;
};

})();
