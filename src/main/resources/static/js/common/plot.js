(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "backbone", "require", "./build_views", "./safebind", "./bulk_save", "./continuum_view", "./has_parent", "./view_state", "mapper/1d/linear_mapper", "mapper/1d/categorical_mapper", "mapper/2d/grid_mapper", "renderer/properties", "tool/active_tool_manager"], function(_, Backbone, require, build_views, safebind, bulk_save, ContinuumView, HasParent, ViewState, LinearMapper, CategoricalMapper, GridMapper, Properties, ActiveToolManager) {
    var LEVELS, Plot, PlotView, Plots, delay_animation, line_properties, text_properties, throttle_animation, _ref, _ref1, _ref2;
    line_properties = Properties.line_properties;
    text_properties = Properties.text_properties;
    LEVELS = ['image', 'underlay', 'glyph', 'overlay', 'annotation', 'tool'];
    delay_animation = function(f) {
      return f();
    };
    delay_animation = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || delay_animation;
    throttle_animation = function(func, wait) {
      var args, context, later, pending, previous, result, timeout, _ref;
      _ref = [null, null, null, null], context = _ref[0], args = _ref[1], timeout = _ref[2], result = _ref[3];
      previous = 0;
      pending = false;
      later = function() {
        previous = new Date;
        timeout = null;
        pending = false;
        return result = func.apply(context, args);
      };
      return function() {
        var now, remaining;
        now = new Date;
        remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 && !pending) {
          clearTimeout(timeout);
          pending = true;
          delay_animation(later);
        } else if (!timeout) {
          timeout = setTimeout((function() {
            return delay_animation(later);
          }), remaining);
        }
        return result;
      };
    };
    PlotView = (function(_super) {
      __extends(PlotView, _super);

      function PlotView() {
        this._mousemove = __bind(this._mousemove, this);
        this._mousedown = __bind(this._mousedown, this);
        _ref = PlotView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      PlotView.prototype.className = "bokeh plotview";

      PlotView.prototype.events = {
        "mousemove .bokeh_canvas_wrapper": "_mousemove",
        "mousedown .bokeh_canvas_wrapper": "_mousedown"
      };

      PlotView.prototype.view_options = function() {
        return _.extend({
          plot_model: this.model,
          plot_view: this
        }, this.options);
      };

      PlotView.prototype._mousedown = function(e) {
        var f, _i, _len, _ref1, _results;
        _ref1 = this.mousedownCallbacks;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          f = _ref1[_i];
          _results.push(f(e, e.layerX, e.layerY));
        }
        return _results;
      };

      PlotView.prototype._mousemove = function(e) {
        var f, _i, _len, _ref1, _results;
        _ref1 = this.moveCallbacks;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          f = _ref1[_i];
          _results.push(f(e, e.layerX, e.layerY));
        }
        return _results;
      };

      PlotView.prototype.pause = function() {
        return this.is_paused = true;
      };

      PlotView.prototype.unpause = function(render_canvas) {
        if (render_canvas == null) {
          render_canvas = false;
        }
        this.is_paused = false;
        if (render_canvas) {
          return this.request_render_canvas(true);
        } else {
          return this.request_render();
        }
      };

      PlotView.prototype.request_render = function() {
        if (!this.is_paused) {
          this.throttled_render();
        }
      };

      PlotView.prototype.request_render_canvas = function(full_render) {
        if (!this.is_paused) {
          this.throttled_render_canvas(full_render);
        }
      };

      PlotView.prototype.initialize = function(options) {
        var level, xmapper_type, ymapper_type, _i, _len, _ref1, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref16, _ref17, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
        PlotView.__super__.initialize.call(this, _.defaults(options, this.default_options));
        this.throttled_render = throttle_animation(this.render, 15);
        this.throttled_render_canvas = throttle_animation(this.render_canvas, 15);
        this.outline_props = new line_properties(this, {}, 'outline_');
        this.title_props = new text_properties(this, {}, 'title_');
        this.view_state = new ViewState({
          canvas_width: (_ref1 = options.canvas_width) != null ? _ref1 : this.mget('canvas_width'),
          canvas_height: (_ref2 = options.canvas_height) != null ? _ref2 : this.mget('canvas_height'),
          x_offset: (_ref3 = options.x_offset) != null ? _ref3 : this.mget('x_offset'),
          y_offset: (_ref4 = options.y_offset) != null ? _ref4 : this.mget('y_offset'),
          outer_width: (_ref5 = options.outer_width) != null ? _ref5 : this.mget('outer_width'),
          outer_height: (_ref6 = options.outer_height) != null ? _ref6 : this.mget('outer_height'),
          min_border_top: (_ref7 = (_ref8 = options.min_border_top) != null ? _ref8 : this.mget('min_border_top')) != null ? _ref7 : this.mget('min_border'),
          min_border_bottom: (_ref9 = (_ref10 = options.min_border_bottom) != null ? _ref10 : this.mget('min_border_bottom')) != null ? _ref9 : this.mget('min_border'),
          min_border_left: (_ref11 = (_ref12 = options.min_border_left) != null ? _ref12 : this.mget('min_border_left')) != null ? _ref11 : this.mget('min_border'),
          min_border_right: (_ref13 = (_ref14 = options.min_border_right) != null ? _ref14 : this.mget('min_border_right')) != null ? _ref13 : this.mget('min_border'),
          requested_border_top: 0,
          requested_border_bottom: 0,
          requested_border_left: 0,
          requested_border_right: 0
        });
        this.hidpi = (_ref15 = options.hidpi) != null ? _ref15 : this.mget('hidpi');
        this.x_range = (_ref16 = options.x_range) != null ? _ref16 : this.mget_obj('x_range');
        this.y_range = (_ref17 = options.y_range) != null ? _ref17 : this.mget_obj('y_range');
        xmapper_type = LinearMapper;
        if (this.x_range.type === "FactorRange") {
          xmapper_type = CategoricalMapper;
        }
        this.xmapper = new xmapper_type({
          source_range: this.x_range,
          target_range: this.view_state.get('inner_range_horizontal')
        });
        ymapper_type = LinearMapper;
        if (this.y_range.type === "FactorRange") {
          ymapper_type = CategoricalMapper;
        }
        this.ymapper = new ymapper_type({
          source_range: this.y_range,
          target_range: this.view_state.get('inner_range_vertical')
        });
        this.mapper = new GridMapper({
          domain_mapper: this.xmapper,
          codomain_mapper: this.ymapper
        });
        this.requested_padding = {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        };
        this.old_mapper_state = {
          x: null,
          y: null
        };
        this.am_rendering = false;
        this.renderers = {};
        this.tools = {};
        this.eventSink = _.extend({}, Backbone.Events);
        this.moveCallbacks = [];
        this.mousedownCallbacks = [];
        this.keydownCallbacks = [];
        this.render_init();
        this.render_canvas(false);
        this.atm = new ActiveToolManager(this.eventSink);
        this.levels = {};
        for (_i = 0, _len = LEVELS.length; _i < _len; _i++) {
          level = LEVELS[_i];
          this.levels[level] = {};
        }
        this.build_levels();
        this.request_render();
        this.atm.bind_bokeh_events();
        this.bind_bokeh_events();
        return this;
      };

      PlotView.prototype.map_to_screen = function(x, x_units, y, y_units) {
        var sx, sy;
        if (x_units === 'screen') {
          if (_.isArray(x)) {
            sx = x.slice(0);
          } else {
            sx = new Float64Array(x.length);
            sx.set(x);
          }
        } else {
          sx = this.xmapper.v_map_to_target(x);
        }
        if (y_units === 'screen') {
          if (_.isArray(y)) {
            sy = y.slice(0);
          } else {
            sy = new Float64Array(y.length);
            sy.set(y);
          }
        } else {
          sy = this.ymapper.v_map_to_target(y);
        }
        sx = this.view_state.v_vx_to_sx(sx);
        sy = this.view_state.v_vy_to_sy(sy);
        return [sx, sy];
      };

      PlotView.prototype.map_from_screen = function(sx, sy, units) {
        var dx, dy, x, y, _ref1;
        if (_.isArray(sx)) {
          dx = sx.slice(0);
        } else {
          dx = new Float64Array(sx.length);
          dx.set(x);
        }
        if (_.isArray(sy)) {
          dy = sy.slice(0);
        } else {
          dy = new Float64Array(sy.length);
          dy.set(y);
        }
        sx = this.view_state.v_sx_to_vx(dx);
        sy = this.view_state.v_sy_to_vy(dy);
        if (units === 'screen') {
          x = sx;
          y = sy;
        } else {
          _ref1 = this.mapper.v_map_from_target(sx, sy), x = _ref1[0], y = _ref1[1];
        }
        return [x, y];
      };

      PlotView.prototype.update_range = function(range_info) {
        if (range_info == null) {
          range_info = this.initial_range_info;
        }
        this.pause();
        this.x_range.set(range_info.xr);
        this.y_range.set(range_info.yr);
        return this.unpause();
      };

      PlotView.prototype.build_tools = function() {
        return build_views(this.tools, this.mget_obj('tools'), this.view_options());
      };

      PlotView.prototype.build_views = function() {
        return build_views(this.renderers, this.mget_obj('renderers'), this.view_options());
      };

      PlotView.prototype.build_levels = function() {
        var id_, level, old_renderers, renderers_to_remove, t, tools, v, views, _i, _j, _k, _len, _len1, _len2;
        old_renderers = _.keys(this.renderers);
        views = this.build_views();
        renderers_to_remove = _.difference(old_renderers, _.pluck(this.mget_obj('renderers'), 'id'));
        console.log('renderers_to_remove', renderers_to_remove);
        for (_i = 0, _len = renderers_to_remove.length; _i < _len; _i++) {
          id_ = renderers_to_remove[_i];
          delete this.levels.glyph[id_];
        }
        tools = this.build_tools();
        for (_j = 0, _len1 = views.length; _j < _len1; _j++) {
          v = views[_j];
          level = v.mget('level');
          this.levels[level][v.model.id] = v;
          v.bind_bokeh_events();
        }
        for (_k = 0, _len2 = tools.length; _k < _len2; _k++) {
          t = tools[_k];
          level = t.mget('level');
          this.levels[level][t.model.id] = t;
          t.bind_bokeh_events();
        }
        return this;
      };

      PlotView.prototype.bind_bokeh_events = function() {
        var _this = this;
        safebind(this, this.view_state, 'change', function() {
          _this.request_render_canvas();
          return _this.request_render();
        });
        safebind(this, this.x_range, 'change', this.request_render);
        safebind(this, this.y_range, 'change', this.request_render);
        safebind(this, this.model, 'change:renderers', this.build_levels);
        safebind(this, this.model, 'change:tool', this.build_levels);
        safebind(this, this.model, 'change', this.request_render);
        return safebind(this, this.model, 'destroy', function() {
          return _this.remove();
        });
      };

      PlotView.prototype.render_init = function() {
        this.$el.append($("<div class='button_bar btn-group pull-top'/>\n<div class='plotarea'>\n<div class='bokeh_canvas_wrapper'>\n  <canvas class='bokeh_canvas'></canvas>\n</div>\n</div>"));
        this.button_bar = this.$el.find('.button_bar');
        this.canvas_wrapper = this.$el.find('.bokeh_canvas_wrapper');
        return this.canvas = this.$el.find('canvas.bokeh_canvas');
      };

      PlotView.prototype.render_canvas = function(full_render) {
        var backingStoreRatio, devicePixelRatio, oh, ow, ratio;
        if (full_render == null) {
          full_render = true;
        }
        this.ctx = this.canvas[0].getContext('2d');
        if (this.hidpi) {
          devicePixelRatio = window.devicePixelRatio || 1;
          backingStoreRatio = this.ctx.webkitBackingStorePixelRatio || this.ctx.mozBackingStorePixelRatio || this.ctx.msBackingStorePixelRatio || this.ctx.oBackingStorePixelRatio || this.ctx.backingStorePixelRatio || 1;
          ratio = devicePixelRatio / backingStoreRatio;
        } else {
          ratio = 1;
        }
        ow = this.view_state.get('outer_width');
        oh = this.view_state.get('outer_height');
        this.canvas.width = ow * ratio;
        this.canvas.height = oh * ratio;
        this.button_bar.attr('style', "width:" + ow + "px;");
        this.canvas_wrapper.attr('style', "width:" + ow + "px; height:" + oh + "px");
        this.canvas.attr('style', "width:" + ow + "px;");
        this.canvas.attr('style', "height:" + oh + "px;");
        this.canvas.attr('width', ow * ratio).attr('height', oh * ratio);
        this.$el.attr("width", ow).attr('height', oh);
        this.ctx.scale(ratio, ratio);
        this.ctx.translate(0.5, 0.5);
        if (full_render) {
          return this.render();
        }
      };

      PlotView.prototype.save_png = function() {
        var data_uri;
        this.render();
        data_uri = this.canvas[0].toDataURL();
        this.model.set('png', this.canvas[0].toDataURL());
        return bulk_save([this.model]);
      };

      PlotView.prototype.render = function(force) {
        var have_new_mapper_state, hpadding, k, level, pr, renderers, sx, sy, sym, th, title, v, xms, yms, _i, _j, _len, _len1, _ref1, _ref2, _ref3;
        PlotView.__super__.render.call(this);
        if ((this.initial_range_info == null) && (this.x_range.get('start') != null)) {
          this.initial_range_info = {
            xr: {
              start: this.x_range.get('start'),
              end: this.x_range.get('end')
            },
            yr: {
              start: this.y_range.get('start'),
              end: this.y_range.get('end')
            }
          };
        }
        this.requested_padding = {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        };
        _ref1 = ['image', 'underlay', 'glyph', 'overlay', 'annotation', 'tool'];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          level = _ref1[_i];
          renderers = this.levels[level];
          for (k in renderers) {
            v = renderers[k];
            if (v.padding_request != null) {
              pr = v.padding_request();
              for (k in pr) {
                v = pr[k];
                this.requested_padding[k] += v;
              }
            }
          }
        }
        title = this.mget('title');
        if (title) {
          this.title_props.set(this.ctx, {});
          th = this.ctx.measureText(this.mget('title')).ascent;
          this.requested_padding['top'] += th + this.mget('title_standoff');
        }
        sym = this.mget('border_symmetry');
        if (sym.indexOf('h') >= 0 || sym.indexOf('H') >= 0) {
          hpadding = Math.max(this.requested_padding['left'], this.requested_padding['right']);
          this.requested_padding['left'] = hpadding;
          this.requested_padding['right'] = hpadding;
        }
        if (sym.indexOf('v') >= 0 || sym.indexOf('V') >= 0) {
          hpadding = Math.max(this.requested_padding['top'], this.requested_padding['bottom']);
          this.requested_padding['top'] = hpadding;
          this.requested_padding['bottom'] = hpadding;
        }
        this.is_paused = true;
        _ref2 = this.requested_padding;
        for (k in _ref2) {
          v = _ref2[k];
          this.view_state.set("requested_border_" + k, v);
        }
        this.is_paused = false;
        this.ctx.fillStyle = this.mget('border_fill');
        this.ctx.fillRect(0, 0, this.view_state.get('canvas_width'), this.view_state.get('canvas_height'));
        this.ctx.fillStyle = this.mget('background_fill');
        this.ctx.fillRect(this.view_state.get('border_left'), this.view_state.get('border_top'), this.view_state.get('inner_width'), this.view_state.get('inner_height'));
        if (this.outline_props.do_stroke) {
          this.outline_props.set(this.ctx, {});
          this.ctx.strokeRect(this.view_state.get('border_left'), this.view_state.get('border_top'), this.view_state.get('inner_width'), this.view_state.get('inner_height'));
        }
        have_new_mapper_state = false;
        xms = this.xmapper.get('mapper_state')[0];
        yms = this.ymapper.get('mapper_state')[0];
        if (Math.abs(this.old_mapper_state.x - xms) > 1e-8 || Math.abs(this.old_mapper_state.y - yms) > 1e-8) {
          this.old_mapper_state.x = xms;
          this.old_mapper_state.y = yms;
          have_new_mapper_state = true;
        }
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.rect(this.view_state.get('border_left'), this.view_state.get('border_top'), this.view_state.get('inner_width'), this.view_state.get('inner_height'));
        this.ctx.clip();
        this.ctx.beginPath();
        _ref3 = ['image', 'underlay', 'glyph'];
        for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
          level = _ref3[_j];
          renderers = this.levels[level];
          for (k in renderers) {
            v = renderers[k];
            v.render(have_new_mapper_state);
          }
        }
        this.ctx.restore();
        this.render_overlays(have_new_mapper_state);
        if (title) {
          sx = this.view_state.get('outer_width') / 2;
          sy = th;
          this.title_props.set(this.ctx, {});
          return this.ctx.fillText(title, sx, sy);
        }
      };

      PlotView.prototype.render_overlays = function(have_new_mapper_state) {
        var k, level, renderers, v, _i, _len, _ref1, _results;
        _ref1 = ['overlay', 'annotation', 'tool'];
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          level = _ref1[_i];
          renderers = this.levels[level];
          _results.push((function() {
            var _results1;
            _results1 = [];
            for (k in renderers) {
              v = renderers[k];
              _results1.push(v.render(have_new_mapper_state));
            }
            return _results1;
          })());
        }
        return _results;
      };

      return PlotView;

    })(ContinuumView.View);
    Plot = (function(_super) {
      __extends(Plot, _super);

      function Plot() {
        _ref1 = Plot.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      Plot.prototype.type = 'Plot';

      Plot.prototype.default_view = PlotView;

      Plot.prototype.add_renderers = function(new_renderers) {
        var renderers;
        renderers = this.get('renderers');
        renderers = renderers.concat(new_renderers);
        return this.set('renderers', renderers);
      };

      Plot.prototype.parent_properties = ['background_fill', 'border_fill', 'canvas_width', 'canvas_height', 'outer_width', 'outer_height', 'min_border', 'min_border_top', 'min_border_bottom', 'min_border_left', 'min_border_right'];

      Plot.prototype.defaults = function() {
        return {
          data_sources: {},
          renderers: [],
          tools: [],
          title: 'Plot'
        };
      };

      Plot.prototype.display_defaults = function() {
        return {
          hidpi: true,
          background_fill: "#fff",
          border_fill: "#fff",
          border_symmetry: "h",
          min_border: 40,
          x_offset: 0,
          y_offset: 0,
          canvas_width: 300,
          canvas_height: 300,
          outer_width: 300,
          outer_height: 300,
          title_standoff: 8,
          title_text_font: "helvetica",
          title_text_font_size: "20pt",
          title_text_font_style: "normal",
          title_text_color: "#444444",
          title_text_alpha: 1.0,
          title_text_align: "center",
          title_text_baseline: "alphabetic",
          outline_line_color: '#aaaaaa',
          outline_line_width: 1,
          outline_line_alpha: 1.0,
          outline_line_join: 'miter',
          outline_line_cap: 'butt',
          outline_line_dash: [],
          outline_line_dash_offset: 0
        };
      };

      return Plot;

    })(HasParent);
    Plots = (function(_super) {
      __extends(Plots, _super);

      function Plots() {
        _ref2 = Plots.__super__.constructor.apply(this, arguments);
        return _ref2;
      }

      Plots.prototype.model = Plot;

      return Plots;

    })(Backbone.Collection);
    return {
      "Model": Plot,
      "Collection": new Plots(),
      "View": PlotView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=plot.js.map
*/