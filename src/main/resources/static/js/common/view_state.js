(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["./has_properties", "range/range1d"], function(HasProperties, Range1d) {
    var ViewState, _ref;
    return ViewState = (function(_super) {
      __extends(ViewState, _super);

      function ViewState() {
        _ref = ViewState.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      ViewState.prototype.initialize = function(attrs, options) {
        var _inner_range_horizontal, _inner_range_vertical;
        ViewState.__super__.initialize.call(this, attrs, options);
        this.register_property('border_top', function() {
          return Math.max(this.get('min_border_top'), this.get('requested_border_top'));
        }, false);
        this.add_dependencies('border_top', this, ['min_border_top', 'requested_border_top']);
        this.register_property('border_bottom', function() {
          return Math.max(this.get('min_border_bottom'), this.get('requested_border_bottom'));
        }, false);
        this.add_dependencies('border_bottom', this, ['min_border_bottom', 'requested_border_bottom']);
        this.register_property('border_left', function() {
          return Math.max(this.get('min_border_left'), this.get('requested_border_left'));
        }, false);
        this.add_dependencies('border_left', this, ['min_border_left', 'requested_border_left']);
        this.register_property('border_right', function() {
          return Math.max(this.get('min_border_right'), this.get('requested_border_right'));
        }, false);
        this.add_dependencies('border_right', this, ['min_border_right', 'requested_border_right']);
        this.register_property('canvas_aspect', function() {
          return this.get('canvas_height') / this.get('canvas_width');
        }, true);
        this.add_dependencies('canvas_aspect', this, ['canvas_height', 'canvas_width']);
        this.register_property('outer_aspect', function() {
          return this.get('outer_height') / this.get('outer_width');
        }, true);
        this.add_dependencies('outer_aspect', this, ['outer_height', 'outer_width']);
        this.register_property('inner_width', function() {
          return this.get('outer_width') - this.get('border_left') - this.get('border_right');
        }, true);
        this.add_dependencies('inner_width', this, ['outer_width', 'border_left', 'border_right']);
        this.register_property('inner_height', function() {
          return this.get('outer_height') - this.get('border_top') - this.get('border_bottom');
        }, true);
        this.add_dependencies('inner_height', this, ['outer_height', 'border_top', 'border_bottom']);
        this.register_property('inner_aspect', function() {
          return this.get('inner_height') / this.get('inner_width');
        }, true);
        this.add_dependencies('inner_aspect', this, ['inner_height', 'inner_width']);
        _inner_range_horizontal = new Range1d.Model({
          start: this.get('border_left'),
          end: this.get('border_left') + this.get('inner_width')
        });
        this.register_property('inner_range_horizontal', function() {
          _inner_range_horizontal.set('start', this.get('border_left'));
          _inner_range_horizontal.set('end', this.get('border_left') + this.get('inner_width'));
          return _inner_range_horizontal;
        }, true);
        this.add_dependencies('inner_range_horizontal', this, ['border_left', 'inner_width']);
        _inner_range_vertical = new Range1d.Model({
          start: this.get('border_bottom'),
          end: this.get('border_bottom') + this.get('inner_height')
        });
        this.register_property('inner_range_vertical', function() {
          _inner_range_vertical.set('start', this.get('border_bottom'));
          _inner_range_vertical.set('end', this.get('border_bottom') + this.get('inner_height'));
          return _inner_range_vertical;
        }, true);
        return this.add_dependencies('inner_range_vertical', this, ['border_bottom', 'inner_height']);
      };

      ViewState.prototype.vx_to_sx = function(x) {
        return x;
      };

      ViewState.prototype.vy_to_sy = function(y) {
        return this.get('canvas_height') - y;
      };

      ViewState.prototype.v_vx_to_sx = function(xx) {
        var idx, x, _i, _len;
        for (idx = _i = 0, _len = xx.length; _i < _len; idx = ++_i) {
          x = xx[idx];
          xx[idx] = x;
        }
        return xx;
      };

      ViewState.prototype.v_vy_to_sy = function(yy) {
        var canvas_height, idx, y, _i, _len;
        canvas_height = this.get('canvas_height');
        for (idx = _i = 0, _len = yy.length; _i < _len; idx = ++_i) {
          y = yy[idx];
          yy[idx] = canvas_height - y;
        }
        return yy;
      };

      ViewState.prototype.sx_to_vx = function(x) {
        return x;
      };

      ViewState.prototype.sy_to_vy = function(y) {
        return this.get('canvas_height') - y;
      };

      ViewState.prototype.v_sx_to_vx = function(xx) {
        var idx, x, _i, _len;
        for (idx = _i = 0, _len = xx.length; _i < _len; idx = ++_i) {
          x = xx[idx];
          xx[idx] = x;
        }
        return xx;
      };

      ViewState.prototype.v_sy_to_vy = function(yy) {
        var canvas_height, idx, y, _i, _len;
        canvas_height = this.get('canvas_height');
        for (idx = _i = 0, _len = yy.length; _i < _len; idx = ++_i) {
          y = yy[idx];
          yy[idx] = canvas_height - y;
        }
        return yy;
      };

      return ViewState;

    })(HasProperties);
  });

}).call(this);

/*
//@ sourceMappingURL=view_state.js.map
*/