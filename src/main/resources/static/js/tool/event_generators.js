(function() {
  define([], function() {
    var ButtonEventGenerator, OnePointWheelEventGenerator, TwoPointEventGenerator, set_bokehXY;
    set_bokehXY = function(event) {
      var left, offset, top;
      offset = $(event.currentTarget).offset();
      left = offset != null ? offset.left : 0;
      top = offset != null ? offset.top : 0;
      event.bokehX = event.pageX - left;
      return event.bokehY = event.pageY - top;
    };
    TwoPointEventGenerator = (function() {
      function TwoPointEventGenerator(options) {
        this.restrict_to_innercanvas = options.restrict_to_innercanvas;
        this.options = options;
        this.toolName = this.options.eventBasename;
        this.dragging = false;
        this.basepoint_set = false;
        this.button_activated = false;
        this.tool_active = false;
      }

      TwoPointEventGenerator.prototype.bind_bokeh_events = function(plotview, eventSink) {
        var toolName,
          _this = this;
        toolName = this.toolName;
        this.plotview = plotview;
        this.eventSink = eventSink;
        this.plotview.moveCallbacks.push(function(e, x, y) {
          if (!_this.dragging) {
            return;
          }
          if (!_this.tool_active) {
            return;
          }
          set_bokehXY(e);
          if (!_this.basepoint_set) {
            _this.dragging = true;
            _this.basepoint_set = true;
            return eventSink.trigger("" + toolName + ":SetBasepoint", e);
          } else {
            eventSink.trigger("" + toolName + ":UpdatingMouseMove", e);
            e.preventDefault();
            return e.stopPropagation();
          }
        });
        this.plotview.moveCallbacks.push(function(e, x, y) {
          var inner_range_horizontal, inner_range_vertical, xend, xstart, yend, ystart;
          if (_this.dragging) {
            set_bokehXY(e);
            inner_range_horizontal = _this.plotview.view_state.get('inner_range_horizontal');
            inner_range_vertical = _this.plotview.view_state.get('inner_range_vertical');
            x = _this.plotview.view_state.sx_to_vx(e.bokehX);
            y = _this.plotview.view_state.sy_to_vy(e.bokehY);
            if (_this.restrict_to_innercanvas) {
              xstart = inner_range_horizontal.get('start');
              xend = inner_range_horizontal.get('end');
              ystart = inner_range_vertical.get('start');
              yend = inner_range_vertical.get('end');
            } else {
              xstart = 0;
              xend = _this.plotview.view_state.get('outer_width');
              ystart = 0;
              yend = _this.plotview.view_state.get('outer_height');
            }
            if (x < xstart || x > xend) {
              _this._stop_drag(e);
              return false;
            }
            if (y < ystart || y > yend) {
              _this._stop_drag(e);
              return false;
            }
          }
        });
        $(document).bind('keydown', function(e) {
          if (e.keyCode === 27) {
            return eventSink.trigger("clear_active_tool");
          }
        });
        $(document).bind('keyup', function(e) {
          if (!e[_this.options.keyName]) {
            return _this._stop_drag(e);
          }
        });
        this.plotview.canvas_wrapper.bind('mousedown', function(e) {
          var start;
          start = false;
          if (_this.button_activated || _this.eventSink.active === _this.toolName) {
            start = true;
          } else if (!_this.eventSink.active) {
            if (_this.options.keyName === null && !e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey) {
              start = true;
            } else if (e[_this.options.keyName] === true) {
              start = true;
            }
          }
          if (start) {
            _this._start_drag();
            return false;
          }
        });
        this.plotview.canvas_wrapper.bind('mouseup', function(e) {
          if (_this.button_activated) {
            _this._stop_drag(e);
            return false;
          }
        });
        this.plotview.canvas_wrapper.bind('mouseleave', function(e) {
          if (_this.button_activated) {
            _this._stop_drag(e);
            return false;
          }
        });
        this.$tool_button = $("<button class='btn btn-small'> " + this.options.buttonText + " </button>");
        this.plotview;
        this.plotview.$el.find('.button_bar').append(this.$tool_button);
        this.$tool_button.click(function() {
          if (_this.button_activated) {
            return eventSink.trigger("clear_active_tool");
          } else {
            return eventSink.trigger("active_tool", toolName);
          }
        });
        eventSink.on("" + toolName + ":deactivated", function() {
          _this.tool_active = false;
          _this.button_activated = false;
          return _this.$tool_button.removeClass('active');
        });
        eventSink.on("" + toolName + ":activated", function() {
          _this.tool_active = true;
          _this.$tool_button.addClass('active');
          return _this.button_activated = true;
        });
        return eventSink;
      };

      TwoPointEventGenerator.prototype.hide_button = function() {
        return this.$tool_button.hide();
      };

      TwoPointEventGenerator.prototype._start_drag = function() {
        this._activated_with_button = this.button_activated;
        this.eventSink.trigger("active_tool", this.toolName);
        if (!this.dragging) {
          this.dragging = true;
          if (!this.button_activated) {
            this.$tool_button.addClass('active');
          }
          if (this.options.cursor != null) {
            return this.plotview.canvas_wrapper.css('cursor', this.options.cursor);
          }
        }
      };

      TwoPointEventGenerator.prototype._stop_drag = function(e) {
        this.basepoint_set = false;
        if (this.dragging) {
          this.dragging = false;
          if (this._activated_with_button === false && this.options.auto_deactivate === true) {
            this.eventSink.trigger("clear_active_tool");
          }
          if (!this.button_activated) {
            this.$tool_button.removeClass('active');
          }
          if (this.options.cursor != null) {
            this.plotview.canvas_wrapper.css('cursor', '');
          }
          set_bokehXY(e);
          this.eventSink.trigger("" + this.options.eventBasename + ":DragEnd", e);
        }
        return this._activated_with_button = null;
      };

      return TwoPointEventGenerator;

    })();
    OnePointWheelEventGenerator = (function() {
      function OnePointWheelEventGenerator(options) {
        this.options = options;
        this.toolName = this.options.eventBasename;
        this.dragging = false;
        this.basepoint_set = false;
        this.button_activated = false;
        this.tool_active = false;
      }

      OnePointWheelEventGenerator.prototype.bind_bokeh_events = function(plotview, eventSink) {
        var no_scroll, restore_scroll, toolName,
          _this = this;
        toolName = this.toolName;
        this.plotview = plotview;
        this.eventSink = eventSink;
        this.plotview.canvas_wrapper.bind("mousewheel", function(e, delta, dX, dY) {
          if (_this.tool_active || (!_this.eventSink.active && e.shiftKey)) {
            set_bokehXY(e);
            e.delta = delta;
            eventSink.trigger("" + toolName + ":zoom", e);
            e.preventDefault();
            return e.stopPropagation();
          }
        });
        $(document).bind('keydown', function(e) {
          if (e.keyCode === 27) {
            return eventSink.trigger("clear_active_tool");
          }
        });
        this.plotview.$el.bind("mousein", function(e) {
          return eventSink.trigger("clear_active_tool");
        });
        this.plotview.$el.bind("mouseover", function(e) {
          return _this.mouseover_count += 1;
        });
        this.$tool_button = $("<button class='btn btn-small'> " + this.options.buttonText + " </button>");
        this.plotview.$el.find('.button_bar').append(this.$tool_button);
        this.$tool_button.click(function() {
          if (_this.button_activated) {
            return eventSink.trigger("clear_active_tool");
          } else {
            eventSink.trigger("active_tool", toolName);
            return _this.button_activated = true;
          }
        });
        no_scroll = function(el) {
          el.setAttribute("old_overflow", el.style.overflow);
          el.style.overflow = "hidden";
          if (el === document.body) {

          } else {
            return no_scroll(el.parentNode);
          }
        };
        restore_scroll = function(el) {
          el.style.overflow = el.getAttribute("old_overflow");
          if (el === document.body) {

          } else {
            return restore_scroll(el.parentNode);
          }
        };
        eventSink.on("" + toolName + ":deactivated", function() {
          _this.tool_active = false;
          _this.button_activated = false;
          _this.$tool_button.removeClass('active');
          return document.body.style.overflow = _this.old_overflow;
        });
        eventSink.on("" + toolName + ":activated", function() {
          _this.tool_active = true;
          return _this.$tool_button.addClass('active');
        });
        return eventSink;
      };

      OnePointWheelEventGenerator.prototype.hide_button = function() {
        return this.$tool_button.hide();
      };

      return OnePointWheelEventGenerator;

    })();
    ButtonEventGenerator = (function() {
      function ButtonEventGenerator(options) {
        this.options = options;
        this.toolName = this.options.eventBasename;
        this.button_activated = false;
        this.tool_active = false;
      }

      ButtonEventGenerator.prototype.bind_bokeh_events = function(plotview, eventSink) {
        var no_scroll, restore_scroll, toolName,
          _this = this;
        toolName = this.toolName;
        this.plotview = plotview;
        this.eventSink = eventSink;
        $(document).bind('keydown', function(e) {
          if (e.keyCode === 27) {
            return eventSink.trigger("clear_active_tool");
          }
        });
        this.plotview.$el.bind("mouseover", function(e) {
          return _this.mouseover_count += 1;
        });
        this.$tool_button = $("<button class='btn btn-small'> " + this.options.buttonText + " </button>");
        this.plotview.$el.find('.button_bar').append(this.$tool_button);
        this.$tool_button.click(function() {
          if (_this.button_activated) {
            return eventSink.trigger("clear_active_tool");
          } else {
            eventSink.trigger("active_tool", toolName);
            return _this.button_activated = true;
          }
        });
        no_scroll = function(el) {
          el.setAttribute("old_overflow", el.style.overflow);
          el.style.overflow = "hidden";
          if (el === document.body) {

          } else {
            return no_scroll(el.parentNode);
          }
        };
        restore_scroll = function(el) {
          el.style.overflow = el.getAttribute("old_overflow");
          if (el === document.body) {

          } else {
            return restore_scroll(el.parentNode);
          }
        };
        eventSink.on("" + toolName + ":deactivated", function() {
          _this.tool_active = false;
          _this.button_activated = false;
          _this.$tool_button.removeClass('active');
          return document.body.style.overflow = _this.old_overflow;
        });
        eventSink.on("" + toolName + ":activated", function() {
          _this.tool_active = true;
          return _this.$tool_button.addClass('active');
        });
        return eventSink;
      };

      ButtonEventGenerator.prototype.hide_button = function() {
        return this.$tool_button.hide();
      };

      return ButtonEventGenerator;

    })();
    return {
      "TwoPointEventGenerator": TwoPointEventGenerator,
      "OnePointWheelEventGenerator": OnePointWheelEventGenerator,
      "ButtonEventGenerator": ButtonEventGenerator
    };
  });

}).call(this);

/*
//@ sourceMappingURL=event_generators.js.map
*/