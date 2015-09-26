fontname = $(FONTNAME)

$(fontname).css: $(shell find src -type f -name '*.svg')
	fontcustom compile src/ -n $(fontname) -o . --no-hash --quiet --templates=preview css 

.PHONY: clean
clean:
	-rm $(fontname)*

.FORCE: