(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "rbush", "renderer/properties", "./glyph"], function(_, rbush, Properties, Glyph) {
    var Circle, CircleView, _ref, _ref1;
    CircleView = (function(_super) {
      __extends(CircleView, _super);

      function CircleView() {
        _ref = CircleView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      CircleView.prototype._properties = ['line', 'fill'];

      CircleView.prototype.initialize = function(options) {
        var spec;
        spec = this.mget('glyphspec');
        if (spec.radius != null) {
          this._fields = ['x', 'y', 'radius'];
        } else if (spec.size != null) {
          this._fields = ['x', 'y', 'size'];
        }
        return CircleView.__super__.initialize.call(this, options);
      };

      CircleView.prototype._set_data = function() {
        var i;
        if (this.size) {
          this.max_radius = _.max(this.size) / 2;
        } else {
          this.max_radius = _.max(this.radius);
        }
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

      CircleView.prototype._map_data = function() {
        var s, _ref1;
        _ref1 = this.plot_view.map_to_screen(this.x, this.glyph_props.x.units, this.y, this.glyph_props.y.units), this.sx = _ref1[0], this.sy = _ref1[1];
        if (this.size) {
          this.radius = (function() {
            var _i, _len, _ref2, _results;
            _ref2 = this.distance_vector('x', 'size', 'edge');
            _results = [];
            for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
              s = _ref2[_i];
              _results.push(s / 2);
            }
            return _results;
          }).call(this);
          return this.radius_units = this.glyph_props.size.units;
        } else {
          return this.radius = this.distance_vector('x', 'radius', 'edge');
        }
      };

      CircleView.prototype._mask_data = function() {
        var hr, sx0, sx1, sy0, sy1, vr, x, x0, x1, y0, y1, _ref1, _ref2, _ref3, _ref4;
        hr = this.plot_view.view_state.get('inner_range_horizontal');
        vr = this.plot_view.view_state.get('inner_range_vertical');
        if (this.radius_units === "screen") {
          sx0 = hr.get('start') - this.max_radius;
          sx1 = hr.get('end') - this.max_radius;
          _ref1 = this.plot_view.xmapper.v_map_from_target([sx0, sx1]), x0 = _ref1[0], x1 = _ref1[1];
          sy0 = vr.get('start') - this.max_radius;
          sy1 = vr.get('end') - this.max_radius;
          _ref2 = this.plot_view.ymapper.v_map_from_target([sy0, sy1]), y0 = _ref2[0], y1 = _ref2[1];
        } else {
          sx0 = hr.get('start');
          sx1 = hr.get('end');
          _ref3 = this.plot_view.xmapper.v_map_from_target([sx0, sx1]), x0 = _ref3[0], x1 = _ref3[1];
          x0 -= this.max_radius;
          x1 += this.max_radius;
          sy0 = vr.get('start');
          sy1 = vr.get('end');
          _ref4 = this.plot_view.ymapper.v_map_from_target([sy0, sy1]), y0 = _ref4[0], y1 = _ref4[1];
          y0 -= this.max_radius;
          y1 += this.max_radius;
        }
        return (function() {
          var _i, _len, _ref5, _results;
          _ref5 = this.index.search([x0, y0, x1, y1]);
          _results = [];
          for (_i = 0, _len = _ref5.length; _i < _len; _i++) {
            x = _ref5[_i];
            _results.push(x[4].i);
          }
          return _results;
        }).call(this);
      };

      CircleView.prototype._render = function(ctx, indices, glyph_props, sx, sy, radius) {
        var i, _i, _len, _results;
        if (sx == null) {
          sx = this.sx;
        }
        if (sy == null) {
          sy = this.sy;
        }
        if (radius == null) {
          radius = this.radius;
        }
        _results = [];
        for (_i = 0, _len = indices.length; _i < _len; _i++) {
          i = indices[_i];
          if (isNaN(sx[i] + sy[i] + radius[i])) {
            continue;
          }
          ctx.beginPath();
          ctx.arc(sx[i], sy[i], radius[i], 0, 2 * Math.PI, false);
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

      CircleView.prototype._hit_point = function(geometry) {
        var candidates, dist, hits, i, pt, r2, sx, sx0, sx1, sy, sy0, sy1, vx, vx0, vx1, vy, vy0, vy1, x, x0, x1, y, y0, y1, _i, _j, _len, _len1, _ref1, _ref2, _ref3;
        _ref1 = [geometry.vx, geometry.vy], vx = _ref1[0], vy = _ref1[1];
        x = this.plot_view.xmapper.map_from_target(vx);
        y = this.plot_view.ymapper.map_from_target(vy);
        if (this.radius_units === "screen") {
          vx0 = vx - this.max_radius;
          vx1 = vx + this.max_radius;
          _ref2 = this.plot_view.xmapper.v_map_from_target([vx0, vx1]), x0 = _ref2[0], x1 = _ref2[1];
          vy0 = vy - this.max_radius;
          vy1 = vy + this.max_radius;
          _ref3 = this.plot_view.ymapper.v_map_from_target([vy0, vy1]), y0 = _ref3[0], y1 = _ref3[1];
        } else {
          x0 = x - this.max_radius;
          x1 = x + this.max_radius;
          y0 = y - this.max_radius;
          y1 = y + this.max_radius;
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
        hits = [];
        if (this.radius_units === "screen") {
          sx = this.plot_view.view_state.vx_to_sx(vx);
          sy = this.plot_view.view_state.vy_to_sy(vy);
          for (_i = 0, _len = candidates.length; _i < _len; _i++) {
            i = candidates[_i];
            r2 = Math.pow(this.radius[i], 2);
            dist = Math.pow(this.sx[i] - sx, 2) + Math.pow(this.sy[i] - sy, 2);
            if (dist <= r2) {
              hits.push([i, dist]);
            }
          }
        } else {
          for (_j = 0, _len1 = candidates.length; _j < _len1; _j++) {
            i = candidates[_j];
            r2 = Math.pow(this.radius[i], 2);
            sx0 = this.plot_view.xmapper.map_to_target(x);
            sx1 = this.plot_view.xmapper.map_to_target(this.x[i]);
            sy0 = this.plot_view.ymapper.map_to_target(y);
            sy1 = this.plot_view.ymapper.map_to_target(this.y[i]);
            dist = Math.pow(sx0 - sx1, 2) + Math.pow(sy0 - sy1, 2);
            if (dist <= r2) {
              hits.push([i, dist]);
            }
          }
        }
        hits = _.chain(hits).sortBy(function(elt) {
          return elt[1];
        }).map(function(elt) {
          return elt[0];
        }).value();
        return hits;
      };

      CircleView.prototype._hit_rect = function(geometry) {
        var x, x0, x1, y0, y1, _ref1, _ref2;
        _ref1 = this.plot_view.xmapper.v_map_from_target([geometry.vx0, geometry.vx1]), x0 = _ref1[0], x1 = _ref1[1];
        _ref2 = this.plot_view.ymapper.v_map_from_target([geometry.vy0, geometry.vy1]), y0 = _ref2[0], y1 = _ref2[1];
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

      CircleView.prototype.draw_legend = function(ctx, x0, x1, y0, y1) {
        var indices, radius, reference_point, sx, sy, _ref1;
        reference_point = (_ref1 = this.get_reference_point()) != null ? _ref1 : 0;
        indices = [reference_point];
        sx = {};
        sx[reference_point] = (x0 + x1) / 2;
        sy = {};
        sy[reference_point] = (y0 + y1) / 2;
        radius = {};
        radius[reference_point] = Math.min(Math.abs(x1 - x0), Math.abs(y1 - y0)) * 0.4;
        return this._render(ctx, indices, this.glyph_props, sx, sy, radius);
      };

      return CircleView;

    })(Glyph.View);
    Circle = (function(_super) {
      __extends(Circle, _super);

      function Circle() {
        _ref1 = Circle.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      Circle.prototype.default_view = CircleView;

      Circle.prototype.type = 'Glyph';

      Circle.prototype.display_defaults = function() {
        return _.extend(Circle.__super__.display_defaults.call(this), {
          radius_units: 'data',
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

      return Circle;

    })(Glyph.Model);
    return {
      "Model": Circle,
      "View": CircleView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=circle.js.map
*/