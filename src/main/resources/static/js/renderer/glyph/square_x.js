(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "renderer/properties", "./marker"], function(_, Properties, Marker) {
    var SquareX, SquareXView, _ref, _ref1;
    SquareXView = (function(_super) {
      __extends(SquareXView, _super);

      function SquareXView() {
        _ref = SquareXView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      SquareXView.prototype._properties = ['line', 'fill'];

      SquareXView.prototype._render = function(ctx, indices, glyph_props, sx, sy, size) {
        var i, r, _i, _len, _results;
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
            r = size[i] / 2;
            ctx.moveTo(-r, +r);
            ctx.lineTo(+r, -r);
            ctx.moveTo(-r, -r);
            ctx.lineTo(+r, +r);
            ctx.stroke();
          }
          _results.push(ctx.translate(-sx[i], -sy[i]));
        }
        return _results;
      };

      return SquareXView;

    })(Marker.View);
    SquareX = (function(_super) {
      __extends(SquareX, _super);

      function SquareX() {
        _ref1 = SquareX.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      SquareX.prototype.default_view = SquareXView;

      SquareX.prototype.type = 'Glyph';

      SquareX.prototype.display_defaults = function() {
        return _.extend(SquareX.__super__.display_defaults.call(this), {
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

      return SquareX;

    })(Marker.Model);
    return {
      "Model": SquareX,
      "View": SquareXView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=square_x.js.map
*/