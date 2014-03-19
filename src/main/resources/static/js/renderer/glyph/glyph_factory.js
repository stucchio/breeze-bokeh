(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require, exports, module) {
    var Glyph, HasParent, PlotWidget, annular_wedge, annulus, arc, asterisk, bezier, circle, circle_cross, circle_x, cross, diamond, diamond_cross, glyphs, image, image_rgba, image_uri, inverted_triangle, line, multi_line, oval, patch, patches, quad, quadratic, ray, rect, segment, square, square_cross, square_x, text, triangle, wedge, x, _, _ref;
    _ = require("underscore");
    HasParent = require("common/has_parent");
    PlotWidget = require("common/plot_widget");
    annular_wedge = require("./annular_wedge");
    annulus = require("./annulus");
    arc = require("./arc");
    asterisk = require("./asterisk");
    bezier = require("./bezier");
    circle = require("./circle");
    circle_x = require("./circle_x");
    circle_cross = require("./circle_cross");
    diamond = require("./diamond");
    diamond_cross = require("./diamond_cross");
    image = require("./image");
    image_rgba = require("./image_rgba");
    image_uri = require("./image_uri");
    inverted_triangle = require("./inverted_triangle");
    line = require("./line");
    multi_line = require("./multi_line");
    oval = require("./oval");
    patch = require("./patch");
    patches = require("./patches");
    cross = require("./cross");
    quad = require("./quad");
    quadratic = require("./quadratic");
    ray = require("./ray");
    rect = require("./rect");
    square = require("./square");
    square_x = require("./square_x");
    square_cross = require("./square_cross");
    segment = require("./segment");
    text = require("./text");
    triangle = require("./triangle");
    wedge = require("./wedge");
    x = require("./x");
    glyphs = {
      "annular_wedge": annular_wedge.Model,
      "annulus": annulus.Model,
      "arc": arc.Model,
      "asterisk": asterisk.Model,
      "bezier": bezier.Model,
      "circle": circle.Model,
      "circle_x": circle_x.Model,
      "circle_cross": circle_cross.Model,
      "diamond": diamond.Model,
      "diamond_cross": diamond_cross.Model,
      "image": image.Model,
      "image_rgba": image_rgba.Model,
      "image_uri": image_uri.Model,
      "inverted_triangle": inverted_triangle.Model,
      "line": line.Model,
      "multi_line": multi_line.Model,
      "oval": oval.Model,
      "patch": patch.Model,
      "patches": patches.Model,
      "cross": cross.Model,
      "quad": quad.Model,
      "quadratic": quadratic.Model,
      "ray": ray.Model,
      "square": square.Model,
      "square_x": square_x.Model,
      "square_cross": square_cross.Model,
      "rect": rect.Model,
      "segment": segment.Model,
      "text": text.Model,
      "triangle": triangle.Model,
      "wedge": wedge.Model,
      "x": x.Model
    };
    Glyph = (function(_super) {
      __extends(Glyph, _super);

      function Glyph() {
        _ref = Glyph.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      Glyph.prototype.model = function(attrs, options) {
        var model, type, _ref1;
        if (((_ref1 = attrs.glyphspec) != null ? _ref1.type : void 0) == null) {
          console.log("missing glyph type");
          return;
        }
        type = attrs.glyphspec.type;
        if (!(type in glyphs)) {
          console.log("unknown glyph type '" + type + "'");
          return;
        }
        model = glyphs[type];
        return new model(attrs, options);
      };

      return Glyph;

    })(Backbone.Collection);
    return {
      "Collection": new Glyph()
    };
  });

}).call(this);

/*
//@ sourceMappingURL=glyph_factory.js.map
*/