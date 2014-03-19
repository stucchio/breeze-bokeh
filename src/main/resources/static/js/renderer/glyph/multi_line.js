(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "renderer/properties", "./glyph"], function(_, Properties, Glyph) {
    var MultiLine, MultiLineView, _ref, _ref1;
    MultiLineView = (function(_super) {
      __extends(MultiLineView, _super);

      function MultiLineView() {
        _ref = MultiLineView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      MultiLineView.prototype._fields = ['xs', 'ys'];

      MultiLineView.prototype._properties = ['line'];

      MultiLineView.prototype._map_data = function() {
        return null;
      };

      MultiLineView.prototype._render = function(ctx, indices, glyph_props) {
        var i, j, sx, sy, x, y, _i, _j, _len, _ref1, _ref2, _results;
        _results = [];
        for (_i = 0, _len = indices.length; _i < _len; _i++) {
          i = indices[_i];
          x = this.xs[i];
          y = this.ys[i];
          _ref1 = this.plot_view.map_to_screen(x, this.glyph_props.xs.units, y, this.glyph_props.ys.units), sx = _ref1[0], sy = _ref1[1];
          glyph_props.line_properties.set_vectorize(ctx, i);
          for (j = _j = 0, _ref2 = sx.length; 0 <= _ref2 ? _j < _ref2 : _j > _ref2; j = 0 <= _ref2 ? ++_j : --_j) {
            if (j === 0) {
              ctx.beginPath();
              ctx.moveTo(sx[j], sy[j]);
              continue;
            } else if (isNaN(sx[j]) || isNaN(sy[j])) {
              ctx.stroke();
              ctx.beginPath();
              continue;
            } else {
              ctx.lineTo(sx[j], sy[j]);
            }
          }
          _results.push(ctx.stroke());
        }
        return _results;
      };

      MultiLineView.prototype.draw_legend = function(ctx, x0, x1, y0, y1) {
        return this._generic_line_legend(ctx, x0, x1, y0, y1);
      };

      return MultiLineView;

    })(Glyph.View);
    MultiLine = (function(_super) {
      __extends(MultiLine, _super);

      function MultiLine() {
        _ref1 = MultiLine.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      MultiLine.prototype.default_view = MultiLineView;

      MultiLine.prototype.type = 'Glyph';

      MultiLine.prototype.display_defaults = function() {
        return _.extend(MultiLine.__super__.display_defaults.call(this), {
          line_color: 'red',
          line_width: 1,
          line_alpha: 1.0,
          line_join: 'miter',
          line_cap: 'butt',
          line_dash: [],
          line_dash_offset: 0
        });
      };

      return MultiLine;

    })(Glyph.Model);
    return {
      "Model": MultiLine,
      "View": MultiLineView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=multi_line.js.map
*/