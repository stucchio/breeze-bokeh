(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "backbone", "./tool", "./event_generators"], function(_, Backbone, Tool, EventGenerators) {
    var ButtonEventGenerator, ResetTool, ResetToolView, ResetTools, _ref, _ref1, _ref2;
    ButtonEventGenerator = EventGenerators.ButtonEventGenerator;
    ResetToolView = (function(_super) {
      __extends(ResetToolView, _super);

      function ResetToolView() {
        _ref = ResetToolView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      ResetToolView.prototype.initialize = function(options) {
        return ResetToolView.__super__.initialize.call(this, options);
      };

      ResetToolView.prototype.eventGeneratorClass = ButtonEventGenerator;

      ResetToolView.prototype.evgen_options = {
        buttonText: "Reset View"
      };

      ResetToolView.prototype.toolType = "ResetTool";

      ResetToolView.prototype.tool_events = {
        activated: "_activated"
      };

      ResetToolView.prototype._activated = function(e) {
        var _this = this;
        this.plot_view.update_range();
        return _.delay((function() {
          return _this.plot_view.eventSink.trigger("clear_active_tool");
        }), 100);
      };

      return ResetToolView;

    })(Tool.View);
    ResetTool = (function(_super) {
      __extends(ResetTool, _super);

      function ResetTool() {
        _ref1 = ResetTool.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      ResetTool.prototype.default_view = ResetToolView;

      ResetTool.prototype.type = "ResetTool";

      return ResetTool;

    })(Tool.Model);
    ResetTools = (function(_super) {
      __extends(ResetTools, _super);

      function ResetTools() {
        _ref2 = ResetTools.__super__.constructor.apply(this, arguments);
        return _ref2;
      }

      ResetTools.prototype.model = ResetTool;

      ResetTools.prototype.display_defaults = function() {
        return ResetTools.__super__.display_defaults.call(this);
      };

      return ResetTools;

    })(Backbone.Collection);
    return {
      "Model": ResetTool,
      "Collection": new ResetTools(),
      "View": ResetToolView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=reset_tool.js.map
*/