(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "backbone", "./tool", "./event_generators"], function(_, Backbone, Tool, EventGenerators) {
    var ResizeTool, ResizeToolView, ResizeTools, TwoPointEventGenerator, _ref, _ref1, _ref2;
    TwoPointEventGenerator = EventGenerators.TwoPointEventGenerator;
    ResizeToolView = (function(_super) {
      __extends(ResizeToolView, _super);

      function ResizeToolView() {
        _ref = ResizeToolView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      ResizeToolView.prototype.initialize = function(options) {
        ResizeToolView.__super__.initialize.call(this, options);
        return this.active = false;
      };

      ResizeToolView.prototype.bind_events = function(plotview) {
        return ResizeToolView.__super__.bind_events.call(this, plotview);
      };

      ResizeToolView.prototype.eventGeneratorClass = TwoPointEventGenerator;

      ResizeToolView.prototype.toolType = "ResizeTool";

      ResizeToolView.prototype.evgen_options = {
        keyName: "",
        buttonText: "Resize",
        cursor: "move"
      };

      ResizeToolView.prototype.tool_events = {
        activated: "_activate",
        deactivated: "_deactivate",
        UpdatingMouseMove: "_drag",
        SetBasepoint: "_set_base_point"
      };

      ResizeToolView.prototype.render = function() {
        var ch, ctx, cw, line_width;
        if (!this.active) {
          return;
        }
        ctx = this.plot_view.ctx;
        cw = this.plot_view.view_state.get('canvas_width');
        ch = this.plot_view.view_state.get('canvas_height');
        line_width = 8;
        ctx.save();
        ctx.strokeStyle = 'grey';
        ctx.globalAlpha = 0.7;
        ctx.lineWidth = line_width;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.rect(line_width, line_width, cw - line_width * 2, ch - line_width * 2);
        ctx.moveTo(line_width, line_width);
        ctx.lineTo(cw - line_width, ch - line_width);
        ctx.moveTo(line_width, ch - line_width);
        ctx.lineTo(cw - line_width, line_width);
        ctx.stroke();
        return ctx.restore();
      };

      ResizeToolView.prototype.mouse_coords = function(e, x, y) {
        return [x, y];
      };

      ResizeToolView.prototype._activate = function(e) {
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
        this.popup.text("width: " + cw + " height: " + ch);
        this.request_render();
        this.plot_view.request_render();
        return null;
      };

      ResizeToolView.prototype._deactivate = function(e) {
        this.active = false;
        this.popup.remove();
        this.request_render();
        this.plot_view.request_render();
        return null;
      };

      ResizeToolView.prototype._set_base_point = function(e) {
        var _ref1;
        _ref1 = this.mouse_coords(e, e.bokehX, e.bokehY), this.x = _ref1[0], this.y = _ref1[1];
        return null;
      };

      ResizeToolView.prototype._drag = function(e) {
        var ch, cw, x, xdiff, y, ydiff, _ref1, _ref2;
        this.plot_view.pause();
        _ref1 = this.mouse_coords(e, e.bokehX, e.bokehY), x = _ref1[0], y = _ref1[1];
        xdiff = x - this.x;
        ydiff = y - this.y;
        _ref2 = [x, y], this.x = _ref2[0], this.y = _ref2[1];
        ch = this.plot_view.view_state.get('outer_height');
        cw = this.plot_view.view_state.get('outer_width');
        this.popup.text("width: " + cw + " height: " + ch);
        this.plot_view.view_state.set('outer_height', ch + ydiff, {
          'silent': true
        });
        this.plot_view.view_state.set('outer_width', cw + xdiff, {
          'silent': true
        });
        this.plot_view.view_state.set('canvas_height', ch + ydiff, {
          'silent': true
        });
        this.plot_view.view_state.set('canvas_width', cw + xdiff, {
          'silent': true
        });
        this.plot_view.view_state.trigger('change:outer_height', ch + ydiff);
        this.plot_view.view_state.trigger('change:outer_width', cw + xdiff);
        this.plot_view.view_state.trigger('change:canvas_height', ch + ydiff);
        this.plot_view.view_state.trigger('change:canvas_width', cw + xdiff);
        this.plot_view.view_state.trigger('change', this.plot_view.view_state);
        this.plot_view.unpause(true);
        return null;
      };

      return ResizeToolView;

    })(Tool.View);
    ResizeTool = (function(_super) {
      __extends(ResizeTool, _super);

      function ResizeTool() {
        _ref1 = ResizeTool.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      ResizeTool.prototype.default_view = ResizeToolView;

      ResizeTool.prototype.type = "ResizeTool";

      ResizeTool.prototype.display_defaults = function() {
        return ResizeTool.__super__.display_defaults.call(this);
      };

      return ResizeTool;

    })(Tool.Model);
    ResizeTools = (function(_super) {
      __extends(ResizeTools, _super);

      function ResizeTools() {
        _ref2 = ResizeTools.__super__.constructor.apply(this, arguments);
        return _ref2;
      }

      ResizeTools.prototype.model = ResizeTool;

      return ResizeTools;

    })(Backbone.Collection);
    return {
      "Model": ResizeTool,
      "Collection": new ResizeTools(),
      "View": ResizeToolView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=resize_tool.js.map
*/