import * as d3 from 'd3'
import {geoMiller, geoPatterson, geoRobinson} from 'd3-geo-projection'
import _ from 'lodash'
import {derived, readable, writable} from 'svelte/store'
import * as topojsonClient from 'topojson-client'

import {browser} from '$app/environment'

// Constants
const dateZero = new Date('February 19, 2022 03:00:00')
const oneDay = 24 * 3600 * 1000
export const countryColors = writable(['fill-blue', 'fill-yellow', 'fill-green', 'fill-red'])
export const projections = [
    {func: geoPatterson(), name: 'Patterson'},
    {func: geoRobinson(), name: 'Robinson'},
    {func: geoMiller(), name: 'Miller'},
    {func: d3.geoMercator(), name: 'Mercator'},
    {func: d3.geoOrthographic(), name: 'Globe'}
]

// Import all "index.json" in "quests/<quest-id>" directories
import questsList from '$lib/assets/quests/index.json'
// import.meta.glob('$lib/assets/quests/*/index.json'); // would also work without needing the "quests/index.json" file, but without good ordering
const questsJsonFiles = _.map(questsList, questId => import(`$lib/assets/quests/${questId}/index.json`));
async function loadJsonFiles (jsonFiles) {
    return await Promise.all(_.map(jsonFiles, async file => {
        // import json file
        const module = await file;
        // export json content
        return module.default;
    }));
}

// make complete list of achievements
export const achievements = await buildAchievementsList();
async function buildAchievementsList () {
    return _.reduce(questsList, async (iteratee, questId) => {
        let achievementsList = await iteratee;
        let questAchievements = await import(`$lib/assets/quests/${questId}/achievements.json`);
        _.each(questAchievements.default, function (achievementObject) {
            achievementObject.quest = questId;
            achievementsList.push(achievementObject);
        });
        return achievementsList;
    }, []);
};

// Make "maps" variable from all quests json files
export const maps = await loadJsonFiles(questsJsonFiles) as const;

// Map
export const loadedMap = writable()
export const topojson = derived(loadedMap, $loadedMap => $loadedMap?.topojson)
export const geojson = derived(topojson, $topojson => ($topojson ? topojsonClient.feature($topojson, Object.keys($topojson?.objects)[0]) : undefined))
export const geometries = derived(topojson, $topojson => ($topojson ? Object.values($topojson?.objects)[0].geometries : undefined))
export const projection = writable(projections[0].func)

// Choose map and build import it's contents
export const chosenMap = _.find(maps, { id: getParam('m') }) || _.find(maps, { id: "world-countries", });
chosenMap.topojson = import(`$lib/assets/quests/${chosenMap.id}/map.json`)
chosenMap.data = {};
chosenMap.data[chosenMap.objectsKey] = import(`$lib/assets/quests/${chosenMap.id}/elements.json`)

// Settings
export const soundEffects = localStorageWritable('settingsSoundEffects', true)
export const showFlagOnly = localStorageWritable('settingsShowFlagOnly', false)
export const showTimer = localStorageWritable('settingsShowTimer', false)
export const greyOutFoundFeatures = localStorageWritable('settingsGreyOutFoundFeatures', true)

// Game settings
export const noPanNoZoom = localStorageWritable('settingsNoPanNoZom', false)

// Game
export const mousePos = writable({x: 0, y: 0})
export const clientX = writable(0)
export const clientY = writable(0)
export const debug = writable()
export const notifications = writable([])
export const time = readable(new Date(), function start(set) {
    setInterval(() => set(new Date()), 1000)
})
export const day = derived(time, $time => Math.floor(($time.getTime() - dateZero.getTime()) / oneDay))
export const timeLeft = derived(time, $time => {
    const left = Math.abs(Math.floor(((($time.getTime() - dateZero.getTime()) % oneDay) - oneDay) / 1000))
    const hours = Math.floor(left / 3600)
        .toString()
        .padStart(2, '0')
    const minutes = Math.floor((left % 3600) / 60)
        .toString()
        .padStart(2, '0')
    const seconds = Math.floor(left % 60)
        .toString()
        .padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
})
export const showDebug = writable(false)

// Save files
export const initialSave = {achievements: [], dailyQuestProgress: {}, localLeaderboard: {}}
export const save = localStorageWritable('save', initialSave, initialSave)

// Utils
function localStorageWritable(key: string, initial: unknown, defaultValue?: object) {
    let savedValue

    try {
        const parsedLocalStorageItem = JSON.parse(window.localStorage.getItem(key) || 'null')
        const parsedItemWithDefault = defaultValue ? {...defaultValue, ...parsedLocalStorageItem} : parsedLocalStorageItem
        savedValue = browser ? parsedItemWithDefault ?? initial : initial
    } catch (err) {
        console.error(err)
    }

    const w = writable(savedValue)
    w.subscribe(value => {
        if (browser) window.localStorage.setItem(key, JSON.stringify(value))
    })
    return w
}

function getParam(askedParam: string) {
    try {
        const urlParams = new URLSearchParams(window.location.search)
        return urlParams.get(askedParam)
    } catch (err) {
        console.error(err)
    }
}
