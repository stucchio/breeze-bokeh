(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "renderer/properties", "./glyph"], function(_, Properties, Glyph) {
    var Arc, ArcView, _ref, _ref1;
    ArcView = (function(_super) {
      __extends(ArcView, _super);

      function ArcView() {
        _ref = ArcView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      ArcView.prototype._fields = ['x', 'y', 'radius', 'start_angle', 'end_angle', 'direction:string'];

      ArcView.prototype._properties = ['line'];

      ArcView.prototype._map_data = function() {
        var _ref1;
        _ref1 = this.plot_view.map_to_screen(this.x, this.glyph_props.x.units, this.y, this.glyph_props.y.units), this.sx = _ref1[0], this.sy = _ref1[1];
        return this.radius = this.distance_vector('x', 'radius', 'edge');
      };

      ArcView.prototype._render = function(ctx, indices, glyph_props, sx, sy, radius) {
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
        if (glyph_props.line_properties.do_stroke) {
          _results = [];
          for (_i = 0, _len = indices.length; _i < _len; _i++) {
            i = indices[_i];
            if (isNaN(sx[i] + sy[i] + radius[i] + this.start_angle[i] + this.end_angle[i] + this.direction[i])) {
              continue;
            }
            ctx.beginPath();
            ctx.arc(sx[i], sy[i], radius[i], this.start_angle[i], this.end_angle[i], this.direction[i]);
            glyph_props.line_properties.set_vectorize(ctx, i);
            _results.push(ctx.stroke());
          }
          return _results;
        }
      };

      ArcView.prototype.draw_legend = function(ctx, x0, x1, y0, y1) {
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

      return ArcView;

    })(Glyph.View);
    Arc = (function(_super) {
      __extends(Arc, _super);

      function Arc() {
        _ref1 = Arc.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      Arc.prototype.default_view = ArcView;

      Arc.prototype.type = 'Glyph';

      Arc.prototype.display_defaults = function() {
        return _.extend(Arc.__super__.display_defaults.call(this), {
          direction: 'anticlock',
          line_color: 'red',
          line_width: 1,
          line_alpha: 1.0,
          line_join: 'miter',
          line_cap: 'butt',
          line_dash: [],
          line_dash_offset: 0
        });
      };

      return Arc;

    })(Glyph.Model);
    return {
      "Model": Arc,
      "View": ArcView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=arc.js.map
*/