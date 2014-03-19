(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "common/svg_colors"], function(_, svg_colors) {
    var fill_properties, glyph_properties, line_properties, properties, text_properties;
    properties = (function() {
      function properties() {}

      properties.prototype.source_v_select = function(attrname, datasource) {
        var default_value, glyph_props, i, prop, retval, _i, _ref;
        glyph_props = this;
        if (!(attrname in glyph_props)) {
          console.log("requested vector selection of unknown property '" + attrname + "' on objects");
          return (function() {
            var _i, _len, _ref, _results;
            _ref = datasource.get_length();
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              i = _ref[_i];
              _results.push(null);
            }
            return _results;
          })();
        }
        prop = glyph_props[attrname];
        if ((prop.field != null) && (prop.field in datasource.get('data'))) {
          return datasource.getcolumn(prop.field);
        } else {
          if (glyph_props[attrname].value != null) {
            default_value = glyph_props[attrname].value;
          } else if (attrname in datasource.get('data')) {
            return datasource.getcolumn(attrname);
          } else if (glyph_props[attrname]["default"] != null) {
            default_value = glyph_props[attrname]["default"];
          }
          retval = [];
          for (i = _i = 0, _ref = datasource.get_length(); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
            retval.push(default_value);
          }
          return retval;
        }
      };

      properties.prototype.string = function(styleprovider, glyphspec, attrname) {
        var default_value, glyph_value;
        this[attrname] = {};
        default_value = styleprovider.mget(attrname);
        if (default_value == null) {

        } else if (_.isString(default_value)) {
          this[attrname]["default"] = default_value;
        } else {
          console.log(("string property '" + attrname + "' given invalid default value: ") + default_value);
        }
        if ((glyphspec == null) || !(attrname in glyphspec)) {
          return;
        }
        glyph_value = glyphspec[attrname];
        if (_.isString(glyph_value)) {
          return this[attrname].value = glyph_value;
        } else if (_.isObject(glyph_value)) {
          return this[attrname] = _.extend(this[attrname], glyph_value);
        } else {
          return console.log(("string property '" + attrname + "' given invalid glyph value: ") + glyph_value);
        }
      };

      properties.prototype.number = function(styleprovider, glyphspec, attrname) {
        var default_value, glyph_value, units_value, _ref;
        this[attrname] = {};
        default_value = styleprovider.mget(attrname);
        if (default_value == null) {

        } else if (_.isNumber(default_value)) {
          this[attrname]["default"] = default_value;
        } else {
          console.log(("number property '" + attrname + "' given invalid default value: ") + default_value);
        }
        units_value = (_ref = styleprovider.mget(attrname + '_units')) != null ? _ref : 'data';
        if ((glyphspec != null) && (attrname + '_units' in glyphspec)) {
          units_value = glyphspec[attrname + '_units'];
        }
        this[attrname].units = units_value;
        if ((glyphspec == null) || !(attrname in glyphspec)) {
          return;
        }
        glyph_value = glyphspec[attrname];
        if (_.isString(glyph_value)) {
          return this[attrname].field = glyph_value;
        } else if (_.isNumber(glyph_value)) {
          return this[attrname].value = glyph_value;
        } else if (_.isObject(glyph_value)) {
          return this[attrname] = _.extend(this[attrname], glyph_value);
        } else {
          return console.log(("number property '" + attrname + "' given invalid glyph value: ") + glyph_value);
        }
      };

      properties.prototype.color = function(styleprovider, glyphspec, attrname) {
        var default_value, glyph_value;
        this[attrname] = {};
        default_value = styleprovider.mget(attrname);
        if (_.isUndefined(default_value)) {
          this[attrname]["default"] = null;
        } else if (_.isString(default_value) && ((svg_colors[default_value] != null) || default_value.substring(0, 1) === "#") || _.isNull(default_value)) {
          this[attrname]["default"] = default_value;
        } else {
          console.log(("color property '" + attrname + "' given invalid default value: ") + default_value);
        }
        if ((glyphspec == null) || !(attrname in glyphspec)) {
          return;
        }
        glyph_value = glyphspec[attrname];
        if (_.isNull(glyph_value)) {
          return this[attrname].value = null;
        } else if (_.isString(glyph_value)) {
          if ((svg_colors[glyph_value] != null) || glyph_value.substring(0, 1) === "#") {
            return this[attrname].value = glyph_value;
          } else {
            return this[attrname].field = glyph_value;
          }
        } else if (_.isObject(glyph_value)) {
          return this[attrname] = _.extend(this[attrname], glyph_value);
        } else {
          return console.log(("color property '" + attrname + "' given invalid glyph value: ") + glyph_value);
        }
      };

      properties.prototype.array = function(styleprovider, glyphspec, attrname) {
        var default_value, glyph_value, units_value, _ref;
        this[attrname] = {};
        default_value = styleprovider.mget(attrname);
        if (default_value == null) {

        } else if (_.isArray(default_value)) {
          this[attrname]["default"] = default_value;
        } else {
          console.log(("array property '" + attrname + "' given invalid default value: ") + default_value);
        }
        units_value = (_ref = styleprovider.mget(attrname + "_units")) != null ? _ref : 'data';
        if ((glyphspec != null) && (attrname + '_units' in glyphspec)) {
          units_value = glyphspec[attrname + '_units'];
        }
        this[attrname].units = units_value;
        if ((glyphspec == null) || !(attrname in glyphspec)) {
          return;
        }
        glyph_value = glyphspec[attrname];
        if (_.isString(glyph_value)) {
          return this[attrname].field = glyph_value;
        } else if (_.isArray(glyph_value)) {
          return this[attrname].value = glyph_value;
        } else if (_.isObject(glyph_value)) {
          return this[attrname] = _.extend(this[attrname], glyph_value);
        } else {
          return console.log(("array property '" + attrname + "' given invalid glyph value: ") + glyph_value);
        }
      };

      properties.prototype["enum"] = function(styleprovider, glyphspec, attrname, vals) {
        var default_value, glyph_value, levels;
        this[attrname] = {};
        levels = vals.split(" ");
        default_value = styleprovider.mget(attrname);
        if (_.isNull(default_value)) {

        } else if (_.isString(default_value) && __indexOf.call(levels, default_value) >= 0) {
          this[attrname] = {
            "default": default_value
          };
        } else {
          console.log(("enum property '" + attrname + "' given invalid default value: ") + default_value);
          console.log("    acceptable values:" + levels);
        }
        if ((glyphspec == null) || !(attrname in glyphspec)) {
          return;
        }
        glyph_value = glyphspec[attrname];
        if (_.isString(glyph_value)) {
          if (__indexOf.call(levels, glyph_value) >= 0) {
            return this[attrname].value = glyph_value;
          } else {
            return this[attrname].field = glyph_value;
          }
        } else if (_.isObject(glyph_value)) {
          return this[attrname] = _.extend(this[attrname], glyph_value);
        } else {
          console.log(("enum property '" + attrname + "' given invalid glyph value: ") + glyph_value);
          return console.log("    acceptable values:" + levels);
        }
      };

      properties.prototype.setattr = function(styleprovider, glyphspec, attrname, attrtype) {
        var values, _ref;
        values = null;
        if (attrtype.indexOf(":") > -1) {
          _ref = attrtype.split(":"), attrtype = _ref[0], values = _ref[1];
        }
        if (attrtype === "string") {
          return this.string(styleprovider, glyphspec, attrname);
        } else if (attrtype === "number") {
          return this.number(styleprovider, glyphspec, attrname);
        } else if (attrtype === "color") {
          return this.color(styleprovider, glyphspec, attrname);
        } else if (attrtype === "array") {
          return this.array(styleprovider, glyphspec, attrname);
        } else if (attrtype === "enum" && values) {
          return this["enum"](styleprovider, glyphspec, attrname, values);
        } else {
          return console.log(("Unknown type '" + attrtype + "' for glyph property: ") + attrname);
        }
      };

      properties.prototype.select = function(attrname, obj) {
        if (!(attrname in this)) {
          console.log(("requested selection of unknown property '" + attrname + "' on object: ") + obj);
          return;
        }
        if ((this[attrname].field != null) && (this[attrname].field in obj)) {
          return obj[this[attrname].field];
        }
        if (this[attrname].value != null) {
          return this[attrname].value;
        }
        if (obj.get && obj.get(attrname)) {
          return obj.get(attrname);
        }
        if (obj.mget && obj.mget(attrname)) {
          return obj.mget(attrname);
        }
        if (obj[attrname] != null) {
          return obj[attrname];
        }
        if (this[attrname]["default"] != null) {
          return this[attrname]["default"];
        }
        return console.log("selection for attribute '" + attrname + "' failed on object: " + obj);
      };

      properties.prototype.v_select = function(attrname, objs) {
        var i, obj, result, _i, _ref;
        if (!(attrname in this)) {
          console.log("requested vector selection of unknown property '" + attrname + "' on objects");
          return;
        }
        if (this[attrname].typed != null) {
          result = new Float64Array(objs.length);
        } else {
          result = new Array(objs.length);
        }
        for (i = _i = 0, _ref = objs.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          obj = objs[i];
          if ((this[attrname].field != null) && (this[attrname].field in obj)) {
            result[i] = obj[this[attrname].field];
          } else if (this[attrname].value != null) {
            result[i] = this[attrname].value;
          } else if (obj[attrname] != null) {
            result[i] = obj[attrname];
          } else if (this[attrname]["default"] != null) {
            result[i] = this[attrname]["default"];
          } else {
            console.log("vector selection for attribute '" + attrname + "' failed on object: " + obj);
            return;
          }
        }
        return result;
      };

      return properties;

    })();
    line_properties = (function(_super) {
      __extends(line_properties, _super);

      function line_properties(styleprovider, glyphspec, prefix) {
        if (prefix == null) {
          prefix = "";
        }
        this.line_color_name = "" + prefix + "line_color";
        this.line_width_name = "" + prefix + "line_width";
        this.line_alpha_name = "" + prefix + "line_alpha";
        this.line_join_name = "" + prefix + "line_join";
        this.line_cap_name = "" + prefix + "line_cap";
        this.line_dash_name = "" + prefix + "line_dash";
        this.line_dash_offset_name = "" + prefix + "line_dash_offset";
        this.color(styleprovider, glyphspec, this.line_color_name);
        this.number(styleprovider, glyphspec, this.line_width_name);
        this.number(styleprovider, glyphspec, this.line_alpha_name);
        this["enum"](styleprovider, glyphspec, this.line_join_name, "miter round bevel");
        this["enum"](styleprovider, glyphspec, this.line_cap_name, "butt round square");
        this.array(styleprovider, glyphspec, this.line_dash_name);
        this.number(styleprovider, glyphspec, this.line_dash_offset_name);
        this.do_stroke = true;
        if (!_.isUndefined(this[this.line_color_name].value)) {
          if (_.isNull(this[this.line_color_name].value)) {
            this.do_stroke = false;
          }
        } else if (_.isNull(this[this.line_color_name]["default"])) {
          this.do_stroke = false;
        }
      }

      line_properties.prototype.set = function(ctx, obj) {
        ctx.strokeStyle = this.select(this.line_color_name, obj);
        ctx.globalAlpha = this.select(this.line_alpha_name, obj);
        ctx.lineWidth = this.select(this.line_width_name, obj);
        ctx.lineJoin = this.select(this.line_join_name, obj);
        ctx.lineCap = this.select(this.line_cap_name, obj);
        ctx.setLineDash(this.select(this.line_dash_name, obj));
        return ctx.setLineDashOffset(this.select(this.line_dash_offset_name, obj));
      };

      line_properties.prototype.set_prop_cache = function(datasource) {
        this.cache = {};
        this.cache.strokeStyle = this.source_v_select(this.line_color_name, datasource);
        this.cache.globalAlpha = this.source_v_select(this.line_alpha_name, datasource);
        this.cache.lineWidth = this.source_v_select(this.line_width_name, datasource);
        this.cache.lineJoin = this.source_v_select(this.line_join_name, datasource);
        this.cache.lineCap = this.source_v_select(this.line_cap_name, datasource);
        this.cache.setLineDash = this.source_v_select(this.line_dash_name, datasource);
        return this.cache.setLineDashOffset = this.source_v_select(this.line_dash_offset_name, datasource);
      };

      line_properties.prototype.clear_prop_cache = function() {
        return this.cache = {};
      };

      line_properties.prototype.set_vectorize = function(ctx, i) {
        var did_change;
        did_change = false;
        if (ctx.strokeStyle !== this.cache.strokeStyle[i]) {
          ctx.strokeStyle = this.cache.strokeStyle[i];
          did_change = true;
        }
        if (ctx.globalAlpha !== this.cache.globalAlpha[i]) {
          ctx.globalAlpha = this.cache.globalAlpha[i];
          did_change = true;
        }
        if (ctx.lineWidth !== this.cache.lineWidth[i]) {
          ctx.lineWidth = this.cache.lineWidth[i];
          did_change = true;
        }
        if (ctx.lineJoin !== this.cache.lineJoin[i]) {
          ctx.lineJoin = this.cache.lineJoin[i];
          did_change = true;
        }
        if (ctx.lineCap !== this.cache.lineCap[i]) {
          ctx.lineCap = this.cache.lineCap[i];
          did_change = true;
        }
        if (ctx.getLineDash() !== this.cache.setLineDash[i]) {
          ctx.setLineDash(this.cache.setLineDash[i]);
          did_change = true;
        }
        if (ctx.getLineDashOffset() !== this.cache.setLineDashOffset[i]) {
          ctx.setLineDashOffset(this.cache.setLineDashOffset[i]);
          did_change = true;
        }
        return did_change;
      };

      return line_properties;

    })(properties);
    fill_properties = (function(_super) {
      __extends(fill_properties, _super);

      function fill_properties(styleprovider, glyphspec, prefix) {
        if (prefix == null) {
          prefix = "";
        }
        this.fill_color_name = "" + prefix + "fill_color";
        this.fill_alpha_name = "" + prefix + "fill_alpha";
        this.color(styleprovider, glyphspec, this.fill_color_name);
        this.number(styleprovider, glyphspec, this.fill_alpha_name);
        this.do_fill = true;
        if (!_.isUndefined(this[this.fill_color_name].value)) {
          if (_.isNull(this[this.fill_color_name].value)) {
            this.do_fill = false;
          }
        } else if (_.isNull(this[this.fill_color_name]["default"])) {
          this.do_fill = false;
        }
      }

      fill_properties.prototype.set = function(ctx, obj) {
        ctx.fillStyle = this.select(this.fill_color_name, obj);
        return ctx.globalAlpha = this.select(this.fill_alpha_name, obj);
      };

      fill_properties.prototype.set_prop_cache = function(datasource) {
        this.cache = {};
        this.cache.fillStyle = this.source_v_select(this.fill_color_name, datasource);
        return this.cache.globalAlpha = this.source_v_select(this.fill_alpha_name, datasource);
      };

      fill_properties.prototype.set_vectorize = function(ctx, i) {
        var did_change;
        did_change = false;
        if (ctx.fillStyle !== this.cache.fillStyle[i]) {
          ctx.fillStyle = this.cache.fillStyle[i];
          did_change = true;
        }
        if (ctx.globalAlpha !== this.cache.globalAlpha[i]) {
          ctx.globalAlpha = this.cache.globalAlpha[i];
          did_change = true;
        }
        return did_change;
      };

      return fill_properties;

    })(properties);
    text_properties = (function(_super) {
      __extends(text_properties, _super);

      function text_properties(styleprovider, glyphspec, prefix) {
        if (prefix == null) {
          prefix = "";
        }
        this.text_font_name = "" + prefix + "text_font";
        this.text_font_size_name = "" + prefix + "text_font_size";
        this.text_font_style_name = "" + prefix + "text_font_style";
        this.text_color_name = "" + prefix + "text_color";
        this.text_alpha_name = "" + prefix + "text_alpha";
        this.text_align_name = "" + prefix + "text_align";
        this.text_baseline_name = "" + prefix + "text_baseline";
        this.string(styleprovider, glyphspec, this.text_font_name);
        this.string(styleprovider, glyphspec, this.text_font_size_name);
        this["enum"](styleprovider, glyphspec, this.text_font_style_name, "normal italic bold");
        this.color(styleprovider, glyphspec, this.text_color_name);
        this.number(styleprovider, glyphspec, this.text_alpha_name);
        this["enum"](styleprovider, glyphspec, this.text_align_name, "left right center");
        this["enum"](styleprovider, glyphspec, this.text_baseline_name, "top middle bottom alphabetic hanging");
      }

      text_properties.prototype.font = function(obj, font_size) {
        var font, font_style;
        if (font_size == null) {
          font_size = this.select(this.text_font_size_name, obj);
        }
        font = this.select(this.text_font_name, obj);
        font_style = this.select(this.text_font_style_name, obj);
        font = font_style + " " + font_size + " " + font;
        return font;
      };

      text_properties.prototype.set = function(ctx, obj) {
        ctx.font = this.font(obj);
        ctx.fillStyle = this.select(this.text_color_name, obj);
        ctx.globalAlpha = this.select(this.text_alpha_name, obj);
        ctx.textAlign = this.select(this.text_align_name, obj);
        return ctx.textBaseline = this.select(this.text_baseline_name, obj);
      };

      text_properties.prototype.set_prop_cache = function(datasource) {
        var font, font_size, font_style, i;
        this.cache = {};
        font_size = this.source_v_select(this.text_font_size_name, datasource);
        font = this.source_v_select(this.text_font_name, datasource);
        font_style = this.source_v_select(this.text_font_style_name, datasource);
        this.cache.font = (function() {
          var _i, _ref, _results;
          _results = [];
          for (i = _i = 0, _ref = font.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
            _results.push("" + font_style[i] + " " + font_size[i] + " " + font[i]);
          }
          return _results;
        })();
        this.cache.fillStyle = this.source_v_select(this.text_color_name, datasource);
        this.cache.globalAlpha = this.source_v_select(this.text_alpha_name, datasource);
        this.cache.textAlign = this.source_v_select(this.text_align_name, datasource);
        return this.cache.textBaseline = this.source_v_select(this.text_baseline_name, datasource);
      };

      text_properties.prototype.clear_prop_cache = function() {
        return this.cache = {};
      };

      text_properties.prototype.set_vectorize = function(ctx, i) {
        var did_change;
        did_change = false;
        if (ctx.font !== this.cache.font[i]) {
          ctx.font = this.cache.font[i];
          did_change = true;
        }
        if (ctx.fillStyle !== this.cache.fillStyle[i]) {
          ctx.fillStyle = this.cache.fillStyle[i];
          did_change = true;
        }
        if (ctx.globalAlpha !== this.cache.globalAlpha[i]) {
          ctx.globalAlpha = this.cache.globalAlpha[i];
          did_change = true;
        }
        if (ctx.textAlign !== this.cache.textAlign[i]) {
          ctx.textAlign = this.cache.textAlign[i];
          did_change = true;
        }
        if (ctx.textBaseline !== this.cache.textBaseline[i]) {
          ctx.textBaseline = this.cache.textBaseline[i];
          did_change = true;
        }
        return did_change;
      };

      return text_properties;

    })(properties);
    glyph_properties = (function(_super) {
      __extends(glyph_properties, _super);

      function glyph_properties(styleprovider, glyphspec, attrnames, properties) {
        var attrname, attrtype, key, _i, _len, _ref;
        for (_i = 0, _len = attrnames.length; _i < _len; _i++) {
          attrname = attrnames[_i];
          attrtype = "number";
          if (attrname.indexOf(":") > -1) {
            _ref = attrname.split(":"), attrname = _ref[0], attrtype = _ref[1];
          }
          this.setattr(styleprovider, glyphspec, attrname, attrtype);
        }
        for (key in properties) {
          this[key] = properties[key];
        }
        this.fast_path = false;
        if ('fast_path' in glyphspec) {
          this.fast_path = glyphspec.fast_path;
        }
      }

      return glyph_properties;

    })(properties);
    return {
      "glyph_properties": glyph_properties,
      "fill_properties": fill_properties,
      "line_properties": line_properties,
      "text_properties": text_properties
    };
  });

}).call(this);

/*
//@ sourceMappingURL=properties.js.map
*/