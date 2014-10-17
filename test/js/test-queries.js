var assert = require("assert");
var store = require("../store-test");

describe('Queries', function(){

    describe('#uniqueQuery()', function(){

        it('should remove keywords from the query', function(){
            assert.ok(store._queries.uniqueQuery);
            var uniqueQuery = store._queries.uniqueQuery;
            assert.equal("full version", uniqueQuery("order full version"));
            assert.equal("loaded cc.fovea.babygoo.inapp1", uniqueQuery("loaded cc.fovea.babygoo.inapp1"));
        });
    });

    describe('#callbacks()', function(){

        it('should add callbacks', function(){
            assert.ok(store._queries.callbacks);
            var callbacks = store._queries.callbacks;
            var xxx = function() {};
            callbacks.add("p1", "loaded", xxx);
            assert.equal(1, callbacks.byQuery["p1 loaded"].length);
            assert.equal(xxx, callbacks.byQuery["p1 loaded"][0].cb);
            assert.ok(!callbacks.byQuery["p1 loaded"][0].once);
        });
    });

    describe('#triggerWhenProduct()', function(){

        it('should call callbacks', function(){
            assert.ok(store._queries.triggerWhenProduct);
            var callbacks = store._queries.callbacks;

            var approved = false;
            callbacks.add("full version", "approved", function () {
                approved = true;
            });
            assert.equal(false, approved);
            store._queries.triggerWhenProduct({id:"full version"}, "approved");
            assert.equal(true, approved);

            approved = false;
            assert.equal(false, approved);
            store._queries.triggerWhenProduct({id:"full version"}, "approved");
            assert.equal(true, approved);
        });

        it('should call some callbacks only once', function(){
            var callbacks = store._queries.callbacks;

            var approved = false;
            callbacks.add("lite version", "approved", function () {
                approved = true;
            }, true);
            assert.equal(false, approved);
            store._queries.triggerWhenProduct({id:"lite version"}, "approved");
            assert.equal(true, approved);

            approved = false;
            assert.equal(false, approved);
            store._queries.triggerWhenProduct({id:"lite version"}, "approved");
            assert.equal(false, approved);
        });

        it('should handle special case for subscriptions', function(){
            var callbacks = store._queries.callbacks;

            var approved = false;
            callbacks.add("order subscription", "approved", function() {
                approved = true;
            });
            assert.equal(false, approved);
            store._queries.triggerWhenProduct({id:"anything", type:store.FREE_SUBSCRIPTION}, "approved");
            assert.equal(true, approved);
        });

        it('should execute all callbacks even if one fails with an exception', function() {
            var f1_called = false;
            var f1_returned = false;
            var f2_called = false;
            var f2_returned = false;
            store._queries.callbacks.add("", "yyy", function() {
                f1_called = true;
                if (f1_called) throw "ERROR";
                f1_returned = true;
            }, true);
            store._queries.callbacks.add("", "yyy", function() {
                f2_called = true;
                if (f2_called) throw "ERROR";
                f2_returned = true;
            }, true);
            store._queries.triggerAction("yyy");
            assert.equal(true, f1_called);
            assert.equal(false, f1_returned);
            assert.equal(true, f2_called);
            assert.equal(false, f2_returned);
        });
    });
});
