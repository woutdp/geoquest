import * as d3 from 'd3'
import {geoMiller, geoPatterson, geoRobinson} from 'd3-geo-projection'
import {derived, readable, writable} from 'svelte/store'
import * as topojsonClient from 'topojson-client'

import {browser} from '$app/environment'
import {pushNotification} from '$lib/utils'

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
export const maps = [
    {topojson: import('$lib/assets/maps/topojson/world.json'), name: 'World', data: {countries: import('$lib/assets/data/countries.json')}},
    {topojson: import('$lib/assets/maps/topojson/us-states.json'), name: 'US States', data: {states: import('$lib/assets/data/us-states.json')}}
]
export const notificationsPermission = readable(browser ? Notification.permission : 'denied', function start(set) {
    navigator.permissions.query({name: 'notifications'}).then(function (permission) {
        if (permission.state !== 'granted') enableDailyQuestNotification.update(() => false)
        permission.onchange = function () {
            if (permission.state !== 'granted') enableDailyQuestNotification.update(() => false)
            set(permission.state)
        }
    })
})

// Map
export const loadedMap = writable()
export const topojson = derived(loadedMap, $loadedMap => $loadedMap?.topojson)
export const geojson = derived(topojson, $topojson => ($topojson ? topojsonClient.feature($topojson, Object.keys($topojson?.objects)[0]) : undefined))
export const geometries = derived(topojson, $topojson => ($topojson ? Object.values($topojson?.objects)[0].geometries : undefined))
export const projection = writable(projections[0].func)

// Settings
export const soundEffects = localStorageWritable('settingsSoundEffects', true)
export const showFlagOnly = localStorageWritable('settingsShowFlagOnly', false)
export const enableDailyQuestNotification = localStorageWritable('settingsEnableDailyQuestNotification', false)
subscribeIgnoreFirst(enableDailyQuestNotification, value => {
    if (!browser) return
    if (value) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                window.deferredInstallEvent.prompt()
                window.deferredInstallEvent.userChoice.then((choice) =>{
                    if (choice.outcome === "accepted") pushNotification('Succ')
                    else {
                        pushNotification('Install GeoQuest for notifications to work')
                        enableDailyQuestNotification.update(() => false)
                    }
                    window.deferredInstallEvent = undefined
                })
            } 
            if (permission === 'denied') {
                console.warn('Denied notifications')
                enableDailyQuestNotification.update(() => false)
            }
        })
    } else {
        pushNotification('Disabled Daily Quest Reminder')
    }
})

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
function localStorageWritable(key: string, initial: any) {
    let savedValue

    try {
        savedValue = browser ? JSON.parse(window.localStorage.getItem(key)) ?? initial : initial
    } catch (err) {
        console.error(err)
    }

    const w = writable(savedValue)
    w.subscribe(value => {
        if (browser) window.localStorage.setItem(key, JSON.stringify(value))
    })
    return w
}

function subscribeIgnoreFirst(store, fn) {
    let firedFirst = false
    return store.subscribe(state => {
        if (!firedFirst) firedFirst = true
        else fn(state)
    })
}
