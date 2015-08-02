# Contributor Guide

*(generated from source files using `make doc-contrib)`*

# iOS Implementation

The implementation of the unified API is a small layer
built on top of the legacy "PhoneGap-InAppPurchase-iOS" plugin.

This was first decided as a temporary "get-things-done" solution.
However, I found this ended-up providing a nice separation of concerns:

 - the `platforms/ios-bridge.js` file exposes an API called `storekit` that matches the
   iOS way of dealing with in-app purchases.
   - It is where the dialog with the Obj-C part happens.
   - It turns that into a javascript friendly API, close to the StoreKit API.
   - There are some specifities to it, so if eventually some users want
     to go for a platform specific implementation on iOS, they can!
 - the `platforms/ios-adapter.js` connects the iOS `storekit` API with the
   unified `store` API.
   - It makes sure products are loaded from apple servers
   - It reacts to product's changes of state, so that a product get's purchased
     when `REQUESTED`, or finished when `FINISHED` for instance.

## Reacting to product state changes

The iOS implementation monitors products changes of state to trigger
`storekit` operations.

Please refer to the [product life-cycle section](api.md#life-cycle) of the documentation
for better understanding of the job of this event handlers.
#### initialize storekit
At first refresh, initialize the storekit API. See [`storekitInit()`](#storekitInit) for details.

#### initiate a purchase

When a product enters the store.REQUESTED state, initiate a purchase with `storekit`.

#### finish a purchase
When a product enters the store.FINISHED state, `finish()` the storekit transaction.

#### persist ownership

`storekit` doesn't provide a way to know which products have been purchases.
That is why we have to handle that ourselves, by storing the `OWNED` status of a product.

Note that, until Apple provides a mean to get notified to refunds, there's no way back.
A non-consumable product, once `OWNED` always will be.

http://stackoverflow.com/questions/6429186/can-we-check-if-a-users-in-app-purchase-has-been-refunded-by-apple

#### persist downloaded status

`storekit` doesn't provide a way to know which products have been downloaded.
That is why we have to handle that ourselves, by storing the `DOWNLOADED` status of a product.

A non-consumable product, once `OWNED` can always be re-downloaded for free.


## Initialization

### <a name="storekitInit"></a> *storekitInit()*

This funciton will initialize the storekit API.

This initiates a chain reaction including [`storekitReady()`](#storekitReady) and [`storekitLoaded()`](#storekitLoaded)
that will make sure products are loaded from server, set as `VALID` or `INVALID`, and eventually restored
to their proper `OWNED` status.

It also registers the `storekit` callbacks to get notified of events from the StoreKit API:

 - [`storekitPurchasing()`](#storekitPurchasing)
 - [`storekitPurchased()`](#storekitPurchased)
 - [`storekitError()`](#storekitError)


## *storekit* events handlers

### <a name="storekitReady"></a> *storekitReady()*

Called when `storekit` has been initialized successfully.

Loads all registered products, triggers `storekitLoaded()` when done.

### <a name="storekitLoaded"></a> *storekitLoaded()*

Update the `store`'s product definitions when they have been loaded.

 1. Set the products state to `VALID` or `INVALID`
 2. Trigger the "loaded" event
 3. Set the products state to `OWNED` (if it is so)
 4. Set the store status to "ready".

Note: the execution of "ready" is deferred to make sure state
changes have been processed.
### <a name="storekitPurchasing"></a> *storekitPurchasing()*

Called by `storekit` when a purchase is in progress.

It will set the product state to `INITIATED`.

### <a name="storekitPurchased"></a> *storekitPurchased()*

Called by `storekit` when a purchase have been approved.

It will set the product state to `APPROVED` and associates the product
with the order's transaction identifier.

### <a name="storekitError"></a> *storekitError()*

Called by `storekit` when an error happens in the storekit API.

Will convert storekit errors to a [`store.Error`](api.md/#errors).


## Persistance of the *OWNED* status

#### *isOwned(productId)*
return true iff the product with given ID has been purchased and finished
during this or a previous execution of the application.
#### *setOwned(productId, value)*
store the boolean OWNED status of a given product.

## Persistance of the *DOWNLOADED* status

#### *isDownloaded(productId)*
return true if the product with given ID has been purchased and finished downloading
during this or a previous execution of the application.
#### *setDownloaded(productId, value)*
store the boolean DOWNLOADED status of a given product.

## Retry failed requests
When setup and/or load failed, the plugin will retry over and over till it can connect
to the store.

However, to be nice with the battery, it'll double the retry timeout each time.

Special case, when the device goes online, it'll trigger all retry callback in the queue.
