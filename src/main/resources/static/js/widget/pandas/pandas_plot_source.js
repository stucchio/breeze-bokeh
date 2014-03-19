(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["backbone", "source/column_data_source"], function(Backbone, ColumnDataSource) {
    var PandasPlotSource, PandasPlotSources, _ref, _ref1;
    PandasPlotSource = (function(_super) {
      __extends(PandasPlotSource, _super);

      function PandasPlotSource() {
        _ref = PandasPlotSource.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      PandasPlotSource.prototype.type = 'PandasPlotSource';

      return PandasPlotSource;

    })(ColumnDataSource.Model);
    PandasPlotSources = (function(_super) {
      __extends(PandasPlotSources, _super);

      function PandasPlotSources() {
        _ref1 = PandasPlotSources.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      PandasPlotSources.prototype.model = PandasPlotSource;

      return PandasPlotSources;

    })(Backbone.Collection);
    return {
      "Model": PandasPlotSource,
      "Collection": new PandasPlotSources()
    };
  });

}).call(this);

/*
//@ sourceMappingURL=pandas_plot_source.js.map
*/