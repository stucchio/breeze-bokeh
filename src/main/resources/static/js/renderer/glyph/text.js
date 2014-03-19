(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "renderer/properties", "./glyph"], function(_, Properties, Glyph) {
    var Text, TextView, _ref, _ref1;
    TextView = (function(_super) {
      __extends(TextView, _super);

      function TextView() {
        _ref = TextView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      TextView.prototype._fields = ['x', 'y', 'angle', 'text:string'];

      TextView.prototype._properties = ['text'];

      TextView.prototype._map_data = function() {
        var _ref1;
        return _ref1 = this.plot_view.map_to_screen(this.x, this.glyph_props.x.units, this.y, this.glyph_props.y.units), this.sx = _ref1[0], this.sy = _ref1[1], _ref1;
      };

      TextView.prototype._render = function(ctx, indices, glyph_props) {
        var i, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = indices.length; _i < _len; _i++) {
          i = indices[_i];
          if (isNaN(this.sx[i] + this.sy[i] + this.angle[i])) {
            continue;
          }
          ctx.translate(this.sx[i], this.sy[i]);
          ctx.rotate(this.angle[i]);
          glyph_props.text_properties.set_vectorize(ctx, i);
          ctx.fillText(this.text[i], 0, 0);
          ctx.rotate(-this.angle[i]);
          _results.push(ctx.translate(-this.sx[i], -this.sy[i]));
        }
        return _results;
      };

      TextView.prototype.draw_legend = function(ctx, x1, x2, y1, y2) {
        var glyph_props, glyph_settings, reference_point, text_props;
        glyph_props = this.glyph_props;
        text_props = glyph_props.text_properties;
        ctx.save();
        reference_point = this.get_reference_point();
        if (reference_point != null) {
          glyph_settings = reference_point;
        } else {
          glyph_settings = glyph_props;
        }
        text_props.set(ctx, glyph_settings);
        ctx.font = text_props.font(12);
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillText("txt", x2, (y1 + y2) / 2);
        return ctx.restore();
      };

      return TextView;

    })(Glyph.View);
    Text = (function(_super) {
      __extends(Text, _super);

      function Text() {
        _ref1 = Text.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      Text.prototype.default_view = TextView;

      Text.prototype.type = 'Glyph';

      Text.prototype.display_defaults = function() {
        return _.extend(Text.__super__.display_defaults.call(this), {
          text_font: "helvetica",
          text_font_size: "12pt",
          text_font_style: "normal",
          text_color: "#444444",
          text_alpha: 1.0,
          text_align: "left",
          text_baseline: "bottom"
        });
      };

      return Text;

    })(Glyph.Model);
    return {
      "Model": Text,
      "View": TextView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=text.js.map
*/