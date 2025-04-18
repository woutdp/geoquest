#!/usr/bin/env node
import _ from "lodash";
import * as fs from "fs";

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

export const json_stringify_pretty = function (object, prettier) {
    var string = JSON.stringify(object, null, 4); // 4 spaces indentation
    // contract arrays containing no children array or objects, which would otherwise take much space
    if (prettier) string = string.replace(/\[[^\]\[\{\}]*\]/g, function (match, offset, fullString) {
        // wrapped in try/catch in case it was matching something inside a string, so it does not fail
        try { return JSON.stringify(JSON.parse(match)); }
        catch (err) { return match; };
    });
    return string;
};

// get list of quests
export const listQuests = function () {
    try { return JSON.parse(fs.readFileSync(`./index.json`, { encoding: "utf8" })); }
    catch (err) { abort(`Failed to parse quests "index.json" file.`, err) };
};

// import quest settings
export const importQuestSettings = function (questId) {
    try { return JSON.parse(fs.readFileSync(`./${questId}/index.json`, { encoding: "utf8" })); }
    catch (err) { abort(`Failed to parse quest "${questId}/index.json" file, did you create it and filled it with quest settings?`, err) };
};
