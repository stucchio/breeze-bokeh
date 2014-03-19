(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "jquery", "modal", "backbone", "./tool", "./event_generators", "util/object_explorer"], function(_, $, $$1, Backbone, Tool, EventGenerators, ObjectExplorer) {
    var ButtonEventGenerator, ObjectExplorerTool, ObjectExplorerToolView, ObjectExplorerTools, _ref, _ref1, _ref2;
    ButtonEventGenerator = EventGenerators.ButtonEventGenerator;
    ObjectExplorerToolView = (function(_super) {
      __extends(ObjectExplorerToolView, _super);

      function ObjectExplorerToolView() {
        _ref = ObjectExplorerToolView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      ObjectExplorerToolView.prototype.initialize = function(options) {
        return ObjectExplorerToolView.__super__.initialize.call(this, options);
      };

      ObjectExplorerToolView.prototype.eventGeneratorClass = ButtonEventGenerator;

      ObjectExplorerToolView.prototype.evgen_options = {
        buttonText: "Object Explorer"
      };

      ObjectExplorerToolView.prototype.toolType = "ObjectExplorerTool";

      ObjectExplorerToolView.prototype.tool_events = {
        activated: "_activated",
        deactivated: "_close_modal"
      };

      ObjectExplorerToolView.prototype._activated = function(e) {
        var modal,
          _this = this;
        modal = $("<div id='objectExplorerModal' class='bokeh'>\n  <div class=\"modal\" role=\"dialog\" aria-labelledby=\"objectExplorerLabel\" aria-hidden=\"true\">\n    <div class=\"modal-header\">\n      <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n      <h3 id=\"dataConfirmLabel\">Object Explorer</h3>\n    </div>\n    <div class=\"modal-body\">\n    </div>\n    <div class=\"modal-footer\">\n      <button class=\"btn\" data-dismiss=\"modal\" aria-hidden=\"true\">Close</button>\n    </div>\n  </div>\n</div>");
        this.$object_explorer_view = new ObjectExplorer.View({
          el: modal.find(".modal-body")
        });
        $('body').append(modal);
        $('#objectExplorerModal .modal').on('hidden', function() {
          return _this.plot_view.eventSink.trigger("clear_active_tool");
        });
        return $('#objectExplorerModal > .modal').modal({
          show: true
        });
      };

      ObjectExplorerToolView.prototype._close_modal = function() {
        $('#objectExplorerModal').remove();
        return $('#objectExplorerModal > .modal').remove();
      };

      return ObjectExplorerToolView;

    })(Tool.View);
    ObjectExplorerTool = (function(_super) {
      __extends(ObjectExplorerTool, _super);

      function ObjectExplorerTool() {
        _ref1 = ObjectExplorerTool.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      ObjectExplorerTool.prototype.default_view = ObjectExplorerToolView;

      ObjectExplorerTool.prototype.type = "ObjectExplorerTool";

      ObjectExplorerTool.prototype.display_defaults = function() {
        return ObjectExplorerTool.__super__.display_defaults.call(this);
      };

      return ObjectExplorerTool;

    })(Tool.Model);
    ObjectExplorerTools = (function(_super) {
      __extends(ObjectExplorerTools, _super);

      function ObjectExplorerTools() {
        _ref2 = ObjectExplorerTools.__super__.constructor.apply(this, arguments);
        return _ref2;
      }

      ObjectExplorerTools.prototype.model = ObjectExplorerTool;

      return ObjectExplorerTools;

    })(Backbone.Collection);
    return {
      "Model": ObjectExplorerTool,
      "Collection": new ObjectExplorerTools(),
      "View": ObjectExplorerToolView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=object_explorer_tool.js.map
*/