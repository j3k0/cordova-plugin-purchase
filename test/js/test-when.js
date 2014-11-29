/*eslint-env mocha */
/*global describe, it, before, beforeEach, after, afterEach */
var assert = require("assert");
var store = require("../tmp/store-test");
var helper = require("./helper");

describe('When', function(){
    "use strict";

    var product = {
        id: "p1",
        alias: "product-alias",
        type: store.CONSUMABLE
    };
    before(function() {
        helper.resetTest();
        store.register(product);
    });
    after(helper.resetTest);

    describe('#when()', function() {

        it('should define chainable promises', function() {
            var nop = function() {};
            store.when("p1").
                loaded(nop).
                approved(nop).
                updated(nop).
                cancelled(nop);
        });

        it('should be called on id', function(){
            assert.ok(store.when);

            var loaded = false;
            store.when("p1").loaded(function(product) {
                loaded = true;
                assert.equal(product.id, "p1");
            });

            assert.equal(loaded, false, "loaded should not be called initially");
            store._queries.triggerWhenProduct(product, "loaded", [product]);
            assert.equal(loaded, true, "loaded should be called after the 'loaded' event");

            loaded = false;
            store._queries.triggerWhenProduct(product, "loaded", [product]);
            assert.equal(loaded, true, "loaded should be called every 'loaded' event");
        });

        it('should be called on aliases', function(){
            assert.ok(store.when);

            var loaded = false;
            store.when("product").loaded(function(product) {
                assert.equal(product.id, "p1");
                loaded = true;
            });

            assert.equal(loaded, false);
            store._queries.triggerWhenProduct(product, "loaded", [product]);
            assert.equal(loaded, true);

            loaded = false;
            store._queries.triggerWhenProduct(product, "loaded", [product]);
            assert.equal(loaded, true);
        });

        it('should allow direct callback registrations', function() {
            var nCalls = 0;
            store.when("order", "initiated", function(product) {
                nCalls ++;
                assert.equal("p1", product.id);
            });
            assert.equal(0, nCalls);
            store.trigger("p1", "initiated");
            assert.equal(1, nCalls);
            store.trigger("p1", "initiated");
            assert.equal(2, nCalls);
        });

        it('should allow non product related registrations', function(done) {
            store.when("refreshed", function() {
                done();
            });
            store.trigger("refreshed");
        });
    });

    describe('#once()', function(){

        it('should be called once on id', function(){
            assert.ok(store.once, "store.once is defined");

            var loaded = false;
            store.once("p1").loaded(function(product) {
                assert.equal(product.id, "p1");
                loaded = true;
            });

            assert.equal(loaded, false);
            store._queries.triggerWhenProduct(product, "loaded", [product]);
            assert.equal(loaded, true);

            loaded = false;
            store._queries.triggerWhenProduct(product, "loaded", [product]);
            assert.equal(loaded, false);
        });

        it('should be called once on aliases', function(){
            assert.ok(store.when);

            var loaded = false;
            store.once("product").loaded(function(product) {
                assert.equal(product.id, "p1");
                loaded = true;
            });

            assert.equal(loaded, false);
            store._queries.triggerWhenProduct(product, "loaded", [product]);
            assert.equal(loaded, true);

            loaded = false;
            store._queries.triggerWhenProduct(product, "loaded", [product]);
            assert.equal(loaded, false);
        });
    });
});
