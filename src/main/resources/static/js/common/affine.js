(function() {
  define([], function() {
    var Affine;
    return Affine = (function() {
      function Affine(a, b, c, d, tx, ty) {
        this.a = a != null ? a : 1;
        this.b = b != null ? b : 0;
        this.c = c != null ? c : 0;
        this.d = d != null ? d : 1;
        this.tx = tx != null ? tx : 0;
        this.ty = ty != null ? ty : 0;
      }

      Affine.prototype.apply = function(x, y) {
        return [this.a * x + this.b * y + this.tx, this.c * x + this.d * y + this.ty];
      };

      Affine.prototype.v_apply = function(xs, ys) {
        var i, xres, yres, _i, _ref;
        xres = new Float32Array(xs.length);
        yres = new Float32Array(ys.length);
        for (i = _i = 0, _ref = xs.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          xres[i] = this.a * xs[i] + this.b * ys[i] + this.tx;
          yres[i] = this.c * xs[i] + this.d * ys[i] + this.ty;
        }
        return [xres, yres];
      };

      Affine.prototype.is_identity = function() {
        return this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1 && this.tx === 0 && this.ty === 0;
      };

      Affine.prototype.translate = function(tx, ty) {
        this.tx = this.a * tx + this.b * ty;
        return this.ty = this.c * tx + this.d * ty;
      };

      Affine.prototype.scale = function(sx, sy) {
        this.a *= sx;
        this.b *= sy;
        this.c *= sx;
        return this.d *= sy;
      };

      Affine.prototype.rotate = function(alpha) {
        var C, S, a, b, c, d;
        C = Math.cos(alpha);
        S = Math.sin(alpha);
        a = C * this.a + S * this.b;
        b = C * this.b - S * this.a;
        c = C * this.c + S * this.d;
        d = C * this.d - S * this.c;
        this.a = a;
        this.b = b;
        this.c = c;
        return this.d = d;
      };

      Affine.prototype.shear = function(kx, ky) {
        var a, b, c, d;
        a = this.a + kx * this.c;
        b = this.b + kx * this.d;
        c = this.c + ky * this.a;
        d = this.d + ky * this.b;
        this.a = a;
        this.b = b;
        this.c = c;
        return this.d = d;
      };

      Affine.prototype.reflect_x = function(x0) {
        this.tx = 2 * this.a * x0 + this.tx;
        this.ty = 2 * this.c * x0 + this.ty;
        this.a = -this.a;
        return this.c = -this.c;
      };

      Affine.prototype.reflect_y = function(y0) {
        this.tx = 2 * this.b * y0 + this.tx;
        this.ty = 2 * this.d * y0 + this.ty;
        this.b = -this.b;
        return this.d = -this.d;
      };

      Affine.prototype.reflect_xy = function(x0, y0) {
        this.tx = 2 * (this.a * x0 + this.b * y0) + this.tx;
        this.ty = 2 * (this.c * x0 + this.d * y0) + this.ty;
        this.a = -this.a;
        this.b = -this.b;
        this.c = -this.c;
        return this.d = -this.d;
      };

      Affine.prototype.compose_right = function(m) {
        var a, b, c, d, tx, ty;
        a = this.a * m.a + this.b * m.c;
        b = this.a * m.b + this.b * m.d;
        c = this.c * m.a + this.d * m.c;
        d = this.c * m.b + this.d * m.d;
        tx = this.a * m.tx + this.b * m.ty + this.tx;
        ty = this.c * m.tx + this.d * m.ty + this.ty;
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        return this.ty = ty;
      };

      Affine.prototype.compose_left = function(m) {
        var a, b, c, d, tx, ty;
        a = m.a * this.a + m.b * this.c;
        b = m.a * this.b + m.b * this.d;
        c = m.c * this.a + m.d * this.c;
        d = m.c * this.b + m.d * this.d;
        tx = m.a * this.tx + m.b * this.ty + m.tx;
        ty = m.c * this.tx + m.d * this.ty + m.ty;
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        return this.ty = ty;
      };

      return Affine;

    })();
  });

}).call(this);

/*
//@ sourceMappingURL=affine.js.map
*/