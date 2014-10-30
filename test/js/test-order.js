/*eslint-env mocha */
/*global describe, it, before, beforeEach, after, afterEach */
var assert = require("assert");
var store = require("../tmp/store-test");

describe('Order', function(){
    "use strict";

    describe('#order()', function(){

        var product = {};
        beforeEach(function() {
            product = {
                id:    "p1",
                alias: "product",
                type: store.CONSUMABLE
            };
            store.register(product);
        });

        it('should exist and define promises', function() {
            assert.ok(store.order, "store.order should be defined");
            assert.ok(store.order("p1").then, "store.order should return a then promise");
            assert.ok(store.order("p1").error, "store.order should return a error promise");
        });

        // TODO more tests
    });
});
