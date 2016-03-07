# API Documentation

*(generated from source files using `make doc-api)`*

### Philosophy

The `store` API is mostly events based. As a user of this plugin,
you will have to register listeners to changes happening to the products
you register.

The core of the listening mechanism is the [`when()`](#when) method. It allows you to
be notified of changes to one or a set of products using a [`query`](#queries) mechanism:
```js
    store.when("product").updated(refreshScreen);
    store.when("full version").owned(unlockApp);
    store.when("subscription").approved(serverCheck);
    store.when("downloadable content").downloaded(showContent);
    etc.
```

The `updated` event is fired whenever one of the fields of a product is
changed (its `owned` status for instance).

This event provides a generic way to track the statuses of your purchases,
to unlock features when needed and to refresh your views accordingly.

### Registering products

The store needs to know the type and identifiers of your products before you
can use them in your code.

Use [`store.register()`](#register) before your first call to
[`store.refresh()`](#refresh).

Once registered, you can use [`store.get()`](#get) to retrieve
the [`product object`](#product) from the store.

```js
    store.register({
      id: "cc.fovea.purchase.consumable1",
      alias: "100 coins",
      type: store.CONSUMABLE
    });
    ...
    var p = store.get("100 coins");
    // or
    var p = store.get("cc.fovea.purchase.consumable1");
```

The product `id` and `type` have to match products defined in your
Apple and Google developer consoles.

Learn how to do that in [HOWTO: Create New Products](https://github.com/j3k0/cordova-plugin-purchase/wiki/HOWTO#create-new-products).

### Displaying products

Right after you registered your products, nothing much is known about them
except their `id`, `type` and an optional `alias`.

When you perform the initial [`refresh()`](#refresh) call, the store's server will
be contacted to load informations about the registered products: human
readable `title` and `description`, `price`, etc.

This isn't an optional step as some despotic store owners (like Apple) require you
to display information about a product as retrieved from their server: no
hard-coding of price and title allowed! This is also convenient for you
as you can change the price of your items knowing that it'll be reflected instantly
on your clients' devices.

However, the information may not be available when the first view that needs
them appears on screen. For you, the best option is to have your view monitor
changes made to the product.

#### monitor changes

Let's demonstrate this with an example:

```js
    // method called when the screen showing your purchase is made visible
    function show() {
        render();
        store.when("cc.fovea.test1").updated(render);
    }

    function render() {

        // Get the product from the pool.
        var product = store.get("cc.fovea.test1");

        if (!product) {
            $el.html("");
        }
        else if (product.state === store.REGISTERED) {
            $el.html("<div class=\"loading\" />");
        }
        else if (product.state === store.INVALID) {
            $el.html("");
        }
        else {
            // Good! Product loaded and valid.
            $el.html(
                  "<div class=\"title\">"       + product.title       + "</div>"
                + "<div class=\"description\">" + product.description + "</div>"
                + "<div class=\"price\">"       + product.price       + "</div>"
            );

            // Is this product owned? Give him a special class.
            if (product.owned)
                $el.addClass("owned");
            else
                $el.removeClass("owned");

            // Is an order for this product in progress? Can't be ordered right now?
            if (product.canPurchase)
                $el.addClass("can-purchase");
            else
                $el.removeClass("can-purchase");
        }
    }

    // method called when the view is hidden
    function hide() {
        // stop monitoring the product
        store.off(render);
    }
```

In this example, `render` redraw the purchase element whatever
happens to the product. When the view is hidden, we stop listening to changes
(`store.off(render)`).

### <a name="purchasing"></a> Purchasing

#### initiate a purchase

Purchases are initiated using the [`store.order()`](#order) method.

The store will manage the internal purchase flow that'll end:

 - with an `approved` [event](#events). The product enters the `APPROVED` state.
 - with a `cancelled` [event](#events). The product gets back to the `VALID` state.
 - with an `error` [event](#events). The product gets back to the `VALID` state.

See [product life-cycle](#life-cycle) for details about product states.

#### finish a purchase

Once the transaction is approved, the product still isn't owned: the store needs
confirmation that the purchase was delivered before closing the transaction.

To confirm delivery, you'll use the [`product.finish()`](#finish) method.

#### example usage

During initialization:
```js
store.when("extra chapter").approved(function(product) {
    // download the feature
    app.downloadExtraChapter().then(function() {
        product.finish();
    });
});
```

When the purchase button is clicked:
```js
store.order("full version");
```

#### un-finished purchases

If your app wasn't able to deliver the content, `product.finish()` won't be called.

Don't worry: the `approved` event will be re-triggered the next time you
call [`store.refresh()`](#refresh), which can very well be the next time
the application starts. Pending transactions are persistant.

#### simple case

In the most simple case, where:

 - delivery of purchases is only local ;
 - you don't want to implement receipt validation ;

you may just want to finish all purchases automatically. You can do it this way:
```js
store.when("product").approved(function(p) {
    p.finish();
});
```

NOTE: the "product" query will match any purchases (see [here](#queries) to learn more details about queries).

### Receipt validation

Some unthoughtful users will try to use fake "purchases" to access features
they should normally pay for. If that's a concern, you should implement
receipt validation, ideally server side validation.

When a purchase has been approved by the store, it's enriched with
[transaction](#transactions) information (`product.transaction` attribute).

To verfify a purchase you'll have to do three things:

 - configure the [validator](#validator).
 - call [`product.verify()`](#verify) from the `approved` event,
   before finishing the transaction.
 - finish the transaction when transaction is `verified`.

#### example using a validation URL

```js
store.validator = "http://192.168.0.7:1980/check-purchase";

store.when("my stuff").approved(function(product) {
    product.verify();
});

store.when("my stuff").verified(function(product) {
    product.finish();
});
```

For an example using a validation callback instead, see the documentation of [the validator method](#validator).

### Subscriptions

For subscription, you MUST implement remote [receipt validation](#receipt-validation).

If the validator returns a `store.PURCHASE_EXPIRED` error code, the subscription will
automatically loose its `owned` status.

Typically, you'll enable and disable access to your content this way.
```js
store.when("cc.fovea.subcription").updated(function(product) {
    if (product.owned)
        app.subscriberMode();
    else
        app.guestMode();
});
```

# <a name="store"></a>*store* object ##

`store` is the global object exported by the purchase plugin.

As with any other plugin, this object shouldn't be used before
the "deviceready" event is fired. Check cordova's documentation
for more details if needed.

Find below all public attributes and methods you can use.

## <a name="verbosity"></a>*store.verbosity*

The `verbosity` property defines how much you want `store.js` to write on the console. Set to:

 - `store.QUIET` or `0` to disable all logging (default)
 - `store.ERROR` or `1` to show only error messages
 - `store.WARNING` or `2` to show warnings and errors
 - `store.INFO` or `3` to also show information messages
 - `store.DEBUG` or `4` to enable internal debugging messages.

See the [logging levels](#logging-levels) constants.
## <a name="sandbox"></a>*store.sandbox*

The `sandbox` property defines if you want to invoke the platform purchase sandbox

- Windows will use the IAP simulator if true (see Windows docs)
- Android: NOT IN USE
- iOS: NOT IN USE

## Constants


### product types

    store.FREE_SUBSCRIPTION         = "free subscription";
    store.PAID_SUBSCRIPTION         = "paid subscription";
    store.NON_RENEWING_SUBSCRIPTION = "non renewing subscription";
    store.CONSUMABLE                = "consumable";
    store.NON_CONSUMABLE            = "non consumable";

### error codes

    store.ERR_SETUP               = ERROR_CODES_BASE + 1; //
    store.ERR_LOAD                = ERROR_CODES_BASE + 2; //
    store.ERR_PURCHASE            = ERROR_CODES_BASE + 3; //
    store.ERR_LOAD_RECEIPTS       = ERROR_CODES_BASE + 4;
    store.ERR_CLIENT_INVALID      = ERROR_CODES_BASE + 5;
    store.ERR_PAYMENT_CANCELLED   = ERROR_CODES_BASE + 6; // Purchase has been cancelled by user.
    store.ERR_PAYMENT_INVALID     = ERROR_CODES_BASE + 7; // Something suspicious about a purchase.
    store.ERR_PAYMENT_NOT_ALLOWED = ERROR_CODES_BASE + 8;
    store.ERR_UNKNOWN             = ERROR_CODES_BASE + 10; //
    store.ERR_REFRESH_RECEIPTS    = ERROR_CODES_BASE + 11;
    store.ERR_INVALID_PRODUCT_ID  = ERROR_CODES_BASE + 12; //
    store.ERR_FINISH              = ERROR_CODES_BASE + 13;
    store.ERR_COMMUNICATION       = ERROR_CODES_BASE + 14; // Error while communicating with the server.
    store.ERR_SUBSCRIPTIONS_NOT_AVAILABLE = ERROR_CODES_BASE + 15; // Subscriptions are not available.
    store.ERR_MISSING_TOKEN       = ERROR_CODES_BASE + 16; // Purchase information is missing token.
    store.ERR_VERIFICATION_FAILED = ERROR_CODES_BASE + 17; // Verification of store data failed.
    store.ERR_BAD_RESPONSE        = ERROR_CODES_BASE + 18; // Verification of store data failed.
    store.ERR_REFRESH             = ERROR_CODES_BASE + 19; // Failed to refresh the store.
    store.ERR_PAYMENT_EXPIRED     = ERROR_CODES_BASE + 20;
    store.ERR_DOWNLOAD            = ERROR_CODES_BASE + 21;

### product states

    store.REGISTERED = 'registered';
    store.INVALID    = 'invalid';
    store.VALID      = 'valid';
    store.REQUESTED  = 'requested';
    store.INITIATED  = 'initiated';
    store.APPROVED   = 'approved';
    store.FINISHED   = 'finished';
    store.OWNED      = 'owned';
    store.DOWNLOADING = 'downloading';
    store.DOWNLOADED = 'downloaded';

### logging levels

    store.QUIET   = 0;
    store.ERROR   = 1;
    store.WARNING = 2;
    store.INFO    = 3;
    store.DEBUG   = 4;

### validation error codes

    store.INVALID_PAYLOAD   = 6778001;
    store.CONNECTION_FAILED = 6778002;
    store.PURCHASE_EXPIRED  = 6778003;
## <a name="product"></a>*store.Product* object ##

Most events methods give you access to a `product` object.

Products object have the following fields and methods.

### *store.Product* public attributes

 - `product.id` - Identifier of the product on the store
 - `product.alias` - Alias that can be used for more explicit [queries](#queries)
 - `product.type` - Family of product, should be one of the defined [product types](#product-types).
 - `product.state` - Current state the product is in (see [life-cycle](#life-cycle) below). Should be one of the defined [product states](#product-states)
 - `product.title` - Localized name or short description
 - `product.description` - Localized longer description
 - `product.price` - Localized price, with currency symbol
 - `product.currency` - Currency code (optionaly)
 - `product.loaded` - Product has been loaded from server, however it can still be either `valid` or not
 - `product.valid` - Product has been loaded and is a valid product
 - `product.canPurchase` - Product is in a state where it can be purchased
 - `product.owned` - Product is owned
 - `product.downloading` - Product is downloading non-consumable content
 - `product.downloaded` - Non-consumable content has been successfully downloaded for this product
 - `product.transaction` - Latest transaction data for this product (see [transactions](#transactions)).

### *store.Product* public methods

#### <a name="finish"></a>`product.finish()` ##

Call `product.finish()` to confirm to the store that an approved order has been delivered.
This will change the product state from `APPROVED` to `FINISHED` (see [life-cycle](#life-cycle)).

As long as you keep the product in state `APPROVED`:

 - the money may not be in your account (i.e. user isn't charged)
 - you will receive the `approved` event each time the application starts,
   where you should try again to finish the pending transaction.

##### example use
```js
store.when("product.id").approved(function(product){
    // synchronous
    app.unlockFeature();
    product.finish();
});
```

```js
store.when("product.id").approved(function(product){
    // asynchronous
    app.downloadFeature(function() {
        product.finish();
    });
});
```
#### <a name="verify"></a>`product.verify()` ##

Initiate purchase validation as defined by the [`store.validator`](#validator).

##### return value
A Promise with the following methods:

 - `done(function(product){})`
   - called whether verification failed or succeeded.
 - `expired(function(product){})`
   - called if the purchase expired.
 - `success(function(product, purchaseData){})`
   - called if the purchase is valid and verified.
   - `purchaseData` is the device dependent transaction details
     returned by the validator, which you can most probably ignore.
 - `error(function(err){})`
   - validation failed, either because of expiry or communication
     failure.
   - `err` is a [store.Error object](#errors), with a code expected to be
     `store.ERR_PAYMENT_EXPIRED` or `store.ERR_VERIFICATION_FAILED`.


### life-cycle

A product will change state during the application execution.

Find below a diagram of the different states a product can pass by.

    REGISTERED +--> INVALID
               |
               +--> VALID +--> REQUESTED +--> INITIATED +-+
                                                          |
                    ^      +------------------------------+
                    |      |
                    |      |             +--> DOWNLOADING +--> DOWNLOADED +
                    |      |             |                                |
                    |      +--> APPROVED +--------------------------------+--> FINISHED +--> OWNED
                    |                                                             |
                    +-------------------------------------------------------------+

#### states definitions

 - `REGISTERED`: right after being declared to the store using [`store.register()`](#register)
 - `INVALID`: the server didn't recognize this product, it cannot be used.
 - `VALID`: the server sent extra information about the product (`title`, `price` and such).
 - `REQUESTED`: order (purchase) requested by the user
 - `INITIATED`: order transmitted to the server
 - `APPROVED`: purchase approved by server
 - `FINISHED`: purchase delivered by the app (see [Finish a Purchase](#finish-a-purchase))
 - `OWNED`: purchase is owned (only for non-consumable and subscriptions)
 - `DOWNLOADING` purchased content is downloading (only for non-consumable)
 - `DOWNLOADED` purchased content is downloaded (only for non-consumable)

#### Notes

 - When finished, a consumable product will get back to the `VALID` state, while other will enter the `OWNED` state.
 - Any error in the purchase process will bring a product back to the `VALID` state.
 - During application startup, products may go instantly from `REGISTERED` to `APPROVED` or `OWNED`, for example if they are purchased non-consumables or non-expired subscriptions.
 - Non-Renewing Subscriptions are iOS products only. Please see the [iOS Non Renewing Subscriptions documentation](https://github.com/j3k0/cordova-plugin-purchase/blob/master/doc/ios.md#non-renewing) for a detailed explanation.

#### state changes

Each time the product changes state, appropriate events is triggered.

Learn more about events [here](#events) and about listening to events [here](#when).


## <a name="errors"></a>*store.Error* object

All error callbacks takes an `error` object as parameter.

Errors have the following fields:

 - `error.code` - An integer [error code](#error-codes). See the [error codes](#error-codes) section for more details.
 - `error.message` - Human readable message string, useful for debugging.

## <a name="error"></a>*store.error(callback)*

Register an error handler.

`callback` is a function taking an [error](#errors) as argument.

### example use:

    store.error(function(e){
        console.log("ERROR " + e.code + ": " + e.message);
    });

### alternative usage

 - `store.error(code, callback)`
   - only call the callback for errors with the given error code.
   - **example**: `store.error(store.ERR_SETUP, function() { ... });`

### unregister the error callback
To unregister the callback, you will use [`store.off()`](#off):
```js
var handler = store.error(function() { ... } );
...
store.off(handler);
```

## <a name="register"></a>*store.register(product)*
Add (or register) a product into the store.

A product can't be used unless registered first!

Product is an object with fields :

 - `id`
 - `type`
 - `alias` (optional)

See documentation for the [product](#product) object for more information.

##### example usage

```js
store.register({
    id: "cc.fovea.inapp1",
    alias: "full version",
    type: store.NON_CONSUMABLE
});
```


### Reserved keywords
Some reserved keywords can't be used in the product `id` and `alias`:

 - `product`
 - `order`
 - `registered`
 - `valid`
 - `invalid`
 - `requested`
 - `initiated`
 - `approved`
 - `owned`
 - `finished`
 - `downloading`
 - `downloaded`
 - `refreshed`

## <a name="get"></a>*store.get(id)*
Retrieve a [product](#product) from its `id` or `alias`.

##### example usage
```js
    var product = store.get("cc.fovea.product1");
```

## <a name="when"></a>*store.when(query)*

Register a callback for a product-related event.


### return value

Return a Promise with methods to register callbacks for
product events defined below.

#### events

 - `loaded(product)`
   - Called when [product](#product) data is loaded from the store.
 - `updated(product)`
   - Called when any change occured to a product.
 - `error(err)`
   - Called when an [order](#order) failed.
   - The `err` parameter is an [error object](#errors)
 - `approved(product)`
   - Called when a product [order](#order) is approved.
 - `owned(product)`
   - Called when a non-consumable product or subscription is owned.
 - `cancelled(product)`
   - Called when a product [order](#order) is cancelled by the user.
 - `refunded(product)`
   - Called when an order is refunded by the user.
 - Actually, all other product states have their promise
   - `registered`, `valid`, `invalid`, `requested`,
     `initiated` and `finished`
 - `verified(product)`
   - Called when receipt validation successful
 - `unverified(product)`
   - Called when receipt verification failed
 - `expired(product)`
   - Called when validation find a subscription to be expired
 - `downloading(product, progress, time_remaining)`
   - Called when content download is started
 - `downloaded(product)`
   - Called when content download has successfully completed

### alternative usage

 - `store.when(query, action, callback)`
   - Register a callback using its action name. Beware that this is more
     error prone, as there are not gonna be any error in case of typos.

```js
store.when("cc.fovea.inapp1", "approved", function(product) { ... });
```

### unregister a callback

To unregister a callback, use [`store.off()`](#off).


## queries

The [`when`](#when) and [`once`](#once) methods take a `query` parameter.
Those queries allow to select part of the products (or orders) registered
into the store and get notified of events related to those products.

No filters:

 - `"product"` or `"order"` - for all products.

Filter by product types:

 - `"consumable"` - all consumable products.
 - `"non consumable"` - all non consumable products.
 - `"subscription"` - all subscriptions.
 - `"free subscription"` - all free subscriptions.
 - `"paid subscription"` - all paid subscriptions.

Filter by product state:

 - `"valid"` - all products in the VALID state.
 - `"invalid"` - all products in the INVALID state.
 - `"owned"` - all products in the INVALID state.
 - etc. (see [here](#product-states) for all product states).

Filter individual products:

 - `"PRODUCT_ID"` - product with the given product id (replace by your own product id)
 - `"ALIAS"` - product with the given alias

Notice that you can add the "product" and "order" keywords anywhere in your query,
it won't change anything but may seem nicer to read.

#### example

 - `"consumable order"` - all consumable products
 - `"full version"` - the `alias` of a registered [`product`](#product)
 - `"order cc.fovea.inapp1"` - the `id` of a registered [`product`](#product)
   - equivalent to just `"cc.fovea.inapp1"`
 - `"invalid product"` - an invalid product
   - equivalent to just `"invalid"`

## <a name="once"></a>*store.once(query)*

Identical to [`store.when`](#when), but the callback will be called only once.
After being called, the callback will be unregistered.

### alternative usage

 - `store.once(query, action, callback)`
   - Same remarks as `store.when(query, action, callback)`


## <a name="order"></a>*store.order(product)*

Initiate the purchase of a product.

The `product` argument can be either:

 - the `store.Product` object
 - the product `id`
 - the product `alias`

See the ["Purchasing section"](#purchasing) to learn more about
the purchase process.

### return value

`store.order()` returns a Promise with the following methods:

 - `then` - called when the order was successfully initiated
 - `error` - called if the order couldn't be initiated


As usual, you can unregister the callbacks by using [`store.off()`](#off).

## <a name="ready"></a>*store.ready(callback)*
Register the `callback` to be called when the store is ready to be used.

If the store is already ready, `callback` is executed immediately.

`store.ready()` without arguments will return the `ready` status.

### alternate usage (internal)

`store.ready(true)` will set the `ready` status to true,
and call the registered callbacks.
## <a name="off"></a>*store.off(callback)*
Unregister a callback. Works for callbacks registered with `ready`, `when`, `once` and `error`.

Example use:

```js
    var fun = function(product) {
        // Product loaded while the store screen is visible.
        // Refresh some stuff.
    };

    store.when("product").loaded(fun);
    ...
    [later]
    ...
    store.off(fun);
```

## <a name="validator"></a> *store.validator*
Set this attribute to either:

 - the URL of your purchase validation service
    - Fovea's [reeceipt](http://reeceipt.fovea.cc) or your own service.
 - a custom validation callback method

#### example usage

```js
store.validator = "http://store.fovea.cc:1980/check-purchase";
```

```js
store.validator = function(product, callback) {

    callback(true, { ... transaction details ... }); // success!

    // OR
    callback(false, {
        error: {
            code: store.PURCHASE_EXPIRED,
            message: "XYZ"
        }
    });

    // OR
    callback(false, "Impossible to proceed with validation");

    // Here, you will typically want to contact your own webservice
    // where you check transaction receipts with either Apple or
    // Google servers.
});
```
Validation error codes are [documented here](#validation-error-codes).

## transactions

A purchased product will contain transaction information that can be
sent to a remote server for validation. This information is stored
in the `product.transaction` field. It has the following format:

- `type`: "ios-appstore" or "android-playstore"
- store specific data

Refer to [this documentation for iOS](https://developer.apple.com/library/ios/releasenotes/General/ValidateAppStoreReceipt/Chapters/ReceiptFields.html#//apple_ref/doc/uid/TP40010573-CH106-SW1).

Start [here for Android](https://developer.android.com/google/play/billing/billing_integrate.html#billing-security).

Another option is to use [Fovea's reeceipt validation service](http://reeceipt.fovea.cc/) that implements all the best practices to secure your transactions.

## <a name="refresh"></a>*store.refresh()*

After you're done registering your store's product and events handlers,
time to call `store.refresh()`.

This will initiate all the complex behind-the-scene work, to load product
data from the servers and restore whatever already have been
purchased by the user.

Note that you can call this method again later during the application
execution to re-trigger all that hard-work. It's kind of expensive in term of
processing, so you'd better consider it twice.

One good way of doing it is to add a "Refresh Purchases" button in your
applications settings. This way, if delivery of a purchase failed or
if a user wants to restore purchases he made from another device, he'll
have a way to do just that.

##### example usage

```js
   // ...
   // register products and events handlers here
   // ...
   //
   // then and only then, call refresh.
   store.refresh();
```

##### restore purchases example usage

Add a "Refresh Purchases" button to call the `store.refresh()` method, like:

`<button onclick="store.refresh()">Restore Purchases</button>`

To make the restore purchases work as expected, please make sure that
the "approved" event listener had be registered properly,
and in the callback `product.finish()` should be called.

## *store.log* object
### `store.log.error(message)`
Logs an error message, only if `store.verbosity` >= store.ERROR
### `store.log.warn(message)`
Logs a warning message, only if `store.verbosity` >= store.WARNING
### `store.log.info(message)`
Logs an info message, only if `store.verbosity` >= store.INFO
### `store.log.debug(message)`
Logs a debug message, only if `store.verbosity` >= store.DEBUG

# internal APIs
USE AT YOUR OWN RISKS
## *store.products* array ##
Array of all registered products

#### example

    store.products[0]
### *store.products.push(product)*
Acts like the Array `push` method, but also adds
the product to the [byId](#byId) and [byAlias](#byAlias) objects.
### <a name="byId"></a>*store.products.byId* dictionary
Registered products indexed by their ID

#### example

    store.products.byId["cc.fovea.inapp1"]
### <a name="byAlias"></a>*store.products.byAlias* dictionary
Registered products indexed by their alias

#### example

    store.products.byAlias["full version"]```
### aliases to `store` methods, added for conveniance.

## *store._queries* object
The `queries` object handles the callbacks registered for any given couple
of [query](#queries) and action.

Internally, the magic is found within the [`triggerWhenProduct`](#triggerWhenProduct)
method, which generates for a given product the list of all possible
queries that describe the product.

Queries are generated using the id, alias, type or validity of the product.

### *store._queries.uniqueQuery(string)*
Transform a human readable query string
into a unique string by filtering out reserved keywords:

 - `order`
 - `product`

### *store._queries.callbacks* object
Callbacks registered organized by query strings
#### *store._queries.callbacks.byQuery* dictionary
Dictionary of:

 - *key*: a string equals to `query + " " + action`
 - *value*: array of callbacks

Each callback have the following attributes:

 - `cb`: callback *function*
 - `once`: *true* iff the callback should be called only once, then removed from the dictionary.

#### *store._queries.callbacks.add(query, action, callback, once)*
Simplify the query with `uniqueQuery()`, then add it to the dictionary.

`action` is concatenated to the `query` string to create the key.
### *store._queries.triggerAction(action, args)*
Trigger the callbacks registered when a given `action` (string)
happens, unrelated to a product.

`args` are passed as arguments to the registered callbacks.

 - Call the callbacks
 - Remove callbacks that needed to be called only once

### *store._queries.triggerWhenProduct(product, action, args)*
Trigger the callbacks registered when a given `action` (string)
happens to a given [`product`](#product).

`args` are passed as arguments to the registered callbacks.

The method generates all possible queries for the given `product` and `action`.

 - product.id + " " + action
 - product.alias + " " + action
 - product.type + " " + action
 - "subscription " + action (if type is a subscription)
 - "valid " + action (if product is valid)
 - "invalid " + action (if product is invalid)
 - action

Then, for each query:

 - Call the callbacks
 - Remove callbacks that needed to be called only once

**Note**: All events also trigger the `updated` event

## <a name="trigger"></a>*store.trigger(product, action, args)*

For internal use, trigger an event so listeners are notified.

It's a conveniance method, that adds flexibility to [`_queries.triggerWhenProduct`](#triggerWhenProduct) by:

 - allowing to trigger events unrelated to products
   - by doing `store.trigger("refreshed")` for example.
 - allowing the `product` argument to be either:
   - a [product](#product)
   - a product `id`
   - a product `alias`
 - converting the `args` argument to an array if it's not one
 - adding the product itself as an argument to the event if none were passed


## *store.error.callbacks* array

Array of user registered error callbacks.

### *store.error.callbacks.trigger(error)*

Execute all error callbacks with the given `error` argument.

### *store.error.callbacks.reset()*

Remove all error callbacks.
## store.utils

### store.utils.logError(context, error)
Add warning logs on a console describing an exceptions.

This method is mostly used when execting user registered callbacks.

* `context` is a string describing why the method was called
* `error` is a javascript Error object thrown by a exception

### store.utils.callExternal(context, callback, ...)
Calls an user-registered callback.
Won't throw exceptions, only logs errors.

* `name` is a short string describing the callback
* `callback` is the callback to call (won't fail if undefined)

#### example usage
```js
store.utils.callExternal("ajax.error", options.error, 404, "Not found");
```

### store.utils.ajax(options)
Simplified version of jQuery's ajax method based on XMLHttpRequest.
Only supports JSON requests.

Options:

* `url`:
* `method`: HTTP method to use (GET, POST, ...)
* `success`: callback(data)
* `error`: callback(statusCode, statusText)
* `data`: body of your request

