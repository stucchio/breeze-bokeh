(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "common/has_parent", "common/plot_widget"], function(_, HasParent, PlotWidget) {
    var BoxSelection, BoxSelectionView, BoxSelections, _ref, _ref1, _ref2;
    BoxSelectionView = (function(_super) {
      __extends(BoxSelectionView, _super);

      function BoxSelectionView() {
        _ref = BoxSelectionView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      BoxSelectionView.prototype.initialize = function(options) {
        this.selecting = false;
        this.xrange = [null, null];
        this.yrange = [null, null];
        BoxSelectionView.__super__.initialize.call(this, options);
        return this.plot_view.$el.find('.bokeh_canvas_wrapper').append(this.$el);
      };

      BoxSelectionView.prototype.boxselect = function(xrange, yrange) {
        this.xrange = xrange;
        this.yrange = yrange;
        return this.request_render();
      };

      BoxSelectionView.prototype.startselect = function() {
        this.selecting = true;
        this.xrange = [null, null];
        this.yrange = [null, null];
        return this.request_render();
      };

      BoxSelectionView.prototype.stopselect = function() {
        this.selecting = false;
        this.xrange = [null, null];
        this.yrange = [null, null];
        return this.request_render();
      };

      BoxSelectionView.prototype.bind_bokeh_events = function(options) {
        this.toolview = this.plot_view.tools[this.mget('tool').id];
        this.listenTo(this.toolview, 'boxselect', this.boxselect);
        this.listenTo(this.toolview, 'startselect', this.startselect);
        return this.listenTo(this.toolview, 'stopselect', this.stopselect);
      };

      BoxSelectionView.prototype.render = function() {
        var height, style_string, width, xpos, xrange, ypos, yrange;
        if (!this.selecting) {
          this.$el.removeClass('shading');
          return;
        }
        xrange = this.xrange;
        yrange = this.yrange;
        if (_.any(_.map(xrange, _.isNullOrUndefined)) || _.any(_.map(yrange, _.isNullOrUndefined))) {
          this.$el.removeClass('shading');
          return;
        }
        style_string = "";
        if (xrange) {
          xpos = this.plot_view.view_state.vx_to_sx(Math.min(xrange[0], xrange[1]));
          width = Math.abs(xrange[1] - xrange[0]);
        } else {
          xpos = 0;
          width = this.plot_view.view_state.get('width');
        }
        style_string += "; left:" + xpos + "px; width:" + width + "px; ";
        if (yrange) {
          ypos = this.plot_view.view_state.vy_to_sy(Math.max(yrange[0], yrange[1]));
          height = Math.abs(yrange[1] - yrange[0]);
        } else {
          ypos = 0;
          height = this.plot_view.view_state.get('height');
        }
        this.$el.addClass('shading');
        style_string += "top:" + ypos + "px; height:" + height + "px";
        return this.$el.attr('style', style_string);
      };

      return BoxSelectionView;

    })(PlotWidget);
    BoxSelection = (function(_super) {
      __extends(BoxSelection, _super);

      function BoxSelection() {
        _ref1 = BoxSelection.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      BoxSelection.prototype.default_view = BoxSelectionView;

      BoxSelection.prototype.type = "BoxSelection";

      BoxSelection.prototype.defaults = function() {
        return {
          tool: null,
          level: 'overlay'
        };
      };

      return BoxSelection;

    })(HasParent);
    BoxSelections = (function(_super) {
      __extends(BoxSelections, _super);

      function BoxSelections() {
        _ref2 = BoxSelections.__super__.constructor.apply(this, arguments);
        return _ref2;
      }

      BoxSelections.prototype.model = BoxSelection;

      return BoxSelections;

    })(Backbone.Collection);
    return {
      "Model": BoxSelection,
      "Collection": new BoxSelections(),
      "View": BoxSelectionView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=box_selection.js.map
*/