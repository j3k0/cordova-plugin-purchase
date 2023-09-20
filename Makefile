NODE_MODULES?=node_modules

.PHONY: clean help all build compile typedoc typedoc-dev doc doc-contrib doc-api javalint todo

help:
	@echo ""
	@echo "Usage: make <target>"
	@echo ""
	@echo "available targets:"
	@echo "    all ............... Test and generate everything."
	@echo "    build ............. Generate and test javascript files for iOS and Android."
	@echo "    test .............. Run unit tests."
	@echo "    doc ............... Generate the documentation."
	@echo "    javalint .......... Check the syntax of java code."
	@echo "    clean ............. Cleanup the project (temporary and generated files)."
	@echo ""
	@echo "extra targets"
	@echo "    todo .............. Find TODO in the code."
	@echo "    typedoc ........... Generate public API reference into api/"
	@echo "    typedoc-dev ....... Generate developer API reference into api-dev/"
	@echo "    compile ........... Just compile the typescript code into javascript"
	@echo ""
	@echo "(c)2014-, Jean-Christophe Hoelt <hoelt@fovea.cc>"
	@echo ""

	@#echo "    tests ............. Run all tests."
	@#echo "    test-js ........... Test javascript files for errors."
	@#echo "    test-js-coverage .. Test javascript with coverage information."
	@#echo "    test-install ...... Test plugin installation on iOS and Android."

all: build doc

build: compile
	@make tests

compile:
	@make check-tsc
	@echo "- Compiling TypeScript"
	@${NODE_MODULES}/.bin/tsc

# for backward compatibility for older scripts
proprocess: compile

test-js:
	@npm test

.checkstyle.jar:
	curl "https://github.com/checkstyle/checkstyle/releases/download/checkstyle-10.3.4/checkstyle-10.3.4-all.jar" -o .checkstyle.jar -L

javalint: .checkstyle.jar
	java -jar .checkstyle.jar -c /google_checks.xml src/android/cc/fovea/PurchasePlugin.java

tests: test-js javalint

check-tsc:
	@test -e "${NODE_MODULES}/.bin/tsc" || ( echo "${NODE_MODULES} not found."; echo 'Please install dependencies: npm install'; exit 1 )

typedoc:
	@echo "- Updating api/"
	@npm run typedoc

typedoc-dev:
	@echo "- Updating api-dev/"
	@npm run typedoc-dev

doc: typedoc typedoc-dev

clean:
	@find . -name '*~' -exec rm '{}' ';'

todo:
	@grep -rE "TODO|XXX" src/ts src/android src/ios src/windows
