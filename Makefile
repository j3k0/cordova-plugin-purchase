lint: check-jshint
	@jshint *.js

test:
	@./test/run.sh

all: lint test
	@echo 'ok'

check-jshint:
	@which jshint > /dev/null || ( echo 'Please Install JSHint, npm install -g jshint'; exit 1 )

clean:
	@find . -name '*~' -exec rm '{}' ';'
