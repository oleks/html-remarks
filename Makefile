CPPFLAGS=-Werror \
	-Wall \
	-pedantic
TSCFLAGS=--strict \
	--noImplicitAny \
	--noImplicitThis \
	--noUnusedLocals \
	--noUnusedParameters \
	--noImplicitReturns \
	--noFallthroughCasesInSwitch
GITHUB_PATH=$(shell ./scripts/github-path.sh)
COMMIT_ID=$(shell git rev-parse HEAD)
COMMIT_SHORT_ID=$(shell git rev-parse --short HEAD)
COMMIT_DATE=$(shell git log -1 --format=%cd --date=iso | cut -d' ' -f1)

all: remarks.html

remarks.html: remarks.tmpl.html LICENSE remarks.css remarks.js Makefile
	cpp $(CPPFLAGS) \
	  -D"GITHUB_PATH=$(GITHUB_PATH)" \
	  -D"GITHUB_HREF=\"https://github.com/$(GITHUB_PATH)\"" \
	  -D"COMMIT_SHORT_ID=$(COMMIT_SHORT_ID)" \
	  -D"COMMIT_DATE=$(COMMIT_DATE)" \
	  -D"COMMIT_HREF=\"https://github.com/$(GITHUB_PATH)/commit/$(COMMIT_ID)\"" \
	  -P $< $@

remarks.js: remarks.ts Makefile
	tsc $(TSCFLAGS) $<

clean:
	rm -f *.js
	rm -f remarks.html
