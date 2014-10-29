var assert = require("assert");
var store = require("../tmp/store-test");
var helper = require("./helper");

describe('Verify', function() {
    before(function() {
        require("./helper").resetTest();
        store.register({
            id: "pf-consumable",
            type: store.CONSUMABLE
        });
        helper.setTimeoutFactor(1000);
    });

    after(function() {
        helper.setTimeoutFactor(1);
    });

    describe('#verify', function() {
        it('should return a Promise', function() {
            var p = store.get("pf-consumable");
            var promise = p.verify();
            assert.ok(promise.done);
            assert.ok(promise.expired);
            assert.ok(promise.success);
            assert.ok(promise.error);
        });

        it('should call the validator when state is APPROVED', function(done) {
            var p = store.get("pf-consumable");
            var nCalls = 0;
            store.validator = function(product, callback) {
                nCalls++;
                callback(true, product);
            };

            step1();
            function step1() {
                p.set('state', store.VALID);
                p.verify();
                setTimeout(function() {
                    assert.equal(0, nCalls);
                    step2();
                }, 1500);
            }

            function step2() {
                p.set('state', store.APPROVED);
                p.verify();
                setTimeout(function() {
                    assert.equal(1, nCalls);
                    done();
                }, 1500);
            }
        });
    });
});

