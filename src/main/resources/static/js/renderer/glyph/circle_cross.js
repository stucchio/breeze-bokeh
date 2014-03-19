(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "renderer/properties", "./marker"], function(_, Properties, Marker) {
    var CircleCross, CircleCrossView, _ref, _ref1;
    CircleCrossView = (function(_super) {
      __extends(CircleCrossView, _super);

      function CircleCrossView() {
        _ref = CircleCrossView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      CircleCrossView.prototype._properties = ['line', 'fill'];

      CircleCrossView.prototype._render = function(ctx, indices, glyph_props, sx, sy, size) {
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
          ctx.beginPath();
          r = size[i] / 2;
          ctx.arc(sx[i], sy[i], r, 0, 2 * Math.PI, false);
          if (glyph_props.fill_properties.do_fill) {
            glyph_props.fill_properties.set_vectorize(ctx, i);
            ctx.fill();
          }
          if (glyph_props.line_properties.do_stroke) {
            glyph_props.line_properties.set_vectorize(ctx, i);
            ctx.moveTo(sx[i], sy[i] + r);
            ctx.lineTo(sx[i], sy[i] - r);
            ctx.moveTo(sx[i] - r, sy[i]);
            ctx.lineTo(sx[i] + r, sy[i]);
            _results.push(ctx.stroke());
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      return CircleCrossView;

    })(Marker.View);
    CircleCross = (function(_super) {
      __extends(CircleCross, _super);

      function CircleCross() {
        _ref1 = CircleCross.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      CircleCross.prototype.default_view = CircleCrossView;

      CircleCross.prototype.type = 'Glyph';

      CircleCross.prototype.display_defaults = function() {
        return _.extend(CircleCross.__super__.display_defaults.call(this), {
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

      return CircleCross;

    })(Marker.Model);
    return {
      "Model": CircleCross,
      "View": CircleCrossView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=circle_cross.js.map
*/