(function () {
  var _ = this._ || require('underscore');
  var Backbone = this.Backbone || require('backbone');
  var $ = this.jQuery || require('jquery');
  Backbone.$ = $;
  $.fn.hammer || require('jquery-hammer');
  //$.fn.scrollTo || require('jquery-scrollto');

  var has3d = (function(){
      var el = document.createElement('p'),
      has3d,
      transforms = {
          'webkitTransform':'-webkit-transform',
          'OTransform':'-o-transform',
          'msTransform':'-ms-transform',
          'MozTransform':'-moz-transform',
          'transform':'transform'
      };

      // Add it to the body to get the computed style
      document.body.insertBefore(el, null);

      for(var t in transforms){
        if (transforms.hasOwnProperty(t)) {
          if( el.style[t] !== undefined ){
              el.style[t] = 'translate3d(1px,1px,1px)';
              has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
            }
          }
      }

      document.body.removeChild(el);

      return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
  }());

  var CarouselView = this.CarouselView || require('carouselview');
  var Carousel = CarouselView.extend({
    initialize: function (options) {
      options || (options = {});
      _.defaults(options, {
        duration: 300,
        autoprevnext: true,
        offset: {left: 0, top: 0},
        cb: function () {}
      });
      this.options = options;

      CarouselView.prototype.initialize.apply(this, arguments);

      this.$in = this.$el.find('>.in');

      this.$el.addClass('carouselscrollview');
      setTimeout(function () {
        console.log('toto');

        this.frozedims();

        if (options.prev) {
          this.$prev.hammer().on('tap', this.prev.bind(this));
        }
        if (options.next) {
          this.$next.hammer().on('tap', this.next.bind(this));
        }

        var toggleDisable = function (index) {
          this.$prev && this.$prev.toggleClass('disabled', (index <=0));
          this.$next && this.$next.toggleClass('disabled', (index+1 >= this.$items.length));
        };
        toggleDisable = toggleDisable.bind(this);
        toggleDisable(this.currentIndex);

        if (options.pagesNav && options.pagesNav.length) {
          var $pagesNav = $(options.pagesNav);

          $pagesNav.hammer().on('tap', function (e) {
            e.gesture && e.gesture.srcEvent && e.gesture.srcEvent.preventDefault();
            e.gesture && e.gesture.srcEvent && e.gesture.srcEvent.stopPropagation();

            var index = $pagesNav.index(e.currentTarget);

            this.go(index);
          }.bind(this));
        }

        this.on('carouselchange', function () {
          //console.log('carouselchange', this);

          this.scrollto(this.$nth(this.currentIndex));
          
          toggleDisable(this.currentIndex);

          // pages nav
          if (options.pagesNav && options.pagesNav.length) {
            var $pagesNav = $(options.pagesNav);

            $pagesNav.removeClass('active').eq(this.currentIndex).addClass('active');
          }

        }.bind(this));

        // auto prev/next
        (function () {
          if (this.options.autoprevnext !== true) return;

          if (this.$el.length <= 0) return;

          var w;
          var left;
          var setW = function () {
            w = this.$el.width();
            left = this.$el.offset().left;
          };
          setW = setW.bind(this);

          $(window).on('resize', _.debounce(function () {setW();}, 200));
          setW();

          this.$el.hammer().on('tap', function (e) {
            //console.log('tap', e.gesture.center.x, e.gesture.srcEvent.pageX)
            e.stopPropagation();

            var x = e.gesture.center.x - left;

            if (x > w/2) {
              this.next();
            } else {
              this.prev();
            }
          }.bind(this));
        }).call(this);

        // resize
        $(window).on('resize orientationchange', _.debounce(function () {
          this.unfrozedims();
          setTimeout(function () {
            this.frozedims();
          }.bind(this), 0);
        }.bind(this), 200));

        //this.$items.css('pointer-events', 'none');
        this.$el.hammer({velocity: .5})
          .on('swipeleft', this.next.bind(this))
          .on('swiperight', this.prev.bind(this))
          ;

        //this.go(0);

        this.options.cb(null);
      }.bind(this), 0);
    },
    unfrozedims: function () {
      this.$el[0].style.cssText = this.$el.data('original-cssText');
      this.$in[0].style.cssText = this.$in.data('original-cssText');
      this.$items.each(function (i, el) {
        var $el = $(el);
        el.style.cssText = $el.data('original-cssText');
      });
    },
    frozedims: function() {
      console.log('frozedims');

      (function () {
        var w = this.$el.outerWidth(true);

        this.$el.data('original-cssText') || (this.$el.data('original-cssText', this.$el[0].style.cssText));
        this.$el.css('width', w+'px');
      }).call(this);

      var W = 0;
      this.$items.each(function (i, el) {
        var $el = $(el);
        outerw = $el.outerWidth(true);
        innerw = $el.width();

        $el.data('original-cssText') || ($el.data('original-cssText', $el[0].style.cssText));
        $el.css('width', innerw+'px');

        W += outerw;
      });

      this.$in.data('original-cssText') || (this.$in.data('original-cssText', this.$in[0].style.cssText));
      this.$in.css('width', W);

      setTimeout(function () {
        this.trigger('frozedims');
      }.bind(this), 0)
    },
    scrollto: function (el) {
      console.log('scroll', this.options);

      var $el = $(el);
      el = $el[0];

      if (!el) return;

      var tx = $el.offset().left - this.$in.offset().left + this.options.offset.left;
      tx = Math.max(tx, 0);
      tx = Math.min(tx, (parseInt(this.$in.css('width'), 10) - parseInt(this.$el.css('width'), 10)));

      if (has3d) {
        this.$in.css('transform', 'translateX(-' + tx + 'px)');
      } else {
        this.$in.css('transform', 'translate3d(-' + tx + 'px,0,0)');  
      }
      
    }
  });

  this.CarouselScrollView = Carousel;
  if (typeof module !== "undefined" && module !== null) {
    module.exports = this.CarouselScrollView;
  }
}).call(this);