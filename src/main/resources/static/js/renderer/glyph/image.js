(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "renderer/properties", "mapper/color/linear_color_mapper", "palettes/palettes", "./glyph"], function(_, Properties, LinearColorMapper, Palettes, Glyph) {
    var ImageGlyph, ImageView, all_palettes, _ref, _ref1;
    all_palettes = Palettes.all_palettes;
    ImageView = (function(_super) {
      __extends(ImageView, _super);

      function ImageView() {
        _ref = ImageView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      ImageView.prototype._properties = [];

      ImageView.prototype.initialize = function(options) {
        var spec;
        spec = this.mget('glyphspec');
        if (spec.rows != null) {
          this._fields = ['image:array', 'rows', 'cols', 'x', 'y', 'dw', 'dh', 'palette:string'];
        } else {
          this._fields = ['image:array', 'x', 'y', 'dw', 'dh', 'palette:string'];
        }
        return ImageView.__super__.initialize.call(this, options);
      };

      ImageView.prototype._set_data = function(data) {
        var buf, buf8, canvas, cmap, ctx, i, image_data, img, _i, _j, _ref1, _ref2, _results;
        this.data = data;
        for (i = _i = 0, _ref1 = this.y.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
          this.y[i] += this.dh[i];
        }
        if ((this.image_data == null) || this.image_data.length !== this.image.length) {
          this.image_data = new Array(this.image.length);
        }
        if ((this.width == null) || this.width.length !== this.image.length) {
          this.width = new Array(this.image.length);
        }
        if ((this.height == null) || this.height.length !== this.image.length) {
          this.height = new Array(this.image.length);
        }
        _results = [];
        for (i = _j = 0, _ref2 = this.image.length; 0 <= _ref2 ? _j < _ref2 : _j > _ref2; i = 0 <= _ref2 ? ++_j : --_j) {
          if (this.rows != null) {
            this.height[i] = this.rows[i];
            this.width[i] = this.cols[i];
          } else {
            this.height[i] = this.image[i].length;
            this.width[i] = this.image[i][0].length;
          }
          canvas = document.createElement('canvas');
          canvas.width = this.width[i];
          canvas.height = this.height[i];
          ctx = canvas.getContext('2d');
          image_data = ctx.getImageData(0, 0, this.width[i], this.height[i]);
          cmap = new LinearColorMapper({}, {
            palette: all_palettes[this.palette[i]]
          });
          if (this.rows != null) {
            img = this.image[i];
          } else {
            img = _.flatten(this.image[i]);
          }
          buf = cmap.v_map_screen(img);
          buf8 = new Uint8ClampedArray(buf);
          image_data.data.set(buf8);
          ctx.putImageData(image_data, 0, 0);
          _results.push(this.image_data[i] = canvas);
        }
        return _results;
      };

      ImageView.prototype._map_data = function() {
        var _ref1;
        _ref1 = this.plot_view.map_to_screen(this.x, this.glyph_props.x.units, this.y, this.glyph_props.y.units), this.sx = _ref1[0], this.sy = _ref1[1];
        this.sw = this.distance_vector('x', 'dw', 'edge');
        return this.sh = this.distance_vector('y', 'dh', 'edge');
      };

      ImageView.prototype._render = function(ctx, indices, glyph_props) {
        var i, old_smoothing, y_offset, _i, _len;
        old_smoothing = ctx.getImageSmoothingEnabled();
        ctx.setImageSmoothingEnabled(false);
        for (_i = 0, _len = indices.length; _i < _len; _i++) {
          i = indices[_i];
          if (isNaN(this.sx[i] + this.sy[i] + this.sw[i] + this.sh[i])) {
            continue;
          }
          y_offset = this.sy[i] + this.sh[i] / 2;
          ctx.translate(0, y_offset);
          ctx.scale(1, -1);
          ctx.translate(0, -y_offset);
          ctx.drawImage(this.image_data[i], this.sx[i] | 0, this.sy[i] | 0, this.sw[i], this.sh[i]);
          ctx.translate(0, y_offset);
          ctx.scale(1, -1);
          ctx.translate(0, -y_offset);
        }
        return ctx.setImageSmoothingEnabled(old_smoothing);
      };

      return ImageView;

    })(Glyph.View);
    ImageGlyph = (function(_super) {
      __extends(ImageGlyph, _super);

      function ImageGlyph() {
        _ref1 = ImageGlyph.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      ImageGlyph.prototype.default_view = ImageView;

      ImageGlyph.prototype.type = 'Glyph';

      ImageGlyph.prototype.display_defaults = function() {
        return _.extend(ImageGlyph.__super__.display_defaults.call(this), {
          level: 'underlay'
        });
      };

      return ImageGlyph;

    })(Glyph.Model);
    return {
      "Model": ImageGlyph,
      "View": ImageView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=image.js.map
*/