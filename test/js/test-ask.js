var assert = require("assert");
var store = require("../store-test");

describe('Ask', function(){

    describe('#ask()', function(){

        var product = {};
        beforeEach(function() {
            product = {
                id: "p1",
                alias: "product"
            };
            store.registerProducts([ product ]);
        });

        it('should define chainable promises', function() {
            var nop = function() {};
            store.ask("p1").
                then(nop).
                error(nop);
        });

        it('should retrieve loaded products', function() {
            var loaded = false;
            var error = false;
            store.ask("p1").
                then(function(product) {
                    loaded = true;
                    assert.equal(true, product.loaded);
                    assert.equal(true, product.valid);
                }).
                error(function(err) {
                    error = true;
                });
            product.loaded = true;
            product.valid = true;
            store._queries.triggerWhenProduct(product, "loaded", [product]);
            assert.equal(true, loaded);
            assert.equal(false, error);
        });

        it('should retrieve errors for invalid products', function() {
            var loaded = false;
            var error = false;
            store.ask("p1").
                then(function(product) {
                    loaded = true;
                }).
                error(function(err, product) {
                    assert.equal(store.ERR_INVALID_PRODUCT_ID, err.code);
                    assert.equal(true,  product.loaded);
                    assert.equal(false, product.valid);
                    error = true;
                });
            product.loaded = true;
            product.valid = false;
            store._queries.triggerWhenProduct(product, "loaded", [product]);
            assert.equal(false, loaded);
            assert.equal(true, error);
        });

        it('should fail when giving unregistered product id or alias', function() {
            var nop = function() {};
            var then = false;
            var error = false;
            store.ask("p2").
                then(function(p) {
                    then = true;
                }).
                error(function(err) {
                    assert.ok(err.code);
                    assert.equal(store.ERR_INVALID_PRODUCT_ID, err.code);
                    error = true;
                });
            assert.equal(false, then);
            assert.equal(true, error);
        });
    });
});
