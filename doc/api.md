# API Documentation

(generated from source files using `make doc-api)`


## <a name="store"></a>*store* object ##

`store` is the global object exported by the purchase plugin.

As with any other plugin,
this object shouldn't be used before the "deviceready" event is fired.

Check cordova's documentation for more details if needed.


## constants

### product types

    store.FREE_SUBSCRIPTION = "free subscription";
    store.PAID_SUBSCRIPTION = "paid subscription";
    store.CONSUMABLE        = "consumable";
    store.NON_CONSUMABLE    = "non consumable";

### error codes

    store.ERR_SETUP               = ERROR_CODES_BASE + 1;
    store.ERR_LOAD                = ERROR_CODES_BASE + 2;
    store.ERR_PURCHASE            = ERROR_CODES_BASE + 3;
    store.ERR_LOAD_RECEIPTS       = ERROR_CODES_BASE + 4;
    store.ERR_CLIENT_INVALID      = ERROR_CODES_BASE + 5;
    store.ERR_PAYMENT_CANCELLED   = ERROR_CODES_BASE + 6;
    store.ERR_PAYMENT_INVALID     = ERROR_CODES_BASE + 7;
    store.ERR_PAYMENT_NOT_ALLOWED = ERROR_CODES_BASE + 8;
    store.ERR_UNKNOWN             = ERROR_CODES_BASE + 10;
    store.ERR_REFRESH_RECEIPTS    = ERROR_CODES_BASE + 11;
    store.ERR_INVALID_PRODUCT_ID  = ERROR_CODES_BASE + 12;
## <a name="product"></a>*store.Product* object ##

Some methods, like the [`ask` method](#ask), give you access to a `product`
object.

Products object have the following fields and methods:

 - `product.id` - Identifier of the product on the store
 - `product.alias` - Alias that can be used for more explicit [queries](#queries)
 - `product.price` - Non-localized price, without the currency
 - `product.currency` - Currency code
 - `product.title` - Non-localized name or short description
 - `product.description` - Non-localized longer description
 - `product.localizedTitle` - Localized name or short description ready for display
 - `product.localizedDescription` - Localized longer description ready for display
 - `product.localizedPrice` - Localized price (with currency) ready for display


## <a name="errors"></a>*store.Error* object

All error callbacks takes an `error` object as parameter.

Errors have the following fields:

 - `error.code` - An integer [error code](#error-codes). See the [error codes](#error-codes) section for more details.
 - `error.message` - Human readable message string, useful for debugging.

### <a name="error"></a>*store.error(callback)*

Register an error handler.

`callback` is a function taking an [error](#errors) as argument.

example use:
```
    store.error(function(e){
        console.log("ERROR " + e.code + ": " + e.message);
    });
```
## <a name="registerProducts"></a>*store.registerProducts(products)*
Adds (or register) products into the store. Products can't be used
unless registered first!

Products is an array of object with fields :

 - `id`
 - `type`
 - `alias` (optional)

See documentation for the [product](#product) object for more information.

## <a name="when"></a>*store.when(query)*


### return value

Return promise with the following methods:

#### .*loaded(function (product) {})*

Called when [product](#product) data is loaded from the store.


#### .*approved(function (order) {})*

Called when an [order](#order) is approved.


#### .*rejected(function (order) {})*

Called when an [order](#order) is rejected.


#### .*cancelled(function (product) {})*

Called when an [order](#order) is cancelled by the user.


#### .*error(function (err) {})*

Called when an [order](#order) failed.

The `err` parameter is an [error object](#errors)

## <a name="once"></a>*store.once(query)*

Identical to [`store.when`](#when), but the callback will be called only once.
After being called, the callback will be unregistered.

## <a name="ask"></a>*store.ask(productId)* ##

Retrieve informations about a given [product](#products).

If the given product is already loaded, promise callbacks
will be called immediately. If not, it will happen as soon
as the product is known as valid or invalid.

### return value

Return promise with the following methods:

#### .*then(function (product) {})*

Called when the product information has been loaded from the store's
servers and known to be valid.

`product` contains the fields documented in the [products](#products) section.

#### .*error(function (err) {})*

Called if product information cannot be loaded from the store or
when it is know to be invalid.

`err` features the standard [error](#errors) format (`code` and `message`).

### example use

```
store.ask("full version").
    then(function(product) {
        console.log("product " + product.id + " loaded");
        console.log("title: " + product.title);
        console.log("description: " + product.description);
        console.log("price: " + product.price);
    }).
    error(function(error) {
        console.log("failed to load product");
        console.log("ERROR " + error.code + ": " + error.message);
    });
```
## <a name="ready"></a>*store.ready(callback)*
Register the `callback` to be called when the store is ready to be used.

If the store is already ready, `callback` is called immediatly.
### alternate usage (internal)
`store.ready(true)` will set the `ready` status to true,
and call the registered callbacks

`store.ready()` without arguments will return the `ready` status.

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


## *store.error.callbacks* array

Array of user registered error callbacks.

### *store.error.callbacks.trigger(error)*

Execute all error callbacks with the given `error` argument.

### *store.error.callbacks.reset()*

Remove all error callbacks.
