(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "jquery", "jstree", "common/continuum_view", "common/has_properties"], function(_, $, $1, ContinuumView, HasProperties) {
    var ObjectExplorerView, _ref;
    ObjectExplorerView = (function(_super) {
      __extends(ObjectExplorerView, _super);

      function ObjectExplorerView() {
        this.createContextMenu = __bind(this.createContextMenu, this);
        this.onEvent = __bind(this.onEvent, this);
        _ref = ObjectExplorerView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      ObjectExplorerView.prototype.initialize = function(options) {
        ObjectExplorerView.__super__.initialize.call(this, options);
        this.onEvent = _.debounce(this.onEvent, options.debounce || 200);
        this.showToolbar = options.showToolbar || false;
        this.arrayLimit = options.arrayLimit || 100;
        return this.render();
      };

      ObjectExplorerView.prototype.base = function() {
        if (this._base == null) {
          this._base = require("common/base");
        }
        return this._base;
      };

      ObjectExplorerView.prototype.delegateEvents = function(events) {
        var type, _i, _len, _ref1, _results;
        ObjectExplorerView.__super__.delegateEvents.call(this, events);
        _ref1 = _.keys(this.base().locations);
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          type = _ref1[_i];
          _results.push(this.base().Collections(type).on("all", this.onEvent));
        }
        return _results;
      };

      ObjectExplorerView.prototype.onEvent = function(event) {
        return this.reRender();
      };

      ObjectExplorerView.prototype.createTree = function(nonempty) {
        var children, node, nodes, type, _i, _len, _results;
        if (nonempty == null) {
          nonempty = true;
        }
        nodes = (function() {
          var _i, _len, _ref1, _results,
            _this = this;
          _ref1 = _.keys(this.base().locations);
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            type = _ref1[_i];
            children = this.base().Collections(type).map(function(obj, index) {
              var visited;
              visited = {};
              visited[obj.id] = 1;
              return _this.descend(index, obj, visited);
            });
            _results.push(this.node(type, "collection", children));
          }
          return _results;
        }).call(this);
        if (nonempty) {
          _results = [];
          for (_i = 0, _len = nodes.length; _i < _len; _i++) {
            node = nodes[_i];
            if (node.children.length > 0) {
              _results.push(node);
            }
          }
          return _results;
        } else {
          return nodes;
        }
      };

      ObjectExplorerView.prototype.descend = function(label, obj, visited) {
        var arrayLimit, attr, children, color, html, index, key, ref, truncate, type, value, _ref1;
        if (this.isRef(obj)) {
          ref = true;
          if (visited[obj.id] == null) {
            obj = this.base().Collections(obj.type).get(obj.id);
          } else {
            console.log("Cyclic reference to " + obj.type + ":" + obj.id);
          }
        }
        if (obj instanceof HasProperties) {
          visited = _.clone(visited);
          visited[obj.id] = 1;
          children = (function() {
            var _ref1, _results;
            _ref1 = obj.attributes;
            _results = [];
            for (attr in _ref1) {
              if (!__hasProp.call(_ref1, attr)) continue;
              value = _ref1[attr];
              if (this.isAttr(attr)) {
                _results.push(this.descend(attr, value, visited));
              }
            }
            return _results;
          }).call(this);
          type = obj.type;
          value = null;
          color = null;
        } else if (_.isArray(obj)) {
          truncate = obj.length > this.arrayLimit;
          arrayLimit = this.arrayLimit || obj.length;
          children = (function() {
            var _i, _len, _ref1, _results;
            _ref1 = obj.slice(0, +this.arrayLimit + 1 || 9e9);
            _results = [];
            for (index = _i = 0, _len = _ref1.length; _i < _len; index = ++_i) {
              value = _ref1[index];
              _results.push(this.descend(index, value, visited));
            }
            return _results;
          }).call(this);
          type = ("Array[" + obj.length + "]") + (truncate ? " (showing first " + this.arrayLimit + " items)" : "");
          value = null;
          color = null;
        } else if (_.isObject(obj)) {
          children = (function() {
            var _results;
            _results = [];
            for (key in obj) {
              if (!__hasProp.call(obj, key)) continue;
              value = obj[key];
              _results.push(this.descend(key, value, visited));
            }
            return _results;
          }).call(this);
          type = "Object[" + (_.keys(obj).length) + "]";
          value = null;
          color = null;
        } else {
          children = [];
          _ref1 = _.isUndefined(obj) ? [null, null, 'orchid'] : _.isNull(obj) ? [null, null, 'teal'] : _.isBoolean(obj) ? ["Boolean", null, 'darkmagenta'] : _.isNumber(obj) ? ["Number", null, 'green'] : _.isString(obj) ? ["String", "\"" + obj + "\"", 'firebrick'] : _.isFunction(obj) ? ["Function", null, null] : _.isDate(obj) ? ["Date", null, null] : _.isRegExp(obj) ? ["RegExp", null, null] : _.isElement(obj) ? ["Element", null, null] : [typeof obj, null, null], type = _ref1[0], value = _ref1[1], color = _ref1[2];
          if (value == null) {
            value = "" + obj;
          }
          if (color == null) {
            color = "black";
          }
        }
        html = ["<span style=\"color:gray\">" + label + "</span>"];
        if (type != null) {
          html = html.concat([": ", "<span style=\"color:blue\">" + type + (ref ? "<span style=\"color:red\">*</span>" : "") + "</span>"]);
        }
        if (value != null) {
          html = html.concat([" = ", "<span style=\"color:" + color + "\">" + value + "</span>"]);
        }
        return this.node(html.join(""), "", children);
      };

      ObjectExplorerView.prototype.isRef = function(obj) {
        return _.isObject(obj) && (_.isEqual(_.keys(obj), ["id", "type"]) || _.isEqual(_.keys(obj), ["type", "id"]));
      };

      ObjectExplorerView.prototype.isAttr = function(attr) {
        return attr.length > 0 && attr[0] !== '_';
      };

      ObjectExplorerView.prototype.node = function(text, type, children, open) {
        return {
          text: text,
          type: type,
          children: children || [],
          state: {
            open: open || false
          }
        };
      };

      ObjectExplorerView.prototype.renderToolbar = function() {
        var $refresh, $toolbar,
          _this = this;
        $toolbar = $('<div class="btn-group"></div>');
        $refresh = $('<button type="button" class="btn btn-default">Refresh</button>');
        $refresh.click(function(event) {
          return _this.reRender();
        });
        $toolbar.append($refresh);
        if (!this.showToolbar) {
          $toolbar.hide();
        }
        return $toolbar;
      };

      ObjectExplorerView.prototype.themeUrl = function() {
        return null;
      };

      ObjectExplorerView.prototype.createContextMenu = function(node) {
        var data, menu;
        data = node.original;
        menu = {};
        if (data.type !== "collection") {
          menu["remove"] = {
            label: "Remove"
          };
        }
        return menu;
      };

      ObjectExplorerView.prototype.renderTree = function() {
        return $('<div/>').jstree({
          core: {
            data: this.createTree(),
            themes: {
              url: this.themeUrl()
            }
          },
          contextmenu: {
            items: this.createContextMenu
          },
          plugins: ["contextmenu"]
        });
      };

      ObjectExplorerView.prototype.render = function() {
        this.$toolbar = this.renderToolbar();
        this.$tree = this.renderTree();
        return this.$el.append([this.$toolbar, this.$tree]);
      };

      ObjectExplorerView.prototype.reRender = function() {
        this.$tree.jstree('destroy');
        this.$el.empty();
        return this.render();
      };

      return ObjectExplorerView;

    })(ContinuumView.View);
    return {
      View: ObjectExplorerView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=object_explorer.js.map
*/