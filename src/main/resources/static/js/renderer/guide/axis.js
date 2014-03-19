(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "backbone", "common/safebind", "common/has_parent", "common/plot_widget", "renderer/properties"], function(_, Backbone, safebind, HasParent, PlotWidget, Properties) {
    var Axis, AxisView, glyph_properties, line_properties, text_properties, _align_lookup, _align_lookup_negative, _align_lookup_positive, _angle_lookup, _baseline_lookup, _normal_lookup, _ref, _ref1;
    glyph_properties = Properties.glyph_properties;
    line_properties = Properties.line_properties;
    text_properties = Properties.text_properties;
    _angle_lookup = {
      top: {
        parallel: 0,
        normal: -Math.PI / 2,
        horizontal: 0,
        vertical: -Math.PI / 2
      },
      bottom: {
        parallel: 0,
        normal: Math.PI / 2,
        horizontal: 0,
        vertical: Math.PI / 2
      },
      left: {
        parallel: -Math.PI / 2,
        normal: 0,
        horizontal: 0,
        vertical: -Math.PI / 2
      },
      right: {
        parallel: Math.PI / 2,
        normal: 0,
        horizontal: 0,
        vertical: Math.PI / 2
      }
    };
    _baseline_lookup = {
      top: {
        parallel: 'alphabetic',
        normal: 'middle',
        horizontal: 'alphabetic',
        vertical: 'middle'
      },
      bottom: {
        parallel: 'hanging',
        normal: 'middle',
        horizontal: 'hanging',
        vertical: 'middle'
      },
      left: {
        parallel: 'alphabetic',
        normal: 'middle',
        horizontal: 'middle',
        vertical: 'alphabetic'
      },
      right: {
        parallel: 'alphabetic',
        normal: 'middle',
        horizontal: 'middle',
        vertical: 'alphabetic'
      }
    };
    _align_lookup = {
      top: {
        parallel: 'center',
        normal: 'left',
        horizontal: 'center',
        vertical: 'left'
      },
      bottom: {
        parallel: 'center',
        normal: 'left',
        horizontal: 'center',
        vertical: 'right'
      },
      left: {
        parallel: 'center',
        normal: 'right',
        horizontal: 'right',
        vertical: 'center'
      },
      right: {
        parallel: 'center',
        normal: 'left',
        horizontal: 'left',
        vertical: 'center'
      }
    };
    _align_lookup_negative = {
      top: 'right',
      bottom: 'left',
      left: 'right',
      right: 'left'
    };
    _align_lookup_positive = {
      top: 'left',
      bottom: 'right',
      left: 'right',
      right: 'left'
    };
    _normal_lookup = [
      {
        norm: {
          norm: {
            'min': +1,
            'max': -1
          },
          flip: {
            'min': -1,
            'max': +1
          }
        },
        flip: {
          norm: {
            'min': +1,
            'max': -1
          },
          flip: {
            'min': -1,
            'max': +1
          }
        }
      }, {
        norm: {
          norm: {
            'min': -1,
            'max': +1
          },
          flip: {
            'min': -1,
            'max': +1
          }
        },
        flip: {
          norm: {
            'min': +1,
            'max': -1
          },
          flip: {
            'min': +1,
            'max': -1
          }
        }
      }
    ];
    AxisView = (function(_super) {
      __extends(AxisView, _super);

      function AxisView() {
        _ref = AxisView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      AxisView.prototype.initialize = function(options) {
        AxisView.__super__.initialize.call(this, options);
        this.rule_props = new line_properties(this, null, 'axis_');
        this.major_tick_props = new line_properties(this, null, 'major_tick_');
        this.major_label_props = new text_properties(this, null, 'major_label_');
        this.axis_label_props = new text_properties(this, null, 'axis_label_');
        return this.formatter = options.formatter;
      };

      AxisView.prototype.render = function() {
        var ctx;
        ctx = this.plot_view.ctx;
        ctx.save();
        this._draw_rule(ctx);
        this._draw_major_ticks(ctx);
        this._draw_major_labels(ctx);
        this._draw_axis_label(ctx);
        return ctx.restore();
      };

      AxisView.prototype.bind_bokeh_events = function() {
        return safebind(this, this.model, 'change', this.request_render);
      };

      AxisView.prototype.padding_request = function() {
        return this._padding_request();
      };

      AxisView.prototype._draw_rule = function(ctx) {
        var coords, i, nx, ny, sx, sy, x, y, _i, _ref1, _ref2, _ref3, _ref4;
        if (!this.rule_props.do_stroke) {
          return;
        }
        _ref1 = coords = this.mget('rule_coords'), x = _ref1[0], y = _ref1[1];
        _ref2 = this.plot_view.map_to_screen(x, "data", y, "data"), sx = _ref2[0], sy = _ref2[1];
        _ref3 = this.mget('normals'), nx = _ref3[0], ny = _ref3[1];
        this.rule_props.set(ctx, this);
        ctx.beginPath();
        ctx.moveTo(Math.round(sx[0]), Math.round(sy[0]));
        for (i = _i = 1, _ref4 = sx.length; 1 <= _ref4 ? _i < _ref4 : _i > _ref4; i = 1 <= _ref4 ? ++_i : --_i) {
          ctx.lineTo(Math.round(sx[i]), Math.round(sy[i]));
        }
        return ctx.stroke();
      };

      AxisView.prototype._draw_major_ticks = function(ctx) {
        var coords, i, nx, ny, sx, sy, tin, tout, x, y, _i, _ref1, _ref2, _ref3, _ref4, _results;
        if (!this.major_tick_props.do_stroke) {
          return;
        }
        _ref1 = coords = this.mget('major_coords'), x = _ref1[0], y = _ref1[1];
        _ref2 = this.plot_view.map_to_screen(x, "data", y, "data"), sx = _ref2[0], sy = _ref2[1];
        _ref3 = this.mget('normals'), nx = _ref3[0], ny = _ref3[1];
        tin = this.mget('major_tick_in');
        tout = this.mget('major_tick_out');
        this.major_tick_props.set(ctx, this);
        _results = [];
        for (i = _i = 0, _ref4 = sx.length; 0 <= _ref4 ? _i < _ref4 : _i > _ref4; i = 0 <= _ref4 ? ++_i : --_i) {
          ctx.beginPath();
          ctx.moveTo(Math.round(sx[i] + nx * tout), Math.round(sy[i] + ny * tout));
          ctx.lineTo(Math.round(sx[i] - nx * tin), Math.round(sy[i] - ny * tin));
          _results.push(ctx.stroke());
        }
        return _results;
      };

      AxisView.prototype._draw_major_labels = function(ctx) {
        var angle, coords, dim, i, labels, nx, ny, orient, side, standoff, sx, sy, x, y, _i, _ref1, _ref2, _ref3, _ref4, _results;
        _ref1 = coords = this.mget('major_coords'), x = _ref1[0], y = _ref1[1];
        _ref2 = this.plot_view.map_to_screen(x, "data", y, "data"), sx = _ref2[0], sy = _ref2[1];
        _ref3 = this.mget('normals'), nx = _ref3[0], ny = _ref3[1];
        dim = this.mget('dimension');
        side = this.mget('side');
        orient = this.mget('major_label_orientation');
        if (_.isString(orient)) {
          angle = _angle_lookup[side][orient];
        } else {
          angle = -orient;
        }
        standoff = this._tick_extent() + this.mget('major_label_standoff');
        labels = this.formatter.format(coords[dim]);
        this.major_label_props.set(ctx, this);
        this._apply_location_heuristics(ctx, side, orient);
        _results = [];
        for (i = _i = 0, _ref4 = sx.length; 0 <= _ref4 ? _i < _ref4 : _i > _ref4; i = 0 <= _ref4 ? ++_i : --_i) {
          if (angle) {
            ctx.translate(sx[i] + nx * standoff, sy[i] + ny * standoff);
            ctx.rotate(angle);
            ctx.fillText(labels[i], 0, 0);
            ctx.rotate(-angle);
            _results.push(ctx.translate(-sx[i] - nx * standoff, -sy[i] - ny * standoff));
          } else {
            _results.push(ctx.fillText(labels[i], Math.round(sx[i] + nx * standoff), Math.round(sy[i] + ny * standoff)));
          }
        }
        return _results;
      };

      AxisView.prototype._draw_axis_label = function(ctx) {
        var angle, label, nx, ny, orient, side, standoff, sx, sy, x, y, _ref1, _ref2, _ref3;
        label = this.mget('axis_label');
        if (label == null) {
          return;
        }
        _ref1 = this.mget('rule_coords'), x = _ref1[0], y = _ref1[1];
        _ref2 = this.plot_view.map_to_screen(x, "data", y, "data"), sx = _ref2[0], sy = _ref2[1];
        _ref3 = this.mget('normals'), nx = _ref3[0], ny = _ref3[1];
        side = this.mget('side');
        orient = 'parallel';
        angle = _angle_lookup[side][orient];
        standoff = this._tick_extent() + this._tick_label_extent() + this.mget('axis_label_standoff');
        sx = (sx[0] + sx[sx.length - 1]) / 2;
        sy = (sy[0] + sy[sy.length - 1]) / 2;
        this.axis_label_props.set(ctx, this);
        this._apply_location_heuristics(ctx, side, orient);
        if (angle) {
          ctx.translate(sx + nx * standoff, sy + ny * standoff);
          ctx.rotate(angle);
          ctx.fillText(label, 0, 0);
          ctx.rotate(-angle);
          return ctx.translate(-sx - nx * standoff, -sy - ny * standoff);
        } else {
          return ctx.fillText(label, sx + nx * standoff, sy + ny * standoff);
        }
      };

      AxisView.prototype._apply_location_heuristics = function(ctx, side, orient) {
        var align, baseline;
        if (_.isString(orient)) {
          baseline = _baseline_lookup[side][orient];
          align = _align_lookup[side][orient];
        } else if (orient === 0) {
          baseline = _baseline_lookup[side][orient];
          align = _align_lookup[side][orient];
        } else if (orient < 0) {
          baseline = 'middle';
          align = _align_lookup_negative[side];
        } else if (orient > 0) {
          baseline = 'middle';
          align = _align_lookup_positive[side];
        }
        ctx.textBaseline = baseline;
        return ctx.textAlign = align;
      };

      AxisView.prototype._tick_extent = function() {
        return this.mget('major_tick_out');
      };

      AxisView.prototype._tick_label_extent = function() {
        var angle, c, coords, dim, extent, factor, h, i, labels, orient, s, side, val, w, _i, _j, _ref1, _ref2;
        extent = 0;
        dim = this.mget('dimension');
        coords = this.mget('major_coords');
        side = this.mget('side');
        orient = this.mget('major_label_orientation');
        labels = this.formatter.format(coords[dim]);
        this.major_label_props.set(this.plot_view.ctx, this);
        if (_.isString(orient)) {
          factor = 1;
          angle = _angle_lookup[side][orient];
        } else {
          factor = 2;
          angle = -orient;
        }
        angle = Math.abs(angle);
        c = Math.cos(angle);
        s = Math.sin(angle);
        if (side === "top" || side === "bottom") {
          for (i = _i = 0, _ref1 = labels.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
            if (labels[i] == null) {
              continue;
            }
            w = this.plot_view.ctx.measureText(labels[i]).width * 1.1;
            h = this.plot_view.ctx.measureText(labels[i]).ascent * 0.9;
            val = w * s + (h / factor) * c;
            if (val > extent) {
              extent = val;
            }
          }
        } else {
          for (i = _j = 0, _ref2 = labels.length; 0 <= _ref2 ? _j < _ref2 : _j > _ref2; i = 0 <= _ref2 ? ++_j : --_j) {
            if (labels[i] == null) {
              continue;
            }
            w = this.plot_view.ctx.measureText(labels[i]).width * 1.1;
            h = this.plot_view.ctx.measureText(labels[i]).ascent * 0.9;
            val = w * c + (h / factor) * s;
            if (val > extent) {
              extent = val;
            }
          }
        }
        if (extent > 0) {
          extent += this.mget('major_label_standoff');
        }
        return extent;
      };

      AxisView.prototype._axis_label_extent = function() {
        var angle, c, extent, h, orient, s, side, w;
        extent = 0;
        side = this.mget('side');
        orient = 'parallel';
        this.major_label_props.set(this.plot_view.ctx, this);
        angle = Math.abs(_angle_lookup[side][orient]);
        c = Math.cos(angle);
        s = Math.sin(angle);
        if (this.mget('axis_label')) {
          extent += this.mget('axis_label_standoff');
          this.axis_label_props.set(this.plot_view.ctx, this);
          w = this.plot_view.ctx.measureText(this.mget('axis_label')).width * 1.1;
          h = this.plot_view.ctx.measureText(this.mget('axis_label')).ascent * 0.9;
          if (side === "top" || side === "bottom") {
            extent += w * s + h * c;
          } else {
            extent += w * c + h * s;
          }
        }
        return extent;
      };

      AxisView.prototype._padding_request = function() {
        var loc, padding, req, side, _ref1;
        req = {};
        side = this.mget('side');
        loc = (_ref1 = this.mget('location')) != null ? _ref1 : 'min';
        if (!_.isString(loc)) {
          return req;
        }
        padding = 0;
        padding += this._tick_extent();
        padding += this._tick_label_extent();
        padding += this._axis_label_extent();
        req[side] = padding;
        return req;
      };

      return AxisView;

    })(PlotWidget);
    Axis = (function(_super) {
      __extends(Axis, _super);

      function Axis() {
        _ref1 = Axis.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      Axis.prototype.default_view = AxisView;

      Axis.prototype.type = 'Axis';

      Axis.prototype.initialize = function(attrs, options) {
        Axis.__super__.initialize.call(this, attrs, options);
        this.scale = options.scale;
        this.register_property('computed_bounds', this._bounds, false);
        this.add_dependencies('computed_bounds', this, ['bounds']);
        this.register_property('rule_coords', this._rule_coords, false);
        this.add_dependencies('rule_coords', this, ['computed_bounds', 'dimension', 'location']);
        this.register_property('major_coords', this._major_coords, false);
        this.add_dependencies('major_coords', this, ['computed_bounds', 'dimension', 'location']);
        this.register_property('normals', this._normals, true);
        this.add_dependencies('normals', this, ['computed_bounds', 'dimension', 'location']);
        this.register_property('side', this._side, false);
        this.add_dependencies('side', this, ['normals']);
        return this.register_property('padding_request', this._padding_request, false);
      };

      Axis.prototype.dinitialize = function(attrs, options) {
        return this.add_dependencies('computed_bounds', this.get_obj('plot'), ['x_range', 'y_range']);
      };

      Axis.prototype._bounds = function() {
        var end, i, j, range_bounds, ranges, start, user_bounds, _ref2;
        i = this.get('dimension');
        j = (i + 1) % 2;
        ranges = [this.get_obj('plot').get_obj('x_range'), this.get_obj('plot').get_obj('y_range')];
        user_bounds = (_ref2 = this.get('bounds')) != null ? _ref2 : 'auto';
        range_bounds = [ranges[i].get('min'), ranges[i].get('max')];
        if (_.isArray(user_bounds)) {
          if (Math.abs(user_bounds[0] - user_bounds[1]) > Math.abs(range_bounds[0] - range_bounds[1])) {
            start = Math.max(Math.min(user_bounds[0], user_bounds[1]), range_bounds[0]);
            end = Math.min(Math.max(user_bounds[0], user_bounds[1]), range_bounds[1]);
          } else {
            start = Math.min(user_bounds[0], user_bounds[1]);
            end = Math.max(user_bounds[0], user_bounds[1]);
          }
        } else {
          start = range_bounds[0], end = range_bounds[1];
        }
        return [start, end];
      };

      Axis.prototype._rule_coords = function() {
        var cend, coords, cross_range, cstart, end, i, j, loc, range, ranges, start, xs, ys, _ref2, _ref3;
        i = this.get('dimension');
        j = (i + 1) % 2;
        ranges = [this.get_obj('plot').get_obj('x_range'), this.get_obj('plot').get_obj('y_range')];
        range = ranges[i];
        cross_range = ranges[j];
        _ref2 = this.get('computed_bounds'), start = _ref2[0], end = _ref2[1];
        xs = new Array(2);
        ys = new Array(2);
        coords = [xs, ys];
        cstart = cross_range.get('start');
        cend = cross_range.get('end');
        loc = (_ref3 = this.get('location')) != null ? _ref3 : 'min';
        if (_.isString(loc)) {
          if (loc === 'left' || loc === 'bottom') {
            if (cstart < cend) {
              loc = 'start';
            } else {
              loc = 'end';
            }
          } else if (loc === 'right' || loc === 'top') {
            if (cstart < cend) {
              loc = 'end';
            } else {
              loc = 'start';
            }
          }
          loc = cross_range.get(loc);
        }
        coords[i][0] = Math.max(start, range.get('min'));
        coords[i][1] = Math.min(end, range.get('max'));
        if (coords[i][0] > coords[i][1]) {
          coords[i][0] = coords[i][1] = NaN;
        }
        coords[j][0] = loc;
        coords[j][1] = loc;
        return coords;
      };

      Axis.prototype._major_coords = function() {
        var cend, coords, cross_range, cstart, end, i, ii, j, loc, range, range_max, range_min, ranges, start, ticks, xs, ys, _i, _j, _ref2, _ref3, _ref4, _ref5, _ref6;
        i = this.get('dimension');
        j = (i + 1) % 2;
        ranges = [this.get_obj('plot').get_obj('x_range'), this.get_obj('plot').get_obj('y_range')];
        range = ranges[i];
        cross_range = ranges[j];
        _ref2 = this.get('computed_bounds'), start = _ref2[0], end = _ref2[1];
        ticks = this.scale.get_ticks(start, end, range, {});
        cstart = cross_range.get('start');
        cend = cross_range.get('end');
        loc = (_ref3 = this.get('location')) != null ? _ref3 : 'min';
        if (_.isString(loc)) {
          if (loc === 'left' || loc === 'bottom') {
            if (cstart < cend) {
              loc = 'start';
            } else {
              loc = 'end';
            }
          } else if (loc === 'right' || loc === 'top') {
            if (cstart < cend) {
              loc = 'end';
            } else {
              loc = 'start';
            }
          }
          loc = cross_range.get(loc);
        }
        xs = [];
        ys = [];
        coords = [xs, ys];
        if (range.type === "FactorRange") {
          for (ii = _i = 0, _ref4 = ticks.length; 0 <= _ref4 ? _i < _ref4 : _i > _ref4; ii = 0 <= _ref4 ? ++_i : --_i) {
            coords[i].push(ticks[ii]);
            coords[j].push(loc);
          }
        } else {
          _ref5 = [range.get('min'), range.get('max')], range_min = _ref5[0], range_max = _ref5[1];
          for (ii = _j = 0, _ref6 = ticks.length; 0 <= _ref6 ? _j < _ref6 : _j > _ref6; ii = 0 <= _ref6 ? ++_j : --_j) {
            if (ticks[ii] < range_min || ticks[ii] > range_max) {
              continue;
            }
            coords[i].push(ticks[ii]);
            coords[j].push(loc);
          }
        }
        return coords;
      };

      Axis.prototype._normals = function() {
        var cend, cross_range, cstart, end, i, idir, j, jdir, loc, normals, range, ranges, start, _ref2, _ref3;
        i = this.get('dimension');
        j = (i + 1) % 2;
        ranges = [this.get_obj('plot').get_obj('x_range'), this.get_obj('plot').get_obj('y_range')];
        range = ranges[i];
        cross_range = ranges[j];
        _ref2 = this.get('computed_bounds'), start = _ref2[0], end = _ref2[1];
        cstart = cross_range.get('start');
        cend = cross_range.get('end');
        loc = (_ref3 = this.get('location')) != null ? _ref3 : 'min';
        normals = [0, 0];
        if (_.isString(loc)) {
          if (start > end) {
            idir = "flip";
          } else {
            idir = "norm";
          }
          if (cstart > cend) {
            jdir = "flip";
            if (loc === "left" || loc === "bottom") {
              loc = "max";
            } else if (loc === "top" || loc === "right") {
              loc = "max";
            }
          } else {
            jdir = "norm";
            if (loc === "left" || loc === "bottom") {
              loc = "min";
            } else if (loc === "top" || loc === "right") {
              loc = "max";
            }
          }
          normals[j] = _normal_lookup[i][idir][jdir][loc];
        } else {
          if (i === 0) {
            if (Math.abs(loc - cstart) <= Math.abs(loc - cend)) {
              normals[j] = 1;
            } else {
              normals[j] = -1;
            }
          } else {
            if (Math.abs(loc - cstart) <= Math.abs(loc - cend)) {
              normals[j] = -1;
            } else {
              normals[j] = 1;
            }
          }
        }
        return normals;
      };

      Axis.prototype._side = function() {
        var n, side;
        n = this.get('normals');
        if (n[1] === -1) {
          side = 'top';
        } else if (n[1] === 1) {
          side = 'bottom';
        } else if (n[0] === -1) {
          side = 'left';
        } else if (n[0] === 1) {
          side = 'right';
        }
        return side;
      };

      Axis.prototype.display_defaults = function() {
        return {
          level: 'overlay',
          axis_line_color: 'black',
          axis_line_width: 1,
          axis_line_alpha: 1.0,
          axis_line_join: 'miter',
          axis_line_cap: 'butt',
          axis_line_dash: [],
          axis_line_dash_offset: 0,
          major_tick_in: 2,
          major_tick_out: 6,
          major_tick_line_color: 'black',
          major_tick_line_width: 1,
          major_tick_line_alpha: 1.0,
          major_tick_line_join: 'miter',
          major_tick_line_cap: 'butt',
          major_tick_line_dash: [],
          major_tick_line_dash_offset: 0,
          major_label_standoff: 5,
          major_label_orientation: "horizontal",
          major_label_text_font: "helvetica",
          major_label_text_font_size: "10pt",
          major_label_text_font_style: "normal",
          major_label_text_color: "#444444",
          major_label_text_alpha: 1.0,
          major_label_text_align: "center",
          major_label_text_baseline: "alphabetic",
          axis_label: "",
          axis_label_standoff: 5,
          axis_label_text_font: "helvetica",
          axis_label_text_font_size: "16pt",
          axis_label_text_font_style: "normal",
          axis_label_text_color: "#444444",
          axis_label_text_alpha: 1.0,
          axis_label_text_align: "center",
          axis_label_text_baseline: "alphabetic"
        };
      };

      return Axis;

    })(HasParent);
    return {
      "Model": Axis,
      "View": AxisView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=axis.js.map
*/