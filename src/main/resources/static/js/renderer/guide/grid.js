(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "common/safebind", "common/has_parent", "common/ticking", "renderer/properties", "common/plot_widget"], function(_, safebind, HasParent, ticking, Properties, PlotWidget) {
    var Grid, GridView, Grids, line_properties, _ref, _ref1, _ref2;
    line_properties = Properties.line_properties;
    GridView = (function(_super) {
      __extends(GridView, _super);

      function GridView() {
        _ref = GridView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      GridView.prototype.initialize = function(attrs, options) {
        GridView.__super__.initialize.call(this, attrs, options);
        return this.grid_props = new line_properties(this, null, 'grid_');
      };

      GridView.prototype.render = function() {
        var ctx;
        ctx = this.plot_view.ctx;
        ctx.save();
        this._draw_grids(ctx);
        return ctx.restore();
      };

      GridView.prototype.bind_bokeh_events = function() {
        return safebind(this, this.model, 'change', this.request_render);
      };

      GridView.prototype._draw_grids = function(ctx) {
        var i, sx, sy, xs, ys, _i, _j, _ref1, _ref2, _ref3, _ref4;
        if (!this.grid_props.do_stroke) {
          return;
        }
        _ref1 = this.mget('grid_coords'), xs = _ref1[0], ys = _ref1[1];
        this.grid_props.set(ctx, this);
        for (i = _i = 0, _ref2 = xs.length; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; i = 0 <= _ref2 ? ++_i : --_i) {
          _ref3 = this.plot_view.map_to_screen(xs[i], "data", ys[i], "data"), sx = _ref3[0], sy = _ref3[1];
          ctx.beginPath();
          ctx.moveTo(Math.round(sx[0]), Math.round(sy[0]));
          for (i = _j = 1, _ref4 = sx.length; 1 <= _ref4 ? _j < _ref4 : _j > _ref4; i = 1 <= _ref4 ? ++_j : --_j) {
            ctx.lineTo(Math.round(sx[i]), Math.round(sy[i]));
          }
          ctx.stroke();
        }
      };

      return GridView;

    })(PlotWidget);
    Grid = (function(_super) {
      __extends(Grid, _super);

      function Grid() {
        _ref1 = Grid.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      Grid.prototype.default_view = GridView;

      Grid.prototype.type = 'Grid';

      Grid.prototype.initialize = function(attrs, options) {
        Grid.__super__.initialize.call(this, attrs, options);
        this.register_property('computed_bounds', this._bounds, false);
        this.add_dependencies('computed_bounds', this, ['bounds']);
        this.register_property('scale', this._scale, true);
        this.add_dependencies('scale', this, ['is_datetime']);
        this.register_property('grid_coords', this._grid_coords, false);
        return this.add_dependencies('grid_coords', this, ['computed_bounds', 'dimension', 'scale']);
      };

      Grid.prototype._scale = function() {
        if (this.get('is_datetime')) {
          return new ticking.DatetimeScale();
        } else {
          return new ticking.BasicScale();
        }
      };

      Grid.prototype._bounds = function() {
        var end, i, j, range_bounds, ranges, start, user_bounds, _ref2;
        i = this.get('dimension');
        j = (i + 1) % 2;
        ranges = [this.get_obj('plot').get_obj('x_range'), this.get_obj('plot').get_obj('y_range')];
        user_bounds = (_ref2 = this.get('bounds')) != null ? _ref2 : 'auto';
        range_bounds = [ranges[i].get('min'), ranges[i].get('max')];
        if (_.isArray(user_bounds)) {
          start = Math.min(user_bounds[0], user_bounds[1]);
          end = Math.max(user_bounds[0], user_bounds[1]);
          if (start < range_bounds[0]) {
            start = range_bounds[0];
          } else if (start > range_bounds[1]) {
            start = null;
          }
          if (end > range_bounds[1]) {
            end = range_bounds[1];
          } else if (end < range_bounds[0]) {
            end = null;
          }
        } else {
          start = range_bounds[0], end = range_bounds[1];
        }
        return [start, end];
      };

      Grid.prototype._grid_coords = function() {
        var N, cmax, cmin, coords, cross_range, dim_i, dim_j, end, i, ii, j, loc, max, min, n, range, ranges, start, ticks, tmp, _i, _j, _ref2, _ref3;
        i = this.get('dimension');
        j = (i + 1) % 2;
        ranges = [this.get_obj('plot').get_obj('x_range'), this.get_obj('plot').get_obj('y_range')];
        range = ranges[i];
        cross_range = ranges[j];
        _ref2 = this.get('computed_bounds'), start = _ref2[0], end = _ref2[1];
        tmp = Math.min(start, end);
        end = Math.max(start, end);
        start = tmp;
        ticks = this.get('scale').get_ticks(start, end, range, {});
        min = range.get('min');
        max = range.get('max');
        cmin = cross_range.get('min');
        cmax = cross_range.get('max');
        coords = [[], []];
        for (ii = _i = 0, _ref3 = ticks.length; 0 <= _ref3 ? _i < _ref3 : _i > _ref3; ii = 0 <= _ref3 ? ++_i : --_i) {
          if (ticks[ii] === min || ticks[ii] === max) {
            continue;
          }
          dim_i = [];
          dim_j = [];
          N = 2;
          for (n = _j = 0; 0 <= N ? _j < N : _j > N; n = 0 <= N ? ++_j : --_j) {
            loc = cmin + (cmax - cmin) / (N - 1) * n;
            dim_i.push(ticks[ii]);
            dim_j.push(loc);
          }
          coords[i].push(dim_i);
          coords[j].push(dim_j);
        }
        return coords;
      };

      Grid.prototype.display_defaults = function() {
        return {
          level: 'underlay',
          grid_line_color: '#cccccc',
          grid_line_width: 1,
          grid_line_alpha: 1.0,
          grid_line_join: 'miter',
          grid_line_cap: 'butt',
          grid_line_dash: [],
          grid_line_dash_offset: 0
        };
      };

      return Grid;

    })(HasParent);
    Grids = (function(_super) {
      __extends(Grids, _super);

      function Grids() {
        _ref2 = Grids.__super__.constructor.apply(this, arguments);
        return _ref2;
      }

      Grids.prototype.model = Grid;

      return Grids;

    })(Backbone.Collection);
    return {
      "Model": Grid,
      "Collection": new Grids(),
      "View": GridView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=grid.js.map
*/