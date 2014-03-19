(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "renderer/properties", "./glyph"], function(_, Properties, Glyph) {
    var ImageURIGlyph, ImageURIView, glyph_properties, _ref, _ref1;
    glyph_properties = Properties.glyph_properties;
    ImageURIView = (function(_super) {
      __extends(ImageURIView, _super);

      function ImageURIView() {
        _ref = ImageURIView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      ImageURIView.prototype._fields = ['url:string', 'x', 'y', 'angle'];

      ImageURIView.prototype._properties = [];

      ImageURIView.prototype._set_data = function(data) {
        var img;
        this.data = data;
        this.image = (function() {
          var _i, _len, _ref1, _results;
          _ref1 = this.url;
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            img = _ref1[_i];
            _results.push(null);
          }
          return _results;
        }).call(this);
        this.need_load = (function() {
          var _i, _len, _ref1, _results;
          _ref1 = this.url;
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            img = _ref1[_i];
            _results.push(true);
          }
          return _results;
        }).call(this);
        return this.loaded = (function() {
          var _i, _len, _ref1, _results;
          _ref1 = this.url;
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            img = _ref1[_i];
            _results.push(false);
          }
          return _results;
        }).call(this);
      };

      ImageURIView.prototype._map_data = function() {
        var _ref1;
        return _ref1 = this.plot_view.map_to_screen(this.x, this.glyph_props.x.units, this.y, this.glyph_props.y.units), this.sx = _ref1[0], this.sy = _ref1[1], _ref1;
      };

      ImageURIView.prototype._render = function(ctx, indices, glyph_props) {
        var i, img, _i, _len, _results,
          _this = this;
        _results = [];
        for (_i = 0, _len = indices.length; _i < _len; _i++) {
          i = indices[_i];
          if (isNaN(this.sx[i] + this.sy[i] + this.angle[i])) {
            continue;
          }
          if (this.need_load[i]) {
            img = new Image();
            img.onload = (function(img, i) {
              return function() {
                _this.loaded[i] = true;
                _this.image[i] = img;
                ctx.save();
                ctx.beginPath();
                ctx.rect(vs.get('border_left') + 1, vs.get('border_top') + 1, vs.get('inner_width') - 2, vs.get('inner_height') - 2);
                ctx.clip();
                _this._render_image(ctx, vs, i, img);
                return ctx.restore();
              };
            })(img, i);
            img.src = this.url[i];
            _results.push(this.need_load[i] = false);
          } else if (this.loaded[i]) {
            _results.push(this._render_image(ctx, vs, i, this.image[i]));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      ImageURIView.prototype._render_image = function(ctx, vs, i, img) {
        if (this.angle[i]) {
          ctx.translate(this.sx[i], this.sy[i]);
          ctx.rotate(this.angle[i]);
          ctx.drawImage(img, 0, 0);
          ctx.rotate(-this.angle[i]);
          return ctx.translate(-this.sx[i], -this.sy[i]);
        } else {
          return ctx.drawImage(img, this.sx[i], this.sy[i]);
        }
      };

      return ImageURIView;

    })(Glyph.View);
    ImageURIGlyph = (function(_super) {
      __extends(ImageURIGlyph, _super);

      function ImageURIGlyph() {
        _ref1 = ImageURIGlyph.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      ImageURIGlyph.prototype.default_view = ImageURIView;

      ImageURIGlyph.prototype.type = 'Glyph';

      ImageURIGlyph.prototype.display_defaults = function() {
        return _.extend(ImageURIGlyph.__super__.display_defaults.call(this), {
          level: 'underlay'
        });
      };

      return ImageURIGlyph;

    })(Glyph.Model);
    return {
      "Model": ImageURIGlyph,
      "View": ImageURIView
    };
  });

}).call(this);

/*
//@ sourceMappingURL=image_uri.js.map
*/