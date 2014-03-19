(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "backbone", "sprintf", "./tool"], function(_, Backbone, sprintf, Tool) {
    var HoverTool, HoverToolView, HoverTools, _color_to_hex, _format_number, _ref, _ref1, _ref2;
    _color_to_hex = function(color) {
      var blue, digits, green, red, rgb;
      if (color.substr(0, 1) === '#') {
        return color;
      }
      digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);
      red = parseInt(digits[2]);
      green = parseInt(digits[3]);
      blue = parseInt(digits[4]);
      rgb = blue | (green << 8) | (red << 16);
      return digits[1] + '#' + rgb.toString(16);
    };
    _format_number = function(number) {
      if (typeof number === "string") {
        return number;
      }
      if (Math.floor(number) === number) {
        return sprintf("%d", number);
      }
      if (Math.abs(number) > 0.1 && Math.abs(number) < 1000) {
        return sprintf("%0.3f", number);
      }
      return sprintf("%0.3e", number);
    };
    HoverToolView = (function(_super) {
      __extends(HoverToolView, _super);

      function HoverToolView() {
        _ref = HoverToolView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      HoverToolView.prototype.initialize = function(options) {
        HoverToolView.__super__.initialize.call(this, options);
        this.div = $('<div class="bokeh_tooltip" />').appendTo('body');
        this.div.hide();
        return this.active = false;
      };

      HoverToolView.prototype.bind_bokeh_events = function() {
        var tool_name,
          _this = this;
        tool_name = "hover_tool";
        this.tool_button = $("<button class='btn btn-small'> Hover </button>");
        this.plot_view.$el.find('.button_bar').append(this.tool_button);
        this.tool_button.click(function() {
          if (_this.active) {
            return _this.plot_view.eventSink.trigger("clear_active_tool");
          } else {
            return _this.plot_view.eventSink.trigger("active_tool", tool_name);
          }
        });
        this.plot_view.eventSink.on("" + tool_name + ":deactivated", function() {
          _this.active = false;
          _this.tool_button.removeClass('active');
          return _this.div.hide();
        });
        this.plot_view.eventSink.on("" + tool_name + ":activated", function() {
          _this.active = true;
          return _this.tool_button.addClass('active');
        });
        this.plot_view.canvas.bind("mousemove", function(e) {
          var irh, irv, left, offset, top, vx, vy, xend, xstart, yend, ystart, _ref1;
          if (!_this.active) {
            return;
          }
          offset = $(e.currentTarget).offset();
          left = offset != null ? offset.left : 0;
          top = offset != null ? offset.top : 0;
          e.bokehX = e.pageX - left;
          e.bokehY = e.pageY - top;
          _ref1 = _this.view_coords(e.bokehX, e.bokehY), vx = _ref1[0], vy = _ref1[1];
          irh = _this.plot_view.view_state.get('inner_range_horizontal');
          irv = _this.plot_view.view_state.get('inner_range_vertical');
          xstart = irh.get('start');
          xend = irh.get('end');
          ystart = irv.get('start');
          yend = irv.get('end');
          if (vx < xstart || vx > xend || vy < ystart || vy > yend) {
            _this.div.hide();
            return;
          }
          return _this._select(vx, vy, e);
        });
        return this.plot_view.canvas_wrapper.css('cursor', 'crosshair');
      };

      HoverToolView.prototype.view_coords = function(sx, sy) {
        var vx, vy, _ref1;
        _ref1 = [this.plot_view.view_state.sx_to_vx(sx), this.plot_view.view_state.sy_to_vy(sy)], vx = _ref1[0], vy = _ref1[1];
        return [vx, vy];
      };

      HoverToolView.prototype._select = function(vx, vy, e) {
        var colname, color, column, column_name, datasource, datasource_id, datasource_selections, datasources, ds, dsvalue, geometry, hex, i, label, match, opts, renderer, row, selected, span, swatch, table, td, unused, value, x, y, _i, _j, _len, _len1, _ref1, _ref2, _ref3, _ref4, _ref5;
        geometry = {
          type: 'point',
          vx: vx,
          vy: vy
        };
        x = this.plot_view.xmapper.map_from_target(vx);
        y = this.plot_view.ymapper.map_from_target(vy);
        datasources = {};
        datasource_selections = {};
        _ref1 = this.mget_obj('renderers');
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          renderer = _ref1[_i];
          datasource = renderer.get_obj('data_source');
          datasources[datasource.id] = datasource;
        }
        _ref2 = this.mget_obj('renderers');
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          renderer = _ref2[_j];
          datasource_id = renderer.get_obj('data_source').id;
          _.setdefault(datasource_selections, datasource_id, []);
          selected = this.plot_view.renderers[renderer.id].hit_test(geometry);
          ds = datasources[datasource_id];
          if (selected === null) {
            continue;
          }
          if (selected.length > 0) {
            i = selected[0];
            this.div.empty();
            table = $('<table></table>');
            _ref3 = this.mget("tooltips");
            for (label in _ref3) {
              value = _ref3[label];
              row = $("<tr></tr>");
              row.append($("<td class='bokeh_tooltip_row_label'>" + label + ": </td>"));
              td = $("<td class='bokeh_tooltip_row_value'></td>");
              if (value.indexOf("$color") >= 0) {
                _ref4 = value.match(/\$color(\[.*\])?:(\w*)/), match = _ref4[0], opts = _ref4[1], colname = _ref4[2];
                column = ds.getcolumn(colname);
                if (column == null) {
                  span = $("<span>" + colname + " unknown</span>");
                  td.append(span);
                  continue;
                }
                hex = (opts != null ? opts.indexOf("hex") : void 0) >= 0;
                swatch = (opts != null ? opts.indexOf("swatch") : void 0) >= 0;
                color = column[i];
                if (color == null) {
                  span = $("<span>(null)</span>");
                  td.append(span);
                  continue;
                }
                if (hex) {
                  color = _color_to_hex(color);
                }
                span = $("<span>" + color + "</span>");
                td.append(span);
                if (swatch) {
                  span = $("<span class='bokeh_tooltip_color_block'> </span>");
                  span.css({
                    backgroundColor: color
                  });
                }
                td.append(span);
              } else {
                value = value.replace("$index", "" + i);
                value = value.replace("$x", "" + (_format_number(x)));
                value = value.replace("$y", "" + (_format_number(y)));
                value = value.replace("$vx", "" + vx);
                value = value.replace("$vy", "" + vy);
                value = value.replace("$sx", "" + e.bokehX);
                value = value.replace("$sy", "" + e.bokehY);
                while (value.indexOf("@") >= 0) {
                  _ref5 = value.match(/(@)(\w*)/), match = _ref5[0], unused = _ref5[1], column_name = _ref5[2];
                  column = ds.getcolumn(column_name);
                  if (column == null) {
                    value = value.replace(column_name, "" + column_name + " unknown");
                    break;
                  }
                  column = ds.getcolumn(column_name);
                  dsvalue = column[i];
                  if (typeof dsvalue === "number") {
                    value = value.replace(match, "" + (_format_number(dsvalue)));
                  } else {
                    value = value.replace(match, "" + dsvalue);
                  }
                }
                span = $("<span>" + value + "</span>");
                td.append(span);
              }
              row.append(td);
              table.append(row);
            }
            this.div.append(table);
            this.div.css({
              top: e.pageY - this.div.height() / 2,
              left: e.pageX + 18
            });
            this.div.show();
            break;
          } else {
            this.div.hide();
          }
          datasource_selections[datasource_id].push(selected);
        }
        return null;
      };

      return HoverToolView;

    })(Tool.View);
    HoverTool = (function(_super) {
      __extends(HoverTool, _super);

      function HoverTool() {
        _ref1 = HoverTool.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      HoverTool.prototype.default_view = HoverToolView;

      HoverTool.prototype.type = "HoverTool";

      HoverTool.prototype.dinitialize = function(attrs, options) {
        var r;
        HoverTool.__super__.dinitialize.call(this, attrs, options);
        return this.set('renderers', (function() {
          var _i, _len, _ref2, _results;
          _ref2 = this.get_obj('plot').get('renderers');
          _results = [];
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            r = _ref2[_i];
            if (r.type === "Glyph") {
              _results.push(r);
            }
          }
          return _results;
        }).call(this));
      };

      HoverTool.prototype.defaults = function() {
        return _.extend(HoverTool.__super__.defaults.call(this), {
          renderers: [],
          tooltips: {
            "index": "$index",
            "data (x, y)": "($x, $y)",
            "canvas (x, y)": "($sx, $sy)"
          }
        });
      };

      HoverTool.prototype.display_defaults = function() {
        return HoverTool.__super__.display_defaults.call(this);
      };

      return HoverTool;

    })(Tool.Model);
    HoverTools = (function(_super) {
      __extends(HoverTools, _super);

      function HoverTools() {
        _ref2 = HoverTools.__super__.constructor.apply(this, arguments);
        return _ref2;
      }

      HoverTools.prototype.model = HoverTool;

      return HoverTools;

    })(Backbone.Collection);
    return {
      "Model": HoverTool,
      "Collection": new HoverTools(),
      "View": HoverToolView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=hover_tool.js.map
*/