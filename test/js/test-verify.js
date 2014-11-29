/*eslint-env mocha */
/*global describe, it, before, beforeEach, after, afterEach */
var assert = require("assert");
var store = require("../tmp/store-test");
var helper = require("./helper");

describe('Verify', function() {
    "use strict";

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

            var step1, step2;

            step1 = function() {
                p.set('state', store.VALID);
                var doneCalled = 0;
                var errorCalled = 0;
                p.verify().error(function(err) {
                    assert.equal(store.ERR_VERIFICATION_FAILED, err.code);
                    errorCalled ++;
                }).done(function() {
                    doneCalled ++;
                });
                setTimeout(function() {
                    assert.equal(0, nCalls);
                    assert.equal(1, doneCalled,  "done should be called");
                    assert.equal(1, errorCalled, "error should be called");
                    step2();
                }, 1500);
            };

            step2 = function() {
                p.set('state', store.APPROVED);
                var successCalled = 0;
                var doneCalled = 0;
                p.verify().success(function() {
                    successCalled ++;
                }).done(function() {
                    doneCalled ++;
                });
                setTimeout(function() {
                    assert.equal(1, nCalls);
                    assert.equal(1, successCalled, "success should be called");
                    assert.equal(1, doneCalled,    "done should be called");
                    done();
                }, 1500);
            };

            step1();
        });

        it('should retry 5 times when validator fails', function(done) {
            var p = store.get("pf-consumable");
            var nCalls = 0;
            store.validator = function(product, callback) {
                nCalls++;
                callback(false, {});
            };
            p.set('state', store.APPROVED);
            helper.setTimeoutFactor(4000);

            function step() {
                var successCalled = 0;
                var errorCalled = 0;
                var doneCalled = 0;
                p.verify().
                    success(function() {
                        successCalled ++;
                    }).
                    error(function(err) {
                        assert.equal(store.ERR_VERIFICATION_FAILED, err.code);
                        errorCalled ++;
                    }).
                    done(function() {
                        doneCalled ++;
                    });
                setTimeout(function() {
                    assert.equal(5, nCalls);
                    assert.equal(0, successCalled, "success should be called");
                    assert.equal(1, errorCalled,   "error should be called");
                    assert.equal(1, doneCalled,    "done should be called");
                    done();
                }, 200000);
            }

            step();
        });
    });
});
