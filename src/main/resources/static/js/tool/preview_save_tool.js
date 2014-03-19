(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "jquery", "modal", "backbone", "common/bulk_save", "./tool", "./event_generators"], function(_, $, $$1, Backbone, bulk_save, Tool, EventGenerators) {
    var ButtonEventGenerator, PreviewSaveTool, PreviewSaveToolView, PreviewSaveTools, _ref, _ref1, _ref2;
    ButtonEventGenerator = EventGenerators.ButtonEventGenerator;
    PreviewSaveToolView = (function(_super) {
      __extends(PreviewSaveToolView, _super);

      function PreviewSaveToolView() {
        _ref = PreviewSaveToolView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      PreviewSaveToolView.prototype.initialize = function(options) {
        return PreviewSaveToolView.__super__.initialize.call(this, options);
      };

      PreviewSaveToolView.prototype.eventGeneratorClass = ButtonEventGenerator;

      PreviewSaveToolView.prototype.evgen_options = {
        buttonText: "Preview/Save"
      };

      PreviewSaveToolView.prototype.toolType = "PreviewSaveTool";

      PreviewSaveToolView.prototype.tool_events = {
        activated: "_activated",
        deactivated: "_close_modal"
      };

      PreviewSaveToolView.prototype._activated = function(e) {
        var data_uri, modal,
          _this = this;
        data_uri = this.plot_view.canvas[0].toDataURL();
        this.plot_model.set('png', this.plot_view.canvas[0].toDataURL());
        modal = "<div id='previewModal' class='bokeh'>\n  <div class=\"modal\" role=\"dialog\" aria-labelledby=\"previewLabel\" aria-hidden=\"true\">\n    <div class=\"modal-header\">\n      <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n      <h3 id=\"dataConfirmLabel\">Image Preview (right click to save)</h3>\n    </div>\n    <div class=\"modal-body\">\n      <img src=\"" + data_uri + "\" style=\"max-height: 300px; max-width: 400px\">\n    </div>\n    <div class=\"modal-footer\">\n      <button class=\"btn\" data-dismiss=\"modal\" aria-hidden=\"true\">Close</button>\n    </div>\n  </div>\n</div>";
        $('body').append(modal);
        $('#previewModal .modal').on('hidden', function() {
          return _this.plot_view.eventSink.trigger("clear_active_tool");
        });
        return $('#previewModal > .modal').modal({
          show: true
        });
      };

      PreviewSaveToolView.prototype._close_modal = function() {
        $('#previewModal').remove();
        return $('#previewModal > .modal').remove();
      };

      return PreviewSaveToolView;

    })(Tool.View);
    PreviewSaveTool = (function(_super) {
      __extends(PreviewSaveTool, _super);

      function PreviewSaveTool() {
        _ref1 = PreviewSaveTool.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      PreviewSaveTool.prototype.default_view = PreviewSaveToolView;

      PreviewSaveTool.prototype.type = "PreviewSaveTool";

      PreviewSaveTool.prototype.display_defaults = function() {
        return PreviewSaveTool.__super__.display_defaults.call(this);
      };

      return PreviewSaveTool;

    })(Tool.Model);
    PreviewSaveTools = (function(_super) {
      __extends(PreviewSaveTools, _super);

      function PreviewSaveTools() {
        _ref2 = PreviewSaveTools.__super__.constructor.apply(this, arguments);
        return _ref2;
      }

      PreviewSaveTools.prototype.model = PreviewSaveTool;

      return PreviewSaveTools;

    })(Backbone.Collection);
    return {
      "Model": PreviewSaveTool,
      "Collection": new PreviewSaveTools(),
      "View": PreviewSaveToolView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=preview_save_tool.js.map
*/