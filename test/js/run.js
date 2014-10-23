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
mocha.addFile('test/js/test-registerProducts.js');
mocha.addFile('test/js/test-when.js');

mocha.run(function(){
    console.log('done');
}).on('pass', function(test){
    // console.log('... %s', test.title);
});
