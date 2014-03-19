(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "renderer/properties", "./marker"], function(_, Properties, Marker) {
    var Asterisk, AsteriskView, _ref, _ref1;
    AsteriskView = (function(_super) {
      __extends(AsteriskView, _super);

      function AsteriskView() {
        _ref = AsteriskView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      AsteriskView.prototype._properties = ['line'];

      AsteriskView.prototype._render = function(ctx, indices, glyph_props, sx, sy, size) {
        var i, r, r2, _i, _len, _results;
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
          r2 = r * 0.65;
          ctx.beginPath();
          ctx.moveTo(sx[i], sy[i] + r);
          ctx.lineTo(sx[i], sy[i] - r);
          ctx.moveTo(sx[i] - r, sy[i]);
          ctx.lineTo(sx[i] + r, sy[i]);
          ctx.moveTo(sx[i] - r2, sy[i] + r2);
          ctx.lineTo(sx[i] + r2, sy[i] - r2);
          ctx.moveTo(sx[i] - r2, sy[i] - r2);
          ctx.lineTo(sx[i] + r2, sy[i] + r2);
          if (glyph_props.line_properties.do_stroke) {
            glyph_props.line_properties.set_vectorize(ctx, i);
            _results.push(ctx.stroke());
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      return AsteriskView;

    })(Marker.View);
    Asterisk = (function(_super) {
      __extends(Asterisk, _super);

      function Asterisk() {
        _ref1 = Asterisk.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      Asterisk.prototype.default_view = AsteriskView;

      Asterisk.prototype.type = 'Glyph';

      Asterisk.prototype.display_defaults = function() {
        return _.extend(Asterisk.__super__.display_defaults.call(this), {
          line_color: 'red',
          line_width: 1,
          line_alpha: 1.0,
          line_join: 'miter',
          line_cap: 'butt',
          line_dash: [],
          line_dash_offset: 0
        });
      };

      return Asterisk;

    })(Marker.Model);
    return {
      "Model": Asterisk,
      "View": AsteriskView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=asterisk.js.map
*/