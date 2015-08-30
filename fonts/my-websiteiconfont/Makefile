fontname = $(FONTNAME)

$(fontname).css: .FORCE
	fontcustom compile src/ -n $(fontname) -o . --no-hash --quiet --templates=preview css 

.PHONY: clean
clean:
	-rm $(fontname)*

.FORCE: