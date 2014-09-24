lint: check-jshint
	@node_modules/.bin/jshint www/*.js

run-test:
	@./test/run.sh cc.fovea.babygoo babygooinapp1

all: lint run-test
	@echo 'ok'

check-jshint:
	@test -e node_modules/.bin/jshint || ( echo 'Please install dependencies: npm install'; exit 1 )

clean:
	@find . -name '*~' -exec rm '{}' ';'
