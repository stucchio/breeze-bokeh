(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["./continuum_view"], function(ContinuumView) {
    var PNGView, _ref;
    return PNGView = (function(_super) {
      __extends(PNGView, _super);

      function PNGView() {
        _ref = PNGView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      PNGView.prototype.initialize = function(options) {
        PNGView.__super__.initialize.call(this, options);
        this.thumb_x = options.thumb_x || 40;
        this.thumb_y = options.thumb_y || 40;
        this.render();
        return this;
      };

      PNGView.prototype.render = function() {
        var png;
        this.$el.html('');
        png = this.model.get('png');
        this.$el.append($("<p> " + (this.model.get('title')) + " </p>"));
        return this.$el.append($("<img modeltype='" + this.model.type + "' modelid='" + (this.model.get('id')) + "' class='pngview' width='" + this.thumb_x + "'  height='" + this.thumb_y + "'  src='" + png + "'/>"));
      };

      return PNGView;

    })(ContinuumView.View);
  });

}).call(this);

/*
//@ sourceMappingURL=png_view.js.map
*/