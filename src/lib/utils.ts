import * as turf from '@turf/turf'
import bboxCalc from 'geojson-bbox'
import _ from 'lodash'
import {get} from 'svelte/store'
import * as topojsonClient from 'topojson-client'

import achievements from '$lib/assets/data/achievements.json'
import countries from '$lib/assets/data/countries.json'
import {notifications, save} from '$lib/store'
import {topojson} from '$lib/store'

export const CORRECT = 'correct'
export const WRONG = 'wrong'
export const ALREADY_GUESSED = 'already_guessed'
export const COUNTRY_COLORS = ['fill-blue', 'fill-yellow', 'fill-green', 'fill-red']

export function preprocessTopojson(json) {
    const geometriesByName = _.keyBy(json.objects['countries'].geometries, 'properties.name')
    const mergeGroups = _(countries)
        .pickBy(value => _.has(value, 'belongsTo'))
        .map((value, key) => {
            value.name = key
            return value
        })
        .groupBy('belongsTo')
        .value()

    for (const [key, value] of Object.entries(mergeGroups)) {
        const names = _.map(value, v => v.name)
        const toMerge = _.filter(geometriesByName, (v, key) => names.includes(key))
        const geometries = [...toMerge, geometriesByName[key]]
        const merged = topojsonClient.mergeArcs(json, geometries)

        names.forEach(element => {
            delete geometriesByName[element]
        })

        merged.properties = geometriesByName[key].properties
        geometriesByName[key] = merged
    }

    json.objects.countries.geometries = Object.values(geometriesByName)
    json.objects.countries.geometries = _.filter(json.objects.countries.geometries, geometry => {
        // Filter out some countries, not the best way to handle but fine for now
        if (geometry.properties.name === 'Antarctica') return false
        if (geometry.properties.name === 'Spratly Islands') return false
        if (geometry.properties.name === 'Scarborough Shoal') return false
        return true
    })

    const neighbors = topojsonClient.neighbors(json.objects.countries.geometries)
    const geojson = topojsonClient.feature(json, json.objects.countries)

    json.objects.countries.geometries = _.map(json.objects.countries.geometries, (geometry, i) => {
        const feature = geojson.features[i]
        const countryData = countries[geometry.properties.name]
        geometry.properties = {...geometry.properties, ...countryData}
        geometry.properties.neighbors = _.map(neighbors[i], n => geojson.features[n].properties.name)
        geometry.properties.isIsland = geometry.properties.neighbors.length === 0
        geometry.properties.squareKm = countryData?.squareKm || Math.floor(turf.area(feature) / 1000000)
        if (countryData?.center) geometry.properties.center = {type: 'Feature', geometry: {type: 'Point', coordinates: countryData?.center}, properties: {}}
        else geometry.properties.center = turf.center(feature)

        const bbox = bboxCalc(feature)
        const xs = Math.abs(bbox[0] - bbox[2])
        const ys = Math.abs(bbox[1] - bbox[3])
        if (countryData?.helper || (!geometry.properties.isIsland && geometry.properties.squareKm < 6000 && xs < 0.7 && ys < 0.7)) geometry.properties.helper = true
        else geometry.properties.helper = false

        return geometry
    })

    return json
}

export function getCountryColor(feature) {
    return COUNTRY_COLORS[feature?.properties?.color] || 'fill-[#F0F]'
}

export function antimeridian(featureCollection) {
    featureCollection.features = _.map(featureCollection.features, feature => {
        const c = feature.geometry.coordinates
        if (c[0] < 0) feature.geometry.coordinates = [c[0] + 360, c[1]]
        return feature
    })
    return featureCollection
}

export function buffer(feature) {
    if (feature === null) return ''
    return turf.concave(antimeridian(turf.explode(turf.buffer(feature, 40))), {units: 'kilometers', maxEdge: 300})
}

export function dictToArray(d) {
    return _.map(d, (v, k) => {
        return {...v, name: k}
    })
}

export function getTags() {
    return _(Object.values(countries))
        .map(country => country.tags)
        .flatten()
        .compact()
        .uniq()
        .value()
}

export function getCountriesFromTags(tags) {
    return _(dictToArray(countries))
        .filter(country => _.intersection(country.tags, tags).length > 0)
        .map(country => country.name)
        .compact()
        .uniq()
        .intersection(getActiveCountries())
        .value()
}

export function getActiveCountries() {
    return _(get(topojson).objects.countries.geometries)
        .map(country => country.properties.name)
        .value()
}

export function getGeojsonByName(geojson, name) {
    return _(geojson.features).find(['properties.name', name])
}

export function achieveAchievement(slug) {
    const achievement = _(achievements).find({slug})
    const saveFile = get(save)

    if (!saveFile.achievements.includes(slug)) {
        saveFile.achievements = _([...saveFile.achievements, achievement.slug])
            .uniq()
            .value()
        save.set(saveFile)
        const notification = {type: 'achievement', title: achievement.name, description: achievement.description}
        notifications.set([...get(notifications), notification])
        window.setTimeout(
            () =>
                notifications.set(
                    _(get(notifications))
                        .filter(n => n !== notification)
                        .value()
                ),
            4000
        )
    }
}

export function processAchievements(countries) {
    const achievementsWithTags = _(achievements)
        .filter(a => a?.extra?.tags)
        .value()

    for (const achievement of achievementsWithTags) {
        if (_.difference(getCountriesFromTags(achievement.extra.tags), countries).length === 0) achieveAchievement(achievement.slug)
    }
}
