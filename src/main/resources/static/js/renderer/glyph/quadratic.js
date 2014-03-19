(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "renderer/properties", "./glyph"], function(_, Properties, Glyph) {
    var Quadratic, QuadraticView, _ref, _ref1;
    QuadraticView = (function(_super) {
      __extends(QuadraticView, _super);

      function QuadraticView() {
        _ref = QuadraticView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      QuadraticView.prototype._fields = ['x0', 'y0', 'x1', 'y1', 'cx', 'cy'];

      QuadraticView.prototype._properties = ['line'];

      QuadraticView.prototype._map_data = function() {
        var _ref1, _ref2, _ref3;
        _ref1 = this.plot_view.map_to_screen(this.x0, this.glyph_props.x0.units, this.y0, this.glyph_props.y0.units), this.sx0 = _ref1[0], this.sy0 = _ref1[1];
        _ref2 = this.plot_view.map_to_screen(this.x1, this.glyph_props.x1.units, this.y1, this.glyph_props.y1.units), this.sx1 = _ref2[0], this.sy1 = _ref2[1];
        return _ref3 = this.plot_view.map_to_screen(this.cx, this.glyph_props.cx.units, this.cy, this.glyph_props.cy.units), this.scx = _ref3[0], this.scy = _ref3[1], _ref3;
      };

      QuadraticView.prototype._render = function(ctx, indices, glyph_props) {
        var i, _i, _len, _results;
        if (glyph_props.line_properties.do_stroke) {
          _results = [];
          for (_i = 0, _len = indices.length; _i < _len; _i++) {
            i = indices[_i];
            if (isNaN(this.sx0[i] + this.sy0[i] + this.sx1[i] + this.sy1[i] + this.scx[i] + this.scy[i])) {
              continue;
            }
            ctx.beginPath();
            ctx.moveTo(this.sx0[i], this.sy0[i]);
            ctx.quadraticCurveTo(this.scx[i], this.scy[i], this.sx1[i], this.sy1[i]);
            glyph_props.line_properties.set_vectorize(ctx, i);
            _results.push(ctx.stroke());
          }
          return _results;
        }
      };

      QuadraticView.prototype.draw_legend = function(ctx, x0, x1, y0, y1) {
        return this._generic_line_legend(ctx, x0, x1, y0, y1);
      };

      return QuadraticView;

    })(Glyph.View);
    Quadratic = (function(_super) {
      __extends(Quadratic, _super);

      function Quadratic() {
        _ref1 = Quadratic.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      Quadratic.prototype.default_view = QuadraticView;

      Quadratic.prototype.type = 'Glyph';

      Quadratic.prototype.display_defaults = function() {
        return _.extend(Quadratic.__super__.display_defaults.call(this), {
          line_color: 'red',
          line_width: 1,
          line_alpha: 1.0,
          line_join: 'miter',
          line_cap: 'butt',
          line_dash: [],
          line_dash_offset: 0
        });
      };

      return Quadratic;

    })(Glyph.Model);
    return {
      "Model": Quadratic,
      "View": QuadraticView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=quadratic.js.map
*/