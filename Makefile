NODE_MODULES?=node_modules

help:
	@echo ""
	@echo "Usage: make <target>"
	@echo ""
	@echo "available targets:"
	@echo "    build ............. Generate javascript files for iOS and Android."
	@#echo "    tests ............. Run all tests."
	@#echo "    test-js ........... Test javascript files for errors."
	@#echo "    test-js-coverage .. Test javascript with coverage information."
	@#echo "    test-install ...... Test plugin installation on iOS and Android."
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

build: javalint check-tsc compile test-js

compile:
	@echo "- Compiling TypeScript"
	@${NODE_MODULES}/.bin/tsc

# for backward compatibility
proprocess: compile

prepare-test-js:
	@mkdir -p test/tmp
	@#${NODE_MODULES}/.bin/preprocess src/js/store-test.js src/js > test/tmp/store-test.js
	@#cp src/js/platforms/*-adapter.js test/tmp/
	@#${NODE_MODULES}/.bin/istanbul instrument --no-compact --output test/tmp/store-test.js test/store-test-src.js

test-js: prepare-test-js
	@#echo "- Mocha"
	@#${NODE_MODULES}/.bin/istanbul test --root test/tmp test/js/run.js

# test-js-coverage: prepare-test-js
# 	@echo "- Mocha / Instanbul"
# 	@${NODE_MODULES}/.bin/istanbul cover --root test/ test/js/run.js
# 	@${NODE_MODULES}/.bin/coveralls < coverage/lcov.info
# 	@echo "  Done"
# 	@echo ""

.checkstyle.jar:
	curl "https://github.com/checkstyle/checkstyle/releases/download/checkstyle-10.3.4/checkstyle-10.3.4-all.jar" -o .checkstyle.jar -L

javalint: .checkstyle.jar
	java -jar .checkstyle.jar -c /google_checks.xml src/android/cc/fovea/PurchasePlugin.java

test-install: build
	@./test/run.sh cc.fovea.babygoo babygooinapp1

tests: test-js test-install
	@echo 'ok'

check-tsc:
	@test -e "${NODE_MODULES}/.bin/tsc" || ( echo "${NODE_MODULES} not found."; echo 'Please install dependencies: npm install'; exit 1 )

doc-api: build
	@echo "- Generating doc/api.md"
	@echo "# API Documentation" > doc/api.md
	@echo >> doc/api.md
	@echo "*(generated from source files using \`make doc-api)\`*" >> doc/api.md
	@echo >> doc/api.md
	@cat www/store.js | grep -E "[\w^]//:" | cut -d: -f2- | cut -d\  -f2- >> doc/api.md

doc-contrib: build
	@echo "- Generating doc/contributor-guide.md"
	@echo "# Contributor Guide" > doc/contributor-guide.md
	@echo >> doc/contributor-guide.md
	@echo "*(generated from source files using \`make doc-contrib)\`*" >> doc/contributor-guide.md
	@echo >> doc/contributor-guide.md
	@cat www/store.js | grep -E "[\w^]//!" | cut -d! -f2- | cut -d\  -f2- >> doc/contributor-guide.md

doc: doc-api doc-contrib

clean:
	@find . -name '*~' -exec rm '{}' ';'

todo:
	@grep -rE "TODO|XXX" src/ts src/android src/ios src/windows
