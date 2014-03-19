#!/usr/bin/env node
require("../../proof")(5, function (tz, equal) {
  var tz = tz(require("timezone/cs_CZ"));
  // cs_CZ date representation
  equal(tz("2000-09-03", "%x", "cs_CZ"), "3.9.2000", "date format");

  // cs_CZ time representation
  equal(tz("2000-09-03 08:05:04", "%X", "cs_CZ"), "08:05:04", "long time format morning");
  equal(tz("2000-09-03 23:05:04", "%X", "cs_CZ"), "23:05:04", "long time format evening");

  // cs_CZ date time representation
  equal(tz("2000-09-03 08:05:04", "%c", "cs_CZ"), "Ne 3. září 2000, 08:05:04 UTC", "long date format morning");
  equal(tz("2000-09-03 23:05:04", "%c", "cs_CZ"), "Ne 3. září 2000, 23:05:04 UTC", "long date format evening");
});
