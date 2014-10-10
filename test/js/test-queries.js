var assert = require("assert");
var store = require("../../www/store-test");

describe('Queries', function(){

    describe('#uniqueQuery()', function(){

        it('should remove keywords from the query', function(){
            assert.ok(store._uniqueQuery);
            var uniqueQuery = store._uniqueQuery;
            assert.equal("full version", uniqueQuery("order full version"));
            assert.equal("loaded cc.fovea.babygoo.inapp1", uniqueQuery("loaded cc.fovea.babygoo.inapp1"));
        });
    });

    describe('#callbacks()', function(){

        it('should add callbacks', function(){
            assert.ok(store._callbacks);
            var callbacks = store._callbacks;
            var xxx = function() {};
            callbacks.add("p1", "loaded", xxx);
            assert.equal(1, callbacks.byQuery["p1 loaded"].length);
            assert.equal(xxx, callbacks.byQuery["p1 loaded"][0].cb);
            assert.ok(!callbacks.byQuery["p1 loaded"][0].once);
        });
    });

    describe('#triggerWhenProduct()', function(){

        it('should call callbacks', function(){
            assert.ok(store._triggerWhenProduct);
            var triggerWhenProduct = store._triggerWhenProduct;
            var callbacks = store._callbacks;

            var approved = false;
            callbacks.add("full version", "approved", function () {
                approved = true;
            });
            assert.equal(false, approved);
            triggerWhenProduct({id:"full version"}, "approved");
            assert.equal(true, approved);

            approved = false;
            assert.equal(false, approved);
            triggerWhenProduct({id:"full version"}, "approved");
            assert.equal(true, approved);
        });

        it('should call some callbacks only once', function(){
            var triggerWhenProduct = store._triggerWhenProduct;
            var callbacks = store._callbacks;

            var approved = false;
            callbacks.add("lite version", "approved", function () {
                approved = true;
            }, true);
            assert.equal(false, approved);
            triggerWhenProduct({id:"lite version"}, "approved");
            assert.equal(true, approved);

            approved = false;
            assert.equal(false, approved);
            triggerWhenProduct({id:"lite version"}, "approved");
            assert.equal(false, approved);
        });

        it('should handle special case for subscriptions', function(){
            var triggerWhenProduct = store._triggerWhenProduct;
            var callbacks = store._callbacks;

            var approved = false;
            callbacks.add("order subscription", "approved", function() {
                approved = true;
            });
            assert.equal(false, approved);
            triggerWhenProduct({id:"anything", type:store.FREE_SUBSCRIPTION}, "approved");
            assert.equal(true, approved);
        });
    });
});
