(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "backbone", "./tool", "./event_generators"], function(_, Backbone, Tool, EventGenerators) {
    var OnePointWheelEventGenerator, WheelZoomTool, WheelZoomToolView, WheelZoomTools, _ref, _ref1, _ref2;
    OnePointWheelEventGenerator = EventGenerators.OnePointWheelEventGenerator;
    WheelZoomToolView = (function(_super) {
      __extends(WheelZoomToolView, _super);

      function WheelZoomToolView() {
        _ref = WheelZoomToolView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      WheelZoomToolView.prototype.initialize = function(options) {
        return WheelZoomToolView.__super__.initialize.call(this, options);
      };

      WheelZoomToolView.prototype.eventGeneratorClass = OnePointWheelEventGenerator;

      WheelZoomToolView.prototype.evgen_options = {
        buttonText: "WheelZoom"
      };

      WheelZoomToolView.prototype.tool_events = {
        zoom: "_zoom"
      };

      WheelZoomToolView.prototype.mouse_coords = function(e, x, y) {
        var x_, y_, _ref1;
        _ref1 = [this.plot_view.view_state.sx_to_vx(x), this.plot_view.view_state.sy_to_vy(y)], x_ = _ref1[0], y_ = _ref1[1];
        return [x_, y_];
      };

      WheelZoomToolView.prototype._zoom = function(e) {
        var delta, factor, screenX, screenY, speed, sx_high, sx_low, sy_high, sy_low, x, xend, xr, xstart, y, yend, yr, ystart, zoom_info, _ref1, _ref2, _ref3;
        delta = e.originalEvent.wheelDelta;
        screenX = e.bokehX;
        screenY = e.bokehY;
        _ref1 = this.mouse_coords(e, screenX, screenY), x = _ref1[0], y = _ref1[1];
        speed = this.mget('speed');
        factor = speed * delta;
        if (factor > 0.9) {
          factor = 0.9;
        } else if (factor < -0.9) {
          factor = -0.9;
        }
        xr = this.plot_view.view_state.get('inner_range_horizontal');
        sx_low = xr.get('start');
        sx_high = xr.get('end');
        yr = this.plot_view.view_state.get('inner_range_vertical');
        sy_low = yr.get('start');
        sy_high = yr.get('end');
        _ref2 = this.plot_view.xmapper.v_map_from_target([sx_low - (sx_low - x) * factor, sx_high - (sx_high - x) * factor]), xstart = _ref2[0], xend = _ref2[1];
        _ref3 = this.plot_view.ymapper.v_map_from_target([sy_low - (sy_low - y) * factor, sy_high - (sy_high - y) * factor]), ystart = _ref3[0], yend = _ref3[1];
        zoom_info = {
          xr: {
            start: xstart,
            end: xend
          },
          yr: {
            start: ystart,
            end: yend
          },
          factor: factor
        };
        this.plot_view.update_range(zoom_info);
        return null;
      };

      return WheelZoomToolView;

    })(Tool.View);
    WheelZoomTool = (function(_super) {
      __extends(WheelZoomTool, _super);

      function WheelZoomTool() {
        _ref1 = WheelZoomTool.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      WheelZoomTool.prototype.default_view = WheelZoomToolView;

      WheelZoomTool.prototype.type = "WheelZoomTool";

      WheelZoomTool.prototype.defaults = function() {
        return {
          dimensions: [],
          speed: 1 / 600
        };
      };

      return WheelZoomTool;

    })(Tool.Model);
    WheelZoomTools = (function(_super) {
      __extends(WheelZoomTools, _super);

      function WheelZoomTools() {
        _ref2 = WheelZoomTools.__super__.constructor.apply(this, arguments);
        return _ref2;
      }

      WheelZoomTools.prototype.model = WheelZoomTool;

      WheelZoomTools.prototype.display_defaults = function() {
        return WheelZoomTools.__super__.display_defaults.call(this);
      };

      return WheelZoomTools;

    })(Backbone.Collection);
    return {
      "Model": WheelZoomTool,
      "Collection": new WheelZoomTools(),
      "View": WheelZoomToolView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=wheel_zoom_tool.js.map
*/