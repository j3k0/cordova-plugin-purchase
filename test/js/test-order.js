var assert = require("assert");
var store = require("../store-test");

describe('Order', function(){

    describe('#order()', function(){

        var product = {};
        beforeEach(function() {
            product = {
                id:    "p1",
                alias: "product"
            };
            store.registerProducts([ product ]);
        });

        it('should exist and define promises', function() {
            assert.ok(store.order);
            assert.ok(store.order("").initiated);
            assert.ok(store.order("").error);
        });
    });
});
