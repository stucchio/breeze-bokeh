(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "renderer/properties", "./marker"], function(_, Properties, Marker) {
    var InvertedTriangle, InvertedTriangleView, _ref, _ref1;
    InvertedTriangleView = (function(_super) {
      __extends(InvertedTriangleView, _super);

      function InvertedTriangleView() {
        _ref = InvertedTriangleView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      InvertedTriangleView.prototype._fields = ['x', 'y', 'size'];

      InvertedTriangleView.prototype._properties = ['line', 'fill'];

      InvertedTriangleView.prototype._render = function(ctx, indices, glyph_props, sx, sy, size) {
        var a, h, i, r, _i, _len, _results;
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
          a = size[i] * Math.sqrt(3) / 6;
          r = size[i] / 2;
          h = size[i] * Math.sqrt(3) / 2;
          ctx.beginPath();
          ctx.moveTo(sx[i] - r, sy[i] - a);
          ctx.lineTo(sx[i] + r, sy[i] - a);
          ctx.lineTo(sx[i], sy[i] - a + h);
          ctx.closePath();
          if (glyph_props.fill_properties.do_fill) {
            glyph_props.fill_properties.set_vectorize(ctx, i);
            ctx.fill();
          }
          if (glyph_props.line_properties.do_stroke) {
            glyph_props.line_properties.set_vectorize(ctx, i);
            _results.push(ctx.stroke());
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      return InvertedTriangleView;

    })(Marker.View);
    InvertedTriangle = (function(_super) {
      __extends(InvertedTriangle, _super);

      function InvertedTriangle() {
        _ref1 = InvertedTriangle.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      InvertedTriangle.prototype.default_view = InvertedTriangleView;

      InvertedTriangle.prototype.type = 'Glyph';

      InvertedTriangle.prototype.display_defaults = function() {
        return _.extend(InvertedTriangle.__super__.display_defaults.call(this), {
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

      return InvertedTriangle;

    })(Marker.Model);
    return {
      "Model": InvertedTriangle,
      "View": InvertedTriangleView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=inverted_triangle.js.map
*/