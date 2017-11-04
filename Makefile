CPPFLAGS=-Wall -pedantic -Werror
TSCFLAGS=--strict \
	--noImplicitAny \
	--noImplicitThis \
	--noUnusedLocals \
	--noUnusedParameters \
	--noImplicitReturns \
	--noFallthroughCasesInSwitch

all: tsremarks.html

tsremarks.html: tsremarks.tmpl.html LICENSE remarks.css remarks.js Makefile
	cpp $(CPPFLAGS) -P $< $@

%.js: %.ts Makefile
	tsc $(TSCFLAGS) $<

clean:
	rm remarks.js
	rm tsremarks.html
