(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "jquery", "backbone", "./build_views", "./safebind", "./bulk_save", "./continuum_view", "./has_parent", "./view_state", "mapper/1d/linear_mapper", "mapper/2d/grid_mapper", "renderer/properties", "tool/active_tool_manager"], function(_, $, Backbone, build_views, safebind, bulk_save, ContinuumView, HasParent, ViewState, LinearMapper, GridMapper, Properties, ActiveToolManager) {
    var GMapPlot, GMapPlotView, GMapPlots, LEVELS, _ref, _ref1, _ref2;
    LEVELS = ['image', 'underlay', 'glyph', 'overlay', 'annotation', 'tool'];
    GMapPlotView = (function(_super) {
      __extends(GMapPlotView, _super);

      function GMapPlotView() {
        this.bounds_change = __bind(this.bounds_change, this);
        this._mousemove = __bind(this._mousemove, this);
        this._mousedown = __bind(this._mousedown, this);
        _ref = GMapPlotView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      GMapPlotView.prototype.events = {
        "mousemove .bokeh_canvas_wrapper": "_mousemove",
        "mousedown .bokeh_canvas_wrapper": "_mousedown"
      };

      GMapPlotView.prototype.className = "bokeh";

      GMapPlotView.prototype.view_options = function() {
        return _.extend({
          plot_model: this.model,
          plot_view: this
        }, this.options);
      };

      GMapPlotView.prototype._mousedown = function(e) {
        var f, _i, _len, _ref1, _results;
        _ref1 = this.mousedownCallbacks;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          f = _ref1[_i];
          _results.push(f(e, e.layerX, e.layerY));
        }
        return _results;
      };

      GMapPlotView.prototype._mousemove = function(e) {
        var f, _i, _len, _ref1, _results;
        _ref1 = this.moveCallbacks;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          f = _ref1[_i];
          _results.push(f(e, e.layerX, e.layerY));
        }
        return _results;
      };

      GMapPlotView.prototype.pause = function() {
        return this.is_paused = true;
      };

      GMapPlotView.prototype.unpause = function(render_canvas) {
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

      GMapPlotView.prototype.request_render = function() {
        if (!this.is_paused) {
          this.throttled_render();
        }
      };

      GMapPlotView.prototype.request_render_canvas = function(full_render) {
        if (!this.is_paused) {
          this.throttled_render_canvas(full_render);
        }
      };

      GMapPlotView.prototype.initialize = function(options) {
        var level, tool, _i, _j, _len, _len1, _ref1, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref16, _ref17, _ref18, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
        GMapPlotView.__super__.initialize.call(this, _.defaults(options, this.default_options));
        this.throttled_render = _.throttle(this.render, 100);
        this.throttled_render_canvas = _.throttle(this.render_canvas, 100);
        this.outline_props = new Properties.line_properties(this, {}, 'title_');
        this.title_props = new Properties.text_properties(this, {}, 'title_');
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
        this.xmapper = new LinearMapper({
          source_range: this.x_range,
          target_range: this.view_state.get('inner_range_horizontal')
        });
        this.ymapper = new LinearMapper({
          source_range: this.y_range,
          target_range: this.view_state.get('inner_range_vertical')
        });
        this.mapper = new GridMapper({
          domain_mapper: this.xmapper,
          codomain_mapper: this.ymapper
        });
        _ref18 = this.mget_obj('tools');
        for (_i = 0, _len = _ref18.length; _i < _len; _i++) {
          tool = _ref18[_i];
          if (tool.type === "PanTool" || tool.type === "WheelZoomTool") {
            tool.set_obj('dataranges', [this.x_range, this.y_range]);
            tool.set('dimensions', ['width', 'height']);
          }
        }
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
        this.zoom_count = null;
        this.eventSink = _.extend({}, Backbone.Events);
        this.moveCallbacks = [];
        this.mousedownCallbacks = [];
        this.keydownCallbacks = [];
        this.render_init();
        this.render_canvas(false);
        this.atm = new ActiveToolManager(this.eventSink);
        this.levels = {};
        for (_j = 0, _len1 = LEVELS.length; _j < _len1; _j++) {
          level = LEVELS[_j];
          this.levels[level] = {};
        }
        this.build_levels();
        this.request_render();
        this.atm.bind_bokeh_events();
        this.bind_bokeh_events();
        return this;
      };

      GMapPlotView.prototype.map_to_screen = function(x, x_units, y, y_units, units) {
        var sx, sy, _ref1;
        if (x_units === 'screen') {
          sx = x.slice(0);
          sy = y.slice(0);
        } else {
          _ref1 = this.mapper.v_map_to_target(x, y), sx = _ref1[0], sy = _ref1[1];
        }
        sx = this.view_state.v_vx_to_sx(sx);
        sy = this.view_state.v_vy_to_sy(sy);
        return [sx, sy];
      };

      GMapPlotView.prototype.map_from_screen = function(sx, sy, units) {
        var x, y, _ref1;
        sx = this.view_state.v_sx_to_vx(sx.slice(0));
        sy = this.view_state.v_sy_to_vy(sy.slice(0));
        if (units === 'screen') {
          x = sx;
          y = sy;
        } else {
          _ref1 = this.mapper.v_map_from_target(sx, sy), x = _ref1[0], y = _ref1[1];
        }
        return [x, y];
      };

      GMapPlotView.prototype.update_range = function(range_info) {
        var center, ne_lat, ne_lng, sw_lat, sw_lng;
        if (range_info == null) {
          range_info = this.initial_range_info;
        }
        this.pause();
        if (range_info.sdx != null) {
          this.map.panBy(range_info.sdx, range_info.sdy);
        } else {
          sw_lng = Math.min(range_info.xr.start, range_info.xr.end);
          ne_lng = Math.max(range_info.xr.start, range_info.xr.end);
          sw_lat = Math.min(range_info.yr.start, range_info.yr.end);
          ne_lat = Math.max(range_info.yr.start, range_info.yr.end);
          center = new google.maps.LatLng((ne_lat + sw_lat) / 2, (ne_lng + sw_lng) / 2);
          if (range_info.factor == null) {
            this.map.setCenter(center);
            this.map.setZoom(this.initial_zoom);
          } else if (range_info.factor > 0) {
            this.zoom_count += 1;
            if (this.zoom_count === 10) {
              this.map.setZoom(this.map.getZoom() + 1);
              this.zoom_count = 0;
            }
          } else {
            this.zoom_count -= 1;
            if (this.zoom_count === -10) {
              this.map.setCenter(center);
              this.map.setZoom(this.map.getZoom() - 1);
              this.map.setCenter(center);
              this.zoom_count = 0;
            }
          }
        }
        return this.unpause();
      };

      GMapPlotView.prototype.build_tools = function() {
        return build_views(this.tools, this.mget_obj('tools'), this.view_options());
      };

      GMapPlotView.prototype.build_views = function() {
        return build_views(this.renderers, this.mget_obj('renderers'), this.view_options());
      };

      GMapPlotView.prototype.build_levels = function() {
        var level, t, tools, v, views, _i, _j, _len, _len1;
        views = this.build_views();
        tools = this.build_tools();
        for (_i = 0, _len = views.length; _i < _len; _i++) {
          v = views[_i];
          level = v.mget('level');
          this.levels[level][v.model.id] = v;
          v.bind_bokeh_events();
        }
        for (_j = 0, _len1 = tools.length; _j < _len1; _j++) {
          t = tools[_j];
          level = t.mget('level');
          this.levels[level][t.model.id] = t;
          t.bind_bokeh_events();
        }
        return this;
      };

      GMapPlotView.prototype.bind_bokeh_events = function() {
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

      GMapPlotView.prototype.render_init = function() {
        this.$el.append($("<div class='button_bar btn-group'/>\n<div class='plotarea'>\n<div class='bokeh_canvas_wrapper'>\n  <div class=\"bokeh_gmap\"></div>\n  <canvas class='bokeh_canvas'></canvas>\n</div>\n</div>"));
        this.button_bar = this.$el.find('.button_bar');
        this.canvas_wrapper = this.$el.find('.bokeh_canvas_wrapper');
        this.canvas = this.$el.find('canvas.bokeh_canvas');
        return this.gmap_div = this.$el.find('.bokeh_gmap');
      };

      GMapPlotView.prototype.render_canvas = function(full_render) {
        var backingStoreRatio, build_map, devicePixelRatio, ih, iw, left, oh, ow, ratio, top,
          _this = this;
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
        oh = this.view_state.get('outer_height');
        ow = this.view_state.get('outer_width');
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
        iw = this.view_state.get('inner_width');
        ih = this.view_state.get('inner_height');
        top = this.view_state.get('border_top');
        left = this.view_state.get('border_left');
        this.gmap_div.attr("style", "top: " + top + "px; left: " + left + "px; position: absolute");
        this.gmap_div.attr('style', "width:" + iw + "px;");
        this.gmap_div.attr('style', "height:" + ih + "px;");
        this.gmap_div.width("" + iw + "px").height("" + ih + "px");
        this.initial_zoom = this.mget('map_options').zoom;
        build_map = function() {
          var map_options, mo;
          mo = _this.mget('map_options');
          map_options = {
            center: new google.maps.LatLng(mo.lat, mo.lng),
            zoom: mo.zoom,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.SATELLITE
          };
          _this.map = new google.maps.Map(_this.gmap_div[0], map_options);
          return google.maps.event.addListener(_this.map, 'bounds_changed', _this.bounds_change);
        };
        _.defer(build_map);
        if (full_render) {
          return this.render();
        }
      };

      GMapPlotView.prototype.bounds_change = function() {
        var bds, ne, sw;
        bds = this.map.getBounds();
        ne = bds.getNorthEast();
        sw = bds.getSouthWest();
        this.x_range.set({
          start: sw.lng(),
          end: ne.lng(),
          silent: true
        });
        this.y_range.set({
          start: sw.lat(),
          end: ne.lat()
        });
        if (this.initial_range_info == null) {
          return this.initial_range_info = {
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
      };

      GMapPlotView.prototype.save_png = function() {
        var data_uri;
        this.render();
        data_uri = this.canvas[0].toDataURL();
        this.model.set('png', this.canvas[0].toDataURL());
        return bulk_save([this.model]);
      };

      GMapPlotView.prototype.render = function(force) {
        var have_new_mapper_state, hpadding, ih, iw, k, left, level, oh, ow, pr, renderers, sx, sy, sym, th, title, top, v, xms, yms, _i, _j, _k, _len, _len1, _len2, _ref1, _ref2, _ref3, _ref4;
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
        oh = this.view_state.get('outer_height');
        ow = this.view_state.get('outer_width');
        iw = this.view_state.get('inner_width');
        ih = this.view_state.get('inner_height');
        top = this.view_state.get('border_top');
        left = this.view_state.get('border_left');
        this.gmap_div.attr("style", "top: " + top + "px; left: " + left + "px;");
        this.gmap_div.width("" + iw + "px").height("" + ih + "px");
        this.ctx.clearRect(0, 0, ow, oh);
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(0, oh);
        this.ctx.lineTo(ow, oh);
        this.ctx.lineTo(ow, 0);
        this.ctx.lineTo(0, 0);
        this.ctx.moveTo(left, top);
        this.ctx.lineTo(left + iw, top);
        this.ctx.lineTo(left + iw, top + ih);
        this.ctx.lineTo(left, top + ih);
        this.ctx.lineTo(left, top);
        this.ctx.closePath();
        this.ctx.fillStyle = this.mget('border_fill');
        this.ctx.fill();
        if (this.outline_props.do_stroke) {
          this.outline_props.set(this.ctx, {});
          this.ctx.strokeRect(this.view_state.get('border_left'), this.view_state.get('border_top'), this.view_state.get('inner_width'), this.view_state.get('inner_height'));
        }
        have_new_mapper_state = false;
        xms = this.xmapper.get('mapper_state')[0];
        yms = this.xmapper.get('mapper_state')[0];
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
        _ref4 = ['overlay', 'annotation', 'tool'];
        for (_k = 0, _len2 = _ref4.length; _k < _len2; _k++) {
          level = _ref4[_k];
          renderers = this.levels[level];
          for (k in renderers) {
            v = renderers[k];
            v.render(have_new_mapper_state);
          }
        }
        if (title) {
          sx = this.view_state.get('outer_width') / 2;
          sy = th;
          this.title_props.set(this.ctx, {});
          return this.ctx.fillText(title, sx, sy);
        }
      };

      return GMapPlotView;

    })(ContinuumView.View);
    GMapPlot = (function(_super) {
      __extends(GMapPlot, _super);

      function GMapPlot() {
        _ref1 = GMapPlot.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      GMapPlot.prototype.type = 'GMapPlot';

      GMapPlot.prototype.default_view = GMapPlotView;

      GMapPlot.prototype.add_renderers = function(new_renderers) {
        var renderers;
        renderers = this.get('renderers');
        renderers = renderers.concat(new_renderers);
        return this.set('renderers', renderers);
      };

      GMapPlot.prototype.parent_properties = ['border_fill', 'canvas_width', 'canvas_height', 'outer_width', 'outer_height', 'min_border', 'min_border_top', 'min_border_bottom', 'min_border_left', 'min_border_right'];

      GMapPlot.prototype.defaults = function() {
        return {
          data_sources: {},
          renderers: [],
          tools: [],
          title: 'GMapPlot'
        };
      };

      GMapPlot.prototype.display_defaults = function() {
        return {
          hidpi: true,
          border_fill: "#eee",
          border_symmetry: 'h',
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

      return GMapPlot;

    })(HasParent);
    GMapPlots = (function(_super) {
      __extends(GMapPlots, _super);

      function GMapPlots() {
        _ref2 = GMapPlots.__super__.constructor.apply(this, arguments);
        return _ref2;
      }

      GMapPlots.prototype.model = GMapPlot;

      return GMapPlots;

    })(Backbone.Collection);
    return {
      "Model": GMapPlot,
      "Collection": new GMapPlots(),
      "View": GMapPlotView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=gmap_plot.js.map
*/