define(function(){
  var template = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe('<div class="accordion-heading bokehdocheading">\n  <a class="accordion-toggle bokehdoclabel" data-toggle="collapse" \n     href="#'));
    
      _print(this.bodyid);
    
      _print(_safe('">\n    Document: '));
    
      _print(this.model.get('title'));
    
      _print(_safe('\n    <i class="bokehdelete icon-trash"></i>\n  </a>\n</div>\n<div id="'));
    
      _print(this.bodyid);
    
      _print(_safe('" class="accordion-body collapse">\n  <div class="accordion-inner plots">\n  </div>\n</div>\n\n\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};
  return template;
});
