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
      var column, computed_column, idx, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3;
    
      _print(_safe('<form class="form-inline tablecontrolform">\n<label>Transform </label>:  <select class="tablecontrolstate">\n    <option value="groupby" selected="selected">Group By</option>\n    <option value="filtering">Filtering</option>\n    <option value="computed">Computed Columns</option>\n  </select>\n  <br/>\n  '));
    
      if (this.tablecontrolstate === 'groupby') {
        _print(_safe('\n  <label>GroupBy </label>\n  <input type="text" class="pandasgroup" value="'));
        _print(this.group);
        _print(_safe('"/>\n  <label>Aggregation</label>\n  <select class="pandasagg">\n    <option value="sum">sum</option>\n    <option value="mean">mean</option>\n    <option value="std">std</option>\n    <option value="max">max</option>\n    <option value="min">min</option>\n  </select>\n  '));
      }
    
      _print(_safe('\n  '));
    
      if (this.tablecontrolstate === 'filtering') {
        _print(_safe('\n  <label class="checkbox" >\n    '));
        if (this.filterselected) {
          _print(_safe('\n    <input type="checkbox" class="filterselected" checked="checked"/>\n    '));
        } else {
          _print(_safe('\n    <input type="checkbox" class="filterselected"/>\n    '));
        }
        _print(_safe('\n    Filter Selection\n  </label>\n  <input type="button" class="clearselected btn btn-mini" value="Clear Selection"/>\n  <label>\n    Search\n  </label>\n  <input type="text" class="search input-large"/>\n  '));
      }
    
      _print(_safe('\n  \n  '));
    
      if (this.tablecontrolstate === 'computed') {
        _print(_safe('\n  <table class="table">\n    <thead>\n      <th>\n        Name\n      </th>\n      <th>\n        Value\n      </th>\n      <th>\n      </th>\n    </thead>\n    '));
        _ref = this.computed_columns;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          computed_column = _ref[_i];
          _print(_safe('\n    <tr>\n      <td>\n        '));
          _print(computed_column.name);
          _print(_safe('\n      </td>\n      <td>\n        '));
          _print(computed_column.code);
          _print(_safe('\n      </td>\n      <td>\n        <a class="column_del" \n           name="'));
          _print(computed_column.name);
          _print(_safe('" href="#">[delete]</a>\n      </td>\n    </tr>\n    '));
        }
        _print(_safe('\n    <tr>\n      <td>\n        <input type="text" class="computedname input-mini"/>\n      </td>\n      <td>\n        <input type="text" class="computedtxtbox input-medium"/>\n      </td>\n      <td>\n      </td>\n    </tr>\n  </table>\n  '));
      }
    
      _print(_safe('\n  \n</form>\n\n<table class="bokehdatatable table table-bordered"\n'));
    
      if (this.width) {
        _print(_safe('\n       style="max-height:'));
        _print(this.height);
        _print(_safe('px;max-width:'));
        _print(this.width);
        _print(_safe('px"\n'));
      } else {
        _print(_safe('\n       style="max-height:'));
        _print(this.height);
        _print(_safe('px"\n'));
      }
    
      _print(_safe('\n       >\n  <thead>\n    '));
    
      if (this.counts) {
        _print(_safe('\n    <th>counts</th>\n    '));
      }
    
      _print(_safe('\n    <th>index</th>\n    '));
    
      _ref1 = this.columns;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        column = _ref1[_j];
        _print(_safe('\n    '));
        if (!this.skip[column]) {
          _print(_safe('\n    <th><a class="pandascolumn">'));
          _print(column);
          _print(_safe('</a>\n      \n      '));
          if (this.sort_ascendings[column] === true) {
            _print(_safe('\n      <i class="icon-caret-up"></i>\n      '));
          } else if (this.sort_ascendings[column] === false) {
            _print(_safe('\n      <i class="icon-caret-down"></i>\n      '));
          }
          _print(_safe('\n      \n      '));
        }
        _print(_safe('\n    </th>\n    '));
      }
    
      _print(_safe('\n  </thead>\n  '));
    
      _ref2 = _.range(this.length);
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        idx = _ref2[_k];
        _print(_safe('\n  <tr class="pandasrow" rownum="'));
        _print(idx);
        _print(_safe('">\n    '));
        if (this.selected && this.selected[idx]) {
          _print(_safe('\n      <td style="background-color:'));
          _print(this.colors[idx]);
          _print(_safe('"> \n        '));
          _print(this.selected[idx]);
          _print(_safe('/'));
          _print(this.counts[idx]);
          _print(_safe('\n      </td>      \n    '));
        } else {
          _print(_safe('\n      <td> '));
          _print(this.counts[idx]);
          _print(_safe(' </td>\n    '));
        }
        _print(_safe('\n    <td> '));
        _print(this.index[idx]);
        _print(_safe(' </td>\n    '));
        _ref3 = this.columns;
        for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
          column = _ref3[_l];
          _print(_safe('\n      '));
          if (!this.skip[column]) {
            _print(_safe('    \n      <td> '));
            _print(this.data[column][idx]);
            _print(_safe(' </td>\n      '));
          }
          _print(_safe('\n    '));
        }
        _print(_safe('\n  </tr>\n  '));
      }
    
      _print(_safe('\n</table>\n<form>\n  <center>\n    <div class="btn-group pagination">\n      <button class="btn btn-mini">First</button>\n      <button class="btn btn-mini">Previous</button>\n      <button class="btn btn-mini">Next</button>\n      <button class="btn btn-mini">Last</button>  \n    </div>\n    <div class="paginatedisplay">\n      Show <input type="text" class="pandassize" value="'));
    
      _print(this.length);
    
      _print(_safe('"> records\n      From <input type="text" class="pandasoffset" value="'));
    
      _print(this.offset);
    
      _print(_safe('">\n      to '));
    
      _print(this.length + this.offset);
    
      _print(_safe(' - \n      Total : '));
    
      _print(this.totallength);
    
      _print(_safe('\n    </div>\n  </center>\n</form>\n'));
    
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
