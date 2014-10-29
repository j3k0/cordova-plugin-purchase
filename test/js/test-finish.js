var assert = require("assert");
var store = require("../tmp/store-test");

describe('Finish', function() {
    before(function() {
        require("./helper").resetTest();
        store.register({
            id: "pf-consumable",
            type: store.CONSUMABLE
        });
    });

    describe('#finish', function() {
        it('should trigger the finish event', function(done) {
            var p = store.get("pf-consumable");
            p.set("state", store.VALID);
            store.once(p).finished(function(p) {
                assert.equal(store.FINISHED, p.state);
                p.set('state', store.VALID);
            });
            store.once(p).valid(function(p) {
                done();
            });
            p.finish();
        });
    });
});
