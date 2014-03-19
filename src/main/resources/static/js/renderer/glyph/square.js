(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "renderer/properties", "./marker"], function(_, Properties, Marker) {
    var Square, SquareView, _ref, _ref1;
    SquareView = (function(_super) {
      __extends(SquareView, _super);

      function SquareView() {
        _ref = SquareView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      SquareView.prototype._properties = ['line', 'fill'];

      SquareView.prototype._render = function(ctx, indices, glyph_props, sx, sy, size) {
        var i, _i, _len, _results;
        if (sx == null) {
          sx = this.sx;
        }
        if (sy == null) {
          sy = this.sy;
        }
        if (size == null) {
          size = this.size;
        }
        _results = [];
        for (_i = 0, _len = indices.length; _i < _len; _i++) {
          i = indices[_i];
          if (isNaN(sx[i] + sy[i] + size[i])) {
            continue;
          }
          ctx.translate(sx[i], sy[i]);
          ctx.beginPath();
          ctx.rect(-size[i] / 2, -size[i] / 2, size[i], size[i]);
          if (glyph_props.fill_properties.do_fill) {
            glyph_props.fill_properties.set_vectorize(ctx, i);
            ctx.fill();
          }
          if (glyph_props.line_properties.do_stroke) {
            glyph_props.line_properties.set_vectorize(ctx, i);
            ctx.stroke();
          }
          _results.push(ctx.translate(-sx[i], -sy[i]));
        }
        return _results;
      };

      return SquareView;

    })(Marker.View);
    Square = (function(_super) {
      __extends(Square, _super);

      function Square() {
        _ref1 = Square.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      Square.prototype.default_view = SquareView;

      Square.prototype.type = 'Glyph';

      Square.prototype.display_defaults = function() {
        return _.extend(Square.__super__.display_defaults.call(this), {
          size_units: 'screen',
          fill_color: 'gray',
          fill_alpha: 1.0,
          line_color: 'red',
          line_width: 1,
          line_alpha: 1.0,
          line_join: 'miter',
          line_cap: 'butt',
          line_dash: [],
          line_dash_offset: 0
        });
      };

      return Square;

    })(Marker.Model);
    return {
      "Model": Square,
      "View": SquareView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=square.js.map
*/