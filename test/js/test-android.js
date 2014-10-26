var assert = require("assert");
var store = require("../tmp/store-test");

global.store = store;
global.document = {
    addEventListener: function(event, callback) {}
};
global.localStorage = {};

require("../tmp/android-adapter");

describe('Android', function(){
    describe('#init', function(){
        it('should', function() {
            assert.ok(true);
        });
    });
});

