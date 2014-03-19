(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "renderer/properties", "./glyph"], function(_, Properties, Glyph) {
    var Patches, PatchesView, _ref, _ref1;
    PatchesView = (function(_super) {
      __extends(PatchesView, _super);

      function PatchesView() {
        _ref = PatchesView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      PatchesView.prototype._fields = ['xs', 'ys'];

      PatchesView.prototype._properties = ['line', 'fill'];

      PatchesView.prototype._map_data = function() {
        return null;
      };

      PatchesView.prototype._render = function(ctx, indices, glyph_props) {
        var i, j, sx, sy, _i, _j, _k, _len, _ref1, _ref2, _ref3, _results;
        ctx = this.plot_view.ctx;
        _results = [];
        for (_i = 0, _len = indices.length; _i < _len; _i++) {
          i = indices[_i];
          _ref1 = this.plot_view.map_to_screen(this.xs[i], glyph_props.xs.units, this.ys[i], glyph_props.ys.units), sx = _ref1[0], sy = _ref1[1];
          if (glyph_props.fill_properties.do_fill) {
            glyph_props.fill_properties.set_vectorize(ctx, i);
            for (j = _j = 0, _ref2 = sx.length; 0 <= _ref2 ? _j < _ref2 : _j > _ref2; j = 0 <= _ref2 ? ++_j : --_j) {
              if (j === 0) {
                ctx.beginPath();
                ctx.moveTo(sx[j], sy[j]);
                continue;
              } else if (isNaN(sx[j] + sy[j])) {
                ctx.closePath();
                ctx.fill();
                ctx.beginPath();
                continue;
              } else {
                ctx.lineTo(sx[j], sy[j]);
              }
            }
            ctx.closePath();
            ctx.fill();
          }
          if (glyph_props.line_properties.do_stroke) {
            glyph_props.line_properties.set_vectorize(ctx, i);
            for (j = _k = 0, _ref3 = sx.length; 0 <= _ref3 ? _k < _ref3 : _k > _ref3; j = 0 <= _ref3 ? ++_k : --_k) {
              if (j === 0) {
                ctx.beginPath();
                ctx.moveTo(sx[j], sy[j]);
                continue;
              } else if (isNaN(sx[j] + sy[j])) {
                ctx.closePath();
                ctx.stroke();
                ctx.beginPath();
                continue;
              } else {
                ctx.lineTo(sx[j], sy[j]);
              }
            }
            ctx.closePath();
            _results.push(ctx.stroke());
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      PatchesView.prototype.draw_legend = function(ctx, x0, x1, y0, y1) {
        return this._generic_area_legend(ctx, x0, x1, y0, y1);
      };

      return PatchesView;

    })(Glyph.View);
    Patches = (function(_super) {
      __extends(Patches, _super);

      function Patches() {
        _ref1 = Patches.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      Patches.prototype.default_view = PatchesView;

      Patches.prototype.type = 'Glyph';

      Patches.prototype.display_defaults = function() {
        return _.extend(Patches.__super__.display_defaults.call(this), {
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

      return Patches;

    })(Glyph.Model);
    return {
      "Model": Patches,
      "View": PatchesView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=patches.js.map
*/