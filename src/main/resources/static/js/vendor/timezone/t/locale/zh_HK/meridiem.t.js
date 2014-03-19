#!/usr/bin/env node
require("../../proof")(4, function (tz, equal) {
  var tz = tz(require("timezone/zh_HK"));
  // zh_HK meridiem upper case
  equal(tz("2000-09-03 08:05:04", "%P", "zh_HK"), "上午", "ante meridiem lower case");
  equal(tz("2000-09-03 23:05:04", "%P", "zh_HK"), "下午", "post meridiem lower case");

  // zh_HK meridiem lower case
  equal(tz("2000-09-03 08:05:04", "%p", "zh_HK"), "上午", "ante meridiem upper case");
  equal(tz("2000-09-03 23:05:04", "%p", "zh_HK"), "下午", "post meridiem upper case");
});
