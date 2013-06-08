//
// Application Delegate
//
// Your app's entry point.
//

requirejs.config({
    // Declare your own here.
    paths: {
    },
    shim: {
    }
});

define([
    'jquery',
    'underscore',
    'jackbone',
    'events',
    'logger',
    'version',
    'templates',
    'testing'
], function ($, _, Jackbone, Events, Logger, Version, Templates, Testing) {
    'use strict';

    var MenuView = Jackbone.View.extend({
        render: function () {
            $(this.el).html(Templates['menu.html']());
        }
    });

    var MyRouter = Jackbone.Router.extend({
        routes: {
            // Pages
            '':     'menu',
            'menu': 'menu',
            // Default - catch all
            '*actions': 'defaultAction'
        },
        menu: function () {
            this.openView({name: 'Menu', Class: MenuView});
        }
    });

    var start = function (/*testingEnabled*/) {
        var router = new MyRouter();
        Jackbone.history.start();
        router.goto('menu');
    };

    var pause = function () {
    };

    var resume = function () {
    };

    var test = function () {
        var T = Testing.Chain;
        var $a = function (selector) { return $(selector, $.mobile.activePage); };

        QUnit.asyncTest('Application initialized', function (test) {
            T.init(test);
            T.add(0, 1000, function () { Jackbone.router.goto('menu'); });
            T.add(0,    0, function () { ok($('#pagename-menu').length === 1, 'Menu page exists'); }, 1);

            var isReady = false;
            T.add(0,  100, function () { ok(typeof window.storekit !== 'undefined', 'StoreKit available'); });
            T.add(0, 5000, function () {
                storekit.init({
                    ready: function () {
                        console.log('StoreKit Ready');
                        isReady = true;
                    },
                    error: function (errCode, errMessage) {
                        console.log('StoreKit Error');
                        console.log(errMessage);
                        isReady = false;
                    }
                });
            });
            T.add(0,    0, function () { ok(isReady === true, 'StoreKit initialized'); }, 1);
            T.finish();
        });

        T.start();
    };

    return {
        start: start,
        pause: pause,
        resume: resume,
        test: test
    };
});
