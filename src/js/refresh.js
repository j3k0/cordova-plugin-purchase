(function() {
'use strict';

/// ## <a name="refresh"></a>*store.refresh()*

var initialRefresh = true;

store.refresh = function() {

    store.trigger("refreshed");
    if (initialRefresh) {
        initialRefresh = false;
        return;
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
        else if (p.state === store.OWNED && (p.type === store.FREE_SUBSCRIPTION || p.type === store.PAID_SUBSCRIPTION))
            p.trigger(store.APPROVED);
    }
    
    store.trigger("re-refreshed");
};


}).call(this);
