var assert = require("assert");
var store = require("../tmp/store-test");

global.store = store;
global.document = {
    addEventListener: function(event, callback) {}
};
global.localStorage = {};

describe('iOS', function(){
    describe('#init', function(){
        it('should', function() {
            require("../tmp/ios-adapter");
            assert.ok(true);
        });
    });
});
