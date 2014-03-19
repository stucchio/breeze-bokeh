(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "backbone", "./tool", "./event_generators"], function(_, Backbone, Tool, EventGenerators) {
    var PanTool, PanToolView, PanTools, TwoPointEventGenerator, _ref, _ref1, _ref2;
    TwoPointEventGenerator = EventGenerators.TwoPointEventGenerator;
    window.render_count = 0;
    PanToolView = (function(_super) {
      __extends(PanToolView, _super);

      function PanToolView() {
        _ref = PanToolView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      PanToolView.prototype.initialize = function(options) {
        return PanToolView.__super__.initialize.call(this, options);
      };

      PanToolView.prototype.bind_bokeh_events = function() {
        return PanToolView.__super__.bind_bokeh_events.call(this);
      };

      PanToolView.prototype.eventGeneratorClass = TwoPointEventGenerator;

      PanToolView.prototype.toolType = "PanTool";

      PanToolView.prototype.evgen_options = {
        keyName: null,
        buttonText: "Pan",
        cursor: "move",
        auto_deactivate: true,
        restrict_to_innercanvas: true
      };

      PanToolView.prototype.tool_events = {
        UpdatingMouseMove: "_drag",
        SetBasepoint: "_set_base_point"
      };

      PanToolView.prototype.mouse_coords = function(e, x, y) {
        var x_, y_, _ref1;
        _ref1 = [this.plot_view.view_state.sx_to_vx(x), this.plot_view.view_state.sy_to_vy(y)], x_ = _ref1[0], y_ = _ref1[1];
        return [x_, y_];
      };

      PanToolView.prototype._set_base_point = function(e) {
        var _ref1;
        _ref1 = this.mouse_coords(e, e.bokehX, e.bokehY), this.x = _ref1[0], this.y = _ref1[1];
        return null;
      };

      PanToolView.prototype._drag = function(e) {
        var pan_info, sx_high, sx_low, sy_high, sy_low, x, xdiff, xend, xr, xstart, y, ydiff, yend, yr, ystart, _ref1, _ref2;
        _ref1 = this.mouse_coords(e, e.bokehX, e.bokehY), x = _ref1[0], y = _ref1[1];
        xdiff = x - this.x;
        ydiff = y - this.y;
        _ref2 = [x, y], this.x = _ref2[0], this.y = _ref2[1];
        xr = this.plot_view.view_state.get('inner_range_horizontal');
        sx_low = xr.get('start') - xdiff;
        sx_high = xr.get('end') - xdiff;
        yr = this.plot_view.view_state.get('inner_range_vertical');
        sy_low = yr.get('start') - ydiff;
        sy_high = yr.get('end') - ydiff;
        xstart = this.plot_view.xmapper.map_from_target(sx_low);
        xend = this.plot_view.xmapper.map_from_target(sx_high);
        ystart = this.plot_view.ymapper.map_from_target(sy_low);
        yend = this.plot_view.ymapper.map_from_target(sy_high);
        pan_info = {
          xr: {
            start: xstart,
            end: xend
          },
          yr: {
            start: ystart,
            end: yend
          },
          sdx: -xdiff,
          sdy: ydiff
        };
        this.plot_view.update_range(pan_info);
        return null;
      };

      return PanToolView;

    })(Tool.View);
    PanTool = (function(_super) {
      __extends(PanTool, _super);

      function PanTool() {
        _ref1 = PanTool.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      PanTool.prototype.default_view = PanToolView;

      PanTool.prototype.type = "PanTool";

      PanTool.prototype.defaults = function() {
        return {
          dimensions: []
        };
      };

      PanTool.prototype.display_defaults = function() {
        return PanTool.__super__.display_defaults.call(this);
      };

      return PanTool;

    })(Tool.Model);
    PanTools = (function(_super) {
      __extends(PanTools, _super);

      function PanTools() {
        _ref2 = PanTools.__super__.constructor.apply(this, arguments);
        return _ref2;
      }

      PanTools.prototype.model = PanTool;

      return PanTools;

    })(Backbone.Collection);
    return {
      "Model": PanTool,
      "Collection": new PanTools(),
      "View": PanToolView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=pan_tool.js.map
*/