(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "backbone", "./box_select_tool"], function(_, Backbone, BoxSelectTool) {
    var DataRangeBoxSelectTool, DataRangeBoxSelectToolView, DataRangeBoxSelectTools, _ref, _ref1, _ref2;
    DataRangeBoxSelectToolView = (function(_super) {
      __extends(DataRangeBoxSelectToolView, _super);

      function DataRangeBoxSelectToolView() {
        _ref = DataRangeBoxSelectToolView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      DataRangeBoxSelectToolView.prototype.bind_bokeh_events = function() {
        return tool.ToolView.prototype.bind_bokeh_events.call(this);
      };

      DataRangeBoxSelectToolView.prototype._select_data = function() {
        var xend, xstart, yend, ystart, _ref1, _ref2;
        _ref1 = this.plot_view.mapper.map_from_target(this.xrange[0], this.yrange[0]), xstart = _ref1[0], ystart = _ref1[1];
        _ref2 = this.plot_view.mapper.map_from_target(this.xrange[1], this.yrange[1]), xend = _ref2[0], yend = _ref2[1];
        this.mset('xselect', [xstart, xend]);
        this.mset('yselect', [ystart, yend]);
        return this.model.save();
      };

      return DataRangeBoxSelectToolView;

    })(BoxSelectTool.View);
    DataRangeBoxSelectTool = (function(_super) {
      __extends(DataRangeBoxSelectTool, _super);

      function DataRangeBoxSelectTool() {
        _ref1 = DataRangeBoxSelectTool.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      DataRangeBoxSelectTool.prototype.default_view = DataRangeBoxSelectToolView;

      DataRangeBoxSelectTool.prototype.type = "DataRangeBoxSelectTool";

      return DataRangeBoxSelectTool;

    })(BoxSelectTool.Model);
    DataRangeBoxSelectTools = (function(_super) {
      __extends(DataRangeBoxSelectTools, _super);

      function DataRangeBoxSelectTools() {
        _ref2 = DataRangeBoxSelectTools.__super__.constructor.apply(this, arguments);
        return _ref2;
      }

      DataRangeBoxSelectTools.prototype.model = DataRangeBoxSelectToolView;

      DataRangeBoxSelectTools.prototype.display_defaults = function() {
        return DataRangeBoxSelectTools.__super__.display_defaults.call(this);
      };

      return DataRangeBoxSelectTools;

    })(Backbone.Collection);
    return {
      "Model": DataRangeBoxSelectTool,
      "Collection": new DataRangeBoxSelectTools(),
      "View": DataRangeBoxSelectToolView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=data_range_box_select_tool.js.map
*/