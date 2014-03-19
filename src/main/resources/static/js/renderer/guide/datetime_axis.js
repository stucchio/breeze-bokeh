(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["backbone", "./axis", "common/ticking"], function(Backbone, Axis, ticking) {
    var DatetimeAxes, DatetimeAxis, DatetimeAxisView, _ref, _ref1, _ref2;
    DatetimeAxisView = (function(_super) {
      __extends(DatetimeAxisView, _super);

      function DatetimeAxisView() {
        _ref = DatetimeAxisView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      DatetimeAxisView.prototype.initialize = function(options) {
        options.formatter = new ticking.DatetimeFormatter();
        return DatetimeAxisView.__super__.initialize.call(this, options);
      };

      return DatetimeAxisView;

    })(Axis.View);
    DatetimeAxis = (function(_super) {
      __extends(DatetimeAxis, _super);

      function DatetimeAxis() {
        _ref1 = DatetimeAxis.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      DatetimeAxis.prototype.default_view = DatetimeAxisView;

      DatetimeAxis.prototype.type = 'DatetimeAxis';

      DatetimeAxis.prototype.initialize = function(attrs, options) {
        options.scale = new ticking.DatetimeScale();
        return DatetimeAxis.__super__.initialize.call(this, attrs, options);
      };

      DatetimeAxis.prototype.display_defaults = function() {
        return DatetimeAxis.__super__.display_defaults.call(this);
      };

      return DatetimeAxis;

    })(Axis.Model);
    DatetimeAxes = (function(_super) {
      __extends(DatetimeAxes, _super);

      function DatetimeAxes() {
        _ref2 = DatetimeAxes.__super__.constructor.apply(this, arguments);
        return _ref2;
      }

      DatetimeAxes.prototype.model = DatetimeAxis;

      DatetimeAxes.prototype.type = 'DatetimeAxis';

      return DatetimeAxes;

    })(Backbone.Collection);
    return {
      "Model": DatetimeAxis,
      "Collection": new DatetimeAxes(),
      "View": DatetimeAxisView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=datetime_axis.js.map
*/