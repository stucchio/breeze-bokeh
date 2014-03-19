(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "renderer/properties", "./marker"], function(_, Properties, Marker) {
    var Diamond, DiamondView, _ref, _ref1;
    DiamondView = (function(_super) {
      __extends(DiamondView, _super);

      function DiamondView() {
        _ref = DiamondView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      DiamondView.prototype._properties = ['line', 'fill'];

      DiamondView.prototype._render = function(ctx, indices, glyph_props, sx, sy, size) {
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
          r = size[i] / 2;
          ctx.beginPath();
          ctx.moveTo(sx[i], sy[i] + r);
          ctx.lineTo(sx[i] + r, sy[i]);
          ctx.lineTo(sx[i], sy[i] - r);
          ctx.lineTo(sx[i] - r, sy[i]);
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

      return DiamondView;

    })(Marker.View);
    Diamond = (function(_super) {
      __extends(Diamond, _super);

      function Diamond() {
        _ref1 = Diamond.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      Diamond.prototype.default_view = DiamondView;

      Diamond.prototype.type = 'Glyph';

      Diamond.prototype.display_defaults = function() {
        return _.extend(Diamond.__super__.display_defaults.call(this), {
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

      return Diamond;

    })(Marker.Model);
    return {
      "Model": Diamond,
      "View": DiamondView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=diamond.js.map
*/