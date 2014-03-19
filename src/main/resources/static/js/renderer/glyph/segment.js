(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "renderer/properties", "./glyph"], function(_, Properties, Glyph) {
    var Segment, SegmentView, _ref, _ref1;
    SegmentView = (function(_super) {
      __extends(SegmentView, _super);

      function SegmentView() {
        _ref = SegmentView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      SegmentView.prototype._fields = ['x0', 'y0', 'x1', 'y1'];

      SegmentView.prototype._properties = ['line'];

      SegmentView.prototype._map_data = function() {
        var _ref1, _ref2;
        _ref1 = this.plot_view.map_to_screen(this.x0, this.glyph_props.x0.units, this.y0, this.glyph_props.y0.units), this.sx0 = _ref1[0], this.sy0 = _ref1[1];
        return _ref2 = this.plot_view.map_to_screen(this.x1, this.glyph_props.x1.units, this.y1, this.glyph_props.y1.units), this.sx1 = _ref2[0], this.sy1 = _ref2[1], _ref2;
      };

      SegmentView.prototype._render = function(ctx, indices, glyph_props) {
        var i, _i, _len, _results;
        if (glyph_props.line_properties.do_stroke) {
          _results = [];
          for (_i = 0, _len = indices.length; _i < _len; _i++) {
            i = indices[_i];
            if (isNaN(this.sx0[i] + this.sy0[i] + this.sx1[i] + this.sy1[i])) {
              continue;
            }
            ctx.beginPath();
            ctx.moveTo(this.sx0[i], this.sy0[i]);
            ctx.lineTo(this.sx1[i], this.sy1[i]);
            glyph_props.line_properties.set_vectorize(ctx, i);
            _results.push(ctx.stroke());
          }
          return _results;
        }
      };

      SegmentView.prototype.draw_legend = function(ctx, x0, x1, y0, y1) {
        return this._generic_line_legend(ctx, x0, x1, y0, y1);
      };

      return SegmentView;

    })(Glyph.View);
    Segment = (function(_super) {
      __extends(Segment, _super);

      function Segment() {
        _ref1 = Segment.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      Segment.prototype.default_view = SegmentView;

      Segment.prototype.type = 'Glyph';

      Segment.prototype.display_defaults = function() {
        return _.extend(Segment.__super__.display_defaults.call(this), {
          line_color: 'red',
          line_width: 1,
          line_alpha: 1.0,
          line_join: 'miter',
          line_cap: 'butt',
          line_dash: [],
          line_dash_offset: 0
        });
      };

      return Segment;

    })(Glyph.Model);
    return {
      "Model": Segment,
      "View": SegmentView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=segment.js.map
*/