(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["./continuum_view", "./safebind"], function(ContinuumView, safebind) {
    var PlotWidget, _ref;
    return PlotWidget = (function(_super) {
      __extends(PlotWidget, _super);

      function PlotWidget() {
        _ref = PlotWidget.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      PlotWidget.prototype.tagName = 'div';

      PlotWidget.prototype.initialize = function(options) {
        this.plot_model = options.plot_model;
        this.plot_view = options.plot_view;
        this._fixup_line_dash(this.plot_view.ctx);
        this._fixup_line_dash_offset(this.plot_view.ctx);
        this._fixup_image_smoothing(this.plot_view.ctx);
        this._fixup_measure_text(this.plot_view.ctx);
        return PlotWidget.__super__.initialize.call(this, options);
      };

      PlotWidget.prototype._fixup_line_dash = function(ctx) {
        if (!ctx.setLineDash) {
          ctx.setLineDash = function(dash) {
            ctx.mozDash = dash;
            return ctx.webkitLineDash = dash;
          };
        }
        if (!ctx.getLineDash) {
          return ctx.getLineDash = function() {
            return ctx.mozDash;
          };
        }
      };

      PlotWidget.prototype._fixup_line_dash_offset = function(ctx) {
        ctx.setLineDashOffset = function(dash_offset) {
          ctx.lineDashOffset = dash_offset;
          ctx.mozDashOffset = dash_offset;
          return ctx.webkitLineDashOffset = dash_offset;
        };
        return ctx.getLineDashOffset = function() {
          return ctx.mozDashOffset;
        };
      };

      PlotWidget.prototype._fixup_image_smoothing = function(ctx) {
        ctx.setImageSmoothingEnabled = function(value) {
          ctx.imageSmoothingEnabled = value;
          ctx.mozImageSmoothingEnabled = value;
          ctx.oImageSmoothingEnabled = value;
          return ctx.webkitImageSmoothingEnabled = value;
        };
        return ctx.getImageSmoothingEnabled = function() {
          var _ref1;
          return (_ref1 = ctx.imageSmoothingEnabled) != null ? _ref1 : true;
        };
      };

      PlotWidget.prototype._fixup_measure_text = function(ctx) {
        if (ctx.measureText && (ctx.html5MeasureText == null)) {
          ctx.html5MeasureText = ctx.measureText;
          return ctx.measureText = function(text) {
            var textMetrics;
            textMetrics = ctx.html5MeasureText(text);
            textMetrics.ascent = ctx.html5MeasureText("m").width * 1.6;
            return textMetrics;
          };
        }
      };

      PlotWidget.prototype.bind_bokeh_events = function() {};

      PlotWidget.prototype.request_render = function() {
        return this.plot_view.request_render();
      };

      return PlotWidget;

    })(ContinuumView.View);
  });

}).call(this);

/*
//@ sourceMappingURL=plot_widget.js.map
*/