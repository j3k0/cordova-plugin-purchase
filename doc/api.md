# API Documentation

(generated from source files using make doc-api)


## <a name="store"></a>`store` object ##

`store` is the global object exported by the purchase plugin.

As with any other plugin,
this object shouldn't be used before the "deviceready" event is fired.

Check cordova's documentation for more details if needed.

## products ##

Some methods, like the [`ask` method](#ask), give you access to a `product`
object. Products object provide a set of fields and methods:

TODO: Document this

## errors ##


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

## <a name="ask"></a>`store.ask(productId)` ##

Retrieve informations about a given [product](#products).

If the given product is already loaded, promise callbacks
will be called immediately. If not, it will happen as soon
as the product is known as valid or invalid.

### return value

Return promise with the following methods:

#### then(function (product) {})

Called when the product information has been loaded from the store's
servers and known to be valid.

`product` contains the fields documented in the [products](#products) section.

#### error(function (err) {})

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
