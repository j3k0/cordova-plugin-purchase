/*eslint-env mocha */
/*global describe, it, before, beforeEach, after, afterEach */
var assert = require("assert");
var store = require("../tmp/store-test");

describe('Order', function(){
    "use strict";

    describe('#setApplicationUsername()', function(){

        store.setApplicationUsername("username@gmail.com");

        it('should exist and define application username', function() {
            assert.equal(store.applicationUsername, "username@gmail.com");
        });

        // TODO more tests
    });
});
