var assert = require("assert");
var store = require("../store-test");

describe('Register products', function(){

    describe('#registerProducts()', function(){

        it('should exist', function() {
            assert.ok(store.registerProducts);
        });

        it('should allow to register products', function() {
            store.registerProducts([{
                id: "cc.fovea.purchase.test1",
                alias: "test 1",
                type: store.CONSUMABLE
            }]);
            assert.ok(store.products.byId["cc.fovea.purchase.test1"]);
        });

        it('shouldn\'t allow to register products containing reserved keywords', function() {
            store.registerProducts([{
                id: "cc.fovea.purchase.test2",
                alias: "test product",
                type: store.CONSUMABLE
            }]);
            assert.ok(!store.products.byId["cc.fovea.purchase.test2"]);

            store.registerProducts([{
                id: "order",
                alias: "test",
                type: store.CONSUMABLE
            }]);
            assert.ok(!store.products.byId.order);
        });

        it('should fail when registering products without types', function() {
            assert.throws(function() {
                store.register({
                    id: "blah"
                });
            });
        });
    });
});

