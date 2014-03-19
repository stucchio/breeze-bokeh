(function() {
  define([], function() {
    var ActiveToolManager;
    return ActiveToolManager = (function() {
      " This makes sure that only one tool is active at a time ";
      function ActiveToolManager(event_sink) {
        this.event_sink = event_sink;
        this.event_sink.active = null;
      }

      ActiveToolManager.prototype.bind_bokeh_events = function() {
        var _this = this;
        this.event_sink.on("clear_active_tool", function() {
          _this.event_sink.trigger("" + _this.event_sink.active + ":deactivated");
          return _this.event_sink.active = null;
        });
        this.event_sink.on("active_tool", function(toolName) {
          if (toolName !== _this.event_sink.active) {
            _this.event_sink.trigger("" + toolName + ":activated");
            _this.event_sink.trigger("" + _this.event_sink.active + ":deactivated");
            return _this.event_sink.active = toolName;
          }
        });
        return this.event_sink.on("try_active_tool", function(toolName) {
          if (_this.event_sink.active == null) {
            _this.event_sink.trigger("" + toolName + ":activated");
            _this.event_sink.trigger("" + _this.event_sink.active + ":deactivated");
            return _this.event_sink.active = toolName;
          }
        });
      };

      return ActiveToolManager;

    })();
  });

}).call(this);

/*
//@ sourceMappingURL=active_tool_manager.js.map
*/