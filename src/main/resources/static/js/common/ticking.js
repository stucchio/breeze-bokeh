(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["underscore", "timezone", "sprintf"], function(_, tz, sprintf) {
    var AbstractScale, AdaptiveScale, BasicScale, BasicTickFormatter, CompositeScale, DEFAULT_DESIRED_N_TICKS, DatetimeFormatter, DatetimeScale, DaysScale, MonthsScale, ONE_DAY, ONE_HOUR, ONE_MILLI, ONE_MINUTE, ONE_MONTH, ONE_SECOND, ONE_YEAR, SingleIntervalScale, arange, argmin, clamp, copy_date, date_range_by_month, date_range_by_year, indices, last_month_no_later_than, last_year_no_later_than, log, repr, _array, _four_digit_year, _ms_dot_us, _strftime, _two_digit_year, _us;
    arange = function(start, end, step) {
      var i, ret_arr;
      if (end == null) {
        end = false;
      }
      if (step == null) {
        step = false;
      }
      if (!end) {
        end = start;
        start = 0;
      }
      if (start > end) {
        if (step === false) {
          step = -1;
        } else if (step > 0) {
          "the loop will never terminate";
          1 / 0;
        }
      } else if (step < 0) {
        "the loop will never terminate";
        1 / 0;
      }
      if (!step) {
        step = 1;
      }
      ret_arr = [];
      i = start;
      if (start < end) {
        while (i < end) {
          ret_arr.push(i);
          i += step;
        }
      } else {
        while (i > end) {
          ret_arr.push(i);
          i += step;
        }
      }
      return ret_arr;
    };
    repr = function(obj) {
      var elem, elems_str, key, obj_as_string, props_str;
      if (obj === null) {
        return "null";
      } else if (obj.constructor === Array) {
        elems_str = ((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = obj.length; _i < _len; _i++) {
            elem = obj[_i];
            _results.push(repr(elem));
          }
          return _results;
        })()).join(", ");
        return "[" + elems_str + "]";
      } else if (obj.constructor === Object) {
        props_str = ((function() {
          var _results;
          _results = [];
          for (key in obj) {
            _results.push("" + key + ": " + (repr(obj[key])));
          }
          return _results;
        })()).join(", ");
        return "{" + props_str + "}";
      } else if (obj.constructor === String) {
        return "\"" + obj + "\"";
      } else if (obj.constructor === Function) {
        return "<Function: " + obj.name + ">";
      } else {
        obj_as_string = obj.toString();
        if (obj_as_string === "[object Object]") {
          return "<" + obj.constructor.name + ">";
        } else {
          return obj_as_string;
        }
      }
    };
    indices = function(arr) {
      return _.range(arr.length);
    };
    argmin = function(arr) {
      var ret;
      ret = _.min(indices(arr), (function(i) {
        return arr[i];
      }));
      return ret;
    };
    clamp = function(x, min_val, max_val) {
      return Math.max(min_val, Math.min(max_val, x));
    };
    log = function(x, base) {
      if (base == null) {
        base = Math.E;
      }
      return Math.log(x) / Math.log(base);
    };
    copy_date = function(date) {
      return new Date(date.getTime());
    };
    last_month_no_later_than = function(date) {
      date = copy_date(date);
      date.setUTCDate(1);
      date.setUTCHours(0);
      date.setUTCMinutes(0);
      date.setUTCSeconds(0);
      date.setUTCMilliseconds(0);
      return date;
    };
    last_year_no_later_than = function(date) {
      date = last_month_no_later_than(date);
      date.setUTCMonth(0);
      return date;
    };
    date_range_by_year = function(start_time, end_time) {
      var date, dates, end_date, start_date;
      start_date = last_year_no_later_than(new Date(start_time));
      end_date = last_year_no_later_than(new Date(end_time));
      end_date.setUTCFullYear(end_date.getUTCFullYear() + 1);
      dates = [];
      date = start_date;
      while (true) {
        dates.push(copy_date(date));
        date.setUTCFullYear(date.getUTCFullYear() + 1);
        if (date > end_date) {
          break;
        }
      }
      return dates;
    };
    date_range_by_month = function(start_time, end_time) {
      var date, dates, end_date, prev_end_date, start_date;
      start_date = last_month_no_later_than(new Date(start_time));
      end_date = last_month_no_later_than(new Date(end_time));
      prev_end_date = copy_date(end_date);
      end_date.setUTCMonth(end_date.getUTCMonth() + 1);
      dates = [];
      date = start_date;
      while (true) {
        dates.push(copy_date(date));
        date.setUTCMonth(date.getUTCMonth() + 1);
        if (date > end_date) {
          break;
        }
      }
      return dates;
    };
    DEFAULT_DESIRED_N_TICKS = 6;
    AbstractScale = (function() {
      function AbstractScale(toString_properties) {
        this.toString_properties = toString_properties != null ? toString_properties : [];
      }

      AbstractScale.prototype.get_ticks = function(data_low, data_high, range, _arg) {
        var desired_n_ticks;
        desired_n_ticks = _arg.desired_n_ticks;
        if (desired_n_ticks == null) {
          desired_n_ticks = DEFAULT_DESIRED_N_TICKS;
        }
        return this.get_ticks_no_defaults(data_low, data_high, desired_n_ticks);
      };

      AbstractScale.prototype.get_ticks_no_defaults = function(data_low, data_high, desired_n_ticks) {
        var end_factor, factor, factors, interval, start_factor, ticks;
        interval = this.get_interval(data_low, data_high, desired_n_ticks);
        start_factor = Math.floor(data_low / interval);
        end_factor = Math.ceil(data_high / interval);
        factors = arange(start_factor, end_factor + 1);
        ticks = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = factors.length; _i < _len; _i++) {
            factor = factors[_i];
            _results.push(factor * interval);
          }
          return _results;
        })();
        return ticks;
      };

      AbstractScale.prototype.get_interval = void 0;

      AbstractScale.prototype.get_min_interval = function() {
        return this.min_interval;
      };

      AbstractScale.prototype.get_max_interval = function() {
        return this.max_interval;
      };

      AbstractScale.prototype.min_interval = void 0;

      AbstractScale.prototype.max_interval = void 0;

      AbstractScale.prototype.toString = function() {
        var class_name, key, params_str, props;
        class_name = this.constructor.name;
        props = this.toString_properties;
        params_str = ((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = props.length; _i < _len; _i++) {
            key = props[_i];
            _results.push("" + key + "=" + (repr(this[key])));
          }
          return _results;
        }).call(this)).join(", ");
        return "" + class_name + "(" + params_str + ")";
      };

      AbstractScale.prototype.get_ideal_interval = function(data_low, data_high, desired_n_ticks) {
        var data_range;
        data_range = data_high - data_low;
        return data_range / desired_n_ticks;
      };

      return AbstractScale;

    })();
    SingleIntervalScale = (function(_super) {
      __extends(SingleIntervalScale, _super);

      function SingleIntervalScale(interval) {
        this.interval = interval;
        SingleIntervalScale.__super__.constructor.call(this, ['interval']);
        this.min_interval = this.interval;
        this.max_interval = this.interval;
      }

      SingleIntervalScale.prototype.get_interval = function(data_low, data_high, n_desired_ticks) {
        return this.interval;
      };

      return SingleIntervalScale;

    })(AbstractScale);
    CompositeScale = (function(_super) {
      __extends(CompositeScale, _super);

      function CompositeScale(scales) {
        this.scales = scales;
        CompositeScale.__super__.constructor.call(this);
        this.min_intervals = _.invoke(this.scales, 'get_min_interval');
        this.max_intervals = _.invoke(this.scales, 'get_max_interval');
        this.min_interval = _.first(this.min_intervals);
        this.max_interval = _.last(this.max_intervals);
      }

      CompositeScale.prototype.get_best_scale = function(data_low, data_high, desired_n_ticks) {
        var best_scale, best_scale_ndx, data_range, errors, ideal_interval, intervals, scale_ndxs;
        data_range = data_high - data_low;
        ideal_interval = this.get_ideal_interval(data_low, data_high, desired_n_ticks);
        scale_ndxs = [_.sortedIndex(this.min_intervals, ideal_interval) - 1, _.sortedIndex(this.max_intervals, ideal_interval)];
        intervals = [this.min_intervals[scale_ndxs[0]], this.max_intervals[scale_ndxs[1]]];
        errors = intervals.map(function(interval) {
          return Math.abs(desired_n_ticks - (data_range / interval));
        });
        best_scale_ndx = scale_ndxs[argmin(errors)];
        best_scale = this.scales[best_scale_ndx];
        return best_scale;
      };

      CompositeScale.prototype.get_interval = function(data_low, data_high, desired_n_ticks) {
        var best_scale;
        best_scale = this.get_best_scale(data_low, data_high, desired_n_ticks);
        return best_scale.get_interval(data_low, data_high, desired_n_ticks);
      };

      CompositeScale.prototype.get_ticks_no_defaults = function(data_low, data_high, desired_n_ticks) {
        var best_scale;
        best_scale = this.get_best_scale(data_low, data_high, desired_n_ticks);
        return best_scale.get_ticks_no_defaults(data_low, data_high, desired_n_ticks);
      };

      return CompositeScale;

    })(AbstractScale);
    AdaptiveScale = (function(_super) {
      __extends(AdaptiveScale, _super);

      function AdaptiveScale(mantissas, base, min_interval, max_interval) {
        var prefix_mantissa, suffix_mantissa;
        this.mantissas = mantissas;
        this.base = base != null ? base : 10.0;
        this.min_interval = min_interval != null ? min_interval : 0.0;
        this.max_interval = max_interval != null ? max_interval : Infinity;
        AdaptiveScale.__super__.constructor.call(this, ['mantissas', 'base', 'min_magnitude', 'max_magnitude']);
        prefix_mantissa = _.last(this.mantissas) / this.base;
        suffix_mantissa = _.first(this.mantissas) * this.base;
        this.extended_mantissas = _.flatten([prefix_mantissa, this.mantissas, suffix_mantissa]);
        this.base_factor = this.min_interval === 0.0 ? 1.0 : this.min_interval;
      }

      AdaptiveScale.prototype.get_interval = function(data_low, data_high, desired_n_ticks) {
        var best_mantissa, candidate_mantissas, data_range, errors, ideal_interval, ideal_magnitude, ideal_mantissa, interval, interval_exponent;
        data_range = data_high - data_low;
        ideal_interval = this.get_ideal_interval(data_low, data_high, desired_n_ticks);
        interval_exponent = Math.floor(log(ideal_interval / this.base_factor, this.base));
        ideal_magnitude = Math.pow(this.base, interval_exponent) * this.base_factor;
        ideal_mantissa = ideal_interval / ideal_magnitude;
        candidate_mantissas = this.extended_mantissas;
        errors = candidate_mantissas.map(function(mantissa) {
          return Math.abs(desired_n_ticks - (data_range / (mantissa * ideal_magnitude)));
        });
        best_mantissa = candidate_mantissas[argmin(errors)];
        interval = best_mantissa * ideal_magnitude;
        return clamp(interval, this.min_interval, this.max_interval);
      };

      return AdaptiveScale;

    })(AbstractScale);
    MonthsScale = (function(_super) {
      __extends(MonthsScale, _super);

      function MonthsScale(months) {
        this.months = months;
        this.typical_interval = this.months.length > 1 ? (this.months[1] - this.months[0]) * ONE_MONTH : 12 * ONE_MONTH;
        MonthsScale.__super__.constructor.call(this, this.typical_interval);
        this.toString_properties = ['months'];
      }

      MonthsScale.prototype.get_ticks_no_defaults = function(data_low, data_high, desired_n_ticks) {
        var all_ticks, date, month_dates, months, months_of_year, ticks_in_range, year_dates;
        year_dates = date_range_by_year(data_low, data_high);
        months = this.months;
        months_of_year = function(year_date) {
          return months.map(function(month) {
            var month_date;
            month_date = copy_date(year_date);
            month_date.setUTCMonth(month);
            return month_date;
          });
        };
        month_dates = _.flatten((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = year_dates.length; _i < _len; _i++) {
            date = year_dates[_i];
            _results.push(months_of_year(date));
          }
          return _results;
        })());
        all_ticks = _.invoke(month_dates, 'getTime');
        ticks_in_range = _.filter(all_ticks, (function(tick) {
          return (data_low <= tick && tick <= data_high);
        }));
        return ticks_in_range;
      };

      return MonthsScale;

    })(SingleIntervalScale);
    DaysScale = (function(_super) {
      __extends(DaysScale, _super);

      function DaysScale(days) {
        this.days = days;
        this.typical_interval = this.days.length > 1 ? (this.days[1] - this.days[0]) * ONE_DAY : 31 * ONE_DAY;
        DaysScale.__super__.constructor.call(this, this.typical_interval);
        this.toString_properties = ['days'];
      }

      DaysScale.prototype.get_ticks_no_defaults = function(data_low, data_high, desired_n_ticks) {
        var all_ticks, date, day_dates, days, days_of_month, month_dates, ticks_in_range, typical_interval;
        month_dates = date_range_by_month(data_low, data_high);
        days = this.days;
        typical_interval = this.typical_interval;
        days_of_month = function(month_date) {
          var dates, day, day_date, future_date, _i, _len;
          dates = [];
          for (_i = 0, _len = days.length; _i < _len; _i++) {
            day = days[_i];
            day_date = copy_date(month_date);
            day_date.setUTCDate(day);
            future_date = new Date(day_date.getTime() + (typical_interval / 2));
            if (future_date.getUTCMonth() === month_date.getUTCMonth()) {
              dates.push(day_date);
            }
          }
          return dates;
        };
        day_dates = _.flatten((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = month_dates.length; _i < _len; _i++) {
            date = month_dates[_i];
            _results.push(days_of_month(date));
          }
          return _results;
        })());
        all_ticks = _.invoke(day_dates, 'getTime');
        ticks_in_range = _.filter(all_ticks, (function(tick) {
          return (data_low <= tick && tick <= data_high);
        }));
        return ticks_in_range;
      };

      return DaysScale;

    })(SingleIntervalScale);
    ONE_MILLI = 1.0;
    ONE_SECOND = 1000.0;
    ONE_MINUTE = 60.0 * ONE_SECOND;
    ONE_HOUR = 60 * ONE_MINUTE;
    ONE_DAY = 24 * ONE_HOUR;
    ONE_MONTH = 30 * ONE_DAY;
    ONE_YEAR = 365 * ONE_DAY;
    BasicScale = (function(_super) {
      __extends(BasicScale, _super);

      function BasicScale() {
        BasicScale.__super__.constructor.call(this, [1, 2, 5]);
      }

      return BasicScale;

    })(AdaptiveScale);
    DatetimeScale = (function(_super) {
      __extends(DatetimeScale, _super);

      function DatetimeScale() {
        DatetimeScale.__super__.constructor.call(this, [new AdaptiveScale([1, 2, 5], 10, 0, 500 * ONE_MILLI), new AdaptiveScale([1, 2, 5, 10, 15, 20, 30], 60, ONE_SECOND, 30 * ONE_MINUTE), new AdaptiveScale([1, 2, 4, 6, 8, 12], 24.0, ONE_HOUR, 12 * ONE_HOUR), new DaysScale(arange(1, 32)), new DaysScale(arange(1, 31, 3)), new DaysScale([1, 8, 15, 22]), new DaysScale([1, 15]), new MonthsScale(arange(0, 12)), new MonthsScale(arange(0, 12, 2)), new MonthsScale(arange(0, 12, 4)), new MonthsScale(arange(0, 12, 6)), new AdaptiveScale([1, 2, 5], 10, ONE_YEAR, Infinity)]);
      }

      return DatetimeScale;

    })(CompositeScale);
    BasicTickFormatter = (function() {
      function BasicTickFormatter(precision, use_scientific, power_limit_high, power_limit_low) {
        this.precision = precision != null ? precision : 'auto';
        this.use_scientific = use_scientific != null ? use_scientific : true;
        this.power_limit_high = power_limit_high != null ? power_limit_high : 5;
        this.power_limit_low = power_limit_low != null ? power_limit_low : -3;
        this.scientific_limit_low = Math.pow(10.0, power_limit_low);
        this.scientific_limit_high = Math.pow(10.0, power_limit_high);
        this.last_precision = 3;
      }

      BasicTickFormatter.prototype.format = function(ticks) {
        var i, is_ok, labels, need_sci, tick, tick_abs, x, zero_eps, _i, _j, _k, _l, _len, _m, _n, _ref, _ref1, _ref2, _ref3, _ref4;
        if (ticks.length === 0) {
          return [];
        }
        zero_eps = 0;
        if (ticks.length >= 2) {
          zero_eps = Math.abs(ticks[1] - ticks[0]) / 10000;
        }
        need_sci = false;
        if (this.use_scientific) {
          for (_i = 0, _len = ticks.length; _i < _len; _i++) {
            tick = ticks[_i];
            tick_abs = Math.abs(tick);
            if (tick_abs > zero_eps && (tick_abs >= this.scientific_limit_high || tick_abs <= this.scientific_limit_low)) {
              need_sci = true;
              break;
            }
          }
        }
        if (_.isNumber(this.precision)) {
          labels = new Array(ticks.length);
          if (need_sci) {
            for (i = _j = 0, _ref = ticks.length; 0 <= _ref ? _j < _ref : _j > _ref; i = 0 <= _ref ? ++_j : --_j) {
              labels[i] = ticks[i].toExponential(this.precision);
            }
          } else {
            for (i = _k = 0, _ref1 = ticks.length; 0 <= _ref1 ? _k < _ref1 : _k > _ref1; i = 0 <= _ref1 ? ++_k : --_k) {
              labels[i] = ticks[i].toPrecision(this.precision).replace(/(\.[0-9]*?)0+$/, "$1").replace(/\.$/, "");
            }
          }
          return labels;
        } else if (this.precision === 'auto') {
          labels = new Array(ticks.length);
          for (x = _l = _ref2 = this.last_precision; _ref2 <= 15 ? _l <= 15 : _l >= 15; x = _ref2 <= 15 ? ++_l : --_l) {
            is_ok = true;
            if (need_sci) {
              for (i = _m = 0, _ref3 = ticks.length; 0 <= _ref3 ? _m < _ref3 : _m > _ref3; i = 0 <= _ref3 ? ++_m : --_m) {
                labels[i] = ticks[i].toExponential(x);
                if (i > 0) {
                  if (labels[i] === labels[i - 1]) {
                    is_ok = false;
                    break;
                  }
                }
              }
              if (is_ok) {
                break;
              }
            } else {
              for (i = _n = 0, _ref4 = ticks.length; 0 <= _ref4 ? _n < _ref4 : _n > _ref4; i = 0 <= _ref4 ? ++_n : --_n) {
                labels[i] = ticks[i].toPrecision(x).replace(/(\.[0-9]*?)0+$/, "$1").replace(/\.$/, "");
                if (i > 0) {
                  if (labels[i] === labels[i - 1]) {
                    is_ok = false;
                    break;
                  }
                }
              }
              if (is_ok) {
                break;
              }
            }
            if (is_ok) {
              this.last_precision = x;
              return labels;
            }
          }
        }
        return labels;
      };

      return BasicTickFormatter;

    })();
    _us = function(t) {
      return sprintf("%3dus", Math.floor((t % 1) * 1000));
    };
    _ms_dot_us = function(t) {
      var ms, us;
      ms = Math.floor(((t / 1000) % 1) * 1000);
      us = Math.floor((t % 1) * 1000);
      return sprintf("%3d.%3dms", ms, us);
    };
    _two_digit_year = function(t) {
      var dt, year;
      dt = new Date(t);
      year = dt.getFullYear();
      if (dt.getMonth() >= 7) {
        year += 1;
      }
      return sprintf("'%02d", year % 100);
    };
    _four_digit_year = function(t) {
      var dt, year;
      dt = new Date(t);
      year = dt.getFullYear();
      if (dt.getMonth() >= 7) {
        year += 1;
      }
      return sprintf("%d", year);
    };
    _array = function(t) {
      return tz(t, "%Y %m %d %H %M %S").split(/\s+/).map(function(e) {
        return parseInt(e, 10);
      });
    };
    _strftime = function(t, format) {
      if (_.isFunction(format)) {
        return format(t);
      } else {
        return tz(t, format);
      }
    };
    DatetimeFormatter = (function() {
      DatetimeFormatter.prototype.format_order = ['microseconds', 'milliseconds', 'seconds', 'minsec', 'minutes', 'hourmin', 'hours', 'days', 'months', 'years'];

      DatetimeFormatter.prototype.strip_leading_zeros = true;

      function DatetimeFormatter() {
        var fmt, fmt_name, fmt_strings, size, sizes, tmptime, _i, _len;
        this._formats = {
          'microseconds': [_us, _ms_dot_us],
          'milliseconds': ['%3Nms', '%S.%3Ns'],
          'seconds': ['%Ss'],
          'minsec': [':%M:%S'],
          'minutes': [':%M', '%Mm'],
          'hourmin': ['%H:%M'],
          'hours': ['%Hh', '%H:%M'],
          'days': ['%m/%d', '%a%d'],
          'months': ['%m/%Y', '%b%y'],
          'years': ['%Y', _two_digit_year, _four_digit_year]
        };
        this.formats = {};
        for (fmt_name in this._formats) {
          fmt_strings = this._formats[fmt_name];
          sizes = [];
          tmptime = tz(new Date());
          for (_i = 0, _len = fmt_strings.length; _i < _len; _i++) {
            fmt = fmt_strings[_i];
            size = (_strftime(tmptime, fmt)).length;
            sizes.push(size);
          }
          this.formats[fmt_name] = [sizes, fmt_strings];
        }
        return;
      }

      DatetimeFormatter.prototype._get_resolution_str = function(resolution_secs, span_secs) {
        var adjusted_resolution_secs, str;
        adjusted_resolution_secs = resolution_secs * 1.1;
        if (adjusted_resolution_secs < 1e-3) {
          str = "microseconds";
        } else if (adjusted_resolution_secs < 1.0) {
          str = "milliseconds";
        } else if (adjusted_resolution_secs < 60) {
          if (span_secs >= 60) {
            str = "minsec";
          } else {
            str = "seconds";
          }
        } else if (adjusted_resolution_secs < 3600) {
          if (span_secs >= 3600) {
            str = "hourmin";
          } else {
            str = "minutes";
          }
        } else if (adjusted_resolution_secs < 24 * 3600) {
          str = "hours";
        } else if (adjusted_resolution_secs < 31 * 24 * 3600) {
          str = "days";
        } else if (adjusted_resolution_secs < 365 * 24 * 3600) {
          str = "months";
        } else {
          str = "years";
        }
        return str;
      };

      DatetimeFormatter.prototype.format = function(ticks, num_labels, char_width, fill_ratio, ticker) {
        var dt, error, fmt, format, formats, good_formats, hybrid_handled, i, labels, next_format, next_ndx, r, resol, resol_ndx, s, span, ss, t, time_tuple_ndx_for_resol, tm, widths, _i, _j, _k, _len, _len1, _ref, _ref1, _ref2;
        if (num_labels == null) {
          num_labels = null;
        }
        if (char_width == null) {
          char_width = null;
        }
        if (fill_ratio == null) {
          fill_ratio = 0.3;
        }
        if (ticker == null) {
          ticker = null;
        }
        if (ticks.length === 0) {
          return [];
        }
        span = Math.abs(ticks[ticks.length - 1] - ticks[0]) / 1000.0;
        if (ticker) {
          r = ticker.resolution;
        } else {
          r = span / (ticks.length - 1);
        }
        resol = this._get_resolution_str(r, span);
        _ref = this.formats[resol], widths = _ref[0], formats = _ref[1];
        format = formats[0];
        if (char_width) {
          good_formats = [];
          for (i = _i = 0, _ref1 = widths.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
            if (widths[i] * ticks.length < fill_ratio * char_width) {
              good_formats.push(this.formats[i]);
            }
          }
          if (good_formats.length > 0) {
            format = good_formats[ticks.length - 1];
          }
        }
        labels = [];
        resol_ndx = this.format_order.indexOf(resol);
        time_tuple_ndx_for_resol = {};
        _ref2 = this.format_order;
        for (_j = 0, _len = _ref2.length; _j < _len; _j++) {
          fmt = _ref2[_j];
          time_tuple_ndx_for_resol[fmt] = 0;
        }
        time_tuple_ndx_for_resol["seconds"] = 5;
        time_tuple_ndx_for_resol["minsec"] = 4;
        time_tuple_ndx_for_resol["minutes"] = 4;
        time_tuple_ndx_for_resol["hourmin"] = 3;
        time_tuple_ndx_for_resol["hours"] = 3;
        for (_k = 0, _len1 = ticks.length; _k < _len1; _k++) {
          t = ticks[_k];
          try {
            dt = Date(t);
            tm = _array(t);
            s = _strftime(t, format);
          } catch (_error) {
            error = _error;
            console.log(error);
            console.log("Unable to convert tick for timestamp " + t);
            labels.push("ERR");
            continue;
          }
          hybrid_handled = false;
          next_ndx = resol_ndx;
          while (tm[time_tuple_ndx_for_resol[this.format_order[next_ndx]]] === 0) {
            next_ndx += 1;
            if (next_ndx === this.format_order.length) {
              break;
            }
            if ((resol === "minsec" || resol === "hourmin") && !hybrid_handled) {
              if ((resol === "minsec" && tm[4] === 0 && tm[5] !== 0) || (resol === "hourmin" && tm[3] === 0 && tm[4] !== 0)) {
                next_format = this.formats[this.format_order[resol_ndx - 1]][1][0];
                s = _strftime(t, next_format);
                break;
              } else {
                hybrid_handled = true;
              }
            }
            next_format = this.formats[this.format_order[next_ndx]][1][0];
            s = _strftime(t, next_format);
          }
          if (this.strip_leading_zeros) {
            ss = s.replace(/^0+/g, "");
            if (ss !== s && (ss === '' || !isFinite(ss[0]))) {
              ss = '0' + ss;
            }
            labels.push(ss);
          } else {
            labels.push(s);
          }
        }
        return labels;
      };

      return DatetimeFormatter;

    })();
    return {
      "BasicScale": BasicScale,
      "DatetimeScale": DatetimeScale,
      "BasicTickFormatter": BasicTickFormatter,
      "DatetimeFormatter": DatetimeFormatter
    };
  });

}).call(this);

/*
//@ sourceMappingURL=ticking.js.map
*/