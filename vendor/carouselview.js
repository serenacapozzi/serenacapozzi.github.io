(function () {
  var _ = this._ || require('underscore');
  var $ = this.jQuery || require('jquery');
  var Backbone = this.Backbone || require('backbone');
  Backbone.$ = $;
  
  var CarouselView = Backbone.View.extend({
    initialize: function (options) {
      this.options = options;

      if (_.has(options, 'prev')) {
        this.$prev = $(options.prev);
      }
      if (_.has(options, 'next')) {
        this.$next = $(options.next);
      }

      this.$el.addClass('carousel');

      this.$items = options.items && this.$(options.items) || this.$el.find('>*');

      this.l = options.max || this.$items.length;
      this.step = options.step || 1;

      var currentIndex = (this.$items.index('.active') - 1);
      if (currentIndex < 0) {currentIndex = 0;}

      this.currentIndex = currentIndex;

      /*if (this.$next) {
        this.$next.click(this.next.bind(this));
      }
      if (this.$prev) {
        this.$prev.click(this.prev.bind(this));
      }*/
    },
    $nth: function $nth(index) {
      return this.$items.eq(Math.abs(this.l+index)%this.l);
    },
    prev: function prev() {
      this.go(this.currentIndex-this.step);
    },
    next: function next() {
      this.go(this.currentIndex+this.step);
    },
    go: function go(index) {
      var dir;
      if (index >= this.currentIndex) {
        dir = 1;
      } else {
        dir = -1;
      }

      if (this.options.noloop === true) {
        index = Math.max(0, index);
        index = Math.min((this.l - 1), index);
      }
      this.currentIndex = index%this.l;
      console.log('currentIndex', this.currentIndex, this)

      this.$el.removeClass('forward backward').addClass(dir > 0 ? 'forward' : 'backward');

      this.$items.removeClass('active');
      this.$nth(this.currentIndex).addClass('active');

      this.trigger('carouselchange');
    }
  });

  this.CarouselView = CarouselView;
  if (typeof module !== "undefined" && module !== null) {
    module.exports = this.CarouselView;
  }
}).call(this);