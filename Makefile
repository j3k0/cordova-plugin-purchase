NODE_MODULES?=node_modules
help:
	@echo ""
	@echo "Usage: make <target>"
	@echo ""
	@echo "available targets:"
	@echo "    build ............. Generate javascript files for iOS and Android."
	@echo "    tests ............. Run all tests."
	@echo "    test-js ........... Test javascript files for errors."
	@echo "    test-js-coverage .. Test javascript with coverage information."
	@echo "    test-install ...... Test plugin installation on iOS and Android."
	@echo "    doc-api ........... Generate API documentation into doc/api.md"
	@echo "    doc-contrib ....... Generate Contributor Guide into doc/contributor-guide.md"
	@echo "    clean ............. Cleanup the project (temporary and generated files)."
	@echo ""
	@echo "extra targets"
	@echo "    all ............ Generate javascript files and documentation"
	@echo ""
	@echo "(c)2014-2019, Jean-Christophe Hoelt <hoelt@fovea.cc>"
	@echo ""

all: build doc

build: sync-android test-js
	@echo "- Preprocess"
	@${NODE_MODULES}/.bin/preprocess src/js/store-ios.js src/js > www/store-ios.js
	@${NODE_MODULES}/.bin/preprocess src/js/store-android.js src/js > www/store-android.js
	@${NODE_MODULES}/.bin/preprocess src/js/store-windows.js src/js > www/store-windows.js
	@echo "- Done"
	@echo ""

prepare-test-js:
	@mkdir -p test/tmp
	@${NODE_MODULES}/.bin/preprocess src/js/store-test.js src/js > test/tmp/store-test.js
	@cp src/js/platforms/*-adapter.js test/tmp/
	@#${NODE_MODULES}/.bin/istanbul instrument --no-compact --output test/tmp/store-test.js test/store-test-src.js

jshint: check-jshint sync-android
	@echo "- JSHint"
	@${NODE_MODULES}/.bin/jshint --config .jshintrc src/js/*.js src/js/platforms/*.js test/js/*.js src/windows/*.js

eslint: jshint
	@echo "- ESLint"
	@${NODE_MODULES}/.bin/eslint --config .eslintrc src/js/*.js src/js/platforms/*.js test/js/*.js src/windows/*.js

eslint-fix:
	@echo "- ESLint Fix"
	@${NODE_MODULES}/.bin/eslint --fix --config .eslintrc src/js/*.js src/js/platforms/*.js test/js/*.js

test-js: jshint eslint prepare-test-js
	@echo "- Mocha"
	@${NODE_MODULES}/.bin/istanbul test --root test/tmp test/js/run.js
	@echo

test-js-coverage: jshint eslint prepare-test-js
	@echo "- Mocha / Instanbul"
	@${NODE_MODULES}/.bin/istanbul cover --root test/ test/js/run.js
	@${NODE_MODULES}/.bin/coveralls < coverage/lcov.info

test-install: build
	@./test/run.sh cc.fovea.babygoo babygooinapp1

tests: test-js test-install
	@echo 'ok'

check-jshint:
	@test -e "${NODE_MODULES}/.bin/jshint" || ( echo "${NODE_MODULES} not found."; echo 'Please install dependencies: npm install'; exit 1 )

doc-api: test-js
	@echo "# API Documentation" > doc/api.md
	@echo >> doc/api.md
	@echo "*(generated from source files using \`make doc-api)\`*" >> doc/api.md
	@echo >> doc/api.md
	@cat test/tmp/store-test.js | grep "///" | cut -d/ -f4- | cut -d\  -f2- >> doc/api.md

doc-contrib: test-js
	@echo "# Contributor Guide" > doc/contributor-guide.md
	@echo >> doc/contributor-guide.md
	@echo "*(generated from source files using \`make doc-contrib)\`*" >> doc/contributor-guide.md
	@echo >> doc/contributor-guide.md
	@cat src/js/*.js src/js/platforms/*.js | grep "//!" | cut -d! -f2- | cut -d\  -f2- >> doc/contributor-guide.md

doc: doc-api doc-contrib

sync-android:
	@#rsync -qrv git_modules/android_iap/v3/src/android/ src/android
	@#cp git_modules/android_iap/v3/www/inappbilling.js src/js/platforms/android-bridge.js

clean:
	@find . -name '*~' -exec rm '{}' ';'
