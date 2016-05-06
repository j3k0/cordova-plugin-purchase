/*eslint-env mocha */
/*global describe, it, before, beforeEach, after, afterEach */
var assert = require("assert");
var store = require("../tmp/store-test");

describe('Order', function(){
    "use strict";

    describe('#setApplicationUsername()', function(){

        it('should exist and define application username', function() {
            store.ready(function() {
                store.setApplicationUsername("username@gmail.com");
                assert.equal(store.getApplicationUsername(), "username@gmail.com");
            });
        });

        // TODO more tests
    });


    describe('#setAutoRestore()', function(){

        it('should exist and define auto restore', function() {
            store.ready(function() {
                store.setAutoRestore(true);
                assert.equal(store.isAutoRestore(), true);
            });
        });

        // TODO more tests
    });
});
