TOP = $(shell pwd)

.PHONY: test
test:
	@NODE_PATH=lib ./node_modules/mocha/bin/mocha tests/*
