(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["backbone", "common/has_properties"], function(Backbone, HasProperties) {
    var IPythonRemoteData, IPythonRemoteDatas, _ref, _ref1;
    IPythonRemoteData = (function(_super) {
      __extends(IPythonRemoteData, _super);

      function IPythonRemoteData() {
        _ref = IPythonRemoteData.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      IPythonRemoteData.prototype.type = 'IPythonRemoteData';

      IPythonRemoteData.prototype.defaults = {
        computed_columns: []
      };

      return IPythonRemoteData;

    })(HasProperties);
    IPythonRemoteDatas = (function(_super) {
      __extends(IPythonRemoteDatas, _super);

      function IPythonRemoteDatas() {
        _ref1 = IPythonRemoteDatas.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      IPythonRemoteDatas.prototype.model = IPythonRemoteData;

      return IPythonRemoteDatas;

    })(Backbone.Collection);
    return {
      "Model": IPythonRemoteData,
      "Collection": new IPythonRemoteDatas()
    };
  });

}).call(this);

/*
//@ sourceMappingURL=ipython_remote_data.js.map
*/