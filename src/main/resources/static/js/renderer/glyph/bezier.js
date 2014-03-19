(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "renderer/properties", "./glyph"], function(_, Properties, Glyph) {
    var Bezier, BezierView, _ref, _ref1;
    BezierView = (function(_super) {
      __extends(BezierView, _super);

      function BezierView() {
        _ref = BezierView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      BezierView.prototype._fields = ['x0', 'y0', 'x1', 'y1', 'cx0', 'cy0', 'cx1', 'cy1'];

      BezierView.prototype._properties = ['line'];

      BezierView.prototype._map_data = function() {
        var _ref1, _ref2, _ref3, _ref4;
        _ref1 = this.plot_view.map_to_screen(this.x0, this.glyph_props.x0.units, this.y0, this.glyph_props.y0.units), this.sx0 = _ref1[0], this.sy0 = _ref1[1];
        _ref2 = this.plot_view.map_to_screen(this.x1, this.glyph_props.x1.units, this.y1, this.glyph_props.y1.units), this.sx1 = _ref2[0], this.sy1 = _ref2[1];
        _ref3 = this.plot_view.map_to_screen(this.cx0, this.glyph_props.cx0.units, this.cy0, this.glyph_props.cy0.units), this.scx0 = _ref3[0], this.scy0 = _ref3[1];
        return _ref4 = this.plot_view.map_to_screen(this.cx1, this.glyph_props.cx1.units, this.cy1, this.glyph_props.cy1.units), this.scx1 = _ref4[0], this.scy1 = _ref4[1], _ref4;
      };

      BezierView.prototype._render = function(ctx, indices, glyph_props) {
        var i, _i, _len, _results;
        if (glyph_props.line_properties.do_stroke) {
          _results = [];
          for (_i = 0, _len = indices.length; _i < _len; _i++) {
            i = indices[_i];
            if (isNaN(this.sx0[i] + this.sy0[i] + this.sx1[i] + this.sy1[i] + this.scx0[i] + this.scy0[i] + this.scx1[i] + this.scy1[i])) {
              continue;
            }
            ctx.beginPath();
            ctx.moveTo(this.sx0[i], this.sy0[i]);
            ctx.bezierCurveTo(this.scx0[i], this.scy0[i], this.scx1[i], this.scy1[i], this.sx1[i], this.sy1[i]);
            glyph_props.line_properties.set_vectorize(ctx, i);
            _results.push(ctx.stroke());
          }
          return _results;
        }
      };

      BezierView.prototype.draw_legend = function(ctx, x0, x1, y0, y1) {
        return this._generic_line_legend(ctx, x0, x1, y0, y1);
      };

      return BezierView;

    })(Glyph.View);
    Bezier = (function(_super) {
      __extends(Bezier, _super);

      function Bezier() {
        _ref1 = Bezier.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      Bezier.prototype.default_view = BezierView;

      Bezier.prototype.type = 'Glyph';

      Bezier.prototype.display_defaults = function() {
        return _.extend(Bezier.__super__.display_defaults.call(this), {
          line_color: 'red',
          line_width: 1,
          line_alpha: 1.0,
          line_join: 'miter',
          line_cap: 'butt',
          line_dash: [],
          line_dash_offset: 0
        });
      };

      return Bezier;

    })(Glyph.Model);
    return {
      "Model": Bezier,
      "View": BezierView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=bezier.js.map
*/