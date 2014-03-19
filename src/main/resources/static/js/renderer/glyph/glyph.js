(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(["underscore", "common/has_parent", "common/plot_widget", "renderer/properties"], function(_, HasParent, PlotWidget, Properties) {
    var Glyph, GlyphView, _ref, _ref1;
    GlyphView = (function(_super) {
      __extends(GlyphView, _super);

      function GlyphView() {
        _ref = GlyphView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      GlyphView.prototype.initialize = function(options) {
        var spec;
        GlyphView.__super__.initialize.call(this, options);
        this.need_set_data = true;
        this.glyph_props = this.init_glyph(this.mget('glyphspec'));
        this.have_selection_props = false;
        if (this.mget('selection_glyphspec')) {
          spec = _.extend({}, this.mget('glyphspec'), this.mget('selection_glyphspec'));
          this.selection_glyphprops = this.init_glyph(spec);
          this.have_selection_props = true;
        } else {
          this.selection_glyphprops = this.glyph_props;
        }
        if (this.mget('nonselection_glyphspec')) {
          spec = _.extend({}, this.mget('glyphspec'), this.mget('nonselection_glyphspec'));
          this.nonselection_glyphprops = this.init_glyph(spec);
          return this.have_selection_props = true;
        } else {
          return this.nonselection_glyphprops = this.glyph_props;
        }
      };

      GlyphView.prototype.init_glyph = function(glyphspec) {
        var glyph_props, props;
        props = {};
        if (__indexOf.call(this._properties, 'line') >= 0) {
          props['line_properties'] = new Properties.line_properties(this, glyphspec);
        }
        if (__indexOf.call(this._properties, 'fill') >= 0) {
          props['fill_properties'] = new Properties.fill_properties(this, glyphspec);
        }
        if (__indexOf.call(this._properties, 'text') >= 0) {
          props['text_properties'] = new Properties.text_properties(this, glyphspec);
        }
        glyph_props = new Properties.glyph_properties(this, glyphspec, this._fields, props);
        return glyph_props;
      };

      GlyphView.prototype.set_data = function(request_render) {
        var dir, field, i, junk, len, source, values, x, _i, _j, _k, _len, _ref1, _ref2, _ref3, _results;
        if (request_render == null) {
          request_render = true;
        }
        source = this.mget_obj('data_source');
        _ref1 = this._fields;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          field = _ref1[_i];
          if (field.indexOf(":") > -1) {
            _ref2 = field.split(":"), field = _ref2[0], junk = _ref2[1];
          }
          this[field] = this.glyph_props.source_v_select(field, source);
          if (field === "direction") {
            values = new Uint8Array(this.direction.length);
            for (i = _j = 0, _ref3 = this.direction.length; 0 <= _ref3 ? _j < _ref3 : _j > _ref3; i = 0 <= _ref3 ? ++_j : --_j) {
              dir = this.direction[i];
              if (dir === 'clock') {
                values[i] = false;
              } else if (dir === 'anticlock') {
                values[i] = true;
              } else {
                values = NaN;
              }
            }
            this.direction = values;
          }
          if (field.indexOf("angle") > -1) {
            this[field] = (function() {
              var _k, _len1, _ref4, _results;
              _ref4 = this[field];
              _results = [];
              for (_k = 0, _len1 = _ref4.length; _k < _len1; _k++) {
                x = _ref4[_k];
                _results.push(-x);
              }
              return _results;
            }).call(this);
          }
        }
        if (this._set_data != null) {
          this._set_data();
        }
        len = this[field].length;
        this.all_indices = (function() {
          _results = [];
          for (var _k = 0; 0 <= len ? _k < len : _k > len; 0 <= len ? _k++ : _k--){ _results.push(_k); }
          return _results;
        }).apply(this);
        this.have_new_data = true;
        if (request_render) {
          return this.request_render();
        }
      };

      GlyphView.prototype.render = function(have_new_mapper_state) {
        var ctx, do_render, i, idx, indices, nonselected, selected, selected_mask, _i, _j, _len, _len1,
          _this = this;
        if (have_new_mapper_state == null) {
          have_new_mapper_state = true;
        }
        if (this.need_set_data) {
          this.set_data(false);
          this.need_set_data = false;
        }
        this._map_data();
        if ((this._mask_data != null) && (this.plot_view.x_range.type !== "FactorRange") && (this.plot_view.y_range.type !== "FactorRange")) {
          indices = this._mask_data();
        } else {
          indices = this.all_indices;
        }
        ctx = this.plot_view.ctx;
        ctx.save();
        do_render = function(ctx, indices, glyph_props) {
          var source;
          source = _this.mget_obj('data_source');
          if (_this.have_new_data) {
            if ((glyph_props.fill_properties != null) && glyph_props.fill_properties.do_fill) {
              glyph_props.fill_properties.set_prop_cache(source);
            }
            if ((glyph_props.line_properties != null) && glyph_props.line_properties.do_stroke) {
              glyph_props.line_properties.set_prop_cache(source);
            }
            if (glyph_props.text_properties != null) {
              glyph_props.text_properties.set_prop_cache(source);
            }
          }
          return _this._render(ctx, indices, glyph_props);
        };
        selected = this.mget_obj('data_source').get('selected');
        if (selected && selected.length && this.have_selection_props) {
          selected_mask = (function() {
            var _i, _len, _ref1, _results;
            _ref1 = this.all_indices;
            _results = [];
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              i = _ref1[_i];
              _results.push(false);
            }
            return _results;
          }).call(this);
          for (_i = 0, _len = selected.length; _i < _len; _i++) {
            idx = selected[_i];
            selected_mask[idx] = true;
          }
          selected = new Array();
          nonselected = new Array();
          for (_j = 0, _len1 = indices.length; _j < _len1; _j++) {
            i = indices[_j];
            if (selected_mask[i]) {
              selected.push(i);
            } else {
              nonselected.push(i);
            }
          }
          do_render(ctx, selected, this.selection_glyphprops);
          do_render(ctx, nonselected, this.nonselection_glyphprops);
        } else {
          do_render(ctx, indices, this.glyph_props);
        }
        this.have_new_data = false;
        return ctx.restore();
      };

      GlyphView.prototype.xrange = function() {
        return this.plot_view.x_range;
      };

      GlyphView.prototype.yrange = function() {
        return this.plot_view.y_range;
      };

      GlyphView.prototype.bind_bokeh_events = function() {
        this.listenTo(this.model, 'change', this.request_render);
        return this.listenTo(this.mget_obj('data_source'), 'change', this.set_data);
      };

      GlyphView.prototype.distance = function(data, pt, span, position) {
        var d, halfspan, i, mapper, pt0, pt1, pt_units, ptc, span_units, spt0, spt1;
        pt_units = this.glyph_props[pt].units;
        span_units = this.glyph_props[span].units;
        if (pt === 'x') {
          mapper = this.plot_view.xmapper;
        } else if (pt === 'y') {
          mapper = this.plot_view.ymapper;
        }
        span = this.glyph_props.v_select(span, data);
        if (span_units === 'screen') {
          return span;
        }
        if (position === 'center') {
          halfspan = (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = span.length; _i < _len; _i++) {
              d = span[_i];
              _results.push(d / 2);
            }
            return _results;
          })();
          ptc = this.glyph_props.v_select(pt, data);
          if (pt_units === 'screen') {
            ptc = mapper.v_map_from_target(ptc);
          }
          if (typeof ptc === 'string') {
            ptc = mapper.v_map_to_target(ptc);
          }
          pt0 = (function() {
            var _i, _ref1, _results;
            _results = [];
            for (i = _i = 0, _ref1 = ptc.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
              _results.push(ptc[i] - halfspan[i]);
            }
            return _results;
          })();
          pt1 = (function() {
            var _i, _ref1, _results;
            _results = [];
            for (i = _i = 0, _ref1 = ptc.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
              _results.push(ptc[i] + halfspan[i]);
            }
            return _results;
          })();
        } else {
          pt0 = this.glyph_props.v_select(pt, data);
          if (pt_units === 'screen') {
            pt0 = mapper.v_map_from_target(pt0);
          }
          pt1 = (function() {
            var _i, _ref1, _results;
            _results = [];
            for (i = _i = 0, _ref1 = pt0.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
              _results.push(pt0[i] + span[i]);
            }
            return _results;
          })();
        }
        spt0 = mapper.v_map_to_target(pt0);
        spt1 = mapper.v_map_to_target(pt1);
        return (function() {
          var _i, _ref1, _results;
          _results = [];
          for (i = _i = 0, _ref1 = spt0.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
            _results.push(Math.abs(spt1[i] - spt0[i]));
          }
          return _results;
        })();
      };

      GlyphView.prototype.distance_vector = function(pt, span_prop_name, position) {
        " returns an array ";
        var d, halfspan, i, local_select, mapper, pt0, pt1, pt_units, ptc, source, span, span_units, spt0, spt1,
          _this = this;
        pt_units = this.glyph_props[pt].units;
        span_units = this.glyph_props[span_prop_name].units;
        if (pt === 'x') {
          mapper = this.plot_view.xmapper;
        } else if (pt === 'y') {
          mapper = this.plot_view.ymapper;
        }
        source = this.mget_obj('data_source');
        local_select = function(prop_name) {
          return _this.glyph_props.source_v_select(prop_name, source);
        };
        span = local_select(span_prop_name);
        if (span_units === 'screen') {
          return span;
        }
        if (position === 'center') {
          halfspan = (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = span.length; _i < _len; _i++) {
              d = span[_i];
              _results.push(d / 2);
            }
            return _results;
          })();
          ptc = local_select(pt);
          if (pt_units === 'screen') {
            ptc = mapper.v_map_from_target(ptc);
          }
          if (typeof ptc[0] === 'string') {
            ptc = mapper.v_map_to_target(ptc);
          }
          pt0 = (function() {
            var _i, _ref1, _results;
            _results = [];
            for (i = _i = 0, _ref1 = ptc.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
              _results.push(ptc[i] - halfspan[i]);
            }
            return _results;
          })();
          pt1 = (function() {
            var _i, _ref1, _results;
            _results = [];
            for (i = _i = 0, _ref1 = ptc.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
              _results.push(ptc[i] + halfspan[i]);
            }
            return _results;
          })();
        } else {
          pt0 = local_select(pt);
          if (pt_units === 'screen') {
            pt0 = mapper.v_map_from_target(pt0);
          }
          pt1 = (function() {
            var _i, _ref1, _results;
            _results = [];
            for (i = _i = 0, _ref1 = pt0.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
              _results.push(pt0[i] + span[i]);
            }
            return _results;
          })();
        }
        spt0 = mapper.v_map_to_target(pt0);
        spt1 = mapper.v_map_to_target(pt1);
        return (function() {
          var _i, _ref1, _results;
          _results = [];
          for (i = _i = 0, _ref1 = spt0.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
            _results.push(Math.abs(spt1[i] - spt0[i]));
          }
          return _results;
        })();
      };

      GlyphView.prototype.get_reference_point = function() {
        var reference_point;
        reference_point = this.mget('reference_point');
        if (_.isNumber(reference_point)) {
          return this.data[reference_point];
        } else {
          return reference_point;
        }
      };

      GlyphView.prototype.draw_legend = function(ctx, x0, x1, y0, y1) {
        return null;
      };

      GlyphView.prototype._generic_line_legend = function(ctx, x0, x1, y0, y1) {
        var line_props, reference_point, _ref1;
        reference_point = (_ref1 = this.get_reference_point()) != null ? _ref1 : 0;
        line_props = this.glyph_props.line_properties;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x0, (y0 + y1) / 2);
        ctx.lineTo(x1, (y0 + y1) / 2);
        if (line_props.do_stroke) {
          line_props.set_vectorize(ctx, reference_point);
          ctx.stroke();
        }
        return ctx.restore();
      };

      GlyphView.prototype._generic_area_legend = function(ctx, x0, x1, y0, y1) {
        var dh, dw, h, indices, reference_point, sx0, sx1, sy0, sy1, w, _ref1;
        reference_point = (_ref1 = this.get_reference_point()) != null ? _ref1 : 0;
        indices = [reference_point];
        w = Math.abs(x1 - x0);
        dw = w * 0.1;
        h = Math.abs(y1 - y0);
        dh = h * 0.1;
        sx0 = x0 + dw;
        sx1 = x1 - dw;
        sy0 = y0 + dh;
        sy1 = y1 - dh;
        if (this.glyph_props.fill_properties.do_fill) {
          this.glyph_props.fill_properties.set_vectorize(ctx, reference_point);
          ctx.fillRect(sx0, sy0, sx1 - sx0, sy1 - sy0);
        }
        if (this.glyph_props.line_properties.do_stroke) {
          ctx.beginPath();
          ctx.rect(sx0, sy0, sx1 - sx0, sy1 - sy0);
          this.glyph_props.line_properties.set_vectorize(ctx, reference_point);
          return ctx.stroke();
        }
      };

      GlyphView.prototype.hit_test = function(geometry) {
        if (geometry.type === "point") {
          if (this._hit_point != null) {
            return this._hit_point(geometry);
          }
          if (this._point_hit_warned == null) {
            console.log("WARNING: 'point' selection not available on renderer");
            this._point_hit_warned = true;
          }
          return null;
        } else if (geometry.type === "rect") {
          if (this._hit_rect != null) {
            return this._hit_rect(geometry);
          }
          if (this._rect_hit_warned == null) {
            console.log("WARNING: 'rect' selection not avaliable on renderer");
            this._rect_hit_warned = true;
          }
          return null;
        } else {
          console.log("unrecognized selection geometry type '" + geometry.type + "'");
          return null;
        }
      };

      return GlyphView;

    })(PlotWidget);
    Glyph = (function(_super) {
      __extends(Glyph, _super);

      function Glyph() {
        _ref1 = Glyph.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      Glyph.prototype.defaults = function() {
        return {
          data_source: null
        };
      };

      Glyph.prototype.display_defaults = function() {
        return {
          level: 'glyph',
          radius_units: 'data',
          length_units: 'screen',
          angle_units: 'deg',
          start_angle_units: 'deg',
          end_angle_units: 'deg'
        };
      };

      return Glyph;

    })(HasParent);
    return {
      "Model": Glyph,
      "View": GlyphView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=glyph.js.map
*/