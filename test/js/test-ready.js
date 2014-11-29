/*eslint-env mocha */
/*global describe, it, before, beforeEach, after, afterEach */
var assert = require("assert");
var store = require("../tmp/store-test");

describe('Ready', function(){
    "use strict";

    describe('#ready()', function(){

        it('should return false at start', function() {
            assert.equal(false, store.ready());
        });

        it('should execute as soon as ready status is set', function() {
            var called = false;
            assert.equal(false, store.ready());
            store.ready(function() { called = true; });
            assert.equal(false, called);

            store.ready(true);
            assert.equal(true, store.ready());
            assert.equal(true, called);

            // not again
            called = false;
            store.ready(true);
            assert.equal(false, called);
        });

        /*
        it('should execute immediatly if ready status is set', function() {
            // NO it shouldn't anymore. execution is now defered.
            store.ready(true);
            var called = false;
            assert.equal(true, store.ready());
            store.ready(function() { called = true; });
            assert.equal(true, called);
        });
        */
    });
});
