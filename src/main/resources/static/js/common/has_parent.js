(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "./has_properties"], function(_, HasProperties) {
    var HasParent, _ref;
    HasParent = (function(_super) {
      __extends(HasParent, _super);

      function HasParent() {
        _ref = HasParent.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      HasParent.prototype.get_fallback = function(attr) {
        if (this.get_obj('parent') && _.indexOf(this.get_obj('parent').parent_properties, attr) >= 0 && !_.isUndefined(this.get_obj('parent').get(attr))) {
          return this.get_obj('parent').get(attr);
        } else {
          if (_.isFunction(this.display_defaults)) {
            return this.display_defaults()[attr];
          }
          return this.display_defaults[attr];
        }
      };

      HasParent.prototype.get = function(attr) {
        var normalval;
        normalval = HasParent.__super__.get.call(this, attr);
        if (!_.isUndefined(normalval)) {
          return normalval;
        } else if (!(attr === 'parent')) {
          return this.get_fallback(attr);
        }
      };

      HasParent.prototype.display_defaults = {};

      return HasParent;

    })(HasProperties);
    return HasParent;
  });

}).call(this);

/*
//@ sourceMappingURL=has_parent.js.map
*/