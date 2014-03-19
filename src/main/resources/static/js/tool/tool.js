(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "common/plot_widget", "common/has_parent"], function(_, PlotWidget, HasParent) {
    var Tool, ToolView, _ref, _ref1;
    ToolView = (function(_super) {
      __extends(ToolView, _super);

      function ToolView() {
        _ref = ToolView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      ToolView.prototype.initialize = function(options) {
        return ToolView.__super__.initialize.call(this, options);
      };

      ToolView.prototype.bind_bokeh_events = function() {
        var eventSink, evgen, evgen_options, evgen_options2,
          _this = this;
        eventSink = this.plot_view.eventSink;
        evgen_options = {
          eventBasename: this.cid
        };
        evgen_options2 = _.extend(evgen_options, this.evgen_options);
        evgen = new this.eventGeneratorClass(evgen_options2);
        evgen.bind_bokeh_events(this.plot_view, eventSink);
        _.each(this.tool_events, function(handler_f, event_name) {
          var full_event_name, wrap;
          full_event_name = "" + _this.cid + ":" + event_name;
          wrap = function(e) {
            return _this[handler_f](e);
          };
          return eventSink.on(full_event_name, wrap);
        });
        this.evgen = evgen;
        return {
          render: function() {}
        };
      };

      return ToolView;

    })(PlotWidget);
    Tool = (function(_super) {
      __extends(Tool, _super);

      function Tool() {
        _ref1 = Tool.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      Tool.prototype.display_defaults = function() {
        return {
          level: 'tool'
        };
      };

      return Tool;

    })(HasParent);
    return {
      "Model": Tool,
      "View": ToolView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=tool.js.map
*/