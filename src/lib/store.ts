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

// Get list of quests, and make list of maps from it
import quests from "$lib/assets/quests/index.json";
export const maps = _.map(quests, function (questObject) {
  let elements = {};
  elements[questObject.objectsKey] = import(`$lib/assets/quests/${questObject.id}/elements.json`);
  return Object.assign(questObject, {
    topojson: import(`$lib/assets/quests/${questObject.id}/map.json`),
    data: elements,
  });
}) as const

// Map
export const loadedMap = writable()
export const topojson = derived(loadedMap, $loadedMap => $loadedMap?.topojson)
export const geojson = derived(topojson, $topojson => ($topojson ? topojsonClient.feature($topojson, Object.keys($topojson?.objects)[0]) : undefined))
export const geometries = derived(topojson, $topojson => ($topojson ? Object.values($topojson?.objects)[0].geometries : undefined))
export const projection = writable(projections[0].func)

// Map choice
export const chosenMap = _.find(maps, { id: getParam("m") }) || maps[0];

// Settings
export const soundEffects = localStorageWritable('settingsSoundEffects', true)
export const showFlagOnly = localStorageWritable('settingsShowFlagOnly', false)

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
export const initialSave = {achievements: [], dailyQuestProgress: {}}
export const save = localStorageWritable('save', initialSave)

// Utils
function localStorageWritable(key: string, initial: unknown) {
    let savedValue

    try {
        savedValue = browser ? JSON.parse(window.localStorage.getItem(key) || 'null') ?? initial : initial
    } catch (err) {
        console.error(err)
    }

    const w = writable(savedValue)
    w.subscribe(value => {
        if (browser) window.localStorage.setItem(key, JSON.stringify(value))
    })
    return w
}

function getParam (askedParam: string) {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(askedParam);
  }
  catch (err) {
    console.error(err)
  };
}
