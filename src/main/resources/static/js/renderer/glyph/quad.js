(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "rbush", "renderer/properties", "./glyph"], function(_, rbush, Properties, Glyph) {
    var Quad, QuadView, _ref, _ref1;
    QuadView = (function(_super) {
      __extends(QuadView, _super);

      function QuadView() {
        _ref = QuadView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      QuadView.prototype._fields = ['right', 'left', 'bottom', 'top'];

      QuadView.prototype._properties = ['line', 'fill'];

      QuadView.prototype._set_data = function() {
        var i;
        this.index = rbush();
        return this.index.load((function() {
          var _i, _ref1, _results;
          _results = [];
          for (i = _i = 0, _ref1 = this.left.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
            _results.push([
              this.left[i], this.bottom[i], this.right[i], this.top[i], {
                'i': i
              }
            ]);
          }
          return _results;
        }).call(this));
      };

      QuadView.prototype._map_data = function() {
        var _ref1, _ref2;
        _ref1 = this.plot_view.map_to_screen(this.left, this.glyph_props.left.units, this.top, this.glyph_props.top.units), this.sx0 = _ref1[0], this.sy0 = _ref1[1];
        return _ref2 = this.plot_view.map_to_screen(this.right, this.glyph_props.right.units, this.bottom, this.glyph_props.bottom.units), this.sx1 = _ref2[0], this.sy1 = _ref2[1], _ref2;
      };

      QuadView.prototype._mask_data = function() {
        var oh, ow, vr, x, x0, x1, y0, y1, _ref1, _ref2;
        ow = this.plot_view.view_state.get('outer_width');
        oh = this.plot_view.view_state.get('outer_height');
        _ref1 = this.plot_view.xmapper.v_map_from_target([0, ow]), x0 = _ref1[0], x1 = _ref1[1];
        vr = this.plot_view.view_state.get('inner_range_vertical');
        _ref2 = this.plot_view.ymapper.v_map_from_target([0, ow]), y0 = _ref2[0], y1 = _ref2[1];
        return (function() {
          var _i, _len, _ref3, _results;
          _ref3 = this.index.search([x0, y0, x1, y1]);
          _results = [];
          for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
            x = _ref3[_i];
            _results.push(x[4].i);
          }
          return _results;
        }).call(this);
      };

      QuadView.prototype._render = function(ctx, indices, glyph_props, sx0, sx1, sy0, sy1) {
        var i, _i, _len, _results;
        if (sx0 == null) {
          sx0 = this.sx0;
        }
        if (sx1 == null) {
          sx1 = this.sx1;
        }
        if (sy0 == null) {
          sy0 = this.sy0;
        }
        if (sy1 == null) {
          sy1 = this.sy1;
        }
        _results = [];
        for (_i = 0, _len = indices.length; _i < _len; _i++) {
          i = indices[_i];
          if (isNaN(sx0[i] + sy0[i] + sx1[i] + sy1[i])) {
            continue;
          }
          if (glyph_props.fill_properties.do_fill) {
            glyph_props.fill_properties.set_vectorize(ctx, i);
            ctx.fillRect(sx0[i], sy0[i], sx1[i] - sx0[i], sy1[i] - sy0[i]);
          }
          if (glyph_props.line_properties.do_stroke) {
            ctx.beginPath();
            ctx.rect(sx0[i], sy0[i], sx1[i] - sx0[i], sy1[i] - sy0[i]);
            glyph_props.line_properties.set_vectorize(ctx, i);
            _results.push(ctx.stroke());
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      QuadView.prototype.draw_legend = function(ctx, x0, x1, y0, y1) {
        return this._generic_area_legend(ctx, x0, x1, y0, y1);
      };

      return QuadView;

    })(Glyph.View);
    Quad = (function(_super) {
      __extends(Quad, _super);

      function Quad() {
        _ref1 = Quad.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      Quad.prototype.default_view = QuadView;

      Quad.prototype.type = 'Glyph';

      Quad.prototype.display_defaults = function() {
        return _.extend(Quad.__super__.display_defaults.call(this), {
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

      return Quad;

    })(Glyph.Model);
    return {
      "Model": Quad,
      "View": QuadView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=quad.js.map
*/