(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "backbone", "./build_views", "./safebind", "./continuum_view", "./has_parent", "./grid_view_state", "mapper/1d/linear_mapper", "mapper/2d/grid_mapper", "renderer/properties", "tool/active_tool_manager"], function(_, Backbone, build_views, safebind, ContinuumView, HasParent, GridViewState, LinearMapper, GridMapper, Properties, ActiveToolManager) {
    var GridPlot, GridPlotView, GridPlots, _ref, _ref1, _ref2;
    GridPlotView = (function(_super) {
      __extends(GridPlotView, _super);

      function GridPlotView() {
        _ref = GridPlotView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      GridPlotView.prototype.tagName = 'div';

      GridPlotView.prototype.className = "bokeh grid_plot";

      GridPlotView.prototype.default_options = {
        scale: 1.0
      };

      GridPlotView.prototype.set_child_view_states = function() {
        var row, viewstaterow, viewstates, x, _i, _len, _ref1;
        viewstates = [];
        _ref1 = this.mget('children');
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          row = _ref1[_i];
          viewstaterow = (function() {
            var _j, _len1, _results;
            _results = [];
            for (_j = 0, _len1 = row.length; _j < _len1; _j++) {
              x = row[_j];
              _results.push(this.childviews[x.id].view_state);
            }
            return _results;
          }).call(this);
          viewstates.push(viewstaterow);
        }
        return this.viewstate.set('childviewstates', viewstates);
      };

      GridPlotView.prototype.initialize = function(options) {
        GridPlotView.__super__.initialize.call(this, _.defaults(options, this.default_options));
        this.viewstate = new GridViewState();
        this.toolbar_height = 0;
        this.childviews = {};
        this.build_children();
        this.bind_bokeh_events();
        this.render();
        return this;
      };

      GridPlotView.prototype.bind_bokeh_events = function() {
        var _this = this;
        safebind(this, this.model, 'change:children', this.build_children);
        safebind(this, this.model, 'change', this.render);
        safebind(this, this.viewstate, 'change', this.render);
        return safebind(this, this.model, 'destroy', function() {
          return _this.remove();
        });
      };

      GridPlotView.prototype.b_events = {
        "change:children model": "build_children",
        "change model": "render",
        "change viewstate": "render",
        "destroy model": "remove"
      };

      GridPlotView.prototype.build_children = function() {
        var childmodels, plot, row, _i, _j, _len, _len1, _ref1;
        childmodels = [];
        _ref1 = this.mget_obj('children');
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          row = _ref1[_i];
          for (_j = 0, _len1 = row.length; _j < _len1; _j++) {
            plot = row[_j];
            childmodels.push(plot);
          }
        }
        build_views(this.childviews, childmodels, {});
        return this.set_child_view_states();
      };

      GridPlotView.prototype.makeButton = function(eventSink, constructor, toolbar_div, button_name) {
        var all_tools, button, button_activated, specific_tools, tool_active;
        all_tools = _.flatten(_.map(_.pluck(this.childviews, 'tools'), _.values));
        specific_tools = _.where(all_tools, {
          constructor: constructor
        });
        button = $("<button class='btn btn-small'>" + button_name + "</button>");
        toolbar_div.append(button);
        tool_active = false;
        button_activated = false;
        button.click(function() {
          if (button_activated) {
            return eventSink.trigger('clear_active_tool');
          } else {
            return eventSink.trigger('active_tool', button_name);
          }
        });
        eventSink.on("" + button_name + ":deactivated", function() {
          button.removeClass('active');
          button_activated = false;
          return _.each(specific_tools, function(t) {
            var t_name;
            t_name = t.evgen.toolName;
            return t.evgen.eventSink.trigger("" + t_name + ":deactivated");
          });
        });
        return eventSink.on("" + button_name + ":activated", function() {
          button.addClass('active');
          button_activated = true;
          return _.each(specific_tools, function(t) {
            var t_name;
            t_name = t.evgen.toolName;
            return t.evgen.eventSink.trigger("" + t_name + ":activated");
          });
        });
      };

      GridPlotView.prototype.addGridToolbar = function() {
        var all_tool_classes, all_tools, tool_name_dict,
          _this = this;
        this.button_bar = $("<div class='grid_button_bar'/>");
        this.button_bar.attr('style', "position:absolute; left:10px; top:0px; ");
        this.toolEventSink = _.extend({}, Backbone.Events);
        this.atm = new ActiveToolManager(this.toolEventSink);
        this.atm.bind_bokeh_events();
        this.$el.append(this.button_bar);
        all_tools = _.flatten(_.map(_.pluck(this.childviews, 'tools'), _.values));
        all_tool_classes = _.uniq(_.pluck(all_tools, 'constructor'));
        if (all_tool_classes.length > 0) {
          this.toolbar_height = 35;
        }
        tool_name_dict = {};
        _.each(all_tool_classes, function(klass) {
          var btext;
          btext = _.where(all_tools, {
            constructor: klass
          })[0].evgen_options.buttonText;
          return tool_name_dict[btext] = klass;
        });
        _.map(tool_name_dict, function(klass, button_text) {
          return _this.makeButton(_this.toolEventSink, klass, _this.button_bar, button_text);
        });
        return _.map(all_tools, function(t) {
          return t.evgen.hide_button();
        });
      };

      GridPlotView.prototype.render = function() {
        var add, cidx, col_widths, height, last_plot, plot_divs, plot_wrapper, plotspec, ridx, row, row_heights, total_height, view, width, x_coords, xpos, y_coords, ypos, _i, _j, _k, _len, _len1, _len2, _ref1, _ref2;
        GridPlotView.__super__.render.call(this);
        _ref1 = _.values(this.childviews);
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          view = _ref1[_i];
          view.$el.detach();
        }
        this.$el.html('');
        this.addGridToolbar();
        row_heights = this.viewstate.get('layout_heights');
        col_widths = this.viewstate.get('layout_widths');
        y_coords = [0];
        _.reduceRight(row_heights.slice(1), function(x, y) {
          var val;
          val = x + y;
          y_coords.push(val);
          return val;
        }, 0);
        y_coords.reverse();
        x_coords = [0];
        _.reduce(col_widths.slice(0), function(x, y) {
          var val;
          val = x + y;
          x_coords.push(val);
          return val;
        }, 0);
        plot_divs = [];
        last_plot = null;
        _ref2 = this.mget('children');
        for (ridx = _j = 0, _len1 = _ref2.length; _j < _len1; ridx = ++_j) {
          row = _ref2[ridx];
          for (cidx = _k = 0, _len2 = row.length; _k < _len2; cidx = ++_k) {
            plotspec = row[cidx];
            view = this.childviews[plotspec.id];
            ypos = this.viewstate.position_child_y(y_coords[ridx], view.view_state.get('outer_height') - this.toolbar_height);
            xpos = this.viewstate.position_child_x(x_coords[cidx], view.view_state.get('outer_width'));
            plot_wrapper = $("<div class='gp_plotwrapper'></div>");
            plot_wrapper.attr('style', "position: absolute; left:" + xpos + "px; top:" + ypos + "px");
            plot_wrapper.append(view.$el);
            this.$el.append(plot_wrapper);
          }
        }
        add = function(a, b) {
          return a + b;
        };
        total_height = _.reduce(row_heights, add, 0);
        height = total_height + this.toolbar_height;
        width = this.viewstate.get('outerwidth');
        this.$el.attr('style', "position:relative; height:" + height + "px;width:" + width + "px");
        return this.render_end();
      };

      return GridPlotView;

    })(ContinuumView.View);
    GridPlot = (function(_super) {
      __extends(GridPlot, _super);

      function GridPlot() {
        _ref1 = GridPlot.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      GridPlot.prototype.type = 'GridPlot';

      GridPlot.prototype.default_view = GridPlotView;

      GridPlot.prototype.defaults = function() {
        return {
          children: [[]],
          border_space: 0
        };
      };

      return GridPlot;

    })(HasParent);
    GridPlots = (function(_super) {
      __extends(GridPlots, _super);

      function GridPlots() {
        _ref2 = GridPlots.__super__.constructor.apply(this, arguments);
        return _ref2;
      }

      GridPlots.prototype.model = GridPlot;

      return GridPlots;

    })(Backbone.Collection);
    return {
      "Model": GridPlot,
      "Collection": new GridPlots(),
      "View": GridPlotView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=grid_plot.js.map
*/