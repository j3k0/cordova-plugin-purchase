/*eslint-env mocha */
/*global describe, it, before, beforeEach, after, afterEach, storekit */
var assert = require("assert");
var store = require("../tmp/store-test");
var helper = require("./helper");

(function() {
"use strict";
global.store = store;
global.document = {
    addEventListener: function(/*event, callback*/) {}
};
global.localStorage = {};

// Dummy storekit implementation
global.storekit = {
    initShouldFail: false,
    init: function(options, success, error) {
        this.options = options;
        this.initCalled = (this.initCalled || 0) + 1;
        if (this.initShouldFail) {
            this.initialized = false;
            error(storekit.ERR_SETUP, "setup");
        }
        else {
            this.initialized = true;
            success();
        }
    },
    loadShouldFail: false,
    load: function(products, success, error) {
        this.products = products;
        this.loadCalled = (this.loadCalled || 0) + 1;
        if (this.loadShouldFail) {
            this.loaded = false;
            error(storekit.ERR_LOAD, "load");
        }
        else {
            this.loaded = true;
            success(
                store.products.filter(function(p){
                    return p.id !== "cc.fovea.i";
                }),
                ["cc.fovea.i"]);
        }
    },
    refreshReceipts: function(s/*,e*/) {
        if (s) {
            s(null);
        }
    },
    loadReceipts: function(cb) {
        if (cb) {
            cb({});
        }
    }
};
})();

describe('iOS', function(){
    "use strict";

    before(helper.resetTest);
    after(helper.resetTest);

    afterEach(function() {
        helper.setTimeoutFactor(1);
    });

    describe('#init', function(){

        it('should initialize storekit at first refresh()', function(done) {
            require("../tmp/ios-adapter");
            helper.setTimeoutFactor(1000);

            // first initialization will fail, but the implementation
            // will retry after 5 seconds.
            storekit.initShouldFail = true;
            assert.equal(false, store.ready(), "store shouldn't be ready at start");

            store.register({ id: "cc.fovea.nc", type: store.NON_CONSUMABLE });
            store.register({ id: "cc.fovea.c",  type: store.CONSUMABLE });
            store.register({ id: "cc.fovea.fs", type: store.FREE_SUBSCRIPTION });
            store.register({ id: "cc.fovea.ps", type: store.PAID_SUBSCRIPTION });
            store.register({ id: "cc.fovea.i", type: store.NON_CONSUMABLE});
            store.refresh();

            assert.equal(1,     storekit.initCalled);
            assert.equal(false, storekit.initialized);

            storekit.initShouldFail = false;
            storekit.loadShouldFail = true;
            setTimeout(function() {

                // After 6 seconds, we confirm that it retried
                // but failed at load
                assert.equal(2,     storekit.initCalled);
                assert.equal(true,  storekit.initialized);
                assert.equal(1,     storekit.loadCalled);
                assert.equal(false, storekit.loaded);
                assert.equal(false, store.ready(), "store shouldn't be ready after failed load");

                storekit.loadShouldFail = false;
                setTimeout(function() {

                    // 20 seconds later, it retried and succeeded.
                    assert.equal(2,    storekit.initCalled);
                    assert.equal(true, storekit.initialized);
                    assert.equal(2,    storekit.loadCalled);
                    assert.equal(true, storekit.loaded);
                    assert.equal(true, store.ready());

                    assert.equal(store.VALID, store.get("cc.fovea.c").state);
                    assert.equal(store.VALID, store.get("cc.fovea.nc").state);
                    assert.equal(store.VALID, store.get("cc.fovea.fs").state);
                    assert.equal(store.VALID, store.get("cc.fovea.ps").state);
                    assert.equal(store.INVALID, store.get("cc.fovea.i").state);

                    helper.setTimeoutFactor(1);
                    done();
                }, 20000);
            }, 6000);
        });
    });
});
