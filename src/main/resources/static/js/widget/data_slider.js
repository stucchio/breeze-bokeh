(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["common/plot_widget", "common/has_parent"], function(PlotWidget, HasParent) {
    var DataSlider, DataSliderView, DataSliders, _ref, _ref1, _ref2;
    DataSliderView = (function(_super) {
      __extends(DataSliderView, _super);

      function DataSliderView() {
        _ref = DataSliderView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      DataSliderView.prototype.attributes = {
        "class": "dataslider pull-left"
      };

      DataSliderView.prototype.initialize = function(options) {
        DataSliderView.__super__.initialize.call(this, options);
        this.render_init();
        return this.select = _.throttle(this._select, 50);
      };

      DataSliderView.prototype.delegateEvents = function(events) {
        DataSliderView.__super__.delegateEvents.call(this, events);
        return "pass";
      };

      DataSliderView.prototype.label = function(min, max) {
        this.$(".minlabel").text(min);
        return this.$(".maxlabel").text(max);
      };

      DataSliderView.prototype.render_init = function() {
        var column, max, min, _ref1,
          _this = this;
        this.$el.html("");
        this.$el.append("<div class='maxlabel'></div>");
        this.$el.append("<div class='slider'></div>");
        this.$el.append("<div class='minlabel'></div>");
        this.plot_view.$(".plotarea").append(this.$el);
        column = this.mget_obj('data_source').getcolumn(this.mget('field'));
        _ref1 = [_.min(column), _.max(column)], min = _ref1[0], max = _ref1[1];
        this.$el.find(".slider").slider({
          orientation: "vertical",
          animate: "fast",
          step: (max - min) / 50.0,
          min: min,
          max: max,
          values: [min, max],
          slide: function(event, ui) {
            _this.set_selection_range(event, ui);
            return _this.select(event, ui);
          }
        });
        this.label(min, max);
        return this.$el.find(".slider").height(this.plot_view.view_state.get('inner_height'));
      };

      DataSliderView.prototype.set_selection_range = function(event, ui) {
        var data_source, field, max, min;
        min = _.min(ui.values);
        max = _.max(ui.values);
        this.label(min, max);
        data_source = this.mget_obj('data_source');
        field = this.mget('field');
        if (data_source.range_selections == null) {
          data_source.range_selections = {};
        }
        return data_source.range_selections[field] = [min, max];
      };

      DataSliderView.prototype._select = function() {
        var colname, columns, data_source, i, max, min, numrows, select, selected, val, value, _i, _ref1, _ref2;
        data_source = this.mget_obj('data_source');
        columns = {};
        numrows = 0;
        _ref1 = data_source.range_selections;
        for (colname in _ref1) {
          if (!__hasProp.call(_ref1, colname)) continue;
          value = _ref1[colname];
          columns[colname] = data_source.getcolumn(colname);
          numrows = columns[colname].length;
        }
        selected = [];
        for (i = _i = 0; 0 <= numrows ? _i < numrows : _i > numrows; i = 0 <= numrows ? ++_i : --_i) {
          select = true;
          _ref2 = data_source.range_selections;
          for (colname in _ref2) {
            if (!__hasProp.call(_ref2, colname)) continue;
            value = _ref2[colname];
            min = value[0], max = value[1];
            val = columns[colname][i];
            if (val < min || val > max) {
              select = false;
              break;
            }
          }
          if (select) {
            selected.push(i);
          }
        }
        return data_source.save({
          selected: selected
        }, {
          patch: true
        });
      };

      return DataSliderView;

    })(PlotWidget);
    DataSlider = (function(_super) {
      __extends(DataSlider, _super);

      function DataSlider() {
        _ref1 = DataSlider.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      DataSlider.prototype.type = "DataSlider";

      DataSlider.prototype.default_view = DataSliderView;

      DataSlider.prototype.defaults = function() {
        return {
          data_source: null,
          field: null
        };
      };

      DataSlider.prototype.display_defaults = function() {
        return {
          level: 'tool'
        };
      };

      return DataSlider;

    })(HasParent);
    DataSliders = (function(_super) {
      __extends(DataSliders, _super);

      function DataSliders() {
        _ref2 = DataSliders.__super__.constructor.apply(this, arguments);
        return _ref2;
      }

      DataSliders.prototype.model = DataSlider;

      return DataSliders;

    })(Backbone.Collection);
    return {
      "Model": DataSlider,
      "Collection": new DataSliders()
    };
  });

}).call(this);

/*
//@ sourceMappingURL=data_slider.js.map
*/