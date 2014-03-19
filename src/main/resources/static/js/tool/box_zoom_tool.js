(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "backbone", "./tool", "./event_generators"], function(_, Backbone, Tool, EventGenerators) {
    var BoxZoomTool, BoxZoomToolView, BoxZoomTools, TwoPointEventGenerator, _ref, _ref1, _ref2;
    TwoPointEventGenerator = EventGenerators.TwoPointEventGenerator;
    BoxZoomToolView = (function(_super) {
      __extends(BoxZoomToolView, _super);

      function BoxZoomToolView() {
        _ref = BoxZoomToolView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      BoxZoomToolView.prototype.initialize = function(options) {
        return BoxZoomToolView.__super__.initialize.call(this, options);
      };

      BoxZoomToolView.prototype.bind_bokeh_events = function() {
        return BoxZoomToolView.__super__.bind_bokeh_events.call(this);
      };

      BoxZoomToolView.prototype.eventGeneratorClass = TwoPointEventGenerator;

      BoxZoomToolView.prototype.toolType = "BoxZoomTool";

      BoxZoomToolView.prototype.evgen_options = {
        keyName: "ctrlKey",
        buttonText: "Box Zoom",
        cursor: "crosshair",
        auto_deactivate: true,
        restrict_to_innercanvas: true
      };

      BoxZoomToolView.prototype.tool_events = {
        SetBasepoint: "_start_selecting",
        UpdatingMouseMove: "_selecting",
        DragEnd: "_dragend"
      };

      BoxZoomToolView.prototype.pause = function() {
        return null;
      };

      BoxZoomToolView.prototype.view_coords = function(sx, sy) {
        var vx, vy, _ref1;
        _ref1 = [this.plot_view.view_state.sx_to_vx(sx), this.plot_view.view_state.sy_to_vy(sy)], vx = _ref1[0], vy = _ref1[1];
        return [vx, vy];
      };

      BoxZoomToolView.prototype._start_selecting = function(e) {
        var vx, vy, _ref1;
        this.plot_view.pause();
        this.trigger('startselect');
        _ref1 = this.view_coords(e.bokehX, e.bokehY), vx = _ref1[0], vy = _ref1[1];
        this.mset({
          'start_vx': vx,
          'start_vy': vy,
          'current_vx': null,
          'current_vy': null
        });
        return this.basepoint_set = true;
      };

      BoxZoomToolView.prototype._get_selection_range = function() {
        var xrange, yrange;
        if (this.mget('select_x')) {
          xrange = [this.mget('start_vx'), this.mget('current_vx')];
          xrange = [_.min(xrange), _.max(xrange)];
        } else {
          xrange = null;
        }
        if (this.mget('select_y')) {
          yrange = [this.mget('start_vy'), this.mget('current_vy')];
          yrange = [_.min(yrange), _.max(yrange)];
        } else {
          yrange = null;
        }
        return [xrange, yrange];
      };

      BoxZoomToolView.prototype._selecting = function(e, x_, y_) {
        var vx, vy, _ref1, _ref2;
        _ref1 = this.view_coords(e.bokehX, e.bokehY), vx = _ref1[0], vy = _ref1[1];
        this.mset({
          'current_vx': vx,
          'current_vy': vy
        });
        _ref2 = this._get_selection_range(), this.xrange = _ref2[0], this.yrange = _ref2[1];
        this.trigger('boxselect', this.xrange, this.yrange);
        this.plot_view.render_overlays(true);
        return null;
      };

      BoxZoomToolView.prototype._dragend = function() {
        this._select_data();
        this.basepoint_set = false;
        this.plot_view.unpause();
        return this.trigger('stopselect');
      };

      BoxZoomToolView.prototype._select_data = function() {
        var xend, xstart, yend, ystart, zoom_info, _ref1, _ref2;
        if (!this.basepoint_set) {
          return;
        }
        _ref1 = this.plot_view.xmapper.v_map_from_target([this.xrange[0], this.xrange[1]]), xstart = _ref1[0], xend = _ref1[1];
        _ref2 = this.plot_view.ymapper.v_map_from_target([this.yrange[0], this.yrange[1]]), ystart = _ref2[0], yend = _ref2[1];
        zoom_info = {
          xr: {
            start: xstart,
            end: xend
          },
          yr: {
            start: ystart,
            end: yend
          }
        };
        return this.plot_view.update_range(zoom_info);
      };

      return BoxZoomToolView;

    })(Tool.View);
    BoxZoomTool = (function(_super) {
      __extends(BoxZoomTool, _super);

      function BoxZoomTool() {
        _ref1 = BoxZoomTool.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      BoxZoomTool.prototype.default_view = BoxZoomToolView;

      BoxZoomTool.prototype.type = "BoxZoomTool";

      BoxZoomTool.prototype.defaults = function() {
        return _.extend(BoxZoomTool.__super__.defaults.call(this), {
          renderers: [],
          select_x: true,
          select_y: true,
          select_every_mousemove: false,
          data_source_options: {}
        });
      };

      BoxZoomTool.prototype.display_defaults = function() {
        return BoxZoomTool.__super__.display_defaults.call(this);
      };

      return BoxZoomTool;

    })(Tool.Model);
    BoxZoomTools = (function(_super) {
      __extends(BoxZoomTools, _super);

      function BoxZoomTools() {
        _ref2 = BoxZoomTools.__super__.constructor.apply(this, arguments);
        return _ref2;
      }

      BoxZoomTools.prototype.model = BoxZoomTool;

      return BoxZoomTools;

    })(Backbone.Collection);
    return {
      "Model": BoxZoomTool,
      "Collection": new BoxZoomTools(),
      "View": BoxZoomToolView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=box_zoom_tool.js.map
*/