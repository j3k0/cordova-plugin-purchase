/*eslint-env mocha */
/*global describe, it, before, beforeEach, after, afterEach */
var assert = require("assert");
var store = require("../tmp/store-test");

describe('Register', function(){
    "use strict";

    var helper = require("./helper");
    before(helper.resetTest);
    after(helper.resetTest);

    describe('#register()', function(){

        it('should exist', function() {
            assert.ok(store.register);
        });

        it('should allow to register products', function() {
            store.register([{
                id: "cc.fovea.purchase.test1",
                alias: "test 1",
                type: store.CONSUMABLE
            }]);
            assert.ok(store.products.byId["cc.fovea.purchase.test1"]);
        });

        it('shouldn\'t allow to register products containing reserved keywords', function() {
            store.register([{
                id: "cc.fovea.purchase.test2",
                alias: "test product",
                type: store.CONSUMABLE
            }]);
            assert.ok(!store.products.byId["cc.fovea.purchase.test2"]);

            store.register([{
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
