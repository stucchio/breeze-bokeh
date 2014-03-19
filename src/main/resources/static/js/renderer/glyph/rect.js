(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "rbush", "renderer/properties", "./glyph"], function(_, rbush, Properties, Glyph) {
    var Rect, RectView, _ref, _ref1;
    RectView = (function(_super) {
      __extends(RectView, _super);

      function RectView() {
        _ref = RectView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      RectView.prototype._fields = ['x', 'y', 'width', 'height', 'angle'];

      RectView.prototype._properties = ['line', 'fill'];

      RectView.prototype._map_data = function() {
        var i, sxi, syi, _i, _ref1, _ref2;
        _ref1 = this.plot_view.map_to_screen(this.x, this.glyph_props.x.units, this.y, this.glyph_props.y.units), sxi = _ref1[0], syi = _ref1[1];
        this.sw = this.distance_vector('x', 'width', 'center');
        this.sh = this.distance_vector('y', 'height', 'center');
        this.sx = new Array(sxi.length);
        this.sy = new Array(sxi.length);
        for (i = _i = 0, _ref2 = sxi.length; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; i = 0 <= _ref2 ? ++_i : --_i) {
          if (Math.abs(sxi[i] - this.sw[i]) < 2) {
            this.sx[i] = Math.round(sxi[i]);
          } else {
            this.sx[i] = sxi[i];
          }
          if (Math.abs(syi[i] - this.sh[i]) < 2) {
            this.sy[i] = Math.round(syi[i]);
          } else {
            this.sy[i] = syi[i];
          }
        }
        this.max_width = _.max(this.width);
        return this.max_height = _.max(this.height);
      };

      RectView.prototype._set_data = function() {
        var i;
        this.index = rbush();
        return this.index.load((function() {
          var _i, _ref1, _results;
          _results = [];
          for (i = _i = 0, _ref1 = this.x.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
            _results.push([
              this.x[i], this.y[i], this.x[i], this.y[i], {
                'i': i
              }
            ]);
          }
          return _results;
        }).call(this));
      };

      RectView.prototype._render = function(ctx, indices, glyph_props, sx, sy, sw, sh) {
        var i, _i, _j, _len, _len1;
        if (sx == null) {
          sx = this.sx;
        }
        if (sy == null) {
          sy = this.sy;
        }
        if (sw == null) {
          sw = this.sw;
        }
        if (sh == null) {
          sh = this.sh;
        }
        if (glyph_props.fill_properties.do_fill) {
          for (_i = 0, _len = indices.length; _i < _len; _i++) {
            i = indices[_i];
            if (isNaN(sx[i] + sy[i] + sw[i] + sh[i] + this.angle[i])) {
              continue;
            }
            glyph_props.fill_properties.set_vectorize(ctx, i);
            if (this.angle[i]) {
              ctx.translate(sx[i], sy[i]);
              ctx.rotate(this.angle[i]);
              ctx.fillRect(-sw[i] / 2, -sh[i] / 2, sw[i], sh[i]);
              ctx.rotate(-this.angle[i]);
              ctx.translate(-sx[i], -sy[i]);
            } else {
              ctx.fillRect(sx[i] - sw[i] / 2, sy[i] - sh[i] / 2, sw[i], sh[i]);
              ctx.rect(sx[i] - sw[i] / 2, sy[i] - sh[i] / 2, sw[i], sh[i]);
            }
          }
        }
        if (glyph_props.line_properties.do_stroke) {
          ctx.beginPath();
          for (_j = 0, _len1 = indices.length; _j < _len1; _j++) {
            i = indices[_j];
            if (isNaN(sx[i] + sy[i] + sw[i] + sh[i] + this.angle[i])) {
              continue;
            }
            if (this.angle[i]) {
              ctx.translate(sx[i], sy[i]);
              ctx.rotate(this.angle[i]);
              ctx.rect(-sw[i] / 2, -sh[i] / 2, sw[i], sh[i]);
              ctx.rotate(-this.angle[i]);
              ctx.translate(-sx[i], -sy[i]);
            } else {
              ctx.rect(sx[i] - sw[i] / 2, sy[i] - sh[i] / 2, sw[i], sh[i]);
            }
            glyph_props.line_properties.set_vectorize(ctx, i);
            ctx.stroke();
            ctx.beginPath();
          }
          return ctx.stroke();
        }
      };

      RectView.prototype._hit_point = function(geometry) {
        var c, candidates, d, height_in, hits, i, max_height, max_width, pt, px, py, s, sx, sy, vx, vx0, vx1, vy, vy0, vy1, width_in, x, x0, x1, xcat, y, y0, y1, ycat, _i, _len, _ref1, _ref2, _ref3;
        _ref1 = [geometry.vx, geometry.vy], vx = _ref1[0], vy = _ref1[1];
        x = this.plot_view.xmapper.map_from_target(vx);
        y = this.plot_view.ymapper.map_from_target(vy);
        xcat = typeof x === "string";
        ycat = typeof y === "string";
        if (xcat || ycat) {
          candidates = (function() {
            var _i, _ref2, _results;
            _results = [];
            for (i = _i = 0, _ref2 = this.x.length; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; i = 0 <= _ref2 ? ++_i : --_i) {
              _results.push(i);
            }
            return _results;
          }).call(this);
        } else {
          if (this.width_units === "screen" || xcat) {
            max_width = this.max_width;
            if (xcat) {
              max_width = this.plot_view.xmapper.map_to_target(max_width);
            }
            vx0 = vx - 2 * max_width;
            vx1 = vx + 2 * max_width;
            _ref2 = this.plot_view.xmapper.v_map_from_target([vx0, vx1]), x0 = _ref2[0], x1 = _ref2[1];
          } else {
            x0 = x - 2 * this.max_width;
            x1 = x + 2 * this.max_width;
          }
          if (this.height_units === "screen" || ycat) {
            max_height = this.max_height;
            if (ycat) {
              max_height = this.plot_view.ymapper.map_to_target(max_height);
            }
            vy0 = vy - 2 * max_height;
            vy1 = vy + 2 * max_height;
            _ref3 = this.plot_view.ymapper.v_map_from_target([vy0, vy1]), y0 = _ref3[0], y1 = _ref3[1];
          } else {
            y0 = y - 2 * this.max_height;
            y1 = y + 2 * this.max_height;
          }
          candidates = (function() {
            var _i, _len, _ref4, _results;
            _ref4 = this.index.search([x0, y0, x1, y1]);
            _results = [];
            for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
              pt = _ref4[_i];
              _results.push(pt[4].i);
            }
            return _results;
          }).call(this);
        }
        hits = [];
        for (_i = 0, _len = candidates.length; _i < _len; _i++) {
          i = candidates[_i];
          if (this.width_units === "screen" || xcat) {
            sx = this.plot_view.view_state.vx_to_sx(vx);
          } else {
            sx = this.plot_view.view_state.vx_to_sx(this.plot_view.xmapper.map_to_target(x));
          }
          if (this.height_units === "screen" || ycat) {
            sy = this.plot_view.view_state.vy_to_sy(vy);
          } else {
            sy = this.plot_view.view_state.vy_to_sy(this.plot_view.ymapper.map_to_target(y));
          }
          if (this.angle[i]) {
            d = Math.sqrt(Math.pow(sx - this.sx[i], 2) + Math.pow(sy - this.sy[i], 2));
            s = Math.sin(-this.angle[i]);
            c = Math.cos(-this.angle[i]);
            px = c * (sx - this.sx[i]) - s * (sy - this.sy[i]) + this.sx[i];
            py = s * (sx - this.sx[i]) + c * (sy - this.sy[i]) + this.sy[i];
            sx = px;
            sy = py;
          }
          width_in = Math.abs(this.sx[i] - sx) <= this.sw[i] / 2;
          height_in = Math.abs(this.sy[i] - sy) <= this.sh[i] / 2;
          if (height_in && width_in) {
            hits.push(i);
          }
        }
        return hits;
      };

      RectView.prototype.draw_legend = function(ctx, x0, x1, y0, y1) {
        var d, indices, reference_point, scale, sh, sw, sx, sy, _ref1;
        reference_point = (_ref1 = this.get_reference_point()) != null ? _ref1 : 0;
        indices = [reference_point];
        sx = {};
        sx[reference_point] = (x0 + x1) / 2;
        sy = {};
        sy[reference_point] = (y0 + y1) / 2;
        scale = this.sw[reference_point] / this.sh[reference_point];
        d = Math.min(Math.abs(x1 - x0), Math.abs(y1 - y0)) * 0.8;
        sw = {};
        sh = {};
        if (scale > 1) {
          sw[reference_point] = d;
          sh[reference_point] = d / scale;
        } else {
          sw[reference_point] = d * scale;
          sh[reference_point] = d;
        }
        return this._render(ctx, indices, this.glyph_props, sx, sy, sw, sh);
      };

      return RectView;

    })(Glyph.View);
    Rect = (function(_super) {
      __extends(Rect, _super);

      function Rect() {
        _ref1 = Rect.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      Rect.prototype.default_view = RectView;

      Rect.prototype.type = 'Glyph';

      Rect.prototype.display_defaults = function() {
        return _.extend(Rect.__super__.display_defaults.call(this), {
          fill_color: 'gray',
          fill_alpha: 1.0,
          line_color: 'red',
          line_width: 1,
          line_alpha: 1.0,
          line_join: 'miter',
          line_cap: 'butt',
          line_dash: [],
          line_dash_offset: 0,
          angle: 0.0
        });
      };

      return Rect;

    })(Glyph.Model);
    return {
      "Model": Rect,
      "View": RectView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=rect.js.map
*/