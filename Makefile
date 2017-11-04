CPPFLAGS=-Wall -pedantic -Werror

all: tsremarks.html

tsremarks.html: tsremarks.tmpl.html LICENSE remarks.css remarks.js Makefile
	cpp $(CPPFLAGS) -P $< $@

%.js: %.ts Makefile
	tsc --strict $<

clean:
	rm remarks.js
	rm tsremarks.html
