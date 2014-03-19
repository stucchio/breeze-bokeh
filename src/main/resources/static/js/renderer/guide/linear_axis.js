(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "backbone", "common/ticking", "./axis"], function(_, Backbone, ticking, Axis) {
    var LinearAxes, LinearAxis, LinearAxisView, _ref, _ref1, _ref2;
    LinearAxisView = (function(_super) {
      __extends(LinearAxisView, _super);

      function LinearAxisView() {
        _ref = LinearAxisView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      LinearAxisView.prototype.initialize = function(options) {
        options.formatter = new ticking.BasicTickFormatter();
        return LinearAxisView.__super__.initialize.call(this, options);
      };

      return LinearAxisView;

    })(Axis.View);
    LinearAxis = (function(_super) {
      __extends(LinearAxis, _super);

      function LinearAxis() {
        _ref1 = LinearAxis.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      LinearAxis.prototype.default_view = LinearAxisView;

      LinearAxis.prototype.type = 'LinearAxis';

      LinearAxis.prototype.initialize = function(attrs, options) {
        options.scale = new ticking.BasicScale();
        return LinearAxis.__super__.initialize.call(this, attrs, options);
      };

      LinearAxis.prototype.display_defaults = function() {
        return LinearAxis.__super__.display_defaults.call(this);
      };

      return LinearAxis;

    })(Axis.Model);
    LinearAxes = (function(_super) {
      __extends(LinearAxes, _super);

      function LinearAxes() {
        _ref2 = LinearAxes.__super__.constructor.apply(this, arguments);
        return _ref2;
      }

      LinearAxes.prototype.model = LinearAxis;

      return LinearAxes;

    })(Backbone.Collection);
    return {
      "Model": LinearAxis,
      "Collection": new LinearAxes(),
      "View": LinearAxisView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=linear_axis.js.map
*/