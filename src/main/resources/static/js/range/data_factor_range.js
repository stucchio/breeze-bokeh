(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "backbone", "range/factor_range"], function(_, Backbone, FactorRange) {
    var DataFactorRange, DataFactorRanges, _ref, _ref1;
    DataFactorRange = (function(_super) {
      __extends(DataFactorRange, _super);

      function DataFactorRange() {
        this._get_values = __bind(this._get_values, this);
        _ref = DataFactorRange.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      DataFactorRange.prototype.type = 'DataFactorRange';

      DataFactorRange.prototype._get_values = function() {
        var columns, temp, uniques, val, x, _i, _len;
        columns = (function() {
          var _i, _len, _ref1, _results;
          _ref1 = this.get('columns');
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            x = _ref1[_i];
            _results.push(this.get_obj('data_source').getcolumn(x));
          }
          return _results;
        }).call(this);
        columns = _.reduce(columns, (function(x, y) {
          return x.concat(y);
        }), []);
        temp = {};
        for (_i = 0, _len = columns.length; _i < _len; _i++) {
          val = columns[_i];
          temp[val] = true;
        }
        uniques = _.keys(temp);
        uniques = _.sortBy(uniques, (function(x) {
          return x;
        }));
        return uniques;
      };

      DataFactorRange.prototype.dinitialize = function(attrs, options) {
        DataFactorRange.__super__.dinitialize.call(this, attrs, options);
        this.register_property;
        this.register_property('values', this._get_values, true);
        this.add_dependencies('values', this, ['data_source', 'columns']);
        return this.add_dependencies('values', this.get_obj('data_source'), ['data_source', 'columns']);
      };

      DataFactorRange.prototype.defaults = function() {
        return {
          values: [],
          columns: [],
          data_source: null
        };
      };

      return DataFactorRange;

    })(FactorRange.Model);
    DataFactorRanges = (function(_super) {
      __extends(DataFactorRanges, _super);

      function DataFactorRanges() {
        _ref1 = DataFactorRanges.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      DataFactorRanges.prototype.model = DataFactorRange;

      return DataFactorRanges;

    })(Backbone.Collection);
    return {
      "Model": DataFactorRange,
      "Collection": new DataFactorRanges
    };
  });

}).call(this);

/*
//@ sourceMappingURL=data_factor_range.js.map
*/