(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["common/has_properties"], function(HasProperties) {
    var GridMapper, _ref;
    return GridMapper = (function(_super) {
      __extends(GridMapper, _super);

      function GridMapper() {
        _ref = GridMapper.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      GridMapper.prototype.map_to_target = function(x, y) {
        var xprime, yprime;
        xprime = this.get('domain_mapper').map_to_target(x);
        yprime = this.get('codomain_mapper').map_to_target(y);
        return [xprime, yprime];
      };

      GridMapper.prototype.v_map_to_target = function(xs, ys) {
        var xprimes, yprimes;
        xprimes = this.get('domain_mapper').v_map_to_target(xs);
        yprimes = this.get('codomain_mapper').v_map_to_target(ys);
        return [xprimes, yprimes];
      };

      GridMapper.prototype.map_from_target = function(xprime, yprime) {
        var x, y;
        x = this.get('domain_mapper').map_from_target(xprime);
        y = this.get('codomain_mapper').map_from_target(yprime);
        return [x, y];
      };

      GridMapper.prototype.v_map_from_target = function(xprimes, yprimes) {
        var xs, ys;
        xs = this.get('domain_mapper').v_map_from_target(xprimes);
        ys = this.get('codomain_mapper').v_map_from_target(yprimes);
        return [xs, ys];
      };

      return GridMapper;

    })(HasProperties);
  });

}).call(this);

/*
//@ sourceMappingURL=grid_mapper.js.map
*/