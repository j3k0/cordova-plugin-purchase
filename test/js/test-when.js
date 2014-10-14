var assert = require("assert");
var store = require("../store-test");

describe('When', function(){

    var product = {
        id: "p1",
        alias: "product"
    };
    before(function() {
        store.registerProducts([ product ]);
    });

    describe('#when()', function(){

        it('should define chainable promises', function() {
            var nop = function() {};
            store.when("p1").
                loaded(nop).
                approved(nop).
                rejected(nop).
                updated(nop).
                cancelled(nop);
                
        });

        it('should be called on id', function(){
            assert.ok(store.when);

            var loaded = false;
            store.when("p1").loaded(function(product) {
                loaded = true;
            });

            assert.equal(loaded, false);
            store._queries.triggerWhenProduct(product, "loaded");
            assert.equal(loaded, true);

            loaded = false;
            store._queries.triggerWhenProduct(product, "loaded");
            assert.equal(loaded, true);
        });

        it('should be called on aliases', function(){
            assert.ok(store.when);

            var loaded = false;
            store.when("product").loaded(function(product) {
                loaded = true;
            });

            assert.equal(loaded, false);
            store._queries.triggerWhenProduct(product, "loaded");
            assert.equal(loaded, true);

            loaded = false;
            store._queries.triggerWhenProduct(product, "loaded");
            assert.equal(loaded, true);
        });
    });

    describe('#once()', function(){

        it('should be called once on id', function(){
            assert.ok(store.when);

            var loaded = false;
            store.once("p1").loaded(function(product) {
                loaded = true;
            });

            assert.equal(loaded, false);
            store._queries.triggerWhenProduct(product, "loaded");
            assert.equal(loaded, true);

            loaded = false;
            store._queries.triggerWhenProduct(product, "loaded");
            assert.equal(loaded, false);
        });

        it('should be called once on aliases', function(){
            assert.ok(store.when);

            var loaded = false;
            store.once("product").loaded(function(product) {
                loaded = true;
            });

            assert.equal(loaded, false);
            store._queries.triggerWhenProduct(product, "loaded");
            assert.equal(loaded, true);

            loaded = false;
            store._queries.triggerWhenProduct(product, "loaded");
            assert.equal(loaded, false);
        });
    });
});
