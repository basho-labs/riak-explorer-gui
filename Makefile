.PHONY: deps

all: compile
compile: deps
	-ember build
recompile:
	-ember build
deps:
	-npm install && bower install
test:
	ember test

mock-server:
	python tests/mock/server.py
