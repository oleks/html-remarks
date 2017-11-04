CPPFLAGS=-Wall -pedantic -Werror
TSCFLAGS=--strict \
	--noImplicitAny \
	--noImplicitThis \
	--noUnusedLocals \
	--noUnusedParameters \
	--noImplicitReturns \
	--noFallthroughCasesInSwitch

all: remarks.html

remarks.html: remarks.tmpl.html LICENSE remarks.css remarks.js Makefile
	cpp $(CPPFLAGS) -P $< $@

remarks.js: remarks.ts Makefile
	tsc $(TSCFLAGS) $<

clean:
	rm *.js
	rm remarks.html
