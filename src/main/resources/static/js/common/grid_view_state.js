(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "./safebind", "./view_state"], function(_, safebind, ViewState) {
    var GridViewState, _ref;
    GridViewState = (function(_super) {
      __extends(GridViewState, _super);

      function GridViewState() {
        this.layout_widths = __bind(this.layout_widths, this);
        this.layout_heights = __bind(this.layout_heights, this);
        this.setup_layout_properties = __bind(this.setup_layout_properties, this);
        _ref = GridViewState.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      GridViewState.prototype.setup_layout_properties = function() {
        var row, viewstate, _i, _len, _ref1, _results;
        this.register_property('layout_heights', this.layout_heights, true);
        this.register_property('layout_widths', this.layout_widths, true);
        _ref1 = this.get('childviewstates');
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          row = _ref1[_i];
          _results.push((function() {
            var _j, _len1, _results1;
            _results1 = [];
            for (_j = 0, _len1 = row.length; _j < _len1; _j++) {
              viewstate = row[_j];
              this.add_dependencies('layout_heights', viewstate, 'outer_height');
              _results1.push(this.add_dependencies('layout_widths', viewstate, 'outer_width'));
            }
            return _results1;
          }).call(this));
        }
        return _results;
      };

      GridViewState.prototype.initialize = function(attrs, options) {
        GridViewState.__super__.initialize.call(this, attrs, options);
        this.setup_layout_properties();
        safebind(this, this, 'change:childviewstates', this.setup_layout_properties);
        this.register_property('height', function() {
          return _.reduce(this.get('layout_heights'), (function(x, y) {
            return x + y;
          }), 0);
        }, true);
        this.add_dependencies('height', this, 'layout_heights');
        this.register_property('width', function() {
          return _.reduce(this.get('layout_widths'), (function(x, y) {
            return x + y;
          }), 0);
        }, true);
        return this.add_dependencies('width', this, 'layout_widths');
      };

      GridViewState.prototype.position_child_x = function(offset, childsize) {
        return offset;
      };

      GridViewState.prototype.position_child_y = function(offset, childsize) {
        return this.get('height') - offset - childsize;
      };

      GridViewState.prototype.maxdim = function(dim, row) {
        if (row.length === 0) {
          return 0;
        } else {
          return _.max(_.map(row, (function(x) {
            return x.get(dim);
          })));
        }
      };

      GridViewState.prototype.layout_heights = function() {
        var row, row_heights;
        row_heights = (function() {
          var _i, _len, _ref1, _results;
          _ref1 = this.get('childviewstates');
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            row = _ref1[_i];
            _results.push(this.maxdim('outer_height', row));
          }
          return _results;
        }).call(this);
        return row_heights;
      };

      GridViewState.prototype.layout_widths = function() {
        var col, col_widths, columns, n, num_cols, row;
        num_cols = this.get('childviewstates')[0].length;
        columns = (function() {
          var _i, _len, _ref1, _results;
          _ref1 = _.range(num_cols);
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            n = _ref1[_i];
            _results.push((function() {
              var _j, _len1, _ref2, _results1;
              _ref2 = this.get('childviewstates');
              _results1 = [];
              for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
                row = _ref2[_j];
                _results1.push(row[n]);
              }
              return _results1;
            }).call(this));
          }
          return _results;
        }).call(this);
        col_widths = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = columns.length; _i < _len; _i++) {
            col = columns[_i];
            _results.push(this.maxdim('outer_width', col));
          }
          return _results;
        }).call(this);
        return col_widths;
      };

      GridViewState.prototype.defaults = function() {
        return {
          childviewstates: [[]],
          border_space: 0
        };
      };

      return GridViewState;

    })(ViewState);
    return GridViewState;
  });

}).call(this);

/*
//@ sourceMappingURL=grid_view_state.js.map
*/