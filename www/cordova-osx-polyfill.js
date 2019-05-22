/**
 * Workaround for missing nativeEvalAndFetch on cordova-osx
 * 
 * This polyfill adds the missing function 'nativeEvalAndFetch' required to run js from the native side
 * It can be removed when the cordova-osx team implements it.
 * 
 * Discussion on this solution: https://github.com/j3k0/cordova-plugin-purchase/pull/848
 * Cordova-osx issue: https://github.com/apache/cordova-osx/issues/80
 */

var exec = require('cordova/exec');

if (!exec.nativeEvalAndFetch) {
    exec.nativeEvalAndFetch = function (f) {
        try {
            f();
        } catch (e) {
            console.error(e.message || e, e.stack);
        }
    };
}
