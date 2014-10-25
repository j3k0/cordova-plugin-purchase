# API Documentation

*(generated from source files using `make doc-api)`*

### Philosophy

The `store` API is mostly events based. As a user of this plugin,
you will have to register listeners to changes happening to the product
you defined.

The core of the listening mechanism is the `when` method. It allows you to
be notified of changes to one or a group of products using a query mechanism:

    store.when("product").updated(refreshScreen);
    store.when("full version").purchased(unlockApp);
    store.when("subscription").updated(serverCheck);
    etc.

The `updated` event is fired whenever one of the fields of a product is
changed (its `owned` status for instance).
This event provides a generic way to track the statuses of your purchases,
to unlock features when needed and to refresh your views accordingly.

### Defining products

The store needs to know the type and identifiers of your products before you
can use them in your code.

Use [`store.registerProducts()`](#registerProducts) before your first call to
[`store.refresh()`](#refresh).

### Displaying products

Right after you registered your products, nothing much is known about them
except their `id`, `type` and an optional `alias`.

When you perform the initial [refresh](#refresh), the store's server will
be contacted to retrieve informations about the registered products: human
readable `title` and `description`, `price`, `currency`, etc.

This isn't an optional step as some despotic store owners (like Apple) require you
to display information about a product as retrieved from their server: no 
hard-coding of price and title allowed! This is also convenient for you
as you can change the price of your items knowing that it'll be reflected instantly
on your clients' devices.

However, the information may not be available when the first view that needs
them appears on screen. For you, the best option is to have your view monitor
changes made to the product.

#### monitor your products

Let's demonstrate this with an example:

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
            if (product.state === store.OWNED)
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
    
    function hide() {
        // stop monitoring the product
        store.off(render);
    }

In this example, `render` assumes nothing and redraw the whole view whatever
happens to the product. When the view is hidden, we stop listening to changes
(`store.off(render)`).


# <a name="store"></a>*store* object ##

`store` is the global object exported by the purchase plugin.

As with any other plugin, this object shouldn't be used before
the "deviceready" event is fired. Check cordova's documentation
for more details if needed.

## <a name="verbosity"></a>*store.verbosity*

The `verbosity` property defines how much you want `store.js` to write on the console. Set to:

 - `store.QUIET` or `0` to disable all logging (default)
 - `store.ERROR` or `1` to show only error messages
 - `store.WARNING` or `2` to show warnings and errors
 - `store.INFO` or `3` to also show information messages
 - `store.DEBUG` or `4` to enable internal debugging messages.

See [logging levels](#logging levels) for all possible values.

## constants


### product types

    store.FREE_SUBSCRIPTION = "free subscription";
    store.PAID_SUBSCRIPTION = "paid subscription";
    store.CONSUMABLE        = "consumable";
    store.NON_CONSUMABLE    = "non consumable";

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

### product states

    store.REGISTERED = 'registered';
    store.INVALID    = 'invalid';
    store.VALID      = 'valid';
    store.REQUESTED  = 'requested';
    store.INITIATED  = 'initiated';
    store.APPROVED   = 'approved';
    store.FINISHED   = 'finished';
    store.OWNED      = 'owned';

### logging levels

    store.QUIET   = 0;
    store.ERROR   = 1;
    store.WARNING = 2;
    store.INFO    = 3;
    store.DEBUG   = 4;
## <a name="product"></a>*store.Product* object ##

Most events methods give you access to a `product` object.

Products object have the following fields and methods.

### public fields

 - `product.id` - Identifier of the product on the store
 - `product.alias` - Alias that can be used for more explicit [queries](#queries)
 - `product.type` - Family of product, should be one of the defined [product types](#product-types).
 - `product.price` - Non-localized price, without the currency
 - `product.currency` - Currency code
 - `product.title` - Non-localized name or short description
 - `product.description` - Non-localized longer description
 - `product.localizedTitle` - Localized name or short description ready for display
 - `product.localizedDescription` - Localized longer description ready for display
 - `product.localizedPrice` - Localized price (with currency) ready for display
 - `product.loaded` - Product has been loaded from server, however it can still be either `valid` or not
 - `product.valid` - Product has been loaded and is a valid product
 - `product.canPurchase` - Product is in a state where it can be purchased
 - `product.owned` - Product is owned
 - `product.state` - Current state the product is in (see [life-cycle](#life-cycle) below). Should be one of the defined [product states](#product-states)

### public methods

#### <a name="finishOrder"></a>`finish()` ##

Call to confirm to the store that an approved order has been delivered.
This will change the product state from `APPROVED` to `FINISHED` (see [life-cycle](#life-cycle)).

As long as you keep the product in its APPROVED:

 - the money will not be in your account (i.e. user isn't charged)
 - you will receive the `approved` event each time the application starts,
   to try finishing the pending transaction
 - on iOS, the user will be prompted for its password at starts

##### example use
```js
store.when("product.id").approved(function(order){
    app.unlockFeature();
    order.finish();
});
```

### life-cycle

A product will change state during the application execution.

Find below a diagram of the different states a product can pass by.

    REGISTERED +--> INVALID
               |
               +--> VALID +--> REQUESTED +--> INITIATED +-+
                                                          |
                    ^      +------------------------------+
                    |      |
                    |      +--> APPROVED +--> FINISHED +--> OWNED
                    |                                  |
                    +----------------------------------+

#### states definitions

 - `REGISTERED`: right after being declared to the store using [`store.registerProducts()`](#registerProducts)
 - `INVALID`: the server didn't recognize this product, it cannot be used.
 - `VALID`: the server sent extra information about the product (`title`, `price` and such).
 - `REQUESTED`: order (purchase) requested by the user
 - `INITIATED`: order transmitted to the server
 - `APPROVED`: purchase approved by server
 - `FINISHED`: purchase delivered by the app
 - `OWNED`: purchase is owned (only for non-consumable and subscriptions)

#### Notes

 - When finished, a consumable product will get back to the `VALID` state.
 - Any error in the purchase process will bring the product back to the `VALID` state.
 - During application startup, product will go instantly from `REGISTERED` to `OWNED` if it's a purchased non-consumable or non-expired subscription.

#### state changes

Each time the product changes state, an event is triggered.


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
## <a name="get"></a>*store.get(id)*
Retrieve a [product](#product) from its `id` or `alias`.

Example use:

    var product = store.get("cc.fovea.product1");

## <a name="when"></a>*store.when(query)*


### return value

Return promise with the following methods:

 - `.loaded(function (product) {})`
   - Called when [product](#product) data is loaded from the store.
 - `.approved(function (order) {})`
   - Called when an [order](#order) is approved.
 - `.rejected(function (order) {})`
   - Called when an [order](#order) is rejected.
 - `.owned(function (product) {})`
   - Called when a non-consumable product or subscription is owned.
 - `.updated(function (product) {})`
   - Called when any change occured to a product.
 - `.cancelled(function (product) {})`
   - Called when an [order](#order) is cancelled by the user.
 - `.refunded(function (product) {})`
   - Called when an [order](#order) is refunded by the user.
 - `.error(function (err) {})`
   - Called when an [order](#order) failed.
   - The `err` parameter is an [error object](#errors)
 - Actually, all other product states have their promise
   - `registered`, `valid`, `invalid`, `requested`,
     `initiated` and `finished`
 - Product verification successful
Product verification failed

### alternative usage

 - `store.when(query, action, callback)`
   - Register a callback using its action name. Beware that this is more
     error prone, as there are not gonna be any error in case of typos.

## <a name="once"></a>*store.once(query)*

Identical to [`store.when`](#when), but the callback will be called only once.
After being called, the callback will be unregistered.

### alternative usage

 - `store.once(query, action, callback)`
   - Same remarks as `store.when(query, action, callback)`


## <a name="order"></a>*store.order(product)*
## <a name="ready"></a>*store.ready(callback)*
Register the `callback` to be called when the store is ready to be used.

If the store is already ready, `callback` is called immediatly.
### alternate usage (internal)

`store.ready(true)` will set the `ready` status to true,
and call the registered callbacks

`store.ready()` without arguments will return the `ready` status.
## <a name="off"></a>*store.off(callback)*
Unregister a callback. Works for callbacks registered with `ready`, `when`, `once` and `error`.

Example use:

    var fun = function(product) {
        // Product loaded while the store screen is visible.
        // Refresh some stuff.
    };

    store.when("product").loaded(fun);
    ...
    [later]
    ...
    store.off(fun);

## <a name="validator"></a> *store.validator*
Set to the URL of the purchase validation service,
or to your own custom validation callback.

#### example usage

```js
store.validator = "http://store.fovea.cc:1980/check-purchase"
```

```js
store.validator = function(product, callback) {
    callback(true);
    // Here, you will typically want to contact your own webservice
    // where you check transaction receipts with either Apple or
    // Google servers.
});
```
## <a name="refresh"></a>*store.refresh()*
## <a name="restore"></a>*store.restore()*
TODO write the doc
## *store.log* object
### `store.log.error(message)`
Logs an error message, only if `store.debug` >= store.ERROR
### `store.log.warn(message)`
Logs a warning message, only if `store.debug` >= store.WARNING
### `store.log.info(message)`
Logs an info message, only if `store.debug` >= store.INFO
### `store.log.debug(message)`
Logs a debug message, only if `store.debug` >= store.DEBUG

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
## <a name="registerProducts"></a>*store.registerProducts(products)*
Adds (or register) products into the store. Products can't be used
unless registered first!

Products is an array of object with fields :

 - `id`
 - `type`
 - `alias` (optional)

See documentation for the [product](#product) object for more information.

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
 - `refreshed`


## queries

The [`when`](#when) and [`once`](#once) methods take a `query` parameter.
Those queries allow to select part of the products (or orders) registered
into the store and get notified of events related to those products.

#### example

 - `"consumable order"` - all consumable products
 - `"full version"` - the `alias` of a registered [`product`](#product)
 - `"order cc.fovea.inapp1"` - the `id` of a registered [`product`](#product)
 - `"invalid product"` - an invalid product

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

