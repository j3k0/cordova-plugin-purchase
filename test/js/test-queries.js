/*eslint-env mocha */
/*global describe, it, before, beforeEach, after, afterEach */
var assert = require("assert");
var store = require("../tmp/store-test");

describe('Queries', function(){
    "use strict";

    describe('#uniqueQuery()', function(){

        it('should remove keywords from the query', function(){
            assert.ok(store._queries.uniqueQuery);
            var uniqueQuery = store._queries.uniqueQuery;
            assert.equal("full version", uniqueQuery("order full version"));
            assert.equal("loaded cc.fovea.babygoo.inapp1", uniqueQuery("loaded cc.fovea.babygoo.inapp1"));
        });
    });

    describe('#callbacks()', function(){

        it('should add callbacks', function(){
            assert.ok(store._queries.callbacks);
            var callbacks = store._queries.callbacks;
            var xxx = function() {};
            callbacks.add("p1", "loaded", xxx);
            assert.equal(1, callbacks.byQuery["p1 loaded"].length);
            assert.equal(xxx, callbacks.byQuery["p1 loaded"][0].cb);
            assert.ok(!callbacks.byQuery["p1 loaded"][0].once);
        });
    });

    describe('#triggerWhenProduct()', function(){

        beforeEach(function() {
            store._queries.callbacks.byQuery = {};
        });

        it('should call callbacks', function(){
            assert.ok(store._queries.triggerWhenProduct);
            var callbacks = store._queries.callbacks;

            var approved = false;
            callbacks.add("full version", "approved", function () {
                approved = true;
            });
            assert.equal(false, approved);
            store._queries.triggerWhenProduct({id: "full version"}, "approved");
            assert.equal(true, approved);

            approved = false;
            assert.equal(false, approved);
            store._queries.triggerWhenProduct({id: "full version"}, "approved");
            assert.equal(true, approved);
        });

        it('should call some callbacks only once', function(){
            var callbacks = store._queries.callbacks;

            var approved = false;
            callbacks.add("lite version", "approved", function () {
                approved = true;
            }, true);
            assert.equal(false, approved);
            store._queries.triggerWhenProduct({id: "lite version"}, "approved");
            assert.equal(true, approved);

            approved = false;
            assert.equal(false, approved);
            store._queries.triggerWhenProduct({id: "lite version"}, "approved");
            assert.equal(false, approved);
        });

        it('should handle special case for subscriptions', function(){
            var callbacks = store._queries.callbacks;

            var approved = false;
            callbacks.add("order subscription", "approved", function() {
                approved = true;
            });
            assert.equal(false, approved);
            store._queries.triggerWhenProduct({id: "anything", type: store.FREE_SUBSCRIPTION}, "approved");
            assert.equal(true, approved);
        });

        it('should execute all callbacks even if one fails with an exception', function() {
            var f1Called = false;
            var f1Returned = false;
            var f2Called = false;
            var f2Returned = false;
            store._queries.callbacks.add("", "yyy", function() {
                f1Called = true;
                if (f1Called) {
                    throw "ERROR";
                }
                f1Returned = true;
            }, true);
            store._queries.callbacks.add("", "yyy", function() {
                f2Called = true;
                if (f2Called) {
                    throw "ERROR";
                }
                f2Returned = true;
            }, true);
            store._queries.triggerAction("yyy");
            assert.equal(true, f1Called);
            assert.equal(false, f1Returned);
            assert.equal(true, f2Called);
            assert.equal(false, f2Returned);
        });

        it('should trigger an update for any event', function(done) {
            store._queries.callbacks.add("product", "updated", function(product) {
                assert.equal("test.updated1", product.id);
                done();
            });
            store._queries.triggerWhenProduct({id: "test.updated1"}, "xyz");
        });

        it('should not trigger an update for error events', function(done) {
            store._queries.callbacks.add("product", "updated", function(/*product*/) {
                assert(false, "updated shouldn't be called");
            });
            store._queries.triggerWhenProduct({id: "test.updated2"}, "error");
            setTimeout(done, 6);
        });

        it('should not trigger "updated" events twice', function(done) {
            var nCalls = 0;
            store._queries.callbacks.add("product", "updated", function(product) {
                assert.equal("test.updated2", product.id);
                nCalls++;
            });
            store._queries.triggerWhenProduct({id: "test.updated2"}, "udpated");
            setTimeout(function() {
                assert.equal(1, nCalls);
                done();
            }, 6);
        });
    });
});
