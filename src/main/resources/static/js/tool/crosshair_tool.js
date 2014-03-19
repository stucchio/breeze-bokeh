(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "backbone", "./tool", "./event_generators", "sprintf"], function(_, Backbone, Tool, EventGenerators, sprintf) {
    var CrosshairTool, CrosshairToolView, CrosshairTools, TwoPointEventGenerator, _ref, _ref1, _ref2;
    TwoPointEventGenerator = EventGenerators.TwoPointEventGenerator;
    CrosshairToolView = (function(_super) {
      __extends(CrosshairToolView, _super);

      function CrosshairToolView() {
        _ref = CrosshairToolView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      CrosshairToolView.prototype.initialize = function(options) {
        CrosshairToolView.__super__.initialize.call(this, options);
        return this.active = false;
      };

      CrosshairToolView.prototype.bind_events = function(plotview) {
        return CrosshairToolView.__super__.bind_events.call(this, plotview);
      };

      CrosshairToolView.prototype.eventGeneratorClass = TwoPointEventGenerator;

      CrosshairToolView.prototype.toolType = "CrosshairTool";

      CrosshairToolView.prototype.evgen_options = {
        keyName: "",
        buttonText: "Crosshair",
        cursor: "crosshair"
      };

      CrosshairToolView.prototype.tool_events = {
        activated: "_activate",
        deactivated: "_deactivate",
        UpdatingMouseMove: "_drag",
        SetBasepoint: "_set_base_point"
      };

      CrosshairToolView.prototype.render = function() {
        var ch, ctx, cw, line_width;
        if (!this.active) {
          return;
        }
        ctx = this.plot_view.ctx;
        cw = this.plot_view.view_state.get('canvas_width');
        ch = this.plot_view.view_state.get('canvas_height');
        line_width = 1;
        ctx.save();
        ctx.strokeStyle = 'red';
        ctx.globalAlpha = 0.7;
        ctx.lineWidth = line_width;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(0, this.y);
        ctx.lineTo(cw, this.y);
        console.log(this.x, this.y);
        ctx.moveTo(this.x, 0);
        ctx.lineTo(this.x, ch);
        ctx.stroke();
        return ctx.restore();
      };

      CrosshairToolView.prototype.mouse_coords = function(e, x, y) {
        return [x, y];
      };

      CrosshairToolView.prototype._activate = function(e) {
        var bbar, ch, cw;
        if (this.active) {
          return;
        }
        this.active = true;
        this.popup = $('<div class="resize_popup pull-right"\nstyle="border-radius: 10px; background-color: lightgrey; padding:3px 8px; font-size: 14px;\nposition:absolute; right:20px; top: 20px; "></div>');
        bbar = this.plot_view.$el.find('.bokeh_canvas_wrapper');
        this.popup.appendTo(bbar);
        ch = this.plot_view.view_state.get('outer_height');
        cw = this.plot_view.view_state.get('outer_width');
        this.popup.text("x: 0 y:0");
        this.plot_view.$el.css("cursor", "crosshair");
        return null;
      };

      CrosshairToolView.prototype._deactivate = function(e) {
        this.active = false;
        this.plot_view.$el.css("cursor", "default");
        this.popup.remove();
        this.request_render();
        this.plot_view.request_render();
        return null;
      };

      CrosshairToolView.prototype._set_base_point = function(e) {
        var _ref1;
        _ref1 = this.mouse_coords(e, e.bokehX, e.bokehY), this.x = _ref1[0], this.y = _ref1[1];
        return null;
      };

      CrosshairToolView.prototype._drag = function(e) {
        var data_x, data_y, _ref1;
        this.plot_view.pause();
        _ref1 = this.mouse_coords(e, e.bokehX, e.bokehY), this.x = _ref1[0], this.y = _ref1[1];
        data_x = sprintf("%.4f", this.plot_view.xmapper.map_from_target(x));
        data_y = sprintf("%.4f", this.plot_view.ymapper.map_from_target(y));
        this.popup.text("x: " + data_x + " y: " + data_y);
        this.request_render();
        this.plot_view.request_render();
        this.plot_view.unpause(true);
        return null;
      };

      return CrosshairToolView;

    })(Tool.View);
    CrosshairTool = (function(_super) {
      __extends(CrosshairTool, _super);

      function CrosshairTool() {
        _ref1 = CrosshairTool.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      CrosshairTool.prototype.default_view = CrosshairToolView;

      CrosshairTool.prototype.type = "CrosshairTool";

      CrosshairTool.prototype.display_defaults = function() {
        return CrosshairTool.__super__.display_defaults.call(this);
      };

      return CrosshairTool;

    })(Tool.Model);
    CrosshairTools = (function(_super) {
      __extends(CrosshairTools, _super);

      function CrosshairTools() {
        _ref2 = CrosshairTools.__super__.constructor.apply(this, arguments);
        return _ref2;
      }

      CrosshairTools.prototype.model = CrosshairTool;

      return CrosshairTools;

    })(Backbone.Collection);
    return {
      "Model": CrosshairTool,
      "Collection": new CrosshairTools(),
      "View": CrosshairToolView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=crosshair_tool.js.map
*/