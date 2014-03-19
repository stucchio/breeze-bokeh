(function() {
  define(["underscore"], function(_) {
    var safebind;
    return safebind = function(binder, target, event, callback) {
      var error,
        _this = this;
      if (!_.has(binder, 'eventers')) {
        binder['eventers'] = {};
      }
      try {
        binder['eventers'][target.id] = target;
      } catch (_error) {
        error = _error;
      }
      if (target != null) {
        target.on(event, callback, binder);
        target.on('destroy remove', function() {
          return delete binder['eventers'][target];
        }, binder);
      } else {
        debugger;
        console.log("error with binder", binder, event);
      }
      return null;
    };
  });

}).call(this);

/*
//@ sourceMappingURL=safebind.js.map
*/