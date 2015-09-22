(function () {
  var _ = this._ || require('underscore');
  var Backbone = this.Backbone || require('backbone');
  var $ = this.jQuery || require('jquery');
  Backbone.$ = $;
  $.fn.hammer || require('jquery-hammer');
  $.fn.scrollTo || require('jquery-scrollto');

  var CarouselView = this.CarouselView || require('carouselview');
  var Carousel = CarouselView.extend({
    initialize: function (options) {
      options || (options = {});
      _.defaults(options, {
        duration: 300,
        autoprevnext: true,
        offset: {left: 0, top: 0}
      });
      this.options = options;

      CarouselView.prototype.initialize.apply(this, arguments);

      this.$el.addClass('carouselscrollview');

      if (options.prev) {
        this.$prev.hammer().on('tap', this.prev.bind(this));
      }
      if (options.next) {
        this.$next.hammer().on('tap', this.next.bind(this));
      }

      this.$ul = this.$el;

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
        this.scrollto(this.$nth(this.currentIndex));
      }.bind(this), 200));

      //this.$items.css('pointer-events', 'none');
      this.$el.hammer({velocity: .5})
        .on('swipeleft', this.next.bind(this))
        .on('swiperight', this.prev.bind(this))
        ;

      //this.go(0);
    },
    scrollto: function (el) {
      //console.log('scroll', this.options);

      var $el = $(el);
      el = $el[0];

      if (!el) return;

      this.$ul.stop(true, true).scrollTo(el, this.options.duration, {offset: this.options.offset});

    }
  });

  this.CarouselScrollView = Carousel;
  if (typeof module !== "undefined" && module !== null) {
    module.exports = this.CarouselScrollView;
  }
}).call(this);