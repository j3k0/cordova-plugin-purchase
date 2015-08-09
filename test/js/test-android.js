/*eslint-env mocha */
/*global describe, it, before, beforeEach, after, afterEach */
var assert = require("assert");
var store = require("../tmp/store-test");

global.store = store;
global.document = {
    addEventListener: function(/*event, callback*/) {
        "use strict";
    }
};
global.localStorage = {};

require("../tmp/plugin-adapter");

describe('Android', function(){
    "use strict";
    describe('#init', function(){
        it('should', function() {
            assert.ok(true);
        });
    });
});
