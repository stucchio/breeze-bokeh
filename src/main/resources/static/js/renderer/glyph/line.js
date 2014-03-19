(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "renderer/properties", "./glyph"], function(_, Properties, Glyph) {
    var Line, LineView, _ref, _ref1;
    LineView = (function(_super) {
      __extends(LineView, _super);

      function LineView() {
        _ref = LineView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      LineView.prototype._fields = ['x', 'y'];

      LineView.prototype._properties = ['line'];

      LineView.prototype._map_data = function() {
        var _ref1;
        return _ref1 = this.plot_view.map_to_screen(this.x, this.glyph_props.x.units, this.y, this.glyph_props.y.units), this.sx = _ref1[0], this.sy = _ref1[1], _ref1;
      };

      LineView.prototype._render = function(ctx, indices, glyph_props) {
        var drawing, i, _i, _len;
        drawing = false;
        glyph_props.line_properties.set(ctx, glyph_props);
        for (_i = 0, _len = indices.length; _i < _len; _i++) {
          i = indices[_i];
          if (isNaN(this.sx[i] + this.sy[i]) && drawing) {
            ctx.stroke();
            ctx.beginPath();
            drawing = false;
            continue;
          }
          if (drawing) {
            ctx.lineTo(this.sx[i], this.sy[i]);
          } else {
            ctx.beginPath();
            ctx.moveTo(this.sx[i], this.sy[i]);
            drawing = true;
          }
        }
        if (drawing) {
          return ctx.stroke();
        }
      };

      LineView.prototype.draw_legend = function(ctx, x0, x1, y0, y1) {
        return this._generic_line_legend(ctx, x0, x1, y0, y1);
      };

      return LineView;

    })(Glyph.View);
    Line = (function(_super) {
      __extends(Line, _super);

      function Line() {
        _ref1 = Line.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      Line.prototype.default_view = LineView;

      Line.prototype.type = 'Glyph';

      Line.prototype.display_defaults = function() {
        return _.extend(Line.__super__.display_defaults.call(this), {
          line_color: 'red',
          line_width: 1,
          line_alpha: 1.0,
          line_join: 'miter',
          line_cap: 'butt',
          line_dash: [],
          line_dash_offset: 0
        });
      };

      return Line;

    })(Glyph.Model);
    return {
      "Model": Line,
      "View": LineView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=line.js.map
*/