.PHONY: all clean

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

all: output/remarks.html

output/remarks.html: \
		remarks.tmpl.html remarks.css \
		output/remarks.js \
		Makefile LICENSE
	cpp $(CPPFLAGS) \
	  -D"GITHUB_PATH=$(GITHUB_PATH)" \
	  -D"GITHUB_HREF=\"https://github.com/$(GITHUB_PATH)\"" \
	  -D"COMMIT_SHORT_ID=$(COMMIT_SHORT_ID)" \
	  -D"COMMIT_DATE=$(COMMIT_DATE)" \
	  -D"COMMIT_HREF=\"https://github.com/$(GITHUB_PATH)/commit/$(COMMIT_ID)\"" \
	  -P $< $@

output/remarks.js: remarks.ts Makefile
	mkdir -p output
	tsc $(TSCFLAGS) --outDir output $<

clean:
	rm -rf output
