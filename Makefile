help:
	@echo ""
	@echo "Usage: make <target>"
	@echo ""
	@echo "available targets:"
	@echo "    build .......... Generate javascript files for iOS and Android."
	@echo "    tests .......... Run all tests."
	@echo "    test-js ........ Test javascript files for errors."
	@echo "    test-install ... Test plugin installation on iOS and Android."
	@echo "    doc-api ........ Generate API documentation into doc/api.md"
	@echo "    doc-contrib .... Generate Contributor Guide into doc/contributor-guide.md"
	@echo "    clean .......... Cleanup the project (temporary and generated files)."
	@echo ""
	@echo "extra targets"
	@echo "    all ............ Generate javascript files and documentation"
	@echo ""
	@echo "(c)2014, Jean-Christophe Hoelt <hoelt@fovea.cc>"
	@echo ""

all: build doc

build: sync-android test-js
	@echo "- Preprocess"
	@node_modules/.bin/preprocess src/js/store-ios.js src/js | node_modules/.bin/uglifyjs -b > www/store-ios.js
	@node_modules/.bin/preprocess src/js/store-android.js src/js | node_modules/.bin/uglifyjs -b > www/store-android.js
	@echo "- DONE"
	@echo ""

test-js: check-jshint
	@echo "- JSHint"
	@node_modules/.bin/jshint src/js/*.js test/js/*.js
	@echo "- Mocha"
	@node_modules/.bin/preprocess src/js/store-test.js src/js > test/store-test.js
	@echo
	@#for i in test/js/test-*.js; do printf $$i; node_modules/.bin/mocha -b -R list $$i || exit 1; done
	@node test/js/run.js

test-install: build
	@./test/run.sh cc.fovea.babygoo babygooinapp1

tests: test-js test-install
	@echo 'ok'

check-jshint:
	@test -e node_modules/.bin/jshint || ( echo 'Please install dependencies: npm install'; exit 1 )

doc-api: test-js
	@echo "# API Documentation" > doc/api.md
	@echo >> doc/api.md
	@echo "(generated from source files using \`make doc-api)\`" >> doc/api.md
	@echo >> doc/api.md
	@cat test/store-test.js | grep "///" | cut -d/ -f4- | cut -d\  -f2- >> doc/api.md

doc-contrib: test-js
	@echo "# Contributor Guide" > doc/contributor-guide.md
	@echo >> doc/contributor-guide.md
	@echo "(generated from source files using \`make doc-api)\`" >> doc/contributor-guide.md
	@echo >> doc/contributor-guide.md
	@cat src/js/*.js | grep "//!" | cut -d! -f2- | cut -d\  -f2- >> doc/contributor-guide.md

doc: doc-api doc-contrib

sync-android:
	@rsync -qrv git_modules/android_iap/v3/src/android/ src/android
	@cp git_modules/android_iap/v3/www/inappbilling.js src/js/android.js

clean:
	@find . -name '*~' -exec rm '{}' ';'
