#!/usr/bin/env node
import * as fs from "fs";
import _ from "lodash";

import { abort, json_stringify_pretty, log, importQuestSettings } from "./newquest.utils.js";

//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
//                                                  GET ALL QUEST ELEMENTS
//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/

// figure out quest to autobuild
const questId = process.argv[2];
if (!questId) abort("Please pass new quest id as first argument!");

// check that there is a map file for the asked quest, and import it
let mapFile;
try { mapFile = JSON.parse(fs.readFileSync(`./${questId}/map.json`, { encoding: "utf8" })); }
catch (err) { abort(`Missing map file for quest "${questId}", or map file is not an appropriate JSON file.`, err) };

// get quest object from file
let questObject = importQuestSettings(questId);

// check if there is "objectsKey" and is valid, if not suggest possible values for it
if (!questObject.objectsKey || !mapFile.objects[questObject.objectsKey] || !mapFile.objects[questObject.objectsKey].geometries) abort(`Missing or invalid "objectKey" in "quests/index.json" "${questId}" quest object! Suggested "objectKey" that can work with your map file:`, _.keys(mapFile.objects));

//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
//                                                  GENERATE QUEST FILES
//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/

let questFilesPaths = {
    elements: `./${questId}/elements.json`,
    dirTranslation: `../../translations/en/quests/${questId}/`,
    elementsTranslation: `../../translations/en/quests/${questId}/elements.json`,
    groupsTranslation: `../../translations/en/quests/${questId}/groups.json`,
    questsIndexTranslation: "../../translations/en/quests/index.json",
};

// autogenerate elements file
if (!questObject.defaultTags) console.warn(`[WARNING] Missing default tags for your new quest, please add them into "assets/quests/index.json", they will be added to every element.`);
let elements = {};
let colorIndex = 0;
_.each(mapFile.objects[questObject.objectsKey].geometries, function (geometryObject, geometryIndex) {
    if (!geometryObject.properties) return log.error(`Geometry with index "${geometryIndex}" is missing properties.`)
    else if (!geometryObject.properties.name) return log.error(`Geometry with index "${geometryIndex}" is missing name in properties.`, geometryObject.properties);

    // if name is already taken, alert it at least so it's known
    if (elements[geometryObject.properties.name]) log.warning(`There is already another geometry with the name "${geometryObject.properties.name}", this one will be replacing it.`, "# Current: ", json_stringify_pretty(geometryObject.properties), `# Will replace: `, geometryObject.properties.name +": "+ json_stringify_pretty(elements[geometryObject.properties.name]), "");

    if (geometryObject.properties.type !== "basemap") {
        let elemObj = elements[geometryObject.properties.name] = _.clone(geometryObject.properties);
        delete elemObj.name;
        delete elemObj.type;
        if (_.isUndefined(elemObj.color)) elemObj.color = colorIndex;
        if (_.isUndefined(elemObj.tags)) elemObj.tags = questObject.defaultTags;
    }
    else elements[geometryObject.properties.name] = { tags: [ "BASEMAP" ] };
    colorIndex = colorIndex < 3 ? colorIndex + 1 : 0;
});
fs.writeFileSync(questFilesPaths.elements, json_stringify_pretty(elements, true), { encoding: "utf8" });

// create quest directory for english translations
if (!fs.existsSync(questFilesPaths.dirTranslation)){ fs.mkdirSync(questFilesPaths.dirTranslation); }

// autogenerate english elements translation file
let elementsEnglishTranslation = {};
_.each(elements, function (elem, elemName) { elementsEnglishTranslation[elemName] = elemName; });
fs.writeFileSync(questFilesPaths.elementsTranslation, json_stringify_pretty(elementsEnglishTranslation, true), { encoding: "utf8" });

// check if tags have been set
if (!questObject.tags) console.warn(`[WARNING] Skipped generating groups translation file. Missing tags for your new quest, please add them into "assets/quests/index.json".`);
else {
    // autogenerate english groups translation file
    let groupsEnglishTranslationFile = {};
    _.each(questObject.tags, function (groupName) { groupsEnglishTranslationFile[groupName] = groupName; });
    fs.writeFileSync(questFilesPaths.groupsTranslation, json_stringify_pretty(groupsEnglishTranslationFile, true), { encoding: "utf8" });
};

// add name of quest in english translation list of quests
let questsListEnglishTranslation;
try { questsListEnglishTranslation = JSON.parse(fs.readFileSync(questFilesPaths.questsIndexTranslation, { encoding: "utf8" })); }
catch (err) { abort(`Failed to parse "${questFilesPaths.questsIndexTranslation}" file!`, err) };
questsListEnglishTranslation[questId] = questObject.name;
fs.writeFileSync(questFilesPaths.questsIndexTranslation, json_stringify_pretty(questsListEnglishTranslation, true), { encoding: "utf8" });

//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
//                                                  DONE
//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/

log.success(`Created "${questId}"
    modified          "${questFilesPaths.questsIndexTranslation}"
    created/modified  "`+ _.values(questFilesPaths).join(`"\n    created/modified  "`)
);
log.info(`If you didn't do so already, you should add the translations of the achievements you've set for this quest in "translations/{lang}/{quest}/achievements.json".`)

//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
