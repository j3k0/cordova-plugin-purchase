/*eslint-env mocha */
/*global describe, it, before, beforeEach, after, afterEach */
var assert = require("assert");
var store = require("../tmp/store-test");

describe('Errors', function(){
    "use strict";

    beforeEach(function() {
        store.error.callbacks.reset();
    });

    describe('#callbacks', function(){
        it('should allow to register error handlers', function() {
            assert.ok(store.error);
            assert.ok(store.error.callbacks);

            var nop = function() {};
            assert.equal(0, store.error.callbacks.length);
            store.error(nop);
            assert.equal(1, store.error.callbacks.length);
            store.error(nop);
            assert.equal(2, store.error.callbacks.length);
            store.error(nop);
            assert.equal(3, store.error.callbacks.length);
            store.error.callbacks.reset();
            assert.equal(0, store.error.callbacks.length);
        });
    });

    describe('#trigger()', function(){

        it('should call registered errors', function() {
            assert.ok(store.error);
            assert.ok(store.error.callbacks);

            var called = false;
            store.error(function(err) {
                called = true;
                assert.ok(err.code);
                assert.ok(err.message);
            });

            assert.equal(false, called);
            store.error.callbacks.trigger(new store.Error());
            assert.equal(true, called);
        });

        it('should call all error handlers', function() {
            var nCalls = 0;
            var cb = function() { nCalls += 1; };
            var nop = function() {};
            assert.equal(0, store.error.callbacks.length);

            store.error(cb);
            assert.equal(1, store.error.callbacks.length);

            store.error(nop);
            assert.equal(2, store.error.callbacks.length);

            store.error(cb);
            assert.equal(3, store.error.callbacks.length);

            store.error.callbacks.trigger(new store.Error());
            assert.equal(2, nCalls);
        });
    });
});
