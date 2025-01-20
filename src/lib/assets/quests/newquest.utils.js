#!/usr/bin/env node
import _ from "lodash";

export const log = {
  main: function (color, prefix, args) {
    _.each(args, function (arg, i) {
      if (i == 0) console.log(color, prefix + arg)
      else console.log(color, arg);
    });
  },
  error:   function () { log.main("\x1b[31m%s\x1b[0m", "✖ ", arguments); },
  warning: function () { log.main("\x1b[33m%s\x1b[0m", "⚠ ", arguments); },
  info:    function () { log.main("\x1b[35m%s\x1b[0m", "🛈 ", arguments); },
  success: function () { log.main("\x1b[92m%s\x1b[0m", "✔ ", arguments); },
}

export const abort = function () {
  log.error.apply(this, arguments);
  process.exit();
};

export const json_stringify_pretty = function (object, morePretty) {
  // var string = JSON.stringify(object, null, 2); // 2 spaces instead of tab
  var string = JSON.stringify(object, null, "\t");
  // do not exten arrays, otherwise it takes too much space
  if (morePretty) _.each(string.match(/\[[^\]\[\{\}]*\]/g), function (subString, i) {
    // remove spaces and line jumps
    var prettyFiedSubString = JSON.stringify(JSON.parse(subString));
    string = string.replace(subString, prettyFiedSubString);
  });
  return string;
};
