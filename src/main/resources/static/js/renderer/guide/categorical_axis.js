(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["backbone", "./axis", "common/ticking", "range/factor_range"], function(Backbone, Axis, ticking, FactorRange) {
    var CategoricalAxes, CategoricalAxis, CategoricalAxisView, _CategoricalFormatter, _CategoricalScale, _ref, _ref1, _ref2;
    _CategoricalFormatter = (function() {
      function _CategoricalFormatter() {}

      _CategoricalFormatter.prototype.format = function(ticks) {
        return ticks;
      };

      return _CategoricalFormatter;

    })();
    _CategoricalScale = (function() {
      function _CategoricalScale() {}

      _CategoricalScale.prototype.get_ticks = function(start, end, range, _arg) {
        var desired_n_ticks;
        desired_n_ticks = _arg.desired_n_ticks;
        return range.get("factors");
      };

      return _CategoricalScale;

    })();
    CategoricalAxisView = (function(_super) {
      __extends(CategoricalAxisView, _super);

      function CategoricalAxisView() {
        _ref = CategoricalAxisView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      CategoricalAxisView.prototype.initialize = function(attrs, options) {
        CategoricalAxisView.__super__.initialize.call(this, attrs, options);
        return this.formatter = new _CategoricalFormatter();
      };

      return CategoricalAxisView;

    })(Axis.View);
    CategoricalAxis = (function(_super) {
      __extends(CategoricalAxis, _super);

      function CategoricalAxis() {
        _ref1 = CategoricalAxis.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      CategoricalAxis.prototype.default_view = CategoricalAxisView;

      CategoricalAxis.prototype.type = 'CategoricalAxis';

      CategoricalAxis.prototype.initialize = function(attrs, options) {
        options.scale = new _CategoricalScale();
        return CategoricalAxis.__super__.initialize.call(this, attrs, options);
      };

      CategoricalAxis.prototype._bounds = function() {
        var i, range_bounds, ranges, user_bounds, _ref2;
        i = this.get('dimension');
        ranges = [this.get_obj('plot').get_obj('x_range'), this.get_obj('plot').get_obj('y_range')];
        user_bounds = (_ref2 = this.get('bounds')) != null ? _ref2 : 'auto';
        if (user_bounds !== 'auto') {
          console.log("Categorical Axes only support user_bounds='auto', ignoring");
        }
        range_bounds = [ranges[i].get('min'), ranges[i].get('max')];
        return range_bounds;
      };

      CategoricalAxis.prototype.display_defaults = function() {
        return CategoricalAxis.__super__.display_defaults.call(this);
      };

      return CategoricalAxis;

    })(Axis.Model);
    CategoricalAxes = (function(_super) {
      __extends(CategoricalAxes, _super);

      function CategoricalAxes() {
        _ref2 = CategoricalAxes.__super__.constructor.apply(this, arguments);
        return _ref2;
      }

      CategoricalAxes.prototype.model = CategoricalAxis;

      return CategoricalAxes;

    })(Backbone.Collection);
    return {
      "Model": CategoricalAxis,
      "Collection": new CategoricalAxes(),
      "View": CategoricalAxisView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=categorical_axis.js.map
*/