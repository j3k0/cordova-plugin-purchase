var assert = require("assert");
var store = require("../store-test");

describe('Ask', function(){

    describe('#ask()', function(){

        beforeEach(function() {
            var product = {
                id: "p1",
                alias: "extra life"
            };
            store.registerProducts([ product ]);
        });

        it('should define chainable promises', function() {
            var nop = function() {};
            store.ask("p1").
                then(nop).
                error(nop);
        });

        it('should retrieve loaded products', function(done) {
            store.ask("p1").
                then(function(product) {
                    assert.equal(true, product.loaded, "product is loaded");
                    assert.equal(true, product.valid,  "product is valid");
                    done();
                }).
                error(function(err) {
                    assert.ok(false, "ask didn't fail with an error");
                    done();
                });
            store.get("p1").set("state", store.VALID);
        });

        it('should retrieve errors for invalid products', function(done) {
            store.ask("p1").
                then(function(product) {
                    assert.ok("false", "ask should fail");
                }).
                error(function(err, product) {
                    assert.equal(store.ERR_INVALID_PRODUCT_ID, err.code);
                    assert.equal(true,  product.loaded);
                    assert.equal(false, product.valid);
                    done();
                });
            store.get("p1").set("state", store.INVALID);
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
