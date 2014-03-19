(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "renderer/properties", "./marker"], function(_, Properties, Marker) {
    var X, XView, _ref, _ref1;
    XView = (function(_super) {
      __extends(XView, _super);

      function XView() {
        _ref = XView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      XView.prototype._properties = ['line'];

      XView.prototype._render = function(ctx, indices, glyph_props, sx, sy, size) {
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
          ctx.moveTo(sx[i] - r, sy[i] + r);
          ctx.lineTo(sx[i] + r, sy[i] - r);
          ctx.moveTo(sx[i] - r, sy[i] - r);
          ctx.lineTo(sx[i] + r, sy[i] + r);
          if (glyph_props.line_properties.do_stroke) {
            glyph_props.line_properties.set_vectorize(ctx, i);
            _results.push(ctx.stroke());
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      return XView;

    })(Marker.View);
    X = (function(_super) {
      __extends(X, _super);

      function X() {
        _ref1 = X.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      X.prototype.default_view = XView;

      X.prototype.type = 'Glyph';

      X.prototype.display_defaults = function() {
        return _.extend(X.__super__.display_defaults.call(this), {
          line_color: 'red',
          line_width: 1,
          line_alpha: 1.0,
          line_join: 'miter',
          line_cap: 'butt',
          line_dash: [],
          line_dash_offset: 0
        });
      };

      return X;

    })(Marker.Model);
    return {
      "Model": X,
      "View": XView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=x.js.map
*/