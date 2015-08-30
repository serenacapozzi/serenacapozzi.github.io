#
# DONT TOUCH ;)
#

PROJECT = $(shell basename $(CURDIR))
ICONFONT = $(PROJECT)iconfont
ICONFONTPATH = public/fonts/$(PROJECT)iconfont/
ICONFONTCSS = $(ICONFONTPATH)/$(ICONFONT).css

all: package.json $(ICONFONTPATH) public/index.html public/index.css $(ICONFONTCSS) public/vendor

package.json:
	npm init
	npm install stylus --save

$(ICONFONTPATH):
	mkdir -p $@
	cp -rf tpl/iconfont/* $@

styles/index.styl:
	mkdir -p $(@D)
	cp tpl/index.styl $@

public/index.html:
	mkdir -p $(@D)
	cp tpl/index.html $@

public/index.css: ./node_modules/.bin/stylus styles/index.styl
	mkdir -p $(@D)
	./node_modules/.bin/stylus -o $@ styles/index.styl 

$(ICONFONTCSS): .FORCE
	$(MAKE) FONTNAME=$(PROJECT) -C $(ICONFONTPATH)

public/vendor/:
	mkdir -p $@
	cp -rf tpl/vendor/* $@

node_modules ./node_modules/%:
	npm install

.FORCE:

clean:
	-rm -Rf fonts public styles package.json node_modules

debug:
	echo $(PROJECT)
	echo $(ICONFONTPATH)
	echo $(PROJECT)