# API Documentation

(generated from source files using make doc-api)


## store.ask(productId)

Retrieve informations about a given product.

If the given product is already loaded, promise callbacks
will be called immediately. If not, it will happen as soon
as the product is known as valid or invalid.

### return value

Return promise with the following methods:
    - then
    - error

#### then(function (product) {})


#### error(function (err) {})


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
