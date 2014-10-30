(function() {
    "use strict";
    var Mocha = require('mocha');

    var mocha = new Mocha({
        ui: 'bdd'
    });

    mocha.reporter('list');

    mocha.addFile('test/js/test-ready.js');
    mocha.addFile('test/js/test-error.js');
    mocha.addFile('test/js/test-off.js');
    mocha.addFile('test/js/test-order.js');
    mocha.addFile('test/js/test-queries.js');
    mocha.addFile('test/js/test-register.js');
    mocha.addFile('test/js/test-when.js');
    mocha.addFile('test/js/test-finish.js');
    mocha.addFile('test/js/test-verify.js');
    mocha.addFile('test/js/test-utils.js');
    mocha.addFile('test/js/test-ios.js');
    mocha.addFile('test/js/test-android.js');

    mocha.run(function(){
        console.log('done');
    }).on('pass', function(/*test*/){
        // console.log('... %s', test.title);
    });
})();
