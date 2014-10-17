# iOS Implementation

The implementation of the unified API is a small layer
built on top of the legacy "PhoneGap-InAppPurchase-iOS" plugin.

This was first decided as a temporary "get-things"done" solution.
However, I found this ended-up providing a nice separation of concerns:

 - the `ios.js` file exposes an API called `storekit` that matches the
   iOS way of dealing with in-app purchases.
   - It is where the dialog with the Obj-C part happens.
   - It turns that into a javascript friendly API, close to the StoreKit API.
   - There are some specifities to it, so if eventually some users want
     to go for a platform specific implementation on iOS, they can!
 - the `store-ios.js` connects the iOS `storekit` API with the
   unified `store` API.
   - It makes sure products are loaded from apple servers
   - It reacts to product's changes of state, so that a product get's purchased
     when `REQUESTED`, or finished when `FINISHED` for instance.

## Reacting to product state changes

The iOS implementation monitors products changes of state to trigger
`storekit` operations.

Please refer to the [product life-cycle section](api.md#life-cycle) of the documentation
for better understanding of the job of this event handlers.
#### initialization
At first refresh, initialize the storekit API. See [`storekitInit()`](#storekitInit) for details.

    store.once("refreshed", function() {
        storekitInit();
    });

#### finishing a purchase
When a product order is finished, `finish()` the storekit transaction.

    store.when("finished", function(product) {
        storekit.finish(product.transaction.id);
    });

#### persist ownership
A non-consumable product, once owned always will be.
Until Apple provides a mean to get notified to refunds... there's no way back.

    store.when("owned", function(product) {
        setOwned(product.id, true);
    });

## Functions
### <a name="storekitInit"></a> *storekitInit()*

This funciton will initialize the storekit API.

This initiates a chain reaction with `storekitReady()` and `storekitLoaded()`
that will make sure product are loaded from server and restored
to their proper *OWNED* status.
### <a name="storekitReady"></a> *storekitReady()*

Loads all registered products immediately when storekit is ready.

Triggers `storekitLoaded()` when done.
### <a name="storekitError"></a> *storekitError()*

Called when an error happens in the storekit API.

Will convert storekit errors to a [`store.Error`](api.md/#errors).
